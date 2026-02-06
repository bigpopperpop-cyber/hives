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
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [entries, setEntries] = useState<HiveEntry[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('log');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [editingEntry, setEditingEntry] = useState<HiveEntry | null>(null);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Initial data load
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }

    // Theme initialization
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 no-print shadow-sm h-14 md:h-16 flex items-center">
        <div className="max-w-6xl mx-auto px-4 w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-rose-500 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm md:text-lg font-bold text-slate-900 dark:text-white leading-none">I Am Itchy</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {['log', 'history', 'sync', 'about'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as Tab)}
                  className={`text-xs md:text-sm font-semibold px-4 py-2 rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  {tab === 'log' ? 'Log Entry' : tab}
                </button>
              ))}
            </nav>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 h-16 flex items-center justify-around z-50 no-print shadow-lg">
        {['log', 'history', 'sync', 'about'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={`flex flex-col items-center space-y-1 ${activeTab === tab ? 'text-rose-500' : 'text-slate-400'}`}
          >
            <span className="text-[10px] font-bold uppercase">{tab === 'history' ? 'Stats' : tab}</span>
          </button>
        ))}
      </div>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-8 pb-24 no-print w-full">
        {activeTab === 'log' && (
          <div className="max-w-4xl mx-auto">
            <HiveForm onAdd={addEntry} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 md:p-8 border border-slate-200 dark:border-slate-800 transition-colors shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Clinical Report</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xl">
                  Generate a professional PDF summary of your breakout history, severity trends, and environmental correlations. This document is formatted specifically to help your Dermatologist or GP during your next appointment.
                </p>
              </div>
              <div className="shrink-0">
                <button 
                  onClick={generatePDF} 
                  className="w-full md:w-auto flex items-center justify-center space-x-2 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-rose-200 dark:shadow-none transition-all active:scale-95 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Generate PDF Report</span>
                </button>
              </div>
            </div>

            <AnalysisPanel entries={entries} onAnalysisDone={setAnalysisResult} />
            <HistoryCharts entries={entries} />
            
            <div className="flex items-center space-x-3 mt-12 mb-4">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Individual Logs</h3>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow"></div>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {entries.map(entry => (
                <div key={entry.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:shadow-md transition-shadow group relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                       {entry.weather && (
                         <div className="flex items-center space-x-1 text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded text-[9px] font-bold">
                           <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                           <span>{entry.weather.temp}°C</span>
                         </div>
                       )}
                       <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase ${entry.severity >= 8 ? 'bg-rose-500' : 'bg-amber-500'}`}>
                         Sev. {entry.severity}
                       </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-bold mb-1 truncate">{entry.location.join(', ')}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">"{entry.triggers || 'No triggers'}"</p>
                  <div className="mt-3 flex space-x-1">
                    {entry.images?.slice(0, 3).map((img, i) => (
                      <img key={i} src={img} className="w-8 h-8 rounded object-cover border dark:border-slate-700" />
                    ))}
                  </div>
                  <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingEntry(entry)} className="p-1 text-slate-300 dark:text-slate-600 hover:text-amber-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => deleteEntry(entry.id)} className="p-1 text-slate-300 dark:text-slate-600 hover:text-rose-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {activeTab === 'sync' && <SyncPage entries={entries} onImport={handleImport} onClear={handleClear} />}
        {activeTab === 'about' && <AboutPage />}
      </main>

      {editingEntry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-white dark:bg-slate-900">
            <HiveForm initialData={editingEntry} onAdd={updateEntry} onCancel={() => setEditingEntry(null)} />
          </div>
        </div>
      )}

      <DoctorReport entries={entries} analysis={analysisResult} />
    </div>
  );
};

export default App;