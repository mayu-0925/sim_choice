"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE_NAME } from "@/lib/data";

const navLinks = [
  { href: "/blog/", label: "記事一覧" },
  { href: "/blog/?category=campaign", label: "キャンペーン" },
  { href: "/blog/?category=guide", label: "乗り換えガイド" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b-2 border-red-100 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <span className="text-3xl">📱</span>
          <div>
            <span className="text-lg font-black text-red-500">{SITE_NAME}</span>
            <div className="text-xs text-gray-400 leading-none">楽天モバイル専門メディア</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-4 text-sm font-bold">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-600 hover:text-red-500 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2 text-gray-600"
          aria-label="メニューを開く"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-red-100 px-4 py-3 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 font-bold py-2 border-b border-gray-100 hover:text-red-500 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
