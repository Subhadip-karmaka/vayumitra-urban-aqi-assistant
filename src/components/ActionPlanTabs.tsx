import React, { useState } from 'react';
import { CalendarClock, Home, Leaf, HeartPulse, Sprout, Users } from 'lucide-react';
import { AiAdvisoryPlan, ActionRecommendation } from '../types/airQuality';

interface ActionPlanTabsProps {
  plan: AiAdvisoryPlan;
}

type TabKey = 'routines' | 'indoor' | 'sustainable';

export const ActionPlanTabs: React.FC<ActionPlanTabsProps> = ({ plan }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('routines');

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; items: ActionRecommendation[] }[] = [
    {
      key: 'routines',
      label: 'Low-Emission Daily Routines',
      icon: <CalendarClock className="w-4 h-4" aria-hidden="true" />,
      items: plan.lowEmissionRoutines,
    },
    {
      key: 'indoor',
      label: 'Indoor Air Quality Hacks',
      icon: <Home className="w-4 h-4" aria-hidden="true" />,
      items: plan.indoorAirHacks,
    },
    {
      key: 'sustainable',
      label: 'Sustainable Alternatives',
      icon: <Leaf className="w-4 h-4" aria-hidden="true" />,
      items: plan.sustainableAlternatives,
    },
  ];

  const currentTab = tabs.find((t) => t.key === activeTab)!;

  return (
    <section
      aria-label="GenAI Winter Smog Action Recommendations"
      className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="max-w-3xl">
          <h2 className="text-lg font-bold text-white">2. GenAI Tailored Smog Defense Strategy</h2>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed">{plan.smogSummary}</p>
        </div>
        <span className="text-xs font-mono font-semibold px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800">
          {plan.generatedBy}
        </span>
      </div>

      {/* Category Tabs */}
      <div role="tablist" aria-label="Action Categories" className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {tabs.map((tab) => {
          const isSelected = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div role="tabpanel" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentTab.items.map((item, idx) => (
          <article
            key={idx}
            className="rounded-xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-white text-base">{item.title}</h3>
                <span className="shrink-0 text-[11px] font-mono px-2.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                  Effort: {item.effortLevel}
                </span>
              </div>
              <div className="text-xs font-mono text-cyan-400">{item.timingOrFrequency}</div>
              <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-start gap-2 text-emerald-300 bg-emerald-950/40 border border-emerald-900/60 rounded-lg p-2.5">
                <HeartPulse className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-bold text-emerald-200">Direct Health Impact: </span>
                  {item.directHealthImpact}
                </div>
              </div>
              <div className="flex items-start gap-2 text-cyan-300 bg-cyan-950/40 border border-cyan-900/60 rounded-lg p-2.5">
                <Sprout className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-bold text-cyan-200">Emissions Saved: </span>
                  {item.emissionReduction}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Community Multiplier */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-950/80 to-slate-950 border border-emerald-800/60 p-4 flex items-start gap-3">
        <Users className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-sm text-slate-200">
          <span className="font-bold text-emerald-300">Neighborhood Multiplier: </span>
          {plan.communityAction}
        </div>
      </div>
    </section>
  );
};