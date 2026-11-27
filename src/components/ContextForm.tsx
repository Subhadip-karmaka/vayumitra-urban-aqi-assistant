import React from 'react';
import { MapPin, Users, Home, Car, Flame, Sparkles } from 'lucide-react';
import { UserContextProfile, SensitivityGroup, HousingType, CommuteMode } from '../types/airQuality';

interface ContextFormProps {
  profile: UserContextProfile;
  onChange: (updated: UserContextProfile) => void;
  onAnalyze: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ContextForm: React.FC<ContextFormProps> = ({
  profile,
  onChange,
  onAnalyze,
  isLoading,
}) => {
  return (
    <form
      onSubmit={onAnalyze}
      aria-label="Household and Location Air Quality Profile"
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5"
    >
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-lg font-bold text-slate-900">1. Customize Your Household Context</h2>
        <p className="text-sm text-slate-600">
          Tailors winter smog routines, indoor air hacks, and emission trade-offs to your family.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City Input */}
        <div>
          <label htmlFor="city-input" className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 mb-1.5">
            <MapPin className="w-4 h-4 text-sky-600" aria-hidden="true" />
            City or Urban Locality
          </label>
          <input
            id="city-input"
            type="text"
            required
            value={profile.city}
            onChange={(e) => onChange({ ...profile, city: e.target.value })}
            placeholder="e.g., New Delhi, Kolkata, Howrah, Mumbai"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
          />
        </div>

        {/* Household Vulnerability */}
        <div>
          <label htmlFor="sensitivity-select" className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 mb-1.5">
            <Users className="w-4 h-4 text-sky-600" aria-hidden="true" />
            Household Health Sensitivity
          </label>
          <select
            id="sensitivity-select"
            value={profile.sensitivity}
            onChange={(e) => onChange({ ...profile, sensitivity: e.target.value as SensitivityGroup })}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
          >
            <option value="general">General Adult Household</option>
            <option value="children">Young Children / School Kids</option>
            <option value="elderly">Senior Citizens (60+)</option>
            <option value="asthma_respiratory">Asthma / Respiratory Sensitivity</option>
          </select>
        </div>

        {/* Housing Type */}
        <div>
          <label htmlFor="housing-select" className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 mb-1.5">
            <Home className="w-4 h-4 text-sky-600" aria-hidden="true" />
            Home & Ventilation Setup
          </label>
          <select
            id="housing-select"
            value={profile.housing}
            onChange={(e) => onChange({ ...profile, housing: e.target.value as HousingType })}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
          >
            <option value="apartment_high">High-Rise Apartment (Balcony)</option>
            <option value="ground_floor_roadside">Ground Floor Near Main Road</option>
            <option value="independent_house">Independent House / Courtyard</option>
          </select>
        </div>

        {/* Daily Commute */}
        <div>
          <label htmlFor="commute-select" className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 mb-1.5">
            <Car className="w-4 h-4 text-sky-600" aria-hidden="true" />
            Primary Daily Commute
          </label>
          <select
            id="commute-select"
            value={profile.commute}
            onChange={(e) => onChange({ ...profile, commute: e.target.value as CommuteMode })}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
          >
            <option value="car_bike">Personal Car / Two-Wheeler</option>
            <option value="public_transit">Metro / Bus / Shared Auto</option>
            <option value="walk_cycle">Walking / Cycling</option>
            <option value="work_from_home">Remote / Mostly Indoors</option>
          </select>
        </div>
      </div>

      {/* Winter Smog Stress-Test Simulator */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="smog-simulator" className="flex items-center gap-2 text-sm font-semibold text-amber-950">
            <Flame className="w-4 h-4 text-amber-600" aria-hidden="true" />
            Winter Smog Scenario Mode:
          </label>
          <select
            id="smog-simulator"
            value={profile.simulatedSmogAqi ?? 'live'}
            onChange={(e) =>
              onChange({
                ...profile,
                simulatedSmogAqi: e.target.value === 'live' ? null : Number(e.target.value),
              })
            }
            className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="live">Live Real-Time City AQI (Open-Meteo)</option>
            <option value="240">Simulate: Poor Winter Haze (AQI 240)</option>
            <option value="385">Simulate: Severe Winter Smog Episode (AQI 385)</option>
          </select>
        </div>
        <p className="text-xs text-amber-900 mt-1.5">
          Switch between live satellite/station readings and severe winter thermal-inversion episodes to see how recommendations adapt.
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-700 hover:bg-sky-800 disabled:bg-slate-400 text-white font-semibold py-3 px-5 transition-colors focus:outline-none focus:ring-4 focus:ring-sky-600/30"
      >
        <Sparkles className="w-4 h-4" aria-hidden="true" />
        {isLoading ? 'Generating Personalized Smog Plan...' : 'Generate GenAI Air Quality Plan'}
      </button>
    </form>
  );
};