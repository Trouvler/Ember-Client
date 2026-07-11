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

export interface DispatchAnalysisResult {
  id: string;
  degraded: boolean;
}
