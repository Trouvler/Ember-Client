interface DemoDataBadgeProps {
  visible: boolean;
  message?: string;
}

export default function DemoDataBadge({
  visible,
  message = "시연 데이터 · 실제 집계가 아닙니다",
}: DemoDataBadgeProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      role="status"
      className="rounded-md bg-[#f4f6f8] px-3 py-2 text-[11.5px] leading-[1.5] text-[#5c6672]"
    >
      {message}
    </div>
  );
}
