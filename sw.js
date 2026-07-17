// キャッシュ名を上げると、activate時に旧キャッシュが全削除される。
// core.css / core.js を更新したのに古いまま表示される事故を防ぐため、
// 更新のたびにこの数字を上げる。260717：v1→v2（和紙化が古いキャッシュで黒く出た事故）。
var CACHE = 'kichi-v2';

// オフライン最低限のフォールバックだけキャッシュ。
var URLS = ['/', '/index.html'];

self.addEventListener('install', function (e) {
  self.skipWaiting(); // 新しいSWをすぐ有効化
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(URLS); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// network-first：常に最新を取りに行き、取れた時だけキャッシュを更新する。
// オフライン等でネットが失敗した時だけキャッシュを返す。
// これで core.css / core.js / clients/*.json の更新が即反映される。
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return res;
    }).catch(function () {
      return caches.match(e.request);
    })
  );
});
