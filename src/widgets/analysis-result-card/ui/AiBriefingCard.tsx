interface AiBriefingCardProps {
  summary: string;
  reasons: string[];
}

export default function AiBriefingCard({
  summary,
  reasons,
}: AiBriefingCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#ebedf0] border-l-[3px] border-l-ember card-shadow">
      <div className="flex items-center gap-2 border-b border-[#eef0f3] px-4 py-2.5">
        <span className="h-3.5 w-[3px] bg-ember" />
        <h2 className="text-sm font-bold text-ink">AI 상황 브리핑</h2>
      </div>
      <div className="p-4">
        <p className="text-[13.5px] leading-[1.8] text-[#374151]">{summary}</p>
        <div className="mt-4 border-t border-[#eef0f3] pt-3.5">
          <div className="mb-2.5 text-[11.5px] font-semibold text-[#9aa1ab]">
            주요 판단 근거
          </div>
          <ul className="flex flex-col gap-2.5">
            {reasons.map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-2 text-[12.5px] leading-[1.55] text-[#374151]"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0 text-ember"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {reason}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 rounded-md border border-[#eef0f3] bg-[#f8f9fb] px-3 py-2.5 text-[11px] leading-[1.6] text-[#8a919c]">
          ※ 본 브리핑은 과거 출동 데이터와 지리정보를 학습한 예측 결과이며, 실제
          현장 상황과 다를 수 있습니다.
        </div>
      </div>
    </section>
  );
}
