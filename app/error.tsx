"use client";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-50 px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">😵</div>
        <h2 className="text-xl font-black text-gray-800 mb-2">
          エラーが発生しました
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          ページの読み込み中に問題が起きました
        </p>
        <button
          onClick={reset}
          className="bg-sky-400 hover:bg-sky-500 text-white font-black px-6 py-3 rounded-2xl transition-colors"
        >
          もう一度試す
        </button>
      </div>
    </div>
  );
}
