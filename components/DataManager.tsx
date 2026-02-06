import React, { useRef } from 'react';
import { HiveEntry } from '../types';

interface DataManagerProps {
  entries: HiveEntry[];
  onImport: (entries: HiveEntry[]) => void;
  onClear: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ entries, onImport, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `hivetracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleExportCSV = () => {
    if (entries.length === 0) {
      alert("No data to export.");
      return;
    }
    const headers = ["Date", "Time", "Severity (1-10)", "Affected Areas", "Triggers", "Temp (C)", "Humidity (%)", "Notes"];
    const rows = entries.map(entry => {
      const dateObj = new Date(entry.timestamp);
      const date = dateObj.toLocaleDateString();
      const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const areas = entry.location.join('; ');
      const triggers = `"${(entry.triggers || '').replace(/"/g, '""')}"`;
      const temp = entry.weather?.temp ?? '-';
      const humidity = entry.weather?.humidity ?? '-';
      const notes = `"${(entry.notes || '').replace(/"/g, '""')}"`;
      return [date, time, entry.severity, `"${areas}"`, triggers, temp, humidity, notes].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob(["\ufeff", csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `hive-log-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        if (Array.isArray(importedData)) {
          if (window.confirm(`Import ${importedData.length} entries?`)) onImport(importedData);
        }
      } catch (err) { alert("Invalid backup file."); }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Data Management</h3>
          <p className="text-sm text-slate-500">Export reports for doctors or backup your history locally.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button onClick={handleExportCSV} className="flex items-center justify-center space-x-2 bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-95">
            <span>Excel Export</span>
          </button>
          <button onClick={handleExportJSON} className="flex items-center justify-center space-x-2 bg-slate-800 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-95">
            <span>App Backup</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center space-x-2 bg-slate-100 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all active:scale-95">
            <span>Import Logs</span>
          </button>
          <button onClick={() => window.confirm("Clear all data?") && onClear()} className="flex items-center justify-center space-x-2 text-rose-500 hover:bg-rose-50 font-bold py-3 px-4 rounded-xl transition-all">
            <span>Clear Device</span>
          </button>
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
    </div>
  );
};

export default DataManager;