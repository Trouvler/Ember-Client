import type { Metadata } from "next";
import AnalysisDetailView from "@/views/analysis-detail/ui/AnalysisDetailView";

export const metadata: Metadata = {
  title: "분석 결과",
  description:
    "선택한 신고 건의 위험도 분석, 추천 출동대, 추천 장비, AI 상황 브리핑을 확인합니다.",
};

interface AnalysisDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalysisDetailPage({
  params,
}: AnalysisDetailPageProps) {
  const { id } = await params;
  return <AnalysisDetailView id={id} />;
}
