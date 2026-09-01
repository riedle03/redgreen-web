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

async function assertRequestViz(page) {
  const section = page.locator("#request");
  await section.waitFor();
  const text = await section.innerText();

  const checks = {
    title: text.includes("학급 언어생활 사례 조사 의뢰서"),
    edition: text.includes("후속·미실시 학급용 KOSIS 보완판"),
    notRetroactive: text.includes("소급 수정 아님") || text.includes("v4 기록은 그대로"),
    trial: text.includes("시범서비스"),
    chart1: text.includes("학교급별 디지털 혐오 표현 경험률 추이"),
    chart2: text.includes("사이버 언어폭력 피해 세부 유형"),
    chart3: text.includes("2025 고등학생 혐오 표현 유형"),
    a075: text.includes("DT_164003_A075"),
    a134: text.includes("DT_164003_A134"),
    a142: text.includes("DT_164003_A142") && text.includes("9.8%"),
    a047: text.includes("DT_164003_A047") && text.includes("24.9%"),
    years: text.includes("2021") && text.includes("2022") && text.includes("2023") && text.includes("2024") && text.includes("2025"),
    midRebound: text.includes("15.1%") && text.includes("23.2%"),
    victimLabels: text.includes("욕설") && text.includes("희롱") && text.includes("조롱") && text.includes("협박"),
    victimClarify: text.includes("피해 유형의 구성") && !/우리 반 결과/.test(text.split("피해 유형의 구성")[0].slice(-80)),
    hsTypes: text.includes("신체·외모") && text.includes("다문화 가정") && text.includes("9.1%") && text.includes("2.8%"),
    compare: text.includes("통계가 보여 주는 것") && text.includes("RED 카드"),
    item7: text.includes("공공 데이터와 비교하기"),
    missingRule: text.includes("최신 직접 통계를 찾지 못했다"),
    noMix: text.includes("서로 다른 표") && text.includes("특정 표현"),
    report3na: text.includes("3-나"),
    frame: text.includes("문장 틀"),
    noStandaloneEntry: !text.includes("KOSIS 비교 페이지") && !text.includes("KOSIS 비교 활동지"),
  };

  const cards = await page.locator("#request .viz-card").count();
  const metricCards = await page.locator("#request .metric-mini").count();
  const toggles = await page.locator("#request .viz-toggle").count();
  const pressed = await page.locator('#request .viz-btn[aria-pressed]').count();
  const controls = await page.locator("#request .viz-btn[aria-controls]").count();
  const captions = await page.locator("#request table caption").count();

  const yearLabels = await page.locator("#viz-trend-chart .viz-axis-x text").allTextContents();
  const yearsOk = ["2021", "2022", "2023", "2024", "2025"].every((y) => yearLabels.includes(y));
  const noNumericAxisOnly = !yearLabels.some((t) => /^[1-5]$/.test(t.trim()));

  const victimLabelsSvg = await page.locator("#viz-victim-chart .bar-label").allTextContents();
  const victimLabelsOk = ["욕설", "희롱", "조롱", "기타", "저주", "협박"].every((l) =>
    victimLabelsSvg.includes(l)
  );

  const trendSvgVals = await page.locator("#viz-trend-chart text").allTextContents();
  const trendTableVals = await page.locator("#viz-trend-table td").allTextContents();
  const mustTrend = ["21.2", "10.4", "12.9", "17.6", "17.2", "15.1", "23.2", "17.5"];
  const trendSvgOk = mustTrend.every((v) => trendSvgVals.some((t) => t.includes(v)));
  const trendTableOk = mustTrend.every((v) => trendTableVals.some((t) => t.includes(v)));

  const links = await page.locator('#request a.src-link[target="_blank"]').evaluateAll((els) =>
    els.map((a) => ({ href: a.getAttribute("href"), text: a.textContent.trim() }))
  );
  const needed = ["DT_164003_A075", "DT_164003_A134", "DT_164003_A142", "DT_164003_A047"];
  const linkOk = needed.every((id) =>
    links.some((l) => (l.text.includes(id) || l.href.includes(id)) && l.href && l.href.includes("kosis.kr") && l.href.includes(id))
  );

  const entryLinks = await page.locator('a[href="kosis.html"], a[href="/kosis"], a[href="kosis"]').count();

  return {
    checks,
    cards,
    metricCards,
    toggles,
    pressed,
    controls,
    captions,
    yearsOk,
    noNumericAxisOnly,
    victimLabelsOk,
    trendSvgOk,
    trendTableOk,
    linkOk,
    linkCount: links.length,
    entryLinks,
    textSample: text.slice(0, 200),
  };
}

