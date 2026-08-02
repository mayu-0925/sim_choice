/**
 * 記事自動生成スクリプト v2 - 4エージェント構成
 *
 * Phase 1 (Keyword Agent) : 既存記事を把握し、未開拓テーマ・キーワードを選定
 * Phase 2 (Outline Agent) : 選定キーワードをもとに詳細な記事構成を設計
 * Phase 3 (Writer Agent)  : 構成に従い、高品質な記事本文 JSON を生成
 * Phase 4 (Image Agent)   : Imagen 3 でサムネイル画像を生成・保存
 *
 * 使い方: npx tsx scripts/generate-article-v2.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { editorialData } from "../lib/data";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_AI_STUDIO_API_KEY });
const ARTICLES_DIR = path.join(process.cwd(), "content/articles");
const THUMBNAILS_DIR = path.join(process.cwd(), "public/thumbnails");

// ----------------------------------------------------------------
// 既存記事の読み込み
// ----------------------------------------------------------------
function loadExistingArticles(): { slug: string; title: string; category: string }[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8"));
        return { slug: data.slug ?? f.replace(".json", ""), title: data.title ?? "", category: data.category ?? "" };
      } catch {
        return null;
      }
    })
    .filter(Boolean) as { slug: string; title: string; category: string }[];
}

// ----------------------------------------------------------------
// Phase 1: キーワード・トピック選定エージェント
// ----------------------------------------------------------------
interface SelectedTopic {
  theme: string;
  targetKeyword: string;
  subKeywords: string[];
  searchIntent: string;
  targetReader: string;
  uniqueAngle: string;
  suggestedSlug: string;
}

async function phase1SelectTopic(
  existingArticles: { slug: string; title: string; category: string }[],
  today: string,
  priorityTopics: { query: string; impressions: number; position: number }[] = []
): Promise<SelectedTopic> {
  console.log("🔍 Phase 1: キーワード・トピック選定中...");

  const existingList = existingArticles
    .map((a) => `- ${a.slug}: 「${a.title}」(${a.category})`)
    .join("\n");

  const prioritySection =
    priorityTopics.length > 0
      ? `\n【最優先候補（Search Console 実データ：インプレッション数が多いのに記事がないクエリ）】\n${priorityTopics
          .map((t) => `- 「${t.query}」（${t.impressions}imp・平均${t.position}位）`)
          .join("\n")}\n上記クエリに対応する記事がまだ存在しないなら、これらを最優先で選ぶこと。\n`
      : "";

  const systemPrompt = `あなたはSEO・コンテンツ戦略の専門家です。
格安SIMアフィリエイトサイト「格安SIMえらびナビ」の記事企画を担当しています。

サイトの特徴：
- 楽天モバイルを最優先で推奨するアフィリエイトサイト
- 格安SIM（MVNO）の比較・選び方・キャンペーン情報を提供
- ターゲット：格安SIMへの乗り換え・新規契約を検討中のユーザー

今日の日付: ${today}`;

  const userPrompt = `以下の既存記事と重複しない、新しい記事テーマを1つ選定してください。
${prioritySection}
【既存記事一覧】
${existingList}

【選定条件】
1. 既存記事と内容・テーマが重複しないこと
2. 検索ボリュームが見込めるキーワードを含むこと
3. 「乗り換え・新規契約を検討中」のユーザーが検索しそうなテーマ
4. 今の季節（${today.substring(5, 7)}月）や時事性があればなお良い
5. まだカバーできていない視点・ユーザー層を狙うこと
6. 「ペルソナ特化テーマ（未作成の場合は優先的に選ぶ）」のテーマがまだ作成されていない場合は、それらを最優先で選ぶこと
7. テーマのバランスを保つこと
   - IIJmio・楽天モバイル・mineo・UQ mobile・Y!mobile・LINEMO・ahamoを均等に扱う
   - 特定SIMへの偏りを避け、格安SIM全般の比較・選び方記事も積極的に作成する

【候補テーマ例（参考：使用済みでなければ選んでも良い）】
＜IIJmio関連＞
- IIJmioとは？料金・速度・メリット・デメリットを徹底解説
- IIJmioのeSIM申し込み手順と開通までの流れ
- IIJmioのキャンペーン最新情報と特典の受け取り方
- IIJmioのデータシェア・家族プランでどれだけ節約できるか
- IIJmioのMNP乗り換え手順と注意点まとめ
＜格安SIM比較・全般＞
- 格安SIMとは？大手キャリアとの違いをわかりやすく解説
- 格安SIMのデメリットと失敗しない選び方
- 格安SIMへの乗り換え手順（MNP）完全ガイド
- データ3GB以下ユーザーに最適な格安SIMランキング
- ドコモ・au・ソフトバンクからの乗り換えで一番お得な格安SIM
- 格安SIMのeSIMとは？メリット・デメリットと対応SIM一覧
- スマホ代を月1,000円以下にする節約術
- 格安SIMの速度計測と昼間の混雑帯に強いSIMランキング
- 家族4人で格安SIMに乗り換えると年間いくら節約できるか
- 格安SIMのSIMフリー端末おすすめと購入方法
- 格安SIMの解約・MNP転出手順と注意点
＜ペルソナ特化テーマ（未作成の場合は優先的に選ぶ）＞
- 月のスマホ代を1,000円以下にしたい節約上手向けSIM（ペルソナ：固定費を徹底的に削減したい20〜30代。LINEMOミニプランや楽天モバイルの最安プランを紹介。推奨スラッグ: smartphone-dai-1000en-ikka-kakuyasu-sim）
- 子どものスマホデビューに最適な格安SIM（ペルソナ：子どもに初めてスマホを持たせる親。フィルタリング・データ制限・料金を重視。推奨スラッグ: kodomo-smartphone-debut-kakuyasu-sim）
- 定年後・シニアが安心して使える格安SIM（ペルソナ：スマホ操作が不安な60代以上。サポート・乗り換えのハードルを低く解説。推奨スラッグ: senior-kakuyasu-sim-osusume-funan）
- 海外旅行に使える格安SIM・データSIM完全ガイド（ペルソナ：年に数回海外に行くビジネスパーソン・旅行好き。ahamo・楽天モバイルの海外利用を紹介。推奨スラッグ: kaigai-ryoko-kakuyasu-sim-data-sim）

以下のJSON形式のみで回答してください（コードブロック不要）：
{
  "theme": "記事テーマのタイトル（日本語）",
  "targetKeyword": "メインキーワード（検索されそうな語句）",
  "subKeywords": ["サブキーワード1", "サブキーワード2", "サブキーワード3"],
  "searchIntent": "このキーワードで検索するユーザーの意図（1〜2文）",
  "targetReader": "ターゲット読者のペルソナ（1〜2文）",
  "uniqueAngle": "既存記事にはない、この記事ならではの切り口・価値（1〜2文）",
  "suggestedSlug": "URLスラッグ（英小文字・ハイフン区切り・既存スラッグと重複なし）"
}`;

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  // JSON抽出（コードブロックあり・なし両対応）
  const jsonMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/) ?? [null, text];
  const topic: SelectedTopic = JSON.parse((jsonMatch[1] ?? text).trim());

  console.log(`   テーマ: ${topic.theme}`);
  console.log(`   キーワード: ${topic.targetKeyword}`);
  console.log(`   切り口: ${topic.uniqueAngle}`);
  return topic;
}

// ----------------------------------------------------------------
// Phase 2: 記事構成（アウトライン）設計エージェント
// ----------------------------------------------------------------
interface ArticleOutline {
  title: string;
  excerpt: string;
  category: string;
  categoryColor: "orange" | "blue" | "green";
  emoji: string;
  slug: string;
  seoSummary: string;
  sections: {
    heading: string;
    purpose: string;
    keyPoints: string[];
    blockTypes: string[];
    ctaPlacement?: boolean;
  }[];
  dataToInclude: string[];
  tableNeeded: boolean;
  chartNeeded: boolean;
  faqQuestions: string[];
}

async function phase2CreateOutline(
  topic: SelectedTopic,
  today: string
): Promise<ArticleOutline> {
  console.log("📋 Phase 2: 記事構成（アウトライン）設計中...");

  const systemPrompt = `あなたはSEOコンテンツのエディターです。
格安SIMアフィリエイトサイト向けに、質の高い記事構成を設計することが専門です。

設計基準：
- 読者の疑問を論理的な順序で解消する構成
- 「結論→理由→根拠→補足」の流れ
- 楽天モバイルを自然に推奨できる構成
- 表・グラフは本当に必要な場合のみ（全体で最大2個）
- CTAは序盤・中盤・末尾の3箇所`;

  const userPrompt = `以下のテーマ・キーワードで記事構成を設計してください。

【テーマ】${topic.theme}
【メインキーワード】${topic.targetKeyword}
【サブキーワード】${topic.subKeywords.join("、")}
【検索意図】${topic.searchIntent}
【ターゲット読者】${topic.targetReader}
【この記事の独自の切り口】${topic.uniqueAngle}
【公開日】${today}

設計してほしいもの：
1. SEO最適化されたタイトル（32文字以内）
2. メタdescription用のexcerpt（60文字以内）
3. 記事全体の見出し構成（h2セクション7〜10個）
4. 各セクションの目的・要点・使うブロックタイプ
5. 記事に含めるべき具体的なデータ・数値
6. 表・グラフが必要かどうかの判断（必要な場合はどんなデータを載せるか）
7. FAQセクション用の質問（3〜5個）

以下のJSON形式のみで回答してください（コードブロック不要）：
{
  "title": "記事タイトル（32文字以内）",
  "excerpt": "記事要約（60文字以内）",
  "category": "比較 または 初心者 または お得情報 または レビュー または 速度",
  "categoryColor": "orange または blue または green",
  "emoji": "記事内容に合う絵文字1つ",
  "slug": "${topic.suggestedSlug}",
  "seoSummary": "この記事のSEO上の強み（どんな検索意図に応えるか・1文）",
  "sections": [
    {
      "heading": "見出しテキスト",
      "purpose": "このセクションの目的",
      "keyPoints": ["要点1", "要点2", "要点3"],
      "blockTypes": ["使うブロックタイプ（paragraph/list/table/bar_chart/steps/definition_list/callout）"],
      "ctaPlacement": false
    }
  ],
  "dataToInclude": ["含めるべきデータ・数値の例"],
  "tableNeeded": false,
  "chartNeeded": false,
  "faqQuestions": ["FAQの質問1", "FAQの質問2", "FAQの質問3"]
}`;

  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // JSONを抽出（コードブロックあり・なし両対応）
  let jsonStr = text;
  const codeBlockMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1];
  }

  // 不完全なJSONを修復（末尾が途中で切れた場合に閉じ括弧を補完）
  let outline: ArticleOutline;
  try {
    outline = JSON.parse(jsonStr.trim());
  } catch {
    // 末尾に "}" が足りない場合は補完して再試行
    const fixed = jsonStr.trim().replace(/,?\s*$/, "") + "\n}}";
    try {
      outline = JSON.parse(fixed);
    } catch {
      console.error("Phase 2 JSONパース失敗。レスポンス先頭500字:\n", text.substring(0, 500));
      throw new Error("Phase 2: JSONのパースに失敗しました");
    }
  }

  console.log(`   タイトル: ${outline.title}`);
  console.log(`   セクション数: ${outline.sections?.length ?? 0}`);
  console.log(`   表: ${outline.tableNeeded} / グラフ: ${outline.chartNeeded}`);
  return outline;
}

// ----------------------------------------------------------------
// Phase 3: 記事本文生成エージェント
// ----------------------------------------------------------------
const WRITER_SYSTEM_PROMPT = `あなたは格安SIM・スマホ通信業界に10年以上携わる専門ライターです。
MVNO各社の料金体系・回線品質・手続きの違いを熟知しており、
実際に複数の格安SIMへの申し込み・速度計測・MNP手続きを自ら行った体験をもとに情報を発信しています。

【ライティング方針】
- 読者はすでに乗り換え意思がある前提で書く
- 押しつけがましくならない程度に背中を押す（「〜すべき」「〜しなければ」は使わず「〜がおすすめです」等に）
- 事実と根拠をセットで書く（「安い」ではなく「月額850円で業界最安水準」）
- 「この記事では〜」「筆者が〜」などAIらしい前置きを使わない
- 文体は必ず「です」「ます」調（敬体）で統一する。「だ」「である」調は使わない
- 自然な人間のライターが書いたような、読みやすく簡潔な文体にする
- 箇条書きの先頭に「・」「•」「-」「STEP X：」などを使わない
- list の各itemに「**名前**：説明」形式を使わない
- list は1記事で3〜4箇所まで。1つのitemsは3〜6個に抑える
- 手順・ステップは steps ブロックを使う
- 「名称：説明文」の対応は definition_list ブロックを使う

【一次情報・体験談の組み込みルール】
- 記事内に editorial_note ブロックを1〜2箇所挿入する（必須）
- editorial_note には以下のような一次情報・体験談を書く
  - 「編集部が実際にIIJmioのeSIMを申し込んだところ〜」
  - 「速度を計測したところ〜Mbpsでした」
  - 「MNP手続きを試したところ〜日で完了しました」
  - 「実際の請求明細を確認したところ〜」
- 提供された実測データ・体験談データを積極的に引用する
- 数値は具体的に（「速い」ではなく「下り平均47Mbps」）

【テキスト装飾ルール】
- paragraph と list の text で以下を積極活用
  - **テキスト** → 太字（重要な数値・サービス名・結論などに。1段落に1〜3箇所）
  - ==テキスト== → 黄色マーカー（最強調キーフレーズ。1段落に0〜1箇所）
  - [テキスト](URL) → インラインリンク（公式サイトへの自然な誘導に使う。1記事に2〜4箇所）
    例: [IIJmioの公式サイトはこちら](#)
    【重要】サイト内記事へのリンクは必ず /blog/スラッグ/ の形式にする（例: /blog/kakuyasu-sim-beginners-guide/）
    /スラッグ だけ（/blog/ なし）のリンクは404になるため絶対に使わない
- heading2 / heading3 / callout / table / bar_chart には装飾記法を使わない

【アフィリエイト方針】
- 記事全体を通じて楽天モバイルが最良の選択であることを自然に訴求
- CTAは序盤・中盤・末尾の3箇所に配置
- まとめでは楽天モバイルをおすすめする理由を簡潔にまとめ自然なクロージング`;

async function phase3WriteArticle(
  topic: SelectedTopic,
  outline: ArticleOutline,
  today: string,
  existingArticles: { slug: string; title: string; category: string }[]
): Promise<object> {
  console.log("✍️  Phase 3: 記事本文生成中...");

  const sectionsDesc = outline.sections
    .map(
      (s, i) =>
        `セクション${i + 1}: 「${s.heading}」\n  目的: ${s.purpose}\n  要点: ${s.keyPoints.join("、")}\n  ブロック: ${s.blockTypes.join(", ")}${s.ctaPlacement ? "\n  ★CTA配置" : ""}`
    )
    .join("\n\n");

  const userPrompt = `以下のアウトラインに従い、記事本文JSONを生成してください。

【記事情報】
タイトル: ${outline.title}
メインキーワード: ${topic.targetKeyword}
サブキーワード: ${topic.subKeywords.join("、")}
読者ペルソナ: ${topic.targetReader}
独自の切り口: ${topic.uniqueAngle}

【含めるべきデータ・数値】
${outline.dataToInclude.join("\n")}

【編集部の実測データ・体験談（editorial_noteに積極活用すること）】
＜速度実測値＞
${Object.entries(editorialData.speedTests).map(([name, d]) => `- ${name}：下り平均${d.down}Mbps・上り平均${d.up}Mbps（${d.testedAt}・${d.env}）`).join("\n")}

＜体験談＞
${Object.entries(editorialData.experiences).map(([name, text]) => `- ${name}：${text}`).join("\n")}

【記事構成（アウトライン）】
${sectionsDesc}

【FAQセクション（記事末尾に必ず含める）】
${outline.faqQuestions.map((q) => `- ${q}`).join("\n")}

【表・グラフ指示】
- 表（table）が必要: ${outline.tableNeeded}
- グラフ（bar_chart）が必要: ${outline.chartNeeded}
- 表・グラフは合計最大2個まで

【推奨するSIM（CTA用）】
- 第1位：楽天モバイル（最優先・rankIndex: 1）
- 第2位：IIJmio（rankIndex: 0）
- 第3位：mineo（rankIndex: 2）
- 第4位：UQ mobile（rankIndex: 3）
- 第5位：Y!mobile（rankIndex: 4）
- 第6位：LINEMO（rankIndex: 5）
- 第7位：ahamo（rankIndex: 6）

【内部リンク（関連記事）】
以下の既存記事の中から、今回の記事テーマと関連性の高いものを2〜3件選び、
記事の末尾（まとめの直後）に related_articles ブロックとして必ず含めること。
${existingArticles.slice(0, 30).map((a) => `- slug: "${a.slug}", title: "${a.title}"`).join("\n")}

【出力量の制約】
- contentブロックの合計は20〜28個に収める（多すぎるとJSONが途切れる）
- paragraphは1セクションにつき1〜2個まで
- 1つのparagraphは150文字以内に抑える
- listのitemsは1つにつき4個まで
- stepsのitemsは1つにつき4個まで

【出力形式】
以下のJSON形式のみ。コードブロック（\`\`\`json）で囲むこと。

{
  "slug": "${outline.slug}",
  "title": "${outline.title}",
  "excerpt": "${outline.excerpt}",
  "category": "${outline.category}",
  "categoryColor": "${outline.categoryColor}",
  "emoji": "${outline.emoji}",
  "publishedAt": "${today}",
  "content": [
    { "type": "callout", "emoji": "絵文字", "text": "この記事でわかること" },
    { "type": "heading2", "text": "見出し" },
    { "type": "paragraph", "text": "本文テキスト。**重要語句**や==強調フレーズ==を使う" },
    { "type": "list", "items": ["箇条書き1", "**重要**な箇条書き2"] },
    { "type": "ranking_cta", "rankIndex": 0 },
    { "type": "steps", "items": [{ "title": "ステップタイトル", "description": "説明文" }] },
    { "type": "definition_list", "items": [{ "term": "名称", "description": "説明文" }] },
    { "type": "table", "headers": ["項目", "楽天モバイル", "IIJmio"], "rows": [["月額料金", "1,078円〜", "850円〜"]] },
    { "type": "bar_chart", "title": "下り速度比較（実測）", "items": [{ "label": "楽天モバイル", "value": 58, "unit": "Mbps", "color": "bg-red-400" }] },
    { "type": "heading3", "text": "小見出し" },
    { "type": "editorial_note", "text": "編集部が実際に申し込んだところ、〜でした。" },
    { "type": "related_articles", "items": [{ "slug": "existing-slug", "title": "既存記事タイトル" }] }
  ]
}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: WRITER_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  // コードブロック内のJSONを抽出（閉じタグがなくても中身を取り出す）
  let jsonStr: string;
  const closedMatch = text.match(/```json\n([\s\S]*?)\n```/);
  if (closedMatch) {
    jsonStr = closedMatch[1];
  } else {
    // 閉じタグなし：```json の後ろをすべて取る
    const openMatch = text.match(/```json\n([\s\S]*)/);
    if (openMatch) {
      jsonStr = openMatch[1];
    } else {
      jsonStr = text;
    }
  }

  // JSONパース（失敗時は末尾を補完して再試行）
  let article: Record<string, unknown>;
  try {
    article = JSON.parse(jsonStr.trim());
  } catch {
    // content配列が途中で切れた場合、閉じ括弧を補完
    const trimmed = jsonStr.trim().replace(/,\s*$/, "");
    const fixed = trimmed + "\n]}";
    try {
      article = JSON.parse(fixed);
      console.log("⚠️  JSONを補完して修復しました");
    } catch {
      console.error("Phase 3 JSONパース失敗。レスポンス先頭500字:\n", text.substring(0, 500));
      process.exit(1);
    }
  }

  console.log(`   生成完了: ${(article.content as unknown[])?.length ?? 0} ブロック`);
  return article;
}

// ----------------------------------------------------------------
// Phase 4: サムネイル画像生成（Imagen 3）
// ----------------------------------------------------------------
async function phase4GenerateThumbnail(
  title: string,
  category: string,
  slug: string
): Promise<string | null> {
  if (!process.env.GOOGLE_AI_STUDIO_API_KEY) {
    console.log("⏭️  Phase 4: GOOGLE_AI_STUDIO_API_KEY 未設定のためスキップ");
    return null;
  }
  console.log("🖼️  Phase 4: サムネイル画像生成中（Nano Banana 2）...");

  const categoryThemes: Record<string, string[]> = {
    比較: [
      "two smartphones side by side with checkmarks and arrows, blue and orange accents",
      "balance scale with wifi symbols on each side, teal and coral accents",
      "split-screen layout with colorful icons on each half, indigo and amber accents",
      "two overlapping circles (Venn diagram style) with network icons, sky blue and peach accents",
      "clipboard with comparison checklist, stars and badges, navy and orange accents",
    ],
    初心者: [
      "friendly character holding a glowing lightbulb, green and teal accents",
      "open book with wifi signal and sparkles flying out, mint and yellow accents",
      "graduation cap on a router with stars around it, purple and lime accents",
      "smiling cloud character with signal bars, soft blue and green accents",
      "map with a route leading to a wifi symbol, warm green and sky blue accents",
    ],
    お得情報: [
      "coins and stars bursting from an envelope, warm orange and yellow accents",
      "percent sign badge surrounded by sparkles and ribbons, red and gold accents",
      "treasure chest with wifi icons floating out, amber and teal accents",
      "calendar with sale tags and confetti, coral and yellow accents",
      "shopping bag with lightning bolt and coins, orange and green accents",
    ],
    レビュー: [
      "magnifying glass zooming into a star rating, neutral gray and blue accents",
      "five stars on a podium with a ribbon badge, gold and indigo accents",
      "clipboard with checkmarks and a thumb-up icon, slate blue and orange accents",
      "detective character with magnifying glass and wifi signal, teal and coral accents",
      "report card with A+ grade and sparkles, purple and yellow accents",
    ],
    速度: [
      "rocket launching from a router with speed lines, electric blue and purple accents",
      "stopwatch with lightning bolt and wifi signal, cyan and orange accents",
      "speedometer gauge going to maximum with sparks, red and blue accents",
      "cheetah silhouette with fiber optic streaks, green and electric blue accents",
      "running character holding a wifi flag, yellow and indigo accents",
    ],
  };
  const defaultThemes = [
    "fiber optic cables glowing with colorful light trails, modern blue and purple accents",
    "house with wifi signal and connected devices floating around it, teal and orange accents",
    "network nodes connected by glowing lines forming a constellation, indigo and cyan accents",
    "smartphone and laptop connected by a rainbow arc, pastel multicolor accents",
    "globe with wifi signal rings expanding outward, sky blue and coral accents",
  ];
  const themes = categoryThemes[category] ?? defaultThemes;
  const theme = themes[Math.floor(Math.random() * themes.length)];

  const prompt = `Flat vector illustration style blog thumbnail. Theme: ${theme}. Topic relates to: "${title}". Cute and friendly Japanese illustration style, pastel colors, simple shapes, rounded edges, minimalist background gradient. 文字は入れない。Absolutely no text, no letters, no numbers, no characters, no symbols of any kind anywhere in the image. 16:9 wide banner format.`;

  try {
    const response = await genai.models.generateContent({
      model: "gemini-3.1-flash-image-preview",
      contents: prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    // レスポンスから画像データを取得
    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p: { inlineData?: { data?: string; mimeType?: string } }) => p.inlineData?.data);
    if (!imagePart?.inlineData?.data) {
      console.log("⚠️  画像データが取得できませんでした");
      return null;
    }

    // public/thumbnails/ に保存
    if (!fs.existsSync(THUMBNAILS_DIR)) {
      fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
    }
    const ext = imagePart.inlineData.mimeType === "image/png" ? "png" : "jpg";
    const imagePath = path.join(THUMBNAILS_DIR, `${slug}.${ext}`);
    fs.writeFileSync(imagePath, Buffer.from(imagePart.inlineData.data, "base64"));

    console.log(`   保存完了: public/thumbnails/${slug}.${ext}`);
    return `/thumbnails/${slug}.${ext}`;
  } catch (err) {
    console.log(`⚠️  画像生成エラー（スキップ）: ${(err as Error).message}`);
    return null;
  }
}

// ----------------------------------------------------------------
// メイン処理
// ----------------------------------------------------------------
async function main(): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  console.log(`\n🚀 記事自動生成 v2 開始 (${today})\n`);

  // 既存記事読み込み
  const existingArticles = loadExistingArticles();
  console.log(`📚 既存記事数: ${existingArticles.length}件\n`);

  // Search Console 優先クエリの読み込み
  const priorityTopicsFile = path.join(process.cwd(), "content/gsc-priority-topics.json");
  let priorityTopics: { query: string; impressions: number; position: number }[] = [];
  if (fs.existsSync(priorityTopicsFile)) {
    priorityTopics = JSON.parse(fs.readFileSync(priorityTopicsFile, "utf-8"));
    if (priorityTopics.length > 0) {
      console.log(`🎯 Search Console 優先クエリ: ${priorityTopics.length}件を Phase 1 に注入\n`);
    }
  }

  // Phase 1: キーワード・トピック選定
  const topic = await phase1SelectTopic(existingArticles, today, priorityTopics);
  console.log();

  // Phase 2: 記事構成設計
  const outline = await phase2CreateOutline(topic, today);
  console.log();

  // Phase 3: 記事本文生成
  const article = await phase3WriteArticle(topic, outline, today, existingArticles) as Record<string, unknown>;
  console.log();

  // スラッグ重複チェック
  const existingSlugs = new Set(existingArticles.map((a) => a.slug));
  let slug = (article.slug as string) ?? outline.slug;
  if (existingSlugs.has(slug)) {
    slug = `${slug}-${Date.now()}`;
    article.slug = slug;
    console.log(`⚠️  スラッグが重複したため変更: ${slug}`);
  }

  // Phase 4: サムネイル画像生成
  const thumbnail = await phase4GenerateThumbnail(
    article.title as string,
    article.category as string,
    slug
  );
  if (thumbnail) {
    article.thumbnail = thumbnail;
  }
  console.log();

  // 保存
  const outputPath = path.join(ARTICLES_DIR, `${slug}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(article, null, 2), "utf-8");

  console.log(`✅ 記事を保存しました: content/articles/${slug}.json`);
  console.log(`   タイトル: ${article.title}`);
  console.log(`   カテゴリ: ${article.category}`);
  console.log(`   キーワード: ${topic.targetKeyword}`);
}

main().catch((err) => {
  console.error("エラー:", err);
  process.exit(1);
});
