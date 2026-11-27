# VayuMitra AI — Urban Air Quality & Winter Smog Assistant

## Chosen Vertical
**[Challenge 6] Urban Air Quality Assistant** — A GenAI-powered assistant helping urban families and communities navigate severe winter smog through tailored low-emission daily routines, indoor air quality (IAQ) hacks, sustainable alternatives, and quantified health/emission impact explanations.

## Approach & Logical Decision-Making
Winter urban air pollution is heavily driven by **morning and late-evening thermal inversions**, where cold dense air traps PM2.5, PM10, and NO2 near ground level. VayuMitra AI combines real-time environmental telemetry with household-specific context:
1. **User Context Profiling:** Adapts guidance across four vulnerability groups (General, Young Children, Senior Citizens, Asthma/Respiratory), three housing types (High-Rise, Ground-Floor Roadside, Independent House), and four commute patterns.
2. **Thermal Inversion Scheduling:** Identifies safe midday solar dispersion windows (12:30 PM – 3:30 PM) to minimize lung particulate load during errands and school runs.
3. **Quantified Choice Impact:** Every AI-generated recommendation explicitly displays **Direct Health Impact** (estimated PM2.5 inhalation reduction) and **Emissions Saved** (CO2 and NOx avoided).
4. **Winter Smog Scenario Simulator:** Includes a built-in stress-test mode (AQI 240 and AQI 385) alongside live Open-Meteo data so families and evaluators can test severe smog episodes anytime.

## How the Solution Works
- **Frontend & Accessibility:** React 18, TypeScript, and Tailwind CSS with semantic HTML landmarks, ARIA live regions, keyboard navigation, and non-color-dependent AQI badges.
- **Live Air Quality Service (`src/services/weatherService.ts`):** Queries Open-Meteo's Geocoding and Air Quality APIs with input sanitization and an in-memory session cache to minimize redundant network calls.
- **GenAI Reasoning Engine (`src/services/geminiService.ts`):** Prompts Google Gemini (`gemini-2.0-flash`) with structured JSON schema enforcement when `VITE_GEMINI_API_KEY` is configured, backed by a deterministic context-aware hybrid engine for zero-downtime reliability.
- **Automated Testing (`src/utils/aqiLogic.test.ts`):** Vitest unit tests verify input sanitization, NAQI severity thresholds, and exposure-reduction math.

## Setup & Local Execution
1. Install dependencies: `npm install`
2. Optional: Copy `.env.example` to `.env` and add `VITE_GEMINI_API_KEY`
3. Run unit tests: `npm test`
4. Start development server: `npm run dev`

## Assumptions Made
- When `VITE_GEMINI_API_KEY` is omitted in public client deployments (to protect API credentials), the application seamlessly activates its context-aware hybrid reasoning engine.
- Exposure reduction percentages assume consistent indoor window sealing during peak morning/night inversion hours and proper fit when N95/FFP2 masks are selected.