import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import GlobalNav from "@/widgets/global-nav/ui/GlobalNav";
import { DispatchAnalysisProvider } from "@/entities/dispatch-analysis/model/DispatchAnalysisProvider";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: {
    default: "잉걸불 · AI 출동 의사결정 보조 시스템",
    template: "%s · 잉걸불",
  },
  description:
    "화재 신고 위치와 유형을 입력하면 골든타임 실패 확률, 추천 출동대, 필요 장비를 분석하는 AI 출동 의사결정 보조 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`h-full antialiased ${ibmPlexMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://dapi.kakao.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <DispatchAnalysisProvider>
          <GlobalNav />
          <div className="page-enter flex flex-1 flex-col">{children}</div>
        </DispatchAnalysisProvider>
      </body>
    </html>
  );
}
