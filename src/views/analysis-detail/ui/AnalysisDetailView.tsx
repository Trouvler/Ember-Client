"use client";

import { useState } from "react";
import IncidentStatusBar from "@/widgets/incident-status-bar/ui/IncidentStatusBar";
import RiskAnalysisCard from "@/widgets/analysis-result-card/ui/RiskAnalysisCard";
import AiBriefingCard from "@/widgets/analysis-result-card/ui/AiBriefingCard";
import RecommendedTeamTable from "@/shared/ui/RecommendedTeamTable";
import RecommendedEquipmentTable from "@/shared/ui/RecommendedEquipmentTable";
import DegradedBanner from "@/shared/ui/DegradedBanner";
import MapView from "@/shared/ui/MapView";
import ErrorFallback from "@/shared/ui/ErrorFallback";
import { useDispatchAnalysis } from "@/entities/dispatch-analysis/model/DispatchAnalysisProvider";
import { getRecommendedEquipment } from "@/entities/dispatch-analysis/api/getRecommendedEquipment";

interface AnalysisDetailViewProps {
  id: string;
}

function probabilityAsPercent(probability: number) {
  return probability <= 1 ? probability * 100 : probability;
}

export default function AnalysisDetailView({ id }: AnalysisDetailViewProps) {
  const { analysis, updateEquipment } = useDispatchAnalysis();
  const [isRetryingEquipment, setIsRetryingEquipment] = useState(false);

  if (!analysis || String(analysis.result.analysisId) !== id) {
    return (
      <main className="px-4 py-6 sm:px-[22px] sm:py-8">
        <h1 className="text-xl font-bold text-ink">분석 결과가 없습니다.</h1>
        <p className="mt-2 text-sm text-[#5c6672]">
          분석 결과는 새로고침 후 유지되지 않습니다. 신고 시뮬레이션에서 다시
          분석해 주세요.
        </p>
      </main>
    );
  }

  const { result, location } = analysis;
  const probability = probabilityAsPercent(result.goldenTimeFailureProbability);

  const retryEquipment = async () => {
    setIsRetryingEquipment(true);
    try {
      const equipment = await getRecommendedEquipment(result.analysisId);
      updateEquipment(equipment.recommendedEquipment);
    } catch {
      // 기존 오류 상태를 유지해 다시 시도할 수 있게 한다.
    } finally {
      setIsRetryingEquipment(false);
    }
  };

  return (
    <div className="flex flex-col">
      <IncidentStatusBar
        incidentId={id}
        title="신고 분석 결과"
        address="선택한 신고 위치"
        lat={location.lat}
        lng={location.lng}
        receivedAtLabel={new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
        initialElapsedSeconds={0}
      />

      <div className="w-full px-4 py-6 sm:px-[22px] sm:py-8">
        {result.degraded ? (
          <div className="mb-3.5">
            <DegradedBanner visible={result.degraded} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.75fr_1fr] lg:items-start">
          <div className="flex flex-col gap-5">
            <section className="rounded-xl border border-[#ebedf0] card-shadow">
              <div className="flex items-center gap-2 border-b border-[#e6e9ee] px-4 py-3.5">
                <span className="h-3.5 w-[3px] bg-ember" />
                <h2 className="text-sm font-bold text-ink">실시간 관제 지도</h2>
              </div>
              <MapView marker={location} />
            </section>

            <section className="rounded-xl border border-[#ebedf0] card-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6e9ee] px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-[3px] bg-ember" />
                  <h2 className="text-sm font-bold text-ink">추천 출동대</h2>
                </div>
                <span className="text-[11.5px] text-[#9aa1ab]">
                  도착시간 · 성공률 종합 순위
                </span>
              </div>
              <RecommendedTeamTable teams={result.recommendedUnits} />
            </section>

            <section className="rounded-xl border border-[#ebedf0] card-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6e9ee] px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span className="h-3.5 w-[3px] bg-ember" />
                  <h2 className="text-sm font-bold text-ink">추천 장비</h2>
                </div>
                <span className="text-[11.5px] text-[#9aa1ab]">
                  현장 조건 기반 필요도
                </span>
              </div>
              {analysis.equipmentError ? (
                <div className="p-4">
                  <ErrorFallback
                    message="추천 장비를 불러오지 못했습니다."
                    onRetry={isRetryingEquipment ? undefined : retryEquipment}
                  />
                </div>
              ) : (
                <RecommendedEquipmentTable
                  equipment={result.recommendedEquipment}
                />
              )}
            </section>
          </div>

          <div className="flex flex-col gap-5">
            <RiskAnalysisCard
              riskLevel={result.riskLevel}
              probability={probability}
              fastestEtaMinutes={result.estimatedArrivalMinutes}
            />
            <AiBriefingCard summary={result.briefing} reasons={[]} />
          </div>
        </div>
      </div>
    </div>
  );
}
