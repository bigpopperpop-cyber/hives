
import React from 'react';
import { HiveEntry, AnalysisResult } from '../types';

interface DoctorReportProps {
  entries: HiveEntry[];
  analysis: AnalysisResult | null;
}

const DoctorReport: React.FC<DoctorReportProps> = ({ entries, analysis }) => {
  const avgSeverity = entries.length > 0 
    ? (entries.reduce((acc, curr) => acc + curr.severity, 0) / entries.length).toFixed(1) 
    : '0';

  const locationCounts: Record<string, number> = {};
  entries.forEach(e => e.location.forEach(loc => {
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  }));
  
  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([loc]) => loc)
    .join(', ');

  return (
    <div id="printable-report" className="hidden print:block p-8 bg-white text-slate-900">
      {/* Report Header */}
      <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Chronic Urticaria Patient Report</h1>
          <p className="text-slate-500 font-medium">Generated on {new Date().toLocaleDateString()} via HiveTracker Pro</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">Confidential Health Data</p>
          <p className="text-xs text-slate-400">Total Recorded Entries: {entries.length}</p>
        </div>
      </div>

      {/* Quick Summary Section */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Average Severity</p>
          <p className="text-2xl font-bold">{avgSeverity} / 10</p>
        </div>
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg col-span-2">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Most Affected Areas</p>
          <p className="text-2xl font-bold">{topLocations || 'None recorded'}</p>
        </div>
      </div>

      {/* AI Analysis Summary (If exists) */}
      {analysis && (
        <div className="mb-10 p-6 border-2 border-indigo-100 rounded-xl bg-indigo-50/30">
          <h2 className="text-lg font-bold text-indigo-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
            Automated Pattern Analysis
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-indigo-700 uppercase">Identified Triggers</p>
              <p className="text-sm">{analysis.commonTriggers.join(', ') || 'None identified'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-700 uppercase">Trend Observations</p>
              <p className="text-sm">{analysis.severityTrend}</p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Log Table */}
      <div>
        <h2 className="text-xl font-bold mb-4 border-b border-slate-200 pb-2">Full History Log</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 border border-slate-200 text-xs font-bold uppercase">Date/Time</th>
              <th className="p-2 border border-slate-200 text-xs font-bold uppercase w-16">Sev.</th>
              <th className="p-2 border border-slate-200 text-xs font-bold uppercase">Visual/Location</th>
              <th className="p-2 border border-slate-200 text-xs font-bold uppercase">Triggers/Notes</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id} className="break-inside-avoid">
                <td className="p-2 border border-slate-200 text-sm">
                  {new Date(entry.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td className="p-2 border border-slate-200 text-sm font-bold text-center">
                  {entry.severity}
                </td>
                <td className="p-2 border border-slate-200 text-sm">
                  <div className="flex items-start space-x-2">
                    {entry.image && <img src={entry.image} className="w-12 h-12 rounded object-cover border" alt="Visual" />}
                    <span>{entry.location.join(', ')}</span>
                  </div>
                </td>
                <td className="p-2 border border-slate-200 text-sm">
                  <span className="font-semibold">{entry.triggers}</span>
                  {entry.notes && <p className="text-xs text-slate-500 mt-1">{entry.notes}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 text-center text-xs text-slate-400 italic">
        This report was created by the patient using HiveTracker Pro. It is intended to assist medical professionals in identifying urticaria patterns and is not a clinical diagnosis.
      </div>
    </div>
  );
};

export default DoctorReport;
