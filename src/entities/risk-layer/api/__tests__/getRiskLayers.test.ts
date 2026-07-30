import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_REGION, getRiskLayers } from "../getRiskLayers";

function stubFetch() {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ type: "FeatureCollection", features: [] }),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("getRiskLayers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // type과 region을 생략하면 서버가 400을 반환하므로 항상 담겨야 한다.
  it("type과 기본 지역을 항상 쿼리에 담는다", async () => {
    const fetchMock = stubFetch();

    await getRiskLayers();

    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toContain("type=GOLDEN_TIME");
    expect(url).toContain(
      new URLSearchParams({ region: DEFAULT_REGION }).toString(),
    );
  });

  it("빈 문자열을 넘겨도 기본 지역으로 대체한다", async () => {
    const fetchMock = stubFetch();

    await getRiskLayers("");

    expect(String(fetchMock.mock.calls[0][0])).toContain(
      new URLSearchParams({ region: DEFAULT_REGION }).toString(),
    );
  });

  it("지정한 지역을 쿼리에 담는다", async () => {
    const fetchMock = stubFetch();

    await getRiskLayers("종로구");

    expect(String(fetchMock.mock.calls[0][0])).toContain(
      new URLSearchParams({ region: "종로구" }).toString(),
    );
  });
});
