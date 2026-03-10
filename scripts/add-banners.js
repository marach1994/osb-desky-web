#!/usr/bin/env node
/**
 * add-banners.js
 * Inserts HeurekaProductGrid banners into brand MDX files in content/barvy-a-laky/
 * based on data in scripts/heureka-positions.json
 */

const fs = require('fs');
const path = require('path');

const POSITIONS_FILE = path.join(__dirname, 'heureka-positions.json');
const MDX_DIR = path.join(__dirname, '..', 'content', 'barvy-a-laky');

// ─── Czech → ASCII normalisation ────────────────────────────────────────────
function normalizeBrand(brand) {
  return brand
    .toLowerCase()
    // Czech diacritics
    .replace(/[áä]/g, 'a')
    .replace(/[čc]/g, 'c').replace(/č/g, 'c')
    .replace(/ď/g, 'd')
    .replace(/[éě]/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ň/g, 'n')
    .replace(/[óö]/g, 'o')
    .replace(/ř/g, 'r')
    .replace(/š/g, 's')
    .replace(/ť/g, 't')
    .replace(/[úůü]/g, 'u')
    .replace(/ý/g, 'y')
    .replace(/ž/g, 'z')
    // German diacritics (for brands like Schöner, Düfa)
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 'ss')
    // Punctuation → hyphens / removal
    .replace(/[.]/g, '')          // remove dots (V.I.P. → vip)
    .replace(/[&+]/g, '')         // remove & and + (Farrow & Ball → farrow-ball)
    .replace(/[^a-z0-9]+/g, '-')  // everything else to hyphen
    .replace(/-+/g, '-')          // collapse multiple hyphens
    .replace(/^-|-$/g, '');       // trim leading/trailing hyphens
}

// ─── Category → H3 section mapping ──────────────────────────────────────────
const CATEGORY_TO_H3 = {
  'Interiérové barvy': 'interior',
  'Fasádní barvy': 'fasadni',
  'Lazury a mořidla na dřevo': 'drevo',
  'Laky na dřevo': 'drevo',
  'Oleje na dřevo': 'drevo',
  'Vosky na dřevo': 'drevo',
  'Barvy na dřevo': 'drevo',
  'Barvy na kov': 'drevo',   // same section as dřevo
  // These go at end of article
  'Barvy na beton': 'end',
  'Barvy ve spreji': 'end',
  'Malířské nářadí a doplňky': 'end',
  'Ředidla a rozpouštědla': 'end',
  'Univerzální barvy': 'end',
};

// Priority for "Barvy na Dřevo a Kov" H3 (first wins)
const DREVO_PRIORITY = [
  'Lazury a mořidla na dřevo',
  'Laky na dřevo',
  'Oleje na dřevo',
  'Vosky na dřevo',
  'Barvy na dřevo',
  'Barvy na kov',
];

