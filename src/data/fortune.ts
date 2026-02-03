// 日運データ
export interface DailyFortune {
  date: string;
  kanshi: string;      // 干支
  mainStar: string;    // 主星
  aspects: string[];   // 位相法
  isTenchu: boolean;   // 天中殺か
  advice: string;
  rating: 'excellent' | 'good' | 'neutral' | 'caution' | 'danger';
}

// 月運データ
export interface MonthlyFortune {
  period: string;
  kanshi: string;
  mainStar: string;
  aspects: string;
  isTenchu: boolean;
  advice: string;
}

export const monthlyFortunes: MonthlyFortune[] = [
  {
    period: '1/5〜2/3',
    kanshi: '己丑',
    mainStar: '車騎星',
    aspects: '年柱：害',
    isTenchu: false,
    advice: '思い通りにいかない月。無理に押さない',
  },
  {
    period: '2/4〜3/4',
    kanshi: '庚寅',
    mainStar: '玉堂星',
    aspects: '年柱：半会',
    isTenchu: true,
    advice: '月天中殺。新規事業禁止。学び・準備',
  },
  {
    period: '3/5〜4/4',
    kanshi: '辛卯',
    mainStar: '龍高星',
    aspects: '月柱：干合・害',
    isTenchu: true,
    advice: '月天中殺。アイデアは出るが実行は後',
  },
  {
    period: '4/5〜5/4',
    kanshi: '壬辰',
    mainStar: '石門星',
    aspects: '月柱：自刑',
    isTenchu: false,
    advice: '天中殺明け。仲間との協力が吉',
  },
  {
    period: '5/5〜6/5',
    kanshi: '癸巳',
    mainStar: '貫索星',
    aspects: '日柱：大半会/年柱：干合',
    isTenchu: false,
    advice: '発信・拡大に最適な月',
  },
];

// 今日の日運を計算する関数
export function getTodayFortune(): DailyFortune {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // 2/3は己丑月最終日
  if (month === 2 && day === 3) {
    return {
      date: '2/3',
      kanshi: '甲辰',
      mainStar: '天印星',
      aspects: ['干合', '半会'],
      isTenchu: false,
      advice: '発信・告知に良い日。月天中殺前最後の日。準備完了したものを出せ。',
      rating: 'good',
    };
  }

  // 2/4〜 月天中殺開始
  if (month === 2 && day >= 4) {
    return {
      date: `2/${day}`,
      kanshi: '庚寅月',
      mainStar: '玉堂星',
      aspects: ['月天中殺'],
      isTenchu: true,
      advice: '新規立ち上げ禁止。継続活動のみ。学び・準備に集中。',
      rating: 'caution',
    };
  }

  // デフォルト
  return {
    date: `${month}/${day}`,
    kanshi: '計算中',
    mainStar: '-',
    aspects: [],
    isTenchu: false,
    advice: '日運データを更新してください',
    rating: 'neutral',
  };
}

// 給料日までのカウントダウン
export function getDaysUntilPayday(): number {
  const today = new Date();
  const payday = new Date(2026, 1, 16); // 2026年2月16日
  const diffTime = payday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

// 月天中殺終了までのカウントダウン
export function getDaysUntilTenchuEnd(): number {
  const today = new Date();
  const tenchuEnd = new Date(2026, 3, 4); // 2026年4月4日
  const diffTime = tenchuEnd.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}
