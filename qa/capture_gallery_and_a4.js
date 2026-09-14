const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const OUT1 = "C:\\project\\redgreen-video\\20_project\\web_shots\\gallery_cards_now.png";
const OUT2 =
  "G:\\내 드라이브\\!!!!!2026 올바른 국어사용 공모전 라이트버전\\_workspace\\영상제작\\stills\\gallery_cards_1280.png";
const A4HTML = path.join(__dirname, "한눈에_A4.html");
const A4PDF =
  "G:\\내 드라이브\\!!!!!2026 올바른 국어사용 공모전 라이트버전\\_workspace\\팀설계\\한눈에_A4.pdf";
const A4PNG =
  "G:\\내 드라이브\\!!!!!2026 올바른 국어사용 공모전 라이트버전\\_workspace\\팀설계\\한눈에_A4.png";

(async () => {
  fs.mkdirSync(path.dirname(OUT1), { recursive: true });
  fs.mkdirSync(path.dirname(OUT2), { recursive: true });
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
  });
  await p.goto("https://redgreen-web.vercel.app/gallery.html", {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await p.waitForTimeout(900);
  const grid = p.locator(".gal-grid");
  if ((await grid.count()) > 0) {
    await grid.first().scrollIntoViewIfNeeded();
    await p.waitForTimeout(400);
  }
  await p.screenshot({ path: OUT1, type: "png" });
  fs.copyFileSync(OUT1, OUT2);

  const a4 = await b.newPage({
    viewport: { width: 794, height: 1123 },
    deviceScaleFactor: 2,
  });
  const a4url = "file:///" + A4HTML.replace(/\\/g, "/");
  await a4.goto(a4url, { waitUntil: "load" });
  await a4.pdf({
    path: A4PDF,
    format: "A4",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
  await a4.screenshot({ path: A4PNG, type: "png", fullPage: true });
  await b.close();
  console.log("ok", OUT2, A4PDF);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
