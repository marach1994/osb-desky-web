# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from uprav import uprav

D = [
 ('adler-cesko', 'ADLER', 'ADLER: recenze, ceny a přehled sortimentu',
  'ADLER – recenze, ceny a srovnání rakouských nátěrů na dřevo',
  'Recenze nátěrů ADLER: rakouská značka pro profesionální zpracování dřeva. Přehled řad, cenová hladina a rady pro výběr.',
  '<p>ADLER je rakouská značka mířící na profesionály a truhlářské provozy, čemuž odpovídá i cena — patří k dražším na trhu. Za příplatek dostanete nátěry stavěné na strojní aplikaci a vysokou odolnost, což se vyplatí u nábytku a interiérových prvků, které mají vydržet roky.</p>',
  '<p>ADLER se do plošných slev dostává zřídka, rozdíly mezi prodejci ale bývají znatelné.</p>'),

 ('bakrylex', 'Bakrylex', 'Bakrylex: recenze, ceny a přehled sortimentu',
  'Bakrylex – recenze, ceny a srovnání vodou ředitelných barev',
  'Recenze barev Bakrylex: české vodou ředitelné nátěry na dřevo a kov. Přehled řad, cenová hladina a rady pro výběr.',
  '<p>Bakrylex patří k cenově dostupným českým řadám vodou ředitelných barev. Proti syntetickým emailům je o něco dražší, ale odpadá ředidlo a zápach — u nátěrů v obydlených prostorách to obvykle převáží rozdíl v ceně.</p>',
  '<p>Ceny se mezi prodejci liší hlavně u větších balení, kde se vyplatí porovnávat.</p>'),

 ('balakryl', 'Balakryl', 'Balakryl: recenze, ceny a přehled sortimentu',
  'Balakryl – recenze, ceny a srovnání vodou ředitelných nátěrů',
  'Recenze nátěrů Balakryl: česká značka vodou ředitelných barev na dřevo a kov. Přehled řad, ceny a rady pro výběr.',
  '<p>Balakryl se drží ve střední cenové hladině — je dražší než tradiční syntetické emaily, ale levnější než zahraniční vodou ředitelné značky. Hlavní argument ale není cena, nýbrž absence rozpouštědel: nátěr nezapáchá a nežloutne, takže se hodí na okna, dveře a nábytek uvnitř bytu.</p>',
  '<p>Balakryl bývá součástí jarních akcí v hobby marketech, ceny se ale mezi e-shopy liší celoročně.</p>'),

 ('baumit', 'Baumit', 'Baumit: recenze, ceny a přehled sortimentu',
  'Baumit – recenze, ceny a srovnání fasádních a interiérových barev',
  'Recenze barev Baumit: rakouská značka fasádních systémů a interiérových nátěrů. Přehled řad, ceny a rady pro výběr.',
  '<p>Baumit se prodává spíš jako součást systému než jako samostatná barva a cena tomu odpovídá — pohybuje se ve střední až vyšší hladině. Smysl to dává tam, kde na fasádu navazuje zateplení nebo omítka od stejného výrobce a řeší se záruka na celou skladbu.</p>',
  '<p>U fasádních barev se vyplatí porovnat cenu za balení i vydatnost, u velkých kbelíků jsou rozdíly mezi prodejci výrazné.</p>'),

 ('belinka', 'Belinka', 'Belinka: recenze, ceny a přehled sortimentu',
  'Belinka – recenze, ceny a srovnání lazur na dřevo',
  'Recenze lazur Belinka: slovinská značka ochranných nátěrů na dřevo. Přehled řad, ceny a rady pro výběr.',
  '<p>Belinka patří k nejlepším poměrům ceny a výkonu mezi lazurami na českém trhu. Je dostupnější než německé prémiové značky, přitom na běžných venkovních konstrukcích — plotech, pergolách, obkladech — obstojí srovnatelně.</p>',
  '<p>Belinka se objevuje v sezonních akcích na jaře, kdy začíná sezona venkovních nátěrů.</p>'),

 ('bochemit', 'Bochemit', 'Bochemit: recenze, ceny a přehled sortimentu',
  'Bochemit – recenze, ceny a srovnání impregnací na dřevo',
  'Recenze impregnací Bochemit: česká značka ochrany dřeva proti hmyzu a houbám. Přehled řad, ceny a rady pro výběr.',
  '<p>Bochemit se prodává hlavně jako koncentrát, takže srovnávat cenu za balení je zavádějící — rozhoduje cena za litr hotového roztoku po naředění. Přepočteno takhle jde o jednu z levnějších cest, jak dřevo ochránit před hmyzem a dřevokaznými houbami.</p>',
  '<p>U koncentrátů se vyplatí sledovat větší balení, přepočet na litr roztoku bývá výrazně příznivější.</p>'),

 ('bolix', 'Bolix', 'Bolix: recenze, ceny a přehled sortimentu',
  'Bolix – recenze, ceny a srovnání fasádních barev',
  'Recenze fasádních barev Bolix: polská značka zateplovacích systémů a fasádních nátěrů. Přehled řad, ceny a rady pro výběr.',
  '<p>Bolix je cenově dostupnější alternativa k západním fasádním systémům a bývá volbou tam, kde se řeší velká plocha a rozpočet. U fasád se ale vyplatí počítat celkovou cenu včetně penetrace a spotřeby na metr, ne jen cenu kbelíku.</p>',
  '<p>Fasádní barvy zlevňují nejčastěji mimo sezonu, tedy na podzim a v zimě.</p>'),

 ('bona', 'Bona', 'Bona: recenze, ceny a přehled sortimentu',
  'Bona – recenze, ceny a srovnání podlahových laků a olejů',
  'Recenze podlahových nátěrů Bona: švédská značka laků a olejů na dřevěné podlahy. Přehled řad, ceny a rady pro výběr.',
  '<p>Bona je prémiová švédská značka zaměřená na dřevěné podlahy a patří k dražším na trhu. U podlahy ale cena nátěru tvoří zlomek nákladů na broušení a práci — ušetřit tady a řešit předčasnou obnovu bývá dráž než rovnou koupit odolnější lak.</p>',
  '<p>Bona se do slev dostává výjimečně, mezi specializovanými e-shopy jsou ale cenové rozdíly patrné.</p>'),

 ('bondex', 'Bondex', 'Bondex: recenze, ceny a přehled sortimentu',
  'Bondex – recenze, ceny a srovnání lazur a nátěrů na dřevo',
  'Recenze nátěrů Bondex: značka ochranných lazur na dřevo pro exteriér i interiér. Přehled řad, ceny a rady pro výběr.',
  '<p>Bondex cílí na kutily a drží se ve střední cenové hladině — dostupnější než profesionální německé značky, dražší než nejlevnější tuzemské lazury. Na nátěr plotu nebo zahradního nábytku, který se stejně obnovuje po pár letech, je to rozumný kompromis.</p>',
  '<p>Bondex bývá zastoupený v jarních akcích hobby marketů.</p>'),

 ('borma-wachs', 'Borma Wachs', 'Borma Wachs: recenze, ceny a přehled sortimentu',
  'Borma Wachs – recenze, ceny a srovnání vosků a olejů na dřevo',
  'Recenze nátěrů Borma Wachs: italská značka vosků, olejů a retušovacích prostředků na dřevo. Přehled řad, ceny a rady pro výběr.',
  '<p>Borma Wachs je italská specializovaná značka pro restaurování a jemnou práci se dřevem, cenově nad běžnými hobby produkty. Kupuje se obvykle v malých baleních na konkrétní zásah — retuš, vosk do spáry, olej na desku stolu — kde celková částka zůstává nízká i při vyšší ceně za litr.</p>',
  '<p>Sortiment je široký a ceny jednotlivých balení se mezi prodejci liší, porovnání se vyplatí.</p>'),

 ('cemix', 'Cemix', 'Cemix: recenze, ceny a přehled sortimentu',
  'Cemix – recenze, ceny a srovnání fasádních barev a omítek',
  'Recenze fasádních barev Cemix: česká značka suchých směsí, omítek a fasádních nátěrů. Přehled řad, ceny a rady pro výběr.',
  '<p>Cemix patří k cenově dostupným českým značkám ve stavebním segmentu. Fasádní barvy se prodávají hlavně přes stavebniny ve velkých baleních, takže cena za litr vychází příznivěji než u hobby balení konkurence.</p>',
  '<p>U velkoobjemových balení bývají rozdíly mezi prodejci v řádu stokorun, porovnat se vyplatí.</p>'),

 ('chemolak', 'Chemolak', 'Chemolak: recenze, ceny a přehled sortimentu',
  'Chemolak – recenze, ceny a srovnání syntetických nátěrů',
  'Recenze nátěrů Chemolak: slovenská značka syntetických barev, emailů a laků. Přehled řad, ceny a rady pro výběr.',
  '<p>Chemolak je slovenská značka s dlouhou tradicí a patří k cenově nejdostupnějším na trhu. Sází na klasické syntetické emaily a laky — levné a osvědčené, ale s ředidlem a delším schnutím, což je hlavní rozdíl proti dražším vodou ředitelným řadám.</p>',
  '<p>Ceny syntetických emailů kolísají podle balení, u větších plechovek se porovnání vyplatí nejvíc.</p>'),
]

for r in D:
    print('%-16s hotovo' % uprav(*r))
print('\nzpracovano:', len(D))
