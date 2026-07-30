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

const STATION = {
  stationId: 1,
  name: "종로소방서",
  type: "소방서",
  latitude: 37.5,
  longitude: 127,
  address: "종로구",
};

const STATION_DETAIL = { ...STATION, equipment: ["펌프차"] };

const FEATURE = {
  type: "Feature",
  properties: {
    dongName: "종로구 창신동",
    riskScore: 71,
    avgArrivalMinutes: 8.4,
  },
};

interface StubOptions {
  stations?: unknown[];
  detail?: unknown;
  features?: unknown[];
}

// 호출 순서가 아니라 URL로 응답을 정한다. 대시보드는 소방서 목록과
// 위험도 레이어를 함께 조회하므로 순서 기반 mock은 쉽게 깨진다.
function stubFetch({
  stations = [],
  detail = STATION_DETAIL,
  features = [],
}: StubOptions = {}) {
  const fetchMock = vi.fn((path: string) => {
    const json = path.startsWith("/api/dispatch/risk-layers")
      ? { type: "FeatureCollection", features }
      : /^\/api\/station\/\d+/.test(path)
        ? detail
        : stations;
    return Promise.resolve({ ok: true, json: () => Promise.resolve(json) });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

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
    stubFetch();

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

  it("위험도 레이어를 region과 함께 조회한다", async () => {
    const fetchMock = stubFetch({ features: [FEATURE] });

    render(<DashboardView />);
    await screen.findByText("종로구 창신동");

    const layerCall = fetchMock.mock.calls.find(([path]) =>
      String(path).startsWith("/api/dispatch/risk-layers"),
    );
    expect(layerCall?.[0]).toContain("region=");
    expect(layerCall?.[0]).toContain("type=GOLDEN_TIME");
  });

  it("행정동 위험도를 등급과 함께 표시한다", async () => {
    stubFetch({ features: [FEATURE] });

    render(<DashboardView />);

    expect(await screen.findByText("종로구 창신동")).toBeInTheDocument();
    expect(screen.getByText("HIGH")).toBeInTheDocument();
    expect(screen.getByText("8.4")).toBeInTheDocument();
  });

  it("집계된 행정동이 없으면 빈 상태를 표시한다", async () => {
    stubFetch({ features: [] });

    render(<DashboardView />);

    expect(
      await screen.findByText("집계된 행정동 위험도가 없습니다.", {
        exact: false,
      }),
    ).toBeInTheDocument();
  });

  it("소방서 선택 후 상세 정보를 표시한다", async () => {
    stubFetch({ stations: [STATION] });

    render(<DashboardView />);
    await userEvent.click(
      await screen.findByRole("button", { name: /종로소방서/ }),
    );

    expect(await screen.findByText("보유 장비: 펌프차")).toBeInTheDocument();
  });

  it("소방서 마커 클릭으로 상세 정보를 표시한다", async () => {
    stubFetch({ stations: [STATION] });

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

  it("조회 오류를 재시도 UI로 표시한다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    render(<DashboardView />);

    expect(
      await screen.findByText("소방서 목록을 불러오지 못했습니다."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("위험도 레이어를 불러오지 못했습니다."),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "다시 시도" })).toHaveLength(
      2,
    );
  });
});
