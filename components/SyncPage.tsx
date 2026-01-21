
import React from 'react';
import DataManager from './DataManager';
import { HiveEntry } from '../types';

interface SyncPageProps {
  entries: HiveEntry[];
  onImport: (entries: HiveEntry[]) => void;
  onClear: () => void;
}

const SyncPage: React.FC<SyncPageProps> = ({ entries, onImport, onClear }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Sync & Export</h2>
        <p className="text-slate-500 max-w-lg mx-auto text-lg">
          Your health data is stored privately on this device. Manage your history, create backups, or export reports for your doctor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report Card */}
        <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 text-emerald-200/50 group-hover:scale-110 transition-transform">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM13 9V3.5L18.5 9H13z"/></svg>
          </div>
          <div className="relative z-10">
            <div className="bg-emerald-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2m3 2v-4m3 2v-6m-8-5l10 10"/></svg>
            </div>
            <h4 className="text-xl font-black text-emerald-900 mb-2">Excel Report</h4>
            <p className="text-emerald-700/80 text-sm leading-relaxed mb-4">
              Best for your doctor. Creates a readable spreadsheet (.csv) containing every log entry, including triggers and severity notes.
            </p>
          </div>
        </div>

        {/* Backup Card */}
        <div className="bg-slate-100 border border-slate-200 p-8 rounded-[2rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 text-slate-200 group-hover:scale-110 transition-transform">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
          </div>
          <div className="relative z-10">
            <div className="bg-slate-800 text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-200">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
            </div>
            <h4 className="text-xl font-black text-slate-900 mb-2">App Backup</h4>
            <p className="text-slate-600/80 text-sm leading-relaxed mb-4">
              Best for moving devices. Creates a data file (.json) that you can import on another phone or browser to restore your exact history.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <DataManager 
          entries={entries} 
          onImport={onImport} 
          onClear={onClear} 
        />
      </div>

      <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-start space-x-4">
        <div className="bg-amber-100 p-2 rounded-lg">
          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-sm">
          <p className="font-bold text-slate-800 mb-1">Important: Local Storage Only</p>
          <p className="text-slate-500 leading-relaxed">
            HiveTracker Pro is a private utility. We do not use cloud accounts or APIs to store your health info. 
            If you delete your browser data or lose your phone without a backup file, your history cannot be recovered. 
            <strong> Please export a backup regularly.</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SyncPage;
