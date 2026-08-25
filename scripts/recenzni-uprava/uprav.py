# -*- coding: utf-8 -*-
"""Prida recenzni strukturu na znackovou stranku: H1/title/description
s recenzni intenci, sekci Cena, sekci Akce s affiliate odkazem,
prejmenuje Tipy -> Jak vybrat a doplni obsah clanku.

Text sekce Cena je pro kazdou znacku vlastni - zadna sablona.
"""
import io, json, re, os, sys

HAFF = '281647'
BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OBSAH = os.path.join(BASE, 'content', 'barvy-a-laky')

def url_kategorii():
    """(categoryId, brandFilterId) -> categoryUrl; filterId rozlisi dve kategorie 6393."""
    p = os.path.join(BASE, 'scripts', 'heureka-brands.json')
    d = json.load(io.open(p, encoding='utf-8', errors='replace'))
    m = {}
    for c in d:
        if c.get('brandFilterId'):
            m[(c['categoryId'], c['brandFilterId'])] = c['categoryUrl']
    return m

MAPA = url_kategorii()

def uprav(slug, jmeno, h1, title, desc, cena_html, akce_html):
    p = os.path.join(OBSAH, slug + '.mdx')
    t = io.open(p, encoding='utf-8').read()

    t = re.sub(r'^title: ".*"$', 'title: "%s"' % title, t, count=1, flags=re.M)
    t = re.sub(r'^description: ".*"$', 'description: "%s"' % desc, t, count=1, flags=re.M)
    t = re.sub(r'^# .*$', '# ' + h1, t, count=1, flags=re.M)

    t = re.sub(r'<h2 id="[^"]*tipy[^"]*">Tipy Pro Výběr[^<]*</h2>',
               '<h2 id="jak-vybrat">Jak Vybrat Barvy %s</h2>' % jmeno, t)
    t = re.sub(r'<a href="#[^"]*tipy[^"]*">Tipy Pro Výběr[^<]*</a>',
               '<a href="#jak-vybrat">Jak Vybrat Barvy %s</a>' % jmeno, t)

    m = re.search(r'<h2 id="[^"]*kde-pouzit', t)
    if not m:
        raise SystemExit('%s: nenalezena sekce kde-pouzit' % slug)
    t = t[:m.start()] + '<h2 id="cena">Kolik Stojí Barvy %s</h2>\n\n%s\n\n' % (jmeno, cena_html) + t[m.start():]

    cid = re.search(r'heurekaCategoryId: "(\d+)"', t).group(1)
    cf  = re.search(r'heurekaCategoryFilters: "([^"]*)"', t).group(1)
    fid = cf.split(':')[1] if ':' in cf else ''
    zaklad = MAPA.get((cid, fid))
    if not zaklad:
        raise SystemExit('%s: neznama kategorie %s/%s' % (slug, cid, fid))
    odkaz = '%s%s/#?haff=%s&amp;utm_medium=affiliate' % (zaklad, cf, HAFF)

    kotva = re.search(r'<h2 id="podobne-znacky">', t) or re.search(r'<h2 id="faq">', t)
    akce = ('<h2 id="akce">Akce a Slevy na Barvy %s</h2>\n\n%s\n\n'
            '<p><a href="%s" target="_blank" rel="sponsored nofollow noopener">'
            'Porovnat aktuální ceny %s na Heurece &rarr;</a></p>\n\n' % (jmeno, akce_html, odkaz, jmeno))
    t = t[:kotva.start()] + akce + t[kotva.start():]

    t = re.sub(r'(\s*)<li><a href="#[^"]*kde-pouzit[^"]*">',
               r'\1<li><a href="#cena">Kolik Stojí Barvy %s</a></li>\1<li><a href="#kde-pouzit">' % jmeno,
               t, count=1)
    t = re.sub(r'(\s*)<li><a href="#(podobne-znacky|faq)">',
               r'\1<li><a href="#akce">Akce a Slevy</a></li>\1<li><a href="#\2">', t, count=1)

    io.open(p, 'w', encoding='utf-8', newline='\n').write(t)
    return slug
