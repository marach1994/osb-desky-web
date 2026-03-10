// generate-brand-mdx.js
// Generates MDX files for all brand pages

const fs = require('fs');
const path = require('path');

// Run the brand slugs generator and parse output
const { execSync } = require('child_process');
const scriptOutput = execSync('node scripts/generate-brand-slugs.js', { encoding: 'utf8' });
const jsonStart = scriptOutput.indexOf('[');
const brands = JSON.parse(scriptOutput.substring(jsonStart));

const contentDir = path.join(__dirname, '..', 'content', 'barvy-a-laky');

// Categorize brands for more relevant content
const brandCategories = {
  // Major Czech/Slovak brands
  premium: ['Het', 'Primalex', 'Balakryl', 'Colorlak', 'Eternal', 'Remal', 'Jupol', 'Sokrates', 'Detecha', 'Chemolak', 'Slovlak', 'Barlet', 'Fronton'],
  // International premium
  international: ['Dulux', 'Tikkurila', 'Caparol', 'Sikkens', 'Sigma', 'Jub', 'Baumit', 'Mapei', 'Weber', 'Remmers', 'Osmo', 'Belinka', 'Sadolin', 'Xyladecor', 'Bondex'],
  // Retail/store brands
  retail: ['Hornbach', 'Obi', 'Uni Hobby', 'Stavebniny DEK', 'Swingcolor'],
  // Wood specialists
  wood: ['Lazurol', 'Luxol', 'Lignofix', 'Bochemit', 'Fortekryl', 'Bakrylex', 'Xyladecor', 'Bondex', 'Belinka', 'Osmo', 'Saicos', 'Rubio Monocoat', 'Woca', 'Bona', 'PNZ', 'Borma Wachs', 'Sadolin', 'Adler Česko', 'Owatrol', 'Leinos'],
  // Spray/auto
  spray: ['Dupli Color', 'Motip', 'Rust-Oleum', 'Montana Cans', 'Schuller Eh\u2019klar', 'Kwasny'],
};

function getBrandCategory(label) {
  for (const [cat, names] of Object.entries(brandCategories)) {
    if (names.some(n => label.includes(n) || n.includes(label))) return cat;
  }
  return 'general';
}

