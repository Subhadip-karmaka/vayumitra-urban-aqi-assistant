import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { AirQualityMetrics } from '../types/airQuality';
import { calculateExposureReduction } from '../utils/aqiLogic';

interface ImpactExplainerProps {
  metrics: AirQualityMetrics;
}

export const ImpactExplainer: React.FC<ImpactExplainerProps> = ({ metrics }) => {
  const [usesN95, setUsesN95] = useState(true);
  const reductionPercent = calculateExposureReduction(metrics, usesN95);

  return (
    <section
      aria-label="Interactive Personal Impact Calculator"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">3. Direct Choice Impact Simulator</h2>
          <p className="text-sm text-slate-600">
            See how combining timed indoor sealing with respiratory protection lowers weekly PM2.5 lung intake.
          </p>
        </div>

        <label className="inline-flex items-center gap-2 cursor-pointer bg-slate-100 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={usesN95}
            onChange={(e) => setUsesN95(e.target.checked)}
            className="w-4 h-4 accent-sky-700"
          />
          Include N95 / FFP2 Outdoor Mask
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-2 space-y-2">
          <div className="flex justify-between text-sm font-bold text-slate-800">
            <span>Estimated Weekly PM2.5 Inhalation Reduction</span>
            <span className="text-sky-700">{reductionPercent}% Lower Exposure</span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-sky-600 to-emerald-500 transition-all duration-300"
              style={{ width: `${reductionPercent}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
            Calculated against unmitigated outdoor exposure at {metrics.pm25} µg/m³ PM2.5 in {metrics.city}.
          </p>
        </div>

        <div className="rounded-xl bg-sky-50 border border-sky-200 p-4 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-sky-700 shrink-0" aria-hidden="true" />
          <div className="text-xs text-sky-950">
            <div className="font-bold text-sm">Why This Matters</div>
            Every 10 µg/m³ drop in sustained PM2.5 exposure measurably reduces winter bronchial inflammation and pediatric asthma flare-ups.
          </div>
        </div>
      </div>
    </section>
  );
};