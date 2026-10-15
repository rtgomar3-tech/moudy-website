'use strict';
/* ==================================================================
   main.js — ملف جافاسكريبت واحد لكل موقع مودي العربي
   ------------------------------------------------------------------
   الفكرة: كل قسم بها الملف بيخص صفحة معينة، وكل قسم بيبدأ بفحص
   "هل عناصر هالصفحة موجودة؟" — إذا لأ، بيطلع من القسم فوراً (return).
   لهيك نفس الملف بيشتغل بكل الصفحات بدون ما يخرب شي.
   (هاي التقنية اسمها IIFE + Guard)
   ================================================================== */

/* ---------- أدوات مشتركة لكل الأقسام ---------- */
const $ = (id) => document.getElementById(id);

/* ==================================================================
   1) شريط التنقل — بيشتغل بكل الصفحات الفرعية
   ================================================================== */
(function initNav() {
    const nav = $('siteNav');
    if (!nav) return; // ما في siteNav بهي الصفحة (مثلاً الرئيسية) — خلص

    const NAV = [
        ['MOUDY.html', 'الرئيسية'],
        ['music.html', 'الأغاني'],
        ['games.html', '🎮 ألعاب'],
        ['leaderboard.html', '🏆 الترتيب'],
        ['photos.html', 'صور'],
        ['podcast.html', 'بودكست'],
        ['links.html', 'الصفحات الرسمية']
    ];
    // اسم الصفحة الحالية من الرابط (آخر جزء بعد /)
    const here = location.pathname.split('/').pop() || 'MOUDY.html';

    nav.innerHTML =
        '<a class="nav-logo" href="MOUDY.html">MOUDY ALARBE</a><nav><ul>' +
        NAV.map(([href, label]) =>
            `<li><a href="${href}"${href === here ? ' class="on"' : ''}>${label}</a></li>`
        ).join('') +
        '</ul></nav>';
})();

/* ==================================================================
   2) صفحة الأغاني (music.html)
   ------------------------------------------------------------------
   المودات: pos = نقطة التركيز بالصورة (يمين/شمال + فوق/تحت)
   posMobile = نقطة تركيز مختلفة للموبايل (اختيارية)
   ================================================================== */

/* الأغاني مرتبة من الأحدث للأقدم. id = الرقم بعد v= برباط يوتيوب */
const SONGS = [
    { title: 'نوبة', id: 'ZxbchOV0As4', moods: ['calm'] },
    { title: 'نايكي', id: 'bRxvtbyMvQs', moods: ['passion', 'freedom'] },
    { title: 'وينك', id: 'fjGhU1giBvo', moods: [] },
    { title: 'قد التحدي', id: 'e3neCGeuC2I', moods: ['passion'] },
    { title: 'على الهاوية', id: 'rJNQKNu-rbo', moods: ['calm', 'syrian'] },
    { title: 'الطير', id: 'Lr-6AYRUFEc', moods: ['calm'] },
    { title: 'يوم الحرية', id: 'cT-PHqIkR4E', moods: ['hadef', 'freedom'] },
    { title: 'تروما', id: '0TZ-UmDDwyA', moods: ['calm'] },
    { title: 'جوسي', id: 'vsxGkz5R9aQ', moods: ['passion', 'yanaser'] },
    { title: 'ذكريات', id: 'nu7iJt4_yu4', moods: ['calm', 'yanaser'] },
    { title: 'طريق اللاذقية', id: 'q0oNAwL6YsU', moods: ['passion', 'hadef', 'yanaser'] },
    { title: 'نو نو', id: 'mypVk0Gwvz0', moods: ['calm', 'yanaser'] },
    { title: 'كفاحي', id: 'MOuyFGBmwKU', moods: ['calm', 'yanaser'] },
    { title: 'دقيقة ونص', id: 'k6-M0CaFHUM', moods: ['passion', 'yanaser'] },
    { title: 'مسلول', id: 'pqHNFavyrVo', moods: ['calm', 'yanaser'] },
    { title: 'روبن مود', id: 'dPjM4YvF9vQ', moods: ['passion', 'syrian', 'yanaser'] },
    { title: 'مونستر', id: 'rc4x8l-QnGE', moods: ['passion', 'yanaser'] },
    { title: 'كارما', id: 'm4Hz03O9MJ4', moods: ['calm', 'yanaser'] },
    { title: 'ياناصر', id: 'DU0G8FJGG64', moods: ['calm', 'hadef', 'yanaser'] },
    { title: 'سكابا', id: 'cG_flsWEhC4', moods: ['passion', 'yanaser'] },
    { title: 'جونسيبا', id: 'dMikjfERvTA', moods: ['passion', 'yanaser'] },
    { title: 'الانترو', id: 'G-Y4UbVj0zY', moods: ['yanaser'] },
    { title: 'حريقة', id: 'YIomwMgIQQs', moods: ['feat'] },
    { title: '5 مِلي', id: 'oBxDhwKyV4Y', moods: ['passion', 'freedom'] },
    { title: 'شاهين', id: 'GrkSyxB_haA', moods: ['passion', 'freedom'] },
    { title: '14 ونص', id: 'Gzcs2NLVv9I', moods: ['hadef', 'syrian'] },
    { title: 'بصارة', id: 'OpHe-tXJkWs', moods: ['calm'] },
    { title: 'نساني', id: '2Z-Glm-sEdQ', moods: ['calm'] },
    { title: '7 طلقات', id: 'D0UUdmX3drc', moods: ['syrian'] },
    { title: 'طمنيني', id: 'gHf5oP7N6iE', moods: ['calm', 'conflict'] },
    { title: 'نفس الاعتراف', id: 'ShiGnwQ-3Bw', moods: ['conflict'] },
    { title: 'بيانو', id: 'jsuBOipfnN8', moods: ['calm', 'conflict'] },
    { title: 'صراع نفسي', id: 'h_-zk23w5co', moods: ['calm', 'conflict'] },
    { title: 'خورفكان', id: 'Qk_Yo8VOGh4', moods: ['passion'] },
    { title: 'زهايمر', id: 'ZRj9gQGYo-I', moods: ['calm', 'feat'] },
    { title: 'يا صبر الله', id: 'Zpu7Iy12CjM', moods: ['calm', 'syrian'] },
    { title: 'أشاوس (أولد سكول)', id: '9FLLPhj_Qxo', moods: ['feat'] },
    { title: 'أشاوس', id: 'xozQ_qcffAo', moods: ['passion', 'feat', 'local'] },
    { title: 'نجم ليل', id: 'rJYlBO0a7EY', moods: ['calm'] },
    { title: 'تشكيل عصابي', id: 'bMczZ4EQHOs', moods: ['passion', 'local'] },
    { title: 'انتاج محلي', id: '1iYtPHeQc9Y', moods: ['passion', 'local'] },
    { title: 'غرناطة', id: 'yLjbZKaTeBg', moods: ['passion'] },
    { title: 'نص الليل', id: 'Jb_fQCaQpBA', moods: ['calm'] },
    { title: 'وسط النيل', id: '-znwuqLeNhs', moods: ['calm', 'passion'] },
    { title: 'يا ريت', id: '0_NLSFUzVMM', moods: ['calm', 'passion'] },
    { title: 'خطاف', id: '_k4b66sbm1M', moods: ['calm'] },
    { title: 'فيراري', id: 'JYuJ0QPeAG0', moods: ['passion', 'rolex'] },
    { title: 'توعديني', id: '0XiU3O6wEnU', moods: ['passion', 'rolex'] },
    { title: 'باب شرقي', id: 'BWcSa4eOIww', moods: ['passion', 'hadef', 'rolex'] },
    { title: 'روليكس', id: 'wX6Kt90z-eM', moods: ['calm', 'rolex'] },
    { title: 'ماني شايف', id: 'vKPFbhv7eqo', moods: ['calm', 'rolex'] },
    { title: 'الأرض السعيدة', id: 'wyKXeeIeYHg', moods: ['passion', 'hadef'] },
    { title: 'فلاديمير بوتين', id: 'HcOSEMpDHBo', moods: ['passion'] },
    { title: 'درامادول', id: 'OftsZ4z7OlI', moods: ['calm'] },
    { title: 'أنا الخطأ', id: 'Yl7HpF5oyRk', moods: ['calm'] },
    { title: 'هلأ عرفت أبي', id: 'NEcBVreEck4', moods: ['passion'] },
    { title: 'مسرحية', id: 'A0-L2t4RIkM', moods: ['passion', 'syrian'] },
    { title: 'حكي كتير', id: 'AtVpciHqliw', moods: ['passion'] },
    { title: 'إدمانٌ مؤبد', id: 'P4G9k4pJL8Q', moods: ['passion'] },
    { title: 'ميت 2', id: 'ZHG5l5PjU-4', moods: ['calm', 'passion'] },
    { title: 'جرح فينا', id: 'Ou8e9zvoS0E', moods: ['calm'] },
    { title: 'الغُربة', id: '3PKBsPmKqVo', moods: ['calm', 'hadef'] },
    { title: 'نسيتا', id: 'pYQenPeMEPo', moods: ['feat'] },
    { title: 'بفوضى', id: 'EGiz1aAtbBI', moods: ['passion'] },
    { title: 'طريق الخراب', id: '0LPay99iPyM', moods: [] },
    { title: 'امشي', id: 'DAeBhOvDgwo', moods: ['passion'] },
    { title: 'تركتا', id: 'YgokxJm9xi4', moods: [] },
    { title: 'الحبيبة', id: 'hZZY-7xaOH8', moods: [] },
    { title: 'مصاب', id: 'lRawQ3TGnTM', moods: ['feat'] },
    { title: 'غلط', id: 'zj9TFooEhI4', moods: ['passion'] },
    { title: 'مانو معاشر', id: 'DG_2LDpGymQ', moods: ['passion'] },
    { title: 'تسع ساعات', id: 'T9eKYqcYadY', moods: ['calm', 'passion'] },
    { title: 'فلسفة', id: 'fph9h_w5kQ0', moods: ['passion'] },
    { title: 'تهديد', id: 'p7yevyd3pI8', moods: ['calm'] },
    { title: 'تصفية حساب', id: 'q0ev9Gb_-6o', moods: ['passion'] },
    { title: 'اعتراف نفسي', id: 'iohCJ5WqiI8', moods: ['calm', 'passion'] },
    { title: 'تتذكر', id: 'Rd8YaaRIqGs', moods: ['calm'] },
    { title: 'اشتقتلي', id: 'dho_69-1BJM', moods: ['calm'] },
    { title: 'مسلمين وكفار', id: '1UzbKWiq1Fo', moods: ['hadef', 'syrian'] },
    { title: 'راضي بكلشي صار', id: 'e3R9XXpmsEM', moods: ['calm'] },
    { title: 'اركي', id: 'cQTx-kFPn-M', moods: ['feat'] },
    { title: 'مامليت', id: '4iXsErw8Po8', moods: ['feat'] },
    { title: 'ايزي', id: '80egFQLQ6PM', moods: ['feat'] }
];

(function initMusic() {
    if (!$('moodList')) return;

    const MOODS = [
        { key: 'all',      label: 'كل الأغاني',      image: 'images.all/6.jpg',  pos: '50% 45%' },
        { key: 'calm',     label: 'هادئ',            image: 'images.all/2.jpg',  pos: '50% 50%' },
        { key: 'passion',  label: 'شَغَف ⚡',         image: 'images.all/13.jpg', pos: '65% 40%' },
        { key: 'hadef',    label: 'هادف',            image: 'images.all/3.jpg',  pos: '58% 28%' },
        { key: 'syrian',   label: 'سوري 💔',         image: 'images.all/8.jpg',  pos: '50% 45%' },
        { key: 'freedom',  label: 'حرية 🤍',         image: 'images.all/7.jpg',  pos: '50% 20%' },
        { key: 'yanaser',  label: 'ألبوم ياناصر',    image: 'images.all/6.jpg',  pos: '50% 45%' },
        { key: 'conflict', label: 'ألبوم صراع نفسي', image: 'images.all/9.jpg',  pos: '40% 40%' },
        { key: 'rolex',    label: 'EP ROLEX',        image: 'images.all/11.jpg', pos: '50% 60%' },
        { key: 'feat',     label: 'Feat',            image: 'images.all/5.jpg',  pos: '60% 40%', posMobile: '62% 30%' },
        { key: 'local',    label: 'EP إنتاج محلي',   image: 'images.all/10.jpg', pos: '30% 20%' }
    ];

    /* ⚠️ احتفظ بقائمة SONGS متل ما هي من الملف الأصلي — من أول
       { title: 'نوبة', id: 'ZxbchOV0As4', moods: ['calm'] }
       لآخر
       { title: 'ايزي', id: '80egFQLQ6PM', moods: ['feat'] }
    */

    const PAGE_SIZE = 12;

    const el = {
        bg: $('bgImage'), menu: $('moodMenu'), list: $('moodList'), bigTitle: $('bigTitle'),
        view: $('songsView'), chips: $('chips'), title: $('moodTitle'), search: $('search'),
        grid: $('videoGrid'), more: $('moreBtn'), back: $('backBtn'),
        playAll: $('playAllBtn'), shuffleAll: $('shuffleBtn'),
        bar: $('playerBar'), barThumb: $('playerThumb'), barTitle: $('playerTitle'),
        barCounter: $('playerCounter'),
        pPrev: $('pPrev'), pPlayPause: $('pPlayPause'), pNext: $('pNext'),
        pShuffle: $('pShuffle'), pRepeat: $('pRepeat'), pClose: $('pClose'),
        pWatch: $('pWatch'),
        ytHost: $('ytHostWrapper'),
        ytInner: $('musicYtPlayer')
    };

    const state = { mood: 'all', query: '', shown: PAGE_SIZE };

    const player = {
        queue: [], index: 0, isPlaying: false,
        shuffle: false, repeat: 0,
        yt: null, ytReady: false
    };

    const getMood = (key) => MOODS.find((m) => m.key === key);

    /* ---------- الخلفية ---------- */
    function setBackground(mood, dim) {
        el.bg.style.backgroundImage = `url('${mood.image}')`;
        el.bg.style.setProperty('--pos', mood.pos);
        if (mood.posMobile) el.bg.style.setProperty('--pos-m', mood.posMobile);
        else el.bg.style.removeProperty('--pos-m');
        el.bg.classList.toggle('dim', dim);
        el.bg.classList.add('show');
    }

    /* ---------- قائمة المودات ---------- */
    function buildMenu() {
        MOODS.forEach((mood) => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = mood.label;
            btn.addEventListener('mouseenter', () => {
                setBackground(mood, false);
                el.bigTitle.textContent = mood.label;
                el.bigTitle.style.opacity = '0.3';
            });
            btn.addEventListener('click', () => openMood(mood.key));
            li.appendChild(btn);
            el.list.appendChild(li);
        });
        el.menu.addEventListener('mouseleave', () => {
            el.bg.classList.remove('show');
            el.bigTitle.textContent = 'MOUDY';
            el.bigTitle.style.opacity = '0.12';
        });
    }

    /* ---------- فتح مود ---------- */
    function openMood(key) {
        state.mood = key;
        state.query = '';
        state.shown = PAGE_SIZE;
        el.search.value = '';

        const mood = getMood(key);
        setBackground(mood, true);
        el.title.textContent = mood.label;
        el.menu.hidden = true;
        el.view.hidden = false;

        renderChips();
        renderSongs();
        window.scrollTo(0, 0);
    }

    function backToMenu() {
        el.view.hidden = true;
        el.menu.hidden = false;
        el.bg.classList.remove('show');
        window.scrollTo(0, 0);
    }

    /* ---------- رقاقات المودات ---------- */
    function renderChips() {
        el.chips.innerHTML = '';
        MOODS.forEach((mood) => {
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'chip' + (mood.key === state.mood ? ' active' : '');
            chip.textContent = mood.label;
            chip.addEventListener('click', () => openMood(mood.key));
            el.chips.appendChild(chip);
        });
        const active = el.chips.querySelector('.active');
        if (active) active.scrollIntoView({ inline: 'center', block: 'nearest' });
    }

    /* ---------- الفلترة ---------- */
    function filteredSongs() {
        const q = state.query.trim().toLowerCase();
        return SONGS.filter((song) =>
            (state.mood === 'all' || song.moods.includes(state.mood)) &&
            song.title.toLowerCase().includes(q)
        );
    }

    function createCard(song) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'video-card';

        const thumb = document.createElement('div');
        thumb.className = 'thumb';
        if (song.id) thumb.style.backgroundImage = `url('https://i.ytimg.com/vi/${song.id}/hqdefault.jpg')`;
        thumb.textContent = '▶';

        const name = document.createElement('h4');
        name.textContent = song.title;

        card.append(thumb, name);
        card.addEventListener('click', () => openPlayer(song));
        return card;
    }

    function renderSongs() {
        const list = filteredSongs();
        el.grid.innerHTML = '';
        if (list.length === 0) {
            el.grid.innerHTML = '<p class="empty">لا توجد أغاني مطابقة حالياً.</p>';
        } else {
            list.slice(0, state.shown).forEach((song) => el.grid.appendChild(createCard(song)));
        }
        el.more.hidden = state.shown >= list.length;
    }

    /* =========================================================
       🎵 المشغل + التشغيل المتواصل
    ========================================================= */
    function shuffleArr(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
    }

    function currentSong() {
        return player.queue[player.index] || null;
    }

    function updateBarUI() {
        const s = currentSong();
        if (!s || !player.queue.length) {
            el.bar.hidden = true;
            document.body.classList.remove('has-player');
            return;
        }
        el.bar.hidden = false;
        document.body.classList.add('has-player');
        el.barTitle.textContent = s.title;
        el.barThumb.src = 'https://i.ytimg.com/vi/' + s.id + '/default.jpg';
        el.barCounter.textContent = (player.index + 1) + ' / ' + player.queue.length;
        el.pPlayPause.textContent = player.isPlaying ? '⏸' : '▶';
        el.pShuffle.classList.toggle('on', player.shuffle);
        el.pRepeat.classList.toggle('on', player.repeat > 0);
        el.pRepeat.textContent = player.repeat === 2 ? '🔂' : '🔁';
    }

    function ensurePlayer(cb) {
        if (player.yt) { cb(); return; }

        function create() {
            player.yt = new YT.Player(el.ytInner, {
                height: '1', width: '1',
                playerVars: {
                    autoplay: 0, controls: 0, disablekb: 1,
                    fs: 0, modestbranding: 1, rel: 0, playsinline: 1
                },
                events: {
                    'onReady': function () { player.ytReady = true; cb(); },
                    'onStateChange': onYtState,
                    'onError': function () {
                        setTimeout(function () {
                            if (player.index < player.queue.length - 1) {
                                player.index++; playCurrent();
                            }
                        }, 800);
                    }
                }
            });
        }

        if (typeof YT !== 'undefined' && YT.Player) {
            create();
        } else {
            if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                const s = document.createElement('script');
                s.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(s);
            }
            const prev = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = function () {
                if (typeof prev === 'function') prev();
                create();
            };
        }
    }

    function onYtState(e) {
        if (typeof YT === 'undefined') return;
        if (e.data === YT.PlayerState.PLAYING) {
            player.isPlaying = true;
            updateBarUI();
        } else if (e.data === YT.PlayerState.PAUSED) {
            player.isPlaying = false;
            updateBarUI();
        } else if (e.data === YT.PlayerState.ENDED) {
            onEnded();
        }
    }

    function onEnded() {
        if (player.repeat === 2) {
            try { player.yt.seekTo(0); player.yt.playVideo(); } catch (e) {}
            return;
        }
        if (player.index < player.queue.length - 1) {
            player.index++; playCurrent();
        } else if (player.repeat === 1) {
            player.index = 0; playCurrent();
        } else {
            player.isPlaying = false;
            updateBarUI();
        }
    }

    function playCurrent() {
        const s = currentSong();
        if (!s) { el.bar.hidden = true; return; }
        if (window.moudyChallenge) window.moudyChallenge.trackSong(s.id);
        ensurePlayer(function () {
            try { player.yt.loadVideoById(s.id); } catch (e) {}
        });
        updateBarUI();
    }

    function playQueue(songs, startIndex) {
        player.queue = songs.slice();
        player.index = startIndex || 0;
        playCurrent();
    }

    function nextTrack() {
        if (player.index < player.queue.length - 1) {
            player.index++; playCurrent();
        } else if (player.repeat === 1) {
            player.index = 0; playCurrent();
        }
    }

    function prevTrack() {
        if (player.index > 0) player.index--;
        else player.index = player.queue.length - 1;
        playCurrent();
    }

    function togglePlay() {
        if (!player.yt) return;
        if (player.isPlaying) {
            try { player.yt.pauseVideo(); } catch (e) {}
        } else {
            try { player.yt.playVideo(); } catch (e) {}
        }
    }

    function toggleShuffle() {
        player.shuffle = !player.shuffle;
        if (player.shuffle && player.queue.length > 1) {
            const cur = player.queue.splice(player.index, 1)[0];
            shuffleArr(player.queue);
            player.queue.unshift(cur);
            player.index = 0;
        }
        updateBarUI();
    }

    function toggleRepeat() {
        player.repeat = (player.repeat + 1) % 3;
        updateBarUI();
    }
    /* =========================================
       🎬 فتح/إغلاق modal الفيديو
    ========================================= */
    function openVideoModal() {
        const s = currentSong();
        if (!s || !s.id) return;

        const modal = $('videoModal');
        const frame = $('videoModalFrame');
        if (!modal || !frame) return;

        /* وقّف المشغل المخفي */
        if (player.yt && player.yt.pauseVideo) {
            try { player.yt.pauseVideo(); } catch (e) {}
        }

        /* حط iframe جديد */
        frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' +
            s.id + '?autoplay=1&rel=0&modestbranding=1" ' +
            'title="' + s.title + '" ' +
            'allow="autoplay; fullscreen; encrypted-media" ' +
            'referrerpolicy="strict-origin-when-cross-origin" ' +
            'allowfullscreen></iframe>';

        modal.hidden = false;
        document.body.style.overflow = 'hidden';

        /* زر 📺 يصير أخضر */
        if (el.pWatch) el.pWatch.classList.add('on');
    }

    function closeVideoModal() {
        const modal = $('videoModal');
        const frame = $('videoModalFrame');
        if (!modal || !frame) return;

        frame.innerHTML = '';
        modal.hidden = true;
        document.body.style.overflow = '';

        /* كمّل الصوت من المشغل المخفي */
        if (player.yt && player.yt.playVideo) {
            try { player.yt.playVideo(); } catch (e) {}
        }

        if (el.pWatch) el.pWatch.classList.remove('on');
    }
    function closeBar() {
        /* اطلع من وضع المشاهدة */
        if (el.ytHost && el.ytHost.classList.contains('watching')) {
            el.ytHost.classList.remove('watching');
            document.body.classList.remove('watching-video');
            if (el.pWatch) {
                el.pWatch.classList.remove('watching');
                el.pWatch.textContent = '📺';
            }
        }
        if (player.yt) { try { player.yt.stopVideo(); } catch (e) {} }
        player.queue = [];
        player.index = 0;
        player.isPlaying = false;
        el.bar.hidden = true;
    }
    /* فتح أغنية معينة → يبني قائمة من الأغاني المفلترة */
    function openPlayer(song) {
        if (!song || !song.id) return;
        const list = filteredSongs();
        const idx = list.findIndex(s => s.id === song.id);
        playQueue(list, idx >= 0 ? idx : 0);
     
    }
    /* شغّل الكل */
    function playAll() {
        const list = filteredSongs();
        if (!list.length) return;
        const q = player.shuffle ? shuffleArr(list.slice()) : list;
        playQueue(q, 0);
    }

    /* فاجئني — أغنية عشوائية + خلط الباقي */
    function shuffleAll() {
        const list = filteredSongs();
        if (!list.length) return;
        const idx = Math.floor(Math.random() * list.length);
        const first = list[idx];
        const rest = list.filter((_, i) => i !== idx);
        shuffleArr(rest);
        playQueue([first, ...rest], 0);
    }

    /* =========================================================
       ربط الأحداث
    ========================================================= */
    el.back.addEventListener('click', backToMenu);
    el.more.addEventListener('click', () => { state.shown += PAGE_SIZE; renderSongs(); });
    el.search.addEventListener('input', () => {
        state.query = el.search.value;
        state.shown = PAGE_SIZE;
        renderSongs();
    });

    el.playAll.addEventListener('click', playAll);
    el.shuffleAll.addEventListener('click', shuffleAll);
    el.pPrev.addEventListener('click', prevTrack);
    el.pNext.addEventListener('click', nextTrack);
    el.pPlayPause.addEventListener('click', togglePlay);
    el.pShuffle.addEventListener('click', toggleShuffle);
    el.pRepeat.addEventListener('click', toggleRepeat);
    el.pClose.addEventListener('click', closeBar);
    if (el.pWatch) el.pWatch.addEventListener('click', openVideoModal);
    const vmc = $('videoModalClose');
    if (vmc) vmc.addEventListener('click', closeVideoModal);
    const vm = $('videoModal');
    if (vm) vm.addEventListener('click', function (e) {
        if (e.target === vm) closeVideoModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && vm && !vm.hidden) closeVideoModal();
    });
    if (el.pWatch) el.pWatch.addEventListener('click', openVideoModal);

    document.addEventListener('keydown', (e) => {
        if (el.bar.hidden) return;
        if (e.key === 'Escape') closeBar();
    });

    buildMenu();

    const params = new URLSearchParams(location.search);
    const openMoodKey = params.get('mood');
    if (openMoodKey && MOODS.some(function (m) { return m.key === openMoodKey; })) {
        openMood(openMoodKey);
    }
})();
/* ==================================================================
   3) بيانات صفحة الصور — لا تعدّل هون يدوياً!
   ------------------------------------------------------------------
   هاي القائمة بتتعبّى تلقائياً لما تشغّل prepare_photos.py
   ================================================================== */
/* ======= PHOTOS-DATA-START ======= */
const PHOTOS = [
    { file: '1.jpg', w: 148, h: 148 },
    { file: '10.jpg', w: 320, h: 180 },
    { file: '100.jpg', w: 1440, h: 1440 },
    { file: '101.jpg', w: 1440, h: 1440 },
    { file: '102.jpg', w: 1440, h: 1440 },
    { file: '103.jpg', w: 1440, h: 1440 },
    { file: '104.jpg', w: 1440, h: 1440 },
    { file: '105.jpg', w: 1440, h: 1440 },
    { file: '106.jpg', w: 1440, h: 1440 },
    { file: '107.jpg', w: 1440, h: 1440 },
    { file: '108.jpg', w: 1080, h: 720 },
    { file: '109.jpg', w: 1440, h: 1440 },
    { file: '11.jpg', w: 738, h: 414 },
    { file: '110.jpg', w: 1341, h: 1336 },
    { file: '111.jpg', w: 1080, h: 1080 },
    { file: '112.jpg', w: 1280, h: 1280 },
    { file: '113.jpg', w: 1280, h: 1280 },
    { file: '114.jpg', w: 1440, h: 1440 },
    { file: '115.jpg', w: 1080, h: 1080 },
    { file: '116.jpg', w: 1080, h: 1080 },
    { file: '117.jpg', w: 1080, h: 1080 },
    { file: '118.jpg', w: 1080, h: 1080 },
    { file: '119.jpg', w: 1440, h: 1440 },
    { file: '12.jpg', w: 447, h: 447 },
    { file: '120.jpg', w: 1440, h: 1440 },
    { file: '121.jpg', w: 1440, h: 1440 },
    { file: '123.jpg', w: 1440, h: 1800 },
    { file: '124.jpg', w: 1440, h: 1440 },
    { file: '125.jpg', w: 1440, h: 1440 },
    { file: '126.jpg', w: 2316, h: 2316 },
    { file: '127.jpg', w: 2227, h: 2226 },
    { file: '128.jpg', w: 3024, h: 3023 },
    { file: '129.jpg', w: 3024, h: 3023 },
    { file: '13.jpg', w: 300, h: 300 },
    { file: '130.jpg', w: 2316, h: 2315 },
    { file: '131.jpg', w: 3024, h: 3023 },
    { file: '132.jpg', w: 3024, h: 3023 },
    { file: '133.jpg', w: 1440, h: 1440 },
    { file: '134.jpg', w: 1440, h: 1440 },
    { file: '135.jpg', w: 1440, h: 1440 },
    { file: '136.jpg', w: 1440, h: 1439 },
    { file: '137.jpg', w: 1440, h: 1440 },
    { file: '138.jpg', w: 2268, h: 2268 },
    { file: '139.jpg', w: 1601, h: 1601 },
    { file: '14.jpg', w: 240, h: 240 },
    { file: '140.jpg', w: 2268, h: 2268 },
    { file: '141.jpg', w: 2268, h: 2268 },
    { file: '142.jpg', w: 4096, h: 4095 },
    { file: '143.jpg', w: 4032, h: 4032 },
    { file: '144.jpg', w: 1440, h: 810 },
    { file: '145.jpg', w: 1440, h: 961 },
    { file: '146.jpg', w: 1440, h: 961 },
    { file: '147.jpg', w: 1440, h: 961 },
    { file: '148.jpg', w: 1440, h: 959 },
    { file: '149.jpg', w: 1440, h: 961 },
    { file: '150.jpg', w: 1440, h: 961 },
    { file: '151.jpg', w: 1440, h: 960 },
    { file: '152.jpg', w: 1440, h: 1440 },
    { file: '153.jpg', w: 1068, h: 713 },
    { file: '154.jpg', w: 1068, h: 713 },
    { file: '16.jpg', w: 459, h: 668 },
    { file: '17.jpg', w: 1440, h: 1440 },
    { file: '18.jpg', w: 1440, h: 1440 },
    { file: '19.jpg', w: 1440, h: 1136 },
    { file: '2.jpg', w: 300, h: 300 },
    { file: '20.jpg', w: 1440, h: 811 },
    { file: '21.jpg', w: 1440, h: 812 },
    { file: '22.jpg', w: 1440, h: 812 },
    { file: '23.jpg', w: 1440, h: 812 },
    { file: '24.jpg', w: 1440, h: 811 },
    { file: '25.jpg', w: 1440, h: 811 },
    { file: '26.jpg', w: 1440, h: 811 },
    { file: '27.jpg', w: 1440, h: 812 },
    { file: '28.jpg', w: 1440, h: 1436 },
    { file: '29.jpg', w: 1440, h: 1800 },
    { file: '3.jpg', w: 1080, h: 1080 },
    { file: '30.jpg', w: 1440, h: 1439 },
    { file: '31.jpg', w: 1440, h: 1440 },
    { file: '32.jpg', w: 1440, h: 1439 },
    { file: '34.jpeg', w: 537, h: 640 },
    { file: '35.jpg', w: 1440, h: 1440 },
    { file: '36.jpg', w: 1440, h: 1440 },
    { file: '37.jpg', w: 1440, h: 1440 },
    { file: '38.jpg', w: 1440, h: 1440 },
    { file: '39.jpg', w: 1440, h: 1440 },
    { file: '4.jpg', w: 320, h: 320 },
    { file: '40.jpg', w: 1440, h: 1440 },
    { file: '41.jpg', w: 1440, h: 1440 },
    { file: '42.jpg', w: 1440, h: 1440 },
    { file: '43.jpg', w: 1440, h: 1464 },
    { file: '45.jpg', w: 1440, h: 1440 },
    { file: '46.jpg', w: 1440, h: 1440 },
    { file: '47.jpg', w: 1440, h: 1440 },
    { file: '48.jpg', w: 1440, h: 1440 },
    { file: '49.jpg', w: 1440, h: 1440 },
    { file: '5.jpg', w: 300, h: 200 },
    { file: '50.jpg', w: 1440, h: 894 },
    { file: '51.jpg', w: 1440, h: 1440 },
    { file: '52.jpg', w: 1440, h: 1440 },
    { file: '53.jpg', w: 1440, h: 1440 },
    { file: '54.jpg', w: 1440, h: 1439 },
    { file: '55.jpg', w: 1440, h: 1440 },
    { file: '56.jpg', w: 1440, h: 1440 },
    { file: '57.jpg', w: 1440, h: 1440 },
    { file: '58.jpg', w: 1440, h: 1440 },
    { file: '59.jpg', w: 1440, h: 1440 },
    { file: '6_‫‬.jpg', w: 447, h: 447 },
    { file: '6.jpg', w: 1440, h: 1433 },
    { file: '60.jpg', w: 1440, h: 1440 },
    { file: '61.jpg', w: 1440, h: 1440 },
    { file: '62.jpg', w: 1440, h: 1440 },
    { file: '63.jpg', w: 1440, h: 1440 },
    { file: '64.jpg', w: 1440, h: 1440 },
    { file: '65.jpg', w: 1440, h: 1440 },
    { file: '66.jpg', w: 1440, h: 1440 },
    { file: '67.jpg', w: 1440, h: 1440 },
    { file: '68.jpg', w: 1440, h: 1440 },
    { file: '69.jpg', w: 1440, h: 1440 },
    { file: '7.jpg', w: 225, h: 225 },
    { file: '70.jpg', w: 1440, h: 1440 },
    { file: '71.jpg', w: 1440, h: 960 },
    { file: '72.jpg', w: 1440, h: 1440 },
    { file: '73.jpg', w: 1440, h: 1440 },
    { file: '78.jpg', w: 1440, h: 1440 },
    { file: '79.jpg', w: 1440, h: 1440 },
    { file: '8.jpg', w: 495, h: 404 },
    { file: '80.jpg', w: 1440, h: 1440 },
    { file: '81.jpg', w: 1440, h: 1439 },
    { file: '82.jpg', w: 1440, h: 1440 },
    { file: '83.jpg', w: 1440, h: 1440 },
    { file: '84.jpg', w: 1440, h: 1626 },
    { file: '89.jpg', w: 1440, h: 1626 },
    { file: '9.jpg', w: 447, h: 447 },
    { file: '90.jpg', w: 1440, h: 1440 },
    { file: '91.jpg', w: 1440, h: 1440 },
    { file: '92.jpg', w: 1440, h: 1440 },
    { file: '93.jpg', w: 1440, h: 1440 },
    { file: '94.jpg', w: 1440, h: 1440 },
    { file: '95.jpg', w: 1440, h: 1440 },
    { file: '96.jpg', w: 1440, h: 1440 },
    { file: '97.jpg', w: 1440, h: 1440 },
    { file: '98.jpg', w: 1440, h: 1440 },
    { file: '99.jpg', w: 1440, h: 1440 },
    { file: 'images_(1).jpeg', w: 225, h: 225 },
    { file: 'images_(10).jpeg', w: 480, h: 360 },
    { file: 'images_(11).jpeg', w: 300, h: 300 },
    { file: 'images_(12).jpeg', w: 447, h: 447 },
    { file: 'images_(7).jpeg', w: 240, h: 240 },
    { file: 'images_(8).jpeg', w: 447, h: 447 },
    { file: 'images_(9).jpeg', w: 447, h: 447 },
    { file: 'images.jpg', w: 447, h: 447 }
];
/* ======= PHOTOS-DATA-END ======= */
/* ==================================================================
   4) صفحة الصور — جدار + 3D Viewer (photos.html)
   ================================================================== */
   (function initPhotos() {
    const wall = $('wall');
    if (!wall) return;

    if (typeof PHOTOS === 'undefined' || PHOTOS.length === 0) {
        wall.innerHTML = '<p class="empty">شغّل prepare_photos.py أول لتجهيز الصور.</p>';
        return;
    }

    const BATCH = 40;
    const total = PHOTOS.length;

    const el = {
        more:    $('more'),
        viewer:  $('viewer3d'),
        vStage:  $('viewerStage'),
        vImg:    $('viewerImg'),
        vClose:  $('viewerClose'),
        vPrev:   $('viewerPrev'),
        vNext:   $('viewerNext'),
        vFav:    $('viewerFavorite'),
        vShare:  $('viewerShare'),
        vDown:   $('viewerDownload')
    };

    let shown = 0;
    let current = 0;

    /* مفضلة */
    const FAV_KEY = 'moudy-photos-fav';
    function getFavs() {
        try { return JSON.parse(localStorage.getItem(FAV_KEY) || '[]'); }
        catch (e) { return []; }
    }
    function isFav(file) { return getFavs().indexOf(file) !== -1; }
    function toggleFav(file) {
        const favs = getFavs();
        const idx = favs.indexOf(file);
        if (idx === -1) favs.push(file); else favs.splice(idx, 1);
        try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) {}
        updateFavBtn();
    }

    /* بناء الجدار */
    function renderMore() {
        const start = shown;
        PHOTOS.slice(start, start + BATCH).forEach(function (p, i) {
            const img = document.createElement('img');
            img.src = p.file;            img.width = p.w;
            img.height = p.h;
            img.loading = 'lazy';
            img.alt = 'مودي العربي';
            img.addEventListener('click', function () { openViewer(start + i); });
            wall.appendChild(img);
        });
        shown = Math.min(shown + BATCH, total);
        el.more.hidden = shown >= total;
    }

    /* 3D Viewer */
    function openViewer(i) {
        current = (i + total) % total;
        el.vImg.src = PHOTOS[current].file;
        el.viewer.hidden = false;
        updateFavBtn();
        el.vStage.style.transform = '';
        document.body.style.overflow = 'hidden';
    }

    function closeViewer() {
        el.viewer.hidden = true;
        el.vImg.src = '';
        el.vStage.style.transform = '';
        document.body.style.overflow = '';
    }

    function viewerGo(step) {
        openViewer(current + step);
    }

    /* تدوير بالماوس */
    el.vStage.addEventListener('mousemove', function (e) {
        if (el.viewer.hidden) return;
        const rect = el.vStage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.vStage.style.transform =
            'perspective(1200px) rotateY(' + (x * 35) + 'deg) rotateX(' + (-y * 35) + 'deg)';
    });

    el.vStage.addEventListener('mouseleave', function () {
        el.vStage.style.transform = '';
    });

    /* تدوير بالموبايل */
    let vStartX = 0, vStartY = 0, vDragging = false;

    el.vStage.addEventListener('touchstart', function (e) {
        vStartX = e.touches[0].clientX;
        vStartY = e.touches[0].clientY;
        vDragging = true;
    }, { passive: true });

    el.vStage.addEventListener('touchmove', function (e) {
        if (!vDragging) return;
        const x = (e.touches[0].clientX - vStartX) / 100;
        const y = (e.touches[0].clientY - vStartY) / 100;
        el.vStage.style.transform =
            'perspective(1000px) rotateY(' + (x * 20) + 'deg) rotateX(' + (-y * 20) + 'deg)';
    }, { passive: true });

    el.vStage.addEventListener('touchend', function (e) {
        const dx = e.changedTouches[0].clientX - vStartX;
        const dy = e.changedTouches[0].clientY - vStartY;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
            viewerGo(dx > 0 ? -1 : 1);
        }
        el.vStage.style.transform = '';
        vDragging = false;
    });

    /* الأزرار */
    el.vClose.addEventListener('click', closeViewer);
    el.vPrev.addEventListener('click', function () { viewerGo(-1); });
    el.vNext.addEventListener('click', function () { viewerGo(1); });
    el.more.addEventListener('click', renderMore);

    /* كيبورد */
    document.addEventListener('keydown', function (e) {
        if (el.viewer.hidden) return;
        if (e.key === 'Escape') closeViewer();
        if (e.key === 'ArrowLeft') viewerGo(1);
        if (e.key === 'ArrowRight') viewerGo(-1);
    });

    /* مفضلة */
    function updateFavBtn() {
        if (isFav(PHOTOS[current].file)) {
            el.vFav.textContent = '⭐';
            el.vFav.classList.add('active');
        } else {
            el.vFav.textContent = '🔖';
            el.vFav.classList.remove('active');
        }
    }

    el.vFav.addEventListener('click', function () {
        toggleFav(PHOTOS[current].file);
    });

    /* مشاركة */
    el.vShare.addEventListener('click', function () {
        const text = '🖼️ شوف صورة من مودي العربي:\n' + location.href;
        if (navigator.share) {
            navigator.share({ text: text }).catch(function () {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(function () { showToast('✅ تم النسخ!'); })
                .catch(function () { showToast('❌ ما قدرنا ننسخ'); });
        } else {
            showToast('⚠️ المتصفح ما بيدعم المشاركة');
        }
    });

    /* تحميل */
    el.vDown.addEventListener('click', function () {
        const a = document.createElement('a');
        a.href = PHOTOS[current].file;
        a.download = PHOTOS[current].file;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showToast('⬇️ جاري التحميل...');
    });

    /* Toast */
    function showToast(msg) {
        const t = document.createElement('div');
        t.className = 'gallery-toast';
        t.textContent = msg;
        document.body.appendChild(t);
        setTimeout(function () { t.classList.add('show'); }, 30);
        setTimeout(function () {
            t.classList.remove('show');
            setTimeout(function () { t.remove(); }, 400);
        }, 2500);
    }

    /* تشغيل */
    renderMore();
})();


/* ==================================================================
   6) الصفحات الرسمية (links.html)
   ------------------------------------------------------------------
   عدّل SITE_URL لما تنشر الموقع — الرمز الكبير بالأسفل بياخد هالرابط
   ================================================================== */
(function initLinks() {
    const grid = $('linkGrid');
    if (!grid) return; // نحن مش بصفحة الروابط

    const SITE_URL = ''; // مثال بعد النشر: 'https://moudy-alarbe.com'
    const LINKS = [
        { platform: 'يوتيوب',   handle: 'Moudy Alarbe',    url: 'https://www.youtube.com/channel/UCdeSkxQ-YStI8bAYUiismbA' },
        { platform: 'إنستغرام', handle: '@moudyalarbe963', url: 'https://www.instagram.com/moudyalarbe963' },
        { platform: 'فيسبوك',   handle: 'Moudy Alarbe',    url: 'https://www.facebook.com/share/1YjPYE2BPm/' },
        { platform: 'سبوتيفاي', handle: 'Moudy Alarbe',    url: 'https://open.spotify.com/artist/68KKIaozjXuxJyAWs2nDhz' }
    ];

    function makeQR(el, text, size) {
        /* مكتبة الرمز بتتحمّل من CDN بصفحة links.html — إذا ما اشتغلت بنعرض رسالة */
        if (typeof QRCode === 'undefined') {
            el.innerHTML = '<span class="qr-off">الرمز غير متاح بدون إنترنت</span>';
            return;
        }
        new QRCode(el, {
            text, width: size, height: size,
            colorDark: '#07120a', colorLight: '#f4f1e8', correctLevel: QRCode.CorrectLevel.M
        });
    }

    LINKS.forEach((item) => {
        const card = document.createElement('article');
        card.className = 'link-card';
        card.innerHTML = `
            <div class="link-info">
                <span class="link-platform">${item.platform}</span>
                <span class="link-handle" dir="ltr">${item.handle}</span>
                <a class="link-open" href="${item.url}" target="_blank" rel="noopener">افتح الحساب ↗</a>
            </div>
            <div class="qr-box"></div>`;
        grid.appendChild(card);
        makeQR(card.querySelector('.qr-box'), item.url, 104);
    });

    makeQR(document.getElementById('qrSite'), SITE_URL || location.href, 212);
})();
/* ==================================================================
   قسم: التبديل بين الوضع الليلي والنهاري
   ================================================================== */
   (function initTheme() {
    const STORAGE_KEY = 'moudy-theme';
    
    // 1) اقرأ الاختيار المحفوظ
    const saved = localStorage.getItem(STORAGE_KEY);
    const isLight = saved === 'light';
    
    if (isLight) {
        document.body.classList.add('light-mode');
    }
    
    const icon = isLight ? '☀️' : '🌙';
    
    // 2) زر عائم (بكل الصفحات)
    const floatBtn = document.createElement('button');
    floatBtn.type = 'button';
    floatBtn.className = 'theme-toggle theme-toggle-float';
    floatBtn.setAttribute('aria-label', 'تبديل الوضع الليلي/النهاري');
    floatBtn.textContent = icon;
    document.body.appendChild(floatBtn);
    
    // 3) زر بالنافبار (إذا موجود)
    let navBtn = null;
    const nav = document.getElementById('siteNav');
    if (nav) {
        navBtn = document.createElement('button');
        navBtn.type = 'button';
        navBtn.className = 'theme-toggle theme-toggle-nav';
        navBtn.setAttribute('aria-label', 'تبديل الوضع الليلي/النهاري');
        navBtn.textContent = icon;
        nav.appendChild(navBtn);
    }
    
    // 4) دالة التبديل
    function toggle() {
        const nowLight = document.body.classList.toggle('light-mode');
        const newIcon = nowLight ? '☀️' : '🌙';
        floatBtn.textContent = newIcon;
        if (navBtn) navBtn.textContent = newIcon;
        localStorage.setItem(STORAGE_KEY, nowLight ? 'light' : 'dark');
    }
    
    floatBtn.addEventListener('click', toggle);
    if (navBtn) navBtn.addEventListener('click', toggle);
})();
/* ==================================================================
   قسم: لعبة ذاكرة الأغاني (memory.html)
   ================================================================== */
   (function initMemory() {
    const board = $('memoryBoard');
    if (!board) return; // مش بصفحة اللعبة

    /* ---------- الأغاني المستخدمة ---------- */
    const SONGS = [
        { title: 'ياناصر',    id: 'DU0G8FJGG64' },
        { title: 'روليكس',    id: 'wX6Kt90z-eM' },
        { title: 'نوبة',      id: 'ZxbchOV0As4' },
        { title: 'تروما',     id: '0TZ-UmDDwyA' },
        { title: 'قد التحدي', id: 'e3neCGeuC2I' },
        { title: 'حريقة',     id: 'YIomwMgIQQs' },
        { title: 'شاهين',     id: 'GrkSyxB_haA' },
        { title: 'مسلول',     id: 'pqHNFavyrVo' },
        { title: 'مونستر',    id: 'rc4x8l-QnGE' },
        { title: 'كارما',     id: 'm4Hz03O9MJ4' },
        { title: 'سكابا',     id: 'cG_flsWEhC4' },
        { title: 'فيراري',    id: 'JYuJ0QPeAG0' },
        { title: 'باب شرقي',  id: 'BWcSa4eOIww' },
        { title: 'طريق اللاذقية', id: 'q0oNAwL6YsU' },
        { title: 'ذكريات',    id: 'nu7iJt4_yu4' },
        { title: 'صراع نفسي', id: 'h_-zk23w5co' },
        { title: 'غرناطة',    id: 'yLjbZKaTeBg' },
        { title: 'بصارة',     id: 'OpHe-tXJkWs' },
        { title: 'الطير',     id: 'Lr-6AYRUFEc' },
        { title: 'الحبيبة',   id: 'hZZY-7xaOH8' }
    ];

    /* ---------- إعدادات المستويات ---------- */
    const LEVELS = {
        easy:   { pairs: 6,  time: 0,  preview: 5 },
        medium: { pairs: 8,  time: 90, preview: 4 },
        hard:   { pairs: 10, time: 60, preview: 3 }
    };

    /* ---------- العناصر ---------- */
    const el = {
        start:    $('memoryStart'),
        play:     $('memoryPlay'),
        win:      $('memoryWin'),
        moves:    $('memMoves'),
        pairs:    $('memPairs'),
        timer:    $('memTimer'),
        timerBox: $('memTimerBox'),
        stats:    $('winStats'),
        back:     $('memBack'),
        again:    $('winAgain'),
        winBack:  $('winBack'),
        winIcon:  $('winIcon'),
        winTitle: $('winTitle')
    };

    /* ---------- الحالة ---------- */
    const state = {
        level: null,
        first: null,
        second: null,
        lock: false,
        moves: 0,
        matched: 0,
        totalPairs: 0,
        timeLeft: 0,
        timerId: null,
        previewId: null
    };

    /* ---------- 🌐 كشف الاتصال بالإنترنت ---------- */
    let isOnline = true;

    function checkInternet(callback) {
        isOnline = navigator.onLine;
        callback(isOnline);
    }

    /* ---------- خلط عشوائي ---------- */
    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        return arr;
    }

    /* ---------- بناء البطاقات ---------- */
    function buildDeck(pairsCount) {
        const selected = shuffle(SONGS.slice()).slice(0, pairsCount);
        const deck = [];
        selected.forEach(function (song) {
            deck.push({ song: song, type: 'image' });
            deck.push({ song: song, type: 'text' });
        });
        return shuffle(deck);
    }

    /* ---------- إنشاء بطاقة HTML ---------- */
    function createCard(cardData) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'memory-card';
        card.dataset.songId = cardData.song.id;
        card.setAttribute('aria-label', 'بطاقة');

        const inner = document.createElement('div');
        inner.className = 'memory-card-inner';

        const back = document.createElement('div');
        back.className = 'memory-card-face memory-card-back';

        const front = document.createElement('div');
        front.className = 'memory-card-face memory-card-front';

        if (cardData.type === 'image') {
            if (isOnline) {
                front.classList.add('image-face');
                front.style.backgroundImage =
                    "url('https://i.ytimg.com/vi/" + cardData.song.id + "/hqdefault.jpg')";
            } else {
                /* 📴 بدون نت → اسم الأغنية كامل */
                front.classList.add('text-face');
                front.textContent = cardData.song.title;
            }
        } else {
            front.classList.add('text-face');
            front.textContent = cardData.song.title;
        }
        inner.append(back, front);
        card.appendChild(inner);
        card.addEventListener('click', function () { flipCard(card); });
        return card;
    }

    /* ---------- قلب بطاقة ---------- */
    function flipCard(card) {
        if (state.lock) return;
        if (card.classList.contains('flipped')) return;
        if (card.classList.contains('matched')) return;

        card.classList.add('flipped');

        if (!state.first) {
            state.first = card;
            return;
        }

        state.second = card;
        state.lock = true;
        state.moves++;
        el.moves.textContent = state.moves;

        const match = state.first.dataset.songId === state.second.dataset.songId;

        if (match) {
            state.first.classList.add('matched');
            state.second.classList.add('matched');
            state.first.disabled = true;
            state.second.disabled = true;
            state.matched++;
            el.pairs.textContent = state.matched + ' / ' + state.totalPairs;

            resetTurn();

            if (state.matched === state.totalPairs) {
                setTimeout(showWin, 600);
            }
        } else {
            state.first.classList.add('wrong');
            state.second.classList.add('wrong');
            setTimeout(function () {
                state.first.classList.remove('flipped', 'wrong');
                state.second.classList.remove('flipped', 'wrong');
                resetTurn();
            }, 900);
        }
    }

    function resetTurn() {
        state.first = null;
        state.second = null;
        state.lock = false;
    }

    /* ---------- ✨ معاينة البطاقات ---------- */
    function previewCards(seconds, callback) {
        const cards = board.querySelectorAll('.memory-card');
        const totalMs = seconds * 1000;

        cards.forEach(function (c) { c.classList.add('flipped'); });

        let remaining = seconds;
        el.moves.textContent = remaining;

        const countdownId = setInterval(function () {
            remaining--;
            if (remaining > 0) el.moves.textContent = remaining;
        }, 1000);

        setTimeout(function () {
            clearInterval(countdownId);
            el.moves.textContent = '0';
            cards.forEach(function (c) { c.classList.remove('flipped'); });

            setTimeout(function () {
                if (typeof callback === 'function') callback();
            }, 500);
        }, totalMs);
    }

    /* ---------- بدء مستوى (مع فحص النت) ---------- */
    function startLevel(levelKey) {
        const cfg = LEVELS[levelKey];
        if (!cfg) return;

        checkInternet(function () {
            reallyStartLevel(levelKey, cfg);
        });
    }

    function reallyStartLevel(levelKey, cfg) {
        clearInterval(state.timerId);
        clearInterval(state.previewId);
        if (window.moudyChallenge) window.moudyChallenge.trackGame('memory');

        state.level = levelKey;
        state.moves = 0;
        state.matched = 0;
        state.totalPairs = cfg.pairs;
        state.first = null;
        state.second = null;
        state.lock = true;
        state.timeLeft = cfg.time;

        el.moves.textContent = '0';
        el.pairs.textContent = '0 / ' + cfg.pairs;
        board.dataset.level = levelKey;
        board.innerHTML = '';

        const deck = buildDeck(cfg.pairs);
        deck.forEach(function (c) { board.appendChild(createCard(c)); });

        el.start.hidden = true;
        el.win.hidden = true;
        el.play.hidden = false;

        if (cfg.time > 0) {
            el.timerBox.hidden = false;
            el.timerBox.classList.remove('warning', 'danger');
            el.timer.textContent = fmtTime(state.timeLeft);
        } else {
            el.timerBox.hidden = true;
        }

        previewCards(cfg.preview, function () {
            state.lock = false;
            if (cfg.time > 0) startTimer();
           
        });
    }

    /* ---------- مؤقّت ---------- */
    function startTimer() {
        clearInterval(state.timerId);
        state.timerId = setInterval(function () {
            state.timeLeft--;
            el.timer.textContent = fmtTime(state.timeLeft);

            if (state.timeLeft <= 10) {
                el.timerBox.classList.remove('warning');
                el.timerBox.classList.add('danger');
            } else if (state.timeLeft <= 20) {
                el.timerBox.classList.add('warning');
            }

            if (state.timeLeft <= 0) {
                clearInterval(state.timerId);
                gameOver();
            }
        }, 1000);
    }

    function fmtTime(s) {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    /* ---------- نهاية اللعبة (خسارة) ---------- */
    function gameOver() {
        state.lock = true;
     

        if (el.win) el.win.classList.add('lose');
        if (el.winIcon) el.winIcon.textContent = '⏰';
        if (el.winTitle) el.winTitle.textContent = 'خلص الوقت!';

        el.play.hidden = true;
        el.win.hidden = false;
        el.stats.innerHTML =
            'الأزواج يلي كشفتها: <strong>' + state.matched + ' / ' + state.totalPairs + '</strong><br>' +
            'المحاولات: <strong>' + state.moves + '</strong><br>' +
            '<span style="color:#ff2e88">حاول مرة تانية 💪</span>';
        el.again.textContent = 'حاول مرة تانية';
    }

    /* ---------- الفوز ---------- */
    function showWin() {
        clearInterval(state.timerId);
       

        if (el.win) el.win.classList.remove('lose');
        if (el.winIcon) el.winIcon.textContent = '🏆';
        if (el.winTitle) el.winTitle.textContent = 'مبروك!';

        el.play.hidden = true;
        el.win.hidden = false;

        let rating = '🥉 كويس';
        if (state.moves <= state.totalPairs * 1.5) rating = '🥇 ممتاز';
        else if (state.moves <= state.totalPairs * 2.2) rating = '🥈 جيد جداً';

        el.stats.innerHTML =
            'الزمن: <strong>' + (state.timeLeft > 0 ? fmtTime(LEVELS[state.level].time - state.timeLeft) : '—') + '</strong><br>' +
            'المحاولات: <strong>' + state.moves + '</strong><br>' +
            'التصنيف: <strong>' + rating + '</strong>';
        el.again.textContent = 'العب مرة تانية';

        try {
            const key = 'moudy-memory-best-' + state.level;
            const prev = Number(localStorage.getItem(key) || 0);
            if (!prev || state.moves < prev) {
                localStorage.setItem(key, state.moves);
            }
        } catch (e) { /* ignore */ }

        /* ⭐ نظام النقاط */
        var pointsMap = { easy: 40, medium: 80, hard: 130 };
        var basePoints = pointsMap[state.level] || 40;
        if (window.moudyPoints) {
            window.moudyPoints.add(basePoints, '🃏 ذاكرة الأغاني');
        }
    }


    /* ---------- رجوع للمستويات ---------- */
    function backToLevels() {
        clearInterval(state.timerId);
        clearInterval(state.previewId);
      
        state.lock = false;
        el.play.hidden = true;
        el.win.hidden = true;
        el.start.hidden = false;
        window.scrollTo(0, 0);
    }

    /* ---------- 🎵 موسيقى الخلفية (يوتيوب) ---------- */

    /* ---------- ربط الأحداث ---------- */
    document.querySelectorAll('.level-card').forEach(function (btn) {
        btn.addEventListener('click', function () { startLevel(btn.dataset.level); });
    });
    el.back.addEventListener('click', backToLevels);
    el.winBack.addEventListener('click', backToLevels);
    el.again.addEventListener('click', function () { startLevel(state.level); });
})();





/* ==================================================================
   قسم: تحميل مسبق لكل الإيموجي (يعمل بصفحة emoji.html)
   ================================================================== */
   (function preloadEmojis() {
    const display = document.getElementById('emojiDisplay');
    if (!display) return; // مش بصفحة الإيموجي

    /* قائمة بكل الإيموجي المستخدمة */
    const ALL_EMOJIS = [
        '👑⌚💰','🏎️💨🔴','👟✅🎯','🔥💥🎤','👹⚡🔥',
        '💔🩸😢','💌💔😭','❤️💋🌹','🌍✨🎉','⭐🌙✨',
        '🚬💰😎','🦅⚡🇸🇾','👑🎵⭐','🏰🌹🇪🇸','🍲🥣🏠',
        '🐻🇷🇺','💊😵','🛣️🌊','🕊️🌅','🌙💃🎵',
        '🚪🌅🏛️','⚖️🔄','🎭🎬','🌋⚠️','🙈💭',
        '🌊🏙️','🐦🕊️','😔❌',
        '🧠❓','1️⃣4️⃣🌍','7️⃣🔫','5️⃣⚡','💪🏆',
        '👨😢','💬🎭','🕌✝️','🤔📚','🕊️🙏',
        '🌟💭','📸💭','💫🌹','⚔️🧠','🔁🙏',
        '♾️💉','🤗💌','🚫👥','⛓️😔','🏹💰',
        '🎭🌀','🎬🎤','🚫🙅','💪🌅','⏱️💔',
        '👥🚨','🏠🎵','🌙🕛','👀❓💔','🎹🎵',
        '🌊🌃','🎣💔','🤝💔','👁️🚫','💀💀',
        '🩸👥','🛤️🏜️','🙈💭❓','🌪️🔀','🛣️💀',
        '🚶💪','🚪💔','🩹💔','❌😔','🕘⏰',
        '⚠️😠','⚔️💰','🗣️💭','📸🤔','😌🤲',
        '🏛️💪','💔😭','😎✌️','🦅⚔️','🦅⚔️🎤'
    ];

    /* جهّز حاوية مخفية */
    const tmp = document.createElement('div');
    tmp.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;';
    document.body.appendChild(tmp);

    /* ابدأ التحميل المسبق */
    const start = function () {
        if (typeof twemoji === 'undefined') {
            setTimeout(start, 200);
            return;
        }

        ALL_EMOJIS.forEach(function (str) {
            const html = twemoji.parse(str, { folder: 'svg', ext: '.svg' });
            tmp.innerHTML = html;
            tmp.querySelectorAll('img.emoji').forEach(function (img) {
                const preload = new Image();
                preload.src = img.src;
            });
        });

        /* نظّف بعد 5 ثواني */
        setTimeout(function () { tmp.remove(); }, 5000);
    };

    start();
})();

/* ==================================================================
   قسم: لعبة خمّن الأغنية بالإيموجي (emoji.html)
   ================================================================== */
   
(function initEmojiGame() {
    const display = $('emojiDisplay');
    if (!display) return;

    /* ---------- 🎨 البيانات — كل الأغاني موزّعة على 3 مستويات ---------- */
    const EMOJI_DATA = {
        easy: {
            time: 25,
            pick: 10,
            songs: [
                { emoji: '👑⌚💰',      title: 'روليكس' },
                { emoji: '🏎️💨🔴',      title: 'فيراري' },
                { emoji: '👟✅🎯',      title: 'نايكي' },
                { emoji: '🔥💥🎤',      title: 'حريقة' },
                { emoji: '👹⚡🔥',      title: 'مونستر' },
                { emoji: '💔🩸😢',      title: 'تروما' },
                { emoji: '💌💔😭',      title: 'اشتقتلي' },
                { emoji: '❤️💋🌹',      title: 'الحبيبة' },
                { emoji: '🌍✨🎉',      title: 'الأرض السعيدة' },
                { emoji: '⭐🌙✨',      title: 'نجم ليل' },
                { emoji: '🚬💰😎',      title: 'سكابا' },
                { emoji: '🦅⚡🇸🇾',     title: 'شاهين' },
                { emoji: '👑🎵⭐',      title: 'ياناصر' },
                { emoji: '🏰🌹🇪🇸',     title: 'غرناطة' },
                { emoji: '🍲🥣🏠',      title: 'بصارة' },
                { emoji: '🐻🇷🇺',       title: 'فلاديمير بوتين' },
                { emoji: '💊😵',        title: 'درامادول' },
                { emoji: '🛣️🌊',       title: 'طريق اللاذقية' },
                { emoji: '🕊️🌅',       title: 'يوم الحرية' },
                { emoji: '🌙💃🎵',      title: 'نوبة' },
                { emoji: '🚪🌅🏛️',     title: 'باب شرقي' },
                { emoji: '⚖️🔄',       title: 'كارما' },
                { emoji: '🎭🎬',        title: 'مسرحية' },
                { emoji: '🌋⚠️',       title: 'على الهاوية' },
                { emoji: '🙈💭',        title: 'نساني' },
                { emoji: '🌊🏙️',       title: 'خورفكان' },
                { emoji: '🐦🕊️',       title: 'الطير' },
                { emoji: '😔❌',        title: 'أنا الخطأ' }
            ]
        },
        medium: {
            time: 20,
            pick: 10,
            songs: [
                { emoji: '🧠❓',        title: 'زهايمر' },
                { emoji: '1️⃣4️⃣🌍',    title: '14 ونص' },
                { emoji: '7️⃣🔫',       title: '7 طلقات' },
                { emoji: '5️⃣⚡',       title: '5 مِلي' },
                { emoji: '💪🏆',        title: 'قد التحدي' },
                { emoji: '👨😢',        title: 'هلأ عرفت أبي' },
                { emoji: '💬🎭',        title: 'حكي كتير' },
                { emoji: '🕌✝️',        title: 'مسلمين وكفار' },
                { emoji: '🤔📚',        title: 'فلسفة' },
                { emoji: '🕊️🙏',       title: 'يا صبر الله' },
                { emoji: '🌟💭',        title: 'يا ريت' },
                { emoji: '📸💭',        title: 'ذكريات' },
                { emoji: '💫🌹',        title: 'جوسي' },
                { emoji: '⚔️🧠',       title: 'صراع نفسي' },
                { emoji: '🔁🙏',        title: 'نفس الاعتراف' },
                { emoji: '♾️💉',        title: 'إدمانٌ مؤبد' },
                { emoji: '🤗💌',        title: 'طمنيني' },
                { emoji: '🚫👥',        title: 'مانو معاشر' },
                { emoji: '⛓️😔',        title: 'مسلول' },
                { emoji: '🏹💰',        title: 'روبن مود' },
                { emoji: '🎭🌀',        title: 'جونسيبا' },
                { emoji: '🎬🎤',        title: 'الانترو' },
                { emoji: '🚫🙅',        title: 'نو نو' },
                { emoji: '💪🌅',        title: 'كفاحي' },
                { emoji: '⏱️💔',       title: 'دقيقة ونص' },
                { emoji: '👥🚨',        title: 'تشكيل عصابي' },
                { emoji: '🏠🎵',        title: 'انتاج محلي' },
                { emoji: '🌙🕛',        title: 'نص الليل' },
                { emoji: '👀❓💔',      title: 'وينك' },
                { emoji: '🎹🎵',        title: 'بيانو' }
            ]
        },
        hard: {
            time: 15,
            pick: 10,
            songs: [
                { emoji: '🌊🌃',        title: 'وسط النيل' },
                { emoji: '🎣💔',        title: 'خطاف' },
                { emoji: '🤝💔',        title: 'توعديني' },
                { emoji: '👁️🚫',       title: 'ماني شايف' },
                { emoji: '💀💀',        title: 'ميت 2' },
                { emoji: '🩸👥',        title: 'جرح فينا' },
                { emoji: '🛤️🏜️',      title: 'الغُربة' },
                { emoji: '🙈💭❓',      title: 'نسيتا' },
                { emoji: '🌪️🔀',       title: 'بفوضى' },
                { emoji: '🛣️💀',       title: 'طريق الخراب' },
                { emoji: '🚶💪',        title: 'امشي' },
                { emoji: '🚪💔',        title: 'تركتا' },
                { emoji: '🩹💔',        title: 'مصاب' },
                { emoji: '❌😔',        title: 'غلط' },
                { emoji: '🕘⏰',        title: 'تسع ساعات' },
                { emoji: '⚠️😠',       title: 'تهديد' },
                { emoji: '⚔️💰',       title: 'تصفية حساب' },
                { emoji: '🗣️💭',       title: 'اعتراف نفسي' },
                { emoji: '📸🤔',        title: 'تتذكر' },
                { emoji: '😌🤲',        title: 'راضي بكلشي صار' },
                { emoji: '🏛️💪',       title: 'اركي' },
                { emoji: '💔😭',        title: 'مامليت' },
                { emoji: '😎✌️',        title: 'ايزي' },
                { emoji: '🦅⚔️',       title: 'أشاوس' },
                { emoji: '🦅⚔️🎤',     title: 'أشاوس (أولد سكول)' }
            ]
        }
    };

    /* ---------- الحالة ---------- */
    const state = {
        level: null,
        queue: [],
        index: 0,
        score: 0,
        timerId: null,
        timeLeft: 0,
        locked: false
    };

    /* ---------- العناصر ---------- */
    const el = {
        start:      $('emojiStart'),
        play:       $('emojiPlay'),
        end:        $('emojiEnd'),
        qNum:       $('emojiQNum'),
        score:      $('emojiScore'),
        timer:      $('emojiTimer'),
        timerBox:   $('emojiTimerBox'),
        answers:    $('emojiAnswers'),
        feedback:   $('emojiFeedback'),
        back:       $('emojiBack'),
        endIcon:    $('emojiEndIcon'),
        endTitle:   $('emojiEndTitle'),
        endStats:   $('emojiEndStats'),
        again:      $('emojiAgain'),
        endBack:    $('emojiEndBack')
    };

    /* ---------- خلط عشوائي ---------- */
    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    /* ---------- عرض الإيموجي عبر Twemoji ---------- */
    function renderEmoji(str) {
        if (typeof twemoji !== 'undefined') {
            return twemoji.parse(str, { folder: 'svg', ext: '.svg' });
        }
        return str;
    }

    /* ---------- بدء مستوى ---------- */
    function startLevel(levelKey) {
        const cfg = EMOJI_DATA[levelKey];
        if (!cfg) return;
    if (window.moudyChallenge) window.moudyChallenge.trackGame('emoji');
        clearInterval(state.timerId);

        state.level = levelKey;
        state.score = 0;
        state.index = 0;
        state.locked = false;

        /* خلط الأغاني واختيار عدد محدد */
        state.queue = shuffle(cfg.songs).slice(0, cfg.pick);

        el.start.hidden = true;
        el.end.hidden = true;
        el.play.hidden = false;

        el.score.textContent = '0';
        el.feedback.textContent = '';
        el.feedback.className = 'emoji-feedback';

        showQuestion();
    }

    /* ---------- عرض سؤال ---------- */
    function showQuestion() {
        const cfg = EMOJI_DATA[state.level];
        const q = state.queue[state.index];

        if (!q) { endGame(); return; }

        /* HUD */
        el.qNum.textContent = (state.index + 1) + ' / ' + cfg.pick;

        /* الإيموجي */
        display.innerHTML = renderEmoji(q.emoji);

        /* الخيارات — 3 غلط + 1 صح */
        const allTitles = cfg.songs.map(s => s.title);
        const wrongPool = shuffle(allTitles.filter(t => t !== q.title)).slice(0, 3);
        const options = shuffle([q.title, ...wrongPool]);

        el.answers.innerHTML = '';
        options.forEach(title => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'emoji-answer';
            btn.textContent = title;
            btn.addEventListener('click', () => handleAnswer(btn, title, q.title));
            el.answers.appendChild(btn);
        });

        /* ✅ قفل اللعبة + رسالة تحميل */
        state.locked = true;
        el.feedback.textContent = '⏳ جاري التحميل...';
        el.feedback.className = 'emoji-feedback';
        el.timer.textContent = '...';
        el.timerBox.classList.remove('warning', 'danger');

        /* ✅ انتظر تحميل صور الإيموجي قبل ما يبدأ المؤقّت */
        waitForEmoji(display, function () {
            el.feedback.textContent = '';
            el.feedback.className = 'emoji-feedback';

            state.timeLeft = cfg.time;
            el.timer.textContent = state.timeLeft;
            startTimer();

            state.locked = false;
        });
    }

    /* ---------- ✅ انتظار صور الإيموجي ---------- */
    function waitForEmoji(container, callback) {
        const imgs = container.querySelectorAll('img');
        if (imgs.length === 0) { callback(); return; }

        let loaded = 0;
        const total = imgs.length;
        let called = false;

        const done = function () {
            if (called) return;
            loaded++;
            if (loaded >= total) { called = true; callback(); }
        };

        /* Safety timeout — ما ننتظر أكثر من 4 ثواني */
        setTimeout(function () {
            if (!called) { called = true; callback(); }
        }, 4000);

        imgs.forEach(function (img) {
            if (img.complete && img.naturalWidth > 0) {
                done();
            } else {
                img.addEventListener('load', done, { once: true });
                img.addEventListener('error', done, { once: true });
            }
        });
    }
    /* ---------- المؤقّت ---------- */
    function startTimer() {
        clearInterval(state.timerId);
        state.timerId = setInterval(() => {
            state.timeLeft--;
            el.timer.textContent = state.timeLeft;

            if (state.timeLeft <= 5) {
                el.timerBox.classList.remove('warning');
                el.timerBox.classList.add('danger');
            } else if (state.timeLeft <= 10) {
                el.timerBox.classList.add('warning');
            }

            if (state.timeLeft <= 0) {
                clearInterval(state.timerId);
                handleTimeout();
            }
        }, 1000);
    }

    /* ---------- معالجة الإجابة ---------- */
    function handleAnswer(btn, chosen, correct) {
        if (state.locked) return;
        state.locked = true;
        clearInterval(state.timerId);

        /* وقّف كل الأزرار */
        el.answers.querySelectorAll('.emoji-answer').forEach(b => {
            b.disabled = true;
            if (b.textContent === correct) b.classList.add('correct');
            else if (b === btn) b.classList.add('wrong');
            else b.classList.add('dimmed');
        });

        if (chosen === correct) {
            state.score += 100;
            el.score.textContent = state.score;
            el.feedback.textContent = '✅ صح!';
            el.feedback.className = 'emoji-feedback ok';
        } else {
            el.feedback.textContent = '❌ كانت: ' + correct;
            el.feedback.className = 'emoji-feedback fail';
        }

        setTimeout(nextQuestion, 1300);
    }

    /* ---------- انتهى الوقت ---------- */
    function handleTimeout() {
        if (state.locked) return;
        state.locked = true;

        const q = state.queue[state.index];
        el.answers.querySelectorAll('.emoji-answer').forEach(b => {
            b.disabled = true;
            if (b.textContent === q.title) b.classList.add('correct');
            else b.classList.add('dimmed');
        });

        el.feedback.textContent = '⏰ خلص الوقت! كانت: ' + q.title;
        el.feedback.className = 'emoji-feedback fail';

        setTimeout(nextQuestion, 1300);
    }

    /* ---------- السؤال التالي ---------- */
    function nextQuestion() {
        state.index++;
        const cfg = EMOJI_DATA[state.level];
        if (state.index >= cfg.pick) {
            endGame();
        } else {
            showQuestion();
        }
    }

    /* ---------- نهاية اللعبة ---------- */
    function endGame() {
        clearInterval(state.timerId);
        el.play.hidden = true;
        el.end.hidden = false;

        const cfg = EMOJI_DATA[state.level];
        const maxScore = cfg.pick * 100;
        const percent = Math.round((state.score / maxScore) * 100);

        let icon, title;
        if (percent >= 90)      { icon = '🏆'; title = 'أسطورة!'; }
        else if (percent >= 70) { icon = '🥇'; title = 'ممتاز!'; }
        else if (percent >= 50) { icon = '🥈'; title = 'جيد جداً!'; }
        else if (percent >= 30) { icon = '🥉'; title = 'كويس!'; }
        else                    { icon = '😅'; title = 'حاول مرة تانية'; }

        el.end.classList.remove('lose');
        if (percent < 30) el.end.classList.add('lose');

        el.endIcon.textContent = icon;
        el.endTitle.textContent = title;
        el.endStats.innerHTML =
            'النقاط: <strong>' + state.score + ' / ' + maxScore + '</strong><br>' +
            'النسبة: <strong>' + percent + '%</strong>';

        /* ⭐ نظام النقاط */
        var pointsMap = { easy: 30, medium: 60, hard: 100 };
        var basePoints = pointsMap[state.level] || 30;
        if (window.moudyPoints) {
            window.moudyPoints.add(basePoints, '🎨 خمّن بالإيموجي');
        }
    }

    /* ---------- رجوع للمستويات ---------- */
    function backToLevels() {
        clearInterval(state.timerId);
        state.locked = false;
        el.play.hidden = true;
        el.end.hidden = true;
        el.start.hidden = false;
        window.scrollTo(0, 0);
    }

    /* ---------- ربط الأحداث ---------- */
    document.querySelectorAll('#emojiStart .level-card').forEach(btn => {
        btn.addEventListener('click', () => startLevel(btn.dataset.level));
    });
    el.back.addEventListener('click', backToLevels);
    el.endBack.addEventListener('click', backToLevels);
    el.again.addEventListener('click', () => startLevel(state.level));

    /* ---------- Twemoji جاهز؟ ---------- */
    if (typeof twemoji !== 'undefined') {
        /* Twemoji جاهز */
    } else {
        /* انتظر تحميل twemoji */
        window.addEventListener('load', () => {
            if (typeof twemoji !== 'undefined') twemoji.parse(document.body);
        });
    }
})();





/* ==================================================================
   قسم: أغنية اليوم
   ================================================================== */
   (function initDailySong() {
    /* قائمة الأغاني */
    const SONGS_LIST = [
        { title: 'نوبة', id: 'ZxbchOV0As4' },
        { title: 'نايكي', id: 'bRxvtbyMvQs' },
        { title: 'قد التحدي', id: 'e3neCGeuC2I' },
        { title: 'على الهاوية', id: 'rJNQKNu-rbo' },
        { title: 'الطير', id: 'Lr-6AYRUFEc' },
        { title: 'يوم الحرية', id: 'cT-PHqIkR4E' },
        { title: 'تروما', id: '0TZ-UmDDwyA' },
        { title: 'جوسي', id: 'vsxGkz5R9aQ' },
        { title: 'ذكريات', id: 'nu7iJt4_yu4' },
        { title: 'طريق اللاذقية', id: 'q0oNAwL6YsU' },
        { title: 'كفاحي', id: 'MOuyFGBmwKU' },
        { title: 'مسلول', id: 'pqHNFavyrVo' },
        { title: 'روبن مود', id: 'dPjM4YvF9vQ' },
        { title: 'مونستر', id: 'rc4x8l-QnGE' },
        { title: 'كارما', id: 'm4Hz03O9MJ4' },
        { title: 'ياناصر', id: 'DU0G8FJGG64' },
        { title: 'سكابا', id: 'cG_flsWEhC4' },
        { title: 'جونسيبا', id: 'dMikjfERvTA' },
        { title: 'حريقة', id: 'YIomwMgIQQs' },
        { title: '5 مِلي', id: 'oBxDhwKyV4Y' },
        { title: 'شاهين', id: 'GrkSyxB_haA' },
        { title: '14 ونص', id: 'Gzcs2NLVv9I' },
        { title: 'بصارة', id: 'OpHe-tXJkWs' },
        { title: 'نساني', id: '2Z-Glm-sEdQ' },
        { title: '7 طلقات', id: 'D0UUdmX3drc' },
        { title: 'طمنيني', id: 'gHf5oP7N6iE' },
        { title: 'نفس الاعتراف', id: 'ShiGnwQ-3Bw' },
        { title: 'بيانو', id: 'jsuBOipfnN8' },
        { title: 'صراع نفسي', id: 'h_-zk23w5co' },
        { title: 'خورفكان', id: 'Qk_Yo8VOGh4' },
        { title: 'زهايمر', id: 'ZRj9gQGYo-I' },
        { title: 'يا صبر الله', id: 'Zpu7Iy12CjM' },
        { title: 'أشاوس (أولد سكول)', id: '9FLLPhj_Qxo' },
        { title: 'أشاوس', id: 'xozQ_qcffAo' },
        { title: 'نجم ليل', id: 'rJYlBO0a7EY' },
        { title: 'تشكيل عصابي', id: 'bMczZ4EQHOs' },
        { title: 'انتاج محلي', id: '1iYtPHeQc9Y' },
        { title: 'غرناطة', id: 'yLjbZKaTeBg' },
        { title: 'نص الليل', id: 'Jb_fQCaQpBA' },
        { title: 'وسط النيل', id: '-znwuqLeNhs' },
        { title: 'يا ريت', id: '0_NLSFUzVMM' },
        { title: 'خطاف', id: '_k4b66sbm1M' },
        { title: 'فيراري', id: 'JYuJ0QPeAG0' },
        { title: 'توعديني', id: '0XiU3O6wEnU' },
        { title: 'باب شرقي', id: 'BWcSa4eOIww' },
        { title: 'روليكس', id: 'wX6Kt90z-eM' },
        { title: 'ماني شايف', id: 'vKPFbhv7eqo' },
        { title: 'الأرض السعيدة', id: 'wyKXeeIeYHg' },
        { title: 'فلاديمير بوتين', id: 'HcOSEMpDHBo' },
        { title: 'درامادول', id: 'OftsZ4z7OlI' },
        { title: 'أنا الخطأ', id: 'Yl7HpF5oyRk' },
        { title: 'هلأ عرفت أبي', id: 'NEcBVreEck4' },
        { title: 'مسرحية', id: 'A0-L2t4RIkM' },
        { title: 'حكي كتير', id: 'AtVpciHqliw' },
        { title: 'إدمانٌ مؤبد', id: 'P4G9k4pJL8Q' },
        { title: 'ميت 2', id: 'ZHG5l5PjU-4' },
        { title: 'جرح فينا', id: 'Ou8e9zvoS0E' },
        { title: 'الغُربة', id: '3PKBsPmKqVo' },
        { title: 'بفوضى', id: 'EGiz1aAtbBI' },
        { title: 'امشي', id: 'DAeBhOvDgwo' },
        { title: 'الحبيبة', id: 'hZZY-7xaOH8' },
        { title: 'غلط', id: 'zj9TFooEhI4' },
        { title: 'مانو معاشر', id: 'DG_2LDpGymQ' },
        { title: 'تسع ساعات', id: 'T9eKYqcYadY' },
        { title: 'فلسفة', id: 'fph9h_w5kQ0' },
        { title: 'تهديد', id: 'p7yevyd3pI8' },
        { title: 'تصفية حساب', id: 'q0ev9Gb_-6o' },
        { title: 'اعتراف نفسي', id: 'iohCJ5WqiI8' },
        { title: 'تتذكر', id: 'Rd8YaaRIqGs' },
        { title: 'اشتقتلي', id: 'dho_69-1BJM' },
        { title: 'مسلمين وكفار', id: '1UzbKWiq1Fo' },
        { title: 'راضي بكلشي صار', id: 'e3R9XXpmsEM' },
        { title: 'اركي', id: 'cQTx-kFPn-M' },
        { title: 'مامليت', id: '4iXsErw8Po8' },
        { title: 'ايزي', id: '80egFQLQ6PM' }
    ];

    const STORAGE_KEY = 'moudy-daily-song';
    const today = new Date().toISOString().slice(0, 10);

    /* ---------- 1) اختر أغنية اليوم ---------- */
    let data = null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        data = stored ? JSON.parse(stored) : null;
    } catch (e) { data = null; }

    if (!data || data.date !== today) {
        const playedIds = (data && data.playedIds) ? data.playedIds : [];
        const available = SONGS_LIST.filter(function (s) { return playedIds.indexOf(s.id) === -1; });

        let song, newPlayedIds;
        if (available.length === 0) {
            song = SONGS_LIST[Math.floor(Math.random() * SONGS_LIST.length)];
            newPlayedIds = [song.id];
        } else {
            song = available[Math.floor(Math.random() * available.length)];
            newPlayedIds = playedIds.concat([song.id]);
        }

        data = {
            date: today,
            songId: song.id,
            songTitle: song.title,
            playedIds: newPlayedIds
        };

        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
    }

    const song = { id: data.songId, title: data.songTitle };

    /* ---------- 2) شريط صفحة الأغاني ---------- */
    const musicBar = $('dailySongBar');
    if (musicBar) {
        musicBar.hidden = false;
        const titleEl = $('dailySongTitle');
        if (titleEl) titleEl.textContent = song.title;

        const playBtn = $('dailySongPlay');
        if (playBtn) {
            playBtn.addEventListener('click', function () {
                const player = $('player');
                const frame = $('playerFrame');
                if (player && frame) {
                    frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' +
                        song.id + '?autoplay=1" title="' + song.title +
                        '" allow="autoplay; fullscreen" allowfullscreen></iframe>';
                    player.hidden = false;
                }
            });
        }

        const shareBtn = $('dailySongShare');
        if (shareBtn) {
            shareBtn.addEventListener('click', function () { shareSong(song); });
        }
    }

    /* ---------- 3) العدّاد التنازلي ---------- */
    const countdowns = document.querySelectorAll('.daily-countdown');
    if (countdowns.length) {
        function updateCountdown() {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow - now;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);

            const text = String(h).padStart(2, '0') + ':' +
                         String(m).padStart(2, '0') + ':' +
                         String(s).padStart(2, '0');

            countdowns.forEach(function (el) { el.textContent = text; });
        }

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    /* ---------- 4) دالة المشاركة ---------- */
    function shareSong(song) {
        const url = 'https://youtu.be/' + song.id;
        const text = '🎵 أغنية اليوم من مودي العربي:\n"' + song.title + '"\n\n' +
                     url + '\n\n#مودي_العربي #MOUDY_ALARBE';

        function afterCopy() {
            showToast('✅ تم نسخ الرابط! افتح إنستغرام والصقه');
            setTimeout(function () {
                window.open('https://www.instagram.com/', '_blank');
            }, 900);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text)
                .then(afterCopy)
                .catch(function () { fallbackCopy(text, afterCopy); });
        } else {
            fallbackCopy(text, afterCopy);
        }
    }

    function fallbackCopy(text, callback) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        callback();
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = msg;
        document.body.appendChild(toast);

        setTimeout(function () { toast.classList.add('show'); }, 50);
        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 500);
        }, 3500);
    }
})();









/* ==================================================================
   قسم: سلسلة الأيام (Streak)
   ================================================================== */
   (function initStreak() {
    const STORAGE_KEY = 'moudy-streak';
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const thisMonth = today.toISOString().slice(0, 7);

    const MILESTONES = {
        3:   { icon: '🥉', title: 'بداية قوية', points: 50 },
        7:   { icon: '🥈', title: 'أسبوع كامل', points: 150 },
        14:  { icon: '🥇', title: 'أسبوعين',    points: 300 },
        30:  { icon: '💎', title: 'شهر كامل',   points: 1000 },
        100: { icon: '👑', title: 'أسطورة',     points: 5000 }
    };

    const MSG_DAILY = [
        '🔥 أحسنت! واصل كذا',
        '💪 خطوة كل يوم',
        '🌟 أنت الأفضل',
        '✨ عاداتك تبني مستقبلك',
        '🚀 ماشي بثبات'
    ];

    const MSG_LOST = [
        'ما تزعل، ابدأ من جديد 💪',
        'البدايات الجديدة قوة 🌟',
        'كل مرة ترجع تكون أقوى 🔥',
        'الأيام الجاية أحلى ✨'
    ];

    function defaultData() {
        return {
            lastCheckIn: null,
            currentStreak: 0,
            bestStreak: 0,
            totalDays: 0,
            points: 0,
            badges: [],
            freezeAvailable: true,
            lastFreezeMonth: null,
            checkInHistory: []
        };
    }

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultData();
            const parsed = JSON.parse(raw);
            const base = defaultData();
            return Object.assign(base, parsed);
        } catch (e) {
            return defaultData();
        }
    }

    function save(data) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
    }

    function daysBetween(a, b) {
        const d1 = new Date(a + 'T00:00:00');
        const d2 = new Date(b + 'T00:00:00');
        return Math.round((d2 - d1) / 86400000);
    }

    function hasCheckedInToday(data) {
        return data.lastCheckIn === todayStr;
    }

    /* ---------- check-in ---------- */
    function doCheckIn() {
        const data = load();

        if (hasCheckedInToday(data)) {
            showToast('✅ دخلت اليوم أصلاً!');
            return;
        }

        let newStreak = 1;
        let usedFreeze = false;
        let message = MSG_DAILY[Math.floor(Math.random() * MSG_DAILY.length)];

        if (data.lastCheckIn) {
            const diff = daysBetween(data.lastCheckIn, todayStr);

            if (diff === 1) {
                newStreak = data.currentStreak + 1;
            } else if (diff === 2 && data.freezeAvailable && data.lastFreezeMonth !== thisMonth) {
                newStreak = data.currentStreak + 1;
                usedFreeze = true;
                data.freezeAvailable = false;
                data.lastFreezeMonth = thisMonth;
                message = '❄️ استخدمنا حماية! سلسلتك محفوظة';
            } else {
                newStreak = 1;
                message = MSG_LOST[Math.floor(Math.random() * MSG_LOST.length)];
            }
        }

        data.lastCheckIn = todayStr;
        data.currentStreak = newStreak;
        data.totalDays = (data.totalDays || 0) + 1;
        data.points = (data.points || 0) + 10;

        if (newStreak > (data.bestStreak || 0)) {
            data.bestStreak = newStreak;
        }

        if (!data.checkInHistory) data.checkInHistory = [];
        if (data.checkInHistory.indexOf(todayStr) === -1) {
            data.checkInHistory.push(todayStr);
            if (data.checkInHistory.length > 90) {
                data.checkInHistory = data.checkInHistory.slice(-90);
            }
        }

        let badgeEarned = null;
        if (MILESTONES[newStreak]) {
            const m = MILESTONES[newStreak];
            if (!data.badges) data.badges = [];
            if (data.badges.indexOf(newStreak) === -1) {
                data.badges.push(newStreak);
                data.points += m.points;
                badgeEarned = m;
            }
        }

        save(data);
        if (window.moudyChallenge) window.moudyChallenge.trackStreak();
        showCheckInPopup(newStreak, badgeEarned, message, usedFreeze);
        updateAllUI();
        renderStreakPage();
    }
    /* ---------- popup ---------- */
    function showCheckInPopup(streak, badge, message, usedFreeze) {
        const popup = document.createElement('div');
        popup.className = 'streak-popup';
        popup.innerHTML =
            '<div class="streak-popup-content">' +
                '<div class="streak-popup-flame">🔥</div>' +
                '<div class="streak-popup-num">' + streak + '</div>' +
                '<div class="streak-popup-label">' + (streak === 1 ? 'يوم' : 'أيام متتالية') + '</div>' +
                '<div class="streak-popup-msg">' + message + '</div>' +
                (badge ? '<div class="streak-popup-badge">' +
                    '<span class="streak-popup-badge-icon">' + badge.icon + '</span>' +
                    '<span class="streak-popup-badge-title">' + badge.title + '</span>' +
                    '<span class="streak-popup-badge-points">+' + badge.points + ' نقطة</span>' +
                '</div>' : '') +
                '<button class="streak-popup-close" type="button">تمام</button>' +
            '</div>';
        document.body.appendChild(popup);
        setTimeout(function () { popup.classList.add('show'); }, 30);

        popup.querySelector('.streak-popup-close').addEventListener('click', function () {
            popup.classList.remove('show');
            setTimeout(function () { popup.remove(); }, 400);
        });
    }

    /* ---------- Nav icon ---------- */
    function injectNavIcon() {
        const nav = document.getElementById('siteNav');
        if (!nav) return;

        const a = document.createElement('a');
        a.href = 'streak.html';
        a.className = 'streak-nav-icon';
        a.setAttribute('aria-label', 'سلسلة الأيام');
        a.innerHTML = '🔥<span id="streakNavIcon">0</span>';
        nav.appendChild(a);
    }

    /* ---------- Update UI ---------- */
    function updateAllUI() {
        const data = load();
        const checked = hasCheckedInToday(data);

        const navIcon = document.getElementById('streakNavIcon');
        if (navIcon) {
            navIcon.textContent = data.currentStreak || 0;
            const parent = navIcon.parentElement;
            if (parent) parent.classList.toggle('active', checked);
        }

        /* كرت الرئيسية */
        const homeNum = document.getElementById('streakHomeNum');
        const homeIcon = document.getElementById('streakHomeIcon');
        const homeLink = document.getElementById('streakHomeLink');

        if (homeNum) {
            const n = data.currentStreak || 0;
            homeNum.textContent = n + (n === 1 ? ' يوم' : ' أيام');
        }

        if (homeIcon) {
            homeIcon.textContent = checked ? '✅' : '🔥';
        }

        if (homeLink) {
            if (checked) {
                homeLink.style.borderColor = 'rgba(0, 255, 136, 0.5)';
                homeLink.style.background = 'linear-gradient(135deg, rgba(0, 40, 20, 0.85), rgba(0, 20, 10, 0.9))';
            } else {
                homeLink.style.borderColor = 'rgba(255, 100, 0, 0.5)';
                homeLink.style.background = '';
            }
        }
    }
    /* ---------- Render streak page ---------- */
    function renderStreakPage() {
        /* الصفحة الرئيسية للمميزات */
        const numberBig = document.getElementById('streakNumber');
        if (!numberBig) return;

        const data = load();

        numberBig.textContent = data.currentStreak || 0;

        const mainBtn = document.getElementById('streakMainBtn');
        if (mainBtn) {
            if (hasCheckedInToday(data)) {
                mainBtn.textContent = '✅ دخلت اليوم';
                mainBtn.disabled = true;
            } else {
                mainBtn.textContent = '🔥 سجّل دخولك اليوم';
                mainBtn.disabled = false;
            }
        }

        const msg = document.getElementById('streakMsg');
        if (msg) {
            if (hasCheckedInToday(data)) {
                msg.textContent = '🎉 عودة رائعة! اشوفك بكرا';
            } else if (data.currentStreak > 0) {
                msg.textContent = 'ما تكسر السلسلة! سجّل دخولك 🔥';
            } else {
                msg.textContent = 'ابدأ سلسلتك اليوم!';
            }
        }

        document.getElementById('statBest').textContent = data.bestStreak || 0;
        document.getElementById('statTotal').textContent = data.totalDays || 0;
        document.getElementById('statPoints').textContent = data.points || 0;
        document.getElementById('statFreeze').textContent =
            data.freezeAvailable && data.lastFreezeMonth !== thisMonth ? 'متاح' : 'مستخدم';

        /* Badges */
        const badgesGrid = document.getElementById('badgesGrid');
        if (badgesGrid) {
            badgesGrid.innerHTML = '';
            Object.keys(MILESTONES).forEach(function (days) {
                const m = MILESTONES[days];
                const earned = data.badges && data.badges.indexOf(Number(days)) !== -1;
                const card = document.createElement('div');
                card.className = 'badge-card ' + (earned ? 'earned' : 'locked');
                card.innerHTML =
                    '<span class="badge-icon">' + m.icon + '</span>' +
                    '<span class="badge-title">' + m.title + '</span>' +
                    '<span class="badge-days">' + days + ' يوم</span>' +
                    '<span class="badge-points">' + (earned ? '✅ حصلت عليها' : '+' + m.points + ' نقطة') + '</span>';
                badgesGrid.appendChild(card);
            });
        }

        /* Calendar — last 30 days */
        const cal = document.getElementById('streakCalendar');
        if (cal) {
            cal.innerHTML = '';
            const todayD = new Date();
            for (let i = 29; i >= 0; i--) {
                const d = new Date(todayD);
                d.setDate(d.getDate() - i);
                const dStr = d.toISOString().slice(0, 10);

                const div = document.createElement('div');
                div.className = 'cal-day';

                const checked = data.checkInHistory && data.checkInHistory.indexOf(dStr) !== -1;
                if (checked) div.classList.add('checked');
                if (dStr === todayStr) div.classList.add('today');

                div.textContent = d.getDate();
                div.title = dStr;
                cal.appendChild(div);
            }
        }

        /* Milestones */
        const milestonesGrid = document.getElementById('milestonesGrid');
        if (milestonesGrid) {
            milestonesGrid.innerHTML = '';
            Object.keys(MILESTONES).forEach(function (days) {
                const m = MILESTONES[days];
                const done = data.badges && data.badges.indexOf(Number(days)) !== -1;
                const card = document.createElement('div');
                card.className = 'milestone-card ' + (done ? 'done' : '');
                card.innerHTML =
                    '<div class="badge-icon">' + m.icon + '</div>' +
                    '<div class="badge-title">' + m.title + '</div>' +
                    '<div class="milestone-days">' + (done ? '✅ حصلت عليها' : 'عند ' + days + ' يوم') + '</div>';
                milestonesGrid.appendChild(card);
            });
        }
    }

    /* ---------- Toast ---------- */
    function showToast(msg) {
        let toast = document.querySelector('.streak-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'streak-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        setTimeout(function () { toast.classList.add('show'); }, 30);
        setTimeout(function () { toast.classList.remove('show'); }, 2500);
    }

    /* ---------- ربط ---------- */
    injectNavIcon();
    updateAllUI();




    const mainBtn = document.getElementById('streakMainBtn');
    if (mainBtn) mainBtn.addEventListener('click', doCheckIn);

    renderStreakPage();

    /* للاستخدام العام */
    window.moudyStreak = { checkIn: doCheckIn, load: load };
})();






/* ==================================================================
   قسم: نظام العملات (معطّل — انتقلنا لنظام النقاط الموحّد)
   ------------------------------------------------------------------
   - نخلي API وهمي بس عشان ما يخرب شي إذا في كود قديم بينادي عليه
   ================================================================== */
   (function initCoins() {
    /* API وهمي — كل شي بيرجع صفر */
    window.moudyCoins = {
        get: function () { return 0; },
        add: function () { return 0; },
        update: function () {}
    };
})();
/* ==================================================================
   قسم: عجلة النقاط (wheel.html) — كل الجوائز نقاط
   ================================================================== */
   (function initWheel() {
    const wheel = document.getElementById('wheel');
    if (!wheel) return;

    const STORAGE_KEY = 'moudy-wheel';
    const today = new Date().toISOString().slice(0, 10);

    /* الجوائز — كلها نقاط */
    const PRIZES = [
        { type: 'points', amount: 50,   label: '⭐ 50',   weight: 30 },
        { type: 'points', amount: 75,   label: '⭐ 75',   weight: 20 },
        { type: 'points', amount: 100,  label: '⭐ 100',  weight: 15 },
        { type: 'points', amount: 150,  label: '💎 150',  weight: 12 },
        { type: 'points', amount: 200,  label: '🎁 200',  weight: 10 },
        { type: 'points', amount: 60,   label: '⭐ 60',   weight: 8 },
        { type: 'again',  amount: 0,    label: '🎡 عيد',  weight: 4 },
        { type: 'legend', amount: 1000, label: '👑 1000', weight: 1 }
    ];

    const TOTAL_WEIGHT = PRIZES.reduce(function (s, p) { return s + p.weight; }, 0);
    const SEG_ANGLE = 360 / PRIZES.length;

    /* عناصر */
    const el = {
        btn:      document.getElementById('wheelBtn'),
        adBtn:    document.getElementById('wheelAdBtn'),
        msg:      document.getElementById('wheelMsg'),
        countdown: document.getElementById('wheelCountdown'),
        pointsBig: document.getElementById('pointsBig'),
        statTotalSpins: document.getElementById('statTotalSpins'),
        statTotalPoints: document.getElementById('statTotalPoints'),
        statStreak: document.getElementById('statStreak')
    };

    /* بناء العجلة */
    function buildWheel() {
        wheel.querySelectorAll('.wheel-label').forEach(function (l) { l.remove(); });

        PRIZES.forEach(function (p, i) {
            const angle = i * SEG_ANGLE + SEG_ANGLE / 2;
            const label = document.createElement('div');
            label.className = 'wheel-label';
            label.textContent = p.label;
            const R = 130;
            label.style.transform =
                'translate(-50%, -50%) rotate(' + angle + 'deg) translateY(-' + R + 'px) rotate(' + (-angle) + 'deg)';
            wheel.appendChild(label);
        });
    }

    /* تحميل الحالة */
    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : { lastFreeSpin: null, totalSpins: 0, totalPointsEarned: 0 };
        } catch (e) { return { lastFreeSpin: null, totalSpins: 0, totalPointsEarned: 0 }; }
    }

    function saveState(s) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch (e) {}
    }

    /* اختيار الجائزة */
    function pickPrize() {
        let r = Math.random() * TOTAL_WEIGHT;
        for (let i = 0; i < PRIZES.length; i++) {
            r -= PRIZES[i].weight;
            if (r <= 0) return i;
        }
        return 0;
    }

    let rotation = 0;
    let isSpinning = false;

    /* الدوران */
    function spin() {
        if (isSpinning) return;

        const state = loadState();
        if (state.lastFreeSpin === today) {
            showToast('⏰ ارجع بكرة للدورة المجانية!');
            return;
        }

        isSpinning = true;
        el.btn.disabled = true;

        const prizeIdx = pickPrize();
        const prize = PRIZES[prizeIdx];

        const segCenter = prizeIdx * SEG_ANGLE + SEG_ANGLE / 2;
        const offset = (Math.random() - 0.5) * (SEG_ANGLE - 20);
        const targetAngle = 360 * 6 - segCenter + offset;

        const currentMod = rotation % 360;
        rotation = rotation + (targetAngle - currentMod) + 360;

        wheel.style.transition = 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
        wheel.style.transform = 'rotate(' + rotation + 'deg)';

        setTimeout(function () {
            state.lastFreeSpin = today;
            state.totalSpins = (state.totalSpins || 0) + 1;
            saveState(state);

            applyPrize(prize, state);

            if (window.moudyChallenge) window.moudyChallenge.trackWheel();

            isSpinning = false;
            updateUI();
        }, 5200);
    }

    /* تطبيق الجائزة */
    function applyPrize(prize, state) {
        if (prize.type === 'points') {
            if (window.moudyPoints) {
                window.moudyPoints.add(prize.amount, '⭐ عجلة النقاط');
            }
            state.totalPointsEarned = (state.totalPointsEarned || 0) + prize.amount;
            saveState(state);
            showPrizePopup('⭐', prize.amount + ' نقطة', 'مبروك!');
        } else if (prize.type === 'again') {
            state.lastFreeSpin = null;
            saveState(state);
            showPrizePopup('🎡', 'دورة إضافية!', 'يا حظك!');
        } else if (prize.type === 'legend') {
            if (window.moudyPoints) {
                window.moudyPoints.add(prize.amount, '👑 أسطوري!');
            }
            state.totalPointsEarned = (state.totalPointsEarned || 0) + prize.amount;
            saveState(state);
            showPrizePopup('👑', prize.amount + ' نقطة', 'أسطوري!!!');
        }
    }

    /* Popup الجائزة */
    function showPrizePopup(icon, value, title) {
        const popup = document.createElement('div');
        popup.className = 'prize-popup';
        popup.innerHTML =
            '<div class="prize-popup-content">' +
                '<div class="prize-popup-title">' + title + '</div>' +
                '<div class="prize-popup-icon">' + icon + '</div>' +
                '<div class="prize-popup-value">' + value + '</div>' +
                '<div class="prize-popup-label">تمت الإضافة لتقدمك</div>' +
                '<button class="prize-popup-close" type="button">تمام</button>' +
            '</div>';
        document.body.appendChild(popup);
        setTimeout(function () { popup.classList.add('show'); }, 30);

        popup.querySelector('.prize-popup-close').addEventListener('click', function () {
            popup.classList.remove('show');
            setTimeout(function () { popup.remove(); }, 400);
        });
    }

    /* تحديث الواجهة */
    function updateUI() {
        const state = loadState();
        const canSpin = state.lastFreeSpin !== today;

        if (el.btn) {
            el.btn.disabled = !canSpin;
            const s = el.btn.querySelector('small');
            if (s) s.textContent = canSpin ? 'دوّر' : 'بكرة';
        }

        if (el.msg) {
            el.msg.textContent = canSpin ?
                '🎁 دورتك المجانية اليومية جاهزة!' :
                '💫 دورة جديدة بعد 24 ساعة';
        }

        if (el.pointsBig && window.moudyPoints) {
            el.pointsBig.textContent = window.moudyPoints.get().toLocaleString('en');
        }
        if (el.statTotalSpins) el.statTotalSpins.textContent = state.totalSpins || 0;
        if (el.statTotalPoints) el.statTotalPoints.textContent = (state.totalPointsEarned || 0).toLocaleString('en');

        try {
            const streak = JSON.parse(localStorage.getItem('moudy-streak') || '{}');
            if (el.statStreak) el.statStreak.textContent = streak.currentStreak || 0;
        } catch (e) {}
    }

    /* العدّاد */
    let countdownId = null;
    function startCountdown() {
        clearInterval(countdownId);
        if (!el.countdown) return;

        function tick() {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow - now;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);

            el.countdown.textContent =
                String(h).padStart(2, '0') + ':' +
                String(m).padStart(2, '0') + ':' +
                String(s).padStart(2, '0');
        }

        tick();
        countdownId = setInterval(tick, 1000);
    }

    /* Toast */
    function showToast(msg) {
        let t = document.querySelector('.wheel-toast');
        if (!t) {
            t = document.createElement('div');
            t.className = 'wheel-toast';
            document.body.appendChild(t);
        }
        t.textContent = msg;
        setTimeout(function () { t.classList.add('show'); }, 30);
        setTimeout(function () { t.classList.remove('show'); }, 2500);
    }

    /* ربط الأحداث */
    if (el.btn) el.btn.addEventListener('click', spin);
    if (el.adBtn) el.adBtn.addEventListener('click', function () {
        showToast('📺 الإعلانات قريباً!');
    });

    /* اسمع لتحديث النقاط */
    window.addEventListener('cloud-synced', updateUI);

    /* تشغيل */
    buildWheel();
    updateUI();
    startCountdown();
})();









/* ==================================================================
   قسم: صندوق اليوم
   ================================================================== */
   (function initBox() {
    const STORAGE_KEY = 'moudy-box';

    /* ---------- 💬 الاقتباسات (من كلمات أغاني مودي) ---------- */
    const QUOTES = [
        { text: 'قدام العالم بصريح العبارة، هاد اسمو تهديد', from: 'تهديد' },
        { text: 'عالمي مُنسى، لكن سـ أعود', from: 'تهديد' },
        { text: 'أمنتُ بنفسي لأنها كانت، والآنَ مازالت نفسٌ لا تهاب', from: 'اعتراف نفسي' },
        { text: 'لا يوجد قيود، تفكيرُكَ الحاكم', from: 'اعتراف نفسي' },
        { text: 'لست بقاتل بل صانع سلام', from: 'تصفية حساب' },
        { text: 'الغنى بالغربة وطن، والفقر بالوطن غربة', from: 'فلسفة' },
        { text: 'أنا الكائن يلي صمد، انا الي بآمن بنفسي بآمن برب صمد', from: 'مانو معاشر' },
        { text: 'بتوعديني انك حتكوني حصني، قارب نجات سفينتي', from: 'توعديني' },
        { text: 'بعد نص الليل بطفي الضو لتحكي العتمه', from: 'نص الليل' },
        { text: 'مستقبل مابيسئل عالطريق اللي جيتو، المهم طريقو يوديك', from: 'جرح فينا' },
        { text: 'بكون كذاب لو ما قلت اني مشتاق امي', from: 'طمنيني' },
        { text: 'بنيت البناء وانهد بنائي وازدادَ عنائي وطال المُحال', from: 'نفس الاعتراف' },
        { text: 'شكلو زهايمر نسيتي بعدك بالأرض', from: 'زهايمر' },
        { text: 'حفر الطوب بمعالق، نفق يحررني سالك لاقطع السوور', from: 'خطاف' },
        { text: 'باب شرقي الحاره نصيحه، بناقه مافي شماعه', from: 'باب شرقي' },
        { text: 'تاركها، بكرى الكارما بتربيها', from: 'كارما' },
        { text: 'لما بيغيب السبع، بتفلت الضباع', from: 'يا صبر الله' },
        { text: 'حياة كل انسان هي عبارة عن كتاب', from: 'صراع نفسي' },
        { text: 'امن بنفسك رح ترفع ايمانك، حارب لتبقى', from: 'امشي' },
        { text: 'لو جاي في رجوع، نساني', from: 'نساني' },
        { text: 'نت متل الساعه الروليكس، لكنك فيك', from: 'روليكس' },
        { text: 'كلنا ممثلين، و الدور ورقة', from: 'مسرحية' },
        { text: 'نفوسنا اقبح من حقد المجوس وعفنٍ يطفح', from: 'غرناطة' },
        { text: 'أصبحتُ مريض، المرض سيُنشر', from: 'إدمانٌ مؤبد' },
        { text: 'تسع ساعات خلوني اعرف انو كل خطأ اخطأتو كان حجر بلا من ذاتي', from: 'تسع ساعات' },
        { text: 'حكي كتير و كتير لي حكا', from: 'حكي كتير' },
        { text: 'رح ارجع حب من اول وجديد', from: 'ماني شايف' },
        { text: 'الكلاب تعوي والقافلة تسير', from: 'الأرض السعيدة' },
        { text: 'الرصاصة اخرا رح تصيب، والدهر ما ضحك النا لهيك منضحك نفسنا', from: 'وسط النيل' },
        { text: 'انت الباطل لو عالحق، والحق مابيظهر بالصورة', from: 'الغُربة' },
        { text: 'مهما حاولتو تسكتونا، مابتسكتونا', from: 'طريق الخراب' },
        { text: 'ربي ياربي تحفظها ليا، تخليها ليا، تحميها فيا', from: 'الحبيبة' },
        { text: 'الدنيا والكذب كالنقش والطوب', from: 'بفوضى' },
        { text: 'سامحني و من قلبي بعتذر', from: 'هلأ عرفت أبي' },
        { text: 'لو بدو حُبك تشكيل عصابه، اعتبري شكلتا', from: 'تشكيل عصابي' },
        { text: 'جرحت أيدي بدي كون مصاب', from: 'مصاب' },
        { text: 'ماملّيت، انا ماملّيت', from: 'مامليت' },
        { text: 'صوت الماضي فينا عايش، فكرت رح أوقع ماني شايف', from: 'ماني شايف' },
        { text: 'الدنيا درس أنا بكتب', from: 'مصاب' },
        { text: 'فالخلف قد أنفع، وسميَ سم', from: 'تهديد' }
    ];

    /* ---------- 📖 معلومات عامة ---------- */
    const FACTS = [
        { text: 'مودي العربي فنان سوري، بيقدّم الراب بأسلوب خاص يمزج بين القوة والشاعرية.' },
        { text: 'أسلوب مودي معروف بالكلمات العميقة والتعبير عن الواقع.' },
        { text: 'مودي العربي بيجمع بين كتابة الكلمات والأداء.' },
        { text: 'كلمات مودي كتير منها بتحكي عن الحياة والتحديات والصمود.' },
        { text: 'الموقع الرسمي هو المكان الوحيد اللي بتلاقي فيه كل أغانيه مرتبة.' },
        { text: 'مودي عندو ألبومات وأغاني فردية كتيرة، منها "ياناصر" و "صراع نفسي".' },
        { text: 'كل أغنية عند مودي إلها قصة وقيمة.' },
        { text: 'كثير من أغاني مودي فيها إسقاطات اجتماعية.' },
        { text: 'مودي بيكتب بنفسه كل كلماته.' },
        { text: 'عندك هون بموقع مودي ألعاب ونشاطات يومية!' }
    ];

    /* ---------- 🎵 أغاني مقترحة ---------- */
    const SONG_SUGGESTIONS = [
        { title: 'روليكس', id: 'wX6Kt90z-eM', mood: 'فخم' },
        { title: 'ياناصر', id: 'DU0G8FJGG64', mood: 'فخر' },
        { title: 'تروما', id: '0TZ-UmDDwyA', mood: 'حزين' },
        { title: 'حريقة', id: 'YIomwMgIQQs', mood: 'حماسي' },
        { title: 'قد التحدي', id: 'e3neCGeuC2I', mood: 'تحفيزي' },
        { title: 'صراع نفسي', id: 'h_-zk23w5co', mood: 'عميق' },
        { title: 'نوبة', id: 'ZxbchOV0As4', mood: 'هادئ' },
        { title: 'شاهين', id: 'GrkSyxB_haA', mood: 'قوي' },
        { title: 'باب شرقي', id: 'BWcSa4eOIww', mood: 'شعبي' },
        { title: 'غرناطة', id: 'yLjbZKaTeBg', mood: 'تاريخي' },
        { title: 'فيراري', id: 'JYuJ0QPeAG0', mood: 'حماسي' },
        { title: 'كارما', id: 'm4Hz03O9MJ4', mood: 'عميق' },
        { title: 'مونستر', id: 'rc4x8l-QnGE', mood: 'قوي' },
        { title: 'طريق اللاذقية', id: 'q0oNAwL6YsU', mood: 'سوري' },
        { title: 'الحبيبة', id: 'hZZY-7xaOH8', mood: 'رومانسي' }
    ];

    const today = new Date().toISOString().slice(0, 10);

    /* ---------- الحالة ---------- */
    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : { lastOpen: null, total: 0, legendary: 0 };
        } catch (e) { return { lastOpen: null, total: 0, legendary: 0 }; }
    }
    function save(d) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch (e) {}
    }

    function hasOpenedToday() {
        return load().lastOpen === today;
    }

    /* ---------- اختيار محتوى ---------- */
    function pickContent() {
        /* 1% أسطوري */
        const isLegendary = Math.random() < 0.01;

        if (isLegendary) {
            /* محتوى أسطوري: اقتباس نادر + جائزة */
            const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
            return {
                type: 'legendary',
                icon: '🌟',
                label: 'مفاجأة أسطورية!',
                text: q.text,
                from: q.from,
                extra: '🎉 حصلت على شارة أسطورية!'
            };
        }

        /* باقي الأنواع */
        const roll = Math.random();
        if (roll < 0.5) {
            /* اقتباس */
            const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
            return { type: 'quote', icon: '💬', label: 'اقتباس', text: q.text, from: q.from };
        } else if (roll < 0.8) {
            /* أغنية */
            const s = SONG_SUGGESTIONS[Math.floor(Math.random() * SONG_SUGGESTIONS.length)];
            return { type: 'song', icon: '🎵', label: 'أغنية مقترحة', title: s.title, songId: s.id, mood: s.mood };
        } else {
            /* معلومة */
            const f = FACTS[Math.floor(Math.random() * FACTS.length)];
            return { type: 'fact', icon: '📖', label: 'معلومة', text: f.text };
        }
    }

    /* ---------- فتح الصندوق ---------- */
    function openBox() {
        if (hasOpenedToday()) {
            showToast('⏰ ارجع بكرة لصندوق جديد!');
            return;
        }

        const box3d = document.getElementById('box3d');
        const btn = document.getElementById('boxOpenBtn');

        if (box3d) box3d.classList.add('shake');
        if (btn) btn.disabled = true;

        /* اختار المحتوى */
        const content = pickContent();

        setTimeout(function () {
            if (box3d) {
                box3d.classList.remove('shake');
                box3d.classList.add('opened');
            }

            /* بعد أنيميشن الفتح، طلّع popup */
            setTimeout(function () {
                showContentPopup(content);

                /* حفظ */
                const data = load();
                data.lastOpen = today;
                data.total = (data.total || 0) + 1;
                if (content.type === 'legendary') {
                    data.legendary = (data.legendary || 0) + 1;
                }
                save(data);
                if (window.moudyChallenge) window.moudyChallenge.trackBox();

                /* ⭐ نقاط صندوق اليوم */
                var boxPoints = content.type === 'legendary' ? 100 : 30;
                if (window.moudyPoints) {
                    window.moudyPoints.add(boxPoints, '🎁 صندوق اليوم');
                }

                updateUI();
            }, 500);
        }, 1500);
    }
    /* ---------- popup المحتوى ---------- */
    function showContentPopup(content) {
        const popup = document.createElement('div');
        popup.className = 'box-popup';

        let innerHTML = '<div class="box-popup-content' + (content.type === 'legendary' ? ' legendary' : '') + '">';
        innerHTML += '<div class="box-popup-icon">' + content.icon + '</div>';
        innerHTML += '<div class="box-popup-type">' + content.label + '</div>';

        if (content.type === 'quote' || content.type === 'legendary') {
            innerHTML += '<div class="box-popup-text">"' + content.text + '"</div>';
            innerHTML += '<div class="box-popup-from">— من أغنية ' + content.from + '</div>';
            if (content.extra) {
                innerHTML += '<div class="box-popup-from" style="color:#ffd700;">' + content.extra + '</div>';
            }
        } else if (content.type === 'song') {
            innerHTML += '<div class="box-popup-text">🎵 ' + content.title + '</div>';
            innerHTML += '<div class="box-popup-from">المزاج: ' + content.mood + '</div>';
            innerHTML += '<a class="box-popup-song" href="music.html?mood=all">▶ اسمعها الآن</a>';
        } else if (content.type === 'fact') {
            innerHTML += '<div class="box-popup-text">' + content.text + '</div>';
        }

        innerHTML += '<button class="box-popup-close" type="button">تمام</button>';
        innerHTML += '</div>';

        popup.innerHTML = innerHTML;
        document.body.appendChild(popup);

        setTimeout(function () { popup.classList.add('show'); }, 30);

        popup.querySelector('.box-popup-close').addEventListener('click', function () {
            popup.classList.remove('show');
            setTimeout(function () { popup.remove(); }, 400);
        });
    }

    /* ---------- Toast ---------- */
    function showToast(msg) {
        let t = document.querySelector('.box-toast');
        if (!t) {
            t = document.createElement('div');
            t.className = 'box-toast';
            document.body.appendChild(t);
        }
        t.textContent = msg;
        setTimeout(function () { t.classList.add('show'); }, 30);
        setTimeout(function () { t.classList.remove('show'); }, 2500);
    }

    /* ---------- تحديث الواجهة ---------- */
    function updateUI() {
        const data = load();
        const opened = hasOpenedToday();

        /* الرئيسية */
        const homeStatus = document.getElementById('boxHomeStatus');
        const homeIcon = document.getElementById('boxHomeIcon');
        const homeLink = document.getElementById('boxHomeLink');

        if (homeStatus) {
            homeStatus.textContent = opened ? '⏰ بكرة' : 'افتحه!';
        }
        if (homeIcon) {
            homeIcon.textContent = opened ? '✅' : '🎁';
        }
        if (homeLink) {
            if (opened) {
                homeLink.style.borderColor = 'rgba(0, 255, 136, 0.5)';
                homeLink.style.background = 'linear-gradient(135deg, rgba(0, 40, 20, 0.85), rgba(0, 20, 10, 0.9))';
            } else {
                homeLink.style.borderColor = '';
                homeLink.style.background = '';
            }
        }

        /* صفحة الصندوق */
        const btn = document.getElementById('boxOpenBtn');
        if (btn) {
            if (opened) {
                btn.disabled = true;
                btn.innerHTML = '<span>✅</span><small>افتحته اليوم</small>';
                const box3d = document.getElementById('box3d');
                if (box3d) box3d.classList.add('opened');
            } else {
                btn.disabled = false;
                btn.innerHTML = '<span>🎁</span><small>افتح الصندوق</small>';
            }
        }

        const statTotal = document.getElementById('statBoxesTotal');
        if (statTotal) statTotal.textContent = data.total || 0;

        const statLegendary = document.getElementById('statBoxesLegendary');
        if (statLegendary) statLegendary.textContent = data.legendary || 0;

        /* Streak */
        const statStreak = document.getElementById('statBoxesStreak');
        if (statStreak) {
            try {
                const streak = JSON.parse(localStorage.getItem('moudy-streak') || '{}');
                statStreak.textContent = streak.currentStreak || 0;
            } catch (e) {}
        }
    }

    /* ---------- عدّاد ---------- */
    let countdownId = null;
    function startCountdown() {
        clearInterval(countdownId);
        const el = document.getElementById('boxTimer');
        if (!el) return;

        function tick() {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow - now;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);

            el.textContent =
                String(h).padStart(2, '0') + ':' +
                String(m).padStart(2, '0') + ':' +
                String(s).padStart(2, '0');
        }

        tick();
        countdownId = setInterval(tick, 1000);
    }

    /* ---------- ربط ---------- */
    const openBtn = document.getElementById('boxOpenBtn');
    if (openBtn) openBtn.addEventListener('click', openBox);

    const box3d = document.getElementById('box3d');
    if (box3d && !hasOpenedToday()) {
        box3d.style.cursor = 'pointer';
        box3d.addEventListener('click', openBox);
    }

    updateUI();
    startCountdown();
})();








/* ==================================================================
   قسم: لعبة الكلمة المفقودة (missing.html)
   ================================================================== */
   (function initMissingWord() {
    const line = document.getElementById('missLine');
    if (!line) return;

    /* Twemoji للإيموجي */
    if (typeof twemoji !== 'undefined') {
        setTimeout(function () { twemoji.parse(document.body); }, 100);
    }

    /* ---------- 🎯 الأسئلة (من كلمات أغاني مودي) ---------- */
    const DATA = {
        easy: {
            time: 20,
            pick: 10,
            questions: [
                { line: 'نت متل الساعة الروليكس ______ فيك', answer: 'لكنك', song: 'روليكس' },
                { line: 'قدام العالم بصريح العبارة هاد اسمو ______', answer: 'تهديد', song: 'تهديد' },
                { line: 'أمنتُ بنفسي لأنها ______', answer: 'كانت', song: 'اعتراف نفسي' },
                { line: 'لست بقاتل بل صانع ______', answer: 'سلام', song: 'تصفية حساب' },
                { line: 'الغنى بالغربة ______', answer: 'وطن', song: 'فلسفة' },
                { line: 'حياة كل انسان هي عبارة عن ______', answer: 'كتاب', song: 'صراع نفسي' },
                { line: 'جرحت أيدي بدي كون ______', answer: 'مصاب', song: 'مصاب' },
                { line: 'بكون كذاب لو ما قلت اني مشتاق ______', answer: 'امي', song: 'طمنيني' },
                { line: 'بطفي الضو لتحكي ______', answer: 'العتمه', song: 'نص الليل' },
                { line: 'تاركها بكرى الكارما ______', answer: 'بتربيها', song: 'كارما' },
                { line: 'لما بيغيب السبع بتفلت ______', answer: 'الضباع', song: 'يا صبر الله' },
                { line: 'شكلو زهايمر ______', answer: 'نسيتي', song: 'زهايمر' },
                { line: 'في جرح فينا في الم في ______', answer: 'هرم', song: 'جرح فينا' },
                { line: 'الكلاب تعوي والقافلة ______', answer: 'تسير', song: 'الأرض السعيدة' },
                { line: 'لو جاي في رجوع ______', answer: 'نساني', song: 'نساني' },
                { line: 'امن بنفسك رح ترفع ______', answer: 'ايمانك', song: 'امشي' },
                { line: 'مكسبنا السمعة لا ترفعلي ______', answer: 'الشابوبو', song: 'وسط النيل' },
                { line: 'تسع ساعات خلوني اعرف ______', answer: 'الصعوبة', song: 'تسع ساعات' },
                { line: 'الله الله يا مودي ______ البني ادم هذا', answer: 'مجنون', song: 'نفس الاعتراف' },
                { line: 'بلسانٍ حاد كشف ______', answer: 'الحُساد', song: 'غرناطة' }
            ]
        },
        medium: {
            time: 15,
            pick: 10,
            questions: [
                { line: 'الخوفُ من غدواً يكون ______', answer: 'مُساوم', song: 'اعتراف نفسي' },
                { line: 'مافي حدا يحاسبني، مافي حدا ______', answer: 'يجابهني', song: 'تصفية حساب' },
                { line: 'أصبحتُ مريض المرض ______', answer: 'سيُنشر', song: 'إدمانٌ مؤبد' },
                { line: 'بنيت البناء وانهد بنائي وازدادَ عنائي وطال ______', answer: 'المُحال', song: 'نفس الاعتراف' },
                { line: 'وين حبك لي فيني ______', answer: 'غاب', song: 'زهايمر' },
                { line: 'الطف فيني يا خافي ______', answer: 'الالطااااف', song: 'خطاف' },
                { line: 'كانو هتلر موسليني كنت فرنسا اللي غزو ______', answer: 'فيني', song: 'باب شرقي' },
                { line: 'انت الباطل لو عالحق والحق مابيظهر ______', answer: 'بالصورة', song: 'الغُربة' },
                { line: 'الرصاصة اخرا رح ______', answer: 'تصيب', song: 'وسط النيل' },
                { line: 'اكتر إنسان مكروه اللي قال ______', answer: 'الحقيقة', song: 'تسع ساعات' },
                { line: 'حكي كتير و كتير لي ______', answer: 'حكا', song: 'حكي كتير' },
                { line: 'زرع الأمل وعاني اطمح ما أغرق ______', answer: 'بالطمع', song: 'هلأ عرفت أبي' },
                { line: 'وعد لو فقتي على حالك رح ______', answer: 'تندمي', song: 'كارما' },
                { line: 'والحامي ربك رقبه مابشيلا غير يلي ______', answer: 'حطا', song: 'تشكيل عصابي' },
                { line: 'مابشوف عمري غير ______', answer: 'معاكي', song: 'توعديني' },
                { line: 'بتوعديني انك حتكوني ______', answer: 'حصني', song: 'توعديني' },
                { line: 'قارب نجات سفينتي لحتى كمل ______', answer: 'حربي', song: 'توعديني' },
                { line: 'كل ما زاد عمري يوم زاد ______', answer: 'التفكير', song: 'خطاف' },
                { line: 'مهما حاولتو تسكتونا ______', answer: 'مابتسكتونا', song: 'طريق الخراب' },
                { line: 'ربي ياربي تحفظها ليا تخليها ليا تحميها ______', answer: 'فيا', song: 'الحبيبة' }
            ]
        },
        hard: {
            time: 10,
            pick: 10,
            questions: [
                { line: 'نفوسنا اقبح من حقد المجوس وعفنٍ ______', answer: 'يطفح', song: 'غرناطة' },
                { line: 'أدمانٌ مؤبد خُلِقتُ لأصنع ______', answer: 'المُستحيل', song: 'إدمانٌ مؤبد' },
                { line: 'صوت الماضي فينا عايش فكرت رح أوقع ______', answer: 'ماني شايف', song: 'ماني شايف' },
                { line: 'كلنا ممثلين و الدور ______', answer: 'ورقة', song: 'مسرحية' },
                { line: 'فالخلف قد أنفع، وسميَ ______', answer: 'سم', song: 'تهديد' },
                { line: 'الدنيا والكذب كالنقش ______', answer: 'والطوب', song: 'بفوضى' },
                { line: 'الزمن غرقني بزورق ______', answer: 'لحالي', song: 'بفوضى' },
                { line: 'مستقبل مابيسئل عالطريق اللي جيتو المهم طريقو ______', answer: 'يوديك', song: 'جرح فينا' },
                { line: 'قدام العالم بصريح العبارة ______', answer: 'هاد اسمو تهديد', song: 'تهديد' },
                { line: 'لو بدو حُبك تشكيل ______', answer: 'عصابه', song: 'تشكيل عصابي' },
                { line: 'باب شرقي الحاره نصيحه بناقه مافي ______', answer: 'شماعه', song: 'باب شرقي' },
                { line: 'كان حبك الي بالعكس مُقابل ______', answer: 'شيك', song: 'روليكس' },
                { line: 'حفر الطوب بمعالق نفق يحررني سالك لاقطع ______', answer: 'السوور', song: 'خطاف' },
                { line: 'الدنيا درس أنا ______', answer: 'بكتب', song: 'مصاب' },
                { line: 'حلم حياتي سهم ضاع ما ______', answer: 'صاب', song: 'مصاب' },
                { line: 'أنا الكائن يلي صمد انا الي بآمن بنفسي بآمن برب ______', answer: 'صمد', song: 'مانو معاشر' },
                { line: 'شخصيات البشر جوا نفوسن ظاهر ______', answer: 'مرض', song: 'مانو معاشر' },
                { line: 'نرتدي الياقوت ونبني ______', answer: 'قواعد', song: 'نفس الاعتراف' },
                { line: 'يا أمه لا تقوى بِلا ماتقوى سلاح ______', answer: 'السماح', song: 'غرناطة' },
                { line: 'فين نرجع لبلادي وبلادي ______', answer: 'مسروقه', song: 'الغُربة' }
            ]
        }
    };

    const state = {
        level: null,
        queue: [],
        index: 0,
        score: 0,
        timerId: null,
        timeLeft: 0,
        locked: false
    };

    const el = {
        start:    document.getElementById('missStart'),
        play:     document.getElementById('missPlay'),
        end:      document.getElementById('missEnd'),
        qNum:     document.getElementById('missQNum'),
        score:    document.getElementById('missScore'),
        timer:    document.getElementById('missTimer'),
        timerBox: document.getElementById('missTimerBox'),
        badge:    document.getElementById('missSongBadge'),
        answers:  document.getElementById('missAnswers'),
        feedback: document.getElementById('missFeedback'),
        back:     document.getElementById('missBack'),
        endIcon:  document.getElementById('missEndIcon'),
        endTitle: document.getElementById('missEndTitle'),
        endStats: document.getElementById('missEndStats'),
        again:    document.getElementById('missAgain'),
        endBack:  document.getElementById('missEndBack')
    };

    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function startLevel(levelKey) {
        const cfg = DATA[levelKey];
        if (!cfg) return;
        if (window.moudyChallenge) window.moudyChallenge.trackGame('missing');

        clearInterval(state.timerId);

        state.level = levelKey;
        state.score = 0;
        state.index = 0;
        state.locked = false;
        state.queue = shuffle(cfg.questions).slice(0, cfg.pick);

        el.start.hidden = true;
        el.end.hidden = true;
        el.play.hidden = false;

        el.score.textContent = '0';
        el.feedback.textContent = '';
        el.feedback.className = 'emoji-feedback';

        showQuestion();
    }

    function showQuestion() {
        const cfg = DATA[state.level];
        const q = state.queue[state.index];
        if (!q) { endGame(); return; }

        /* HUD */
        el.qNum.textContent = (state.index + 1) + ' / ' + cfg.pick;

        /* الشارة */
        el.badge.textContent = q.song;

        /* النص مع الفراغ */
        const parts = q.line.split('______');
        line.innerHTML = parts[0] + '<span class="miss-blank">؟؟؟</span>' + (parts[1] || '');
        /* الخيارات — 3 غلط + 1 صح */
        const allAnswers = cfg.questions
            .map(function (x) { return x.answer; })
            .filter(function (x) { return x !== q.answer; });

        const unique = [];
        const seen = {};
        for (let i = 0; i < allAnswers.length; i++) {
            if (!seen[allAnswers[i]]) {
                seen[allAnswers[i]] = true;
                unique.push(allAnswers[i]);
            }
        }

        const wrongPool = shuffle(unique).slice(0, 3);
        const options = shuffle([q.answer].concat(wrongPool));

        el.answers.innerHTML = '';
        options.forEach(function (opt) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'miss-answer';
            btn.textContent = opt;
            btn.addEventListener('click', function () {
                handleAnswer(btn, opt, q.answer);
            });
            el.answers.appendChild(btn);
        });

        /* المؤقّت */
        state.timeLeft = cfg.time;
        el.timer.textContent = state.timeLeft;
        el.timerBox.classList.remove('warning', 'danger');
        startTimer();

        el.feedback.textContent = '';
        el.feedback.className = 'emoji-feedback';
        state.locked = false;
    }

    function startTimer() {
        clearInterval(state.timerId);
        state.timerId = setInterval(function () {
            state.timeLeft--;
            el.timer.textContent = state.timeLeft;

            if (state.timeLeft <= 5) {
                el.timerBox.classList.remove('warning');
                el.timerBox.classList.add('danger');
            } else if (state.timeLeft <= 10) {
                el.timerBox.classList.add('warning');
            }

            if (state.timeLeft <= 0) {
                clearInterval(state.timerId);
                handleTimeout();
            }
        }, 1000);
    }

    function handleAnswer(btn, chosen, correct) {
        if (state.locked) return;
        state.locked = true;
        clearInterval(state.timerId);

        el.answers.querySelectorAll('.miss-answer').forEach(function (b) {
            b.disabled = true;
            if (b.textContent === correct) b.classList.add('correct');
            else if (b === btn) b.classList.add('wrong');
            else b.classList.add('dimmed');
        });

        if (chosen === correct) {
            state.score += 100;
            el.score.textContent = state.score;
            el.feedback.textContent = '✅ صح!';
            el.feedback.className = 'emoji-feedback ok';
        } else {
            el.feedback.textContent = '❌ كانت: ' + correct;
            el.feedback.className = 'emoji-feedback fail';
        }

        setTimeout(nextQuestion, 1400);
    }

    function handleTimeout() {
        if (state.locked) return;
        state.locked = true;

        const q = state.queue[state.index];
        el.answers.querySelectorAll('.miss-answer').forEach(function (b) {
            b.disabled = true;
            if (b.textContent === q.answer) b.classList.add('correct');
            else b.classList.add('dimmed');
        });

        el.feedback.textContent = '⏰ خلص الوقت! كانت: ' + q.answer;
        el.feedback.className = 'emoji-feedback fail';

        setTimeout(nextQuestion, 1400);
    }

    function nextQuestion() {
        state.index++;
        const cfg = DATA[state.level];
        if (state.index >= cfg.pick) {
            endGame();
        } else {
            showQuestion();
        }
    }

    function endGame() {
        clearInterval(state.timerId);
        el.play.hidden = true;
        el.end.hidden = false;

        const cfg = DATA[state.level];
        const maxScore = cfg.pick * 100;
        const percent = Math.round((state.score / maxScore) * 100);

        let icon, title;
        if (percent >= 90)      { icon = '🏆'; title = 'أسطورة!'; }
        else if (percent >= 70) { icon = '🥇'; title = 'ممتاز!'; }
        else if (percent >= 50) { icon = '🥈'; title = 'جيد جداً!'; }
        else if (percent >= 30) { icon = '🥉'; title = 'كويس!'; }
        else                    { icon = '😅'; title = 'حاول مرة تانية'; }

        el.end.classList.remove('lose');
        if (percent < 30) el.end.classList.add('lose');

        el.endIcon.textContent = icon;
        el.endTitle.textContent = title;
        el.endStats.innerHTML =
            'النقاط: <strong>' + state.score + ' / ' + maxScore + '</strong><br>' +
            'النسبة: <strong>' + percent + '%</strong>';

        /* ⭐ نظام النقاط */
        var pointsMap = { easy: 40, medium: 80, hard: 130 };
        var basePoints = pointsMap[state.level] || 40;
        if (window.moudyPoints) {
            window.moudyPoints.add(basePoints, '🔍 الكلمة المفقودة');
        }
    }

    function backToLevels() {
        clearInterval(state.timerId);
        state.locked = false;
        el.play.hidden = true;
        el.end.hidden = true;
        el.start.hidden = false;
        window.scrollTo(0, 0);
    }

    document.querySelectorAll('#missStart .level-card').forEach(function (btn) {
        btn.addEventListener('click', function () { startLevel(btn.dataset.level); });
    });
    el.back.addEventListener('click', backToLevels);
    el.endBack.addEventListener('click', backToLevels);
    el.again.addEventListener('click', function () { startLevel(state.level); });
})();






/* ==================================================================
   قسم: مشغّل الموسيقى الموحّد (نسخة نهائية)
   ================================================================== */
   (function initGameMusic() {
    const body = document.body;
    const isGamePage =
        body.classList.contains('MEMORY-PAGE') ||
        body.classList.contains('EMOJI-PAGE') ||
        body.classList.contains('MISSING-PAGE') ||
        body.classList.contains('WHEEL-PAGE') ||
        body.classList.contains('BOX-PAGE') ||
        body.classList.contains('SCRAMBLE-PAGE');

    if (!isGamePage) return;

    const SONGS = [
        { title: 'نوبة', id: 'ZxbchOV0As4' },
        { title: 'قد التحدي', id: 'e3neCGeuC2I' },
        { title: 'الطير', id: 'Lr-6AYRUFEc' },
        { title: 'تروما', id: '0TZ-UmDDwyA' },
        { title: 'ذكريات', id: 'nu7iJt4_yu4' },
        { title: 'كفاحي', id: 'MOuyFGBmwKU' },
        { title: 'مونستر', id: 'rc4x8l-QnGE' },
        { title: 'كارما', id: 'm4Hz03O9MJ4' },
        { title: 'ياناصر', id: 'DU0G8FJGG64' },
        { title: 'سكابا', id: 'cG_flsWEhC4' },
        { title: 'حريقة', id: 'YIomwMgIQQs' },
        { title: 'شاهين', id: 'GrkSyxB_haA' },
        { title: 'بصارة', id: 'OpHe-tXJkWs' },
        { title: 'طمنيني', id: 'gHf5oP7N6iE' },
        { title: 'خورفكان', id: 'Qk_Yo8VOGh4' },
        { title: 'نجم ليل', id: 'rJYlBO0a7EY' },
        { title: 'غرناطة', id: 'yLjbZKaTeBg' },
        { title: 'خطاف', id: '_k4b66sbm1M' },
        { title: 'فيراري', id: 'JYuJ0QPeAG0' },
        { title: 'روليكس', id: 'wX6Kt90z-eM' },
        { title: 'الأرض السعيدة', id: 'wyKXeeIeYHg' },
        { title: 'أنا الخطأ', id: 'Yl7HpF5oyRk' },
        { title: 'مسرحية', id: 'A0-L2t4RIkM' },
        { title: 'حكي كتير', id: 'AtVpciHqliw' },
        { title: 'جرح فينا', id: 'Ou8e9zvoS0E' },
        { title: 'الغُربة', id: '3PKBsPmKqVo' },
        { title: 'بفوضى', id: 'EGiz1aAtbBI' },
        { title: 'امشي', id: 'DAeBhOvDgwo' },
        { title: 'الحبيبة', id: 'hZZY-7xaOH8' },
        { title: 'غلط', id: 'zj9TFooEhI4' },
        { title: 'فلسفة', id: 'fph9h_w5kQ0' },
        { title: 'اعتراف نفسي', id: 'iohCJ5WqiI8' },
        { title: 'تتذكر', id: 'Rd8YaaRIqGs' },
        { title: 'اشتقتلي', id: 'dho_69-1BJM' },
        { title: 'راضي بكلشي صار', id: 'e3R9XXpmsEM' },
        { title: 'ايزي', id: '80egFQLQ6PM' }
    ];

    const VOLUME_KEY = 'moudy-music-volume';
    const MUTE_KEY = 'moudy-music-muted';

    let volume = 25;
    let isMuted = false;
    let currentSong = SONGS[Math.floor(Math.random() * SONGS.length)];
    let ytPlayer = null;
    let ytReady = false;
    let wantPlay = false;

    try {
        const v = parseInt(localStorage.getItem(VOLUME_KEY) || '25', 10);
        if (!isNaN(v) && v >= 0 && v <= 100) volume = v;
        isMuted = localStorage.getItem(MUTE_KEY) === '1';
    } catch (e) {}

    /* ---------- حاوية YouTube ---------- */
    let ytContainer = document.getElementById('globalYtPlayer');
    if (!ytContainer) {
        ytContainer = document.createElement('div');
        ytContainer.id = 'globalYtPlayer';
        /* مهم: مش مخفي تماماً — YouTube API بتحتاج العنصر يكون مرئي */
        ytContainer.style.cssText = 'position:fixed;bottom:0;right:0;width:10px;height:10px;opacity:0.01;pointer-events:none;z-index:-1;overflow:hidden;';
        document.body.appendChild(ytContainer);
    }

    /* ---------- الزر العائم ---------- */
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'music-toggle';
    toggleBtn.setAttribute('aria-label', 'الموسيقى');
    document.body.appendChild(toggleBtn);

    /* ---------- اللوحة ---------- */
    const panel = document.createElement('div');
    panel.className = 'music-panel';
    panel.innerHTML =
        '<div class="music-panel-header">' +
            '<span class="music-panel-title">🎵 الموسيقى</span>' +
            '<button class="music-panel-close" type="button">✕</button>' +
        '</div>' +
        '<div class="music-song-name" id="musicSongName">—</div>' +
        '<div class="music-volume-row">' +
            '<span class="music-volume-icon" id="musicVolIcon">🔊</span>' +
            '<input type="range" class="music-volume" id="musicVolume" min="0" max="100" value="' + volume + '">' +
            '<span class="music-volume-value" id="musicVolValue">' + volume + '%</span>' +
        '</div>' +
        '<div class="music-mute-row">' +
            '<button class="music-mute-btn" id="musicMuteBtn" type="button">🔇 كتم</button>' +
        '</div>';
    document.body.appendChild(panel);

    const pEl = {
        songName: panel.querySelector('#musicSongName'),
        volume:   panel.querySelector('#musicVolume'),
        volValue: panel.querySelector('#musicVolValue'),
        volIcon:  panel.querySelector('#musicVolIcon'),
        muteBtn:  panel.querySelector('#musicMuteBtn'),
        close:    panel.querySelector('.music-panel-close')
    };

    /* ---------- دوال ---------- */
    function updateVolumeBar() {
        pEl.volume.style.setProperty('--vol', volume + '%');
    }

    function updateButtonIcon() {
        if (isMuted || volume === 0) {
            toggleBtn.textContent = '🔇';
            toggleBtn.classList.add('muted');
            toggleBtn.classList.remove('playing');
        } else {
            toggleBtn.textContent = '🎵';
            toggleBtn.classList.remove('muted');
            toggleBtn.classList.add('playing');
        }
        updateVolumeBar();
        pEl.volValue.textContent = volume + '%';

        if (volume === 0) pEl.volIcon.textContent = '🔇';
        else if (volume < 40) pEl.volIcon.textContent = '🔉';
        else pEl.volIcon.textContent = '🔊';

        pEl.muteBtn.classList.toggle('muted', isMuted);
        pEl.muteBtn.textContent = isMuted ? '🔊 فتح' : '🔇 كتم';
    }

    /* ✅ أهم دالة — تطبيق الصوت على YouTube */
    function applyVolume() {
        if (!ytPlayer) return;

        const targetVol = isMuted ? 0 : volume;
        console.log('[Music] applyVolume:', targetVol, 'muted:', isMuted);

        try {
            /* إذا muted → استخدم mute() */
            if (isMuted) {
                if (typeof ytPlayer.mute === 'function') ytPlayer.mute();
            } else {
                if (typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
            }

            /* طبّق الصوت */
            if (typeof ytPlayer.setVolume === 'function') {
                ytPlayer.setVolume(targetVol);
            }
        } catch (e) {
            console.warn('[Music] خطأ:', e);
        }
    }

    function tryPlay() {
        if (!ytPlayer || typeof ytPlayer.playVideo !== 'function') return;
        wantPlay = true;
        try {
            applyVolume();
            ytPlayer.playVideo();
        } catch (e) {}
    }

    /* ---------- زر التبديل ---------- */
    let panelOpen = false;

    function togglePanel() {
        panelOpen = !panelOpen;
        panel.classList.toggle('show', panelOpen);
        if (panelOpen) pEl.songName.textContent = currentSong.title;
    }

    toggleBtn.addEventListener('click', togglePanel);
    pEl.close.addEventListener('click', function () {
        panelOpen = false;
        panel.classList.remove('show');
    });

    document.addEventListener('click', function (e) {
        if (!panelOpen) return;
        if (panel.contains(e.target)) return;
        if (e.target === toggleBtn) return;
        panelOpen = false;
        panel.classList.remove('show');
    });

    /* ---------- التحكم بالصوت ---------- */
    pEl.volume.addEventListener('input', function () {
        volume = parseInt(pEl.volume.value, 10);

        /* إذا رفع الصوت → الغِ الكتم */
        if (volume > 0 && isMuted) isMuted = false;

        try {
            localStorage.setItem(VOLUME_KEY, String(volume));
            localStorage.setItem(MUTE_KEY, isMuted ? '1' : '0');
        } catch (e) {}

        applyVolume();
        updateButtonIcon();
    });

    pEl.muteBtn.addEventListener('click', function () {
        isMuted = !isMuted;
        try { localStorage.setItem(MUTE_KEY, isMuted ? '1' : '0'); } catch (e) {}

        applyVolume();

        /* إذا فتح الكتم → شغّل */
        if (!isMuted && wantPlay && ytPlayer && typeof ytPlayer.playVideo === 'function') {
            try { ytPlayer.playVideo(); } catch (e) {}
        }

        updateButtonIcon();
    });

    /* ---------- YouTube API ---------- */
    function createPlayer() {
        if (ytPlayer) return;

        console.log('[Music] جاري إنشاء YouTube Player');

        ytPlayer = new YT.Player(ytContainer, {
            height: '10',
            width: '10',
            videoId: currentSong.id,
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                rel: 0,
                playsinline: 1
            },
            events: {
                'onReady': function (e) {
                    ytReady = true;
                    console.log('[Music] Player Ready ✅');

                    /* ✅ شغّل الأغنية الحالية */
                    try {
                        /* ابدأ بالكتم ثم افتح (بعض المتصفحات تطلب كذا) */
                        e.target.mute();
                        e.target.setVolume(isMuted ? 0 : volume);

                        /* إذا بدنا نشغل → شغل بعدين افتح */
                        if (wantPlay) {
                            e.target.playVideo();
                            setTimeout(function () {
                                if (!isMuted) e.target.unMute();
                                e.target.setVolume(isMuted ? 0 : volume);
                            }, 400);
                        }
                    } catch (err) {
                        console.warn('[Music] onReady خطأ:', err);
                    }

                    pEl.songName.textContent = currentSong.title;
                },
                'onStateChange': function (e) {
                    if (typeof YT === 'undefined') return;
                    console.log('[Music] State:', e.data);

                    /* شغّل → طبّق الصوت مرة تانية */
                    if (e.data === YT.PlayerState.PLAYING) {
                        applyVolume();
                        try {
                            const data = ytPlayer.getVideoData();
                            if (data && data.video_id) {
                                const found = SONGS.find(function (s) { return s.id === data.video_id; });
                                if (found) currentSong = found;
                            }
                        } catch (err) {}
                        pEl.songName.textContent = currentSong.title;
                    }

                    /* خلصت → التالية */
                    if (e.data === YT.PlayerState.ENDED) {
                        currentSong = SONGS[Math.floor(Math.random() * SONGS.length)];
                        pEl.songName.textContent = currentSong.title;
                        try {
                            ytPlayer.loadVideoById(currentSong.id);
                            setTimeout(function () {
                                applyVolume();
                                if (!isMuted) ytPlayer.unMute();
                            }, 300);
                        } catch (err) {}
                    }
                }
            }
        });
    }

    /* ---------- استنى API ---------- */
    if (typeof YT !== 'undefined' && YT.Player) {
        createPlayer();
    } else {
        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
            const s = document.createElement('script');
            s.src = 'https://www.youtube.com/iframe_api';
            document.head.appendChild(s);
        }
        const oldReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = function () {
            if (typeof oldReady === 'function') oldReady();
            createPlayer();
        };
    }

    /* ---------- أول تفاعل ---------- */
    function firstInteraction() {
        wantPlay = true;
        tryPlay();
        document.removeEventListener('click', firstInteraction);
        document.removeEventListener('touchstart', firstInteraction);
        document.removeEventListener('keydown', firstInteraction);
    }
    document.addEventListener('click', firstInteraction);
    document.addEventListener('touchstart', firstInteraction);
    document.addEventListener('keydown', firstInteraction);

    /* ---------- التهيئة ---------- */
    updateButtonIcon();
    updateVolumeBar();
})();









/* ==================================================================
   قسم: رتّب الكلمات (scramble.html)
   ================================================================== */
   (function initScramble() {
    const pool = document.getElementById('scrPool');
    if (!pool) return;

    /* ---------- البيانات ---------- */
    const DATA = {
        easy: {
            time: 45,
            pick: 8,
            questions: [
                { song: 'مصاب', words: ['جرحت', 'أيدي', 'بدي', 'كون', 'مصاب'] },
                { song: 'تهديد', words: ['قدام', 'العالم', 'بصريح', 'العبارة'] },
                { song: 'تصفية حساب', words: ['لست', 'بقاتل', 'بل', 'صانع', 'سلام'] },
                { song: 'فلسفة', words: ['الغنى', 'بالغربة', 'وطن', 'والفقر', 'بالوطن', 'غربة'] },
                { song: 'صراع نفسي', words: ['حياة', 'كل', 'انسان', 'عبارة', 'عن', 'كتاب'] },
                { song: 'نص الليل', words: ['بطفي', 'الضو', 'لتحكي', 'العتمه'] },
                { song: 'كارما', words: ['تاركها', 'بكرى', 'الكارما', 'بتربيها'] },
                { song: 'يا صبر الله', words: ['لما', 'بيغيب', 'السبع', 'بتفلت', 'الضباع'] },
                { song: 'الأرض السعيدة', words: ['الكلاب', 'تعوي', 'والقافلة', 'تسير'] },
                { song: 'امشي', words: ['امن', 'بنفسك', 'رح', 'ترفع', 'ايمانك'] },
                { song: 'اعتراف نفسي', words: ['لست', 'أخاف', 'أياماً', 'عصيبه'] },
                { song: 'طمنيني', words: ['بكون', 'كذاب', 'لو', 'ما', 'قلت'] },
                { song: 'مصاب', words: ['الدنية', 'درس', 'أنا', 'بكتب'] },
                { song: 'الغُربة', words: ['فين', 'نرجع', 'لبلادي', 'ومسروقه'] },
                { song: 'وسط النيل', words: ['الرصاصة', 'اخرا', 'رح', 'تصيب'] }
            ]
        },
        medium: {
            time: 35,
            pick: 10,
            questions: [
                { song: 'روليكس', words: ['نت', 'متل', 'الساعة', 'الروليكس', 'لكنك', 'فيك'] },
                { song: 'تصفية حساب', words: ['مافي', 'حدا', 'يحاسبني', 'مافي', 'حدا', 'يجابهني'] },
                { song: 'نفس الاعتراف', words: ['بنيت', 'البناء', 'وانهد', 'بنائي', 'وطال', 'المُحال'] },
                { song: 'اعتراف نفسي', words: ['الخوف', 'من', 'غدواً', 'يكون', 'مُساوم'] },
                { song: 'خطاف', words: ['الطف', 'فيني', 'يا', 'خافي', 'الالطاااف'] },
                { song: 'الغُربة', words: ['انت', 'الباطل', 'لو', 'عالحق', 'مابيظهر', 'بالصورة'] },
                { song: 'تسع ساعات', words: ['اكتر', 'إنسان', 'مكروه', 'اللي', 'قال', 'الحقيقة'] },
                { song: 'الحبيبة', words: ['ربي', 'ياربي', 'تحفظها', 'ليا', 'تحميها', 'فيا'] },
                { song: 'زهايمر', words: ['شكلو', 'زهايمر', 'نسيتي', 'بعدك', 'بالأرض'] },
                { song: 'طريق الخراب', words: ['مهما', 'حاولتو', 'تسكتونا', 'مابتسكتونا'] },
                { song: 'مانو معاشر', words: ['أنا', 'الكائن', 'يلي', 'صمد', 'وبآمن', 'برب'] },
                { song: 'جرح فينا', words: ['مستقبل', 'مابيسئل', 'عالطريق', 'اللي', 'جيتو'] },
                { song: 'إدمانٌ مؤبد', words: ['أصبحتُ', 'مريض', 'المرض', 'سيُنشر'] }
            ]
        },
        hard: {
            time: 25,
            pick: 12,
            questions: [
                { song: 'طمنيني', words: ['بكون', 'كذاب', 'لو', 'ما', 'قلت', 'اني', 'مشتاق', 'امي'] },
                { song: 'ماني شايف', words: ['صوت', 'الماضي', 'فينا', 'عايش', 'رح', 'أوقع', 'ماني', 'شايف'] },
                { song: 'جرح فينا', words: ['مستقبل', 'مابيسئل', 'عالطريق', 'اللي', 'جيتو', 'طريقو', 'يوديك'] },
                { song: 'تشكيل عصابي', words: ['لو', 'بدو', 'حُبك', 'تشكيل', 'عصابه', 'اعتبري', 'شكلتا'] },
                { song: 'باب شرقي', words: ['باب', 'شرقي', 'الحاره', 'نصيحه', 'بناقه', 'مافي', 'شماعه'] },
                { song: 'خطاف', words: ['حفر', 'الطوب', 'بمعالق', 'نفق', 'يحررني', 'سالك', 'لاقطع', 'السوور'] },
                { song: 'غرناطة', words: ['نفوسنا', 'اقبح', 'من', 'حقد', 'المجوس', 'وعفنٍ', 'يطفح'] },
                { song: 'إدمانٌ مؤبد', words: ['أدمانٌ', 'مؤبد', 'خُلِقتُ', 'لأصنع', 'المُستحيل'] },
                { song: 'مسرحية', words: ['كلنا', 'ممثلين', 'و', 'الدور', 'ورقة'] },
                { song: 'بفوضى', words: ['الدنيا', 'والكذب', 'كالنقش', 'والطوب'] },
                { song: 'مانو معاشر', words: ['شخصيات', 'البشر', 'جوا', 'نفوسن', 'ظاهر', 'مرض'] },
                { song: 'نفس الاعتراف', words: ['نرتدي', 'الياقوت', 'ونبني', 'قواعد'] },
                { song: 'غرناطة', words: ['يا', 'أمه', 'لا', 'تقوى', 'بلا', 'سلاح', 'السماح'] },
                { song: 'تهديد', words: ['فالخلف', 'قد', 'أنفع', 'وسميَ', 'سم'] },
                { song: 'الأرض السعيدة', words: ['دس', 'من', 'السحاب', 'طلعو', 'درويش'] },
                { song: 'طريق الخراب', words: ['مهما', 'حاولتو', 'تحبسونا', 'مابتجيبونا'] }
            ]
        }
    };

    /* ---------- العناصر ---------- */
    const el = {
        start:      document.getElementById('scrStart'),
        play:       document.getElementById('scrPlay'),
        end:        document.getElementById('scrEnd'),
        qNum:       document.getElementById('scrQNum'),
        score:      document.getElementById('scrScore'),
        timer:      document.getElementById('scrTimer'),
        timerBox:   document.getElementById('scrTimerBox'),
        songName:   document.getElementById('scrSongName'),
        answer:     document.getElementById('scrAnswer'),
        placeholder:document.getElementById('scrPlaceholder'),
        pool:       document.getElementById('scrPool'),
        check:      document.getElementById('scrCheck'),
        reset:      document.getElementById('scrReset'),
        feedback:   document.getElementById('scrFeedback'),
        back:       document.getElementById('scrBack'),
        endIcon:    document.getElementById('scrEndIcon'),
        endTitle:   document.getElementById('scrEndTitle'),
        endStats:   document.getElementById('scrEndStats'),
        again:      document.getElementById('scrAgain'),
        endBack:    document.getElementById('scrEndBack')
    };

    /* ---------- الحالة ---------- */
    const state = {
        level: null,
        queue: [],
        index: 0,
        score: 0,
        timerId: null,
        timeLeft: 0,
        locked: false,
        currentAnswer: [],  /* الكلمات بالترتيب الحالي */
        correctWords: []     /* الترتيب الصحيح */
    };

    /* ---------- أدوات ---------- */
    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    /* تحويل الإيموجي → Twemoji */
    function renderEmoji(str) {
        if (typeof twemoji !== 'undefined') {
            return twemoji.parse(str, { folder: 'svg', ext: '.svg' });
        }
        return str;
    }

    /* ---------- بدء مستوى ---------- */
    function startLevel(levelKey) {
        const cfg = DATA[levelKey];
        if (!cfg) return;
            if (window.moudyChallenge) window.moudyChallenge.trackGame('scramble');

        clearInterval(state.timerId);

        state.level = levelKey;
        state.score = 0;
        state.index = 0;
        state.locked = false;
        state.queue = shuffle(cfg.questions).slice(0, cfg.pick);

        el.start.hidden = true;
        el.end.hidden = true;
        el.play.hidden = false;

        el.score.textContent = '0';
        el.feedback.textContent = '';
        el.feedback.className = 'scr-feedback';

        showQuestion();
    }

    /* ---------- عرض سؤال ---------- */
    function showQuestion() {
        const cfg = DATA[state.level];
        const q = state.queue[state.index];
        if (!q) { endGame(); return; }

        /* HUD */
        el.qNum.textContent = (state.index + 1) + ' / ' + cfg.pick;
        el.songName.textContent = q.song;

        /* الترتيب الصحيح */
        state.correctWords = q.words.slice();
        state.currentAnswer = [];

        /* جهّز الكلمات المبعثرة */
        let scrambled = shuffle(q.words);
        /* لو طلع نفس الترتيب → أعد الخلط */
        let attempts = 0;
        while (arraysEqual(scrambled, q.words) && attempts < 20) {
            scrambled = shuffle(q.words);
            attempts++;
        }

        el.pool.innerHTML = '';
        scrambled.forEach(function (word, i) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'scr-word pool';
            btn.textContent = word;
            btn.dataset.word = word;
            btn.dataset.poolIndex = i;
            btn.addEventListener('click', function () { moveToAnswer(btn); });
            el.pool.appendChild(btn);
        });

        /* صفّر منطقة الإجابة */
        el.answer.innerHTML = '<span class="scr-placeholder" id="scrPlaceholder">الكلمات المرتبة تظهر هنا</span>';
        el.answer.classList.remove('filled', 'correct', 'wrong');

        /* الأزرار */
        el.check.disabled = true;
        el.check.style.opacity = '0.4';

        /* feedback */
        el.feedback.textContent = '';
        el.feedback.className = 'scr-feedback';

        /* المؤقّت */
        state.timeLeft = cfg.time;
        el.timer.textContent = state.timeLeft;
        el.timerBox.classList.remove('warning', 'danger');
        state.locked = false;
        startTimer();
    }

    /* ---------- نقل كلمة لمنطقة الإجابة ---------- */
    function moveToAnswer(btn) {
        if (state.locked) return;

        const word = btn.dataset.word;
        state.currentAnswer.push(word);

        /* أضف كلمة لمنطقة الإجابة */
        const answerBtn = document.createElement('button');
        answerBtn.type = 'button';
        answerBtn.className = 'scr-word answer';
        answerBtn.textContent = word;
        answerBtn.dataset.word = word;
        answerBtn.addEventListener('click', function () { moveToPool(answerBtn); });

        /* شيل placeholder */
        const ph = el.answer.querySelector('.scr-placeholder');
        if (ph) ph.remove();

        el.answer.appendChild(answerBtn);
        el.answer.classList.add('filled');
        el.answer.classList.remove('correct', 'wrong');

        /* احذف كلمة من البعثرة */
        btn.remove();

        /* فعّل زر تحقق */
        updateCheckBtn();
    }

    /* ---------- رجوع كلمة للبعثرة ---------- */
    function moveToPool(btn) {
        if (state.locked) return;

        const word = btn.dataset.word;

        /* احذف من currentAnswer */
        const idx = state.currentAnswer.indexOf(word);
        if (idx !== -1) state.currentAnswer.splice(idx, 1);

        /* رجّع للبعثرة */
        const poolBtn = document.createElement('button');
        poolBtn.type = 'button';
        poolBtn.className = 'scr-word pool';
        poolBtn.textContent = word;
        poolBtn.dataset.word = word;
        poolBtn.addEventListener('click', function () { moveToAnswer(poolBtn); });
        el.pool.appendChild(poolBtn);

        /* احذف من منطقة الإجابة */
        btn.remove();

        /* إذا المنطقة صارت فاضية → رجّع placeholder */
        if (el.answer.querySelectorAll('.scr-word').length === 0) {
            el.answer.innerHTML = '<span class="scr-placeholder">الكلمات المرتبة تظهر هنا</span>';
            el.answer.classList.remove('filled');
        }

        el.answer.classList.remove('correct', 'wrong');
        updateCheckBtn();
    }

    /* ---------- تفعيل/تعطيل زر التحقق ---------- */
    function updateCheckBtn() {
        const allWordsUsed = state.currentAnswer.length === state.correctWords.length;
        el.check.disabled = !allWordsUsed;
        el.check.style.opacity = allWordsUsed ? '1' : '0.4';
    }

    /* ---------- التحقق من الإجابة ---------- */
    function checkAnswer() {
        if (state.locked) return;
        if (state.currentAnswer.length !== state.correctWords.length) return;

        state.locked = true;
        clearInterval(state.timerId);

        const isCorrect = arraysEqual(state.currentAnswer, state.correctWords);

        if (isCorrect) {
            /* ✅ صح */
            const timeBonus = Math.max(0, state.timeLeft) * 2;
            state.score += 100 + timeBonus;
            el.score.textContent = state.score;

            el.answer.classList.add('correct');
            el.feedback.innerHTML = '✅ صح! <span class="scr-feedback-hint">+' + (100 + timeBonus) + ' نقطة</span>';
            el.feedback.className = 'scr-feedback ok';

            setTimeout(nextQuestion, 1400);
        } else {
            /* ❌ غلط → ابيّن الجواب الصح */
            el.answer.classList.add('wrong');
            const correctStr = state.correctWords.join(' ');
            el.feedback.innerHTML = '❌ الترتيب الصح:<br><span class="scr-feedback-hint" style="color:#fff;font-size:1rem;font-weight:800;">' + correctStr + '</span>';
            el.feedback.className = 'scr-feedback fail';

            setTimeout(nextQuestion, 2800);
        }
    }

    /* ---------- إعادة ترتيب ---------- */
    function resetQuestion() {
        if (state.locked) return;

        /* رجّع كل الكلمات من الإجابة للبعثرة */
        const answerBtns = el.answer.querySelectorAll('.scr-word');
        answerBtns.forEach(function (btn) {
            const word = btn.dataset.word;
            const poolBtn = document.createElement('button');
            poolBtn.type = 'button';
            poolBtn.className = 'scr-word pool';
            poolBtn.textContent = word;
            poolBtn.dataset.word = word;
            poolBtn.addEventListener('click', function () { moveToAnswer(poolBtn); });
            el.pool.appendChild(poolBtn);
            btn.remove();
        });

        /* أعد خلط البعثرة */
        const poolBtns = Array.from(el.pool.querySelectorAll('.scr-word'));
        const words = poolBtns.map(function (b) { return b.dataset.word; });
        const shuffled = shuffle(words);

        el.pool.innerHTML = '';
        shuffled.forEach(function (w) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'scr-word pool';
            btn.textContent = w;
            btn.dataset.word = w;
            btn.addEventListener('click', function () { moveToAnswer(btn); });
            el.pool.appendChild(btn);
        });

        /* رجّع placeholder */
        el.answer.innerHTML = '<span class="scr-placeholder">الكلمات المرتبة تظهر هنا</span>';
        el.answer.classList.remove('filled', 'correct', 'wrong');
        state.currentAnswer = [];
        updateCheckBtn();

        el.feedback.textContent = '';
        el.feedback.className = 'scr-feedback';
    }

    /* ---------- المؤقّت ---------- */
    function startTimer() {
        clearInterval(state.timerId);
        state.timerId = setInterval(function () {
            state.timeLeft--;
            el.timer.textContent = state.timeLeft;

            if (state.timeLeft <= 5) {
                el.timerBox.classList.remove('warning');
                el.timerBox.classList.add('danger');
            } else if (state.timeLeft <= 10) {
                el.timerBox.classList.add('warning');
            }

            if (state.timeLeft <= 0) {
                clearInterval(state.timerId);
                handleTimeout();
            }
        }, 1000);
    }

    /* ---------- انتهى الوقت ---------- */
    function handleTimeout() {
        if (state.locked) return;
        state.locked = true;

        el.answer.classList.add('wrong');
        const correctStr = state.correctWords.join(' ');
        el.feedback.innerHTML = '⏰ خلص الوقت!<br><span class="scr-feedback-hint" style="color:#fff;font-size:1rem;font-weight:800;">' + correctStr + '</span>';
        el.feedback.className = 'scr-feedback fail';

        setTimeout(nextQuestion, 2800);
    }

    /* ---------- السؤال التالي ---------- */
    function nextQuestion() {
        state.index++;
        const cfg = DATA[state.level];
        if (state.index >= cfg.pick) {
            endGame();
        } else {
            showQuestion();
        }
    }

    /* ---------- نهاية اللعبة ---------- */
    function endGame() {
        clearInterval(state.timerId);
        el.play.hidden = true;
        el.end.hidden = false;

        const cfg = DATA[state.level];
        const maxScore = cfg.pick * 100;
        const percent = Math.min(100, Math.round((state.score / maxScore) * 100));

        let icon, title;
        if (percent >= 90)      { icon = '🏆'; title = 'أسطورة!'; }
        else if (percent >= 70) { icon = '🥇'; title = 'ممتاز!'; }
        else if (percent >= 50) { icon = '🥈'; title = 'جيد جداً!'; }
        else if (percent >= 30) { icon = '🥉'; title = 'كويس!'; }
        else                    { icon = '😅'; title = 'حاول مرة تانية'; }

        el.end.classList.remove('lose');
        if (percent < 30) el.end.classList.add('lose');

        el.endIcon.textContent = icon;
        el.endTitle.textContent = title;
        el.endStats.innerHTML =
            'النقاط: <strong>' + state.score + '</strong><br>' +
            'النسبة: <strong>' + percent + '%</strong>';

        /* إيموجي */
        if (typeof twemoji !== 'undefined') {
            twemoji.parse(el.endIcon);
            twemoji.parse(el.endTitle);
        }
/* ⭐ نظام النقاط */
var pointsMap = { easy: 50, medium: 100, hard: 150 };
var basePoints = pointsMap[state.level] || 50;
if (window.moudyPoints) {
    window.moudyPoints.add(basePoints, '🎼 رتّب الكلمات');

}
    }

    /* ---------- رجوع ---------- */
    function backToLevels() {
        clearInterval(state.timerId);
        state.locked = false;
        el.play.hidden = true;
        el.end.hidden = true;
        el.start.hidden = false;
        window.scrollTo(0, 0);
    }

    /* ---------- ربط الأحداث ---------- */
    document.querySelectorAll('#scrStart .level-card').forEach(function (btn) {
        btn.addEventListener('click', function () { startLevel(btn.dataset.level); });
    });
    el.check.addEventListener('click', checkAnswer);
    el.reset.addEventListener('click', resetQuestion);
    el.back.addEventListener('click', backToLevels);
    el.endBack.addEventListener('click', backToLevels);
    el.again.addEventListener('click', function () { startLevel(state.level); });

    /* Twemoji */
    if (typeof twemoji !== 'undefined') {
        twemoji.parse(document.body);
    }
})();






/* ==================================================================
   قسم: خمّن من الكلمات (guess.html)
   ================================================================== */
   (function initGuessLyrics() {
    const lyrics = document.getElementById('guessLyrics');
    if (!lyrics) return;

    /* ---------- 🎯 البيانات — 20 سؤال لكل مستوى (بيتنوعوا كل مرة) ---------- */
    const DATA = {
        easy: {
            time: 15,
            pick: 12,
            questions: [
                { line: 'نت متل الساعة الروليكس\nلكنك فيك', answer: 'روليكس', wrong: ['نوبة', 'كارما', 'تروما'], id: 'wX6Kt90z-eM' },
                { line: 'جرحت أيدي بدي كون مصاب\nماعاد فيني تلفت الأعصاب', answer: 'مصاب', wrong: ['مسلول', 'مونستر', 'ميت 2'], id: 'lRawQ3TGnTM' },
                { line: 'قدام العالم بصريح العبارة\nهاد اسمو تهديد', answer: 'تهديد', wrong: ['تحذير', 'وعيد', 'كلام'], id: 'p7yevyd3pI8' },
                { line: 'الكلاب تعوي والقافلة تسير\nبس اوقات في كلاب بتجبرك', answer: 'الأرض السعيدة', wrong: ['طريق الخراب', 'الغُربة', 'بفوضى'], id: 'wyKXeeIeYHg' },
                { line: 'شكلو زهايمر نسيتي\nبعدك بالأرض', answer: 'زهايمر', wrong: ['نساني', 'نسيتا', 'تتذكر'], id: 'ZRj9gQGYo-I' },
                { line: 'بطفي الضو لتحكي العتمه\nواقنع حالي اني نايم فاتح عين', answer: 'نص الليل', wrong: ['الطير', 'خطاف', 'نجم ليل'], id: 'Jb_fQCaQpBA' },
                { line: 'تاركها بكرى الكارما بتربيها\nبكرى الدنيا بتصحيها', answer: 'كارما', wrong: ['نساني', 'تركتا', 'غلط'], id: 'm4Hz03O9MJ4' },
                { line: 'لما بيغيب السبع بتفلت الضباع\nهبوط اضطراري', answer: 'يا صبر الله', wrong: ['مسلمين وكفار', '7 طلقات', '14 ونص'], id: 'Zpu7Iy12CjM' },
                { line: 'لو جاي في رجوع نساني\nشوفلك موضوع تاني', answer: 'نساني', wrong: ['تركتا', 'نسيتا', 'غلط'], id: '2Z-Glm-sEdQ' },
                { line: 'امن بنفسك رح ترفع ايمانك\nحارب لتبقى', answer: 'امشي', wrong: ['كفاحي', 'قد التحدي', 'فلسفة'], id: 'DAeBhOvDgwo' },
                { line: 'حياة كل انسان هي عبارة عن كتاب\nاله صفحات كتيره ما بتخلص', answer: 'صراع نفسي', wrong: ['اعتراف نفسي', 'فلسفة', 'ميت 2'], id: 'h_-zk23w5co' },
                { line: 'في جرح فينا في الم في هرم\nفي تعب سيطر علينا', answer: 'جرح فينا', wrong: ['تروما', 'مصاب', 'تسع ساعات'], id: 'Ou8e9zvoS0E' },
                { line: 'بكون كذاب لو ما قلت اني مشتاق امي\nكتير فراق وانا تعبت', answer: 'طمنيني', wrong: ['اشتقتلي', 'نساني', 'الحبيبة'], id: 'gHf5oP7N6iE' },
                { line: 'لست بقاتل بل صانع سلام\nعم اصنع موسيقى بدوافع ما تنافق', answer: 'تصفية حساب', wrong: ['تهديد', 'غلط', 'حكي كتير'], id: 'q0ev9Gb_-6o' },
                { line: 'الغنى بالغربة وطن\nوالفقر بالوطن غربة', answer: 'فلسفة', wrong: ['الغُربة', 'الغربة', 'طريق الخراب'], id: 'fph9h_w5kQ0' },
                { line: 'أمنتُ بنفسي لأنها كانت\nوالآنَ مازالت نفسٌ لا تهاب', answer: 'اعتراف نفسي', wrong: ['صراع نفسي', 'فلسفة', 'نفس الاعتراف'], id: 'iohCJ5WqiI8' },
                { line: 'أنا الكائن يلي صمد\nانا الي بآمن بنفسي بآمن برب صمد', answer: 'مانو معاشر', wrong: ['ميت 2', 'غلط', 'تصفية حساب'], id: 'DG_2LDpGymQ' },
                { line: 'تسع ساعات خلوني اعرف الصعوبة\nاللي توقعتا هية مجرد أمنيات', answer: 'تسع ساعات', wrong: ['7 طلقات', 'دقيقة ونص', '14 ونص'], id: 'T9eKYqcYadY' },
                { line: 'اشحال أيامي كانت كُلها بلاك صعيبه\nاشحال صليت لربي دعيتو تكوني قريبه', answer: 'الحبيبة', wrong: ['اشتقتلي', 'طمنيني', 'نساني'], id: 'hZZY-7xaOH8' },
                { line: 'شحال ايامات صعيبه دوزنا بالغُربه\nاشحال دمعا هبطت اللميما باش نبقا', answer: 'الغُربة', wrong: ['طريق الخراب', 'بفوضى', 'نساني'], id: '3PKBsPmKqVo' }
            ]
        },
        medium: {
            time: 15,
            pick: 12,
            questions: [
                { line: 'الخوفُ من غدواً يكون مُساوم\nطريق النجوم ام تُريد الثروة', answer: 'اعتراف نفسي', wrong: ['فلسفة', 'نفس الاعتراف', 'صراع نفسي'], id: 'iohCJ5WqiI8' },
                { line: 'مافي حدا يحاسبني، مافي حدا يجابهني\nمافي قانون بيلزمني، الله بس وحدو', answer: 'تصفية حساب', wrong: ['تهديد', 'غلط', 'حكي كتير'], id: 'q0ev9Gb_-6o' },
                { line: 'أصبحتُ مريض المرض سيُنشر\nيُباعُ كـ جرعة مُخدر مُلحن', answer: 'إدمانٌ مؤبد', wrong: ['درامادول', 'ميت 2', 'تروما'], id: 'P4G9k4pJL8Q' },
                { line: 'بنيت البناء وانهد بنائي\nوازدادَ عنائي وطال المُحال', answer: 'نفس الاعتراف', wrong: ['اعتراف نفسي', 'صراع نفسي', 'فلسفة'], id: 'ShiGnwQ-3Bw' },
                { line: 'وين حبك لي فيني غاب\nوين الشعر الي فيي شاب', answer: 'زهايمر', wrong: ['نساني', 'نسيتا', 'تتذكر'], id: 'ZRj9gQGYo-I' },
                { line: 'الطف فيني يا خافي الالطاااف\nحارة ليه؟ جيلنا المطحون', answer: 'خطاف', wrong: ['طريق الخراب', 'بفوضى', 'الغُربة'], id: '_k4b66sbm1M' },
                { line: 'كانو هتلر موسليني\nكنت فرنسا اللي غزو فيني', answer: 'باب شرقي', wrong: ['وسط النيل', 'خورفكان', 'غرناطة'], id: 'BWcSa4eOIww' },
                { line: 'انت الباطل لو عالحق\nوالحق مابيظهر بالصورة', answer: 'الغُربة', wrong: ['بفوضى', 'طريق الخراب', 'نساني'], id: '3PKBsPmKqVo' },
                { line: 'الرصاصة اخرا رح تصيب\nوالدهر ما ضحك النا', answer: 'وسط النيل', wrong: ['باب شرقي', 'خورفكان', 'شاهين'], id: '-znwuqLeNhs' },
                { line: 'اكتر إنسان مكروه اللي قال الحقيقة\nبس انا مو بس قلتا انا طبقت الطريقة', answer: 'تسع ساعات', wrong: ['فلسفة', 'حكي كتير', 'صراع نفسي'], id: 'T9eKYqcYadY' },
                { line: 'حكي كتير و كتير لي حكا\nانا آخر همي بريت', answer: 'حكي كتير', wrong: ['غلط', 'تهديد', 'فلسفة'], id: 'AtVpciHqliw' },
                { line: 'زرع الأمل وعاني اطمح ما أغرق بالطمع\nأفرح للغير ما شوف بحسد', answer: 'هلأ عرفت أبي', wrong: ['طمنيني', 'بصارة', 'الحبيبة'], id: 'NEcBVreEck4' },
                { line: 'وعد لو فقتي على حالك رح تندمي\nعلى أيّامي واللّحظات', answer: 'كارما', wrong: ['نساني', 'تركتا', 'غلط'], id: 'm4Hz03O9MJ4' },
                { line: 'والحامي ربك رقبه مابشيلا غير يلي حطا\nقولي لاهلك ابعرق جبيني للشهرا جبتا', answer: 'تشكيل عصابي', wrong: ['روبن مود', 'فيراري', 'روليكس'], id: 'bMczZ4EQHOs' },
                { line: 'بتوعديني انك حتكوني حصني\nقارب نجات سفينتي لحتى كمل حربي', answer: 'توعديني', wrong: ['اشتقتلي', 'الحبيبة', 'طمنيني'], id: '0XiU3O6wEnU' },
                { line: 'ربي ياربي تحفظها ليا تخليها ليا\nتحميها فيا', answer: 'الحبيبة', wrong: ['اشتقتلي', 'طمنيني', 'توعديني'], id: 'hZZY-7xaOH8' },
                { line: 'صوت الماضي فينا عايش فكرت رح أوقع ماني شايف\nمتل أعمى بالطريق', answer: 'ماني شايف', wrong: ['نساني', 'نسيتا', 'تركتا'], id: 'vKPFbhv7eqo' },
                { line: 'مهما حاولتو تسكتونا مابتسكتونا\nمهما حاولتو تغيرونا مابتغيرونا', answer: 'طريق الخراب', wrong: ['بفوضى', 'الغُربة', 'امشي'], id: '0LPay99iPyM' },
                { line: 'كل ما زاد عمري يوم زاد التفكير\nعد هموم قل النوم', answer: 'خطاف', wrong: ['تسع ساعات', 'نص الليل', 'ميت 2'], id: '_k4b66sbm1M' },
                { line: 'شحال ايامات صعيبه دوزنا بالغُربه\nعينين حزينه وحقوق تكالو', answer: 'الغُربة', wrong: ['بفوضى', 'طريق الخراب', 'نساني'], id: '3PKBsPmKqVo' }
            ]
        },
        hard: {
            time: 15,
            pick: 12,
            questions: [
                { line: 'نفوسنا اقبح من حقد المجوس\nوعفنٍ يطفح', answer: 'غرناطة', wrong: ['باب شرقي', 'وسط النيل', 'خورفكان'], id: 'yLjbZKaTeBg' },
                { line: 'أدمانٌ مؤبد خُلِقتُ لأصنع المُستحيل\nأدمانٌ مؤبد لأني سأبقى جبل لا يميل', answer: 'إدمانٌ مؤبد', wrong: ['درامادول', 'ميت 2', 'تروما'], id: 'P4G9k4pJL8Q' },
                { line: 'كلنا ممثلين و الدور ورقة\nتلميع اسطورا ما في حدا صادق أبد', answer: 'مسرحية', wrong: ['فلسفة', 'حكي كتير', 'تهديد'], id: 'A0-L2t4RIkM' },
                { line: 'فالخلف قد أنفع، وسميَ سم\nجسد ذليل عـُ مقه أعضائي', answer: 'تهديد', wrong: ['تصفية حساب', 'غلط', 'حكي كتير'], id: 'p7yevyd3pI8' },
                { line: 'الدنيا والكذب كالنقش والطوب\nفيا بتضلك تحارب لتربح لتبقى', answer: 'بفوضى', wrong: ['طريق الخراب', 'الغُربة', 'نساني'], id: 'EGiz1aAtbBI' },
                { line: 'الزمن غرقني بزورق لحالي\nمع شمت مخدر في عالم خيالي', answer: 'بفوضى', wrong: ['درامادول', 'إدمانٌ مؤبد', 'ميت 2'], id: 'EGiz1aAtbBI' },
                { line: 'مستقبل مابيسئل عالطريق اللي جيتو\nالمهم طريقو يوديك', answer: 'جرح فينا', wrong: ['صراع نفسي', 'تسع ساعات', 'فلسفة'], id: 'Ou8e9zvoS0E' },
                { line: 'لو بدو حُبك تشكيل عصابه اعتبري شكلتا\nوالحامي ربك رقبه مابشيلا غير يلي حطا', answer: 'تشكيل عصابي', wrong: ['روبن مود', 'فيراري', 'روليكس'], id: 'bMczZ4EQHOs' },
                { line: 'باب شرقي الحاره نصيحه بناقه مافي شماعه\nعقرب ساعه فنان الصاغه', answer: 'باب شرقي', wrong: ['وسط النيل', 'خورفكان', 'غرناطة'], id: 'BWcSa4eOIww' },
                { line: 'حفر الطوب بمعالق نفق يحررني\nسالك لاقطع السوور', answer: 'خطاف', wrong: ['بفوضى', 'الغُربة', 'طريق الخراب'], id: '_k4b66sbm1M' },
                { line: 'أنا الكائن يلي صمد انا الي بآمن بنفسي\nبآمن برب صمد', answer: 'مانو معاشر', wrong: ['ميت 2', 'غلط', 'تصفية حساب'], id: 'DG_2LDpGymQ' },
                { line: 'شخصيات البشر جوا نفوسن ظاهر مرض\nلكن كل الغرض من تنكير احكي فشواه', answer: 'مانو معاشر', wrong: ['ميت 2', 'غلط', 'درامادول'], id: 'DG_2LDpGymQ' },
                { line: 'نرتدي الياقوت ونبني قواعد\nسامع فيني ولا مانك لامح', answer: 'نفس الاعتراف', wrong: ['اعتراف نفسي', 'صراع نفسي', 'فلسفة'], id: 'ShiGnwQ-3Bw' },
                { line: 'يا أمه لا تقوى بِلا ماتقوى سلاح السماح\nايامُ العجاف ماذالت مُمتدا', answer: 'غرناطة', wrong: ['باب شرقي', 'وسط النيل', 'خورفكان'], id: 'yLjbZKaTeBg' },
                { line: 'فين نرجع لبلادي وبلادي مسروقه\nماتلقانا غير فالتحت', answer: 'الغُربة', wrong: ['بفوضى', 'طريق الخراب', 'نساني'], id: '3PKBsPmKqVo' },
                { line: 'أقتله وأصنع من دمه وقود\nاستشرس تمرد كُن مثلي مغلول', answer: 'إدمانٌ مؤبد', wrong: ['درامادول', 'ميت 2', 'تروما'], id: 'P4G9k4pJL8Q' },
                { line: 'عالمي مُنسى لأني ضريرٌ ولستُ مضرور\nعالمي مُنسى لأني في قلبِك كـالنقش محفور', answer: 'تهديد', wrong: ['تصفية حساب', 'غلط', 'حكي كتير'], id: 'p7yevyd3pI8' },
                { line: 'غريق جوات المُثلث المُدعى حياة\nبكوكب سفيق سجين بداخل مداخل', answer: 'إدمانٌ مؤبد', wrong: ['ميت 2', 'درامادول', 'بفوضى'], id: 'P4G9k4pJL8Q' },
                { line: 'من عُمق الصِراع مع نكران القطت\nأدنيتُ شموخي دعستُ المُنخفض', answer: 'إدمانٌ مؤبد', wrong: ['صراع نفسي', 'فلسفة', 'ميت 2'], id: 'P4G9k4pJL8Q' },
                { line: 'ايام الدنيه فانيه انا يوم الساعه باينه\nانا متل السفرا دايمه', answer: 'غرناطة', wrong: ['باب شرقي', 'وسط النيل', 'خورفكان'], id: 'yLjbZKaTeBg' }
            ]
        }
    };

    /* ---------- العناصر ---------- */
    const el = {
        start:    document.getElementById('guessStart'),
        play:     document.getElementById('guessPlay'),
        end:      document.getElementById('guessEnd'),
        qNum:     document.getElementById('guessQNum'),
        score:    document.getElementById('guessScore'),
        timer:    document.getElementById('guessTimer'),
        timerBox: document.getElementById('guessTimerBox'),
        answers:  document.getElementById('guessAnswers'),
        feedback: document.getElementById('guessFeedback'),
        back:     document.getElementById('guessBack'),
        endIcon:  document.getElementById('guessEndIcon'),
        endTitle: document.getElementById('guessEndTitle'),
        endStats: document.getElementById('guessEndStats'),
        again:    document.getElementById('guessAgain'),
        endBack:  document.getElementById('guessEndBack')
    };

    /* ---------- الحالة ---------- */
    const state = {
        level: null,
        queue: [],
        index: 0,
        score: 0,
        timerId: null,
        timeLeft: 0,
        locked: false
    };

    /* ---------- خلط عشوائي ---------- */
    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a;
    }

    /* ---------- بدء مستوى ---------- */
    function startLevel(levelKey) {
        const cfg = DATA[levelKey];
        if (!cfg) return;
        if (window.moudyChallenge) window.moudyChallenge.trackGame('guess');

        clearInterval(state.timerId);

        state.level = levelKey;
        state.score = 0;
        state.index = 0;
        state.locked = false;
        state.queue = shuffle(cfg.questions).slice(0, cfg.pick);

        el.start.hidden = true;
        el.end.hidden = true;
        el.play.hidden = false;

        el.score.textContent = '0';
        el.feedback.textContent = '';
        el.feedback.className = 'guess-feedback';

        showQuestion();
    }
    /* ---------- عرض سؤال ---------- */
    function showQuestion() {
        const cfg = DATA[state.level];
        const q = state.queue[state.index];

        if (!q) { endGame(); return; }

        /* HUD */
        el.qNum.textContent = (state.index + 1) + ' / ' + cfg.pick;

        /* البيت */
        lyrics.textContent = q.line;

        /* الخيارات (4) */
        const options = shuffle([q.answer].concat(q.wrong));

        el.answers.innerHTML = '';
        options.forEach(function (opt) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'guess-answer';
            btn.textContent = opt;
            btn.addEventListener('click', function () {
                handleAnswer(btn, opt, q);
            });
            el.answers.appendChild(btn);
        });

        /* feedback */
        el.feedback.textContent = '';
        el.feedback.className = 'guess-feedback';

        /* المؤقّت */
        state.timeLeft = cfg.time;
        el.timer.textContent = state.timeLeft;
        el.timerBox.classList.remove('warning', 'danger');

        state.locked = false;
        startTimer();
    }

    /* ---------- المؤقّت ---------- */
    function startTimer() {
        clearInterval(state.timerId);
        state.timerId = setInterval(function () {
            state.timeLeft--;
            el.timer.textContent = state.timeLeft;

            if (state.timeLeft <= 5) {
                el.timerBox.classList.remove('warning');
                el.timerBox.classList.add('danger');
            } else if (state.timeLeft <= 10) {
                el.timerBox.classList.add('warning');
            }

            if (state.timeLeft <= 0) {
                clearInterval(state.timerId);
                handleTimeout();
            }
        }, 1000);
    }

    /* ---------- معالجة الإجابة ---------- */
    function handleAnswer(btn, chosen, q) {
        if (state.locked) return;
        state.locked = true;
        clearInterval(state.timerId);

        el.answers.querySelectorAll('.guess-answer').forEach(function (b) {
            b.disabled = true;
            if (b.textContent === q.answer) b.classList.add('correct');
            else if (b === btn) b.classList.add('wrong');
            else b.classList.add('dimmed');
        });

        if (chosen === q.answer) {
            const timeBonus = Math.max(0, state.timeLeft) * 2;
            state.score += 100 + timeBonus;
            el.score.textContent = state.score;
            el.feedback.innerHTML =
                '✅ صح! <span style="color:#fff;">هي أغنية "' + q.answer + '"</span><br>' +
                '<a href="https://youtu.be/' + q.id + '" target="_blank" rel="noopener">▶ اسمعها الآن</a>';
            el.feedback.className = 'guess-feedback ok';
        } else {
            el.feedback.innerHTML =
                '❌ كانت: <span style="color:#fff;">' + q.answer + '</span><br>' +
                '<a href="https://youtu.be/' + q.id + '" target="_blank" rel="noopener">▶ اسمعها الآن</a>';
            el.feedback.className = 'guess-feedback fail';
        }

        setTimeout(nextQuestion, 2200);
    }

    /* ---------- انتهى الوقت ---------- */
    function handleTimeout() {
        if (state.locked) return;
        state.locked = true;

        const q = state.queue[state.index];
        el.answers.querySelectorAll('.guess-answer').forEach(function (b) {
            b.disabled = true;
            if (b.textContent === q.answer) b.classList.add('correct');
            else b.classList.add('dimmed');
        });

        el.feedback.innerHTML =
            '⏰ خلص الوقت! كانت: <span style="color:#fff;">' + q.answer + '</span><br>' +
            '<a href="https://youtu.be/' + q.id + '" target="_blank" rel="noopener">▶ اسمعها الآن</a>';
        el.feedback.className = 'guess-feedback fail';

        setTimeout(nextQuestion, 2200);
    }

    /* ---------- السؤال التالي ---------- */
    function nextQuestion() {
        state.index++;
        const cfg = DATA[state.level];
        if (state.index >= cfg.pick) {
            endGame();
        } else {
            showQuestion();
        }
    }

    /* ---------- نهاية اللعبة ---------- */
    function endGame() {
        clearInterval(state.timerId);
        el.play.hidden = true;
        el.end.hidden = false;

        const cfg = DATA[state.level];
        const maxScore = cfg.pick * 100;
        const percent = Math.min(100, Math.round((state.score / maxScore) * 100));

        let icon, title;
        if (percent >= 90)      { icon = '🏆'; title = 'أسطورة!'; }
        else if (percent >= 70) { icon = '🥇'; title = 'ممتاز!'; }
        else if (percent >= 50) { icon = '🥈'; title = 'جيد جداً!'; }
        else if (percent >= 30) { icon = '🥉'; title = 'كويس!'; }
        else                    { icon = '😅'; title = 'حاول مرة تانية'; }

        el.end.classList.remove('lose');
        if (percent < 30) el.end.classList.add('lose');

        el.endIcon.textContent = icon;
        el.endTitle.textContent = title;
        el.endStats.innerHTML =
            'النقاط: <strong>' + state.score + '</strong><br>' +
            'النسبة: <strong>' + percent + '%</strong>';

        /* ⭐ نظام النقاط */
        var pointsMap = { easy: 40, medium: 80, hard: 130 };
        var basePoints = pointsMap[state.level] || 40;
        if (window.moudyPoints) {
            window.moudyPoints.add(basePoints, '🎵 خمّن من الكلمات');
        }
    }

    /* ---------- رجوع ---------- */
    function backToLevels() {
        clearInterval(state.timerId);
        state.locked = false;
        el.play.hidden = true;
        el.end.hidden = true;
        el.start.hidden = false;
        window.scrollTo(0, 0);
    }

    /* ---------- ربط الأحداث ---------- */
    document.querySelectorAll('#guessStart .level-card').forEach(function (btn) {
        btn.addEventListener('click', function () { startLevel(btn.dataset.level); });
    });
    el.back.addEventListener('click', backToLevels);
    el.endBack.addEventListener('click', backToLevels);
    el.again.addEventListener('click', function () { startLevel(state.level); });

    /* Twemoji */
    if (typeof twemoji !== 'undefined') {
        twemoji.parse(document.body);
    }
})();












/* ==================================================================
   قسم: تتبّع الإحصائيات العامة (يشتغل على كل الصفحات)
   ================================================================== */
   (function initStats() {
    const KEY = 'moudy-stats';
    const today = new Date().toISOString().slice(0, 10);

    function load() {
        try {
            const raw = localStorage.getItem(KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) { return null; }
    }

    function save(d) {
        try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
    }

    let data = load();
    if (!data) {
        data = {
            firstSeen: today,
            lastSeen: today,
            visits: 0,
            daysVisited: [],
            songsPlayed: 0,
            gamesPlayed: 0,
            gameCounts: {},
            songCounts: {},
            wheelSpins: 0,
            boxesOpened: 0,
            challengesCompleted: 0,
            photosViewed: 0
        };
    }

    if (!data.daysVisited) data.daysVisited = [];
    if (data.lastSeen !== today) {
        if (data.daysVisited.indexOf(today) === -1) {
            data.daysVisited.push(today);
            if (data.daysVisited.length > 400) {
                data.daysVisited = data.daysVisited.slice(-400);
            }
        }
        data.visits = (data.visits || 0) + 1;
        data.lastSeen = today;
    } else if (!data.visits) {
        data.visits = 1;
        if (data.daysVisited.indexOf(today) === -1) data.daysVisited.push(today);
    }
    save(data);

    window.moudyStats = {
        load: load,
        save: save,
        update: function (fn) {
            const d = load() || data;
            fn(d);
            save(d);
        },
        getFirstSeen: function () {
            const d = load();
            return d && d.firstSeen ? d.firstSeen : today;
        }
    };
})();

/* ==================================================================
   قسم: تحدي اليوم (Challenge)
   ------------------------------------------------------------------
   بيشتغل على كل الصفحات — يسجّل نشاطات المستخدم ويقارنها بالتحدي
   ================================================================== */
   (function initChallenge() {
    const STORAGE_KEY = 'moudy-challenge';
    const today = new Date().toISOString().slice(0, 10);

    /* ---------- قائمة التحديات ---------- */
    const CHALLENGES = [
        { id: 'play_3',        icon: '🎮', text: 'العب 3 ألعاب اليوم',               metric: 'games_count',  target: 3,   reward: { coins: 100, points: 50 } },
        { id: 'play_5',        icon: '🎮', text: 'العب 5 ألعاب اليوم',               metric: 'games_count',  target: 5,   reward: { coins: 150, points: 75 } },
        { id: 'songs_3',       icon: '🎵', text: 'اسمع 3 أغاني اليوم',               metric: 'songs_count',  target: 3,   reward: { coins: 75,  points: 30 } },
        { id: 'songs_5',       icon: '🎵', text: 'اسمع 5 أغاني اليوم',               metric: 'songs_count',  target: 5,   reward: { coins: 120, points: 50 } },
        { id: 'coins_100',     icon: '🪙', text: 'اجمع 100 عملة اليوم',              metric: 'coins_earned', target: 100, reward: { coins: 50,  points: 50 } },
        { id: 'coins_200',     icon: '🪙', text: 'اجمع 200 عملة اليوم',              metric: 'coins_earned', target: 200, reward: { coins: 100, points: 100 } },
        { id: 'wheel',         icon: '🎡', text: 'دوّر عجلة الحظ اليوم',              metric: 'wheel',        target: 1,   reward: { coins: 50,  points: 25 } },
        { id: 'box',           icon: '🎁', text: 'افتح صندوق اليوم',                 metric: 'box',          target: 1,   reward: { coins: 50,  points: 25 } },
        { id: 'streak',        icon: '🔥', text: 'سجّل دخولك اليومي',                metric: 'streak',       target: 1,   reward: { coins: 50,  points: 25 } },
        { id: 'memory_game',   icon: '🃏', text: 'العب لعبة ذاكرة الأغاني',          metric: 'game_memory',  target: 1,   reward: { coins: 100, points: 50 } },
        { id: 'emoji_game',    icon: '🎨', text: 'العب لعبة خمّن بالإيموجي',         metric: 'game_emoji',   target: 1,   reward: { coins: 100, points: 50 } },
        { id: 'missing_game',  icon: '🔍', text: 'العب لعبة الكلمة المفقودة',        metric: 'game_missing', target: 1,   reward: { coins: 100, points: 50 } },
        { id: 'scramble_game', icon: '🎼', text: 'العب لعبة رتّب الكلمات',           metric: 'game_scramble', target: 1,  reward: { coins: 100, points: 50 } },
        { id: 'guess_game',    icon: '🎵', text: 'العب لعبة خمّن من الكلمات',        metric: 'game_guess',   target: 1,   reward: { coins: 100, points: 50 } },
        { id: 'unique_games_3',icon: '🎯', text: 'العب 3 ألعاب مختلفة',              metric: 'unique_games', target: 3,   reward: { coins: 150, points: 75 } },
        { id: 'unique_games_4',icon: '🎯', text: 'العب 4 ألعاب مختلفة',              metric: 'unique_games', target: 4,   reward: { coins: 200, points: 100 } },
        { id: 'mixed_song_wheel', icon: '🎧', text: 'اسمع أغنية + دوّر العجلة',      metric: 'song_wheel',   target: 1,   reward: { coins: 100, points: 75 } },
        { id: 'mixed_song_play',  icon: '🎧', text: 'اسمع أغنية + العب لعبة',        metric: 'song_play',    target: 1,   reward: { coins: 100, points: 75 } },
        { id: 'full_day',      icon: '🌟', text: 'الصندوق + العجلة + الستريك',        metric: 'full_day',     target: 1,   reward: { coins: 200, points: 150 } },
        { id: 'master_day',    icon: '👑', text: 'اسمع أغنية + العب لعبة + الصندوق',  metric: 'master',       target: 1,   reward: { coins: 250, points: 200 } }
    ];

    /* ---------- اختيار تحدّي اليوم (بناءً على التاريخ) ---------- */
    function pickTodayChallenge() {
        let hash = 0;
        for (let i = 0; i < today.length; i++) {
            hash = ((hash << 5) - hash + today.charCodeAt(i)) >>> 0;
        }
        return CHALLENGES[hash % CHALLENGES.length];
    }

    /* ---------- قراءة / إنشاء الحالة ---------- */
    function getData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const d = JSON.parse(raw);
            if (d.date !== today) return null;
            return d;
        } catch (e) { return null; }
    }

    function createData() {
        const c = pickTodayChallenge();
        const data = {
            date: today,
            challengeId: c.id,
            games_count: 0,
            songs_count: 0,
            coins_earned: 0,
            wheel: 0,
            box: 0,
            streak: 0,
            game_memory: 0,
            game_emoji: 0,
            game_missing: 0,
            game_scramble: 0,
            game_guess: 0,
            gamesPlayed: {},
            completed: false,
            rewardClaimed: false
        };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
        return data;
    }

    function saveData(d) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch (e) {}
    }

    function getChallengeById(id) {
        return CHALLENGES.find(function (c) { return c.id === id; });
    }

    /* ---------- حساب التقدّم ---------- */
    function getProgress(data, challenge) {
        const m = challenge.metric;
        if (m === 'unique_games') return Object.keys(data.gamesPlayed || {}).length;
        if (m === 'song_wheel') return (data.songs_count >= 1 && data.wheel >= 1) ? 1 : 0;
        if (m === 'song_play')  return (data.songs_count >= 1 && data.games_count >= 1) ? 1 : 0;
        if (m === 'full_day')   return (data.box >= 1 && data.wheel >= 1 && data.streak >= 1) ? 1 : 0;
        if (m === 'master')     return (data.songs_count >= 1 && data.games_count >= 1 && data.box >= 1) ? 1 : 0;
        return data[m] || 0;
    }

    /* ---------- رسم التقدّم بالصفحة ---------- */
    function renderChallenge() {
        let data = getData();
        if (!data) data = createData();

        const c = getChallengeById(data.challengeId);
        if (!c) return;

        const progress = getProgress(data, c);
        const percent = Math.min(100, Math.round((progress / c.target) * 100));
        const complete = progress >= c.target;

        /* كرت الرئيسية */
        const homeStatus = document.getElementById('challengeHomeStatus');
        const homeIcon = document.getElementById('challengeHomeIcon');
        const homeLink = document.getElementById('challengeHomeLink');
        if (homeStatus) homeStatus.textContent = complete ? '✅ خلص!' : (progress + '/' + c.target);
        if (homeIcon) homeIcon.textContent = complete ? '✅' : c.icon;
        if (homeLink) homeLink.classList.toggle('done', complete);

        /* أيقونة النافبار */
        const navIcon = document.getElementById('challengeNavIcon');
        if (navIcon) {
            navIcon.textContent = complete ? '✅' : c.icon;
            if (navIcon.parentElement) navIcon.parentElement.classList.toggle('done', complete);
        }

        /* صفحة التحدي */
        const iconBig = document.getElementById('chIconBig');
        const textBig = document.getElementById('chTextBig');
        const fill = document.getElementById('chFill');
        const progressText = document.getElementById('chProgressText');
        const percentEl = document.getElementById('chPercent');
        const coinsEl = document.querySelectorAll('.challenge-reward-coins');
        const pointsEl = document.querySelectorAll('.challenge-reward-points');
        const claimBtn = document.getElementById('challengeClaim');
        const doneMsg = document.getElementById('chDoneMsg');

        if (iconBig) iconBig.textContent = c.icon;
        if (textBig) textBig.textContent = c.text;
        if (fill) fill.style.width = percent + '%';
        if (progressText) progressText.textContent = progress + ' / ' + c.target;
        if (percentEl) percentEl.textContent = percent + '%';
        coinsEl.forEach(function (el) { el.textContent = '+' + c.reward.coins; });
        pointsEl.forEach(function (el) { el.textContent = '+' + c.reward.points; });

        if (claimBtn) {
            if (complete && !data.rewardClaimed) {
                claimBtn.hidden = false;
                claimBtn.onclick = function () { tryClaim(); };
            } else {
                claimBtn.hidden = true;
            }
        }
        if (doneMsg) doneMsg.hidden = !data.rewardClaimed;

        /* إحصائيات */
        const sGames = document.getElementById('statGames');
        const sSongs = document.getElementById('statSongs');
        const sCoins = document.getElementById('statCoins');
        if (sGames) sGames.textContent = data.games_count || 0;
        if (sSongs) sSongs.textContent = data.songs_count || 0;
        if (sCoins) sCoins.textContent = data.coins_earned || 0;
    }

    /* ---------- استلام المكافأة ---------- */
    function tryClaim() {
        let data = getData();
        if (!data) return;
        if (data.rewardClaimed) return;

        const c = getChallengeById(data.challengeId);
        if (!c) return;

        if (getProgress(data, c) < c.target) return;

        data.completed = true;
        data.rewardClaimed = true;
        saveData(data);

        if (window.moudyCoins) window.moudyCoins.add(c.reward.coins);

        /* ⭐ نظام النقاط — تحدي اليوم */
        if (window.moudyPoints) {
            window.moudyPoints.add(50, '⚡ تحدي اليوم');
        }

        showPopup(c);
        renderChallenge();
    }
    /* ---------- Popup ---------- */
    function showPopup(c) {
        const popup = document.createElement('div');
        popup.className = 'challenge-popup';
        popup.innerHTML =
            '<div class="challenge-popup-content">' +
                '<div class="challenge-popup-icon">🏆</div>' +
                '<div class="challenge-popup-title">خلّصت التحدّي!</div>' +
                '<div class="challenge-popup-text">' + c.text + '</div>' +
                '<div class="challenge-popup-rewards">' +
                    '<div class="challenge-popup-reward">🪙 +' + c.reward.coins + '</div>' +
                    '<div class="challenge-popup-reward">⭐ +' + c.reward.points + '</div>' +
                '</div>' +
                '<button class="challenge-popup-close" type="button">تمام!</button>' +
            '</div>';
        document.body.appendChild(popup);
        setTimeout(function () { popup.classList.add('show'); }, 30);

        popup.querySelector('.challenge-popup-close').addEventListener('click', function () {
            popup.classList.remove('show');
            setTimeout(function () { popup.remove(); }, 400);
        });
    }

    /* ---------- تحديث الحالة ---------- */
    function updateProgress(updater) {
        let data = getData() || createData();
        updater(data);
        saveData(data);
        renderChallenge();
    }

    /* ---------- API عام ---------- */
    window.moudyChallenge = {
        trackGame: function (gameId) {
            updateProgress(function (d) {
                d.games_count = (d.games_count || 0) + 1;
                if (!d.gamesPlayed) d.gamesPlayed = {};
                d.gamesPlayed[gameId] = (d.gamesPlayed[gameId] || 0) + 1;
                const key = 'game_' + gameId;
                if (key in d) d[key] = (d[key] || 0) + 1;
            });
            if (window.moudyStats) {
                window.moudyStats.update(function (s) {
                    s.gamesPlayed = (s.gamesPlayed || 0) + 1;
                    s.gameCounts = s.gameCounts || {};
                    s.gameCounts[gameId] = (s.gameCounts[gameId] || 0) + 1;
                });
            }
        },
        trackSong: function (songId) {
            updateProgress(function (d) { d.songs_count = (d.songs_count || 0) + 1; });

            /* ⭐ نقاط السماع — الأعلى قيمة! */
            if (window.moudyPoints) {
                window.moudyPoints.add(100, '🎧 استماع');
            }

            if (window.moudyStats) {
                window.moudyStats.update(function (s) {
                    s.songsPlayed = (s.songsPlayed || 0) + 1;
                    if (songId) {
                        s.songCounts = s.songCounts || {};
                        s.songCounts[songId] = (s.songCounts[songId] || 0) + 1;
                    }
                });
            }
        },
        trackCoins: function (amount) {
            updateProgress(function (d) { d.coins_earned = (d.coins_earned || 0) + amount; });
        },
        trackWheel: function () {
            updateProgress(function (d) { d.wheel = 1; });
        },
        trackBox: function () {
            updateProgress(function (d) { d.box = 1; });
        },
        trackStreak: function () {
            updateProgress(function (d) { d.streak = 1; });
        },
        render: renderChallenge
    };

    /* ---------- أيقونة النافبار ---------- */
    function injectNavIcon() {
        const nav = document.getElementById('siteNav');
        if (!nav || nav.querySelector('.challenge-nav-icon')) return;
        const a = document.createElement('a');
        a.href = 'challenge.html';
        a.className = 'challenge-nav-icon';
        a.setAttribute('aria-label', 'تحدي اليوم');
        a.innerHTML = '⚡<span id="challengeNavIcon">⚡</span>';
        nav.appendChild(a);
    }

    /* ---------- العدّاد ---------- */
    function startTimer() {
        const el = document.getElementById('chTimer');
        if (!el) return;
        function tick() {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            const diff = tomorrow - now;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            el.textContent =
                String(h).padStart(2, '0') + ':' +
                String(m).padStart(2, '0') + ':' +
                String(s).padStart(2, '0');
        }
        tick();
        setInterval(tick, 1000);
    }

    /* ---------- تشغيل ---------- */
    setTimeout(injectNavIcon, 50);
    setTimeout(injectNavIcon, 300);
    setTimeout(injectNavIcon, 1000);

    renderChallenge();
    startTimer();
})();












/* ==================================================================
   قسم: قوائم التشغيل (playlists.html)
   ================================================================== */
   (function initPlaylists() {
    const grid = $('plGrid');
    if (!grid) return;

    const STORAGE_KEY = 'moudy-playlists';
    const FAV_ID = '__fav__';
    const ALL = (typeof SONGS !== 'undefined') ? SONGS : [];

    const el = {
        listView: $('plListView'),
        grid: $('plGrid'),
        empty: $('plEmpty'),
        newBtn: $('plNewBtn'),
        emptyNewBtn: $('plEmptyNewBtn'),

        detailView: $('plDetailView'),
        backBtn: $('plBackBtn'),
        coverImg: $('plCoverImg'),
        name: $('plName'),
        count: $('plCount'),
        duration: $('plDuration'),
        playAll: $('plPlayAll'),
        shuffle: $('plShuffle'),
        share: $('plShare'),
        rename: $('plRename'),
        del: $('plDelete'),
        songList: $('plSongList'),
        songEmpty: $('plSongEmpty'),
        addSongs: $('plAddSongsBtn'),

        nameModal: $('plNameModal'),
        nameModalTitle: $('plNameModalTitle'),
        nameInput: $('plNameInput'),
        nameCancel: $('plNameCancel'),
        nameConfirm: $('plNameConfirm'),

        pickModal: $('plPickModal'),
        pickClose: $('plPickClose'),
        pickSearch: $('plPickSearch'),
        pickList: $('plPickList'),
        pickDone: $('plPickDone'),

        playerBar: $('plPlayerBar'),
        playerThumb: $('plPlayerThumb'),
        playerTitle: $('plPlayerTitle'),
        playerCounter: $('plPlayerCounter'),
        prev: $('plPrev'),
        playPause: $('plPlayPause'),
        next: $('plNext'),
        playerClose: $('plPlayerClose'),
        ytHost: $('plYtHost')
    };

    const player = {
        queue: [], index: 0, isPlaying: false,
        yt: null, ytReady: false
    };

    let currentPlId = null;

    /* ============ التخزين ============ */
    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { playlists: [] };
            const data = JSON.parse(raw);
            if (!data.playlists) data.playlists = [];
            return data;
        } catch (e) { return { playlists: [] }; }
    }
    function save(data) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
    }
    function genId() {
        return 'pl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    }
    function getPlaylist(id) {
        return load().playlists.find(p => p.id === id) || null;
    }
    function getSongById(id) {
        return ALL.find(s => s.id === id) || null;
    }
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str == null ? '' : str;
        return div.innerHTML;
    }

    /* ============ قائمة المفضلة تلقائية ============ */
    function ensureFav() {
        const data = load();
        let fav = data.playlists.find(p => p.id === FAV_ID);
        if (!fav) {
            fav = {
                id: FAV_ID,
                name: '⭐ المفضلة',
                cover: null,
                songs: [],
                createdAt: Date.now(),
                isFav: true
            };
            data.playlists.unshift(fav);
            save(data);
        }
        return fav;
    }

    /* ============ شبكة القوائم ============ */
    function renderGrid() {
        ensureFav();
        const data = load();
        el.grid.innerHTML = '';

        const list = data.playlists.slice().sort((a, b) => {
            if (a.isFav) return -1;
            if (b.isFav) return 1;
            return (b.createdAt || 0) - (a.createdAt || 0);
        });

        if (list.length === 0) {
            el.empty.hidden = false;
            return;
        }
        el.empty.hidden = true;
        list.forEach(pl => el.grid.appendChild(createPlCard(pl)));
    }

    function createPlCard(pl) {
        const card = document.createElement('div');
        card.className = 'pl-card' + (pl.isFav ? ' pl-card-fav' : '');

        const cover = document.createElement('div');
        cover.className = 'pl-card-cover';

        const firstSong = pl.songs.length > 0 ? getSongById(pl.songs[0]) : null;
        const coverId = pl.cover || (firstSong ? firstSong.id : null);

        if (coverId) {
            cover.style.backgroundImage = `url('https://i.ytimg.com/vi/${coverId}/hqdefault.jpg')`;
        } else {
            cover.classList.add('pl-card-cover-empty');
            cover.textContent = pl.isFav ? '⭐' : '🎵';
        }

        if (pl.songs.length > 1) {
            const badge = document.createElement('span');
            badge.className = 'pl-card-stack';
            badge.textContent = pl.songs.length;
            cover.appendChild(badge);
        }

        const overlay = document.createElement('div');
        overlay.className = 'pl-card-play';
        overlay.innerHTML = '▶';
        cover.appendChild(overlay);

        const info = document.createElement('div');
        info.className = 'pl-card-info';
        info.innerHTML =
            '<h3 class="pl-card-name">' + escapeHtml(pl.name) + '</h3>' +
            '<p class="pl-card-meta">' + pl.songs.length + ' أغنية</p>';

        card.append(cover, info);

        card.addEventListener('click', function () { openDetail(pl.id); });
        overlay.addEventListener('click', function (e) {
            e.stopPropagation();
            playPlaylist(pl.id, false);
        });

        return card;
    }

    /* ============ تفاصيل قائمة ============ */
    function openDetail(plId) {
        const pl = getPlaylist(plId);
        if (!pl) return;

        currentPlId = plId;
        el.listView.hidden = true;
        el.detailView.hidden = false;
        window.scrollTo(0, 0);
        renderDetail();
    }

    function renderDetail() {
        const pl = getPlaylist(currentPlId);
        if (!pl) { backToList(); return; }

        const firstSong = pl.songs.length > 0 ? getSongById(pl.songs[0]) : null;
        const coverId = pl.cover || (firstSong ? firstSong.id : null);
        if (coverId) {
            el.coverImg.src = 'https://i.ytimg.com/vi/' + coverId + '/hqdefault.jpg';
            el.coverImg.style.display = '';
        } else {
            el.coverImg.style.display = 'none';
        }

        el.name.textContent = pl.name;
        el.count.textContent = pl.songs.length;
        el.duration.textContent = formatDuration(pl.songs.length * 210);

        if (pl.isFav) {
            el.del.style.display = 'none';
            el.rename.style.display = 'none';
        } else {
            el.del.style.display = '';
            el.rename.style.display = '';
        }

        el.songList.innerHTML = '';
        if (pl.songs.length === 0) {
            el.songEmpty.hidden = false;
        } else {
            el.songEmpty.hidden = true;
            pl.songs.forEach(function (songId, idx) {
                const song = getSongById(songId);
                if (!song) return;
                el.songList.appendChild(createSongRow(song, idx));
            });
        }
    }

    function createSongRow(song, idx) {
        const row = document.createElement('div');
        row.className = 'pl-song-row';
        row.draggable = true;
        row.dataset.idx = idx;

        row.innerHTML =
            '<div class="pl-song-drag">⋮⋮</div>' +
            '<div class="pl-song-num">' + (idx + 1) + '</div>' +
            '<img class="pl-song-thumb" src="https://i.ytimg.com/vi/' + song.id + '/default.jpg" alt="">' +
            '<div class="pl-song-info"><div class="pl-song-title">' + escapeHtml(song.title) + '</div></div>' +
            '<button class="pl-song-play" type="button" title="تشغيل">▶</button>' +
            '<button class="pl-song-remove" type="button" title="حذف">🗑</button>';

        row.querySelector('.pl-song-play').addEventListener('click', function (e) {
            e.stopPropagation();
            playFromPlaylist(currentPlId, idx);
        });

        row.querySelector('.pl-song-remove').addEventListener('click', function (e) {
            e.stopPropagation();
            removeSongFromPlaylist(currentPlId, song.id);
        });

        setupDragDrop(row);
        return row;
    }

    /* ============ سحب وإفلات ============ */
    let dragSrcIdx = null;

    function setupDragDrop(row) {
        row.addEventListener('dragstart', function (e) {
            dragSrcIdx = Number(row.dataset.idx);
            row.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            try { e.dataTransfer.setData('text/plain', String(dragSrcIdx)); } catch (err) {}
        });

        row.addEventListener('dragend', function () {
            row.classList.remove('dragging');
            document.querySelectorAll('.pl-song-row').forEach(function (r) {
                r.classList.remove('drag-over');
            });
        });

        row.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            row.classList.add('drag-over');
        });

        row.addEventListener('dragleave', function () {
            row.classList.remove('drag-over');
        });

        row.addEventListener('drop', function (e) {
            e.preventDefault();
            row.classList.remove('drag-over');
            const targetIdx = Number(row.dataset.idx);
            if (dragSrcIdx === null || dragSrcIdx === targetIdx) return;

            const data = load();
            const target = data.playlists.find(p => p.id === currentPlId);
            if (!target) return;

            const songs = target.songs.slice();
            const moved = songs.splice(dragSrcIdx, 1)[0];
            songs.splice(targetIdx, 0, moved);
            target.songs = songs;
            save(data);

            dragSrcIdx = null;
            renderDetail();
        });
    }

    /* ============ أدوات ============ */
    function formatDuration(sec) {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        if (h > 0) return h + ' س ' + m + ' د';
        return m + ' د';
    }

    function shuffleArr(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }

    /* ============ إضافة/حذف أغنية ============ */
    function removeSongFromPlaylist(plId, songId) {
        const data = load();
        const pl = data.playlists.find(p => p.id === plId);
        if (!pl) return;
        const idx = pl.songs.indexOf(songId);
        if (idx === -1) return;
        pl.songs.splice(idx, 1);
        save(data);
        renderDetail();
        renderGrid();
    }

    function toggleSongInPlaylist(songId) {
        const data = load();
        const pl = data.playlists.find(p => p.id === currentPlId);
        if (!pl) return;
        const idx = pl.songs.indexOf(songId);
        if (idx === -1) pl.songs.push(songId);
        else pl.songs.splice(idx, 1);
        save(data);
        renderPickList(el.pickSearch.value);
    }

    /* ============ Modal اختيار الأغاني ============ */
    function openPickModal() {
        el.pickModal.hidden = false;
        document.body.style.overflow = 'hidden';
        el.pickSearch.value = '';
        renderPickList('');
    }

    function closePickModal() {
        el.pickModal.hidden = true;
        document.body.style.overflow = '';
        renderDetail();
        renderGrid();
    }

    function renderPickList(query) {
        const pl = getPlaylist(currentPlId);
        if (!pl) return;

        const q = (query || '').trim().toLowerCase();
        const list = ALL.filter(s => !q || s.title.toLowerCase().includes(q));

        el.pickList.innerHTML = '';
        if (list.length === 0) {
            el.pickList.innerHTML = '<p class="pl-pick-empty">ما في نتائج</p>';
            return;
        }

        list.forEach(function (song) {
            const inPl = pl.songs.includes(song.id);
            const row = document.createElement('div');
            row.className = 'pl-pick-row' + (inPl ? ' added' : '');
            row.innerHTML =
                '<img class="pl-pick-thumb" src="https://i.ytimg.com/vi/' + song.id + '/default.jpg" alt="">' +
                '<div class="pl-pick-title">' + escapeHtml(song.title) + '</div>' +
                '<button class="pl-pick-btn" type="button">' + (inPl ? '✓' : '＋') + '</button>';

            row.querySelector('.pl-pick-btn').addEventListener('click', function (e) {
                e.stopPropagation();
                toggleSongInPlaylist(song.id);
            });
            row.addEventListener('click', function () {
                toggleSongInPlaylist(song.id);
            });

            el.pickList.appendChild(row);
        });
    }

    /* ============ Modal الاسم ============ */
    let nameCallback = null;

    function openNameModal(title, initial, callback) {
        el.nameModalTitle.textContent = title;
        el.nameInput.value = initial || '';
        el.nameModal.hidden = false;
        nameCallback = callback;
        setTimeout(function () { el.nameInput.focus(); }, 50);
    }

    function closeNameModal() {
        el.nameModal.hidden = true;
        nameCallback = null;
    }

    function confirmName() {
        const name = el.nameInput.value.trim();
        if (!name) { el.nameInput.focus(); return; }
        if (nameCallback) nameCallback(name);
        closeNameModal();
    }

    /* ============ إنشاء/تعديل/حذف ============ */
    function createNewPlaylist() {
        openNameModal('قائمة جديدة', '', function (name) {
            const data = load();
            data.playlists.push({
                id: genId(),
                name: name,
                cover: null,
                songs: [],
                createdAt: Date.now()
            });
            save(data);
            renderGrid();
        });
    }

    function renamePlaylist() {
        const pl = getPlaylist(currentPlId);
        if (!pl || pl.isFav) return;
        openNameModal('تعديل اسم القائمة', pl.name, function (name) {
            const data = load();
            const target = data.playlists.find(p => p.id === currentPlId);
            if (target) {
                target.name = name;
                save(data);
                renderDetail();
                renderGrid();
            }
        });
    }

    function deletePlaylist() {
        const pl = getPlaylist(currentPlId);
        if (!pl || pl.isFav) return;
        if (!confirm('متأكد بدك تحذف "' + pl.name + '"؟')) return;
        const data = load();
        data.playlists = data.playlists.filter(p => p.id !== currentPlId);
        save(data);
        backToList();
    }

    function backToList() {
        currentPlId = null;
        el.detailView.hidden = true;
        el.listView.hidden = false;
        renderGrid();
        window.scrollTo(0, 0);
    }

    /* ============ مشاركة ============ */
    function sharePlaylist() {
        const pl = getPlaylist(currentPlId);
        if (!pl) return;

        let text = '🎵 ' + pl.name + '\n\n';
        pl.songs.forEach(function (id, i) {
            const s = getSongById(id);
            if (s) text += (i + 1) + '. ' + s.title + '\n';
        });
        text += '\nمن موقع مودي العربي';

        if (navigator.share) {
            navigator.share({ title: pl.name, text: text }).catch(function () {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(function () { showToast('✅ تم نسخ القائمة!'); })
                .catch(function () { showToast('❌ ما قدرنا ننسخ'); });
        } else {
            showToast('⚠️ المتصفح ما بيدعم المشاركة');
        }
    }

    function showToast(msg) {
        let t = document.querySelector('.playlist-toast');
        if (!t) {
            t = document.createElement('div');
            t.className = 'playlist-toast';
            document.body.appendChild(t);
        }
        t.textContent = msg;
        setTimeout(function () { t.classList.add('show'); }, 30);
        setTimeout(function () { t.classList.remove('show'); }, 2500);
    }

    /* ============ المشغل ============ */
    function ensurePlayer(cb) {
        if (player.yt) { cb(); return; }

        function create() {
            player.yt = new YT.Player(el.ytInner, {
                height: '1', width: '1',
                playerVars: {
                    autoplay: 0, controls: 0, disablekb: 1,
                    fs: 0, modestbranding: 1, rel: 0, playsinline: 1
                },
                events: {
                    'onReady': function () { player.ytReady = true; cb(); },
                    'onStateChange': onYtState,
                    'onError': function () {
                        setTimeout(function () {
                            if (player.index < player.queue.length - 1) {
                                player.index++;
                                playCurrent();
                            }
                        }, 800);
                    }
                }
            });
        }

        if (typeof YT !== 'undefined' && YT.Player) {
            create();
        } else {
            if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                const s = document.createElement('script');
                s.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(s);
            }
            const prev = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = function () {
                if (typeof prev === 'function') prev();
                create();
            };
        }
    }

    function onYtState(e) {
        if (typeof YT === 'undefined') return;
        if (e.data === YT.PlayerState.PLAYING) {
            player.isPlaying = true;
            updatePlayerUI();
        } else if (e.data === YT.PlayerState.PAUSED) {
            player.isPlaying = false;
            updatePlayerUI();
        } else if (e.data === YT.PlayerState.ENDED) {
            if (player.index < player.queue.length - 1) {
                player.index++;
                playCurrent();
            } else {
                player.isPlaying = false;
                updatePlayerUI();
            }
        }
    }

    function playCurrent() {
        const s = player.queue[player.index];
        if (!s) return;
        if (window.moudyChallenge) window.moudyChallenge.trackSong(s.id);
        ensurePlayer(function () {
            try { player.yt.loadVideoById(s.id); } catch (e) {}
        });
        updatePlayerUI();
    }

    function playQueue(songs, idx) {
        player.queue = songs.slice();
        player.index = idx || 0;
        playCurrent();
    }

    function playPlaylist(plId, shuffleIt) {
        const pl = getPlaylist(plId);
        if (!pl || pl.songs.length === 0) {
            showToast('القائمة فاضية!');
            return;
        }
        const songs = pl.songs.map(function (id) { return getSongById(id); }).filter(Boolean);
        if (songs.length === 0) return;
        if (shuffleIt) shuffleArr(songs);
        playQueue(songs, 0);
    }

    function playFromPlaylist(plId, startIdx) {
        const pl = getPlaylist(plId);
        if (!pl) return;
        const songs = pl.songs.map(function (id) { return getSongById(id); }).filter(Boolean);
        if (songs.length === 0) return;
        playQueue(songs, startIdx);
    }

    function updatePlayerUI() {
        const s = player.queue[player.index];
        if (!s) { el.playerBar.hidden = true; return; }
        el.playerBar.hidden = false;
        el.playerTitle.textContent = s.title;
        el.playerThumb.src = 'https://i.ytimg.com/vi/' + s.id + '/default.jpg';
        el.playerCounter.textContent = (player.index + 1) + ' / ' + player.queue.length;
        el.playPause.textContent = player.isPlaying ? '⏸' : '▶';
    }

    function togglePlay() {
        if (!player.yt) return;
        if (player.isPlaying) {
            try { player.yt.pauseVideo(); } catch (e) {}
        } else {
            try { player.yt.playVideo(); } catch (e) {}
        }
    }

    function nextTrack() {
        if (player.index < player.queue.length - 1) {
            player.index++;
            playCurrent();
        }
    }

    function prevTrack() {
        if (player.index > 0) player.index--;
        else player.index = player.queue.length - 1;
        playCurrent();
    }

    function closePlayer() {
        if (player.yt) { try { player.yt.stopVideo(); } catch (e) {} }
        player.queue = [];
        player.index = 0;
        player.isPlaying = false;
        el.playerBar.hidden = true;
    }

    /* ============ ربط الأحداث ============ */
    el.newBtn.addEventListener('click', createNewPlaylist);
    el.emptyNewBtn.addEventListener('click', createNewPlaylist);
    el.backBtn.addEventListener('click', backToList);

    el.playAll.addEventListener('click', function () { playPlaylist(currentPlId, false); });
    el.shuffle.addEventListener('click', function () { playPlaylist(currentPlId, true); });
    el.share.addEventListener('click', sharePlaylist);
    el.rename.addEventListener('click', renamePlaylist);
    el.del.addEventListener('click', deletePlaylist);
    el.addSongs.addEventListener('click', openPickModal);

    el.nameCancel.addEventListener('click', closeNameModal);
    el.nameConfirm.addEventListener('click', confirmName);
    el.nameInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') confirmName();
        if (e.key === 'Escape') closeNameModal();
    });

    el.pickClose.addEventListener('click', closePickModal);
    el.pickDone.addEventListener('click', closePickModal);
    el.pickSearch.addEventListener('input', function () {
        renderPickList(el.pickSearch.value);
    });

    el.playPause.addEventListener('click', togglePlay);
    el.next.addEventListener('click', nextTrack);
    el.prev.addEventListener('click', prevTrack);
    el.playerClose.addEventListener('click', closePlayer);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (!el.nameModal.hidden) closeNameModal();
            if (!el.pickModal.hidden) closePickModal();
        }
    });

    /* ============ تشغيل ============ */
    renderGrid();
})();











/* ==================================================================
   قسم: لعبة زمزم (zamzam.html) — Piano Tiles بستايل مودي
   ================================================================== */
(function initZamzam() {
    const board = document.getElementById('zzBoard');
    if (!board) return;

    /* ============ قائمة الأغاني ============ */
    const SONG_LIST = [
        { title: 'نوبة', id: 'ZxbchOV0As4' },
        { title: 'قد التحدي', id: 'e3neCGeuC2I' },
        { title: 'الطير', id: 'Lr-6AYRUFEc' },
        { title: 'تروما', id: '0TZ-UmDDwyA' },
        { title: 'ذكريات', id: 'nu7iJt4_yu4' },
        { title: 'كفاحي', id: 'MOuyFGBmwKU' },
        { title: 'مونستر', id: 'rc4x8l-QnGE' },
        { title: 'كارما', id: 'm4Hz03O9MJ4' },
        { title: 'ياناصر', id: 'DU0G8FJGG64' },
        { title: 'سكابا', id: 'cG_flsWEhC4' },
        { title: 'حريقة', id: 'YIomwMgIQQs' },
        { title: 'شاهين', id: 'GrkSyxB_haA' },
        { title: 'بصارة', id: 'OpHe-tXJkWs' },
        { title: 'طمنيني', id: 'gHf5oP7N6iE' },
        { title: 'خورفكان', id: 'Qk_Yo8VOGh4' },
        { title: 'نجم ليل', id: 'rJYlBO0a7EY' },
        { title: 'غرناطة', id: 'yLjbZKaTeBg' },
        { title: 'خطاف', id: '_k4b66sbm1M' },
        { title: 'فيراري', id: 'JYuJ0QPeAG0' },
        { title: 'روليكس', id: 'wX6Kt90z-eM' },
        { title: 'الأرض السعيدة', id: 'wyKXeeIeYHg' },
        { title: 'أنا الخطأ', id: 'Yl7HpF5oyRk' },
        { title: 'مسرحية', id: 'A0-L2t4RIkM' },
        { title: 'حكي كتير', id: 'AtVpciHqliw' },
        { title: 'جرح فينا', id: 'Ou8e9zvoS0E' },
        { title: 'الغُربة', id: '3PKBsPmKqVo' },
        { title: 'بفوضى', id: 'EGiz1aAtbBI' },
        { title: 'امشي', id: 'DAeBhOvDgwo' },
        { title: 'الحبيبة', id: 'hZZY-7xaOH8' },
        { title: 'غلط', id: 'zj9TFooEhI4' },
        { title: 'فلسفة', id: 'fph9h_w5kQ0' },
        { title: 'اعتراف نفسي', id: 'iohCJ5WqiI8' },
        { title: 'تتذكر', id: 'Rd8YaaRIqGs' },
        { title: 'اشتقتلي', id: 'dho_69-1BJM' },
        { title: 'راضي بكلشي صار', id: 'e3R9XXpmsEM' },
        { title: 'ايزي', id: '80egFQLQ6PM' }
    ];

    /* ============ إعدادات المستويات ============ */
    const LEVELS = {
        1: { spawn: 1400, speed: 42, name: 'سهل' },
        2: { spawn: 1100, speed: 58, name: 'متوسط' },
        3: { spawn: 900,  speed: 78, name: 'صعب' },
        4: { spawn: 700,  speed: 100, name: 'خبير' },
        5: { spawn: 540,  speed: 130, name: 'أسطوري' }
    };

    const BADGE_TEXT = { '3': 'بداية!', '5': 'Cool!', '10': 'أحسنت!', '20': 'مذهل!', '30': 'أسطوري!', '50': 'لا يُقهر!' };

    /* ============ العناصر ============ */
    const el = {
        start:      document.getElementById('zzStart'),
        play:       document.getElementById('zzPlay'),
        end:        document.getElementById('zzEnd'),
        board:      board,
        feedback:   document.getElementById('zzFeedback'),
        countdown:  document.getElementById('zzCountdown'),
        score:      document.getElementById('zzScore'),
        combo:      document.getElementById('zzCombo'),
        lives:      document.getElementById('zzLives'),
        pauseBtn:   document.getElementById('zzPauseBtn'),
        muteBtn:    document.getElementById('zzMuteBtn'),
        pause:      document.getElementById('zzPause'),
        pauseScore: document.getElementById('zzPauseScore'),
        pauseCombo: document.getElementById('zzPauseCombo'),
        resume:     document.getElementById('zzResume'),
        restartBtn: document.getElementById('zzRestartBtn'),
        quitBtn:    document.getElementById('zzQuitBtn'),
        songSelect: document.getElementById('zzSongSelect'),
        startBtn:   document.getElementById('zzStartBtn'),
        endRank:    document.getElementById('zzEndRank'),
        endIcon:    document.getElementById('zzEndIcon'),
        endTitle:   document.getElementById('zzEndTitle'),
        endMsg:     document.getElementById('zzEndMsg'),
        endScore:   document.getElementById('zzEndScore'),
        endCombo:   document.getElementById('zzEndCombo'),
        endAcc:     document.getElementById('zzEndAcc'),
        endPerfect: document.getElementById('zzEndPerfect'),
        endMiss:    document.getElementById('zzEndMiss'),
        endCoins:   document.getElementById('zzEndCoins'),
        best:       document.getElementById('zzBest'),
        againBtn:   document.getElementById('zzAgainBtn'),
        backBtn:    document.getElementById('zzBackBtn'),
        ytMini:     document.getElementById('zzYtMini'),
        ytHost:     document.getElementById('zzYtHost')
    };

    /* ============ الحالة ============ */
    const state = {
        mode: 'classic',
        level: 1,
        running: false,
        paused: false,
        score: 0,
        combo: 0,
        maxCombo: 0,
        lives: 3,
        maxLives: 3,
        perfect: 0,
        good: 0,
        miss: 0,
        tiles: [],
        lastSpawn: 0,
        lastFrame: 0,
        rafId: null,
        lastColumn: -1,
        muted: false
    };

    /* ============ Web Audio (نوتات) ============ */
    let audioCtx = null;
    const SCALE = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];

    function initAudio() {
        if (audioCtx) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {}
    }

    function playNote(freq, type, dur) {
        if (!audioCtx || state.muted) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type || 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + (dur || 0.25));
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + (dur || 0.25));
        } catch (e) {}
    }

    function sfxHit(col) {
        const f = SCALE[col % SCALE.length];
        playNote(f, 'triangle', 0.35);
    }
    function sfxPerfect() {
        playNote(880, 'sine', 0.15);
        setTimeout(function () { playNote(1174, 'sine', 0.15); }, 60);
    }
    function sfxMiss() {
        playNote(120, 'sawtooth', 0.4);
    }

    /* ============ تعبئة قائمة الأغاني ============ */
    SONG_LIST.forEach(function (s) {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.title;
        el.songSelect.appendChild(opt);
    });

    /* ============ بطاقات الأنماط والمستويات ============ */
    document.querySelectorAll('.zz-mode-card').forEach(function (b) {
        b.addEventListener('click', function () {
            document.querySelectorAll('.zz-mode-card').forEach(function (x) { x.classList.remove('active'); });
            b.classList.add('active');
            state.mode = b.dataset.mode;
        });
    });

    document.querySelectorAll('.zz-level-card').forEach(function (b) {
        b.addEventListener('click', function () {
            document.querySelectorAll('.zz-level-card').forEach(function (x) { x.classList.remove('active'); });
            b.classList.add('active');
            state.level = Number(b.dataset.level);
        });
    });

    /* ============ يوتيوب ============ */
    let ytPlayer = null;

    function initYt(videoId) {
        if (!videoId) { el.ytMini.hidden = true; return; }

        el.ytMini.hidden = false;

        function create() {
            if (ytPlayer) {
                try { ytPlayer.loadVideoById(videoId); } catch (e) {}
                return;
            }
            ytPlayer = new YT.Player(el.ytHost, {
                height: '1', width: '1',
                videoId: videoId,
                playerVars: {
                    autoplay: 1, controls: 0, disablekb: 1,
                    fs: 0, modestbranding: 1, rel: 0, playsinline: 1
                },
                events: {
                    'onReady': function (e) {
                        try {
                            e.target.setVolume(state.muted ? 0 : 60);
                            e.target.playVideo();
                        } catch (err) {}
                    }
                }
            });
        }

        if (typeof YT !== 'undefined' && YT.Player) {
            create();
        } else {
            if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                const s = document.createElement('script');
                s.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(s);
            }
            const prev = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = function () {
                if (typeof prev === 'function') prev();
                create();
            };
        }
    }

     /* ============ إنشاء بلاطة ============ */
     function spawnTile(now) {
        const cfg = LEVELS[state.level];

        /* اختار عمود غير يلي فات */
        let col;
        let tries = 0;
        do {
            col = Math.floor(Math.random() * 4);
            tries++;
        } while (col === state.lastColumn && tries < 5);
        state.lastColumn = col;

        const colEl = board.querySelector('.zz-column[data-col="' + col + '"]');
        const tile = document.createElement('div');
        tile.className = 'zz-tile';

        const palette = ['#28a745', '#34d058', '#1e7e34', '#4ade80'];
        const color = palette[Math.floor(Math.random() * palette.length)];
        tile.style.background = 'linear-gradient(180deg, ' + color + ', ' + color + 'cc)';

        tile.dataset.col = col;
        tile.dataset.y = '-22';
        tile.style.top = '-22%';
        colEl.appendChild(tile);

        const tileObj = {
            el: tile,
            col: col,
            y: -22,
            tapped: false,
            spawnedAt: now
        };
        state.tiles.push(tileObj);

        /* ← هون التعديل: نوقف الـ propagation */
        tile.addEventListener('pointerdown', function (e) {
            e.preventDefault();
            e.stopPropagation();
            tapTile(tileObj);
        });
    }
    function tapTile(tileObj) {
        if (!state.running || state.paused || tileObj.tapped) return;

        tileObj.tapped = true;

        /* Perfect: وسط-أسفل الشاشة (55-85) */
        const isPerfect = tileObj.y >= 55 && tileObj.y <= 85;
        /* Good: ثلث الشاشة الأخير (30-100) */
        const isGood = tileObj.y >= 30;
        if (isPerfect) {
            state.perfect++;
            state.score += 120 * getMultiplier();
            el.feedback.textContent = '⭐ Perfect!';
            el.feedback.className = 'zz-feedback ok perfect';
            sfxPerfect();
        } else if (isGood) {
            state.good++;
            state.score += 80 * getMultiplier();
            el.feedback.textContent = '✅ Cool!';
            el.feedback.className = 'zz-feedback ok';
            sfxHit(tileObj.col);
        } else {
            state.score += 40 * getMultiplier();
            el.feedback.textContent = '👌 Good';
            el.feedback.className = 'zz-feedback ok';
            sfxHit(tileObj.col);
        }

        state.combo++;
        if (state.combo > state.maxCombo) state.maxCombo = state.combo;

        /* Badge عند معالم الـ combo */
        if (BADGE_TEXT[state.combo]) {
            el.feedback.textContent = BADGE_TEXT[state.combo];
        }

        updateHud();

        /* أنيميشن */
        tileObj.el.classList.add('hit');
        setTimeout(function () {
            tileObj.el.remove();
            const idx = state.tiles.indexOf(tileObj);
            if (idx !== -1) state.tiles.splice(idx, 1);
        }, 180);

        /* اهتزاز */
        if (navigator.vibrate && !state.muted) {
            try { navigator.vibrate(8); } catch (e) {}
        }
    }

    /* ============ متعدد النقاط ============ */
    function getMultiplier() {
        return Math.min(5, 1 + Math.floor(state.combo / 10));
    }

    /* ============ بلاطة تفوت بدون ضغط ============ */
    function missTile(tileObj) {
        tileObj.tapped = true;
        state.miss++;
        state.combo = 0;
        state.lives--;
        sfxMiss();
        el.feedback.textContent = '❌ Miss';
        el.feedback.className = 'zz-feedback fail';

        tileObj.el.classList.add('miss');
        setTimeout(function () {
            tileObj.el.remove();
            const idx = state.tiles.indexOf(tileObj);
            if (idx !== -1) state.tiles.splice(idx, 1);
        }, 300);

        if (navigator.vibrate && !state.muted) {
            try { navigator.vibrate([60, 40, 60]); } catch (e) {}
        }

        updateHud();

        if (state.lives <= 0) endGame();
    }

    /* ============ تحديث HUD ============ */
    function updateHud() {
        el.score.textContent = state.score.toLocaleString('en');
        const mult = getMultiplier();
        el.combo.textContent = 'x' + state.combo + (mult > 1 ? ' (' + mult + '×)' : '');

        let livesStr = '';
        for (let i = 0; i < state.maxLives; i++) {
            livesStr += i < state.lives ? '❤' : '🖤';
        }
        el.lives.textContent = livesStr;
    }

    function gameLoop(now) {
        if (!state.running || state.paused) return;

        if (!state.lastFrame) state.lastFrame = now;
        const dt = Math.min(50, now - state.lastFrame);
        state.lastFrame = now;

        const cfg = LEVELS[state.level];
        const speedPerMs = cfg.speed / 1000;

        /* حرّك البلاطات */
        for (let i = state.tiles.length - 1; i >= 0; i--) {
            const t = state.tiles[i];
            if (t.tapped) continue;
            t.y += speedPerMs * dt;
            t.el.style.top = t.y + '%';
            t.el.dataset.y = t.y;

            /* ← البلاطة توصل لأسفل الشاشة فعلاً = miss */
            if (t.y >= 100) {
                missTile(t);
            }
        }

        /* spawn جديد */
        if (now - state.lastSpawn >= cfg.spawn) {
            spawnTile(now);
            state.lastSpawn = now;
        }

        state.rafId = requestAnimationFrame(gameLoop);
    }

    /* ============ بدء المستوى ============ */
    function startLevel() {
        initAudio();

        /* إعادة تعيين */
        state.running = false;
        state.paused = false;
        state.score = 0;
        state.combo = 0;
        state.maxCombo = 0;
        state.perfect = 0;
        state.good = 0;
        state.miss = 0;
        state.tiles.forEach(function (t) { t.el.remove(); });
        state.tiles = [];
        state.lastSpawn = 0;
        state.lastFrame = 0;
        state.lastColumn = -1;

        /* الأرواح */
        state.maxLives = state.mode === 'arcade' ? 1 : 3;
        state.lives = state.maxLives;

        updateHud();

        el.start.hidden = true;
        el.end.hidden = true;
        el.play.hidden = false;

        /* يوتيوب */
        const songId = el.songSelect.value;
        initYt(songId);

        /* عدّاد 3-2-1 */
        el.countdown.hidden = false;
        let cd = 3;
        el.countdown.textContent = cd;
        const cdId = setInterval(function () {
            cd--;
            if (cd > 0) {
                el.countdown.textContent = cd;
                playNote(660, 'square', 0.08);
            } else if (cd === 0) {
                el.countdown.textContent = '🏁';
                playNote(880, 'square', 0.15);
            } else {
                clearInterval(cdId);
                el.countdown.hidden = true;
                actuallyStart();
            }
        }, 800);
        playNote(440, 'square', 0.08);
    }

    function actuallyStart() {
        state.running = true;
        state.lastFrame = 0;
        state.lastSpawn = performance.now();
        state.rafId = requestAnimationFrame(gameLoop);
    }

    /* ============ إيقاف ============ */
    function pause() {
        if (!state.running || state.paused) return;
        state.paused = true;
        cancelAnimationFrame(state.rafId);
        el.pauseScore.textContent = state.score.toLocaleString('en');
        el.pauseCombo.textContent = 'x' + state.combo;
        el.pause.hidden = false;
        if (ytPlayer && ytPlayer.pauseVideo) {
            try { ytPlayer.pauseVideo(); } catch (e) {}
        }
    }

    function resume() {
        if (!state.paused) return;
        state.paused = false;
        state.lastFrame = 0;
        state.lastSpawn = performance.now();
        el.pause.hidden = true;
        state.rafId = requestAnimationFrame(gameLoop);
        if (ytPlayer && ytPlayer.playVideo) {
            try { ytPlayer.playVideo(); } catch (e) {}
        }
    }

    /* ============ نهاية اللعبة ============ */
    function endGame() {
        state.running = false;
        cancelAnimationFrame(state.rafId);
        el.play.hidden = true;
        el.end.hidden = false;

        /* حساب الدقة */
        const total = state.perfect + state.good + state.miss;
        const acc = total > 0 ? Math.round(((state.perfect + state.good) / total) * 100) : 0;

        /* الرتبة */
        let rank = 'D', msg = 'حاول مرة تانية 💪', icon = '😅';
        if (acc >= 98 && state.maxCombo >= 40) { rank = 'S+'; msg = 'أسطورة زمزم!'; icon = '👑'; }
        else if (acc >= 95 && state.maxCombo >= 25) { rank = 'S'; msg = 'لا يُقهر!'; icon = '🏆'; }
        else if (acc >= 88) { rank = 'A'; msg = 'أداء ممتاز!'; icon = '🥇'; }
        else if (acc >= 75) { rank = 'B'; msg = 'جيد جداً!'; icon = '🥈'; }
        else if (acc >= 55) { rank = 'C'; msg = 'لا بأس، كمّل!'; icon = '🥉'; }

        el.endRank.textContent = rank;
        el.endRank.dataset.rank = rank.charAt(0);
        el.endIcon.textContent = icon;
        el.endTitle.textContent = rank === 'S+' || rank === 'S' ? 'أسطوري!' : 'مبروك!';
        el.endMsg.textContent = msg;
        el.endScore.textContent = state.score.toLocaleString('en');
        el.endCombo.textContent = 'x' + state.maxCombo;
        el.endAcc.textContent = acc + '%';
        el.endPerfect.textContent = state.perfect;
        el.endMiss.textContent = state.miss;

        /* عملات */
        const coins = Math.floor(state.score / 10);
        el.endCoins.textContent = '+' + coins;
        if (coins > 0 && window.moudyCoins) {
            window.moudyCoins.add(coins);
        }
        /* ⭐ نظام النقاط */
var pointsMap = {
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 600
};
var basePoints = pointsMap[state.level] || 100;
if (state.mode === 'arcade') basePoints = Math.floor(basePoints * 1.5);
if (rank === 'S' || rank === 'S+') basePoints = Math.floor(basePoints * 1.2);
if (window.moudyPoints) {
    window.moudyPoints.add(basePoints, '🎹 زمزم');
}

        /* تحدي اليوم */
        if (window.moudyChallenge) window.moudyChallenge.trackGame('zamzam');

        /* أفضل نتيجة */
        const key = 'moudy-zamzam-best-' + state.mode + '-lv' + state.level;
        let prev = 0;
        try { prev = Number(localStorage.getItem(key) || 0); } catch (e) {}
        if (state.score > prev) {
            try { localStorage.setItem(key, String(state.score)); } catch (e) {}
            el.best.textContent = '🎉 رقم قياسي جديد!';
        } else {
            el.best.textContent = '🏅 أفضل نتيجة: ' + prev.toLocaleString('en');
        }

        /* إيقاف يوتيوب */
        if (ytPlayer && ytPlayer.pauseVideo) {
            try { ytPlayer.pauseVideo(); } catch (e) {}
        }
    }

    /* ============ أزرار ============ */
    el.startBtn.addEventListener('click', startLevel);
    el.pauseBtn.addEventListener('click', pause);
    el.resume.addEventListener('click', resume);
    el.restartBtn.addEventListener('click', function () {
        el.pause.hidden = true;
        state.paused = false;
        startLevel();
    });
    el.quitBtn.addEventListener('click', function () {
        el.pause.hidden = true;
        state.paused = false;
        state.running = false;
        cancelAnimationFrame(state.rafId);
        el.play.hidden = true;
        el.start.hidden = false;
        if (ytPlayer && ytPlayer.pauseVideo) {
            try { ytPlayer.pauseVideo(); } catch (e) {}
        }
    });
    el.againBtn.addEventListener('click', startLevel);
    el.backBtn.addEventListener('click', function () {
        state.running = false;
        cancelAnimationFrame(state.rafId);
        el.end.hidden = true;
        el.start.hidden = false;
    });

    el.muteBtn.addEventListener('click', function () {
        state.muted = !state.muted;
        el.muteBtn.textContent = state.muted ? '🔇' : '🔊';
        if (ytPlayer && ytPlayer.setVolume) {
            try { ytPlayer.setVolume(state.muted ? 0 : 60); } catch (e) {}
        }
    });

    /* كيبورد */
    document.addEventListener('keydown', function (e) {
        if (!state.running || state.paused) return;
        const k = e.key;
        if (k === 'Escape') { pause(); return; }
        if (k === ' ' || k === 'Spacebar') { e.preventDefault(); pause(); return; }

        let col = -1;
        if (k === 'ArrowLeft' || k === 'a' || k === 'A') col = 0;
        else if (k === 'ArrowDown' || k === 's' || k === 'S') col = 1;
        else if (k === 'ArrowUp' || k === 'w' || k === 'W') col = 2;
        else if (k === 'ArrowRight' || k === 'd' || k === 'D') col = 3;

        if (col === -1) return;
        /* دور على أقرب بلاطة بهذا العمود */
        let best = null, bestY = -Infinity;
        state.tiles.forEach(function (t) {
            if (t.tapped || t.col !== col) return;
            if (t.y > bestY) { bestY = t.y; best = t; }
        });
        if (best) tapTile(best);
    });
    /* لو المستخدم ساب الصفحة، وقّف */
    document.addEventListener('visibilitychange', function () {
        if (document.hidden && state.running && !state.paused) pause();
    });

    /* ============ الضغط على مكان فاضي = miss ============ */
    board.addEventListener('pointerdown', function (e) {
        if (!state.running || state.paused) return;
        /* إذا الضغط على بلاطة → لا شي (البلاطة بتتعامل معه) */
        if (e.target.classList.contains('zz-tile')) return;
        if (e.target.closest('.zz-tile')) return;

        /* ضغط على مكان فاضي → خسارة روح */
        state.combo = 0;
        state.miss++;
        state.lives--;
        sfxMiss();
        el.feedback.textContent = '❌ ضغطت بمكان فاضي!';
        el.feedback.className = 'zz-feedback fail';

        if (navigator.vibrate && !state.muted) {
            try { navigator.vibrate([80, 50, 80]); } catch (e) {}
        }

        updateHud();

        if (state.lives <= 0) endGame();
    });
})();



    


/* ==================================================================
   قسم: مودي Wrapped (wrapped.html)
   ================================================================== */
(function initWrapped() {
    const slider = document.getElementById('wrSlider');
    if (!slider) return;

    const el = {
        slider:     slider,
        dots:       document.getElementById('wrDots'),
        prev:       document.getElementById('wrPrev'),
        next:       document.getElementById('wrNext'),
        share:      document.getElementById('wrShare'),
        from:       document.getElementById('wrFrom'),
        celebrate:  document.getElementById('wrCelebrate'),
        celebrateBtn: document.getElementById('wrCelebrateBtn'),
        celebrateClose: document.getElementById('wrCelebrateClose'),
        filterBtns: document.querySelectorAll('.wr-filter-btn')
    };

    let currentSlide = 0;
    let totalSlides = 0;
    let currentRange = 'all';

    function readAllStats() {
        const out = {
            songsPlayed: 0, gamesPlayed: 0, gameCounts: {},
            songCounts: {}, visits: 0, daysVisited: [],
            firstSeen: '—',
            streak: { current: 0, best: 0, totalDays: 0, points: 0 },
            coins: 0, wheelSpins: 0, boxesOpened: 0, legendaryBoxes: 0,
            challengesCompleted: 0, sortwaterStars: 0, zamzamBest: 0,
            playlists: 0, photosFavs: 0
        };

        try {
            const st = JSON.parse(localStorage.getItem('moudy-stats') || '{}');
            out.songsPlayed = st.songsPlayed || 0;
            out.gamesPlayed = st.gamesPlayed || 0;
            out.gameCounts = st.gameCounts || {};
            out.songCounts = st.songCounts || {};
            out.visits = st.visits || 0;
            out.daysVisited = st.daysVisited || [];
            out.firstSeen = st.firstSeen || '—';
        } catch (e) {}

        try {
            const s = JSON.parse(localStorage.getItem('moudy-streak') || '{}');
            out.streak.current = s.currentStreak || 0;
            out.streak.best = s.bestStreak || 0;
            out.streak.totalDays = s.totalDays || 0;
            out.streak.points = s.points || 0;
        } catch (e) {}

        try {
            const c = JSON.parse(localStorage.getItem('moudy-coins') || '{}');
            out.coins = c.total || 0;
        } catch (e) {}

        try {
            const w = JSON.parse(localStorage.getItem('moudy-wheel') || '{}');
            out.wheelSpins = w.totalSpins || 0;
        } catch (e) {}

        try {
            const b = JSON.parse(localStorage.getItem('moudy-box') || '{}');
            out.boxesOpened = b.total || 0;
            out.legendaryBoxes = b.legendary || 0;
        } catch (e) {}

        try {
            const sw = JSON.parse(localStorage.getItem('moudy-sortwater') || '{}');
            out.sortwaterStars = Object.values(sw.stars || {}).reduce((a, b) => a + b, 0);
        } catch (e) {}

        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('moudy-zamzam-best-')) {
                const v = Number(localStorage.getItem(k) || 0);
                if (v > out.zamzamBest) out.zamzamBest = v;
            }
        }

        try {
            const p = JSON.parse(localStorage.getItem('moudy-playlists') || '{}');
            out.playlists = (p.playlists || []).length;
        } catch (e) {}

        try {
            const f = JSON.parse(localStorage.getItem('moudy-photos-fav') || '[]');
            out.photosFavs = f.length;
        } catch (e) {}

        return out;
    }

    const GAME_NAMES = {
        memory: '🃏 ذاكرة الأغاني',
        emoji: '🎨 خمّن بالإيموجي',
        missing: '🔍 الكلمة المفقودة',
        scramble: '🎼 رتّب الكلمات',
        guess: '🎵 خمّن من الكلمات',
        zamzam: '🎹 زمزم',
        sortwater: '🎯 ترتيب السوائل'
    };

    function gameName(id) { return GAME_NAMES[id] || id; }

    function topEntries(obj, n) {
        return Object.entries(obj || {}).sort((a, b) => b[1] - a[1]).slice(0, n);
    }

    function buildSlides(stats) {
        const slides = [];
        const totalGame = stats.gamesPlayed;
        const totalSong = stats.songsPlayed;
        const topGames = topEntries(stats.gameCounts, 3);

        slides.push({
            theme: 'theme-intro',
            html: `<div class="wr-slide-icon">📊</div>
                <h1 class="wr-slide-title">مودي Wrapped</h1>
                <p class="wr-slide-sub">رحلتك مع مودي العربي</p>
                <div class="wr-slide-hint">👇 اسحب أو استعمل الأسهم</div>`
        });

        slides.push({
            theme: 'theme-green',
            html: `<div class="wr-slide-icon">🎵</div>
                <p class="wr-slide-label">سمعت</p>
                <div class="wr-big-num">${totalSong}</div>
                <p class="wr-slide-sub">أغنية</p>
                <p class="wr-slide-small">${totalSong > 0 ? 'موسيقى مودي رافقتك 🎧' : 'ابدأ اسمع أغاني مودي!'}</p>`
        });

        slides.push({
            theme: 'theme-purple',
            html: `<div class="wr-slide-icon">🎮</div>
                <p class="wr-slide-label">لعبت</p>
                <div class="wr-big-num">${totalGame}</div>
                <p class="wr-slide-sub">لعبة</p>
                <p class="wr-slide-small">${totalGame > 0 ? 'كنت بطل! 🏆' : 'جرّب ألعاب مودي!'}</p>`
        });

        if (topGames.length > 0) {
            slides.push({
                theme: 'theme-gold',
                html: `<div class="wr-slide-icon">🏆</div>
                    <p class="wr-slide-label">لعبتك المفضلة</p>
                    <div class="wr-fav-game">${gameName(topGames[0][0])}</div>
                    <p class="wr-slide-small">لعبتها <strong>${topGames[0][1]}</strong> مرة</p>
                    ${topGames[1] ? `<p class="wr-slide-tiny">ثاني أكثر: ${gameName(topGames[1][0])} (${topGames[1][1]})</p>` : ''}`
            });
        }

        slides.push({
            theme: 'theme-orange',
            html: `<div class="wr-slide-icon">🔥</div>
                <p class="wr-slide-label">أطول سلسلة أيام</p>
                <div class="wr-big-num">${stats.streak.best}</div>
                <p class="wr-slide-sub">يوم متواصل</p>
                <p class="wr-slide-small">${stats.streak.totalDays} يوم إجمالي — ${stats.streak.points} نقطة</p>`
        });

        slides.push({
            theme: 'theme-cyan',
            html: `<div class="wr-slide-icon">🪙</div>
                <p class="wr-slide-label">جمعت</p>
                <div class="wr-big-num">${stats.coins.toLocaleString('en')}</div>
                <p class="wr-slide-sub">عملة</p>
                <p class="wr-slide-small">${stats.coins >= 5000 ? 'وصلت هدف الرسالة لمودي! 💌' : 'باقي ' + (5000 - stats.coins).toLocaleString('en') + ' عملة للرسالة'}</p>`
        });

        slides.push({
            theme: 'theme-pink',
            html: `<div class="wr-slide-icon">🎁</div>
                <p class="wr-slide-label">فتحت / دوّرت</p>
                <div class="wr-pair-nums">
                    <div><div class="wr-num-med">${stats.boxesOpened}</div><div class="wr-num-label">صندوق</div></div>
                    <div><div class="wr-num-med">${stats.wheelSpins}</div><div class="wr-num-label">عجلة</div></div>
                </div>
                ${stats.legendaryBoxes > 0 ? `<p class="wr-slide-small">🌟 ${stats.legendaryBoxes} مفاجأة أسطورية!</p>` : ''}`
        });

        if (stats.sortwaterStars > 0 || stats.zamzamBest > 0) {
            slides.push({
                theme: 'theme-teal',
                html: `<div class="wr-slide-icon">⭐</div>
                    <p class="wr-slide-label">إنجازاتك</p>
                    <div class="wr-pair-nums">
                        ${stats.sortwaterStars > 0 ? `<div><div class="wr-num-med">${stats.sortwaterStars}</div><div class="wr-num-label">⭐ نجمة</div></div>` : ''}
                        ${stats.zamzamBest > 0 ? `<div><div class="wr-num-med">${stats.zamzamBest.toLocaleString('en')}</div><div class="wr-num-label">🎹 زمزم</div></div>` : ''}
                    </div>`
            });
        }

        let rank = 'مبتدئ', rankIcon = '🌱', rankColor = 'theme-intro';
        const totalActivity = totalSong + totalGame + stats.streak.totalDays + stats.wheelSpins;
        if (totalActivity >= 200)      { rank = 'أسطورة';   rankIcon = '👑'; rankColor = 'theme-gold'; }
        else if (totalActivity >= 100) { rank = 'محترف';    rankIcon = '🏆'; rankColor = 'theme-orange'; }
        else if (totalActivity >= 50)  { rank = 'متقدم';    rankIcon = '🥇'; rankColor = 'theme-green'; }
        else if (totalActivity >= 20)  { rank = 'متوسط';    rankIcon = '🥈'; rankColor = 'theme-purple'; }
        else if (totalActivity >= 5)   { rank = 'مبتدئ +';  rankIcon = '🥉'; rankColor = 'theme-cyan'; }

        slides.push({
            theme: rankColor,
            html: `<div class="wr-slide-icon">${rankIcon}</div>
                <p class="wr-slide-label">رتبتك مع مودي</p>
                <div class="wr-rank-name">${rank}</div>
                <p class="wr-slide-small">استمر — مودي فخور فيك ❤️</p>`
        });

        slides.push({
            theme: 'theme-final',
            html: `<div class="wr-slide-icon">📤</div>
                <h2 class="wr-slide-title">شارك رحلتك!</h2>
                <p class="wr-slide-sub">خد صورة وشاركها مع أصحابك</p>
                <div class="wr-final-summary">
                    <span>🎵 ${totalSong} أغنية</span>
                    <span>🎮 ${totalGame} لعبة</span>
                    <span>🔥 ${stats.streak.best} يوم</span>
                    <span>🪙 ${stats.coins} عملة</span>
                </div>`
        });

        return slides;
    }

    function render() {
        const stats = readAllStats();
        const slides = buildSlides(stats);
        totalSlides = slides.length;
        currentSlide = 0;

        slider.innerHTML = '';
        el.dots.innerHTML = '';

        slides.forEach((slide, i) => {
            const div = document.createElement('div');
            div.className = 'wr-slide ' + slide.theme + (i === 0 ? ' active' : '');
            div.innerHTML = slide.html;
            slider.appendChild(div);
            const dot = document.createElement('button');
            dot.className = 'wr-dot' + (i === 0 ? ' active' : '');
            dot.type = 'button';
            dot.dataset.idx = i;
            dot.addEventListener('click', () => goTo(i));
            el.dots.appendChild(dot);
        });

        updateArrows();
        el.from.textContent = 'بدأت رحلتك في ' + stats.firstSeen;
    }

    function goTo(idx) {
        if (idx < 0 || idx >= totalSlides) return;
        currentSlide = idx;
        slider.querySelectorAll('.wr-slide').forEach(function (s, i) {
            if (i === idx) s.classList.add('active');
            else s.classList.remove('active');
        });
        updateArrows();
    }

    function updateArrows() {
        el.prev.disabled = currentSlide === 0;
        el.next.disabled = currentSlide === totalSlides - 1;
        el.dots.querySelectorAll('.wr-dot').forEach((d, i) => {
            d.classList.toggle('active', i === currentSlide);
        });
    }

    el.prev.addEventListener('click', () => goTo(currentSlide - 1));
    el.next.addEventListener('click', () => goTo(currentSlide + 1));



    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goTo(currentSlide + 1);
        if (e.key === 'ArrowRight') goTo(currentSlide - 1);
    });

    el.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            el.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentRange = btn.dataset.range;
            render();
        });
    });

    el.share.addEventListener('click', () => {
        const current = slider.children[currentSlide];
        if (!current || typeof html2canvas === 'undefined') { shareAsText(); return; }

        el.share.disabled = true;
        el.share.textContent = '⏳ جاري التحضير...';

        html2canvas(current, {
            backgroundColor: null, scale: 2, logging: false, useCORS: true
        }).then(canvas => {
            canvas.toBlob(blob => {
                const file = new File([blob], 'moudy-wrapped.png', { type: 'image/png' });
                const text = '📊 مودي Wrapped تبعي!\n\n#مودي_العربي';
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    navigator.share({ files: [file], title: 'مودي Wrapped', text: text }).catch(() => downloadBlob(blob));
                } else { downloadBlob(blob); }
                el.share.disabled = false;
                el.share.innerHTML = '<span>📤</span> شارك الـ Wrapped';
            });
        }).catch(() => {
            shareAsText();
            el.share.disabled = false;
            el.share.innerHTML = '<span>📤</span> شارك الـ Wrapped';
        });
    });

    function downloadBlob(blob) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'moudy-wrapped-' + Date.now() + '.png';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 3000);
        showToast('✅ تحمّلت الصورة!');
    }

    function shareAsText() {
        const s = readAllStats();
        const text = `📊 مودي Wrapped تبعي:\n\n🎵 ${s.songsPlayed} أغنية\n🎮 ${s.gamesPlayed} لعبة\n🔥 ${s.streak.best} يوم Streak\n🪙 ${s.coins} عملة\n\n#مودي_العربي`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => showToast('✅ تم النسخ!'));
        } else { showToast('⚠️ المتصفح ما بيدعم'); }
    }

    function showToast(msg) {
        let t = document.querySelector('.wr-toast');
        if (!t) { t = document.createElement('div'); t.className = 'wr-toast'; document.body.appendChild(t); }
        t.textContent = msg;
        setTimeout(() => t.classList.add('show'), 30);
        setTimeout(() => t.classList.remove('show'), 2500);
    }

    function checkYearEnd() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const key = 'moudy-wrapped-seen-' + year;
        if (month !== 12) return;
        if (localStorage.getItem(key)) return;
        setTimeout(() => { el.celebrate.hidden = false; }, 1500);
    }

    el.celebrateBtn.addEventListener('click', () => {
        el.celebrate.hidden = true;
        const year = new Date().getFullYear();
        try { localStorage.setItem('moudy-wrapped-seen-' + year, '1'); } catch (e) {}
    });

    el.celebrateClose.addEventListener('click', () => {
        el.celebrate.hidden = true;
        const year = new Date().getFullYear();
        try { localStorage.setItem('moudy-wrapped-seen-' + year, '1'); } catch (e) {}
    });

    render();
    checkYearEnd();


})();








/* ==================================================================
   قسم: لعبة خمّن الأغنية (MP3) — guess-song.html
   ------------------------------------------------------------------
   - 87 مقطع MP3 محلية بـ audio/songs/
   - البيانات جوّا الكود مباشرة (بدون songs.json)
   - 3 مستويات (سهل 7s / متوسط 5.5s / صعب 3.5s)
   - 4 خيارات + Streak + نقاط + إعادة المقطع
   ================================================================== */
   (function initGuessSong() {
    const answers = $('gsAnswers');
    if (!answers) return;

    /* ---------- بيانات الأغاني (87 أغنية) ---------- */
    const SONGS_DATA = [
        { id: 'song_01', title: 'مصاب',              file: 'song_01.mp3' },
        { id: 'song_02', title: 'ماني شايف',         file: 'song_02.mp3' },
        { id: 'song_03', title: 'مامليت',            file: 'song_03.mp3' },
        { id: 'song_04', title: 'ايزي',              file: 'song_04.mp3' },
        { id: 'song_05', title: 'انتاج محلي',        file: 'song_05.mp3' },
        { id: 'song_06', title: '٧ طلقات',           file: 'song_06.mp3' },
        { id: 'song_07', title: 'خورفكان',           file: 'song_07.mp3' },
        { id: 'song_08', title: 'نجم ليل',           file: 'song_08.mp3' },
        { id: 'song_09', title: 'يا ريت',            file: 'song_09.mp3' },
        { id: 'song_10', title: 'يا صبر الله',       file: 'song_10.mp3' },
        { id: 'song_11', title: 'يسطا',              file: 'song_11.mp3' },
        { id: 'song_12', title: 'غرناطة',            file: 'song_12.mp3' },
        { id: 'song_13', title: 'ماهر',              file: 'song_13.mp3' },
        { id: 'song_14', title: 'إنتربول',           file: 'song_14.mp3' },
        { id: 'song_15', title: 'فرصة',              file: 'song_15.mp3' },
        { id: 'song_16', title: 'دور على مغزى',      file: 'song_16.mp3' },
        { id: 'song_17', title: 'بصارة',             file: 'song_17.mp3' },
        { id: 'song_18', title: 'بتمنى انساك',       file: 'song_18.mp3' },
        { id: 'song_19', title: 'بطن الحوت',         file: 'song_19.mp3' },
        { id: 'song_20', title: 'سكابا',             file: 'song_20.mp3' },
        { id: 'song_21', title: '14 ونص',            file: 'song_21.mp3' },
        { id: 'song_22', title: '5 مِلي',            file: 'song_22.mp3' },
        { id: 'song_23', title: 'كارما',             file: 'song_23.mp3' },
        { id: 'song_24', title: 'الانترو',           file: 'song_24.mp3' },
        { id: 'song_25', title: 'الطير',             file: 'song_25.mp3' },
        { id: 'song_26', title: 'جوسي',              file: 'song_26.mp3' },
        { id: 'song_27', title: 'جونسيبا',           file: 'song_27.mp3' },
        { id: 'song_28', title: 'دقيقة ونص',         file: 'song_28.mp3' },
        { id: 'song_29', title: 'ذكريات',            file: 'song_29.mp3' },
        { id: 'song_30', title: 'روبن مود',          file: 'song_30.mp3' },
        { id: 'song_31', title: 'شاهين',             file: 'song_31.mp3' },
        { id: 'song_32', title: 'طريق اللاذقية',     file: 'song_32.mp3' },
        { id: 'song_33', title: 'مسلول',             file: 'song_33.mp3' },
        { id: 'song_34', title: 'مونستر',            file: 'song_34.mp3' },
        { id: 'song_35', title: 'ناسا',              file: 'song_35.mp3' },
        { id: 'song_36', title: 'نايكي',             file: 'song_36.mp3' },
        { id: 'song_37', title: 'نو نو',             file: 'song_37.mp3' },
        { id: 'song_38', title: 'نوبة',              file: 'song_38.mp3' },
        { id: 'song_39', title: 'ياناصر',            file: 'song_39.mp3' },
        { id: 'song_40', title: 'يوم الحرية',        file: 'song_40.mp3' },
        { id: 'song_41', title: 'إعتراف نفسي',       file: 'song_41.mp3' },
        { id: 'song_42', title: 'ماتت قلوب الناس',   file: 'song_42.mp3' },
        { id: 'song_43', title: 'اسد سقار',          file: 'song_43.mp3' },
        { id: 'song_44', title: 'عربي كاتبي',        file: 'song_44.mp3' },
        { id: 'song_45', title: 'أنا الخطأ',         file: 'song_45.mp3' },
        { id: 'song_46', title: 'إدمانٌ مؤبد',       file: 'song_46.mp3' },
        { id: 'song_47', title: 'الأرض السعيدة',     file: 'song_47.mp3' },
        { id: 'song_48', title: 'بيانو',             file: 'song_48.mp3' },
        { id: 'song_49', title: 'بيكو',              file: 'song_49.mp3' },
        { id: 'song_50', title: 'تشكيل عصابي',       file: 'song_50.mp3' },
        { id: 'song_51', title: 'خطاف',              file: 'song_51.mp3' },
        { id: 'song_52', title: 'شاهين (ريميكس)',    file: 'song_52.mp3' },
        { id: 'song_53', title: 'صراع نفسي',         file: 'song_53.mp3' },
        { id: 'song_54', title: 'مسرحية',            file: 'song_54.mp3' },
        { id: 'song_55', title: 'نساني',             file: 'song_55.mp3' },
        { id: 'song_56', title: 'نص الليل',          file: 'song_56.mp3' },
        { id: 'song_57', title: 'نفس الاعتراف',      file: 'song_57.mp3' },
        { id: 'song_58', title: 'هلأ عرفت أبي',      file: 'song_58.mp3' },
        { id: 'song_59', title: 'وسط النيل',         file: 'song_59.mp3' },
        { id: 'song_60', title: 'فرصة (نسخة 2023)',  file: 'song_60.mp3' },
        { id: 'song_61', title: 'اشتقتيلي',          file: 'song_61.mp3' },
        { id: 'song_62', title: 'أمشي',              file: 'song_62.mp3' },
        { id: 'song_63', title: 'الحبيبة',           file: 'song_63.mp3' },
        { id: 'song_64', title: 'الغُربة',           file: 'song_64.mp3' },
        { id: 'song_65', title: 'باب شرقي',          file: 'song_65.mp3' },
        { id: 'song_66', title: 'بفوضى',             file: 'song_66.mp3' },
        { id: 'song_67', title: 'تركتا',             file: 'song_67.mp3' },
        { id: 'song_68', title: 'تسع ساعات',         file: 'song_68.mp3' },
        { id: 'song_69', title: 'تصفية حساب',        file: 'song_69.mp3' },
        { id: 'song_70', title: 'تهديد',             file: 'song_70.mp3' },
        { id: 'song_71', title: 'توعديني',           file: 'song_71.mp3' },
        { id: 'song_72', title: 'جرح فينا',          file: 'song_72.mp3' },
        { id: 'song_73', title: 'فلاديمير بوتين',    file: 'song_73.mp3' },
        { id: 'song_74', title: 'روليكس',            file: 'song_74.mp3' },
        { id: 'song_75', title: 'غلط',               file: 'song_75.mp3' },
        { id: 'song_76', title: 'فلسفة',             file: 'song_76.mp3' },
        { id: 'song_77', title: 'فيراري',            file: 'song_77.mp3' },
        { id: 'song_78', title: 'قاتل مأجور',        file: 'song_78.mp3' },
        { id: 'song_79', title: 'مافي قضية',         file: 'song_79.mp3' },
        { id: 'song_80', title: 'مانو معاشر',        file: 'song_80.mp3' },
        { id: 'song_81', title: 'ماهر (اسكوبار)',    file: 'song_81.mp3' },
        { id: 'song_82', title: 'مسلمين وكفار',      file: 'song_82.mp3' },
        { id: 'song_83', title: 'ميت',               file: 'song_83.mp3' },
        { id: 'song_84', title: 'حكي كتير',          file: 'song_84.mp3' },
        { id: 'song_85', title: 'هوس',               file: 'song_85.mp3' },
        { id: 'song_86', title: 'ولاد القحاب',       file: 'song_86.mp3' },
        { id: 'song_87', title: 'قد التحدي',         file: 'song_87.mp3' }
    ];

    /* ---------- إعدادات المستويات ---------- */
    const LEVELS = {
        easy:   { time: 22, clipTime: 7,   pick: 20, name: 'سهل' },
        medium: { time: 18, clipTime: 5.5, pick: 20, name: 'متوسط' },
        hard:   { time: 14, clipTime: 3.5, pick: 20, name: 'صعب' }
    };

    /* ---------- العناصر ---------- */
    const el = {
        start:    $('gsStart'),
        play:     $('gsPlay'),
        end:      $('gsEnd'),
        qNum:     $('gsQNum'),
        score:    $('gsScore'),
        streak:   $('gsStreak'),
        timer:    $('gsTimer'),
        timerBox: $('gsTimerBox'),
        playBtn:  $('gsPlayBtn'),
        playIcon: $('gsPlayIcon'),
        clipFill: $('gsClipFill'),
        hint:     $('gsHint'),
        answers:  $('gsAnswers'),
        feedback: $('gsFeedback'),
        back:     $('gsBack'),
        endIcon:  $('gsEndIcon'),
        endTitle: $('gsEndTitle'),
        endStats: $('gsEndStats'),
        again:    $('gsAgain'),
        endBack:  $('gsEndBack')
    };

    /* ---------- الحالة ---------- */
    const state = {
        level: null,
        queue: [],
        index: 0,
        score: 0,
        streak: 0,
        bestStreak: 0,
        timerId: null,
        fillTimerId: null,
        clipStopId: null,
        timeLeft: 0,
        timerStarted: false,
        locked: false,
        audio: null,
        playing: false,
        clipDuration: 0
    };

    /* ---------- مشغل الصوت ---------- */
    state.audio = new Audio();
    state.audio.preload = 'auto';

    state.audio.addEventListener('playing', function () {
        state.playing = true;
        el.playBtn.classList.add('playing');
        el.playIcon.textContent = '⏸';
        el.hint.textContent = '🔊 جاري التشغيل...';
        if (!state.timerStarted) {
            state.timerStarted = true;
            startTimer();
        }
    });

    state.audio.addEventListener('ended', function () {
        stopPlayingUI();
        el.hint.textContent = '👆 اختر الأغنية الصح';
    });

    state.audio.addEventListener('error', function () {
        el.hint.textContent = '⚠️ ما قدرنا نحمّل المقطع';
        setTimeout(nextQuestion, 1200);
    });

    /* ---------- خلط عشوائي ---------- */
    function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
    }

    /* ---------- بدء مستوى ---------- */
    function startLevel(levelKey) {
        const cfg = LEVELS[levelKey];
        if (!cfg) return;

        if (SONGS_DATA.length < 4) {
            alert('لازم 4 أغاني عالأقل بلعبة');
            return;
        }

        clearInterval(state.timerId);
        clearInterval(state.fillTimerId);
        clearTimeout(state.clipStopId);
        stopAudio();

        if (window.moudyChallenge) window.moudyChallenge.trackGame('guessSong');

        state.level = levelKey;
        state.score = 0;
        state.streak = 0;
        state.bestStreak = 0;
        state.index = 0;
        state.locked = false;

        const pickCount = Math.min(cfg.pick, SONGS_DATA.length);
        state.queue = shuffle(SONGS_DATA).slice(0, pickCount);

        el.start.hidden = true;
        el.end.hidden = true;
        el.play.hidden = false;

        el.score.textContent = '0';
        el.streak.textContent = '0';
        el.feedback.textContent = '';
        el.feedback.className = 'gs-feedback';

        showQuestion();
    }

    /* ---------- عرض سؤال ---------- */
    function showQuestion() {
        const cfg = LEVELS[state.level];
        const q = state.queue[state.index];
        if (!q) { endGame(); return; }

        el.qNum.textContent = (state.index + 1) + ' / ' + state.queue.length;

        state.playing = false;
        state.timerStarted = false;
        state.clipDuration = cfg.clipTime;
        el.clipFill.style.width = '0%';
        el.playBtn.classList.remove('playing');
        el.playIcon.textContent = '▶';
        el.playBtn.disabled = false;
        el.hint.textContent = '🎧 جاري تجهيز المقطع...';
        el.timerBox.classList.remove('warning', 'danger');
        el.timer.textContent = cfg.time;

        state.audio.src = 'audio/songs/' + q.file;
        state.audio.load();

        const wrongPool = shuffle(
            SONGS_DATA.filter(function (s) {
                if (s.id === q.id) return false;
                if (s.title === q.title) return false;
                return true;
            })
        ).slice(0, 3);

        const options = shuffle([q].concat(wrongPool));

        el.answers.innerHTML = '';
        options.forEach(function (song) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'gs-answer';
            btn.textContent = song.title;
            btn.dataset.id = song.id;
            btn.disabled = true;
            btn.addEventListener('click', function () {
                handleAnswer(btn, song.id, q.id);
            });
            el.answers.appendChild(btn);
        });

        el.feedback.textContent = '';
        el.feedback.className = 'gs-feedback';

        state.locked = false;

        setTimeout(function () {
            if (state.queue[state.index] === q) {
                playClip();
            }
        }, 500);
    }

    /* ---------- تشغيل المقطع ---------- */
    function playClip() {
        if (state.locked || state.playing) return;
        if (!state.audio || !state.audio.src) return;

        el.timerBox.classList.remove('warning', 'danger');

        el.answers.querySelectorAll('.gs-answer').forEach(function (b) {
            if (!b.classList.contains('correct') && !b.classList.contains('wrong')) {
                b.disabled = false;
            }
        });

        try { state.audio.currentTime = 0; } catch (e) {}

        const p = state.audio.play();
        if (p && typeof p.catch === 'function') {
            p.catch(function () {
                el.hint.textContent = '🎧 اضغط الزر لتشغيل المقطع';
                el.playBtn.disabled = false;
            });
        }

        const startTs = Date.now();
        clearInterval(state.fillTimerId);
        state.fillTimerId = setInterval(function () {
            const elapsed = (Date.now() - startTs) / 1000;
            const percent = Math.min(100, (elapsed / state.clipDuration) * 100);
            el.clipFill.style.width = percent + '%';
        }, 50);

        clearTimeout(state.clipStopId);
        state.clipStopId = setTimeout(function () {
            stopAudio();
            el.hint.textContent = '👆 اختر الأغنية الصح';
        }, state.clipDuration * 1000);
    }

    /* ---------- إيقاف الصوت ---------- */
    function stopAudio() {
        clearInterval(state.fillTimerId);
        clearTimeout(state.clipStopId);
        if (state.audio) {
            try {
                state.audio.pause();
                state.audio.currentTime = 0;
            } catch (e) {}
        }
        stopPlayingUI();
    }

    function stopPlayingUI() {
        state.playing = false;
        el.playBtn.classList.remove('playing');
        el.playIcon.textContent = '▶';
    }

    /* ---------- المؤقت ---------- */
    function startTimer() {
        const cfg = LEVELS[state.level];
        clearInterval(state.timerId);
        state.timeLeft = cfg.time;
        el.timer.textContent = state.timeLeft;
        el.timerBox.classList.remove('warning', 'danger');

        state.timerId = setInterval(function () {
            state.timeLeft--;
            el.timer.textContent = state.timeLeft;

            if (state.timeLeft <= 5) {
                el.timerBox.classList.remove('warning');
                el.timerBox.classList.add('danger');
            } else if (state.timeLeft <= 10) {
                el.timerBox.classList.add('warning');
            }

            if (state.timeLeft <= 0) {
                clearInterval(state.timerId);
                handleTimeout();
            }
        }, 1000);
    }

    /* ---------- معالجة الإجابة ---------- */
    function handleAnswer(btn, chosenId, correctId) {
        if (state.locked) return;
        state.locked = true;
        clearInterval(state.timerId);
        stopAudio();
        el.playBtn.disabled = true;

        const q = state.queue[state.index];
        const correctTitle = q.title;

        el.answers.querySelectorAll('.gs-answer').forEach(function (b) {
            b.disabled = true;
            if (b.dataset.id === correctId) b.classList.add('correct');
            else if (b === btn) b.classList.add('wrong');
            else b.classList.add('dimmed');
        });

        if (chosenId === correctId) {
            state.streak++;
            if (state.streak > state.bestStreak) state.bestStreak = state.streak;
            state.score += 100;
            el.score.textContent = state.score;
            el.streak.textContent = state.streak;
            el.feedback.textContent = '✅ صح!';
            el.feedback.className = 'gs-feedback ok';
        } else {
            state.streak = 0;
            el.streak.textContent = '0';
            el.feedback.textContent = '❌ كانت: ' + correctTitle;
            el.feedback.className = 'gs-feedback fail';
        }

        setTimeout(nextQuestion, 1600);
    }

    /* ---------- انتهى الوقت ---------- */
    function handleTimeout() {
        if (state.locked) return;
        state.locked = true;
        stopAudio();
        el.playBtn.disabled = true;

        const q = state.queue[state.index];
        el.answers.querySelectorAll('.gs-answer').forEach(function (b) {
            b.disabled = true;
            if (b.dataset.id === q.id) b.classList.add('correct');
            else b.classList.add('dimmed');
        });

        state.streak = 0;
        el.streak.textContent = '0';
        el.feedback.textContent = '⏰ خلص الوقت! كانت: ' + q.title;
        el.feedback.className = 'gs-feedback fail';

        setTimeout(nextQuestion, 1800);
    }

    /* ---------- السؤال التالي ---------- */
    function nextQuestion() {
        state.index++;
        if (state.index >= state.queue.length) {
            endGame();
        } else {
            showQuestion();
        }
    }

    /* ---------- نهاية اللعبة ---------- */
    function endGame() {
        clearInterval(state.timerId);
        clearInterval(state.fillTimerId);
        clearTimeout(state.clipStopId);
        stopAudio();
        el.play.hidden = true;
        el.end.hidden = false;

        const maxScore = state.queue.length * 100;
        const percent = Math.round((state.score / maxScore) * 100);

        let icon, title;
        if (percent >= 90)      { icon = '🏆'; title = 'أسطورة!'; }
        else if (percent >= 70) { icon = '🥇'; title = 'ممتاز!'; }
        else if (percent >= 50) { icon = '🥈'; title = 'جيد جداً!'; }
        else if (percent >= 30) { icon = '🥉'; title = 'كويس!'; }
        else                    { icon = '😅'; title = 'حاول مرة تانية'; }

        el.end.classList.remove('lose');
        if (percent < 30) el.end.classList.add('lose');

        el.endIcon.textContent = icon;
        el.endTitle.textContent = title;
        el.endStats.innerHTML =
            'النقاط: <strong>' + state.score + '</strong><br>' +
            'النسبة: <strong>' + percent + '%</strong>';

        /* ⭐ نظام النقاط */
        var pointsMap = { easy: 40, medium: 80, hard: 130 };
        var basePoints = pointsMap[state.level] || 40;
        if (window.moudyPoints) {
            window.moudyPoints.add(basePoints, '🎵 خمّن من الكلمات');
        }
    
    /* ---------- رجوع ---------- */
        try {
            const key = 'moudy-guessSong-best-' + state.level;
            const prev = Number(localStorage.getItem(key) || 0);
            if (state.score > prev) {
                localStorage.setItem(key, String(state.score));
            }
        } catch (e) {}

        if (typeof twemoji !== 'undefined') {
            twemoji.parse(el.endIcon);
        }
    }

    /* ---------- رجوع للمستويات ---------- */
    function backToLevels() {
        clearInterval(state.timerId);
        clearInterval(state.fillTimerId);
        clearTimeout(state.clipStopId);
        stopAudio();
        state.locked = false;
        el.play.hidden = true;
        el.end.hidden = true;
        el.start.hidden = false;
        window.scrollTo(0, 0);
    }

    /* ---------- ربط الأحداث ---------- */
    document.querySelectorAll('#gsStart .level-card').forEach(function (btn) {
        btn.addEventListener('click', function () { startLevel(btn.dataset.level); });
    });

    el.playBtn.addEventListener('click', function () {
        if (state.locked) return;
        if (state.playing) {
            try { state.audio.pause(); } catch (e) {}
            stopPlayingUI();
            clearInterval(state.fillTimerId);
            clearTimeout(state.clipStopId);
            el.hint.textContent = '⏸ وقّفت المقطع';
        } else {
            playClip();
        }
    });

    el.back.addEventListener('click', backToLevels);
    el.endBack.addEventListener('click', backToLevels);
    el.again.addEventListener('click', function () { startLevel(state.level); });

    if (typeof twemoji !== 'undefined') {
        twemoji.parse(document.body);
    }
})();






/* ==================================================================
   قسم: صفحة الروابط — العدّاد + زر فتح/إغلاق
   ------------------------------------------------------------------
   - يجيب المشتركين + المشاهدات + الفيديوهات
   - يحدّث كل 60 ثانية
   - أرقام متحركة
   - زر يفتح/يسكّر قسم الروابط + QR
   ================================================================== */
   (function initLinksPage() {

    /* ==================== 1) العدّاد ==================== */
    const box = $('ytCounter');

    const CHANNEL_ID = 'UCdeSkxQ-YStI8bAYUiismbA';
    const API_URL = 'https://api.socialcounts.org/youtube-live-subscriber-count/' + CHANNEL_ID;

    const elSubs   = $('ytSubs');
    const elViews  = $('ytViews');
    const elVideos = $('ytVideos');

    function formatNum(n) {
        if (n === null || n === undefined || isNaN(n)) return '—';
        n = Number(n);
        if (n >= 1000000000) return (n / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
        if (n >= 1000000)    return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        if (n >= 1000)       return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        return n.toLocaleString('en');
    }

    function animateNumber(el, target, duration) {
        if (!el) return;
        const startTs = Date.now();
        duration = duration || 1200;

        function tick() {
            const elapsed = Date.now() - startTs;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(target * eased);
            el.textContent = formatNum(current);
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = formatNum(target);
        }
        requestAnimationFrame(tick);
    }

    let lastSubs = null, lastViews = null, lastVideos = null;

    function updateUI(subs, views, videos) {
        if (subs !== null && subs !== lastSubs) {
            animateNumber(elSubs, subs, 1200);
            lastSubs = subs;
        }
        if (views !== null && views !== lastViews) {
            animateNumber(elViews, views, 1400);
            lastViews = views;
        }
        if (videos !== null && videos !== lastVideos) {
            animateNumber(elVideos, videos, 1000);
            lastVideos = videos;
        }
        if (box) box.hidden = false;
    }

    let fallbackShown = false;
    function showFallback() {
        if (fallbackShown) return;
        fallbackShown = true;
        updateUI(790000, 470000000, 103);
    }

    function fetchStats() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', API_URL, true);
        xhr.timeout = 10000;

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            if (xhr.status !== 200) { showFallback(); return; }
            try {
                const data = JSON.parse(xhr.responseText);
                const est = data.estimated || data;
                const subs   = est.subscriberCount || est.subscribers || null;
                const views  = est.viewCount       || est.views       || null;
                const videos = est.videoCount      || est.videos      || null;
                if (subs === null && views === null && videos === null) {
                    showFallback();
                    return;
                }
                updateUI(subs, views, videos);
            } catch (e) {
                showFallback();
            }
        };

        xhr.onerror   = showFallback;
        xhr.ontimeout = showFallback;

        try { xhr.send(); } catch (e) { showFallback(); }
    }

    /* شغّل العدّاد فقط إذا العنصر موجود */
    if (box && elSubs && elViews && elVideos) {
        fetchStats();
        setInterval(fetchStats, 60000);
        window.addEventListener('online', fetchStats);
    }

    /* ==================== 2) زر فتح/إغلاق الروابط ==================== */
    const toggleBtn = $('linksToggle');
    const contentBox = $('linksContent');

    if (toggleBtn && contentBox) {
        toggleBtn.addEventListener('click', function () {
            const isCurrentlyHidden = contentBox.hidden;

            if (isCurrentlyHidden) {
                /* افتح */
                contentBox.hidden = false;
                toggleBtn.setAttribute('aria-expanded', 'true');

                const textEl = toggleBtn.querySelector('.links-toggle-text');
                if (textEl) textEl.textContent = 'إغلاق الصفحات الرسمية';

                /* مرّر للأسفل عشان يشوف المحتوى */
                setTimeout(function () {
                    try {
                        contentBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } catch (e) {
                        contentBox.scrollIntoView();
                    }
                }, 80);

            } else {
                /* سكّر */
                contentBox.hidden = true;
                toggleBtn.setAttribute('aria-expanded', 'false');

                const textEl = toggleBtn.querySelector('.links-toggle-text');
                if (textEl) textEl.textContent = 'افتح الصفحات الرسمية';

                /* مرّر لفوق للزر */
                setTimeout(function () {
                    try {
                        toggleBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } catch (e) {}
                }, 50);
            }
        });
    }

})();

/* ==================================================================
   قسم: Firebase — التهيئة الأساسية
   ================================================================== */
   (function initFirebase() {

    var firebaseConfig = {
        apiKey: "AIzaSyA-U5zfdjc8MWOkExx6k9c-uXo4d7cSPK8",
        authDomain: "moudy-website.firebaseapp.com",
        projectId: "moudy-website",
        storageBucket: "moudy-website.firebasestorage.app",
        messagingSenderId: "845028607479",
        appId: "1:845028607479:web:dd722a51eff1e6268ddaf2",
        measurementId: "G-QXNR2ZXW1V"
    };

    var SCRIPTS = [
        'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js',
        'https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js',
        'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js'
    ];

    var loaded = 0;
    var failed = false;

    function loadScript(src) {
        var s = document.createElement('script');
        s.src = src;
        s.async = false;
        s.onload = onLoad;
        s.onerror = function () { failed = true; onLoad(); };
        document.head.appendChild(s);
    }

    function onLoad() {
        loaded++;
        if (loaded === SCRIPTS.length) {
            if (failed || typeof firebase === 'undefined') {
                console.warn('[Firebase] فشل تحميل الـ SDK');
                return;
            }
            reallyInit();
        }
    }

    function reallyInit() {
        try {
            firebase.initializeApp(firebaseConfig);
        } catch (e) {
            console.warn('[Firebase] خطأ بالتهيئة:', e);
            return;
        }

        var auth = firebase.auth();
        var db = firebase.firestore();

        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(function () {});

        var currentUser = null;
        var listeners = [];

        function notify() {
            listeners.forEach(function (fn) {
                try { fn(currentUser); } catch (e) {}
            });
        }

        auth.onAuthStateChanged(function (user) {
            currentUser = user;
            if (user) {
                console.log('[Firebase] ✅ مسجّل دخول:', user.displayName || user.email);
            } else {
                console.log('[Firebase] ⚪ غير مسجّل');
            }
            notify();
        });

        window.moudyAuth = {
            auth: auth,
            db: db,
            getUser: function () { return currentUser; },
            signIn: function () {
                var provider = new firebase.auth.GoogleAuthProvider();
                provider.setCustomParameters({ prompt: 'select_account' });
                return auth.signInWithPopup(provider);
            },
            signOut: function () {
                return auth.signOut();
            },
            onChange: function (fn) {
                listeners.push(fn);
                fn(currentUser);
                return function () {
                    var i = listeners.indexOf(fn);
                    if (i > -1) listeners.splice(i, 1);
                };
            }
        };

        console.log('[Firebase] جاهز ✅');
    }

    SCRIPTS.forEach(loadScript);

})();

/* ==================================================================
   قسم: صفحة تسجيل الدخول (login.html)
   ================================================================== */
   (function initLoginPage() {
    var guestBox = $('loginGuest');
    if (!guestBox) return;

    function waitForFirebase() {
        if (window.moudyAuth) {
            setup();
        } else {
            setTimeout(waitForFirebase, 200);
        }
    }

    function setup() {
        var userBox     = $('loginUser');
        var loginBtn    = $('loginBtn');
        var logoutBtn   = $('logoutBtn');
        var continueBtn = $('continueBtn');
        var userName    = $('userName');
        var userEmail   = $('userEmail');
        var userAvatar  = $('userAvatar');

        var params = new URLSearchParams(location.search);
        var redirect = params.get('redirect') || 'MOUDY.html';

        window.moudyAuth.onChange(function (user) {
            if (user) {
                guestBox.hidden = true;
                userBox.hidden = false;
                userName.textContent = user.displayName || 'صديقنا';
                userEmail.textContent = user.email || '';

                if (user.photoURL) {
                    userAvatar.style.backgroundImage = 'url(' + user.photoURL + ')';
                    userAvatar.textContent = '';
                } else {
                    userAvatar.style.backgroundImage = '';
                    userAvatar.textContent = (user.displayName || '👤').charAt(0);
                }
            } else {
                guestBox.hidden = false;
                userBox.hidden = true;
            }
        });

        loginBtn.addEventListener('click', function () {
            loginBtn.disabled = true;
            var txt = loginBtn.querySelector('.login-google-text');
            if (txt) txt.textContent = '⏳ جاري تسجيل الدخول...';

            window.moudyAuth.signIn().then(function () {
                setTimeout(function () {
                    location.href = redirect;
                }, 700);
            }).catch(function (err) {
                loginBtn.disabled = false;
                if (txt) txt.textContent = 'تسجيل دخول بحساب Google';
                alert('فشل تسجيل الدخول:\n' + (err.message || 'حاول مرة تانية'));
            });
        });

        continueBtn.addEventListener('click', function () {
            location.href = redirect;
        });

        logoutBtn.addEventListener('click', function () {
            window.moudyAuth.signOut();
        });
    }

    waitForFirebase();
})();


/* ==================================================================
   قسم: زر تسجيل الدخول (siteNav + الصفحة الرئيسية)
   ================================================================== */
   (function initNavAuth() {

    /* بصفحة تسجيل الدخول ما نعرضو */
    if (document.body.classList && document.body.classList.contains('LOGIN-PAGE')) return;

    /* حدّد المكان اللي نضيف فيه الزر */
    var nav = $('siteNav');           /* الصفحات الفرعية */
    var mainHeader = null;             /* الصفحة الرئيسية */

    if (!nav) {
        mainHeader = document.querySelector('header');
        if (!mainHeader) return;
    }

    function waitForFirebase(attempts) {
        attempts = attempts || 0;
        if (window.moudyAuth) {
            setup();
        } else if (attempts < 150) {   /* 30 ثانية */
            setTimeout(function () { waitForFirebase(attempts + 1); }, 200);
        }
    }

    function setup() {
        var authBox = document.createElement('div');
        authBox.className = 'nav-auth';

        if (nav) {
            nav.appendChild(authBox);
        } else {
            mainHeader.appendChild(authBox);
        }

        var btn = document.createElement('a');
        btn.className = 'nav-auth-btn';
        btn.href = 'login.html';
        btn.innerHTML = '<span class="nav-auth-icon">🔑</span><span class="nav-auth-text">دخول</span>';
        authBox.appendChild(btn);

        window.moudyAuth.onChange(function (user) {
            if (user) {
                var initial = (user.displayName || '👤').charAt(0).toUpperCase();
                var avatar = user.photoURL
                    ? '<img src="' + user.photoURL + '" alt="">'
                    : '<span class="nav-auth-initial">' + initial + '</span>';

                var shortName = (user.displayName || 'حسابي').split(' ')[0];

                btn.href = '#';
                btn.className = 'nav-auth-btn logged';
                btn.innerHTML =
                    '<span class="nav-auth-avatar">' + avatar + '</span>' +
                    '<span class="nav-auth-text">' + shortName + '</span>';

                btn.onclick = function (e) {
                    e.preventDefault();
                    toggleMenu(user, btn);
                };
            } else {
                btn.href = 'login.html';
                btn.className = 'nav-auth-btn';
                btn.innerHTML = '<span class="nav-auth-icon">🔑</span><span class="nav-auth-text">دخول</span>';
                btn.onclick = null;
            }
        });
    }

    function toggleMenu(user, anchor) {
        var old = document.querySelector('.nav-user-menu');
        if (old) { old.remove(); return; }

        var initial = (user.displayName || '👤').charAt(0).toUpperCase();
        var avatar = user.photoURL
            ? '<img src="' + user.photoURL + '">'
            : '<span>' + initial + '</span>';

        var menu = document.createElement('div');
        menu.className = 'nav-user-menu';
        menu.innerHTML =
            '<div class="nav-user-info">' +
                '<div class="nav-user-avatar">' + avatar + '</div>' +
                '<div class="nav-user-details">' +
                    '<div class="nav-user-name">' + (user.displayName || 'مستخدم') + '</div>' +
                    '<div class="nav-user-email">' + (user.email || '') + '</div>' +
                '</div>' +
            '</div>' +
            '<button class="nav-user-logout" type="button">🚪 تسجيل خروج</button>';

        document.body.appendChild(menu);

        var rect = anchor.getBoundingClientRect();
        var menuWidth = 240;
        var leftPos = rect.left;
        if (leftPos + menuWidth > window.innerWidth - 10) {
            leftPos = window.innerWidth - menuWidth - 10;
        }
        if (leftPos < 10) leftPos = 10;
        menu.style.top = (rect.bottom + 8) + 'px';
        menu.style.left = leftPos + 'px';

        menu.querySelector('.nav-user-logout').addEventListener('click', function () {
            window.moudyAuth.signOut();
            menu.remove();
        });

        setTimeout(function () {
            document.addEventListener('click', closeHandler);
        }, 10);
    }

    function closeHandler(e) {
        var menu = document.querySelector('.nav-user-menu');
        if (!menu) {
            document.removeEventListener('click', closeHandler);
            return;
        }
        if (menu.contains(e.target)) return;
        if (e.target.closest('.nav-auth-btn')) return;
        menu.remove();
        document.removeEventListener('click', closeHandler);
    }

    waitForFirebase();
})();

/* ==================================================================
   قسم: Cloud Sync — مزامنة البيانات مع Firestore
   ------------------------------------------------------------------
   - عند تسجيل الدخول: يجيب البيانات من السحابة + يدمجها مع المحلية
   - كل 3 ثواني: يفحص إذا في تغيير → يرفع
   - يحفظ: العملات، Streak، Stats، أفضل النتائج، إلخ
   ================================================================== */
   (function initCloudSync() {

    function waitForFirebase(attempts) {
        attempts = attempts || 0;
        if (window.moudyAuth && window.moudyAuth.db) {
            setup();
        } else if (attempts < 150) {
            setTimeout(function () { waitForFirebase(attempts + 1); }, 200);
        }
    }

    function setup() {
        var db = window.moudyAuth.db;
        var currentUid = null;
        var lastHash = '';

        /* ---------- المفاتيح اللي نزامنها ---------- */
        var FIXED_KEYS = [
            'moudy-coins',
            'moudy-streak',
            'moudy-stats',
            'moudy-wheel',
            'moudy-box',
            'moudy-challenge',
            'moudy-daily-song',
            'moudy-playlists',
            'moudy-photos-fav'
        ];

        function getAllSyncKeys() {
            var keys = FIXED_KEYS.slice();
            for (var i = 0; i < localStorage.length; i++) {
                var k = localStorage.key(i);
                if (k && k.indexOf('moudy-') === 0 && k.indexOf('-best-') > -1) {
                    keys.push(k);
                }
            }
            return keys;
        }

        function readLocal() {
            var data = {};
            getAllSyncKeys().forEach(function (k) {
                try {
                    var v = localStorage.getItem(k);
                    if (v !== null) data[k] = v;
                } catch (e) {}
            });
            return data;
        }

        function writeLocal(data) {
            Object.keys(data).forEach(function (k) {
                try { localStorage.setItem(k, data[k]); } catch (e) {}
            });
        }

        function safeParse(str) {
            try { return JSON.parse(str || '{}'); } catch (e) { return {}; }
        }

        /* ---------- دمج كائنين (ياخد الأكبر) ---------- */
        function mergeObjects(a, b) {
            if (!a) return b;
            if (!b) return a;
            var out = Object.assign({}, a);
            Object.keys(b).forEach(function (k) {
                var av = a[k];
                var bv = b[k];
                if (av === undefined) { out[k] = bv; return; }
                if (bv === undefined) return;

                if (typeof av === 'number' && typeof bv === 'number') {
                    out[k] = Math.max(av, bv);
                } else if (Array.isArray(av) && Array.isArray(bv)) {
                    var set = {};
                    av.concat(bv).forEach(function (x) { set[String(x)] = x; });
                    out[k] = Object.keys(set).map(function (x) { return set[x]; });
                } else if (av && bv && typeof av === 'object' && typeof bv === 'object') {
                    out[k] = mergeObjects(av, bv);
                } else {
                    out[k] = av;
                }
            });
            return out;
        }

        /* ---------- دمج البيانات كلها ---------- */
        function mergeData(local, cloud) {
            var merged = {};
            var allKeys = {};
            Object.keys(local || {}).forEach(function (k) { allKeys[k] = 1; });
            Object.keys(cloud || {}).forEach(function (k) { allKeys[k] = 1; });

            Object.keys(allKeys).forEach(function (key) {
                var lv = local ? local[key] : null;
                var cv = cloud ? cloud[key] : null;

                if (!lv && !cv) return;
                if (!lv) { merged[key] = cv; return; }
                if (!cv) { merged[key] = lv; return; }

                try {
                    var lObj = JSON.parse(lv);
                    var cObj = JSON.parse(cv);

                    if (typeof lObj === 'number' && typeof cObj === 'number') {
                        merged[key] = String(Math.max(lObj, cObj));
                    } else if (lObj && cObj && typeof lObj === 'object' && typeof cObj === 'object') {
                        merged[key] = JSON.stringify(mergeObjects(lObj, cObj));
                    } else {
                        merged[key] = lv;
                    }
                } catch (e) {
                    merged[key] = lv;
                }
            });

            return merged;
        }

        /* ---------- Hash للكشف عن التغيير ---------- */
        function computeHash(data) {
            var str = JSON.stringify(data);
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
            }
            return String(hash);
        }

        /* ---------- ارفع للسحابة ---------- */
        function pushToCloud() {
            if (!currentUid) return;
            var user = window.moudyAuth.getUser();
            if (!user) return;

            var data = readLocal();

            /* حقول منفصلة للـ Leaderboard */
            var coins = safeParse(data['moudy-coins']).total || 0;
            var streak = safeParse(data['moudy-streak']);
            var stats = safeParse(data['moudy-stats']);
            var challenge = safeParse(data['moudy-challenge']);

            db.collection('users').doc(currentUid).set({
                displayName: user.displayName || 'مستخدم',
                photoURL: user.photoURL || '',
                email: user.email || '',
                coins: coins,
                streakCurrent: streak.currentStreak || 0,
                streakBest: streak.bestStreak || 0,
                totalDays: streak.totalDays || 0,
                points: streak.points || 0,
                songsPlayed: stats.songsPlayed || 0,
                gamesPlayed: stats.gamesPlayed || 0,
                wheelSpins: stats.wheelSpins || 0,
                boxesOpened: stats.boxesOpened || 0,
                challengesCompleted: challenge.rewardClaimed ? 1 : 0,
                raw: data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true }).catch(function (err) {
                console.warn('[Cloud] فشل الرفع:', err);
            });
        }

        /* ---------- اسحب من السحابة ---------- */
        function pullFromCloud() {
            if (!currentUid) return;

            db.collection('users').doc(currentUid).get().then(function (doc) {
                if (!doc.exists) {
                    /* أول مرة — ارفع اللي عندك */
                    console.log('[Cloud] مستخدم جديد — رفع البيانات المحلية');
                    pushToCloud();
                    return;
                }

                var cloudData = doc.data();
                var cloudRaw = cloudData.raw || {};
                var localRaw = readLocal();

                var merged = mergeData(localRaw, cloudRaw);
                writeLocal(merged);

                /* ارفع المدموج مرة تانية */
                pushToCloud();

                /* أعلم الصفحة إنو في تحديث */
                try {
                    window.dispatchEvent(new Event('cloud-synced'));
                } catch (e) {}

                console.log('[Cloud] ✅ تمت المزامنة');
            }).catch(function (err) {
                console.warn('[Cloud] فشل السحب:', err);
            });
        }

        /* ---------- اسمع لتغيير الحساب ---------- */
        window.moudyAuth.onChange(function (user) {
            if (user && user.uid) {
                var wasOther = currentUid !== user.uid;
                currentUid = user.uid;
                if (wasOther) {
                    pullFromCloud();
                }
            } else {
                currentUid = null;
                lastHash = '';
            }
        });

        /* ---------- ارفع كل 3 ثواني إذا في تغيير ---------- */
        setInterval(function () {
            if (!currentUid) return;
            var data = readLocal();
            var h = computeHash(data);
            if (h !== lastHash) {
                lastHash = h;
                pushToCloud();
            }
        }, 3000);

        /* ---------- API عام ---------- */
        window.moudyCloud = {
            sync: pullFromCloud,
            push: pushToCloud,
            pull: pullFromCloud
        };

        console.log('[Cloud] جاهز ✅');
    }

    waitForFirebase();
})();


/* ==================================================================
   قسم: تحديث الواجهة عند مزامنة السحابة
   ================================================================== */
   (function initCloudUI() {
    window.addEventListener('cloud-synced', function () {
        /* حدّث العملات */
        try {
            var c = JSON.parse(localStorage.getItem('moudy-coins') || '{}');
            document.querySelectorAll('.coins-value').forEach(function (el) {
                el.textContent = (c.total || 0).toLocaleString('en');
            });
        } catch (e) {}

        /* حدّث Streak */
        try {
            var s = JSON.parse(localStorage.getItem('moudy-streak') || '{}');
            var streakNum = document.getElementById('streakNavIcon');
            if (streakNum) streakNum.textContent = s.currentStreak || 0;

            var homeNum = document.getElementById('streakHomeNum');
            if (homeNum) {
                var n = s.currentStreak || 0;
                homeNum.textContent = n + (n === 1 ? ' يوم' : ' أيام');
            }

            var homeStreak = document.querySelector('.home-streak-num');
            if (homeStreak) homeStreak.textContent = s.currentStreak || 0;
        } catch (e) {}
    });
})();

/* ==================================================================
   قسم: Leaderboard — لوحة الشرف
   ================================================================== */
   (function initLeaderboard() {
    var list = $('lbList');
    if (!list) return;

    var currentTab = 'coins';

    function waitForFirebase(attempts) {
        attempts = attempts || 0;
        if (window.moudyAuth && window.moudyAuth.db) {
            setup();
        } else if (attempts < 150) {
            setTimeout(function () { waitForFirebase(attempts + 1); }, 200);
        } else {
            showError('تعذّر الاتصال بالسيرفر');
        }
    }

    function showError(msg) {
        var loading = $('lbLoading');
        if (loading) loading.hidden = true;
        list.hidden = false;
        list.innerHTML = '<div class="lb-empty"><div class="lb-empty-icon">⚠️</div><h3>' + msg + '</h3></div>';
    }

    function setup() {
        var db = window.moudyAuth.db;

        var TABS = {
            coins:  { field: 'coins',          label: 'عملة',  icon: '🪙' },
            streak: { field: 'streakBest',     label: 'يوم',   icon: '🔥' },
            games:  { field: 'gamesPlayed',    label: 'لعبة',  icon: '🎮' }
        };

        document.querySelectorAll('.lb-tab').forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.lb-tab').forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentTab = btn.dataset.tab;
                loadList();
            });
        });

        window.moudyAuth.onChange(function (user) {
            var prompt = $('lbLoginPrompt');
            var myRank = $('lbMyRank');
            if (user) {
                if (prompt) prompt.hidden = true;
                if (myRank) myRank.hidden = false;
            } else {
                if (prompt) prompt.hidden = false;
                if (myRank) myRank.hidden = true;
            }
        });

        function loadList() {
            var loading = $('lbLoading');
            var empty = $('lbEmpty');
            if (loading) loading.hidden = false;
            list.hidden = true;
            if (empty) empty.hidden = true;

            var cfg = TABS[currentTab];

            db.collection('users')
              .orderBy(cfg.field, 'desc')
              .limit(50)
              .get()
              .then(function (snap) {
                  if (loading) loading.hidden = true;

                  if (snap.empty) {
                      if (empty) empty.hidden = false;
                      return;
                  }

                  list.hidden = false;
                  list.innerHTML = '';

                  var currentUser = window.moudyAuth.getUser();
                  var myUid = currentUser ? currentUser.uid : null;
                  var displayRank = 0;

                  snap.forEach(function (doc) {
                      displayRank++;
                      var data = doc.data() || {};
                      var rank = displayRank;
                      var isMe = (doc.id === myUid);
                      list.appendChild(createRow(rank, data, isMe, cfg));
                  });

                  updateMyRank(myUid, cfg);
              })
              .catch(function (err) {
                  console.warn('[Leaderboard] خطأ:', err);
                  if (loading) loading.hidden = true;
                  showError('تعذّر التحميل — حاول مرة تانية');
              });
        }

        function createRow(rank, data, isMe, cfg) {
            var row = document.createElement('div');
            row.className = 'lb-row';
            if (rank <= 3) row.classList.add('rank-' + rank);
            if (isMe) row.classList.add('is-me');

            var rankText;
            if (rank === 1) rankText = '🥇';
            else if (rank === 2) rankText = '🥈';
            else if (rank === 3) rankText = '🥉';
            else rankText = rank;

            var initial = (data.displayName || '👤').charAt(0).toUpperCase();
            var avatarHtml = data.photoURL
                ? '<img src="' + data.photoURL + '" alt="">'
                : initial;

            var score = data[cfg.field] || 0;

            row.innerHTML =
                '<div class="lb-rank">' + rankText + '</div>' +
                '<div class="lb-avatar">' + avatarHtml + '</div>' +
                '<div class="lb-info">' +
                    '<div class="lb-name">' + (data.displayName || 'مستخدم') + (isMe ? ' <span style="color:#4ade80;font-size:0.85rem;">(أنت)</span>' : '') + '</div>' +
                    '<div class="lb-meta">' + (data.email || '') + '</div>' +
                '</div>' +
                '<div>' +
                    '<div class="lb-score">' + cfg.icon + ' ' + Number(score).toLocaleString('en') + '</div>' +
                    '<span class="lb-score-label">' + cfg.label + '</span>' +
                '</div>';

            return row;
        }

        function updateMyRank(myUid, cfg) {
            var myInfo = $('lbMyInfo');
            if (!myInfo || !myUid) return;

            db.collection('users')
              .orderBy(cfg.field, 'desc')
              .get()
              .then(function (snap) {
                  var rank = 0;
                  var total = snap.size;
                  var myData = null;
                  var counter = 0;

                  snap.forEach(function (doc) {
                      counter++;
                      if (doc.id === myUid) {
                          rank = counter;
                          myData = doc.data();
                      }
                  });

                  if (!myData) {
                      myInfo.innerHTML = '<p style="color:#9aa79d;text-align:center;">ما عندك بيانات بعد — العب شي لعبة!</p>';
                      return;
                  }

                  var initial = (myData.displayName || '👤').charAt(0).toUpperCase();
                  var avatarHtml = myData.photoURL
                      ? '<img src="' + myData.photoURL + '" alt="">'
                      : initial;

                  var score = myData[cfg.field] || 0;

                  myInfo.innerHTML =
                      '<div class="lb-rank" style="background:linear-gradient(135deg,#4ade80,#28a745);color:#fff;border-color:#fff;">' + rank + '</div>' +
                      '<div class="lb-avatar">' + avatarHtml + '</div>' +
                      '<div class="lb-info">' +
                          '<div class="lb-name">' + (myData.displayName || 'أنت') + '</div>' +
                          '<div class="lb-meta">#' + rank + ' من ' + total + ' لاعب</div>' +
                      '</div>' +
                      '<div>' +
                          '<div class="lb-score">' + cfg.icon + ' ' + Number(score).toLocaleString('en') + '</div>' +
                          '<span class="lb-score-label">' + cfg.label + '</span>' +
                      '</div>';
              })
              .catch(function (err) {
                  console.warn('[Leaderboard] فشل ترتيبي:', err);
              });
        }

        window.addEventListener('cloud-synced', function () {
            loadList();
        });

        loadList();
    }

    waitForFirebase();
})();
/* ==================================================================
   قسم: لعبة البلياردو (8-Ball) — نسخة احترافية نهائية
   ------------------------------------------------------------------
   - فيزياء واقعية (sub-stepping + rolling)
   - Ball-in-Hand لكل الأخطاء
   - قوانين 8-Ball رسمية
   - تصميم احترافي
   ================================================================== */
   (function initBilliards() {
    var canvas = document.getElementById('blCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    /* ═══ الإعدادات ═══ */
    var LW = 1000, LH = 500;
    var CUSHION = 36, RAIL = 20;
    var BALL_R = 13;
    var POCKET_R = 26;

    var FRICTION = 0.9915;
    var SPIN_FRICTION = 0.985;
    var MIN_SPEED = 0.08;
    var MAX_POWER = 28;
    var BALL_RESTITUTION = 0.96;
    var CUSHION_RESTITUTION = 0.78;
    var SUBSTEPS = 6;

    var COLORS = {
        0: '#fdfcf7', 1: '#ffcb05', 2: '#0a4ea3', 3: '#d73229',
        4: '#5a2d8a', 5: '#e87722', 6: '#1f8b4c', 7: '#7d1f1f',
        8: '#1a1a1a', 9: '#ffcb05', 10: '#0a4ea3', 11: '#d73229',
        12: '#5a2d8a', 13: '#e87722', 14: '#1f8b4c', 15: '#7d1f1f'
    };

    var THEMES = {
        pro: {
            felt: '#1a6b3f', feltDark: '#0e4526', feltLight: '#1d7f4a',
            rail: '#4a2511', railLight: '#6d3818', railDark: '#2a1409',
            diamond: '#f5e6c8', pocket: '#0a0603',
            logo: 'rgba(255,255,255,0.06)'
        },
        moudy: {
            felt: '#0a5d3a', feltDark: '#063d26', feltLight: '#0d7048',
            rail: '#3a1f08', railLight: '#5c3310', railDark: '#1c0f04',
            diamond: '#f0d98c', pocket: '#0a0603',
            logo: 'rgba(255,215,0,0.08)'
        },
        neon: {
            felt: '#1a0d2e', feltDark: '#0a0514', feltLight: '#2d1b4e',
            rail: '#2a1a3e', railLight: '#3d2555', railDark: '#150a20',
            diamond: '#00d9ff', pocket: '#000',
            logo: 'rgba(0,217,255,0.08)'
        }
    };

    /* ═══ الحالة ═══ */
    var scale = 1, offX = 0, offY = 0;
    var balls = [];
    var pockets = [];
    var running = false;
    var gameOver = false;
    var aiming = false;
    var aimAngle = 0;
    var power = 0;
    var mode = 'local';
    var aiLevel = 'easy';
    var theme = 'pro';
    var lastTime = 0;

    /* كرات وسيطة للتخزين */
    var scratchBalls = [];

    /* ═══ حالة اللعبة (القوانين) ═══ */
    var G = {
        turn: 1,
        p1Group: null,
        p2Group: null,
        breakDone: false,
        ballInHand: false,     /* الخصم يحط الكرة بأي مكان */
        firstContact: null,
        pocketedThisShot: [],
        cueHitCushion: false,
        placed: false,          /* عشان ما يتنقل بأول مرة */
        winner: null
    };

    /* ═══ أسماء اللاعبين والصور ═══ */
    var players = {
        1: { name: 'اللاعب 1', avatar: '' },
        2: { name: 'اللاعب 2', avatar: '' }
    };

    /* ═══ أدوات ═══ */
    function isSolid(n) { return n >= 1 && n <= 7; }
    function isStripe(n) { return n >= 9 && n <= 15; }

    function getBallGroup(n) {
        if (isSolid(n)) return 'solid';
        if (isStripe(n)) return 'stripe';
        return null;
    }

    function lighten(hex, amt) {
        if (typeof hex !== 'string') return '#888';
        if (hex === '#ffffff' || hex === '#fff') return '#ffffff';
        if (hex === '#000000' || hex === '#000') return '#000000';
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        if (hex.length !== 6) return '#888';
        var r = parseInt(hex.substr(0, 2), 16);
        var g = parseInt(hex.substr(2, 2), 16);
        var b = parseInt(hex.substr(4, 2), 16);
        if (isNaN(r) || isNaN(g) || isNaN(b)) return '#888';
        r = Math.max(0, Math.min(255, r + amt));
        g = Math.max(0, Math.min(255, g + amt));
        b = Math.max(0, Math.min(255, b + amt));
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    function roundRect(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    /* ═══ بناء الطاولة والكرات ═══ */
    function buildPockets() {
        pockets = [
            { x: CUSHION, y: CUSHION, r: POCKET_R },
            { x: LW / 2, y: CUSHION - 4, r: POCKET_R * 0.9 },
            { x: LW - CUSHION, y: CUSHION, r: POCKET_R },
            { x: CUSHION, y: LH - CUSHION, r: POCKET_R },
            { x: LW / 2, y: LH - CUSHION + 4, r: POCKET_R * 0.9 },
            { x: LW - CUSHION, y: LH - CUSHION, r: POCKET_R }
        ];
    }

    function makeBall(x, y, num) {
        return {
            x: x, y: y,
            vx: 0, vy: 0,
            r: BALL_R,
            number: num,
            color: COLORS[num],
            active: true,
            rotation: 0,
            rotX: 0, rotY: 0
        };
    }

    function buildBalls() {
        balls = [];
        scratchBalls = [];
        balls.push(makeBall(CUSHION + (LW - 2 * CUSHION) * 0.22, LH / 2, 0));

        var order = [1, 11, 2, 12, 8, 3, 13, 4, 14, 5, 15, 6, 9, 7, 10];
        var apexX = CUSHION + (LW - 2 * CUSHION) * 0.72;
        var apexY = LH / 2;
        var gap = BALL_R * 2 + 0.5;
        var rowH = gap * 0.866;

        var idx = 0;
        for (var row = 0; row < 5; row++) {
            for (var i = 0; i <= row; i++) {
                balls.push(makeBall(
                    apexX + row * rowH,
                    apexY + (i - row / 2) * gap,
                    order[idx++]
                ));
            }
        }
    }

    /* ═══ الرسم ═══ */
    function resize() {
        var wrap = canvas.parentElement;
        var cw = wrap.clientWidth;
        var ch = wrap.clientHeight;
        var dpr = window.devicePixelRatio || 1;

        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
        canvas.style.width = cw + 'px';
        canvas.style.height = ch + 'px';

        var totalW = LW + 2 * (CUSHION + RAIL);
        var totalH = LH + 2 * (CUSHION + RAIL);

        var sx = canvas.width / totalW;
        var sy = canvas.height / totalH;
        scale = Math.min(sx, sy);

        offX = (canvas.width - totalW * scale) / 2 + (CUSHION + RAIL) * scale;
        offY = (canvas.height - totalH * scale) / 2 + (CUSHION + RAIL) * scale;
    }

    function draw() {
        var th = THEMES[theme];

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(scale, 0, 0, scale, offX, offY);

        /* الخشب */
        var woodG = ctx.createLinearGradient(0, -CUSHION - RAIL, 0, LH + CUSHION + RAIL);
        woodG.addColorStop(0, th.railLight);
        woodG.addColorStop(0.5, th.rail);
        woodG.addColorStop(1, th.railDark);
        ctx.fillStyle = woodG;
        roundRect(-CUSHION - RAIL, -CUSHION - RAIL,
                  LW + 2*(CUSHION+RAIL), LH + 2*(CUSHION+RAIL), 22);
        ctx.fill();

        /* الكوشن */
        var cG = ctx.createLinearGradient(0, -CUSHION, 0, 0);
        cG.addColorStop(0, lighten(th.felt, 15));
        cG.addColorStop(1, th.felt);
        ctx.fillStyle = cG;
        roundRect(-CUSHION, -CUSHION, LW + 2*CUSHION, LH + 2*CUSHION, 16);
        ctx.fill();

        /* القماش */
        var fG = ctx.createRadialGradient(LW/2, LH/2, 60, LW/2, LH/2, LW*0.65);
        fG.addColorStop(0, th.feltLight);
        fG.addColorStop(0.6, th.felt);
        fG.addColorStop(1, th.feltDark);
        ctx.fillStyle = fG;
        ctx.fillRect(CUSHION, CUSHION, LW - 2*CUSHION, LH - 2*CUSHION);

        /* شعار */
        ctx.save();
        ctx.fillStyle = th.logo;
        ctx.font = 'bold 80px Cairo, Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('MOUDY', LW/2, LH/2 - 10);
        ctx.font = 'bold 24px Cairo, Arial';
        ctx.fillText('AL ARBE', LW/2, LH/2 + 45);
        ctx.restore();

        /* علامات الماس */
        ctx.fillStyle = th.diamond;
        for (var i = 1; i <= 7; i++) {
            if (i === 4) continue;
            var dx = CUSHION + (LW - 2*CUSHION) * (i/8);
            ctx.beginPath(); ctx.arc(dx, -CUSHION - RAIL/2, 2.5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(dx, LH + CUSHION + RAIL/2, 2.5, 0, Math.PI*2); ctx.fill();
        }
        for (var j = 1; j <= 3; j++) {
            if (j === 2) continue;
            var dy = CUSHION + (LH - 2*CUSHION) * (j/4);
            ctx.beginPath(); ctx.arc(-CUSHION - RAIL/2, dy, 2.5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(LW + CUSHION + RAIL/2, dy, 2.5, 0, Math.PI*2); ctx.fill();
        }

        /* الجيوب */
        for (var p = 0; p < pockets.length; p++) {
            var pk = pockets[p];
            var pg = ctx.createRadialGradient(pk.x, pk.y, 2, pk.x, pk.y, pk.r);
            pg.addColorStop(0, '#000');
            pg.addColorStop(0.75, '#0a0603');
            pg.addColorStop(1, '#2a1a08');
            ctx.beginPath(); ctx.arc(pk.x, pk.y, pk.r, 0, Math.PI*2);
            ctx.fillStyle = pg; ctx.fill();
        }

        /* الكرات */
        for (var b = 0; b < balls.length; b++) {
            if (balls[b].active) drawBall(balls[b]);
        }

        /* التصويب */
        if (!running && !gameOver && balls[0] && balls[0].active && !G.ballInHand) {
            drawAim();
            drawCueOnTable();
        }

        /* Ball-in-Hand indicator */
        if (G.ballInHand && balls[0] && !running) {
            drawBallInHandHint();
        }
    }

    function drawBall(b) {
        var isStripeBall = isStripe(b.number);

        /* ظل */
        ctx.beginPath();
        ctx.ellipse(b.x + 2, b.y + 2.5, b.r * 1.05, b.r * 0.9, 0, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fill();

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.beginPath();
        ctx.arc(0, 0, b.r, 0, Math.PI*2);
        ctx.clip();

        /* تطبيق الدوران على الرسم */
        var rot = b.rotation || 0;
        ctx.rotate(rot);

        /* الجسم */
        if (isStripeBall) {
            ctx.fillStyle = '#fdfcf7';
            ctx.fillRect(-b.r, -b.r, b.r*2, b.r*2);
            ctx.fillStyle = b.color;
            ctx.fillRect(-b.r, -b.r*0.58, b.r*2, b.r*1.16);
        } else {
            ctx.fillStyle = b.color;
            ctx.fillRect(-b.r, -b.r, b.r*2, b.r*2);
        }

        ctx.restore();

        /* الإضاءة */
        var grad = ctx.createRadialGradient(
            b.x - b.r*0.4, b.y - b.r*0.4, b.r*0.1,
            b.x, b.y, b.r
        );
        grad.addColorStop(0, 'rgba(255,255,255,0.6)');
        grad.addColorStop(0.4, 'rgba(255,255,255,0.05)');
        grad.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
        ctx.fillStyle = grad;
        ctx.fill();

        /* الرقم (يدور) */
        if (b.number > 0) {
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.rotate(b.rotation || 0);
            var nr = b.r * 0.52;
            ctx.beginPath();
            ctx.arc(0, 0, nr, 0, Math.PI*2);
            ctx.fillStyle = '#fdfcf7';
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 0.6;
            ctx.stroke();

            ctx.fillStyle = '#111';
            ctx.font = 'bold ' + Math.floor(nr*1.5) + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.rotate(-(b.rotation || 0)); /* خلّي الرقم مستقيم داخل الدائرة */
            ctx.fillText(b.number, 0, 0.5);
            ctx.restore();
        }

        /* لمعان */
        ctx.beginPath();
        ctx.arc(b.x - b.r*0.35, b.y - b.r*0.4, b.r*0.28, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.fill();

        /* حدود */
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
    }

    function drawAim() {
        var cue = balls[0];
        if (!cue) return;

        var dx = Math.cos(aimAngle);
        var dy = Math.sin(aimAngle);

        var endX = cue.x, endY = cue.y;
        for (var d = BALL_R + 3; d < 2000; d += 3) {
            var px = cue.x + dx * d;
            var py = cue.y + dy * d;
            if (px < CUSHION - 10 || px > LW - CUSHION + 10 ||
                py < CUSHION - 10 || py > LH - CUSHION + 10) {
                endX = px; endY = py; break;
            }
            var hit = false;
            for (var i = 1; i < balls.length; i++) {
                var b = balls[i];
                if (!b.active) continue;
                var ddx = px - b.x;
                var ddy = py - b.y;
                if (ddx*ddx + ddy*ddy < (BALL_R*2)*(BALL_R*2)) {
                    var dist = Math.sqrt(ddx*ddx + ddy*ddy);
                    endX = px - dx * (BALL_R*2 - dist);
                    endY = py - dy * (BALL_R*2 - dist);
                    hit = true;
                    break;
                }
            }
            if (hit) break;
            endX = px; endY = py;
        }

        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cue.x + dx*BALL_R, cue.y + dy*BALL_R);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(endX, endY, BALL_R*0.85, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(255,255,255,0.55)';
        ctx.stroke();
        ctx.restore();
    }

    function drawCueOnTable() {
        var cue = balls[0];
        if (!cue) return;

        var dx = Math.cos(aimAngle);
        var dy = Math.sin(aimAngle);

        var stickLen = 230;
        var gap = BALL_R + 4 + power * 4;
        var tipX = cue.x - dx * gap;
        var tipY = cue.y - dy * gap;
        var buttX = tipX - dx * stickLen;
        var buttY = tipY - dy * stickLen;

        ctx.save();
        ctx.strokeStyle = 'rgba(0,0,0,0.35)';
        ctx.lineWidth = 6.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tipX + 2, tipY + 3);
        ctx.lineTo(buttX + 2, buttY + 3);
        ctx.stroke();

        /* جلد */
        var tEndX = tipX + dx * 7;
        var tEndY = tipY + dy * 7;
        ctx.strokeStyle = '#0a3a5c';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tEndX, tEndY);
        ctx.stroke();

        /* أبيض */
        var fX = tipX - dx * 12;
        var fY = tipY - dy * 12;
        ctx.strokeStyle = '#faf8f0';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(fX, fY);
        ctx.stroke();

        /* عمود */
        var sX = tipX - dx * stickLen * 0.6;
        var sY = tipY - dy * stickLen * 0.6;
        var shaftG = ctx.createLinearGradient(fX, fY, sX, sY);
        shaftG.addColorStop(0, '#e8d5a8');
        shaftG.addColorStop(1, '#d4b878');
        ctx.strokeStyle = shaftG;
        ctx.lineWidth = 5.5;
        ctx.beginPath();
        ctx.moveTo(fX, fY);
        ctx.lineTo(sX, sY);
        ctx.stroke();

        /* مقبض */
        var buttG = ctx.createLinearGradient(sX, sY, buttX, buttY);
        buttG.addColorStop(0, '#3d1f08');
        buttG.addColorStop(1, '#1a0a02');
        ctx.strokeStyle = buttG;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(sX, sY);
        ctx.lineTo(buttX, buttY);
        ctx.stroke();

        ctx.restore();

        /* شريط القوة فوق الكرة */
        if (power > 0.5) {
            var pct = Math.round((power / MAX_POWER) * 100);
            var bw = 100, bh = 10;
            var bx = cue.x - bw/2;
            var by = cue.y - BALL_R - 28;

            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            roundRect(bx - 2, by - 2, bw + 4, bh + 4, 6);
            ctx.fill();

            var fw = (power / MAX_POWER) * bw;
            var color = power < MAX_POWER*0.4 ? '#4ade80' :
                        power < MAX_POWER*0.7 ? '#ffd700' : '#ff4444';
            ctx.fillStyle = color;
            roundRect(bx, by, fw, bh, 4);
            ctx.fill();

            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            ctx.lineWidth = 1;
            roundRect(bx, by, bw, bh, 4);
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Cairo';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 3;
            ctx.fillText(pct + '%', cue.x, by - 4);
            ctx.restore();
        }
    }

    function drawBallInHandHint() {
        var cue = balls[0];
        if (!cue) return;

        var t = Date.now() / 400;
        var pulse = 1 + Math.sin(t) * 0.15;

        ctx.save();
        ctx.beginPath();
        ctx.arc(cue.x, cue.y, BALL_R * 1.8 * pulse, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(255,215,0,0.8)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 14px Cairo';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 5;
        ctx.fillText('✋ حرّك الكرة البيضاء', cue.x, cue.y - BALL_R * 2.5);
        ctx.restore();
    }

    /* ═══ الفيزياء ═══ */
    function step(dt) {
        var steps = SUBSTEPS;
        var subDt = dt / steps;

        for (var s = 0; s < steps; s++) {
            /* حركة */
            for (var i = 0; i < balls.length; i++) {
                var b = balls[i];
                if (!b.active) continue;
                b.x += b.vx * subDt;
                b.y += b.vy * subDt;
            }

            /* تصادمات كرة-كرة */
            for (var i = 0; i < balls.length; i++) {
                if (!balls[i].active) continue;
                for (var j = i+1; j < balls.length; j++) {
                    if (!balls[j].active) continue;
                    collideBalls(balls[i], balls[j]);
                }
            }

            /* كوشن */
            for (var i = 0; i < balls.length; i++) {
                if (!balls[i].active) continue;
                collideCushion(balls[i]);
            }

            /* جيوب */
            for (var i = 0; i < balls.length; i++) {
                if (!balls[i].active) continue;
                checkPocket(balls[i]);
            }
        }

        /* احتكاك + تدحرج */
        for (var i = 0; i < balls.length; i++) {
            var b = balls[i];
            if (!b.active) continue;
            var speed = Math.sqrt(b.vx*b.vx + b.vy*b.vy);
            if (speed < MIN_SPEED) {
                b.vx = 0; b.vy = 0;
            } else {
                var decay = Math.pow(FRICTION, dt);
                b.vx *= decay;
                b.vy *= decay;

                /* تدحرج: كل ما تتحرك، اللف يزيد */
                var moved = Math.sqrt(b.vx*b.vx + b.vy*b.vy) * dt;
                b.rotation = (b.rotation || 0) + moved / b.r * 0.9;
            }
        }
    }

    function collideBalls(a, b) {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var d2 = dx*dx + dy*dy;
        var md = a.r + b.r;
        if (d2 >= md*md || d2 < 0.0001) return;

        var d = Math.sqrt(d2);
        var nx = dx/d, ny = dy/d;
        var overlap = md - d;
        a.x -= nx * overlap * 0.5;
        a.y -= ny * overlap * 0.5;
        b.x += nx * overlap * 0.5;
        b.y += ny * overlap * 0.5;

        var dvx = b.vx - a.vx;
        var dvy = b.vy - a.vy;
        var vn = dvx*nx + dvy*ny;
        if (vn > 0) return;

        var imp = -(1 + BALL_RESTITUTION) * vn / 2;
        a.vx -= imp * nx;
        a.vy -= imp * ny;
        b.vx += imp * nx;
        b.vy += imp * ny;

        /* سجّل أول تصادم للبيضاء */
        if (a.number === 0 && G.firstContact === null) G.firstContact = b.number;
        if (b.number === 0 && G.firstContact === null) G.firstContact = a.number;
    }

    function collideCushion(b) {
        /* قرب جيب → خليه يكمل */
        for (var i = 0; i < pockets.length; i++) {
            var pk = pockets[i];
            var dx = b.x - pk.x;
            var dy = b.y - pk.y;
            var d = Math.sqrt(dx*dx + dy*dy);
            if (d < pk.r + b.r * 1.5) return;
        }

        var minX = CUSHION + b.r;
        var maxX = LW - CUSHION - b.r;
        var minY = CUSHION + b.r;
        var maxY = LH - CUSHION - b.r;

        var hit = false;
        if (b.x < minX) { b.x = minX; b.vx = -b.vx * CUSHION_RESTITUTION; hit = true; }
        if (b.x > maxX) { b.x = maxX; b.vx = -b.vx * CUSHION_RESTITUTION; hit = true; }
        if (b.y < minY) { b.y = minY; b.vy = -b.vy * CUSHION_RESTITUTION; hit = true; }
        if (b.y > maxY) { b.y = maxY; b.vy = -b.vy * CUSHION_RESTITUTION; hit = true; }

        if (hit && b.number === 0 && G.firstContact !== null) {
            G.cueHitCushion = true;
        }
    }

    function checkPocket(b) {
        for (var i = 0; i < pockets.length; i++) {
            var pk = pockets[i];
            var dx = b.x - pk.x;
            var dy = b.y - pk.y;
            var d = Math.sqrt(dx*dx + dy*dy);

            if (d < pk.r * 0.95) {
                b.active = false;
                b.vx = 0; b.vy = 0;
                b.pocketedAt = i;

                if (b.number !== 0) {
                    G.pocketedThisShot.push(b.number);
                }
                return;
            }
        }
    }

    function allStopped() {
        for (var i = 0; i < balls.length; i++) {
            if (balls[i].active && (balls[i].vx !== 0 || balls[i].vy !== 0)) return false;
        }
        return true;
    }

    /* ═══ الحلقة ═══ */
    function loop(ts) {
        if (!running) return;
        if (!lastTime) lastTime = ts;
        var dt = Math.min(ts - lastTime, 50) / 16.67;
        lastTime = ts;

        step(dt);
        draw();

        if (!allStopped()) {
            requestAnimationFrame(loop);
        } else {
            setTimeout(endOfShot, 180);
        }
    }

    /* ═══ نهاية الضربة: قوانين ═══ */
    function endOfShot() {
        if (gameOver) return;
        running = false;
        lastTime = 0;
        power = 0;

        var cuePocketed = !balls[0].active;
        var playerGroup = G.turn === 1 ? G.p1Group : G.p2Group;
        var opponentGroup = G.turn === 1 ? G.p2Group : G.p1Group;

        var pocketed = G.pocketedThisShot.slice();
        var eightPocketed = pocketed.indexOf(8) !== -1;
        var myGroupPocketed = false;

        /* شو دخل من مجموعتي؟ */
        for (var i = 0; i < pocketed.length; i++) {
            if (playerGroup && getBallGroup(pocketed[i]) === playerGroup) {
                myGroupPocketed = true;
            }
        }

        /* ═══ فحص الأخطاء ═══ */
        var foul = false;
        var foulReason = '';

        /* خطأ 1: الكرة البيضاء دخلت */
        if (cuePocketed) {
            foul = true;
            foulReason = 'الكرة البيضاء دخلت';
        }

        /* خطأ 2: ما ضرب كرة */
        if (!foul && G.firstContact === null) {
            foul = true;
            foulReason = 'ما ضربت أي كرة';
        }

        /* خطأ 3: أول كرة ليست من مجموعته (أو 8) */
        if (!foul && playerGroup) {
            if (G.firstContact === 8) {
                /* إذا كان خصمه ما خلص، خطأ */
                if (!allGroupPocketed(playerGroup)) {
                    foul = true;
                    foulReason = 'ضربت الكرة 8 بدري';
                }
            } else if (getBallGroup(G.firstContact) !== playerGroup) {
                foul = true;
                foulReason = 'ضربت كرة الخصم';
            }
        }

        /* خطأ 4: الطاولة مفتوحة وضرب 8 */
        if (!foul && !playerGroup && G.firstContact === 8) {
            foul = true;
            foulReason = 'ضربت 8 والطاولة مفتوحة';
        }

        /* ═══ حالة: 8 دخلت ═══ */
        if (eightPocketed) {
            if (playerGroup && allGroupPocketed(playerGroup) && !cuePocketed && !foul) {
                /* فاز */
                endGame(G.turn, 'أدخل الكرة 8 بشكل صحيح! 🎉');
                return;
            } else {
                /* خسر */
                var loser = G.turn;
                var winner = loser === 1 ? 2 : 1;
                endGame(winner, 'اللاعب ' + loser + ' أدخل 8 بدري');
                return;
            }
        }

        /* ═══ إذا الطاولة مفتوحة، حدّد المجموعة ═══ */
        if (!G.p1Group && !G.p2Group && pocketed.length > 0) {
            for (var i = 0; i < pocketed.length; i++) {
                var g = getBallGroup(pocketed[i]);
                if (g) {
                    if (G.turn === 1) {
                        G.p1Group = g;
                        G.p2Group = g === 'solid' ? 'stripe' : 'solid';
                    } else {
                        G.p2Group = g;
                        G.p1Group = g === 'solid' ? 'stripe' : 'solid';
                    }
                    break;
                }
            }
        }

        /* ═══ Ball-in-Hand إذا خطأ ═══ */
        if (foul || cuePocketed) {
            G.turn = G.turn === 1 ? 2 : 1;
            G.ballInHand = true;
            balls[0].active = true;
            balls[0].vx = 0;
            balls[0].vy = 0;
            /* مؤقتاً نحطها بنص الجهة اليسار */
            balls[0].x = CUSHION + (LW - 2*CUSHION) * 0.22;
            balls[0].y = LH / 2;
            updateStatus('⚠️ ' + foulReason + ' — الخصم يحط الكرة بأي مكان');
            updateTurnUI();
            updateBallTracker();
            return;
        }

        /* ═══ بديل: كمّل أو بدّل ═══ */
        if (myGroupPocketed) {
            /* نفس اللاعب يكمل */
            updateStatus('✅ ' + (playerGroup === 'solid' ? 'كرة صحيحة' : 'كرة صحيحة') + ' — كمّل!');
        } else {
            G.turn = G.turn === 1 ? 2 : 1;
            updateStatus('بدّل الدور');
        }

        /* نظّف */
        G.pocketedThisShot = [];
        G.firstContact = null;
        G.cueHitCushion = false;

        updateTurnUI();
        updateBallTracker();
        draw();

        /* AI */
        if (mode === 'ai' && G.turn === 2 && !gameOver) {
            setTimeout(aiPlay, 800);
        }
    }

    function allGroupPocketed(group) {
        for (var i = 1; i <= 15; i++) {
            if (i === 8) continue;
            if (getBallGroup(i) === group) {
                var stillActive = false;
                for (var j = 0; j < balls.length; j++) {
                    if (balls[j].number === i && balls[j].active) {
                        stillActive = true;
                        break;
                    }
                }
                if (stillActive) return false;
            }
        }
        return true;
    }

    function endGame(winner, reason) {
        gameOver = true;
        G.winner = winner;

        setTimeout(function () {
            document.getElementById('blPlay').hidden = true;
            document.getElementById('blEnd').hidden = false;
            document.getElementById('blEndIcon').textContent = '🏆';
            document.getElementById('blEndTitle').textContent = players[winner].name + ' فاز!';
            document.getElementById('blEndMsg').textContent = reason;

            if (window.moudyCoins && mode === 'ai' && winner === 1) {
                window.moudyCoins.add(50);
            }
        }, 1200);
    }

    /* ═══ تحديث الواجهة ═══ */
    function updateStatus(msg, type) {
        var el = document.getElementById('blStatus');
        if (!el) return;
        el.textContent = msg || '';
        el.className = 'bl-status';
        if (type) el.classList.add(type);
    }

    function updateTurnUI() {
        var p1 = document.getElementById('blP1');
        var p2 = document.getElementById('blP2');
        var turnEl = document.getElementById('blTurn');
        if (p1) p1.classList.toggle('active', G.turn === 1);
        if (p2) p2.classList.toggle('active', G.turn === 2);
        if (turnEl) turnEl.textContent = G.turn;
    }

    function updateBallTracker() {
        var p1El = document.getElementById('blP1Balls');
        var p2El = document.getElementById('blP2Balls');
        if (!p1El || !p2El) return;

        p1El.innerHTML = '';
        p2El.innerHTML = '';

        /* حدّد المجموعات */
        var p1Group = G.p1Group;
        var p2Group = G.p2Group;

        /* إذا الطاولة مفتوحة، ورّي كل الكرات ماعدا 8 */
        if (!p1Group) {
            for (var i = 1; i <= 7; i++) p1El.appendChild(makeMini(i, false));
            for (var i = 9; i <= 15; i++) p2El.appendChild(makeMini(i, false));
            return;
        }

        for (var i = 1; i <= 15; i++) {
            if (i === 8) continue;
            var g = getBallGroup(i);
            var pocketed = !isBallActive(i);
            if (g === p1Group) p1El.appendChild(makeMini(i, pocketed));
            else if (g === p2Group) p2El.appendChild(makeMini(i, pocketed));
        }

        /* 8 */
        var eightPocketed = !isBallActive(8);
        var eight1 = makeMini(8, eightPocketed);
        var eight2 = makeMini(8, eightPocketed);
        p1El.appendChild(eight1);
        p2El.appendChild(eight2);
    }

    function makeMini(num, pocketed) {
        var el = document.createElement('div');
        el.className = 'bl-ball-mini' + (pocketed ? ' pocketed' : '');
        el.setAttribute('data-n', num);
        el.textContent = num;
        return el;
    }

    function isBallActive(num) {
        for (var i = 0; i < balls.length; i++) {
            if (balls[i].number === num && balls[i].active) return true;
        }
        return false;
    }

    /* ═══ التحكم ═══ */
    function getPos(e) {
        var rect = canvas.getBoundingClientRect();
        var cx = e.clientX, cy = e.clientY;
        if (e.touches && e.touches.length) {
            cx = e.touches[0].clientX;
            cy = e.touches[0].clientY;
        } else if (e.changedTouches && e.changedTouches.length) {
            cx = e.changedTouches[0].clientX;
            cy = e.changedTouches[0].clientY;
        }
        var px = (cx - rect.left) / rect.width * canvas.width;
        var py = (cy - rect.top) / rect.height * canvas.height;
        return { x: (px - offX) / scale, y: (py - offY) / scale };
    }

    function isPositionValid(x, y) {
        /* داخل الحدود */
        if (x < CUSHION + BALL_R || x > LW - CUSHION - BALL_R) return false;
        if (y < CUSHION + BALL_R || y > LH - CUSHION - BALL_R) return false;

        /* ما يكون فوق كرة تانية */
        for (var i = 1; i < balls.length; i++) {
            if (!balls[i].active) continue;
            var dx = x - balls[i].x;
            var dy = y - balls[i].y;
            if (dx*dx + dy*dy < (BALL_R * 2 + 2) * (BALL_R * 2 + 2)) return false;
        }

        /* ما يكون فوق جيب */
        for (var p = 0; p < pockets.length; p++) {
            var pk = pockets[p];
            var dx = x - pk.x;
            var dy = y - pk.y;
            if (dx*dx + dy*dy < pk.r * pk.r) return false;
        }

        return true;
    }

    function onDown(e) {
        if (running || gameOver) return;
        if (mode === 'ai' && G.turn === 2) return;

        var pos = getPos(e);
        var cue = balls[0];
        if (!cue || !cue.active) return;

        /* ═══ Ball-in-Hand: حرّك الكرة ═══ */
        if (G.ballInHand) {
            if (isPositionValid(pos.x, pos.y)) {
                cue.x = pos.x;
                cue.y = pos.y;
                G.ballInHand = false;
                updateStatus('✅ تم وضع الكرة — صوّب واضرب');
                draw();
            }
            return;
        }

        /* ═══ تصويب ═══ */
        aiming = true;
        updateAim(pos);
        draw();
    }

    function onMove(e) {
        if (running || gameOver) return;
        var pos = getPos(e);

        /* Ball-in-Hand: حرّك مع الماوس */
        if (G.ballInHand) {
            if (isPositionValid(pos.x, pos.y)) {
                balls[0].x = pos.x;
                balls[0].y = pos.y;
                draw();
            }
            return;
        }

        if (!aiming) return;
        updateAim(pos);
        draw();
    }

    function onUp(e) {
        if (running || gameOver) return;

        /* Ball-in-Hand: ثبّت */
        if (G.ballInHand) {
            var pos = getPos(e);
            if (isPositionValid(pos.x, pos.y)) {
                balls[0].x = pos.x;
                balls[0].y = pos.y;
                G.ballInHand = false;
                updateStatus('✅ تم وضع الكرة');
                draw();
            }
            return;
        }

        if (!aiming) return;
        aiming = false;

        if (power < 1.5) { power = 0; draw(); return; }

        var cue = balls[0];
        if (!cue) return;

        cue.vx = Math.cos(aimAngle) * power;
        cue.vy = Math.sin(aimAngle) * power;
        running = true;
        lastTime = 0;
        power = 0;
        G.firstContact = null;
        G.pocketedThisShot = [];
        G.cueHitCushion = false;

        requestAnimationFrame(loop);
    }

    function updateAim(pos) {
        var cue = balls[0];
        if (!cue) return;
        var dx = cue.x - pos.x;
        var dy = cue.y - pos.y;
        var d = Math.sqrt(dx*dx + dy*dy);
        if (d < 3) return;
        aimAngle = Math.atan2(dy, dx);
        power = Math.min(MAX_POWER, d / 10);
    }

    /* ═══ AI ═══ */
    function aiPlay() {
        if (G.turn !== 2 || gameOver) return;
        var cue = balls[0];
        if (!cue || !cue.active) return;

        /* Ball-in-hand */
        if (G.ballInHand) {
            /* ضعها بمكان عشوائي صالح */
            for (var tries = 0; tries < 50; tries++) {
                var x = CUSHION + BALL_R + Math.random() * (LW - 2*CUSHION - 2*BALL_R);
                var y = CUSHION + BALL_R + Math.random() * (LH - 2*CUSHION - 2*BALL_R);
                if (isPositionValid(x, y)) {
                    cue.x = x; cue.y = y;
                    G.ballInHand = false;
                    draw();
                    break;
                }
            }
        }

        /* ابحث عن هدف */
        var myGroup = G.p2Group;
        var targets = [];
        for (var i = 1; i < balls.length; i++) {
            var b = balls[i];
            if (!b.active) continue;
            if (myGroup) {
                if (getBallGroup(b.number) === myGroup) targets.push(b);
            } else if (b.number !== 8) {
                targets.push(b);
            }
        }

        /* إذا خلص مجموعته → 8 */
        if (myGroup && allGroupPocketed(myGroup)) {
            for (var i = 0; i < balls.length; i++) {
                if (balls[i].number === 8 && balls[i].active) {
                    targets = [balls[i]];
                    break;
                }
            }
        }

        if (targets.length === 0) return;

        var best = null;
        var bd = Infinity;
        for (var i = 0; i < targets.length; i++) {
            var d = Math.hypot(targets[i].x - cue.x, targets[i].y - cue.y);
            if (d < bd) { bd = d; best = targets[i]; }
        }
        if (!best) return;

        var dx = best.x - cue.x;
        var dy = best.y - cue.y;
        var angle = Math.atan2(dy, dx);
        var err = aiLevel === 'easy' ? 0.15 : aiLevel === 'medium' ? 0.06 : 0.015;
        angle += (Math.random() - 0.5) * err;
        var aiPower = aiLevel === 'easy' ? 13 : aiLevel === 'medium' ? 17 : 21;

        aimAngle = angle;
        power = aiPower;
        draw();

        setTimeout(function () {
            cue.vx = Math.cos(angle) * aiPower;
            cue.vy = Math.sin(angle) * aiPower;
            running = true;
            lastTime = 0;
            power = 0;
            G.firstContact = null;
            G.pocketedThisShot = [];
            requestAnimationFrame(loop);
        }, 600);
    }

    /* ═══ بدء اللعبة ═══ */
    function startGame() {
        document.getElementById('blPlay').hidden = false;

        setTimeout(function () {
            resize();
            buildPockets();
            buildBalls();

            G = {
                turn: 1,
                p1Group: null,
                p2Group: null,
                breakDone: false,
                ballInHand: false,
                firstContact: null,
                pocketedThisShot: [],
                cueHitCushion: false,
                winner: null
            };

            gameOver = false;
            running = false;
            aiming = false;
            power = 0;
            aimAngle = 0;
            lastTime = 0;

            document.getElementById('blStart').hidden = true;
            document.getElementById('blEnd').hidden = true;

            /* اسم وصورة اللاعب */
            var user = window.moudyAuth && window.moudyAuth.getUser ? window.moudyAuth.getUser() : null;
            if (user) {
                players[1].name = (user.displayName || 'أنت').split(' ')[0];
                players[1].avatar = user.photoURL || '';
            }

            updatePlayerUI();
            updateTurnUI();
            updateBallTracker();
            updateStatus('🎱 دور اللاعب 1 — اضرب!');

            draw();
        }, 50);
    }

    function updatePlayerUI() {
        var p1Name = document.getElementById('blP1Name');
        var p2Name = document.getElementById('blP2Name');
        var p1Av = document.getElementById('blP1Avatar');
        var p2Av = document.getElementById('blP2Avatar');
        var p1Init = document.getElementById('blP1Initial');
        var p2Init = document.getElementById('blP2Initial');

        if (p1Name) p1Name.textContent = players[1].name;
        if (p2Name) p2Name.textContent = players[2].name;
        if (p1Av && players[1].avatar) p1Av.src = players[1].avatar;
        if (p2Av && players[2].avatar) p2Av.src = players[2].avatar;
        if (p1Init) p1Init.textContent = players[1].name.charAt(0);
        if (p2Init) p2Init.textContent = players[2].name.charAt(0);
    }

    /* ═══ ربط ═══ */
    document.querySelectorAll('.bl-mode-card').forEach(function (c) {
        c.addEventListener('click', function () {
            document.querySelectorAll('.bl-mode-card').forEach(function (x) { x.classList.remove('active'); });
            c.classList.add('active');
            mode = c.dataset.mode;
            var ai = document.getElementById('blAiSection');
            if (ai) ai.hidden = (mode !== 'ai');
            if (mode === 'ai') {
                players[2].name = 'الكمبيوتر';
                players[2].avatar = '';
            } else {
                players[2].name = 'اللاعب 2';
                players[2].avatar = '';
            }
        });
    });

    document.querySelectorAll('.bl-level-card').forEach(function (c) {
        c.addEventListener('click', function () {
            document.querySelectorAll('.bl-level-card').forEach(function (x) { x.classList.remove('active'); });
            c.classList.add('active');
            aiLevel = c.dataset.level;
        });
    });

    document.querySelectorAll('.bl-theme-card').forEach(function (c) {
        c.addEventListener('click', function () {
            document.querySelectorAll('.bl-theme-card').forEach(function (x) { x.classList.remove('active'); });
            c.classList.add('active');
            theme = c.dataset.theme;
        });
    });

    var startBtn = document.getElementById('blStartBtn');
    if (startBtn) startBtn.addEventListener('click', startGame);

    var quitBtn = document.getElementById('blQuitBtn');
    if (quitBtn) quitBtn.addEventListener('click', function () {
        running = false;
        document.getElementById('blPlay').hidden = true;
        document.getElementById('blStart').hidden = false;
    });

    var againBtn = document.getElementById('blAgainBtn');
    if (againBtn) againBtn.addEventListener('click', startGame);

    var backBtn = document.getElementById('blBackBtn');
    if (backBtn) backBtn.addEventListener('click', function () {
        document.getElementById('blEnd').hidden = true;
        document.getElementById('blStart').hidden = false;
    });

    var helpBtn = document.getElementById('blHelpBtn');
    var helpModal = document.getElementById('blHelpModal');
    var helpClose = document.getElementById('blHelpClose');
    if (helpBtn) helpBtn.addEventListener('click', function () { helpModal.hidden = false; });
    if (helpClose) helpClose.addEventListener('click', function () { helpModal.hidden = true; });

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onUp);
    canvas.addEventListener('mouseleave', function () {
        if (aiming) { aiming = false; power = 0; draw(); }
    });

    canvas.addEventListener('touchstart', function (e) { e.preventDefault(); onDown(e); }, { passive: false });
    canvas.addEventListener('touchmove', function (e) { e.preventDefault(); onMove(e); }, { passive: false });
    canvas.addEventListener('touchend', function (e) { e.preventDefault(); onUp(e); }, { passive: false });

    window.addEventListener('resize', function () {
        var playEl = document.getElementById('blPlay');
        if (playEl && !playEl.hidden) {
            resize();
            draw();
        }
    });
})();

/* ==================================================================
   قسم: PWA — تفعيل التطبيق
   ------------------------------------------------------------------
   - يربط manifest.json
   - يسجّل Service Worker
   - يضيف ألوان الـ theme
   - زر "أضف للشاشة الرئيسية"
   ================================================================== */
   (function initPWA() {

    /* ═══ 1. أضف رابط manifest ═══ */
    if (!document.querySelector('link[rel="manifest"]')) {
        var link = document.createElement('link');
        link.rel = 'manifest';
        link.href = 'manifest.json';
        document.head.appendChild(link);
    }

    /* ═══ 2. أضف theme-color ═══ */
    if (!document.querySelector('meta[name="theme-color"]')) {
        var meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = '#0a1a0d';
        document.head.appendChild(meta);
    }

    /* ═══ 3. أضف apple-touch-icon (للموبايل آيفون) ═══ */
    if (!document.querySelector('link[rel="apple-touch-icon"]')) {
        var apple = document.createElement('link');
        apple.rel = 'apple-touch-icon';
        apple.href = 'icon.svg';
        document.head.appendChild(apple);
    }

    /* ═══ 4. اسم التطبيق على الموبايل ═══ */
    if (!document.querySelector('meta[name="apple-mobile-web-app-capable"]')) {
        var appleCap = document.createElement('meta');
        appleCap.name = 'apple-mobile-web-app-capable';
        appleCap.content = 'yes';
        document.head.appendChild(appleCap);

        var appleStatus = document.createElement('meta');
        appleStatus.name = 'apple-mobile-web-app-status-bar-style';
        appleStatus.content = 'black-translucent';
        document.head.appendChild(appleStatus);

        var appleTitle = document.createElement('meta');
        appleTitle.name = 'apple-mobile-web-app-title';
        appleTitle.content = 'مودي العربي';
        document.head.appendChild(appleTitle);
    }

    /* ═══ 5. سجّل Service Worker ═══ */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('service-worker.js', { scope: './' })
                .then(function (reg) {
                    console.log('[PWA] ✅ Service Worker جاهز');
                })
                .catch(function (err) {
                    console.warn('[PWA] فشل تسجيل SW:', err.message);
                });
        });
    }

    /* ═══ 6. زر "أضف للشاشة الرئيسية" ═══ */
    var deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;

        /* ما نعرضو بصفحة تسجيل الدخول */
        if (document.body.classList.contains('LOGIN-PAGE')) return;

        /* عرض الزر بعد 3 ثواني من فتح الموقع */
        setTimeout(function () { showInstallBanner(); }, 3000);
    });

    function showInstallBanner() {
        /* ما نكرر */
        if (document.querySelector('.pwa-install-banner')) return;
        if (!deferredPrompt) return;

        var banner = document.createElement('div');
        banner.className = 'pwa-install-banner';
        banner.innerHTML =
            '<div class="pwa-icon">📱</div>' +
            '<div class="pwa-info">' +
                '<div class="pwa-title">أضف موقع مودي للشاشة</div>' +
                '<div class="pwa-desc">اتصفح كتطبيق حقيقي بدون إنترنت</div>' +
            '</div>' +
            '<button class="pwa-install-btn" type="button">تثبيت</button>' +
            '<button class="pwa-close-btn" type="button">✕</button>';

        document.body.appendChild(banner);
        setTimeout(function () { banner.classList.add('show'); }, 50);

        banner.querySelector('.pwa-install-btn').addEventListener('click', function () {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(function (choice) {
                console.log('[PWA] اختيار المستخدم:', choice.outcome);
                deferredPrompt = null;
                banner.classList.remove('show');
                setTimeout(function () { banner.remove(); }, 400);
            });
        });

        banner.querySelector('.pwa-close-btn').addEventListener('click', function () {
            banner.classList.remove('show');
            setTimeout(function () { banner.remove(); }, 400);
            /* ما نرجّع نعرضو لمدة 3 أيام */
            try { localStorage.setItem('pwa-hidden', Date.now().toString()); } catch (e) {}
        });
    }

    /* ═══ 7. إذا مستخدم من قبل ورفض — ما نعرضو 3 أيام ═══ */
    try {
        var hidden = localStorage.getItem('pwa-hidden');
        if (hidden && Date.now() - Number(hidden) < 3 * 24 * 60 * 60 * 1000) {
            window.addEventListener('beforeinstallprompt', function (e) {
                e.preventDefault();
            });
        }
    } catch (e) {}

    /* ═══ 8. أضف للشاشة الرئيسية (iPhone — تعليمات) ═══ */
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    var isStandalone = window.navigator.standalone === true ||
                      window.matchMedia('(display-mode: standalone)').matches;

    if (isIOS && !isStandalone) {
        setTimeout(function () {
            if (document.querySelector('.pwa-ios-banner')) return;
            try {
                if (localStorage.getItem('pwa-ios-hidden')) return;
            } catch (e) {}

            var b = document.createElement('div');
            b.className = 'pwa-install-banner pwa-ios-banner';
            b.innerHTML =
                '<div class="pwa-icon">📱</div>' +
                '<div class="pwa-info">' +
                    '<div class="pwa-title">أضف موقع مودي</div>' +
                    '<div class="pwa-desc">اضغط <b>مشاركة</b> ⬆️ ثم <b>أضف للشاشة</b></div>' +
                '</div>' +
                '<button class="pwa-close-btn" type="button">✕</button>';

            document.body.appendChild(b);
            setTimeout(function () { b.classList.add('show'); }, 50);

            b.querySelector('.pwa-close-btn').addEventListener('click', function () {
                b.classList.remove('show');
                setTimeout(function () { b.remove(); }, 400);
                try { localStorage.setItem('pwa-ios-hidden', '1'); } catch (e) {}
            });
        }, 5000);
    }

})();


/* ==================================================================
   قسم: زر تثبيت التطبيق (زر صغير دائري)
   ================================================================== */
   (function initInstallButton() {

    if (document.body.classList.contains('LOGIN-PAGE')) return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (window.navigator.standalone === true) return;
    if (document.querySelector('.pwa-install-fab')) return;

    var deferredPrompt = null;
    var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
        console.log('[PWA] ✅ جاهز للتثبيت');
    });

    window.addEventListener('appinstalled', function () {
        var btn = document.querySelector('.pwa-install-fab');
        if (btn) btn.remove();
    });

    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'pwa-install-fab';
    fab.setAttribute('aria-label', 'تثبيت التطبيق');
    fab.setAttribute('title', 'ثبّت التطبيق');
    fab.innerHTML = '<span class="pwa-fab-icon">📱</span>';

    document.body.appendChild(fab);

    fab.addEventListener('click', function () {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(function (choice) {
                if (choice.outcome === 'accepted') fab.remove();
                deferredPrompt = null;
            });
            return;
        }
        if (isIOS) { showIOSInstructions(); return; }
        showManualInstructions();
    });

    function showIOSInstructions() {
        showModal('📱', 'ثبّت موقع مودي',
            'اضغط زر <b>مشاركة</b> ⬆️ تحت في Safari',
            'انزل لتحت واختار <b>إضافة للشاشة الرئيسية</b> ➕',
            'اضغط <b>إضافة</b> في الأعلى');
    }

    function showManualInstructions() {
        showModal('💡', 'كيف تثبّت الموقع',
            'افتح قائمة المتصفح (الثلاث نقاط ⋮)',
            'اختار <b>تثبيت التطبيق</b> أو <b>إضافة للشاشة</b>',
            'وافق على التثبيت');
    }

    function showModal(icon, title, s1, s2, s3) {
        var modal = document.createElement('div');
        modal.className = 'pwa-instructions-modal';
        modal.innerHTML =
            '<div class="pwa-instructions-content">' +
                '<div class="pwa-instructions-icon">' + icon + '</div>' +
                '<h3>' + title + '</h3>' +
                '<p class="pwa-instructions-step">' +
                    '<span class="pwa-step-num">1</span>' + s1 +
                '</p>' +
                '<p class="pwa-instructions-step">' +
                    '<span class="pwa-step-num">2</span>' + s2 +
                '</p>' +
                '<p class="pwa-instructions-step">' +
                    '<span class="pwa-step-num">3</span>' + s3 +
                '</p>' +
                '<button class="pwa-instructions-close" type="button">فهمت</button>' +
            '</div>';

        document.body.appendChild(modal);
        setTimeout(function () { modal.classList.add('show'); }, 30);

        var close = function () {
            modal.classList.remove('show');
            setTimeout(function () { modal.remove(); }, 400);
        };

        modal.querySelector('.pwa-instructions-close').addEventListener('click', close);
        modal.addEventListener('click', function (e) {
            if (e.target === modal) close();
        });
    }

})();


/* ==================================================================
   قسم: نظام النقاط الموحّد (Points System)
   ------------------------------------------------------------------
   - كل لعبة بتعطي نقاط حسب صعوبتها
   - الهدف: 50,000 نقطة = رسالة لمودي
   - النقاط محفوظة بـ localStorage + مزامنة Firebase
   ================================================================== */
   (function initPointsSystem() {
    var STORAGE_KEY = 'moudy-points';
    var GOAL = 100000;    
    var REACHED_KEY = 'moudy-goal-reached';

    /* ---------- التخزين ---------- */
    function load() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : { total: 0 };
        } catch (e) { return { total: 0 }; }
    }

    function save(data) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
    }

    function get() {
        return load().total || 0;
    }

    /* ---------- إضافة نقاط ---------- */
    function add(amount, source) {
        if (!amount || amount <= 0) return 0;
        var data = load();
        data.total = (data.total || 0) + amount;
        data.lastSource = source || '';
        data.lastAdd = Date.now();
        save(data);

        /* تحديث الواجهة */
        updateUI();

        /* إشعار سريع */
        showPointsToast(amount, source);

        /* فحص الهدف */
        checkGoal(data.total);

        /* مزامنة مع Firebase */
        if (window.moudyCloud && window.moudyCloud.push) {
            try { window.moudyCloud.push(); } catch (e) {}
        }

        return data.total;
    }

    /* ---------- التقدم ---------- */
    function getProgress() {
        return Math.min(100, (get() / GOAL) * 100);
    }

    function getRemaining() {
        return Math.max(0, GOAL - get());
    }

    function hasReachedGoal() {
        return get() >= GOAL;
    }

    /* ---------- تحديث الواجهة ---------- */
    function updateUI() {
        var total = get();
        var formatted = total.toLocaleString('en');

        /* كل عناصر .points-value */
        document.querySelectorAll('.points-value').forEach(function (el) {
            el.textContent = formatted;
        });

        /* شريط التقدم */
        var percent = getProgress();
        document.querySelectorAll('.points-fill').forEach(function (el) {
            el.style.width = percent + '%';
        });

        document.querySelectorAll('.points-percent').forEach(function (el) {
            el.textContent = Math.floor(percent) + '%';
        });

        /* متبقي */
        document.querySelectorAll('.points-remaining').forEach(function (el) {
            el.textContent = getRemaining().toLocaleString('en');
        });

        /* حالة الوصول */
        document.querySelectorAll('.goal-section').forEach(function (el) {
            el.classList.toggle('goal-reached', hasReachedGoal());
        });
    }

    /* ---------- Toast عند كسب نقاط ---------- */
    function showPointsToast(amount, source) {
        var toast = document.createElement('div');
        toast.className = 'points-toast';
        toast.innerHTML =
            '<span class="points-toast-icon">⭐</span>' +
            '<span class="points-toast-text">+' + amount + ' نقطة</span>' +
            (source ? '<span class="points-toast-source">' + source + '</span>' : '');

        document.body.appendChild(toast);
        setTimeout(function () { toast.classList.add('show'); }, 30);
        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () { toast.remove(); }, 400);
        }, 2200);
    }

    /* ---------- فحص الوصول للهدف ---------- */
    function checkGoal(total) {
        if (total < GOAL) return;
        try {
            if (localStorage.getItem(REACHED_KEY) === 'true') return;
            localStorage.setItem(REACHED_KEY, 'true');
        } catch (e) {}
        setTimeout(showGoalPopup, 800);
    }

    function showGoalPopup() {
        var popup = document.createElement('div');
        popup.className = 'goal-popup';
        popup.innerHTML =
            '<div class="goal-popup-content">' +
                '<div class="goal-popup-icon">🎉</div>' +
                '<h2>وصلت للهدف!</h2>' +
                '<p>جمعت <strong>' + GOAL.toLocaleString('en') + '</strong> نقطة!</p>' +
                '<p class="goal-popup-msg">هلق فيك تبعت رسالة لمودي العربي وهو رح يرد عليك!</p>' +
                '<a href="goal.html" class="goal-popup-btn">📩 اكتب رسالتك لمودي</a>' +
                '<button class="goal-popup-close" type="button">بعدين</button>' +
            '</div>';

        document.body.appendChild(popup);
        setTimeout(function () { popup.classList.add('show'); }, 30);

        popup.querySelector('.goal-popup-close').addEventListener('click', function () {
            popup.classList.remove('show');
            setTimeout(function () { popup.remove(); }, 400);
        });
    }

    function injectNavIcon() {
        var nav = document.getElementById('siteNav');
        if (!nav) return;
        if (nav.querySelector('.points-nav-icon')) return;
        var a = document.createElement('a');
        a.href = 'goal.html';
        a.className = 'points-nav-icon';
        a.setAttribute('aria-label', 'تقدمي');
        a.setAttribute('title', '🏆 تقدمي نحو مودي');
        a.innerHTML = '🏆<span class="points-value">0</span>';
        nav.appendChild(a);
    }
    /* ---------- API عام ---------- */
    window.moudyPoints = {
        add: add,
        get: get,
        getGoal: function () { return GOAL; },
        getProgress: getProgress,
        getRemaining: getRemaining,
        hasReachedGoal: hasReachedGoal,
        update: updateUI
    };

    /* ---------- تشغيل ---------- */
    injectNavIcon();
    updateUI();

    /* اسمع للمزامنة */
    window.addEventListener('cloud-synced', updateUI);

    /* كل 30 ثانية تحديث (لما تتغير من تاب تاني) */
    setInterval(updateUI, 30000);

})();


/* ==================================================================
   قسم: إشعار نظام النقاط (يظهر مرة واحدة لكل مستخدم جديد)
   ================================================================== */
   (function initPointsIntro() {
    var KEY = 'moudy-points-intro-shown';

    /* ما نعرضو بصفحة تسجيل الدخول */
    if (document.body.classList.contains('LOGIN-PAGE')) return;

    /* إذا المستخدم شافو من قبل → لا تعرضو */
    try {
        if (localStorage.getItem(KEY) === 'true') return;
    } catch (e) { return; }

    /* استنى 5 ثواني عشان الصفحة تحمّل */
    setTimeout(function () {
        var popup = document.createElement('div');
        popup.className = 'points-intro-popup';
        popup.innerHTML =
            '<div class="points-intro-content">' +
                '<div class="points-intro-icon">⭐</div>' +
                '<h2>اجمع النقاط ووصل لمودي!</h2>' +
                '<p class="points-intro-sub">كل نشاط بالموقع بيعطيك نقاط. لما تجمع <strong>100,000 نقطة</strong> رح تقدر تبعت رسالة لمودي العربي وهو رح يرد عليك!</p>' +
                '<div class="points-intro-list">' +
                    '<div class="points-intro-item">' +
                        '<span class="points-intro-emoji">🎧</span>' +
                        '<span class="points-intro-name">سماع أغنية</span>' +
                        '<span class="points-intro-value">+100</span>' +
                    '</div>' +
                    '<div class="points-intro-item">' +
                        '<span class="points-intro-emoji">🎹</span>' +
                        '<span class="points-intro-name">زمزم</span>' +
                        '<span class="points-intro-value">+600</span>' +
                    '</div>' +
                    '<div class="points-intro-item">' +
                        '<span class="points-intro-emoji">🎵</span>' +
                        '<span class="points-intro-name">خمّن الأغنية</span>' +
                        '<span class="points-intro-value">+250</span>' +
                    '</div>' +
                    '<div class="points-intro-item">' +
                        '<span class="points-intro-emoji">⚡</span>' +
                        '<span class="points-intro-name">تحدي اليوم</span>' +
                        '<span class="points-intro-value">+50</span>' +
                    '</div>' +
                '</div>' +
                '<a href="goal.html" class="points-intro-btn">📊 شوف تقدمي</a>' +
                '<button class="points-intro-close" type="button">فهمت</button>' +
            '</div>';

        document.body.appendChild(popup);
        setTimeout(function () { popup.classList.add('show'); }, 30);

        /* لما يسكّر → احفظ إنو شافو */
        var close = function () {
            popup.classList.remove('show');
            setTimeout(function () { popup.remove(); }, 400);
            try { localStorage.setItem(KEY, 'true'); } catch (e) {}
        };

        popup.querySelector('.points-intro-close').addEventListener('click', close);
        popup.addEventListener('click', function (e) {
            if (e.target === popup) close();
        });

    }, 5000);
})();

