import { apiFetch } from "@/shared/api/httpClient";
import type { AiEquipmentRecommendation } from "../model/types";

export interface RecommendedEquipmentResponse {
  recommendedEquipment: AiEquipmentRecommendation[];
}

export function getRecommendedEquipment(analysisId: number) {
  return apiFetch<RecommendedEquipmentResponse>(`/api/equipment/${analysisId}`);
}
