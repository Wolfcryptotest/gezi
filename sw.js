/* Gezi Rotam: çevrimdışı önbellek */
const V='gezi-v1',RT='gezi-rt-v1';
const EXT=/(^|\.)(wikimedia\.org|tile\.openstreetmap\.org|cdnjs\.cloudflare\.com|ytimg\.com|googleapis\.com|gstatic\.com)$/;
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(V).then(c=>c.addAll(['./','./index.html'])).catch(()=>{}))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./index.html'))));
    return;
  }
  if(EXT.test(u.hostname)&&!u.pathname.includes('/w/api.php')){
    e.respondWith(caches.open(RT).then(async c=>{
      const m=await c.match(r);
      const f=fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}).catch(()=>m);
      return m||f;
    }));
  }
});
