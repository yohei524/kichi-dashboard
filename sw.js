// このService Workerは「自己アンインストール専用」。
// 過去のSWが古いCSS/JSをキャッシュし続け、デザイン更新が反映されない事故が
// 起きたため、SW方式をやめる（260717）。
// 既にSWを持っている端末では、次回訪問時にこの新SWが取得され、
// activate時に自分自身を解除し、全キャッシュを削除する。
self.addEventListener('install', function (e) { self.skipWaiting(); });

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll(); })
      .then(function (clients) {
        // 解除直後にページを1回リロードして、確実に最新をネットワークから取らせる
        clients.forEach(function (c) { if (c.url && 'navigate' in c) c.navigate(c.url); });
      })
  );
});

// キャッシュは一切使わず、常にネットワークへ素通し
self.addEventListener('fetch', function (e) { /* passthrough */ });
