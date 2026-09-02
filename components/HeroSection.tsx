import Link from "next/link";
import type { HeroStat, RankingItem } from "@/lib/types";
import { currentYearMonth } from "@/lib/date";
import { RAKUTEN_AFFILIATE_URL } from "@/lib/data";

type Props = {
  stats: HeroStat[];
  featuredItem: RankingItem;
};

export default function HeroSection({ stats, featuredItem }: Props) {
  return (
    <section
      className="py-12 px-4"
      style={{
        background:
          "linear-gradient(160deg, #e0f2fe 0%, #bae6fd 30%, #c7d2fe 60%, #ddd6fe 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: copy */}
          <div>
            {/* Mascot balloon */}
            <div className="relative inline-block mb-6">
              <div className="mascot-balloon bg-white rounded-2xl px-4 py-2.5 shadow-lg relative">
                <p className="text-sm text-gray-700">
                  📱 格安SIMへの乗り換えなら楽天モバイルが最有力候補です
                </p>
              </div>
            </div>

            {/* Confetti dots + date */}
            <div className="flex items-center gap-1 mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-red-400"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
              <span className="inline-block w-2 h-2 rounded-full bg-green-400"></span>
              <span className="text-sm text-gray-500 ml-1">
                {currentYearMonth()} 最新版
              </span>
            </div>

            <h1 className="text-4xl font-black text-gray-800 leading-tight mb-4">
              月々の通信費、
              <br />
              <span className="text-red-500">楽天モバイル</span>で
              <br />
              <span className="text-sky-500">最大7万円節約</span>
            </h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              データ無制限でも月3,278円。縛りなし・解約金なしで、
              <span className="font-bold text-red-500">今すぐ試せる</span>
              のが楽天モバイルの最大の強みです。
            </p>

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap">
              <Link
                href={RAKUTEN_AFFILIATE_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="bg-red-500 hover:bg-red-600 text-white font-black px-6 py-3 rounded-2xl pop-btn text-sm flex items-center gap-2 transition-colors"
              >
                🎁 楽天モバイルに申し込む
              </Link>
              <Link
                href="/diagnosis"
                className="bg-white border-2 border-sky-300 text-sky-600 font-bold px-5 py-3 rounded-2xl pop-btn text-sm flex items-center gap-2"
              >
                💬 他の回線と比較する
              </Link>
            </div>
          </div>

          {/* Right: featured card + stats */}
          <div className="space-y-3">
            {/* Featured pick */}
            <div className="bg-white rounded-3xl p-5 shadow-lg">
              <p className="text-xs text-gray-400 font-bold mb-3">
                ⚡ 今月のベストピック
              </p>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-lg font-black text-gray-800">
                    {featuredItem.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">月額</div>
                  <div className="text-2xl font-black text-sky-500">
                    ¥{featuredItem.price.replace("月¥", "").replace("〜", "")}
                  </div>
                  <div className="text-xs text-gray-400">〜（税込）</div>
                </div>
              </div>
              <Link
                href={featuredItem.affiliateUrl}
                className="block bg-sky-400 hover:bg-sky-500 text-white text-center font-black py-3 rounded-2xl pop-btn transition-colors"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                キャンペーン詳細を見る 🎁
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-3 text-center shadow"
                >
                  <div className={`text-2xl font-black ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

