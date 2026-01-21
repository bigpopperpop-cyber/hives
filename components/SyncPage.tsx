
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
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">Sync & Backup</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          Your data is stored privately on this device. Follow these simple steps to move your history to another browser or phone.
        </p>
      </div>

      {/* Guide Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
          <div className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">1</div>
          <h4 className="font-bold text-slate-800 mb-2">Export</h4>
          <p className="text-sm text-slate-500">Download your data as a secure backup file to your device.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
          <div className="w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">2</div>
          <h4 className="font-bold text-slate-800 mb-2">Transfer</h4>
          <p className="text-sm text-slate-500">Send the file to your other device via Email, Drive, or AirDrop.</p>
          <div className="absolute top-1/2 -right-3 hidden md:block text-slate-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
          <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">3</div>
          <h4 className="font-bold text-slate-800 mb-2">Import</h4>
          <p className="text-sm text-slate-500">Open this app on the new device and upload the file to merge logs.</p>
        </div>
      </div>

      {/* Actual Data Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-800">Data Actions</h3>
          <p className="text-sm text-slate-500">Perform your backup or restoration below.</p>
        </div>
        <div className="p-8">
          <DataManager 
            entries={entries} 
            onImport={onImport} 
            onClear={onClear} 
          />
          
          <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start space-x-3">
            <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Tip:</strong> Importing data will <u>merge</u> with any existing logs you have on this device. We automatically check for duplicates to ensure your history remains clean.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-xs text-slate-400">
          HiveTracker Pro does not store your health data on any cloud servers.<br/>
          You are in total control of your own data.
        </p>
      </div>
    </div>
  );
};

export default SyncPage;
