"""브랜드 표지 빌더 (2026-09-29) — 글자를 윤곽선으로 바꾼 SVG를 만든다(폰트 없이 어디서나 같은 모양).

img/brand/wordmark.svg       RED RED(삭제 부호) + 위에 삽입한 GREEN GREEN
img/brand/wordmark-full.svg  「모르고 막 쓰면 RED RED,」 위에 「뜻 알고 바꾸면 GREEN GREEN」을 삽입한 전체 이름
img/brand/mark.svg           부호만(파비콘): 빨간 삭제선 + 초록 삽입표
*-white.svg                  어두운 바탕용(먹색 → 흰색)
PNG는 docs/src/render_brand_png.py 가 만든다.

서체: Pretendard Black(OFL, fonts/) · 나눔펜(OFL, docs/src/fonts — git·배포 제외. 없으면 받는다:
  curl -L -o docs/src/fonts/NanumPenScript-Regular.ttf https://github.com/google/fonts/raw/main/ofl/nanumpenscript/NanumPenScript-Regular.ttf)
실행: python docs/src/build_brand.py
"""
import pathlib
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "img" / "brand"
OUT.mkdir(parents=True, exist_ok=True)
GOTHIC = TTFont(ROOT / "fonts" / "Pretendard-Black.woff2")
GOTHIC_B = TTFont(ROOT / "fonts" / "Pretendard-Bold.woff2")
PEN = TTFont(ROOT / "docs" / "src" / "fonts" / "NanumPenScript-Regular.ttf")

INK, RED, GREEN = "#161616", "#d42a1f", "#14774a"


def text_path(font, text, size, x, y, tracking=0.0):
    """baseline (x, y), 글자 크기 size(px). 반환: (path d, 너비)"""
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    s = size / upm
    pen = SVGPathPen(gs)
    cx = x
    for ch in text:
        gname = cmap.get(ord(ch))
        if gname is None:
            raise ValueError(f"글리프 없음: {ch!r}")
        g = gs[gname]
        tp = TransformPen(pen, (s, 0, 0, -s, cx, y))
        g.draw(tp)
        cx += g.width * s + tracking * size
    return pen.getCommands(), cx - x - tracking * size


def strike(x0, x1, y, h, w=6.0, color=RED, loop=True):
    """삭제 부호: 약간 흔들리는 가로줄 + (loop) 끝의 작은 돼지꼬리 고리"""
    L = x1 - x0
    d = f"M{x0:.1f} {y+h*0.05:.1f} C{x0+L*0.3:.1f} {y-h*0.06:.1f} {x0+L*0.6:.1f} {y+h*0.1:.1f} {x1:.1f} {y:.1f}"
    if loop:
        d += (f" C{x1+h*0.3:.1f} {y:.1f} {x1+h*0.36:.1f} {y+h*0.38:.1f} {x1+h*0.16:.1f} {y+h*0.38:.1f}"
              f" C{x1-h*0.04:.1f} {y+h*0.38:.1f} {x1:.1f} {y-h*0.04:.1f} {x1+h*0.42:.1f} {y-h*0.28:.1f}")
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'


def caret(cx, top, wdt, hgt, w=5.0, color=GREEN):
    d = f"M{cx-wdt/2:.1f} {top+hgt:.1f} L{cx:.1f} {top:.1f} L{cx+wdt/2:.1f} {top+hgt:.1f}"
    return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'


def svg(w, h, body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" width="{w:.0f}" height="{h:.0f}" role="img" aria-label="{title}">'
            f"<title>{title}</title>{body}</svg>\n")


def write(name, content, white=False):
    (OUT / name).write_text(content, encoding="utf-8")
    if white:
        (OUT / name.replace(".svg", "-white.svg")).write_text(content.replace(INK, "#ffffff"), encoding="utf-8")
    print("wrote", name)


