import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <p className="mono text-[13px] font-semibold tracking-[0.14em] text-ember">
        404
      </p>
      <h1 className="mt-4 text-xl font-bold tracking-[-0.03em] text-ink">
        찾을 수 없는 화면입니다
      </h1>
      <p className="mt-2.5 max-w-[420px] text-center text-sm leading-[1.7] text-[#5c6672]">
        주소가 바뀌었거나 삭제된 화면입니다. 상황 대시보드에서 다시 시작하세요.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-ember px-5 py-3 text-[14.5px] font-bold text-white hover:bg-[#d24f21]"
        >
          상황 대시보드로 이동
        </Link>
        <Link
          href="/"
          className="text-[14px] font-semibold text-[#5c6672] underline decoration-[#c4c9d0] underline-offset-[5px] hover:text-ink"
        >
          홈으로
        </Link>
      </div>
    </main>
  );
}
