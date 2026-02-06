import React, { useState, useEffect } from 'react';
import HiveForm from './components/HiveForm';
import HistoryCharts from './components/HistoryCharts';
import AnalysisPanel from './components/AnalysisPanel';
import SyncPage from './components/SyncPage';
import AboutPage from './components/AboutPage';
import DoctorReport from './components/DoctorReport';
import { HiveEntry, AnalysisResult } from './types';
import { STORAGE_KEY } from './constants';

type Tab = 'log' | 'history' | 'sync' | 'about';

const App: React.FC = () => {
  const [entries, setEntries] = useState<HiveEntry[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('log');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [editingEntry, setEditingEntry] = useState<HiveEntry | null>(null);

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

  const updateEntry = (updated: HiveEntry) => {
    const updatedEntries = entries.map(e => e.id === updated.id ? updated : e);
    saveToStorage(updatedEntries);
    setEditingEntry(null);
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

  const paypalUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=gizmooo@yahoo.com&currency_code=USD&source=url";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print shadow-sm overflow-hidden h-14 md:h-16 flex items-center">
        <div className="max-w-6xl mx-auto px-4 w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-rose-500 rounded-lg flex items-center justify-center shadow-sm shadow-rose-200">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm md:text-lg font-bold text-slate-900 leading-none">I Am Itchy</h1>
              <div className="flex items-center mt-0.5 md:mt-1 landscape-hide">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse mr-1"></span>
                <span className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Local Only</span>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button 
              onClick={() => setActiveTab('log')}
              className={`text-xs md:text-sm font-semibold px-2 py-1.5 lg:px-4 lg:py-2 rounded-lg transition-all ${activeTab === 'log' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              Log Entry
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`text-xs md:text-sm font-semibold px-2 py-1.5 lg:px-4 lg:py-2 rounded-lg transition-all ${activeTab === 'history' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              History
            </button>
            <button 
              onClick={() => setActiveTab('sync')}
              className={`text-xs md:text-sm font-semibold px-2 py-1.5 lg:px-4 lg:py-2 rounded-lg transition-all ${activeTab === 'sync' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              Sync
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`text-xs md:text-sm font-semibold px-2 py-1.5 lg:px-4 lg:py-2 rounded-lg transition-all ${activeTab === 'about' ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
            >
              About
            </button>
          </nav>

          <div className="hidden lg:block border-l border-slate-200 ml-4 pl-4">
             <span className="text-[10px] text-slate-400 font-medium">Privacy Guaranteed • Offline First</span>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 mobile-nav flex items-center justify-around z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] no-print">
        <button 
          onClick={() => setActiveTab('log')}
          className={`flex flex-col items-center space-y-0.5 ${activeTab === 'log' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          <span className="text-[8px] font-bold uppercase">Log</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center space-y-0.5 ${activeTab === 'history' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <span className="text-[8px] font-bold uppercase">Stats</span>
        </button>
        <button 
          onClick={() => setActiveTab('sync')}
          className={`flex flex-col items-center space-y-0.5 ${activeTab === 'sync' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          <span className="text-[8px] font-bold uppercase">Sync</span>
        </button>
        <button 
          onClick={() => setActiveTab('about')}
          className={`flex flex-col items-center space-y-0.5 ${activeTab === 'about' ? 'text-rose-500' : 'text-slate-400'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-[8px] font-bold uppercase">About</span>
        </button>
      </div>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-4 md:py-8 pb-20 md:pb-24 no-print w-full overflow-x-hidden">
        {activeTab === 'log' && (
          <div className="max-w-4xl mx-auto">
            <HiveForm onAdd={addEntry} />
            
            <div className="mt-6 md:mt-8 grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Total Logs</span>
                <p className="text-lg md:text-2xl font-bold text-slate-800">{entries.length}</p>
              </div>
              <div className="bg-white p-3 md:p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Avg Severity</span>
                <p className="text-lg md:text-2xl font-bold text-slate-800">
                  {entries.length > 0 ? (entries.reduce((acc, curr) => acc + curr.severity, 0) / entries.length).toFixed(1) : '0'}
                </p>
              </div>
            </div>

            <div className="mt-6 md:mt-8 bg-blue-50 border border-blue-100 p-3 md:p-4 rounded-xl flex items-start space-x-3 landscape-hide">
              <div className="bg-blue-500 text-white rounded-full p-1 mt-0.5">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs md:text-sm font-semibold text-blue-900 mb-0.5">Tracking is Free & Offline</p>
                <p className="text-[10px] md:text-xs text-blue-700 leading-relaxed">
                  Your data stays on this device. No internet required for core tracking.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800">Your Insights</h2>
                <p className="text-sm text-slate-500 landscape-hide">Trends and doctor-ready reports.</p>
              </div>
              <button 
                onClick={generatePDF}
                disabled={entries.length === 0}
                className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 md:py-3 px-5 md:px-6 rounded-xl transition-all shadow-lg disabled:opacity-50 text-xs md:text-sm"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export Report</span>
              </button>
            </div>

            <AnalysisPanel entries={entries} onAnalysisDone={setAnalysisResult} />
            
            <section>
              <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 md:mb-6">Visual Breakdown</h2>
              <HistoryCharts entries={entries} />
            </section>

            <section>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold text-slate-800">History</h2>
                <span className="text-[10px] md:text-sm font-medium text-slate-500">{entries.length} entries</span>
              </div>
              
              {entries.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 md:p-12 text-center">
                  <h3 className="text-base md:text-lg font-bold text-slate-800 mb-1">No history yet</h3>
                  <button onClick={() => setActiveTab('log')} className="bg-rose-500 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-rose-200 mt-2">
                    Add Entry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {entries.map(entry => (
                    <div key={entry.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow group relative flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div className="bg-slate-100 text-slate-600 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                          {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                        <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase ${
                          entry.severity >= 8 ? 'bg-rose-500' : entry.severity >= 5 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}>
                          Sev. {entry.severity}
                        </div>
                      </div>
                      
                      {entry.images && entry.images.length > 0 && (
                        <div className="mb-2 rounded-lg overflow-x-auto flex space-x-2 pb-2 scrollbar-hide">
                          {entry.images.map((img, i) => (
                            <div key={i} className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-slate-100">
                               <img src={img} alt={`Visual ${i}`} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mb-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 tracking-tighter">Areas</p>
                        <div className="flex flex-wrap gap-1">
                          {entry.location.map(loc => (
                            <span key={loc} className="text-slate-800 font-bold text-[10px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase mb-0.5 tracking-tighter">Trigger</p>
                        <p className="text-slate-600 text-[11px] italic truncate">"{entry.triggers || 'None'}"</p>
                      </div>

                      <div className="absolute bottom-3 right-3 flex items-center space-x-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingEntry(entry)}
                          className="text-slate-300 hover:text-amber-500 transition-colors p-1"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button 
                          onClick={() => deleteEntry(entry.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
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

        {activeTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Edit Overlay */}
      {editingEntry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            <HiveForm 
              initialData={editingEntry} 
              onAdd={updateEntry} 
              onCancel={() => setEditingEntry(null)} 
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 px-4 text-center mt-auto landscape-hide">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[10px] md:text-sm text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} I Am Itchy • Private
          </div>
          <div className="flex items-center space-x-4">
            <a href={paypalUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 font-bold text-[10px] md:text-xs flex items-center space-x-1.5 bg-amber-50 px-2 py-1 rounded-lg">
              <span>Coffee?</span>
            </a>
          </div>
        </div>
      </footer>

      <DoctorReport entries={entries} analysis={analysisResult} />
    </div>
  );
};

export default App;