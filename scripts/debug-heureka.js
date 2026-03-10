const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36');
  await page.goto('https://barvy-laky-na-drevo.heureka.cz/', { waitUntil: 'networkidle2', timeout: 30000 });

  const info = await page.evaluate(() => {
    const cats = Array.from(document.querySelectorAll('.c-categories-list__link')).map(function(a) {
      return a.textContent.trim() + ' | ' + a.href;
    });
    const html = document.documentElement.innerHTML;
    const idMatch = html.match(/categoryId["\\s]*:["\\s]*["']?(\d+)["']?/);
    const bodyLen = document.body.innerHTML.length;
    // Najdi vsechny elementy s "categories" v class
    const catClasses = Array.from(document.querySelectorAll('[class*="categor"]')).slice(0, 10).map(function(el) {
      return el.tagName + '.' + el.className.substring(0, 60);
    });
    return { cats: cats, categoryId: idMatch ? idMatch[1] : null, bodyLen: bodyLen, catClasses: catClasses };
  });

  console.log('Cats:', info.cats);
  console.log('categoryId:', info.categoryId);
  console.log('bodyLen:', info.bodyLen);
  console.log('catClasses:', info.catClasses);
  await browser.close();
})().catch(console.error);
