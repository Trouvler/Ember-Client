interface ErrorFallbackProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorFallback({
  message,
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3.5 rounded-xl border border-[#f0dada] bg-risk-high-bg px-6 py-7 text-center"
    >
      <p className="text-[13.5px] leading-[1.6] text-risk-high-text">
        {message}
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-risk-high px-4 py-2 text-[13px] font-semibold text-white hover:bg-risk-high-text"
        >
          다시 시도
        </button>
      ) : null}
    </div>
  );
}
