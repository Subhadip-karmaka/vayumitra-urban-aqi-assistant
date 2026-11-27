import React from 'react';
import { ShieldAlert, Clock, Wind, Cigarette } from 'lucide-react';
import { AirQualityMetrics } from '../types/airQuality';
import { classifyAqiSeverity } from '../utils/aqiLogic';

interface AqiDashboardProps {
  metrics: AirQualityMetrics;
}

export const AqiDashboard: React.FC<AqiDashboardProps> = ({ metrics }) => {
  const severity = classifyAqiSeverity(metrics.aqi);
  // Berkeley Earth rule-of-thumb: ~22 µg/m³ PM2.5 ≈ 1 cigarette/day equivalent
  const cigaretteEquivalent = (metrics.pm25 / 22).toFixed(1);

  return (
    <section
      aria-label="Live Air Quality Status"
      className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{metrics.city}</h2>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-slate-800 text-cyan-300 border border-slate-700">
              {metrics.isSimulated ? 'SIMULATED SMOG' : `LIVE • ${metrics.timestamp}`}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{metrics.country}</p>
        </div>

        <div className={`px-4 py-2.5 rounded-xl border ${severity.borderColor} ${severity.badgeColor} ${severity.textColor} text-right`}>
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider">US AQI INDEX</div>
          <div className="text-2xl font-black font-mono">
            {metrics.aqi} • {severity.label}
          </div>
        </div>
      </div>

      {/* Pollutant Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5">
          <div className="text-[11px] font-mono text-slate-400">PM2.5 (FINE SOOT)</div>
          <div className="text-xl font-extrabold font-mono text-white mt-1">
            {metrics.pm25} <span className="text-xs font-normal text-slate-400">µg/m³</span>
          </div>
        </div>
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5">
          <div className="text-[11px] font-mono text-slate-400">PM10 (DUST)</div>
          <div className="text-xl font-extrabold font-mono text-white mt-1">
            {metrics.pm10} <span className="text-xs font-normal text-slate-400">µg/m³</span>
          </div>
        </div>
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5">
          <div className="text-[11px] font-mono text-slate-400">NO₂ (TRAFFIC)</div>
          <div className="text-xl font-extrabold font-mono text-white mt-1">
            {metrics.no2} <span className="text-xs font-normal text-slate-400">µg/m³</span>
          </div>
        </div>
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5">
          <div className="text-[11px] font-mono text-slate-400">O₃ (OZONE)</div>
          <div className="text-xl font-extrabold font-mono text-white mt-1">
            {metrics.o3} <span className="text-xs font-normal text-slate-400">µg/m³</span>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-xl bg-rose-950/30 border border-rose-900/50 p-3.5">
          <div className="text-[11px] font-mono text-rose-300 flex items-center gap-1">
            <Cigarette className="w-3.5 h-3.5" aria-hidden="true" /> PASSIVE LOAD
          </div>
          <div className="text-xl font-extrabold font-mono text-rose-400 mt-1">
            ~{cigaretteEquivalent} <span className="text-xs font-normal text-rose-300">cigs/day</span>
          </div>
        </div>
      </div>

      {/* Exposure Windows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-start gap-3 rounded-xl bg-slate-950/90 border border-slate-800 p-3.5">
          <Clock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <div className="text-[11px] font-mono font-bold text-cyan-400 uppercase">Safe Outdoor Dispersion Window</div>
            <div className="text-sm font-medium text-slate-200 mt-0.5">{severity.safeOutdoorWindow}</div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-slate-950/90 border border-slate-800 p-3.5">
          {severity.maskRequired ? (
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <Wind className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div>
            <div className="text-[11px] font-mono font-bold text-slate-300 uppercase">Respiratory Protocol</div>
            <div className="text-sm font-medium text-slate-200 mt-0.5">
              {severity.maskRequired
                ? 'N95 / FFP2 Respirator Mandatory Outdoors'
                : 'Standard Breathable Air — Mask Optional'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};