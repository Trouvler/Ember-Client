"use client";

import { useEffect, useState } from "react";
import { postDispatchAnalysis } from "@/entities/dispatch-analysis/api/postDispatchAnalysis";
import IncidentTypeSelector from "@/entities/dispatch-analysis/ui/IncidentTypeSelector";
import type {
  BuildingType,
  DispatchAnalysisResult,
  DispatchLocation,
  IncidentType,
} from "@/entities/dispatch-analysis/model/types";
import { BUILDING_TYPE_LABELS } from "@/entities/dispatch-analysis/model/types";
import { getRecommendedEquipment } from "@/entities/dispatch-analysis/api/getRecommendedEquipment";
import { getNearbyStations } from "@/entities/fire-station/api/fireStations";
import type { NearbyStation } from "@/entities/fire-station/model/types";
import { DEMO_NEARBY_STATIONS } from "@/entities/fire-station/model/demoData";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import ErrorFallback from "@/shared/ui/ErrorFallback";
import DemoDataBadge from "@/shared/ui/DemoDataBadge";

interface DispatchRequestFormProps {
  location: DispatchLocation | null;
  onSubmitted: (
    result: DispatchAnalysisResult,
    equipmentError: boolean,
  ) => void;
}

const BUILDING_TYPES = Object.entries(BUILDING_TYPE_LABELS) as [
  BuildingType,
  string,
][];

function formatOccurredAt(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function DispatchRequestForm({
  location,
  onSubmitted,
}: DispatchRequestFormProps) {
  const [incidentType, setIncidentType] = useState<IncidentType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [occurredAt, setOccurredAt] = useState("");
  const [buildingType, setBuildingType] = useState<BuildingType | "">("");

  useEffect(() => {
    const id = setTimeout(() => setOccurredAt(new Date().toISOString()), 0);
    return () => clearTimeout(id);
  }, []);

  // 요청 서명을 키로 들고 있어 결과가 어긋나지 않고, 로딩 상태를 파생할 수 있다.
  const nearbyKey =
    location && incidentType
      ? `${location.lat},${location.lng},${incidentType}`
      : null;
  const [nearby, setNearby] = useState<{
    key: string;
    stations: NearbyStation[] | null;
  } | null>(null);

  useEffect(() => {
    if (!nearbyKey || !location || !incidentType) return;
    let isMounted = true;
    void getNearbyStations({
      lat: location.lat,
      lng: location.lng,
      incidentType,
    })
      .then((stations) => {
        if (isMounted) setNearby({ key: nearbyKey, stations });
      })
      .catch(() => {
        if (isMounted) setNearby({ key: nearbyKey, stations: null });
      });
    return () => {
      isMounted = false;
    };
  }, [nearbyKey, location, incidentType]);

  const nearbyResult = nearby?.key === nearbyKey ? nearby : null;
  const isLoadingNearby = nearbyKey !== null && nearbyResult === null;
  const isDemoNearby = nearbyResult?.stations?.length === 0;
  const shownNearby = isDemoNearby
    ? DEMO_NEARBY_STATIONS
    : (nearbyResult?.stations ?? []);

  const isDisabled = !location || !incidentType || !occurredAt || isSubmitting;

  const handleSubmit = async () => {
    if (!location || !incidentType) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await postDispatchAnalysis({
        incidentType,
        latitude: location.lat,
        longitude: location.lng,
        occurredAt,
        ...(buildingType ? { buildingType } : {}),
      });
      try {
        const equipment = await getRecommendedEquipment(result.analysisId);
        onSubmitted(
          { ...result, recommendedEquipment: equipment.recommendedEquipment },
          false,
        );
      } catch {
        onSubmitted(result, true);
      }
    } catch {
      setError("신고 분석 요청에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!location ? (
        <div className="flex items-start gap-2 rounded-xl border border-[#ebedf0] bg-[#f8f9fb] px-3 py-2.5 text-xs leading-[1.55] text-[#5c6672] card-shadow">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="mt-px shrink-0 text-ember"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          신고 위치를 지도에서 클릭하거나 주소를 검색하세요.
        </div>
      ) : null}

      <div>
        <label className="text-[13px] font-semibold text-[#374151]">
          사고 유형
        </label>
        <div className="mt-[9px]">
          <IncidentTypeSelector
            value={incidentType}
            onChange={setIncidentType}
          />
        </div>
      </div>

      {nearbyKey ? (
        <div>
          <div className="text-[13px] font-semibold text-[#374151]">
            인접 출동대
          </div>
          <div className="mt-[9px] rounded-xl border border-[#ebedf0] px-3 py-2.5 card-shadow">
            {isLoadingNearby ? (
              <LoadingSpinner label="인접 출동대 조회 중" size="sm" />
            ) : null}

            {!isLoadingNearby && nearbyResult?.stations === null ? (
              <p className="py-1 text-center text-xs text-[#6b7280]">
                인접 출동대를 불러오지 못했습니다.
              </p>
            ) : null}

            {isDemoNearby ? (
              <div className="pb-2">
                <DemoDataBadge visible />
              </div>
            ) : null}

            {!isLoadingNearby && shownNearby.length > 0 ? (
              <ul>
                {shownNearby.map((station) => (
                  <li
                    key={station.stationId}
                    className="flex items-center justify-between gap-2 border-b border-[#eef0f3] py-2 text-xs last:border-b-0"
                  >
                    <span className="font-semibold text-ink">
                      {station.name}
                    </span>
                    <span className="text-[#5c6672]">
                      <span className="mono">
                        {(station.distanceMeters / 1000).toFixed(1)}
                      </span>
                      km ·{" "}
                      <span className="mono">
                        {station.estimatedArrivalMinutes}
                      </span>
                      분
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      <div>
        <label
          htmlFor="occurred-at"
          className="text-[13px] font-semibold text-[#374151]"
        >
          발생 시각
        </label>
        <input
          id="occurred-at"
          type="text"
          readOnly
          value={occurredAt ? formatOccurredAt(new Date(occurredAt)) : ""}
          className="mono mt-[9px] w-full rounded-xl border border-[#ebedf0] px-3 py-2.5 text-sm text-ink card-shadow"
        />
        <div className="mt-1 text-[11px] text-[#6b7280]">기본값: 현재 시각</div>
      </div>

      <div>
        <label
          htmlFor="building-type"
          className="text-[13px] font-semibold text-[#374151]"
        >
          건물 유형 <span className="font-normal text-[#6b7280]">(선택)</span>
        </label>
        <select
          id="building-type"
          value={buildingType}
          onChange={(event) =>
            setBuildingType(event.target.value as BuildingType | "")
          }
          className="mt-[9px] w-full cursor-pointer rounded-xl border border-[#ebedf0] px-3 py-2.5 text-sm text-ink card-shadow"
        >
          <option value="">선택 안 함</option>
          {BUILDING_TYPES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {isSubmitting ? <LoadingSpinner label="분석 요청 중" /> : null}
      {error ? <ErrorFallback message={error} onRetry={handleSubmit} /> : null}

      <button
        type="button"
        disabled={isDisabled}
        onClick={handleSubmit}
        className="mt-1.5 rounded-[14px] bg-ember px-4 py-3.5 text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#f2f4f6] disabled:text-[#b5bac2]"
      >
        분석 요청
      </button>
    </div>
  );
}
