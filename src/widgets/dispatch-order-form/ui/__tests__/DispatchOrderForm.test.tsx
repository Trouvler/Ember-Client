import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DispatchOrderForm from "../DispatchOrderForm";

const UNITS = [
  {
    stationId: 1,
    rank: 1,
    stationName: "종로소방서",
    estimatedArrivalMinutes: 6.3,
    successProbability: 82,
    reason: "관할",
  },
  {
    stationId: 2,
    rank: 2,
    stationName: "중부소방서",
    estimatedArrivalMinutes: 8.1,
    successProbability: 71,
    reason: "인접",
  },
];

function stubFetch(ok = true) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 500,
    json: () =>
      Promise.resolve({
        orderId: 3,
        analysisId: 7,
        stationId: 2,
        stationName: "중부소방서",
        orderedAt: "2026-07-31T02:00:00.000Z",
        operatorName: "김선우",
      }),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("DispatchOrderForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("담당자를 입력하지 않으면 전송 버튼이 비활성화된다", () => {
    stubFetch();

    render(<DispatchOrderForm analysisId={7} units={UNITS} />);

    expect(
      screen.getByRole("button", { name: "출동 지령 전송" }),
    ).toBeDisabled();
  });

  it("추천 출동대가 없으면 지령을 보낼 수 없다고 안내한다", () => {
    stubFetch();

    render(<DispatchOrderForm analysisId={7} units={[]} />);

    expect(
      screen.getByText("추천 출동대가 없어 지령을 전송할 수 없습니다."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "출동 지령 전송" }),
    ).not.toBeInTheDocument();
  });

  it("전송 버튼을 눌러도 확인 전에는 요청을 보내지 않는다", async () => {
    const fetchMock = stubFetch();

    render(<DispatchOrderForm analysisId={7} units={UNITS} />);
    await userEvent.type(screen.getByLabelText("지령 담당자"), "김선우");
    await userEvent.click(
      screen.getByRole("button", { name: "출동 지령 전송" }),
    );

    expect(
      screen.getByText(/전송 후에는 취소할 수 없습니다/),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("취소하면 요청을 보내지 않고 폼으로 돌아온다", async () => {
    const fetchMock = stubFetch();

    render(<DispatchOrderForm analysisId={7} units={UNITS} />);
    await userEvent.type(screen.getByLabelText("지령 담당자"), "김선우");
    await userEvent.click(
      screen.getByRole("button", { name: "출동 지령 전송" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(
      screen.getByRole("button", { name: "출동 지령 전송" }),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("선택한 출동대와 담당자를 담아 지령을 전송한다", async () => {
    const fetchMock = stubFetch();

    render(<DispatchOrderForm analysisId={7} units={UNITS} />);
    await userEvent.click(screen.getByRole("radio", { name: /중부소방서/ }));
    await userEvent.type(screen.getByLabelText("지령 담당자"), "김선우");
    await userEvent.click(
      screen.getByRole("button", { name: "출동 지령 전송" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "전송 확인" }));

    expect(
      await screen.findByText("출동 지령을 전송했습니다."),
    ).toBeInTheDocument();
    expect(fetchMock.mock.calls[0][0]).toBe("/api/dispatch/7/order");
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.stationId).toBe(2);
    expect(body.operatorName).toBe("김선우");
  });

  it("전송에 실패하면 오류와 다시 시도를 표시한다", async () => {
    stubFetch(false);

    render(<DispatchOrderForm analysisId={7} units={UNITS} />);
    await userEvent.type(screen.getByLabelText("지령 담당자"), "김선우");
    await userEvent.click(
      screen.getByRole("button", { name: "출동 지령 전송" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "전송 확인" }));

    expect(
      await screen.findByText("출동 지령 전송에 실패했습니다."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "다시 시도" }),
    ).toBeInTheDocument();
  });
});
