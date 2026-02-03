export interface TodoItem {
  id: string;
  task: string;
  priority: 1 | 2 | 3;  // 1=最優先, 2=重要, 3=通常
  deadline?: string;
  reason: string;
}

export const todayTodos: TodoItem[] = [
  {
    id: '1',
    task: 'TikTok選挙シリーズ収録・投稿',
    priority: 1,
    deadline: '2/8投票日まで',
    reason: '時事ネタ鮮度、台本完成済',
  },
  {
    id: '2',
    task: 'note第12回公開',
    priority: 1,
    deadline: '今日中',
    reason: '月天中殺前最終日、準備完了済',
  },
  {
    id: '3',
    task: 'ひつじぃライブ配信テンプレ完成',
    priority: 2,
    reason: '月天中殺中も継続できる仕組み作り',
  },
];

// 勝ちパターン
export const winPatterns = [
  '発信し続ける（干合発動）',
  '1対多のモデルで働く',
  'CTAを出して待つ',
  '外に出て動く',
  '全部出す、隠さない',
];

// 負けパターン
export const losePatterns = [
  '高単価で1対1をやる',
  '発信を止める',
  '家にこもる',
  '一人で全部やろうとする',
];
