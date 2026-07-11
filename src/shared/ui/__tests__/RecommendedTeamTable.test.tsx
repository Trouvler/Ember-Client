import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RecommendedTeamTable from "../RecommendedTeamTable";

describe("RecommendedTeamTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("전달받은 출동대 목록을 행으로 표시한다", () => {
    render(
      <RecommendedTeamTable
        teams={[
          { id: "1", name: "1소방서", eta: 5 },
          { id: "2", name: "2소방서" },
        ]}
      />,
    );

    expect(screen.getByText("1소방서")).toBeInTheDocument();
    expect(screen.getByText("5분")).toBeInTheDocument();
    expect(screen.getByText("2소방서")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
