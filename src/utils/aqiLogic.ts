import { AirQualityMetrics } from '../types/airQuality';

export interface AqiSeverityMeta {
  label: 'Good' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe Winter Smog';
  badgeColor: string;
  textColor: string;
  borderColor: string;
  maskRequired: boolean;
  safeOutdoorWindow: string;
}

/**
 * Sanitizes user-provided city text to prevent injection or malformed API queries.
 */
export function sanitizeCityInput(rawInput: string): string {
  return rawInput
    .replace(/[^a-zA-Z\s,-]/g, '')
    .trim()
    .slice(0, 60);
}

/**
 * Classifies AQI severity using NAQI / severe winter smog thresholds
 * with accessible non-color text indicators.
 */
export function classifyAqiSeverity(aqi: number): AqiSeverityMeta {
  if (aqi <= 50) {
    return {
      label: 'Good',
      badgeColor: 'bg-emerald-100',
      textColor: 'text-emerald-900',
      borderColor: 'border-emerald-400',
      maskRequired: false,
      safeOutdoorWindow: 'All day (6:00 AM – 9:00 PM)',
    };
  }
  if (aqi <= 100) {
    return {
      label: 'Moderate',
      badgeColor: 'bg-amber-100',
      textColor: 'text-amber-900',
      borderColor: 'border-amber-400',
      maskRequired: false,
      safeOutdoorWindow: '9:00 AM – 6:00 PM',
    };
  }
  if (aqi <= 200) {
    return {
      label: 'Poor',
      badgeColor: 'bg-orange-100',
      textColor: 'text-orange-900',
      borderColor: 'border-orange-400',
      maskRequired: true,
      safeOutdoorWindow: '12:00 PM – 4:00 PM (Peak Solar Dispersion)',
    };
  }
  if (aqi <= 300) {
    return {
      label: 'Very Poor',
      badgeColor: 'bg-rose-100',
      textColor: 'text-rose-900',
      borderColor: 'border-rose-400',
      maskRequired: true,
      safeOutdoorWindow: '1:00 PM – 3:30 PM Only (Brief Essentials)',
    };
  }
  return {
    label: 'Severe Winter Smog',
    badgeColor: 'bg-purple-100',
    textColor: 'text-purple-950',
    borderColor: 'border-purple-500',
    maskRequired: true,
    safeOutdoorWindow: 'Avoid Outdoors — Thermal Inversion Trap Active',
  };
}

/**
 * Estimates weekly PM2.5 inhalation reduction (%) when following indoor & mask protocols.
 */
export function calculateExposureReduction(metrics: AirQualityMetrics, usesN95: boolean): number {
  const baseIndoorProtection = metrics.aqi > 200 ? 55 : 40;
  const maskBonus = usesN95 ? 30 : 10;
  return Math.min(92, baseIndoorProtection + maskBonus);
}