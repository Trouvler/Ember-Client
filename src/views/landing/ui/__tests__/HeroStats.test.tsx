import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroStats from "../HeroStats";

const DASHBOARD = {
  region: "서울",
  totalAnalyzedCases: 9120,
  avgGoldenTimeFailureRate: 0.217,
  avgAnalysisSeconds: 31,
  vulnerableDistrictTop5: [
    {
      districtName: "종로구 창신동",
      avgArrivalMinutes: 8.4,
      failureRate: 0.71,
    },
  ],
};

function stubFetch(response: unknown = DASHBOARD) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(response),
    }),
  );
}

describe("HeroStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("조회 전에는 수치 자리에 대체 문자를 표시한다", () => {
    stubFetch();

    render(<HeroStats />);

    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });

  it("실패율을 확보율로 변환해 표시한다", async () => {
    stubFetch();

    render(<HeroStats />);

    expect(await screen.findByText("78.3")).toBeInTheDocument();
    expect(screen.getByText("9,120")).toBeInTheDocument();
  });

  it("실데이터가 있으면 시연 배지를 표시하지 않는다", async () => {
    stubFetch();

    render(<HeroStats />);
    await screen.findByText("9,120");

    expect(
      screen.queryByText("시연 데이터 · 실제 집계가 아닙니다"),
    ).not.toBeInTheDocument();
  });

  it("집계가 비면 실제 0을 표시한다", async () => {
    stubFetch({
      region: "서울",
      totalAnalyzedCases: 0,
      avgGoldenTimeFailureRate: 0,
      avgAnalysisSeconds: null,
      vulnerableDistrictTop5: [],
    });

    render(<HeroStats />);

    expect(await screen.findByText("0")).toBeInTheDocument();
    expect(screen.getByText("100.0")).toBeInTheDocument();
  });

  it("조회에 실패하면 대체 문자를 표시한다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    render(<HeroStats />);

    expect((await screen.findAllByText("—")).length).toBeGreaterThan(0);
  });

  it("평균 분석 소요를 API 값으로 표시한다", async () => {
    stubFetch();

    render(<HeroStats />);
    await screen.findByText("9,120");

    expect(screen.getByText("31")).toBeInTheDocument();
  });

  it("평균 분석 소요가 집계되지 않으면 대체 문자를 표시한다", async () => {
    stubFetch({ ...DASHBOARD, avgAnalysisSeconds: null });

    render(<HeroStats />);
    await screen.findByText("9,120");

    expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  });
});
