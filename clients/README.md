# クライアント用ダッシュボード 運用ガイド

## 概要

鑑定したクライアントに「あなた専用の運気ダッシュボード」を配布する仕組み。

---

## ⚠️ 関連ツール: ナナフシ命式チェッカーとの連携(2026-06-03追記)

クライアントの命式素材データは、別ツール **ナナフシ命式チェッカー** で出せる。

- 公開URL: **https://nanafushi-meishikicker.vercel.app/**
- ソース: `/Users/nanafusi/Desktop/_AIツール/tools/nanafushi-meishikicker/`
- 全項目検証済み(2026-06-03時点)

### 連携の運用フロー

1. **ナナフシ命式チェッカー**でクライアントの命式を出す
   - 陰占・陽占・天中殺・宿命天中殺・五行・大運・年運・月運・位相法・才能占技・調候守護神を網羅
   - 「Claude Code投入用コピー」ボタンでmarkdown形式で取得可能

2. 取得したmarkdownデータを、このREADMEのフォーマットに沿って **kichi-dashboard用JSONに変換**

3. **template.html**のCLIENT_DATAに差し替えて、`clients/(名前).html` として保存

4. クライアントに配布(ローカルファイル or Vercel経由)

### よくある誤解の防止

- ナナフシ命式チェッカーには**過去に未解決問題があった**(陽占東方・十二大従星・大運順逆等)
- **2026-06-03に全項目解決済み**(`nanafushi-meishikicker/docs/設計書_v2_260603.md`参照)
- **古い設計書(v1)・明日のMeetテーブル逆算ヒアリングシート** が docs/ 配下に履歴として残っているが、現状の正本は **v2_260603** のみ
- 「未解決問題」と書いてある古いMDを読んで「使えないツール」と判断しないこと

### 月運・日運データの扱い

- kichi-dashboardの月運表は、ナナフシチェッカーの月運表または算命学stockの出力を**手動で貼る運用**
- チェッカーの月運計算は検証済みだが、kichi-dashboardでは「クライアントごとに編集できる柔軟性」を優先するため、**JSONベタ書き運用**が継続
- yokoさんなど個別クライアントページを作る時は、チェッカーの計算ロジックとは無関係に **データを手動で入れるだけ**

---

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
