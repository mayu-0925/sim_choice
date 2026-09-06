import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { RAKUTEN, RAKUTEN_AFFILIATE_URL, CATEGORIES } from "@/lib/data";

const CATEGORY_EMOJI: Record<string, string> = {
  plan: "💰", campaign: "🎁", guide: "📖", review: "⭐", trouble: "🔧",
};

type Props = {
  recentArticles: Article[];
  currentSlug?: string;
};

export default function ArticleSidebar({ recentArticles, currentSlug }: Props) {
  const recent = recentArticles.filter((a) => a.slug !== currentSlug).slice(0, 5);

  return (
    <aside className="space-y-6">
      {/* CTA */}
      <div className="bg-gray-900 rounded-2xl p-5 text-white">
        <p className="text-xs text-red-400 font-bold mb-1">📱 編集部イチオシ</p>
        <p className="font-black text-base mb-1">{RAKUTEN.name}</p>
        <p className="text-xs text-gray-400 mb-3">{RAKUTEN.planUnlimited.label} {RAKUTEN.planUnlimited.price} / {RAKUTEN.contract}</p>
        <Link
          href={RAKUTEN_AFFILIATE_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="block bg-red-500 hover:bg-red-600 text-white font-black py-2.5 rounded-xl text-center text-sm transition-colors"
        >
          公式サイトへ →
        </Link>
        <p className="text-xs text-gray-500 text-center mt-2">最大{RAKUTEN.maxReward}ptポイント還元中</p>
      </div>

      {/* 新着記事 */}
      {recent.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-900 px-4 py-3">
            <h2 className="text-white font-black text-sm">📰 新着記事</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recent.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}/`}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 relative">
                  {article.thumbnail ? (
                    <Image src={article.thumbnail} alt={article.title} fill className="object-cover" sizes="56px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      {article.emoji}
                    </div>
                  )}
                </div>
                <p className="text-xs font-bold text-gray-700 leading-snug line-clamp-3">{article.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* カテゴリ */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <h2 className="font-black text-sm text-gray-800 mb-3">カテゴリ</h2>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/?category=${cat.slug}`}
              className="flex items-center gap-2 py-1.5 text-sm text-gray-600 hover:text-red-500 transition-colors"
            >
              <span>{CATEGORY_EMOJI[cat.slug] ?? "📄"}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
