'use client';

import { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    active: 'bg-emerald-500',
    paused: 'bg-amber-500',
    completed: 'bg-blue-500',
    blocked: 'bg-red-500',
  };

  const statusLabels = {
    active: '進行中',
    paused: '保留',
    completed: '完了',
    blocked: '停滞',
  };

  const fateColors = {
    good: 'text-emerald-400',
    warning: 'text-amber-400',
    bad: 'text-red-400',
  };

  const fateLabels = {
    good: '適合',
    warning: '注意',
    bad: '不適合',
  };

  return (
    <div className="card hover:border-slate-600/50 transition-colors">
      {/* ヘッダー */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[project.status]}`} />
          <h3 className="font-semibold">{project.name}</h3>
        </div>
        <span className="text-xs text-slate-500">{statusLabels[project.status]}</span>
      </div>

      {/* バッジ */}
      <div className="flex flex-wrap gap-1 mb-3">
        {project.broadcasting && (
          <span className="badge badge-success">発信</span>
        )}
        {project.oneToMany && (
          <span className="badge badge-info">1対多</span>
        )}
        {project.urgency && (
          <span className="badge badge-danger">緊急</span>
        )}
        {project.cashflow && (
          <span className="badge badge-warning">即金</span>
        )}
      </div>

      {/* 宿命適合度 */}
      <div className="flex items-center gap-2 mb-2 text-sm">
        <span className="text-slate-500">宿命:</span>
        <span className={fateColors[project.fateMatch]}>
          {fateLabels[project.fateMatch]}
        </span>
      </div>

      {/* 次のアクション */}
      <div className="bg-slate-900/50 rounded p-2 mb-2">
        <span className="text-xs text-slate-500">次のアクション</span>
        <p className="text-sm">{project.nextAction}</p>
      </div>

      {/* 備考 */}
      {project.note && (
        <p className="text-xs text-slate-500">{project.note}</p>
      )}
    </div>
  );
}
