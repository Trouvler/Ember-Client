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

  it("서버가 0~1로 주는 확률을 퍼센트로 변환한다", () => {
    render(<ProgressBarCell value={0.824} />);

    expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "82");
    expect(screen.getByText("82%")).toBeInTheDocument();
  });

  it("colorClassName을 채워진 세그먼트에 적용한다", () => {
    render(<ProgressBarCell value={50} colorClassName="bg-risk-low" />);

    const meter = screen.getByRole("meter");
    const filled = meter.querySelectorAll(".bg-risk-low");
    expect(filled.length).toBeGreaterThan(0);
  });

  it("값이 null이면 0%로 오인하지 않도록 대체 문자를 표시한다", () => {
    render(<ProgressBarCell value={null} />);

    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.getByRole("meter")).not.toHaveAttribute("aria-valuenow");
  });
});
