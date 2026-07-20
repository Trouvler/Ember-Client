import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://ssh.gsmsv.site:25150/api/:path*",
      },
    ];
  },
};

export default nextConfig;
