import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// TODO: 取得したドメインに変更してください
const BASE_URL = "https://www.sim-choice.jp";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
