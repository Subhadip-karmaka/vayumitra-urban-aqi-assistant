export type SensitivityGroup = 'general' | 'children' | 'elderly' | 'asthma_respiratory';
export type HousingType = 'apartment_high' | 'ground_floor_roadside' | 'independent_house';
export type CommuteMode = 'car_bike' | 'public_transit' | 'walk_cycle' | 'work_from_home';

export interface UserContextProfile {
  city: string;
  sensitivity: SensitivityGroup;
  housing: HousingType;
  commute: CommuteMode;
  simulatedSmogAqi: number | null;
}

export interface AirQualityMetrics {
  city: string;
  country: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  isSimulated: boolean;
  timestamp: string;
}

export interface ActionRecommendation {
  title: string;
  description: string;
  timingOrFrequency: string;
  directHealthImpact: string;
  emissionReduction: string;
  effortLevel: 'Low' | 'Medium' | 'High';
}

export interface AiAdvisoryPlan {
  smogSummary: string;
  inversionAlert: string;
  lowEmissionRoutines: ActionRecommendation[];
  indoorAirHacks: ActionRecommendation[];
  sustainableAlternatives: ActionRecommendation[];
  communityAction: string;
  generatedBy: 'Gemini GenAI' | 'Context-Aware Hybrid Engine';
}