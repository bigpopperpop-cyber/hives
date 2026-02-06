import React from 'react';
import DataManager from './DataManager';
import { HiveEntry } from '../types';

interface SyncPageProps {
  entries: HiveEntry[];
  onImport: (entries: HiveEntry[]) => void;
  onClear: () => void;
}

const SyncPage: React.FC<SyncPageProps> = ({ entries, onImport, onClear }) => {
  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("App link copied to clipboard! You can now share it with others.");
  };

  const paypalUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=gizmooo@yahoo.com&currency_code=USD&source=url";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Sync & Export</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-lg">
          Your health data is stored privately on this device. Manage your history, create backups, or export reports for your doctor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report Card */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900 p-8 rounded-[2rem] relative overflow-hidden group transition-colors">
          <div className="absolute top-0 right-0 p-6 text-emerald-200/50 dark:text-emerald-500/10 group-hover:scale-110 transition-transform">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM13 9V3.5L18.5 9H13z"/></svg>
          </div>
          <div className="relative z-10">
            <div className="bg-emerald-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200 dark:shadow-none">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2m3 2v-4m3 2v-6m-8-5l10 10"/></svg>
            </div>
            <h4 className="text-xl font-black text-emerald-900 dark:text-emerald-400 mb-2">Excel Report</h4>
            <p className="text-emerald-700/80 dark:text-emerald-500/70 text-sm leading-relaxed mb-4">
              Best for your doctor. Creates a readable spreadsheet (.csv) containing every log entry, including triggers and severity notes.
            </p>
          </div>
        </div>

        {/* Backup Card */}
        <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2rem] relative overflow-hidden group transition-colors">
          <div className="absolute top-0 right-0 p-6 text-slate-200 dark:text-slate-800 group-hover:scale-110 transition-transform">
            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
          </div>
          <div className="relative z-10">
            <div className="bg-slate-800 dark:bg-slate-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-200 dark:shadow-none">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">App Backup</h4>
            <p className="text-slate-600/80 dark:text-slate-500/70 text-sm leading-relaxed mb-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Contribution Card */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900 p-8 rounded-[2rem] flex flex-col items-center text-center shadow-sm transition-colors">
          <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h4 className="text-xl font-black text-amber-900 dark:text-amber-500 mb-2">Support the Creator</h4>
          <p className="text-amber-800/70 dark:text-amber-600/70 text-sm leading-relaxed mb-6">
            If this tool has helped you manage your hives, consider buying me a coffee! Your support keeps this app free and private.
          </p>
          <a 
            href={paypalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg shadow-amber-200 dark:shadow-none flex items-center justify-center space-x-2 active:scale-95"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.067 8.178c-.552 2.723-2.31 4.195-4.814 4.195H13.25l-.744 4.706h-3.414l1.625-10.276h4.524c2.51 0 4.27 1.472 4.826 4.195v1.18zm-4.814-1.18h-1.114l-.326 2.064h1.114c.732 0 1.258-.43 1.404-1.032v-.006c-.146-.596-.672-1.026-1.404-1.026z"/></svg>
            <span>Contribute via PayPal</span>
          </a>
        </div>

        {/* Share Card */}
        <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900 p-8 rounded-[2rem] flex flex-col items-center text-center shadow-sm transition-colors">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
          <h4 className="text-xl font-black text-indigo-900 dark:text-indigo-500 mb-2">Share HiveTracker</h4>
          <p className="text-indigo-800/70 dark:text-indigo-600/70 text-sm leading-relaxed mb-6">
            Know someone else struggling with chronic hives? Share this tool to help them find their patterns.
          </p>
          <button 
            onClick={handleShare}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center space-x-2 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            <span>Copy App Link</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-start space-x-4 mt-8 transition-colors">
        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
          <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-sm">
          <p className="font-bold text-slate-800 dark:text-white mb-1">Important: Local Storage Only</p>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
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