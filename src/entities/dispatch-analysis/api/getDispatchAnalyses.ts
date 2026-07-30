import { apiFetch } from "@/shared/api/httpClient";
import type { DispatchAnalysesPage } from "../model/types";

interface GetDispatchAnalysesParams {
  region?: string;
  page?: number;
  size?: number;
}

export function getDispatchAnalyses({
  region,
  page = 0,
  size = 20,
}: GetDispatchAnalysesParams = {}) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const normalizedRegion = region?.trim();
  if (normalizedRegion) {
    params.set("region", normalizedRegion);
  }

  return apiFetch<DispatchAnalysesPage>(`/api/dispatch?${params}`);
}