async function assertToggle(page) {
  const card = page.locator('.viz-card[data-viz="trend"]');
  const chartBtn = card.locator('.viz-btn[data-panel="chart"]');
  const tableBtn = card.locator('.viz-btn[data-panel="table"]');
  const chartPanel = page.locator("#viz-trend-chart");
  const tablePanel = page.locator("#viz-trend-table");

  await tableBtn.focus();
  await tableBtn.press("Enter");
  await page.waitForTimeout(120);
  const afterTable = {
    tablePressed: await tableBtn.getAttribute("aria-pressed"),
    chartPressed: await chartBtn.getAttribute("aria-pressed"),
    tableHidden: await tablePanel.getAttribute("hidden"),
    chartHidden: await chartPanel.getAttribute("hidden"),
    tableVisible: await tablePanel.isVisible(),
    chartVisible: await chartPanel.isVisible(),
  };

  await chartBtn.focus();
  await chartBtn.press("Enter");
  await page.waitForTimeout(120);
  const afterChart = {
    tablePressed: await tableBtn.getAttribute("aria-pressed"),
    chartPressed: await chartBtn.getAttribute("aria-pressed"),
    tableVisible: await tablePanel.isVisible(),
    chartVisible: await chartPanel.isVisible(),
  };

  await tableBtn.focus();
  await tableBtn.press("ArrowRight");
  await page.waitForTimeout(120);
  const afterArrow = {
    chartPressed: await chartBtn.getAttribute("aria-pressed"),
    chartVisible: await chartPanel.isVisible(),
  };

  return { afterTable, afterChart, afterArrow };
}

async function runViewport(browser, base, name, size) {
  const page = await browser.newPage({ viewport: size });
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (/favicon\.ico/i.test(text)) return;
    consoleErrors.push(text);
  });
  page.on("requestfailed", (req) => {
    const url = req.url();
    if (/favicon\.ico/i.test(url)) return;
    consoleErrors.push(`requestfailed ${url} ${req.failure()?.errorText || ""}`.trim());
  });
  page.on("response", (res) => {
    if (res.status() < 400) return;
    const url = res.url();
    if (/favicon\.ico/i.test(url) || /\/kosis(\.html)?$/i.test(url)) return;
    consoleErrors.push(`http ${res.status()} ${url}`);
  });
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  const result = { name, size, consoleErrors, pageErrors };

  await page.goto(`${base}/index.html#request`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  result.request = await assertRequestViz(page);
  result.request.overflow = await overflowReport(page);
  result.toggle = await assertToggle(page);
  await page.locator("#request .viz-pack").screenshot({ path: path.join(shotDir, `${name}_viz.png`) });
  await page.locator("#request").screenshot({ path: path.join(shotDir, `${name}_request.png`) });

  if (size.width >= 900) {
    const navKosis = await page.locator('a.nav-pill[href="kosis.html"], a[href="/kosis"]').count();
    const navGallery = await page.locator('a.nav-pill[href="gallery.html"]').count();
    const navRequest = await page.locator('a[href="#request"]').count();
    result.nav = { navKosis, navGallery, navRequest };
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
    const navKosis = await page.locator('#site-menu a[href="kosis.html"], #site-menu a[href="/kosis"]').count();
    const navGallery = await page.locator('#site-menu a.nav-pill[href="gallery.html"]').count();
    const navRequest = await page.locator('#site-menu a[href="#request"]').count();
    result.nav = { expanded, menuVisible, navKosis, navGallery, navRequest };
    await page.screenshot({ path: path.join(shotDir, `${name}_index_menu.png`), fullPage: false });
    if (expanded === "true" || menuVisible) {
      await toggle.click();
      await page.waitForTimeout(150);
    }
  }

  // Gallery regression
  await page.goto(`${base}/gallery.html`, { waitUntil: "networkidle" });
  await page.waitForTimeout(250);
  const galleryTitle = await page.locator("h1").innerText();
  const galleryKosis = await page.locator('a[href="kosis.html"], a[href="/kosis"]').count();
  result.gallery = {
    titleOk: galleryTitle.includes("조사 갤러리"),
    kosisLinks: galleryKosis,
    overflow: await overflowReport(page),
  };
  await page.screenshot({ path: path.join(shotDir, `${name}_gallery.png`), fullPage: false });

  // /kosis should 404 locally (file removed); production uses redirect.
  // Isolate this check so the intentional 404 does not pollute consoleErrors.
  const kosisPage = await browser.newPage({ viewport: size });
  const kosisResp = await kosisPage.goto(`${base}/kosis.html`, { waitUntil: "domcontentloaded" });
  result.kosisStatus = kosisResp ? kosisResp.status() : null;
  await kosisPage.close();

  return result;
}

