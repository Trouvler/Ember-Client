import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DispatchRequestForm from "../DispatchRequestForm";

const analysisResponse = {
  analysisId: 1,
  degraded: false,
  riskLevel: "LOW",
  estimatedArrivalMinutes: 4,
  goldenTimeFailureProbability: 0.2,
  recommendedUnits: [],
  recommendedEquipment: [],
  briefing: "정상",
};

const EQUIPMENT = {
  recommendedEquipment: [
    { equipmentType: "PUMP_TRUCK", requiredProbability: 90, reason: "진화" },
  ],
};

interface StubOptions {
  nearby?: unknown[];
  dispatchOk?: boolean;
  equipmentOk?: boolean;
  nearbyOk?: boolean;
}

// 사고 유형을 고르면 인접 출동대 조회가 함께 발생하므로
// 호출 순서가 아니라 URL로 응답을 정한다.
function stubFetch({
  nearby = [],
  dispatchOk = true,
  equipmentOk = true,
  nearbyOk = true,
}: StubOptions = {}) {
  const fetchMock = vi.fn((path: string) => {
    if (path.startsWith("/api/station/nearby")) {
      return Promise.resolve({
        ok: nearbyOk,
        status: nearbyOk ? 200 : 500,
        json: () => Promise.resolve(nearby),
      });
    }
    if (path.startsWith("/api/equipment/")) {
      return Promise.resolve({
        ok: equipmentOk,
        status: equipmentOk ? 200 : 500,
        json: () => Promise.resolve(EQUIPMENT),
      });
    }
    return Promise.resolve({
      ok: dispatchOk,
      status: dispatchOk ? 200 : 500,
      json: () => Promise.resolve(analysisResponse),
    });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

type FetchCall = [string, RequestInit?];

function dispatchBodyOf(fetchMock: ReturnType<typeof stubFetch>) {
  const call = fetchMock.mock.calls.find(
    ([path]) => path === "/api/dispatch",
  ) as FetchCall | undefined;
  return JSON.parse(String(call?.[1]?.body));
}

describe("DispatchRequestForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("위치 또는 사고 유형이 없으면 제출 버튼이 비활성화된다", () => {
    stubFetch();
    const { rerender } = render(
      <DispatchRequestForm location={null} onSubmitted={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: "분석 요청" })).toBeDisabled();

    rerender(
      <DispatchRequestForm
        location={{ lat: 37.5, lng: 127 }}
        onSubmitted={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "분석 요청" })).toBeDisabled();
  });

  it("Swagger 요청 형식으로 분석과 전용 장비를 조회한다", async () => {
    const fetchMock = stubFetch();
    const onSubmitted = vi.fn();
    render(
      <DispatchRequestForm
        location={{ lat: 37.5, lng: 127 }}
        onSubmitted={onSubmitted}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "화재" }));
    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /건물 유형/ }),
      "COMMERCIAL",
    );
    await userEvent.click(screen.getByRole("button", { name: "분석 요청" }));

    const dispatchBody = dispatchBodyOf(fetchMock);
    expect(dispatchBody).toMatchObject({
      incidentType: "FIRE",
      latitude: 37.5,
      longitude: 127,
      buildingType: "COMMERCIAL",
    });
    expect(dispatchBody.occurredAt).toMatch(/Z$/);
    expect(
      fetchMock.mock.calls.some(([path]) => path === "/api/equipment/1"),
    ).toBe(true);
    expect(onSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendedEquipment: EQUIPMENT.recommendedEquipment,
      }),
      false,
    );
  });

  it("분석 요청 실패는 재시도 UI를 표시한다", async () => {
    stubFetch({ dispatchOk: false });
    render(
      <DispatchRequestForm
        location={{ lat: 37.5, lng: 127 }}
        onSubmitted={vi.fn()}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "화재" }));
    await userEvent.click(screen.getByRole("button", { name: "분석 요청" }));

    expect(
      screen.getByText("신고 분석 요청에 실패했습니다."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "다시 시도" }),
    ).toBeInTheDocument();
  });

  it("장비 조회만 실패하면 분석 결과를 오류 상태로 전달한다", async () => {
    stubFetch({ equipmentOk: false });
    const onSubmitted = vi.fn();
    render(
      <DispatchRequestForm
        location={{ lat: 37.5, lng: 127 }}
        onSubmitted={onSubmitted}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "화재" }));
    await userEvent.click(screen.getByRole("button", { name: "분석 요청" }));

    expect(onSubmitted).toHaveBeenCalledWith(analysisResponse, true);
  });

  it("사고 유형을 고르면 좌표와 유형으로 인접 출동대를 조회한다", async () => {
    const fetchMock = stubFetch({
      nearby: [
        {
          stationId: 3,
          name: "종로소방서",
          distanceMeters: 1240,
          estimatedArrivalMinutes: 6.3,
        },
      ],
    });
    render(
      <DispatchRequestForm
        location={{ lat: 37.5, lng: 127 }}
        onSubmitted={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "화재" }));

    expect(await screen.findByText("종로소방서")).toBeInTheDocument();
    expect(screen.getByText("1.2")).toBeInTheDocument();
    const nearbyCall = fetchMock.mock.calls.find(([path]) =>
      String(path).startsWith("/api/station/nearby"),
    );
    expect(nearbyCall?.[0]).toContain("incidentType=FIRE");
    expect(nearbyCall?.[0]).toContain("lat=37.5");
  });

  it("인접 출동대가 없으면 빈 상태를 표시한다", async () => {
    stubFetch({ nearby: [] });
    render(
      <DispatchRequestForm
        location={{ lat: 37.5, lng: 127 }}
        onSubmitted={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "화재" }));

    expect(
      await screen.findByText("인접 출동대 정보가 없습니다."),
    ).toBeInTheDocument();
  });

  it("인접 출동대 조회가 실패하면 안내를 표시한다", async () => {
    stubFetch({ nearbyOk: false });
    render(
      <DispatchRequestForm
        location={{ lat: 37.5, lng: 127 }}
        onSubmitted={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "화재" }));

    expect(
      await screen.findByText("인접 출동대를 불러오지 못했습니다."),
    ).toBeInTheDocument();
  });
});
