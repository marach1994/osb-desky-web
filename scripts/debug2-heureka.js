// Testuje getPageData logiku na barvy-laky-na-drevo.heureka.cz
const puppeteer = require('puppeteer');

async function main() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36');

  const url = 'https://barvy-laky-na-drevo.heureka.cz/';
  console.log('Navigating to:', url);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  console.log('After goto, URL:', page.url());

  // Consent check
  const hasConsent = await page.evaluate(function() {
    var btns = Array.from(document.querySelectorAll('button, a'));
    var b = btns.find(function(b) {
      var t = (b.textContent || '').toLowerCase();
      return t.includes('souhlasim') || t.includes('prijmout') || b.id === 'didomi-notice-agree-button';
    });
    return b ? b.id + ' / ' + b.textContent.trim().substring(0,30) : 'ZADNY CONSENT';
  });
  console.log('Consent button:', hasConsent);

  // WaitForSelector
  try {
    await page.waitForSelector('.c-categories-list__link', { timeout: 6000 });
    console.log('waitForSelector: OK');
  } catch(e) {
    console.log('waitForSelector: TIMEOUT');
  }
  console.log('URL after wait:', page.url());

  // Evaluate
  const result = await page.evaluate(function() {
    var cats = Array.from(document.querySelectorAll('.c-categories-list__link')).map(function(a) {
      return a.textContent.trim() + ' | ' + a.href;
    });
    var html = document.documentElement.innerHTML;
    var idMatch = html.match(/categoryId["\\s]*:["\\s]*["']?(\d+)["']?/);
    return {
      cats: cats,
      categoryId: idMatch ? idMatch[1] : null,
      bodyLen: document.body.innerHTML.length,
      url: window.location.href
    };
  });

  console.log('Result:', JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch(console.error);
