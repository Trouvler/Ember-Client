import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnalysisNewView from "../AnalysisNewView";
import { DispatchAnalysisProvider } from "@/entities/dispatch-analysis/model/DispatchAnalysisProvider";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
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

describe("AnalysisNewView", () => {
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

  it("분석 생성 후 상세 페이지로 이동한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              analysisId: 1,
              degraded: false,
              riskLevel: "LOW",
              estimatedArrivalMinutes: 4,
              goldenTimeFailureProbability: 0.2,
              recommendedUnits: [],
              recommendedEquipment: [],
              briefing: "정상",
            }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ recommendedEquipment: [] }),
        }),
    );
    render(
      <DispatchAnalysisProvider>
        <AnalysisNewView />
      </DispatchAnalysisProvider>,
    );
    const addListener = window.kakao.maps.event.addListener as ReturnType<
      typeof vi.fn
    >;
    addListener.mock.calls[0][2]({
      latLng: { getLat: () => 37.5, getLng: () => 127 },
    });

    await userEvent.click(screen.getByRole("button", { name: "화재" }));
    await userEvent.click(screen.getByRole("button", { name: "분석 요청" }));
    expect(push).toHaveBeenCalledWith("/analysis/1");
  });
});
