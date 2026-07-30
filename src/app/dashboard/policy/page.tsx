import type { Metadata } from "next";
import DashboardPolicyView from "@/views/dashboard-policy/ui/DashboardPolicyView";

export const metadata: Metadata = {
  title: "우리 동네 화재 안전 정보",
  description:
    "AI가 분석한 지역별 화재 출동 위험도와 대응 통계를 누구나 확인할 수 있습니다.",
};

export default function DashboardPolicyPage() {
  return <DashboardPolicyView />;
}
