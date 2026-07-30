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
    // 사고 유형 선택 시 인접 출동대 조회가 함께 발생하므로 URL로 응답을 정한다.
    vi.stubGlobal(
      "fetch",
      vi.fn((path: string) => {
        if (path.startsWith("/api/station/nearby")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }
        if (path.startsWith("/api/equipment/")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ recommendedEquipment: [] }),
          });
        }
        return Promise.resolve({
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
        });
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

  it("주소와 장소 검색 결과를 선택해 신고 위치를 설정한다", async () => {
    const addressSearch = vi.fn((_: string, callback) =>
      callback(
        [{ x: "127", y: "37.5", address_name: "서울 중구 세종대로" }],
        "OK",
      ),
    );
    const keywordSearch = vi.fn((_: string, callback) =>
      callback(
        [
          {
            x: "126.978",
            y: "37.5665",
            place_name: "서울시청",
            address_name: "서울 중구 태평로1가",
            road_address_name: "서울 중구 세종대로 110",
          },
        ],
        "OK",
      ),
    );
    window.kakao.maps.services = {
      Geocoder: function () {
        return { addressSearch };
      } as unknown as KakaoMapServices["Geocoder"],
      Places: function () {
        return { keywordSearch };
      } as unknown as KakaoMapServices["Places"],
      Status: { OK: "OK" },
    };
    render(
      <DispatchAnalysisProvider>
        <AnalysisNewView />
      </DispatchAnalysisProvider>,
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: "주소 또는 장소명" }),
      "서울시청",
    );
    await userEvent.click(screen.getByRole("button", { name: "주소 검색" }));
    await userEvent.click(
      await screen.findByRole("button", { name: /서울시청/ }),
    );

    expect(screen.getByText("37.5665, 126.9780")).toBeInTheDocument();
  });

  it("빈 검색어에는 안내 메시지를 표시한다", async () => {
    render(
      <DispatchAnalysisProvider>
        <AnalysisNewView />
      </DispatchAnalysisProvider>,
    );

    await userEvent.click(screen.getByRole("button", { name: "주소 검색" }));

    expect(
      screen.getByText("주소 또는 장소명을 입력하세요."),
    ).toBeInTheDocument();
  });
});
