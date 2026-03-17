# SEO Checklist – osb-desky.cz

Tento dokument shrnuje všechna SEO doporučení vytvořená po analýze projektu v březnu 2026.
Sekce **Hotovo** popisuje co bylo aplikováno na vyladěné brand stránky.
Sekce **TODO** popisuje co aplikovat na zbytek webu.

---

## ✅ Hotovo (aplikováno na 9 brand stránek, 12. 3. 2026)

Vyladěné stránky: `remmers`, `adler-cesko`, `dufa`, `kittfort`, `sokrates`, `balakryl`, `het`, `tikkurila`, `colorlak`

### 1. Specifický obsah místo šablony
- Každá stránka popisuje konkrétní produktové řady (Pullex, Legno, HK-Lasur, Aquafin Plus…)
- Historie značky a rok vzniku
- Cílová skupina (pro koho je značka vhodná)
- Sekce Recenze s konkrétními poznatky ze Heureka.cz

### 2. Obsah článku (TOC)
- Navigační box s kotevními odkazy na sekce
- Usnadňuje orientaci i Google crawlování

### 3. Heureka bannery za každým H3
- Každá produktová sekce (H3) má za sebou `<HeurekaProductGrid>` s odpovídajícím `positionId`
- Vzor: úvod → `<HeurekaProductGrid />` → TOC → H2 → H3 → odstavec → banner → H3 → odstavec → banner…

### 4. Sekce "Podobné značky" s interními odkazy
- Každá stránka odkazuje na 4–6 příbuzných značek

### 5. FAQ sekce
- Konkrétní otázky a odpovědi vztahující se k dané značce (ne generické)

---

## 🔧 Dočerstva aplikováno (17. 3. 2026)

Na výše uvedených 9 stránkách bylo navíc provedeno:

### `updatedAt` v frontmatter
```yaml
updatedAt: "2026-03-17"
```
- Signalizuje Googlu, že obsah je aktuální
- `lib/seo.ts` ho automaticky převádí na `dateModified` v JSON-LD schématu

### Vylepšené `title` tagy
Změna z generického "Sortiment, Recenze a Kde Koupit" na specifický:
| Soubor | Nový title |
|--------|-----------|
| remmers | Remmers – Německé Nátěry na Dřevo, Fasády a Podlahy *(již byl ok)* |
| adler-cesko | Adler Česko – Lazury Pullex, Oleje Legno a Impregnace Lignovit na Dřevo |
| dufa | Düfa – Německé Barvy Harmonieweiss, Fasádní a Interiérové Nátěry |
| kittfort | Kittfort – Unikolky, Colorline a Barvožrout \| Česká Barva pro Kutily |
| sokrates | Sokrates – Aquafin Plus s Polyuretanem, Colour a Email Professional |
| balakryl | Balakryl – Legendární Česká Barva V 2045 na Dřevo, Kov a Fasády |
| het | Het Klasik, Profit a Premium – Nejprodávanější Česká Interiérová Barva |
| tikkurila | Tikkurila – Finské Barvy Optiva, Harmony, Valtti a Facade pro Česko |
| colorlak | Colorlak – Největší Český Výrobce, Barvy s Pávem od roku 1929 |

**Pravidla pro title:**
- Konkrétní názvy produktových řad v titulu
- Max. ~60 znaků (jinak Google ořízne)
- Žádné generické fráze ("Sortiment, Recenze a Kde Koupit")

### Rozšířené `keywords` v frontmatter
- Přidány názvy produktových řad (Optiva, Harmony, HK-Lasur…)
- Přidány long-tail varianty ("[značka] cena", "[značka] [produkt]")
- Cíl: 7–10 keywords místo původních 4 generických

### FAQ Schema (lib/seo.ts)
- Přidána funkce `generateFaqJsonLd()` do `lib/seo.ts`
- Umožňuje zobrazení FAQ přímo ve výsledcích Googlu (rich snippet)

---

## 📋 TODO – Co aplikovat na zbytek webu

### Priority 1 – Snadné, velký dopad

#### A) `updatedAt` na všechny ostatní brand stránky (~360 souborů)
Jednoduché přidání do frontmatter každého MDX souboru:
```yaml
updatedAt: "2026-03-17"
```
Doporučení: script přes `scripts/` který to přidá do všech souborů kde chybí.

#### B) Generické title tagy – opravit hromadně
Většina zbývajících ~360 brand stránek má title:
`"Barvy [ZNAČKA] – Sortiment, Recenze a Kde Koupit"`

Vzor pro opravu:
- Pokud má značka charakteristické produkty → zmínit je v titulu
- Pokud je to menší/neznámá značka → aspoň specifikovat kategorii: "Interiérové barvy [ZNAČKA] – přehled a kde koupit"

#### C) Generické `description` – opravit
Většina souborů má:
`"[Značka] – přehled sortimentu, hodnocení produktů a kde koupit za nejlepší cenu."`

Každý popis musí být unikátní a obsahovat:
- Klíčovou specializaci značky
- Alespoň jeden konkrétní název produktu/řady
- Call-to-action nebo benefit

