
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
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (entries.length < 3) {
      setError("Please log at least 3 entries to provide enough context for the AI.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await analyzeHiveData(entries);
      setAnalysis(result);
      if (onAnalysisDone) onAnalysisDone(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate AI insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-900 text-white rounded-2xl shadow-xl p-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
        </svg>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center mb-1">
              <h2 className="text-2xl font-bold flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Smart Pattern Analysis
              </h2>
              <div className="ml-3 flex items-center bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse mr-2"></span>
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">AI Service Online</span>
              </div>
            </div>
            <p className="text-indigo-200">
              Personalized insights based on your logged patterns.
            </p>
          </div>
          
          {!analysis && (
            <button
              onClick={handleAnalyze}
              disabled={loading || entries.length < 3}
              className={`bg-white text-indigo-900 font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:bg-indigo-50 disabled:opacity-50 flex items-center whitespace-nowrap active:scale-95`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Crunching Data...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.477 2.387a2 2 0 00.547 1.022l1.428 1.428a2 2 0 001.022.547l2.387.477a2 2 0 001.96-1.414l.477-2.387a2 2 0 00-.547-1.022l-1.428-1.428z" />
                  </svg>
                  Analyze My Patterns
                </>
              )}
            </button>
          )}
        </div>

        {analysis ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-white/10 rounded-xl p-5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-indigo-300 font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                Key Suspect Triggers
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.commonTriggers.length > 0 ? (
                  analysis.commonTriggers.map((t, i) => (
                    <span key={i} className="bg-rose-500/30 text-rose-100 px-3 py-1 rounded-full text-sm font-medium">
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-sm italic">Insufficient data to pinpoint triggers</span>
                )}
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-indigo-300 font-semibold mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Trend Analysis
              </h3>
              <p className="text-sm leading-relaxed text-indigo-50">{analysis.severityTrend}</p>
            </div>

            <div className="md:col-span-2 bg-white/10 rounded-xl p-5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-indigo-300 font-semibold mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Identified Patterns
              </h3>
              <p className="text-sm leading-relaxed text-indigo-50">{analysis.potentialPatterns}</p>
            </div>

            <div className="md:col-span-2 bg-emerald-500/10 rounded-xl p-5 border border-emerald-400/20">
              <h3 className="text-emerald-300 font-semibold mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Management Suggestions
              </h3>
              <p className="text-sm leading-relaxed italic text-emerald-50">"{analysis.advice}"</p>
            </div>
            
            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className="md:col-span-2 mt-2 text-indigo-300 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
            >
              Re-run analysis with latest data
            </button>
          </div>
        ) : entries.length < 3 ? (
          <div className="bg-indigo-800/50 rounded-xl p-4 text-indigo-100 text-sm border border-indigo-700/50 flex items-center shadow-inner">
            <svg className="w-5 h-5 mr-3 text-indigo-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Log at least <strong>3 entries</strong> to enable AI pattern detection.</span>
          </div>
        ) : (
          <div className="bg-indigo-800/30 rounded-xl p-4 text-indigo-200 text-sm border border-indigo-700/30">
            <p>Your history is ready for processing. Click the button above to generate insights.</p>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-100 text-sm flex items-start">
             <svg className="w-5 h-5 mr-3 flex-shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             <div>
               <p className="font-bold mb-1">Analysis Error</p>
               <p>{error}</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;
