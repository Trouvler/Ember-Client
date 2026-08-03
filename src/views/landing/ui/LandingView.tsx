import Link from "next/link";
import RiskDonut from "@/shared/ui/RiskDonut";
import SystemStatus from "./SystemStatus";
import HeroStats from "./HeroStats";

const DISPATCH_PHASES = [
  {
    timecode: "0:00 – 0:10",
    title: "신고 위치 · 유형 입력",
    description:
      "지도에서 신고 지점을 지정하고 화재 · 구조 · 구급 중 사고 유형과 발생 시각을 선택합니다.",
    ruleClassName: "bg-ink",
  },
  {
    timecode: "0:10 – 0:38",
    title: "AI 분석",
    description:
      "과거 출동 데이터와 지리정보를 학습한 모델이 골든타임 실패 확률 · 추천 출동대 · 필요 장비를 산출합니다.",
    ruleClassName: "bg-ember",
  },
  {
    timecode: "0:38 – 5:00",
    title: "브리핑 확인 · 출동 판단",
    description:
      "요약된 AI 브리핑과 판단 근거를 확인한 뒤, 최종 출동 결정은 상황실 담당자가 내립니다.",
    ruleClassName: "bg-[#c4c9d0]",
  },
];

// 골든타임 5분(300초) 기준. 1분 간격 눈금.
const MINUTE_TICK_CLASSES = [
  "left-[20%]",
  "left-[40%]",
  "left-[60%]",
  "left-[80%]",
];

const RECOMMENDED_UNITS = [
  { rank: 1, name: "종로소방서", minutes: "6.3", probability: "82" },
  { rank: 2, name: "강남소방서", minutes: "8.1", probability: "71" },
];

