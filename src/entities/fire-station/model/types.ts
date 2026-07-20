export interface FireStation {
  stationId: number;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  address: string;
}

export interface FireStationDetail extends FireStation {
  equipment: string[];
}
