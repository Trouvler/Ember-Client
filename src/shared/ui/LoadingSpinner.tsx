const SIZE_CLASSES = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
} as const;

interface LoadingSpinnerProps {
  label?: string;
  size?: keyof typeof SIZE_CLASSES;
}

export default function LoadingSpinner({
  label,
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2" role="status">
      <span
        aria-hidden="true"
        className={`inline-block animate-spin rounded-full border-[#e6e9ee] border-t-ember ${SIZE_CLASSES[size]}`}
      />
      {label ? (
        <span className="text-[13px] text-[#5c6672]">{label}</span>
      ) : null}
    </div>
  );
}
