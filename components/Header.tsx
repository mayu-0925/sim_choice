"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/ranking", label: "ランキング" },
  { href: "/compare", label: "比べる" },
  { href: "/beginners", label: "初心者向け" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b-2 border-sky-100 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <span className="text-3xl animate-float">📱</span>
          <div>
            <span className="text-xl font-black text-sky-500">
              格安SIMえらびナビ
            </span>
            <div className="text-xs text-gray-400 leading-none">
              かんたんSIM比較
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 text-sm font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-sky-500 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/diagnosis"
            className="bg-sky-400 hover:bg-sky-500 text-white px-4 py-2 rounded-full pop-btn font-bold text-sm transition-colors"
          >
            無料で診断 ✨
          </Link>
        </nav>

        {/* Mobile hamburger */}
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

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-sky-100 px-4 py-3 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 font-bold py-2 border-b border-gray-100 hover:text-sky-500 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/diagnosis"
            className="bg-sky-400 hover:bg-sky-500 text-white px-4 py-3 rounded-full pop-btn font-bold text-sm text-center transition-colors mt-1"
            onClick={() => setMenuOpen(false)}
          >
            無料で診断 ✨
          </Link>
        </nav>
      )}
    </header>
  );
}
