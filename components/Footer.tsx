import Link from "next/link";
import { currentYear } from "@/lib/date";

const footerLinks = [
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/disclaimer", label: "免責事項" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/about", label: "運営者情報" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-8 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <div className="text-2xl mb-2">📱</div>
        <span className="font-black text-white">格安SIMえらびナビ</span>
        <p className="text-xs mt-2 mb-4">
          格安SIMをわかりやすく比較するメディアです
        </p>
        <div className="flex justify-center flex-wrap gap-4 text-xs">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-4">
          © {currentYear()} 格安SIMえらびナビ All rights reserved.
        </p>
        <p className="text-xs text-gray-600 mt-2">
          ※ 当サイトはアフィリエイト広告を利用しています。
        </p>
      </div>
    </footer>
  );
}