function passFail(result) {
  const fails = [];
  const c = result.request.checks;
  for (const [k, v] of Object.entries(c)) if (!v) fails.push(`content:${k}`);
  if (result.request.cards !== 3) fails.push("viz-card-count");
  if (result.request.metricCards !== 2) fails.push("metric-card-count");
  if (result.request.toggles !== 3) fails.push("toggle-count");
  if (result.request.pressed < 6) fails.push("aria-pressed");
  if (result.request.controls < 6) fails.push("aria-controls");
  if (result.request.captions < 3) fails.push("table-captions");
  if (!result.request.yearsOk) fails.push("x-axis-years");
  if (!result.request.noNumericAxisOnly) fails.push("x-axis-numeric-only");
  if (!result.request.victimLabelsOk) fails.push("victim-labels");
  if (!result.request.trendSvgOk) fails.push("trend-svg-values");
  if (!result.request.trendTableOk) fails.push("trend-table-values");
  if (!result.request.linkOk) fails.push("src-links");
  if (result.request.entryLinks > 0) fails.push("kosis-entry-left");
  // Allow intentional horizontal scroll inside .table-wrap / .viz-svg-wrap; fail only if the document itself spills.
  if (result.request.overflow.docOverflow && result.request.overflow.docScrollWidth > result.request.overflow.viewport + 8) {
    fails.push("request-overflow");
  }
  if (result.nav.navKosis) fails.push("nav-kosis-present");
  if (!result.nav.navGallery) fails.push("nav-gallery-missing");
  if (!result.nav.navRequest) fails.push("nav-request");
  if (result.name.startsWith("m") && !result.nav.menuVisible) fails.push("mobile-menu");
  if (!result.gallery.titleOk) fails.push("gallery-title");
  if (result.gallery.kosisLinks > 0) fails.push("gallery-kosis-link");
  if (result.kosisStatus !== 404) fails.push(`kosis-status-${result.kosisStatus}`);
  if (result.toggle.afterTable.tablePressed !== "true") fails.push("toggle-table-pressed");
  if (result.toggle.afterTable.chartPressed !== "false") fails.push("toggle-chart-unpressed");
  if (!result.toggle.afterTable.tableVisible || result.toggle.afterTable.chartVisible) fails.push("toggle-table-visible");
  if (result.toggle.afterChart.chartPressed !== "true") fails.push("toggle-chart-restore");
  if (!result.toggle.afterChart.chartVisible || result.toggle.afterChart.tableVisible) fails.push("toggle-chart-visible");
  if (result.toggle.afterArrow.chartPressed !== "true") fails.push("toggle-arrow");
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

const outPath = path.join(__dirname, "request_viz_qa_report.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");
console.log(JSON.stringify({ pass: report.pass, fails: report.fails, outPath }, null, 2));
process.exit(report.pass ? 0 : 1);
