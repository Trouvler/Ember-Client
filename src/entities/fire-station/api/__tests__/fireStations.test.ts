import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getFireStation,
  getFireStations,
  getNearbyStations,
} from "../fireStations";

describe("fire station API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("전체 또는 지역별 소방서를 조회한다", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    vi.stubGlobal("fetch", fetchMock);

    await getFireStations();
    await getFireStations("종로구");

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/api/station",
      expect.anything(),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/station?region=%EC%A2%85%EB%A1%9C%EA%B5%AC",
      expect.anything(),
    );
  });

  it("선택한 소방서 상세를 조회한다", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    vi.stubGlobal("fetch", fetchMock);

    await getFireStation(7);

    expect(fetchMock).toHaveBeenCalledWith("/api/station/7", expect.anything());
  });

  it("좌표와 사고 유형으로 인접 출동대를 조회하고 limit 기본값을 보낸다", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: () => Promise.resolve([]) });
    vi.stubGlobal("fetch", fetchMock);

    await getNearbyStations({
      lat: 37.5744,
      lng: 127.0157,
      incidentType: "FIRE",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/station/nearby?lat=37.5744&lng=127.0157&incidentType=FIRE&limit=3",
      expect.anything(),
    );
  });
});
