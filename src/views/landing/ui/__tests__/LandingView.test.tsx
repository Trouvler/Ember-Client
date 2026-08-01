import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import LandingView from "../LandingView";

describe("LandingView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: "OK" }),
      }),
    );
  });

  it("신고 시뮬레이션 시작하기 버튼은 /analysis/new로 연결된다", () => {
    render(<LandingView />);

    expect(
      screen.getByRole("link", { name: /신고 시뮬레이션 시작하기/ }),
    ).toHaveAttribute("href", "/analysis/new");
  });

  it("분석 안내 링크는 신고 분석 화면으로 연결된다", () => {
    render(<LandingView />);

    const links = screen.getAllByRole("link", { name: /분석/ });
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/analysis/new");
    }
  });

  it("중복 분석 CTA를 표시하지 않는다", () => {
    render(<LandingView />);

    expect(screen.queryByText("직접 분석해 보기")).not.toBeInTheDocument();
  });

  it("골든타임 배분과 출동 단계 3개를 안내한다", () => {
    render(<LandingView />);

    expect(
      screen.getByRole("heading", {
        name: "38초 뒤, 판단은 다시 사람에게 넘어갑니다",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "AI 분석" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).not.toHaveLength(0);
  });
});
