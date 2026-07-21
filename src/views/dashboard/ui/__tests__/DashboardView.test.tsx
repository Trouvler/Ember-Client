import { beforeEach, describe, expect, it, vi } from "vitest";
import { useEffect } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardView from "../DashboardView";

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
  markerInstances.push(this);
}

const markerInstances: KakaoMarker[] = [];

describe("DashboardView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    markerInstances.length = 0;
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

  it("레이어를 전환하고 빈 소방서 목록을 표시한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) }),
    );
    render(<DashboardView />);
    await userEvent.click(
      screen.getByRole("button", { name: "평균 도착시간" }),
    );
    expect(screen.getByRole("button", { name: "평균 도착시간" })).toHaveClass(
      "bg-ink",
    );
    expect(
      await screen.findByText("조회된 소방서가 없습니다."),
    ).toBeInTheDocument();
  });

  it("소방서 선택 후 상세 정보를 표시한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                stationId: 1,
                name: "종로소방서",
                type: "소방서",
                latitude: 37.5,
                longitude: 127,
                address: "종로구",
              },
            ]),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              stationId: 1,
              name: "종로소방서",
              type: "소방서",
              latitude: 37.5,
              longitude: 127,
              address: "종로구",
              equipment: ["펌프차"],
            }),
        }),
    );
    render(<DashboardView />);
    await userEvent.click(
      await screen.findByRole("button", { name: /종로소방서/ }),
    );
    expect(await screen.findByText("보유 장비: 펌프차")).toBeInTheDocument();
  });

  it("소방서 마커 클릭으로 상세 정보를 표시한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                stationId: 1,
                name: "종로소방서",
                type: "소방서",
                latitude: 37.5,
                longitude: 127,
                address: "종로구",
              },
            ]),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () =>
            Promise.resolve({
              stationId: 1,
              name: "종로소방서",
              type: "소방서",
              latitude: 37.5,
              longitude: 127,
              address: "종로구",
              equipment: ["펌프차"],
            }),
        }),
    );
    render(<DashboardView />);

    await vi.waitFor(() => expect(markerInstances).toHaveLength(1));
    const addListener = window.kakao.maps.event.addListener as ReturnType<
      typeof vi.fn
    >;
    const clickHandler = addListener.mock.calls.find(
      ([target, type]) => target === markerInstances[0] && type === "click",
    )?.[2];
    clickHandler();

    expect(await screen.findByText("보유 장비: 펌프차")).toBeInTheDocument();
  });

  it("소방서 목록 조회 오류를 재시도 UI로 표시한다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<DashboardView />);

    expect(
      await screen.findByText("소방서 목록을 불러오지 못했습니다."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "다시 시도" }),
    ).toBeInTheDocument();
  });
});
