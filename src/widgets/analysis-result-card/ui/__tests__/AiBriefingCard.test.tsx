import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AiBriefingCard from "../AiBriefingCard";

describe("AiBriefingCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("요약문과 판단 근거 목록을 표시한다", () => {
    render(
      <AiBriefingCard
        summary="해당 신고지는 노후 건물 밀집 지역입니다."
        reasons={["근거 A", "근거 B"]}
      />,
    );

    expect(
      screen.getByText("해당 신고지는 노후 건물 밀집 지역입니다."),
    ).toBeInTheDocument();
    expect(screen.getByText("근거 A")).toBeInTheDocument();
    expect(screen.getByText("근거 B")).toBeInTheDocument();
  });

  it("판단 근거가 없으면 섹션을 지우지 않고 안내 문구를 표시한다", () => {
    render(<AiBriefingCard summary="출동을 권고합니다." reasons={[]} />);

    expect(screen.getByText("주요 판단 근거")).toBeInTheDocument();
    expect(
      screen.getByText(/판단 근거를 산출하지 못했습니다/),
    ).toBeInTheDocument();
  });
});
