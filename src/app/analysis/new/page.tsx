import type { Metadata } from "next";
import AnalysisNewView from "@/views/analysis-new/ui/AnalysisNewView";

export const metadata: Metadata = {
  title: "신고 시뮬레이션",
  description:
    "신고 위치와 사고 정보를 입력하면 골든타임 실패 확률, 추천 출동대, 필요 장비를 산출합니다.",
};

export default function AnalysisNewPage() {
  return <AnalysisNewView />;
}
