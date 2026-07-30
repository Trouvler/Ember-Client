"use client";

import { useEffect, useState } from "react";
import MapView from "@/shared/ui/MapView";
import RiskDonut from "@/shared/ui/RiskDonut";
import ErrorFallback from "@/shared/ui/ErrorFallback";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import DemoDataBadge from "@/shared/ui/DemoDataBadge";
import {
  getFireStation,
  getFireStations,
} from "@/entities/fire-station/api/fireStations";
import type {
  FireStation,
  FireStationDetail,
} from "@/entities/fire-station/model/types";
import { DEMO_FIRE_STATIONS } from "@/entities/fire-station/model/demoData";
import { getRiskLayers } from "@/entities/risk-layer/api/getRiskLayers";
import type { RiskLayerFeature } from "@/entities/risk-layer/model/types";
import { DEMO_RISK_FEATURES } from "@/entities/risk-layer/model/demoData";
import { probabilityAsPercent } from "@/shared/utils/probability";
import type { RiskLevel } from "@/entities/dispatch-analysis/model/types";

const LAYERS = ["골든타임 실패율", "평균 도착시간"] as const;

function riskLevelOf(score: number): RiskLevel {
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

const RISK_TEXT_CLASS: Record<RiskLevel, string> = {
  HIGH: "text-risk-high",
  MEDIUM: "text-risk-medium",
  LOW: "text-risk-low",
  UNKNOWN: "text-[#5c6672]",
};

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
  const [features, setFeatures] = useState<RiskLayerFeature[]>([]);
  const [selectedDong, setSelectedDong] = useState<string | null>(null);
  const [isLoadingLayers, setIsLoadingLayers] = useState(true);
  const [layerError, setLayerError] = useState<string | null>(null);
  const isDemoStations =
    !isLoadingStations && !stationError && stations.length === 0;
  const shownStations: FireStation[] = isDemoStations
    ? DEMO_FIRE_STATIONS
    : stations;
  const stationMarkers = shownStations.map((station) => ({
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
    const demo = DEMO_FIRE_STATIONS.find(
      (item) => item.stationId === station.stationId,
    );
    if (demo) {
      setDetailError(null);
      setSelectedStation(demo);
      return;
    }
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

  const loadRiskLayers = async (nextRegion = "") => {
    setIsLoadingLayers(true);
    setLayerError(null);
    setSelectedDong(null);
    try {
      const collection = await getRiskLayers(nextRegion);
      setFeatures(collection.features ?? []);
    } catch {
      setLayerError("위험도 레이어를 불러오지 못했습니다.");
    } finally {
      setIsLoadingLayers(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      void loadStations();
      void loadRiskLayers();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const isDemoFeatures =
    !isLoadingLayers && !layerError && features.length === 0;
  const shownFeatures: RiskLayerFeature[] = isDemoFeatures
    ? DEMO_RISK_FEATURES
    : features;
  const selectedFeature =
    shownFeatures.find(
      (feature) => feature.properties.dongName === selectedDong,
    ) ?? shownFeatures[0];
  const isArrivalLayer = activeLayer === LAYERS[1];

  return (
    <main className="px-4 py-8 sm:px-[22px]">
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-[-0.03em] text-ink">
          위험도 상황 지도
        </h1>
        <p className="mt-1.5 text-[13px] text-[#5c6672]">
          행정동별 화재 출동 위험도를 지도 위에 시각화합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[2.3fr_1fr]">
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
              const station = shownStations.find(
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
              <span aria-hidden="true" className="h-3.5 w-[3px] bg-ember" />
              <h2 className="text-sm font-bold text-ink">
                {selectedFeature?.properties.dongName ?? "행정동 위험도"}
              </h2>
            </div>

            {isLoadingLayers ? (
              <div className="p-6">
                <LoadingSpinner label="위험도 레이어 조회 중" size="sm" />
              </div>
            ) : null}

            {!isLoadingLayers && layerError ? (
              <div className="p-4">
                <ErrorFallback
                  message={layerError}
                  onRetry={() => void loadRiskLayers(region)}
                />
              </div>
            ) : null}

            {isDemoFeatures ? (
              <div className="px-4 pt-3">
                <DemoDataBadge visible />
              </div>
            ) : null}

            {!isLoadingLayers && !layerError && selectedFeature ? (
              <div className="p-6">
                <div className="flex items-center gap-3.5">
                  <RiskDonut
                    value={Math.round(
                      probabilityAsPercent(
                        selectedFeature.properties.riskScore,
                      ),
                    )}
                    level={riskLevelOf(
                      probabilityAsPercent(
                        selectedFeature.properties.riskScore,
                      ),
                    )}
                  />
                  <div>
                    <div className="mb-1.5 text-[11.5px] text-[#6b7280]">
                      등급
                    </div>
                    <div
                      className={`text-[22px] leading-none font-bold ${RISK_TEXT_CLASS[riskLevelOf(probabilityAsPercent(selectedFeature.properties.riskScore))]}`}
                    >
                      {riskLevelOf(
                        probabilityAsPercent(
                          selectedFeature.properties.riskScore,
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 border-t border-[#eef0f3]">
                  <div className="border-r border-[#eef0f3] py-4 pr-3">
                    <div
                      className={`mb-1 text-[11.5px] ${isArrivalLayer ? "font-bold text-ember" : "text-[#6b7280]"}`}
                    >
                      평균 도착시간
                    </div>
                    <div>
                      <span className="mono text-lg font-bold text-ink">
                        {selectedFeature.properties.avgArrivalMinutes}
                      </span>
                      <span className="text-xs text-[#5c6672]"> 분</span>
                    </div>
                  </div>
                  <div className="py-4 pl-3.5">
                    <div
                      className={`mb-1 text-[11.5px] ${isArrivalLayer ? "text-[#6b7280]" : "font-bold text-ember"}`}
                    >
                      골든타임 실패율
                    </div>
                    <div>
                      <span className="mono text-lg font-bold text-risk-high">
                        {probabilityAsPercent(
                          selectedFeature.properties.riskScore,
                        ).toFixed(0)}
                      </span>
                      <span className="text-xs text-[#5c6672]"> %</span>
                    </div>
                  </div>
                </div>

                {shownFeatures.length > 1 ? (
                  <div className="mt-1 border-t border-[#eef0f3] pt-3">
                    <div className="mb-2 text-[11.5px] text-[#6b7280]">
                      행정동 선택
                    </div>
                    <ul className="max-h-40 overflow-y-auto">
                      {shownFeatures.map((feature) => (
                        <li key={feature.properties.dongName}>
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedDong(feature.properties.dongName)
                            }
                            aria-current={
                              feature.properties.dongName ===
                              selectedFeature.properties.dongName
                                ? "true"
                                : undefined
                            }
                            className={`flex w-full items-center justify-between py-1.5 text-left text-xs ${
                              feature.properties.dongName ===
                              selectedFeature.properties.dongName
                                ? "font-bold text-ink"
                                : "text-[#5c6672]"
                            }`}
                          >
                            {feature.properties.dongName}
                            <span className="mono">
                              {`${probabilityAsPercent(feature.properties.riskScore).toFixed(0)}%`}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}
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
                void loadRiskLayers(region);
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
              <DemoDataBadge visible={isDemoStations} />
              {!isLoadingStations &&
              !stationError &&
              shownStations.length > 0 ? (
                <ul className="mt-2 max-h-48 overflow-y-auto">
                  {shownStations.map((station) => (
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
                        <span className="block text-[11px] text-[#6b7280]">
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
    </main>
  );
}
