# Heureka Affiliate - Dokumentace

## Jak to funguje

Widget se vkládá přímo do MDX souboru pomocí komponenty:

```jsx
<HeurekaAffiliateWidget />
```

Widget automaticky používá výchozí hodnoty:
- `positionId="260397"`
- `categoryId="6038"`

Můžeš je přepsat:
```jsx
<HeurekaAffiliateWidget positionId="123456" categoryId="789" />
```

## Kde se widget zobrazuje

Widget je umístěn v každém MDX souboru po úvodních odstavcích, před prvním H2 nadpisem.

## Přehled pozic podle URL

### /osb-desky/8mm
```
heurekaPositionId: "260397"
heurekaCategoryId: "6038"
```

### /osb-desky/12mm
```
heurekaPositionId: "260397"
heurekaCategoryId: "6038"
```

### /osb-desky/15mm
```
heurekaPositionId: "260397"
heurekaCategoryId: "6038"
```

### /osb-desky/16mm
```
heurekaPositionId: "260397"
heurekaCategoryId: "6038"
```

### /osb-desky/18mm
```
heurekaPositionId: "260397"
heurekaCategoryId: "6038"
```

### /osb-desky/19mm
```
heurekaPositionId: "260397"
heurekaCategoryId: "6038"
```

### /osb-desky/22mm
```
heurekaPositionId: "260397"
heurekaCategoryId: "6038"
```

### /osb-desky/25mm
```
heurekaPositionId: "260397"
heurekaCategoryId: "6038"
```

---

## Heureka šablona pro vlastní HTML banner

Kód umístění:
```html
<div class="heureka-affiliate-category" data-trixam-positionid="260397" data-trixam-categoryid="6038" data-trixam-categoryfilters="" data-trixam-codetype="plainhtml" data-trixam-linktarget="top">
    <div><a href="https://www.heureka.cz/" data-trixam-databind="target: LinkTarget, href: HomepageAdvert.ClickUrl"><img src="" data-trixam-databind="src: HeurekaLogoUrl"></a></div>
    <div><a href="#" data-trixam-databind="target: LinkTarget, href: CategoryAdvert.ClickUrl"><span data-trixam-databind="text: CategoryAdvert.Data.Category.Name"></span></a></div>
    <div>
        <div data-trixam-databind="ifdef: ProductAdverts[0]">
            <div><a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[0].ClickUrl"><img data-trixam-databind="src: ProductAdverts[0].Product.PreviewImage" src=""></a></div>
            <div><a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[0].ClickUrl"><img data-trixam-databind="src: ProductAdverts[0].Product.ImageUrl" src=""></a></div>
            <div><a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[0].ClickUrl"><span data-trixam-databind="text: ProductAdverts[0].Product.Title"></span></a></div>
            <div data-trixam-databind="ifdef: ProductAdverts[0].Product.Rating"><span><span data-trixam-databind="text: ProductAdverts[0].Product.Rating"></span>%</span></div>
            <div><span data-trixam-databind="text: ProductAdverts[0].Product.PriceMinString"></span> - <span data-trixam-databind="text: ProductAdverts[0].Product.PriceMaxString"></span><span data-trixam-databind="text: Currency">Kč</span></div>
            <p data-trixam-databind="text: ProductAdverts[0].Product.DescriptionShort"></p>
        </div>
    </div>
</div>
```

Hlavní kód:
```html
<script async type="text/javascript" src="//serve.affiliate.heureka.cz/js/trixam.min.js"></script>
```

## Návod na použití HTML banneru

Při vkládání musí být beze změny zachován obalový kód banneru:

```html
<div class="heureka-affiliate-category" data-trixam-positionid="260397" data-trixam-categoryid="6038" data-trixam-codetype="plainhtml" data-trixam-linktarget="top">kód banneru</div>
```

Tento obalový kód zajišťuje funkčnost banneru a správné měření. Vnitřní kód banneru lze libovolně nakonfigurovat.

## Dostupné data-trixam-databind atributy

| Prvek | Kód | Příklad |
|-------|-----|---------|
| Link na úvodní stranu Heureka.cz | `<a href="#" data-trixam-databind="target: LinkTarget, href: HomepageAdvert.ClickUrl"></a>` | - |
| Link na kategorii | `<a href="#" data-trixam-databind="target: LinkTarget, href: CategoryAdvert.ClickUrl"></a>` | - |
| Link na produkt | `<a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[0].ClickUrl"></a>` | - |
| Název kategorie | `<span data-trixam-databind="text: CategoryAdvert.Data.Category.Name"></span>` | OSB desky |
| Název produktu | `<span data-trixam-databind="text: ProductAdverts[0].Product.Title"></span>` | Kronospan OSB 3 PD 2500 x 625 x 12 mm 1 ks |
| Minimální cena | `<span data-trixam-databind="text: ProductAdverts[0].Product.PriceMinString"></span>` | 166 |
| Maximální cena | `<span data-trixam-databind="text: ProductAdverts[0].Product.PriceMaxString"></span>` | 301 |
| Měna | `<span data-trixam-databind="text: Currency"></span>` | Kč |
| Hodnocení produktu | `<span data-trixam-databind="ifdef: ProductAdverts[0].Product.Rating"><span data-trixam-databind="text: ProductAdverts[0].Product.Rating"></span>%</span>` | 98% |
| Náhledový obrázek (150x150px) | `<img data-trixam-databind="src: ProductAdverts[0].Product.PreviewImage" src="" />` | - |
| Velký obrázek | `<img data-trixam-databind="src: ProductAdverts[0].Product.ImageUrl" src="" />` | - |
| Popis produktu | `<span data-trixam-databind="text: ProductAdverts[0].Product.DescriptionShort"></span>` | - |
| Podmínka existence produktu | `<span data-trixam-databind="ifdef: ProductAdverts[0]">...</span>` | - |
| Logo Heureka | `<img data-trixam-databind="src: HeurekaLogoUrl" src="" />` | - |

**Poznámka:** `ProductAdverts[0]` = první top produkt, `ProductAdverts[1]` = druhý, atd. Max 10 produktů (0-9).
