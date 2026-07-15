import { describe, it, expect, vi, beforeEach } from "vitest";
import { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import AnalysisDetailView from "../AnalysisDetailView";

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

describe("AnalysisDetailView", () => {
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

  it("접수번호와 위험도·추천 출동대·AI 브리핑을 표시한다", () => {
    render(<AnalysisDetailView id="sample-1" />);

    expect(screen.getByText("#sample-1")).toBeInTheDocument();
    expect(screen.getByText("HIGH")).toBeInTheDocument();
    expect(screen.getByText("종로소방서")).toBeInTheDocument();
    expect(screen.getByText("강남소방서")).toBeInTheDocument();
    expect(screen.getByText("펌프차")).toBeInTheDocument();
  });

  it("정상 상태에서는 열화 배너를 표시하지 않는다", () => {
    render(<AnalysisDetailView id="sample-1" />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
