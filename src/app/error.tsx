"use client";

import ErrorFallback from "@/shared/ui/ErrorFallback";

interface ErrorProps {
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <h1 className="text-xl font-bold tracking-[-0.03em] text-ink">
        화면을 표시할 수 없습니다
      </h1>
      <p className="mt-2.5 max-w-[420px] text-center text-sm leading-[1.7] text-[#5c6672]">
        일시적인 오류가 발생했습니다. 다시 시도해도 같은 화면이 보이면 상황실
        담당자에게 알려 주세요.
      </p>
      <div className="mt-6 w-full max-w-[420px]">
        <ErrorFallback message="요청을 처리하지 못했습니다." onRetry={reset} />
      </div>
    </main>
  );
}
