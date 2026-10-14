"""
تجهيز مقاطع الأغاني لصفحة "خمّن الأغنية"
------------------------------------------
- يقرأ كل ملفات MP3 من مجلد "اغاني لعبه"
- يستخرج مقطع 15 ثانية من كل ملف (بعد الدقيقة الأولى، من مكان عشوائي)
- يحفظ المقاطع في مجلد "audio/songs/" باسم song_01.mp3، song_02.mp3 ...
- ينشئ ملف "songs.json" فيه اسم كل أغنية وملفها

التشغيل: python prepare_songs.py
"""

from pathlib import Path
import subprocess
import json
import random
import re
import shutil

# ============ إعدادات ============
SRC_FOLDER = Path('اغاني لعبه')          # مجلد الأغاني الأصلية
OUT_FOLDER = Path('audio/songs')         # مجلد المقاطع الناتجة
JSON_FILE = Path('songs.json')           # ملف الأسماء

CLIP_DURATION = 15                       # طول المقطع بالثواني
MIN_START = 60                           # ما يبدأ قبل ثانية 60
MAX_START = 120                          # ما يبدأ بعد ثانية 120
BITRATE = '96k'                          # جودة الصوت


# ============ تنظيف الأسماء ============
def clean_title(filename):
    """يحول اسم الملف إلى اسم أغنية نظيف"""
    name = filename

    # شيل الامتداد
    name = re.sub(r'\.(mp3|MP3|wav|m4a)$', '', name)

    # شيل (MP3) و [MP3]
    name = re.sub(r'[\(\[\{][^\)\]\}]*MP3[^\)\]\}]*[\)\]\}]', '', name, flags=re.IGNORECASE)

    # شيل "فيديو_كليب_"
    name = re.sub(r'فيديو[_ ]?كليب[_ ]?', '', name)

    # شيل MOUDY_ALARBE
    name = re.sub(r'[_ ]*MOUDY[_ ]?ALARBE[_ ]*', ' ', name, flags=re.IGNORECASE)

    # شيل MOUDY و ALARBE منفردين
    name = re.sub(r'\bMOUDY\b|\bALARBE\b', '', name, flags=re.IGNORECASE)

    # شيل (Official Music Video)
    name = re.sub(r'[\(\[][^\)\]]*(music video|official|lyric|audio)[^\)\]]*[\)\]]', '', name, flags=re.IGNORECASE)

    # شيل ___ الزايدة
    name = re.sub(r'_{2,}', ' - ', name)

    # شيل _ المفردة
    name = name.replace('_', ' ')

    # شيل المسافات الزايدة
    name = re.sub(r'\s+', ' ', name).strip()

    # شيل - الزايدة
    name = name.strip(' -')

    return name or 'أغنية'


# ============ فحص المجلد ============
if not SRC_FOLDER.is_dir():
    raise SystemExit(
        f'❌ ما لقيت مجلد "{SRC_FOLDER}".\n'
        'تأكد إنو اسم المجلد بالضبط "اغاني لعبه" وموجود بجانب هالملف.'
    )

# ============ جلب ffmpeg ============
if Path('ffmpeg').exists():
    FFMPEG = str(Path('ffmpeg').absolute())
    print(f'✅ ffmpeg محلي: {FFMPEG}\n')
elif Path('ffmpeg.exe').exists():
    FFMPEG = str(Path('ffmpeg.exe').absolute())
    print(f'✅ ffmpeg محلي: {FFMPEG}\n')
else:
    FFMPEG = shutil.which('ffmpeg')
    if FFMPEG:
        print(f'✅ ffmpeg من النظام: {FFMPEG}\n')
    else:
        raise SystemExit(
            '❌ ما لقيت ffmpeg.\n'
            'تأكد إنك حطيت ffmpeg بمجلد المشروع.'
        )

# ============ تجميع الملفات ============
AUDIO_EXT = {'.mp3', '.wav', '.m4a', '.ogg'}
files = sorted([f for f in SRC_FOLDER.iterdir() if f.suffix.lower() in AUDIO_EXT])

if not files:
    raise SystemExit(f'❌ مجلد "{SRC_FOLDER}" فاضي أو ما فيه ملفات صوتية.')

print(f'🎵 لقيت {len(files)} ملف أغنية\n')

# ============ تجهيز المجلدات ============
OUT_FOLDER.mkdir(parents=True, exist_ok=True)

# ============ معالجة كل ملف ============
songs = []
for i, f in enumerate(files, start=1):
    song_id = f'song_{i:02d}'
    out_file = OUT_FOLDER / f'{song_id}.mp3'

    # اختار مكان البداية (عشوائي)
    start_time = random.randint(MIN_START, MAX_START)

    # نفّذ أمر ffmpeg
    try:
        subprocess.run(
            [
                FFMPEG,
                '-y',
                '-ss', str(start_time),
                '-i', str(f),
                '-t', str(CLIP_DURATION),
                '-b:a', BITRATE,
                '-map_metadata', '-1',
                str(out_file)
            ],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        title = clean_title(f.name)
        size_kb = out_file.stat().st_size // 1024

        songs.append({
            'id': song_id,
            'title': title,
            'file': f'{song_id}.mp3',
            'original': f.name
        })

        print(f'  ✅ [{i:02d}/{len(files)}] {title[:50]:<50} ({size_kb} KB)')

    except subprocess.CalledProcessError as e:
        print(f'  ❌ [{i:02d}/{len(files)}] فشل: {f.name}')

# ============ حفظ songs.json ============
JSON_FILE.write_text(
    json.dumps(songs, ensure_ascii=False, indent=2),
    encoding='utf-8'
)

print(f'\n✅ تم تجهيز {len(songs)} مقطع.')
print(f'📄 ملف الأسماء: {JSON_FILE}')
print(f'📁 المقاطع: {OUT_FOLDER}')