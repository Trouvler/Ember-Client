interface EquipmentTagProps {
  label: string;
}

export default function EquipmentTag({ label }: EquipmentTagProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
      {label}
    </span>
  );
}
