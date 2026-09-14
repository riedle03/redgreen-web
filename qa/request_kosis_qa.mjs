import { chromium } from "playwright";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const shotDir = path.join(__dirname, "shots_request");
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
    return {
      docOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
      docScrollWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      samples: bad.slice(0, 8),
    };
  });
}

async function assertRequestContent(page) {
  const section = page.locator("#request");
  await section.waitFor();
  const text = await section.innerText();
  const checks = {
    title: text.includes("학급 언어생활 사례 조사 의뢰서"),
    noEdition: !text.includes("보완판") && !text.includes("판본:") && !text.includes("후속·미실시"),
    noRetroNote: !text.includes("소급 수정") && !text.includes("v4 기록은 그대로"),
    a075: text.includes("DT_164003_A075") && text.includes("17.5%") && text.includes("17.2%") && text.includes("23.2%"),
    a075Types:
      text.includes("9.1%") &&
      text.includes("8.5%") &&
      text.includes("7.8%") &&
      text.includes("7.5%") &&
      text.includes("6.0%") &&
      text.includes("4.8%"),
    a134: text.includes("DT_164003_A134") && text.includes("44.8%") && text.includes("19.6%"),
    a142: text.includes("DT_164003_A142") && text.includes("9.8%"),
    a047: text.includes("DT_164003_A047") && text.includes("24.9%"),
    noTrial: !text.includes("시범서비스") && !text.includes("가상 의뢰") && !text.includes("가상 기관"),
    posterItem: text.includes("보고서와 포스터 작성"),
    scope: text.includes("전국 공공 통계") && text.includes("RED 카드"),
    item7: text.includes("공공 데이터와 비교하기"),
    missingRule: text.includes("최신 직접 통계를 찾지 못했다"),
    noMix: text.includes("서로 다른 표") && text.includes("특정 표현"),
    report3na: text.includes("3-나"),
    frame: text.includes("문장 틀"),
  };

  const links = await page.locator('#request a.src-link[target="_blank"]').evaluateAll((els) =>
    els.map((a) => ({ href: a.getAttribute("href"), text: a.textContent.trim() }))
  );
  const needed = ["DT_164003_A075", "DT_164003_A134", "DT_164003_A142", "DT_164003_A047"];
  const linkOk = needed.every((id) =>
    links.some((l) => l.text.includes(id) && l.href && l.href.includes(id) && l.href.includes("kosis.kr"))
  );

  const toKosis = await page.locator('#request a[href="kosis.html"]').count();
  return { checks, linkOk, linkCount: links.length, toKosis, textSample: text.slice(0, 180) };
}

async function runViewport(browser, base, name, size) {
  const page = await browser.newPage({ viewport: size });
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  const result = { name, size, consoleErrors, pageErrors };

  await page.goto(`${base}/index.html#request`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  result.request = await assertRequestContent(page);
  result.request.overflow = await overflowReport(page);
  await page.locator("#request").screenshot({ path: path.join(shotDir, `${name}_request.png`) });

  // Desktop nav presence / mobile menu toggle
  if (size.width >= 900) {
    const navKosis = await page.locator('a.nav-pill.pill-teal[href="kosis.html"]').count();
    const navRequest = await page.locator('a[href="#request"]').count();
    result.nav = { navKosis, navRequest, menuOpen: true };
    await page.screenshot({ path: path.join(shotDir, `${name}_index_nav.png`), fullPage: false });
  } else {
    const toggle = page.locator(".nav-toggle");
    await toggle.click();
    await page.waitForTimeout(250);
    const expanded = await toggle.getAttribute("aria-expanded");
    const menuVisible = await page.locator("#site-menu").evaluate((el) => {
      const s = window.getComputedStyle(el);
      return s.display !== "none" && s.visibility !== "hidden" && el.getBoundingClientRect().height > 0;
    });
    const navKosis = await page.locator('#site-menu a.nav-pill.pill-teal[href="kosis.html"]').count();
    const navRequest = await page.locator('#site-menu a[href="#request"]').count();
    result.nav = { expanded, menuVisible, navKosis, navRequest };
    await page.screenshot({ path: path.join(shotDir, `${name}_index_menu.png`), fullPage: false });
    // Close menu so it does not intercept later clicks
    if (expanded === "true" || menuVisible) {
      await toggle.click();
      await page.waitForTimeout(200);
    }
  }

  // Bidirectional: request -> kosis (href verified; navigate without sticky-header intercept)
  const toKosisHref = await page.locator('#request a[href="kosis.html"]').first().getAttribute("href");
  result.toKosisHref = toKosisHref;
  await page.goto(`${base}/kosis.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const fromKosis = await page.locator('a[href="index.html#request"]').count();
  const kosisNotice = await page.locator(".ai-notice").innerText();
  result.kosis = {
    fromKosis,
    noticeHasTrial: kosisNotice.includes("시범서비스"),
    overflow: await overflowReport(page),
  };
  await page.screenshot({ path: path.join(shotDir, `${name}_kosis.png`), fullPage: false });

  // Back to request via the reverse link href
  const backHref = await page.locator('a[href="index.html#request"]').first().getAttribute("href");
  result.backHref = backHref;
  await page.goto(`${base}/index.html#request`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  result.backToRequest = (await page.locator("#request h2").innerText()).includes("학급 언어생활 사례 조사 의뢰서");

  return result;
}

function passFail(result) {
  const fails = [];
  const c = result.request.checks;
  for (const [k, v] of Object.entries(c)) if (!v) fails.push(`content:${k}`);
  if (!result.request.linkOk) fails.push("src-links");
  if (result.request.linkCount < 4) fails.push("src-link-count");
  if (result.request.toKosis < 1) fails.push("to-kosis");
  if (result.toKosisHref !== "kosis.html") fails.push("to-kosis-href");
  if (result.request.overflow.docOverflow) fails.push("request-overflow");
  if (!result.nav.navKosis) fails.push("nav-kosis");
  if (!result.nav.navRequest) fails.push("nav-request");
  if (result.name.startsWith("m") && !result.nav.menuVisible) fails.push("mobile-menu");
  if (!result.kosis.fromKosis) fails.push("from-kosis");
  if (!result.kosis.noticeHasTrial) fails.push("kosis-trial");
  if (result.backHref !== "index.html#request") fails.push("back-href");
  if (!result.backToRequest) fails.push("back-to-request");
  if (result.consoleErrors.length) fails.push("console-errors");
  if (result.pageErrors.length) fails.push("page-errors");
  return fails;
}

const { server, base } = await startServer();
const browser = await chromium.launch({ headless: true });
const report = { base, createdAt: new Date().toISOString(), viewports: {}, pass: true, fails: [] };

try {
  const desktop = await runViewport(browser, base, "d1280", { width: 1280, height: 900 });
  const mobile = await runViewport(browser, base, "m390", { width: 390, height: 844 });
  report.viewports.desktop = desktop;
  report.viewports.mobile = mobile;
  const fails = [...passFail(desktop).map((f) => `desktop:${f}`), ...passFail(mobile).map((f) => `mobile:${f}`)];
  report.fails = fails;
  report.pass = fails.length === 0;
} finally {
  await browser.close();
  server.close();
}

const outPath = path.join(__dirname, "request_kosis_qa_report.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({ pass: report.pass, fails: report.fails, outPath }, null, 2));
process.exit(report.pass ? 0 : 1);
