import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import AlertBar from "@/components/AlertBar";
import Footer from "@/components/Footer";
import StickyBottomCTA from "@/components/StickyBottomCTA";
import RankingCard from "@/components/RankingCard";
import { siteAlert, rankingItems } from "@/lib/data";

export const metadata: Metadata = {
  title: "はじめての格安SIM 初心者ガイド",
  description:
    "格安SIMが初めての方向けにわかりやすく解説。選び方・MNP乗り換え方法・よくある疑問をまとめました。",
  alternates: { canonical: "https://www.sim-choice.jp/beginners/" },
};

const steps = [
  {
    step: 1,
    emoji: "📱",
    title: "スマホの対応回線を確認する",
    desc: "SIMフリー端末かどうか、ドコモ・au・ソフトバンクどの回線に対応しているかを確認します。",
    color: "bg-sky-50 border-sky-200",
    stepColor: "bg-sky-400",
  },
  {
    step: 2,
    emoji: "📊",
    title: "月のデータ使用量を確認する",
    desc: "スマホの設定画面でデータ使用量を確認。3〜10GBが平均的です。使用量に合ったプランを選ぶのが節約のコツです。",
    color: "bg-blue-50 border-blue-200",
    stepColor: "bg-blue-400",
  },
  {
    step: 3,
    emoji: "💰",
    title: "料金・キャンペーンを比べる",
    desc: "月額料金だけでなく、キャッシュバックやポイント還元なども含めた総コストで比べるのがポイントです。",
    color: "bg-green-50 border-green-200",
    stepColor: "bg-green-400",
  },
  {
    step: 4,
    emoji: "📝",
    title: "MNPで乗り換える",
    desc: "番号を維持したまま乗り換えできます。現在のキャリアでMNP予約番号を取得して、新しいSIMに申し込みます。",
    color: "bg-purple-50 border-purple-200",
    stepColor: "bg-purple-400",
  },
];

