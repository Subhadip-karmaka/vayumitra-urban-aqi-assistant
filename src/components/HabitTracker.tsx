import React, { useState } from 'react';
import { CheckSquare, Square, Share2, Check, ShieldCheck } from 'lucide-react';
import { AirQualityMetrics } from '../types/airQuality';
import { calculateExposureReduction } from '../utils/aqiLogic';

interface HabitTrackerProps {
  metrics: AirQualityMetrics;
  communityAction: string;
}

const HABIT_ITEMS = [
  { id: 'n95', label: 'Wear N95/FFP2 respirator during outdoor commute', co2Kg: 0.2, exposureBonus: 30 },
  { id: 'window', label: 'Seal roadside drafts & ventilate strictly 1:30–2:00 PM', co2Kg: 1.8, exposureBonus: 12 },
  { id: 'mop', label: 'Switch from dry broom sweeping to damp microfiber mopping', co2Kg: 0.4, exposureBonus: 10 },
  { id: 'transit', label: 'Replace 2 solo vehicle trips with Metro/Carpool/Walk', co2Kg: 6.5, exposureBonus: 5 },
];

export const HabitTracker: React.FC<HabitTrackerProps> = ({ metrics, communityAction }) => {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    n95: true,
    window: true,
    mop: false,
    transit: false,
  });
  const [copied, setCopied] = useState(false);

  const toggleHabit = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const baseReduction = calculateExposureReduction(metrics, Boolean(checked.n95));
  const extraExposure =
    (checked.window ? 4 : 0) + (checked.mop ? 3 : 0);
  const totalReduction = Math.min(95, baseReduction + extraExposure);

  const weeklyCo2Saved = HABIT_ITEMS.reduce(
    (sum, item) => (checked[item.id] ? sum + item.co2Kg : sum),
    0
  ).toFixed(1);

  const handleCopyAlert = async () => {
    const shareText = `🌫️ *${metrics.city} Air Quality Alert (AQI ${metrics.aqi})*\n• PM2.5: ${metrics.pm25} µg/m³\n• Best Outdoor Window: 12:30 PM – 3:30 PM\n• Community Action: ${communityAction}\nGenerated via VayuMitra AI`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  return (
    <section
      aria-label="Interactive Personal Impact & Community Share"
      className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white">3. Live Choice Impact & Community Action</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Toggle daily habits below to calculate real-time lung exposure drop & weekly carbon offset.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCopyAlert}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Copied WhatsApp Alert!' : 'Copy Community Smog Alert'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
        {/* Interactive Checklist */}
        <div className="lg:col-span-3 space-y-2.5">
          {HABIT_ITEMS.map((item) => {
            const isChecked = Boolean(checked[item.id]);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleHabit(item.id)}
                aria-pressed={isChecked}
                className={`w-full text-left flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                  isChecked
                    ? 'bg-cyan-950/40 border-cyan-700/70 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="flex items-center gap-2.5 text-sm font-medium">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  {item.label}
                </span>
                <span className="text-xs font-mono text-emerald-400 shrink-0">
                  -{item.co2Kg} kg CO₂/wk
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Telemetry Readout */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4">
          <div>
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span>PM2.5 LUNG INTAKE DROP</span>
              <span className="text-cyan-400 font-bold">{totalReduction}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${totalReduction}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
              <div className="text-[11px] font-mono text-slate-400">WEEKLY CO₂ SAVED</div>
              <div className="text-xl font-extrabold font-mono text-emerald-400 mt-0.5">
                {weeklyCo2Saved} <span className="text-xs font-normal">kg</span>
              </div>
            </div>
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
              <div className="text-[11px] font-mono text-slate-400">EXPOSURE STATUS</div>
              <div className="text-sm font-bold text-cyan-300 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                {totalReduction >= 75 ? 'Protected' : 'Moderate Risk'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};