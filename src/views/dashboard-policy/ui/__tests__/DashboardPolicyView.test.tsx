import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPolicyView from "../DashboardPolicyView";

describe("DashboardPolicyView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("요약 통계와 취약 행정동 TOP5를 표시한다", () => {
    render(<DashboardPolicyView />);

    expect(screen.getByText("12,847")).toBeInTheDocument();
    expect(screen.getByText("78.3")).toBeInTheDocument();
    expect(screen.getByText("종로구 창신동")).toBeInTheDocument();
    expect(screen.getByText("71%")).toBeInTheDocument();
    expect(screen.getByText("성북구 정릉동")).toBeInTheDocument();
  });
});
