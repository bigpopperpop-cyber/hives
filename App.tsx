
import React, { useState, useEffect } from 'react';
import HiveForm from './components/HiveForm';
import HistoryCharts from './components/HistoryCharts';
import AnalysisPanel from './components/AnalysisPanel';
import SyncPage from './components/SyncPage';
import DoctorReport from './components/DoctorReport';
import { HiveEntry, AnalysisResult } from './types';
import { STORAGE_KEY } from './constants';

type Tab = 'log' | 'history' | 'sync';

const App: React.FC = () => {
  const [entries, setEntries] = useState<HiveEntry[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('log');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToStorage = (data: HiveEntry[]) => {
    setEntries(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const addEntry = (entry: HiveEntry) => {
    const updated = [entry, ...entries];
    saveToStorage(updated);
    setActiveTab('history');
  };

  const deleteEntry = (id: string) => {
    if (!window.confirm("Delete this entry?")) return;
    const updated = entries.filter(e => e.id !== id);
    saveToStorage(updated);
  };

  const handleImport = (importedEntries: HiveEntry[]) => {
    const existingIds = new Set(entries.map(e => e.id));
    const newEntries = importedEntries.filter(e => !existingIds.has(e.id));
    const updated = [...newEntries, ...entries].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    saveToStorage(updated);
    alert(`Successfully imported ${newEntries.length} new logs.`);
    setActiveTab('history');
  };

  const handleClear = () => {
    saveToStorage([]);
    alert("All logs cleared.");
  };

  const generatePDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 no-print">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center shadow-sm shadow-rose-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">HiveTracker Pro</h1>
              <div className="flex items-center mt-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-1.5"></span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Local Storage Active</span>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-2">
            <button 
              onClick={() => setActiveTab('log')}
              className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${activeTab === 'log' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              Log Entry
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${activeTab === 'history' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              History & Insights
            </button>
            <button 
              onClick={() => setActiveTab('sync')}
              className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all ${activeTab === 'sync' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              Sync & Backup
            </button>
          </nav>

          <div className="hidden lg:block border-l border-slate-200 ml-4 pl-4">
             <span className="text-[10px] text-slate-400 font-medium">Core features work offline • No key required</span>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setActiveTab('log')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'log' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          <span className="text-[10px] font-bold uppercase">Log</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'history' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <span className="text-[10px] font-bold uppercase">Stats</span>
        </button>
        <button 
          onClick={() => setActiveTab('sync')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'sync' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          <span className="text-[10px] font-bold uppercase">Sync</span>
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'log' && (
          <div className="max-w-2xl mx-auto">
            <HiveForm onAdd={addEntry} />
            
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Logs</span>
                <p className="text-2xl font-bold text-slate-800">{entries.length}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase">Avg Severity</span>
                <p className="text-2xl font-bold text-slate-800">
                  {entries.length > 0 ? (entries.reduce((acc, curr) => acc + curr.severity, 0) / entries.length).toFixed(1) : '0'}
                </p>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start space-x-3">
              <div className="bg-blue-500 text-white rounded-full p-1 mt-0.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-0.5">Basic Tracking is 100% Free & Offline</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Your tracking data stays on this device. No accounts or API keys are required for basic logging, history, or doctor reports.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Your Insights</h2>
                <p className="text-slate-500">View trends and generate reports for medical use.</p>
              </div>
              <button 
                onClick={generatePDF}
                disabled={entries.length === 0}
                className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export PDF for Doctor</span>
              </button>
            </div>

            <AnalysisPanel entries={entries} onAnalysisDone={setAnalysisResult} />
            
            <section>
              <h2 className="text-xl font-bold text-slate-800 mb-6">Visual Breakdown</h2>
              <HistoryCharts entries={entries} />
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">Entry History</h2>
                <span className="text-sm font-medium text-slate-500">{entries.length} entries recorded</span>
              </div>
              
              {entries.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">No history yet</h3>
                  <button onClick={() => setActiveTab('log')} className="bg-rose-500 text-white px-6 py-2 rounded-xl font-semibold shadow-md shadow-rose-200">
                    Add First Entry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {entries.map(entry => (
                    <div key={entry.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow group relative">
                      <div className="flex justify-between items-start mb-3">
                        <div className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase px-2 py-1 rounded">
                          {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold text-white uppercase ${
                          entry.severity >= 8 ? 'bg-rose-500' : entry.severity >= 5 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}>
                          Severity {entry.severity}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Affected Areas</p>
                        <div className="flex flex-wrap gap-1">
                          {entry.location.map(loc => (
                            <span key={loc} className="text-slate-800 font-semibold text-sm bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Suspected Trigger</p>
                        <p className="text-slate-600 italic">"{entry.triggers || 'None listed'}"</p>
                      </div>

                      {entry.notes && (
                        <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-500 mb-2 line-clamp-2">
                          {entry.notes}
                        </div>
                      )}

                      <button 
                        onClick={() => deleteEntry(entry.id)}
                        className="absolute bottom-4 right-4 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'sync' && (
          <SyncPage entries={entries} onImport={handleImport} onClear={handleClear} />
        )}
      </main>

      {/* Hidden Report Component for Printing */}
      <DoctorReport entries={entries} analysis={analysisResult} />
    </div>
  );
};

export default App;
