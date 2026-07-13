import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AnalysisListView from "../AnalysisListView";

describe("AnalysisListView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("샘플 이력 목록을 접수번호·위험도와 함께 표시한다", () => {
    render(<AnalysisListView />);

    expect(screen.getByText("2026-0712-00847")).toBeInTheDocument();
    expect(screen.getAllByText("HIGH").length).toBeGreaterThan(0);
    expect(screen.getAllByText("상세보기").length).toBe(8);
  });

  it("상세보기 링크는 분석 상세 페이지로 연결된다", () => {
    render(<AnalysisListView />);

    const links = screen.getAllByRole("link", { name: "상세보기" });
    expect(links[0]).toHaveAttribute("href", "/analysis/sample-1");
  });
});
