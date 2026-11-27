<div align="center">

# 🌫️ VayuMitra.ai — Urban Air Quality & Winter Smog Navigator

**A context-aware GenAI command center helping urban families and communities navigate severe winter smog, thermal inversions, and daily emission trade-offs.**

[![React 18](https://img.shields.io/badge/React-18.3-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini GenAI](https://img.shields.io/badge/GenAI-Gemini_2.0_Flash-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Vitest](https://img.shields.io/badge/Tested_With-Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

</div>

---

## 🎯 Chosen Vertical
**`[Challenge 6]` Urban Air Quality Assistant** — Engineered to protect urban households and neighborhoods during severe winter smog episodes by translating live pollutant telemetry into low-emission daily routines, indoor air quality (IAQ) hacks, sustainable swaps, and quantified health/carbon impacts.

---

## 🏗️ System Architecture & GenAI Decision Pipeline

GitHub renders the architecture flowchart below showing how user context, live satellite/station telemetry, and GenAI reasoning work together:

```mermaid
flowchart TD
    A[👤 Household Context Input<br/>City • Vulnerability • Housing • Commute] --> B[🛡️ Input Sanitizer & Security Layer<br/>src/utils/aqiLogic.ts]
    B --> C{📡 Telemetry Mode}
    C -->|Live Mode| D[🌍 Open-Meteo Geocoding & AQI API<br/>In-Memory Session Cache]
    C -->|Stress Test| E[🔥 Severe Winter Smog Simulator<br/>AQI 245 Haze / AQI 390 Emergency]
    D --> F[📊 NAQI Classifier & Inversion Engine<br/>Safe Window & Cigarette Load Math]
    E --> F
    F --> G{🧠 GenAI Synthesis Engine<br/>src/services/geminiService.ts}
    G -->|API Key Configured| H[✨ Google Gemini 2.0 Flash<br/>Structured JSON Schema]
    G -->|Zero-Key / Fallback| I[⚙️ Context-Aware Hybrid Engine<br/>Deterministic Multi-Factor Rules]
    H --> J[🖥️ Interactive Telemetry Dashboard<br/>24h Curve • Action Tabs • Impact Tracker]
    I --> J

