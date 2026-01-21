
import React, { useState } from 'react';
import { BodyArea, HiveEntry } from '../types';
import { BODY_AREAS } from '../constants';

interface HiveFormProps {
  onAdd: (entry: HiveEntry) => void;
}

const HiveForm: React.FC<HiveFormProps> = ({ onAdd }) => {
  const [severity, setSeverity] = useState(5);
  const [selectedLocations, setSelectedLocations] = useState<BodyArea[]>(['Torso']);
  const [triggers, setTriggers] = useState('');
  const [notes, setNotes] = useState('');
  const [timestamp, setTimestamp] = useState(new Date().toISOString().slice(0, 16));

  const toggleLocation = (area: BodyArea) => {
    setSelectedLocations(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area) 
        : [...prev, area]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLocations.length === 0) {
      alert("Please select at least one affected area.");
      return;
    }
    const newEntry: HiveEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(timestamp).toISOString(),
      severity,
      location: selectedLocations,
      triggers,
      notes
    };
    onAdd(newEntry);
    // Reset
    setTriggers('');
    setNotes('');
    setSelectedLocations(['Torso']);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
        <span className="bg-rose-100 text-rose-600 p-2 rounded-lg mr-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </span>
        Log New Breakout
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Date & Time</label>
            <input
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full rounded-xl border-slate-200 focus:ring-rose-500 focus:border-rose-500"
              required
            />
          </div>
          <div className="flex items-end">
             <p className="text-xs text-slate-400 italic mb-1">Select all areas where you have hives.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Affected Areas (Multi-select)</label>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
            {BODY_AREAS.map(area => {
              const isSelected = selectedLocations.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleLocation(area)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected 
                      ? 'bg-rose-500 border-rose-500 text-white shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300'
                  }`}
                >
                  {area}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Severity (Itchiness: {severity}/10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={severity}
            onChange={(e) => setSeverity(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-xs text-slate-400 px-1 mt-1">
            <span>Mild</span>
            <span>Moderate</span>
            <span>Intense</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Suspected Triggers</label>
          <input
            type="text"
            value={triggers}
            onChange={(e) => setTriggers(e.target.value)}
            placeholder="e.g. Seafood, New laundry detergent, Stress..."
            className="w-full rounded-xl border-slate-200 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any other symptoms or contexts?"
            rows={2}
            className="w-full rounded-xl border-slate-200 focus:ring-rose-500 focus:border-rose-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md shadow-rose-200"
        >
          Save Log Entry
        </button>
      </form>
    </div>
  );
};

export default HiveForm;
