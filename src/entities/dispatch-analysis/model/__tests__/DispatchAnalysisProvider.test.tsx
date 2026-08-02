import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DispatchAnalysisProvider,
  useDispatchAnalysis,
} from "../DispatchAnalysisProvider";
import type { DispatchAnalysisResult } from "../types";

const RESULT: DispatchAnalysisResult = {
  analysisId: 5,
  degraded: false,
  latitude: 37.5,
  longitude: 127,
  riskLevel: "HIGH",
  estimatedArrivalMinutes: 6.3,
  goldenTimeFailureProbability: 0.62,
  recommendedUnits: [],
  recommendedEquipment: [
    { equipmentType: "PUMP_TRUCK", requiredProbability: 90, reason: "진화" },
  ],
  reasons: ["노후 건물 밀집"],
  briefing: "출동을 권고합니다.",
};

function Consumer() {
  const { analysis, setAnalysis, updateEquipment } = useDispatchAnalysis();

  return (
    <div>
      <p data-testid="equipment">
        {analysis
          ? analysis.result.recommendedEquipment
              .map((item) => item.equipmentType)
              .join(",")
          : "없음"}
      </p>
      <p data-testid="equipment-error">
        {analysis ? String(analysis.equipmentError) : "없음"}
      </p>
      <button
        type="button"
        onClick={() =>
          setAnalysis({
            result: RESULT,
            location: { lat: 37.5, lng: 127 },
            equipmentError: true,
          })
        }
      >
        분석 저장
      </button>
      <button
        type="button"
        onClick={() =>
          updateEquipment([
            {
              equipmentType: "LADDER_TRUCK",
              requiredProbability: 60,
              reason: "고층",
            },
          ])
        }
      >
        장비 갱신
      </button>
    </div>
  );
}

describe("DispatchAnalysisProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("분석 결과를 저장하고 읽을 수 있다", async () => {
    render(
      <DispatchAnalysisProvider>
        <Consumer />
      </DispatchAnalysisProvider>,
    );

    expect(screen.getByTestId("equipment")).toHaveTextContent("없음");
    await userEvent.click(screen.getByRole("button", { name: "분석 저장" }));

    expect(screen.getByTestId("equipment")).toHaveTextContent("PUMP_TRUCK");
  });

  it("장비를 갱신하면 장비 오류 상태가 해제된다", async () => {
    render(
      <DispatchAnalysisProvider>
        <Consumer />
      </DispatchAnalysisProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "분석 저장" }));
    expect(screen.getByTestId("equipment-error")).toHaveTextContent("true");

    await userEvent.click(screen.getByRole("button", { name: "장비 갱신" }));

    expect(screen.getByTestId("equipment")).toHaveTextContent("LADDER_TRUCK");
    expect(screen.getByTestId("equipment-error")).toHaveTextContent("false");
  });

  it("저장된 분석이 없으면 장비 갱신은 아무것도 바꾸지 않는다", async () => {
    render(
      <DispatchAnalysisProvider>
        <Consumer />
      </DispatchAnalysisProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "장비 갱신" }));

    expect(screen.getByTestId("equipment")).toHaveTextContent("없음");
  });

  it("Provider 없이 사용하면 오류를 던진다", () => {
    expect(() => render(<Consumer />)).toThrow(
      "DispatchAnalysisProvider is required",
    );
  });
});
