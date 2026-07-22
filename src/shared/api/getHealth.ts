import { apiFetch } from "./httpClient";

export interface HealthResponse {
  status: string;
}

export function getHealth() {
  return apiFetch<HealthResponse>("/health");
}
