'use client';

import { todayTodos, winPatterns, losePatterns } from '@/data/todos';

export default function TodoList() {
  const priorityColors = {
    1: 'border-l-red-500 bg-red-500/5',
    2: 'border-l-amber-500 bg-amber-500/5',
    3: 'border-l-slate-500 bg-slate-500/5',
  };

  return (
    <div className="card">
      <div className="card-header">
        <span>📋</span>
        <span>今日やるべきこと</span>
      </div>

      <div className="space-y-2 mb-4">
        {todayTodos.map((todo) => (
          <div
            key={todo.id}
            className={`border-l-4 ${priorityColors[todo.priority]} rounded-r p-3`}
          >
            <div className="flex items-start justify-between">
              <span className="font-medium">{todo.task}</span>
              {todo.deadline && (
                <span className="badge badge-danger text-xs">{todo.deadline}</span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">{todo.reason}</p>
          </div>
        ))}
      </div>

      {/* 勝ちパターン・負けパターン */}
      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700/50">
        <div>
          <h4 className="text-xs text-emerald-400 font-medium mb-2">勝ちパターン</h4>
          <ul className="space-y-1">
            {winPatterns.slice(0, 3).map((pattern, i) => (
              <li key={i} className="text-xs text-slate-400 flex items-center gap-1">
                <span className="text-emerald-400">✓</span>
                {pattern}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs text-red-400 font-medium mb-2">負けパターン</h4>
          <ul className="space-y-1">
            {losePatterns.slice(0, 3).map((pattern, i) => (
              <li key={i} className="text-xs text-slate-400 flex items-center gap-1">
                <span className="text-red-400">✕</span>
                {pattern}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
