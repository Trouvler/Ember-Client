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

function FakeMarker(this: KakaoMarker) {
  this.setMap = vi.fn();
  this.setPosition = vi.fn();
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
