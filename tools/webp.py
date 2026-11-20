#!/usr/bin/env python3
"""WebP copies of the chart images (SEO F3, người dùng duyệt 21/11/2026): pages serve <name>.webp (< 100 KB) first and keep
<name>.png as the fallback – the PNG files stay because X posts, the EA tools and social cards (og:image) use them.
  python3 tools/webp.py <repo root>        → make/refresh the .webp of every data/charts/*.png that has none or an older one
Other tools call ensure(png) right after they save a chart."""
import glob, os, sys

QUALITY = 80
LIMIT = 100 * 1024   # bytes


def ensure(png):
    """write png[:-4] + '.webp' when missing or older than the png; returns the webp path or '' (never raises)"""
    try:
        from PIL import Image
        out = png[:-4] + '.webp'
        if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(png): return out
        with Image.open(png) as im:
            rgb = im.convert('RGB')
            for q in (QUALITY, 72, 64, 55):          # step down until the file is under LIMIT (tall before/after images)
                rgb.save(out, 'WEBP', quality=q, method=6)
                if os.path.getsize(out) <= LIMIT: break
        return out
    except Exception as e:
        print(f'webp: skipped {png}: {type(e).__name__}: {e}')
        return ''


def sweep(root):
    n = 0
    for png in sorted(glob.glob(os.path.join(root, 'data', 'charts', '*.png'))):
        w = png[:-4] + '.webp'
        fresh = os.path.exists(w) and os.path.getmtime(w) >= os.path.getmtime(png)
        if not fresh and ensure(png): n += 1
    return n


if __name__ == '__main__':
    print(f'webp: {sweep(sys.argv[1] if len(sys.argv) > 1 else ".")} file(s) written')
