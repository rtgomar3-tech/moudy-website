"""
تنظيف أسماء الأغاني — نسخة محسّنة
------------------------------------
- يقرأ ملف songs.json
- يستخرج الجزء العربي من كل اسم
- يحفظ النتيجة في songs.json

التشغيل: python clean_titles.py
"""
from pathlib import Path
import json
import re

JSON_FILE = Path('songs.json')

if not JSON_FILE.exists():
    raise SystemExit('ما لقيت songs.json')

songs = json.loads(JSON_FILE.read_text(encoding='utf-8'))

# كلمات مفتاحية بالإنجليزية لازم نشيلها
STOPWORDS = [
    'official', 'video', 'clip', 'visualizer', 'lyric', 'audio',
    'music', 'feat', 'ft', 'remix', 'live', 'hd', '4k', 'mp3',
    'moudy', 'alarbe', 'al arbe', 'moudyalarbe', 'prod', 'beat',
    'k', 'mb', 'mp4', 'hq', 'lyrics', 'lyrical', 'remastered',
    'cover', 'album', 'single', 'ep', 'track', 'song'
]

def clean_title(raw):
    """يستخرج الجزء العربي من الاسم"""

    # 1) شيل (MP3 320K) و (Official Video) وأي أقواس فيها كلمات إنجليزية
    raw = re.sub(r'[\(\[][^\)\]]*[\)\]]', '', raw)

    # 2) قسّم على " - "
    parts = re.split(r'\s*-\s*', raw)

    # 3) دور على الجزء العربي
    arabic_parts = []
    for p in parts:
        p = p.strip()
        if not p:
            continue

        # تحقق إذا فيه حروف عربية
        arabic = re.findall(r'[\u0600-\u06FF]+', p)
        if not arabic:
            continue

        # تحقق إذا الجزء كله إنجليزي (يعني عربي بس بسيط)
        text_only_arabic = re.sub(r'[\u0600-\u06FF\s]', '', p)
        if text_only_arabic.strip() and not any(c.isalpha() for c in text_only_arabic.replace(' ', '')):
            pass

        # شيل الكلمات الإنجليزية من الجملة
        words = p.split()
        arabic_words = []
        for w in words:
            if re.search(r'[\u0600-\u06FF]', w):
                arabic_words.append(w)

        if arabic_words:
            candidate = ' '.join(arabic_words).strip()
            # شيل "مودي العربي" إذا لحالها
            candidate = re.sub(r'^مودي\s+العربي$', '', candidate).strip()
            candidate = re.sub(r'العربي\s+مودي', '', candidate).strip()
            if candidate and candidate not in ['مودي', 'العربي']:
                arabic_parts.append(candidate)

    # 4) اختار الأنسب
    if not arabic_parts:
        return raw.strip()[:40]

    # الأفضل: الجزء يلي فيه كلمتين-ثلاث
    best = None
    for p in arabic_parts:
        words = p.split()
        if 1 <= len(words) <= 5:
            if not best or len(words) > len(best.split()):
                best = p

    return best if best else arabic_parts[0]


# عدّل كل عنوان
for s in songs:
    old = s['title']
    new = clean_title(old)
    s['title'] = new
    print(f'  {old[:50]:<50} → {new}')

# احفظ
JSON_FILE.write_text(
    json.dumps(songs, ensure_ascii=False, indent=2),
    encoding='utf-8'
)

print(f'\n✅ تم تنظيف {len(songs)} عنوان.')
print(f'📄 الملف: {JSON_FILE}')