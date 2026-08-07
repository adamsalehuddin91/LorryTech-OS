/**
 * SwiftFleet — Screenshot Generator
 * Usage: node generate-screenshots.js
 * Env overrides: LORRY_URL, LORRY_EMAIL, LORRY_PASS, DRIVER_EMAIL, DRIVER_PASS
 *
 * Run from project root:
 *   NODE_PATH="../../qalbu-app/node_modules" node screenshot/generate-screenshots.js
 */
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load puppeteer + sharp from qalbu-app node_modules (avoids re-downloading Chrome)
const QALBU_MODULES = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../qalbu-app/node_modules'
);
const require = createRequire(QALBU_MODULES + '/placeholder.js');
const puppeteer = require('puppeteer');
const sharp = require('sharp');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'output');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const BASE_URL    = process.env.LORRY_URL    || 'http://127.0.0.1:8000';
const OWNER_EMAIL = process.env.LORRY_EMAIL  || 'admin@lorrytech.my';
const OWNER_PASS  = process.env.LORRY_PASS   || 'password';
const DRIVER_EMAIL= process.env.DRIVER_EMAIL || 'ali@lorrytech.my';
const DRIVER_PASS = process.env.DRIVER_PASS  || 'password';

// iPhone 14 Pro (shots.so standard) — driver portal
const PHONE_W = 390;
const PHONE_H = 844;

// Desktop — owner/kerani web view
const DESKTOP_W = 1280;
const DESKTOP_H = 800;

const FORMATS = {
  square:   { w: 1080, h: 1080 },   // Facebook feed
  portrait: { w: 1080, h: 1350 },   // Threads portrait
  story:    { w: 1080, h: 1920 },   // Stories
};

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Login helper ──────────────────────────────────────────────────────────────
async function login(page, email, password) {
  // Use dev autologin route (bypasses form login issues in headless mode)
  const role = email.includes('ali@') || email.includes('abu@') ? 'driver' : 'owner';
  await page.goto(`${BASE_URL}/dev-autologin/${role}`, { waitUntil: 'networkidle2' });
  await wait(800);
  const url = page.url();
  if (url.includes('/login')) throw new Error(`Dev autologin failed → ${url}`);
  console.log(`  Logged in as ${email} → ${url}`);
}

// ── Screenshot a page ─────────────────────────────────────────────────────────
async function snap(page, url, filename, opts = {}) {
  const { scrollY = 0, waitMs = 1500, waitForSelector = null } = opts;
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
  if (waitForSelector) await page.waitForSelector(waitForSelector, { timeout: 8000 }).catch(() => {});
  await wait(waitMs);
  if (scrollY) await page.evaluate((y) => window.scrollBy(0, y), scrollY);
  await wait(400);
  const outPath = path.join(OUT, `${filename}.png`);
  await page.screenshot({ path: outPath });
  console.log(`  Captured: ${filename}.png`);
  return outPath;
}

// ── Phone mockup (shots.so style) ────────────────────────────────────────────
async function makePhoneMockup(screenshotPath, label) {
  const SCALE = 2.5;
  const W = Math.round(PHONE_W * SCALE);
  const H = Math.round(PHONE_H * SCALE);
  const R = 80; // corner radius

  // Resize screenshot to phone resolution
  const resized = await sharp(screenshotPath)
    .resize(W, H, { fit: 'cover', position: 'top' })
    .toBuffer();

  // Rounded-corner mask
  const mask = Buffer.from(`
    <svg width="${W}" height="${H}">
      <rect x="0" y="0" width="${W}" height="${H}" rx="${R}" ry="${R}" fill="white"/>
    </svg>`);

  const rounded = await sharp(resized)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Phone border (subtle dark frame)
  const border = Buffer.from(`
    <svg width="${W + 8}" height="${H + 8}">
      <rect x="0" y="0" width="${W + 8}" height="${H + 8}" rx="${R + 4}" ry="${R + 4}" fill="#1f2937"/>
    </svg>`);

  const withBorder = await sharp(border)
    .composite([{ input: rounded, left: 4, top: 4 }])
    .png()
    .toBuffer();

  const mockupPath = path.join(OUT, `mockup-${label}.png`);
  await sharp(withBorder).toFile(mockupPath);
  console.log(`  Mockup: mockup-${label}.png`);
  return mockupPath;
}

