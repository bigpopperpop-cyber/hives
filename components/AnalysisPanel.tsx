
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

  const confidenceScore = Math.min(Math.round((entries.length / 15) * 100), 100);

  return (
    <div className="bg-slate-900 text-white rounded-[2.5rem] shadow-2xl p-8 lg:p-12 overflow-hidden relative border border-white/10">
      {/* Background visual flair */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
          <div className="max-w-xl">
            <div className="flex items-center space-x-3 mb-3">
              <h2 className="text-3xl font-extrabold tracking-tight">Intelligence Insights</h2>
              <div className="flex items-center bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full mr-2 bg-emerald-400"></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
                  Built-in Engine Active
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-base leading-relaxed">
              Our pattern matching logic correlates your history to find triggers.
              <span className="text-indigo-400 font-medium ml-1">Privacy-first: Analysis happens entirely on this device.</span>
            </p>
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={loading || entries.length < 3}
            className="group bg-white hover:bg-slate-100 disabled:bg-slate-800 text-slate-900 font-black py-4 px-12 rounded-2xl transition-all shadow-xl shadow-white/5 flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50 h-16 min-w-[240px]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-indigo-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-indigo-600">Calculating...</span>
              </>
            ) : (
              <>
                <span className="text-lg">Run Analysis</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </>
            )}
          </button>
        </div>

        {!analysis ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center backdrop-blur-sm">
            {entries.length < 3 ? (
              <div className="max-w-xs mx-auto">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-slate-400 font-semibold mb-2">Awaiting Data</p>
                <p className="text-slate-500 text-sm">Please log <span className="text-white">at least 3 entries</span> to unlock the pattern recognition engine.</p>
                <div className="mt-6 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-1000" 
                    style={{ width: `${(entries.length / 3) * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="max-w-xs mx-auto">
                <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-300 font-bold mb-2">Ready to Process</p>
                <p className="text-slate-500 text-sm">Your log history is sufficient. Click 'Run Analysis' to see current patterns and correlations.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Common Triggers */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                <h3 className="text-rose-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center">
                  <span className="w-2 h-2 bg-rose-500 rounded-full mr-3 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                  Top Suspected Triggers
                </h3>
                <div className="flex flex-wrap gap-3">
                  {analysis.commonTriggers.length > 0 ? (
                    analysis.commonTriggers.map((t, i) => (
                      <span key={i} className="bg-rose-500/10 text-rose-100 border border-rose-500/20 px-4 py-2 rounded-2xl text-sm font-bold">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-sm italic font-medium">Insufficient recurring triggers.</span>
                  )}
                </div>
              </div>

              {/* Severity Trend */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                  Evolution Trend
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed font-medium">{analysis.severityTrend}</p>
              </div>

              {/* Potential Patterns */}
              <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                <h3 className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center">
                  <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                  Correlational Patterns
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed font-medium">{analysis.potentialPatterns}</p>
              </div>

              {/* Advice */}
              <div className="md:col-span-2 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Management Advice
                    </h3>
                    <p className="text-emerald-50 text-base leading-relaxed italic font-medium">"{analysis.advice}"</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 min-w-[140px] text-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-widest">Confidence</div>
                    <div className="text-2xl font-black text-white">{confidenceScore}%</div>
                    <div className="w-full h-1 bg-slate-700 mt-2 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: `${confidenceScore}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={handleAnalyze}
                className="text-slate-500 hover:text-indigo-400 text-xs font-bold uppercase tracking-widest transition-colors flex items-center"
              >
                <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;
