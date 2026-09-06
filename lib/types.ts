export type ContentBlock =
  | { type: "heading2"; text: string }
  | { type: "heading3"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; emoji: string; text: string }
  | { type: "cta_banner"; title: string; description?: string; buttonText?: string }
  | { type: "steps"; items: { title: string; description: string }[] }
  | { type: "definition_list"; items: { term: string; description: string }[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "bar_chart"; title: string; items: { label: string; value: number; unit: string; color: string }[] }
  | { type: "related_articles"; items: { slug: string; title: string }[] }
  | { type: "faq"; items: { question: string; answer: string }[] }
  | { type: "experience"; text: string; result?: string }
  | { type: "editorial_note"; text: string }
  // 旧ブロック（既存記事との互換用）
  | { type: "service_cta"; serviceIndex: number }
  | { type: "ranking_cta"; rankIndex: number };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: "orange" | "blue" | "green";
  emoji: string;
  publishedAt: string;
  updatedAt?: string;
  thumbnail?: string;
  content?: ContentBlock[];
};

export type SiteAlert = {
  message: string;
  linkText: string;
  linkHref: string;
};
