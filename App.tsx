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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print shadow-sm h-14 md:h-16 flex items-center">
        <div className="max-w-6xl mx-auto px-4 w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-rose-500 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm md:text-lg font-bold text-slate-900 leading-none">I Am Itchy</h1>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {['log', 'history', 'sync', 'about'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as Tab)}
                className={`text-xs md:text-sm font-semibold px-4 py-2 rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                {tab === 'log' ? 'Log Entry' : tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around z-50 no-print shadow-lg">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-800">Your Insights</h2>
              <button onClick={generatePDF} className="bg-slate-900 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg text-sm">Export Report</button>
            </div>
            <AnalysisPanel entries={entries} onAnalysisDone={setAnalysisResult} />
            <HistoryCharts entries={entries} />
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {entries.map(entry => (
                <div key={entry.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow group relative">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-slate-100 text-slate-600 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                       {entry.weather && (
                         <div className="flex items-center space-x-1 text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded text-[9px] font-bold">
                           <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                           <span>{entry.weather.temp}°C</span>
                         </div>
                       )}
                       <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase ${entry.severity >= 8 ? 'bg-rose-500' : 'bg-amber-500'}`}>
                         Sev. {entry.severity}
                       </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 font-bold mb-1 truncate">{entry.location.join(', ')}</p>
                  <p className="text-[10px] text-slate-400 italic">"{entry.triggers || 'No triggers'}"</p>
                  <div className="mt-3 flex space-x-1">
                    {entry.images?.slice(0, 3).map((img, i) => (
                      <img key={i} src={img} className="w-8 h-8 rounded object-cover border" />
                    ))}
                  </div>
                  <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100">
                    <button onClick={() => setEditingEntry(entry)} className="p-1 text-slate-300 hover:text-amber-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => deleteEntry(entry.id)} className="p-1 text-slate-300 hover:text-rose-500">
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
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl bg-white">
            <HiveForm initialData={editingEntry} onAdd={updateEntry} onCancel={() => setEditingEntry(null)} />
          </div>
        </div>
      )}

      <DoctorReport entries={entries} analysis={analysisResult} />
    </div>
  );
};

export default App;