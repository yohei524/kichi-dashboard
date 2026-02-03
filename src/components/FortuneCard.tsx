'use client';

import { getTodayFortune, monthlyFortunes, getDaysUntilTenchuEnd } from '@/data/fortune';

export default function FortuneCard() {
  const today = getTodayFortune();
  const tenchuDays = getDaysUntilTenchuEnd();

  // 現在の月運を取得（2/3までは己丑月）
  const currentMonth = monthlyFortunes[0]; // 1/5〜2/3

  const ratingLabels = {
    excellent: '大吉',
    good: '吉',
    neutral: '平',
    caution: '注意',
    danger: '凶',
  };

  const ratingColors = {
    excellent: 'text-[#6B7A62]',
    good: 'text-[#6B7A62]',
    neutral: 'text-[#8B7355]',
    caution: 'text-[#A67878]',
    danger: 'text-[#8B5A5A]',
  };

  return (
    <div className="card animate-fade-in">
      {/* 日付 */}
      <div className="text-center mb-6">
        <p className="text-xs text-[#8B7355] mb-1">令和八年</p>
        <p className="date-display">
          <span className="month">二月</span>
          <span className="mx-2">三日</span>
        </p>
        <p className="text-sm text-[#8B7355] mt-1">{today.kanshi}</p>
      </div>

      <div className="divider" />

      {/* 今日の運気 */}
      <div className="text-center mb-6">
        <p className="text-xs text-[#8B7355] mb-2">本日の運気</p>
        <span className={`text-2xl font-medium ${ratingColors[today.rating]}`}>
          {ratingLabels[today.rating]}
        </span>
      </div>

      {/* 星の情報 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="text-center p-3 bg-[#FDF8F3] rounded">
          <p className="text-xs text-[#8B7355] mb-1">主星</p>
          <p className="text-sm font-medium">{today.mainStar}</p>
        </div>
        <div className="text-center p-3 bg-[#FDF8F3] rounded">
          <p className="text-xs text-[#8B7355] mb-1">身星</p>
          <p className="text-sm font-medium">{today.bodyStar}</p>
        </div>
      </div>

      {/* 位相法 */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {today.aspects.map((aspect, i) => (
          <span
            key={i}
            className={`badge ${today.isTenchu ? 'badge-danger' : 'badge-info'}`}
          >
            {aspect}
          </span>
        ))}
      </div>

      {/* メッセージ */}
      <div className="message-box">
        <p className="text-sm leading-relaxed pl-4">
          {today.advice}
        </p>
      </div>

      <div className="divider" />

      {/* 月運 */}
      <div className="mb-4">
        <p className="text-xs text-[#8B7355] text-center mb-2">今月の流れ</p>
        <div className="text-center">
          <p className="text-sm mb-1">
            <span className="text-[#8B7355]">{currentMonth.period}</span>
            <span className="mx-2">|</span>
            <span>{currentMonth.mainStar}</span>
          </p>
          {currentMonth.isTenchu && (
            <span className="badge badge-danger">月天中殺</span>
          )}
        </div>
        <p className="text-xs text-[#8B7355] text-center mt-2">
          {currentMonth.advice}
        </p>
      </div>

      {/* 月天中殺カウントダウン */}
      {tenchuDays > 0 && (
        <div className="bg-[#F0E0E0] border border-[#D4A5A5]/30 rounded p-4 text-center">
          <p className="text-xs text-[#A67878] mb-1">月天中殺終了まで</p>
          <p className="text-2xl font-light text-[#8B5A5A]">{tenchuDays}<span className="text-sm ml-1">日</span></p>
          <p className="text-xs text-[#A67878] mt-1">
            新しいことは四月五日から
          </p>
        </div>
      )}
    </div>
  );
}
