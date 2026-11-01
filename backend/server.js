import dotenv from "dotenv";
import express from "express";
import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { searchEraktkosh, filterAndRank, resolveState } from "./eraktkosh.js";

const here = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(here, ".env") });
const app = express();
app.use(express.json({ limit: "128kb" }));

const groups = new Set(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);
const jobs = new Map();

/* ── SSE helpers ──────────────────────────────────────────────── */

function send(res, type, data) {
  res.write(`event: ${type}\ndata: ${JSON.stringify(data)}\n\n`);
}
function emit(job, type, data = {}) {
  if (job.done) return;
  const event = { type, jobId: job.id, at: new Date().toISOString(), ...data };
  job.events.push(event);
  for (const client of job.clients) send(client, type, event);
}
function subscribe(req, res, job) {
  res.status(200).set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders?.();
  for (const event of job.events) send(res, event.type, event);
  if (job.done) return res.end();
  job.clients.add(res);
  const heartbeat = setInterval(() => res.write(": keep-alive\n\n"), 15000);
  req.on("close", () => {
    clearInterval(heartbeat);
    job.clients.delete(res);
  });
}

/* ── API state ─────────────────────────────────────────────── */

app.get("/api/state", (_req, res) => {
  res.json({ configured: true }); // Always ready — no TinyFish key needed
});

/* ── Search endpoint ───────────────────────────────────────── */

app.post("/api/search", (req, res) => {
  const bloodGroup = String(req.body?.bloodGroup ?? "")
    .toUpperCase()
    .replace("−", "-");
  const component = String(req.body?.component ?? "Whole Blood").trim();
  const units = Number(req.body?.units);
  const location = String(req.body?.location ?? "").trim();
  const radiusKm = Number(req.body?.radiusKm ?? 25);
  const urgency = String(req.body?.urgency ?? "immediate");

  if (
    !groups.has(bloodGroup) ||
    !component ||
    component.length > 80 ||
    !Number.isInteger(units) ||
    units < 1 ||
    units > 20 ||
    !location ||
    location.length > 120 ||
    !Number.isFinite(radiusKm) ||
    radiusKm < 1 ||
    radiusKm > 100 ||
    !["immediate", "today", "planning"].includes(urgency)
  ) {
    return res.status(400).json({
      error: "Enter a blood group, component, 1–20 units, location, valid urgency and a radius from 1–100 km.",
    });
  }

  // Verify we can resolve the location to a state
  const stateInfo = resolveState(location);
  if (!stateInfo) {
    return res.status(400).json({
      error: `Could not determine state for "${location}". Try including the state name (e.g. "Bengaluru, Karnataka").`,
    });
  }

  const query = { bloodGroup, component, units, location, radiusKm, urgency };
  const job = {
    id: randomUUID(),
    events: [],
    clients: new Set(),
    done: false,
    listings: [],
    startTime: Date.now(),
  };
  jobs.set(job.id, job);
  res.status(202).json({ jobId: job.id });

  emit(job, "search_started", { total: 1, query, source: "eRaktKosh" });

  // Run the search
  void (async () => {
    try {
      emit(job, "source_status", {
        sourceId: "eraktkosh",
        sourceName: "eRaktKosh · National Blood Stock",
        status: "searching",
      });

      const listings = await searchEraktkosh({
        bloodGroup,
        component,
        location,
        emit: (e) => {
          if (e.type === "progress") {
            emit(job, "progress", {
              sourceId: "eraktkosh",
              sourceName: "eRaktKosh · National Blood Stock",
              text: e.text,
            });
          }
        },
      });

      const ranked = filterAndRank(listings, { location, units, bloodGroup });

      // Assign IDs and send listings to client
      for (const listing of ranked) {
        const fullListing = {
          id: randomUUID(),
          sourceId: "eraktkosh",
          sourceName: listing.sourceName,
          facilityName: listing.facilityName,
          bloodGroup: listing.bloodGroup,
          component: listing.component,
          unitsAvailable: listing.unitsAvailable,
          requiredUnits: units,
          city: listing.city,
          district: listing.district,
          address: listing.address,
          distanceKm: null,
          phone: listing.phone,
          email: listing.email,
          bankType: listing.bankType,
          lastUpdatedText: listing.lastUpdatedText,
          updatedAt: listing.lastUpdated,
          observedAt: listing.observedAt,
          freshness: listing.freshness,
          status: listing.available ? "listed" : "not_available",
          sourceUrl: listing.sourceUrl,
          notes: listing.available
            ? `${listing.unitsAvailable} unit(s) of ${listing.bloodGroup} reported available. Call to confirm.`
            : "",
        };
        job.listings.push(fullListing);
        if (listing.available) {
          emit(job, "listing", { listing: fullListing });
        }
      }

      const availableCount = job.listings.filter((l) => l.status === "listed").length;
      const elapsed = ((Date.now() - job.startTime) / 1000).toFixed(1);

      emit(job, "source_status", {
        sourceId: "eraktkosh",
        sourceName: "eRaktKosh · National Blood Stock",
        status: availableCount > 0 ? "complete" : "no_results",
        count: availableCount,
        totalScanned: listings.length,
      });

      // Send final results — only available listings
      const availableListings = job.listings.filter((l) => l.status === "listed");
      emit(job, "search_complete", {
        query,
        listings: availableListings,
        total: availableCount,
        totalScanned: listings.length,
        sourcesSearched: 1,
        elapsed: `${elapsed}s`,
      });
    } catch (error) {
      emit(job, "source_status", {
        sourceId: "eraktkosh",
        sourceName: "eRaktKosh · National Blood Stock",
        status: "failed",
        message: String(error?.message ?? error),
      });
      emit(job, "search_complete", {
        query,
        listings: [],
        total: 0,
        totalScanned: 0,
        sourcesSearched: 1,
      });
    } finally {
      job.done = true;
      for (const client of job.clients) client.end();
      job.clients.clear();
    }
  })();
});

app.get("/api/search/:jobId", (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: "Search not found." });
  subscribe(req, res, job);
});

/* ── Frontend static ───────────────────────────────────────── */

const frontendDir = resolve(here, "../frontend");
if (existsSync(frontendDir)) app.use(express.static(frontendDir));

const port = Number(process.env.PORT) || 3000;
if (process.env.NODE_ENV !== "test")
  app.listen(port, () =>
    console.log(`PennyWise (BloodLink) listening on http://localhost:${port}`)
  );

export { app, jobs };
