import type { Metadata } from "next";
import Header from "@/components/Header";
import AlertBar from "@/components/AlertBar";
import Footer from "@/components/Footer";
import { siteAlert } from "@/lib/data";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "格安SIMえらびナビへのお問い合わせはこちらからどうぞ。",
  alternates: { canonical: "https://www.sim-choice.jp/contact/" },
  robots: { index: false },
};

// メールアドレスをSVG画像として返す（スパム対策）
function EmailImage() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="36">
      <rect width="220" height="36" rx="8" fill="#fff7ed" stroke="#fed7aa" stroke-width="1.5"/>
      <text
        x="110" y="24"
        font-family="monospace, Courier New"
        font-size="14"
        font-weight="bold"
        fill="#c2410c"
        text-anchor="middle"
        letter-spacing="0.5"
      >info@sim-choice.jp</text>
    </svg>
  `.trim();

  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUri}
      alt="お問い合わせ先メールアドレス"
      width={220}
      height={36}
      draggable={false}
    />
  );
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <AlertBar alert={siteAlert} />
      <main>
        <section className="bg-gradient-to-br from-gray-700 to-gray-900 text-white py-10 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-black mb-2">お問い合わせ</h1>
            <p className="text-sm opacity-75">Contact</p>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-2xl mx-auto space-y-6">

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                格安SIMえらびナビへのお問い合わせは、下記メールアドレスまでご連絡ください。内容を確認のうえ、3営業日以内にご返信いたします。
              </p>

              {/* メールアドレス（SVG画像） */}
              <div className="bg-gray-50 rounded-xl p-5 flex flex-col items-center gap-3">
                <p className="text-xs text-gray-500 font-bold">メールアドレス</p>
                <EmailImage />
                <p className="text-xs text-gray-400">
                  ※ スパム対策のため画像で表示しています
                </p>
              </div>
            </div>

            {/* 注意事項 */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-4">お問い合わせ前にご確認ください</h2>
              <ul className="space-y-3 text-sm text-gray-700">
                {[
                  "ご返信は3営業日以内を目安としています。お急ぎの場合はご了承ください。",
                  "掲載情報の誤りや古い情報にお気づきの場合は、具体的なページURLとあわせてお知らせください。",
                  "掲載回線・プランへの直接のお申し込みやサポートは、各通信事業者の公式窓口にお問い合わせください。",
                  "営業・提携に関するご連絡もお気軽にどうぞ。",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-sky-400 font-black flex-shrink-0 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
