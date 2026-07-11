import AnalysisResultCard from "@/widgets/analysis-result-card/ui/AnalysisResultCard";
import RecommendedTeamTable from "@/shared/ui/RecommendedTeamTable";

interface AnalysisDetailViewProps {
  id: string;
}

// 조회 API(GET /api/dispatch-analyses/:id)가 아직 문서화되지 않아 샘플 데이터로 렌더링
const SAMPLE_RESULT = {
  degraded: false,
  riskLevel: "MEDIUM" as const,
  probability: 62,
  equipment: ["소화기", "방화복", "산소마스크"],
};

const SAMPLE_TEAMS = [
  { id: "1", name: "1소방서 화재진압대", eta: 5 },
  { id: "2", name: "2소방서 구조대", eta: 8 },
];

export default function AnalysisDetailView({ id }: AnalysisDetailViewProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">분석 결과</h1>
      <p className="mt-1 text-sm text-zinc-500">분석 ID: {id}</p>

      <div className="mt-6">
        <AnalysisResultCard {...SAMPLE_RESULT} />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold tracking-tight">추천 출동대</h2>
        <div className="mt-3">
          <RecommendedTeamTable teams={SAMPLE_TEAMS} />
        </div>
      </div>
    </div>
  );
}
