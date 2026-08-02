/**
 * キャンペーン情報自動更新スクリプト
 * 使い方: npx tsx scripts/update-campaign.ts
 * GitHub Actions で毎月1日に自動実行
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DATA_FILE = path.join(process.cwd(), "lib/data.ts");

// 確認対象のSIMとアフィリエイトURL
// TODO: アフィリエイト登録後に各URLを更新してください
const PROVIDERS = [
  {
    name: "楽天モバイル",
    field: 'name: "楽天モバイル"',
    url: "#",
  },
  {
    name: "IIJmio",
    field: 'name: "IIJmio"',
    url: "#",
  },
  {
    name: "mineo",
    field: 'name: "mineo"',
    url: "#",
  },
  {
    name: "UQ mobile",
    field: 'name: "UQ mobile"',
    url: "#",
  },
  {
    name: "Y!mobile",
    field: 'name: "Y!mobile"',
    url: "#",
  },
  {
    name: "LINEMO",
    field: 'name: "LINEMO"',
    url: "#",
  },
];

interface RewardInfo {
  label: string;
  value: string;
}

async function fetchCampaignInfo(
  providerName: string,
  url: string
): Promise<RewardInfo | null> {
  console.log(`  🔍 ${providerName} のキャンペーン情報を取得中...`);

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `以下のURLにアクセスして、格安SIMのキャッシュバックやポイント還元などのキャンペーン情報を取得してください。

URL: ${url}

回線名: ${providerName}

キャンペーンの最大金額・ポイント数・特典内容を確認して、以下のJSON形式で回答してください。
取得できない場合は null を返してください。

{
  "label": "キャッシュバック" または "dポイント" など特典の種類,
  "value": "最大○○円" または "○○pt" など金額・数量
}

JSONのみを返してください。コードブロックは不要です。`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text.trim() : "";

    if (text === "null" || !text) return null;

    // JSONを抽出（コードブロックが含まれている場合も対処）
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const reward = JSON.parse(jsonMatch[0]) as RewardInfo;
    console.log(`    ✅ ${providerName}: ${reward.label} / ${reward.value}`);
    return reward;
  } catch (err) {
    console.error(`    ❌ ${providerName} の取得に失敗:`, err);
    return null;
  }
}

function getCurrentReward(dataContent: string, providerName: string): RewardInfo | null {
  // reward: { label: "...", value: "..." } を抽出
  const escaped = providerName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `name: "${escaped}"[\\s\\S]*?reward: \\{ label: "([^"]*)", value: "([^"]*)" \\}`,
    "m"
  );
  const match = dataContent.match(regex);
  if (!match) return null;
  return { label: match[1], value: match[2] };
}

function updateRewardInFile(
  dataContent: string,
  providerName: string,
  currentReward: RewardInfo,
  newReward: RewardInfo
): string {
  // 対象のreward行を新しい値で置換
  const escaped = providerName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const oldStr = `reward: { label: "${currentReward.label}", value: "${currentReward.value}" }`;
  const newStr = `reward: { label: "${newReward.label}", value: "${newReward.value}" }`;

  // providerNameブロック内のreward行のみ置換（最初の1件）
  const providerBlockRegex = new RegExp(
    `(name: "${escaped}"[\\s\\S]*?)${oldStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
    "m"
  );
  return dataContent.replace(providerBlockRegex, `$1${newStr}`);
}

async function main(): Promise<void> {
  console.log("📊 キャンペーン情報の自動更新を開始します\n");

  let dataContent = fs.readFileSync(DATA_FILE, "utf-8");
  let updated = false;

  for (const provider of PROVIDERS) {
    const current = getCurrentReward(dataContent, provider.name);
    if (!current) {
      console.log(`  ⚠️  ${provider.name} の現在値が見つかりません。スキップします。`);
      continue;
    }

    const newReward = await fetchCampaignInfo(provider.name, provider.url);

    if (!newReward) {
      console.log(`  ⏭️  ${provider.name} は取得できなかったためスキップ`);
      continue;
    }

    if (
      current.label === newReward.label &&
      current.value === newReward.value
    ) {
      console.log(`  ℹ️  ${provider.name} は変更なし`);
      continue;
    }

    console.log(
      `  🔄 ${provider.name}: "${current.label}/${current.value}" → "${newReward.label}/${newReward.value}"`
    );
    dataContent = updateRewardInFile(
      dataContent,
      provider.name,
      current,
      newReward
    );
    updated = true;

    // API レート制限対策
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (updated) {
    fs.writeFileSync(DATA_FILE, dataContent, "utf-8");
    console.log("\n✅ lib/data.ts を更新しました");
  } else {
    console.log("\nℹ️  更新なし（変更は必要ありませんでした）");
  }
}

main().catch((err) => {
  console.error("エラー:", err);
  process.exit(1);
});
