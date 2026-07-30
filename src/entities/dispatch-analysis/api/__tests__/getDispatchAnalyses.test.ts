import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDispatchAnalyses } from "../getDispatchAnalyses";

const EMPTY_PAGE = { content: [], page: 0, size: 20, totalElements: 0 };

function stubFetch() {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({ ok: true, json: () => Promise.resolve(EMPTY_PAGE) });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("getDispatchAnalyses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("인자가 없으면 page와 size 기본값으로 조회한다", async () => {
    const fetchMock = stubFetch();

    await getDispatchAnalyses();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/dispatch?page=0&size=20",
      expect.anything(),
    );
  });

  it("지역을 넘기면 region을 쿼리에 담는다", async () => {
    const fetchMock = stubFetch();

    await getDispatchAnalyses({ region: "종로구", page: 2, size: 10 });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/dispatch?page=2&size=10&region=%EC%A2%85%EB%A1%9C%EA%B5%AC",
      expect.anything(),
    );
  });

  it("빈 지역 문자열은 쿼리에서 제외한다", async () => {
    const fetchMock = stubFetch();

    await getDispatchAnalyses({ region: "   " });

    expect(fetchMock.mock.calls[0][0]).not.toContain("region");
  });
});
