import { AirQualityMetrics, AiAdvisoryPlan, UserContextProfile } from '../types/airQuality';

const SENSITIVITY_LABELS: Record<UserContextProfile['sensitivity'], string> = {
  general: 'Healthy Adults',
  children: 'Young Children & School-Age Kids',
  elderly: 'Senior Citizens (60+)',
  asthma_respiratory: 'Asthma / Respiratory Sensitivity',
};

const HOUSING_LABELS: Record<UserContextProfile['housing'], string> = {
  apartment_high: 'High-Rise Apartment',
  ground_floor_roadside: 'Ground Floor Near Main Road',
  independent_house: 'Independent House / Courtyard',
};

/**
 * Generates personalized winter smog guidance via Gemini API if VITE_GEMINI_API_KEY is set,
 * seamlessly falling back to a deterministic context-aware engine so the app never fails.
 */
export async function generateAirQualityPlan(
  profile: UserContextProfile,
  metrics: AirQualityMetrics
): Promise<AiAdvisoryPlan> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const prompt = `You are VayuMitra, an expert Urban Air Quality & Winter Smog GenAI Assistant.
User Context:
- City: ${metrics.city} (${metrics.country})
- Current AQI: ${metrics.aqi} (PM2.5: ${metrics.pm25} µg/m³, PM10: ${metrics.pm10} µg/m³, NO2: ${metrics.no2} µg/m³)
- Household Profile: ${SENSITIVITY_LABELS[profile.sensitivity]}
- Housing: ${HOUSING_LABELS[profile.housing]}
- Commute: ${profile.commute}

Return ONLY valid JSON matching this exact structure (no markdown):
{
  "smogSummary": "2-sentence assessment of current winter smog risk for this specific household",
  "inversionAlert": "1-sentence explanation of today's cold-air pollution trapping window",
  "lowEmissionRoutines": [
    { "title": "...", "description": "...", "timingOrFrequency": "...", "directHealthImpact": "...", "emissionReduction": "...", "effortLevel": "Low" }
  ],
  "indoorAirHacks": [
    { "title": "...", "description": "...", "timingOrFrequency": "...", "directHealthImpact": "...", "emissionReduction": "...", "effortLevel": "Low" }
  ],
  "sustainableAlternatives": [
    { "title": "...", "description": "...", "timingOrFrequency": "...", "directHealthImpact": "...", "emissionReduction": "...", "effortLevel": "Medium" }
  ],
  "communityAction": "1 actionable neighborhood step to curb winter smog"
}
Provide 2 items per array, tailored specifically to ${metrics.city}, ${SENSITIVITY_LABELS[profile.sensitivity]}, and ${HOUSING_LABELS[profile.housing]}.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return {
            ...parsed,
            generatedBy: 'Gemini GenAI',
          };
        }
      }
    } catch {
      // Fall through cleanly to hybrid engine
    }
  }

  return buildContextAwareFallbackPlan(profile, metrics);
}

function buildContextAwareFallbackPlan(
  profile: UserContextProfile,
  metrics: AirQualityMetrics
): AiAdvisoryPlan {
  const isSevere = metrics.aqi > 200;
  const isRoadside = profile.housing === 'ground_floor_roadside';
  const isHighRisk = profile.sensitivity === 'asthma_respiratory' || profile.sensitivity === 'children' || profile.sensitivity === 'elderly';

  return {
    smogSummary: `At AQI ${metrics.aqi} (PM2.5: ${metrics.pm25} µg/m³) in ${metrics.city}, cold winter air is trapping fine particulate matter near ground level. For ${SENSITIVITY_LABELS[profile.sensitivity]} living in a ${HOUSING_LABELS[profile.housing]}, shifting outdoor exposure windows and sealing indoor infiltration can cut lung particle load by over 75%.`,
    inversionAlert: isSevere
      ? 'Severe Thermal Inversion Active: Cold morning air (5:30 AM – 10:30 AM) locks vehicle and heating smoke below 150 meters. Delay outdoor movement until after 12:30 PM.'
      : 'Mild Morning Inversion: Pollutant concentration peaks between 7:00 AM and 9:30 AM before sunlight warms ground air.',
    lowEmissionRoutines: [
      {
        title: isHighRisk ? 'Shift Walks & Errands to Solar Dispersion Window' : 'Consolidate Errands into Single Midday Trip',
        description: `Avoid early morning (6–9 AM) and late evening (7–10 PM) smog traps in ${metrics.city}. Batch grocery, pharmacy, and school pickups between 12:30 PM and 3:30 PM when vertical air mixing peaks.`,
        timingOrFrequency: 'Daily • 12:30 PM – 3:30 PM',
        directHealthImpact: `Reduces peak PM2.5 inhalation by ~${isSevere ? '48%' : '32%'} compared to 7:30 AM rush hour.`,
        emissionReduction: 'Saves ~1.4 kg CO₂ & 18 g NOx/week by eliminating cold-engine short trips.',
        effortLevel: 'Low',
      },
      {
        title: profile.commute === 'car_bike' ? 'Adopt Eco-Idle & Metro/Carpool Hybrid Commute' : 'Use Low-Traffic Green Corridor Routes',
        description:
          profile.commute === 'car_bike'
            ? 'Switch off vehicle ignition at red lights >15 seconds (winter cold-idling emits 2x hydrocarbons) and replace 2 weekly solo drives with public transit or carpooling.'
            : 'Walk or cycle on tree-lined interior lanes 100m away from arterial roads, where PM2.5 drops sharply, while wearing a snug N95/FFP2 respirator.',
        timingOrFrequency: 'Workdays • Commute Hours',
        directHealthImpact: 'Cuts direct tailpipe benzene and ultrafine soot exposure by up to 60%.',
        emissionReduction: 'Prevents ~9.5 kg CO₂ and 4.2 g PM2.5 exhaust emissions per week.',
        effortLevel: 'Medium',
      },
    ],
    indoorAirHacks: [
      {
        title: isRoadside ? 'Seal Roadside Door Drafts + Scheduled Cross-Ventilation' : '15-Minute Afternoon Purge Ventilation',
        description: isRoadside
          ? 'Place damp rolled towels or rubber draft stoppers under balcony and main entrance doors during morning traffic, then open opposite windows strictly between 1:30 PM and 2:00 PM.'
          : 'Keep windows latched during night smog buildup and open cross-ventilation windows for 15–20 minutes at 2:00 PM to flush indoor CO₂ without trapping heavy morning smog.',
        timingOrFrequency: 'Daily • 1:30 PM – 2:00 PM',
        directHealthImpact: 'Lowers indoor PM2.5 accumulation by 35–45% without expensive hardware.',
        emissionReduction: 'Zero electricity consumption (0 kWh) compared to continuous mechanical exhaust.',
        effortLevel: 'Low',
      },
      {
        title: 'Wet-Mop Microfiber Protocol & DIY Box-Fan HEPA Filter',
        description: 'Replace dry broom sweeping (which re-suspends settled PM10 dust for hours) with damp microfiber mopping every morning. Pair a standard room fan with a MERV-13 filter for budget high-CADR air cleaning.',
        timingOrFrequency: 'Every Morning • 10 Mins',
        directHealthImpact: 'Eliminates ~70% of resuspended indoor coarse & fine dust triggers for asthma/kids.',
        emissionReduction: 'Consumes 85% less energy (35W) than commercial dual-motor purifiers.',
        effortLevel: 'Low',
      },
    ],
    sustainableAlternatives: [
      {
        title: 'Lid-On Induction/Pressure Cooking + High-CFM Chimney',
        description: 'Winter kitchen gas burning spikes indoor NO₂ and PM2.5 above outdoor smog levels. Always cover pots with lids, use pressure cookers to cut flame time by 40%, and run kitchen exhaust during tadka/frying.',
        timingOrFrequency: 'Every Meal',
        directHealthImpact: 'Reduces indoor cooking PM2.5 spikes by up to 65% inside closed winter kitchens.',
        emissionReduction: 'Cuts household LPG/fuel consumption by ~25% (~11 kg CO₂ saved/month).',
        effortLevel: 'Low',
      },
      {
        title: 'Zero-Burn Leaf Composting & Electric Heating Swap',
        description: 'Replace open biomass/garden waste burning or kerosene/coil warmers with enclosed compost bins and insulated layered clothing + targeted oil-filled radiators.',
        timingOrFrequency: 'Winter Season',
        directHealthImpact: 'Prevents toxic carbon monoxide and carcinogenic PAH smoke in your immediate lane.',
        emissionReduction: 'Eliminates ~45 g of direct black carbon PM2.5 per avoided yard fire.',
        effortLevel: 'Medium',
      },
    ],
    communityAction: `Organize a "${metrics.city} Clean Lane Pledge" on your building WhatsApp group: enforce zero garden-leaf/trash burning by security staff and coordinate shared school/office carpools on days AQI exceeds 250.`,
    generatedBy: 'Context-Aware Hybrid Engine',
  };
}