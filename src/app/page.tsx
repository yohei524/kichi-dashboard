import FortuneCard from '@/components/FortuneCard';
import TodoList from '@/components/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* ヘッダー */}
      <header className="text-center py-8 px-4">
        <p className="text-xs text-[#C4A574] tracking-widest mb-2">― Your Fortune Guide ―</p>
        <h1 className="text-xl font-medium text-[#5C4A3A] mb-1">
          㐂びの暦
        </h1>
        <p className="text-xs text-[#8B7355]">
          宿命のエネルギーを味方に
        </p>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-md mx-auto px-4 pb-8 space-y-6">
        {/* 運気カード */}
        <FortuneCard />

        {/* 今日のお導き */}
        <TodoList />

        {/* 目標セクション */}
        <div className="frame">
          <p className="text-xs text-[#8B7355] text-center mb-3">あなたの願い</p>
          <p className="text-center text-sm font-medium text-[#5C4A3A]">
            しんくん・たっくんと暮らす
          </p>
          <div className="divider" />
          <p className="text-xs text-[#8B7355] text-center leading-relaxed">
            そのために、経済的に復活する。<br />
            発信し続け、1対多で届ける。
          </p>
        </div>
      </div>

      {/* フッター */}
      <footer className="text-center py-6 border-t border-[#F5EDE4]">
        <p className="text-xs text-[#C4A574]">
          ― 運気の流れに乗り、㐂びの人生へ ―
        </p>
      </footer>
    </main>
  );
}
