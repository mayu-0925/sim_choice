export default function AuthorProfile() {
  return (
    <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-8">
      <div className="flex-shrink-0 w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-2xl">
        📱
      </div>
      <div>
        <p className="text-sm font-black text-gray-800">格安SIMえらびナビ編集部</p>
        <p className="text-xs text-gray-500 mt-0.5">
          格安SIM（MVNO）の調査・比較を専門とする編集チーム。実際に複数の格安SIMへのMNP乗り換え・速度計測・問い合わせ検証を行い、リアルな体験に基づいた情報を発信しています。
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {["実際に乗り換え済み", "速度実測あり", "毎月情報更新"].map((badge) => (
            <span key={badge} className="text-xs bg-sky-50 border border-sky-200 text-sky-600 px-2 py-0.5 rounded-full font-bold">
              ✓ {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
