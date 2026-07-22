import {
  INCIDENT_TYPES,
  INCIDENT_TYPE_LABELS,
  type IncidentType,
} from "../model/types";

interface IncidentTypeSelectorProps {
  value: IncidentType | null;
  onChange: (type: IncidentType) => void;
}

export default function IncidentTypeSelector({
  value,
  onChange,
}: IncidentTypeSelectorProps) {
  return (
    <div
      role="group"
      aria-label="사고 유형 선택"
      className="grid grid-cols-3 gap-2"
    >
      {INCIDENT_TYPES.map((type) => (
        <button
          key={type}
          type="button"
          aria-pressed={value === type}
          onClick={() => onChange(type)}
          className={`rounded-xl border py-3 text-sm font-bold ${
            value === type
              ? "border-ember bg-ember text-white"
              : "border-[#ebedf0] bg-white text-[#5c6672] card-shadow"
          }`}
        >
          {INCIDENT_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
}
