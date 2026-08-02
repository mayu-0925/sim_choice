/**
 * 指定記事のサムネイル画像を生成するスクリプト
 * 使い方: npx tsx scripts/generate-thumbnail.ts <slug>
 * 例: npx tsx scripts/generate-thumbnail.ts docomo-hikari-provider-osusume-hikaku
 */

import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const slug = process.argv[2];
if (!slug) {
  console.error("❌ slugを指定してください");
  console.error("   例: npx tsx scripts/generate-thumbnail.ts docomo-hikari-provider-osusume-hikaku");
  process.exit(1);
}

const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
if (!apiKey) {
  console.error("❌ GOOGLE_AI_STUDIO_API_KEY が設定されていません");
  process.exit(1);
}

const genai = new GoogleGenAI({ apiKey });
const ARTICLES_DIR = path.join(process.cwd(), "content/articles");
const THUMBNAILS_DIR = path.join(process.cwd(), "public/thumbnails");

const categoryTheme: Record<string, string> = {
  比較: "two people comparing documents side by side, blue and orange accents",
  初心者: "friendly character learning about internet, green and teal accents",
  お得情報: "gift boxes and coins floating, warm orange and yellow accents",
  レビュー: "magnifying glass and checkmarks, neutral gray and blue accents",
  速度: "rocket and lightning bolts, electric blue and purple accents",
};

async function main() {
  // 記事JSON読み込み
  const articlePath = path.join(ARTICLES_DIR, `${slug}.json`);
  if (!fs.existsSync(articlePath)) {
    console.error(`❌ 記事が見つかりません: ${articlePath}`);
    process.exit(1);
  }
  const article = JSON.parse(fs.readFileSync(articlePath, "utf-8"));
  console.log(`📄 記事: ${article.title}`);

  // 画像生成
  const theme = categoryTheme[article.category] ?? "internet, fiber optic, modern";
  const prompt = `Flat vector illustration style blog thumbnail. Theme: ${theme}. Topic relates to: "${article.title}". Cute and friendly Japanese illustration style, pastel colors, simple shapes, rounded edges, minimalist background gradient. 文字は入れない。Absolutely no text, no letters, no numbers, no characters, no symbols of any kind anywhere in the image. 16:9 wide banner format.`;

  console.log("🖼️  Nano Banana 2 で画像生成中...");
  const response = await genai.models.generateContent({
    model: "gemini-3.1-flash-image-preview",
    contents: prompt,
    config: { responseModalities: ["TEXT", "IMAGE"] },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find((p: { inlineData?: { data?: string; mimeType?: string } }) => p.inlineData?.data);
  if (!imagePart?.inlineData?.data) {
    console.error("❌ 画像データが取得できませんでした");
    process.exit(1);
  }

  // 保存
  if (!fs.existsSync(THUMBNAILS_DIR)) fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
  const ext = imagePart.inlineData.mimeType === "image/png" ? "png" : "jpg";
  const imagePath = path.join(THUMBNAILS_DIR, `${slug}.${ext}`);
  fs.writeFileSync(imagePath, Buffer.from(imagePart.inlineData.data, "base64"));

  // 記事JSONのthumbnailフィールドを更新
  article.thumbnail = `/thumbnails/${slug}.${ext}`;
  fs.writeFileSync(articlePath, JSON.stringify(article, null, 2), "utf-8");

  console.log(`✅ 完了: public/thumbnails/${slug}.${ext}`);
}

main().catch((err) => {
  console.error("❌ エラー:", err.message ?? err);
  process.exit(1);
});
