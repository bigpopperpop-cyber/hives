
import React, { useState } from 'react';
import { BodyArea, HiveEntry } from '../types';
import { BODY_AREAS } from '../constants';

interface HiveFormProps {
  onAdd: (entry: HiveEntry) => void;
}

const COMMON_TRIGGERS = [
  'Stress', 'Heat', 'Cold', 'Dairy', 'Seafood', 'Alcohol', 
  'Detergent', 'Sweat', 'Pressure', 'Medication'
];

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

  const addTriggerChip = (chip: string) => {
    setTriggers(prev => {
      const current = prev.trim();
      if (!current) return chip;
      if (current.toLowerCase().includes(chip.toLowerCase())) return prev;
      return `${current}, ${chip}`;
    });
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
              className="w-full rounded-xl border-slate-200 focus:ring-rose-500 focus:border-rose-500 text-sm"
              required
            />
          </div>
          <div className="flex items-end">
             <p className="text-xs text-slate-400 italic mb-1">Select all affected areas.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Affected Areas</label>
          <div className="grid grid-cols-3 gap-2">
            {BODY_AREAS.map(area => {
              const isSelected = selectedLocations.includes(area);
              return (
                <button
                  key={area}
                  type="button"
                  onClick={() => toggleLocation(area)}
                  className={`py-2.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                    isSelected 
                      ? 'bg-rose-500 border-rose-500 text-white shadow-sm' 
                      : 'bg-white border-slate-200 text-slate-500 hover:border-rose-300'
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
          <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1 mt-1 uppercase tracking-wider">
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
            placeholder="e.g. Seafood, New laundry detergent..."
            className="w-full rounded-xl border-slate-200 focus:ring-rose-500 focus:border-rose-500 text-sm mb-3"
          />
          <div className="flex flex-wrap gap-1.5">
            {COMMON_TRIGGERS.map(chip => (
              <button
                key={chip}
                type="button"
                onClick={() => addTriggerChip(chip)}
                className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any other symptoms or contexts?"
            rows={2}
            className="w-full rounded-xl border-slate-200 focus:ring-rose-500 focus:border-rose-500 text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-rose-200 flex items-center justify-center space-x-2 active:scale-[0.98]"
        >
          <span>Save Log Entry</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default HiveForm;
