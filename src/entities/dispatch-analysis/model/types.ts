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

export type BuildingType = "MULTI_FAMILY_HOUSE" | "SINGLE_HOUSE" | "COMMERCIAL";

export const BUILDING_TYPE_LABELS: Record<BuildingType, string> = {
  MULTI_FAMILY_HOUSE: "공동주택",
  SINGLE_HOUSE: "단독주택",
  COMMERCIAL: "상업시설",
};

export interface DispatchLocation {
  lat: number;
  lng: number;
}

export interface DispatchAnalysisRequest {
  incidentType: IncidentType;
  latitude: number;
  longitude: number;
  occurredAt: string;
  buildingType?: BuildingType;
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";

export interface DispatchUnitCandidate {
  stationId: number;
  rank: number;
  stationName: string;
  estimatedArrivalMinutes: number;
  successProbability: number;
  reason: string;
}

export interface AiEquipmentRecommendation {
  equipmentType: string;
  requiredProbability: number;
  reason: string;
}

export interface DispatchAnalysisResult {
  analysisId: number;
  degraded: boolean;
  riskLevel: RiskLevel;
  estimatedArrivalMinutes: number;
  goldenTimeFailureProbability: number;
  recommendedUnits: DispatchUnitCandidate[];
  recommendedEquipment: AiEquipmentRecommendation[];
  briefing: string;
}