// ── Social composite ─────────────────────────────────────────────────────────
function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function compositeCard(mockupPath, formatKey, label, tagline) {
  tagline = escapeXml(tagline);
  const fmt = FORMATS[formatKey];
  const mockupMeta = await sharp(mockupPath).metadata();
  const mW = mockupMeta.width;
  const mH = mockupMeta.height;

  // Scale mockup to fit nicely in canvas
  const maxH = Math.round(fmt.h * 0.78);
  const scale = Math.min(maxH / mH, (fmt.w * 0.85) / mW);
  const finalW = Math.round(mW * scale);
  const finalH = Math.round(mH * scale);
  const left   = Math.round((fmt.w - finalW) / 2);
  const top    = Math.round((fmt.h - finalH) / 2) - Math.round(fmt.h * 0.04);

  const resizedMockup = await sharp(mockupPath)
    .resize(finalW, finalH)
    .toBuffer();

  // Background + glow SVG
  const bgSvg = Buffer.from(`
    <svg width="${fmt.w}" height="${fmt.h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#1e3a5f"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="48%" r="45%">
          <stop offset="0%" stop-color="#2563eb" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#0f172a" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${fmt.w}" height="${fmt.h}" fill="url(#bg)"/>
      <ellipse cx="${fmt.w / 2}" cy="${fmt.h * 0.48}" rx="${fmt.w * 0.55}" ry="${fmt.h * 0.4}" fill="url(#glow)"/>
    </svg>`);

  // Branding SVG (bottom text)
  const brandY = top + finalH + Math.round(fmt.h * 0.04);
  const brandSvg = Buffer.from(`
    <svg width="${fmt.w}" height="${fmt.h}" xmlns="http://www.w3.org/2000/svg">
      <text x="${fmt.w / 2}" y="${brandY}" font-family="Arial, sans-serif" font-size="${Math.round(fmt.w * 0.042)}"
        font-weight="bold" fill="#60a5fa" text-anchor="middle">SwiftFleet</text>
      <text x="${fmt.w / 2}" y="${brandY + Math.round(fmt.w * 0.052)}" font-family="Arial, sans-serif"
        font-size="${Math.round(fmt.w * 0.028)}" fill="#94a3b8" text-anchor="middle">${tagline}</text>
      <text x="${fmt.w / 2}" y="${fmt.h - Math.round(fmt.h * 0.022)}" font-family="Arial, sans-serif"
        font-size="${Math.round(fmt.w * 0.022)}" fill="#475569" text-anchor="middle">lorrytech.swiftapps.my</text>
    </svg>`);

  const outPath = path.join(OUT, `${formatKey}-${label}.png`);
  await sharp({ create: { width: fmt.w, height: fmt.h, channels: 4, background: '#0f172a' } })
    .composite([
      { input: bgSvg },
      { input: resizedMockup, left, top },
      { input: brandSvg },
    ])
    .png()
    .toFile(outPath);
  console.log(`  Social: ${formatKey}-${label}.png`);
  return outPath;
}

// ── Main ──────────────────────────────────────────────────────────────────────
// Driver portal — mobile (390x844)
const MOBILE_SCREENS = [
  {
    label: 'mobile-01-driver-dashboard',
    role: 'driver',
    url: `${BASE_URL}/driver/dashboard`,
    opts: { waitMs: 1800 },
    viewport: { width: PHONE_W, height: PHONE_H },
  },
  {
    label: 'mobile-02-driver-upload',
    role: 'driver',
    url: `${BASE_URL}/driver/upload-receipt`,
    opts: { waitMs: 1500 },
    viewport: { width: PHONE_W, height: PHONE_H },
  },
  {
    label: 'mobile-03-driver-trips',
    role: 'driver',
    url: `${BASE_URL}/driver/trips`,
    opts: { waitMs: 1500 },
    viewport: { width: PHONE_W, height: PHONE_H },
  },
];

// Owner/Kerani — desktop web (1280x800)
const WEB_SCREENS = [
  {
    label: 'web-01-dashboard',
    role: 'owner',
    url: `${BASE_URL}/dashboard`,
    opts: { waitMs: 2500 },
    viewport: { width: DESKTOP_W, height: DESKTOP_H },
  },
  {
    label: 'web-02-trips',
    role: 'owner',
    url: `${BASE_URL}/trips`,
    opts: { waitMs: 1800 },
    viewport: { width: DESKTOP_W, height: DESKTOP_H },
  },
  {
    label: 'web-03-invoices',
    role: 'owner',
    url: `${BASE_URL}/invoices`,
    opts: { waitMs: 1800 },
    viewport: { width: DESKTOP_W, height: DESKTOP_H },
  },
  {
    label: 'web-04-expenses',
    role: 'owner',
    url: `${BASE_URL}/expenses`,
    opts: { waitMs: 1800 },
    viewport: { width: DESKTOP_W, height: DESKTOP_H },
  },
  {
    label: 'web-05-vehicles',
    role: 'owner',
    url: `${BASE_URL}/vehicles`,
    opts: { waitMs: 1500 },
    viewport: { width: DESKTOP_W, height: DESKTOP_H },
  },
  {
    label: 'web-06-drivers',
    role: 'owner',
    url: `${BASE_URL}/drivers`,
    opts: { waitMs: 1500 },
    viewport: { width: DESKTOP_W, height: DESKTOP_H },
  },
];

const SCREENS = [...WEB_SCREENS, ...MOBILE_SCREENS];

(async () => {
  console.log('SwiftFleet — Screenshot Generator');
  console.log('=====================================');
  console.log(`Target: ${BASE_URL}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // Separate browser contexts so owner + driver cookies don't overlap
  const ownerCtx  = await browser.createBrowserContext();
  const driverCtx = await browser.createBrowserContext();

  let ownerPage = null;
  let driverPage = null;

  for (const screen of SCREENS) {
    console.log(`\n[${screen.label}]`);

    let page;
    if (screen.role === 'owner') {
      if (!ownerPage) {
        ownerPage = await ownerCtx.newPage();
        await ownerPage.setCacheEnabled(false);
        console.log(`  Logging in as owner...`);
        await login(ownerPage, OWNER_EMAIL, OWNER_PASS);
      }
      page = ownerPage;
    } else {
      if (!driverPage) {
        driverPage = await driverCtx.newPage();
        await driverPage.setCacheEnabled(false);
        console.log(`  Logging in as driver...`);
        await login(driverPage, DRIVER_EMAIL, DRIVER_PASS);
      }
      page = driverPage;
    }

    // Set viewport per screen (desktop vs mobile)
    const vp = screen.viewport || { width: PHONE_W, height: PHONE_H };
    await page.setViewport({ ...vp, deviceScaleFactor: 2 });

    await snap(page, screen.url, screen.label, screen.opts);
  }

  await browser.close();

  console.log('\n=====================================');
  console.log('Done! Raw screenshots for shots.so (390x844):');
  fs.readdirSync(OUT)
    .sort()
    .forEach(f => console.log(`  screenshot/output/${f}`));
})();
