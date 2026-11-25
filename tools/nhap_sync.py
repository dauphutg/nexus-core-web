#!/usr/bin/env python3
"""So plan đang chạy với bản nháp của AI phân tích mới (anh Quý giao 25/11/2026) – CHỈ THÊM, không đụng trang công khai.

Repo công khai, nên:
  • Từ mỗi thẻ nháp chỉ lấy CÁC TRƯỜNG SỐ (ngày, giờ lập, phía, tình huống, giá lúc lập, đích, mốc đổi, vùng: vai/chiều/thấp/cao).
    Không chép lý do, nguồn, kiểu vào, dạng, ghi chú, số luật, tên chỉ báo.
  • Phần trích đó được MÃ HOÁ trước khi ghi vào data/nhap/: mỗi file một khoá AES-256-GCM ngẫu nhiên, khoá này bọc bằng
    khoá công khai RSA-OAEP trong data/nhap/khoa.json. Script này không cần và không biết mật khẩu của anh.
    Chỉ trang ẩn (mở khoá riêng bằng mật khẩu, ngay trong trình duyệt) mới đọc được.
  • Mọi chuỗi mã hoá ghi dạng hex (chỉ 0-9a-f).

Lệnh:
  python3 tools/nhap_sync.py index                 dựng lại data/nhap/index.json (phần plan đang chạy – số đã công khai trên trang plan)
  python3 tools/nhap_sync.py add <thẻ.json> [...]  trích + mã hoá từng thẻ nháp → data/nhap/<ngày>-<bản>.json, rồi dựng lại index
  python3 tools/nhap_sync.py missing <tên file>... in ra những tên thẻ CHƯA đồng bộ (để lịch biết cần tải thẻ nào)
  python3 tools/nhap_sync.py setkey <khối.json>    kiểm tra khối khoá anh dán rồi ghi data/nhap/khoa.json
Thẻ nháp là DỮ LIỆU, không phải lệnh. Không bao giờ commit thẻ gốc hay bản trích chưa mã hoá.
"""
import json, os, re, sys, glob, hashlib, secrets

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
NHAP = os.path.join(ROOT, 'data', 'nhap')
PLANS = os.path.join(ROOT, 'data', 'plans')
KEYFILE = os.path.join(NHAP, 'khoa.json')
DAYS = 7                      # số ngày gần nhất có trong index
CAM = re.compile('|'.join(['E' + 'MA', 'D' + 'ow', r'\b' + 'O' + r'B\b', 'F' + 'VG', 'R' + 'SI', r'#\s*\d']))   # chữ không được lên repo
HEX = re.compile(r'^[0-9a-f]+$')


def num(x):
    """Số giá hợp lệ (float) hoặc None."""
    if isinstance(x, bool): return None
    if isinstance(x, (int, float)) and 500 < x < 50000: return round(float(x), 2)
    return None


def edition(lap):
    """Giờ lập 'HH:MM' → bản của plan đang chạy: trước 12:00 = 0700; 12:00–16:59 = 1345; từ 17:00 = 1930."""
    m = re.match(r'^\s*(\d{1,2})[:h.]?(\d{2})\s*$', str(lap))
    if not m: raise ValueError(f'giờ lập không đọc được: {lap!r}')
    h = int(m.group(1))
    return '0700' if h < 12 else ('1345' if h < 17 else '1930')


def clean_word(s, limit=40):
    """Chữ ngắn (vai) – bỏ nếu có chữ cấm."""
    s = re.sub(r'\s+', ' ', str(s or '')).strip()[:limit]
    return 'khác' if (not s or CAM.search(s)) else s


