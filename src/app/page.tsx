import FortuneCard from '@/components/FortuneCard';
import ProjectCard from '@/components/ProjectCard';
import TodoList from '@/components/TodoList';
import FinanceCard from '@/components/FinanceCard';
import { projects } from '@/data/projects';

export default function Home() {
  // プロジェクトを宿命適合度でソート
  const sortedProjects = [...projects].sort((a, b) => {
    const order = { good: 0, warning: 1, bad: 2 };
    return order[a.fateMatch] - order[b.fateMatch];
  });

  // 発信中のプロジェクト
  const broadcastingProjects = sortedProjects.filter(p => p.broadcasting);
  // その他のプロジェクト
  const otherProjects = sortedProjects.filter(p => !p.broadcasting);

  return (
    <main className="min-h-screen p-4 md:p-8">
      {/* ヘッダー */}
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          㐂 司令塔ダッシュボード
        </h1>
        <p className="text-slate-400 text-sm">
          本当の目的: しんくん・たっくんと暮らす
        </p>
      </header>

      {/* 上部: 運気・TODO・資金 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <FortuneCard />
        <TodoList />
        <FinanceCard />
      </div>

      {/* プロジェクト一覧 */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📡</span>
          <span>発信中プロジェクト</span>
          <span className="badge badge-success">{broadcastingProjects.length}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {broadcastingProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📁</span>
          <span>その他のプロジェクト</span>
          <span className="badge badge-info">{otherProjects.length}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* フッター */}
      <footer className="mt-12 pt-4 border-t border-slate-700/50 text-center text-slate-500 text-sm">
        <p>勝ち筋: 発信し続ける / 1対多 / CTAを出して待つ</p>
        <p className="mt-1">負けパターン: 高単価1対1 / 発信を止める / 家にこもる</p>
      </footer>
    </main>
  );
}
