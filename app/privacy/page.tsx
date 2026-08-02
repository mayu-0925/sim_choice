import type { Metadata } from "next";
import Header from "@/components/Header";
import AlertBar from "@/components/AlertBar";
import Footer from "@/components/Footer";
import { siteAlert } from "@/lib/data";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "格安SIMえらびナビのプライバシーポリシーについてご説明します。",
  alternates: { canonical: "https://www.sim-choice.jp/privacy/" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <AlertBar alert={siteAlert} />
      <main>
        <section className="bg-gradient-to-br from-gray-700 to-gray-900 text-white py-10 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-black mb-2">プライバシーポリシー</h1>
            <p className="text-sm opacity-75">Privacy Policy</p>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

            <p>格安SIMえらびナビ編集部（以下、当編集部）が運営する「格安SIMえらびナビ」（以下、当サイト）は、ユーザーの個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。</p>

            <div>
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-3">収集する情報</h2>
              <p>当サイトでは、お問い合わせフォームをご利用の際に、お名前・メールアドレスなどの個人情報をご提供いただく場合があります。また、アクセス解析ツール（Google アナリティクス）により、IPアドレス・ブラウザ情報・閲覧ページなどのアクセスログを自動的に収集しています。</p>
            </div>

            <div>
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-3">情報の利用目的</h2>
              <p>収集した個人情報は、以下の目的にのみ利用します。</p>
              <ul className="mt-2 space-y-1 list-none pl-0">
                {[
                  "お問い合わせへの返信・対応",
                  "サービスの改善・コンテンツの充実",
                  "不正アクセスの検知・防止",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-sky-400 font-black flex-shrink-0">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2">ご提供いただいた個人情報は、法令に基づく場合を除き、第三者に提供・開示することはありません。</p>
            </div>

            <div>
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-3">Cookie（クッキー）について</h2>
              <p>当サイトでは、ユーザー体験の向上およびアクセス解析のためにCookieを使用しています。Cookieはブラウザの設定により無効化することができますが、一部のサービスが正常に機能しなくなる場合があります。</p>
            </div>

            <div>
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-3">Google アナリティクスについて</h2>
              <p>当サイトはGoogleが提供するアクセス解析ツール「Google アナリティクス」を利用しています。Google アナリティクスはCookieを使用してデータを収集しますが、個人を特定する情報は含まれません。収集されたデータはGoogleのプライバシーポリシーに基づいて管理されます。</p>
              <p className="mt-2">Google アナリティクスのデータ収集を無効にする場合は、<a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-sky-500 underline">Google アナリティクス オプトアウト アドオン</a>をご利用ください。</p>
            </div>

            <div>
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-3">アフィリエイトプログラムについて</h2>
              <p>当サイトはアフィリエイトプログラムに参加しており、記事内のリンクを経由してサービスをお申し込みいただいた場合、当サイトに報酬が発生します。この際、アフィリエイト事業者が提供するトラッキングCookieが使用されることがあります。</p>
            </div>

            <div>
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-3">個人情報の管理・保護</h2>
              <p>当編集部は、収集した個人情報を適切に管理し、不正アクセス・紛失・漏洩・改ざんなどを防止するために必要な措置を講じます。個人情報の開示・訂正・削除をご希望の場合は、お問い合わせページよりご連絡ください。</p>
            </div>

            <div>
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-3">プライバシーポリシーの変更</h2>
              <p>当編集部は、法令の変更やサービス内容の変更に伴い、本プライバシーポリシーを予告なく改定することがあります。変更後のポリシーは、当ページに掲載した時点から効力を生じます。</p>
            </div>

            <div className="border-t border-gray-100 pt-6 text-xs text-gray-400">
              <p>運営者：格安SIMえらびナビ編集部</p>
              <p className="mt-1">制定日：2026年3月27日</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
