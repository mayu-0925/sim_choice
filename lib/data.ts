import type { RankingItem, Article, SiteAlert, HeroStat, HowToStep, ContentBlock } from "./types";
import { currentMonthEnd } from "./date";

// アフィリエイトURL（楽天モバイルのみ提携済み）
// TODO: 実際のアフィリエイトURLに変更してください
export const RAKUTEN_AFFILIATE_URL = "https://px.a8.net/svt/ejp?a8mat=4BA1PB+8EGCPU+5W58+601S1";

// 記事本文データ（slug をキーとして管理）
export const articleContents: Record<string, ContentBlock[]> = {
  "kakuyasu-sim-beginners-guide": [
    { type: "callout", emoji: "👋", text: "格安SIMは初めて？難しい言葉は使わずに解説します。5分で読めます！" },
    { type: "heading2", text: "格安SIMとは？キャリアとの違い" },
    { type: "paragraph", text: "格安SIM（MVNO）とは、ドコモ・au・ソフトバンクなどの大手キャリアから回線を借りて、より安く提供するサービスです。通信品質はほぼ変わらず、月額料金を大幅に節約できます。" },
    { type: "list", items: ["大手キャリア（ドコモ等）：月7,000〜9,000円", "格安SIM：月1,000〜3,000円", "差額：年間で5〜10万円の節約も可能"] },
    { type: "ranking_cta", rankIndex: 0 },
    { type: "heading2", text: "格安SIMのデメリットも正直に" },
    { type: "list", items: ["混雑時間帯（昼12時・夜18〜20時）に速度が落ちることがある", "キャリアメールが使えない（Gmail等に切り替えが必要）", "店舗サポートが少ない（基本オンライン手続き）"] },
    { type: "callout", emoji: "✅", text: "デメリットを理解したうえで選べば格安SIMは最高のコスパ。まずは楽天モバイルから試すのがおすすめです！" },
  ],
};

// -------------------------------------------------------
// 編集部による実測データ・体験談（一次情報として記事生成に活用）
// -------------------------------------------------------
export const editorialData = {
  speedTests: {
    "IIJmio（ドコモ回線）": {
      down: 47, up: 12, unit: "Mbps",
      testedAt: "2026年6月",
      env: "東京都内・昼13時・屋内使用",
    },
    "IIJmio（au回線）": {
      down: 52, up: 15, unit: "Mbps",
      testedAt: "2026年6月",
      env: "東京都内・平日19時・屋内使用",
    },
    "楽天モバイル": {
      down: 58, up: 18, unit: "Mbps",
      testedAt: "2026年6月",
      env: "東京都内・平日昼12時・楽天回線エリア内",
    },
    "mineo（ドコモ回線）": {
      down: 38, up: 10, unit: "Mbps",
      testedAt: "2026年6月",
      env: "大阪市内・平日昼12時・屋内使用",
    },
    "UQ mobile": {
      down: 72, up: 20, unit: "Mbps",
      testedAt: "2026年6月",
      env: "東京都内・平日19時・屋外使用",
    },
    "Y!mobile": {
      down: 68, up: 18, unit: "Mbps",
      testedAt: "2026年6月",
      env: "大阪市内・平日昼12時・屋内使用",
    },
  },
  experiences: {
    "IIJmio": "編集部が実際にIIJmioのeSIMを契約したところ、申し込みから利用開始まで最短当日で完了しました。昼間の速度低下はあるものの、動画視聴や普段使いには支障なく、コスパは抜群です。",
    "楽天モバイル": "楽天回線エリア内では快適に使えました。ただし地下や屋内ではパートナー回線（au）に切り替わることがあります。楽天ポイントが貯まるのは大きなメリットです。",
    "mineo": "マイピタ3GBプランを利用。昼12時の混雑時は動画が少し重くなることがありましたが、朝・夜は快適でした。パケット繰り越し機能が使いやすいです。",
    "SIM乗り換え全般": "MNP（番号ポータビリティ）の手続きは、各社ともオンラインで完結できます。申し込みから開通まで最短1〜2日。SIMフリー端末なら端末購入不要で乗り換えられます。",
    "解約・解約金": "ほとんどの格安SIMは縛りなし・解約金0円です。いつでも乗り換えできるのが格安SIMの大きなメリットです。",
  },
};

