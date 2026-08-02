import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 静的HTML書き出し（Xserver対応）
  trailingSlash: true, // /ranking → /ranking/index.html として生成（Apache対応）
  images: {
    unoptimized: true, // 静的書き出し時はNext.js画像最適化を無効化
  },
};

export default nextConfig;
