import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("label이 있으면 텍스트를 표시한다", () => {
    render(<LoadingSpinner label="불러오는 중" />);

    expect(screen.getByText("불러오는 중")).toBeInTheDocument();
  });

  it("status 역할을 갖는다", () => {
    render(<LoadingSpinner />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
