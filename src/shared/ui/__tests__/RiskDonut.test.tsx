import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RiskDonut from "../RiskDonut";

describe("RiskDonut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("meter role로 value를 노출한다", () => {
    render(<RiskDonut value={62} level="HIGH" />);

    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "62");
    expect(screen.getByText("62%")).toBeInTheDocument();
  });

  it("등급별로 다른 색상 클래스를 적용한다", () => {
    const { rerender } = render(<RiskDonut value={20} level="LOW" />);
    expect(screen.getByText("20%")).toHaveClass("text-risk-low");

    rerender(<RiskDonut value={50} level="MEDIUM" />);
    expect(screen.getByText("50%")).toHaveClass("text-risk-medium");

    rerender(<RiskDonut value={80} level="HIGH" />);
    expect(screen.getByText("80%")).toHaveClass("text-risk-high");
  });

  it("값이 null이면 대체 문자를 표시한다", () => {
    render(<RiskDonut value={null} level="UNKNOWN" />);

    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByRole("meter")).not.toHaveAttribute("aria-valuenow");
  });
});
