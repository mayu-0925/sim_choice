import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";

const categoryStyles = {
  orange: "bg-sky-100 text-sky-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
} as const;

const cardGradients = {
  orange: "from-sky-100 to-red-100",
  blue: "from-blue-100 to-indigo-100",
  green: "from-green-100 to-teal-100",
} as const;

type Props = {
  article: Article;
};

export default function ArticleCard({ article }: Props) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden card-pop border border-gray-100">
      {/* Thumbnail */}
      {article.thumbnail ? (
        <div className="relative h-36 w-full overflow-hidden">
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : (
        <div
          className={`h-36 bg-gradient-to-br ${cardGradients[article.categoryColor]} flex items-center justify-center`}
        >
          <span className="text-5xl">{article.emoji}</span>
        </div>
      )}

      {/* Body */}
      <div className="p-4">
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${categoryStyles[article.categoryColor]}`}
        >
          {article.category}
        </span>
        <h3 className="font-black text-gray-800 mt-2 mb-1 text-sm leading-snug">
          {article.title}
        </h3>
        <p className="text-xs text-gray-500">{article.excerpt}</p>
        <Link
          href={`/blog/${article.slug}`}
          className="mt-3 inline-block text-xs text-sky-500 font-bold hover:underline"
        >
          続きを読む →
        </Link>
      </div>
    </article>
  );
}
