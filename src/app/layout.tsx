import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import GlobalNav from "@/widgets/global-nav/ui/GlobalNav";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  title: "Ember Client",
  description: "Next.js client for Ember",
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
        <GlobalNav />
        {children}
      </body>
    </html>
  );
}