// Priority for main (frontmatter) position (first wins)
const MAIN_PRIORITY = [
  'Lazury a mořidla na dřevo',
  'Interiérové barvy',
  'Fasádní barvy',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function pickMain(positions) {
  for (const cat of MAIN_PRIORITY) {
    const found = positions.find(p => p.category === cat && p.positionId);
    if (found) return found;
  }
  // fallback: any with positionId
  return positions.find(p => p.positionId) || null;
}

function buildBannerTag(pos) {
  return `<HeurekaProductGrid positionId="${pos.positionId}" categoryId="${pos.categoryId}" categoryFilters="${pos.categoryFilters}" />`;
}

// ─── MDX manipulation ─────────────────────────────────────────────────────────
/**
 * Given MDX content and positions for a brand, return updated content.
 * Returns null if nothing changed.
 */
function processMdx(content, positions) {
  // Filter to only positions with a valid positionId
  const valid = positions.filter(p => p.positionId);
  if (valid.length === 0) return null;

  const main = pickMain(valid);
  if (!main) return null;

  let lines = content.split('\n');

  // ── 1. Add frontmatter fields ──────────────────────────────────────────────
  // Find the closing --- of frontmatter (second occurrence)
  let fmEnd = -1;
  let fmCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      fmCount++;
      if (fmCount === 2) { fmEnd = i; break; }
    }
  }
  if (fmEnd === -1) return null; // no frontmatter

  // Insert before closing ---
  const fmInsert = [
    `heurekaPositionId: "${main.positionId}"`,
    `heurekaCategoryId: "${main.categoryId}"`,
    `heurekaCategoryFilters: "${main.categoryFilters}"`,
  ];
  lines.splice(fmEnd, 0, ...fmInsert);
  // fmEnd is now shifted by 3
  fmEnd += fmInsert.length;

  // ── 2. Insert <HeurekaProductGrid /> after intro (before ## Sortiment) ─────
  // Find the line index of "## Sortiment"
  let sortimentIdx = -1;
  for (let i = fmEnd + 1; i < lines.length; i++) {
    if (lines[i].startsWith('## Sortiment')) {
      sortimentIdx = i;
      break;
    }
  }
  if (sortimentIdx === -1) return null;

  // Insert blank line + component just before ## Sortiment
  lines.splice(sortimentIdx, 0, '<HeurekaProductGrid />', '');
  // Adjust for the two new lines
  sortimentIdx += 2;

  // ── 3. Insert per-H3 banners ───────────────────────────────────────────────
  // Determine which positions go where.
  // Group by section:
  const interiorPos = valid.find(p => p.category === 'Interiérové barvy');
  const fasadniPos  = valid.find(p => p.category === 'Fasádní barvy');

  let drevoPos = null;
  for (const cat of DREVO_PRIORITY) {
    const found = valid.find(p => p.category === cat);
    if (found) { drevoPos = found; break; }
  }

  // End-of-article positions (all matching)
  const endCategories = ['Barvy na beton', 'Barvy ve spreji', 'Malířské nářadí a doplňky', 'Ředidla a rozpouštědla', 'Univerzální barvy'];
  const endPositions = valid.filter(p => endCategories.includes(p.category));

  // Now we need to find H3 sections in the ## Sortiment block.
  // We scan lines from sortimentIdx onwards.
  // We look for:
  //   <h3>Interiérové Barvy</h3>
  //   <h3>Fasádní Barvy</h3>
  //   <h3>Barvy na Dřevo a Kov</h3>
  // And after each, find the closing </p> of the paragraph block.

  // We'll do multiple passes to find insertion points (scan top-down, insert bottom-up to preserve indices).
  // Collect insertions as { afterLineIdx, text }
  const insertions = [];

  // Also track where ## Kde Použít starts (end of Sortiment section) for "end" items
  let kdePouziIdx = -1;

  for (let i = sortimentIdx; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('## Kde Použít')) {
      kdePouziIdx = i;
      break;
    }

    // Skip FAQ H3s - they contain brand names
    // H3 tags in Sortiment section start with <h3> and contain section names
    if (line.startsWith('<h3>')) {
      let h3Type = null;
      if (line.includes('Interiérové')) h3Type = 'interior';
      else if (line.includes('Fasádní')) h3Type = 'fasadni';
      else if (line.includes('Barvy na Dřevo') || line.includes('Barvy na drevo')) h3Type = 'drevo';
      // else: FAQ H3, skip

      if (h3Type) {
        // Find the end of the <p>...</p> block after this H3
        // Look forward for the next blank line or next h3/## after a <p> block
        let pEnd = -1;
        let j = i + 1;
        // skip blank lines
        while (j < lines.length && lines[j].trim() === '') j++;
        // now expect <p>
        if (j < lines.length && lines[j].startsWith('<p>')) {
          // find end of paragraph - either </p> on same line or on subsequent line
          if (lines[j].includes('</p>')) {
            pEnd = j;
          } else {
            // multi-line p
            while (j < lines.length && !lines[j].includes('</p>')) j++;
            if (lines[j] && lines[j].includes('</p>')) pEnd = j;
          }
        }

        if (pEnd !== -1) {
          let bannerTag = null;
          if (h3Type === 'interior' && interiorPos) bannerTag = buildBannerTag(interiorPos);
          else if (h3Type === 'fasadni' && fasadniPos) bannerTag = buildBannerTag(fasadniPos);
          else if (h3Type === 'drevo' && drevoPos) bannerTag = buildBannerTag(drevoPos);

          if (bannerTag) {
            insertions.push({ afterLineIdx: pEnd, text: bannerTag });
          }
        }
      }
    }
  }

  // "end" positions go before ## Kde Použít (or before closing ---  if not found)
  if (endPositions.length > 0) {
    let insertBefore = kdePouziIdx;
    if (insertBefore === -1) {
      // find closing ---
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].trim() === '---') { insertBefore = i; break; }
      }
    }
    if (insertBefore !== -1) {
      // We'll insert all end banners (one per position) before that line
      for (const pos of endPositions) {
        insertions.push({ afterLineIdx: insertBefore - 1, text: buildBannerTag(pos), isBefore: true, addTrailingBlank: true });
      }
    }
  }

  // Apply insertions bottom-up (highest line index first) to preserve earlier indices
  insertions.sort((a, b) => b.afterLineIdx - a.afterLineIdx);

  for (const ins of insertions) {
    if (ins.addTrailingBlank) {
      lines.splice(ins.afterLineIdx + 1, 0, '', ins.text, '');
    } else {
      lines.splice(ins.afterLineIdx + 1, 0, '', ins.text);
    }
  }

  return lines.join('\n');
}

