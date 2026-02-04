# Heureka Affiliate - Dokumentace

<!-- Vlož sem dokumentaci z Heureka affiliate -->
Kód umístění: 
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

Hlavní kód:
<script async type="text/javascript" src="//serve.affiliate.heureka.cz/js/trixam.min.js"></script>
Návod na použití html banneru
Při vkládání musí být beze změny zachován obalový kód banneru:

<div class="heureka-affiliate-category" data-trixam-positionid="260397" data-trixam-categoryid="6038" data-trixam-codetype="plainhtml" data-trixam-linktarget="top">kód banneru</div>
Tento obalový kód zajišťuje funkčnost banneru a správné měření. Vnitřní kód banneru lze libovolně nakonfigurovat - vložit pouze prvky, které chcete zobrazit, přidat libovolné třídy a měnit HTML elementy (span, div, p, ...). Důležité je, aby nebyl porušen kód uvnitř atributů data-trixam-databind u jednotlivých HTML elementů.

Link na úvodní stranu Heureka.cz	<a href="#" data-trixam-databind="target: LinkTarget, href: HomepageAdvert.ClickUrl"></a>	Speciální proklikové url, umožňující započítání proklikových a konverzních provizí
Link na kategorii	<a href="#" data-trixam-databind="target: LinkTarget, href: CategoryAdvert.ClickUrl"></a>	Speciální proklikové url, umožňující započítání proklikových a konverzních provizí
Link na produkt	<a href="#" data-trixam-databind="target: LinkTarget, href: ProductAdverts[0].ClickUrl"></a>	Speciální proklikové url, umožňující započítání proklikových a konverzních provizí
Název kategorie	<span data-trixam-databind="text: CategoryAdvert.Data.Category.Name"></span>	OSB desky
Název produktu	<span data-trixam-databind="text: ProductAdverts[0].Product.Title"></span>	Kronospan OSB 3 PD 2500 x 625 x 12 mm 1 ks
Minimální cena produktu a měna ceny	<span data-trixam-databind="text: ProductAdverts[0].Product.PriceMinString"></span><span data-trixam-databind="text: Currency"></span>	166Kč
Maximální cena produktu a měna ceny	<span data-trixam-databind="text: ProductAdverts[0].Product.PriceMaxString"></span><span data-trixam-databind="text: Currency"></span>	301Kč
Hodnocení produktu	<span data-trixam-databind="ifdef: ProductAdverts[0].Product.Rating"><span data-trixam-databind="text: ProductAdverts[0].Product.Rating"></span>%</span>
Hodnocení produktu nemusí být vždy dostupné, proto je třeba podmínka, aby se znak procenta zobrazil jen, pokud je hodnocení dostupné.

98%
Náhledový obrázek (150x150px)	<img data-trixam-databind="src: ProductAdverts[0].Product.PreviewImage" src="" width="150" height="150" /></span>	
Velký obrázek (různá velikost)	<img data-trixam-databind="src: ProductAdverts[0].Product.ImageUrl" src="" />	
Popis produktu	<span data-trixam-databind="text: ProductAdverts[0].Product.DescriptionShort"></span>	Cena platná pouze pro skladové zásoby ve Vítkově a Homolích! V případě zájmu o větší množství bude cena naceněna individuálně naším operátorem dle aktuálního ceníku...
Podmínka, jestli existuje 1. top produkt	<span data-trixam-databind="ifdef: ProductAdverts[0]"><span data-trixam-databind="text: ProductAdverts[0].Product.Title"></span></span>
Zobrazí název 1. top produktu, pokud existuje.

Kronospan OSB 3 PD 2500 x 625 x 12 mm 1 ks
Logo Heureka	<img data-trixam-databind="src: HeurekaLogoUrl" src="" />	
ProductAdverts[0] = první top produkt v kategorii, 1 = druhý top produkt, atd. Pro banner je dostupných maximálně 10 produktů. Minimálně 0.
