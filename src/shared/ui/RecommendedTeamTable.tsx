import type { DispatchUnitCandidate } from "@/entities/dispatch-analysis/model/types";
import ProgressBarCell from "./ProgressBarCell";

interface RecommendedTeamTableProps {
  teams: DispatchUnitCandidate[];
}

export default function RecommendedTeamTable({
  teams,
}: RecommendedTeamTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left">
        <thead>
          <tr>
            <th className="w-[50px] bg-[#f4f6f8] px-3 py-2.5 text-center text-[11.5px] font-bold text-[#5c6672]">
              순위
            </th>
            <th className="bg-[#f4f6f8] px-3.5 py-2.5 text-[11.5px] font-bold text-[#5c6672]">
              출동대
            </th>
            <th className="w-[92px] bg-[#f4f6f8] px-3.5 py-2.5 text-right text-[11.5px] font-bold text-[#5c6672]">
              예상 도착
            </th>
            <th className="w-[158px] bg-[#f4f6f8] px-3.5 py-2.5 text-[11.5px] font-bold text-[#5c6672]">
              예측 성공률
            </th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.stationId} className="border-b border-[#eef0f3]">
              <td className="py-3 text-center">
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-[3px] text-[11px] font-bold ${
                    team.rank === 1
                      ? "bg-ink text-white"
                      : "border border-[#dde2e9] bg-[#eef1f5] text-[#5c6672]"
                  }`}
                >
                  {team.rank}
                </span>
              </td>
              <td className="px-3.5 py-3">
                <span className="text-sm font-bold text-ink">
                  {team.stationName}
                </span>{" "}
                <span className="text-[11px] text-[#6b7280]">
                  {team.reason}
                </span>
              </td>
              <td className="px-3.5 py-3 text-right">
                <span className="mono text-sm font-semibold text-ink">
                  {team.estimatedArrivalMinutes}
                </span>
                <span className="text-[11px] text-[#6b7280]">분</span>
              </td>
              <td className="px-3.5 py-3">
                <ProgressBarCell
                  value={team.successProbability}
                  colorClassName={
                    team.rank === 1 ? "bg-risk-low" : "bg-[#8a919c]"
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
