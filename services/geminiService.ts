import { HiveEntry, AnalysisResult } from "../types";

/**
 * Local Intelligence Engine
 * Analyzes hive data using advanced heuristic logic directly on the device.
 */
export const analyzeHiveData = async (entries: HiveEntry[]): Promise<AnalysisResult> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  if (entries.length === 0) {
    return {
      commonTriggers: [],
      severityTrend: "No data logged.",
      potentialPatterns: "No data logged.",
      advice: "Log your first entry to see patterns."
    };
  }

  // 1. Trigger Frequency Analysis
  const triggerMap: Record<string, number> = {};
  entries.forEach(e => {
    const triggers = e.triggers.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
    triggers.forEach(t => {
      triggerMap[t] = (triggerMap[t] || 0) + 1;
    });
  });

  const commonTriggers = Object.entries(triggerMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([trigger]) => trigger.charAt(0).toUpperCase() + trigger.slice(1));

  // 2. Severity Trend
  const sorted = [...entries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const mid = Math.floor(sorted.length / 2);
  const startAvg = sorted.slice(0, mid).reduce((acc, curr) => acc + curr.severity, 0) / (mid || 1);
  const endAvg = sorted.slice(mid).reduce((acc, curr) => acc + curr.severity, 0) / (sorted.length - mid || 1);

  let severityTrend = "Your breakout intensity has remained relatively stable.";
  if (endAvg > startAvg + 1.0) {
    severityTrend = "We have detected an upward trend in recent severity. Consider if new environmental factors are involved.";
  } else if (endAvg < startAvg - 1.0) {
    severityTrend = "Your most recent breakouts are significantly milder than your earlier logs.";
  }

  // 3. Environmental Insights
  let environmentInsights = "";
  const weatherEntries = entries.filter(e => e.weather);
  if (weatherEntries.length >= 3) {
    const highHumidityEntries = weatherEntries.filter(e => e.weather!.humidity > 65);
    const lowHumidityEntries = weatherEntries.filter(e => e.weather!.humidity <= 65);
    
    const highHumAvg = highHumidityEntries.reduce((acc, curr) => acc + curr.severity, 0) / (highHumidityEntries.length || 1);
    const lowHumAvg = lowHumidityEntries.reduce((acc, curr) => acc + curr.severity, 0) / (lowHumidityEntries.length || 1);

    if (highHumidityEntries.length > 0 && highHumAvg > lowHumAvg + 1.5) {
      environmentInsights = "Climate Correlation: Your breakouts are significantly more severe during high humidity (>65%). Sweat may be a key trigger.";
    }

    const hotEntries = weatherEntries.filter(e => e.weather!.temp > 28);
    const hotAvg = hotEntries.reduce((acc, curr) => acc + curr.severity, 0) / (hotEntries.length || 1);
    if (hotEntries.length > 0 && hotAvg > endAvg + 1) {
      environmentInsights = environmentInsights ? environmentInsights + " Also, heat exposure (>28°C) appears to intensify your symptoms." : "Heat Correlation: Breakouts are more intense in temperatures above 28°C.";
    }
  }

  // 4. Pattern Correlation
  const correlations: Record<string, Record<string, number>> = {};
  entries.forEach(e => {
    e.location.forEach(loc => {
      const triggers = e.triggers.split(',').map(t => t.trim().toLowerCase()).filter(t => t);
      if (!correlations[loc]) correlations[loc] = {};
      triggers.forEach(t => {
        correlations[loc][t] = (correlations[loc][t] || 0) + 1;
      });
    });
  });

  let potentialPatterns = "Patterns are still emerging. Keep logging areas and triggers to see correlations.";
  let maxCount = 0;
  let strongestLoc = "";
  let strongestTrig = "";

  Object.entries(correlations).forEach(([loc, trigs]) => {
    Object.entries(trigs).forEach(([trig, count]) => {
      if (count > maxCount) {
        maxCount = count;
        strongestLoc = loc;
        strongestTrig = trig;
      }
    });
  });

  if (maxCount >= 2) {
    potentialPatterns = `Localized Pattern: Breakouts on your ${strongestLoc} frequently occur after exposure to ${strongestTrig}.`;
  }

  // 5. Advice
  let advice = "Consistent logging is the most effective tool for managing chronic urticaria.";
  if (environmentInsights) {
    advice = "Environmental triggers detected. Discuss cooling strategies or dehumidification with your doctor.";
  } else if (endAvg > 7) {
    advice = "Your recent severity levels are high. Specialty treatments like omalizumab might be worth discussing with your physician.";
  }

  return {
    commonTriggers,
    severityTrend,
    potentialPatterns,
    advice,
    environmentInsights: environmentInsights || undefined
  };
};