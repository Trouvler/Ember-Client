import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

const API_RESULT = {
  analysisId: 7,
  degraded: false,
  riskLevel: "MEDIUM",
  estimatedArrivalMinutes: 8.1,
  goldenTimeFailureProbability: 0.27,
  recommendedUnits: [
    {
      stationId: 2,
      rank: 1,
      stationName: "강남소방서",
      estimatedArrivalMinutes: 8.1,
      successProbability: 71,
      reason: "인접",
    },
  ],
  recommendedEquipment: [
    {
      equipmentType: "LADDER_TRUCK",
      requiredProbability: 60,
      reason: "고층",
    },
  ],
  briefing: "인접 출동대 편성을 검토하세요.",
};

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

  it("context에 결과가 있으면 그대로 표시한다", async () => {
    render(
      <DispatchAnalysisProvider>
        <SeededDetail />
      </DispatchAnalysisProvider>,
    );
    expect(await screen.findByText("#1")).toBeInTheDocument();
    expect(screen.getByText("HIGH")).toBeInTheDocument();
    expect(screen.getByText("종로소방서")).toBeInTheDocument();
    expect(screen.getAllByText("PUMP_TRUCK").length).toBeGreaterThan(0);
  });

  it("추천 장비를 출동 결과 등록 폼의 선택 항목으로 전달한다", async () => {
    render(
      <DispatchAnalysisProvider>
        <SeededDetail />
      </DispatchAnalysisProvider>,
    );
    await screen.findByText("#1");

    expect(
      screen.getByRole("checkbox", { name: "PUMP_TRUCK" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "출동 결과 등록" }),
    ).toBeInTheDocument();
  });

  it("context가 비어 있으면 상세 API로 결과를 복원한다", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(API_RESULT),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <DispatchAnalysisProvider>
        <AnalysisDetailView id="7" />
      </DispatchAnalysisProvider>,
    );

    expect(await screen.findByText("강남소방서")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/dispatch/7",
      expect.anything(),
    );
  });

  it("API로 복원한 결과에는 좌표가 없어 지도 대신 안내를 표시한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(API_RESULT),
      }),
    );

    render(
      <DispatchAnalysisProvider>
        <AnalysisDetailView id="7" />
      </DispatchAnalysisProvider>,
    );

    expect(
      await screen.findByText(
        "저장된 분석에는 신고 좌표가 없어 지도를 표시할 수 없습니다.",
      ),
    ).toBeInTheDocument();
  });

  it("상세 API가 실패하면 시연 데이터와 배지·다시 시도를 함께 표시한다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("500")));

    render(
      <DispatchAnalysisProvider>
        <AnalysisDetailView id="1" />
      </DispatchAnalysisProvider>,
    );

    expect(
      await screen.findByText("시연 데이터 · 분석 결과를 불러오지 못했습니다"),
    ).toBeInTheDocument();
    expect(screen.getByText("종로소방서")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "다시 시도" }),
    ).toBeInTheDocument();
  });

  it("상세 API가 성공하면 시연 배지를 표시하지 않는다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(API_RESULT),
      }),
    );

    render(
      <DispatchAnalysisProvider>
        <AnalysisDetailView id="7" />
      </DispatchAnalysisProvider>,
    );
    await screen.findByText("강남소방서");

    expect(
      screen.queryByText("시연 데이터 · 분석 결과를 불러오지 못했습니다"),
    ).not.toBeInTheDocument();
  });

  it("다시 시도가 성공하면 결과를 표시한다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("500")));

    render(
      <DispatchAnalysisProvider>
        <AnalysisDetailView id="7" />
      </DispatchAnalysisProvider>,
    );
    await screen.findByText("시연 데이터 · 분석 결과를 불러오지 못했습니다");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(API_RESULT),
      }),
    );
    await userEvent.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(await screen.findByText("강남소방서")).toBeInTheDocument();
  });
});
