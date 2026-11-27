import React from 'react';
import { ShieldAlert, Clock, Wind, Activity } from 'lucide-react';
import { AirQualityMetrics } from '../types/airQuality';
import { classifyAqiSeverity } from '../utils/aqiLogic';

interface AqiDashboardProps {
  metrics: AirQualityMetrics;
}

export const AqiDashboard: React.FC<AqiDashboardProps> = ({ metrics }) => {
  const severity = classifyAqiSeverity(metrics.aqi);

  return (
    <section
      aria-label="Live Air Quality Status"
      className={`rounded-2xl border-2 ${severity.borderColor} bg-white p-6 shadow-sm space-y-5`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              {metrics.city}
            </h2>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {metrics.isSimulated ? 'Simulated Smog' : `Live • ${metrics.timestamp}`}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-0.5">{metrics.country}</p>
        </div>

        <div className={`px-4 py-2 rounded-xl ${severity.badgeColor} ${severity.textColor} text-right`}>
          <div className="text-xs font-bold uppercase tracking-wider">US AQI Status</div>
          <div className="text-2xl font-extrabold">
            {metrics.aqi} — {severity.label}
          </div>
        </div>
      </div>

      {/* Pollutant Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
          <div className="text-xs font-semibold text-slate-500">PM2.5 (Fine Soot)</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">{metrics.pm25} <span className="text-xs font-normal">µg/m³</span></div>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
          <div className="text-xs font-semibold text-slate-500">PM10 (Road Dust)</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">{metrics.pm10} <span className="text-xs font-normal">µg/m³</span></div>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
          <div className="text-xs font-semibold text-slate-500">NO₂ (Traffic Gas)</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">{metrics.no2} <span className="text-xs font-normal">µg/m³</span></div>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
          <div className="text-xs font-semibold text-slate-500">O₃ (Ground Ozone)</div>
          <div className="text-lg font-bold text-slate-900 mt-0.5">{metrics.o3} <span className="text-xs font-normal">µg/m³</span></div>
        </div>
      </div>

      {/* Actionable Exposure Guidance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="flex items-start gap-2.5 rounded-xl bg-sky-50 border border-sky-200 p-3.5">
          <Clock className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <div className="text-xs font-bold text-sky-950 uppercase">Safe Outdoor Dispersion Window</div>
            <div className="text-sm font-medium text-sky-900 mt-0.5">{severity.safeOutdoorWindow}</div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 border border-slate-200 p-3.5">
          {severity.maskRequired ? (
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <Wind className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <div>
            <div className="text-xs font-bold text-slate-900 uppercase">Respiratory Protection</div>
            <div className="text-sm font-medium text-slate-700 mt-0.5 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              {severity.maskRequired
                ? 'N95 / FFP2 Mask Mandatory Outdoors'
                : 'Standard Breathable Air — No Mask Needed'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};