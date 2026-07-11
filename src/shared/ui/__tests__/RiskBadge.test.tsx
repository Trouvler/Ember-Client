import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RiskBadge from "../RiskBadge";

describe("RiskBadge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("위험도 HIGH이면 높음 텍스트를 표시한다", () => {
    render(<RiskBadge level="HIGH" />);

    expect(screen.getByText("위험도 높음")).toBeInTheDocument();
  });

  it("위험도 LOW이면 낮음 텍스트를 표시한다", () => {
    render(<RiskBadge level="LOW" />);

    expect(screen.getByText("위험도 낮음")).toBeInTheDocument();
  });
});
