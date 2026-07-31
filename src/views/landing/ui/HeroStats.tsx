"use client";

import { useEffect, useState } from "react";
import DemoDataBadge from "@/shared/ui/DemoDataBadge";
import { probabilityAsPercent } from "@/shared/utils/probability";
import { getPolicyDashboard } from "@/entities/policy-dashboard/api/getPolicyDashboard";
import { DEMO_POLICY_DASHBOARD } from "@/entities/policy-dashboard/model/demoData";
import type { PolicyDashboard } from "@/entities/policy-dashboard/model/types";

export default function HeroStats() {
  const [dashboard, setDashboard] = useState<PolicyDashboard | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    void getPolicyDashboard()
      .then((next) => {
        if (isMounted) setDashboard(next);
      })
      .catch(() => {
        if (isMounted) setFailed(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const isEmpty =
    dashboard !== null &&
    dashboard.totalAnalyzedCases === 0 &&
    dashboard.vulnerableDistrictTop5.length === 0;
  const isDemo = failed || isEmpty;
  const shown = isDemo ? DEMO_POLICY_DASHBOARD : dashboard;
  const isLoading = shown === null;

  // 로딩 중에 스피너를 넣으면 히어로 레이아웃이 흔들린다.
  const placeholder = "—";
  const stats = [
    {
      label: "전체 분석 건수",
      value: isLoading
        ? placeholder
        : shown.totalAnalyzedCases.toLocaleString("ko-KR"),
      unit: "건",
      valueClassName: "text-ink",
      caption: "시범 운영 이후 누적",
    },
    {
      label: "평균 골든타임 확보율",
      value: isLoading
        ? placeholder
        : (100 - probabilityAsPercent(shown.avgGoldenTimeFailureRate)).toFixed(
            1,
          ),
      unit: "%",
      valueClassName: "text-risk-low",
      caption: "7분 내 현장 도착 기준",
    },
    {
      label: "평균 분석 소요",
      value: isLoading
        ? placeholder
        : (shown.avgAnalysisSeconds ?? placeholder),
      unit: "초",
      valueClassName: "text-ember",
      caption: "신고 입력 → 결과 산출",
    },
  ];

  return (
    <>
      {isDemo ? (
        <div className="mt-4">
          <DemoDataBadge visible />
        </div>
      ) : null}
      <dl className="mt-4 grid grid-cols-1 gap-x-6 sm:grid-cols-3 lg:grid-cols-1">
        {stats.map(({ label, value, unit, valueClassName, caption }) => (
          <div key={label} className="border-t border-[#e6e9ee] py-4">
            <dt className="text-[12.5px] text-[#5c6672]">{label}</dt>
            <dd className="mt-2.5">
              <span
                className={`mono text-[26px] leading-none font-semibold ${valueClassName}`}
              >
                {value}
              </span>
              <span className="ml-1 text-[13px] text-[#6b7280]">{unit}</span>
              <span className="mt-2.5 block text-[11.5px] leading-[1.5] text-[#6b7280]">
                {caption}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
