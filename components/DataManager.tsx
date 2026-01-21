
import React, { useRef } from 'react';
import { HiveEntry } from '../types';
import { STORAGE_KEY } from '../constants';

interface DataManagerProps {
  entries: HiveEntry[];
  onImport: (entries: HiveEntry[]) => void;
  onClear: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ entries, onImport, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `hivetracker-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
          if (window.confirm(`Import ${importedData.length} entries? This will merge with your current data.`)) {
            onImport(importedData);
          }
        } else {
          alert("Invalid data format. Please use a file exported from this app.");
        }
      } catch (err) {
        alert("Failed to read file. Make sure it's a valid JSON file.");
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Data Portability</h3>
          <p className="text-sm text-slate-500">Sync your data across devices by exporting and importing your history.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Import</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Permanently delete all logs? This cannot be undone.")) {
                onClear();
              }
            }}
            className="flex-1 md:flex-none flex items-center justify-center space-x-2 text-rose-500 hover:bg-rose-50 font-semibold py-2 px-4 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear</span>
          </button>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".json"
        className="hidden"
      />
    </div>
  );
};

export default DataManager;
