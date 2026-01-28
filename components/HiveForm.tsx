
import React, { useState, useEffect, useRef } from 'react';
import { BodyArea, HiveEntry } from '../types';
import { DEFAULT_BODY_AREAS, DEFAULT_COMMON_TRIGGERS, CUSTOM_TRIGGERS_KEY, CUSTOM_BODY_AREAS_KEY } from '../constants';

interface HiveFormProps {
  onAdd: (entry: HiveEntry) => void;
}

const HiveForm: React.FC<HiveFormProps> = ({ onAdd }) => {
  const [severity, setSeverity] = useState(5);
  const [selectedLocations, setSelectedLocations] = useState<BodyArea[]>([]);
  const [triggers, setTriggers] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [timestamp, setTimestamp] = useState(new Date().toISOString().slice(0, 16));
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Custom Triggers State
  const [suggestionList, setSuggestionList] = useState<string[]>([]);
  const [isEditingSuggestions, setIsEditingSuggestions] = useState(false);

  // Custom Body Areas State
  const [areaList, setAreaList] = useState<BodyArea[]>([]);
  const [isEditingAreas, setIsEditingAreas] = useState(false);
  const [newAreaInput, setNewAreaInput] = useState('');

  useEffect(() => {
    const savedTriggers = localStorage.getItem(CUSTOM_TRIGGERS_KEY);
    if (savedTriggers) {
      try { setSuggestionList(JSON.parse(savedTriggers)); } 
      catch (e) { setSuggestionList(DEFAULT_COMMON_TRIGGERS); }
    } else {
      setSuggestionList(DEFAULT_COMMON_TRIGGERS);
    }

    const savedAreas = localStorage.getItem(CUSTOM_BODY_AREAS_KEY);
    if (savedAreas) {
      try { setAreaList(JSON.parse(savedAreas)); }
      catch (e) { setAreaList(DEFAULT_BODY_AREAS); }
    } else {
      setAreaList(DEFAULT_BODY_AREAS);
    }
  }, []);

  const saveSuggestions = (newList: string[]) => {
    setSuggestionList(newList);
    localStorage.setItem(CUSTOM_TRIGGERS_KEY, JSON.stringify(newList));
  };

  const saveAreas = (newList: BodyArea[]) => {
    setAreaList(newList);
    localStorage.setItem(CUSTOM_BODY_AREAS_KEY, JSON.stringify(newList));
  };

  const toggleLocation = (area: BodyArea) => {
    setSelectedLocations(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area) 
        : [...prev, area]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const MAX_HEIGHT = 500;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG 60% quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        setImage(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const addTriggerToInput = (chip: string) => {
    setTriggers(prev => {
      const current = prev.trim();
      if (!current) return chip;
      const parts = current.split(',').map(p => p.trim().toLowerCase());
      if (parts.includes(chip.toLowerCase())) return prev;
      return `${current}, ${chip}`;
    });
  };

  const addNewSuggestion = () => {
    const newTrig = triggers.split(',').pop()?.trim();
    if (!newTrig) return;
    if (suggestionList.some(s => s.toLowerCase() === newTrig.toLowerCase())) return;
    saveSuggestions([...suggestionList, newTrig]);
  };

  const removeSuggestion = (e: React.MouseEvent, chipToRemove: string) => {
    e.stopPropagation();
    saveSuggestions(suggestionList.filter(s => s !== chipToRemove));
  };

  const addNewArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaInput.trim()) return;
    if (areaList.some(a => a.toLowerCase() === newAreaInput.trim().toLowerCase())) {
      setNewAreaInput('');
      return;
    }
    saveAreas([...areaList, newAreaInput.trim()]);
    setNewAreaInput('');
  };

  const removeArea = (e: React.MouseEvent, areaToRemove: BodyArea) => {
    e.stopPropagation();
    saveAreas(areaList.filter(a => a !== areaToRemove));
    setSelectedLocations(prev => prev.filter(a => a !== areaToRemove));
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
      notes,
      image
    };
    onAdd(newEntry);
    setTriggers('');
    setNotes('');
    setImage(undefined);
    setSelectedLocations([]);
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
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Evidence Photo</label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-xl border border-slate-200 transition-colors"
                title="Add photo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              {image && (
                <div className="relative">
                  <img src={image} className="w-10 h-10 rounded-lg object-cover border border-rose-200" alt="Preview" />
                  <button
                    type="button"
                    onClick={() => setImage(undefined)}
                    className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 shadow-sm"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              )}
              <p className="text-[10px] text-slate-400 leading-tight">Photos are automatically optimized to save space.</p>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" capture="environment" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-600">Affected Areas</label>
            <button 
              type="button" 
              onClick={() => setIsEditingAreas(!isEditingAreas)}
              className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-tight flex items-center"
            >
              {isEditingAreas ? 'Done Customizing' : 'Customize Areas'}
              <svg className={`ml-1 w-3 h-3 transition-transform ${isEditingAreas ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          {isEditingAreas && (
            <div className="mb-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newAreaInput}
                  onChange={(e) => setNewAreaInput(e.target.value)}
                  placeholder="New area (e.g. Left Eyelid)"
                  className="flex-grow rounded-xl border-slate-200 focus:ring-rose-500 focus:border-rose-500 text-sm"
                />
                <button
                  type="button"
                  onClick={addNewArea}
                  className="bg-slate-800 text-white px-4 rounded-xl text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2">
            {areaList.map(area => {
              const isSelected = selectedLocations.includes(area);
              return (
                <div key={area} className="relative group">
                  <button
                    type="button"
                    onClick={() => toggleLocation(area)}
                    className={`w-full py-2.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                      isSelected 
                        ? 'bg-rose-500 border-rose-500 text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-500 hover:border-rose-300'
                    }`}
                  >
                    {area}
                  </button>
                  {isEditingAreas && (
                    <button
                      type="button"
                      onClick={(e) => removeArea(e, area)}
                      className="absolute -top-1 -right-1 bg-slate-900 text-white rounded-full p-1 shadow-md hover:bg-rose-600 transition-colors"
                    >
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  )}
                </div>
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
              {isEditingSuggestions ? 'Done Customizing' : 'Customize List'}
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
