"use client";

import { useState } from "react";
import DispatchRequestForm from "@/widgets/dispatch-request-form/ui/DispatchRequestForm";
import MapView from "@/shared/ui/MapView";
import type {
  DispatchAnalysisResult,
  DispatchLocation,
} from "@/entities/dispatch-analysis/model/types";

export default function AnalysisNewView() {
  const [location, setLocation] = useState<DispatchLocation | null>(null);
  const [result, setResult] = useState<DispatchAnalysisResult | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">
        신고 시뮬레이션 입력
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        지도를 클릭해 신고 위치를 선택하세요.
      </p>

      <div className="mt-6">
        <MapView marker={location} onClickLocation={setLocation} />
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
