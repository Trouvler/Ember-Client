"use client";

import { useState } from "react";
import MapView from "@/shared/ui/MapView";
import RiskDonut from "@/shared/ui/RiskDonut";

const SAMPLE_DISTRICT = {
  name: "종로구 창신동",
  location: { lat: 37.5744, lng: 127.0157 },
  riskValue: 71,
  avgArrivalMinutes: 8.4,
  oldBuildingRate: 71,
  recentReportCount: 37,
  jurisdiction: "종로소방서",
};

const LAYERS = ["골든타임 실패율", "평균 도착시간"] as const;

export default function DashboardView() {
  const [activeLayer, setActiveLayer] = useState<(typeof LAYERS)[number]>(
    LAYERS[0],
  );

  return (
    <div className="mx-auto max-w-[1920px] px-[22px] py-4">
      <div className="mb-3.5">
        <h1 className="text-xl font-bold tracking-[-0.03em] text-ink">
          위험도 상황 지도
        </h1>
        <p className="mt-1.5 text-[13px] text-[#8b909a]">
          행정동별 화재 출동 위험도를 지도 위에 시각화합니다.
        </p>
      </div>

      <div className="grid grid-cols-[2.3fr_1fr] items-start gap-3.5">
        {/* 지도 */}
        <section className="rounded-xl border border-[#ebedf0] card-shadow">
          <div className="flex items-center justify-between border-b border-[#e6e9ee] px-3.5 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3.5 w-[3px] bg-ember" />
              <h2 className="text-sm font-bold text-ink">
                서울시 골든타임 실패율
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11.5px] text-[#6b7280]">
              <span className="inline-block h-[9px] w-[9px] rounded-[2px] bg-ink" />
              소방서
            </span>
          </div>
          <MapView marker={SAMPLE_DISTRICT.location} />
        </section>

        {/* 사이드바 */}
        <div className="flex flex-col gap-3.5">
          {/* 레이어 토글 */}
          <section className="rounded-xl border border-[#ebedf0] p-3.5 card-shadow">
            <div className="mb-2.5 text-xs font-bold text-[#5c6672]">
              레이어
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LAYERS.map((layer) => (
                <button
                  key={layer}
                  type="button"
                  onClick={() => setActiveLayer(layer)}
                  className={`rounded-xl py-2.5 text-[13px] font-bold ${
                    layer === activeLayer
                      ? "bg-ink text-white"
                      : "border border-[#ebedf0] bg-white text-[#5c6672] card-shadow"
                  }`}
                >
                  {layer}
                </button>
              ))}
            </div>
          </section>

          {/* 선택 행정동 상세 */}
          <section className="rounded-xl border border-[#ebedf0] card-shadow">
            <div className="flex items-center gap-2 border-b border-[#e6e9ee] px-3.5 py-2.5">
              <span className="h-3.5 w-[3px] bg-ember" />
              <h2 className="text-sm font-bold text-ink">
                {SAMPLE_DISTRICT.name}
              </h2>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3.5">
                <RiskDonut value={SAMPLE_DISTRICT.riskValue} level="HIGH" />
                <div>
                  <div className="mb-1.5 text-[11.5px] text-[#9aa1ab]">
                    등급
                  </div>
                  <div className="text-[22px] leading-none font-bold text-risk-high">
                    HIGH
                  </div>
                  <div className="mt-2 inline-block rounded bg-risk-high-bg px-2 py-0.5 text-[11px] font-bold text-risk-high-text">
                    중점 관리 대상
                  </div>
                </div>
              </div>
              <div className="mt-3.5 grid grid-cols-2 border-t border-[#eef0f3]">
                <div className="border-r border-[#eef0f3] py-3 pr-3">
                  <div className="mb-1 text-[11.5px] text-[#9aa1ab]">
                    평균 도착시간
                  </div>
                  <div>
                    <span className="mono text-lg font-bold text-ink">
                      {SAMPLE_DISTRICT.avgArrivalMinutes}
                    </span>
                    <span className="text-xs text-[#5c6672]"> 분</span>
                  </div>
                </div>
                <div className="py-3 pl-3.5">
                  <div className="mb-1 text-[11.5px] text-[#9aa1ab]">
                    노후건물 비율
                  </div>
                  <div>
                    <span className="mono text-lg font-bold text-risk-high">
                      {SAMPLE_DISTRICT.oldBuildingRate}
                    </span>
                    <span className="text-xs text-[#5c6672]"> %</span>
                  </div>
                </div>
              </div>
              <div className="mt-1 border-t border-[#eef0f3] pt-3 text-xs leading-[1.6] text-[#6b7280]">
                최근 90일 신고{" "}
                <span className="mono font-semibold text-ink">
                  {SAMPLE_DISTRICT.recentReportCount}
                </span>
                건 · 관할{" "}
                <span className="font-semibold text-ink">
                  {SAMPLE_DISTRICT.jurisdiction}
                </span>
              </div>
            </div>
          </section>

          <div className="rounded-xl border border-[#ebedf0] border-l-[3px] border-l-risk-high px-3.5 py-3 text-[11.5px] leading-[1.6] text-[#6b7280] card-shadow">
            본 지도는 AI 예측 모델 기반이며 실제 상황과 다를 수 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
}