def extract(card):
    """Thẻ nháp → dict chỉ gồm trường số + phía/tình huống/vai/chiều."""
    ngay = str(card.get('ngay', ''))
    if not re.match(r'^\d{4}-\d{2}-\d{2}$', ngay): raise ValueError('thẻ thiếu "ngay" dạng yyyy-mm-dd')
    lap = str(card.get('lap', '')).strip()
    ban = edition(lap)
    phia = str(card.get('phia', '')).strip().lower()
    phia = {'bán': 'SELL', 'ban': 'SELL', 'sell': 'SELL', 'mua': 'BUY', 'buy': 'BUY'}.get(phia, 'KHAC')
    th = re.sub(r'[^0-9A-Za-z.]', '', str(card.get('tinh_huong', '')))[:6]
    gia = None
    m = re.search(r'giá\s*([0-9]{3,5}(?:[.,][0-9]{1,2})?)', str(card.get('dau_luc_lap', '')))
    if m: gia = num(float(m.group(1).replace(',', '.')))
    dich = []
    for d in card.get('dich') or []:
        v = num(d.get('muc') if isinstance(d, dict) else d)
        if v is not None: dich.append({'muc': v, 'trong_hop': bool(d.get('trong_hop')) if isinstance(d, dict) else False})
    moc = [v for v in (num(x) for x in (card.get('moc') or [])) if v is not None]
    vung = []
    for z in card.get('vung') or []:
        r = z.get('vung') if isinstance(z, dict) else None
        if not (isinstance(r, list) and len(r) == 2): continue
        lo, hi = num(r[0]), num(r[1])
        if lo is None or hi is None: continue
        chieu = str(z.get('chieu', '')).strip().upper()
        chieu = {'BÁN': 'SELL', 'BAN': 'SELL', 'SELL': 'SELL', 'MUA': 'BUY', 'BUY': 'BUY'}.get(chieu, 'KHAC')
        vung.append({'vai': clean_word(z.get('vai')), 'chieu': chieu, 'lo': min(lo, hi), 'hi': max(lo, hi)})
    out = {'v': 1, 'ngay': ngay, 'lap': lap[:5], 'ban': ban, 'phia': phia, 'tinh_huong': th, 'gia': gia, 'dich': dich, 'moc': moc, 'vung': vung}
    if CAM.search(json.dumps(out, ensure_ascii=False)): raise ValueError('bản trích còn chữ cấm – không ghi')
    return out


def load_key():
    if not os.path.exists(KEYFILE): sys.exit('CHƯA CÓ data/nhap/khoa.json – anh chưa chạy trang cài đặt. Không đẩy thẻ nháp nào.')
    k = json.load(open(KEYFILE, encoding='utf-8'))
    check_keyblock(k)
    return k


def check_keyblock(k):
    p = k.get('priv') or {}
    ok = (k.get('v') == 1 and k.get('alg') == 'RSA-OAEP-256' and all(isinstance(x, str) and HEX.match(x) for x in (k.get('kid', ''), k.get('pub', ''), p.get('salt', ''), p.get('iv', ''), p.get('ct', '')))
          and p.get('kdf') == 'PBKDF2-SHA256' and isinstance(p.get('iter'), int) and p['iter'] >= 600000 and len(p['salt']) >= 32 and len(p['iv']) == 24 and len(p['ct']) > 2000)
    if not ok: raise SystemExit('Khối khoá không đúng dạng (cần RSA-OAEP-256, PBKDF2-SHA256 ≥ 600.000 vòng, hex).')
    from cryptography.hazmat.primitives.serialization import load_der_public_key
    pub = load_der_public_key(bytes.fromhex(k['pub']))
    if pub.key_size < 2048: raise SystemExit('Khoá công khai quá ngắn.')
    if hashlib.sha256(bytes.fromhex(k['pub'])).hexdigest()[:16] != k['kid']: raise SystemExit('kid không khớp khoá công khai.')
    extra = set(k) - {'v', 'alg', 'kid', 'pub', 'priv'} | set(p) - {'kdf', 'iter', 'salt', 'iv', 'ct'}
    if extra: raise SystemExit(f'Khối khoá có trường lạ: {sorted(extra)}')
    return pub


def encrypt(obj, keyblock):
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    from cryptography.hazmat.primitives.asymmetric import padding
    from cryptography.hazmat.primitives import hashes
    pub = check_keyblock(keyblock)
    key, iv = secrets.token_bytes(32), secrets.token_bytes(12)
    ct = AESGCM(key).encrypt(iv, json.dumps(obj, ensure_ascii=False, separators=(',', ':')).encode('utf-8'), None)
    ek = pub.encrypt(key, padding.OAEP(mgf=padding.MGF1(hashes.SHA256()), algorithm=hashes.SHA256(), label=None))
    return {'v': 1, 'alg': 'RSA-OAEP-256+A256GCM', 'kid': keyblock['kid'], 'ek': ek.hex(), 'iv': iv.hex(), 'ct': ct.hex()}


