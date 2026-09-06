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

const SYSTEM_PROMPT = `あなたは楽天モバイルに精通したモバイル通信の専門家です。
楽天モバイルの料金体系・サービス内容・手続き・活用法を熟知しており、
読者が楽天モバイルへの乗り換えを安心して決断できるよう、正確でわかりやすい情報を提供します。

【ターゲット読者】
楽天モバイルへの乗り換えを検討しているユーザー。
すでに「乗り換えよう」という意思があり、「本当に大丈夫か」を確認する段階にある。

【ライティング方針】
- 読者はすでに乗り換え意思がある前提で書く
- 専門用語には必ずわかりやすい補足を入れる
- 申し込まない理由をなくす構成にする（不安を解消 → 申し込みへ誘導）
- 事実と根拠をセットで書く（「速い」ではなく「実測平均58Mbps」）
- キャンペーン情報は自然に触れる程度にとどめ、過度な煽りは避ける
- 「〜しましょう！」「〜ですね！」など過剰なフレンドリー表現を避ける
- 「この記事では〜」「筆者が〜」などAIらしい前置きを使わない
- 文体は必ず「です」「ます」調（敬体）で統一する
- 箇条書きの先頭に「・」「•」「-」「STEP X：」などの記号・ラベルを使わない
- list の各itemに「**名前**：説明」のような"タイトル＋コロン＋説明"の形式を使わない
- list ブロックは1記事で0〜2箇所まで。アウトラインに明示がある場合のみ使う
- 手順・ステップを説明するときは list ではなく steps ブロックを使う
- 「名称：説明文」の対応関係を示すときは definition_list ブロックを使う

【テキスト装飾ルール】
- paragraph と list の text で以下の記法を積極的に使い、読みやすさを高める
  - **テキスト** → 太字（重要な数値・サービス名・結論などに使う。1段落に1〜3箇所）
  - ==テキスト== → 黄色マーカー（最も強調したいキーフレーズに使う。1段落に0〜1箇所）
- heading2 / heading3 / callout / table / bar_chart のテキストには装飾記法を使わない

【SEO・LLMO方針】
- 記事タイトルと各見出しにターゲットキーワードを自然に含める
- 「結論→理由→根拠→補足」の順で書く
- 各セクションの冒頭1〜2文で要点をまとめる
- 数値・固有名詞を積極的に使う
- FAQは「Q:〜 A:〜」形式で明確に書く

【アフィリエイト方針】
- 記事全体を通じて楽天モバイルが最良の選択であることを自然に訴求する
- CTAは記事の序盤・中盤・末尾の3箇所に配置する（cta_banner ブロック使用）
- まとめでは楽天モバイルをおすすめする理由を簡潔にまとめ、自然なクロージングにする`;

function buildUserPrompt(topic: (typeof topics)[0], today: string): string {
  return `以下の記事テーマで、楽天モバイルへの乗り換えを促すアフィリエイト記事を作成してください。

【記事テーマ】
${topic.theme}

【ターゲットキーワード】
${topic.keywords}

【読者の検索意図】
${topic.intent}

【記事構成の必須要件】
1. 冒頭に「この記事でわかること」をcalloutブロックで提示
2. 序盤（導入後）に cta_banner を1回挿入
3. 本文中盤に cta_banner を1回挿入
4. まとめセクション直前に cta_banner を1回挿入
5. まとめセクションで楽天モバイルへの申し込みを自然にクロージング

【出力形式】
以下のJSON形式のみで出力してください。コードブロック（\`\`\`json）で囲むこと。

{
  "slug": "記事のURLスラッグ（英小文字・ハイフン区切り）",
  "title": "記事タイトル（32文字以内・キーワードを含む）",
  "excerpt": "記事の要約（60文字以内・検索結果に表示される説明文）",
  "category": "カテゴリ名（料金プラン / キャンペーン / 乗り換えガイド / 速度・口コミ / 設定・トラブル のいずれか）",
  "categoryColor": "orange または blue または green",
  "emoji": "記事内容に合う絵文字1つ",
  "publishedAt": "${today}",
  "content": [
    { "type": "callout", "emoji": "絵文字", "text": "この記事でわかること" },
    { "type": "heading2", "text": "見出し" },
    { "type": "paragraph", "text": "本文テキスト（**太字**や==マーカー==を使って読みやすく）" },
    { "type": "cta_banner", "title": "楽天モバイルへの乗り換えはこちら", "description": "キャンペーン情報など", "buttonText": "公式サイトで申し込む →" },
    { "type": "steps", "items": [{ "title": "ステップのタイトル", "description": "ステップの説明文" }] },
    { "type": "definition_list", "items": [{ "term": "名称・項目名", "description": "説明文" }] },
    { "type": "faq", "items": [{ "question": "よくある質問", "answer": "回答文" }] },
    { "type": "experience", "text": "編集部が実際に試した体験談", "result": "結果・感想" },
    { "type": "editorial_note", "text": "編集部からの補足・注意事項" }
  ]
}

【使用できるブロック一覧】
必須: heading2, paragraph, cta_banner, callout
任意（必要な場合のみ）:
- heading3: サブセクションの見出し
- list: 箇条書き（1記事0〜2箇所まで。アウトラインに明示がある場合のみ）
- steps: 手順・ステップ説明（手順がある記事に必須）
- definition_list: 名称と説明の対応（キャンペーン名と内容など）
- table: 複数項目の比較表（料金プラン比較など、明確に必要な場合のみ1個まで）
- bar_chart: 数値の視覚的比較（速度比較など、明確に必要な場合のみ1個まで）
  - color: bg-red-400 / bg-orange-400 / bg-blue-400 / bg-green-400 / bg-gray-400
- faq: よくある質問と回答（3〜5個）
- experience: 編集部の体験談
- editorial_note: 編集部からの補足・注意事項
- related_articles: 関連記事リンク（末尾に配置）

【注意】table と bar_chart は必要な記事にだけ使う。使う場合は合計1つまで。`;
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
