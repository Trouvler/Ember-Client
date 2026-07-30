import { beforeEach, describe, expect, it, vi } from "vitest";
import { postDispatchFeedback } from "../postDispatchFeedback";

describe("postDispatchFeedback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("분석 ID 경로로 출동 결과를 전송한다", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ feedbackId: 12 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const request = {
      actualArrivalMinutes: 9.4,
      usedEquipment: ["PUMP_TRUCK"],
      additionalDispatchRequired: true,
      delayReasons: ["교통 정체"],
    };
    await expect(postDispatchFeedback(7, request)).resolves.toEqual({
      feedbackId: 12,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/feedback/7",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  });
});
