/* ==================================================================
   Service Worker — يخلي الموقع يشتغل أوفلاين
   ================================================================== */

   var CACHE_NAME = 'moudy-v1';

   /* الملفات الأساسية اللي نخزّنها */
   var CORE_FILES = [
       './',
       './MOUDY.html',
       './MOUDY.css',
       './main.js',
       './manifest.json',
       './icon.svg'
   ];
   
   /* التثبيت — خزّن الملفات الأساسية */
   self.addEventListener('install', function (event) {
       event.waitUntil(
           caches.open(CACHE_NAME).then(function (cache) {
               return cache.addAll(CORE_FILES).catch(function (err) {
                   console.warn('[SW] فشل تخزين بعض الملفات:', err);
               });
           }).then(function () {
               return self.skipWaiting();
           })
       );
   });
   
   /* التنشيط — امسح الكاش القديم */
   self.addEventListener('activate', function (event) {
       event.waitUntil(
           caches.keys().then(function (keys) {
               return Promise.all(
                   keys.filter(function (k) { return k !== CACHE_NAME; })
                       .map(function (k) { return caches.delete(k); })
               );
           }).then(function () {
               return self.clients.claim();
           })
       );
   });
   
   /* الطلبات — استراتيجية: Cache First للـ HTML/CSS/JS، Network for the rest */
   self.addEventListener('fetch', function (event) {
       var url = event.request.url;
   
       /* تجاهل Firebase و Google APIs — لا نخزنها */
       if (url.indexOf('firebase') > -1 ||
           url.indexOf('googleapis') > -1 ||
           url.indexOf('gstatic') > -1 ||
           url.indexOf('youtube') > -1 ||
           url.indexOf('ytimg') > -1 ||
           url.indexOf('socialcounts') > -1 ||
           url.indexOf('twemoji') > -1) {
           return;
       }
   
       /* تجاهل الـ mp3 (كبيرة كتير) */
       if (url.indexOf('.mp3') > -1 || url.indexOf('audio/') > -1) {
           return;
       }
   
       /* تجاهل أي طلب مو GET */
       if (event.request.method !== 'GET') return;
   
       /* HTML / CSS / JS / صور صغيرة → Cache First */
       event.respondWith(
           caches.match(event.request).then(function (cached) {
               if (cached) {
                   /* رجّع من الكاش + حدّث بالخلفية */
                   fetch(event.request).then(function (response) {
                       if (response && response.status === 200) {
                           caches.open(CACHE_NAME).then(function (cache) {
                               cache.put(event.request, response.clone());
                           });
                       }
                   }).catch(function () {});
                   return cached;
               }
   
               /* غير موجود بالكاش → جيبو من الشبكة */
               return fetch(event.request).then(function (response) {
                   if (!response || response.status !== 200 || response.type !== 'basic') {
                       return response;
                   }
                   var toCache = response.clone();
                   caches.open(CACHE_NAME).then(function (cache) {
                       cache.put(event.request, toCache);
                   });
                   return response;
               }).catch(function () {
                   /* إذا فشل وعندنا صفحة أوفلاين → رجّعها */
                   return caches.match('./MOUDY.html');
               });
           })
       );
   });