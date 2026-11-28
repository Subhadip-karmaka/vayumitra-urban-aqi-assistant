import React, { useState, useEffect, useCallback } from 'react';
import { Wind, Terminal } from 'lucide-react';
import { UserContextProfile, AirQualityMetrics, AiAdvisoryPlan } from './types/airQuality';
import { fetchCityAirQuality } from './services/weatherService';
import { generateAirQualityPlan } from './services/geminiService';
import { ContextForm } from './components/ContextForm';
import { AqiDashboard } from './components/AqiDashboard';
import { InversionChart } from './components/InversionChart';
import { ActionPlanTabs } from './components/ActionPlanTabs';
import { HabitTracker } from './components/HabitTracker';

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
  let isCancelled = false;

  const initializeTelemetry = async () => {
    try {
      const liveMetrics = await fetchCityAirQuality(
        profile.city,
        profile.simulatedSmogAqi
      );
      const initialPlan = await generateAirQualityPlan(profile, liveMetrics);
      if (!isCancelled) {
        setMetrics(liveMetrics);
        setPlan(initialPlan);
        setIsLoading(false);
      }
    } catch {
      if (!isCancelled) {
        setIsLoading(false);
      }
    }
  };

  void initializeTelemetry();
  return () => {
    isCancelled = true;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const handleAnalyzeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runAnalysis(profile);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <header className="sticky top-0 z-20 backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 text-slate-950 shadow-lg shadow-cyan-500/20">
              <Wind className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  VayuMitra<span className="text-cyan-400">.ai</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  <Terminal className="w-3 h-3 text-cyan-400" /> v2.0-smog-engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Urban Air Quality Telemetry & GenAI Winter Smog Navigator
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/70">
            PromptWars // Challenge 6
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-6" aria-live="polite">
        <ContextForm
          profile={profile}
          onChange={setProfile}
          onAnalyze={handleAnalyzeSubmit}
          isLoading={isLoading}
        />

        {metrics && <AqiDashboard metrics={metrics} />}

        {metrics && <InversionChart baseAqi={metrics.aqi} city={metrics.city} />}

        {plan && <ActionPlanTabs plan={plan} />}

        {metrics && plan && (
          <HabitTracker metrics={metrics} communityAction={plan.communityAction} />
        )}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-5 text-center text-xs font-mono text-slate-500">
        VayuMitra.ai • Engineered for Families & Urban Communities • Live Open-Meteo + GenAI
      </footer>
    </div>
  );
}

export default App;