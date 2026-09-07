const CACHE_NAME='blackforest-2026-v20260907-arrival-copy';
const OFFLINE_FILES=[
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./sw.js",
  "./blackforest-2026-offline.pdf",
  "./assets/badeparadies.jpg",
  "./assets/colmar.jpg",
  "./assets/colmar_shopping.jpg",
  "./assets/europa_park.jpg",
  "./assets/europa_park_new.jpg",
  "./assets/fashion_food_festival_header.jpg",
  "./assets/fashion_food_festival_konviktstrasse.jpg",
  "./assets/feldberg.jpg",
  "./assets/freiburg_festival_parking.jpg",
  "./assets/freiburg_kajo_festival_shopping.jpg",
  "./assets/freiburg_muenster.jpg",
  "./assets/fundorena_indoor_high_ropes.jpg",
  "./assets/gutach_coaster.jpg",
  "./assets/hasenhorn.jpg",
  "./assets/hero_black_forest.jpg",
  "./assets/hirschgrund_zipline.jpg",
  "./assets/hofgut.jpg",
  "./assets/hotel_la_toscana_ringsheim.jpg",
  "./assets/kaysersberg.jpg",
  "./assets/loeffingen_hero.jpg",
  "./assets/monkey_mountain.jpg",
  "./assets/rhine_falls.jpg",
  "./assets/riquewihr.jpg",
  "./assets/roppenheim_outlet.jpg",
  "./assets/rulantica_new.jpg",
  "./assets/steinwasen_park_official.jpg",
  "./assets/strasbourg.jpg",
  "./assets/strasbourg_kehl_tram_shopping_map_2026-08-15_static.png",
  "./assets/strasbourg_shopping.jpg",
  "./assets/tanneneck_hotel.jpg",
  "./assets/tanneneck_hotel_sunny.jpg",
  "./assets/titisee.jpg",
  "./assets/titisee_candidate_1.jpg",
  "./assets/titisee_candidate_5.jpg",
  "./assets/titisee_recovery.jpg",
  "./assets/titisee_schweizer_boat_cruise.jpg",
  "./assets/todtnau_blackforestline.jpg",
  "./assets/triberg_waterfalls.jpg",
  "./assets/vogelpark_steinen.jpg",
  "./assets/vogtsbauernhof.jpg",
  "./assets/zurich_airport.jpg",
  "./assets/zurich_lake_quaibruecke.jpg"
];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(OFFLINE_FILES)).catch(error=>console.warn('Offline install cache failed',error)));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.filter(name=>name.startsWith('blackforest-2026-') && name!==CACHE_NAME).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET') return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;
  event.respondWith((async()=>{
    const cached=await caches.match(request);
    if(cached) return cached;
    try{
      const response=await fetch(request);
      if(response && response.ok){
        const cache=await caches.open(CACHE_NAME);
        cache.put(request,response.clone());
      }
      return response;
    }catch(error){
      return (await caches.match('./index.html')) || Response.error();
    }
  })());
});
