
import { GoogleGenAI, Type } from "@google/genai";
import { HiveEntry, AnalysisResult } from "../types";

/**
 * Local Analysis Engine: Provides intelligent insights using on-device logic.
 * Ensures the app works perfectly even without an API key or internet.
 */
const runLocalHeuristicAnalysis = (entries: HiveEntry[]): AnalysisResult => {
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

  let severityTrend = "Your breakout intensity has remained relatively consistent throughout your tracking period.";
  if (endAvg > startAvg + 1.2) {
    severityTrend = "We've detected a significant increase in recent severity levels. This may indicate a new or cumulative trigger exposure.";
  } else if (endAvg < startAvg - 1.2) {
    severityTrend = "Positive trend identified: Your most recent breakouts are showing lower intensity than earlier logs.";
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

  let potentialPatterns = "Patterns often emerge over time. Currently, your breakouts appear to be distributed across multiple variables.";
  
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
    potentialPatterns = `Strong correlation found: Breakouts on your ${strongestLoc} frequently occur alongside exposure to ${strongestTrig}. Consider avoiding contact in this area.`;
  }

  return {
    commonTriggers,
    severityTrend,
    potentialPatterns,
    advice: "Maintain consistent logging. For hives lasting more than 6 weeks, bring this report to an immunologist to discuss Chronic Spontaneous Urticaria (CSU)."
  };
};

export const analyzeHiveData = async (entries: HiveEntry[]): Promise<AnalysisResult> => {
  if (entries.length === 0) {
    return {
      commonTriggers: [],
      severityTrend: "No data logged.",
      potentialPatterns: "No data logged.",
      advice: "Log your first entry to see patterns."
    };
  }

  // If no API key is available, go straight to local mode
  const hasApiKey = process.env.API_KEY && process.env.API_KEY !== "undefined" && process.env.API_KEY.length > 10;
  
  if (!hasApiKey) {
    console.info("Smart Analysis: Using Local Engine (No Key Detected)");
    return runLocalHeuristicAnalysis(entries);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Only send relevant summary to save tokens and improve response speed
    const context = entries.slice(0, 20).map(e => ({
      date: e.timestamp,
      sev: e.severity,
      loc: e.location.join(','),
      trig: e.triggers
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `Analyze these patient hive logs and identify patterns. Return ONLY JSON. 
          Logs: ${JSON.stringify(context)}`
        }]
      }],
      config: {
        systemInstruction: "You are a dermatology medical analyst. Provide objective insights based strictly on the provided JSON data. Response must be valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            commonTriggers: { type: Type.ARRAY, items: { type: Type.STRING } },
            severityTrend: { type: Type.STRING },
            potentialPatterns: { type: Type.STRING },
            advice: { type: Type.STRING }
          },
          required: ["commonTriggers", "severityTrend", "potentialPatterns", "advice"]
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    return result as AnalysisResult;
  } catch (error) {
    console.warn("AI Analysis failed or timed out. Falling back to local engine.", error);
    return runLocalHeuristicAnalysis(entries);
  }
};
