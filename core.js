// ========================================
// kichi-dashboard 共通ロジック（core.js）
// 全クライアント共通。1回直せば全員に反映される。
// クライアント固有データは clients/<name>.json から fetch する。
// ========================================

// ---------- 干支・自動計算エンジン ----------
var STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
var BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
var WX = [0,0,1,1,2,2,3,3,4,4];
var MSN = ['貫索星','石門星','鳳閣星','調舒星','禄存星','司禄星','車騎星','牽牛星','龍高星','玉堂星'];
var BSA = ['天報星','天印星','天貴星','天恍星','天南星','天禄星','天将星','天堂星','天胡星','天極星','天庫星','天馳星'];
var BSM = [2,3,4,5,6,7,8,9,10,11,0,1];
var J12 = [
  [1,2,3,4,5,6,7,8,9,10,11,0],
  [6,5,4,3,2,1,0,11,10,9,8,7],
  [10,11,0,1,2,3,4,5,6,7,8,9],
  [9,8,7,6,5,4,3,2,1,0,11,10],
  [10,11,0,1,2,3,4,5,6,7,8,9],
  [9,8,7,6,5,4,3,2,1,0,11,10],
  [7,8,9,10,11,0,1,2,3,4,5,6],
  [0,11,10,9,8,7,6,5,4,3,2,1],
  [4,5,6,7,8,9,10,11,0,1,2,3],
  [3,2,1,0,11,10,9,8,7,6,5,4]
];
var GN = {0:1,1:2,2:3,3:4,4:0};
var CL = {0:2,1:3,2:4,3:0,4:1};

// クライアントの命式インデックス（MY）は core-init.js 側で D.client.myから設定される
var MY = { ds:0, db:0, ms:0, mb:0, ys:0, yb:0, tc:[0,1] };

function _kidx(y,m,d){var r=Date.UTC(2000,0,1);var t=Date.UTC(y,m-1,d);return((Math.round((t-r)/864e5)%60)+60+54)%60}
function _ms(myStem,os){var a=WX[myStem],b=WX[os],s=(myStem%2===os%2);if(a===b)return MSN[s?0:1];if(GN[a]===b)return MSN[s?2:3];if(CL[a]===b)return MSN[s?4:5];if(CL[b]===a)return MSN[s?6:7];if(GN[b]===a)return MSN[s?8:9];return MSN[0]}
function _bs(myStem,br){return BSA[BSM[J12[myStem][br]]]}

