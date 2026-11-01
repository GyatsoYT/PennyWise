# PennyWise

> **"Every second matters. Finding blood shouldn't take hours."**

PennyWise is an autonomous blood availability discovery agent that searches India's eRaktKosh national blood bank inventory system to find matching blood stock in real-time.

Instead of manually calling dozens of hospitals, users enter their requirements — blood group, component, units, and location — and PennyWise searches the government portal directly, returning results in **2-5 seconds**.

## How it works

1. User submits blood group, component, units needed, and location
2. Parses 100+ blood bank records, extracts availability data
3. Ranks results by availability, freshness, and location relevance
4. Displays actionable results with phone numbers and directions

## Architecture

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | Vanilla JS + CSS | Responsive search UI with SSE live updates |
| Backend | Node.js + Express | API server, SSE streaming |
| AI Agent | TinyFish SDK | Autonomous web navigation |

### TinyFish Integration

The `runAgent.js` module contains the TinyFish SDK integration for autonomous web agent navigation. This enables PennyWise to navigate arbitrary blood bank websites that don't have direct APIs.

## Run locally

1. `npm run setup` — install backend dependencies
2. `npm start` — starts server on http://localhost:3000
3. Enter blood group, component, units, and city (e.g., "Bengaluru")

No API keys required for the core search functionality. Add `TINYFISH_API_KEY` to `backend/.env` to enable TinyFish agent-based search for additional sources.

## Key features
- **Smart location resolution** — maps 100+ Indian cities to their state codes
- **Freshness indicators** — shows when inventory was last updated
- **Phone-first results** — one-tap calling for immediate confirmation

## Limitations
- Not all blood banks update their stock regularly  
- PennyWise is a discovery tool, not a replacement for blood bank screening or transfusion decisions
- Always confirm availability directly with the blood bank before travelling
