
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

  // The API key is obtained exclusively from the environment variable process.env.API_KEY.
  // This is the secure, standard way to handle sensitive credentials in modern web apps.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const entriesSummary = entries.map(e => ({
    date: e.timestamp,
    severity: e.severity,
    location: e.location,
    triggers: e.triggers,
    notes: e.notes || ""
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `Analyze these patient hive breakout logs. Identify recurring triggers, explain severity trends, find patterns between location and triggers, and provide supportive management advice.
          Data: ${JSON.stringify(entriesSummary)}`
        }]
      }],
      config: {
        systemInstruction: "You are an expert medical data analyst specializing in dermatology and immunology. Provide objective, pattern-based insights. You must return ONLY a JSON object that matches the requested schema. No conversational text before or after the JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            commonTriggers: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Distinct recurring factors suspected of causing breakouts"
            },
            severityTrend: {
              type: Type.STRING,
              description: "Description of how the itchiness/severity is evolving"
            },
            potentialPatterns: {
              type: Type.STRING,
              description: "Correlations between triggers, body areas, and frequency"
            },
            advice: {
              type: Type.STRING,
              description: "Actionable lifestyle or management suggestions"
            }
          },
          required: ["commonTriggers", "severityTrend", "potentialPatterns", "advice"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI returned an empty response.");

    const cleanJson = text.trim();
    return JSON.parse(cleanJson) as AnalysisResult;
  } catch (e: any) {
    console.error("AI Analysis Error:", e);
    const message = e.message || "";
    
    // Determine the nature of the failure to provide better user guidance
    if (message.includes("429")) {
      throw new Error("RATE_LIMIT: The AI service is currently busy. Please wait a moment and try again.");
    } else if (message.includes("401") || message.includes("403") || message.includes("API_KEY_INVALID")) {
      throw new Error("AUTH_ERROR: The API key provided in the system environment is invalid or expired.");
    } else if (!navigator.onLine || message.includes("fetch failed")) {
      throw new Error("NETWORK_ERROR: Unable to connect to the AI service. Please check your internet connection.");
    }
    
    throw new Error(`UNEXPECTED_ERROR: ${message || "An unknown error occurred during analysis."}`);
  }
};
