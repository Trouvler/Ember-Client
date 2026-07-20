import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import AnalysisDetailView from "../AnalysisDetailView";
import {
  DispatchAnalysisProvider,
  useDispatchAnalysis,
} from "@/entities/dispatch-analysis/model/DispatchAnalysisProvider";

function MockScript({ onLoad }: { onLoad?: () => void }) {
  useEffect(() => onLoad?.(), [onLoad]);
  return null;
}
vi.mock("next/script", () => ({ default: MockScript }));
function FakeLatLng(this: KakaoLatLng, lat: number, lng: number) {
  this.getLat = () => lat;
  this.getLng = () => lng;
}
function FakeMap(this: KakaoMap) {
  this.setCenter = vi.fn();
  this.relayout = vi.fn();
}
function FakeMarker(this: KakaoMarker) {
  this.setMap = vi.fn();
  this.setPosition = vi.fn();
}

function SeededDetail() {
  const { setAnalysis } = useDispatchAnalysis();
  useEffect(() => {
    setAnalysis({
      location: { lat: 37.5, lng: 127 },
      equipmentError: false,
      result: {
        analysisId: 1,
        degraded: false,
        riskLevel: "HIGH",
        estimatedArrivalMinutes: 6.3,
        goldenTimeFailureProbability: 0.62,
        recommendedUnits: [
          {
            stationId: 1,
            rank: 1,
            stationName: "종로소방서",
            estimatedArrivalMinutes: 6.3,
            successProbability: 82,
            reason: "관할",
          },
        ],
        recommendedEquipment: [
          {
            equipmentType: "PUMP_TRUCK",
            requiredProbability: 95,
            reason: "초기 진화",
          },
        ],
        briefing: "출동을 권고합니다.",
      },
    });
  }, [setAnalysis]);
  return <AnalysisDetailView id="1" />;
}

describe("AnalysisDetailView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    window.kakao = {
      maps: {
        LatLng: FakeLatLng as unknown as KakaoMapsSdk["maps"]["LatLng"],
        Map: FakeMap as unknown as KakaoMapsSdk["maps"]["Map"],
        Marker: FakeMarker as unknown as KakaoMapsSdk["maps"]["Marker"],
        event: { addListener: vi.fn() },
        load: (callback: () => void) => callback(),
      },
    };
  });

  it("API 분석 결과를 표시한다", async () => {
    render(
      <DispatchAnalysisProvider>
        <SeededDetail />
      </DispatchAnalysisProvider>,
    );
    expect(await screen.findByText("#1")).toBeInTheDocument();
    expect(screen.getByText("HIGH")).toBeInTheDocument();
    expect(screen.getByText("종로소방서")).toBeInTheDocument();
    expect(screen.getByText("PUMP_TRUCK")).toBeInTheDocument();
  });
});
