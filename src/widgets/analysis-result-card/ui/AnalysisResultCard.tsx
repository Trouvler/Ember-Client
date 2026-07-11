import DegradedBanner from "@/shared/ui/DegradedBanner";
import RiskBadge, { type RiskLevel } from "@/shared/ui/RiskBadge";
import ProbabilityGauge from "@/shared/ui/ProbabilityGauge";
import EquipmentTag from "@/shared/ui/EquipmentTag";

interface AnalysisResultCardProps {
  degraded: boolean;
  riskLevel: RiskLevel;
  probability: number;
  equipment: string[];
}

export default function AnalysisResultCard({
  degraded,
  riskLevel,
  probability,
  equipment,
}: AnalysisResultCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 p-6">
      <DegradedBanner visible={degraded} />

      <div className="flex items-center justify-between">
        <RiskBadge level={riskLevel} />
        <ProbabilityGauge value={probability} label="발생 확률" />
      </div>

      <div className="flex flex-wrap gap-2">
        {equipment.map((item) => (
          <EquipmentTag key={item} label={item} />
        ))}
      </div>
    </div>
  );
}
