import Link from "next/link";
import type { RankingItem } from "@/lib/types";

const tagClasses = {
  cool: "bg-blue-50 text-blue-700 border border-blue-200",
  warm: "bg-sky-50 text-sky-700 border border-sky-200",
  green: "bg-green-50 text-green-700 border border-green-200",
} as const;

const rankBadgeLabel: Record<number, string> = {
  1: "🥇 第1位",
  2: "🥈 第2位",
  3: "🥉 第3位",
  4: "4位",
  5: "5位",
  6: "6位",
  7: "7位",
};

type Props = {
  item: RankingItem;
};

export default function RankingCard({ item }: Props) {
  const isFirst = item.rank === 1;

  return (
    <div
      className={`relative rounded-3xl p-6 card-pop ${
        isFirst
          ? "border-3 border-yellow-400 bg-amber-50"
          : "bg-white border border-gray-200"
      }`}
      style={isFirst ? { borderWidth: "3px", borderColor: "#fbbf24" } : {}}
    >
      {/* Rank badge */}
      <div
        className={`absolute -top-4 left-6 text-white font-black px-4 py-1 rounded-full text-sm flex items-center gap-1 ${item.badgeGradient}`}
      >
        {rankBadgeLabel[item.rank] ?? `第${item.rank}位`}
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-5 mt-2">
        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isFirst
                  ? "bg-sky-100 text-sky-700 border border-sky-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
            >
              {item.label}
            </span>
          </div>
          <h3 className="text-2xl font-black text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-500 mt-1 mb-3">{item.description}</p>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag.text}
                className={`text-xs px-3 py-1 rounded-full font-bold ${tagClasses[tag.variant]}`}
              >
                {tag.text}
              </span>
            ))}
          </div>
        </div>

        {/* CTA area */}
        {item.affiliateUrl ? (
          <div className="flex flex-col items-center md:items-end gap-3">
            <div
              className={`rounded-2xl px-5 py-2 text-center ${
                isFirst
                  ? "bg-white border border-yellow-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">
                {item.reward.label}
              </div>
              <div
                className={`text-3xl font-black ${isFirst ? "text-red-500" : "text-blue-500"}`}
              >
                {item.reward.value}
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-1">
              <Link
                href={item.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className={`text-white font-black px-7 py-3 rounded-2xl pop-btn text-sm whitespace-nowrap transition-colors ${item.ctaColor}`}
              >
                {isFirst ? "今すぐ無料で申し込む →" : "申し込みはこちら →"}
              </Link>
              {isFirst && (
                <p className="text-xs text-gray-400 text-center">
                  ✓ このリンクからの申し込みが特典対象
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start md:items-end gap-2">
            {item.officialUrl && (
              <Link
                href={item.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-400 px-5 py-2.5 rounded-2xl transition-colors whitespace-nowrap"
              >
                公式サイトを見る →
              </Link>
            )}
            <p className="text-xs text-gray-400">※当サイト非提携</p>
          </div>
        )}
      </div>
    </div>
  );
}

