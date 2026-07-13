const SUMMARY_CARDS = [
  {
    label: "전체 분석 건수",
    value: "12,847",
    unit: "건",
    valueClassName: "text-ink",
    caption: "2024.03 이후 누적",
  },
  {
    label: "평균 골든타임 확보율",
    value: "78.3",
    unit: "%",
    valueClassName: "text-risk-low",
    caption: "7분 내 현장 도착 기준",
  },
  {
    label: "최근 업데이트",
    value: "2026-07-12",
    unit: null,
    valueClassName: "text-ink",
    caption: "매일 09:00 자동 갱신",
  },
];

const TOP_VULNERABLE_DISTRICTS = [
  { rank: 1, name: "종로구 창신동", rate: 71, badgeClassName: "bg-risk-high" },
  { rank: 2, name: "중구 을지로동", rate: 67, badgeClassName: "bg-[#d9534f]" },
  { rank: 3, name: "영등포구 문래동", rate: 59, badgeClassName: "bg-ember" },
  {
    rank: 4,
    name: "동대문구 제기동",
    rate: 54,
    badgeClassName: "bg-[#f0913c]",
  },
  { rank: 5, name: "성북구 정릉동", rate: 48, badgeClassName: "bg-[#f0b06a]" },
];

export default function DashboardPolicyView() {
  return (
    <div>
      {/* 타이틀 배너 */}
      <div className="border-b border-[#edeff2] bg-white">
        <div className="mx-auto max-w-[1120px] px-6 pt-10 pb-11">
          <div className="mb-3 text-[13px] font-bold text-ember">
            화재 안전 공공데이터
          </div>
          <h1 className="text-[32px] font-extrabold tracking-[-0.035em] text-ink">
            우리 동네 화재 안전 정보
          </h1>
          <p className="mt-3.5 max-w-[560px] text-[15px] leading-[1.7] text-[#5c6672]">
            AI가 분석한 지역별 화재 출동 위험도와 대응 통계를 누구나 확인할 수
            있습니다. 우리 동네의 안전 수준을 살펴보세요.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1120px] px-6 pt-7 pb-10">
        {/* 요약 카드 3개 */}
        <div className="mb-6 grid grid-cols-3 gap-3.5">
          {SUMMARY_CARDS.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-[#ebedf0] px-6 py-5.5 card-shadow"
            >
              <div className="text-[13px] text-[#8b909a]">{card.label}</div>
              <div className="mt-2.5 flex items-baseline gap-1">
                <span
                  className={`mono text-[32px] font-bold ${card.valueClassName}`}
                >
                  {card.value}
                </span>
                {card.unit ? (
                  <span className="text-sm text-[#5c6672]">{card.unit}</span>
                ) : null}
              </div>
              <div className="mt-2 text-xs text-[#adb3bd]">{card.caption}</div>
            </div>
          ))}
        </div>

        {/* 취약 행정동 TOP5 */}
        <section className="rounded-2xl border border-[#ebedf0] card-shadow">
          <div className="flex items-center justify-between border-b border-[#eef0f3] px-6 py-4">
            <div className="flex items-center gap-2.5">
              <span className="h-4 w-[3px] bg-ember" />
              <h2 className="text-base font-bold text-ink">
                화재 취약 행정동 TOP 5
              </h2>
            </div>
            <span className="text-xs text-[#adb3bd]">골든타임 실패율 기준</span>
          </div>
          <div className="px-6 py-1.5">
            {TOP_VULNERABLE_DISTRICTS.map((district) => (
              <div
                key={district.rank}
                className="flex items-center gap-4 border-b border-[#f2f4f6] py-3.5 last:border-b-0"
              >
                <span
                  className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-xl text-[13px] font-bold text-white ${district.badgeClassName}`}
                >
                  {district.rank}
                </span>
                <div className="flex-1">
                  <span className="text-[15px] font-bold text-ink">
                    {district.name}
                  </span>
                </div>
                <span className="mono text-lg font-bold text-risk-high">
                  {district.rate}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 안내문 */}
        <div className="mt-5 text-center text-xs leading-[1.6] text-[#9aa1ab]">
          이 데이터는 AI 예측 모델 기반이며 실제와 다를 수 있습니다.
          <br />
          <span className="text-[#c0c4cc]">
            제6회 소방안전 빅데이터 활용 및 아이디어 경진대회 출품작 · 잉걸불
          </span>
        </div>
      </div>
    </div>
  );
}
