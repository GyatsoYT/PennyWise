const $ = (id) => document.getElementById(id);
const state = { listings: [], eventSource: null, searching: false };

async function api(url, options = {}) {
  const response = await fetch(url, { headers: { "Content-Type": "application/json", ...(options.headers || {}) }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 3000);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function freshnessLabel(listing) {
  if (listing.freshness === "live") return "🟢 Live stock";
  if (listing.freshness === "recent") return `✅ Updated ${listing.lastUpdatedText || "within 24h"}`;
  if (listing.freshness === "aging") return `⚠️ Updated ${listing.lastUpdatedText || "within 3 days"}`;
  if (listing.freshness === "stale") return `⏰ Possibly outdated · ${listing.lastUpdatedText || "over 3 days ago"}`;
  return "❓ Update time unknown";
}

function freshnessClass(listing) {
  if (listing.freshness === "live" || listing.freshness === "recent") return "badge-listed";
  if (listing.freshness === "aging") return "badge-confirm";
  return "badge-stale";
}

function renderResults() {
  const list = $("results-list");
  if (!state.listings.length) {
    list.innerHTML = "";
    $("results-caveat").hidden = true;
    return;
  }
  $("empty-state").hidden = true;
  $("results-caveat").hidden = false;
  $("result-count").textContent = `${state.listings.length} ${state.listings.length === 1 ? "listing" : "listings"} with stock`;

  list.innerHTML = state.listings.map((r) => {
    const badge = freshnessClass(r);
    const freshLabel = freshnessLabel(r);
    const units = r.unitsAvailable == null ? "Not listed" : `${r.unitsAvailable} ${r.unitsAvailable === 1 ? "unit" : "units"}`;
    const address = [r.address, r.city, r.district].filter(Boolean).join(", ");
    const phoneClean = r.phone ? r.phone.replace(/[^\d+]/g, "") : "";
    const phoneAction = r.phone
      ? `<a class="button button-primary call-btn" href="tel:${encodeURIComponent(phoneClean)}">📞 Call now</a>`
      : `<a class="button button-light" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.facilityName} ${address}`)}" target="_blank" rel="noopener">📍 Find directions</a>`;
    const emailAction = r.email
      ? `<a class="source-link" href="mailto:${encodeURIComponent(r.email)}">✉️ ${escapeHtml(r.email)}</a>`
      : "";
    const mapsLink = `<a class="source-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.facilityName} ${address}`)}" target="_blank" rel="noopener">📍 Directions</a>`;
    const bankBadge = r.bankType && r.bankType !== "null" && r.bankType !== "Unknown"
      ? `<span class="bank-type">${escapeHtml(r.bankType)}</span>` : "";

    return `<article class="result-card">
      <div>
        <div class="facility-top">
          <h3>${escapeHtml(r.facilityName)}</h3>
          <span class="badge ${badge}">${escapeHtml(r.unitsAvailable > 0 ? `${r.unitsAvailable} unit${r.unitsAvailable === 1 ? '' : 's'} available` : 'Confirm availability')}</span>
          ${bankBadge}
        </div>
        <p class="facility-address">${escapeHtml(address)} · ${escapeHtml(r.component)}</p>
        <div class="facts">
          <div class="fact"><span>Group</span><strong>${escapeHtml(r.bloodGroup)}</strong></div>
          <div class="fact"><span>Listed stock</span><strong>${escapeHtml(units)}</strong></div>
          <div class="fact"><span>Freshness</span><strong>${escapeHtml(freshLabel)}</strong></div>
        </div>
      </div>
      <div class="result-actions">
        ${phoneAction}
        ${mapsLink}
        ${emailAction}
      </div>
      ${r.phone ? `<p class="result-note">📞 ${escapeHtml(r.phone)}${r.notes ? ` · ${escapeHtml(r.notes)}` : ''}</p>` : ''}
    </article>`;
  }).join("");
}

function setSearching(value) {
  state.searching = value;
  $("search-button").disabled = value;
  $("search-button").innerHTML = value
    ? '<span class="spinner btn-spinner" aria-hidden="true"></span> Searching…'
    : 'Search availability <span aria-hidden="true">→</span>';
  $("search-progress").hidden = !value;
  $("progress-heading").textContent = value ? "Searching listings" : "Search complete";
  $("search-progress").classList.toggle("finished", !value);
  if (!value) $("empty-state").hidden = state.listings.length > 0;
}

