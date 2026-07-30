"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import ErrorFallback from "@/shared/ui/ErrorFallback";
import { probabilityAsPercent } from "@/shared/utils/probability";
import { getDispatchAnalyses } from "@/entities/dispatch-analysis/api/getDispatchAnalyses";
import { INCIDENT_TYPE_LABELS } from "@/entities/dispatch-analysis/model/types";
import type {
  DispatchAnalysesPage,
  RiskLevel,
} from "@/entities/dispatch-analysis/model/types";

const RISK_TEXT_CLASS: Record<RiskLevel, string> = {
  HIGH: "text-risk-high",
  MEDIUM: "text-risk-medium",
  LOW: "text-risk-low",
  UNKNOWN: "text-[#5c6672]",
};

const REGIONS = ["서울 전체", "종로구", "강남구", "중구", "동대문구"] as const;

const PAGE_SIZE = 10;

function formatOccurredAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function AnalysisListView() {
  const [region, setRegion] = useState<(typeof REGIONS)[number]>(REGIONS[0]);
  const [page, setPage] = useState(0);
  const [result, setResult] = useState<DispatchAnalysesPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // 로딩 표시는 이벤트 핸들러에서 켠다. effect 본문에서 동기 setState를 하면
  // react-hooks/set-state-in-effect 위반이다.
  useEffect(() => {
    let isMounted = true;
    void getDispatchAnalyses({
      region: region === REGIONS[0] ? undefined : region,
      page,
      size: PAGE_SIZE,
    })
      .then((nextResult) => {
        if (!isMounted) return;
        setResult(nextResult);
        setError(null);
      })
      .catch(() => {
        if (isMounted) setError("출동 분석 이력을 불러오지 못했습니다.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [region, page, reloadToken]);

  const changeRegion = (next: (typeof REGIONS)[number]) => {
    setIsLoading(true);
    setRegion(next);
    setPage(0);
  };

  const changePage = (next: number) => {
    setIsLoading(true);
    setPage(next);
  };

  const retry = () => {
    setIsLoading(true);
    setError(null);
    setReloadToken((current) => current + 1);
  };

  const rows = result?.content ?? [];
  const totalElements = result?.totalElements ?? 0;
  const pageCount = Math.max(1, Math.ceil(totalElements / PAGE_SIZE));

  return (
    <main className="px-4 py-8 sm:px-[22px]">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-[-0.03em] text-ink">
          출동 분석 이력
        </h1>
        <p className="mt-1.5 text-[13px] text-[#6b7280]">
          과거 신고 건에 대한 AI 분석 결과를 조회합니다.
        </p>
      </div>

      {/* 필터 바 */}
      <div className="mb-6 flex flex-wrap items-center gap-2.5 rounded-xl border border-[#ebedf0] px-4 py-5 card-shadow">
        <label
          htmlFor="region"
          className="text-[13px] font-semibold text-[#374151]"
        >
          지역
        </label>
        <select
          id="region"
          value={region}
          onChange={(event) =>
            changeRegion(event.target.value as (typeof REGIONS)[number])
          }
          className="cursor-pointer rounded-xl border border-[#ebedf0] py-2.5 pr-9 pl-3 text-[13px] text-ink card-shadow"
        >
          {REGIONS.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* 목록 테이블 */}
      <div className="overflow-hidden rounded-xl border border-[#ebedf0] card-shadow">
        <div className="flex items-center justify-between border-b border-[#e6e9ee] px-4 py-4">
          <span className="text-[13px] text-[#5c6672]">
            총{" "}
            <span className="mono font-semibold text-ink">{totalElements}</span>
            건 · 최근순
          </span>
          <span className="text-[11.5px] text-[#6b7280]">
            확률은 골든타임 실패 기준
          </span>
        </div>

        {isLoading ? (
          <div className="px-4 py-10">
            <LoadingSpinner label="출동 이력 조회 중" />
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="p-4">
            <ErrorFallback message={error} onRetry={retry} />
          </div>
        ) : null}

        {!isLoading && !error && rows.length === 0 ? (
          <p className="px-4 py-12 text-center text-[13px] text-[#6b7280]">
            조회된 출동 분석 이력이 없습니다.
          </p>
        ) : null}

        {!isLoading && !error && rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  {[
                    "분석번호",
                    "발생시각",
                    "사고유형",
                    "위험도",
                    "실패확률",
                    "예상 도착",
                    "",
                  ].map((label, index) => (
                    <th
                      key={label || `action-${index}`}
                      scope="col"
                      className="bg-[#f4f6f8] px-4 py-4 text-[11.5px] font-bold whitespace-nowrap text-[#5c6672]"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.analysisId}
                    className="border-b border-[#eef0f3] last:border-b-0 hover:bg-[#f7f9fb]"
                  >
                    <td className="mono px-4 py-5 text-[13px] whitespace-nowrap text-ink">
                      {row.analysisId}
                    </td>
                    <td className="mono px-4 py-5 text-[12.5px] whitespace-nowrap text-[#5c6672]">
                      {formatOccurredAt(row.occurredAt)}
                    </td>
                    <td className="px-4 py-5 text-[13.5px] whitespace-nowrap text-ink">
                      {INCIDENT_TYPE_LABELS[row.incidentType]}
                    </td>
                    <td
                      className={`px-4 py-5 text-[13px] font-bold whitespace-nowrap ${RISK_TEXT_CLASS[row.riskLevel]}`}
                    >
                      {row.riskLevel}
                    </td>
                    <td className="mono px-4 py-5 text-[13px] whitespace-nowrap text-[#5c6672]">
                      {`${probabilityAsPercent(row.goldenTimeFailureProbability).toFixed(1)}%`}
                    </td>
                    <td className="mono px-4 py-5 text-[13px] whitespace-nowrap text-[#5c6672]">
                      {row.estimatedArrivalMinutes === null
                        ? "—"
                        : `${row.estimatedArrivalMinutes}분`}
                    </td>
                    <td className="px-4 py-5 text-center">
                      <Link
                        href={`/analysis/${row.analysisId}`}
                        className="text-[12.5px] font-semibold whitespace-nowrap text-[#1c3c6e] underline underline-offset-[3px]"
                      >
                        결과 보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>

      {/* 페이지네이션 */}
      {!isLoading && !error && rows.length > 0 ? (
        <div className="flex items-center justify-center gap-1 py-10">
          <button
            type="button"
            aria-label="이전 페이지"
            disabled={page === 0}
            onClick={() => changePage(page - 1)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#ebedf0] text-[#5c6672] disabled:text-[#adb3bd] card-shadow"
          >
            ‹
          </button>
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-current={page === index ? "page" : undefined}
              onClick={() => changePage(index)}
              className={`mono flex h-8 w-8 items-center justify-center rounded-xl border font-semibold ${page === index ? "border-ink bg-ink text-white" : "border-[#ebedf0] text-[#5c6672] card-shadow"}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            type="button"
            aria-label="다음 페이지"
            disabled={page >= pageCount - 1}
            onClick={() => changePage(page + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#ebedf0] text-[#5c6672] disabled:text-[#adb3bd] card-shadow"
          >
            ›
          </button>
        </div>
      ) : null}
    </main>
  );
}
