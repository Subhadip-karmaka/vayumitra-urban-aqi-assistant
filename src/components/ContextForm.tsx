import React from 'react';
import { MapPin, Users, Home, Car, Flame, Sparkles } from 'lucide-react';
import { UserContextProfile, SensitivityGroup, HousingType, CommuteMode } from '../types/airQuality';

interface ContextFormProps {
  profile: UserContextProfile;
  onChange: (updated: UserContextProfile) => void;
  onAnalyze: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const PRESET_CITIES = ['New Delhi', 'Kolkata', 'Howrah', 'Mumbai', 'Bengaluru'];

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
      className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3.5">
        <div>
          <h2 className="text-base font-bold text-white">1. Configure Location & Household Context</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Personalizes winter thermal-inversion routines, indoor hacks, and emission trade-offs.
          </p>
        </div>

        {/* Quick-Select City Pills */}
        <div className="flex flex-wrap items-center gap-1.5" aria-label="Quick city presets">
          {PRESET_CITIES.map((cityName) => {
            const active = profile.city.toLowerCase() === cityName.toLowerCase();
            return (
              <button
                key={cityName}
                type="button"
                onClick={() => onChange({ ...profile, city: cityName, simulatedSmogAqi: null })}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  active
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cityName}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="city-input" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            City / Locality
          </label>
          <input
            id="city-input"
            type="text"
            required
            value={profile.city}
            onChange={(e) => onChange({ ...profile, city: e.target.value })}
            placeholder="e.g., Howrah, Kolkata, Delhi"
            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          />
        </div>

        <div>
          <label htmlFor="sensitivity-select" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
            <Users className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            Health Profile
          </label>
          <select
            id="sensitivity-select"
            value={profile.sensitivity}
            onChange={(e) => onChange({ ...profile, sensitivity: e.target.value as SensitivityGroup })}
            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          >
            <option value="general">General Adult Household</option>
            <option value="children">Young Children / School Kids</option>
            <option value="elderly">Senior Citizens (60+)</option>
            <option value="asthma_respiratory">Asthma / Respiratory Risk</option>
          </select>
        </div>

        <div>
          <label htmlFor="housing-select" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
            <Home className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            Home Architecture
          </label>
          <select
            id="housing-select"
            value={profile.housing}
            onChange={(e) => onChange({ ...profile, housing: e.target.value as HousingType })}
            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          >
            <option value="apartment_high">High-Rise Apartment</option>
            <option value="ground_floor_roadside">Ground Floor Near Main Road</option>
            <option value="independent_house">Independent House / Courtyard</option>
          </select>
        </div>

        <div>
          <label htmlFor="commute-select" className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
            <Car className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            Daily Commute
          </label>
          <select
            id="commute-select"
            value={profile.commute}
            onChange={(e) => onChange({ ...profile, commute: e.target.value as CommuteMode })}
            className="w-full rounded-xl bg-slate-950 border border-slate-700 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
          >
            <option value="car_bike">Personal Car / Two-Wheeler</option>
            <option value="public_transit">Metro / Bus / Shared Auto</option>
            <option value="walk_cycle">Walking / Cycling</option>
            <option value="work_from_home">Remote / Mostly Indoors</option>
          </select>
        </div>
      </div>

      {/* Smog Stress-Test Bar + Submit */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <label htmlFor="smog-simulator" className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <Flame className="w-4 h-4" aria-hidden="true" />
            Telemetry Mode:
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
            className="rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="live">Live Satellite/Station AQI</option>
            <option value="245">Simulate: Poor Winter Haze (AQI 245)</option>
            <option value="390">Simulate: Severe Smog Emergency (AQI 390)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 disabled:opacity-50 text-slate-950 font-bold text-sm py-2.5 px-6 transition-all shadow-lg shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          {isLoading ? 'Synthesizing Plan...' : 'Run GenAI Analysis'}
        </button>
      </div>
    </form>
  );
};