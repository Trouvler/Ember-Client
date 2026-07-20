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
            stationId: 1,
            rank: 1,
            stationName: "종로소방서",
            estimatedArrivalMinutes: 6.3,
            successProbability: 82,
            reason: "관할",
          },
          {
            stationId: 2,
            rank: 2,
            stationName: "강남소방서",
            estimatedArrivalMinutes: 8.1,
            successProbability: 71,
            reason: "인접",
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
