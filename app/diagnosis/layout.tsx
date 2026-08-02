import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "あなたにぴったりの回線診断",
  description:
    "5つの質問に答えるだけで、あなたに最適なインターネット回線がわかります。無料で今すぐ診断できます。",
  alternates: { canonical: "https://www.sim-choice.jp/diagnosis/" },
};

export default function DiagnosisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
