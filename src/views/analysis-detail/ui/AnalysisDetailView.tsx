"use client";

import { useEffect, useState } from "react";
import IncidentStatusBar from "@/widgets/incident-status-bar/ui/IncidentStatusBar";
import RiskAnalysisCard from "@/widgets/analysis-result-card/ui/RiskAnalysisCard";
import AiBriefingCard from "@/widgets/analysis-result-card/ui/AiBriefingCard";
import DispatchFeedbackForm from "@/widgets/dispatch-feedback-form/ui/DispatchFeedbackForm";
import RecommendedTeamTable from "@/shared/ui/RecommendedTeamTable";
import RecommendedEquipmentTable from "@/shared/ui/RecommendedEquipmentTable";
import DegradedBanner from "@/shared/ui/DegradedBanner";
import MapView from "@/shared/ui/MapView";
import ErrorFallback from "@/shared/ui/ErrorFallback";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import DemoDataBadge from "@/shared/ui/DemoDataBadge";
import { probabilityAsPercent } from "@/shared/utils/probability";
import { useDispatchAnalysis } from "@/entities/dispatch-analysis/model/DispatchAnalysisProvider";
import { getRecommendedEquipment } from "@/entities/dispatch-analysis/api/getRecommendedEquipment";
import { getDispatchAnalysis } from "@/entities/dispatch-analysis/api/getDispatchAnalysis";
import type { DispatchAnalysisResult } from "@/entities/dispatch-analysis/model/types";
import { DEMO_ANALYSIS_RESULT } from "@/entities/dispatch-analysis/model/demoData";

interface AnalysisDetailViewProps {
  id: string;
}

export default function AnalysisDetailView({ id }: AnalysisDetailViewProps) {
  const { analysis, updateEquipment } = useDispatchAnalysis();
  const [isRetryingEquipment, setIsRetryingEquipment] = useState(false);

  const hasContextResult =
    analysis !== null && String(analysis.result.analysisId) === id;
  const analysisId = Number(id);
  const isValidId = Number.isInteger(analysisId) && analysisId > 0;
  const shouldFetch = !hasContextResult && isValidId;

  const [fetchedResult, setFetchedResult] =
    useState<DispatchAnalysisResult | null>(null);
  const [fetchState, setFetchState] = useState<"idle" | "done" | "failed">(
    "idle",
  );
  const [reloadToken, setReloadToken] = useState(0);

  // 로딩은 상태로 들고 있지 않고 파생한다. context가 뒤늦게 채워지면
  // 저장된 로딩 플래그가 해제되지 않아 스피너에 갇힌다.
  const isLoading = shouldFetch && fetchState === "idle";

  useEffect(() => {
    if (!shouldFetch) return;
    let isMounted = true;
    void getDispatchAnalysis(analysisId)
      .then((result) => {
        if (!isMounted) return;
        setFetchedResult(result);
        setFetchState("done");
      })
      .catch(() => {
        if (isMounted) setFetchState("failed");
      });
    return () => {
      isMounted = false;
    };
  }, [analysisId, shouldFetch, reloadToken]);

  const retryLoad = () => {
    setFetchState("idle");
    setReloadToken((current) => current + 1);
  };

  if (isLoading) {
    return (
      <main className="px-4 py-16 sm:px-[22px]">
        <LoadingSpinner label="분석 결과 조회 중" />
      </main>
    );
  }

  const loadedResult = hasContextResult ? analysis.result : fetchedResult;
  const isDemoResult = loadedResult === null && fetchState === "failed";
  const result = isDemoResult ? DEMO_ANALYSIS_RESULT : loadedResult;

  if (!result) {
    return (
      <main className="px-4 py-6 sm:px-[22px] sm:py-8">
        <h1 className="text-xl font-bold text-ink">분석 결과가 없습니다.</h1>
        <p className="mt-2 max-w-[520px] text-sm leading-[1.7] text-[#5c6672]">
          저장된 분석 결과를 불러오지 못했습니다. 신고 시뮬레이션에서 다시
          분석해 주세요.
        </p>
      </main>
    );
  }

  // API로만 복원한 분석에는 좌표가 없어 지도를 띄울 수 없다.
  const location = hasContextResult ? analysis.location : null;
  const equipmentError = hasContextResult ? analysis.equipmentError : false;
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
        address={location ? "선택한 신고 위치" : "위치 정보 없음"}
        lat={location?.lat}
        lng={location?.lng}
        receivedAtLabel={new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
        initialElapsedSeconds={0}
      />

      <main className="w-full px-4 py-6 sm:px-[22px] sm:py-8">
        {isDemoResult ? (
          <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <DemoDataBadge
              visible
              message="시연 데이터 · 분석 결과를 불러오지 못했습니다"
            />
            <button
              type="button"
              onClick={retryLoad}
              className="self-start text-[12.5px] font-semibold text-[#5c6672] underline decoration-[#b6bcc5] underline-offset-[3px] hover:text-ink print:hidden"
            >
              다시 시도
            </button>
          </div>
        ) : null}

        {result.degraded ? (
          <div className="mb-3.5">
            <DegradedBanner visible={result.degraded} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.75fr_1fr] lg:items-start">
          <div className="flex flex-col gap-5">
            <section className="rounded-xl border border-[#ebedf0] card-shadow print:hidden">
              <div className="flex items-center gap-2 border-b border-[#e6e9ee] px-4 py-3.5">
                <span aria-hidden="true" className="h-3.5 w-[3px] bg-ember" />
                <h2 className="text-sm font-bold text-ink">실시간 관제 지도</h2>
              </div>
              {location ? (
                <MapView marker={location} />
              ) : (
                <p className="px-4 py-10 text-center text-[13px] text-[#6b7280]">
                  저장된 분석에는 신고 좌표가 없어 지도를 표시할 수 없습니다.
                </p>
              )}
            </section>

            <section className="rounded-xl border border-[#ebedf0] card-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6e9ee] px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-3.5 w-[3px] bg-ember" />
                  <h2 className="text-sm font-bold text-ink">추천 출동대</h2>
                </div>
                <span className="text-[11.5px] text-[#6b7280]">
                  도착시간 · 성공률 종합 순위
                </span>
              </div>
              <RecommendedTeamTable teams={result.recommendedUnits} />
            </section>

            <section className="rounded-xl border border-[#ebedf0] card-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6e9ee] px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-3.5 w-[3px] bg-ember" />
                  <h2 className="text-sm font-bold text-ink">추천 장비</h2>
                </div>
                <span className="text-[11.5px] text-[#6b7280]">
                  현장 조건 기반 필요도
                </span>
              </div>
              {equipmentError ? (
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

            <section className="rounded-xl border border-[#ebedf0] card-shadow print:hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6e9ee] px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-3.5 w-[3px] bg-ember" />
                  <h2 className="text-sm font-bold text-ink">출동 결과 등록</h2>
                </div>
                <span className="text-[11.5px] text-[#6b7280]">
                  다음 예측에 반영됩니다
                </span>
              </div>
              <DispatchFeedbackForm
                analysisId={result.analysisId}
                equipmentOptions={result.recommendedEquipment.map(
                  (item) => item.equipmentType,
                )}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
