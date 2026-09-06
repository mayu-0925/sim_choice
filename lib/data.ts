import type { SiteAlert } from "./types";
import { currentMonthEnd } from "./date";

export const SITE_NAME = "楽天モバイル乗り換えナビ";
export const BASE_URL = "https://www.sim-choice.jp";
export const RAKUTEN_AFFILIATE_URL = "https://px.a8.net/svt/ejp?a8mat=4BA1PB+8EGCPU+5W58+601S1";

export const RAKUTEN = {
  name: "楽天モバイル",
  price: "月¥1,078〜",
  planBasic: { label: "3GBまで", price: "1,078円" },
  planUnlimited: { label: "データ無制限", price: "3,278円" },
  maxReward: "20,000",
  contract: "縛りなし・解約金0円",
  speedStats: { down: 58, up: 18, ping: 25 },
};

export const CATEGORIES = [
  { slug: "plan", label: "料金プラン" },
  { slug: "campaign", label: "キャンペーン" },
  { slug: "guide", label: "乗り換えガイド" },
  { slug: "review", label: "速度・口コミ" },
  { slug: "trouble", label: "設定・トラブル" },
];

export const siteAlert: SiteAlert = {
  message: `🎁 【${currentMonthEnd()}】楽天モバイルが最大20,000ポイント還元キャンペーン実施中！`,
  linkText: "今すぐ申し込む",
  linkHref: RAKUTEN_AFFILIATE_URL,
};

export const editorialData = {
  speedTests: {
    "楽天モバイル（楽天回線・昼）": {
      down: 58, up: 18, ping: 25, unit: "Mbps",
      testedAt: "2026年8月",
      env: "東京都内・平日昼12時・楽天回線エリア内",
    },
    "楽天モバイル（楽天回線・夜）": {
      down: 42, up: 12, ping: 28, unit: "Mbps",
      testedAt: "2026年8月",
      env: "東京都内・平日夜20時・楽天回線エリア内",
    },
  },
  experiences: {
    "楽天モバイル申し込み〜開通": "編集部が実際に申し込んだところ、eSIMであればオンラインで即日開通が可能でした。物理SIMは申し込みから到着まで3〜4日かかりました。",
    "MNP乗り換え": "MNP転入手続きはオンラインで完結し、旧回線の解約まで含めて30分程度で完了しました。乗り換え先として楽天モバイルを選んだ理由は、縛りなしで試せる点です。",
    "楽天モバイル速度実測": "楽天回線エリア内では昼間でも平均58Mbpsを記録し、動画視聴やZoom通話に十分な速度でした。地下や郊外ではau回線（パートナー回線）に切り替わることがあります。",
    "楽天ポイント活用": "楽天市場でのお買い物時にSPUが+3倍となり、毎月のポイント還元が積み上がります。月額料金の実質的なコストダウンにつながっています。",
  },
};
