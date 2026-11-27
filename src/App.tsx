import React, { useState, useEffect, useCallback } from 'react';
import { Wind } from 'lucide-react';
import { UserContextProfile, AirQualityMetrics, AiAdvisoryPlan } from './types/airQuality';
import { fetchCityAirQuality } from './services/weatherService';
import { generateAirQualityPlan } from './services/geminiService';
import { ContextForm } from './components/ContextForm';
import { AqiDashboard } from './components/AqiDashboard';
import { ActionPlanTabs } from './components/ActionPlanTabs';
import { ImpactExplainer } from './components/ImpactExplainer';

export function App() {
  const [profile, setProfile] = useState<UserContextProfile>({
    city: 'New Delhi',
    sensitivity: 'children',
    housing: 'apartment_high',
    commute: 'car_bike',
    simulatedSmogAqi: null,
  });

  const [metrics, setMetrics] = useState<AirQualityMetrics | null>(null);
  const [plan, setPlan] = useState<AiAdvisoryPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const runAnalysis = useCallback(async (currentProfile: UserContextProfile) => {
    setIsLoading(true);
    try {
      const liveMetrics = await fetchCityAirQuality(
        currentProfile.city,
        currentProfile.simulatedSmogAqi
      );
      setMetrics(liveMetrics);
      const advisory = await generateAirQualityPlan(currentProfile, liveMetrics);
      setPlan(advisory);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    runAnalysis(profile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnalyzeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runAnalysis(profile);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-600 text-white">
              <Wind className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                VayuMitra AI — Urban Air Quality Assistant
              </h1>
              <p className="text-xs text-slate-300">
                GenAI Winter Smog Navigator • Low-Emission Routines & Indoor Air Defense
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-sky-300 border border-slate-700">
            PromptWars Challenge 6
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-6" aria-live="polite">
        <ContextForm
          profile={profile}
          onChange={setProfile}
          onAnalyze={handleAnalyzeSubmit}
          isLoading={isLoading}
        />

        {metrics && <AqiDashboard metrics={metrics} />}

        {plan && <ActionPlanTabs plan={plan} />}

        {metrics && <ImpactExplainer metrics={metrics} />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        Built for families & urban communities navigating winter smog • Powered by Open-Meteo & GenAI
      </footer>
    </div>
  );
}

export default App;