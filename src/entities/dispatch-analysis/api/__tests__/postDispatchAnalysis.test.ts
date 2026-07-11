import { describe, it, expect, vi, beforeEach } from "vitest";
import { postDispatchAnalysis } from "../postDispatchAnalysis";

describe("postDispatchAnalysis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("위치와 사고 유형을 담아 POST 요청을 보낸다", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ id: "analysis-1", degraded: false }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await postDispatchAnalysis({
      location: { lat: 37.5, lng: 127.0 },
      incidentType: "FIRE",
    });

    expect(result).toEqual({ id: "analysis-1", degraded: false });
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/dispatch-analyses"),
      expect.objectContaining({ method: "POST" }),
    );
  });
});
