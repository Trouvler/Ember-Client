"use client";

import { useState } from "react";
import { postDispatchOrder } from "@/entities/dispatch-analysis/api/postDispatchOrder";
import type { DispatchUnitCandidate } from "@/entities/dispatch-analysis/model/types";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import ErrorFallback from "@/shared/ui/ErrorFallback";
import { probabilityAsPercent } from "@/shared/utils/probability";

interface DispatchOrderFormProps {
  analysisId: number;
  units: DispatchUnitCandidate[];
}

export default function DispatchOrderForm({
  analysisId,
  units,
}: DispatchOrderFormProps) {
  const [stationId, setStationId] = useState<number | null>(
    units[0]?.stationId ?? null,
  );
  const [operatorName, setOperatorName] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderedStationName, setOrderedStationName] = useState<string | null>(
    null,
  );

  const selectedUnit = units.find((unit) => unit.stationId === stationId);
  const canSend = selectedUnit !== undefined && operatorName.trim() !== "";

  const send = async () => {
    if (!selectedUnit) return;
    setIsSending(true);
    setError(null);
    try {
      const response = await postDispatchOrder(analysisId, {
        stationId: selectedUnit.stationId,
        operatorName: operatorName.trim(),
        orderedAt: new Date().toISOString(),
      });
      setOrderedStationName(response.stationName);
    } catch {
      setError("출동 지령 전송에 실패했습니다.");
      setIsConfirming(false);
    } finally {
      setIsSending(false);
    }
  };

  if (orderedStationName !== null) {
    return (
      <div role="status" className="px-4 py-8 text-center">
        <p className="text-sm font-bold text-ink">출동 지령을 전송했습니다.</p>
        <p className="mt-2 text-xs text-[#6b7280]">
          {orderedStationName} · 지령자 {operatorName.trim()}
        </p>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-[13px] leading-[1.6] text-[#6b7280]">
        추천 출동대가 없어 지령을 전송할 수 없습니다.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-5">
      <fieldset>
        <legend className="text-[13px] font-semibold text-[#374151]">
          출동대 선택
        </legend>
        <div className="mt-[9px] flex flex-col gap-2">
          {units.map((unit) => (
            <label
              key={unit.stationId}
              className="flex items-center gap-2.5 rounded-xl border border-[#ebedf0] px-3 py-2.5 text-[13px] text-[#374151] card-shadow"
            >
              <input
                type="radio"
                name="dispatch-order-station"
                checked={stationId === unit.stationId}
                onChange={() => setStationId(unit.stationId)}
                disabled={isConfirming}
              />
              <span className="font-semibold text-ink">{unit.stationName}</span>
              <span className="ml-auto text-[12px] text-[#5c6672]">
                <span className="mono">{unit.estimatedArrivalMinutes}</span>분 ·
                성공률{" "}
                <span className="mono">
                  {unit.successProbability === null
                    ? "—"
                    : `${Math.round(probabilityAsPercent(unit.successProbability))}%`}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label
          htmlFor="operator-name"
          className="text-[13px] font-semibold text-[#374151]"
        >
          지령 담당자
        </label>
        <input
          id="operator-name"
          type="text"
          value={operatorName}
          onChange={(event) => setOperatorName(event.target.value)}
          readOnly={isConfirming}
          placeholder="담당자 이름"
          className="mt-[9px] w-full rounded-xl border border-[#ebedf0] px-3 py-2.5 text-sm text-ink card-shadow"
        />
      </div>

      {isSending ? <LoadingSpinner label="출동 지령 전송 중" /> : null}
      {error ? <ErrorFallback message={error} onRetry={send} /> : null}

      {/* 되돌릴 수 없는 작업이므로 확인 단계를 둔다. */}
      {isConfirming ? (
        <div className="rounded-xl border border-[#f0dada] bg-risk-high-bg px-4 py-3.5">
          <p className="text-[13px] leading-[1.6] text-risk-high-text">
            <span className="font-bold">{selectedUnit?.stationName}</span>에
            출동 지령을 전송합니다. 전송 후에는 취소할 수 없습니다.
          </p>
          <div className="mt-3.5 flex gap-2">
            <button
              type="button"
              disabled={isSending}
              onClick={() => void send()}
              className="rounded-lg bg-risk-high px-4 py-2.5 text-[13px] font-bold text-white hover:bg-risk-high-text disabled:cursor-not-allowed disabled:opacity-60"
            >
              전송 확인
            </button>
            <button
              type="button"
              disabled={isSending}
              onClick={() => setIsConfirming(false)}
              className="rounded-lg border border-[#ebedf0] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#5c6672]"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={!canSend}
          onClick={() => setIsConfirming(true)}
          className="rounded-[14px] bg-ember px-4 py-3.5 text-[15px] font-bold text-white disabled:cursor-not-allowed disabled:bg-[#f2f4f6] disabled:text-[#b5bac2]"
        >
          출동 지령 전송
        </button>
      )}
    </div>
  );
}
