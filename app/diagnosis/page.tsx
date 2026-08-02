"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RankingCard from "@/components/RankingCard";
import { rankingItems } from "@/lib/data";

type Answer = string | null;

const questions = [
  {
    id: "carrier",
    question: "今使っているキャリアはどこですか？",
    emoji: "📡",
    options: [
      { value: "docomo", label: "ドコモ（ahamo含む）", emoji: "🔴" },
      { value: "au", label: "au（UQ mobile含む）", emoji: "🟠" },
      { value: "softbank", label: "ソフトバンク（Y!mobile含む）", emoji: "🟡" },
      { value: "mvno", label: "すでに格安SIM", emoji: "⚪" },
    ],
  },
  {
    id: "data",
    question: "月にどれくらいデータを使いますか？",
    emoji: "📊",
    options: [
      { value: "small", label: "3GB以下（メール・SNS中心）", emoji: "🟢" },
      { value: "medium", label: "3〜10GB（動画も少し見る）", emoji: "🟡" },
      { value: "large", label: "10〜20GB（動画・音楽をよく使う）", emoji: "🟠" },
      { value: "unlimited", label: "20GB以上・無制限希望", emoji: "🔴" },
    ],
  },
  {
    id: "usage",
    question: "スマホの主な使い方は？",
    emoji: "💻",
    options: [
      { value: "line", label: "LINE・SNS・Web検索", emoji: "💬" },
      { value: "video", label: "YouTube・動画視聴", emoji: "🎬" },
      { value: "game", label: "スマホゲーム", emoji: "🎮" },
      { value: "work", label: "テレワーク・ビデオ通話", emoji: "💼" },
    ],
  },
  {
    id: "budget",
    question: "月額料金の目安はどのくらいですか？",
    emoji: "💰",
    options: [
      { value: "ultra", label: "1,000円以下で節約したい", emoji: "💚" },
      { value: "low", label: "〜2,000円くらいで抑えたい", emoji: "💛" },
      { value: "mid", label: "3,000円くらいまで許容できる", emoji: "🧡" },
      { value: "high", label: "品質が良ければ気にしない", emoji: "❤️" },
    ],
  },
  {
    id: "priority",
    question: "SIM選びで一番重視することは？",
    emoji: "🎯",
    options: [
      { value: "price", label: "とにかく料金を安くしたい", emoji: "💴" },
      { value: "speed", label: "速度・安定性を重視したい", emoji: "⚡" },
      { value: "benefits", label: "ポイント還元・特典が欲しい", emoji: "🎁" },
      { value: "support", label: "サポートが充実していると安心", emoji: "🛡️" },
    ],
  },
];

// rankingItems index: 0=楽天モバイル, 1=IIJmio, 2=mineo, 3=UQ mobile, 4=Y!mobile, 5=LINEMO, 6=ahamo
function getRecommendation(answers: Record<string, Answer>) {
  const { carrier, data, usage, budget, priority } = answers;

  // ソフトバンク系セット割
  if (carrier === "softbank" && priority !== "price") {
    return { item: rankingItems[4], reason: "現在ソフトバンク回線をお使いなら、Y!mobileはセット割でさらにお得になります。店舗サポートも充実しています。" };
  }

  // 無制限・大容量 → 楽天モバイル
  if (data === "unlimited" || (data === "large" && budget !== "ultra")) {
    return { item: rankingItems[0], reason: "データ無制限でも3,278円と業界最安水準。楽天ポイントも貯まってお得です。" };
  }

  // LINEギガフリー + 小容量コスパ
  if ((usage === "line" || budget === "ultra") && data === "small") {
    return { item: rankingItems[5], reason: "LINEのデータ消費がゼロ！ミニプラン3GB月990円で維持費を最小限に抑えられます。" };
  }

  // コスパ最重視（小〜中量）→ IIJmio
  if ((budget === "ultra" || budget === "low" || priority === "price") && data !== "unlimited") {
    return { item: rankingItems[1], reason: "2GB月850円〜と業界最安水準。ドコモ・au両回線対応でeSIMにも対応しており、コスパは断トツです。" };
  }

  // ゲーム・速度重視
  if (usage === "game" || priority === "speed") {
    return { item: rankingItems[3], reason: "au回線をそのまま利用する高品質SIM。速度低下が少なく、オンラインゲームにも安定して使えます。" };
  }

  // テレワーク・安定重視
  if (usage === "work" || priority === "support") {
    return { item: rankingItems[2], reason: "ドコモ・au・ソフトバンク全回線対応。万が一の乗り換えも柔軟で、コミュニティサポートも充実しています。" };
  }

  // ポイント・特典重視 → 楽天モバイル
  if (priority === "benefits") {
    return { item: rankingItems[0], reason: "楽天ポイントが最大20,000pt還元！楽天市場のお買い物ポイントアップとあわせてお得に使えます。" };
  }

  // ドコモユーザー + 品質維持
  if (carrier === "docomo" && budget === "high") {
    return { item: rankingItems[6], reason: "ドコモ回線をそのまま使いながら月2,970円に削減。海外82ヵ国でも追加料金なしで使えます。" };
  }

  // デフォルト: 楽天モバイル
  return { item: rankingItems[0], reason: "料金・データ量・ポイント還元のバランスが抜群。初めての格安SIMにも安心しておすすめできます。" };
}