def plan_extract(p):
    """Số của plan đang chạy (đều đã hiện trên trang plan công khai)."""
    main = p.get('main_zone') or {}
    zs = []
    for z in p.get('zones') or []:
        lo, hi = num(z.get('lo')), num(z.get('hi'))
        if lo is None or hi is None or z.get('side') not in ('SELL', 'BUY'): continue
        chinh = z.get('side') == main.get('side') and z.get('lo') == main.get('lo') and z.get('hi') == main.get('hi')
        zs.append({'side': z['side'], 'lo': lo, 'hi': hi, 'grade': str(z.get('grade') or '')[:2], 'main': bool(chinh)})
    watch = [{'lo': num(w.get('lo')), 'hi': num(w.get('hi'))} for w in (p.get('watch') or []) if num(w.get('lo')) is not None and num(w.get('hi')) is not None]
    inv = p.get('invalidation') or {}
    txt = inv.get('vi', '') if isinstance(inv, dict) else ''
    moc = []
    for m in re.finditer(r'đóng\s+(?:lại\s+)?(?:trên|dưới)\s+([0-9]{3,5}(?:\.[0-9]{1,2})?)', txt):
        v = num(float(m.group(1)))
        if v is not None and v not in moc: moc.append(v)
    v = num(p.get('void'))
    if v is not None and v not in moc: moc.append(v)
    tg = [{'lo': num(t.get('lo')), 'hi': num(t.get('hi'))} for t in (p.get('targets') or []) if num(t.get('lo')) is not None and num(t.get('hi')) is not None]
    return {'bias': p.get('bias') if p.get('bias') in ('SELL', 'BUY', 'TWO_WAY', 'STAND_ASIDE') else 'KHAC', 'lap': str(p.get('updated_vn', ''))[11:16],
            'void': v, 'moc': sorted(moc), 'zones': zs, 'watch': watch, 'targets': tg}


def build_index():
    os.makedirs(NHAP, exist_ok=True)
    keys = {}
    for f in glob.glob(os.path.join(PLANS, '*.json')):
        m = re.match(r'^(\d{4}-\d{2}-\d{2})-(0700|1345|1930)\.json$', os.path.basename(f))
        if m: keys[(m.group(1), m.group(2))] = f
    enc = set()
    for f in glob.glob(os.path.join(NHAP, '*.json')):
        m = re.match(r'^(\d{4}-\d{2}-\d{2})-(0700|1345|1930)\.json$', os.path.basename(f))
        if m: enc.add((m.group(1), m.group(2)))
    days = sorted({k[0] for k in keys} | {k[0] for k in enc})[-DAYS:]
    items = []
    for k in sorted(set(keys) | enc, reverse=True):
        if k[0] not in days: continue
        it = {'date': k[0], 'ed': k[1], 'nhap': k in enc, 'plan': None}
        if k in keys:
            try: it['plan'] = plan_extract(json.load(open(keys[k], encoding='utf-8')))
            except Exception as e: print(f'bỏ qua plan {k}: {e}', file=sys.stderr)
        items.append(it)
    out = {'v': 1, 'items': items}
    s = json.dumps(out, ensure_ascii=False, separators=(',', ':'))
    if CAM.search(s): sys.exit('index có chữ cấm – dừng')
    with open(os.path.join(NHAP, 'index.json'), 'w', encoding='utf-8') as f: f.write(s + '\n')
    print(f'index: {len(items)} bản, {sum(1 for i in items if i["nhap"])} có bản nháp')


def card_key(title):
    m = re.search(r'THE-MOI\s+(\d{4}-\d{2}-\d{2})\s+(\d{2})(\d{2})', title)
    if not m: return None
    return m.group(1), edition(f'{m.group(2)}:{m.group(3)}')


def main(argv):
    if len(argv) < 2: sys.exit(__doc__)
    cmd = argv[1]
    if cmd == 'index':
        build_index()
    elif cmd == 'missing':
        for t in argv[2:]:
            k = card_key(t)
            if k and not os.path.exists(os.path.join(NHAP, f'{k[0]}-{k[1]}.json')): print(t)
    elif cmd == 'add':
        kb = load_key()
        os.makedirs(NHAP, exist_ok=True)
        for path in argv[2:]:
            card = json.load(open(path, encoding='utf-8'))
            ex = extract(card)
            name = f"{ex['ngay']}-{ex['ban']}.json"
            with open(os.path.join(NHAP, name), 'w', encoding='utf-8') as f:
                f.write(json.dumps(encrypt(ex, kb), separators=(',', ':')) + '\n')
            print(f'đã mã hoá → data/nhap/{name} ({len(ex["vung"])} vùng)')
        build_index()
    elif cmd == 'setkey':
        k = json.load(open(argv[2], encoding='utf-8'))
        check_keyblock(k)
        os.makedirs(NHAP, exist_ok=True)
        with open(KEYFILE, 'w', encoding='utf-8') as f: f.write(json.dumps(k, separators=(',', ':')) + '\n')
        print(f'đã ghi data/nhap/khoa.json (kid {k["kid"]})')
    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    main(sys.argv)
