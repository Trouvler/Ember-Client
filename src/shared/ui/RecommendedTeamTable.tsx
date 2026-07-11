interface DispatchTeam {
  id: string;
  name: string;
  eta?: number;
}

interface RecommendedTeamTableProps {
  teams: DispatchTeam[];
}

export default function RecommendedTeamTable({
  teams,
}: RecommendedTeamTableProps) {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-zinc-200 text-zinc-500">
          <th className="py-2 font-medium">출동대</th>
          <th className="py-2 font-medium">도착 예상 시간</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team) => (
          <tr key={team.id} className="border-b border-zinc-100">
            <td className="py-2">{team.name}</td>
            <td className="py-2">
              {team.eta !== undefined ? `${team.eta}분` : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
