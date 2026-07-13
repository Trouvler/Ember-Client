import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProgressBarCell from "../ProgressBarCell";

describe("ProgressBarCell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("value를 퍼센트 텍스트와 meter role로 표시한다", () => {
    render(<ProgressBarCell value={82} />);

    const meter = screen.getByRole("meter");
    expect(meter).toHaveAttribute("aria-valuenow", "82");
    expect(screen.getByText("82%")).toBeInTheDocument();
  });

  it("colorClassName을 채워진 세그먼트에 적용한다", () => {
    render(<ProgressBarCell value={50} colorClassName="bg-risk-low" />);

    const meter = screen.getByRole("meter");
    const filled = meter.querySelectorAll(".bg-risk-low");
    expect(filled.length).toBeGreaterThan(0);
  });
});
