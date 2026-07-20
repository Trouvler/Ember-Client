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

    const request = {
      incidentType: "FIRE" as const,
      latitude: 37.5,
      longitude: 127.0,
      occurredAt: "2026-07-20T01:00:00.000Z",
      buildingType: "COMMERCIAL" as const,
    };
    const result = await postDispatchAnalysis(request);

    expect(result).toEqual({ id: "analysis-1", degraded: false });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/dispatch",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  });
});
