/**
 * GA4 + Search Console データ分析スクリプト
 *
 * 【必要な GitHub Secrets】
 *   GOOGLE_SERVICE_ACCOUNT_JSON : サービスアカウントのJSONキー文字列
 *   GSC_SITE_URL                : 例） https://www.sim-choice.jp/
 *   GA4_PROPERTY_ID             : 例） properties/123456789  （省略すると GA4 をスキップ）
 *
 * 【出力ファイル】
 *   content/gsc-priority-slugs.json  : リライト優先スラッグ一覧（GSC 4〜20位ページ）
 *   content/gsc-priority-topics.json : 新規記事候補クエリ一覧（GSC 高インプレッション）
 *
 * 【Google Cloud での設定手順】
 *   1. Google Cloud Console でサービスアカウントを作成し、JSONキーをダウンロード
 *   2. Search Console API と Google Analytics Data API を有効化
 *   3. Search Console のプロパティ設定でサービスアカウントのメールを「ユーザー（閲覧者）」として追加
 *   4. GA4 の管理 → プロパティのアクセス管理でサービスアカウントのメールを「閲覧者」として追加
 *   5. JSONの中身を GitHub Secrets → GOOGLE_SERVICE_ACCOUNT_JSON に登録
 */

import { google } from "googleapis";
import fs from "fs";
import path from "path";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");
const CONTENT_DIR = path.join(process.cwd(), "content");

// ----------------------------------------------------------------
// 既存記事の読み込み
// ----------------------------------------------------------------
interface ArticleInfo {
  slug: string;
  title: string;
  keywords: string;
}

function getExistingArticles(): ArticleInfo[] {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const data = JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8"));
      const slugWords = path.basename(f, ".json").replace(/-/g, " ");
      return {
        slug: path.basename(f, ".json"),
        title: data.title ?? "",
        keywords: `${data.title ?? ""} ${data.excerpt ?? ""} ${slugWords}`.toLowerCase(),
      };
    });
}

// ----------------------------------------------------------------
// URLからブログスラッグを抽出
// ----------------------------------------------------------------
function extractSlug(url: string, siteUrl: string): string | null {
  const base = siteUrl.replace(/\/$/, "");
  const match = url.replace(base, "").match(/^\/blog\/([^/]+)\/?$/);
  return match ? match[1] : null;
}

// ----------------------------------------------------------------
// クエリが既存記事でカバー済みか判定（2単語以上一致で「カバー済み」）
// ----------------------------------------------------------------
function isCoveredByExistingArticle(query: string, articles: ArticleInfo[]): boolean {
  const queryWords = query.toLowerCase().split(/[\s・　]+/).filter((w) => w.length >= 3);
  return articles.some((a) => {
    const matches = queryWords.filter((w) => a.keywords.includes(w)).length;
    return matches >= Math.min(2, queryWords.length);
  });
}

// ----------------------------------------------------------------
// 日付ヘルパー
// ----------------------------------------------------------------
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

// ----------------------------------------------------------------
// Search Console 分析
// ----------------------------------------------------------------
interface PriorityTopic {
  query: string;
  impressions: number;
  position: number;
}

async function analyzeSearchConsole(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  auth: any,
  siteUrl: string,
  articles: ArticleInfo[]
): Promise<{ prioritySlugs: string[]; priorityTopics: PriorityTopic[] }> {
  const webmasters = google.webmasters({ version: "v3", auth });
  const startDate = daysAgo(28);
  const endDate = daysAgo(1);

  console.log(`  📡 Search Console: ${startDate} 〜 ${endDate} のデータを取得中...`);

  // ページ別データ（リライト候補）
  const pageRes = await webmasters.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["page"],
      dimensionFilterGroups: [
        {
          filters: [
            { dimension: "page", operator: "contains", expression: "/blog/" },
          ],
        },
      ],
      rowLimit: 100,
    },
  });

  const pageRows = pageRes.data.rows ?? [];

  // 4〜20位 かつ表示回数30以上 → リライト優先候補
  const prioritySlugs = pageRows
    .filter((row) => {
      const pos = row.position ?? 99;
      const imp = row.impressions ?? 0;
      return pos >= 4 && pos <= 20 && imp >= 30;
    })
    .sort((a, b) => {
      // 10位以内を優先、次にインプレッション数が多いもの
      const aTop = (a.position ?? 99) <= 10 ? 1 : 0;
      const bTop = (b.position ?? 99) <= 10 ? 1 : 0;
      return bTop - aTop || (b.impressions ?? 0) - (a.impressions ?? 0);
    })
    .slice(0, 5)
    .map((row) => extractSlug(row.keys?.[0] ?? "", siteUrl))
    .filter((slug): slug is string => slug !== null)
    .filter((slug) => articles.some((a) => a.slug === slug));

  console.log(`  ✅ リライト優先候補: ${prioritySlugs.length}件`);
  prioritySlugs.forEach((s, i) => {
    const row = pageRows.find((r) => r.keys?.[0]?.includes(s));
    console.log(
      `     ${i + 1}. ${s}（${row?.position?.toFixed(1)}位・${row?.impressions}imp）`
    );
  });

  // クエリ別データ（新規記事候補）
  const queryRes = await webmasters.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["query"],
      rowLimit: 200,
    },
  });

  const queryRows = queryRes.data.rows ?? [];

  // インプレッション50以上 かつ CTR3%未満 かつ 既存記事でカバーされていない
  const priorityTopics: PriorityTopic[] = queryRows
    .filter((row) => {
      const imp = row.impressions ?? 0;
      const ctr = row.ctr ?? 0;
      return imp >= 50 && ctr < 0.03;
    })
    .filter((row) => !isCoveredByExistingArticle(row.keys?.[0] ?? "", articles))
    .sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0))
    .slice(0, 8)
    .map((row) => ({
      query: row.keys?.[0] ?? "",
      impressions: row.impressions ?? 0,
      position: Math.round((row.position ?? 99) * 10) / 10,
    }));

  console.log(`  ✅ 新規記事候補クエリ: ${priorityTopics.length}件`);
  priorityTopics.forEach((t, i) =>
    console.log(`     ${i + 1}. 「${t.query}」（${t.impressions}imp・${t.position}位）`)
  );

  return { prioritySlugs, priorityTopics };
}

