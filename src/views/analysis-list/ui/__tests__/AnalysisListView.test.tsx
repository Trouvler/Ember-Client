import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnalysisListView from "../AnalysisListView";

describe("AnalysisListView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("샘플 이력 목록을 접수번호·위험도와 함께 표시한다", () => {
    render(<AnalysisListView />);

    expect(screen.getByText("2026-0712-00847")).toBeInTheDocument();
    expect(screen.getAllByText("HIGH").length).toBeGreaterThan(0);
    expect(screen.getAllByText("분석 시작").length).toBe(4);
  });

  it("상세보기 링크는 분석 상세 페이지로 연결된다", () => {
    render(<AnalysisListView />);

    const links = screen.getAllByRole("link", { name: "분석 시작" });
    expect(links[0]).toHaveAttribute("href", "/analysis/new");
  });

  it("검색과 페이지 이동이 동작한다", async () => {
    render(<AnalysisListView />);
    await userEvent.type(
      screen.getByRole("textbox", { name: "접수번호 또는 위치 검색" }),
      "강남",
    );
    expect(screen.getByText("강남구 역삼동")).toBeInTheDocument();
    expect(screen.queryByText("종로구 창신동")).not.toBeInTheDocument();
  });
});
