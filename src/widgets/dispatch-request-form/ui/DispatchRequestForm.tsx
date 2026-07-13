"use client";

import { useEffect, useState } from "react";
import { postDispatchAnalysis } from "@/entities/dispatch-analysis/api/postDispatchAnalysis";
import IncidentTypeSelector from "@/entities/dispatch-analysis/ui/IncidentTypeSelector";
import type {
  DispatchAnalysisResult,
  DispatchLocation,
  IncidentType,
} from "@/entities/dispatch-analysis/model/types";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import ErrorFallback from "@/shared/ui/ErrorFallback";

interface DispatchRequestFormProps {
  location: DispatchLocation | null;
  onSubmitted: (result: DispatchAnalysisResult) => void;
}

const BUILDING_TYPES = [
  "주거시설 (단독·다세대)",
  "공동주택 (아파트)",
  "근린생활시설",
  "공장·창고",
  "기타",
];

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

  useEffect(() => {
    const id = setTimeout(() => setOccurredAt(formatOccurredAt(new Date())), 0);
    return () => clearTimeout(id);
  }, []);

  const isDisabled = !location || !incidentType || isSubmitting;

  const handleSubmit = async () => {
    if (!location || !incidentType) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await postDispatchAnalysis({ location, incidentType });
      onSubmitted(result);
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
          value={occurredAt}
          className="mono mt-[9px] w-full rounded-xl border border-[#ebedf0] px-3 py-2.5 text-sm text-ink card-shadow"
        />
        <div className="mt-1 text-[11px] text-[#adb3bd]">기본값: 현재 시각</div>
      </div>

      <div>
        <label
          htmlFor="building-type"
          className="text-[13px] font-semibold text-[#374151]"
        >
          건물 유형 <span className="font-normal text-[#adb3bd]">(선택)</span>
        </label>
        <select
          id="building-type"
          defaultValue={BUILDING_TYPES[0]}
          className="mt-[9px] w-full cursor-pointer rounded-xl border border-[#ebedf0] px-3 py-2.5 text-sm text-ink card-shadow"
        >
          {BUILDING_TYPES.map((option) => (
            <option key={option}>{option}</option>
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
