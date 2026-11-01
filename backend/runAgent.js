import { TinyFish, BrowserProfile } from "@tiny-fish/sdk";

let client;
function getClient() {
  if (!client) client = new TinyFish();
  return client;
}

export async function runAgent({ id, url, goal, emit, stealth = false, timeoutMs = 50000 }) {
  let completion;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new Error("TinyFish search timed out")), timeoutMs);
  timeout.unref?.();
  let stream;
  try {
  stream = await getClient().agent.stream(
    {
      url,
      goal,
      browser_profile: stealth ? BrowserProfile.STEALTH : undefined,
      ...(stealth ? { proxy_config: { enabled: true, country_code: "IN" } } : {}),
      agent_config: { max_duration_seconds: 45 },
    },
    {
      onStarted: (e) => emit({ agent: id, type: "started", runId: e.run_id }),
      onStreamingUrl: (e) => emit({ agent: id, type: "stream", url: e.streaming_url }),
      onProgress: (e) => emit({ agent: id, type: "progress", text: e.purpose }),
      onComplete: (e) => { completion = e; emit({ agent: id, type: "done", status: e.status, result: e.result, error: e.error?.message }); },
      signal: controller.signal,
    },
  );
  for await (const _ of stream) { /* SDK callbacks are emitted while consuming the stream. */ }
  } catch (error) {
    if (controller.signal.aborted) throw new Error(`Source search exceeded ${Math.round(timeoutMs / 1000)} seconds.`);
    throw error;
  } finally {
    clearTimeout(timeout);
    if (controller.signal.aborted && stream) await stream.close().catch(() => {});
  }
  if (!completion) throw new Error("TinyFish ended without a completed source result.");
  if (!/COMPLETED|SUCCESS/i.test(String(completion.status))) throw new Error(completion.error?.message || `TinyFish run ended with status ${completion.status || "unknown"}.`);
  return completion;
}

export function hasTinyFishKey() { return Boolean(process.env.TINYFISH_API_KEY); }
