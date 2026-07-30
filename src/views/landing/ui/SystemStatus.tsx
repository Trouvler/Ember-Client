"use client";

import { useEffect, useState } from "react";
import { getHealth } from "@/shared/api/getHealth";

type StatusKey = "loading" | "ok" | "degraded" | "unknown" | "error";

const STATUS_VIEW: Record<
  StatusKey,
  { label: string; dotClassName: string; textClassName: string }
> = {
  loading: {
    label: "분석 서버 상태 확인 중",
    dotClassName: "animate-pulse bg-[#b6bcc5]",
    textClassName: "text-[#6b7280]",
  },
  ok: {
    label: "분석 서버 정상",
    dotClassName: "bg-risk-low",
    textClassName: "text-[#4e5560]",
  },
  degraded: {
    label: "분석 서버 제한 운영",
    dotClassName: "bg-risk-medium",
    textClassName: "text-risk-medium",
  },
  unknown: {
    label: "분석 서버 상태 미확인",
    dotClassName: "bg-[#8a919c]",
    textClassName: "text-[#5c6672]",
  },
  error: {
    label: "분석 서버 응답 없음",
    dotClassName: "bg-risk-high",
    textClassName: "text-risk-high",
  },
};

const HEALTHY_STATUSES = ["OK", "UP"];

async function resolveStatus(): Promise<StatusKey> {
  try {
    const { status } = await getHealth();
    const normalized = status?.trim().toUpperCase() ?? "";
    if (!normalized) return "unknown";
    return HEALTHY_STATUSES.includes(normalized) ? "ok" : "degraded";
  } catch {
    return "error";
  }
}

export default function SystemStatus() {
  const [statusKey, setStatusKey] = useState<StatusKey>("loading");

  useEffect(() => {
    let isMounted = true;
    void resolveStatus().then((next) => {
      if (isMounted) setStatusKey(next);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const recheck = async () => {
    setStatusKey("loading");
    setStatusKey(await resolveStatus());
  };

  const { label, dotClassName, textClassName } = STATUS_VIEW[statusKey];

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[22px] items-center justify-between gap-3"
    >
      <span
        className={`flex items-center gap-2 text-[12.5px] font-medium ${textClassName}`}
      >
        <span
          aria-hidden="true"
          className={`inline-block h-[7px] w-[7px] shrink-0 rounded-full ${dotClassName}`}
        />
        {label}
      </span>
      {statusKey === "error" ? (
        <button
          type="button"
          onClick={() => void recheck()}
          className="text-[12px] font-semibold text-[#5c6672] underline decoration-[#b6bcc5] underline-offset-[3px] hover:text-ink"
        >
          다시 확인
        </button>
      ) : null}
    </div>
  );
}
