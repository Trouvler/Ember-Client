export interface FireStation {
  stationId: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface FireStationDetail extends FireStation {
  // 실 응답에서 null로 내려온다.
  equipment: string[] | null;
}

// dispatch-analysis의 IncidentType과 같은 값이지만 cross-slice import가 금지되어 자체 선언한다.
export type NearbyIncidentType = "FIRE" | "RESCUE" | "EMERGENCY";

export interface NearbyStation {
  stationId: number;
  name: string;
  distanceMeters: number;
  estimatedArrivalMinutes: number;
}
