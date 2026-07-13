import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DispatchRequestForm from "../DispatchRequestForm";

describe("DispatchRequestForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("위치가 선택되지 않으면 제출 버튼이 비활성화된다", () => {
    render(<DispatchRequestForm location={null} onSubmitted={vi.fn()} />);

    expect(screen.getByRole("button", { name: "분석 요청" })).toBeDisabled();
  });

  it("위치는 있지만 사고 유형을 선택하지 않으면 제출 버튼이 비활성화된다", () => {
    render(
      <DispatchRequestForm
        location={{ lat: 37.5, lng: 127.0 }}
        onSubmitted={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "분석 요청" })).toBeDisabled();
  });

  it("위치와 사고 유형이 모두 있으면 제출 버튼이 활성화되고 성공 시 onSubmitted가 호출된다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "analysis-1", degraded: false }),
      }),
    );
    const onSubmitted = vi.fn();

    render(
      <DispatchRequestForm
        location={{ lat: 37.5, lng: 127.0 }}
        onSubmitted={onSubmitted}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "화재" }));

    const submitButton = screen.getByRole("button", { name: "분석 요청" });
    expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    expect(onSubmitted).toHaveBeenCalledWith({
      id: "analysis-1",
      degraded: false,
    });
  });
});
