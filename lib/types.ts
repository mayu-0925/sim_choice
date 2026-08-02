export type RankingItem = {
  rank: number;
  name: string;
  label: string;
  description: string;
  speed: string;
  price: string;
  tags: { text: string; variant: "cool" | "warm" | "green" }[];
  reward: { label: string; value: string };
  affiliateUrl: string;
  ctaColor: string; // Tailwind bg class e.g. "bg-orange-400 hover:bg-orange-500"
  badgeGradient: string; // Tailwind gradient class
};

// 記事本文のコンテンツブロック
export type ContentBlock =
  | { type: "heading2"; text: string }
  | { type: "heading3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; emoji: string; text: string }
  | { type: "ranking_cta"; rankIndex: number } // rankingItems[rankIndex] を表示
  | { type: "table"; headers: string[]; rows: string[][] } // 比較表
  | { type: "bar_chart"; title: string; items: { label: string; value: number; unit: string; color: string }[] } // 棒グラフ
  | { type: "steps"; items: { title: string; description: string }[] } // 手順ステップ
  | { type: "definition_list"; items: { term: string; description: string }[] } // 用語：説明 形式
  | { type: "related_articles"; items: { slug: string; title: string }[] } // 関連記事リンク
  | { type: "editorial_note"; text: string }; // 編集部の体験・実測コメント

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: "orange" | "blue" | "green";
  emoji: string;
  publishedAt: string;
  updatedAt?: string; // 最終リライト日（自動更新）
  thumbnail?: string; // サムネイル画像パス（例: /thumbnails/slug.jpg）
  content?: ContentBlock[]; // 本文（未設定の場合は「準備中」表示）
};

export type SiteAlert = {
  message: string;
  linkText: string;
  linkHref: string;
};

export type HeroStat = {
  value: string;
  label: string;
  color: string; // Tailwind text class
};

export type HowToStep = {
  step: number;
  emoji: string;
  title: string;
  description: string;
  bgColor: string;
  stepColor: string;
};
