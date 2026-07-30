import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_REGION, getPolicyDashboard } from "../getPolicyDashboard";

function stubFetch() {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("getPolicyDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // region을 생략하면 서버가 400을 반환하므로 항상 담겨야 한다.
  it("region을 생략해도 기본 지역을 쿼리에 담는다", async () => {
    const fetchMock = stubFetch();

    await getPolicyDashboard();

    expect(fetchMock.mock.calls[0][0]).toBe(
      `/api/dispatch/policy-dashboard?${new URLSearchParams({ region: DEFAULT_REGION })}`,
    );
  });

  it("빈 문자열을 넘겨도 기본 지역으로 대체한다", async () => {
    const fetchMock = stubFetch();

    await getPolicyDashboard("  ");

    expect(fetchMock.mock.calls[0][0]).toContain(
      new URLSearchParams({ region: DEFAULT_REGION }).toString(),
    );
  });

  it("지정한 지역을 쿼리에 담는다", async () => {
    const fetchMock = stubFetch();

    await getPolicyDashboard("부산");

    expect(fetchMock.mock.calls[0][0]).toContain(
      new URLSearchParams({ region: "부산" }).toString(),
    );
  });
});
