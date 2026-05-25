import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const QALBU_MODULES = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../qalbu-app/node_modules');
const require = createRequire(QALBU_MODULES + '/placeholder.js');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

  // Intercept all requests
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (req.method() === 'POST') {
      console.log('POST', req.url());
      console.log('POST body:', req.postData());
    }
    req.continue();
  });

  page.on('response', async resp => {
    if (resp.url().includes('/login') && resp.request().method() === 'POST') {
      console.log('Response status:', resp.status());
      console.log('Response headers:', JSON.stringify(resp.headers()));
    }
  });

  await page.goto('http://127.0.0.1:8000/login', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  await page.click('#email', { clickCount: 3 });
  await page.type('#email', 'admin@lorrytech.my', { delay: 50 });
  await page.click('#password', { clickCount: 3 });
  await page.type('#password', 'password', { delay: 50 });
  await new Promise(r => setTimeout(r, 400));

  console.log('\nClicking submit...');
  await page.click('form button');
  await new Promise(r => setTimeout(r, 4000));
  console.log('Final URL:', page.url());

  // Take screenshot
  await page.screenshot({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), 'output', 'debug-login.png') });
  await browser.close();
})();
