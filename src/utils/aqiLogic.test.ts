import { describe, it, expect } from 'vitest';
import { sanitizeCityInput, classifyAqiSeverity, calculateExposureReduction } from './aqiLogic';

describe('Urban Air Quality Logic & Security', () => {
  it('sanitizes malicious characters from city input', () => {
    expect(sanitizeCityInput('Delhi<script>alert(1)</script>123')).toBe('Delhiscriptalertscript');
    expect(sanitizeCityInput('  Howrah, West Bengal  ')).toBe('Howrah, West Bengal');
  });

  it('identifies severe winter smog thresholds accurately', () => {
    const severe = classifyAqiSeverity(365);
    expect(severe.label).toBe('Severe Winter Smog');
    expect(severe.maskRequired).toBe(true);

    const good = classifyAqiSeverity(42);
    expect(good.label).toBe('Good');
    expect(good.maskRequired).toBe(false);
  });

  it('calculates realistic PM2.5 exposure reduction', () => {
    const reduction = calculateExposureReduction(
      {
        city: 'Kolkata',
        country: 'India',
        aqi: 280,
        pm25: 165,
        pm10: 240,
        no2: 48,
        o3: 32,
        isSimulated: false,
        timestamp: new Date().toISOString(),
      },
      true
    );
    expect(reduction).toBe(85);
  });
});