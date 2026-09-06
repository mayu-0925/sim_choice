"use client";

import type { ContentBlock } from "@/lib/types";
import Link from "next/link";
import CTABanner from "./CTABanner";

type Props = {
  blocks: ContentBlock[];
};

function renderInlineText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|==[^=]+==|\[[^\]]+\]\([^)]+\))/);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("==") && part.endsWith("==")) {
      return <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">{part.slice(2, -2)}</mark>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, url] = linkMatch;
      const isExternal = url.startsWith("http");
      return (
        <Link
          key={i}
          href={url}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
          className="text-red-500 font-bold underline underline-offset-2 hover:text-red-600"
        >
          {label}
        </Link>
      );
    }
    return part;
  });
}

export default function ArticleBody({ blocks }: Props) {
  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading2":
            return (
              <h2 key={i} className="text-xl font-black text-gray-800 pt-2 border-l-4 border-red-400 pl-3">
                {block.text}
              </h2>
            );

          case "heading3":
            return (
              <h3 key={i} className="text-base font-black text-gray-800">
                {block.text}
              </h3>
            );

          case "paragraph":
            return (
              <p key={i} className="text-base text-gray-700 leading-loose">
                {renderInlineText(block.text)}
              </p>
            );

          case "list":
            return (
              <ul key={i} className="space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-base text-gray-700 leading-relaxed">
                    <span className="text-red-400 font-black mt-1 flex-shrink-0">✓</span>
                    <span>{renderInlineText(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case "callout":
            return (
              <div key={i} className="bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-4 flex gap-3">
                <span className="text-xl flex-shrink-0">{block.emoji}</span>
                <p className="text-base text-gray-700 leading-relaxed">{block.text}</p>
              </div>
            );

          case "cta_banner":
            return (
              <CTABanner
                key={i}
                title={block.title}
                description={block.description}
                buttonText={block.buttonText}
                variant="compact"
              />
            );

          // 旧ブロックの互換レンダリング → cta_banner として表示
          case "service_cta":
          case "ranking_cta":
            return (
              <CTABanner key={i} variant="compact" />
            );

          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm bg-white">
                  <thead>
                    <tr className="bg-red-500 text-white">
                      {block.headers.map((h, j) => (
                        <th key={j} className="py-3 px-4 text-left font-bold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-red-50"}>
                        {row.map((cell, k) => (
                          <td key={k} className={`py-3 px-4 border-b border-gray-100 ${k === 0 ? "font-bold text-gray-700" : "text-gray-600"}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "bar_chart":
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                {block.title && <p className="text-sm font-bold text-gray-600 mb-4">{block.title}</p>}
                <div className="space-y-3">
                  {block.items.map((item, j) => {
                    const maxValue = Math.max(...block.items.map((bi) => bi.value));
                    const pct = Math.round((item.value / maxValue) * 100);
                    return (
                      <div key={j}>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span className="font-bold">{item.label}</span>
                          <span className="font-black text-gray-800">{item.value.toLocaleString()}{item.unit}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-5">
                          <div
                            className={`h-5 rounded-full flex items-center justify-end pr-2 transition-all ${item.color}`}
                            style={{ width: `${pct}%` }}
                          >
                            <span className="text-white text-xs font-black">{pct}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );

          case "definition_list":
            return (
              <dl key={i} className="space-y-4">
                {block.items.map((item, j) => (
                  <div key={j} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <dt className="font-bold text-gray-800 text-base mb-1">{item.term}</dt>
                    <dd className="text-gray-600 text-base leading-relaxed pl-3 border-l-2 border-gray-200">
                      {renderInlineText(item.description)}
                    </dd>
                  </div>
                ))}
              </dl>
            );

          case "steps":
            return (
              <ol key={i} className="space-y-4">
                {block.items.map((step, j) => (
                  <li key={j} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-black text-sm mt-0.5">
                      {j + 1}
                    </div>
                    <div className="pt-0.5">
                      <div className="font-bold text-gray-800 text-base mb-1">{step.title}</div>
                      <div className="text-gray-600 text-base leading-relaxed">{renderInlineText(step.description)}</div>
                    </div>
                  </li>
                ))}
              </ol>
            );

          case "editorial_note":
            return (
              <div key={i} className="bg-blue-50 border-l-4 border-blue-400 rounded-xl p-4 flex gap-3">
                <span className="text-xl flex-shrink-0">📝</span>
                <div>
                  <p className="text-xs font-black text-blue-600 mb-1">編集部より</p>
                  <p className="text-base text-gray-700 leading-relaxed">{block.text}</p>
                </div>
              </div>
            );

          case "experience":
            return (
              <div key={i} className="bg-green-50 border-l-4 border-green-400 rounded-xl p-4">
                <p className="text-xs font-black text-green-600 mb-1">👤 編集部の体験談</p>
                <p className="text-base text-gray-700 leading-relaxed">{block.text}</p>
                {block.result && (
                  <p className="mt-2 text-sm font-bold text-green-700 bg-green-100 rounded-lg px-3 py-1.5">
                    → {block.result}
                  </p>
                )}
              </div>
            );

          case "faq":
            return (
              <div key={i} className="space-y-4">
                {block.items.map((item, j) => (
                  <div key={j} className="rounded-xl border border-gray-200 overflow-hidden">
                    <div className="bg-red-50 px-4 py-3 flex gap-2">
                      <span className="text-red-500 font-black text-base flex-shrink-0">Q</span>
                      <p className="font-bold text-gray-800 text-base">{item.question}</p>
                    </div>
                    <div className="px-4 py-3 flex gap-2 bg-white">
                      <span className="text-gray-400 font-black text-base flex-shrink-0">A</span>
                      <p className="text-gray-700 text-base leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            );

          case "related_articles":
            return (
              <div key={i} className="border-t border-gray-200 pt-6">
                <p className="text-sm font-black text-gray-500 mb-3">📚 関連記事</p>
                <ul className="space-y-2">
                  {block.items.map((item, j) => (
                    <li key={j}>
                      <Link
                        href={`/blog/${item.slug}/`}
                        className="flex items-center gap-2 text-base text-red-500 font-bold hover:text-red-600 hover:underline underline-offset-2"
                      >
                        <span className="text-red-300 flex-shrink-0">▶</span>
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
