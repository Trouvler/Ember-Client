import { describe, it, expect, vi, beforeEach } from "vitest";
import { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardView from "../DashboardView";

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

describe("DashboardView", () => {
  beforeEach(() => {
    vi.clearAllMocks();

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

  it("선택 행정동 상세 정보를 표시한다", () => {
    render(<DashboardView />);

    expect(screen.getByText("종로구 창신동")).toBeInTheDocument();
    expect(screen.getByText("중점 관리 대상")).toBeInTheDocument();
    expect(screen.getByText("8.4")).toBeInTheDocument();
  });

  it("레이어 토글 버튼을 클릭하면 활성 레이어가 바뀐다", async () => {
    render(<DashboardView />);

    const goldenTimeButton = screen.getByRole("button", {
      name: "골든타임 실패율",
    });
    const arrivalTimeButton = screen.getByRole("button", {
      name: "평균 도착시간",
    });

    expect(goldenTimeButton).toHaveClass("bg-ink");

    await userEvent.click(arrivalTimeButton);

    expect(arrivalTimeButton).toHaveClass("bg-ink");
    expect(goldenTimeButton).not.toHaveClass("bg-ink");
  });
});
