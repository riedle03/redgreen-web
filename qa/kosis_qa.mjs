import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const shotDir = path.join(__dirname, "shots_kosis");
fs.mkdirSync(shotDir, { recursive: true });

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".json": "application/json",
};

function contentType(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      try {
        let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
        if (urlPath === "/kosis") urlPath = "/kosis.html";
        if (urlPath.endsWith("/")) urlPath += "index.html";
        const filePath = path.join(root, urlPath.replace(/^\//, ""));
        if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Not found");
          return;
        }
        res.writeHead(200, { "Content-Type": contentType(filePath) });
        fs.createReadStream(filePath).pipe(res);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(String(err));
      }
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, base: `http://127.0.0.1:${port}` });
    });
  });
}

function overflowReport(page) {
  return page.evaluate(() => {
    const bad = [];
    const nodes = Array.from(document.querySelectorAll("body *"));
    for (const el of nodes) {
      const style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") continue;
      if (el.scrollWidth > el.clientWidth + 2 && el.scrollWidth > window.innerWidth + 2) {
        bad.push({
          tag: el.tagName,
          className: String(el.className || "").slice(0, 80),
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
        });
      }
    }
    const docOverflow = document.documentElement.scrollWidth > window.innerWidth + 2;
    return {
      docOverflow,
      docScrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      samples: bad.slice(0, 8),
    };
  });
}

async function runViewport(browser, base, name, size) {
  const page = await browser.newPage({ viewport: size });
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  const result = {
    name,
    size,
    pages: {},
    consoleErrors,
    pageErrors,
  };

  // Home regression
  await page.goto(`${base}/index.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const homeNav = await page.locator('a.nav-pill.pill-teal[href="kosis.html"]').count();
  const homeResource = await page.locator('a.resource-card[href="kosis.html"]').count();
  const homeTools = await page.locator('a.guide-banner[href="kosis.html"]').count();
  const galleryLink = await page.locator('a[href="gallery.html"]').count();
  await page.screenshot({ path: path.join(shotDir, `${name}_index.png`), fullPage: false });
  result.pages.index = {
    navEntry: homeNav,
    resourceCard: homeResource,
    toolsBanner: homeTools,
    galleryLinks: galleryLink,
    overflow: await overflowReport(page),
  };

  // Gallery regression (do not mutate student pages; just open hub)
  await page.goto(`${base}/gallery.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const galleryCards = await page.locator("a, article, .card").count();
  await page.screenshot({ path: path.join(shotDir, `${name}_gallery.png`), fullPage: false });
  result.pages.gallery = {
    cardishCount: galleryCards,
    overflow: await overflowReport(page),
  };

  // KOSIS page
  await page.goto(`${base}/kosis`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const titleOk = await page.locator("h1").first().innerText();
  const noticeOk = await page.locator(".ai-notice").innerText();
  const metricCount = await page.locator(".metric-card").count();
  const barCount = await page.locator(".bar").count();
  const sourceLinks = await page.locator('.link-list a[target="_blank"]').count();

  // Interactions
  await page.fill("#q-inquiry", "우리 반에서 그 말을 왜 고를까?");
  await page.check("#mode-linked");
  await page.waitForSelector("#linked-fields:not([hidden])");
  await page.fill("#tbl-id", "DT_164003_A075");
  await page.fill("#tbl-name", "디지털 혐오 표현 경험");
  await page.fill("#tbl-target", "고등학생");
  await page.fill("#tbl-year", "2025");
  await page.check("#mode-none");
  const linkedHidden = await page.locator("#linked-fields").evaluate((el) => el.hidden);
  await page.check("#mode-linked");
  await page.fill("#q-scope", "전국 학생 대상 공공 자료에서는 디지털 혐오 표현 경험률을 보여 준다.");
  await page.fill("#q-compare", "우리 모둠은 표현 하나의 뜻을 조사했고 카드와 면접에서 선택 이유를 확인했다.");
  await page.check('input[name="chk1"]');
  await page.check('input[name="chk3"]');

  // localStorage persistence
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const persistedInquiry = await page.inputValue("#q-inquiry");
  const persistedMode = await page.isChecked("#mode-linked");
  const persistedId = await page.inputValue("#tbl-id");

  // print button exists and is clickable (do not rely on dialog)
  const printBtn = page.locator("#btn-print");
  const printVisible = await printBtn.isVisible();
  await printBtn.click({ trial: true });

  await page.screenshot({ path: path.join(shotDir, `${name}_kosis.png`), fullPage: true });

  // Mobile menu open check on kosis
  if (size.width <= 430) {
    const toggle = page.locator(".nav-toggle");
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(250);
      const menuOpen = await page.locator("#site-menu.is-open").count();
      result.pages.mobileMenuOpen = menuOpen;
      await page.screenshot({ path: path.join(shotDir, `${name}_kosis_menu.png`), fullPage: false });
      await toggle.click();
    }
  }

  result.pages.kosis = {
    title: titleOk,
    noticeHasWarning: noticeOk.includes("시범서비스"),
    metricCount,
    barCount,
    sourceLinks,
    linkedHiddenWhenNone: linkedHidden,
    persistedInquiry,
    persistedMode,
    persistedId,
    printVisible,
    overflow: await overflowReport(page),
  };

  await page.close();
  return result;
}

const { server, base } = await startServer();
const browser = await chromium.launch({ headless: true });
const report = {
  base,
  generatedAt: new Date().toISOString(),
  results: [],
};

try {
  report.results.push(await runViewport(browser, base, "desktop_1280", { width: 1280, height: 900 }));
  report.results.push(await runViewport(browser, base, "mobile_390", { width: 390, height: 844 }));
} finally {
  await browser.close();
  server.close();
}

const outPath = path.join(__dirname, "kosis_qa_report.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

const hardFails = [];
for (const r of report.results) {
  if (r.consoleErrors.length) hardFails.push(`${r.name}: console ${r.consoleErrors.join(" | ")}`);
  if (r.pageErrors.length) hardFails.push(`${r.name}: pageerror ${r.pageErrors.join(" | ")}`);
  if (!r.pages.index.navEntry) hardFails.push(`${r.name}: missing home nav entry`);
  if (!r.pages.index.resourceCard) hardFails.push(`${r.name}: missing resource card`);
  if (!r.pages.kosis.noticeHasWarning) hardFails.push(`${r.name}: missing warning`);
  if (r.pages.kosis.metricCount < 3) hardFails.push(`${r.name}: metrics`);
  if (r.pages.kosis.barCount < 5) hardFails.push(`${r.name}: bars`);
  if (r.pages.kosis.sourceLinks < 6) hardFails.push(`${r.name}: source links`);
  if (!r.pages.kosis.linkedHiddenWhenNone) hardFails.push(`${r.name}: none mode hide fields`);
  if (r.pages.kosis.persistedInquiry !== "우리 반에서 그 말을 왜 고를까?") hardFails.push(`${r.name}: persist inquiry`);
  if (!r.pages.kosis.persistedMode) hardFails.push(`${r.name}: persist mode`);
  if (r.pages.kosis.persistedId !== "DT_164003_A075") hardFails.push(`${r.name}: persist table id`);
  if (!r.pages.kosis.printVisible) hardFails.push(`${r.name}: print button`);
  if (r.pages.kosis.overflow.docOverflow) hardFails.push(`${r.name}: kosis horizontal overflow`);
  if (r.pages.index.overflow.docOverflow) hardFails.push(`${r.name}: index horizontal overflow`);
}

console.log(JSON.stringify({ ok: hardFails.length === 0, hardFails, outPath, shotDir }, null, 2));
if (hardFails.length) process.exit(1);
