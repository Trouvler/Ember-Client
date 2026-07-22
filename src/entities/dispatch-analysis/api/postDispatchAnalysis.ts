import { apiFetch } from "@/shared/api/httpClient";
import type {
  DispatchAnalysisRequest,
  DispatchAnalysisResult,
} from "../model/types";

export function postDispatchAnalysis(
  request: DispatchAnalysisRequest,
): Promise<DispatchAnalysisResult> {
  return apiFetch<DispatchAnalysisResult>("/api/dispatch", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