function generateContent(brand) {
  const { slug, label } = brand;
  const cat = getBrandCategory(label);

  let intro, sections, faq;

  // Customize intro based on category
  switch (cat) {
    case 'premium':
      intro = `<p>${label} patří mezi přední české výrobce barev a laků s dlouholetou tradicí na tuzemském trhu. Značka nabízí široký sortiment produktů pro interiéry i exteriéry, od základních malířských barev po specializované nátěrové systémy.</p>

<p>V tomto přehledu najdete informace o sortimentu ${label}, doporučené produkty pro různé aplikace a tipy, kde nakoupit za nejlepší cenu.</p>`;
      break;
    case 'international':
      intro = `<p>${label} je mezinárodně uznávaná značka barev a laků dostupná na českém trhu. Díky globálnímu výzkumu a vývoji nabízí inovativní produkty s vysokou kvalitou a spolehlivostí.</p>

<p>Přečtěte si, jaké produkty ${label} nabízí, pro koho jsou vhodné a kde je v Česku seženete.</p>`;
      break;
    case 'retail':
      intro = `<p>${label} nabízí sortiment barev a laků určený pro kutily i profesionály. Produkty jsou dostupné v kamenných prodejnách i online, často s výhodným poměrem cena/výkon.</p>

<p>Zjistěte, jaké barvy a laky ${label} nabízí a jak si vybrat ten správný produkt pro váš projekt.</p>`;
      break;
    case 'wood':
      intro = `<p>${label} se specializuje na nátěrové hmoty pro dřevo – lazury, oleje, laky a impregnace. Produkty jsou navrženy pro maximální ochranu a zvýraznění přirozené krásy dřeva v interiéru i exteriéru.</p>

<p>Podívejte se na přehled produktů ${label}, jejich vlastnosti a doporučené aplikace.</p>`;
      break;
    case 'spray':
      intro = `<p>${label} je známá svými sprejovými barvami a speciálními nátěrovými hmotami. Produkty jsou oblíbené pro rychlou a snadnou aplikaci na nejrůznější materiály.</p>

<p>Zjistěte, jaké produkty ${label} nabízí a jak je správně použít pro nejlepší výsledek.</p>`;
      break;
    default:
      intro = `<p>${label} nabízí sortiment barev, laků a nátěrových hmot pro různé typy povrchů a aplikací. Značka je dostupná na českém trhu prostřednictvím specializovaných prodejen a e-shopů.</p>

<p>V tomto článku najdete přehled produktů ${label}, jejich vlastnosti a doporučení pro výběr správného nátěru.</p>`;
  }

  // Product sections vary by category
  if (cat === 'wood') {
    sections = `## Sortiment ${label}

<h3>Lazury a Oleje</h3>

<p>Stěžejní produkty značky ${label} zahrnují lazury a oleje na dřevo pro interiér i exteriér. Lazury chrání dřevo před UV zářením a vlhkostí, zatímco oleje pronikají do struktury a vyživují dřevo zevnitř.</p>

<h3>Laky na Dřevo</h3>

<p>Laky ${label} vytvářejí odolný ochranný film na povrchu dřeva. Dostupné v matném, polomatném i lesklém provedení. Vhodné pro podlahy, nábytek i dřevěné obklady.</p>

<h3>Impregnace</h3>

<p>Preventivní ochrana dřeva proti plísním, houbám a hmyzu. Impregnační přípravky ${label} prodlužují životnost dřevěných konstrukcí.</p>

## Kde Použít Produkty ${label}

<ul>
<li><strong>Dřevěné podlahy:</strong> Oleje a laky pro vysokou odolnost proti oděru</li>
<li><strong>Venkovní dřevo:</strong> Lazury s UV filtrem pro ploty, pergoly, fasády</li>
<li><strong>Nábytek:</strong> Jemné oleje a vosky pro příjemný hmat a vzhled</li>
<li><strong>Zahradní stavby:</strong> Impregnace a lazury pro dlouhodobou ochranu</li>
<li><strong>Okna a dveře:</strong> Silnovrstvé lazury pro maximální odolnost</li>
</ul>`;
  } else if (cat === 'spray') {
    sections = `## Sortiment ${label}

<h3>Univerzální Spreje</h3>

<p>Spreje ${label} pro široké spektrum materiálů – kov, dřevo, plast, sklo. Rychlé schnutí a rovnoměrné krytí bez stop po štětci.</p>

<h3>Speciální Spreje</h3>

<p>Teplotně odolné spreje, spreje na efekty (chrom, kladívkový, křídový), základní nátěry ve spreji a laky.</p>

## Kde Použít Produkty ${label}

<ul>
<li><strong>Renovace nábytku:</strong> Rychlé a rovnoměrné přestříkání</li>
<li><strong>Drobné opravy:</strong> Lokální dotykové korekce na kovu, dřevě</li>
<li><strong>Dekorativní projekty:</strong> DIY a kreativní tvorba</li>
<li><strong>Automobilové opravy:</strong> Laky a základy na karoserie</li>
</ul>`;
  } else {
    sections = `## Sortiment ${label}

<h3>Interiérové Barvy</h3>

<p>Malířské barvy ${label} pro stěny a stropy. Dostupné v různých třídách odolnosti – od ekonomických variant po prémiové omyvatelné barvy s vysokou krycí schopností.</p>

<h3>Fasádní Barvy</h3>

<p>Exteriérové barvy ${label} pro fasády domů. Odolné proti povětrnosti, UV záření a znečištění. Akrylátové, silikonové nebo silikátové složení podle typu podkladu.</p>

<h3>Barvy na Dřevo a Kov</h3>

<p>Specializované nátěry ${label} pro dřevěné a kovové povrchy. Lazury, laky, antikorozní barvy a univerzální nátěry pro interiér i exteriér.</p>

## Kde Použít Produkty ${label}

<ul>
<li><strong>Malování interiérů:</strong> Stěny, stropy, chodby, koupelny</li>
<li><strong>Fasády:</strong> Nátěry rodinných domů a bytových objektů</li>
<li><strong>Dřevěné povrchy:</strong> Nábytek, podlahy, obklady, okna</li>
<li><strong>Kovové konstrukce:</strong> Zábradlí, ploty, brány, radiátory</li>
</ul>`;
  }

  // Standard sections for all brands
  const commonSections = `

## Kde Koupit ${label}

<p>Produkty ${label} jsou dostupné v těchto typech prodejen:</p>

<ul>
<li><strong>Hobby markety:</strong> Hornbach, OBI, Bauhaus, Baumax</li>
<li><strong>Stavebniny:</strong> DEK, PRO-DOMA, lokální stavebniny</li>
<li><strong>Specializované prodejny:</strong> Prodejny barev a laků</li>
<li><strong>E-shopy:</strong> Online obchody se stavebninami a barvami</li>
</ul>

<p>Pro nejlepší cenu doporučujeme porovnat nabídky více prodejců. Při nákupu většího množství se vyplatí poptávat množstevní slevy.</p>

## Tipy Pro Výběr Produktů ${label}

<ul>
<li>Vždy si přečtěte technický list produktu – najdete v něm přesné informace o použití, ředění a schnutí</li>
<li>Pro dosažení nejlepšího výsledku dodržujte doporučený postup přípravy podkladu</li>
<li>U barev na stěny si vždy kupte vzorek a vyzkoušejte odstín přímo na místě</li>
<li>Kontrolujte datum spotřeby – staré barvy mohou mít horší krycí schopnost</li>
</ul>

## Často Kladené Otázky

<h3>Jsou barvy ${label} kvalitní?</h3>

<p>${label} nabízí produkty v různých cenových kategoriích. Pro nejlepší výsledek volte produkty z vyšších řad, které mají lepší krycí schopnost, odolnost a výdatnost. Vždy dodržujte pokyny výrobce pro přípravu podkladu a aplikaci.</p>

<h3>Kde najdu vzorník barev ${label}?</h3>

<p>Vzorníky jsou k dispozici v prodejnách, které značku ${label} nabízí. Mnoho odstínů si můžete prohlédnout i na webových stránkách výrobce. Pro přesné posouzení odstínu ale doporučujeme fyzický vzorek.</p>

<h3>Mohu kombinovat produkty ${label} s jinými značkami?</h3>

<p>Obecně je lepší držet se jednoho nátěrového systému od jednoho výrobce. Základní nátěr a finální barva od stejné značky jsou navzájem kompatibilní a zajistí nejlepší výsledek. Při kombinování různých značek hrozí problémy s přilnavostí.</p>`;

  return `---
title: "Barvy ${label} – Sortiment, Recenze a Kde Koupit"
description: "Barvy ${label} – přehled sortimentu, hodnocení produktů a kde koupit za nejlepší cenu. Interiérové, fasádní barvy a specializované nátěry."
category: barvy-a-laky
subcategory: podle-znacek
keywords:
  - barvy ${label.toLowerCase()}
  - ${label.toLowerCase()} barvy
  - ${label.toLowerCase()} sortiment
  - ${label.toLowerCase()} cena
publishedAt: "2025-02-06"
---

# Barvy ${label} – Přehled Sortimentu a Hodnocení

${intro}

${sections}
${commonSections}

---
`;
}

// Generate all brand MDX files
let created = 0;
let skipped = 0;

for (const brand of brands) {
  const filePath = path.join(contentDir, `${brand.slug}.mdx`);

  // Skip if file already exists
  if (fs.existsSync(filePath)) {
    skipped++;
    continue;
  }

  const content = generateContent(brand);
  fs.writeFileSync(filePath, content, 'utf8');
  created++;
}

console.log(`Created: ${created} brand MDX files`);
console.log(`Skipped: ${skipped} (already exist)`);
console.log(`Total brands: ${brands.length}`);
