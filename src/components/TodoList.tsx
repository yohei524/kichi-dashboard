'use client';

import { todayTodos, winPatterns, losePatterns } from '@/data/todos';

export default function TodoList() {
  return (
    <div className="card animate-fade-in">
      <div className="card-header">
        <span className="text-[#C4A574]">◇</span>
        <span>本日のお導き</span>
      </div>

      <div className="space-y-3 mb-6">
        {todayTodos.map((todo, index) => (
          <div
            key={todo.id}
            className={`task-item ${todo.priority === 1 ? 'priority-high' : 'priority-normal'}`}
          >
            <div className="flex items-start justify-between mb-1">
              <span className="text-sm font-medium">{todo.task}</span>
              {todo.deadline && (
                <span className="badge badge-warning text-xs">{todo.deadline}</span>
              )}
            </div>
            <p className="text-xs text-[#8B7355]">{todo.reason}</p>
          </div>
        ))}
      </div>

      <div className="divider" />

      {/* 心がけ */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-[#6B7A62] text-center mb-3">大切にすること</p>
          <ul className="space-y-2">
            {winPatterns.slice(0, 3).map((pattern, i) => (
              <li key={i} className="text-xs text-[#5C4A3A] flex items-start gap-2">
                <span className="text-[#A8B5A0] mt-0.5">○</span>
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs text-[#A67878] text-center mb-3">気をつけること</p>
          <ul className="space-y-2">
            {losePatterns.slice(0, 3).map((pattern, i) => (
              <li key={i} className="text-xs text-[#5C4A3A] flex items-start gap-2">
                <span className="text-[#D4A5A5] mt-0.5">×</span>
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
