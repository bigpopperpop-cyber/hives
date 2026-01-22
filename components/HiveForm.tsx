
import React, { useState, useEffect } from 'react';
import { BodyArea, HiveEntry } from '../types';
import { BODY_AREAS, DEFAULT_COMMON_TRIGGERS, CUSTOM_TRIGGERS_KEY } from '../constants';

interface HiveFormProps {
  onAdd: (entry: HiveEntry) => void;
}

const HiveForm: React.FC<HiveFormProps> = ({ onAdd }) => {
  const [severity, setSeverity] = useState(5);
  const [selectedLocations, setSelectedLocations] = useState<BodyArea[]>(['Torso']);
  const [triggers, setTriggers] = useState('');
  const [notes, setNotes] = useState('');
  const [timestamp, setTimestamp] = useState(new Date().toISOString().slice(0, 16));
  
  // Custom Triggers State
  const [suggestionList, setSuggestionList] = useState<string[]>([]);
  const [isEditingSuggestions, setIsEditingSuggestions] = useState(false);

  // Load suggestions on mount
  useEffect(() => {
    const saved = localStorage.getItem(CUSTOM_TRIGGERS_KEY);
    if (saved) {
      try {
        setSuggestionList(JSON.parse(saved));
      } catch (e) {
        setSuggestionList(DEFAULT_COMMON_TRIGGERS);
      }
    } else {
      setSuggestionList(DEFAULT_COMMON_TRIGGERS);
    }
  }, []);

  // Save suggestions when changed
  const saveSuggestions = (newList: string[]) => {
    setSuggestionList(newList);
    localStorage.setItem(CUSTOM_TRIGGERS_KEY, JSON.stringify(newList));
  };

  const toggleLocation = (area: BodyArea) => {
    setSelectedLocations(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area) 
        : [...prev, area]
    );
  };

  const addTriggerToInput = (chip: string) => {
    setTriggers(prev => {
      const current = prev.trim();
      if (!current) return chip;
      // Check if already in input
      const parts = current.split(',').map(p => p.trim().toLowerCase());
      if (parts.includes(chip.toLowerCase())) return prev;
      return `${current}, ${chip}`;
    });
  };

  const addNewSuggestion = () => {
    const newTrig = triggers.split(',').pop()?.trim();
    if (!newTrig) return;
    
    if (suggestionList.some(s => s.toLowerCase() === newTrig.toLowerCase())) {
      alert("This trigger is already in your suggestion list.");
      return;
    }

    const updated = [...suggestionList, newTrig];
    saveSuggestions(updated);
  };

  const removeSuggestion = (e: React.MouseEvent, chipToRemove: string) => {
    e.stopPropagation(); // Don't add to input if we are deleting
    const updated = suggestionList.filter(s => s !== chipToRemove);
    saveSuggestions(updated);
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
    // Reset form fields but keep suggestions
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
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-slate-600">Suspected Triggers</label>
            <button 
              type="button" 
              onClick={() => setIsEditingSuggestions(!isEditingSuggestions)}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-tight flex items-center"
            >
              {isEditingSuggestions ? 'Done Editing' : 'Customize List'}
              <svg className={`ml-1 w-3 h-3 transition-transform ${isEditingSuggestions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={triggers}
              onChange={(e) => setTriggers(e.target.value)}
              placeholder="e.g. Seafood, Stress..."
              className="flex-grow rounded-xl border-slate-200 focus:ring-rose-500 focus:border-rose-500 text-sm"
            />
            {triggers && (
              <button
                type="button"
                onClick={addNewSuggestion}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 rounded-xl text-[10px] font-black uppercase tracking-tight border border-slate-200"
                title="Save this as a permanent shortcut"
              >
                Add Shortcut
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[40px]">
            {suggestionList.map(chip => (
              <div
                key={chip}
                onClick={() => addTriggerToInput(chip)}
                className="group relative flex items-center bg-slate-100 text-slate-500 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer border border-transparent hover:border-rose-200"
              >
                <span className="text-[11px] font-bold">+ {chip}</span>
                {isEditingSuggestions && (
                  <button
                    type="button"
                    onClick={(e) => removeSuggestion(e, chip)}
                    className="ml-2 -mr-1 p-0.5 bg-slate-200 text-slate-500 rounded-full hover:bg-rose-500 hover:text-white transition-colors"
                  >
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {suggestionList.length === 0 && (
              <p className="text-[11px] text-slate-400 italic py-2">No shortcuts yet. Type a trigger and click 'Add Shortcut'.</p>
            )}
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
