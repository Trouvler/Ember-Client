"use client";

import { useState } from "react";
import DispatchRequestForm from "@/widgets/dispatch-request-form/ui/DispatchRequestForm";
import type {
  DispatchAnalysisResult,
  DispatchLocation,
} from "@/entities/dispatch-analysis/model/types";

export default function AnalysisNewView() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [result, setResult] = useState<DispatchAnalysisResult | null>(null);

  const location: DispatchLocation | null =
    lat !== "" && lng !== "" ? { lat: Number(lat), lng: Number(lng) } : null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">
        신고 시뮬레이션 입력
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        지도 클릭으로 위치를 선택하는 기능은 준비 중입니다. 임시로 좌표를 직접
        입력하세요.
      </p>

      <div className="mt-6 flex gap-4">
        <label className="flex flex-col gap-1 text-sm">
          위도(lat)
          <input
            type="number"
            value={lat}
            onChange={(event) => setLat(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          경도(lng)
          <input
            type="number"
            value={lng}
            onChange={(event) => setLng(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2"
          />
        </label>
      </div>

      <div className="mt-6">
        <DispatchRequestForm location={location} onSubmitted={setResult} />
      </div>

      {result ? (
        <p className="mt-6 text-sm text-emerald-700">
          분석 요청이 접수되었습니다. (분석 ID: {result.id})
        </p>
      ) : null}
    </div>
  );
}
