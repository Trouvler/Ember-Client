import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RecommendedEquipmentTable from "../RecommendedEquipmentTable";

describe("RecommendedEquipmentTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("장비명·필요도·용도를 행으로 표시한다", () => {
    render(
      <RecommendedEquipmentTable
        equipment={[
          { id: "1", name: "펌프차", needRate: 95, purpose: "초기 진화" },
          { id: "2", name: "고가사다리차", needRate: 78, purpose: "인명 구조" },
        ]}
      />,
    );

    expect(screen.getByText("펌프차")).toBeInTheDocument();
    expect(screen.getByText("95%")).toBeInTheDocument();
    expect(screen.getByText("초기 진화")).toBeInTheDocument();
    expect(screen.getByText("고가사다리차")).toBeInTheDocument();
  });
});
