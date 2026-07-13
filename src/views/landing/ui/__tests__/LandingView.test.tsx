import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import LandingView from "../LandingView";

describe("LandingView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("신고 시뮬레이션 시작하기 버튼은 /analysis/new로 연결된다", () => {
    render(<LandingView />);

    expect(
      screen.getByRole("link", { name: /신고 시뮬레이션 시작하기/ }),
    ).toHaveAttribute("href", "/analysis/new");
  });

  it("분석 결과 예시 링크는 분석 상세 페이지로 연결된다", () => {
    render(<LandingView />);

    const links = screen.getAllByRole("link", { name: /분석 결과/ });
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/analysis/sample-1");
    }
  });
});
