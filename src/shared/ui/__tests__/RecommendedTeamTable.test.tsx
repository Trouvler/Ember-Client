import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RecommendedTeamTable from "../RecommendedTeamTable";

describe("RecommendedTeamTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("전달받은 출동대 목록을 순위·관할·도착시간·성공률과 함께 표시한다", () => {
    render(
      <RecommendedTeamTable
        teams={[
          {
            id: "1",
            rank: 1,
            name: "종로소방서",
            jurisdiction: "관할",
            etaMinutes: 6.3,
            successRate: 82,
          },
          {
            id: "2",
            rank: 2,
            name: "강남소방서",
            jurisdiction: "인접",
            etaMinutes: 8.1,
            successRate: 71,
          },
        ]}
      />,
    );

    expect(screen.getByText("종로소방서")).toBeInTheDocument();
    expect(screen.getByText("관할")).toBeInTheDocument();
    expect(screen.getByText("6.3")).toBeInTheDocument();
    expect(screen.getByText("82%")).toBeInTheDocument();
    expect(screen.getByText("강남소방서")).toBeInTheDocument();
    expect(screen.getByText("인접")).toBeInTheDocument();
  });
});