export default function LandingView() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-white">
      <main className="flex-1">
        {/* 히어로 */}
        <section
          aria-labelledby="landing-hero-title"
          className="border-b border-[#e6e9ee]"
        >
          <div className="mx-auto w-full max-w-[1180px] px-4 py-12 sm:px-6 sm:py-20 lg:py-24">
            <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
              <div className="max-w-[620px]">
                <p className="flex items-center gap-2 text-[11.5px] font-bold tracking-[0.14em] text-ember">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 rounded-full bg-ember"
                  />
                  상황실 의사결정 보조 시스템
                </p>
                <h1
                  id="landing-hero-title"
                  className="mt-6 text-[30px] leading-[1.22] font-extrabold tracking-[-0.035em] text-ink sm:mt-7 sm:text-[46px] sm:leading-[1.16] sm:tracking-[-0.042em] lg:text-[54px]"
                >
                  신고 접수, 판단은 사람이.
                  <br />
                  <span className="text-ember">근거는 AI가.</span>
                </h1>
                <p className="mt-6 max-w-[540px] text-[15.5px] leading-[1.75] text-[#5c6672] sm:mt-7 sm:text-[17px]">
                  화재 신고 위치와 유형만 입력하면 골든타임 실패 확률, 추천
                  출동대, 필요 장비를{" "}
                  <span className="font-semibold text-ink">30초 안에</span>{" "}
                  분석합니다. 최종 판단은 언제나 상황실 담당자의 몫입니다.
                </p>
                <div className="mt-9">
                  <Link
                    href="/analysis/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-ember px-6 py-3.5 text-[15px] font-bold text-white hover:bg-[#d24f21]"
                  >
                    신고 시뮬레이션 시작하기
                    <svg
                      aria-hidden="true"
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
                </div>
              </div>

              {/* 운영 현황 원장 */}
              <div className="w-full shrink-0 lg:w-[288px]">
                <SystemStatus />
                <HeroStats />
              </div>
            </div>
          </div>
        </section>

        {/* 골든타임 배분 */}
        <section
          aria-labelledby="golden-time-title"
          className="border-b border-[#e6e9ee] bg-[#f7f8f9]"
        >
          <div className="mx-auto w-full max-w-[1180px] px-4 py-12 sm:px-6 sm:py-18 lg:py-20">
            <p className="text-[11.5px] font-bold tracking-[0.14em] text-ember">
              골든타임 5분
            </p>
            <h2
              id="golden-time-title"
              className="mt-4 max-w-[620px] text-[24px] leading-[1.3] font-extrabold tracking-[-0.03em] text-ink sm:text-[30px] sm:tracking-[-0.035em]"
            >
              38초 뒤, 판단은 다시 사람에게 넘어갑니다
            </h2>

            <div
              role="img"
              aria-label="골든타임 5분 중 신고 입력에 10초, AI 분석에 28초를 사용하고 남은 4분 22초는 상황실 담당자의 판단 시간입니다."
              className="mt-10 sm:mt-12"
            >
              <div
                aria-hidden="true"
                className="mono flex items-baseline justify-between text-[11.5px] text-[#6b7280]"
              >
                <span>0:00 신고 접수</span>
                <span className="font-semibold text-ink">5:00 골든타임</span>
              </div>
              <div aria-hidden="true" className="relative mt-3">
                <div className="flex h-2.5 overflow-hidden rounded-[3px] bg-[#e0e4ea]">
                  <div className="timeline-fill flex w-[12.667%] origin-left">
                    <span className="w-[26.316%] bg-ink" />
                    <span className="w-[73.684%] bg-ember" />
                  </div>
                </div>
                {MINUTE_TICK_CLASSES.map((tickClassName) => (
                  <span
                    key={tickClassName}
                    className={`absolute top-0 h-2.5 w-px bg-white ${tickClassName}`}
                  />
                ))}
                <span className="absolute -top-1.5 left-[12.667%] h-[22px] w-px bg-ember" />
              </div>
            </div>
            <p className="mt-5 max-w-[620px] text-[14px] leading-[1.7] text-[#5c6672] sm:text-[15px]">
              <span className="mono font-semibold text-ink">0:38</span>까지 AI가
              판단 근거를 산출합니다. 남은{" "}
              <span className="mono font-semibold text-ink">4:22</span>는 상황실
              담당자가 브리핑을 읽고 출동을 지시하는 시간입니다.
            </p>

            <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
              {DISPATCH_PHASES.map(
                ({ timecode, title, description, ruleClassName }) => (
                  <li key={timecode}>
                    <span
                      aria-hidden="true"
                      className={`block h-[3px] w-9 ${ruleClassName}`}
                    />
                    <p className="mono mt-4 text-[12px] font-semibold text-[#6b7280]">
                      {timecode}
                    </p>
                    <h3 className="mt-2 text-[16.5px] font-bold tracking-[-0.02em] text-ink">
                      {title}
                    </h3>
                    <p className="mt-3 max-w-[340px] text-[14px] leading-[1.7] text-[#5c6672]">
                      {description}
                    </p>
                  </li>
                ),
              )}
            </ol>
          </div>
        </section>

        {/* 결과 화면 미리보기 */}
        <section aria-labelledby="preview-title">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-12 sm:px-6 sm:py-18 lg:py-20">
            <p className="text-[11.5px] font-bold tracking-[0.14em] text-ember">
              분석 결과
            </p>
            <h2
              id="preview-title"
              className="mt-4 text-[24px] leading-[1.3] font-extrabold tracking-[-0.03em] text-ink sm:text-[30px] sm:tracking-[-0.035em]"
            >
              이런 결과가 나옵니다
            </h2>
            <p className="mt-4 max-w-[540px] text-[14px] leading-[1.7] text-[#5c6672] sm:text-[15px]">
              서울 종로구 창신동 주거 화재 신고를 예시로 분석한 화면입니다.
            </p>

            <div className="mt-9 grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-xl border border-[#e6e9ee] px-5 py-5 card-shadow">
                  <div className="mb-4 flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="h-3.5 w-[3px] bg-ember"
                    />
                    <h3 className="text-[13px] font-bold text-ink">
                      위험도 분석
                    </h3>
                  </div>
                  <div className="flex items-center gap-5">
                    <RiskDonut value={62} level="HIGH" />
                    <div>
                      <p className="text-[11.5px] text-[#6b7280]">
                        종합 위험도
                      </p>
                      <p className="mt-1.5 text-[26px] leading-none font-extrabold tracking-[-0.02em] text-risk-high">
                        높음
                      </p>
                      <p className="mt-2.5 text-[12px] text-[#5c6672]">
                        골든타임 실패 확률 62% · 주거 화재
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e6e9ee] px-5 py-5 card-shadow">
                  <div className="mb-3 flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="h-3.5 w-[3px] bg-ember"
                    />
                    <h3 className="text-[13px] font-bold text-ink">
                      추천 출동대
                    </h3>
                  </div>
                  <ol>
                    {RECOMMENDED_UNITS.map(
                      ({ rank, name, minutes, probability }) => (
                        <li
                          key={rank}
                          className="flex items-center justify-between gap-3 border-b border-[#eef0f3] py-2.5 last:border-b-0 last:pb-0"
                        >
                          <span className="text-[13.5px] font-bold text-ink">
                            <span
                              className={
                                rank === 1
                                  ? "mono text-ink"
                                  : "mono text-[#6b7280]"
                              }
                            >
                              {rank}
                            </span>{" "}
                            {name}
                          </span>
                          <span className="text-[12.5px] text-[#5c6672]">
                            <span className="mono">{minutes}분</span> · 성공률{" "}
                            <span
                              className={
                                rank === 1
                                  ? "mono font-bold text-risk-low"
                                  : "mono font-bold text-[#5c6672]"
                              }
                            >
                              {probability}%
                            </span>
                          </span>
                        </li>
                      ),
                    )}
                  </ol>
                </div>
              </div>

              <div className="rounded-xl border border-[#e6e9ee] border-l-[3px] border-l-ember px-5 py-5 card-shadow">
                <div className="mb-3 flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-3.5 w-[3px] bg-ember" />
                  <h3 className="text-[13px] font-bold text-ink">
                    AI 상황 브리핑
                  </h3>
                </div>
                <p className="text-[13px] leading-[1.8] text-[#5c6672]">
                  해당 신고지는 노후 건물 밀집 지역으로 출동 지연 위험이
                  높습니다. 도로 폭이 좁아 접근 지연이 예상되며, 인접 출동대의
                  동시 편성을 검토하시기 바랍니다.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <Link
                href="/analysis/new"
                className="inline-flex items-center gap-2 text-[14.5px] font-bold text-ink underline decoration-[#c4c9d0] underline-offset-[5px] hover:decoration-ember"
              >
                신고 분석 시작하기
                <svg
                  aria-hidden="true"
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
        </section>
      </main>

      <footer className="border-t border-[#e6e9ee]">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-2 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-[12px] text-[#6b7280]">
            제6회 소방안전 빅데이터 활용 및 아이디어 경진대회 출품작
          </p>
          <p className="text-[12px] text-[#6b7280]">
            잉걸불 · AI 출동 의사결정 보조 시스템
          </p>
        </div>
      </footer>
    </div>
  );
}