// ----------------------------------------------------------------
// GA4 分析（低エンゲージメントページをリライト候補に追加）
// ----------------------------------------------------------------
async function analyzeGA4(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  auth: any,
  propertyId: string,
  articles: ArticleInfo[]
): Promise<string[]> {
  const analyticsdata = google.analyticsdata({ version: "v1beta", auth });

  console.log(`  📡 GA4（${propertyId}）: データを取得中...`);

  const res = await analyticsdata.properties.runReport({
    property: propertyId,
    requestBody: {
      dateRanges: [{ startDate: "28daysAgo", endDate: "yesterday" }],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "sessions" }, { name: "engagementRate" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: { matchType: "CONTAINS", value: "/blog/" },
        },
      },
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: "50",
    },
  }) as { data: { rows?: Array<{ dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }> } };

  const rows = res.data.rows ?? [];

  // セッション20以上 かつ エンゲージメント率40%未満 → リライト候補
  const lowEngagementSlugs = rows
    .filter((row) => {
      const sessions = parseInt(row.metricValues?.[0]?.value ?? "0", 10);
      const engRate = parseFloat(row.metricValues?.[1]?.value ?? "1");
      return sessions >= 20 && engRate < 0.4;
    })
    .map((row) => {
      const pagePath = row.dimensionValues?.[0]?.value ?? "";
      const match = pagePath.match(/^\/blog\/([^/]+)\/?$/);
      return match ? match[1] : null;
    })
    .filter((slug): slug is string => slug !== null)
    .filter((slug) => articles.some((a) => a.slug === slug));

  console.log(`  ✅ 低エンゲージメント候補（GA4）: ${lowEngagementSlugs.length}件`);
  return lowEngagementSlugs;
}

// ----------------------------------------------------------------
// メイン
// ----------------------------------------------------------------
async function main(): Promise<void> {
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const siteUrl = process.env.GSC_SITE_URL ?? "https://www.sim-choice.jp/";
  const ga4PropertyId = process.env.GA4_PROPERTY_ID;

  // JSON キーか Workload Identity Federation（ADC）のどちらかが必要
  const useAdc = !serviceAccountJson && process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!serviceAccountJson && !useAdc) {
    console.error(
      "❌ 認証情報が設定されていません。GOOGLE_SERVICE_ACCOUNT_JSON または " +
      "Workload Identity Federation（GOOGLE_APPLICATION_CREDENTIALS）を設定してください。"
    );
    process.exit(0);
  }

  console.log("📊 データ分析開始...\n");
  if (useAdc) {
    console.log("   認証方式: Workload Identity Federation（ADC）\n");
  } else {
    console.log("   認証方式: サービスアカウントJSON\n");
  }
  const articles = getExistingArticles();
  console.log(`   既存記事: ${articles.length}件\n`);

  const auth = new google.auth.GoogleAuth({
    ...(serviceAccountJson ? { credentials: JSON.parse(serviceAccountJson) } : {}),
    scopes: [
      "https://www.googleapis.com/auth/webmasters.readonly",
      "https://www.googleapis.com/auth/analytics.readonly",
    ],
  });

  let prioritySlugs: string[] = [];
  let priorityTopics: PriorityTopic[] = [];

  // Search Console 分析
  console.log("🔍 Search Console 分析...");
  try {
    const result = await analyzeSearchConsole(auth, siteUrl, articles);
    prioritySlugs = result.prioritySlugs;
    priorityTopics = result.priorityTopics;
  } catch (e) {
    console.warn(`  ⚠️ Search Console 取得エラー: ${e instanceof Error ? e.message : e}`);
  }

  // GA4 分析（設定されている場合のみ）
  if (ga4PropertyId) {
    console.log("\n📈 GA4 分析...");
    try {
      const ga4Slugs = await analyzeGA4(auth, ga4PropertyId, articles);
      // GSCとGA4の両方で低パフォーマンスなページを先頭に（重複除去）
      for (const slug of ga4Slugs) {
        if (!prioritySlugs.includes(slug)) {
          prioritySlugs.unshift(slug);
        }
      }
      prioritySlugs = prioritySlugs.slice(0, 5);
    } catch (e) {
      console.warn(`  ⚠️ GA4 取得エラー: ${e instanceof Error ? e.message : e}`);
    }
  } else {
    console.log("\nℹ️ GA4_PROPERTY_ID 未設定のため GA4 分析をスキップ");
  }

  // 結果を書き出し
  fs.writeFileSync(
    path.join(CONTENT_DIR, "gsc-priority-slugs.json"),
    JSON.stringify(prioritySlugs, null, 2),
    "utf-8"
  );
  fs.writeFileSync(
    path.join(CONTENT_DIR, "gsc-priority-topics.json"),
    JSON.stringify(priorityTopics, null, 2),
    "utf-8"
  );

  console.log("\n✅ 分析完了");
  console.log(`   content/gsc-priority-slugs.json  → ${prioritySlugs.length}件`);
  console.log(`   content/gsc-priority-topics.json → ${priorityTopics.length}件`);
}

main().catch((err) => {
  console.error("エラー:", err);
  process.exit(1);
});
