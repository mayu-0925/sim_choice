import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import AlertBar from "@/components/AlertBar";
import Footer from "@/components/Footer";
import StickyBottomCTA from "@/components/StickyBottomCTA";
import ArticleBody from "@/components/ArticleBody";
import ArticleSidebar from "@/components/ArticleSidebar";
import AuthorProfile from "@/components/AuthorProfile";
import CTABanner from "@/components/CTABanner";
import Link from "next/link";
import { siteAlert, SITE_NAME, BASE_URL } from "@/lib/data";
import { getAllArticles, getArticleBySlug, getAllSlugs } from "@/lib/articles";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

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
      authors: [`${SITE_NAME}編集部`],
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: ["/og-default.png"],
    },
  };
}

const categoryBadgeClass = {
  orange: "bg-red-100 text-red-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
} as const;

const cardGradient = {
  orange: "from-red-50 to-orange-50",
  blue: "from-blue-50 to-indigo-50",
  green: "from-green-50 to-teal-50",
} as const;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const content = article.content ?? null;
  const allArticles = getAllArticles();
  const recentArticles = allArticles.filter((a) => a.slug !== slug);

  const articleUrl = `${BASE_URL}/blog/${slug}/`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": articleUrl,
    url: articleUrl,
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Organization", name: `${SITE_NAME}編集部`, url: BASE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: BASE_URL },
    inLanguage: "ja",
    isPartOf: { "@id": `${BASE_URL}/#website` },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "トップ", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "記事一覧", item: `${BASE_URL}/blog/` },
      { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
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
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryBadgeClass[article.categoryColor]}`}>
              {article.category}
            </span>
            <h1 className="text-2xl font-black text-gray-800 mt-3 leading-tight max-w-2xl mx-auto">
              {article.title}
            </h1>
            <p className="text-gray-500 text-sm mt-3">{article.excerpt}</p>
            <div className="flex items-center justify-center gap-3 mt-4 text-xs text-gray-400">
              <span>📅 {article.publishedAt}</span>
              {article.updatedAt && (
                <>
                  <span>·</span>
                  <span>🔄 更新: {article.updatedAt}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="max-w-5xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1 text-xs text-gray-400">
            <Link href="/" className="hover:text-red-500 transition-colors">トップ</Link>
            <span>›</span>
            <Link href="/blog/" className="hover:text-red-500 transition-colors">記事一覧</Link>
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
                <ArticleBody blocks={content} />
              ) : (
                <div className="bg-yellow-50 border-2 border-dashed border-yellow-300 rounded-2xl p-8 text-center">
                  <span className="text-4xl block mb-3">🚧</span>
                  <p className="text-gray-600 font-bold">この記事は準備中です</p>
                  <p className="text-sm text-gray-400 mt-1">もうしばらくお待ちください</p>
                </div>
              )}

              <AuthorProfile />

              <div className="mt-8">
                <CTABanner />
              </div>

              <div className="text-center mt-6">
                <Link href="/blog/" className="text-red-500 font-bold text-sm hover:underline">
                  記事一覧をもっと見る →
                </Link>
              </div>
            </div>

            {/* サイドバー */}
            <div className="lg:sticky lg:top-20">
              <ArticleSidebar recentArticles={recentArticles} currentSlug={slug} />
            </div>

          </div>
        </div>
      </main>
      <Footer />
      <StickyBottomCTA />
    </>
  );
}
