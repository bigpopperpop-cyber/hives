
import { HiveEntry, AnalysisResult } from "../types";

/**
 * Local Intelligence Engine
 * Analyzes hive data using advanced heuristic logic directly on the device.
 * No API key, internet, or cloud processing required.
 */
export const analyzeHiveData = async (entries: HiveEntry[]): Promise<AnalysisResult> => {
  // Simulate a brief calculation period for aesthetic "crunching" feel
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

  // 2. Severity Trend Calculation (Moving Average)
  const sorted = [...entries].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const mid = Math.floor(sorted.length / 2);
  const startAvg = sorted.slice(0, mid).reduce((acc, curr) => acc + curr.severity, 0) / (mid || 1);
  const endAvg = sorted.slice(mid).reduce((acc, curr) => acc + curr.severity, 0) / (sorted.length - mid || 1);

  let severityTrend = "Your breakout intensity has remained relatively stable throughout your tracking history.";
  if (endAvg > startAvg + 1.0) {
    severityTrend = "We have detected an upward trend in recent severity. This suggests a potential cumulative effect or a new environmental trigger.";
  } else if (endAvg < startAvg - 1.0) {
    severityTrend = "Great progress: Your most recent breakouts are significantly milder than your earlier logs.";
  }

  // 3. Body Area / Trigger Correlation
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

  let potentialPatterns = "Patterns are still emerging. As you add more logs, the engine will identify stronger correlations between your symptoms and triggers.";
  
  // Find strongest correlation
  let strongestLoc = "";
  let strongestTrig = "";
  let maxCount = 0;

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
    potentialPatterns = `Significant Correlation: Breakouts on your ${strongestLoc} frequently occur after exposure to ${strongestTrig}. This pattern suggests a localized contact reaction.`;
  }

  // 4. Dynamic Management Advice
  let advice = "Continue tracking your breakouts daily. Consistent logging is the most effective tool for managing chronic urticaria.";
  if (entries.length > 10) {
    advice = "With 10+ entries logged, your report is now highly detailed. We recommend showing the 'Export PDF' report to your doctor at your next visit.";
  }
  if (endAvg > 7) {
    advice = "Your recent severity levels are high. If antihistamines are not providing relief, discuss omalizumab or other specialty treatments with your physician.";
  }

  return {
    commonTriggers,
    severityTrend,
    potentialPatterns,
    advice
  };
};
