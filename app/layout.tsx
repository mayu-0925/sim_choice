import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

// TODO: 取得したドメインに変更してください
const BASE_URL = "https://www.sim-choice.jp";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "格安SIMえらびナビ | 格安SIM・スマホ料金 比較・ランキング",
    template: "%s | 格安SIMえらびナビ",
  },
  description:
    "格安SIMを料金・データ量・回線品質でわかりやすく比較。IIJmio・楽天モバイル・mineo・UQ mobileなどのおすすめランキングを毎月更新しています。",
  keywords: ["格安SIM", "MVNO", "スマホ料金", "比較", "ランキング", "おすすめ", "IIJmio", "楽天モバイル"],
  authors: [{ name: "格安SIMえらびナビ編集部" }],
  creator: "格安SIMえらびナビ編集部",
  publisher: "格安SIMえらびナビ",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: BASE_URL,
    siteName: "格安SIMえらびナビ",
    title: "格安SIMえらびナビ | 格安SIM・スマホ料金 比較・ランキング",
    description:
      "格安SIMを料金・データ量・回線品質でわかりやすく比較。IIJmio・楽天モバイル・mineo・UQ mobileなどのおすすめランキングを毎月更新しています。",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "格安SIMえらびナビ | 格安SIM・スマホ料金 比較・ランキング",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "格安SIMえらびナビ | 格安SIM・スマホ料金 比較・ランキング",
    description:
      "格安SIMを料金・データ量・回線品質でわかりやすく比較。IIJmio・楽天モバイル・mineo・UQ mobileなどのおすすめランキングを毎月更新しています。",
    images: ["/og-default.png"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "格安SIMえらびナビ",
      description:
        "格安SIMを料金・データ量・回線品質でわかりやすく比較するメディア",
      inLanguage: "ja",
      publisher: { "@id": `${BASE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "格安SIMえらびナビ編集部",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icon`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-XXXXXXXXXX');`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
