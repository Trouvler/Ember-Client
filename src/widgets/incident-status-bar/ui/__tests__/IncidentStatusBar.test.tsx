import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import IncidentStatusBar from "../IncidentStatusBar";

describe("IncidentStatusBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("상태 pill과 접수번호·제목·접수시각을 표시한다", () => {
    render(
      <IncidentStatusBar
        incidentId="2026-0712-00847"
        title="화재 · 주거시설 신고 분석"
        address="서울 종로구 창신동 일대"
        lat={37.5726}
        lng={127.0107}
        receivedAtLabel="14:23:07"
        initialElapsedSeconds={214}
      />,
    );

    expect(screen.getByText("출동 대기")).toBeInTheDocument();
    expect(screen.getByText("#2026-0712-00847")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "화재 · 주거시설 신고 분석" }),
    ).toBeInTheDocument();
    expect(screen.getByText("14:23:07")).toBeInTheDocument();
    expect(screen.getByText("00:03:34")).toBeInTheDocument();
  });

  it("분석서를 출력하고 출동 지령 전송 영역으로 이동한다", async () => {
    window.print = vi.fn();
    render(
      <IncidentStatusBar
        incidentId="2026-0712-00847"
        title="화재 · 주거시설 신고 분석"
        address="서울 종로구 창신동 일대"
        lat={37.5726}
        lng={127.0107}
        receivedAtLabel="14:23:07"
        initialElapsedSeconds={214}
      />,
    );

    expect(
      screen.getByRole("link", { name: "출동 지령 전송" }),
    ).toHaveAttribute("href", "#dispatch-order");
    await userEvent.click(screen.getByRole("button", { name: "분석서 출력" }));
    expect(window.print).toHaveBeenCalledOnce();
  });

  it("경과 시간은 1초마다 실제로 증가한다", () => {
    vi.useFakeTimers();
    render(
      <IncidentStatusBar
        incidentId="2026-0712-00847"
        title="화재 · 주거시설 신고 분석"
        address="서울 종로구 창신동 일대"
        lat={37.5726}
        lng={127.0107}
        receivedAtLabel="14:23:07"
        initialElapsedSeconds={214}
      />,
    );

    expect(screen.getByText("00:03:34")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText("00:03:37")).toBeInTheDocument();
    vi.useRealTimers();
  });
});
