import type { Metadata } from "next";
import Header from "@/components/Header";
import AlertBar from "@/components/AlertBar";
import Footer from "@/components/Footer";
import { siteAlert } from "@/lib/data";

export const metadata: Metadata = {
  title: "免責事項",
  description: "格安SIMえらびナビの免責事項についてご説明します。",
  alternates: { canonical: "https://www.sim-choice.jp/disclaimer/" },
  robots: { index: false },
};

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <AlertBar alert={siteAlert} />
      <main>
        <section className="bg-gradient-to-br from-gray-700 to-gray-900 text-white py-10 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-black mb-2">免責事項</h1>
            <p className="text-sm opacity-75">Disclaimer</p>
          </div>
        </section>

        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

            <div>
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-3">掲載情報の正確性について</h2>
              <p>当サイト「格安SIMえらびナビ」（以下、当サイト）に掲載している料金・速度・キャンペーン内容などの情報は、各通信事業者の公式発表をもとに作成しています。ただし、料金やキャンペーン内容は予告なく変更されることがあるため、最新情報は必ず各社の公式サイトにてご確認ください。</p>
              <p className="mt-2">当サイトの情報が最新・正確であることを保証するものではなく、掲載内容によって生じたいかなる損害についても、当サイト運営者は責任を負いません。</p>
            </div>

            <div>
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-3">アフィリエイト広告について</h2>
              <p>当サイトは、Amazon アソシエイト・プログラムおよびその他のアフィリエイトプログラムに参加しています。記事内のリンクから商品・サービスをご購入・お申し込みいただいた場合、当サイトに報酬が発生することがあります。</p>
              <p className="mt-2">ただし、掲載する情報やランキングはアフィリエイト報酬の有無に関わらず、読者にとって有益な情報を提供することを第一に作成しています。報酬が情報の公平性や正確性を損なうことはありません。</p>
            </div>

            <div>
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-3">リンク先サイトについて</h2>
              <p>当サイトに掲載されている外部リンク先のコンテンツ・サービスについて、当サイトは一切の責任を負いません。リンク先サービスをご利用になる際は、各サービスの利用規約・プライバシーポリシーをご確認ください。</p>
            </div>

            <div>
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-3">著作権について</h2>
              <p>当サイトに掲載されているテキスト・画像・デザインなどのコンテンツの著作権は、当サイト運営者に帰属します。無断での転載・複製・改変はご遠慮ください。引用する場合は、出典として当サイトの名称とURLを明記してください。</p>
            </div>

            <div>
              <h2 className="text-base font-black text-gray-800 border-l-4 border-sky-400 pl-3 mb-3">免責事項の変更について</h2>
              <p>当サイトは、必要に応じて予告なく本免責事項を変更することがあります。変更後の免責事項は、当ページに掲載した時点から効力を生じるものとします。</p>
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
