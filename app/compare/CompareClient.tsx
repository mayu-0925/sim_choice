"use client";

import { useState } from "react";
import Link from "next/link";
import type { RankingItem } from "@/lib/types";

type Props = {
  rankingItems: RankingItem[];
};

const carriers = [
  { value: "all", label: "すべて", emoji: "📱" },
  { value: "docomo", label: "ドコモ系", emoji: "🔴" },
  { value: "au", label: "au系", emoji: "🟠" },
  { value: "softbank", label: "SB系", emoji: "🟡" },
  { value: "rakuten", label: "楽天回線", emoji: "🟣" },
];

// 回線系統ごとにおすすめ順を並び替え
function filterByCarrier(items: RankingItem[], carrier: string): RankingItem[] {
  if (carrier === "all") return items;
  const priority: Record<string, string[]> = {
    docomo: ["IIJmio", "ahamo", "mineo", "楽天モバイル", "LINEMO", "UQ mobile", "Y!mobile"],
    au: ["UQ mobile", "IIJmio", "mineo", "楽天モバイル", "Y!mobile", "LINEMO", "ahamo"],
    softbank: ["Y!mobile", "LINEMO", "mineo", "楽天モバイル", "IIJmio", "UQ mobile", "ahamo"],
    rakuten: ["楽天モバイル", "IIJmio", "mineo", "LINEMO", "UQ mobile", "Y!mobile", "ahamo"],
  };
  const order = priority[carrier] ?? [];
  return [...items].sort((a, b) => {
    const ai = order.indexOf(a.name);
    const bi = order.indexOf(b.name);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

export default function CompareClient({ rankingItems }: Props) {
  const [carrier, setCarrier] = useState("all");
  const filtered = filterByCarrier(rankingItems, carrier);

  return (
    <>
      {/* キャリアフィルター */}
      <div className="mb-6">
        <p className="text-sm font-bold text-gray-600 mb-3 text-center">
          📡 今使っているキャリア回線で絞り込む
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {carriers.map((c) => (
            <button
              key={c.value}
              onClick={() => setCarrier(c.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                carrier === c.value
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
            >
              <span>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
        {carrier !== "all" && (
          <p className="text-center text-xs text-blue-600 font-bold mt-3">
            ✅ {carriers.find((c) => c.value === carrier)?.label}ユーザー向けにおすすめ順で表示しています
          </p>
        )}
      </div>

      {/* 比較テーブル */}
      <div className="overflow-x-auto rounded-3xl shadow-md">
        <table className="w-full bg-white text-sm">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-4 px-5 text-left font-bold w-32">比較項目</th>
              {filtered.map((item, i) => (
                <th key={item.rank} className="py-4 px-5 text-center font-black">
                  <div className="text-xs mb-1 opacity-80">
                    {i === 0 && carrier !== "all" ? "🏆 おすすめ" : i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `第${i + 1}位`}
                  </div>
                  {item.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-5 font-bold text-gray-600 bg-gray-50">💰 月額料金</td>
              {filtered.map((item) => (
                <td key={item.rank} className="py-4 px-5 text-center font-black text-blue-600">
                  {item.price}
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-5 font-bold text-gray-600 bg-gray-50">📊 データ容量</td>
              {filtered.map((item) => (
                <td key={item.rank} className="py-4 px-5 text-center font-bold">
                  {item.speed}
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-5 font-bold text-gray-600 bg-gray-50">🎁 特典</td>
              {filtered.map((item) => (
                <td key={item.rank} className="py-4 px-5 text-center">
                  <span className="text-xs font-bold text-gray-500">{item.reward.label}</span>
                  <div className="text-red-500 font-black">{item.reward.value}</div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-5 font-bold text-gray-600 bg-gray-50">👤 こんな人向け</td>
              {filtered.map((item) => (
                <td key={item.rank} className="py-4 px-5 text-center text-xs text-gray-600">
                  {item.description}
                </td>
              ))}
            </tr>
            <tr className="bg-gray-50">
              <td className="py-4 px-5 font-bold text-gray-600 bg-gray-100">申し込み</td>
              {filtered.map((item) => (
                <td key={item.rank} className="py-4 px-5 text-center">
                  <Link
                    href={item.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className={`inline-block text-white font-black px-5 py-2 rounded-xl text-sm pop-btn transition-colors ${item.ctaColor}`}
                  >
                    公式へ →
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
