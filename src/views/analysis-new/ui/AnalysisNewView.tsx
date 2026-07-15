"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DispatchRequestForm from "@/widgets/dispatch-request-form/ui/DispatchRequestForm";
import MapView from "@/shared/ui/MapView";
import type { DispatchLocation } from "@/entities/dispatch-analysis/model/types";

export default function AnalysisNewView() {
  const router = useRouter();
  const [location, setLocation] = useState<DispatchLocation | null>(null);

  return (
    <div className="px-4 py-6 sm:px-[22px] sm:py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-[-0.03em] text-ink">
          신고 시뮬레이션
        </h1>
        <p className="mt-1.5 text-[13px] text-[#8b909a]">
          신고 위치와 사고 정보를 입력하면 AI가 출동 분석 결과를 산출합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {/* 좌: 지도 */}
        <section className="rounded-xl border border-[#ebedf0] card-shadow">
          <div className="flex items-center justify-between border-b border-[#e6e9ee] px-4 py-3.5">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-[3px] bg-ember" />
              <h2 className="text-sm font-bold text-ink">신고 위치 지정</h2>
            </div>
            <span className="text-[11.5px] text-[#9aa1ab]">
              지도를 클릭해 위치를 지정하세요
            </span>
          </div>
          <div className="relative">
            <MapView marker={location} onClickLocation={setLocation} />

            {location ? (
              <div className="pointer-events-none absolute top-[47%] left-1/2 z-10 flex -translate-x-1/2 -translate-y-full flex-col items-center">
                <span className="rounded bg-black px-2.5 py-1 text-[11px] font-bold whitespace-nowrap text-white">
                  선택한 위치
                </span>
              </div>
            ) : null}

            <div className="absolute top-3 right-3 left-3 z-10 flex gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-[#ebedf0] bg-white px-3 py-2.5 card-shadow">
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
                <span className="text-[13px] text-[#5c6672]">
                  주소를 검색하세요
                </span>
              </div>
              <button
                type="button"
                className="rounded-xl bg-[#f2f4f6] px-3.5 py-2.5 text-[13px] font-semibold text-[#374151]"
              >
                주소 검색
              </button>
            </div>

            {location ? (
              <div className="absolute right-3 bottom-3 z-10 rounded-xl border border-[#ebedf0] bg-white/96 px-3 py-2 text-[11.5px] text-[#5c6672] card-shadow">
                좌표{" "}
                <span className="mono text-ink">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              </div>
            ) : null}
          </div>
        </section>

        {/* 우: 입력 폼 */}
        <section className="rounded-xl border border-[#ebedf0] card-shadow">
          <div className="flex items-center gap-2 border-b border-[#e6e9ee] px-4 py-3.5">
            <span className="h-3.5 w-[3px] bg-ember" />
            <h2 className="text-sm font-bold text-ink">신고 정보 입력</h2>
          </div>
          <div className="px-4 pt-5 pb-6 sm:px-6 sm:pt-6 sm:pb-8">
            <DispatchRequestForm
              location={location}
              onSubmitted={(result) => router.push(`/analysis/${result.id}`)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
