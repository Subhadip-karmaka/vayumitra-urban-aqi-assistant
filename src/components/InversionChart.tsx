import React from 'react';
import { Sun, Moon, AlertTriangle } from 'lucide-react';

interface InversionChartProps {
  baseAqi: number;
  city: string;
}

const HOURS = [
  { label: '12 AM', factor: 1.15 },
  { label: '3 AM', factor: 1.22 },
  { label: '6 AM', factor: 1.35 },
  { label: '9 AM', factor: 1.28 },
  { label: '12 PM', factor: 0.78 },
  { label: '2 PM', factor: 0.65 },
  { label: '5 PM', factor: 0.85 },
  { label: '8 PM', factor: 1.25 },
  { label: '11 PM', factor: 1.30 },
];

export const InversionChart: React.FC<InversionChartProps> = ({ baseAqi, city }) => {
  const points = HOURS.map((h, idx) => {
    const val = Math.min(500, Math.round(baseAqi * h.factor));
    const x = 40 + idx * 75;
    const y = 150 - Math.min(125, (val / 450) * 125);
    return { ...h, val, x, y };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const areaPoints = `40,150 ${polylinePoints} ${points[points.length - 1].x},150`;

  return (
    <section
      aria-label="24-Hour Winter Thermal Inversion Curve"
      className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-base font-bold text-white tracking-tight">
              24-Hour Winter Thermal Inversion Telemetry — {city}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cold morning & night air traps smog near ground level; solar heating opens a safer dispersion window at 12 PM – 3 PM.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-rose-400">
            <Moon className="w-3.5 h-3.5" aria-hidden="true" /> Smog Trap
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <Sun className="w-3.5 h-3.5" aria-hidden="true" /> Safe Window
          </span>
        </div>
      </div>

      {/* Responsive SVG Curve */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox="0 0 680 185"
          role="img"
          aria-label={`Hourly AQI curve for ${city} peaking in early morning and dropping around 2 PM`}
          className="w-full min-w-[540px] h-auto"
        >
          <defs>
            <linearGradient id="smogGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Safe Dispersion Highlight Band (12 PM - 3 PM) */}
          <rect x="330" y="18" width="110" height="132" rx="8" fill="#10b981" fillOpacity="0.12" />
          <text x="385" y="33" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">
            SAFE WINDOW
          </text>

          {/* Baseline grid */}
          <line x1="30" y1="150" x2="655" y2="150" stroke="#334155" strokeWidth="1" />
          <line x1="30" y1="85" x2="655" y2="85" stroke="#1e293b" strokeDasharray="4 4" strokeWidth="1" />

          {/* Area & Line */}
          <polygon points={areaPoints} fill="url(#smogGrad)" />
          <polyline
            fill="none"
            stroke="#22d3ee"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />

          {/* Data Nodes */}
          {points.map((pt, i) => {
            const isSafe = pt.label === '12 PM' || pt.label === '2 PM';
            return (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill={isSafe ? '#10b981' : '#f43f5e'}
                  stroke="#0f172a"
                  strokeWidth="2"
                />
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fill={isSafe ? '#6ee7b7' : '#e2e8f0'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {pt.val}
                </text>
                <text x={pt.x} y="170" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {baseAqi > 200 && (
        <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/50 border border-amber-800/60 rounded-xl px-3.5 py-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
          <span>
            <strong>Inversion Advisory:</strong> Avoid outdoor jogging or school bus waiting before 10:30 AM when ground-level PM2.5 concentrates by +35%.
          </span>
        </div>
      )}
    </section>
  );
};