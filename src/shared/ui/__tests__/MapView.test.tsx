import { describe, it, expect, vi, beforeEach } from "vitest";
import { useEffect } from "react";
import { render, screen, act } from "@testing-library/react";
import MapView from "../MapView";

let scriptBehavior: "load" | "error" | "none" = "load";

function MockScript({
  onLoad,
  onError,
}: {
  onLoad?: () => void;
  onError?: () => void;
}) {
  useEffect(() => {
    if (scriptBehavior === "load") {
      onLoad?.();
    } else if (scriptBehavior === "error") {
      onError?.();
    }
  }, [onLoad, onError]);
  return null;
}

vi.mock("next/script", () => ({
  default: MockScript,
}));

function FakeLatLng(this: KakaoLatLng, lat: number, lng: number) {
  this.getLat = () => lat;
  this.getLng = () => lng;
}

const relayoutSpy = vi.fn();

function FakeMap(this: KakaoMap) {
  this.setCenter = vi.fn();
  this.relayout = relayoutSpy;
}

const markerInstances: KakaoMarker[] = [];

function FakeMarker(this: KakaoMarker) {
  this.setMap = vi.fn();
  this.setPosition = vi.fn();
  markerInstances.push(this);
}

describe("MapView", () => {
  const addListener = vi.fn();
  let resizeCallback: (() => void) | undefined;

  class FakeResizeObserver {
    constructor(callback: () => void) {
      resizeCallback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  beforeEach(() => {
    vi.clearAllMocks();
    resizeCallback = undefined;
    scriptBehavior = "load";
    markerInstances.length = 0;
    vi.stubGlobal("ResizeObserver", FakeResizeObserver);

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

  it("마커 위치가 바뀌면 새로 만들지 않고 기존 마커의 위치만 갱신한다", () => {
    const { rerender } = render(<MapView marker={{ lat: 37.5, lng: 127.0 }} />);

    expect(markerInstances).toHaveLength(1);

    rerender(<MapView marker={{ lat: 37.6, lng: 127.1 }} />);

    expect(markerInstances).toHaveLength(1);
    expect(markerInstances[0].setPosition).toHaveBeenCalledTimes(1);
  });

  it("마커가 제거되면 지도에서 마커를 지운다", () => {
    const { rerender } = render(<MapView marker={{ lat: 37.5, lng: 127.0 }} />);

    rerender(<MapView marker={null} />);

    expect(markerInstances[0].setMap).toHaveBeenCalledWith(null);
  });

  it("여러 마커를 표시하고 마커 클릭을 전달한다", () => {
    const onClickMarker = vi.fn();
    const { rerender } = render(
      <MapView
        markers={[
          { id: 1, lat: 37.5, lng: 127 },
          { id: 2, lat: 37.6, lng: 127.1 },
        ]}
        onClickMarker={onClickMarker}
      />,
    );

    expect(markerInstances).toHaveLength(2);
    const markerClickHandler = addListener.mock.calls.find(
      ([target, type]) => target === markerInstances[0] && type === "click",
    )?.[2];
    markerClickHandler();
    expect(onClickMarker).toHaveBeenCalledWith(1);

    rerender(<MapView markers={[{ id: 2, lat: 37.6, lng: 127.1 }]} />);
    expect(markerInstances[0].setMap).toHaveBeenCalledWith(null);
  });

  it("SDK의 load 콜백이 비동기로 늦게 실행돼도 마운트 시점부터 있던 marker를 생성한다", async () => {
    window.kakao.maps.load = (callback: () => void) => {
      setTimeout(callback, 0);
    };

    render(<MapView marker={{ lat: 37.5, lng: 127.0 }} />);

    await vi.waitFor(() => {
      expect(markerInstances).toHaveLength(1);
    });
  });

  it("컨테이너 크기가 변경되면 지도를 relayout한다", () => {
    vi.useFakeTimers();
    render(<MapView marker={{ lat: 37.5, lng: 127.0 }} />);

    resizeCallback?.();
    vi.advanceTimersByTime(200);

    expect(relayoutSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("SDK 스크립트 로드가 실패하면 에러 메시지를 표시한다", () => {
    scriptBehavior = "error";
    render(<MapView />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "지도를 불러오지 못했습니다.",
    );
  });

  it("SDK 로드가 타임아웃되면 에러 메시지를 표시한다", () => {
    vi.useFakeTimers();
    scriptBehavior = "none";
    render(<MapView />);

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "지도를 불러오지 못했습니다.",
    );
    vi.useRealTimers();
  });
});
