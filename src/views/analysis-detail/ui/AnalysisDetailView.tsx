import IncidentStatusBar from "@/widgets/incident-status-bar/ui/IncidentStatusBar";
import RiskAnalysisCard from "@/widgets/analysis-result-card/ui/RiskAnalysisCard";
import AiBriefingCard from "@/widgets/analysis-result-card/ui/AiBriefingCard";
import RecommendedTeamTable from "@/shared/ui/RecommendedTeamTable";
import RecommendedEquipmentTable from "@/shared/ui/RecommendedEquipmentTable";
import DegradedBanner from "@/shared/ui/DegradedBanner";
import MapView from "@/shared/ui/MapView";
import type { DispatchAnalysisResult } from "@/entities/dispatch-analysis/model/types";

interface AnalysisDetailViewProps {
  id: string;
}

const SAMPLE_LOCATION = { lat: 37.5726, lng: 127.0107 };
const SAMPLE_ADDRESS = "서울 종로구 창신동 일대";
const SAMPLE_ELAPSED_SECONDS = 3 * 60 + 34;

// 조회 API(GET /api/dispatch-analyses/:id)가 아직 문서화되지 않아 샘플 데이터로 렌더링
function buildSampleResult(id: string): DispatchAnalysisResult {
  return {
    id,
    degraded: false,
    riskLevel: "HIGH",
    probability: 62,
    teams: [
      {
        id: "1",
        rank: 1,
        name: "종로소방서",
        jurisdiction: "관할",
        etaMinutes: 6.3,
        successRate: 82,
      },
      {
        id: "2",
        rank: 2,
        name: "강남소방서",
        jurisdiction: "인접",
        etaMinutes: 8.1,
        successRate: 71,
      },
    ],
    equipment: [
      {
        id: "1",
        name: "펌프차",
        needRate: 95,
        purpose: "초기 진화 · 주수 활동 필수",
      },
      {
        id: "2",
        name: "고가사다리차",
        needRate: 78,
        purpose: "고층부 인명 구조 · 접근 대응",
      },
    ],
  };
}

const SAMPLE_BRIEFING = {
  summary:
    "해당 신고지는 노후 건물 밀집 지역으로 출동 지연 위험이 높습니다. 도로 폭이 좁아 접근 지연이 예상되며, 인근 소방서까지의 거리가 지연 요인으로 작용합니다.",
  reasons: [
    "반경 300m 내 준공 30년 이상 건물 비율 71%",
    "진입 도로 최소 폭 2.8m · 소방차 교행 불가",
    "관할서 최근 3년 유사 화재 평균 도착 7.9분",
  ],
};

export default function AnalysisDetailView({ id }: AnalysisDetailViewProps) {
  const result = buildSampleResult(id);
  const fastestEtaMinutes = Math.min(...result.teams.map((t) => t.etaMinutes));

  return (
    <div className="flex flex-col">
      <IncidentStatusBar
        incidentId={id}
        title="화재 · 주거시설 신고 분석"
        address={SAMPLE_ADDRESS}
        lat={SAMPLE_LOCATION.lat}
        lng={SAMPLE_LOCATION.lng}
        receivedAtLabel="14:23:07"
        initialElapsedSeconds={SAMPLE_ELAPSED_SECONDS}
      />

      <div className="mx-auto w-full max-w-[1920px] px-[22px] py-4">
        {result.degraded ? (
          <div className="mb-3.5">
            <DegradedBanner visible={result.degraded} />
          </div>
        ) : null}

        <div className="grid grid-cols-[1.75fr_1fr] items-start gap-3.5">
          {/* 좌측: 지도 + 표 */}
          <div className="flex flex-col gap-3.5">
            <section className="rounded-xl border border-[#ebedf0] card-shadow">
              <div className="flex items-center justify-between border-b border-[#e6e9ee] px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-[3px] bg-ember" />
                  <h2 className="text-sm font-bold text-ink">
                    실시간 관제 지도
                  </h2>
                </div>
                <div className="flex items-center gap-3.5 text-[11.5px] text-[#6b7280]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-[9px] w-[9px] rounded-full bg-risk-high" />
                    신고 지점
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-[9px] w-[9px] bg-ink" />
                    1순위 출동대
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-[9px] w-[9px] bg-[#8a919c]" />
                    대체 출동대
                  </span>
                </div>
              </div>
              {/* 도로망·경로 렌더링은 GeoJSON 데이터 확보 후 진행(P1 이후), 현재는 신고 지점 마커만 표시 */}
              <MapView marker={SAMPLE_LOCATION} />
            </section>

            <section className="rounded-xl border border-[#ebedf0] card-shadow">
              <div className="flex items-center justify-between border-b border-[#e6e9ee] px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-[3px] bg-ember" />
                  <h2 className="text-sm font-bold text-ink">추천 출동대</h2>
                </div>
                <span className="text-[11.5px] text-[#9aa1ab]">
                  도착시간 · 성공률 종합 순위
                </span>
              </div>
              <RecommendedTeamTable teams={result.teams} />
            </section>

            <section className="rounded-xl border border-[#ebedf0] card-shadow">
              <div className="flex items-center justify-between border-b border-[#e6e9ee] px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-[3px] bg-ember" />
                  <h2 className="text-sm font-bold text-ink">추천 장비</h2>
                </div>
                <span className="text-[11.5px] text-[#9aa1ab]">
                  현장 조건 기반 필요도
                </span>
              </div>
              <RecommendedEquipmentTable equipment={result.equipment} />
            </section>
          </div>

          {/* 우측: 위험도 + AI 브리핑 */}
          <div className="flex flex-col gap-3.5">
            <RiskAnalysisCard
              riskLevel={result.riskLevel}
              probability={result.probability}
              fastestEtaMinutes={fastestEtaMinutes}
            />
            <AiBriefingCard
              summary={SAMPLE_BRIEFING.summary}
              reasons={SAMPLE_BRIEFING.reasons}
            />
            <div className="rounded-xl border border-[#ebedf0] border-l-[3px] border-l-risk-high px-[15px] py-3.5 card-shadow">
              <div className="text-[12.5px] leading-[1.55] font-bold text-ink">
                본 분석은 참고 자료이며, 최종 출동 판단은 상황실 담당자의
                권한입니다.
              </div>
              <div className="mt-1.5 text-[11.5px] text-[#8a919c]">
                AI는 상황실의 판단을 보조할 뿐 대체하지 않습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