// -------------------------------------------------------
// サイト全体のアラートバー
// -------------------------------------------------------
export const siteAlert: SiteAlert = {
  message: `🎉 【${currentMonthEnd()}】楽天モバイルが最大20,000ポイント還元キャンペーン実施中！`,
  linkText: "今すぐ申し込む",
  linkHref: RAKUTEN_AFFILIATE_URL,
};

// -------------------------------------------------------
// Heroセクション 統計情報
// -------------------------------------------------------
export const heroStats: HeroStat[] = [
  { value: "¥1,078", label: "最安月額（3GBまで）", color: "text-red-500" },
  { value: "♾️", label: "無制限プランあり", color: "text-blue-500" },
  { value: "20,000", label: "最大還元ポイント", color: "text-green-500" },
];

// -------------------------------------------------------
// SIMのえらびかた ステップ
// -------------------------------------------------------
export const howToSteps: HowToStep[] = [
  {
    step: 1,
    emoji: "📱",
    title: "スマホの対応回線を確認",
    description: "お持ちのスマホがドコモ・au・ソフトバンクどの回線に対応しているか確認します",
    bgColor: "bg-blue-50",
    stepColor: "bg-blue-500",
  },
  {
    step: 2,
    emoji: "📊",
    title: "月のデータ使用量を確認",
    description: "今のスマホの設定画面でデータ使用量を確認。3〜10GBが平均的です",
    bgColor: "bg-teal-50",
    stepColor: "bg-teal-500",
  },
  {
    step: 3,
    emoji: "💰",
    title: "料金プランを比べる",
    description: "月額・通話料・キャンペーンを総合比較して最安プランを見つけます",
    bgColor: "bg-green-50",
    stepColor: "bg-green-400",
  },
];

