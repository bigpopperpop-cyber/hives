
import React, { useState, useEffect } from 'react';
import { HiveEntry, AnalysisResult } from '../types';
import { analyzeHiveData } from '../services/geminiService';

interface AnalysisPanelProps {
  entries: HiveEntry[];
  onAnalysisDone?: (result: AnalysisResult) => void;
}

// Removed redundant Window/aistudio declaration to resolve TypeScript modifier and type conflicts.
// The environment provides window.aistudio with the AIStudio type globally.

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ entries, onAnalysisDone }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsKey, setNeedsKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      // Use type assertion to bypass conflict with the pre-existing global aistudio declaration
      const aistudio = (window as any).aistudio;
      if (aistudio) {
        const hasKey = await aistudio.hasSelectedApiKey();
        setNeedsKey(!hasKey && !process.env.API_KEY);
      }
    };
    checkKey();
  }, []);

  const handleAnalyze = async (isRetry = false) => {
    const aistudio = (window as any).aistudio;
    
    // If we definitely don't have a key and are in an environment that supports selecting one.
    // To mitigate race conditions, we assume success and proceed if isRetry is true.
    if (!isRetry && aistudio && !(await aistudio.hasSelectedApiKey()) && !process.env.API_KEY) {
      setNeedsKey(true);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await analyzeHiveData(entries);
      setAnalysis(result);
      if (onAnalysisDone) onAnalysisDone(result);
    } catch (err: any) {
      console.error("Analysis Panel Error:", err);
      const msg = err.message || "";
      
      // Handle the specific "key not found" or missing key errors as per guidelines
      if (msg.includes("Requested entity was not found") || msg.includes("API key")) {
        setNeedsKey(true);
        setError("API configuration required. Please select a valid API key from a paid project.");
      } else {
        setError(msg || "Failed to generate AI insights. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenKeyDialog = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      await aistudio.openSelectKey();
      // MUST assume the key selection was successful after triggering openSelectKey() and proceed to the app.
      setNeedsKey(false);
      handleAnalyze(true);
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
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Smart Pattern Analysis
        </h2>
        <p className="text-indigo-200 mb-6 max-w-lg">
          Our AI analyzes your breakout patterns to identify hidden triggers and suggest management strategies.
        </p>

        {needsKey ? (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-2">API Setup Required</h3>
            <p className="text-sm text-indigo-200 mb-6">
              To use AI insights, you must select an API key from a <strong>paid Google Cloud project</strong>. 
              Learn more about <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">billing and project setup</a>.
            </p>
            <button
              onClick={handleOpenKeyDialog}
              className="bg-white text-indigo-900 font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:bg-indigo-50 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Select API Key
            </button>
          </div>
        ) : analysis ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-5 border border-white/10">
              <h3 className="text-indigo-300 font-semibold mb-2 flex items-center">
                <span className="w-2 h-2 bg-rose-400 rounded-full mr-2"></span>
                Top Suspected Triggers
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.commonTriggers.length > 0 ? (
                  analysis.commonTriggers.map((t, i) => (
                    <span key={i} className="bg-rose-500/30 text-rose-100 px-3 py-1 rounded-full text-sm">
                      {t}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 text-sm">Insufficient data for triggers</span>
                )}
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-5 border border-white/10">
              <h3 className="text-indigo-300 font-semibold mb-2">Severity Trend</h3>
              <p className="text-sm leading-relaxed">{analysis.severityTrend}</p>
            </div>

            <div className="md:col-span-2 bg-white/10 rounded-xl p-5 border border-white/10">
              <h3 className="text-indigo-300 font-semibold mb-2">Identified Patterns</h3>
              <p className="text-sm leading-relaxed">{analysis.potentialPatterns}</p>
            </div>

            <div className="md:col-span-2 bg-indigo-500/20 rounded-xl p-5 border border-indigo-400/30">
              <h3 className="text-emerald-300 font-semibold mb-2">Health Recommendations</h3>
              <p className="text-sm leading-relaxed italic">"{analysis.advice}"</p>
            </div>
            
            <button 
              onClick={() => handleAnalyze()}
              disabled={loading}
              className="md:col-span-2 mt-2 text-indigo-300 hover:text-white text-sm font-medium underline underline-offset-4"
            >
              Re-run analysis
            </button>
          </div>
        ) : (
          <div>
            {entries.length < 3 && (
              <div className="bg-indigo-800/50 rounded-xl p-4 text-indigo-100 text-sm border border-indigo-700/50 mb-6">
                💡 Add at least 3 entries for more accurate AI trend analysis.
              </div>
            )}
            <button
              onClick={() => handleAnalyze()}
              disabled={loading || entries.length === 0}
              className={`bg-white text-indigo-900 font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:bg-indigo-50 disabled:opacity-50 flex items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Logs...
                </>
              ) : "Analyze My History"}
            </button>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-200 text-xs flex items-center">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;
