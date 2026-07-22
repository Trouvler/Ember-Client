"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

interface HistoryRow {
  id: string;
  incidentNo: string;
  occurredAt: string;
  incidentType: string;
  riskLevel: RiskLevel;
  location: string;
}

const RISK_TEXT_CLASS: Record<RiskLevel, string> = {
  HIGH: "text-risk-high",
  MEDIUM: "text-risk-medium",
  LOW: "text-risk-low",
};

const SAMPLE_ROWS: HistoryRow[] = [
  {
    id: "sample-1",
    incidentNo: "2026-0712-00847",
    occurredAt: "07-12 14:23",
    incidentType: "화재 · 주거",
    riskLevel: "HIGH",
    location: "종로구 창신동",
  },
  {
    id: "sample-2",
    incidentNo: "2026-0712-00839",
    occurredAt: "07-12 11:07",
    incidentType: "화재 · 공장",
    riskLevel: "HIGH",
    location: "금천구 가산동",
  },
  {
    id: "sample-3",
    incidentNo: "2026-0712-00811",
    occurredAt: "07-11 22:41",
    incidentType: "구조 · 승강기",
    riskLevel: "MEDIUM",
    location: "강남구 역삼동",
  },
  {
    id: "sample-4",
    incidentNo: "2026-0712-00798",
    occurredAt: "07-11 18:20",
    incidentType: "화재 · 근린생활",
    riskLevel: "MEDIUM",
    location: "마포구 서교동",
  },
  {
    id: "sample-5",
    incidentNo: "2026-0712-00776",
    occurredAt: "07-11 15:55",
    incidentType: "구급 · 낙상",
    riskLevel: "MEDIUM",
    location: "중구 을지로3가",
  },
  {
    id: "sample-6",
    incidentNo: "2026-0712-00742",
    occurredAt: "07-11 09:12",
    incidentType: "구급 · 질환",
    riskLevel: "LOW",
    location: "서초구 방배동",
  },
  {
    id: "sample-7",
    incidentNo: "2026-0712-00715",
    occurredAt: "07-10 20:33",
    incidentType: "화재 · 주거",
    riskLevel: "LOW",
    location: "노원구 상계동",
  },
  {
    id: "sample-8",
    incidentNo: "2026-0712-00689",
    occurredAt: "07-10 13:48",
    incidentType: "구조 · 갇힘",
    riskLevel: "LOW",
    location: "성동구 성수동",
  },
];

