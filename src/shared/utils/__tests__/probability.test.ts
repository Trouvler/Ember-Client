import { beforeEach, describe, expect, it, vi } from "vitest";
import { probabilityAsPercent } from "../probability";

describe("probabilityAsPercent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("0~1 분수는 퍼센트로 변환한다", () => {
    expect(probabilityAsPercent(0.27)).toBeCloseTo(27);
  });

  it("이미 퍼센트인 값은 그대로 둔다", () => {
    expect(probabilityAsPercent(62)).toBe(62);
  });

  it("0과 1의 경계를 처리한다", () => {
    expect(probabilityAsPercent(0)).toBe(0);
    expect(probabilityAsPercent(1)).toBe(100);
  });
});
