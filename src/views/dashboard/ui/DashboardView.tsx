import MapView from "@/shared/ui/MapView";

export default function DashboardView() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">지도 대시보드</h1>
      <p className="mt-4 text-sm text-zinc-500">
        위험 레이어(폴리곤) 표시는 준비 중입니다.
      </p>

      <div className="mt-6">
        <MapView />
      </div>
    </div>
  );
}
