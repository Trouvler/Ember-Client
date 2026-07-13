import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RiskAnalysisCard from "../RiskAnalysisCard";

describe("RiskAnalysisCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("위험도 HIGH이면 즉시 대응 권고 배지를 표시한다", () => {
    render(
      <RiskAnalysisCard
        riskLevel="HIGH"
        probability={62}
        fastestEtaMinutes={7.6}
      />,
    );

    expect(screen.getByText("HIGH")).toBeInTheDocument();
    expect(screen.getByText("즉시 대응 권고")).toBeInTheDocument();
  });

  it("목표 도착시간을 초과하면 목표 대비 값이 양수로 표시된다", () => {
    render(
      <RiskAnalysisCard
        riskLevel="HIGH"
        probability={62}
        fastestEtaMinutes={7.6}
        goldenTimeGoalMinutes={7}
      />,
    );

    expect(screen.getByText("+0.6")).toBeInTheDocument();
  });
});
