import { apiFetch } from "@/shared/api/httpClient";
import type {
  DispatchFeedbackRequest,
  DispatchFeedbackResponse,
} from "../model/types";

export function postDispatchFeedback(
  analysisId: number,
  request: DispatchFeedbackRequest,
) {
  return apiFetch<DispatchFeedbackResponse>(`/api/feedback/${analysisId}`, {
    method: "POST",
    body: JSON.stringify(request),
  });
}