async function startSearch(event) {
  event.preventDefault();
  $("form-error").hidden = true;
  if (state.searching) return;
  state.eventSource?.close();
  state.listings = [];
  $("results-list").innerHTML = "";
  $("empty-state").hidden = true;

  const query = {
    bloodGroup: $("blood-group").value,
    component: $("component").value,
    units: Number($("units").value),
    location: $("location").value.trim(),
    radiusKm: 100, // we search the whole state
    urgency: $("urgency").value,
  };

  $("results-title").textContent = `${query.bloodGroup || "Blood"} availability near ${query.location || "your location"}`;
  $("results-subtitle").textContent = `${query.component} · ${query.units} ${query.units === 1 ? "unit" : "units"} requested`;
  setSearching(true);

  const startTime = Date.now();

  try {
    const { jobId } = await api("/api/search", { method: "POST", body: JSON.stringify(query) });
    const stream = new EventSource(`/api/search/${encodeURIComponent(jobId)}`);
    state.eventSource = stream;

    stream.addEventListener("search_started", () => {
      $("source-progress").innerHTML = '<span class="">Checking listings</span>';
      $("progress-message").textContent = "Checking for matching blood availability...";
    });

    stream.addEventListener("source_status", (e) => {
      const d = JSON.parse(e.data);
      const cls = ["complete", "no_results"].includes(d.status) ? "done" : ["failed", "blocked", "timed_out"].includes(d.status) ? "error" : "";
      const label = d.status === "searching" ? "searching" : d.status === "complete" ? `${d.count} found · ${d.totalScanned || '?'} scanned` : d.status === "no_results" ? "no stock found" : d.status === "failed" ? "error" : d.status;
      $("source-progress").innerHTML = `<span class="${cls}">${label}</span>`;
    });

    stream.addEventListener("progress", (e) => {
      const d = JSON.parse(e.data);
      $("progress-message").textContent = d.text || "Processing...";
    });

    stream.addEventListener("listing", (e) => {
      const { listing } = JSON.parse(e.data);
      state.listings.push(listing);
      renderResults();
    });

    stream.addEventListener("search_complete", (e) => {
      const d = JSON.parse(e.data);
      state.listings = d.listings;
      renderResults();
      setSearching(false);

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      if (d.total > 0) {
        $("results-title").textContent = `${d.query.bloodGroup} available near ${d.query.location}`;
        $("results-subtitle").textContent = `${d.query.component} · ${d.total} ${d.total === 1 ? "listing" : "listings"} with stock · ${d.totalScanned || '?'} blood banks scanned · ${elapsed}s`;
        $("result-count").textContent = `${d.total} ${d.total === 1 ? "listing" : "listings"}`;
      } else {
        $("results-title").textContent = `No ${d.query.bloodGroup} stock found`;
        $("results-subtitle").textContent = `${d.totalScanned || 0} blood banks scanned in ${elapsed}s. No ${d.query.bloodGroup} ${d.query.component} currently listed as available. Try a different component or contact nearby blood banks directly.`;
        $("result-count").textContent = "";
        $("empty-state").hidden = false;
        $("empty-state").querySelector("h3").textContent = "No stock currently listed";
        $("empty-state").querySelector("p").textContent = `${d.totalScanned || 0} blood banks were checked. This does not mean no blood is available. Contact nearby licensed blood banks and the treating hospital directly.`;
      }

      $("progress-message").textContent = `Done in ${elapsed}s · ${d.totalScanned || 0} blood banks scanned`;
      stream.close();
      state.eventSource = null;
    });

    stream.onerror = () => {
      if (state.searching) {
        setSearching(false);
        $("form-error").textContent = "The search stream was interrupted. Please try again.";
        $("form-error").hidden = false;
        stream.close();
      }
    };
  } catch (error) {
    setSearching(false);
    $("form-error").textContent = error.message;
    $("form-error").hidden = false;
  }
}

async function init() {
  $("search-form").addEventListener("submit", startSearch);
  try {
    await api("/api/state");
  } catch {
    toast("Could not connect to the PennyWise server");
  }
}

init();