# ── 워드마크 ──
def _insert(d_before, w_total, gap_x, pen_text, pen_size, pen_base, x0):
    """바꾼 말의 가운데 틈이 원래 말의 가운데 틈 위에 오도록 놓는다. 반환: (d, x, w)"""
    _, w_new = text_path(PEN, pen_text, pen_size, 0, 0)
    half = pen_text.split(" ")
    _, w_first = text_path(PEN, " ".join(half[: len(half) // 2]), pen_size, 0, 0)
    _, w_sp = text_path(PEN, " ", pen_size, 0, 0)
    x = gap_x - w_first - w_sp / 2
    x = max(x, x0)
    d, w = text_path(PEN, pen_text, pen_size, x, pen_base)
    return d, x, w


def wordmark():
    size, pad = 120, 24
    base = pad + 150 + size * 0.72
    d_old, w_old = text_path(GOTHIC, "RED RED", size, pad, base, tracking=-0.01)
    _, w_red = text_path(GOTHIC, "RED", size, 0, 0)
    gap_x = pad + w_red + (w_old - 2 * w_red) / 2
    d_new, x_new, w_new = _insert(d_old, w_old, gap_x, "GREEN GREEN", 150, pad + 110, pad)
    mid_y = base - size * 0.36
    body = (f'<path d="{d_old}" fill="{INK}"/>'
            + strike(pad - 8, pad + w_old + 4, mid_y, size * 0.5, w=9)
            + caret(gap_x, base - size * 0.74 - 30, 30, 22, w=7)
            + f'<path d="{d_new}" fill="{GREEN}"/>')
    W = max(pad + w_old + size * 0.5, x_new + w_new) + pad
    H = base + pad + 8
    write("wordmark.svg", svg(W, H, body, "모르고 막 쓰면 RED RED, 뜻 알고 바꾸면 GREEN GREEN"), white=True)


def wordmark_full():
    size, pad = 76, 28
    base = pad + 118 + size * 0.75
    d1, w1 = text_path(GOTHIC_B, "모르고 막 쓰면 ", size, pad, base, tracking=-0.02)
    d2, w2 = text_path(GOTHIC, "RED RED", size, pad + w1, base, tracking=-0.01)
    comma_x = pad + w1 + w2 + size * 0.3
    d3, w3 = text_path(GOTHIC_B, ",", size, comma_x, base)
    # 삽입표는 RED RED 가운데. 바꾼 말은 삽입표에서 시작해 오른쪽으로 적는다(교정 여백 쪽으로).
    gap_x = pad + w1 + w2 / 2
    d4, w4 = text_path(PEN, "뜻 알고 바꾸면 GREEN GREEN", 100, gap_x - 30, pad + 70)
    mid_y = base - size * 0.36
    body = (f'<path d="{d1}" fill="{INK}"/><path d="{d2}" fill="{INK}"/><path d="{d3}" fill="{INK}"/>'
            + strike(pad + w1 - 6, pad + w1 + w2 + 2, mid_y, size * 0.5, w=7)
            + caret(gap_x, base - size * 0.74 - 24, 24, 18, w=6)
            + f'<path d="{d4}" fill="{GREEN}"/>')
    W = max(comma_x + w3, gap_x - 30 + w4) + pad
    H = base + pad + 6
    write("wordmark-full.svg", svg(W, H, body, "모르고 막 쓰면 RED RED, 뜻 알고 바꾸면 GREEN GREEN"), white=True)


def mark():
    # 64 격자 파비콘 — 흰 용지 위 부호 두 개. 작은 크기에서도 모양으로 구분된다.
    body = ('<rect width="64" height="64" rx="10" fill="#ffffff"/>'
            '<rect x=".75" y=".75" width="62.5" height="62.5" rx="9.5" fill="none" stroke="#d9dcdd" stroke-width="1.5"/>'
            + caret(32, 12, 28, 18, w=7)
            + strike(10, 54, 43, 16, w=7.5, loop=False))
    write("mark.svg", svg(64, 64, body, "RED GREEN 교정 부호"))


if __name__ == "__main__":
    wordmark()
    wordmark_full()
    mark()