// ─── Main ────────────────────────────────────────────────────────────────────
function main() {
  const rawPositions = JSON.parse(fs.readFileSync(POSITIONS_FILE, 'utf8'));

  // Group by brand
  const byBrand = {};
  for (const pos of rawPositions) {
    if (!byBrand[pos.brand]) byBrand[pos.brand] = [];
    byBrand[pos.brand].push(pos);
  }

  // Build a map of existing MDX files: slug → filename
  const mdxFiles = fs.readdirSync(MDX_DIR).filter(f => f.endsWith('.mdx'));
  const slugToFile = {};
  for (const f of mdxFiles) {
    slugToFile[f.replace('.mdx', '')] = f;
  }

  let updated = 0;
  let skipped = 0;
  let noFile = 0;
  let noValidPos = 0;
  const unmatched = [];

  for (const [brand, positions] of Object.entries(byBrand)) {
    // Find MDX file
    const slug = normalizeBrand(brand);
    let mdxFile = slugToFile[slug];

    // Try some additional common variations
    if (!mdxFile) {
      // try removing special chars differently
      const altSlug = slug.replace(/-+/g, '-');
      mdxFile = slugToFile[altSlug];
    }

    if (!mdxFile) {
      unmatched.push({ brand, slug });
      noFile++;
      continue;
    }

    const filePath = path.join(MDX_DIR, mdxFile);
    const content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has heurekaPositionId
    if (content.includes('heurekaPositionId')) {
      skipped++;
      continue;
    }

    // Check valid positions exist
    const valid = positions.filter(p => p.positionId);
    if (valid.length === 0) {
      noValidPos++;
      continue;
    }

    const updatedContent = processMdx(content, positions);
    if (!updatedContent) {
      console.log(`  WARN: processMdx returned null for ${mdxFile}`);
      noValidPos++;
      continue;
    }

    fs.writeFileSync(filePath, updatedContent, 'utf8');
    updated++;
    console.log(`  Updated: ${mdxFile} (${valid.length} positions)`);
  }

  console.log('\n─── Summary ───────────────────────────────────────');
  console.log(`Files updated:          ${updated}`);
  console.log(`Files skipped (already had banner): ${skipped}`);
  console.log(`Brands with no valid positionId: ${noValidPos}`);
  console.log(`Brands with no MDX file: ${noFile}`);

  if (unmatched.length > 0) {
    console.log('\nUnmatched brands:');
    for (const { brand, slug } of unmatched) {
      console.log(`  "${brand}" → tried slug "${slug}"`);
    }
  }
}

main();