export default function AnalysisListView() {
  const [region, setRegion] = useState("서울 전체");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const filteredRows = useMemo(
    () =>
      SAMPLE_ROWS.filter(
        (row) =>
          (region === "서울 전체" || row.location.includes(region)) &&
          [row.incidentNo, row.location, row.incidentType]
            .join(" ")
            .includes(query.trim()),
      ),
    [query, region],
  );
  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const visibleRows = filteredRows.slice(
    page * pageSize,
    (page + 1) * pageSize,
  );

  return (
    <div className="px-[22px] py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-[-0.03em] text-ink">
          출동 분석 이력
        </h1>
        <p className="mt-1.5 text-[13px] text-[#8b909a]">
          과거 신고 건에 대한 AI 분석 결과를 조회합니다.
        </p>
      </div>

      {/* 필터 바 */}
      <div className="mb-6 flex flex-wrap items-center gap-2.5 rounded-xl border border-[#ebedf0] px-4 py-5 card-shadow">
        <select
          value={region}
          onChange={(event) => {
            setRegion(event.target.value);
            setPage(0);
          }}
          className="cursor-pointer rounded-xl border border-[#ebedf0] py-2.5 pr-9 pl-3 text-[13px] text-ink card-shadow"
        >
          <option>서울 전체</option>
          <option>종로구</option>
          <option>강남구</option>
          <option>중구</option>
          <option>동대문구</option>
        </select>
        <select
          defaultValue="최근 7일"
          className="cursor-pointer rounded-xl border border-[#ebedf0] py-2.5 pr-9 pl-3 text-[13px] text-ink card-shadow"
        >
          <option>최근 7일</option>
          <option>최근 30일</option>
          <option>최근 90일</option>
          <option>기간 직접 지정</option>
        </select>
        <label className="flex min-w-[180px] flex-1 items-center gap-2 rounded-xl border border-[#ebedf0] px-3 py-2 card-shadow">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9aa1ab"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            aria-label="접수번호 또는 위치 검색"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder="접수번호 · 위치 검색"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-[#adb3bd]"
          />
        </label>
        <button
          type="button"
          onClick={() => setPage(0)}
          className="rounded-xl bg-ink px-5 py-2.5 text-[13px] font-semibold text-white"
        >
          검색
        </button>
      </div>

      {/* 목록 테이블 */}
      <div className="overflow-hidden rounded-xl border border-[#ebedf0] card-shadow">
        <div className="flex items-center justify-between border-b border-[#e6e9ee] px-4 py-4">
          <span className="text-[13px] text-[#5c6672]">
            총{" "}
            <span className="mono font-semibold text-ink">
              {filteredRows.length}
            </span>
            건 · 최근순
          </span>
          <span className="text-[11.5px] text-[#adb3bd]">
            위험도 HIGH 표시 우선
          </span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="bg-[#f4f6f8] px-4 py-4 text-[11.5px] font-bold text-[#5c6672]">
                접수번호
              </th>
              <th className="bg-[#f4f6f8] px-4 py-4 text-[11.5px] font-bold text-[#5c6672]">
                발생시각
              </th>
              <th className="bg-[#f4f6f8] px-4 py-4 text-[11.5px] font-bold text-[#5c6672]">
                사고유형
              </th>
              <th className="w-[96px] bg-[#f4f6f8] px-4 py-4 text-[11.5px] font-bold text-[#5c6672]">
                위험도
              </th>
              <th className="bg-[#f4f6f8] px-4 py-4 text-[11.5px] font-bold text-[#5c6672]">
                위치
              </th>
              <th className="w-[92px] bg-[#f4f6f8] px-4 py-4 text-center text-[11.5px] font-bold text-[#5c6672]" />
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#eef0f3] last:border-b-0 hover:bg-[#f7f9fb]"
              >
                <td className="mono px-4 py-5 text-[13px] text-ink">
                  {row.incidentNo}
                </td>
                <td className="mono px-4 py-5 text-[12.5px] text-[#5c6672]">
                  {row.occurredAt}
                </td>
                <td className="px-4 py-5 text-[13.5px] text-ink">
                  {row.incidentType}
                </td>
                <td
                  className={`px-4 py-5 text-[13px] font-bold ${RISK_TEXT_CLASS[row.riskLevel]}`}
                >
                  {row.riskLevel}
                </td>
                <td className="px-4 py-5 text-[13px] text-[#5c6672]">
                  {row.location}
                </td>
                <td className="px-4 py-5 text-center">
                  <Link
                    href="/analysis/new"
                    className="text-[12.5px] font-semibold text-[#1c3c6e]"
                  >
                    분석 시작
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-center gap-1 py-10">
        <button
          type="button"
          aria-label="이전 페이지"
          disabled={page === 0}
          onClick={() => setPage((value) => value - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#ebedf0] text-[#5c6672] disabled:text-[#9aa1ab] card-shadow"
        >
          ‹
        </button>
        {Array.from({ length: pageCount }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setPage(index)}
            className={`mono flex h-8 w-8 items-center justify-center rounded-xl border font-semibold ${page === index ? "border-ink bg-ink text-white" : "border-[#ebedf0] text-[#5c6672] card-shadow"}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          type="button"
          aria-label="다음 페이지"
          disabled={page >= pageCount - 1}
          onClick={() => setPage((value) => value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#ebedf0] text-[#5c6672] disabled:text-[#9aa1ab] card-shadow"
        >
          ›
        </button>
      </div>
    </div>
  );
}
