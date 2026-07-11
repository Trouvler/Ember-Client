const SEGMENT_COUNT = 10;

interface ProbabilityGaugeProps {
  value: number;
  label?: string;
}

export default function ProbabilityGauge({
  value,
  label,
}: ProbabilityGaugeProps) {
  const filledSegments = Math.round((value / 100) * SEGMENT_COUNT);

  return (
    <div className="flex flex-col gap-1">
      {label ? <span className="text-xs text-zinc-500">{label}</span> : null}
      <div
        className="flex gap-1"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
          <span
            key={index}
            className={`h-2 w-4 rounded-sm ${index < filledSegments ? "bg-orange-500" : "bg-zinc-200"}`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-zinc-700">{value}%</span>
    </div>
  );
}