export default function DiagnosisPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [done, setDone] = useState(false);

  const currentQ = questions[step];
  const progress = Math.round((step / questions.length) * 100);

  function handleAnswer(value: string) {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setDone(false);
  }

  const result = done ? getRecommendation(answers) : null;

  return (
    <>
      <Header />
      <main>
        {/* Page Hero */}
        <section className="bg-gradient-to-br from-purple-500 to-pink-400 text-white py-10 px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm font-bold bg-white/20 inline-block px-3 py-1 rounded-full mb-3">
              ✨ 無料・5問だけ
            </p>
            <h1 className="text-3xl font-black mb-2">
              📱 あなたにぴったりの格安SIM診断
            </h1>
            <p className="text-sm opacity-90">
              5つの質問に答えるだけで最適な格安SIMがわかります
            </p>
          </div>
        </section>

        <section className="py-10 px-4 bg-purple-50 min-h-[60vh]">
          <div className="max-w-xl mx-auto">
            {!done ? (
              <>
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>質問 {step + 1} / {questions.length}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Question card */}
                <div className="bg-white rounded-3xl shadow-md p-8 text-center">
                  <div className="text-5xl mb-4">{currentQ.emoji}</div>
                  <h2 className="text-xl font-black text-gray-800 mb-6">
                    {currentQ.question}
                  </h2>
                  <div className="space-y-3">
                    {currentQ.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(opt.value)}
                        className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 font-bold text-gray-700 transition-all pop-btn text-left"
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors mx-auto block"
                  >
                    ← 前の質問に戻る
                  </button>
                )}
              </>
            ) : (
              /* Result */
              <div>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">🎉</div>
                  <h2 className="text-2xl font-black text-gray-800 mb-1">
                    診断結果
                  </h2>
                  <p className="text-gray-500 text-sm">
                    あなたにいちばんおすすめの格安SIMはこちらです
                  </p>
                </div>

                {result && (
                  <>
                    <div className="mb-4">
                      <RankingCard item={result.item} />
                    </div>
                    {/* おすすめ理由 */}
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 mb-6">
                      <p className="text-sm font-bold text-purple-700 mb-1">💡 おすすめの理由</p>
                      <p className="text-sm text-gray-700">{result.reason}</p>
                    </div>
                    {/* 直接アフィリエイトCTA */}
                    <div className="mb-4">
                      <Link
                        href={result.item.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className={`block text-white font-black text-center py-4 rounded-2xl pop-btn text-lg shadow-md transition-colors ${result.item.ctaColor}`}
                      >
                        今すぐ{result.item.name}に申し込む →
                      </Link>
                      <p className="text-xs text-center text-gray-400 mt-2">
                        ✓ このリンクからの申し込みが特典・キャンペーンの対象です
                      </p>
                    </div>
                  </>
                )}

                <div className="bg-white rounded-2xl p-5 border border-gray-200 mb-6 text-sm text-gray-600">
                  <p className="font-bold text-gray-700 mb-2">📋 診断の根拠</p>
                  <ul className="space-y-1">
                    {Object.entries(answers).map(([key, val]) => {
                      const q = questions.find((q) => q.id === key);
                      const opt = q?.options.find((o) => o.value === val);
                      return (
                        <li key={key} className="flex items-center gap-2">
                          <span>{q?.emoji}</span>
                          <span>{q?.question}</span>
                          <span className="font-bold text-purple-600">
                            → {opt?.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="flex-1 border-2 border-gray-300 text-gray-600 font-bold py-3 rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    もう一度診断する
                  </button>
                  <Link
                    href="/ranking"
                    className="flex-1 bg-sky-400 hover:bg-sky-500 text-white font-black py-3 rounded-2xl text-center pop-btn transition-colors"
                  >
                    全ランキングを見る
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
