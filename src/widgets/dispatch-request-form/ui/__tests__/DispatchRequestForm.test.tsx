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

describe("DispatchRequestForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("위치 또는 사고 유형이 없으면 제출 버튼이 비활성화된다", () => {
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
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(analysisResponse),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            recommendedEquipment: [
              {
                equipmentType: "PUMP_TRUCK",
                requiredProbability: 90,
                reason: "진화",
              },
            ],
          }),
      });
    vi.stubGlobal("fetch", fetchMock);
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

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      incidentType: "FIRE",
      latitude: 37.5,
      longitude: 127,
      buildingType: "COMMERCIAL",
    });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).occurredAt).toMatch(
      /Z$/,
    );
    expect(fetchMock.mock.calls[1][0]).toBe("/api/equipment/1");
    expect(onSubmitted).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendedEquipment: [
          {
            equipmentType: "PUMP_TRUCK",
            requiredProbability: 90,
            reason: "진화",
          },
        ],
      }),
      false,
    );
  });

  it("분석 요청 실패는 재시도 UI를 표시한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      }),
    );
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
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(analysisResponse),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: () => Promise.resolve({}),
        }),
    );
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
});
