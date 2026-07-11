import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import EquipmentTag from "../EquipmentTag";

describe("EquipmentTag", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("전달받은 label을 표시한다", () => {
    render(<EquipmentTag label="소화기" />);

    expect(screen.getByText("소화기")).toBeInTheDocument();
  });
});
