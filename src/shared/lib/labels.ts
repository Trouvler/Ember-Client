// 서버는 enum 값과 AI 모델 피처 이름을 영문 그대로 내려준다. 관제사에게는 한글만 보여야 하므로
// 표시 직전에만 라벨로 바꾼다(전송 값은 원본 enum 유지).

const EQUIPMENT_LABELS: Record<string, string> = {
  PUMP_TRUCK: "펌프차",
  LADDER_TRUCK: "고가사다리차",
  RESCUE_VEHICLE: "구조공작차",
};

const STATION_TYPE_LABELS: Record<string, string> = {
  HEADQUARTERS: "소방서",
  SAFETY_CENTER: "119안전센터",
};

const RISK_LEVEL_LABELS: Record<string, string> = {
  HIGH: "높음",
  MEDIUM: "보통",
  LOW: "낮음",
  UNKNOWN: "미확인",
};

const FEATURE_LABELS: Record<string, string> = {
  latitude: "발생 지점 위도",
  longitude: "발생 지점 경도",
  distance_to_nearest_station_m: "최근접 소방서까지 거리",
  hour: "신고 접수 시각",
  incident_type: "사고 유형",
  building_type: "건물 유형",
};

const ENUM_LABELS: Record<string, string> = {
  ...EQUIPMENT_LABELS,
  ...STATION_TYPE_LABELS,
  ...RISK_LEVEL_LABELS,
};

export function equipmentLabel(value: string) {
  return EQUIPMENT_LABELS[value] ?? value;
}

export function stationTypeLabel(value: string) {
  return STATION_TYPE_LABELS[value] ?? value;
}

export function riskLevelLabel(value: string) {
  return RISK_LEVEL_LABELS[value] ?? value;
}

export function featureLabel(value: string) {
  return FEATURE_LABELS[value] ?? value;
}

// 브리핑 문장 안에 섞여 오는 enum 토큰(PUMP_TRUCK, LOW 등)을 치환한다.
export function localizeEnums(text: string) {
  return text.replace(
    /\b[A-Z][A-Z_]{2,}\b/g,
    (token) => ENUM_LABELS[token] ?? token,
  );
}
