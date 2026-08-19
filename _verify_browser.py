import http.server
import socketserver
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

PORT = 8766
ROOT = Path(__file__).resolve().parent


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, format, *args):
        pass


def main():
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), Handler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    url = f"http://127.0.0.1:{PORT}/index.html"
    out = ROOT / "_verify_shots"
    out.mkdir(exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        console = []
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("console", lambda msg: console.append(f"{msg.type}: {msg.text}") if msg.type == "error" else None)
        page.on("pageerror", lambda err: console.append(f"pageerror: {err}"))
        page.goto(url, wait_until="domcontentloaded")
        page.wait_for_timeout(400)
        page.evaluate("() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'))")

        page.screenshot(path=str(out / "desktop-hero.png"), full_page=False)

        sections = [
            "request",
            "overview",
            "meaning",
            "flow",
            "tools",
            "safety",
            "resources",
            "about",
        ]
        for sid in sections:
            page.locator(f"#{sid}").scroll_into_view_if_needed()
            page.wait_for_timeout(150)
            page.screenshot(path=str(out / f"desktop-{sid}.png"), full_page=False)

        page.evaluate("() => window.scrollTo(0,0)")
        page.wait_for_timeout(150)
        page.screenshot(path=str(out / "desktop-full.png"), full_page=True)

        # 1920 classroom
        page.set_viewport_size({"width": 1920, "height": 1080})
        page.goto(url, wait_until="domcontentloaded")
        page.wait_for_timeout(300)
        page.evaluate("() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'))")
        page.screenshot(path=str(out / "desktop-1920-hero.png"), full_page=False)

        # mobile
        page.set_viewport_size({"width": 375, "height": 812})
        page.goto(url, wait_until="domcontentloaded")
        page.wait_for_timeout(300)
        page.evaluate("() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'))")
        overflow = page.evaluate("() => document.documentElement.scrollWidth - document.documentElement.clientWidth")
        print("mobile overflow", overflow)
        page.screenshot(path=str(out / "mobile-hero.png"), full_page=False)
        page.locator(".nav-toggle").click()
        page.wait_for_timeout(200)
        open_count = page.locator("#site-menu a").count()
        print("menu links", open_count)
        print("menu open", page.locator("#site-menu").evaluate("el => el.classList.contains('is-open')"))
        page.screenshot(path=str(out / "mobile-menu.png"), full_page=False)
        page.locator('.nav-links a[href="#tools"]').click()
        page.wait_for_timeout(300)
        print("menu closed", page.locator("#site-menu").evaluate("el => !el.classList.contains('is-open')"))
        page.screenshot(path=str(out / "mobile-tools.png"), full_page=False)

        for sid in sections:
            page.locator(f"#{sid}").scroll_into_view_if_needed()
            page.wait_for_timeout(120)
            page.screenshot(path=str(out / f"mobile-{sid}.png"), full_page=False)

        print("=== CONSOLE ===")
        print(console or "none")
        browser.close()
    httpd.shutdown()


if __name__ == "__main__":
    main()
