import type { DispatchAnalysisResult } from "./types";

// 상세 조회가 실패할 때만 화면에 표시하는 시연 값. 실제 분석 결과가 아니다.
export const DEMO_ANALYSIS_RESULT: DispatchAnalysisResult = {
  analysisId: 0,
  degraded: false,
  riskLevel: "HIGH",
  estimatedArrivalMinutes: 6.3,
  goldenTimeFailureProbability: 0.62,
  recommendedUnits: [
    {
      stationId: 9001,
      rank: 1,
      stationName: "종로소방서",
      estimatedArrivalMinutes: 6.3,
      successProbability: 82,
      reason: "관할 구역이며 최단 경로 확보",
    },
    {
      stationId: 9002,
      rank: 2,
      stationName: "중부소방서",
      estimatedArrivalMinutes: 8.1,
      successProbability: 71,
      reason: "인접 구역 동시 편성 가능",
    },
  ],
  recommendedEquipment: [
    {
      equipmentType: "PUMP_TRUCK",
      requiredProbability: 95,
      reason: "초기 진화 필수 장비",
    },
    {
      equipmentType: "LADDER_TRUCK",
      requiredProbability: 68,
      reason: "노후 건물 밀집 지역 상층 대응",
    },
  ],
  briefing:
    "해당 신고지는 노후 건물이 밀집한 지역으로 출동 지연 위험이 높습니다. 도로 폭이 좁아 접근 지연이 예상되며, 인접 출동대의 동시 편성을 검토하시기 바랍니다.",
};
