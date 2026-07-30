import type { FireStationDetail, NearbyStation } from "./types";

// 백엔드가 빈 응답을 줄 때만 화면에 표시하는 시연 값. 실제 집계가 아니다.
// 좌표는 지도 마커 위치 확인용 서울 시내 근사값이다.
// 시연 소방서는 서버에 없어 상세 조회가 실패하므로, 상세까지 담아 화면에서 바로 쓴다.
export const DEMO_FIRE_STATIONS: FireStationDetail[] = [
  {
    stationId: 9001,
    name: "종로소방서",
    type: "소방서",
    latitude: 37.5729,
    longitude: 126.9794,
    address: "서울 종로구 사직로",
    equipment: ["펌프차", "고가사다리차", "구급차"],
  },
  {
    stationId: 9002,
    name: "중부소방서",
    type: "소방서",
    latitude: 37.5638,
    longitude: 126.9975,
    address: "서울 중구 을지로",
    equipment: ["펌프차", "화학차"],
  },
  {
    stationId: 9003,
    name: "영등포소방서",
    type: "소방서",
    latitude: 37.5264,
    longitude: 126.8962,
    address: "서울 영등포구 당산로",
    equipment: ["펌프차", "물탱크차", "구급차"],
  },
  {
    stationId: 9004,
    name: "동대문소방서",
    type: "소방서",
    latitude: 37.5744,
    longitude: 127.0397,
    address: "서울 동대문구 왕산로",
    equipment: ["펌프차", "구조공작차"],
  },
  {
    stationId: 9005,
    name: "성북소방서",
    type: "소방서",
    latitude: 37.5894,
    longitude: 127.0167,
    address: "서울 성북구 보문로",
    equipment: ["펌프차", "구급차"],
  },
];

export const DEMO_NEARBY_STATIONS: NearbyStation[] = [
  {
    stationId: 9001,
    name: "종로소방서",
    distanceMeters: 1240,
    estimatedArrivalMinutes: 6.3,
  },
  {
    stationId: 9002,
    name: "중부소방서",
    distanceMeters: 2680,
    estimatedArrivalMinutes: 8.1,
  },
  {
    stationId: 9005,
    name: "성북소방서",
    distanceMeters: 3450,
    estimatedArrivalMinutes: 9.7,
  },
];
