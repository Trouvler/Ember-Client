import { apiFetch } from "@/shared/api/httpClient";
import type { DispatchAnalysisResult } from "../model/types";

export function getDispatchAnalysis(analysisId: number) {
  return apiFetch<DispatchAnalysisResult>(`/api/dispatch/${analysisId}`);
}
