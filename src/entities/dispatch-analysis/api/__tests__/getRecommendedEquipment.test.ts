import { describe, expect, it, vi } from "vitest";
import { getRecommendedEquipment } from "../getRecommendedEquipment";

describe("getRecommendedEquipment", () => {
  it("분석 ID로 추천 장비를 조회한다", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ recommendedEquipment: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(getRecommendedEquipment(42)).resolves.toEqual({
      recommendedEquipment: [],
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/equipment/42",
      expect.anything(),
    );
  });
});
