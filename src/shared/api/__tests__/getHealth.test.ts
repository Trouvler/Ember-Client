import { describe, expect, it, vi } from "vitest";
import { getHealth } from "../getHealth";

describe("getHealth", () => {
  it("헬스 엔드포인트를 조회한다", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ status: "OK" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(getHealth()).resolves.toEqual({ status: "OK" });
    expect(fetchMock).toHaveBeenCalledWith("/api/health", expect.anything());
  });
});
