import type { NextConfig } from "next";

// NEXT_PUBLIC_ 접두어를 붙이지 않는다 — 브라우저가 http 백엔드를 직접 호출하면
// HTTPS 페이지에서 mixed content로 차단된다. 이 URL은 서버 사이드 rewrite에서만 쓴다.
// 미설정 시 CI 빌드가 멈추지 않도록 기본값을 둔다.
const API_BASE_URL = process.env.API_BASE_URL ?? "http://ssh.gsmsv.site:25150";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/health",
        destination: `${API_BASE_URL}/health`,
      },
      {
        source: "/api/:path*",
        destination: `${API_BASE_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
