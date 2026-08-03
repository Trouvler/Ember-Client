import { probabilityAsPercent } from "@/shared/utils/probability";

const SEGMENT_COUNT = 20;

interface ProgressBarCellProps {
  value: number | null;
  colorClassName?: string;
}

export default function ProgressBarCell({
  value,
  colorClassName = "bg-ember",
}: ProgressBarCellProps) {
  // 서버는 확률을 0~1로 준다(success_probability 컬럼이 NUMERIC(4,3)).
  const percent =
    value === null ? null : Math.round(probabilityAsPercent(value));
  const filledSegments = Math.round(((percent ?? 0) / 100) * SEGMENT_COUNT);

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex flex-1 gap-px"
        role="meter"
        aria-valuenow={percent ?? undefined}
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
        {percent === null ? "—" : `${percent}%`}
      </span>
    </div>
  );
}
