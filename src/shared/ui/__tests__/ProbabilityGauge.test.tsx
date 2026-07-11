import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProbabilityGauge from "../ProbabilityGauge";

describe("ProbabilityGauge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("value를 퍼센트 텍스트로 표시한다", () => {
    render(<ProbabilityGauge value={70} />);

    expect(screen.getByText("70%")).toBeInTheDocument();
  });

  it("meter의 aria-valuenow가 value와 일치한다", () => {
    render(<ProbabilityGauge value={45} />);

    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "45");
  });
});
