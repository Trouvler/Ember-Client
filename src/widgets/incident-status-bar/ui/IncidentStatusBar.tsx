"use client";

import { useEffect, useState } from "react";

interface IncidentStatusBarProps {
  incidentId: string;
  title: string;
  address: string;
  // API로만 복원한 분석에는 좌표가 없다.
  lat?: number;
  lng?: number;
  receivedAtLabel: string;
  initialElapsedSeconds: number;
}

function formatElapsed(seconds: number) {
  const pad = (value: number) => String(value).padStart(2, "0");
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function IncidentStatusBar({
  incidentId,
  title,
  address,
  lat,
  lng,
  receivedAtLabel,
  initialElapsedSeconds,
}: IncidentStatusBarProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(initialElapsedSeconds);

  useEffect(() => {
    const id = setInterval(
      () => setElapsedSeconds((seconds) => seconds + 1),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-b border-[#edeff2] bg-white">
      <div className="flex flex-col gap-4 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-6">
        <div>
          <div className="mb-1.5 flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-risk-high-bg px-2.5 py-1 text-xs font-bold text-risk-high-text">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-risk-high" />
              출동 대기
            </span>
            <span className="mono text-[12.5px] text-[#6b7280]">
              #{incidentId}
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-[-0.03em] text-ink">
            {title}
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[13px] text-[#5c6672]">
            <span className="inline-flex items-center gap-1.5 text-[#4e5560]">
              {address}
            </span>
            {lat !== undefined && lng !== undefined ? (
              <span className="mono text-[#6b7280]">
                {lat.toFixed(4)}, {lng.toFixed(4)}
              </span>
            ) : null}
            <span className="text-[#e6e9ee]">·</span>
            <span>
              접수{" "}
              <span className="mono text-[#4e5560]">{receivedAtLabel}</span>
            </span>
            <span className="text-[#e6e9ee]">·</span>
            <span>
              경과{" "}
              <span className="mono text-[#4e5560]">
                {formatElapsed(elapsedSeconds)}
              </span>
            </span>
          </div>
        </div>
        <div className="flex gap-2 sm:shrink-0 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-1 rounded-[9px] bg-[#f2f4f6] px-[17px] py-2.5 text-[13.5px] font-semibold text-[#4e5560] hover:bg-[#e6e9ee] sm:flex-none"
          >
            분석서 출력
          </button>
          <a
            href="#dispatch-order"
            className="flex-1 rounded-[9px] bg-ember px-[19px] py-2.5 text-center text-[13.5px] font-bold text-white hover:bg-[#d24f21] sm:flex-none"
          >
            출동 지령 전송
          </a>
        </div>
      </div>
    </div>
  );
}
