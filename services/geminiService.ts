
import { GoogleGenAI, Type } from "@google/genai";
import { HiveEntry, AnalysisResult } from "../types";

export const analyzeHiveData = async (entries: HiveEntry[]): Promise<AnalysisResult> => {
  if (entries.length === 0) {
    return {
      commonTriggers: [],
      severityTrend: "No data yet",
      potentialPatterns: "No data yet",
      advice: "Log your first breakout to start receiving AI insights."
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const entriesSummary = entries.map(e => ({
    date: e.timestamp,
    severity: e.severity,
    location: e.location,
    triggers: e.triggers
  }));

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these hive breakout logs for patterns. Determine common triggers, trends in severity, and potential environmental or dietary connections. 
    Data: ${JSON.stringify(entriesSummary)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          commonTriggers: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of identified recurring triggers"
          },
          severityTrend: {
            type: Type.STRING,
            description: "A summary of how severity is changing over time"
          },
          potentialPatterns: {
            type: Type.STRING,
            description: "Associations between specific triggers and locations or times"
          },
          advice: {
            type: Type.STRING,
            description: "Health and lifestyle advice based on patterns"
          }
        },
        required: ["commonTriggers", "severityTrend", "potentialPatterns", "advice"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Analysis failed");
  }
};