#### D) Specifický obsah místo šablony – zbývající brand stránky (~360 souborů)
Většina brand stránek má pouze šablonový obsah (5–6 KB). Vzor z vyladěných stránek:

**Co přidat do každé brand stránky:**
- Odstavec 1: původ firmy, rok vzniku, kde sídlí, klíčová specialita
- Odstavec 2: co značka nabízí a pro koho
- V každé H3 produktové sekci: **konkrétní názvy produktových řad tučně**, vlastnosti, pro co se hodí
- Sekce "Pro koho jsou produkty" – segmentace zákazníků (profesionálové / kutilové / …)
- Sekce "Recenze a zkušenosti" – co zákazníci chválí + co kritizují (důvěryhodnost)
- Sekce "Kde koupit" – konkrétní řetězce (Hornbach, DEK, e-shopy…)

**Postup pro prioritní značky** (Dulux, Caparol, Sikkens, Osmo, JUB, Primalex a další velké):
1. Prostudovat reálné produkty značky
2. Aplikovat vzorovou strukturu (viz konec tohoto dokumentu)
3. Cíl: 15–20 KB obsahu místo 5–6 KB

#### E) TOC (obsah článku) – přidat na stránky kde chybí
Na vyladěných stránkách je navigační box hned po úvodním banneru:
```jsx
<nav aria-label="Obsah článku" style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'1rem 1.25rem',marginBottom:'1.5rem'}}>
  <p style={{fontWeight:700,marginBottom:'0.5rem',fontSize:'0.95rem'}}>Obsah článku</p>
  <ol style={{margin:0,paddingLeft:'1.25rem',fontSize:'0.9rem',lineHeight:'2'}}>
    <li><a href="#sortiment-znacka">Sortiment Značka</a></li>
    ...
  </ol>
</nav>
```
Pomáhá Googlu pochopit strukturu stránky a zvyšuje dwell time.

#### F) Heureka bannery za každým H3 – zbývající brand stránky
Na vyladěných stránkách má každá H3 sekce za sebou `<HeurekaProductGrid>`.
Na šablonových stránkách bannery chybí nebo jsou jen u první H3.

**Pravidlo:** Každý H3 nadpis v sekci "Sortiment" musí mít za sebou banner s odpovídajícím `positionId`.
Zjistit `positionId` pro každou kategorii dané značky v Heureka affiliate panelu.

#### G) Sekce "Podobné značky" – zkontrolovat a rozšířit
Šablonové stránky mají jen 4 generické odkazy (Abamal, Adler, Akzo, Amarit).
Vyladěné stránky mají 4–6 tematicky příbuzných odkazů s popisem (proč je značka podobná).

**Opravit:** Nahradit generické abecední odkazy za skutečně příbuzné značky.

#### H) FAQ sekce – přidat na stránky kde chybí nebo je generická
Šablonové stránky mají 3 generické FAQ otázky ("Jsou barvy X kvalitní?", "Kde najdu vzorník?", "Mohu kombinovat s jinými značkami?").
Vyladěné stránky mají 4–6 konkrétních otázek vztahujících se ke specifické značce.

**Pravidla pro FAQ:**
- Otázky musí být konkrétní pro danou značku (ne copy-paste ze šablony)
- Každá otázka = příležitost pro keyword (název produktu v otázce)
- Odpovědi min. 2–3 věty s konkrétními informacemi

---

### Priority 2 – Středně náročné

#### I) FAQ Schema aktivovat na stránkách
Funkce `generateFaqJsonLd()` je připravena v `lib/seo.ts`.

Postup implementace:
1. Do `types/index.ts` přidat do `Article`:
```typescript
faq?: { question: string; answer: string }[]
```
2. Do frontmatter přidat FAQ sekci:
```yaml
faq:
  - question: "Jaký je rozdíl mezi HK-Lasur a Aqua HSL-45?"
    answer: "HK-Lasur je na bázi rozpouštědel..."
```
3. V `app/barvy-a-laky/[slug]/page.tsx` přidat do JSON-LD:
```typescript
if (article.faq) {
  const faqSchema = generateFaqJsonLd(article.faq)
  // přidat do <script type="application/ld+json">
}
```

**Začít s:** 9 vyladěnými stránkami – přidat FAQ do frontmatter (jsou tam nejkvalitnější otázky).

#### J) Chybějící Heureka bannery na vyladěných stránkách
Několik H3 sekcí na vyladěných stránkách nemá banner:
- `het.mdx`: chybí banner po H3 "Interiérové Barvy" a "Fasádní Barvy"
- `tikkurila.mdx`: chybí banner po H3 "Interiérové Barvy"
- `colorlak.mdx`: chybí banner po H3 "Interiérové Barvy"
- `balakryl.mdx`: chybí banner po H3 "Fasádní Barvy" a "Barvy na Dřevo a Kov"

→ Zjistit správná `positionId` v Heureka affiliate panelu a doplnit.

