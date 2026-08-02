import Link from "next/link";
import type { RankingItem, Article } from "@/lib/types";

type Props = {
  rankingItems: RankingItem[];
  relatedArticles: Article[];
};

export default function ArticleSidebar({ rankingItems, relatedArticles }: Props) {
  return (
    <aside className="space-y-6">
      {/* おすすめランキング */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-sky-400 to-pink-400 px-5 py-3">
          <h2 className="text-white font-black text-sm">🏆 おすすめ回線ランキング</h2>
        </div>
        <div className="p-4 space-y-3">
          {rankingItems.map((item) => (
            <div
              key={item.rank}
              className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-sky-50 transition-colors"
            >
              {/* Rank badge */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0 ${item.badgeGradient}`}
              >
                {item.rank}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-black text-gray-800 text-sm truncate">
                  {item.name}
                </div>
                <div className="text-xs text-gray-500">{item.price}</div>
              </div>

              {/* CTA */}
              <Link
                href={item.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={`text-white font-bold px-3 py-1.5 rounded-xl text-xs whitespace-nowrap pop-btn transition-colors ${item.ctaColor}`}
              >
                公式へ
              </Link>
            </div>
          ))}

          <Link
            href="/ranking"
            className="block text-center text-xs text-sky-500 font-bold hover:underline pt-1"
          >
            全ランキングを見る →
          </Link>
        </div>
      </div>

      {/* 診断バナー */}
      <Link
        href="/diagnosis"
        className="block bg-gradient-to-br from-purple-500 to-pink-400 rounded-3xl p-5 text-white text-center hover:opacity-90 transition-opacity pop-btn"
      >
        <div className="text-3xl mb-2">🔍</div>
        <div className="font-black text-base mb-1">無料で回線診断</div>
        <div className="text-xs opacity-90 mb-3">
          3問答えるだけで最適な回線がわかる！
        </div>
        <div className="bg-white text-purple-600 font-black text-sm px-5 py-2 rounded-2xl inline-block">
          診断スタート →
        </div>
      </Link>

      {/* 比較表バナー */}
      <Link
        href="/compare"
        className="block bg-gradient-to-br from-blue-400 to-cyan-400 rounded-3xl p-5 text-white text-center hover:opacity-90 transition-opacity pop-btn"
      >
        <div className="text-3xl mb-2">📊</div>
        <div className="font-black text-base mb-1">回線を一覧で比較</div>
        <div className="text-xs opacity-90 mb-3">
          料金・速度・特典を横並びでチェック
        </div>
        <div className="bg-white text-blue-600 font-black text-sm px-5 py-2 rounded-2xl inline-block">
          比較表を見る →
        </div>
      </Link>

      {/* 関連記事 */}
      {relatedArticles.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-5 py-3">
            <h2 className="text-white font-black text-sm">📰 関連記事</h2>
          </div>
          <div className="p-4 space-y-3">
            {relatedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <span className="text-2xl shrink-0">{article.emoji}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-700 leading-snug group-hover:text-sky-500 transition-colors line-clamp-2">
                    {article.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {article.publishedAt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
