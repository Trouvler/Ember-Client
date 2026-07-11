import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorFallback from "../ErrorFallback";

describe("ErrorFallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("message를 표시한다", () => {
    render(<ErrorFallback message="문제가 발생했습니다" />);

    expect(screen.getByText("문제가 발생했습니다")).toBeInTheDocument();
  });

  it("onRetry가 없으면 다시 시도 버튼을 표시하지 않는다", () => {
    render(<ErrorFallback message="문제가 발생했습니다" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("다시 시도 버튼 클릭 시 onRetry가 호출된다", async () => {
    const onRetry = vi.fn();
    render(<ErrorFallback message="문제가 발생했습니다" onRetry={onRetry} />);

    await userEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
