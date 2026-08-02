import type { RiskLevel } from "@/entities/dispatch-analysis/model/types";

interface RiskDonutProps {
  value: number | null;
  level: RiskLevel;
}

const LEVEL_STROKE: Record<RiskLevel, string> = {
  HIGH: "#c62828",
  MEDIUM: "#c2790a",
  LOW: "#1a7a4a",
  UNKNOWN: "#8a919c",
};

const LEVEL_TEXT_CLASS: Record<RiskLevel, string> = {
  HIGH: "text-risk-high",
  MEDIUM: "text-risk-medium",
  LOW: "text-risk-low",
  UNKNOWN: "text-[#5c6672]",
};

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RiskDonut({ value, level }: RiskDonutProps) {
  const offset = CIRCUMFERENCE * (1 - (value ?? 0) / 100);

  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke="#e6eaef"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={LEVEL_STROKE[level]}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>
      <div
        className="absolute inset-[13px] flex items-center justify-center rounded-full bg-white"
        role="meter"
        aria-valuenow={value ?? undefined}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span
          className={`mono text-[26px] leading-none font-bold ${LEVEL_TEXT_CLASS[level]}`}
        >
          {/* 0.14 * 100 = 14.000000000000002 같은 부동소수점 오차가 그대로 새어 나온다. */}
          {value === null ? "—" : `${Math.round(value)}%`}
        </span>
      </div>
    </div>
  );
}
