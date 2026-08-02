import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import AlertBar from "@/components/AlertBar";
import Footer from "@/components/Footer";
import StickyBottomCTA from "@/components/StickyBottomCTA";
import CompareClient from "./CompareClient";
import { siteAlert, rankingItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "格安SIM 比較表",
  description:
    "格安SIMの料金・データ量・回線・キャンペーンを一覧で比較。自分に合ったSIMをかんたんに見つけられます。",
  alternates: { canonical: "https://www.sim-choice.jp/compare/" },
};


export default function ComparePage() {
  const featuredItem = rankingItems[0];

  return (
    <>
      <Header />
      <AlertBar alert={siteAlert} />
      <main>
        {/* Page Hero */}
        <section className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white py-10 px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm font-bold bg-white/20 inline-block px-3 py-1 rounded-full mb-3">
              📊 一覧で比べる
            </p>
            <h1 className="text-3xl font-black mb-2">📱 格安SIM 比較表</h1>
            <p className="text-sm opacity-90">
              料金・データ量・回線を横並びで比較しました
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-10 px-4 bg-blue-50">
          <div className="max-w-5xl mx-auto">
            <CompareClient rankingItems={rankingItems} />

            {/* Popular comparisons */}
            <div className="mt-10">
              <h2 className="text-xl font-black text-gray-800 mb-4 text-center">
                🔥 よく見られている比較
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: "楽天モバイル vs IIJmio",
                    emoji: "⚡",
                    slug: "kakuyasu-sim-beginners-guide",
                    color: "bg-sky-50 border-sky-200",
                  },
                  {
                    title: "UQ mobile vs Y!mobile",
                    emoji: "📱",
                    slug: "kakuyasu-sim-beginners-guide",
                    color: "bg-blue-50 border-blue-200",
                  },
                  {
                    title: "LINEMO vs ahamo",
                    emoji: "🏆",
                    slug: "kakuyasu-sim-beginners-guide",
                    color: "bg-green-50 border-green-200",
                  },
                ].map((item) => (
                  <Link
                    key={item.title}
                    href={`/blog/${item.slug}`}
                    className={`block rounded-2xl border p-4 font-bold text-gray-700 hover:shadow-md transition-shadow ${item.color}`}
                  >
                    <span className="text-2xl mr-2">{item.emoji}</span>
                    {item.title}
                    <span className="text-sky-400 ml-2">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyBottomCTA featuredItem={featuredItem} />
    </>
  );
}
