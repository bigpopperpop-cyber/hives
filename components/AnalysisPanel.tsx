import React, { useState } from 'react';
import { HiveEntry, AnalysisResult } from '../types';
import { analyzeHiveData } from '../services/geminiService';

interface AnalysisPanelProps {
  entries: HiveEntry[];
  onAnalysisDone?: (result: AnalysisResult) => void;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ entries, onAnalysisDone }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (entries.length < 3) return;

    setLoading(true);
    try {
      const result = await analyzeHiveData(entries);
      setAnalysis(result);
      if (onAnalysisDone) onAnalysisDone(result);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  const confidenceScore = Math.min(Math.round((entries.length / 12) * 100), 100);

  return (
    <div className="bg-slate-900 text-white rounded-[2.5rem] shadow-2xl p-8 lg:p-12 overflow-hidden relative border border-white/10">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
          <div className="max-w-xl">
            <div className="flex items-center space-x-3 mb-3">
              <h2 className="text-3xl font-extrabold tracking-tight">Smart Pattern Analysis</h2>
              <div className="flex items-center bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full mr-2 bg-emerald-400"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Local Engine</span>
              </div>
            </div>
            <p className="text-slate-400 text-base">
              Correlations found locally. <span className="text-indigo-400 font-medium">100% Private.</span>
            </p>
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={loading || entries.length < 3}
            className="group bg-white hover:bg-slate-50 disabled:bg-slate-800 text-slate-900 font-black py-4 px-12 rounded-2xl transition-all shadow-xl flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50 h-16 min-w-[240px]"
          >
            {loading ? "Analyzing..." : "Reveal Insights"}
          </button>
        </div>

        {!analysis ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            {entries.length < 3 ? (
              <p className="text-slate-500">Log <span className="text-white font-bold">3 entries</span> to enable analysis.</p>
            ) : (
              <p className="text-slate-300">Your logs are ready for analysis.</p>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                <h3 className="text-rose-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center">
                  <span className="w-2 h-2 bg-rose-500 rounded-full mr-3"></span>Common Triggers
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.commonTriggers.map((t, i) => (
                    <span key={i} className="bg-rose-500/10 text-rose-100 border border-rose-500/20 px-3 py-1 rounded-xl text-xs font-bold">{t}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>Trend
                </h3>
                <p className="text-slate-200 text-sm font-medium">{analysis.severityTrend}</p>
              </div>

              {analysis.environmentInsights && (
                <div className="md:col-span-2 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-8 backdrop-blur-md">
                  <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                    Climate Insights
                  </h3>
                  <p className="text-indigo-50 text-sm font-bold italic">"{analysis.environmentInsights}"</p>
                </div>
              )}

              <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                <h3 className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>Patterns
                </h3>
                <p className="text-slate-200 text-sm font-medium">{analysis.potentialPatterns}</p>
              </div>

              <div className="md:col-span-2 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8">
                <h3 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center">Advice</h3>
                <p className="text-emerald-50 text-base italic font-medium">"{analysis.advice}"</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;