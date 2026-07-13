import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
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

  it("출동 지령 전송·분석서 출력 버튼은 비활성화되어 있다", () => {
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
      screen.getByRole("button", { name: "출동 지령 전송" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "분석서 출력" })).toBeDisabled();
  });
});
