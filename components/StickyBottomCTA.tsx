"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { RankingItem } from "@/lib/types";

export default function StickyBottomCTA({ featuredItem: _ }: { featuredItem: RankingItem }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-purple-200 py-3 px-4 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-gray-800">最適な回線がすぐわかる</p>
          <p className="text-xs text-purple-600 font-bold">✨ 無料・5問だけ</p>
        </div>
        <Link
          href="/diagnosis"
          className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-black py-3 px-5 rounded-2xl pop-btn transition-colors whitespace-nowrap flex-shrink-0"
        >
          無料で診断する →
        </Link>
      </div>
    </div>
  );
}
