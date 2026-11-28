import { describe, it, expect } from 'vitest';
import {
  sanitizeCityInput,
  classifyAqiSeverity,
  calculateExposureReduction,
} from './aqiLogic';
import { AirQualityMetrics } from '../types/airQuality';

describe('AQI Telemetry Utilities & Classification', () => {
  it('sanitizes malicious symbols and enforces 60-char limit on city input', () => {
    expect(sanitizeCityInput('  New Delhi <script>alert(1)</script>  ')).toBe(
  'New Delhi scriptalertscript'
);
    expect(sanitizeCityInput('A'.repeat(100)).length).toBe(60);
  });

  it('classifies all 5 NAQI & winter smog severity tiers accurately', () => {
    expect(classifyAqiSeverity(35).label).toBe('Good');
    expect(classifyAqiSeverity(35).maskRequired).toBe(false);

    expect(classifyAqiSeverity(85).label).toBe('Moderate');
    expect(classifyAqiSeverity(85).maskRequired).toBe(false);

    expect(classifyAqiSeverity(165).label).toBe('Poor');
    expect(classifyAqiSeverity(165).maskRequired).toBe(true);

    expect(classifyAqiSeverity(265).label).toBe('Very Poor');
    expect(classifyAqiSeverity(265).maskRequired).toBe(true);

    expect(classifyAqiSeverity(390).label).toBe('Severe Winter Smog');
    expect(classifyAqiSeverity(390).maskRequired).toBe(true);
  });

  it('calculates PM2.5 inhalation reduction across moderate and severe smog with N95 mask', () => {
    const baseMetrics: AirQualityMetrics = {
      city: 'Kolkata',
      country: 'India',
      aqi: 140,
      pm25: 72,
      pm10: 130,
      no2: 40,
      o3: 55,
      isSimulated: false,
      timestamp: '09:00 AM',
    };

    expect(calculateExposureReduction(baseMetrics, false)).toBe(50);
    expect(calculateExposureReduction(baseMetrics, true)).toBe(70);
    expect(calculateExposureReduction({ ...baseMetrics, aqi: 390 }, true)).toBe(85);
  });
});