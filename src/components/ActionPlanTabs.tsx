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
    <section aria-label="GenAI Winter Smog Action Recommendations" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">2. Tailored GenAI Smog Strategy</h2>
          <p className="text-sm text-slate-600 mt-0.5">{plan.smogSummary}</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-100 text-sky-900">
          Powered by {plan.generatedBy}
        </span>
      </div>

      {/* Thermal Inversion Banner */}
      <div role="status" className="rounded-xl bg-indigo-50 border border-indigo-200 p-3.5 text-sm text-indigo-950 font-medium">
        {plan.inversionAlert}
      </div>

      {/* Accessible Tab Buttons */}
      <div role="tablist" aria-label="Action Categories" className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {tabs.map((tab) => {
          const isSelected = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-sky-600 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Recommendation Cards with Quantified Direct Impact */}
      <div role="tabpanel" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentTab.items.map((item, idx) => (
          <article
            key={idx}
            className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <span className="shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                  Effort: {item.effortLevel}
                </span>
              </div>
              <div className="text-xs font-semibold text-sky-700">{item.timingOrFrequency}</div>
              <p className="text-sm text-slate-700 leading-relaxed">{item.description}</p>
            </div>

            {/* Direct Impact Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-200/80 text-xs">
              <div className="flex items-start gap-2 text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5">
                <HeartPulse className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-bold">Direct Health Impact: </span>
                  {item.directHealthImpact}
                </div>
              </div>
              <div className="flex items-start gap-2 text-teal-900 bg-teal-50 border border-teal-200 rounded-lg p-2.5">
                <Sprout className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="font-bold">Emissions Saved: </span>
                  {item.emissionReduction}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Community Multiplier */}
      <div className="rounded-xl bg-emerald-950 text-emerald-50 p-4 flex items-start gap-3">
        <Users className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-sm">
          <span className="font-bold text-emerald-200">Community Smog Action: </span>
          {plan.communityAction}
        </div>
      </div>
    </section>
  );
};