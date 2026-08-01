import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnalysisListView from "../AnalysisListView";

const PAGE_RESPONSE = {
  content: [
    {
      analysisId: 3,
      incidentType: "FIRE",
      riskLevel: "LOW",
      occurredAt: "2026-07-22T10:54:05.618Z",
      goldenTimeFailureProbability: 0.27,
      estimatedArrivalMinutes: null,
    },
    {
      analysisId: 2,
      incidentType: "RESCUE",
      riskLevel: "HIGH",
      occurredAt: "2026-07-22T02:25:37.836Z",
      goldenTimeFailureProbability: 0.62,
      estimatedArrivalMinutes: 8.1,
    },
  ],
  page: 0,
  size: 10,
  totalElements: 2,
};

function stubFetch(response: unknown = PAGE_RESPONSE) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(response),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("AnalysisListView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("조회 중에는 로딩 상태를 표시한다", () => {
    stubFetch();

    render(<AnalysisListView />);

    expect(screen.getByRole("status")).toHaveTextContent("출동 이력 조회 중");
  });

  it("분석번호와 위험도를 담은 이력 목록을 표시한다", async () => {
    stubFetch();

    render(<AnalysisListView />);

    expect(await screen.findByText("3")).toBeInTheDocument();
    expect(screen.getByText("높음")).toBeInTheDocument();
    expect(screen.getByText("구조")).toBeInTheDocument();
  });

  it("실패확률을 퍼센트로 변환해 표시하고 예상 도착이 없으면 —로 표시한다", async () => {
    stubFetch();

    render(<AnalysisListView />);

    expect(await screen.findByText("27.0%")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("결과 보기 링크는 분석 상세 페이지로 연결된다", async () => {
    stubFetch();

    render(<AnalysisListView />);

    const links = await screen.findAllByRole("link", { name: "결과 보기" });
    expect(links[0]).toHaveAttribute("href", "/analysis/3");
  });

  it("페이지와 크기를 쿼리에 담아 조회한다", async () => {
    const fetchMock = stubFetch();

    render(<AnalysisListView />);
    await screen.findByText("3");

    expect(fetchMock.mock.calls[0][0]).toBe("/api/dispatch?page=0&size=10");
  });

  it("지역을 선택하면 region을 쿼리에 담아 다시 조회한다", async () => {
    const fetchMock = stubFetch();

    render(<AnalysisListView />);
    await screen.findByText("3");
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "지역" }),
      "강남구",
    );

    expect(await screen.findByText("3")).toBeInTheDocument();
    expect(fetchMock.mock.calls.at(-1)?.[0]).toContain(
      "region=%EA%B0%95%EB%82%A8%EA%B5%AC",
    );
  });

  it("이력이 없으면 빈 상태를 표시한다", async () => {
    stubFetch({ content: [], page: 0, size: 10, totalElements: 0 });

    render(<AnalysisListView />);

    expect(
      await screen.findByText("조회된 출동 분석 이력이 없습니다."),
    ).toBeInTheDocument();
  });

  it("조회에 실패하면 오류와 다시 시도를 표시한다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    render(<AnalysisListView />);

    expect(
      await screen.findByText("출동 분석 이력을 불러오지 못했습니다."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "다시 시도" }),
    ).toBeInTheDocument();
  });

  it("다시 시도를 누르면 재조회한다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    render(<AnalysisListView />);
    await screen.findByText("출동 분석 이력을 불러오지 못했습니다.");
    stubFetch();
    await userEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(await screen.findByText("3")).toBeInTheDocument();
  });
});
