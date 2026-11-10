// 運気ページ・鑑定書ページ共通：鑑定目録へのつなぎ（261104）
// 並びは「運気ページ ⇄ 鑑定目録 ⇄ 鑑定書」。運気と鑑定書を直接つながない。
// ・ページの途中までスクロールしたら、鑑定目録へのボタンを浮かせて出す
// ・下にある直リンク（運気→鑑定書／鑑定書→暦）は隠し、扉は鑑定目録へ向け直す
// 外す時は、各ページの <script src="/seki-nav.js"> の1行を消すだけでよい。
(function () {
  var NO_NAV = { demo: 1 };          // 目録を出さない人（demo は紡の席LPから誰でも見られる）
  var ALIAS = { hideto: 'hidetoh' };

  var c = new URLSearchParams(location.search).get('client');
  if (!c) {
    var seg = location.pathname.replace(/\/+$/, '').split('/').pop() || '';
    c = seg.replace(/\.html$/, '').replace(/-kanteisho(-\d+)?$/, '').replace(/-koyomi$/, '');
  }
  if (ALIAS[c]) c = ALIAS[c];
  if (!c || c === 'view' || NO_NAV[c]) return;

  var href = '/mokuroku.html?c=' + encodeURIComponent(c);

  var css = document.createElement('style');
  css.textContent =
    '.seki-nav{position:fixed;right:14px;bottom:calc(18px + env(safe-area-inset-bottom));z-index:900;' +
    'display:flex;align-items:center;gap:8px;padding:12px 16px 12px 18px;background:#B3202E;color:#FBF8F1;' +
    'font-family:"Shippori Mincho B1","Hiragino Mincho ProN","Yu Mincho",serif;font-weight:700;font-size:15px;letter-spacing:.2em;' +
    'text-decoration:none;outline:1px solid rgba(251,248,241,.5);outline-offset:-5px;box-shadow:0 10px 24px -10px rgba(0,0,0,.45);' +
    'opacity:0;transform:translateY(16px);pointer-events:none;transition:opacity .35s,transform .35s}' +
    '.seki-nav.on{opacity:1;transform:none;pointer-events:auto}' +
    '.kanteisho-link,.koyomi-link{display:none!important}';
  document.head.appendChild(css);

  var btn = document.createElement('a');
  btn.className = 'seki-nav';
  btn.href = href;
  btn.textContent = '鑑定目録';
  document.body.appendChild(btn);

  // 旧メニュー（/menu）や、運気↔鑑定書の直リンクは、押した瞬間に鑑定目録へ向け直す。
  // 表示のタイミングやスクロールに左右されないよう、押した時点で判定する。
  var OLD = /(^|\/)menu(\.html)?(\?|#|$)/;
  function isOldLink(a) {
    if (!a || !a.getAttribute) return false;
    var h = a.getAttribute('href') || '';
    if (h === href) return false;
    if (a.classList.contains('door-inner') || a.classList.contains('kanteisho-link') || a.classList.contains('koyomi-link')) return true;
    return OLD.test(h);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a') : null;
    if (isOldLink(a)) { e.preventDefault(); e.stopPropagation(); location.href = href; }
  }, true);

  function retarget() {
    var ds = document.querySelectorAll('.door-inner');
    for (var i = 0; i < ds.length; i++) {
      if (ds[i].getAttribute('href') !== href) { ds[i].setAttribute('href', href); ds[i].textContent = '鑑定目録'; }
    }
  }
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    btn.classList.toggle('on', max > 0 && scrollY > max * 0.3);
  }
  new MutationObserver(retarget).observe(document.body, { childList: true, subtree: true });
  retarget();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('load', function () { retarget(); onScroll(); });
  setTimeout(function () { retarget(); onScroll(); }, 1500);
})();
