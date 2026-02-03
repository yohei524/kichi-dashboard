'use client';

import { getTodayFortune, monthlyFortunes, getDaysUntilTenchuEnd } from '@/data/fortune';

export default function FortuneCard() {
  const today = getTodayFortune();
  const tenchuDays = getDaysUntilTenchuEnd();

  // 現在の月運を取得（2/3までは己丑月）
  const currentMonth = monthlyFortunes[0]; // 1/5〜2/3

  const ratingColors = {
    excellent: 'text-emerald-400 bg-emerald-500/20',
    good: 'text-blue-400 bg-blue-500/20',
    neutral: 'text-slate-400 bg-slate-500/20',
    caution: 'text-amber-400 bg-amber-500/20',
    danger: 'text-red-400 bg-red-500/20',
  };

  const ratingLabels = {
    excellent: '最高',
    good: '良好',
    neutral: '普通',
    caution: '注意',
    danger: '危険',
  };

  return (
    <div className="card">
      <div className="card-header">
        <span>📅</span>
        <span>今日の運気</span>
        <span className={`badge ${ratingColors[today.rating]}`}>
          {ratingLabels[today.rating]}
        </span>
      </div>

      <div className="space-y-4">
        {/* 日運 */}
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm">日運</span>
            <span className="font-mono text-lg">{today.date}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm mb-2">
            <div>
              <span className="text-slate-500">干支:</span>
              <span className="ml-1">{today.kanshi}</span>
            </div>
            <div>
              <span className="text-slate-500">主星:</span>
              <span className="ml-1">{today.mainStar}</span>
            </div>
            <div>
              <span className="text-slate-500">身星:</span>
              <span className="ml-1">{today.bodyStar}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {today.aspects.map((aspect, i) => (
              <span
                key={i}
                className={`badge ${today.isTenchu ? 'badge-danger' : 'badge-info'}`}
              >
                {aspect}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-300">{today.advice}</p>
        </div>

        {/* 月運 */}
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-400 text-sm">月運</span>
            <span className="font-mono">{currentMonth.period}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-slate-500 text-sm">主星:</span>
            <span>{currentMonth.mainStar}</span>
            {currentMonth.isTenchu && (
              <span className="badge badge-danger">月天中殺</span>
            )}
          </div>
          <p className="text-sm text-slate-300">{currentMonth.advice}</p>
        </div>

        {/* 月天中殺カウントダウン */}
        {tenchuDays > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 text-sm">月天中殺終了まで</span>
              <span className="text-2xl font-bold text-amber-400">{tenchuDays}日</span>
            </div>
            <p className="text-xs text-amber-300/70 mt-1">
              新規事業立ち上げは4/5以降に
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
