import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiFetch } from "../httpClient";
import { ApiError } from "../apiError";

describe("apiFetch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("응답이 성공이면 JSON을 파싱해서 반환한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ id: "1" }),
      }),
    );

    const result = await apiFetch<{ id: string }>("/api/dispatch-analyses");

    expect(result).toEqual({ id: "1" });
  });

  it("응답이 실패면 ApiError를 던진다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      }),
    );

    await expect(apiFetch("/api/dispatch-analyses")).rejects.toBeInstanceOf(
      ApiError,
    );
  });
});
