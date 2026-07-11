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
    <div role="group" aria-label="사고 유형 선택" className="flex gap-2">
      {INCIDENT_TYPES.map((type) => (
        <button
          key={type}
          type="button"
          aria-pressed={value === type}
          onClick={() => onChange(type)}
          className={`rounded-md border px-4 py-2 text-sm font-medium ${
            value === type
              ? "border-zinc-900 bg-zinc-900 text-white"
              : "border-zinc-300 bg-white text-zinc-700"
          }`}
        >
          {INCIDENT_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  );
}
