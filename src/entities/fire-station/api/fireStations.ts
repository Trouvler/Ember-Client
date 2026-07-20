import { apiFetch } from "@/shared/api/httpClient";
import type { FireStation, FireStationDetail } from "../model/types";

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
