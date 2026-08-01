import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  equipmentLabel,
  featureLabel,
  localizeEnums,
  riskLevelLabel,
  stationTypeLabel,
} from "../labels";

describe("labels", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("장비·소방서 유형·위험도 enum을 한글로 바꾼다", () => {
    expect(equipmentLabel("PUMP_TRUCK")).toBe("펌프차");
    expect(stationTypeLabel("SAFETY_CENTER")).toBe("119안전센터");
    expect(riskLevelLabel("LOW")).toBe("낮음");
  });

  it("모델 피처 이름을 한글로 바꾼다", () => {
    expect(featureLabel("distance_to_nearest_station_m")).toBe(
      "최근접 소방서까지 거리",
    );
  });

  it("모르는 값은 원문을 유지한다", () => {
    expect(equipmentLabel("DRONE")).toBe("DRONE");
    expect(featureLabel("unknown_feature")).toBe("unknown_feature");
  });

  it("문장 안에 섞인 enum 토큰만 치환한다", () => {
    expect(
      localizeEnums("위험도는 LOW 수준입니다. 권장 장비: PUMP_TRUCK."),
    ).toBe("위험도는 낮음 수준입니다. 권장 장비: 펌프차.");
    expect(localizeEnums("종로소방서-종로-119 안전센터 권장")).toBe(
      "종로소방서-종로-119 안전센터 권장",
    );
  });
});
