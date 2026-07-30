import type { RiskLayerFeature } from "./types";

// 백엔드가 빈 응답을 줄 때만 화면에 표시하는 시연 값. 실제 집계가 아니다.
export const DEMO_RISK_FEATURES: RiskLayerFeature[] = [
  {
    type: "Feature",
    properties: {
      dongName: "종로구 창신동",
      riskScore: 71,
      avgArrivalMinutes: 8.4,
    },
  },
  {
    type: "Feature",
    properties: {
      dongName: "중구 을지로동",
      riskScore: 67,
      avgArrivalMinutes: 7.9,
    },
  },
  {
    type: "Feature",
    properties: {
      dongName: "영등포구 문래동",
      riskScore: 59,
      avgArrivalMinutes: 7.4,
    },
  },
  {
    type: "Feature",
    properties: {
      dongName: "동대문구 제기동",
      riskScore: 54,
      avgArrivalMinutes: 7.1,
    },
  },
  {
    type: "Feature",
    properties: {
      dongName: "성북구 정릉동",
      riskScore: 48,
      avgArrivalMinutes: 6.8,
    },
  },
];
