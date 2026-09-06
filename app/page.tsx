import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AlertBar from "@/components/AlertBar";
import ArticleCard from "@/components/ArticleCard";
import CTABanner from "@/components/CTABanner";
import StickyBottomCTA from "@/components/StickyBottomCTA";
import { getLatestArticles } from "@/lib/articles";
import { SITE_NAME, RAKUTEN, RAKUTEN_AFFILIATE_URL, siteAlert, CATEGORIES } from "@/lib/data";
import { currentYearMonth } from "@/lib/date";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.sim-choice.jp/" },
};

const CATEGORY_EMOJI: Record<string, string> = {
  plan: "💰",
  campaign: "🎁",
  guide: "📖",
  review: "⭐",
  trouble: "🔧",
};

export default function HomePage() {
  const articles = getLatestArticles(6);

  return (
    <>
      <Header />
      <AlertBar alert={siteAlert} />
      <main>
        {/* Hero */}
        <section
          className="py-14 px-4"
          style={{ background: "linear-gradient(160deg, #fff1f2 0%, #ffe4e6 40%, #fef3c7 100%)" }}
        >
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block bg-white rounded-2xl px-4 py-2 shadow-sm mb-6">
              <p className="text-sm text-gray-600">
                📱 {currentYearMonth()} 最新版 — 楽天モバイル専門メディア
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
              楽天モバイルで<br />
              <span className="text-red-500">月々の通信費を大幅節約</span>
            </h1>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
              データ無制限でも月3,278円。縛りなし・解約金なしで気軽に試せる。
              乗り換え前の疑問を実測データと体験談で解決します。
            </p>
            <Link
              href={RAKUTEN_AFFILIATE_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-black px-8 py-4 rounded-xl text-lg transition-colors"
            >
              楽天モバイルに申し込む →
            </Link>
            <p className="text-xs text-gray-500 mt-3">{RAKUTEN.contract}</p>
          </div>
        </section>

        {/* スペック */}
        <section className="max-w-5xl mx-auto px-4 py-10">
          <h2 className="text-xl font-black text-gray-900 mb-5">楽天モバイル 基本スペック</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "3GBまで", value: "¥1,078/月" },
              { label: "データ無制限", value: "¥3,278/月" },
              { label: "最大還元ポイント", value: `${RAKUTEN.maxReward}pt` },
              { label: "縛り・解約金", value: "なし" },
            ].map((s) => (
              <div key={s.label} className="border border-slate-200 rounded-xl p-4 text-center">
                <p className="text-red-500 font-black text-2xl">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* カテゴリ */}
        <section className="max-w-5xl mx-auto px-4 pb-10">
          <h2 className="text-xl font-black text-gray-900 mb-5">カテゴリから探す</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/blog/?category=${cat.slug}`}
                className="group flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 hover:border-red-400 hover:bg-red-50 transition-all"
              >
                <span className="text-xl">{CATEGORY_EMOJI[cat.slug] ?? "📄"}</span>
                <span className="font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-4 pb-10">
          <CTABanner />
        </section>

        {/* 記事一覧 */}
        {articles.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 pb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-gray-900">📰 新着記事</h2>
              <Link href="/blog/" className="text-red-500 text-sm font-bold hover:underline">
                もっと見る →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
      <StickyBottomCTA />
    </>
  );
}
