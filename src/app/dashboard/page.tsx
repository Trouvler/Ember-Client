import type { Metadata } from "next";
import DashboardView from "@/views/dashboard/ui/DashboardView";

export const metadata: Metadata = {
  title: "위험도 상황 지도",
  description:
    "행정동별 화재 출동 위험도와 관할 소방서 현황을 지도 위에 시각화합니다.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
