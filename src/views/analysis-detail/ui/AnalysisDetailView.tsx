"use client";

import { useEffect, useState } from "react";
import IncidentStatusBar from "@/widgets/incident-status-bar/ui/IncidentStatusBar";
import RiskAnalysisCard from "@/widgets/analysis-result-card/ui/RiskAnalysisCard";
import AiBriefingCard from "@/widgets/analysis-result-card/ui/AiBriefingCard";
import DispatchFeedbackForm from "@/widgets/dispatch-feedback-form/ui/DispatchFeedbackForm";
import DispatchOrderForm from "@/widgets/dispatch-order-form/ui/DispatchOrderForm";
import RecommendedTeamTable from "@/shared/ui/RecommendedTeamTable";
import RecommendedEquipmentTable from "@/shared/ui/RecommendedEquipmentTable";
import DegradedBanner from "@/shared/ui/DegradedBanner";
import MapView from "@/shared/ui/MapView";
import ErrorFallback from "@/shared/ui/ErrorFallback";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import { probabilityAsPercent } from "@/shared/utils/probability";
import { useDispatchAnalysis } from "@/entities/dispatch-analysis/model/DispatchAnalysisProvider";
import { getRecommendedEquipment } from "@/entities/dispatch-analysis/api/getRecommendedEquipment";
import { getDispatchAnalysis } from "@/entities/dispatch-analysis/api/getDispatchAnalysis";
import type { DispatchAnalysisResult } from "@/entities/dispatch-analysis/model/types";

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

  const result = hasContextResult ? analysis.result : fetchedResult;

  if (!result) {
    return (
      <main className="px-4 py-6 sm:px-[22px] sm:py-8">
        <h1 className="text-xl font-bold text-ink">분석 결과가 없습니다.</h1>
        <p className="mt-2 max-w-[520px] text-sm leading-[1.7] text-[#5c6672]">
          저장된 분석 결과를 불러오지 못했습니다. 신고 시뮬레이션에서 다시
          분석해 주세요.
        </p>
        {fetchState === "failed" ? (
          <div className="mt-5 max-w-[420px]">
            <ErrorFallback
              message="분석 결과 조회에 실패했습니다."
              onRetry={retryLoad}
            />
          </div>
        ) : null}
      </main>
    );
  }

  // 응답이 신고 좌표를 그대로 돌려주므로 context 없이 복원한 분석도 지도를 띄울 수 있다.
  const location =
    Number.isFinite(result.latitude) && Number.isFinite(result.longitude)
      ? { lat: result.latitude, lng: result.longitude }
      : hasContextResult
        ? analysis.location
        : null;
  const equipmentError = hasContextResult ? analysis.equipmentError : false;
  const probability =
    result.goldenTimeFailureProbability === null
      ? null
      : probabilityAsPercent(result.goldenTimeFailureProbability);

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
        address={
          location
            ? `신고 위치 ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
            : "위치 정보 없음"
        }
        lat={location?.lat}
        lng={location?.lng}
        receivedAtLabel={new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
        initialElapsedSeconds={0}
      />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-[22px] sm:py-8">
        {result.degraded ? (
          <div className="mb-3.5">
            <DegradedBanner visible={result.degraded} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-start">
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
            <AiBriefingCard
              summary={result.briefing}
              reasons={result.reasons}
            />

            <section
              id="dispatch-order"
              className="rounded-xl border border-[#ebedf0] border-l-[3px] border-l-ember card-shadow print:hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6e9ee] px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-3.5 w-[3px] bg-ember" />
                  <h2 className="text-sm font-bold text-ink">출동 지령 전송</h2>
                </div>
                <span className="text-[11.5px] text-[#6b7280]">
                  전송 후 취소 불가
                </span>
              </div>
              <DispatchOrderForm
                analysisId={result.analysisId}
                units={result.recommendedUnits}
              />
            </section>

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
