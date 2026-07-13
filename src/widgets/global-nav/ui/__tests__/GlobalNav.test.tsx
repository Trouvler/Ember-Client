import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import GlobalNav from "../GlobalNav";

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));

vi.mock("next/navigation", () => ({
  usePathname,
}));

describe("GlobalNav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("/analysis/new 경로에서는 신고 분석 링크가 활성 스타일을 갖는다", () => {
    usePathname.mockReturnValue("/analysis/new");
    render(<GlobalNav />);

    expect(screen.getByRole("link", { name: "신고 분석" })).toHaveClass(
      "font-bold",
    );
    expect(screen.getByRole("link", { name: "출동 이력" })).toHaveClass(
      "font-medium",
    );
  });

  it("/analysis 경로에서는 출동 이력 링크가 활성 스타일을 갖는다", () => {
    usePathname.mockReturnValue("/analysis");
    render(<GlobalNav />);

    expect(screen.getByRole("link", { name: "출동 이력" })).toHaveClass(
      "font-bold",
    );
  });

  it("/analysis/new 에서는 시계를 표시하지 않는다", () => {
    usePathname.mockReturnValue("/analysis/new");
    render(<GlobalNav />);

    expect(screen.queryByText(/\d{4}-\d{2}-\d{2}/)).not.toBeInTheDocument();
  });

  it("/analysis/[id] 상세 페이지에서는 시계를 표시한다", () => {
    vi.useFakeTimers();
    usePathname.mockReturnValue("/analysis/sample-1");
    render(<GlobalNav />);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(
      screen.getByText(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });
});
