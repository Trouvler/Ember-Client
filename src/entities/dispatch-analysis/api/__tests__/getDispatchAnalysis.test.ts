import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDispatchAnalysis } from "../getDispatchAnalysis";
import { ApiError } from "@/shared/api/apiError";

describe("getDispatchAnalysis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("분석 ID로 상세를 조회한다", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ analysisId: 7 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(getDispatchAnalysis(7)).resolves.toEqual({ analysisId: 7 });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/dispatch/7",
      expect.anything(),
    );
  });

  it("서버 오류는 상태 코드를 담은 ApiError로 전달된다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      }),
    );

    await expect(getDispatchAnalysis(1)).rejects.toBeInstanceOf(ApiError);
  });
});
