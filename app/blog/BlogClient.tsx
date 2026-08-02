"use client";

import { useState } from "react";
import ArticleCard from "@/components/ArticleCard";
import type { Article } from "@/lib/types";

const PER_PAGE = 9;

type Props = {
  articles: Article[];
};

export default function BlogClient({ articles }: Props) {
  const allCategories = ["すべて", ...Array.from(new Set(articles.map((a) => a.category)))];
  const [selectedCategory, setSelectedCategory] = useState("すべて");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = selectedCategory === "すべて"
    ? articles
    : articles.filter((a) => a.category === selectedCategory);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  function handleCategory(cat: string) {
    setSelectedCategory(cat);
    setCurrentPage(1);
  }

  return (
    <>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
              cat === selectedCategory
                ? "bg-gray-800 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article grid */}
      {paged.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {paged.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <span className="text-5xl block mb-3">📭</span>
          <p className="font-bold">記事はまだありません</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                page === currentPage
                  ? "bg-sky-400 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ›
          </button>
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-4">
        {filtered.length} 件中 {(currentPage - 1) * PER_PAGE + 1}〜{Math.min(currentPage * PER_PAGE, filtered.length)} 件表示
      </p>
    </>
  );
}
