/** JST（UTC+9）での現在日時を返す */
function nowJST(): Date {
  const d = new Date();
  d.setTime(d.getTime() + 9 * 60 * 60 * 1000);
  return d;
}

/** ビルド時の現在年を返す（JST基準） */
export function currentYear(): number {
  return nowJST().getUTCFullYear();
}

/** ビルド時の現在年月を「YYYY年M月」形式で返す（JST基準） */
export function currentYearMonth(): string {
  const d = nowJST();
  return `${d.getUTCFullYear()}年${d.getUTCMonth() + 1}月`;
}

/** ビルド時の「X月末まで」テキストを返す（JST基準） */
export function currentMonthEnd(): string {
  return `${nowJST().getUTCMonth() + 1}月末まで`;
}
