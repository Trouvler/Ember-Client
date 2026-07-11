import AnalysisDetailView from "@/views/analysis-detail/ui/AnalysisDetailView";

interface AnalysisDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalysisDetailPage({
  params,
}: AnalysisDetailPageProps) {
  const { id } = await params;
  return <AnalysisDetailView id={id} />;
}
