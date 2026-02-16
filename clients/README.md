# クライアント用ダッシュボード 運用ガイド

## 概要

鑑定したクライアントに「あなた専用の運気ダッシュボード」を配布する仕組み。

## ファイル構成

```
kichi-dashboard/
├── index.html          ← 㐂さん自身用
├── template.html       ← クライアント配布用テンプレート
└── clients/
    ├── sample.json     ← データ構造の見本
    └── README.md       ← このファイル
```

## 新規クライアントの作り方

### 1. JSONデータを作る

`sample.json` をコピーして、クライアントの情報に書き換える。

Claudeに頼む場合：
```
この人の鑑定データでダッシュボード用JSONを作って。
sample.jsonの形式に合わせて。

命式：○○○○
天中殺：○○天中殺
...
```

### 2. HTMLを生成する

`template.html` の `CLIENT_DATA` 部分（`/*__CLIENT_DATA__*/` と `/*__END_CLIENT_DATA__*/` の間）を、作ったJSONデータに差し替える。

Claudeに頼む場合：
```
このJSONデータでtemplate.htmlのCLIENT_DATAを差し替えて、
tanaka.html として保存して。
```

### 3. 配布する

- **ローカル配布**: HTMLファイルをそのまま送る（LINEやメール）
- **Vercel配布**: デプロイしてURLを渡す

## JSONデータの構造

```json
{
  "client": {
    "name": "表示名",
    "dayStem": "日干（漢字1文字）",
    "dayStemReading": "読み仮名",
    "element": "五行（木/火/土/金/水）",
    "elementNote": "その人の本質を一言で",
    "tenchu": "○○天中殺",
    "tenchuNote": "天中殺の意味",
    "specialStructure": "特殊構造（干合など）",
    "specialNote": "特殊構造の説明"
  },

  "goal": {
    "main": "メインの目標（短く）",
    "sub": "サブ説明（改行は\\nで）"
  },

  "winPatterns": ["勝ちパターン1", "勝ちパターン2", ...],
  "losePatterns": ["負けパターン1", "負けパターン2", ...],

  "monthlyFortunes": [
    {
      "period": "2/4〜3/4",
      "kanshi": "庚寅",
      "mainStar": "車騎星",
      "aspects": "年柱：支合",
      "isTenchu": false,
      "advice": "月のアドバイス"
    }
  ],

  "monthlyTenchuPeriod": null,
  // もし月天中殺がある場合:
  // { "startMonth": 2, "startDay": 4, "endMonth": 4, "endDay": 4, "endYear": 2026 }

  "todos": [
    {
      "task": "タスク名",
      "priority": 1,        // 1=最優先, 2=重要, 3=通常
      "deadline": null,      // "3/15" のように。なければnull
      "reason": "なぜこれをやるのか（命式の根拠）"
    }
  ],

  "finance": {
    "showFinance": false     // 資金セクション非表示（㐂さん専用）
  },

  "projects": [
    {
      "name": "プロジェクト名",
      "status": "active",    // active/paused/completed/blocked
      "broadcasting": true,  // 発信してるか
      "oneToMany": true,     // 1対多か
      "fateMatch": "good",   // good/warning/bad
      "nextAction": "次のアクション",
      "note": "備考"
    }
  ],

  "design": {
    "accentColor": "#C4A574",
    "headerSub": "― Your Fortune Guide ―",
    "headerTitle": "㐂びの暦",
    "headerTagline": "宿命のエネルギーを味方に",
    "footerText": "― 運気の流れに乗り、㐂びの人生へ ―"
  }
}
```

## 月次更新の手順

月1回、月運データとTodoを更新する。

Claudeに頼む場合：
```
田中さんのダッシュボード、3月分に更新して。
- 月運を3/5〜4/4に切り替え
- Todoを今月やるべきことに更新
```

## 料金モデル案（4月以降）

| プラン | 内容 | 価格案 |
|--------|------|--------|
| 初回鑑定+ダッシュボード | 命式解読＋専用ページ作成 | 5,000〜10,000円 |
| 月額更新 | 月運更新＋Todo更新＋相談 | 1,000〜3,000円/月 |
| コミュニティ | 月1ライブ＋全員の月運配信 | 1,000円/月 |
