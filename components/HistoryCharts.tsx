import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { HiveEntry } from '../types';

interface HistoryChartsProps {
  entries: HiveEntry[];
}

const HistoryCharts: React.FC<HistoryChartsProps> = ({ entries }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkTheme();
    
    // Observer for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  if (entries.length === 0) return null;

  // Prepare timeline data
  const timelineData = [...entries].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  ).map(e => ({
    time: new Date(e.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    severity: e.severity
  }));

  // Prepare location breakdown
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

  const colors = {
    grid: isDark ? '#1e293b' : '#f1f5f9',
    text: isDark ? '#64748b' : '#94a3b8',
    tooltipBg: isDark ? '#0f172a' : '#fff',
    tooltipBorder: isDark ? '#1e293b' : '#f1f5f9',
    barDefault: isDark ? '#1e293b' : '#cbd5e1'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Timeline Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Severity Over Time</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: colors.text, fontSize: 10, fontWeight: 700}} />
              <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{fill: colors.text, fontSize: 10, fontWeight: 700}} />
              <Tooltip 
                contentStyle={{
                  borderRadius: '12px', 
                  border: `1px solid ${colors.tooltipBorder}`, 
                  backgroundColor: colors.tooltipBg,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                itemStyle={{ color: isDark ? '#f43f5e' : '#f43f5e' }}
                labelStyle={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700, marginBottom: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="severity" 
                stroke="#f43f5e" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: isDark ? '#0f172a' : '#fff' }}
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location Bar Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Affected Areas (Frequency)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={colors.grid} />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: colors.text, fontSize: 10, fontWeight: 700}}
                width={85}
              />
              <Tooltip 
                cursor={{fill: isDark ? '#1e293b' : '#f8fafc'}} 
                contentStyle={{
                  borderRadius: '12px', 
                  border: `1px solid ${colors.tooltipBorder}`, 
                  backgroundColor: colors.tooltipBg,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 700 }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                {locationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#f43f5e' : colors.barDefault} />
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