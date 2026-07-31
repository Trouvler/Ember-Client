import { apiFetch } from "@/shared/api/httpClient";
import type {
  DispatchOrderRequest,
  DispatchOrderResponse,
} from "../model/types";

export function postDispatchOrder(
  analysisId: number,
  request: DispatchOrderRequest,
) {
  return apiFetch<DispatchOrderResponse>(`/api/dispatch/${analysisId}/order`, {
    method: "POST",
    body: JSON.stringify(request),
  });
}
