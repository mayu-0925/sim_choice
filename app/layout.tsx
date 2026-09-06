import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { SITE_NAME, BASE_URL } from "@/lib/data";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${SITE_NAME} | 料金・速度・キャンペーンを実測データで解説`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "楽天モバイルの料金・速度・キャンペーンを実測データと体験談で解説。乗り換え前の疑問をすべて解決する楽天モバイル専門メディアです。",
  keywords: ["楽天モバイル", "乗り換え", "料金", "速度", "キャンペーン", "ポイント", "MNP"],
  authors: [{ name: `${SITE_NAME}編集部` }],
  creator: `${SITE_NAME}編集部`,
  publisher: SITE_NAME,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: BASE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | 料金・速度・キャンペーンを実測データで解説`,
    description:
      "楽天モバイルの料金・速度・キャンペーンを実測データと体験談で解説。乗り換え前の疑問をすべて解決する楽天モバイル専門メディアです。",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | 料金・速度・キャンペーンを実測データで解説`,
    description: "楽天モバイルの料金・速度・キャンペーンを実測データと体験談で解説。",
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
      name: SITE_NAME,
      description: "楽天モバイルへの乗り換えを検討している方向けの専門メディア",
      inLanguage: "ja",
      publisher: { "@id": `${BASE_URL}/#organization` },
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: `${SITE_NAME}編集部`,
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/icon` },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
