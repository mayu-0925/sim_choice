import type { Metadata } from "next";
import Header from "@/components/Header";
import AlertBar from "@/components/AlertBar";
import Footer from "@/components/Footer";
import { siteAlert } from "@/lib/data";
import { getAllArticles } from "@/lib/articles";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "記事一覧",
  description:
    "格安SIMの比較・ランキング・お得情報・初心者向け解説など、格安SIM・MVNO選びに役立つ記事をまとめています。",
  alternates: { canonical: "https://www.sim-choice.jp/blog/" },
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <>
      <Header />
      <AlertBar alert={siteAlert} />
      <main>
        {/* Page Hero */}
        <section className="bg-gradient-to-br from-gray-700 to-gray-900 text-white py-10 px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm font-bold bg-white/20 inline-block px-3 py-1 rounded-full mb-3">
              📰 全記事
            </p>
            <h1 className="text-3xl font-black mb-2">記事一覧</h1>
            <p className="text-sm opacity-75">
              格安SIMの比較・お得情報・初心者ガイドをまとめています
            </p>
          </div>
        </section>

        <section className="py-10 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <BlogClient articles={articles} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
