export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

const LEVEL_CLASSES: Record<RiskLevel, string> = {
  LOW: "bg-emerald-100 text-emerald-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  HIGH: "bg-red-100 text-red-800",
};

const LEVEL_LABELS: Record<RiskLevel, string> = {
  LOW: "낮음",
  MEDIUM: "보통",
  HIGH: "높음",
};

interface RiskBadgeProps {
  level: RiskLevel;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${LEVEL_CLASSES[level]}`}
    >
      위험도 {LEVEL_LABELS[level]}
    </span>
  );
}
