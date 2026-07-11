interface DegradedBannerProps {
  visible: boolean;
  message?: string;
}

export default function DegradedBanner({
  visible,
  message = "일부 데이터가 제한된 상태로 제공되고 있습니다.",
}: DegradedBannerProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      role="status"
      className="rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-800"
    >
      {message}
    </div>
  );
}
