import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IncidentTypeSelector from "../IncidentTypeSelector";

describe("IncidentTypeSelector", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("사고 유형 버튼 3개를 표시한다", () => {
    render(<IncidentTypeSelector value={null} onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "화재" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "구조" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "구급" })).toBeInTheDocument();
  });

  it("선택된 유형 버튼의 aria-pressed가 true다", () => {
    render(<IncidentTypeSelector value="FIRE" onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "화재" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "구조" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("버튼 클릭 시 onChange에 선택된 유형을 전달한다", async () => {
    const onChange = vi.fn();
    render(<IncidentTypeSelector value={null} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "구급" }));

    expect(onChange).toHaveBeenCalledWith("EMERGENCY");
  });
});
