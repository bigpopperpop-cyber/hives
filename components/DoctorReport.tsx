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

  return (
    <div id="printable-report" className="hidden print:block p-8 bg-white text-slate-900">
      <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Urticaria Patient Report</h1>
          <p className="text-slate-500 font-medium">Generated on {new Date().toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">Confidential Health Data</p>
          <p className="text-xs text-slate-400">Total Entries: {entries.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg">
          <p className="text-xs font-bold text-slate-500 uppercase mb-1">Avg Severity</p>
          <p className="text-2xl font-bold">{avgSeverity} / 10</p>
        </div>
        {analysis?.environmentInsights && (
          <div className="bg-indigo-50 p-4 border border-indigo-200 rounded-lg col-span-2">
            <p className="text-xs font-bold text-indigo-700 uppercase mb-1">Environment Correlation</p>
            <p className="text-sm font-bold text-indigo-900 leading-tight">{analysis.environmentInsights}</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Full History Log</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-[10px] font-bold uppercase">
              <th className="p-2 border border-slate-200">Date/Time</th>
              <th className="p-2 border border-slate-200 w-12">Sev.</th>
              <th className="p-2 border border-slate-200">Environment</th>
              <th className="p-2 border border-slate-200">Triggers & Notes</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id} className="text-[11px] break-inside-avoid">
                <td className="p-2 border border-slate-200">
                  {new Date(entry.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td className="p-2 border border-slate-200 font-bold text-center">{entry.severity}</td>
                <td className="p-2 border border-slate-200 italic">
                  {entry.weather ? `${entry.weather.temp}°C, ${entry.weather.humidity}% Hum.` : 'N/A'}
                </td>
                <td className="p-2 border border-slate-200">
                  <span className="font-bold">{entry.triggers}</span>
                  {entry.notes && <p className="text-slate-500">{entry.notes}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 pt-8 border-t border-slate-200 text-center text-[10px] text-slate-400 italic">
        This report was created by the patient using I Am Itchy. It is intended to assist medical professionals in identifying urticaria patterns and is not a clinical diagnosis.
      </div>
    </div>
  );
};

export default DoctorReport;