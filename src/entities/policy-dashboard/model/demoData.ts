import type { PolicyDashboard } from "./types";

// 백엔드가 빈 응답을 줄 때만 화면에 표시하는 시연 값. 실제 집계가 아니다.
export const DEMO_POLICY_DASHBOARD: PolicyDashboard = {
  region: "서울",
  totalAnalyzedCases: 12847,
  avgGoldenTimeFailureRate: 0.217,
  vulnerableDistrictTop5: [
    {
      districtName: "종로구 창신동",
      avgArrivalMinutes: 8.4,
      failureRate: 0.71,
    },
    {
      districtName: "중구 을지로동",
      avgArrivalMinutes: 7.9,
      failureRate: 0.67,
    },
    {
      districtName: "영등포구 문래동",
      avgArrivalMinutes: 7.4,
      failureRate: 0.59,
    },
    {
      districtName: "동대문구 제기동",
      avgArrivalMinutes: 7.1,
      failureRate: 0.54,
    },
    {
      districtName: "성북구 정릉동",
      avgArrivalMinutes: 6.8,
      failureRate: 0.48,
    },
  ],
};
