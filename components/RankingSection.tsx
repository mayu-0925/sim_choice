import Link from "next/link";
import RankingCard from "./RankingCard";
import type { RankingItem } from "@/lib/types";
import { currentYearMonth } from "@/lib/date";

type Props = {
  items: RankingItem[];
};

export default function RankingSection({ items }: Props) {
  return (
    <section className="py-12 px-4 bg-sky-50">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-8">
          <span className="text-4xl">🏆</span>
          <h2 className="text-2xl font-black text-gray-800 mt-1">
            格安SIM おすすめランキング
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {currentYearMonth()} 編集部が選んだTOP3
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-5">
          {items.map((item) => (
            <RankingCard key={item.rank} item={item} />
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-8">
          <Link
            href="/ranking"
            className="text-sky-500 font-bold text-sm hover:underline"
          >
            すべてのランキングを見る →
          </Link>
        </div>
      </div>
    </section>
  );
}
