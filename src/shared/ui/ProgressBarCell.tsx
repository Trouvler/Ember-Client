const SEGMENT_COUNT = 20;

interface ProgressBarCellProps {
  value: number;
  colorClassName?: string;
}

export default function ProgressBarCell({
  value,
  colorClassName = "bg-ember",
}: ProgressBarCellProps) {
  const filledSegments = Math.round((value / 100) * SEGMENT_COUNT);

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex flex-1 gap-px"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
          <span
            key={index}
            className={`h-[5px] flex-1 rounded-[1px] ${index < filledSegments ? colorClassName : "bg-[#edf0f4]"}`}
          />
        ))}
      </div>
      <span className="mono w-8 shrink-0 text-right text-[13px] font-semibold text-ink">
        {value}%
      </span>
    </div>
  );
}
