import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DemoDataBadge from "../DemoDataBadge";

describe("DemoDataBadge", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("visible이 false면 렌더하지 않는다", () => {
    render(<DemoDataBadge visible={false} />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("visible이 true면 기본 문구를 status 역할로 표시한다", () => {
    render(<DemoDataBadge visible />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "시연 데이터 · 실제 집계가 아닙니다",
    );
  });

  it("message를 넘기면 해당 문구를 표시한다", () => {
    render(<DemoDataBadge visible message="시연 데이터 · 조회 실패" />);

    expect(screen.getByText("시연 데이터 · 조회 실패")).toBeInTheDocument();
  });
});
