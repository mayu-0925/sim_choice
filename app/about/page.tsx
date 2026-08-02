import type { Metadata } from "next";
import Header from "@/components/Header";
import AlertBar from "@/components/AlertBar";
import Footer from "@/components/Footer";
import { siteAlert } from "@/lib/data";

export const metadata: Metadata = {
  title: "運営者情報",
  description: "格安SIMえらびナビの運営者情報をご紹介します。",
  alternates: { canonical: "https://www.sim-choice.jp/about/" },
};

const info = [
  { label: "サイト名", value: "格安SIMえらびナビ" },
  { label: "サイトURL", value: "https://www.sim-choice.jp" },
  { label: "運営者", value: "格安SIMえらびナビ編集部" },
  { label: "設立", value: "2026年3月" },
  { label: "事業内容", value: "格安SIM（MVNO）の比較・紹介メディアの運営" },
  { label: "収益モデル", value: "アフィリエイト広告収入" },
  { label: "お問い合わせ", value: "お問い合わせページよりご連絡ください" },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <AlertBar alert={siteAlert} />
      <main>
        <section className="bg-gradient-to-br from-gray-700 to-gray-900 text-white py-10 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-black mb-2">運営者情報</h1>
            <p className="text-sm opacity-75">About Us</p>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* サイト概要 */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">📱</span>
                <div>
                  <div className="font-black text-gray-800 text-lg">格安SIMえらびナビ</div>
                  <div className="text-xs text-gray-500">格安SIM（MVNO）をわかりやすく比較するメディア</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                格安SIMえらびナビは、IIJmio・楽天モバイル・mineo・UQ mobileなど格安SIM（MVNO）の比較情報を提供するメディアです。料金・データ量・回線品質・キャンペーンなど多角的な視点から情報を整理し、読者が自分に合った格安SIMを選べるようサポートすることを目的としています。
              </p>
            </div>

            {/* 基本情報 */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-5">基本情報</h2>
              <dl className="space-y-3">
                {info.map(({ label, value }) => (
                  <div key={label} className="flex gap-4 text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <dt className="w-32 flex-shrink-0 font-bold text-gray-500">{label}</dt>
                    <dd className="text-gray-700">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* 編集方針 */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-4">編集方針</h2>
              <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                <p>当サイトは、格安SIM選びに迷っている方が、正確な情報をもとに納得して乗り換えできるよう、以下の方針のもとコンテンツを作成しています。</p>
                <ul className="space-y-2 mt-3">
                  {[
                    "各通信事業者の公式情報をもとに、正確な料金・速度・サービス内容を掲載する",
                    "アフィリエイト報酬の有無に関わらず、読者にとって有益な情報を公平に提供する",
                    "専門用語にはわかりやすい補足を加え、初心者の方でも理解しやすい文章を心がける",
                    "情報は定期的に見直し、古くなったデータは速やかに更新する",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-sky-400 font-black flex-shrink-0 mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* アフィリエイト表記 */}
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-6 text-sm text-gray-700 leading-relaxed">
              <p className="font-bold text-sky-600 mb-2">📢 広告表記</p>
              <p>当サイトはアフィリエイト広告を利用しています。記事内のリンクを経由してサービスをお申し込みいただいた場合、当サイトに報酬が発生することがあります。これにより読者の方への費用が増えることはありません。</p>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
