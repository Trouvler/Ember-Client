import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SystemStatus from "../SystemStatus";

function stubHealth(response: unknown) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(response),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("SystemStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("조회 전에는 확인 중 상태를 표시한다", () => {
    stubHealth({ status: "OK" });

    render(<SystemStatus />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "분석 서버 상태 확인 중",
    );
  });

  it("status가 OK면 정상 상태를 표시한다", async () => {
    stubHealth({ status: "OK" });

    render(<SystemStatus />);

    expect(await screen.findByText("분석 서버 정상")).toBeInTheDocument();
  });

  it("status가 OK가 아니면 제한 운영 상태를 표시한다", async () => {
    stubHealth({ status: "DEGRADED" });

    render(<SystemStatus />);

    expect(await screen.findByText("분석 서버 제한 운영")).toBeInTheDocument();
  });

  it("status가 비어 있으면 상태 미확인을 표시한다", async () => {
    stubHealth({ status: "" });

    render(<SystemStatus />);

    expect(
      await screen.findByText("분석 서버 상태 미확인"),
    ).toBeInTheDocument();
  });

  it("조회에 실패하면 응답 없음과 다시 확인 버튼을 표시한다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    render(<SystemStatus />);

    expect(await screen.findByText("분석 서버 응답 없음")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "다시 확인" }),
    ).toBeInTheDocument();
  });

  it("다시 확인을 누르면 헬스 조회를 재시도한다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    render(<SystemStatus />);
    await screen.findByText("분석 서버 응답 없음");
    stubHealth({ status: "OK" });
    await userEvent.click(screen.getByRole("button", { name: "다시 확인" }));

    expect(await screen.findByText("분석 서버 정상")).toBeInTheDocument();
  });
});
