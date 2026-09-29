"""화면 확인·PNG 변환 (2026-09-29) — Playwright(설치된 Chrome 사용)
  python docs/src/shoot.py png          img/brand/*.svg → mark-64/180/512.png, wordmark.png
  python docs/src/shoot.py page URL OUTDIR   데스크톱 1440·휴대폰 390 전체 쪽 캡처(움직임 끄고)
"""
import pathlib, subprocess, sys
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parents[2]
BRAND = ROOT / "img" / "brand"


IMPECCABLE = pathlib.Path.home() / ".claude/skills/impeccable/scripts/impeccable"


def provenance(png, src):
    """PNG 안에 출처를 새긴다(impeccable embed-prompt). 다시 만들 때마다 지워지므로 여기서 매번."""
    note = (f"origin: not generated. Rasterized with Playwright/Chrome (docs/src/shoot.py png) from img/brand/{src}.svg, "
            "which docs/src/build_brand.py outlines from Pretendard Black/Bold (OFL) and Nanum Pen Script (OFL) glyphs plus authored SVG proofreading marks.")
    subprocess.run(["sh", str(IMPECCABLE), "embed-prompt", str(png), "--prompt", note], check=False)


def pngs(p):
    b = p.chromium.launch(channel="chrome")
    pg = b.new_page()
    for name, size in (("mark", 64), ("mark", 180), ("mark", 512)):
        svg = (BRAND / f"{name}.svg").read_text(encoding="utf-8")
        pg.set_viewport_size({"width": size, "height": size})
        pg.set_content(f'<html><body style="margin:0;background:transparent">{svg.replace("width=\"64\" height=\"64\"", f"width=\"{size}\" height=\"{size}\"")}</body></html>')
        pg.locator("svg").screenshot(path=str(BRAND / f"{name}-{size}.png"), omit_background=True)
        provenance(BRAND / f"{name}-{size}.png", name)
        print("wrote", f"{name}-{size}.png")
    for name in ("wordmark", "wordmark-full"):
        svg = (BRAND / f"{name}.svg").read_text(encoding="utf-8")
        pg.set_viewport_size({"width": 2400, "height": 800})
        pg.set_content(f'<html><body style="margin:0;background:#fff">{svg}</body></html>')
        pg.locator("svg").screenshot(path=str(BRAND / f"{name}.png"))
        provenance(BRAND / f"{name}.png", name)
        print("wrote", f"{name}.png")
    b.close()


def page(p, url, outdir):
    out = pathlib.Path(outdir); out.mkdir(parents=True, exist_ok=True)
    b = p.chromium.launch(channel="chrome")
    for tag, vw, vh in (("desktop", 1440, 900), ("mobile", 390, 844)):
        ctx = b.new_context(viewport={"width": vw, "height": vh}, reduced_motion="reduce", device_scale_factor=1)
        pg = ctx.new_page()
        pg.goto(url, wait_until="networkidle")
        pg.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')")
        pg.wait_for_load_state("networkidle")
        pg.wait_for_timeout(600)
        H = pg.evaluate("document.documentElement.scrollHeight")
        if H <= 15000:
            pg.screenshot(path=str(out / f"{tag}.png"), full_page=True)
        else:  # Chrome 캡처 최대 16384px — 넘으면 처음으로 되감긴다. 나눠 찍는다(200px 겹침).
            y, i = 0, 0
            while y < H:
                h = min(10000, H - y)
                pg.screenshot(path=str(out / f"{tag}-{'abcdef'[i]}.png"), full_page=True, clip={"x": 0, "y": y, "width": vw, "height": h})
                if y + h >= H: break
                y += h - 200; i += 1
        pg.screenshot(path=str(out / f"{tag}-first.png"))
        over = pg.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
        fonts = pg.evaluate("Array.from(document.fonts).filter(f=>f.status==='loaded').map(f=>f.family+' '+f.weight).join(', ')")
        print(tag, "overflow-x:", over, "| fonts:", fonts)
        ctx.close()
    b.close()


if __name__ == "__main__":
    with sync_playwright() as p:
        if sys.argv[1] == "png":
            pngs(p)
        else:
            page(p, sys.argv[2], sys.argv[3])
