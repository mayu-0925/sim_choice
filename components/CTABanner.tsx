"use client";

import Link from "next/link";
import { RAKUTEN, RAKUTEN_AFFILIATE_URL } from "@/lib/data";

type Props = {
  title?: string;
  description?: string;
  buttonText?: string;
  variant?: "default" | "compact";
};

export default function CTABanner({
  title,
  description,
  buttonText = "楽天モバイルの公式サイトへ →",
  variant = "default",
}: Props) {
  if (variant === "compact") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1">
          <p className="font-black text-gray-800 text-sm">{title ?? "楽天モバイルへの乗り換えはこちら"}</p>
          {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        <Link
          href={RAKUTEN_AFFILIATE_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="bg-red-500 hover:bg-red-600 text-white font-black px-5 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors"
          onClick={() => (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.("event", "affiliate_click", { provider: "rakuten" })}
        >
          {buttonText}
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-6 text-white">
      <p className="font-black text-lg mb-1">{title ?? "楽天モバイルで通信費を大幅節約"}</p>
      {description && <p className="text-sm text-gray-300 mb-4">{description}</p>}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-red-400 font-black text-xl">{RAKUTEN.planBasic.price}</p>
          <p className="text-xs text-gray-400 mt-0.5">{RAKUTEN.planBasic.label}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-red-400 font-black text-xl">{RAKUTEN.planUnlimited.price}</p>
          <p className="text-xs text-gray-400 mt-0.5">{RAKUTEN.planUnlimited.label}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 text-center">
          <p className="text-red-400 font-black text-xl">{RAKUTEN.maxReward}pt</p>
          <p className="text-xs text-gray-400 mt-0.5">最大還元</p>
        </div>
      </div>
      <Link
        href={RAKUTEN_AFFILIATE_URL}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="block bg-red-500 hover:bg-red-600 text-white font-black py-3 rounded-xl text-center transition-colors"
      >
        {buttonText}
      </Link>
      <p className="text-xs text-gray-500 text-center mt-2">{RAKUTEN.contract}</p>
    </div>
  );
}
