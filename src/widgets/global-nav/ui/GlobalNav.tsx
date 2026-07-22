"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItem {
  label: string;
  href: string;
  isActive: (pathname: string) => boolean;
}

function isIncidentDetailPath(pathname: string) {
  return pathname.startsWith("/analysis/") && pathname !== "/analysis/new";
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "상황 대시보드",
    href: "/dashboard",
    isActive: (pathname) => pathname === "/dashboard",
  },
  {
    label: "신고 분석",
    href: "/analysis/new",
    isActive: (pathname) =>
      pathname === "/analysis/new" || isIncidentDetailPath(pathname),
  },
  {
    label: "출동 이력",
    href: "/analysis",
    isActive: (pathname) => pathname === "/analysis",
  },
  {
    label: "통계",
    href: "/dashboard/policy",
    isActive: (pathname) => pathname === "/dashboard/policy",
  },
];

function formatClock(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

export default function GlobalNav() {
  const pathname = usePathname();
  const isPublic = pathname === "/dashboard/policy";
  const showClock = pathname === "/dashboard" || isIncidentDetailPath(pathname);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    if (!showClock) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [showClock]);

  return (
    <header className="border-b border-[#edeff2] bg-white">
      <div className="flex h-[60px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-[30px]">
          <Link href="/" className="flex shrink-0 items-baseline gap-[9px]">
            <span className="text-xl font-bold tracking-[-0.03em] text-ember">
              잉걸불
            </span>
            <span className="hidden text-[11.5px] font-medium text-[#adb3bd] sm:inline">
              AI 출동 의사결정 보조 시스템
            </span>
          </Link>
          <nav className="flex items-center gap-3 overflow-x-auto text-sm whitespace-nowrap sm:gap-[26px]">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  item.isActive(pathname)
                    ? "font-bold text-[#191f28]"
                    : "font-medium text-[#8b909a]"
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-[13px] text-[12.5px]">
          {isPublic ? (
            <span className="text-[#adb3bd]">대국민 공개</span>
          ) : (
            <>
              {showClock && now ? (
                <>
                  <span className="mono hidden text-[#adb3bd] sm:inline">
                    {formatClock(now)}
                  </span>
                  <span className="hidden text-[#e6e9ee] sm:inline">|</span>
                </>
              ) : null}
              <span className="hidden font-medium text-[#4e5560] sm:inline">
                김선우 관제사
              </span>
              <a href="#" className="text-[#adb3bd]">
                로그아웃
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
