import { apiFetch } from "@/shared/api/httpClient";
import type {
  FireStation,
  FireStationDetail,
  NearbyIncidentType,
  NearbyStation,
} from "../model/types";

export function getFireStations(region?: string) {
  const normalizedRegion = region?.trim();
  const query = normalizedRegion
    ? `?${new URLSearchParams({ region: normalizedRegion })}`
    : "";
  return apiFetch<FireStation[]>(`/api/station${query}`);
}

export function getFireStation(stationId: number) {
  return apiFetch<FireStationDetail>(`/api/station/${stationId}`);
}

interface GetNearbyStationsParams {
  lat: number;
  lng: number;
  incidentType: NearbyIncidentType;
  limit?: number;
}

export function getNearbyStations({
  lat,
  lng,
  incidentType,
  limit = 3,
}: GetNearbyStationsParams) {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    incidentType,
    limit: String(limit),
  });
  return apiFetch<NearbyStation[]>(`/api/station/nearby?${params}`);
}
