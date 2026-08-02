import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import AlertBar from "@/components/AlertBar";
import Footer from "@/components/Footer";
import StickyBottomCTA from "@/components/StickyBottomCTA";
import ArticleBody from "@/components/ArticleBody";
import ArticleSidebar from "@/components/ArticleSidebar";
import AuthorProfile from "@/components/AuthorProfile";
import Link from "next/link";
import { siteAlert, rankingItems } from "@/lib/data";
import { getAllArticles, getArticleBySlug, getAllSlugs } from "@/lib/articles";

type Props = {
  params: Promise<{ slug: string }>;
};

// 静的パス生成（ビルド時に全記事ページを生成）
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

const BASE_URL = "https://www.sim-choice.jp";

// メタデータ生成
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  const url = `${BASE_URL}/blog/${slug}/`;
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      authors: ["格安SIMえらびナビ編集部"],
      images: [
        {
          url: "/og-default.png",
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: ["/og-default.png"],
    },
  };
}

const categoryColorClass = {
  orange: "bg-sky-100 text-sky-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
} as const;

const cardGradient = {
  orange: "from-sky-100 to-red-100",
  blue: "from-blue-100 to-indigo-100",
  green: "from-green-100 to-teal-100",
} as const;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const content = article.content ?? null;
  const allArticles = getAllArticles();
  const relatedArticles = allArticles.filter((a) => a.slug !== slug).slice(0, 3);
  const featuredItem = rankingItems[0];

  const articleUrl = `${BASE_URL}/blog/${slug}/`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": articleUrl,
    url: articleUrl,
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "格安SIMえらびナビ編集部",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "格安SIMえらびナビ",
      url: BASE_URL,
    },
    inLanguage: "ja",
    isPartOf: { "@id": `${BASE_URL}/#website` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "トップ",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "記事一覧",
        item: `${BASE_URL}/blog/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <AlertBar alert={siteAlert} />
      <main className="pb-20 md:pb-0">
        {/* Article hero */}
        <div className={`bg-gradient-to-br ${cardGradient[article.categoryColor]} py-12 px-4`}>
          <div className="max-w-5xl mx-auto text-center">
            <span className="text-6xl block mb-4">{article.emoji}</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColorClass[article.categoryColor]}`}>
              {article.category}
            </span>
            <h1 className="text-2xl font-black text-gray-800 mt-3 leading-tight max-w-2xl mx-auto">
              {article.title}
            </h1>
            <p className="text-gray-500 text-sm mt-3">{article.excerpt}</p>
            <div className="flex items-center justify-center gap-3 mt-4 text-xs text-gray-400">
              <span>📅 {article.publishedAt}</span>
              <span>·</span>
              <span>🔄 自動更新</span>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1 text-xs text-gray-400">
            <Link href="/" className="hover:text-sky-500 transition-colors">トップ</Link>
            <span>›</span>
            <Link href="/blog" className="hover:text-sky-500 transition-colors">記事一覧</Link>
            <span>›</span>
            <span className="text-gray-600 truncate">{article.title}</span>
          </nav>
        </div>

        {/* 2カラムレイアウト */}
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

            {/* メインコンテンツ */}
            <div>
              {content ? (
                <ArticleBody blocks={content} rankingItems={rankingItems} />
              ) : (
                <div className="bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-2xl p-8 text-center">
                  <span className="text-4xl block mb-3">🚧</span>
                  <p className="text-gray-600 font-bold">この記事は準備中です</p>
                  <p className="text-sm text-gray-400 mt-1">もうしばらくお待ちください</p>
                </div>
              )}

              {/* 著者プロフィール */}
              <AuthorProfile />

              {/* 記事末尾のCTAバナー */}
              <div className="bg-sky-50 rounded-3xl p-5 border-2 border-sky-200 mt-8">
                <p className="text-sm font-bold text-gray-500 mb-3">📡 今月のおすすめ回線</p>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-lg font-black text-gray-800">🥇 {featuredItem.name}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {featuredItem.tags.map((tag) => (
                        <span key={tag.text} className="text-xs bg-sky-100 border border-sky-200 text-sky-700 px-2 py-0.5 rounded-full">
                          {tag.text}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href={featuredItem.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="bg-sky-400 hover:bg-sky-500 text-white font-black px-6 py-3 rounded-2xl pop-btn text-sm whitespace-nowrap transition-colors"
                  >
                    公式サイトを見る →
                  </Link>
                </div>
              </div>

              {/* 記事一覧リンク */}
              <div className="text-center mt-6">
                <Link href="/blog" className="text-sky-500 font-bold text-sm hover:underline">
                  記事一覧をもっと見る →
                </Link>
              </div>
            </div>

            {/* サイドバー（PC: 固定表示） */}
            <div className="lg:sticky lg:top-20">
              <ArticleSidebar rankingItems={rankingItems} relatedArticles={relatedArticles} />
            </div>

          </div>
        </div>
      </main>
      <Footer />
      <StickyBottomCTA featuredItem={featuredItem} />
    </>
  );
}
