import React, { useState, useEffect, useRef } from 'react';
import { BodyArea, HiveEntry, WeatherData } from '../types';
import { DEFAULT_BODY_AREAS, DEFAULT_COMMON_TRIGGERS, CUSTOM_TRIGGERS_KEY, CUSTOM_BODY_AREAS_KEY } from '../constants';

interface HiveFormProps {
  onAdd: (entry: HiveEntry) => void;
  initialData?: HiveEntry;
  onCancel?: () => void;
}

const HiveForm: React.FC<HiveFormProps> = ({ onAdd, initialData, onCancel }) => {
  const [severity, setSeverity] = useState(initialData?.severity ?? 5);
  const [selectedLocations, setSelectedLocations] = useState<BodyArea[]>(initialData?.location ?? []);
  const [triggers, setTriggers] = useState(initialData?.triggers ?? '');
  const [notes, setNotes] = useState(initialData?.notes ?? '');
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [weather, setWeather] = useState<WeatherData | undefined>(initialData?.weather);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [timestamp, setTimestamp] = useState(
    initialData 
      ? new Date(initialData.timestamp).toISOString().slice(0, 16) 
      : new Date().toISOString().slice(0, 16)
  );
  
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const libraryInputRef = useRef<HTMLInputElement>(null);
  
  const [suggestionList, setSuggestionList] = useState<string[]>([]);
  const [isEditingSuggestions, setIsEditingSuggestions] = useState(false);
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

  const fetchWeather = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsFetchingWeather(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        // Fetch weather data from Open-Meteo (Free, no API key required)
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`);
        const data = await response.json();
        
        if (data.current) {
          setWeather({
            temp: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m,
            condition: `Code ${data.current.weather_code}`
          });
        }
      } catch (err) {
        console.error("Weather fetch failed", err);
        alert("Failed to fetch weather data. Please try again.");
      } finally {
        setIsFetchingWeather(false);
      }
    }, (err) => {
      setIsFetchingWeather(false);
      alert("Please enable location permissions to fetch weather data.");
    });
  };

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const newCompressedImages: string[] = [];

    for (const file of files) {
      const compressed = await compressFile(file);
      newCompressedImages.push(compressed);
    }

    setImages(prev => [...prev, ...newCompressedImages]);
    
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (libraryInputRef.current) libraryInputRef.current.value = '';
  };

  const compressFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
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
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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
      id: initialData?.id ?? crypto.randomUUID(),
      timestamp: new Date(timestamp).toISOString(),
      severity,
      location: selectedLocations,
      triggers,
      notes,
      images: images.length > 0 ? images : undefined,
      weather
    };
    onAdd(newEntry);
    if (!initialData) {
      setTriggers('');
      setNotes('');
      setImages([]);
      setSelectedLocations([]);
      setWeather(undefined);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 lg:p-8 landscape-compact-p ${initialData ? 'border-amber-200' : ''}`}>
      <div className="flex items-center justify-between mb-4 md:mb-6 landscape-compact-m">
        <h2 className="text-xl font-bold text-slate-800 flex items-center">
          <span className={`${initialData ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'} p-2 rounded-lg mr-3 landscape-hide`}>
            {initialData ? (
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            )}
          </span>
          {initialData ? 'Edit Breakout Entry' : 'Log New Breakout'}
        </h2>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600 p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-tight mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="w-full rounded-xl border-slate-200 focus:ring-rose-500 focus:border-rose-500 text-xs md:text-sm py-2 px-3"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-tight mb-1">Environment</label>
                <button
                  type="button"
                  onClick={fetchWeather}
                  disabled={isFetchingWeather}
                  className={`w-full py-2 px-3 rounded-xl border flex items-center justify-center space-x-2 transition-all ${
                    weather ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  {isFetchingWeather ? (
                    <svg className="animate-spin h-4 w-4 text-slate-400" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : weather ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                      <span className="text-xs font-bold">{weather.temp}°C / {weather.humidity}%</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="text-xs">Fetch Weather</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <div>
                <label className="block text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-tight mb-1">Add Photos</label>
                <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex-1 bg-slate-900 text-white p-2 rounded-xl border border-slate-800 transition-all flex items-center justify-center space-x-2 hover:bg-slate-800 active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="text-[10px] font-bold uppercase">Camera</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => libraryInputRef.current?.click()}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl border border-slate-200 transition-all flex items-center justify-center space-x-2 active:scale-95"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-[10px] font-bold uppercase">Gallery</span>
                    </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group/img">
                        <img src={img} className="w-10 h-10 rounded-lg object-cover border border-rose-200" alt="Preview" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 shadow-sm">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="4" /></svg>
                        </button>
                      </div>
                    ))}
                </div>
               </div>
            </div>

            <div className="bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-100">
              <label className="block text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-tight mb-2">
                Severity (Itchiness: {severity}/10)
              </label>
              <input
                type="range" min="1" max="10" value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                className="w-full h-1.5 md:h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[8px] md:text-[10px] font-black text-slate-400 px-1 mt-2 uppercase tracking-widest">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Intense</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-tight mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Symptoms or contexts?"
                rows={2}
                className="w-full rounded-xl border-slate-200 focus:ring-rose-500 focus:border-rose-500 text-xs md:text-sm px-3 py-2"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-tight">Areas</label>
                <button type="button" onClick={() => setIsEditingAreas(!isEditingAreas)} className="text-[9px] md:text-[10px] font-black text-rose-500 uppercase tracking-wider">
                  {isEditingAreas ? 'Done' : 'Edit List'}
                </button>
              </div>

              {isEditingAreas && (
                <div className="mb-3 animate-in slide-in-from-top-2 duration-200 flex space-x-2">
                  <input
                    type="text" value={newAreaInput} onChange={(e) => setNewAreaInput(e.target.value)}
                    placeholder="e.g. Ear" className="flex-grow rounded-xl border-slate-200 text-xs px-3 py-1.5"
                  />
                  <button type="button" onClick={addNewArea} className="bg-slate-800 text-white px-3 rounded-xl text-[10px] font-bold">Add</button>
                </div>
              )}

              <div className="grid grid-cols-3 gap-1.5 md:gap-2 max-h-[120px] md:max-h-none overflow-y-auto pr-1">
                {areaList.map(area => {
                  const isSelected = selectedLocations.includes(area);
                  return (
                    <div key={area} className="relative">
                      <button
                        type="button" onClick={() => toggleLocation(area)}
                        className={`w-full py-2 px-1 rounded-lg text-[9px] md:text-[11px] font-bold border transition-all ${
                          isSelected ? 'bg-rose-500 border-rose-500 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-rose-300'
                        }`}
                      >
                        {area}
                      </button>
                      {isEditingAreas && (
                        <button type="button" onClick={(e) => removeArea(e, area)} className="absolute -top-1 -right-1 bg-slate-900 text-white rounded-full p-0.5 shadow-sm">
                          <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="4" /></svg>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-tight">Triggers</label>
                <button type="button" onClick={() => setIsEditingSuggestions(!isEditingSuggestions)} className="text-[9px] md:text-[10px] font-black text-rose-500 uppercase tracking-wider">
                  {isEditingSuggestions ? 'Done' : 'Edit List'}
                </button>
              </div>
              
              <div className="flex space-x-2 mb-2">
                <input
                  type="text" value={triggers} onChange={(e) => setTriggers(e.target.value)}
                  placeholder="Seafood, etc..." className="flex-grow rounded-xl border-slate-200 text-xs px-3 py-1.5"
                />
                {triggers && (
                  <button type="button" onClick={addNewSuggestion} className="bg-slate-100 text-slate-600 px-2 rounded-xl text-[9px] font-black uppercase border border-slate-200">
                    +Shortcut
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-1 md:gap-1.5 max-h-[80px] md:max-h-none overflow-y-auto">
                {suggestionList.map(chip => (
                  <div key={chip} onClick={() => addTriggerToInput(chip)} className="group relative flex items-center bg-slate-100 text-slate-500 px-2 py-1 rounded-md hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer border border-transparent">
                    <span className="text-[9px] md:text-[10px] font-bold">+ {chip}</span>
                    {isEditingSuggestions && (
                      <button type="button" onClick={(e) => removeSuggestion(e, chip)} className="ml-1.5 bg-slate-200 text-slate-500 rounded-full p-0.5 hover:bg-rose-500 hover:text-white">
                        <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="4" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`w-full ${initialData ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'} text-white font-bold py-3 md:py-4 px-6 rounded-2xl transition-all shadow-lg flex items-center justify-center space-x-2 active:scale-[0.98] landscape-compact-m`}
        >
          <span className="text-sm md:text-base">{initialData ? 'Update Entry' : 'Save Log Entry'}</span>
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </form>
      
      <input type="file" ref={cameraInputRef} onChange={handleImageUpload} accept="image/*" capture="environment" className="hidden" />
      <input type="file" ref={libraryInputRef} onChange={handleImageUpload} accept="image/*" multiple className="hidden" />
    </div>
  );
};

export default HiveForm;