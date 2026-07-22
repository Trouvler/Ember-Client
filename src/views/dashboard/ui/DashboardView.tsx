"use client";

import { useEffect, useState } from "react";
import MapView from "@/shared/ui/MapView";
import RiskDonut from "@/shared/ui/RiskDonut";
import ErrorFallback from "@/shared/ui/ErrorFallback";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import {
  getFireStation,
  getFireStations,
} from "@/entities/fire-station/api/fireStations";
import type {
  FireStation,
  FireStationDetail,
} from "@/entities/fire-station/model/types";

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
  const [region, setRegion] = useState("");
  const [stations, setStations] = useState<FireStation[]>([]);
  const [selectedStation, setSelectedStation] =
    useState<FireStationDetail | null>(null);
  const [isLoadingStations, setIsLoadingStations] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [stationError, setStationError] = useState<string | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const stationMarkers = stations.map((station) => ({
    id: station.stationId,
    lat: station.latitude,
    lng: station.longitude,
  }));

  const loadStations = async (nextRegion = "") => {
    setIsLoadingStations(true);
    setStationError(null);
    setSelectedStation(null);
    setDetailError(null);
    try {
      setStations(await getFireStations(nextRegion));
    } catch {
      setStationError("소방서 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoadingStations(false);
    }
  };

  const selectStation = async (station: FireStation) => {
    setIsLoadingDetail(true);
    setDetailError(null);
    try {
      setSelectedStation(await getFireStation(station.stationId));
    } catch {
      setDetailError("소방서 상세 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => void loadStations(), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="px-[22px] py-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-[-0.03em] text-ink">
          위험도 상황 지도
        </h1>
        <p className="mt-1.5 text-[13px] text-[#8b909a]">
          행정동별 화재 출동 위험도를 지도 위에 시각화합니다.
        </p>
      </div>

      <div className="grid grid-cols-[2.3fr_1fr] items-start gap-5">
        {/* 지도 */}
        <section className="rounded-xl border border-[#ebedf0] card-shadow">
          <div className="flex items-center justify-between border-b border-[#e6e9ee] px-4 py-3.5">
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
          <MapView
            markers={stationMarkers}
            center={
              selectedStation
                ? {
                    lat: selectedStation.latitude,
                    lng: selectedStation.longitude,
                  }
                : null
            }
            onClickMarker={(stationId) => {
              const station = stations.find(
                (item) => item.stationId === stationId,
              );
              if (station) void selectStation(station);
            }}
          />
        </section>

        {/* 사이드바 */}
        <div className="flex flex-col gap-5">
          {/* 레이어 토글 */}
          <section className="rounded-xl border border-[#ebedf0] p-5 card-shadow">
            <div className="mb-3 text-xs font-bold text-[#5c6672]">레이어</div>
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
            <div className="flex items-center gap-2 border-b border-[#e6e9ee] px-4 py-3.5">
              <span className="h-3.5 w-[3px] bg-ember" />
              <h2 className="text-sm font-bold text-ink">
                {SAMPLE_DISTRICT.name}
              </h2>
            </div>
            <div className="p-6">
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
              <div className="mt-5 grid grid-cols-2 border-t border-[#eef0f3]">
                <div className="border-r border-[#eef0f3] py-4 pr-3">
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
                <div className="py-4 pl-3.5">
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
              <div className="mt-1 border-t border-[#eef0f3] pt-4 text-xs leading-[1.6] text-[#6b7280]">
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

          <div className="rounded-xl border border-[#ebedf0] border-l-[3px] border-l-risk-high px-4 py-4 text-[11.5px] leading-[1.6] text-[#6b7280] card-shadow">
            본 지도는 AI 예측 모델 기반이며 실제 상황과 다를 수 있습니다.
          </div>

          <section className="rounded-xl border border-[#ebedf0] card-shadow">
            <div className="flex items-center gap-2 border-b border-[#e6e9ee] px-4 py-3.5">
              <span className="h-3.5 w-[3px] bg-ember" />
              <h2 className="text-sm font-bold text-ink">소방서 현황</h2>
            </div>
            <form
              className="flex gap-2 border-b border-[#eef0f3] p-3"
              onSubmit={(event) => {
                event.preventDefault();
                void loadStations(region);
              }}
            >
              <input
                aria-label="소방서 지역"
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                placeholder="지역명"
                className="min-w-0 flex-1 rounded-lg border border-[#ebedf0] px-2.5 py-2 text-xs text-ink"
              />
              <button
                type="submit"
                className="rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-white"
              >
                조회
              </button>
            </form>
            <div className="p-3">
              {isLoadingStations ? (
                <LoadingSpinner label="소방서 조회 중" size="sm" />
              ) : null}
              {stationError ? (
                <ErrorFallback
                  message={stationError}
                  onRetry={() => void loadStations(region)}
                />
              ) : null}
              {!isLoadingStations && !stationError && stations.length === 0 ? (
                <p className="py-3 text-center text-xs text-[#8b909a]">
                  조회된 소방서가 없습니다.
                </p>
              ) : null}
              {!isLoadingStations && !stationError && stations.length > 0 ? (
                <ul className="max-h-48 overflow-y-auto">
                  {stations.map((station) => (
                    <li
                      key={station.stationId}
                      className="border-b border-[#f2f4f6] last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => void selectStation(station)}
                        className="w-full px-1 py-2.5 text-left"
                      >
                        <span className="block text-sm font-semibold text-ink">
                          {station.name}
                        </span>
                        <span className="block text-[11px] text-[#8b909a]">
                          {station.address}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              {isLoadingDetail ? (
                <LoadingSpinner label="상세 조회 중" size="sm" />
              ) : null}
              {detailError ? <ErrorFallback message={detailError} /> : null}
              {selectedStation ? (
                <div className="mt-3 border-t border-[#eef0f3] pt-3 text-xs leading-6 text-[#5c6672]">
                  <p className="font-bold text-ink">{selectedStation.name}</p>
                  <p>
                    {selectedStation.type} · {selectedStation.address}
                  </p>
                  <p>
                    보유 장비:{" "}
                    {selectedStation.equipment.length
                      ? selectedStation.equipment.join(", ")
                      : "정보 없음"}
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
