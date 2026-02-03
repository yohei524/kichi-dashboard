export interface Project {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'blocked';
  urgency: boolean;
  cashflow: boolean;
  broadcasting: boolean;  // 発信してるか
  oneToMany: boolean;     // 1対多か
  fateMatch: 'good' | 'warning' | 'bad';  // 宿命適合度
  nextAction: string;
  note?: string;
}

export const projects: Project[] = [
  {
    id: 'tiktok-election',
    name: '金融占星術TikTok選挙',
    status: 'completed',
    urgency: true,
    cashflow: false,
    broadcasting: true,
    oneToMany: true,
    fateMatch: 'good',
    nextAction: '収録・投稿（2/8投票日まで）',
    note: '台本4本完成済',
  },
  {
    id: 'trucktoluck-note',
    name: 'TRUCKtoLUCK note',
    status: 'completed',
    urgency: false,
    cashflow: false,
    broadcasting: true,
    oneToMany: true,
    fateMatch: 'good',
    nextAction: '第12回公開',
    note: '第11回公開済、第12回下書き完了',
  },
  {
    id: 'hitsujii-instagram',
    name: 'ひつじぃInstagram',
    status: 'active',
    urgency: false,
    cashflow: false,
    broadcasting: true,
    oneToMany: true,
    fateMatch: 'good',
    nextAction: 'ライブ配信テンプレ完成',
    note: '投稿ローテーション設計中',
  },
  {
    id: 'we-unso-sns',
    name: 'We運送SNS採用',
    status: 'active',
    urgency: false,
    cashflow: false,
    broadcasting: false,
    oneToMany: true,
    fateMatch: 'good',
    nextAction: '競合アカウント調査',
    note: '4月以降本格化',
  },
  {
    id: 'gold-experience',
    name: 'Gold Experience',
    status: 'active',
    urgency: false,
    cashflow: false,
    broadcasting: true,
    oneToMany: true,
    fateMatch: 'good',
    nextAction: 'アフィリエイト登録',
    note: 'サイト稼働中・マネタイズ準備',
  },
  {
    id: 'yui-trouble',
    name: '由依トラブル記録',
    status: 'active',
    urgency: false,
    cashflow: false,
    broadcasting: false,
    oneToMany: false,
    fateMatch: 'warning',
    nextAction: '記録継続',
    note: '1対1消耗発生中',
  },
  {
    id: 'loto-predict',
    name: 'ロト予想システム',
    status: 'blocked',
    urgency: false,
    cashflow: false,
    broadcasting: false,
    oneToMany: true,
    fateMatch: 'warning',
    nextAction: '優位性再検証',
    note: '統計的優位性消失',
  },
  {
    id: 'dairikujin',
    name: '大六壬学習',
    status: 'active',
    urgency: false,
    cashflow: false,
    broadcasting: false,
    oneToMany: false,
    fateMatch: 'warning',
    nextAction: 'ドキュメント整理継続',
    note: '研究フェーズ',
  },
  {
    id: 'uranai-school',
    name: '占いスクール設計',
    status: 'paused',
    urgency: false,
    cashflow: false,
    broadcasting: false,
    oneToMany: true,
    fateMatch: 'good',
    nextAction: '4月以降に本格設計',
    note: '月天中殺中は準備のみ',
  },
];
