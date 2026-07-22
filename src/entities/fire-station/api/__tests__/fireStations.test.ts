import { describe, expect, it, vi } from "vitest";
import { getFireStation, getFireStations } from "../fireStations";

describe("fire station API", () => {
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
});
