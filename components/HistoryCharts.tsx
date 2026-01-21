
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { HiveEntry } from '../types';

interface HistoryChartsProps {
  entries: HiveEntry[];
}

const HistoryCharts: React.FC<HistoryChartsProps> = ({ entries }) => {
  if (entries.length === 0) return null;

  // Prepare timeline data
  const timelineData = [...entries].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  ).map(e => ({
    time: new Date(e.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    severity: e.severity
  }));

  // Prepare location breakdown data - flattening the location arrays
  const locationMap: Record<string, number> = {};
  entries.forEach(e => {
    e.location.forEach(loc => {
      locationMap[loc] = (locationMap[loc] || 0) + 1;
    });
  });
  
  const locationData = Object.keys(locationMap).map(key => ({
    name: key,
    value: locationMap[key]
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Timeline Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Severity Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Line 
                type="monotone" 
                dataKey="severity" 
                stroke="#f43f5e" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location Bar Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Affected Areas (Frequency)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 11, fontWeight: 500}}
                width={85}
              />
              <Tooltip cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#f43f5e' : '#cbd5e1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HistoryCharts;
