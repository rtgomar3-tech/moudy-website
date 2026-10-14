"""
تجهيز صور صفحة "صور" — نسخة بدون أي تثبيت إضافي
------------------------------------------------
هاي النسخة بتشتغل ببايثون الخام فقط:
  - بدون pillow (ما منحتاج pip ولا إنترنت نهائياً)
  - بنسخ الصور من imgs لمجلد photos (نسختين: full للعرض، thumbs للجدار)
  - بيقرأ أبعاد كل صورة وبيكتبها جوّا main.js

التشغيل:  python prepare_photos.py
"""
from pathlib import Path
import re
import shutil

SRC = Path('imgs')            # مجلد الصور الأصلية
OUT = Path('photos')          # مجلد النتائج
MAIN_JS = Path('main.js')
EXT = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}

MARK_START = '/* ======= PHOTOS-DATA-START ======= */'
MARK_END = '/* ======= PHOTOS-DATA-END ======= */'


def image_size(path):
    """بيقرأ عرض وارتفاع الصورة من داخل الملف نفسه — بدون مكتبات خارجية."""
    with open(path, 'rb') as f:
        head = f.read(32)

        # PNG: الأبعاد محفوظة بالبايت 16-24 بعد التوقيع
        if head[:8] == b'\x89PNG\r\n\x1a\n':
            w = int.from_bytes(head[16:20], 'big')
            h = int.from_bytes(head[20:24], 'big')
            return w, h

        # GIF
        if head[:6] in (b'GIF87a', b'GIF89a'):
            w = int.from_bytes(head[6:8], 'little')
            h = int.from_bytes(head[8:10], 'little')
            return w, h

        # WebP بنسخة VP8X
        if head[:4] == b'RIFF' and head[8:12] == b'WEBP' and head[12:16] == b'VP8X':
            w = 1 + int.from_bytes(head[24:27], 'little')
            h = 1 + int.from_bytes(head[27:30], 'little')
            return w, h

        # JPEG: لازم ندور على "ماركر" SOF يلي فيه الأبعاد
        if head[:2] == b'\xff\xd8':
            f.seek(2)
            while True:
                b = f.read(1)
                if not b:
                    break
                if b != b'\xff':
                    continue
                marker = f.read(1)
                while marker == b'\xff':          # بايتات ff زائدة
                    marker = f.read(1)
                if not marker or marker in (b'\xd8', b'\xd9') or b'\xd0' <= marker <= b'\xd7':
                    continue
                length = int.from_bytes(f.read(2), 'big')
                # كل ماركرات SOF (C0-CF عدا C4 وC8 وCC)
                if marker[0] in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                                 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                    f.read(1)                      # دقة الألوان
                    h = int.from_bytes(f.read(2), 'big')
                    w = int.from_bytes(f.read(2), 'big')
                    return w, h
                f.seek(length - 2, 1)              # تخطي هالقطعة وامشي للي بعدها

    return 0, 0  # ما قدرنا نقرأ الأبعاد — مو مشكلة، الصورة بتشتغل عادي


# 1) فحص مجلد الصور
if not SRC.is_dir():
    raise SystemExit(f'ما لقيت مجلد "{SRC}". '
                     'حط الصور الأصلية بمجلد اسمه imgs بجانب هالملف وارجع شغّلني.')

files = sorted(f for f in SRC.iterdir() if f.suffix.lower() in EXT)
if not files:
    raise SystemExit(f'مجلد "{SRC}" فاضي أو ما فيه صور بصيغة jpg / png / webp / gif.')

# 2) تجهيز المجلدات ونسخ الصور
(OUT / 'thumbs').mkdir(parents=True, exist_ok=True)
(OUT / 'full').mkdir(parents=True, exist_ok=True)

rows = []
for f in files:
    name = f.stem.replace(' ', '_') + f.suffix.lower()   # بنحافظ على الامتداد الأصلي
    shutil.copyfile(f, OUT / 'full' / name)
    shutil.copyfile(f, OUT / 'thumbs' / name)
    w, h = image_size(f)
    rows.append(f"    {{ file: '{name}', w: {w}, h: {h} }}")
    print(f'  جاهزة: {f.name} ({w}x{h})')

# 3) كتابة القائمة جوّا main.js بين العلامتين
if not MAIN_JS.is_file():
    raise SystemExit('ما لقيت main.js. شغّل هالسكربت من مجلد المشروع نفسه.')
text = MAIN_JS.read_text(encoding='utf-8')
block = (MARK_START + '\nconst PHOTOS = [\n' + ',\n'.join(rows) +
         '\n];\n' + MARK_END)
new_text, count = re.subn(re.escape(MARK_START) + r'.*?' + re.escape(MARK_END),
                          block, text, flags=re.S)
if count != 1:
    raise SystemExit('ما لقيت علامات PHOTOS-DATA داخل main.js.')
MAIN_JS.write_text(new_text, encoding='utf-8')

print(f'\nتم تجهيز {len(rows)} صورة وتحديث main.js بنجاح.')
