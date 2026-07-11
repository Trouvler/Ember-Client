import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AnalysisResultCard from "../AnalysisResultCard";

describe("AnalysisResultCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("degraded가 true이면 배너를 표시한다", () => {
    render(
      <AnalysisResultCard
        degraded={true}
        riskLevel="HIGH"
        probability={80}
        equipment={["소화기"]}
      />,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("degraded가 false이면 배너를 표시하지 않는다", () => {
    render(
      <AnalysisResultCard
        degraded={false}
        riskLevel="LOW"
        probability={10}
        equipment={["소화기"]}
      />,
    );

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("장비 목록을 태그로 표시한다", () => {
    render(
      <AnalysisResultCard
        degraded={false}
        riskLevel="MEDIUM"
        probability={50}
        equipment={["소화기", "방화복"]}
      />,
    );

    expect(screen.getByText("소화기")).toBeInTheDocument();
    expect(screen.getByText("방화복")).toBeInTheDocument();
  });
});
