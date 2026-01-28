
export type BodyArea = string;

export interface HiveEntry {
  id: string;
  timestamp: string;
  severity: number; // 1-10
  location: BodyArea[];
  triggers: string;
  notes?: string;
}

export interface AnalysisResult {
  commonTriggers: string[];
  severityTrend: string;
  potentialPatterns: string;
  advice: string;
}
