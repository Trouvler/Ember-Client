import { apiFetch } from "@/shared/api/httpClient";
import type { RiskLayerCollection } from "../model/types";

// OpenAPI에는 region이 optional로 적혀 있으나 생략하면 400 INVALID_REQUEST가 온다.
// 서버가 region을 정규화하지 않아 "서울"은 빈 결과가 온다. 정식 시도명을 보내야 한다.
export const DEFAULT_REGION = "서울특별시";

// GOLDEN_TIME 외의 type 값은 스펙에 없다. 레이어 전환은 응답의 properties 중
// 어떤 값을 표시할지로 처리하고 요청 type은 고정한다.
const LAYER_TYPE = "GOLDEN_TIME";

export function getRiskLayers(region = DEFAULT_REGION) {
  const params = new URLSearchParams({
    type: LAYER_TYPE,
    region: region.trim() || DEFAULT_REGION,
  });
  return apiFetch<RiskLayerCollection>(`/api/dispatch/risk-layers?${params}`);
}
