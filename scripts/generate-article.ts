/**
 * 記事自動生成スクリプト
 * 使い方: npx tsx scripts/generate-article.ts [topicIndex]
 * 例: npx tsx scripts/generate-article.ts 0
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { topics } from "./topics";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

const SYSTEM_PROMPT = `あなたはインターネット回線業界に10年以上携わる専門家です。
格安SIM（MVNO）の料金体系・回線品質・手続きの違いを熟知しており、
読者が最適な回線を選べるよう、正確でわかりやすい情報を提供します。

【ターゲット読者】
インターネット回線の新規契約・乗り換えを具体的に検討しているユーザー。
すでに「契約しよう」という意思があり、「どの回線にするか」を決める段階にある。

【ライティング方針】
- 読者はすでに契約意思がある前提で書く
- 専門用語には必ずわかりやすい補足を入れる
- 押しつけがましくならない程度に背中を押す（「〜すべき」「〜しなければ」は使わず、「〜がおすすめです」「〜を選ぶと安心です」などの表現にする）
- 「申し込まない理由をなくす」構成にする
- 事実と根拠をセットで書く（「速い」ではなく「実測平均897Mbpsで業界トップクラス」）
- キャンペーン情報は自然に触れる程度にとどめ、過度な煽りは避ける
- 「〜しましょう！」「〜ですね！」など過剰なフレンドリー表現を避ける
- 「この記事では〜」「筆者が〜」などAIらしい前置きを使わない
- 文体は必ず「です」「ます」調（敬体）で統一する。「だ」「である」調は使わない
- 自然な人間のライターが書いたような、読みやすく簡潔な文体にする
- 箇条書きの先頭に「・」「•」「-」「STEP X：」などの記号・ラベルを使わない（itemsの配列に入れるだけでよい）
- list の各itemに「**名前**：説明」「名前：説明」のような"タイトル＋コロン＋説明"の形式を使わない
- list ブロックは1記事で3〜4箇所まで。1つのlistのitemsは3〜6個に抑える
- 手順・ステップを説明するときは list ではなく steps ブロックを使う
- 「名称：説明文」の対応関係（キャンペーン名と内容、確認項目と説明など）を示すときは definition_list ブロックを使う

【テキスト装飾ルール】
- paragraph と list の text で以下の記法を積極的に使い、読みやすさを高める
  - **テキスト** → 太字（重要な数値・サービス名・結論などに使う。1段落に1〜3箇所）
  - ==テキスト== → 黄色マーカー（最も強調したいキーフレーズに使う。1段落に0〜1箇所）
- heading2 / heading3 / callout / table / bar_chart のテキストには装飾記法を使わない

【SEO・LLMO方針】
- 記事タイトルと各見出しにターゲットキーワードを自然に含める
- 「結論→理由→根拠→補足」の順で書く
- 各セクションの冒頭1〜2文で要点をまとめる
- 数値・固有名詞・比較データを積極的に使う
- FAQは「Q:〜 A:〜」形式で明確に書く

【アフィリエイト方針】
- 記事全体を通じて楽天モバイルが最良の選択であることを自然に訴求する
- CTAは記事の序盤・中盤・末尾の3箇所に配置する
- CTA付近にはキャンペーン情報を自然に添える程度にする
- まとめでは楽天モバイルをおすすめする理由を簡潔にまとめ、自然なクロージングにする`;

function buildUserPrompt(topic: (typeof topics)[0], today: string): string {
  return `以下の記事テーマで、アフィリエイト記事を作成してください。

【記事テーマ】
${topic.theme}

【ターゲットキーワード】
${topic.keywords}

【読者の検索意図】
${topic.intent}

【推奨する回線（アフィリエイト誘導先）】
- 第1位：楽天モバイル（最優先・rankIndex: 0）
- 第2位：IIJmio（rankIndex: 1）
- 第3位：mineo（rankIndex: 2）
- 第4位：J:COM光（rankIndex: 3）
- 第5位：Y!mobile（rankIndex: 4）
- 第6位：LINEMO（rankIndex: 5）
- 第7位：ahamo（rankIndex: 6）

【記事構成の必須要件】
1. 冒頭に「この記事でわかること」をcalloutブロックで提示
2. 序盤（導入後）に ranking_cta（rankIndex: 0）を1回挿入
3. 本文中盤に ranking_cta（rankIndex: 0 or 1）を1〜2回挿入
4. 末尾のまとめの直前に ranking_cta（rankIndex: 0）を挿入
5. まとめセクションで楽天モバイルへの申し込みを自然にクロージング

【出力形式】
以下のJSON形式のみで出力してください。コードブロック（\`\`\`json）で囲むこと。

{
  "slug": "記事のURLスラッグ（英小文字・ハイフン区切り）",
  "title": "記事タイトル（32文字以内・キーワードを含む）",
  "excerpt": "記事の要約（60文字以内・検索結果に表示される説明文）",
  "category": "カテゴリ名（比較 / 初心者 / お得情報 / レビュー / 速度 のいずれか）",
  "categoryColor": "orange または blue または green",
  "emoji": "記事内容に合う絵文字1つ",
  "publishedAt": "${today}",
  "content": [
    { "type": "callout", "emoji": "絵文字", "text": "この記事でわかること" },
    { "type": "heading2", "text": "見出し" },
    { "type": "paragraph", "text": "本文テキスト" },
    { "type": "list", "items": ["箇条書き1", "箇条書き2"] },
    { "type": "ranking_cta", "rankIndex": 0 },
    { "type": "steps", "items": [{ "title": "ステップのタイトル", "description": "ステップの説明文" }] },
    { "type": "definition_list", "items": [{ "term": "名称・項目名", "description": "説明文" }] },
    { "type": "table", "headers": ["項目", "NURO光", "auひかり", "ドコモ光"], "rows": [["月額料金", "5,200円〜", "4,180円〜", "4,400円〜"], ["最大速度", "10Gbps", "1Gbps", "1Gbps"]] },
    { "type": "bar_chart", "title": "速度比較（実測平均 下り）", "items": [{ "label": "NURO光", "value": 897, "unit": "Mbps", "color": "bg-orange-400" }, { "label": "auひかり", "value": 743, "unit": "Mbps", "color": "bg-blue-400" }, { "label": "ドコモ光", "value": 682, "unit": "Mbps", "color": "bg-red-400" }] }
  ]
}

【表・グラフの使用ガイドライン】
- table と bar_chart は必要な記事にだけ使う（すべての記事に入れる必要はない）
- 複数の回線を料金・速度・エリアなどで比較する記事には table が効果的
- 数値の大小を視覚的に見せたい場合のみ bar_chart を使う
- bar_chart の color には bg-orange-400 / bg-blue-400 / bg-red-400 / bg-green-400 / bg-gray-400 を使う
- 使う場合は1記事につき合計1〜2個まで。同じ記事に table と bar_chart を両方使う必要はない`;
}

async function generateArticle(topicIndex: number): Promise<void> {
  const topic = topics[topicIndex];
  if (!topic) {
    console.error(`トピックが見つかりません: index ${topicIndex}`);
    process.exit(1);
  }

  const today = new Date().toISOString().split("T")[0];
  console.log(`📝 記事生成開始: ${topic.theme}`);

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserPrompt(topic, today) }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // JSONを抽出
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (!match) {
    console.error("JSONの抽出に失敗しました。レスポンス:\n", text);
    process.exit(1);
  }

  const article = JSON.parse(match[1]);

  // スラッグの重複チェック
  const outputPath = path.join(ARTICLES_DIR, `${article.slug}.json`);
  if (fs.existsSync(outputPath)) {
    const timestamp = Date.now();
    article.slug = `${article.slug}-${timestamp}`;
    console.log(`⚠️  スラッグが重複したため変更: ${article.slug}`);
  }

  // 保存
  fs.writeFileSync(
    path.join(ARTICLES_DIR, `${article.slug}.json`),
    JSON.stringify(article, null, 2),
    "utf-8"
  );

  console.log(`✅ 記事を保存しました: content/articles/${article.slug}.json`);
  console.log(`   タイトル: ${article.title}`);
  console.log(`   カテゴリ: ${article.category}`);
}

// メイン実行
const topicIndex = parseInt(process.argv[2] ?? "0", 10);
generateArticle(topicIndex).catch((err) => {
  console.error("エラー:", err);
  process.exit(1);
});
