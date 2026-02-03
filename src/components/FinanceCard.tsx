'use client';

import { getDaysUntilPayday } from '@/data/fortune';

export default function FinanceCard() {
  const daysUntilPayday = getDaysUntilPayday();

  return (
    <div className="card">
      <div className="card-header">
        <span>💰</span>
        <span>資金状況</span>
      </div>

      {/* 給料日カウントダウン */}
      <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">給料日まで</span>
          <span className="text-3xl font-bold">
            {daysUntilPayday > 0 ? (
              <span className={daysUntilPayday <= 7 ? 'text-amber-400' : 'text-emerald-400'}>
                {daysUntilPayday}日
              </span>
            ) : (
              <span className="text-emerald-400">給料日!</span>
            )}
          </span>
        </div>
        <p className="text-xs text-slate-500">2/16（日）三の丸</p>
      </div>

      {/* 収支サマリー */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-emerald-500/10 rounded p-3">
          <span className="text-xs text-emerald-400">総支給</span>
          <p className="text-lg font-bold text-emerald-400">48万円</p>
          <span className="text-xs text-slate-500">三の丸（週4）</span>
        </div>
        <div className="bg-red-500/10 rounded p-3">
          <span className="text-xs text-red-400">交通費</span>
          <p className="text-lg font-bold text-red-400">▲3万円</p>
          <span className="text-xs text-slate-500">自腹</span>
        </div>
      </div>

      {/* 即金オプション */}
      <div className="border-t border-slate-700/50 pt-3">
        <h4 className="text-xs text-slate-400 mb-2">即金オプション</h4>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>ひつじぃ鑑定</span>
            <span className="badge badge-success">◯</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>ココナラ鑑定</span>
            <span className="badge badge-success">◯</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>天中殺note</span>
            <span className="badge badge-warning">△</span>
          </div>
        </div>
      </div>
    </div>
  );
}
