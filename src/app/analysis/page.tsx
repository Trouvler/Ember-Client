import type { Metadata } from "next";
import AnalysisListView from "@/views/analysis-list/ui/AnalysisListView";

export const metadata: Metadata = {
  title: "출동 분석 이력",
  description: "과거 신고 건에 대한 AI 출동 분석 결과를 조회합니다.",
};

export default function AnalysisPage() {
  return <AnalysisListView />;
}