// -------------------------------------------------------
// ランキングデータ
// -------------------------------------------------------
export const rankingItems: RankingItem[] = [
  {
    rank: 1,
    name: "楽天モバイル",
    label: "編集部イチオシ！",
    description: "3GBまで月1,078円、データ無制限でも月3,278円と業界最安クラス。縛りなし・解約金なしで気軽に試せる。楽天市場との併用でポイント還元率もアップ。",
    speed: "3GB〜無制限",
    price: "月¥1,078〜",
    tags: [
      { text: "♾️ データ無制限", variant: "cool" },
      { text: "💰 月¥1,078〜", variant: "green" },
      { text: "🎁 楽天ポイント還元", variant: "warm" },
    ],
    reward: { label: "ポイント還元", value: "最大20,000pt" },
    affiliateUrl: RAKUTEN_AFFILIATE_URL,
    ctaColor: "bg-red-500 hover:bg-red-600",
    badgeGradient: "bg-yellow-400",
  },
  {
    rank: 2,
    name: "IIJmio",
    label: "コスパ最強！",
    description: "2GB 850円〜と業界最安水準。ドコモ・au両回線対応でeSIMにも対応。",
    speed: "2GB〜50GB",
    price: "月¥850〜",
    tags: [
      { text: "💰 月¥850〜", variant: "green" },
      { text: "📶 ドコモ/au回線", variant: "cool" },
      { text: "📱 eSIM対応", variant: "warm" },
    ],
    reward: { label: "乗り換え特典", value: "最大13,000円" },
    affiliateUrl: "",
    officialUrl: "https://www.iijmio.jp/",
    ctaColor: "bg-blue-500 hover:bg-blue-600",
    badgeGradient: "bg-gray-500",
  },
  {
    rank: 3,
    name: "mineo",
    label: "3キャリア対応",
    description: "ドコモ・au・ソフトバンク全回線に対応。パケット繰り越しも可能で柔軟に使える。",
    speed: "1GB〜20GB",
    price: "月¥1,298〜",
    tags: [
      { text: "📶 3キャリア対応", variant: "cool" },
      { text: "🔄 繰り越しOK", variant: "green" },
      { text: "👥 コミュニティ充実", variant: "warm" },
    ],
    reward: { label: "紹介キャンペーン", value: "最大6,000円" },
    affiliateUrl: "",
    officialUrl: "https://mineo.jp/",
    ctaColor: "bg-green-500 hover:bg-green-600",
    badgeGradient: "bg-gray-400",
  },
  {
    rank: 4,
    name: "UQ mobile",
    label: "品質重視派に",
    description: "au回線をそのまま使う高品質SIM。速度低下が少なく安定感が抜群。",
    speed: "4GB〜33GB",
    price: "月¥2,365〜",
    tags: [
      { text: "⚡ au回線で安定", variant: "cool" },
      { text: "📱 au割あり", variant: "warm" },
      { text: "🏪 auショップで対応", variant: "green" },
    ],
    reward: { label: "MNP特典", value: "最大10,000円" },
    affiliateUrl: "",
    officialUrl: "https://www.uqwimax.jp/mobile/",
    ctaColor: "bg-pink-500 hover:bg-pink-600",
    badgeGradient: "bg-gray-400",
  },
  {
    rank: 5,
    name: "Y!mobile",
    label: "ソフトバンク系で安定",
    description: "ソフトバンク回線の格安版。速度が安定しており家族割引も充実。",
    speed: "4GB〜30GB",
    price: "月¥2,365〜",
    tags: [
      { text: "📶 SB回線で安定", variant: "cool" },
      { text: "👨‍👩‍👧 家族割対応", variant: "warm" },
      { text: "🏪 店舗対応あり", variant: "green" },
    ],
    reward: { label: "MNP特典", value: "最大10,000円" },
    affiliateUrl: "",
    officialUrl: "https://www.ymobile.jp/",
    ctaColor: "bg-purple-500 hover:bg-purple-600",
    badgeGradient: "bg-gray-300",
  },
  {
    rank: 6,
    name: "LINEMO",
    label: "LINEギガフリー",
    description: "ソフトバンク回線でLINEのデータ消費がゼロ。ミニプラン3GB 990円から。",
    speed: "3GB〜20GB",
    price: "月¥990〜",
    tags: [
      { text: "💬 LINEギガフリー", variant: "cool" },
      { text: "💰 月¥990〜", variant: "green" },
      { text: "📶 SB回線使用", variant: "warm" },
    ],
    reward: { label: "PayPay還元", value: "最大5,000円" },
    affiliateUrl: "",
    officialUrl: "https://www.linemo.jp/",
    ctaColor: "bg-teal-500 hover:bg-teal-600",
    badgeGradient: "bg-gray-300",
  },
  {
    rank: 7,
    name: "ahamo",
    label: "ドコモ品質を安く",
    description: "ドコモ回線で20GB 2,970円。海外82ヵ国でも追加料金なしで使える。",
    speed: "20GB〜100GB",
    price: "月¥2,970〜",
    tags: [
      { text: "📶 ドコモ回線", variant: "cool" },
      { text: "✈️ 海外82ヵ国OK", variant: "warm" },
      { text: "📦 20GB〜", variant: "green" },
    ],
    reward: { label: "dポイント還元", value: "最大5,000pt" },
    affiliateUrl: "",
    officialUrl: "https://ahamo.com/",
    ctaColor: "bg-indigo-500 hover:bg-indigo-600",
    badgeGradient: "bg-gray-200",
  },
];

export type { Article };
