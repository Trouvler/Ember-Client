import Link from "next/link";

const USAGE_STEPS = [
  {
    step: 1,
    title: "신고 위치 · 유형 입력",
    description:
      "지도에서 신고 지점을 지정하고 화재·구조·구급 중 사고 유형과 발생 시각을 선택합니다.",
    badgeClassName: "bg-ink",
  },
  {
    step: 2,
    title: "AI 분석",
    description:
      "과거 출동 데이터와 지리정보를 학습한 모델이 골든타임 실패 확률·추천 출동대·필요 장비를 산출합니다.",
    badgeClassName: "bg-ink",
  },
  {
    step: 3,
    title: "브리핑 확인 · 출동 판단",
    description:
      "요약된 AI 브리핑과 판단 근거를 확인한 뒤, 최종 출동 결정은 상황실 담당자가 내립니다.",
    badgeClassName: "bg-ember",
  },
];

export default function LandingView() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      {/* 히어로 */}
      <div className="border-b border-[#edeff2]">
        <div className="px-4 py-12 sm:px-6 sm:py-20">
          <div className="max-w-[720px]">
            <span className="inline-flex items-center gap-[7px] rounded-xl bg-[#fff3ec] px-3 py-1.5 text-[12.5px] font-bold text-[#c24e0a]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" />
              상황실 의사결정 보조 (Copilot)
            </span>
            <h1 className="mt-6 text-[28px] leading-[1.3] font-extrabold tracking-[-0.03em] text-ink sm:text-[44px] sm:leading-[1.24] sm:tracking-[-0.035em]">
              신고 접수, 판단은 사람이.
              <br />
              <span className="text-ember">근거는 AI가.</span>
            </h1>
            <p className="mt-[22px] max-w-[560px] text-[15px] leading-[1.7] text-[#5c6672] sm:text-[16.5px] sm:leading-[1.75]">
              화재 신고 위치와 유형만 입력하면 골든타임 실패 확률, 추천 출동대,
              필요 장비를{" "}
              <span className="font-semibold text-ink">30초 안에</span>{" "}
              분석합니다. 최종 판단은 언제나 상황실 담당자의 몫입니다.
            </p>
            <div className="mt-[34px] flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-3.5">
              <Link
                href="/analysis/new"
                className="inline-flex items-center gap-2 rounded-lg bg-ember px-6 py-3.5 text-[15px] font-bold text-white"
              >
                신고 시뮬레이션 시작하기
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/analysis/new"
                className="px-1 py-3.5 text-[14.5px] font-semibold text-[#5c6672]"
              >
                직접 분석해 보기 ›
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 통계 배지 */}
      <div className="w-full px-4 pt-8 sm:px-6 sm:pt-10">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[#ebedf0] card-shadow sm:grid-cols-3">
          <div className="px-5 py-5 sm:px-[26px] sm:py-6">
            <div className="text-[13px] text-[#8b909a]">전체 분석 건수</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="mono text-[34px] font-semibold text-ink">
                12,847
              </span>
              <span className="text-[15px] text-[#8b909a]">건</span>
            </div>
            <div className="mt-2.5 text-xs text-[#adb3bd]">
              2024.03 시범 운영 이후 누적
            </div>
          </div>
          <div className="border-t border-[#eef0f3] px-5 py-5 sm:border-t-0 sm:border-l sm:px-[26px] sm:py-6">
            <div className="text-[13px] text-[#8b909a]">
              평균 골든타임 확보율
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="mono text-[34px] font-bold text-risk-low">
                78.3
              </span>
              <span className="text-base font-bold text-risk-low">%</span>
            </div>
            <div className="mt-2.5 text-xs text-[#adb3bd]">
              7분 내 현장 도착 기준
            </div>
          </div>
          <div className="border-t border-[#eef0f3] px-5 py-5 sm:border-t-0 sm:border-l sm:px-[26px] sm:py-6">
            <div className="text-[13px] text-[#8b909a]">평균 분석 소요</div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="mono text-[34px] font-bold text-ember">28</span>
              <span className="text-sm text-[#8b909a]">초</span>
            </div>
            <div className="mt-2.5 text-xs text-[#adb3bd]">
              신고 입력 → 결과 산출
            </div>
          </div>
        </div>
      </div>

      {/* 이용 방법 */}
      <div className="w-full px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="mb-6 flex flex-wrap items-baseline gap-2.5">
          <span className="h-5 w-1 bg-ember" />
          <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-ink">
            이용 방법
          </h2>
          <span className="text-[13px] text-[#9aa1ab]">
            신고 접수부터 출동 판단까지 3단계
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {USAGE_STEPS.map(({ step, title, description, badgeClassName }) => (
            <div
              key={step}
              className="rounded-2xl border border-[#ebedf0] p-5 card-shadow sm:p-6"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-2xl text-[17px] font-extrabold text-white ${badgeClassName}`}
                >
                  {step}
                </span>
                <div className="text-base font-bold tracking-[-0.02em] text-ink">
                  {title}
                </div>
              </div>
              <p className="mt-4 text-[13.5px] leading-[1.7] text-[#5c6672]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 결과 화면 미리보기 */}
      <div className="w-full px-4 pt-10 sm:px-6 sm:pt-12">
        <div className="mb-6 flex flex-wrap items-baseline gap-2.5">
          <span className="h-5 w-1 bg-ember" />
          <h2 className="text-[22px] font-extrabold tracking-[-0.03em] text-ink">
            이런 결과가 나옵니다
          </h2>
          <span className="text-[13px] text-[#9aa1ab]">
            AI 출동 분석 결과 화면
          </span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#ebedf0] shadow-[0_12px_40px_rgba(27,58,107,0.10)]">
          <div className="flex items-center gap-2 border-b border-[#dfe3e9] bg-[#eef0f2] px-3.5 py-2.5">
            <span className="inline-block h-[11px] w-[11px] rounded-full bg-[#e0655a]" />
            <span className="inline-block h-[11px] w-[11px] rounded-full bg-[#e8b74a]" />
            <span className="inline-block h-[11px] w-[11px] rounded-full bg-[#5cb85c]" />
            <div className="ml-3 flex h-[22px] max-w-[420px] flex-1 items-center rounded-md border border-[#dfe3e9] bg-white px-2.5 text-[11.5px] text-[#9aa1ab]">
              ember.nfa.go.kr / 분석 결과 상세
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 bg-white p-4 sm:grid-cols-[2fr_1fr] sm:p-[22px]">
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-[#ebedf0] px-[18px] py-4 card-shadow">
                <div className="mb-3.5 flex items-center gap-2">
                  <span className="h-3.5 w-[3px] bg-ember" />
                  <span className="text-[13px] font-bold text-ink">
                    위험도 분석
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 rounded-full bg-[conic-gradient(#c62828_0%_62%,#e6eaef_62%_100%)]">
                    <div className="absolute inset-[11px] flex items-center justify-center rounded-full bg-white">
                      <span className="mono text-[19px] font-bold text-risk-high">
                        62%
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-[#9aa1ab]">
                      종합 위험도
                    </div>
                    <div className="text-2xl leading-none font-extrabold tracking-[-0.02em] text-risk-high">
                      HIGH
                    </div>
                    <div className="mt-[7px] text-[11.5px] text-[#5c6672]">
                      서울 종로구 창신동 · 주거 화재
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-[#ebedf0] px-[18px] py-3.5 card-shadow">
                <div className="mb-2.5 flex items-center gap-2">
                  <span className="h-3.5 w-[3px] bg-ember" />
                  <span className="text-[13px] font-bold text-ink">
                    추천 출동대
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-[#eef0f3] py-[7px]">
                  <span className="text-[13px] font-bold text-ink">
                    <span className="text-ink">1.</span> 종로소방서
                  </span>
                  <span className="text-xs text-[#5c6672]">
                    <span className="mono">6.3분</span> ·{" "}
                    <span className="mono font-bold text-risk-low">82%</span>
                  </span>
                </div>
                <div className="flex items-center justify-between pt-[7px] pb-0.5">
                  <span className="text-[13px] font-bold text-ink">
                    <span className="text-[#9aa1ab]">2.</span> 강남소방서
                  </span>
                  <span className="text-xs text-[#5c6672]">
                    <span className="mono">8.1분</span> ·{" "}
                    <span className="mono font-bold text-[#5c6672]">71%</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="self-stretch rounded-xl border border-[#ebedf0] border-l-[3px] border-l-ember px-[18px] py-4 card-shadow">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-3.5 w-[3px] bg-ember" />
                <span className="text-[13px] font-bold text-ink">
                  AI 상황 브리핑
                </span>
              </div>
              <p className="text-[12.5px] leading-[1.75] text-[#5c6672]">
                해당 신고지는 노후 건물 밀집 지역으로 출동 지연 위험이 높습니다.
                도로 폭이 좁아 접근 지연이 예상됩니다.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 text-center">
          <Link
            href="/analysis/new"
            className="inline-flex items-center gap-[7px] text-sm font-bold text-ink"
          >
            신고 분석 시작하기
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* 푸터 */}
      <div className="mt-auto">
        <div className="mt-10 flex flex-col gap-2 border-t border-[#dfe3e9] px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-8">
          <span className="text-xs text-[#9aa1ab]">
            제6회 소방안전 빅데이터 활용 및 아이디어 경진대회 출품작
          </span>
          <span className="text-xs text-[#c0c4cc]">
            잉걸불 · AI 출동 의사결정 보조 시스템
          </span>
        </div>
      </div>
    </div>
  );
}
