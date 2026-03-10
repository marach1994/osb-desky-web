// generate-brand-slugs.js
// Generates deduplicated slug mappings from brand names.

const brands = [
  "Het", "Dulux", "Fl\u00fcgger", "Primalex", "Tikkurila", "San Marco",
  "Barvy a Laky Hostiva\u0159", "Akzo", "Colorlak", "Kittfort", "Sniezka",
  "Mapei", "Jub", "Adler \u010cesko", "Obi", "Caparol", "Swingcolor",
  "Barvy a laky Teluria", "Hornbach", "Rokospol", "Den Braven", "Herbol",
  "Austis", "SPS", "Vitex", "Stachema", "Selection", "Primacol", "PUFAS",
  "V.I.P. Italy", "StyleColor", "Weber", "Atlas", "Chemolak", "Bigstone",
  "Remakol", "Baumit", "Farrow & Ball", "Abamal", "Barvy Herman", "Morys",
  "Rust-Oleum", "Soudal", "Chytr\u00e1 ze\u010f", "Jupol", "Balakryl", "Detecha",
  "Dispechem", "ZINSSER", "Profi Color", "D\u00fcfa", "Lu\u010debn\u00ed z\u00e1vody",
  "Wilckens", "Helios", "Teluria", "Stavebniny DEK", "Finkolora",
  "Eternal", "Denas", "IZOMAT stavebniny", "Sikkens", "JOHNSTONES",
  "Dupli Color", "Building Plast", "ColorCity", "FN NANO",
  "Sch\u00f6ner Wohnen", "Sokrates", "Slovlak", "Thermilate", "Colorex",
  "Mal\u00ed\u0159", "KHB Keramika", "Sedleck\u00fd kaolin", "WoldoClean", "Uni Hobby",
  "Kana", "Sigma", "Amarit", "Baltech", "Chamaleon", "Chromos", "Dekoral",
  "Finalit", "Fox", "Kabe", "Praktik", "Rembradtin", "Remmers", "Sanax",
  "Sika", "Spektrum", "Supermal", "Supralux", "Synteko", "A.S. Cr\u00e9ation",
  "Aktid\u0159evin", "Bakrylex", "Barvy Plus", "BBB barvy", "Belinka",
  "Bochemit", "Bondex", "Bori", "Borma Wachs", "CB Chemie Servisn\u00ed",
  "Chemoxyl", "Clou", "Dekfinish", "Dictum", "Druchema Lihov\u00e9 mo\u0159idlo",
  "Estetik", "Finess", "Fortekryl", "Hahn Color", "Hokr", "Icla",
  "Impranal", "Jansen", "Johnstone\u00b4s", "Koopmans", "Kreul", "Lazurol",
  "Leinos", "Lignofix", "LuxDecor", "Luxol", "Murexin", "Okko", "Osmo",
  "Owatrol", "Pentart", "PNZ", "Pro-Doma", "Prolux", "Roko", "Rosner",
  "Sadolin", "Saicos", "Schuller Eh\u2019klar", "Wildschek", "Xyladecor",
  "\u015anie\u017aka", "Apipol-Wax", "Auson", "Bal Hostiva\u0159", "Bona", "Ciranova",
  "Color Company", "Complex - Josef Schellhorn", "Dakota Living", "HB-Lak",
  "Howard Products", "Hyperticus Bio", "Klumpp Coatings", "Labar", "Loba",
  "Odie\u2019s", "Oli-Natura", "Pallmann", "Perdix", "Rubio Monocoat",
  "Scandiccare", "Unibal", "Walrus Oil", "Woca", "Wood Guard",
  "Weber Terranova", "Saint-Gobain", "Henkel", "Cemix", "Meffert",
  "Fronton", "Barlet", "Remal", "Flugger", "TOPSTONE", "\u010cESK\u00dd STAVITEL",
  "METRUM", "BULDOK new", "Novochema", "VIP Italy", "\u015aNIE\u017bKA", "\u010cer\u0165\u00e1k",
  "Scandicare", "4CR", "Bolix", "Cleamen", "Denas Color", "Euron\u00e1\u0159ad\u00ed",
  "GoTherm", "Knauf insulation", "PRINCE COLOR", "Q-Cover", "Relius",
  "Signocryl", "Alkyton", "Bisil", "BSA", "Epolex", "Granit", "Industrit",
  "Industrol", "Jeger", "Modulan", "Neotex", "Pragoprimer Standard",
  "Renolast", "Rokosil Aqua", "Trikolor", "U Pep\u00e1nka", "Venti",
  "Severochema", "Novol", "Dynacoat", "Cham\u00e4leon", "HF servis",
  "Body Color", "PROGold", "HF Market", "BOLL", "Dexoll", "Brunox", "HG",
  "Polykar", "Ecoliquid", "CARLINE", "Ep Vernici", "Pro-Tech", "Velvana",
  "Hadex", "BKP GROUP", "CYKLON", "Dawex Chemical", "Stahlmann", "PROXIM",
  "Ferdus", "ORLEN", "Pellachrom", "Mipa", "Marty\u2019s", "Akzo Nobel",
  "Aug Hedinger", "P\u00e9b\u00e9o", "Sennelier", "Kwasny",
  "Lu\u010debn\u00ed z\u00e1vody Kol\u00edn", "Motip", "P.S.R.", "SHERON", "Hostagrund",
  "DISTRIMO", "Eco-Solutions Limited", "Pattex", "W\u00fcrth", "AV EQUEN",
  "Alkapren", "Bal Teluria", "EnviChem", "Hammerite", "Karcher",
  "Lefranc amp Bourgeois", "PG", "REM-LACK BIS", "Nanolab", "Poola",
  "DF Partner", "Lachner", "AG TERMOPASTY", "BIONE cosmetics", "Agama",
  "ACI", "Carlson", "Citon", "DEBEER", "Druchema", "Farmicol SpA",
  "Flagon", "HB - LAK", "K&N Filters", "Koh-i-noor", "LIQUI MOLY",
  "Lefranc amp Bourgeois 2", "Mastersil", "Montana Cans", "Nanoprotech",
  "Presto", "Renesans", "SELECT", "TESA", "VITON", "Winsor & Newton",
  "Topekor", "Inhicor", "HLUBNA", "COYOTE", "Rust Oleum", "KM PLUS",
  "Deerfos", "Aerosol - service", "BoreTech", "Alfachem", "Articolor",
  "Auto-max", "BONDEX WHITE SPIRIT", "Becher Profi", "CHAMAELEON",
  "Carfit", "ECOFOL", "ELCHEMCo", "EXPERT LINE", "FORCH", "Faren",
  "Gutta", "Havl\u00ed\u010dek truhl\u00e1\u0159stv\u00ed", "Intercut", "Kansai Helios", "Kavan",
  "LITHOFIN", "Lesonal", "M-Kavis", "MAT GROUP", "PENOSIL", "PETEC",
  "Plastservis", "RIApower", "Revell", "Rustbreaker", "Schmincke",
  "Schuller", "Spies Hecker", "Stefan Kupietz & CoKG", "TECMAXX", "TKK",
  "Tremco CPG", "Vivechrom", "Wolfcraft"
];

function slugify(str) {
  let s = str.toLowerCase();
  // Use NFD normalization to decompose diacritics, then strip combining marks
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Replace non-alphanumeric with hyphens
  s = s.replace(/[^a-z0-9]+/g, '-');
  // Collapse multiple hyphens
  s = s.replace(/-+/g, '-');
  // Trim hyphens
  s = s.replace(/^-|-$/g, '');
  return s;
}

const seenSlugs = new Set();
const results = [];

for (const label of brands) {
  const slug = slugify(label);
  if (!seenSlugs.has(slug)) {
    seenSlugs.add(slug);
    results.push({ slug, label });
  }
}

results.sort((a, b) => a.slug.localeCompare(b.slug));

console.log('Total unique brand slugs: ' + results.length);
console.log(JSON.stringify(results, null, 2));
