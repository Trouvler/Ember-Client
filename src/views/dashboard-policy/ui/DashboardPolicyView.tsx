"use client";

import { useEffect, useState } from "react";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import ErrorFallback from "@/shared/ui/ErrorFallback";
import { probabilityAsPercent } from "@/shared/utils/probability";
import { getPolicyDashboard } from "@/entities/policy-dashboard/api/getPolicyDashboard";
import type { PolicyDashboard } from "@/entities/policy-dashboard/model/types";

const RANK_BADGE_CLASSES = [
  "bg-risk-high",
  "bg-[#d9534f]",
  "bg-ember",
  "bg-[#f0913c]",
  "bg-[#f0b06a]",
];

export default function DashboardPolicyView() {
  const [dashboard, setDashboard] = useState<PolicyDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let isMounted = true;
    void getPolicyDashboard()
      .then((next) => {
        if (!isMounted) return;
        setDashboard(next);
        setError(null);
      })
      .catch(() => {
        if (isMounted) setError("화재 안전 통계를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [reloadToken]);

  const retry = () => {
    setIsLoading(true);
    setError(null);
    setReloadToken((current) => current + 1);
  };

  const shown = dashboard;
  const districts = shown?.vulnerableDistrictTop5 ?? [];

  return (
    <main>
      {/* 타이틀 배너 */}
      <div className="border-b border-[#edeff2] bg-white">
        <div className="px-4 pt-10 pb-10 sm:px-6 sm:pt-16 sm:pb-16">
          <p className="mb-3 text-[13px] font-bold text-ember">
            화재 안전 공공데이터
          </p>
          <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-ink sm:text-[32px] sm:tracking-[-0.035em]">
            우리 동네 화재 안전 정보
          </h1>
          <p className="mt-3.5 max-w-[560px] text-[15px] leading-[1.7] text-[#5c6672]">
            AI가 분석한 지역별 화재 출동 위험도와 대응 통계를 누구나 확인할 수
            있습니다. 우리 동네의 안전 수준을 살펴보세요.
          </p>
        </div>
      </div>

      <div className="px-4 pt-8 pb-10 sm:px-6 sm:pt-12 sm:pb-16">
        {isLoading ? (
          <div className="py-16">
            <LoadingSpinner label="화재 안전 통계 조회 중" />
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="mx-auto max-w-[480px] py-8">
            <ErrorFallback message={error} onRetry={retry} />
          </div>
        ) : null}

        {!isLoading && !error && shown ? (
          <>
            {/* 요약 카드 */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-5">
              <div className="rounded-2xl border border-[#ebedf0] px-5 py-6 card-shadow sm:px-7 sm:py-8">
                <div className="text-[13px] text-[#6b7280]">전체 분석 건수</div>
                <div className="mt-2.5 flex items-baseline gap-1">
                  <span className="mono text-[32px] font-bold text-ink">
                    {shown.totalAnalyzedCases.toLocaleString("ko-KR")}
                  </span>
                  <span className="text-sm text-[#5c6672]">건</span>
                </div>
                <div className="mt-2 text-xs text-[#6b7280]">
                  {shown.region} 기준 누적
                </div>
              </div>
              <div className="rounded-2xl border border-[#ebedf0] px-5 py-6 card-shadow sm:px-7 sm:py-8">
                <div className="text-[13px] text-[#6b7280]">
                  평균 골든타임 실패율
                </div>
                <div className="mt-2.5 flex items-baseline gap-1">
                  <span className="mono text-[32px] font-bold text-risk-high">
                    {probabilityAsPercent(
                      shown.avgGoldenTimeFailureRate,
                    ).toFixed(1)}
                  </span>
                  <span className="text-sm text-[#5c6672]">%</span>
                </div>
                <div className="mt-2 text-xs text-[#6b7280]">
                  7분 내 현장 도착 실패 기준
                </div>
              </div>
            </div>

            {/* 취약 행정동 TOP5 */}
            <section className="rounded-2xl border border-[#ebedf0] card-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eef0f3] px-5 py-4 sm:px-7 sm:py-5">
                <div className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-4 w-[3px] bg-ember" />
                  <h2 className="text-base font-bold text-ink">
                    화재 취약 행정동 TOP 5
                  </h2>
                </div>
                <span className="text-xs text-[#6b7280]">
                  골든타임 실패율 기준
                </span>
              </div>
              {districts.length === 0 ? (
                <p className="px-5 py-12 text-center text-[13px] text-[#6b7280]">
                  아직 집계된 취약 행정동이 없습니다.
                </p>
              ) : (
                <div className="px-5 py-2 sm:px-7">
                  {districts.map((district, index) => (
                    <div
                      key={district.districtName}
                      className="flex items-center gap-4 border-b border-[#f2f4f6] py-5 last:border-b-0"
                    >
                      <span
                        className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-xl text-[13px] font-bold text-white ${RANK_BADGE_CLASSES[index] ?? "bg-[#f0b06a]"}`}
                      >
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <span className="text-[15px] font-bold text-ink">
                          {district.districtName}
                        </span>
                        <span className="mt-0.5 block text-[11.5px] text-[#6b7280]">
                          평균 도착{" "}
                          <span className="mono">
                            {district.avgArrivalMinutes}
                          </span>
                          분
                        </span>
                      </div>
                      <span className="mono text-lg font-bold text-risk-high">
                        {`${probabilityAsPercent(district.failureRate).toFixed(0)}%`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}

        {/* 안내문 */}
        <div className="mt-8 text-center text-xs leading-[1.6] text-[#6b7280]">
          이 데이터는 AI 예측 모델 기반이며 실제와 다를 수 있습니다.
          <br />
          제6회 소방안전 빅데이터 활용 및 아이디어 경진대회 출품작 · 잉걸불
        </div>
      </div>
    </main>
  );
}
