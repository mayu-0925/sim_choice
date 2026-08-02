import fs from "fs";
import path from "path";
import type { Article } from "./types";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

// 全記事を取得（公開日の新しい順）
export function getAllArticles(): Article[] {
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".json"));
  return files
    .map((f) => JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8")) as Article)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// slug で1記事を取得
export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

// 静的パス生成用（generateStaticParams で使用）
export function getAllSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}

// 最新N件を取得
export function getLatestArticles(limit = 6): Article[] {
  return getAllArticles().slice(0, limit);
}
