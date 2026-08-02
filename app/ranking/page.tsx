import type { Metadata } from "next";
import Header from "@/components/Header";
import AlertBar from "@/components/AlertBar";
import Footer from "@/components/Footer";
import StickyBottomCTA from "@/components/StickyBottomCTA";
import RankingCard from "@/components/RankingCard";
import { siteAlert, rankingItems } from "@/lib/data";
import { currentYearMonth } from "@/lib/date";

export const metadata: Metadata = {
  title: "格安SIM おすすめランキング",
  description:
    "2026年最新の格安SIMおすすめランキング7選。楽天モバイル・IIJmio・mineo・UQ mobile・Y!mobile・LINEMO・ahamoを料金・速度・キャンペーンで徹底比較。",
  alternates: { canonical: "https://www.sim-choice.jp/ranking/" },
};

const categories = [
  { label: "🏆 格安SIM", active: true },
  { label: "📶 大手キャリア系", active: false },
  { label: "💰 コスパ重視", active: false },
];

export default function RankingPage() {
  const featuredItem = rankingItems[0];

  return (
    <>
      <Header />
      <AlertBar alert={siteAlert} />
      <main>
        {/* Page Hero */}
        <section className="bg-gradient-to-br from-sky-400 to-pink-400 text-white py-10 px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm font-bold bg-white/20 inline-block px-3 py-1 rounded-full mb-3">
              📅 {currentYearMonth()} 最新版
            </p>
            <h1 className="text-3xl font-black mb-2">
              🏆 格安SIM おすすめランキング
            </h1>
            <p className="text-sm opacity-90">
              7社を料金・速度・キャンペーンで徹底比較しました
            </p>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="bg-white border-b border-gray-100 sticky top-[57px] z-30">
          <div className="max-w-5xl mx-auto px-4 flex gap-2 py-3 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.label}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                  cat.active
                    ? "bg-sky-400 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Ranking List */}
        <section className="py-10 px-4 bg-sky-50">
          <div className="max-w-5xl mx-auto">
            {/* Update info */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-gray-400">
                🔄 最終更新：{currentYearMonth()}
              </p>
              <p className="text-xs text-gray-400">
                編集部が実際に調査した情報をもとに作成
              </p>
            </div>

            <div className="space-y-5">
              {rankingItems.map((item) => (
                <RankingCard key={item.rank} item={item} />
              ))}
            </div>

            {/* Attention */}
            <div className="mt-8 bg-white rounded-2xl p-5 border border-gray-200 text-sm text-gray-500">
              <p className="font-bold text-gray-700 mb-2">📌 ランキングについて</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>料金・速度・キャンペーン・サポートを総合的に評価しています</li>
                <li>掲載情報は定期的に更新していますが、最新情報は各公式サイトをご確認ください</li>
                <li>当サイトはアフィリエイト広告を利用しています</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyBottomCTA featuredItem={featuredItem} />
    </>
  );
}
