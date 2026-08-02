import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-xl font-black text-gray-800 mb-2">
          ページが見つかりません
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          お探しのページは存在しないか、移動した可能性があります
        </p>
        <Link
          href="/"
          className="bg-sky-400 hover:bg-sky-500 text-white font-black px-6 py-3 rounded-2xl transition-colors inline-block"
        >
          トップへ戻る
        </Link>
      </div>
    </div>
  );
}