const faqs = [
  {
    q: "格安SIMに変えると電話番号は変わりますか？",
    a: "MNP（番号ポータビリティ）を使えば、今の電話番号をそのまま引き継げます。手続きはオンラインで完結し、最短1〜2日で完了します。",
  },
  {
    q: "今のスマホはそのまま使えますか？",
    a: "SIMフリー端末であれば基本的に使えます。キャリアでロックがかかっている場合は、SIMロック解除の手続きが必要です（多くは無料でできます）。",
  },
  {
    q: "格安SIMは速度が遅くないですか？",
    a: "昼12時前後の混雑時間帯に速度が低下することがあります。ただし朝・夜は快適で、メール・SNS・動画視聴には十分な速度です。速度重視ならUQ mobileやY!mobileも選択肢です。",
  },
  {
    q: "契約期間の縛りはありますか？",
    a: "楽天モバイル・IIJmio・LINEMOなど多くの格安SIMは縛りなし・解約金0円です。いつでも乗り換えられるのが格安SIMの大きなメリットです。",
  },
  {
    q: "キャリアメールは使えなくなりますか？",
    a: "格安SIMに乗り換えると@docomo.ne.jpや@ezweb.ne.jpなどのキャリアメールは使えなくなります。GmailやYahooメールに切り替えることをおすすめします。",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function BeginnersPage() {
  const featuredItem = rankingItems[0];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />
      <AlertBar alert={siteAlert} />
      <main>
        {/* Page Hero */}
        <section className="bg-gradient-to-br from-green-400 to-teal-400 text-white py-10 px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm font-bold bg-white/20 inline-block px-3 py-1 rounded-full mb-3">
              📚 はじめての方へ
            </p>
            <h1 className="text-3xl font-black mb-2">
              🌱 初心者向け 格安SIMガイド
            </h1>
            <p className="text-sm opacity-90">
              むずかしい言葉なし！5分で格安SIMのすべてがわかります
            </p>
          </div>
        </section>

        {/* What is kakuyasu SIM */}
        <section className="py-10 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-gray-800 mb-2 text-center">
              💡 格安SIMってなに？
            </h2>
            <p className="text-center text-gray-500 text-sm mb-8">
              まずはざっくり理解しましょう
            </p>
            <div className="bg-green-50 rounded-3xl p-6 border border-green-200 text-gray-700 leading-relaxed">
              <p className="mb-3">
                格安SIM（MVNO）とは、<strong>ドコモ・au・ソフトバンクの回線を借りて</strong>、より安く提供するサービスです。
              </p>
              <p className="mb-3">
                大手キャリアと<strong>通信品質はほぼ変わらず</strong>、月額料金を大幅に節約できます。年間5〜10万円の節約も珍しくありません。
              </p>
              <p>
                申し込みは<strong>オンラインで完結</strong>し、スマホの電話番号もそのまま引き継げます。
              </p>
            </div>

            {/* Merit/Demerit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
                <h3 className="font-black text-blue-700 mb-3">
                  👍 メリット
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {[
                    "月額料金が大幅に安くなる",
                    "縛りなし・解約金0円が多い",
                    "番号はそのまま引き継げる",
                    "申し込みがオンラインで完結",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-sky-50 rounded-2xl p-5 border border-sky-200">
                <h3 className="font-black text-sky-700 mb-3">
                  👎 デメリット
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {[
                    "昼間の混雑時に速度が落ちる場合も",
                    "キャリアメールが使えなくなる",
                    "店舗サポートが少ない",
                    "SIMロック解除が必要な場合も",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5">!</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-10 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-gray-800 mb-2 text-center">
              📋 格安SIMの選び方 4ステップ
            </h2>
            <p className="text-center text-gray-500 text-sm mb-8">
              この順番で考えれば迷いません
            </p>
            <div className="space-y-4">
              {steps.map((s) => (
                <div
                  key={s.step}
                  className={`rounded-2xl border p-5 flex items-start gap-4 ${s.color}`}
                >
                  <div
                    className={`${s.stepColor} text-white font-black w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg`}
                  >
                    {s.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{s.emoji}</span>
                      <h3 className="font-black text-gray-800">{s.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommended */}
        <section className="py-10 px-4 bg-sky-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-black text-gray-800 mb-2 text-center">
              🏆 初心者に特におすすめの格安SIM
            </h2>
            <p className="text-center text-gray-500 text-sm mb-8">
              迷ったらまずここから検討しましょう
            </p>
            <RankingCard item={rankingItems[0]} />
          </div>
        </section>

        {/* FAQ */}
        <section className="py-10 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-gray-800 mb-2 text-center">
              ❓ よくある疑問
            </h2>
            <p className="text-center text-gray-500 text-sm mb-8">
              初めての方がよく気にする点をまとめました
            </p>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="rounded-2xl border border-gray-200 bg-gray-50 group"
                >
                  <summary className="flex items-center justify-between p-5 font-bold text-gray-800 cursor-pointer select-none">
                    <span className="flex items-center gap-2">
                      <span className="text-sky-400">Q.</span>
                      {faq.q}
                    </span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-200 pt-4">
                    <span className="text-green-500 font-bold mr-1">A.</span>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>

            {/* CTA to diagnosis */}
            <div className="mt-10 bg-gradient-to-r from-sky-400 to-pink-400 rounded-3xl p-6 text-white text-center">
              <p className="text-lg font-black mb-2">
                ✨ どの格安SIMが合うかまだ迷っている？
              </p>
              <p className="text-sm opacity-90 mb-4">
                5つの質問に答えるだけで、あなたにぴったりの格安SIMがわかります
              </p>
              <Link
                href="/diagnosis"
                className="inline-block bg-white text-sky-500 font-black px-8 py-3 rounded-2xl pop-btn hover:bg-sky-50 transition-colors"
              >
                無料で診断する →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <StickyBottomCTA featuredItem={featuredItem} />
    </>
  );
}
