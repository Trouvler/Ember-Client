export type IncidentType = "FIRE" | "RESCUE" | "EMERGENCY";

export const INCIDENT_TYPES: readonly IncidentType[] = [
  "FIRE",
  "RESCUE",
  "EMERGENCY",
];

export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  FIRE: "화재",
  RESCUE: "구조",
  EMERGENCY: "구급",
};

export interface DispatchLocation {
  lat: number;
  lng: number;
}

export interface DispatchAnalysisRequest {
  location: DispatchLocation;
  incidentType: IncidentType;
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface RecommendedTeam {
  id: string;
  rank: number;
  name: string;
  jurisdiction: "관할" | "인접";
  etaMinutes: number;
  successRate: number;
}

export interface RecommendedEquipment {
  id: string;
  name: string;
  needRate: number;
  purpose: string;
}

export interface DispatchAnalysisResult {
  id: string;
  degraded: boolean;
  riskLevel: RiskLevel;
  probability: number;
  equipment: RecommendedEquipment[];
  teams: RecommendedTeam[];
}
