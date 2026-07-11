"use client";

import { useState } from "react";
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

export default function DispatchRequestForm({
  location,
  onSubmitted,
}: DispatchRequestFormProps) {
  const [incidentType, setIncidentType] = useState<IncidentType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <IncidentTypeSelector value={incidentType} onChange={setIncidentType} />

      {isSubmitting ? <LoadingSpinner label="분석 요청 중" /> : null}
      {error ? <ErrorFallback message={error} onRetry={handleSubmit} /> : null}

      <button
        type="button"
        disabled={isDisabled}
        onClick={handleSubmit}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        신고 분석 요청
      </button>
    </div>
  );
}
