const CACHE="proit-arcade-v2";
const FILES=[
"/","/assets/site.css","/assets/common.css",
"/games/snake/","/games/breakout/","/games/space-attack/",
"/games/road-hopper/","/games/2048/","/manifest.webmanifest"
];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
