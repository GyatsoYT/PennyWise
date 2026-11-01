# PennyWise Backend

Express.js server that provides the blood availability search API.

## Architecture

- `server.js` — Express API server with SSE streaming for real-time search updates
- `eraktkosh.js` — Direct eRaktKosh government portal scraper (fast path, ~2s)
- `runAgent.js` — TinyFish SDK integration for autonomous web agent search (extensible path)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/state` | Server readiness check |
| POST | `/api/search` | Start a blood availability search |
| GET | `/api/search/:jobId` | SSE stream for search progress and results |

## Search payload

```json
{
  "bloodGroup": "O-",
  "component": "Whole Blood",
  "units": 2,
  "location": "Bengaluru",
  "radiusKm": 25,
  "urgency": "immediate"
}
```
