import { beforeEach, describe, expect, it, vi } from "vitest";
import { postDispatchOrder } from "../postDispatchOrder";

describe("postDispatchOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("분석 ID 경로로 출동 지령을 전송한다", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          orderId: 3,
          analysisId: 7,
          stationId: 1,
          stationName: "종로소방서",
          orderedAt: "2026-07-31T02:00:00.000Z",
          operatorName: "김선우",
        }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const request = {
      stationId: 1,
      operatorName: "김선우",
      orderedAt: "2026-07-31T02:00:00.000Z",
    };
    const response = await postDispatchOrder(7, request);

    expect(response.orderId).toBe(3);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/dispatch/7/order",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(request),
      }),
    );
  });
});
