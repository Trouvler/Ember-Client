import type { RecommendedEquipment } from "@/entities/dispatch-analysis/model/types";
import ProgressBarCell from "./ProgressBarCell";

interface RecommendedEquipmentTableProps {
  equipment: RecommendedEquipment[];
}

export default function RecommendedEquipmentTable({
  equipment,
}: RecommendedEquipmentTableProps) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr>
          <th className="w-[180px] bg-[#f4f6f8] px-3.5 py-2.5 text-[11.5px] font-bold text-[#5c6672]">
            장비
          </th>
          <th className="w-[180px] bg-[#f4f6f8] px-3.5 py-2.5 text-[11.5px] font-bold text-[#5c6672]">
            필요도
          </th>
          <th className="bg-[#f4f6f8] px-3.5 py-2.5 text-[11.5px] font-bold text-[#5c6672]">
            용도
          </th>
        </tr>
      </thead>
      <tbody>
        {equipment.map((item) => (
          <tr key={item.id} className="border-b border-[#eef0f3]">
            <td className="px-3.5 py-3 text-sm font-bold text-ink">
              {item.name}
            </td>
            <td className="px-3.5 py-3">
              <ProgressBarCell
                value={item.needRate}
                colorClassName={item.needRate >= 90 ? "bg-ember" : "bg-ink"}
              />
            </td>
            <td className="px-3.5 py-3 text-[12.5px] text-[#6b7280]">
              {item.purpose}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
