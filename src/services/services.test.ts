import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCityAirQuality } from './weatherService';
import { generateAirQualityPlan } from './geminiService';
import { UserContextProfile, AirQualityMetrics } from '../types/airQuality';

describe('Weather & Air Quality Telemetry Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns deterministic severe smog metrics when simulation AQI 390 is active', async () => {
    const metrics = await fetchCityAirQuality('Howrah', 390);
    expect(metrics.city).toBe('Howrah');
    expect(metrics.aqi).toBe(390);
    expect(metrics.isSimulated).toBe(true);
    expect(metrics.pm25).toBeGreaterThan(200);
    expect(metrics.pm10).toBeGreaterThan(350);
    expect(metrics.no2).toBeGreaterThan(50);
  });

  it('sanitizes HTML/script characters from city names in simulated mode', async () => {
    const metrics = await fetchCityAirQuality('<script>Kolkata</script>', 245);
    expect(metrics.city).toBe('scriptKolkatascript');
    expect(metrics.aqi).toBe(245);
    expect(metrics.isSimulated).toBe(true);
  });

  it('parses live Open-Meteo geocoding and air quality API responses accurately', async () => {
  vi.spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [{ name: 'Kolkata', country: 'India', latitude: 22.57, longitude: 88.36 }],
      }),
    } as Response)
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current: {
          us_aqi: 178,
          pm2_5: 94.5,
          pm10: 162.0,
          nitrogen_dioxide: 48.2,
          ozone: 61.0,
        },
      }),
    } as Response);

  const metrics = await fetchCityAirQuality('Kolkata', null);
  expect(metrics.city).toBe('Kolkata');
  expect(metrics.aqi).toBe(178);
  expect(metrics.pm25).toBe(95);
  expect(metrics.isSimulated).toBe(false);
});
});

describe('GenAI Context-Aware Advisory Service', () => {
  const baseMetrics: AirQualityMetrics = {
    city: 'New Delhi',
    country: 'India',
    aqi: 390,
    pm25: 242,
    pm10: 448,
    no2: 109,
    o3: 136,
    isSimulated: true,
    timestamp: '10:00 AM',
  };

  it('synthesizes complete routines, IAQ hacks, and sustainable swaps for vulnerable households', async () => {
    const profile: UserContextProfile = {
      city: 'New Delhi',
      sensitivity: 'asthma_respiratory',
      housing: 'ground_floor_roadside',
      commute: 'walk_cycle',
      simulatedSmogAqi: 390,
    };

    const plan = await generateAirQualityPlan(profile, baseMetrics);
    expect(plan.smogSummary).toContain('New Delhi');
    expect(plan.lowEmissionRoutines.length).toBeGreaterThanOrEqual(2);
    expect(plan.indoorAirHacks.length).toBeGreaterThanOrEqual(2);
    expect(plan.sustainableAlternatives.length).toBeGreaterThanOrEqual(2);

    for (const item of [
      ...plan.lowEmissionRoutines,
      ...plan.indoorAirHacks,
      ...plan.sustainableAlternatives,
    ]) {
      expect(item.title.length).toBeGreaterThan(3);
      expect(item.directHealthImpact.length).toBeGreaterThan(10);
      expect(item.emissionReduction.length).toBeGreaterThan(10);
    }
    expect(plan.communityAction.length).toBeGreaterThan(15);
  });

  it('adapts recommendations across different commute and housing configurations', async () => {
    const commuterProfile: UserContextProfile = {
      city: 'Kolkata',
      sensitivity: 'general',
      housing: 'apartment_high',
      commute: 'car_bike',
      simulatedSmogAqi: null,
    };

    const plan = await generateAirQualityPlan(commuterProfile, {
      ...baseMetrics,
      city: 'Kolkata',
      aqi: 165,
      pm25: 88,
    });

    expect(plan.smogSummary).toContain('Kolkata');
    expect(plan.sustainableAlternatives.length).toBeGreaterThanOrEqual(2);
  });
});