function _asp(s,b){
  var a=[],ps=[{s:MY.ds,b:MY.db,n:'日柱'},{s:MY.ms,b:MY.mb,n:'月柱'},{s:MY.ys,b:MY.yb,n:'年柱'}];
  var go=[[0,5],[1,6],[2,7],[3,8],[4,9]],sg=[[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
  var hk=[[2,6,10],[5,9,1],[8,0,4],[11,3,7]];
  var tc=[[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]],ga=[[0,7],[1,6],[2,5],[3,4],[8,11],[9,10]];
  var jk=[4,6,9,11],kk=[1,4,7,10];
  for(var i=0;i<ps.length;i++){var p=ps[i];
    if(s===p.s&&b===p.b)a.push(p.n+'：律音');
    var aw=WX[s],pw=WX[p.s];
    if(CL[aw]===pw||CL[pw]===aw){for(var t=0;t<tc.length;t++){if((b===tc[t][0]&&p.b===tc[t][1])||(b===tc[t][1]&&p.b===tc[t][0])){a.push(p.n+'：天剋地冲');break}}}
    for(var g=0;g<go.length;g++){if((s===go[g][0]&&p.s===go[g][1])||(s===go[g][1]&&p.s===go[g][0])){a.push(p.n+'：干合');break}}
    for(var x=0;x<sg.length;x++){if((b===sg[x][0]&&p.b===sg[x][1])||(b===sg[x][1]&&p.b===sg[x][0])){a.push(p.n+'：支合');break}}
    // 半会・大半会：同一三合グループ内での支の距離で判定（距離4=半会／距離8=大半会）。重複判定を防ぐため同一ループ内で排他処理
    var sanGoHit=false;
    for(var h=0;h<hk.length&&!sanGoHit;h++){
      if(hk[h].indexOf(b)>=0&&hk[h].indexOf(p.b)>=0&&b!==p.b){
        var diff=((b-p.b)%12+12)%12;
        if(diff===4||diff===8){a.push(p.n+'：'+(diff===4?'半会':'大半会'));sanGoHit=true;}
      }
    }
    for(var t2=0;t2<tc.length;t2++){if((b===tc[t2][0]&&p.b===tc[t2][1])||(b===tc[t2][1]&&p.b===tc[t2][0])){a.push(p.n+'：対冲');break}}
    for(var j=0;j<ga.length;j++){if((b===ga[j][0]&&p.b===ga[j][1])||(b===ga[j][1]&&p.b===ga[j][0])){a.push(p.n+'：害');break}}
    if(jk.indexOf(b)>=0&&b===p.b)a.push(p.n+'：自刑');
    if(kk.indexOf(b)>=0&&kk.indexOf(p.b)>=0&&b!==p.b)a.push(p.n+'：庫刑');
    var sk=[2,5,8];if(sk.indexOf(b)>=0&&sk.indexOf(p.b)>=0&&b!==p.b)a.push(p.n+'：生刑');
    if((b===0&&p.b===3)||(b===3&&p.b===0))a.push(p.n+'：旺刑');
    if(s!==p.s&&b===p.b){var sum1=(s+b)%10,sum2=(p.s+p.b)%10;if(sum1===sum2)a.push(p.n+'：納音')}
  }
  // 方三位：日運の支＋命式の月支・年支が同一の方合三支（東方木＝寅卯辰／南方火＝巳午未／西方金＝申酉戌／北方水＝亥子丑）に揃う場合
  var hoSanGroups=[[2,3,4],[5,6,7],[8,9,10],[11,0,1]];
  for(var hg=0;hg<hoSanGroups.length;hg++){
    var grp=hoSanGroups[hg];
    if(grp.indexOf(b)>=0){
      var hasDay=(grp.indexOf(MY.db)>=0), hasMonth=(grp.indexOf(MY.mb)>=0), hasYear=(grp.indexOf(MY.yb)>=0);
      var members=[];
      if(hasDay&&MY.db!==b)members.push('日柱');
      if(hasMonth&&MY.mb!==b)members.push('月柱');
      if(hasYear&&MY.yb!==b)members.push('年柱');
      if(MY.db===b&&members.indexOf('日柱')<0&&hasDay)members.push('日柱');
      if(MY.mb===b&&members.indexOf('月柱')<0&&hasMonth)members.push('月柱');
      if(MY.yb===b&&members.indexOf('年柱')<0&&hasYear)members.push('年柱');
      if(members.length>=2){a.push(members.join('+')+' 方三位');}
      break;
    }
  }
  if(MY.tc.indexOf(b)>=0)a.push('日天中殺');
  return a;
}

function computeFortune(y,m,d){
  var idx=_kidx(y,m,d),si=idx%10,bi=idx%12;
  var k=STEMS[si]+BRANCHES[bi],ms=_ms(MY.ds,si),bs=_bs(MY.ds,bi);
  var asp=_asp(si,bi);
  var isTenchu=(MY.tc.indexOf(bi)>=0);
  if(isTenchu){var has=false;for(var i=0;i<asp.length;i++)if(asp[i]==='日天中殺')has=true;if(!has)asp.push('日天中殺')}
  return{date:m+'/'+d, kanshi:k, mainStar:ms, jyusei:bs, aspects:asp, isTenchu:isTenchu};
}

// ---------- 12段階旅フロー（無料版天中殺チェッカー相当） ----------
// level: 運気の強さ（12=最強〜1=最弱）。六星占術の12運気（種子→緑生→立花→健弱→
// 達成→乱気→再会→財成→安定→陰影→停止→減退）の強弱順を踏まえて割り当てている。
// 11・12（停止・減退）が天中殺（日天中殺）にあたる、サイクル全体で最も弱い2日。
var TRAVEL_STAGES=[
  {emoji:"🧳",name:"荷造り",sub:"準備",level:5,
    hint:"新しい何かを始めるのに向いた日",
    longHint:"新しい何かを始めるのに向いた日。派手な動きより、小さな種をまくくらいのイメージで。今日始めたことは1〜2ヶ月後に芽が出やすい時期です。"},
  {emoji:"🚶",name:"旅の出発",sub:"移動",level:8,
    hint:"始めたことが育ちやすい日",
    longHint:"始めたことが育ちやすい日。前向きな話・新しい人との会話・学びに向きます。少し勇気を出して踏み出すと、風が味方してくれる感覚があるはず。"},
  {emoji:"🌅",name:"目的地到着",sub:"成功",level:10,
    hint:"「決める」に向いた日",
    longHint:"「決める」に向いた日。大事な連絡・プレゼン・契約サインなど、勝負どころに立つのに強い日。積み重ねてきた人ほど成果が見えます。"},
  {emoji:"⏳",name:"休憩",sub:"ブレーキ",level:6,
    hint:"体と心が疲れやすい日",
    longHint:"体と心が疲れやすい日。頑張りすぎず、体調管理を優先。「今日は無理しない」と決めるだけで乗り切れます。大きな決断は明日以降に回すのが吉。"},
  {emoji:"🎉",name:"旅のハイライト",sub:"最高の瞬間",level:12,
    hint:"12日で一番エネルギーが高い日",
    longHint:"12日で一番エネルギーが高い日。願いや目標が形になりやすい。「今日やっとこう」と思ってたことに集中すると、想像以上の結果がついてくることも。"},
  {emoji:"🌪️",name:"道中のトラブル",sub:"試練",level:4,
    hint:"感情がざわつきやすい日",
    longHint:"感情がざわつく・小さなトラブルが起きやすい日。人に反応しすぎず、深呼吸してから返事するのがおすすめ。大きな契約・投資は明日以降に。"},
  {emoji:"🛤️",name:"ルート変更",sub:"選択の時",level:7,
    hint:"昔の縁が動き出しやすい日",
    longHint:"昔の縁が動き出す日。懐かしい人からの連絡・過去のプロジェクトの再開・やり直したかった何かに手を伸ばす、そんな日。"},
  {emoji:"🛍️",name:"お土産購入",sub:"収穫",level:9,
    hint:"実りが返ってくる日",
    longHint:"実りが返ってくる日。お金・成果・評価が動きやすい。臨時収入や嬉しい依頼が来ることも。ここまで頑張ってきた自分にご褒美をあげてもいい日。"},
  {emoji:"🏠",name:"帰路につく",sub:"次の準備",level:6,
    hint:"穏やかで落ち着ける日",
    longHint:"穏やかで落ち着ける日。派手なことより、日常を整える・大切な人とゆっくり過ごすのに向きます。「安定」を感じ、次のサイクルへの土台を作る日。"},
  {emoji:"🛌",name:"休息",sub:"充電期間",level:3,
    hint:"少し内側にこもる日",
    longHint:"少し内側にこもる日。孤独を感じやすいけど、それは充電の合図。目立たない場所で自分の中身を整える時間として使うと、次のサイクルに活きます。"},
  {emoji:"🚧",name:"旅の終わり",sub:"低迷期",level:1,
    hint:"12日サイクルの底・日天中殺",
    longHint:"12日サイクルの底。物事が停滞しやすく、無気力になりがち。焦らず休むのが正解。ここで動きたい気持ちを抑えられると、次のサイクルが軽くなります。"},
  {emoji:"🔄",name:"次の旅の計画",sub:"再スタート",level:2,
    hint:"次のサイクルの入口・日天中殺",
    longHint:"12日サイクルの終わり=次のサイクルの入口。エネルギーが少ない中で、静かに次を思い描く日。無理して動かず、内側を整えましょう。"}
];
var BRANCH_ORDER=["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

// 運気レベル(1-12)を●○のドットで可視化する（12段階中どのくらいの強さか一目でわかるように）
function renderLevelDots(level) {
  var dots = '';
  for (var i = 1; i <= 12; i++) {
    dots += (i <= level) ? '●' : '○';
  }
  return dots;
}

function getTravelStage(tenchuBr, todayDshi) {
  var startIdx = BRANCH_ORDER.indexOf(tenchuBr[0]);
  var todayIdx = BRANCH_ORDER.indexOf(todayDshi);
  var stage = ((todayIdx - startIdx + 10) % 12);
  return TRAVEL_STAGES[stage];
}

// ---------- 主星の意味（月単位の指針づくりに使う） ----------
var mainStarDesc = {
  '貫索星': '自分のペースを守る力が強まる時期。単独で動く・自分の軸を固める動きが合います。',
  '石門星': '人との繋がり・仲間作りの力が強まる時期。人に会う・輪を広げる動きが合います。',
  '鳳閣星': '表現・発信の力が強まる時期。自然体で伝える・楽しむ動きが合います。',
  '調舒星': '感性・創造の力が強まる時期。一人で集中する・作品や個性を磨く動きが合います。',
  '禄存星': '人に尽くす・愛情を注ぐ力が強まる時期。人のために動く・奉仕する動きが合います。',
  '司禄星': '蓄積・堅実さの力が強まる時期。貯める・家庭を整える動きが合います。',
  '車騎星': '行動力・前進力が強まる時期。動きながら考える・素早く動く動きが合います。',
  '牽牛星': '責任感・名誉を求める力が強まる時期。役割を果たす・肩書きを意識した動きが合います。',
  '龍高星': '改革・変化を求める力が強まる時期。新しいことに挑戦する・環境を変える動きが合います。',
  '玉堂星': '学び・伝統を重んじる力が強まる時期。学ぶ・じっくり考える動きが合います。'
};

// 月単位のガイダンス（天中殺・位相法・主星を統合した「今月どう動くか」）
// 戻り値は buildTodayGuidance と同じ { groups, summary } 構造。
function buildMonthGuidance(monthF) {
  var phaseLines = [];
  var aspKeys = getAspectKeys(monthF.aspects || '');
  var hasCaution = false, hasGood = false;

  if (monthF.isTenchu) {
    var tc = ASPECT_ACTION['天中殺'];
    phaseLines.push('🌀 月天中殺：' + tc.monthText.replace(/^今月は/, ''));
    if (tc.why) phaseLines.push('　└ なぜ：' + tc.why);
    hasCaution = true;
  }
  for (var i = 0; i < aspKeys.length; i++) {
    var k = aspKeys[i];
    if (k === '天中殺') continue;
    var a = ASPECT_ACTION[k];
    phaseLines.push((a.tone === 'good' ? '🌼 ' : a.tone === 'caution' ? '⚡ ' : '🔔 ') + k + '：' + a.monthText);
    if (a.why) phaseLines.push('　└ なぜ：' + a.why);
    if (a.tone === 'caution') hasCaution = true;
    if (a.tone === 'good') hasGood = true;
  }

  var groups = [];
  if (phaseLines.length > 0) groups.push({ label:'位相法の観点', lines:phaseLines });

  var msDesc = mainStarDesc[monthF.mainStar];
  if (msDesc) groups.push({ label:'今月の主星（' + monthF.mainStar + '）', lines:['⭐ ' + msDesc] });

  var summary;
  if (monthF.isTenchu) {
    summary = '総合すると、今月は新しく大きく動くより、既にあるものを整える月にすると無理がありません。';
  } else if (hasCaution && hasGood) {
    summary = '総合すると、伸びる流れと注意すべき流れが両方来ている月。的を絞って動くと結果が出やすいです。';
  } else if (hasCaution) {
    summary = '総合すると、今月は慎重に構えるのが吉な月。大きな決断は来月以降に回すのも一つの手です。';
  } else if (hasGood) {
    summary = '総合すると、今月は動くと結果が出やすい月。気になっていたことを一つ、今月中に進めてみてください。';
  } else {
    summary = '総合すると、今月は特別な追い風も向かい風もない、いつも通りのペースで過ごせる月です。';
  }

  return { groups: groups, summary: summary };
}

// ---------- 従星の意味 ----------
var jyuseiDesc = {
  '天報星': '転生の星(エネルギー3)。多芸多才。色んな方向に動ける日や。',
  '天印星': '赤ちゃんの星(6)。素直さと愛嬌が武器。甘えてええ日。',
  '天貴星': '品格の星(9)。プライドが力になる。堂々と立つ日や。',
  '天恍星': '青春の星(7)。ロマンチックで感性が冴える日。',
  '天南星': '前進の星(10)。勢いがある日。積極的に動いてええ。',
  '天禄星': '壮年の星(11)。実力発揮。責任ある仕事に向く日。',
  '天将星': '王様の星(12)。最大エネルギー。決断の日や。',
  '天堂星': '老人の星(8)。経験値で勝負。穏やかに過ごす日。',
  '天胡星': '霊感の星(4)。感性が鋭い。美や芸術に触れるとええ。',
  '天極星': '死の星(2)。体力低め。省エネで過ごす日。',
  '天庫星': '入墓の星(5)。片付け・整理に向く。内省の日。',
  '天馳星': 'あの世の星(1)。体力の底。スピ感性が高まる。早く寝る日や。'
};

// ---------- 位相法の意味（今日のアドバイス生成に使う） ----------
// 各位相法が「日柱・月柱・年柱」のどこに付いても使える、行動レベルの一言。
var ASPECT_ACTION = {
  '天中殺':   { tone:'caution',
    why:'十干の力が及ばない「気の欠ける」干支が巡ってくる日。普段のセルフイメージという枠が外れて、上にも下にも振れやすくなる。',
    text:'今日は新しい決断・大きな契約は避けて、今あるものを整える日にすると無理がありません。',
    action:'新規の契約書にサインする・大きな買い物を決める、といった「後戻りしにくい決断」を今日に置かない。今日やるなら、今持っているものの整理・見直し・掃除が向いている。',
    monthText:'今月は新しい決断・大きな契約は避けて、今あるものを整える月にすると無理がありません。' },
  '天剋地冲': { tone:'caution',
    why:'「天に剋され、地に破壊される」構造。命式の中で最も強い位相法の一つで、表面と内面のギャップが一気に表れる。',
    text:'衝撃的な変化が起きやすい日。表面はいつも通りでも内側で葛藤が動きやすいので、大きな判断は一呼吸置いてから。',
    action:'急な感情の揺れや思わぬ出来事があっても、その場で結論を出さない。一晩置いてから返事をする、契約や約束は翌日以降に回す。',
    monthText:'衝撃的な変化が起きやすい月。表面はいつも通りでも内側で葛藤が動きやすいので、大きな判断は一呼吸置いてから。' },
  '対冲':     { tone:'caution',
    why:'干支が真反対の位置でぶつかる配置。前進と後退が交互に現れやすく、結果に固執すると余計にこじれる。',
    text:'物事がぶつかりやすい日。結果に固執せず、進んだり戻ったりを繰り返す前提でいると気持ちが楽になります。',
    action:'相手と意見が食い違っても、その場で決着をつけようとしない。「今日は結論を出さない」と決めておくだけで衝突が和らぐ。',
    monthText:'物事がぶつかりやすい月。結果に固執せず、進んだり戻ったりを繰り返す前提でいると気持ちが楽になります。' },
  '害':       { tone:'caution',
    text:'本音を飲み込みやすく、モヤモヤが溜まりやすい日。無理に丸く収めようとせず、言いたいことは小出しにしておくのがコツ。',
    why:'干支同士の不自然な組み合わせ。我慢や言えなさが蓄積しやすく、精神世界や一人の時間で発散する方が合う。',
    action:'全部を一度に言おうとせず、伝えたいことは一つだけ小さく口に出す。日記やメモに書き出すだけでも溜め込みが減る。',
    monthText:'本音を飲み込みやすく、モヤモヤが溜まりやすい月。無理に丸く収めようとせず、言いたいことは小出しにしておくのがコツ。' },
  '刑':       { tone:'caution',
    why:'「争い」の位相法。「やらなあかん」という自分を縛る感覚が強まりやすい配置。',
    text:'「やらなあかん」に追われやすい日。自分を縛りすぎず、期限より先にペースを緩める判断をしても大丈夫です。',
    action:'締め切りやノルマを一つ、今日だけ緩めてみる。全部時間通りにやろうとせず、優先順位の低いものは翌日に回す。',
    monthText:'「やらなあかん」に追われやすい月。自分を縛りすぎず、期限より先にペースを緩める判断をしても大丈夫です。' },
  '旺刑':     { tone:'caution',
    why:'身近な人（夫婦・親子・友人・恋人）との間で起きやすい刑。感情的な衝突が体調（胃痛・食欲不振）に出やすいとされる。',
    text:'身近な人とのすれ違いが出やすい日。感情的な言い合いより、少し距離を置いて様子を見るのが吉。',
    action:'家族や近しい人と衝突しそうになったら、その場を一度離れる。「今は答えない」と伝えるだけでも十分。',
    monthText:'身近な人とのすれ違いが出やすい月。感情的な言い合いより、少し距離を置いて様子を見るのが吉。' },
  '自刑':     { tone:'caution',
    why:'自分自身との内的葛藤が強まる配置。頭痛・不眠・自律神経の乱れとして体に出やすいとされる。',
    text:'自分で自分を追い込みやすい日。頭の中でグルグル考えすぎず、体を動かして気分を切り替えるのがおすすめ。',
    action:'考え込みそうになったら、散歩や軽い運動で一度頭を切り替える。一人で抱え込まず、誰かに話すだけでも軽くなる。',
    monthText:'自分で自分を追い込みやすい月。頭の中でグルグル考えすぎず、体を動かして気分を切り替えるのがおすすめ。' },
  '庫刑':     { tone:'caution',
    why:'目上・権力関係で起きやすい刑。上からのプレッシャーが強まりやすく、腰痛や高血圧など体の張りに出やすいとされる。',
    text:'目上・上の立場の人からのプレッシャーを感じやすい日。無理に張り合わず、聞き役に回ると波風が立ちません。',
    action:'上司や年長者との会話では、まず聞く姿勢に徹する。反論したくなっても、一旦受け止めてから話すと衝突を避けやすい。',
    monthText:'目上・上の立場の人からのプレッシャーを感じやすい月。無理に張り合わず、聞き役に回ると波風が立ちません。' },
  '生刑':     { tone:'caution',
    why:'部下・子供など目下との立場の上下関係で起きやすい刑。指示的な態度が余計に摩擦を生みやすい。',
    text:'下の立場の人・子供との間で摩擦が出やすい日。指示より対話を意識すると収まりやすい日です。',
    action:'子供や部下に何かを伝える時、命令形ではなく「どう思う？」と問いかける形にする。今日は指導より傾聴を優先する。',
    monthText:'下の立場の人・子供との間で摩擦が出やすい月。指示より対話を意識すると収まりやすい月です。' },
  '半会':     { tone:'good',
    why:'異次元融合・広がりの位相法。目標に向かう前進力や、アイデア・人脈が広がる追い風の配置。',
    text:'物事が広がりやすい、追い風の日。気になっていたことに一歩踏み出すのに向いています。',
    action:'先延ばしにしていた連絡・相談・申し込みを一つ、今日実行してみる。小さな一歩が広がりやすいタイミング。',
    monthText:'物事が広がりやすい、追い風の月。気になっていたことに一歩踏み出すのに向いています。' },
  '大半会':   { tone:'good',
    why:'半会よりさらに強い、命式の中でも最強クラスの拡大の配置。ただし片方が踏み台、片方が飛躍する構造も持つため人間関係では注意も要る。',
    text:'今日は最強クラスの追い風。ここぞという決断・発信・行動は、思い切って今日に合わせるのが吉。',
    action:'温めていた計画・伝えたかったこと・出したかった発信を、今日にぶつけてみる。ただし人間関係では「自分ばかり」という感覚が出ていないか一度振り返る。',
    monthText:'今月は最強クラスの追い風。ここぞという決断・発信・行動は、思い切って今月に合わせるのが吉。' },
  '支合':     { tone:'good',
    why:'同次元融合・二人三脚の位相法。人や物事としっくり噛み合いやすく、判断基準が「好き嫌い」で一致しやすい。',
    text:'人や物事としっくり噛み合いやすい日。人に会う・相談する・繋がりを作るのに向いています。',
    action:'誰かに会う約束、相談ごとの持ちかけ、新しい人との接点づくりを今日に置くとスムーズに進みやすい。',
    monthText:'人や物事としっくり噛み合いやすい月。人に会う・相談する・繋がりを作るのに向いています。' },
  '干合':     { tone:'good',
    why:'十干同士が結びつき、化合先の性質に変化する配置。内側の本音と外向きの行動が繋がりやすい。',
    text:'内側と深く繋がりやすい日。本音で話す・自分の考えを言葉にするのに向いた日です。',
    action:'言いにくかったことを言葉にしてみる、自分の考えを文章や会話でまとめてみる。今日出した言葉は相手に届きやすい。',
    monthText:'内側と深く繋がりやすい月。本音で話す・自分の考えを言葉にするのに向いた月です。' },
  '方三位':   { tone:'good',
    why:'寅卯辰・巳午未など三支が揃う配置。守備本能が突出し、専門性・一業専念に力が結集しやすい。',
    text:'一つのことに力が結集しやすい日。一業専念・専門性を深める動きが噛み合いやすいです。',
    action:'色々なことに手を出すより、今一番大事な一つのことに時間を割く。専門性を深める勉強・作業に向いている。',
    monthText:'一つのことに力が結集しやすい月。一業専念・専門性を深める動きが噛み合いやすいです。' },
  '律音':     { tone:'neutral',
    why:'人生が2分される「開始・二面性・分岐」の配置。同じ干支が巡ることで、原点回帰や仕切り直しが起きやすい。',
    text:'一区切りがつきやすい日。新しく仕切り直すのにも、過去を振り返るのにも向いています。',
    action:'区切りをつけたいことを一つ決める。過去の出来事を振り返って気持ちを整理するのにも向いた日。',
    monthText:'一区切りがつきやすい月。新しく仕切り直すのにも、過去を振り返るのにも向いています。' },
  '納音':     { tone:'neutral',
    why:'因縁解脱・折り返しの配置。人生の折り返し地点として、古いものと決別し次に向かう節目になりやすい。',
    text:'何かが終わり、次が始まる節目の日。無理に引き延ばさず、区切りをつける方向で動くと楽になります。',
    action:'続けるかやめるか迷っていることがあれば、今日「終わらせる」方向で動いてみる。無理に引き延ばすと逆に長引きやすい。',
    monthText:'何かが終わり、次が始まる節目の月。無理に引き延ばさず、区切りをつける方向で動くと楽になります。' }
};

function getAspectKeys(aspectsText) {
  // aspectsText は「日柱：半会🌼 年柱：対冲🌊」のような絵文字付き文字列
  var keys = Object.keys(ASPECT_ACTION);
  var found = [];
  for (var i = 0; i < keys.length; i++) {
    if (aspectsText.indexOf(keys[i]) >= 0 && found.indexOf(keys[i]) < 0) found.push(keys[i]);
  }
  // 長い名称（大半会・天剋地冲等）を優先し、部分一致による重複（半会 と 大半会 の共存等）を整理
  if (found.indexOf('大半会') >= 0) found = found.filter(function(k){ return k !== '半会'; });
  return found;
}

// 天中殺・位相法・12段階旅フローを統合して「今日どう動くか」の一言を作る
// 戻り値は { groups: [{label, lines:[]}], summary: '' } の構造。
// 「位相法の観点」と「天中殺サイクル（12段階）」は由来が違う技法なので、
// 見出しを分けて出典を明示する（同じ日でも別技法の結論が一見矛盾して見える対策）。
function buildTodayGuidance(todayF, stg, isTenchuDay) {
  var groups = [];
  var aspKeys = getAspectKeys(todayF.aspects || '');
  var hasCaution = false, hasGood = false;

  // ①巡ってきてる星（十大主星・十二大従星）※位相法・天中殺サイクルとは別の技法
  var starLines = [];
  var msDesc = mainStarDesc[todayF.mainStar];
  if (msDesc) starLines.push('⭐ ' + todayF.mainStar + '：' + msDesc);
  var jdesc = jyuseiDesc[todayF.jyusei] || '';
  if (jdesc) starLines.push('🌟 ' + todayF.jyusei + '：' + jdesc);
  if (starLines.length > 0) groups.push({ label:'巡ってきてる星', lines:starLines });

  // ②位相法の観点（天中殺含む）。技法の由来（why）→今日の意味（text）→具体的な動き方（action）の3段で深掘りする
  var phaseLines = [];
  if (isTenchuDay || todayF.isTenchu) {
    var tc = ASPECT_ACTION['天中殺'];
    phaseLines.push('🌀 日天中殺：' + tc.text.replace(/^今日は/, ''));
    if (tc.why) phaseLines.push('　└ なぜ：' + tc.why);
    if (tc.action) phaseLines.push('　└ 今日の動き方：' + tc.action);
    hasCaution = true;
  }
  for (var i = 0; i < aspKeys.length; i++) {
    var k = aspKeys[i];
    if (k === '天中殺') continue;
    var a = ASPECT_ACTION[k];
    phaseLines.push((a.tone === 'good' ? '🌼 ' : a.tone === 'caution' ? '⚡ ' : '🔔 ') + k + '：' + a.text);
    if (a.why) phaseLines.push('　└ なぜ：' + a.why);
    if (a.action) phaseLines.push('　└ 今日の動き方：' + a.action);
    if (a.tone === 'caution') hasCaution = true;
    if (a.tone === 'good') hasGood = true;
  }
  if (phaseLines.length > 0) groups.push({ label:'位相法の観点', lines:phaseLines });

  // ③天中殺サイクル（12段階旅フロー）※日天中殺かどうかとは別の、12日周期の技法
  if (stg && stg.longHint) {
    var cycleLines = ['🧭 ' + stg.longHint];
    if (stg.hint) cycleLines.push('　└ 今日のヒント：' + stg.hint);
    cycleLines.push('　└ 全12段階中の位置：' + (TRAVEL_STAGES.indexOf(stg) + 1) + '段階目・運気レベル' + stg.level);
    groups.push({ label:'天中殺サイクル（12段階の' + (stg.name) + '）', lines:cycleLines });
  }

  // ③総合の一言（吉日か注意日かをまとめて明示。ここだけは2つの技法をまたいだ㐂の判断として出す）
  var summary;
  if (isTenchuDay || todayF.isTenchu) {
    summary = '総合すると、今日は「動く」より「整える」に向いた日です。';
  } else if (hasCaution && hasGood) {
    summary = '総合すると、良い流れと注意すべき流れが両方来ている日。無理に全部を進めようとせず、一つに絞って動くと吉です。';
  } else if (hasCaution) {
    summary = '総合すると、今日は慎重に構えるのが吉。大きな決断は避けて、様子を見る日にしましょう。';
  } else if (hasGood) {
    summary = '総合すると、今日は動くと結果が出やすい日。気になっていたことを一つ、今日進めてみてください。';
  } else {
    summary = '総合すると、今日は特別な追い風も向かい風もない、いつも通りのペースで過ごせる日です。';
  }

  return { groups: groups, summary: summary };
}

// { groups, summary } 構造を、出典（位相法／天中殺サイクル等）を見出しとして
// 明示したHTMLに組み立てる。技法の由来が違う結論を並べる時は必ず見出しで区切る。
function renderGuidanceHTML(label, guidance) {
  var html = '<div class="today-guidance">';
  if (label) html += '<p class="today-guidance-lbl">' + label + '</p>';
  for (var gi = 0; gi < guidance.groups.length; gi++) {
    var grp = guidance.groups[gi];
    html += '<p class="today-guidance-group-lbl">' + grp.label + '</p>';
    for (var li = 0; li < grp.lines.length; li++) {
      html += '<p class="today-guidance-line">' + grp.lines[li] + '</p>';
    }
  }
  html += '<p class="today-guidance-line today-guidance-summary">👉 ' + guidance.summary + '</p>';
  html += '</div>';
  return html;
}

// ---------- 位相法の絵文字装飾 ----------
function emojiForAspects(aspStr) {
  var parts = aspStr.split(/[\s,、，]+/).filter(function(x){return x;});
  var out = [];
  for (var i = 0; i < parts.length; i++) {
    var a = parts[i], emoji = '';
    if (a.indexOf('天中殺') >= 0) emoji = '🌀';
    else if (a.indexOf('天剋地冲') >= 0) emoji = '🌊';
    else if (a.indexOf('干合') >= 0) emoji = '🔗';
    else if (a.indexOf('支合') >= 0) emoji = '🤝';
    else if (a.indexOf('半会') >= 0 || a.indexOf('大半会') >= 0) emoji = '🌼';
    else if (a.indexOf('対冲') >= 0) emoji = '🌊';
    else if (a.indexOf('害') >= 0) emoji = '💫';
    else if (a.indexOf('刑') >= 0) emoji = '⚡';
    else if (a.indexOf('律音') >= 0) emoji = '🎵';
    else if (a.indexOf('納音') >= 0) emoji = '🔔';
    else if (a.indexOf('方三位') >= 0) emoji = '🧭';
    out.push(a + (emoji ? emoji : ''));
  }
  return out;
}

// dailyAdvice は D.dailyAdvice（クライアントJSON）から参照する
function getFortuneByDate(month, day, year) {
  if (!year) year = (month >= 6 && month <= 12) ? 2026 : 2027;
  var calc = computeFortune(year, month, day);
  var key = month + '/' + day;
  var manual = (D.dailyAdvice || {})[key];
  var adv = (manual && manual.advice) ? manual.advice : '';
  var aspectsText, isTenchu;
  if (manual && typeof manual.aspects === 'string') {
    aspectsText = manual.aspects.trim() ? emojiForAspects(manual.aspects).join(' ') : '-';
    isTenchu = (typeof manual.isTenchu === 'boolean') ? manual.isTenchu : calc.isTenchu;
  } else {
    var aspEmo = emojiForAspects(calc.aspects.join(' '));
    aspectsText = aspEmo.length > 0 ? aspEmo.join(' ') : '-';
    isTenchu = calc.isTenchu;
  }
  return {
    date: calc.date, kanshi: calc.kanshi, mainStar: calc.mainStar, jyusei: calc.jyusei,
    aspects: aspectsText,
    isTenchu: isTenchu, advice: adv
  };
}

function getToday() {
  var n = new Date();
  return { month: n.getMonth()+1, day: n.getDate(), year: n.getFullYear() };
}

function getJapaneseDate(m, d) {
  var ms = ['','一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  var ds = {1:'一',2:'二',3:'三',4:'四',5:'五',6:'六',7:'七',8:'八',9:'九',10:'十',
    11:'十一',12:'十二',13:'十三',14:'十四',15:'十五',16:'十六',17:'十七',18:'十八',19:'十九',20:'二十',
    21:'二十一',22:'二十二',23:'二十三',24:'二十四',25:'二十五',26:'二十六',27:'二十七',28:'二十八',29:'二十九',30:'三十',31:'三十一'};
  return { month: ms[m] || (m+'月'), day: (ds[d] || (d+'日')) + (ds[d]?'日':'') };
}

function getCurrentMonthFortune(m, d, y) {
  var today;
  if (y === 2026) today = m * 100 + d;
  else if (y === 2027) today = 1200 + m * 100 + d;
  else return D.monthlyFortunes[0];
  for (var i = 0; i < D.monthlyFortunes.length; i++) {
    var f = D.monthlyFortunes[i];
    var match = f.period.match(/(?:(\d{4})\/)?(\d+)\/(\d+)〜(?:(\d{4})\/)?(\d+)\/(\d+)/);
    if (!match) continue;
    var sY = match[1] ? +match[1] : 2026, sM = +match[2], sD = +match[3];
    var eY = match[4] ? +match[4] : sY, eM = +match[5], eD = +match[6];
    if (eY < sY) eY = sY;
    var sKey = (sY === 2027 ? 1200 : 0) + sM * 100 + sD;
    var eKey = (eY === 2027 ? 1200 : 0) + eM * 100 + eD;
    if (today >= sKey && today <= eKey) return f;
  }
  return D.monthlyFortunes[0];
}

function isInTenchuPeriod(m, d, y) {
  if (!D.monthlyTenchuPeriod) return false;
  if (y !== D.monthlyTenchuPeriod.endYear) return false;
  var p = D.monthlyTenchuPeriod;
  var today = m * 100 + d;
  return today >= p.startMonth * 100 + p.startDay && today <= p.endMonth * 100 + p.endDay;
}

function getDaysUntil(year, month, day) {
  var now = new Date(); now.setHours(0,0,0,0);
  var target = new Date(year, month - 1, day);
  var diff = Math.ceil((target - now) / (1000*60*60*24));
  return diff > 0 ? diff : 0;
}

var calMonths = [];
var currentCalIdx = 0;

function initCalMonths() {
  var t = getToday();
  var months = [];
  for (var i = 0; i < 3; i++) {
    var mm = t.month + i, yy = t.year;
    while (mm > 12) { mm -= 12; yy += 1; }
    months.push({ y: yy, m: mm, label: mm + '月' });
  }
  calMonths = months;
  currentCalIdx = 0;
}

function buildMonthGridHTML(year, month, todayM, todayD, todayY) {
  var firstDay = new Date(year, month - 1, 1).getDay();
  var startOffset = (firstDay === 0) ? 6 : firstDay - 1;
  var daysInMonth = new Date(year, month, 0).getDate();
  var html = '<div class="cal-grid">';
  var days = ['月','火','水','木','金','土','日'];
  for (var i = 0; i < 7; i++) html += '<div class="cal-header">' + days[i] + '</div>';
  for (var i = 0; i < startOffset; i++) html += '<div class="cal-cell empty"></div>';
  for (var d = 1; d <= daysInMonth; d++) {
    var f = getFortuneByDate(month, d, year);
    var isToday = (month === todayM && d === todayD && year === todayY);
    var cls = 'cal-cell';
    if (isToday) cls += ' today';
    if (f && f.isTenchu) cls += ' tenchu-day';
    var bg = '';
    if (f) {
      if (f.aspects.indexOf('律音') >= 0) bg = 'background:rgba(91,143,102,0.15);';
      else if (f.aspects.indexOf('天剋地冲') >= 0) bg = 'background:rgba(196,122,64,0.15);';
      else if (f.isTenchu) bg = 'background:rgba(74,123,142,0.10);';
      else if (f.aspects.indexOf('干合') >= 0 || f.aspects.indexOf('支合') >= 0) bg = 'background:rgba(58,107,71,0.10);';
      else if (f.aspects.indexOf('半会') >= 0 || f.aspects.indexOf('大半会') >= 0) bg = 'background:rgba(143,184,150,0.18);';
    }
    html += '<div class="' + cls + '" style="' + bg + '" onclick="openDetail(' + year + ',' + month + ',' + d + ')">';
    html += '<span class="cal-day">' + d + '</span>';
    if (f) {
      var shortAspect = '';
      if (f.aspects.indexOf('律音') >= 0) shortAspect = '🎵';
      else if (f.aspects.indexOf('天剋地冲') >= 0) shortAspect = '🌊';
      else if (f.isTenchu) shortAspect = '🌀';
      else if (f.aspects.indexOf('干合') >= 0 && f.aspects.indexOf('支合') >= 0) shortAspect = '🔗🤝';
      else if (f.aspects.indexOf('干合') >= 0) shortAspect = '🔗';
      else if (f.aspects.indexOf('支合') >= 0) shortAspect = '🤝';
      else if (f.aspects.indexOf('半会') >= 0 || f.aspects.indexOf('大半会') >= 0) shortAspect = '🌼';
      else if (f.aspects.indexOf('害') >= 0) shortAspect = '💫';
      else if (f.aspects.indexOf('刑') >= 0) shortAspect = '⚡';
      if (shortAspect) html += '<span class="cal-aspect">' + shortAspect + '</span>';
      // 天中殺サイクル（12段階）の何日目かを小さく併記
      var dDshi = f.kanshi.charAt(1);
      var dStg = getTravelStage(D.client.tenchuBranches || ['子','丑'], dDshi);
      var dStageNum = TRAVEL_STAGES.indexOf(dStg) + 1;
      html += '<span class="cal-stage">' + dStageNum + '段</span>';
    }
    html += '</div>';
  }
  html += '</div>';
  return html;
}

function switchCalMonth(idx) {
  currentCalIdx = idx;
  for (var i = 0; i < calMonths.length; i++) {
    var el = document.getElementById('cal-grid-' + i);
    if (el) el.style.display = (i === idx) ? '' : 'none';
    var tab = document.getElementById('cal-tab-' + i);
    if (tab) tab.className = 'cal-month-tab' + (i === idx ? ' active' : '');
  }
}

function openDetail(year, month, day) {
  var f = getFortuneByDate(month, day, year);
  var jdesc = jyuseiDesc[f.jyusei] || '';
  var dDshi = f.kanshi.charAt(1);
  var dStg = getTravelStage(D.client.tenchuBranches || ['子','丑'], dDshi);
  var dStageNum = TRAVEL_STAGES.indexOf(dStg) + 1;
  var dIsTenchuDay = (dStageNum === 11 || dStageNum === 12);

  var html = '<button class="detail-close" onclick="closeDetail()">×</button>';
  html += '<p class="detail-date-stars">' + year + '年' + month + '月' + day + '日<span class="detail-day-stars"> ' + f.kanshi + ' / ' + f.mainStar + '・' + f.jyusei + '</span></p>';
  if (f.aspects && f.aspects !== '-') {
    html += '<div class="detail-section"><p class="detail-label">位相法</p><p class="detail-text">' + f.aspects + '</p></div>';
  }
  if (jdesc) {
    html += '<div class="detail-section"><p class="detail-label">今日のエネルギー(' + f.jyusei + ')</p><p class="detail-text">' + jdesc + '</p></div>';
  }
  html += '<div class="detail-section"><p class="detail-label">天中殺サイクル（全12段階中の' + dStageNum + '段階目）</p>';
  html += '<p class="detail-text">' + renderLevelDots(dStg.level) + ' 運気レベル ' + dStg.level + '（12段階中）' + (dIsTenchuDay ? '（日天中殺）' : '') + '<br>' + dStg.emoji + ' ' + dStg.name + '（' + dStg.sub + '）：' + dStg.hint + '</p></div>';
  if (f.advice) {
    html += '<div class="detail-section"><p class="detail-label">㐂からの一言</p><p class="detail-text">' + f.advice + '</p></div>';
  }
  document.getElementById('detailContent').innerHTML = html;
  document.getElementById('detailModal').classList.add('active');
}

function closeDetail() {
  document.getElementById('detailModal').classList.remove('active');
}

// ---------- 配色（design）をCSS変数に適用 ----------
function applyDesignColors(design) {
  if (!design || !design.colors) return;
  var root = document.documentElement.style;
  var c = design.colors;
  for (var key in c) {
    if (c.hasOwnProperty(key)) root.setProperty('--color-' + key, c[key]);
  }
}

// ---------- メイン render ----------
function render() {
  var t = getToday();
  var m = t.month, d = t.day, y = t.year;
  var jpDate = getJapaneseDate(m, d);
  var currentMonth = getCurrentMonthFortune(m, d, y);
  var inTenchu = isInTenchuPeriod(m, d, y);
  var todayF = getFortuneByDate(m, d, y);

  document.getElementById('header').innerHTML =
    '<p class="sub">' + D.design.headerSub + '</p>' +
    '<h1>' + D.design.headerTitle + '</h1>' +
    '<p class="tagline">' + D.design.headerTagline + '</p>';

  document.getElementById('footer').innerHTML = '<p>' + D.design.footerText + '</p>';

  var app = document.getElementById('app');
  var html = '';

  // ①日付表示（単独カード。時事セクションの入り口）
  html += '<div class="card">';
  html += '<div class="text-center">';
  html += '<p class="text-xs" style="color:var(--color-brown)">' + (D.design.eraLabel || '') + '</p>';
  html += '<p class="date-display"><span class="date-month">' + jpDate.month + '</span><span style="margin:0 0.5rem">' + jpDate.day + '</span></p>';
  html += '<p class="text-xs" style="color:var(--color-accent);margin-top:0.25rem">' + (todayF ? todayF.kanshi : '') + '</p>';
  html += '</div>';
  html += '</div>';

  // ②本日の運気（簡易版：主星・従星・位相法の一言・カードめくりのみ。詳細解説はカレンダーの後ろに回す）
  var stg, stageNum, isTenchuDay, guidance;
  if (todayF) {
    var jdesc = jyuseiDesc[todayF.jyusei] || '';
    var todayDshi = todayF.kanshi.charAt(1);
    stg = getTravelStage(D.client.tenchuBranches || ['子','丑'], todayDshi);
    stageNum = TRAVEL_STAGES.indexOf(stg) + 1;
    isTenchuDay = (stageNum === 11 || stageNum === 12);
    var imgKey = D.client.travelImgKey || '';
    var imgExt = (D.travelImgExt && D.travelImgExt[imgKey + '_' + stageNum]) || 'webp';

    guidance = buildTodayGuidance(todayF, stg, isTenchuDay);

    html += '<div class="card">';
    html += '<div class="card-header"><span style="color:var(--color-accent)">◆</span><span>本日の運気</span></div>';
    html += '<div class="star-grid">';
    html += '<div class="star-box"><p class="star-label">主星</p><p class="star-value">' + todayF.mainStar + '</p></div>';
    html += '<div class="star-box"><p class="star-label">従星</p><p class="star-value">' + todayF.jyusei + '</p></div>';
    html += '</div>';
    if (todayF.aspects && todayF.aspects !== '-') {
      html += '<p class="text-xs text-center mb-3" style="color:var(--color-brown)">' + todayF.aspects + '</p>';
    }
    if (jdesc) html += '<p class="text-xs" style="background:var(--color-cream);padding:0.6rem;border-radius:4px;color:var(--color-brown-dark);line-height:1.7">' + jdesc + '</p>';
    if (guidance && guidance.summary) html += '<p class="text-xs mt-2" style="color:var(--color-accent);line-height:1.7;font-weight:500">' + guidance.summary + '</p>';

    html += '<div class="k-flow">';
    html += '<div class="k-flow-lbl">天中殺サイクル（全12段階中の' + stageNum + '段階目）</div>';
    html += '<div class="k-flow-stage">' + stg.emoji + ' ' + stg.name + '（' + stg.sub + '）' + (isTenchuDay ? '<span class="k-flow-tag">日天中殺</span>' : '') + '</div>';
    html += '<div class="k-flow-level"><span class="k-flow-level-dots">' + renderLevelDots(stg.level) + '</span><span class="k-flow-level-num">運気レベル ' + stg.level + '（12段階中）</span></div>';
    html += '<div class="k-flow-hint">' + stg.hint + '</div>';
    if (imgKey) {
      html += '<div class="k-card-wrap"><div class="k-card" id="k-card" onclick="this.classList.toggle(\'flipping\')">';
      html += '<div class="k-card-face k-card-front"><div class="k-card-front-inner"><div class="kf-marker">㐂</div><div class="kf-label">TAP TO REVEAL</div></div></div>';
      html += '<div class="k-card-face k-card-back"><img src="clients/images/' + imgKey + '_' + stageNum + '.' + imgExt + '" alt="旅の段階' + stageNum + '">';
      html += '<div class="k-card-caption">' + stg.emoji + ' ' + stg.name + '<br><span style="font-size:0.7rem;opacity:0.8">' + stg.sub + '・運気レベル' + stg.level + '</span>' + (isTenchuDay ? '<span class="kc-tag">日天中殺</span>' : '') + '</div></div>';
      html += '</div></div>';
    }
    html += '</div>';

    html += '</div>';
  }

  // ③今月の流れ（時事セクション）
  if (currentMonth) {
    var monthGuidance = buildMonthGuidance(currentMonth);
    html += '<div class="card">';
    html += '<div class="card-header"><span style="color:var(--color-accent)">◆</span><span>今月の流れ</span></div>';
    html += '<div class="text-center">';
    html += '<p class="text-sm mb-1"><span style="color:var(--color-brown)">' + currentMonth.period + '</span><span style="margin:0 0.5rem">|</span><span style="color:var(--color-accent);font-weight:500">' + currentMonth.kanshi + ' ' + currentMonth.mainStar + '</span></p>';
    if (currentMonth.isTenchu) html += '<span class="badge badge-tenchu">月天中殺</span>';
    html += '</div>';
    html += renderGuidanceHTML('今月どう動くか', monthGuidance);
    if (currentMonth.advice) html += '<p class="text-xs text-center mt-2" style="color:var(--color-brown-dark);line-height:1.7">' + currentMonth.advice + '</p>';
    if (inTenchu && D.monthlyTenchuPeriod) {
      html += '<div class="tenchu-box" style="margin-top:0.75rem">';
      html += '<p class="tenchu-label">月天中殺終了まで</p>';
      html += '<p class="tenchu-days">' + getDaysUntil(D.monthlyTenchuPeriod.endYear, D.monthlyTenchuPeriod.endMonth, D.monthlyTenchuPeriod.endDay + 1) + '<span>日</span></p>';
      html += '<p class="tenchu-note">' + D.monthlyTenchuPeriod.endMonth + '月' + (D.monthlyTenchuPeriod.endDay + 1) + '日から動き出せる</p>';
      html += '</div>';
    }
    html += '</div>';
  }

  // 日運カレンダー
  html += '<div class="card">';
  html += '<div class="card-header"><span style="color:var(--color-accent)">◆</span><span>日運カレンダー</span></div>';
  html += '<div class="cal-month-tabs">';
  for (var i = 0; i < calMonths.length; i++) {
    html += '<div id="cal-tab-' + i + '" class="cal-month-tab' + (i === currentCalIdx ? ' active' : '') + '" onclick="switchCalMonth(' + i + ')">' + calMonths[i].label + '</div>';
  }
  html += '</div>';
  for (var i = 0; i < calMonths.length; i++) {
    var cm = calMonths[i];
    html += '<div id="cal-grid-' + i + '" style="' + (i === currentCalIdx ? '' : 'display:none') + '">';
    html += buildMonthGridHTML(cm.y, cm.m, m, d, y);
    html += '</div>';
  }
  html += '<div class="cal-legend">';
  html += '<span>🎵 律音</span>';
  html += '<span>🔗 干合</span>';
  html += '<span>🤝 支合</span>';
  html += '<span>🌼 半会</span>';
  html += '<span>💫 害</span>';
  html += '<span>⚡ 刑</span>';
  html += '<span>🌊 冲</span>';
  html += '<span>🌀 天中殺</span>';
  html += '</div>';
  html += '<p class="text-xs text-center mt-2" style="color:var(--color-brown);font-size:0.65rem">日付をタップで詳細</p>';
  html += '</div>';

  // 今日どう動くか（詳細版。巡ってきてる星・位相法の観点・天中殺サイクルを見出しで分けて深掘り）
  if (todayF && guidance) {
    html += '<div class="card">';
    html += '<div class="card-header"><span style="color:var(--color-accent)">◆</span><span>今日どう動くか</span></div>';
    html += renderGuidanceHTML('', guidance);
    html += '</div>';
  }

  // ここから下は「宿命」セクション（変わらないエネルギー・方針・土台）
  html += '<p class="text-center text-xs mb-2" style="color:var(--color-accent);letter-spacing:0.3em;opacity:0.7">─── ' + D.client.name + 'の宿命 ───</p>';

  // 宿命（日柱・中心星・年天中殺の説明）
  html += '<div class="card">';
  html += '<div class="card-header" style="border:none;padding-bottom:0"><span style="color:var(--color-accent)">◆</span><span>' + D.client.name + 'の宿命</span></div>';
  var dp = D.client.dayPillar;
  html += '<div class="meishiki-item"><span class="meishiki-label">日柱</span><span class="meishiki-value">' + (dp ? dp.kanshi : D.client.dayStem) + '(' + D.client.dayStemReading + ') = ' + D.client.element + '性</span></div>';
  html += '<div class="meishiki-item"><span class="meishiki-label">天中殺</span><span class="meishiki-value">' + D.client.tenchu + '</span></div>';
  if (D.client.specialStructure) html += '<div class="meishiki-item"><span class="meishiki-label">特殊構造</span><span class="meishiki-value" style="font-size:0.8rem">' + D.client.specialStructure + '</span></div>';
  if (D.client.stars) html += '<div class="meishiki-item"><span class="meishiki-label">主星配置</span><span class="meishiki-value" style="font-size:0.68rem;text-align:right;line-height:1.6">' + D.client.stars + '</span></div>';

  // 日柱の詳細（本質鑑定・中級相当）
  if (dp) {
    html += '<div class="message-box" style="margin-top:1rem">';
    html += '<p class="text-sm" style="padding-left:1rem;line-height:1.8;font-weight:500">No.' + dp.no + ' ' + dp.kanshi + '「' + dp.name + '」' + (dp.bessho ? '・' + dp.bessho : '') + '</p>';
    html += '<p class="text-xs" style="padding-left:1rem;margin-top:0.4rem;color:var(--color-brown)">' + (dp.tenSei ? '別名：' + dp.tenSei : '') + (dp.alt ? '（' + dp.alt + '）' : '') + (dp.nacchin ? '　納音：' + dp.nacchin : '') + '</p>';
    html += '</div>';
    html += '<p class="text-xs mt-3" style="color:var(--color-brown-dark);line-height:1.8"><span style="color:var(--color-accent);font-weight:500">本質：</span>' + dp.essence + '</p>';
    html += '<p class="text-xs mt-2" style="color:var(--color-brown-dark);line-height:1.8"><span style="color:var(--color-accent);font-weight:500">性格：</span>' + dp.personality + '</p>';
    if (dp.warning) html += '<p class="text-xs mt-2" style="color:var(--color-brown);line-height:1.8"><span style="color:#a83a2c;font-weight:500">警句：</span>' + dp.warning + '</p>';
    if (dp.fullText) html += '<div class="message-box" style="margin-top:0.75rem"><p class="text-xs" style="padding-left:1rem;line-height:1.8;white-space:pre-line">' + dp.fullText + '</p></div>';
  } else {
    html += '<div class="message-box" style="margin-top:1rem"><p class="text-sm" style="padding-left:1rem;line-height:1.8">' + D.client.elementNote + '</p></div>';
  }

  if (D.client.starsNote) {
    html += '<p class="text-xs mt-3" style="color:var(--color-brown);line-height:1.7">' + D.client.starsNote + '</p>';
  }
  if (D.client.chukuseiNote) {
    html += '<div class="message-box" style="margin-top:0.75rem;background:rgba(58,107,71,0.07);border-color:var(--color-accent-soft)">';
    html += '<p class="text-xs" style="padding-left:1rem;line-height:1.75;color:var(--color-brown-dark)">' + D.client.chukuseiNote + '</p>';
    html += '</div>';
  }
  if (D.client.guardianNote) {
    html += '<p class="text-xs mt-3" style="color:var(--color-accent);line-height:1.7;font-style:italic;text-align:center">' + D.client.guardianNote + '</p>';
  }

  html += '<div class="divider"></div>';

  html += '<div class="year-tenchu-box">';
  html += '<p class="year-tenchu-label">🌀 年天中殺について</p>';
  html += '<p class="year-tenchu-body">' + D.yearTenchuNote + '</p>';
  html += '</div>';
  html += '</div>';

  // 陽転・陰転
  html += '<div class="card">';
  html += '<div class="card-header"><span style="color:var(--color-accent)">◆</span><span>' + D.client.name + 'の 陽・陰</span></div>';
  html += '<div class="patterns">';
  html += '<div><p class="pattern-title win">大切にすること</p><ul class="pattern-list">';
  for (var i = 0; i < D.winPatterns.length; i++) html += '<li><span class="dot-win">◇</span><span>' + D.winPatterns[i] + '</span></li>';
  html += '</ul></div>';
  html += '<div><p class="pattern-title lose">気をつけること</p><ul class="pattern-list">';
  for (var i = 0; i < D.losePatterns.length; i++) html += '<li><span class="dot-lose">×</span><span>' + D.losePatterns[i] + '</span></li>';
  html += '</ul></div>';
  html += '</div>';
  html += '</div>';

  // 5視点（ベーシック・占術家名なし）
  if (D.fiveViews && D.fiveViews.length > 0) {
    html += '<div class="card">';
    html += '<div class="card-header"><span style="color:var(--color-accent)">◆</span><span>五つの視点 ─ ぐるりと見る</span></div>';
    html += '<p class="text-xs mb-3" style="color:var(--color-brown);line-height:1.7">命式を 違う角度から見たメモや。</p>';
    for (var i = 0; i < D.fiveViews.length; i++) {
      var v = D.fiveViews[i];
      html += '<div style="margin-bottom:0.85rem;padding:0.7rem 0.9rem;background:var(--color-cream);border-left:3px solid var(--color-accent-light);border-radius:0 4px 4px 0">';
      html += '<p class="text-xs" style="color:var(--color-accent);font-weight:500;letter-spacing:0.15em;margin-bottom:0.25rem">' + (i+1) + '. ' + v.key + '</p>';
      html += '<p class="text-xs" style="color:var(--color-brown-dark);line-height:1.75">' + v.body + '</p>';
      html += '</div>';
    }
    html += '</div>';
  }

  // 5人の占術家視点（上級コンテンツ・別セクション。CLAUDE.md ルール6準拠）
  if (D.fiveOccultists && D.fiveOccultists.length > 0) {
    html += '<div class="card">';
    html += '<div class="card-header"><span style="color:var(--color-gold)">◆</span><span>- in depth - ５つの視点</span></div>';
    html += '<p class="text-xs mb-3" style="color:var(--color-brown);line-height:1.7">同じ命式を、5人それぞれの視点で読んだもの。</p>';
    for (var i = 0; i < D.fiveOccultists.length; i++) {
      var o = D.fiveOccultists[i];
      html += '<div class="occultist-block">';
      html += '<p class="occultist-name">' + o.name + '</p>';
      html += '<p class="occultist-view">' + o.view + '</p>';
      html += '<p class="occultist-body">' + o.body + '</p>';
      html += '</div>';
    }
    html += '</div>';
  }

  // 願い
  html += '<div class="frame">';
  html += '<p class="text-xs text-center mb-3" style="color:var(--color-accent);letter-spacing:0.2em">' + D.client.name + 'の夢</p>';
  html += '<p class="text-center text-sm font-medium" style="color:var(--color-brown-dark)">' + D.goal.main + '</p>';
  html += '<div class="divider"></div>';
  html += '<p class="text-xs text-center" style="color:var(--color-brown);line-height:1.8">' + D.goal.sub.replace(/\\n/g, '<br>').replace(/\n/g, '<br>') + '</p>';
  html += '</div>';

  app.innerHTML = html;
}

// ---------- 初期化 ----------
var D = null;

function initDashboard(clientData) {
  D = clientData;
  var my = D.client.my;
  MY = { ds: my.ds, db: my.db, ms: my.ms, mb: my.mb, ys: my.ys, yb: my.yb, tc: my.tc };
  applyDesignColors(D.design);
  initCalMonths();
  render();
}
