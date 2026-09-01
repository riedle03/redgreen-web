import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(__dirname, "shots_request");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      if (urlPath.endsWith("/")) urlPath += "index.html";
      const filePath = path.join(root, urlPath.replace(/^\//, ""));
      if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        res.writeHead(404); res.end("Not found"); return;
      }
      res.writeHead(200, { "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(0, "127.0.0.1", () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` }));
  });
}

const { server, base } = await startServer();
const browser = await chromium.launch({ headless: true });
try {
  for (const [name, size] of [["d1280", { width: 1280, height: 900 }], ["m390", { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport: size });
    await page.goto(`${base}/index.html#request`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    const card = page.locator('.viz-card[data-viz="trend"]');
    await card.locator('.viz-btn[data-panel="table"]').click();
    await page.waitForTimeout(150);
    await card.screenshot({ path: path.join(outDir, `${name}_trend_table.png`) });
    await card.locator('.viz-btn[data-panel="chart"]').click();
    await page.waitForTimeout(150);
    await card.screenshot({ path: path.join(outDir, `${name}_trend_chart.png`) });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    console.log(JSON.stringify({ name, overflow, tableVisible: await page.locator("#viz-trend-table").isVisible(), chartVisible: await page.locator("#viz-trend-chart").isVisible() }));
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
