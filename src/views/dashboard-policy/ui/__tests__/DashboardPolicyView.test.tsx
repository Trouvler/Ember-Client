import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPolicyView from "../DashboardPolicyView";

const DASHBOARD = {
  region: "서울",
  totalAnalyzedCases: 12847,
  avgGoldenTimeFailureRate: 0.217,
  vulnerableDistrictTop5: [
    {
      districtName: "종로구 창신동",
      avgArrivalMinutes: 8.4,
      failureRate: 0.71,
    },
    {
      districtName: "중구 을지로동",
      avgArrivalMinutes: 7.9,
      failureRate: 0.67,
    },
  ],
};

function stubFetch(response: unknown = DASHBOARD) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(response),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("DashboardPolicyView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("조회 중에는 로딩 상태를 표시한다", () => {
    stubFetch();

    render(<DashboardPolicyView />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "화재 안전 통계 조회 중",
    );
  });

  it("region을 쿼리에 담아 조회한다", async () => {
    const fetchMock = stubFetch();

    render(<DashboardPolicyView />);
    await screen.findByText("12,847");

    expect(fetchMock.mock.calls[0][0]).toContain("region=");
  });

  it("요약 통계와 취약 행정동을 표시한다", async () => {
    stubFetch();

    render(<DashboardPolicyView />);

    expect(await screen.findByText("12,847")).toBeInTheDocument();
    expect(screen.getByText("21.7")).toBeInTheDocument();
    expect(screen.getByText("종로구 창신동")).toBeInTheDocument();
    expect(screen.getByText("71%")).toBeInTheDocument();
  });

  it("집계가 비면 시연 데이터와 배지를 표시한다", async () => {
    stubFetch({
      region: "서울",
      totalAnalyzedCases: 0,
      avgGoldenTimeFailureRate: 0,
      vulnerableDistrictTop5: [],
    });

    render(<DashboardPolicyView />);

    expect(await screen.findByText("12,847")).toBeInTheDocument();
    expect(screen.getByText("종로구 창신동")).toBeInTheDocument();
    expect(
      screen.getByText("시연 데이터 · 실제 집계가 아닙니다"),
    ).toBeInTheDocument();
  });

  it("실데이터가 있으면 배지를 표시하지 않는다", async () => {
    stubFetch();

    render(<DashboardPolicyView />);
    await screen.findByText("12,847");

    expect(
      screen.queryByText("시연 데이터 · 실제 집계가 아닙니다"),
    ).not.toBeInTheDocument();
  });

  it("조회에 실패하면 오류와 다시 시도를 표시한다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    render(<DashboardPolicyView />);

    expect(
      await screen.findByText("화재 안전 통계를 불러오지 못했습니다."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "다시 시도" }),
    ).toBeInTheDocument();
  });

  it("다시 시도를 누르면 재조회한다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    render(<DashboardPolicyView />);
    await screen.findByText("화재 안전 통계를 불러오지 못했습니다.");
    stubFetch();
    await userEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(await screen.findByText("12,847")).toBeInTheDocument();
  });
});
