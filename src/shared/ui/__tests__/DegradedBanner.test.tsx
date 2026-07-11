import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DegradedBanner from "../DegradedBanner";

describe("DegradedBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("visible이 false이면 아무것도 렌더링하지 않는다", () => {
    render(<DegradedBanner visible={false} />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("visible이 true이면 배너를 표시한다", () => {
    render(<DegradedBanner visible={true} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
