import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DispatchFeedbackForm from "../DispatchFeedbackForm";

function stubFetch(ok = true) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve({ feedbackId: 12 }),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderForm() {
  return render(
    <DispatchFeedbackForm
      analysisId={7}
      equipmentOptions={["PUMP_TRUCK", "LADDER_TRUCK"]}
    />,
  );
}

describe("DispatchFeedbackForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("실제 도착 시간이 없으면 등록 버튼이 비활성화된다", () => {
    stubFetch();

    renderForm();

    expect(
      screen.getByRole("button", { name: "출동 결과 등록" }),
    ).toBeDisabled();
  });

  it("도착 시간이 0 이하면 등록 버튼이 비활성화된다", async () => {
    stubFetch();

    renderForm();
    await userEvent.type(screen.getByLabelText("실제 도착 시간 (분)"), "0");

    expect(
      screen.getByRole("button", { name: "출동 결과 등록" }),
    ).toBeDisabled();
  });

  it("선택한 장비와 지연 사유를 담아 등록한다", async () => {
    const fetchMock = stubFetch();

    renderForm();
    await userEvent.type(screen.getByLabelText("실제 도착 시간 (분)"), "9.4");
    await userEvent.click(screen.getByRole("checkbox", { name: "PUMP_TRUCK" }));
    await userEvent.click(screen.getByRole("checkbox", { name: "교통 정체" }));
    await userEvent.click(
      screen.getByRole("checkbox", { name: "추가 출동이 필요했음" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "출동 결과 등록" }),
    );

    expect(
      await screen.findByText("출동 결과가 등록되었습니다."),
    ).toBeInTheDocument();
    expect(fetchMock.mock.calls[0][0]).toBe("/api/feedback/7");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      actualArrivalMinutes: 9.4,
      usedEquipment: ["PUMP_TRUCK"],
      additionalDispatchRequired: true,
      delayReasons: ["교통 정체"],
    });
  });

  it("등록 성공 후 접수번호를 표시한다", async () => {
    stubFetch();

    renderForm();
    await userEvent.type(screen.getByLabelText("실제 도착 시간 (분)"), "6");
    await userEvent.click(
      screen.getByRole("button", { name: "출동 결과 등록" }),
    );

    expect(await screen.findByText("#12")).toBeInTheDocument();
  });

  it("등록에 실패하면 오류와 다시 시도를 표시한다", async () => {
    stubFetch(false);

    renderForm();
    await userEvent.type(screen.getByLabelText("실제 도착 시간 (분)"), "6");
    await userEvent.click(
      screen.getByRole("button", { name: "출동 결과 등록" }),
    );

    expect(
      await screen.findByText("출동 결과 등록에 실패했습니다."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "다시 시도" }),
    ).toBeInTheDocument();
  });
});
