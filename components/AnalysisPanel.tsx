
import React, { useState } from 'react';
import { HiveEntry, AnalysisResult } from '../types';
import { analyzeHiveData } from '../services/geminiService';

interface AnalysisPanelProps {
  entries: React.ReactNode; // Actually HiveEntry[], updated for component usage
  entriesList: HiveEntry[];
  onAnalysisDone?: (result: AnalysisResult) => void;
}

// Fixed props for consistency with App.tsx
const AnalysisPanel: React.FC<{ entries: HiveEntry[], onAnalysisDone?: (result: AnalysisResult) => void }> = ({ entries, onAnalysisDone }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [usingAI, setUsingAI] = useState(false);

  const handleAnalyze = async () => {
    if (entries.length < 3) return;

    setLoading(true);
    try {
      const result = await analyzeHiveData(entries);
      setAnalysis(result);
      
      // Determine what engine we used for the badge
      const keyAvailable = !!process.env.API_KEY && process.env.API_KEY !== "undefined" && process.env.API_KEY.length > 10;
      setUsingAI(keyAvailable);
      
      if (onAnalysisDone) onAnalysisDone(result);
    } catch (err) {
      console.error("Analysis process failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-[2.5rem] shadow-2xl p-8 lg:p-12 overflow-hidden relative border border-white/10">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
          <div className="max-w-xl">
            <div className="flex items-center space-x-3 mb-3">
              <h2 className="text-3xl font-extrabold tracking-tight">Smart Pattern Analysis</h2>
              <div className="flex items-center bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl">
                <span className={`w-2 h-2 rounded-full mr-2 ${analysis ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-500 animate-pulse'}`}></span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                  {analysis ? (usingAI ? 'Cloud-AI' : 'Local Engine') : 'System Ready'}
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-base leading-relaxed">
              We correlate your symptoms with suspected triggers to identify hidden health patterns.
              <span className="text-indigo-400 font-medium ml-1">Now works 100% offline.</span>
            </p>
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={loading || entries.length < 3}
            className="group bg-white hover:bg-rose-50 disabled:bg-slate-800 text-slate-900 font-black py-4 px-12 rounded-2xl transition-all shadow-xl shadow-white/5 flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50 h-16"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-rose-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-rose-600">Identifying Patterns...</span>
              </>
            ) : (
              <>
                <span className="text-lg">Generate Insights</span>
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
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
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <p className="text-slate-400 font-semibold mb-2">Insufficient Data</p>
                <p className="text-slate-500 text-sm">Please log <span className="text-white">at least 3 entries</span> to enable the smart analysis engine.</p>
              </div>
            ) : (
              <div className="max-w-xs mx-auto">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-slate-300 font-bold mb-2">History Ready</p>
                <p className="text-slate-500 text-sm">Your logs are processed and ready for analysis. Click the button to reveal your personal insights.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Common Triggers */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:border-rose-500/30 transition-colors">
              <h3 className="text-rose-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center">
                <span className="w-2 h-2 bg-rose-500 rounded-full mr-3 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                Key Suspect Triggers
              </h3>
              <div className="flex flex-wrap gap-3">
                {analysis.commonTriggers.length > 0 ? (
                  analysis.commonTriggers.map((t, i) => (
                    <span key={i} className="bg-rose-500/10 text-rose-100 border border-rose-500/20 px-4 py-2 rounded-2xl text-sm font-bold">
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-sm italic font-medium">No recurring triggers detected yet.</span>
                )}
              </div>
            </div>

            {/* Severity Trend */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:border-indigo-500/30 transition-colors">
              <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                Intensity Trend
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed font-medium">{analysis.severityTrend}</p>
            </div>

            {/* Potential Patterns */}
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md hover:border-amber-500/30 transition-colors">
              <h3 className="text-amber-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                Detected Patterns
              </h3>
              <p className="text-slate-200 text-sm leading-relaxed font-medium">{analysis.potentialPatterns}</p>
            </div>

            {/* Advice */}
            <div className="md:col-span-2 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8">
              <h3 className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center">
                <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Health Management Suggestions
              </h3>
              <p className="text-emerald-50 text-base leading-relaxed italic font-medium">"{analysis.advice}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;
