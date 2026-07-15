import { describe, it, expect, vi, beforeEach } from "vitest";
import { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AnalysisNewView from "../AnalysisNewView";

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

function MockScript({ onLoad }: { onLoad?: () => void }) {
  useEffect(() => {
    onLoad?.();
  }, [onLoad]);
  return null;
}

vi.mock("next/script", () => ({
  default: MockScript,
}));

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
        unobserve() {}
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

  it("위치·유형 선택 후 제출에 성공하면 분석 상세 페이지로 이동한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "analysis-1", degraded: false }),
      }),
    );

    render(<AnalysisNewView />);

    const addListener = window.kakao.maps.event.addListener as ReturnType<
      typeof vi.fn
    >;
    const clickHandler = addListener.mock.calls[0][2];
    clickHandler({ latLng: { getLat: () => 37.5, getLng: () => 127.0 } });

    await userEvent.click(screen.getByRole("button", { name: "화재" }));
    await userEvent.click(screen.getByRole("button", { name: "분석 요청" }));

    expect(push).toHaveBeenCalledWith("/analysis/analysis-1");
  });
});
