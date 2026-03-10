// Simuluje presne co dela scraper - root -> L1
const puppeteer = require('puppeteer');
const fs = require('fs');

async function main() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

  // Krok 1: Root stranka (jako scraper)
  console.log('=== KROK 1: Root page ===');
  const page1 = await browser.newPage();
  await page1.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36');
  await page1.goto('https://barvy-laky.heureka.cz/', { waitUntil: 'networkidle2', timeout: 30000 });
  const rootLinks = await page1.evaluate(function() {
    return Array.from(document.querySelectorAll('.c-categories-list__link')).map(function(a) {
      return { name: a.textContent.trim(), url: a.href };
    });
  });
  console.log('Root links:', rootLinks.length);
  await page1.close();

  // Krok 2: Prvni L1 stranka (nova stranka, jako fetchUrl)
  console.log('\n=== KROK 2: L1 page (barvy-laky-na-drevo) ===');
  const page2 = await browser.newPage();
  await page2.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36');

  await new Promise(function(r) { setTimeout(r, 800); }); // DELAY_MS

  await page2.goto('https://barvy-laky-na-drevo.heureka.cz/', { waitUntil: 'networkidle2', timeout: 30000 });
  console.log('URL po goto:', page2.url());

  // Screenshot
  await page2.screenshot({ path: 'scripts/debug-screenshot.png', fullPage: false });
  console.log('Screenshot ulozeny do scripts/debug-screenshot.png');

  // WaitForSelector
  let selectorFound = false;
  try {
    await page2.waitForSelector('.c-categories-list__link', { timeout: 8000 });
    selectorFound = true;
    console.log('waitForSelector: OK');
  } catch(e) {
    console.log('waitForSelector: TIMEOUT');
  }

  const result = await page2.evaluate(function() {
    var cats = Array.from(document.querySelectorAll('.c-categories-list__link')).map(function(a) {
      return a.textContent.trim() + ' | ' + a.href;
    });
    var html = document.documentElement.innerHTML;
    var idMatch = html.match(/categoryId["\\s]*:["\\s]*["']?(\d+)["']?/);
    return {
      cats: cats,
      categoryId: idMatch ? idMatch[1] : null,
      bodyLen: document.body.innerHTML.length,
      title: document.title
    };
  });

  console.log('title:', result.title);
  console.log('bodyLen:', result.bodyLen);
  console.log('categoryId:', result.categoryId);
  console.log('cats:', result.cats);

  await page2.close();
  await browser.close();
}

main().catch(console.error);
