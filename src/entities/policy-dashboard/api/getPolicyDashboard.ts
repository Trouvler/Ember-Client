import { apiFetch } from "@/shared/api/httpClient";
import type { PolicyDashboard } from "../model/types";

// OpenAPI에는 region이 optional로 적혀 있으나 생략하면 400 INVALID_REQUEST가 온다.
export const DEFAULT_REGION = "서울";

export function getPolicyDashboard(region = DEFAULT_REGION) {
  const params = new URLSearchParams({
    region: region.trim() || DEFAULT_REGION,
  });
  return apiFetch<PolicyDashboard>(`/api/dispatch/policy-dashboard?${params}`);
}
