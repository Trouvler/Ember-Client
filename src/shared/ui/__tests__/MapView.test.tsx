import { describe, it, expect, vi, beforeEach } from "vitest";
import { useEffect } from "react";
import { render } from "@testing-library/react";
import MapView from "../MapView";

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
}

function FakeMarker(this: KakaoMarker) {
  this.setMap = vi.fn();
  this.setPosition = vi.fn();
}

describe("MapView", () => {
  const addListener = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    window.kakao = {
      maps: {
        LatLng: FakeLatLng as unknown as KakaoMapsSdk["maps"]["LatLng"],
        Map: FakeMap as unknown as KakaoMapsSdk["maps"]["Map"],
        Marker: FakeMarker as unknown as KakaoMapsSdk["maps"]["Marker"],
        event: { addListener },
        load: (callback: () => void) => callback(),
      },
    };
  });

  it("지도 컨테이너를 렌더링한다", () => {
    const { container } = render(<MapView />);

    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("지도 클릭 시 onClickLocation에 좌표를 전달한다", () => {
    const onClickLocation = vi.fn();
    render(<MapView onClickLocation={onClickLocation} />);

    const clickHandler = addListener.mock.calls[0][2];
    clickHandler({ latLng: { getLat: () => 37.5, getLng: () => 127.0 } });

    expect(onClickLocation).toHaveBeenCalledWith({ lat: 37.5, lng: 127.0 });
  });
});
