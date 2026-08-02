import Link from "next/link";
import ArticleCard from "./ArticleCard";
import type { Article } from "@/lib/types";

type Props = {
  articles: Article[];
};

export default function LatestArticles({ articles }: Props) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-800">📰 新着記事</h2>
          <Link
            href="/blog"
            className="text-sky-500 text-sm font-bold hover:underline"
          >
            もっと見る →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
