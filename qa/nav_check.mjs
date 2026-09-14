import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";

const root = path.resolve(".");
const server = http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || "/").split("?")[0]);
  if (p === "/kosis") p = "/kosis.html";
  if (p.endsWith("/")) p += "index.html";
  const fp = path.join(root, p.replace(/^\//, ""));
  if (!fs.existsSync(fp)) {
    res.writeHead(404);
    res.end("nf");
    return;
  }
  res.writeHead(200);
  fs.createReadStream(fp).pipe(res);
});

server.listen(0, "127.0.0.1", async () => {
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  const browser = await chromium.launch({ headless: true });
  for (const [name, size] of [
    ["d1280", { width: 1280, height: 900 }],
    ["m390", { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport: size });
    await page.goto(`${base}/index.html`, { waitUntil: "networkidle" });
    const nav = await page.evaluate(() => {
      const menu = document.getElementById("site-menu");
      const pills = [...document.querySelectorAll(".nav-pill")].map((a) => {
        const r = a.getBoundingClientRect();
        return {
          text: a.textContent.trim(),
          href: a.getAttribute("href"),
          visible: !!(a.offsetWidth || a.offsetHeight),
          inView: r.right <= window.innerWidth && r.left >= 0 && r.width > 0,
          right: Math.round(r.right),
        };
      });
      return {
        pills,
        menuDisplay: getComputedStyle(menu).display,
        toggleDisplay: getComputedStyle(document.querySelector(".nav-toggle")).display,
        docW: document.documentElement.scrollWidth,
        viewW: innerWidth,
      };
    });
    console.log(name, JSON.stringify(nav, null, 2));
    await page.screenshot({ path: `qa/shots_kosis/${name}_index_navfix.png`, fullPage: false });
    await page.goto(`${base}/kosis.html`, { waitUntil: "networkidle" });
    await page.screenshot({ path: `qa/shots_kosis/${name}_kosis_navfix.png`, fullPage: false });
    if (size.width < 500) {
      await page.click(".nav-toggle");
      await page.waitForTimeout(200);
      await page.screenshot({ path: `qa/shots_kosis/${name}_kosis_menu_fix.png`, fullPage: false });
    }
    await page.close();
  }
  await browser.close();
  server.close();
});
