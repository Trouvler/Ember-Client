"use client";

import { useState } from "react";
import { postDispatchFeedback } from "@/entities/dispatch-analysis/api/postDispatchFeedback";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import ErrorFallback from "@/shared/ui/ErrorFallback";

interface DispatchFeedbackFormProps {
  analysisId: number;
  equipmentOptions: string[];
}

// 스펙에 지연 사유 enum이 없어 상황실에서 쓰는 항목으로 정의한다.
const DELAY_REASONS = [
  "교통 정체",
  "좁은 도로",
  "불법 주차",
  "기상 악화",
  "기타",
];

function toggle(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export default function DispatchFeedbackForm({
  analysisId,
  equipmentOptions,
}: DispatchFeedbackFormProps) {
  const [actualArrivalMinutes, setActualArrivalMinutes] = useState("");
  const [usedEquipment, setUsedEquipment] = useState<string[]>([]);
  const [additionalDispatchRequired, setAdditionalDispatchRequired] =
    useState(false);
  const [delayReasons, setDelayReasons] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackId, setFeedbackId] = useState<number | null>(null);

  const arrivalMinutes = Number(actualArrivalMinutes);
  const isArrivalValid =
    actualArrivalMinutes.trim() !== "" &&
    Number.isFinite(arrivalMinutes) &&
    arrivalMinutes > 0;

  const submit = async () => {
    if (!isArrivalValid) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await postDispatchFeedback(analysisId, {
        actualArrivalMinutes: arrivalMinutes,
        usedEquipment,
        additionalDispatchRequired,
        delayReasons,
      });
      setFeedbackId(response.feedbackId);
    } catch {
      setError("출동 결과 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (feedbackId !== null) {
    return (
      <div role="status" className="px-4 py-8 text-center">
        <p className="text-sm font-bold text-ink">
          출동 결과가 등록되었습니다.
        </p>
        <p className="mt-2 text-xs text-[#6b7280]">
          접수번호 <span className="mono">#{feedbackId}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-5">
      <div>
        <label
          htmlFor="actual-arrival"
          className="text-[13px] font-semibold text-[#374151]"
        >
          실제 도착 시간 (분)
        </label>
        <input
          id="actual-arrival"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.1"
          value={actualArrivalMinutes}
          onChange={(event) => setActualArrivalMinutes(event.target.value)}
          className="mono mt-[9px] w-full rounded-xl border border-[#ebedf0] px-3 py-2.5 text-sm text-ink card-shadow"
        />
      </div>

      {equipmentOptions.length > 0 ? (
        <fieldset>
          <legend className="text-[13px] font-semibold text-[#374151]">
            사용한 장비
          </legend>
          <div className="mt-[9px] flex flex-wrap gap-2">
            {equipmentOptions.map((option) => (
              <label
                key={option}
                className="inline-flex items-center gap-2 rounded-xl border border-[#ebedf0] px-3 py-2 text-xs text-[#374151] card-shadow"
              >
                <input
                  type="checkbox"
                  checked={usedEquipment.includes(option)}
                  onChange={() =>
                    setUsedEquipment((current) => toggle(current, option))
                  }
                />
                {option}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <fieldset>
        <legend className="text-[13px] font-semibold text-[#374151]">
          도착 지연 사유
        </legend>
        <div className="mt-[9px] flex flex-wrap gap-2">
          {DELAY_REASONS.map((reason) => (
            <label
              key={reason}
              className="inline-flex items-center gap-2 rounded-xl border border-[#ebedf0] px-3 py-2 text-xs text-[#374151] card-shadow"
            >
              <input
                type="checkbox"
                checked={delayReasons.includes(reason)}
                onChange={() =>
                  setDelayReasons((current) => toggle(current, reason))
                }
              />
              {reason}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#374151]">
        <input
          type="checkbox"
          checked={additionalDispatchRequired}
          onChange={(event) =>
            setAdditionalDispatchRequired(event.target.checked)
          }
        />
        추가 출동이 필요했음
      </label>

      {isSubmitting ? <LoadingSpinner label="출동 결과 등록 중" /> : null}
      {error ? <ErrorFallback message={error} onRetry={submit} /> : null}

      <button
        type="button"
        disabled={!isArrivalValid || isSubmitting}
        onClick={() => void submit()}
        className="rounded-[14px] bg-ink px-4 py-3.5 text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#f2f4f6] disabled:text-[#b5bac2]"
      >
        출동 결과 등록
      </button>
    </div>
  );
}