#### K) Interní prolinkování – zpětné odkazy
Stránky "Podobné značky" odkazují na konkurenty, ale není reciprocita.
Například: Tikkurila odkazuje na Het, ale Het neodkazuje zpět na Tikkurilu.

Postup: U každé značky zkontrolovat, zda ji zmiňují jejich "podobné značky" a přidat chybějící zpětné odkazy.

### Priority 3 – Větší projekt

#### G) Obsah generických brand stránek (~360 souborů)
Většina zbývajících brand stránek má pouze šablonový obsah (5–6 KB).
Obsah podobný Remmers/Tikkurila (17–22 KB) by výrazně zlepšil ranking.

Doporučený přístup: Zaměřit se na TOP 20–30 nejhledanějších značek, ne všechny najednou.

Jak poznat prioritní značky:
- Velké značky s vysokým objemem vyhledávání: Dulux, Caparol, Sikkens, Osmo, JUB, Primalex
- Značky kde Heureka reportuje nejvíce kliků

#### H) 404 stránka
Chybí custom 404 stránka (`app/not-found.tsx`).
Google penalizuje weby s generickými 404 stránkami.
Přidat stránku s navigací zpět na hlavní kategorie.

#### I) Obrázky v článcích
Žádný MDX soubor nemá obrázky.
Přidání obrázku s alt textem:
- Zvyšuje dwell time
- Umožňuje Google Image Search traffic
- Vizuálně odlišuje stránku od konkurence

Doporučení pro brand stránky: přidat alespoň 1 obrázek produktu nebo loga značky.

---

## Vzorový frontmatter pro nové/upravené brand stránky

```yaml
---
title: "[Značka] – [Konkrétní produkty nebo specialita] | Kde Koupit"
description: "[Značka] je [původ/tradice] výrobce [specialita]. Vlajková loď: [produkt]. [Benefit]. Přehled sortimentu a kde koupit v ČR."
category: barvy-a-laky
subcategory: podle-znacek
keywords:
  - [značka]
  - [značka] [nejhledanější produkt 1]
  - [značka] [nejhledanější produkt 2]
  - [značka] [kategorie nátěru]
  - [značka] cena
  - [značka] česká republika
publishedAt: "2025-02-06"
updatedAt: "2026-03-17"
heurekaPositionId: "XXXXXX"
heurekaCategoryId: "XXXX"
heurekaCategoryFilters: "f:XXXXX:XXXXXXXX"
---
```

---

## Vzorová struktura obsahu brand stránky

```
# [Značka] – [H1 = stejný záměr jako title, ale může být delší]

<p>Odstavec 1: původ, tradice, klíčová specialita</p>
<p>Odstavec 2: co značka nabízí, pro koho</p>

<HeurekaProductGrid />

<nav> TOC </nav>

<h2>Sortiment [Značka]</h2>
  <h3>[Kategorie 1]</h3>
  <p>Popis s názvy konkrétních produktů tučně, vlastnosti, pro co se hodí.</p>
  <HeurekaProductGrid positionId="..." categoryId="..." categoryFilters="..." />

  <h3>[Kategorie 2]</h3>
  <p>...</p>
  <HeurekaProductGrid ... />

  [... každý H3 musí mít banner]

<h2>Kde Použít Produkty [Značka]</h2>
  <ul> 5–8 konkrétních use-case bodů </ul>

<h2>Pro Koho Jsou Produkty [Značka]</h2>
  <p>Segmentace: profesionálové / kutilové / ekologicky smýšlející / ...</p>

<h2>Recenze a Zkušenosti</h2>
  <p>Co zákazníci chválí + co kritizují (důvěryhodnost!)</p>

<h2>Kde Koupit [Značka] v ČR</h2>
  <ul> hobby markety, stavebniny, e-shopy </ul>
  <HeurekaProductGrid ... /> ← banner i tady

<h2>Tipy Pro Výběr Správného Produktu</h2>
  <ul> 5–6 konkrétních tipů </ul>

<h2>Podobné Značky</h2>
  <ul> 4–6 odkazů na příbuzné značky s popisem proč </ul>

<h2>Často Kladené Otázky</h2>
  <h3>Konkrétní otázka vztahující se ke značce?</h3>
  <p>Konkrétní odpověď (ne generická).</p>
  [4–6 FAQ otázek]
```

---

## Poznámky k technickým věcem

### JSON-LD schema – aktuální stav
- `Article` schema: ✅ implementováno (`lib/seo.ts`)
- `BreadcrumbList` schema: ✅ implementováno
- `FAQPage` schema: ✅ funkce připravena, **čeká na implementaci v page komponentě**

### `updatedAt` → `dateModified`
`lib/seo.ts` automaticky přidá `dateModified` do Article JSON-LD pokud je v frontmatter `updatedAt`.
Stačí tedy jen přidat `updatedAt` do MDX frontmatter.

### Sitemap
`app/sitemap.ts` generuje sitemap automaticky ze všech MDX souborů.
Po přidání `updatedAt` se automaticky promítne do sitemapu jako `lastModified`.
