import type { RiskLevel } from "@/entities/dispatch-analysis/model/types";
import RiskDonut from "@/shared/ui/RiskDonut";

interface RiskAnalysisCardProps {
  riskLevel: RiskLevel;
  probability: number | null;
  fastestEtaMinutes: number | null;
  goldenTimeGoalMinutes?: number;
}

const LEVEL_BADGE: Record<RiskLevel, { text: string; className: string }> = {
  HIGH: {
    text: "즉시 대응 권고",
    className: "bg-risk-high-bg text-risk-high-text",
  },
  MEDIUM: {
    text: "주의 관찰 필요",
    className: "bg-[#fdf3e7] text-risk-medium",
  },
  LOW: {
    text: "정상 범위",
    className: "bg-[#e8f5ee] text-risk-low",
  },
  UNKNOWN: {
    text: "분석 불가",
    className: "bg-[#eef1f5] text-[#5c6672]",
  },
};

export default function RiskAnalysisCard({
  riskLevel,
  probability,
  fastestEtaMinutes,
  goldenTimeGoalMinutes = 7,
}: RiskAnalysisCardProps) {
  const badge = LEVEL_BADGE[riskLevel];
  const diff =
    fastestEtaMinutes === null
      ? null
      : fastestEtaMinutes - goldenTimeGoalMinutes;

  return (
    <section className="rounded-xl border border-[#ebedf0] card-shadow">
      <div className="flex items-center gap-2 border-b border-[#e6e9ee] px-3.5 py-2.5">
        <span aria-hidden="true" className="h-3.5 w-[3px] bg-ember" />
        <h2 className="text-sm font-bold text-ink">위험도 분석</h2>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-4">
          <RiskDonut value={probability} level={riskLevel} />
          <div>
            <div className="mb-1.5 text-xs text-[#6b7280]">종합 위험도</div>
            <div
              className={`text-2xl leading-none font-bold ${
                riskLevel === "HIGH"
                  ? "text-risk-high"
                  : riskLevel === "MEDIUM"
                    ? "text-risk-medium"
                    : riskLevel === "LOW"
                      ? "text-risk-low"
                      : "text-[#5c6672]"
              }`}
            >
              {riskLevel}
            </div>
            <div
              className={`mt-2 inline-block rounded px-2 py-0.5 text-[11px] font-bold ${badge.className}`}
            >
              {badge.text}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 border-t border-[#eef0f3]">
        <div className="border-r border-[#eef0f3] px-4 py-3">
          <div className="mb-1 text-[11.5px] text-[#6b7280]">
            예상 최단 도착
          </div>
          <div>
            <span className="mono text-xl font-bold text-ink">
              {fastestEtaMinutes ?? "—"}
            </span>
            {fastestEtaMinutes === null ? null : (
              <span className="text-xs text-[#5c6672]"> 분</span>
            )}
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="mb-1 text-[11.5px] text-[#6b7280]">목표 대비</div>
          <div>
            {diff === null ? (
              <span className="mono text-xl font-bold text-[#5c6672]">—</span>
            ) : (
              <>
                <span
                  className={`mono text-xl font-bold ${diff > 0 ? "text-risk-high" : "text-risk-low"}`}
                >
                  {diff > 0 ? "+" : ""}
                  {diff.toFixed(1)}
                </span>
                <span className="text-xs text-[#5c6672]"> 분</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
