// ===== CURRENCY =====
let EUR_RATE;
try { EUR_RATE = parseFloat(localStorage.getItem('eurRate')); } catch(e) {}
if (!EUR_RATE || isNaN(EUR_RATE)) EUR_RATE = 1.95583;
function toEur(bgn) { return bgn / EUR_RATE; }
function fmtEur(bgn) { return toEur(bgn).toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' €'; }
function fmtBgn(bgn) { return bgn.toLocaleString('bg-BG', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' лв.'; }
// Primary display: EUR bold, BGN muted below
function fmtPrice(bgn, saleCls='') {
  return `<span class="price-eur-main${saleCls ? ' '+saleCls : ''}">${fmtEur(bgn)}</span><span class="price-bgn-sub">${fmtBgn(bgn)}</span>`;
}
// Inline dual: "2.30 € / 4.49 лв."
function fmtDual(bgn) { return `${fmtEur(bgn)} / ${fmtBgn(bgn)}`; }

// Единен речник на категориите — canonical + legacy ключове
const CAT_LABELS = {
  all:'Всички продукти',
  laptops:'Лаптопи', desktops:'Настолни компютри', components:'Компоненти',
  peripherals:'Периферия', network:'Мрежово оборудване', storage:'Сървъри и сторидж',
  software:'Софтуер', accessories:'Аксесоари',
  sale:'Промоции', new:'Нови продукти',
  // Legacy ключове
  laptop:'Лаптопи', desktop:'Десктопи', gaming:'Гейминг',
  audio:'Аудио', mobile:'Телефони', tablet:'Таблети',
  tv:'Телевизори', camera:'Фотоапарати', smart:'Смарт устройства',
  print:'Принтери', acc:'Аксесоари', monitor:'Монитори',
};

// HTML escape — използвай навсякъде преди вмъкване на user input в innerHTML
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EUR_RATE, toEur, fmtEur, fmtBgn, fmtPrice, fmtDual, escHtml };
}

// ===== DATA =====
const products = [
  // ── GPU Import — 2026-04-20 — categoryId=7 (Most BG) — 34 видеокарти ──
  {id:1,name:'PowerColor Radeon RX 580 8GB GDDR5',brand:'PowerColor',cat:'components',subcat:'gpu',
   price:314,old:null,pct:null,badge:null,emoji:'🎮',sku:'1A1-G003028MBG',ean:null,
   specs:{'GPU':'AMD Radeon RX 580','Памет':'8 GB GDDR5','Интерфейс':'256-bit','Boost':'1215 MHz','Слот':'PCI-E 3.0','Изходи':'DL DVI-D / HDMI / DP','OpenGL':'4.5'},
   rating:4.3,rv:0,reviews:[],
   desc:'AMD Radeon RX 580 с 8 GB GDDR5 памет. Надеждна карта за 1080p гейминг с поддръжка за OpenGL 4.5 и DirectX 12.',
   img:'https://portal.mostbg.com/api/images/imageFileData/16808.png',stock:false},

  {id:2,name:'Palit GeForce RTX 3050 StormX 6GB GDDR6',brand:'Palit',cat:'components',subcat:'gpu',
   price:310,old:null,pct:null,badge:null,emoji:'🎮',sku:'NE63050018JE-1070F',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 3050','Памет':'6 GB GDDR6','Интерфейс':'96-bit','Boost':'1470 MHz','Слот':'PCI-E 4.0','Изходи':'DVI / HDMI 2.1 / DP 1.4a','Система':'300 W'},
   rating:4.4,rv:0,reviews:[],
   desc:'GeForce RTX 3050 6 GB — бюджетна карта с Ray Tracing и DLSS за плавен 1080p гейминг.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38854.png',stock:false},

  {id:3,name:'Palit GeForce RTX 3050 StormX 6GB GDDR6 (Box)',brand:'Palit',cat:'components',subcat:'gpu',
   price:375,old:null,pct:null,badge:null,emoji:'🎮',sku:'NE63050018JE-1072F',ean:'4710562244625',
   specs:{'GPU':'NVIDIA GeForce RTX 3050','Памет':'6 GB GDDR6','CUDA ядра':'2304','Интерфейс':'96-bit','Boost':'1470 MHz','TDP':'70 W','Система':'300 W'},
   rating:4.4,rv:0,reviews:[],
   desc:'RTX 3050 6 GB в кутия — 70 W консумация, поддръжка до 7680×4320 и DLSS за по-висок fps.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50580.png',stock:true},

  {id:4,name:'Palit GeForce RTX 3050 KalmX 6GB GDDR6',brand:'Palit',cat:'components',subcat:'gpu',
   price:333,old:null,pct:null,badge:null,emoji:'🎮',sku:'NE63050018JE-1070H',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 3050','Памет':'6 GB GDDR6','Интерфейс':'96-bit','Boost':'1470 MHz','Слот':'PCI-E 4.0','Размер':'166.3×137×38.3 мм','Охлаждане':'Пасивно'},
   rating:4.5,rv:0,reviews:[],
   desc:'RTX 3050 KalmX — пасивно охлаждане за безшумна работа. Идеален за тих гейминг или HTPC.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38849.png',stock:false},

  {id:5,name:'Palit GeForce RTX 3050 StormX 8GB GDDR6',brand:'Palit',cat:'components',subcat:'gpu',
   price:362,old:null,pct:null,badge:null,emoji:'🎮',sku:'NE63050018P1-1070F',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 3050','Памет':'8 GB GDDR6','Интерфейс':'128-bit','Boost':'1777 MHz','Слот':'PCI-E 4.0','Изходи':'DVI / HDMI 2.1 / DP 1.4a','Система':'550 W'},
   rating:4.4,rv:0,reviews:[],
   desc:'RTX 3050 8 GB — по-широка 128-bit шина и 1777 MHz Boost за 1080p/1440p гейминг.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37411.png',stock:false},

  {id:6,name:'Palit GeForce RTX 3060 Dual 12GB GDDR6',brand:'Palit',cat:'components',subcat:'gpu',
   price:495,old:null,pct:null,badge:null,emoji:'🎮',sku:'NE63060019K9-190AD',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 3060','Памет':'12 GB GDDR6','Интерфейс':'192-bit','Boost':'1837 MHz','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1 / DP 1.4a ×3','Система':'550 W'},
   rating:4.6,rv:0,reviews:[],
   desc:'RTX 3060 Dual 12 GB — отличен избор за 1440p с 12 GB GDDR6, 192-bit шина и Ray Tracing.',
   img:'https://portal.mostbg.com/api/images/imageFileData/30358.png',stock:false},

  {id:7,name:'Palit GeForce RTX 4060 Dual 8GB GDDR6',brand:'Palit',cat:'components',subcat:'gpu',
   price:515,old:null,pct:null,badge:null,emoji:'🎮',sku:'NE64060019P1-1070D',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4060','Памет':'8 GB GDDR6','Интерфейс':'128-bit','Boost':'2460 MHz','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1 / DP 1.4a ×3','Система':'600 W'},
   rating:4.6,rv:0,reviews:[],
   desc:'RTX 4060 Dual — Ada Lovelace архитектура с DLSS 3 и Frame Generation за 1080p/1440p.',
   img:'https://portal.mostbg.com/api/images/imageFileData/35948.png',stock:false},

  {id:8,name:'Palit GeForce RTX 4060 Infinity 2 8GB GDDR6',brand:'Palit',cat:'components',subcat:'gpu',
   price:520,old:null,pct:null,badge:null,emoji:'🎮',sku:'NE64060019P1-1070L',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4060','Памет':'8 GB GDDR6','Интерфейс':'128-bit','Boost':'2460 MHz','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1a / DP 1.4a ×3','Система':'600 W'},
   rating:4.6,rv:0,reviews:[],
   desc:'RTX 4060 Infinity 2 с RGB подсветка — балансирана производителност и стил за 1080p/1440p.',
   img:'https://portal.mostbg.com/api/images/imageFileData/40351.png',stock:false},

  {id:9,name:'Palit GeForce RTX 4060 StormX 8GB GDDR6',brand:'Palit',cat:'components',subcat:'gpu',
   price:512,old:null,pct:null,badge:null,emoji:'🎮',sku:'NE64060019P1-1070F',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4060','Памет':'8 GB GDDR6','CUDA ядра':'3072','Интерфейс':'128-bit','Boost':'2460 MHz','Пропускателност':'272 GB/s','Размер':'169.9×123×38 мм'},
   rating:4.5,rv:0,reviews:[],
   desc:'RTX 4060 StormX — компактен дизайн (169.9 мм) с 3072 CUDA ядра и 272 GB/s памет.',
   img:'https://portal.mostbg.com/api/images/imageFileData/41595.jpeg',stock:false},

  {id:10,name:'Palit GeForce RTX 4060 Ti StormX 8GB GDDR6',brand:'Palit',cat:'components',subcat:'gpu',
   price:672,old:null,pct:null,badge:null,emoji:'🎮',sku:'NE6406T019P1-1060F',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4060 Ti','Памет':'8 GB GDDR6','Интерфейс':'128-bit','Boost':'2535 MHz','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1 / DP 1.4a ×3','Система':'650 W'},
   rating:4.6,rv:0,reviews:[],
   desc:'RTX 4060 Ti StormX 8 GB — компактна мощна карта за 1440p гейминг с 2535 MHz Boost.',
   img:'https://portal.mostbg.com/api/images/imageFileData/35561.png',stock:false},

  {id:11,name:'Palit GeForce RTX 4060 Ti Dual 8GB GDDR6',brand:'Palit',cat:'components',subcat:'gpu',
   price:675,old:null,pct:null,badge:null,emoji:'🎮',sku:'NE6406T019P1-1060D',ean:'4710562243925',
   specs:{'GPU':'NVIDIA GeForce RTX 4060 Ti','Памет':'8 GB GDDR6','Интерфейс':'128-bit','Boost':'2535 MHz','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1 / DP 1.4a ×3','Система':'650 W'},
   rating:4.6,rv:0,reviews:[],
   desc:'RTX 4060 Ti Dual — двоен охладител за тиха 1440p работа. DLSS 3 и Ada Lovelace.',
   img:'https://portal.mostbg.com/api/images/imageFileData/35567.png',stock:false},

  {id:12,name:'Palit GeForce RTX 4060 Ti JetStream 16GB GDDR6',brand:'Palit',cat:'components',subcat:'gpu',
   price:840,old:null,pct:null,badge:null,emoji:'🎮',sku:'NE6406T019T1-1061J',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4060 Ti','Памет':'16 GB GDDR6','Интерфейс':'128-bit','Boost':'2535 MHz','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1a / DP 1.4a ×3','Система':'650 W'},
   rating:4.7,rv:0,reviews:[],
   desc:'RTX 4060 Ti JetStream 16 GB — двойна памет за интензивни workloads и бъдещи AAA заглавия.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37420.png',stock:false},

  {id:13,name:'Palit GeForce RTX 4070 Dual 12GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:933,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED4070019K9-1047D',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4070','Памет':'12 GB GDDR6X','Интерфейс':'192-bit','Boost':'2475 MHz','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1 / DP 1.4a ×3','Система':'750 W'},
   rating:4.7,rv:0,reviews:[],
   desc:'RTX 4070 Dual 12 GB GDDR6X — мощна карта за 4K гейминг с 21 Gbps памет и DLSS 3.',
   img:'https://portal.mostbg.com/api/images/imageFileData/34944.png',stock:false},

  {id:14,name:'Palit GeForce RTX 4070 Dual 12GB GDDR6',brand:'Palit',cat:'components',subcat:'gpu',
   price:940,old:null,pct:null,badge:null,emoji:'🎮',sku:'NE64070019K9-1048D',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4070','Памет':'12 GB GDDR6','CUDA ядра':'5888','Интерфейс':'192-bit','Boost':'2475 MHz','Пропускателност':'480 GB/s','Мощност':'200 W / Система 750 W'},
   rating:4.7,rv:0,reviews:[],
   desc:'RTX 4070 Dual 12 GB GDDR6 — 5888 CUDA ядра, 480 GB/s пропускателност, 200 W консумация.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43043.png',stock:false},

  {id:15,name:'Palit GeForce RTX 4070 JetStream 12GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:998,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED4070019K9-1047J',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4070','Памет':'12 GB GDDR6X','Интерфейс':'192-bit','Boost':'2475 MHz','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1 / DP 1.4a ×3','Система':'750 W'},
   rating:4.8,rv:0,reviews:[],
   desc:'RTX 4070 JetStream — триплен вентилатор за оптимално охлаждане при интензивен 4K гейминг.',
   img:'https://portal.mostbg.com/api/images/imageFileData/34929.png',stock:false},

  {id:16,name:'Palit GeForce RTX 4070 White 12GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:961,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED4070019K9-1047L',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4070','Памет':'12 GB GDDR6X','Интерфейс':'192-bit','Boost':'2475 MHz','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1a / DP 1.4a ×3','Система':'750 W'},
   rating:4.8,rv:0,reviews:[],
   desc:'RTX 4070 White — бял дизайн за бели системни конфигурации. 12 GB GDDR6X за 4K.',
   img:'https://portal.mostbg.com/api/images/imageFileData/40357.png',stock:false},

  {id:17,name:'Palit GeForce RTX 4070 Super Dual 12GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:1025,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED407S019K9-1043D',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4070 Super','Памет':'12 GB GDDR6X','Интерфейс':'192-bit','Boost':'2475 MHz','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1a / DP 1.4a ×3','Система':'750 W'},
   rating:4.8,rv:0,reviews:[],
   desc:'RTX 4070 Super Dual — значително по-бърза от RTX 4070 с 7168 шейдъра и 21 Gbps памет.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38223.png',stock:false},

  {id:18,name:'Palit GeForce RTX 4070 Super JetStream OC 12GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:1205,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED407ST19K9-1043J',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4070 Super','Памет':'12 GB GDDR6X','Интерфейс':'192-bit','Boost':'2640 MHz (OC)','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1a / DP 1.4a ×3','Система':'750 W'},
   rating:4.9,rv:0,reviews:[],
   desc:'RTX 4070 Super JetStream OC — фабрично OC до 2640 MHz за максимален 4K гейминг.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38228.png',stock:false},

  {id:19,name:'Palit GeForce RTX 4070 Super Infinity 3 OC 12GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:1093,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED107ST19K9-1043S',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4070 Super','Памет':'12 GB GDDR6X','CUDA ядра':'7168','Интерфейс':'192-bit','Boost':'2640 MHz','Пропускателност':'504 GB/s','Конектор':'16-pin ×1'},
   rating:4.8,rv:0,reviews:[],
   desc:'RTX 4070 Super Infinity 3 OC — 504 GB/s и DirectX 12 Ultimate за AAA заглавия в 4K.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43694.png',stock:false},

  {id:20,name:'Palit GeForce RTX 4070 Ti Super JetStream OC 16GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:1390,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED47TSS19T2-1043J',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4070 Ti Super','Памет':'16 GB GDDR6X','Интерфейс':'256-bit','Boost':'2640 MHz (OC)','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1a / DP 1.4a ×3','Система':'750 W'},
   rating:4.9,rv:0,reviews:[],
   desc:'RTX 4070 Ti Super JetStream OC — 16 GB, 256-bit шина и OC до 2640 MHz за ентусиасти.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38317.png',stock:false},

  {id:21,name:'Palit GeForce RTX 4070 Ti Super GamingPro 16GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:1501,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED47TS019T2-1043A',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4070 Ti Super','Памет':'16 GB GDDR6X','Интерфейс':'256-bit','Boost':'2610 MHz','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1a / DP 1.4a ×3','Система':'750 W'},
   rating:4.9,rv:0,reviews:[],
   desc:'RTX 4070 Ti Super GamingPro — флагманско охлаждане за 4K 144Hz гейминг без ограничения.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38312.png',stock:false},

  {id:22,name:'Palit GeForce RTX 4070 Ti Super GamingPro OC 16GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:1525,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED47TSH19T2-1043A',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4070 Ti Super','Памет':'16 GB GDDR6X','Интерфейс':'256-bit','Boost':'2670 MHz (OC)','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1a / DP 1.4a ×3','Система':'750 W'},
   rating:4.9,rv:0,reviews:[],
   desc:'RTX 4070 Ti Super GamingPro OC — най-бързият 4070 Ti Super с 2670 MHz Boost честота.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38307.png',stock:false},

  {id:23,name:'Palit GeForce RTX 4080 Super GamingPro 16GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:1904,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED408S019T2-1032A',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4080 Super','Памет':'16 GB GDDR6X','Интерфейс':'256-bit','Boost':'2550 MHz','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1a / DP 1.4a ×3','Система':'850 W'},
   rating:4.9,rv:0,reviews:[],
   desc:'RTX 4080 Super GamingPro — 16 GB GDDR6X, 23 Gbps памет и триплен вентилатор за 4K 144Hz.',
   img:'https://portal.mostbg.com/api/images/imageFileData/39025.png',stock:false},

  {id:24,name:'Palit GeForce RTX 4080 Super GamingPro OC 16GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:1929,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED408ST19T2-1032A',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4080 Super','Памет':'16 GB GDDR6X','Интерфейс':'256-bit','Boost':'2610 MHz (OC)','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1a / DP 1.4a ×3','Система':'850 W'},
   rating:4.9,rv:0,reviews:[],
   desc:'RTX 4080 Super GamingPro OC — фабрично OC до 2610 MHz за максимален 4K гейминг.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38661.png',stock:false},

  {id:25,name:'Palit GeForce RTX 4080 Super JetStream OC 16GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:1825,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED408SS19T2-1032J',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4080 Super','Памет':'16 GB GDDR6X','Интерфейс':'256-bit','Boost':'2580 MHz (OC)','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1a / DP 1.4a ×3','Система':'850 W'},
   rating:4.9,rv:0,reviews:[],
   desc:'RTX 4080 Super JetStream OC — три тихи вентилатора, 2580 MHz Boost за 4K 144Hz.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38666.png',stock:false},

  {id:26,name:'Palit GeForce RTX 4080 Super Infinity 3 OC 16GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:1813,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED408SS19T2-1032S',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4080 Super','Памет':'16 GB GDDR6X','CUDA ядра':'10240','Интерфейс':'256-bit','Boost':'2580 MHz','Пропускателност':'736 GB/s','Мощност':'320 W / Система 850 W'},
   rating:4.9,rv:0,reviews:[],
   desc:'RTX 4080 Super Infinity 3 OC — 10240 CUDA ядра, 736 GB/s памет за ултимативен 4K.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43342.png',stock:false},

  {id:27,name:'Palit GeForce RTX 4090 GameRock 24GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:3095,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED4090019SB-1020G',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4090','Памет':'24 GB GDDR6X','Интерфейс':'384-bit','Boost':'2520 MHz','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1 / DP 1.4a ×3','Размер':'329.4×137.5×71.5 мм'},
   rating:5.0,rv:0,reviews:[],
   desc:'RTX 4090 GameRock 24 GB — абсолютният флагман. 384-bit шина и 24 GB за 8K гейминг.',
   img:'https://portal.mostbg.com/api/images/imageFileData/32467.png',stock:false},

  {id:28,name:'Palit GeForce RTX 4090 GameRock OmniBlack 24GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:3056,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED4090019SB-1020Q',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4090','Памет':'24 GB GDDR6X','Интерфейс':'384-bit','Boost':'2520 MHz','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1a / DP 1.4a ×3','Система':'1000 W'},
   rating:5.0,rv:0,reviews:[],
   desc:'RTX 4090 GameRock OmniBlack — тъмен дизайн без RGB. 24 GB GDDR6X за 8K без компромиси.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37165.png',stock:false},

  {id:29,name:'Palit GeForce RTX 4090 GameRock OC 24GB GDDR6X',brand:'Palit',cat:'components',subcat:'gpu',
   price:3202,old:null,pct:null,badge:null,emoji:'🎮',sku:'NED4090S19SB-1020G',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 4090','Памет':'24 GB GDDR6X','Интерфейс':'384-bit','Boost':'2610 MHz (OC)','Слот':'PCI-E 4.0','Изходи':'HDMI 2.1 / DP 1.4a ×3','Размер':'329.4×137.5×71.5 мм'},
   rating:5.0,rv:0,reviews:[],
   desc:'RTX 4090 GameRock OC — фабрично OC до 2610 MHz. Най-мощната потребителска GPU от NVIDIA.',
   img:'https://portal.mostbg.com/api/images/imageFileData/32220.png',stock:false},

  {id:30,name:'Palit GeForce RTX 5050 Dual 8GB GDDR6',brand:'Palit',cat:'components',subcat:'gpu',
   price:562,old:null,pct:null,badge:'Ново',emoji:'🎮',sku:'NE65050019P1-GB2070D',ean:'4710562245400',
   specs:{'GPU':'NVIDIA GeForce RTX 5050','Памет':'8 GB GDDR6','CUDA ядра':'2560','Интерфейс':'128-bit','Boost':'2572 MHz','Слот':'PCI-E 5.0','Изходи':'HDMI 2.1b / DP 2.1b ×3','TDP':'130 W / Система 550 W'},
   rating:4.6,rv:0,reviews:[],
   desc:'RTX 5050 Dual — Blackwell архитектура с PCI-E 5.0 и DP 2.1b за 4K 480Hz и 8K 120Hz.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48344.png',stock:true},

  {id:31,name:'Palit GeForce RTX 5050 StormX 8GB GDDR6',brand:'Palit',cat:'components',subcat:'gpu',
   price:557,old:null,pct:null,badge:'Ново',emoji:'🎮',sku:'NE650500119P1-GB2070F',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 5050','Памет':'8 GB GDDR6','CUDA ядра':'2560','Интерфейс':'128-bit','Boost':'2572 MHz','Слот':'PCI-E 5.0','Размер':'169.9×118×39.8 мм','TDP':'130 W / Система 550 W'},
   rating:4.6,rv:0,reviews:[],
   desc:'RTX 5050 StormX — компактна Blackwell карта (169.9 мм) за малки кутии. DP 2.1b и PCI-E 5.0.',
   img:null,stock:true},

  {id:32,name:'Palit GeForce RTX 5060 Dual OC 8GB GDDR7',brand:'Palit',cat:'components',subcat:'gpu',
   price:585,old:null,pct:null,badge:'Ново',emoji:'🎮',sku:'NE75060S19P1-GB2063D',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 5060','Памет':'8 GB GDDR7','CUDA ядра':'3840','Интерфейс':'128-bit','Boost':'2535 MHz (OC)','Пропускателност':'448 GB/s','Слот':'PCI-E 5.0','TDP':'145 W / Система 550 W'},
   rating:4.7,rv:0,reviews:[],
   desc:'RTX 5060 Dual OC — GDDR7 с 448 GB/s и Blackwell архитектура за следващо ниво 1440p.',
   img:'https://portal.mostbg.com/api/images/imageFileData/46543.png',stock:false},

  {id:33,name:'Palit GeForce RTX 5060 White OC 8GB GDDR7',brand:'Palit',cat:'components',subcat:'gpu',
   price:642,old:null,pct:null,badge:'Ново',emoji:'🎮',sku:'NE75060U19P1-GB2063M',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 5060','Памет':'8 GB GDDR7','CUDA ядра':'3840','Интерфейс':'128-bit','Boost':'2527 MHz (OC)','Пропускателност':'448 GB/s','Слот':'PCI-E 5.0','TDP':'145 W / Система 550 W'},
   rating:4.7,rv:0,reviews:[],
   desc:'RTX 5060 White OC — бял дизайн с GDDR7 памет и DP 2.1b за максимален refresh rate в 4K.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51546.png',stock:true},

  {id:34,name:'Palit GeForce RTX 5060 Dual 8GB GDDR7',brand:'Palit',cat:'components',subcat:'gpu',
   price:550,old:null,pct:null,badge:'Ново',emoji:'🎮',sku:'NE75060019P1-GB2063D',ean:null,
   specs:{'GPU':'NVIDIA GeForce RTX 5060','Памет':'8 GB GDDR7','CUDA ядра':'3840','Интерфейс':'128-bit','Boost':'2535 MHz','Слот':'PCI-E 5.0','Изходи':'HDMI 2.1b / DP 2.1b ×3','TDP':'145 W / Система 550 W'},
   rating:4.7,rv:0,reviews:[],
   desc:'RTX 5060 Dual — базов Blackwell модел с GDDR7 памет и PCI-E 5.0. Следващото поколение 1440p.',
   img:'https://portal.mostbg.com/api/images/imageFileData/46550.png',stock:false},

  // ── Motherboard Import — 2026-04-20 — categoryId=2 (Most BG) — 15 дънни платки ASROCK AM4 ──
  {id:35,name:'ASRock B450M PRO4 R2.0 / AM4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:114,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B450M PRO4 R2.0',ean:'4717677336276',
   specs:{'Чипсет':'AMD B450','Сокет':'AM4','Форм фактор':'Micro-ATX','Памет':'4× DDR4','SATA':'4× SATA3','M.2':'2×','PCIe':'2× x16 / 1× x1','Изходи':'HDMI / DVI / VGA','Звук':'7.1 HD Audio','LAN':'Gigabit'},
   rating:4.5,rv:0,reviews:[],
   desc:'ASRock B450M PRO4 R2.0 — Micro-ATX дънна платка за AMD Ryzen AM4. 4 слота DDR4, 2× M.2, RAID поддръжка.',
   img:'https://portal.mostbg.com/api/images/imageFileData/28623.png',stock:false},

  {id:36,name:'ASRock B450M-HDV R4.0 / AM4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:86,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B450M-HDV R4.0',ean:'4717677337617',
   specs:{'Чипсет':'AMD B450','Сокет':'AM4','Форм фактор':'Micro-ATX','Памет':'2× DDR4','SATA':'4× SATA3','M.2':'1×','PCIe':'1× x16 / 1× x1','Изходи':'HDMI / DVI / VGA','Звук':'7.1 HD Audio','LAN':'Realtek RTL8111H'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock B450M-HDV R4.0 — компактна и достъпна Micro-ATX платка за AMD Ryzen. Подходяща за офис/бюджетни конфигурации.',
   img:'https://portal.mostbg.com/api/images/imageFileData/23877.png',stock:false},

  {id:37,name:'ASRock B450 PRO4 R2.0 / AM4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:125,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B450 PRO4 R2.0',ean:'4717677336252',
   specs:{'Чипсет':'AMD B450','Сокет':'AM4','Форм фактор':'ATX','Памет':'4× DDR4','SATA':'6× SATA3','M.2':'2×','PCIe':'2× x16 / 4× x1','Изходи':'HDMI / DisplayPort / VGA','Звук':'7.1 HD Audio','LAN':'Gigabit'},
   rating:4.5,rv:0,reviews:[],
   desc:'ASRock B450 PRO4 R2.0 — пълноразмерна ATX платка за AMD Ryzen AM4. 6× SATA3, 2× M.2 и 4× PCIe x1.',
   img:'https://portal.mostbg.com/api/images/imageFileData/26808.png',stock:true},

  {id:38,name:'ASRock A520M-ITX/AC / AM4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:165,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A520M-ITX/AC',ean:'4710483932045',
   specs:{'Чипсет':'AMD A520','Сокет':'AM4','Форм фактор':'Mini-ITX','Памет':'2× DDR4','SATA':'4× SATA3','M.2':'1×','PCIe':'1× x16','Изходи':'HDMI / DisplayPort 1.4','WiFi':'802.11ac','Bluetooth':'4.2'},
   rating:4.5,rv:0,reviews:[],
   desc:'ASRock A520M-ITX/AC — Mini-ITX платка с вграден WiFi и Bluetooth за компактни AMD Ryzen системи.',
   img:'https://portal.mostbg.com/api/images/imageFileData/27491.png',stock:false},

  {id:39,name:'ASRock A520M-HDV / AM4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:91,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A520M-HDV',ean:'4710483932267',
   specs:{'Чипсет':'AMD A520','Сокет':'AM4','Форм фактор':'Micro-ATX','Памет':'2× DDR4','SATA':'4× SATA3','M.2':'1×','PCIe':'1× x16 / 1× x1','Изходи':'HDMI / DVI / VGA','Звук':'7.1 HD Audio','LAN':'Gigabit'},
   rating:4.3,rv:0,reviews:[],
   desc:'ASRock A520M-HDV — бюджетна Micro-ATX платка AM4. Поддържа Ryzen 3000/4000/5000 с 3 видео изхода.',
   img:'https://portal.mostbg.com/api/images/imageFileData/26804.png',stock:false},

  {id:40,name:'ASRock A520M PRO4 / AM4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:125,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A520M PRO4',ean:null,
   specs:{'Чипсет':'AMD A520','Сокет':'AM4','Форм фактор':'Micro-ATX','Памет':'4× DDR4','SATA':'4× SATA3','M.2':'2×','PCIe':'2× x16','Изходи':'HDMI / DisplayPort 1.4 / VGA','Звук':'7.1 HD Audio','PCB':'2oz мед'},
   rating:4.5,rv:0,reviews:[],
   desc:'ASRock A520M PRO4 — 4 слота DDR4, 2× M.2 и качествен 2oz меден PCB за AMD Ryzen на достъпна цена.',
   img:'https://portal.mostbg.com/api/images/imageFileData/26796.png',stock:true},

  {id:41,name:'ASRock A520M-HVS / AM4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:88,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A520M-HVS',ean:'4710483932311',
   specs:{'Чипсет':'AMD A520','Сокет':'AM4','Форм фактор':'Micro-ATX','Памет':'2× DDR4','SATA':'4× SATA3','M.2':'1×','PCIe':'1× x16 / 1× x1','Изходи':'HDMI / VGA','Звук':'7.1 HD Audio','LAN':'Gigabit'},
   rating:4.3,rv:0,reviews:[],
   desc:'ASRock A520M-HVS — най-достъпната Micro-ATX платка за Ryzen. HDMI + VGA, 1× M.2 слот.',
   img:'https://portal.mostbg.com/api/images/imageFileData/26800.png',stock:false},

  {id:42,name:'ASRock B550M-HDV / AM4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:119,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550M-HDV',ean:'4710483931635',
   specs:{'Чипсет':'AMD B550','Сокет':'AM4','Форм фактор':'Micro-ATX','Памет':'2× DDR4','SATA':'4× SATA3','M.2':'1× (Gen4)','PCIe':'1× x16 / 1× x1','Изходи':'HDMI / DVI / VGA','BIOS':'256 MB','Звук':'7.1 HD Audio'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock B550M-HDV — Micro-ATX с PCIe Gen4 M.2 слот за бърз NVMe SSD. Поддържа Ryzen 5000.',
   img:'https://portal.mostbg.com/api/images/imageFileData/26828.png',stock:true},

  {id:43,name:'ASRock B550M Phantom Gaming 4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:144,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550M PHANTOM GAMING 4',ean:'4710483932755',
   specs:{'Чипсет':'AMD B550','Сокет':'AM4','Форм фактор':'Micro-ATX','Памет':'4× DDR4','SATA':'6× SATA3','M.2':'2× (Gen4)','PCIe':'2× x16 / 1× x1','Изходи':'HDMI / DisplayPort 1.4','RGB':'RGB headers','PCB':'2oz мед'},
   rating:4.6,rv:0,reviews:[],
   desc:'ASRock B550M Phantom Gaming 4 — gaming Micro-ATX с 2× Gen4 M.2, RGB хедъри и 6× SATA3.',
   img:'https://portal.mostbg.com/api/images/imageFileData/26824.png',stock:true},

  {id:44,name:'ASRock B550M-ITX/AC / AM4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:204,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550M-ITX/AC',ean:'4710483931727',
   specs:{'Чипсет':'AMD B550','Сокет':'AM4','Форм фактор':'Mini-ITX','Памет':'2× DDR4','SATA':'4× SATA3','M.2':'1× (Gen4)','PCIe':'1× x16','WiFi':'802.11ac','Bluetooth':'4.2','BIOS':'256 MB'},
   rating:4.6,rv:0,reviews:[],
   desc:'ASRock B550M-ITX/AC — Mini-ITX с PCIe Gen4 M.2 и вграден WiFi/BT за компактни Ryzen 5000 билдове.',
   img:'https://portal.mostbg.com/api/images/imageFileData/27511.png',stock:false},

  {id:45,name:'ASRock B550M PRO4 / AM4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:159,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550M PRO4',ean:'4710483931598',
   specs:{'Чипсет':'AMD B550','Сокет':'AM4','Форм фактор':'Micro-ATX','Памет':'4× DDR4','SATA':'6× SATA3','M.2':'2× (Gen4)','PCIe':'2× x16 / 1× x1','USB':'USB 3.2 Gen2','Изходи':'HDMI / DP 1.4 / VGA','PCB':'2oz мед'},
   rating:4.6,rv:0,reviews:[],
   desc:'ASRock B550M PRO4 — пълна Micro-ATX платка с USB 3.2 Gen2, 2× Gen4 M.2 и 6× SATA3.',
   img:'https://portal.mostbg.com/api/images/imageFileData/27892.png',stock:true},

  {id:46,name:'ASRock B550 Phantom Gaming 4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:151,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550 PHANTOM GAMING 4',ean:'4710483931499',
   specs:{'Чипсет':'AMD B550','Сокет':'AM4','Форм фактор':'ATX','Памет':'4× DDR4','SATA':'6× SATA3','M.2':'2× (Gen4)','PCIe':'2× x16 / 2× x1','Изходи':'HDMI','RGB':'RGB headers','WiFi':'Модул'},
   rating:4.6,rv:0,reviews:[],
   desc:'ASRock B550 Phantom Gaming 4 — пълноразмерна ATX gaming платка с WiFi, RGB хедъри и 2× Gen4 M.2.',
   img:'https://portal.mostbg.com/api/images/imageFileData/30153.png',stock:true},

  {id:47,name:'ASRock B550 Phantom Gaming-ITX/AX',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:315,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550 PHANTOM GAMING-ITX/AX',ean:null,
   specs:{'Чипсет':'AMD B550','Сокет':'AM4','Форм фактор':'Mini-ITX','Памет':'2× DDR4','SATA':'4× SATA3','M.2':'2× (Gen4)','PCIe':'1× x16','WiFi':'802.11ax (WiFi 6)','Bluetooth':'5.2','LAN':'2.5G','PCB':'8 слоя'},
   rating:4.8,rv:0,reviews:[],
   desc:'ASRock B550 Phantom Gaming-ITX/AX — Mini-ITX с WiFi 6, 2.5G LAN, 2× Gen4 M.2 и 8-слоен PCB.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29823.png',stock:false},

  {id:48,name:'ASRock B550 PRO4 / AM4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:161,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550 PRO4',ean:'4710483931482',
   specs:{'Чипсет':'AMD B550','Сокет':'AM4','Форм фактор':'ATX','Памет':'4× DDR4','SATA':'6× SATA3','M.2':'2× (Gen4)','PCIe':'2× x16 / 2× x1','USB':'USB 3.2 Gen2','Звук':'7.1 HD Audio','PCB':'2oz мед'},
   rating:4.6,rv:0,reviews:[],
   desc:'ASRock B550 PRO4 — ATX платка с USB 3.2 Gen2, 2× Gen4 M.2 и качествен 2oz меден PCB.',
   img:'https://portal.mostbg.com/api/images/imageFileData/24070.png',stock:true},

  {id:49,name:'ASRock B550 PG Riptide',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:186,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550 PG RIPTIDE',ean:'4710483935190',
   specs:{'Чипсет':'AMD B550','Сокет':'AM4','Форм фактор':'ATX','Памет':'4× DDR4','SATA':'6× SATA3','M.2':'2× (Gen4)','PCIe':'3× x16 / 1× x1','USB':'USB 3.2 Gen2','RGB':'RGB headers','Изходи':'HDMI / DisplayPort'},
   rating:4.7,rv:0,reviews:[],
   desc:'ASRock B550 PG Riptide — gaming ATX с 3× PCIe x16, RGB хедъри и USB 3.2 Gen2 за Ryzen 5000.',
   img:'https://portal.mostbg.com/api/images/imageFileData/40455.png',stock:true},

  // ── Motherboard Import (full) — 2026-04-20 — categoryId=2 — 350 дънни платки ──
  {id:50,name:'ASROCK A620M-HDV/M.2  /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:127,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A620M-HDV/M.2',ean:null,
   specs:{'Памет':'2× DDR5','SATA3':'2×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'Micro-ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK A620M-HDV/M.2  /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/36557.png',stock:false},

  {id:51,name:'ASROCK A620M-HDV/M.2+',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:150,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A620M-HDV/M.2+',ean:null,
   specs:{'Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'Micro-ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK A620M-HDV/M.2+.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43009.png',stock:false},

  {id:52,name:'ASROCK A620M PRO RS',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:173,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A620M PRO RS',ean:null,
   specs:{'Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK A620M PRO RS.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37790.png',stock:false},

  {id:53,name:'ASROCK A620AM-HVS',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:134,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A620AM-HVS',ean:'4711581490819',
   specs:{'Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK A620AM-HVS.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50800.png',stock:false},

  {id:54,name:'ASROCK A620AM PRO-A WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:178,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A620AM PRO-A WIFI',ean:'4711581490970',
   specs:{'Памет':'4× DDR5','SATA3':'2×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK A620AM PRO-A WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48783.png',stock:true},

  {id:55,name:'ASROCK A620AM PRO RS WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:192,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A620AM PRO RS WIFI',ean:null,
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK A620AM PRO RS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48787.png',stock:false},

  {id:56,name:'ASROCK A620AM PRO RS',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:171,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A620AM PRO RS',ean:'4711581490949',
   specs:{'Памет':'4× DDR5','SATA3':'2×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK A620AM PRO RS.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50528.png',stock:true},

  {id:57,name:'ASROCK B650 PRO RS /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:265,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650 PRO RS',ean:'4710483940750',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DVI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B650 PRO RS /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/32593.png',stock:true},

  {id:58,name:'ASROCK B650M-HDV/M.2 /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:177,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650M-HDV/M.2',ean:null,
   specs:{'Чипсет':'AMD/Intel B650','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'Micro-ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B650M-HDV/M.2 /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/34973.png',stock:true},

  {id:59,name:'ASROCK B650M-H/M.2+ /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:149,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650M-H/M.2+',ean:'4710483943768',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'Micro-ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B650M-H/M.2+ /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37845.png',stock:false},

  {id:60,name:'ASROCK B650M PG RIPTIDE /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:264,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650M PG RIPTIDE',ean:null,
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B650M PG RIPTIDE /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/34966.png',stock:false},

  {id:61,name:'ASROCK B650M PG LIGHTNING',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:185,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650M PG LIGHTING',ean:'4710483943829',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B650M PG LIGHTNING.',
   img:'https://portal.mostbg.com/api/images/imageFileData/40460.png',stock:true},

  {id:62,name:'ASROCK B650M PRO RS /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:221,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650M PRO RS',ean:'4710483943096',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B650M PRO RS /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/36566.png',stock:true},

  {id:63,name:'ASROCK B650 PG LIGHTNING /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:238,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650 PG LIGHTNING',ean:'4710483940910',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B650 PG LIGHTNING /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/32598.png',stock:true},

  {id:64,name:'ASROCK B650 STEEL LEGEND WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:309,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650 STEEL LEGEND WIFI',ean:'4710483944598',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B650 STEEL LEGEND WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/41466.jpeg',stock:false},

  {id:65,name:'ASROCK B650I LIGHTNING WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:274,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650I LIGHTNING WIFI',ean:'4710483944253',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'2× DDR5','SATA3':'2×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B650I LIGHTNING WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42131.png',stock:false},

  {id:66,name:'ASROCK B850M STEEL LEGEND WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:279,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850M STEEL LEGEND WIFI',ean:'4711581490499',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850M STEEL LEGEND WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44587.png',stock:true},

  {id:67,name:'ASROCK B850M PRO-A /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:197,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850M PRO-A',ean:'4711581490390',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850M PRO-A /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44591.png',stock:false},

  {id:68,name:'ASROCK B850M PRO-A WIFI /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:217,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850M PRO-A WIFI',ean:'4711581490376',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850M PRO-A WIFI /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/46024.png',stock:false},

  {id:69,name:'ASROCK B850M PRO RS',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:222,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850M PRO RS',ean:'4711581490345',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850M PRO RS.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45004.png',stock:false},

  {id:70,name:'ASROCK B850M-X WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:210,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850M-X WIFI',ean:null,
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850M-X WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45406.png',stock:false},

  {id:71,name:'ASROCK B850M-X R2.0',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:192,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850M-X R2.0',ean:'4711581490758',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850M-X R2.0.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47011.png',stock:false},

  {id:72,name:'ASROCK B850M-X WIFI R2.0 /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:212,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850M-X WIFI R2.0',ean:null,
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850M-X WIFI R2.0 /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/46028.png',stock:false},

  {id:73,name:'ASROCK B850M PRO RS WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:233,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850M PRO RS WIFI',ean:'4711581490352',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850M PRO RS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45008.png',stock:false},

  {id:74,name:'ASROCK B850M RIPTIDE WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:283,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850M RIPTIDE WIFI',ean:'4711581490482',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850M RIPTIDE WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/46032.png',stock:false},

  {id:75,name:'ASROCK B850 RIPTIDE WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:361,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850 RIPTIDE WIFI',ean:'4711581490079',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850 RIPTIDE WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48791.png',stock:true},

  {id:76,name:'ASROCK B850 PRO RS /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:273,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850 PRO RS',ean:'4711581490161',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'1×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850 PRO RS /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44595.png',stock:false},

  {id:77,name:'ASROCK B850 PRO-A',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:281,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850 PRO-A',ean:null,
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850 PRO-A.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47015.png',stock:false},

  {id:78,name:'ASROCK B850 PRO RS WIFI /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:302,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850 PRO RS WIFI',ean:'4711581490178',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'1×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850 PRO RS WIFI /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44599.png',stock:false},

  {id:79,name:'ASROCK B850 PRO-A WIFI /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:277,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850 PRO-A WIFI',ean:'4711581490192',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850 PRO-A WIFI /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45545.png',stock:true},

  {id:80,name:'ASROCK B850 STEEL LEGEND WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:348,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850 STEEL LEGEND WIFI',ean:'4711581490062',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850 STEEL LEGEND WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45410.png',stock:true},

  {id:81,name:'ASROCK B850 LIVEMIXER WIFI AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:329,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850 LIVEMIXER WIFI',ean:'4711581490154',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B850 LIVEMIXER WIFI AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50532.png',stock:false},

  {id:82,name:'ASROCK X870 STEEL LEGEND WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:420,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870 STEEL LEGEND WIFI',ean:'4710483949340',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK X870 STEEL LEGEND WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43014.png',stock:true},

  {id:83,name:'ASROCK X870 PRO-A WIFI /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:344,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870 PRO-A WIFI',ean:'4710483942310',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK X870 PRO-A WIFI /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48300.png',stock:true},

  {id:84,name:'ASROCK X870 PRO RS',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:350,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870 PRO RS',ean:'4710483949333',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK X870 PRO RS.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43699.png',stock:true},

  {id:85,name:'ASROCK X870 PRO RS WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:378,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870 PRO RS WIFI',ean:'4710483949333',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK X870 PRO RS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43019.png',stock:true},

  {id:86,name:'ASROCK X870 RIPTIDE WIFI / AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:469,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870 RIPTIDE WIFI',ean:'4710483949357',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK X870 RIPTIDE WIFI / AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50536.png',stock:false},

  {id:87,name:'ASROCK X870E TAICHI /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:777,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870E TAICHI',ean:'4710483947421',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'6×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK X870E TAICHI /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/46036.png',stock:true},

  {id:88,name:'ASROCK X870E NOVA WIFI /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:583,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870E NOVA WIFI',ean:'4710483949654',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK X870E NOVA WIFI /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48304.png',stock:false},

  {id:89,name:'ASROCK X870 NOVA WIFI /AM5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:504,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870 NOVA WIFI',ean:'4710483949654',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK X870 NOVA WIFI /AM5.',
   img:null,stock:false},

  {id:90,name:'ASROCK H610M-HVS/M.2 R2.0/DDR4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:102,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H610M-HVS/M.2 R2.0',ean:'4710483939914',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR4','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'Micro-ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK H610M-HVS/M.2 R2.0/DDR4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33033.png',stock:true},

  {id:91,name:'ASROCK H610M-H2/M.2 D5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:106,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H610M-H2/M.2 D5',ean:'4710483943775',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR5','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Форм фактор':'Micro-ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK H610M-H2/M.2 D5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38279.png',stock:true},

  {id:92,name:'ASROCK H610M-H2/M.2  /DDR4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:102,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H610M-H2/M.2',ean:'4710483943775',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR4','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Форм фактор':'Micro-ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK H610M-H2/M.2  /DDR4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43024.png',stock:true},

  {id:93,name:'ASROCK H610M-HDV/M.2+ D5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:111,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H610M-HDV/M.2+ D5',ean:'4710483943478',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR5','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'Micro-ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK H610M-HDV/M.2+ D5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37849.png',stock:true},

  {id:94,name:'ASROCK H610M-HDV/M.2 R2.0/DDR4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:108,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H610M-HDV/M.2 R2.0',ean:null,
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR4','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'Micro-ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK H610M-HDV/M.2 R2.0/DDR4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37365.png',stock:true},

  {id:95,name:'ASROCK H510M-H2/M.2 SE /1200',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:98,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H510M-H2/M.2 SE',ean:'4710483944192',
   specs:{'Чипсет':'AMD/Intel H510','Памет':'2× DDR4','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Форм фактор':'Micro-ATX','Сокет':'LGA1200'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK H510M-H2/M.2 SE /1200.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38274.png',stock:false},

  {id:96,name:'ASROCK H510M-HDV/M.2 SE /1200',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:100,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H510M-HDV/M.2 SE',ean:'4710483943126',
   specs:{'Чипсет':'AMD/Intel H510','Памет':'2× DDR4','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DVI / VGA','Форм фактор':'Micro-ATX','Сокет':'LGA1200'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK H510M-HDV/M.2 SE /1200.',
   img:'https://portal.mostbg.com/api/images/imageFileData/36604.png',stock:false},

  {id:97,name:'ASROCK B760M-HDV/M.2 D4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:137,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M-HDV/M.2 D4',ean:'4710483942020',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'2× DDR4','SATA3':'4×SATA3','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'Micro-ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B760M-HDV/M.2 D4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33523.png',stock:false},

  {id:98,name:'ASROCK B760M-HDV/M.2',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:151,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M-HDV/M.2',ean:'4710483943485',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'Micro-ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B760M-HDV/M.2.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38269.png',stock:true},

  {id:99,name:'ASROCK B760M-H2/M.2 /D5/1700',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:149,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M-H2/M.2',ean:'4710483944215',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'2× DDR5','SATA3':'4×SATA3','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Форм фактор':'Micro-ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B760M-H2/M.2 /D5/1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38264.png',stock:true},

  {id:100,name:'ASROCK B760M-X GEN5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:154,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M-X GEN5',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B760M-X GEN5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51897.png',stock:true},

  {id:101,name:'ASROCK B760M PRO RS',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:202,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M PRO RS',ean:'4710483942723',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B760M PRO RS.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38259.png',stock:true},

  {id:102,name:'ASROCK B760 PRO RS /D5/LGA1700',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:202,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760 PRO RS',ean:'4710483942044',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B760 PRO RS /D5/LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33507.png',stock:true},

  {id:103,name:'ASROCK B760 PRO RS/D4',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:186,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760 PRO RS/D4',ean:'4710483942075',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B760 PRO RS/D4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/40465.png',stock:false},

  {id:104,name:'ASROCK B760M STEEL LEGEND WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:257,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M STEEL LEGEND WIFI',ean:'4710483941795',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B760M STEEL LEGEND WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33518.png',stock:true},

  {id:105,name:'ASROCK Z790 PG LIGHTNING/D5',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:258,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z790 PG LIGHTNING',ean:'4710483940965',
   specs:{'Чипсет':'AMD/Intel Z790','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'2×PCIEx16','PCIe x1':'3xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK Z790 PG LIGHTNING/D5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33047.png',stock:true},

  {id:106,name:'ASROCK Z790 PRO RS',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:317,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z790 PRO RS',ean:'4710483940767',
   specs:{'Чипсет':'AMD/Intel Z790','Памет':'4× DDR5','SATA3':'8×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK Z790 PRO RS.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37854.png',stock:true},

  {id:107,name:'ASROCK H810M-H',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:142,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H810M-H',ean:'4711581490833',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR5','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK H810M-H.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47019.png',stock:false},

  {id:108,name:'ASROCK Z790 STEEL LEGEND WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:413,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z790 STEEL LEGEND WIFI',ean:null,
   specs:{'Чипсет':'AMD/Intel Z790','Памет':'4× DDR5','SATA3':'6×SATA3','RAID':'Да','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK Z790 STEEL LEGEND WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/36622.png',stock:false},

  {id:109,name:'ASROCK B860 PRO RS WIFI /1851',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:270,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860 PRO RS WIFI',ean:'4711581490239',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860 PRO RS WIFI /1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44603.png',stock:false},

  {id:110,name:'ASROCK B860M-H2',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:181,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M-H2',ean:'4711581490437',
   specs:{'Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860M-H2.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49879.png',stock:false},

  {id:111,name:'ASROCK B860M PRO RS',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:235,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M PRO RS',ean:'4711581490277',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860M PRO RS.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45012.png',stock:false},

  {id:112,name:'ASROCK B860M PRO RS WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:267,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M PRO RS WIFI',ean:'4711581490284',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860M PRO RS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48799.png',stock:true},

  {id:113,name:'ASROCK B860M PRO-A',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:224,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M PRO-A',ean:'4711581490291',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860M PRO-A.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49883.png',stock:false},

  {id:114,name:'ASROCK B860M PRO-A WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:240,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M PRO-A WIFI',ean:'4711581490307',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860M PRO-A WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48309.png',stock:true},

  {id:115,name:'ASROCK B860M STEEL LEGEND WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:300,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M STEEL LEGEND WIFI',ean:'4711581490215',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'1×PCIEx16','WiFi':'WiFi','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860M STEEL LEGEND WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44607.png',stock:true},

  {id:116,name:'ASROCK B860M-X /LGA1851',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:195,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M-X',ean:null,
   specs:{'Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860M-X /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/46040.png',stock:false},

  {id:117,name:'ASROCK B860M-X WIFI /LGA1851',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:223,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M-X WIFI',ean:'4711581490413',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860M-X WIFI /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48313.png',stock:false},

  {id:118,name:'ASROCK B860 PRO RS /LGA1851',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:249,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860 PRO RS',ean:'4711581490222',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860 PRO RS /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44611.png',stock:true},

  {id:119,name:'ASROCK B860 LIVEMIXER WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:327,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860 LIVEMIXER WIFI',ean:'4711581490147',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860 LIVEMIXER WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50540.png',stock:true},

  {id:120,name:'ASROCK B860 STEEL LEGEND WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:339,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860 STEEL LEGEND WIFI',ean:'4711581490123',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'1×PCIEx16','WiFi':'WiFi','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860 STEEL LEGEND WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44615.png',stock:true},

  {id:121,name:'ASROCK B860 PRO-A /LGA1851',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:239,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860 PRO-A',ean:'4711581490246',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860 PRO-A /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44619.png',stock:true},

  {id:122,name:'ASROCK B860 PRO-A WIFI/LGA1851',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:256,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860 PRO-A WIFI',ean:'4711581490253',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860 PRO-A WIFI/LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48317.png',stock:false},

  {id:123,name:'ASROCK B860M LIGHTNING WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:298,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M LIGHTNING WIFI',ean:'4711581490208',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'1×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860M LIGHTNING WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45016.png',stock:true},

  {id:124,name:'ASROCK B860 LIGHTNING WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:355,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860 LIGHTNING WIFI',ean:'4711581490116',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK B860 LIGHTNING WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45020.png',stock:true},

  {id:125,name:'ASROCK Z890 PRO-A',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:307,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890 PRO-A',ean:'4710483947537',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'1×PCIEx16','PCIe x1':'3xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK Z890 PRO-A.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43028.png',stock:true},

  {id:126,name:'ASROCK Z890 PRO-A WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:323,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890 PRO-A WIFI',ean:'4710483947544',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'1×PCIEx16','PCIe x1':'3xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK Z890 PRO-A WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45309.png',stock:true},

  {id:127,name:'ASROCK Z890 STEEL LEGEND WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:441,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890 STEEL LEGEND WIFI',ean:'4710483947520',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK Z890 STEEL LEGEND WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43032.png',stock:false},

  {id:128,name:'ASROCK Z890 PRO RS WIFI WHITE',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:397,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890 PRO RS WIFI WHITE',ean:'4710483947476',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'1×PCIEx16','PCIe x1':'3xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK Z890 PRO RS WIFI WHITE.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43703.png',stock:true},

  {id:129,name:'ASROCK Z890 LIGHTNING WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:458,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890 LIGHTNING WIFI',ean:'4710483947513',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK Z890 LIGHTNING WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48321.png',stock:true},

  {id:130,name:'ASROCK Z890M RIPTIDE WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:426,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890M RIPTIDE WIFI',ean:'4710483949722',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','LAN':'Gigabit','PCIe x16':'1×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK Z890M RIPTIDE WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50544.png',stock:true},

  {id:131,name:'ASROCK Z890 NOVA WIFI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:615,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890 NOVA WIFI',ean:'4710483949708',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','LAN':'Gigabit','PCIe x1':'2xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK Z890 NOVA WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49887.png',stock:true},

  {id:132,name:'ASROCK Z890 TAICHI',brand:'ASRock',cat:'components',subcat:'motherboard',
   price:743,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890 TAICHI',ean:'4710483949685',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','LAN':'Gigabit','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASRock дънна платка ASROCK Z890 TAICHI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48325.png',stock:true},

  {id:133,name:'GB A520M K V2 / AM4',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:94,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A520M K V2 1.1',ean:'4719331852771',
   specs:{'Чипсет':'AMD/Intel A520','Памет':'2× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB A520M K V2 / AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/35537.png',stock:true},

  {id:134,name:'GB A520M S2H / AM4',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:100,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A520M S2H 1.3',ean:null,
   specs:{'Чипсет':'AMD/Intel A520','Памет':'2× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DVI / VGA','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB A520M S2H / AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/24992.png',stock:false},

  {id:135,name:'GB A520M DS3H V2',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:106,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A520M DS3H V2 1.0',ean:'4719331854690',
   specs:{'Чипсет':'AMD/Intel A520','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB A520M DS3H V2.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38583.jpeg',stock:true},

  {id:136,name:'GB B550M K /AM4',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:132,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550M K 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B550M K /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/35540.jpeg',stock:true},

  {id:137,name:'GB B550M DS3H /AM4',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:141,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550M DS3H 1.7',ean:'04719331809416',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DVI','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B550M DS3H /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/25012.png',stock:false},

  {id:138,name:'GB B550M DS3H AC R2 / AM4',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:172,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550M DS3H AC R2 1.0',ean:'4719331810962',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DVI','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B550M DS3H AC R2 / AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47963.png',stock:true},

  {id:139,name:'GB B550M AORUS ELITE  /AM4',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:167,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550M AORUS ELITE 1.3',ean:null,
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DVI','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B550M AORUS ELITE  /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/26480.png',stock:false},

  {id:140,name:'GB B550 GAMING X V2 1.3 /AM4',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:176,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550 GAMING X V2 1.3',ean:'4719331810702',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'6×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DVI','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B550 GAMING X V2 1.3 /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29848.png',stock:false},

  {id:141,name:'GB B550 EAGLE WIFI6',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:197,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550 EAGLE WIFI6 1.0',ean:'4719331868406',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','Изходи':'HDMI / DVI','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B550 EAGLE WIFI6.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45062.png',stock:true},

  {id:142,name:'GB B550 EAGLE / AM4',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:166,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B550 EAGLE 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','Изходи':'HDMI / DVI','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B550 EAGLE / AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49280.png',stock:true},

  {id:143,name:'GB A620M H / AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:149,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A620M H 1.2',ean:null,
   specs:{'Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB A620M H / AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/39843.jpeg',stock:false},

  {id:144,name:'GB A620I AX / AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:222,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A620I AX 2.0',ean:'4719331855826',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB A620I AX / AM5.',
   img:null,stock:true},

  {id:145,name:'GB A620M DS3H / AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:156,old:null,pct:null,badge:null,emoji:'⚙️',sku:'A620M DS3H 1.0',ean:null,
   specs:{'Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB A620M DS3H / AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37639.png',stock:false},

  {id:146,name:'GB B650 EAGLE AX /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:262,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650 EAGLE AX 1.1',ean:'4719331860158',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B650 EAGLE AX /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38595.jpeg',stock:true},

  {id:147,name:'GB B650 UD AX / AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:235,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650 UD AX 1.0 Y1',ean:null,
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B650 UD AX / AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47967.png',stock:false},

  {id:148,name:'GB B650 EAGLE /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:212,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650 EAGLE 1.2',ean:'4719331863081',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B650 EAGLE /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42720.png',stock:true},

  {id:149,name:'GB B650 AORU ELITE AX V2 / AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:311,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650 AORUS ELITE AX V2 1.1',ean:null,
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B650 AORU ELITE AX V2 / AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47971.png',stock:false},

  {id:150,name:'GB B650 GAMING X AX V2 /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:264,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650 GAMING X AX V2 1.2',ean:'4719331860073',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B650 GAMING X AX V2 /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42793.png',stock:true},

  {id:151,name:'GB B650M GAMING PLUS WF /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:242,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650M GAMING PLUS WF 1.3',ean:null,
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B650M GAMING PLUS WF /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47975.png',stock:true},

  {id:152,name:'GB B650M GAMING WIFI6E / AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:200,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650M GAMING WIFI6E 1.4',ean:null,
   specs:{'Чипсет':'AMD/Intel B650','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B650M GAMING WIFI6E / AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50867.png',stock:true},

  {id:153,name:'GB B650M D3HP AX /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:230,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650M D3HP AX  1.2',ean:null,
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B650M D3HP AX /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38600.jpeg',stock:true},

  {id:154,name:'GB B650M D3HP /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:181,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650M D3HP 1.3',ean:'4719331857851',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B650M D3HP /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/39857.jpeg',stock:true},

  {id:155,name:'GB B650M S2H /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:168,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650M S2H 1.4',ean:'4719331856298',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B650M S2H /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37664.jpeg',stock:true},

  {id:156,name:'GB B650E EAGLE WF6E',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:297,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650E EAGLE WF6E 1.0',ean:'4719331877798',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B650E EAGLE WF6E.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50811.png',stock:true},

  {id:157,name:'GB B650M AORUS ELITE /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:262,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650M AORUS ELITE 1.3',ean:null,
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B650M AORUS ELITE /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49284.png',stock:false},

  {id:158,name:'GB B650M AOR ELITE AX ICE /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:298,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650M AORUS ELITE AX ICE 1.1',ean:null,
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B650M AOR ELITE AX ICE /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49143.png',stock:false},

  {id:159,name:'GB X670E AORUS MASTER / AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:655,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X670E AORUS MASTER  1.1',ean:null,
   specs:{'Чипсет':'AMD/Intel X670','Памет':'4× DDR5','SATA3':'6×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB X670E AORUS MASTER / AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/32445.png',stock:false},

  {id:160,name:'GB B650E A STAEALTH ICE / AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:483,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B650E A STAEALTH ICE 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B650E A STAEALTH ICE / AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47978.png',stock:false},

  {id:161,name:'GB B840 EAGLE WF6E',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:255,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B840 EAGLE WF6E 1.0',ean:'4719331876975',
   specs:{'Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B840 EAGLE WF6E.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50815.png',stock:true},

  {id:162,name:'GB B840M DS3H / AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:209,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B840M DS3H 1.2',ean:'4719331868437',
   specs:{'Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B840M DS3H / AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47983.png',stock:true},

  {id:163,name:'GB B840M DS3H WF6 / AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:240,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B840M DS3H WF6 1.1',ean:null,
   specs:{'Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B840M DS3H WF6 / AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50871.png',stock:true},

  {id:164,name:'GB B850M D3HP /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:230,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850M D3HP 1.2',ean:null,
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B850M D3HP /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44533.png',stock:true},

  {id:165,name:'GB B850M DS3H /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:247,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850M DS3H 1.2',ean:'4719331866518',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B850M DS3H /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45066.png',stock:true},

  {id:166,name:'GB B850M GAMING X WF6E',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:314,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850M GAMING X WF6E 1.0',ean:'4719331866433',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B850M GAMING X WF6E.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45070.png',stock:false},

  {id:167,name:'GB B850M EAGLE WF6E',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:286,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850M EAGLE WF6E',ean:null,
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B850M EAGLE WF6E.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52002.png',stock:true},

  {id:168,name:'GB B850M AORUS ELITE WF6E ICE',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:332,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850M AORUS ELITE WF6E ICE',ean:null,
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','Изходи':'DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B850M AORUS ELITE WF6E ICE.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52006.png',stock:true},

  {id:169,name:'GB B850 GAMING WF6 /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:284,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850 GAMING WF6 1.0',ean:'4719331866631',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B850 GAMING WF6 /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44537.png',stock:true},

  {id:170,name:'GB B850 EAGLE ICE',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:287,old:null,pct:null,badge:null,emoji:'⚙️',sku:'GB B850 EAGLE ICE 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B850 EAGLE ICE.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52011.png',stock:true},

  {id:171,name:'GB B850 EAGLE WIFI6E /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:281,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850 EAGLE WIFI6E 1.0',ean:'4719331866587',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B850 EAGLE WIFI6E /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44541.png',stock:true},

  {id:172,name:'GB B850 GAMING X WIFI6E /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:347,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850 GAMING X WIFI6E 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B850 GAMING X WIFI6E /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44545.png',stock:true},

  {id:173,name:'GB B850 AOR ELITE WF7 ICE /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:381,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850 AORUS ELITE WF7 ICE 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B850 AOR ELITE WF7 ICE /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44549.png',stock:false},

  {id:174,name:'GB B850 EAGLE WF7 ICE',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:332,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850 EAGLE WF7 ICE 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B850 EAGLE WF7 ICE.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47987.png',stock:true},

  {id:175,name:'GB B850 AORUS ELITE WF7 /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:388,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B850 AORUS ELITE WF7  1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B850 AORUS ELITE WF7 /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44553.png',stock:false},

  {id:176,name:'GB X870 GAMING WF6 /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:337,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870 GAMING WF6 1.0',ean:'4719331865399',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB X870 GAMING WF6 /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43473.png',stock:true},

  {id:177,name:'GB X870 GAMING X WIFI7',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:453,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870 GAMING X WIFI7 1.1',ean:'4719331865368',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB X870 GAMING X WIFI7.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45075.png',stock:true},

  {id:178,name:'GB X870 EAGLE WIFI7 /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:393,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870 EAGLE WIFI7 1.1',ean:'4719331864996',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB X870 EAGLE WIFI7 /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42796.png',stock:true},

  {id:179,name:'GB X870 AORUS ELITE WIFI7 /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:492,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870 AORUS ELITE WIFI7 1.1',ean:'4719331864811',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB X870 AORUS ELITE WIFI7 /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43477.png',stock:false},

  {id:180,name:'GB X870 A ELITE WIFI7 ICE /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:490,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870 A ELITE WIFI7 ICE 1.2',ean:'4719331864682',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB X870 A ELITE WIFI7 ICE /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52055.png',stock:false},

  {id:181,name:'GB X870E EAGLE X3D WF7 / AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:530,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870E EAGLE X WF7',ean:null,
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB X870E EAGLE X3D WF7 / AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52015.png',stock:true},

  {id:182,name:'GB X870E AORUS PRO ICE /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:585,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870E AORUS PRO ICE 1.0',ean:'4719331864798',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB X870E AORUS PRO ICE /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42799.png',stock:false},

  {id:183,name:'GB X870E AORUS PRO X3D ICE',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:657,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870E A PRO X  ICE 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB X870E AORUS PRO X3D ICE.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50928.png',stock:false},

  {id:184,name:'GB X870E AORUS PRO',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:590,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870E AORUS PRO 1.1',ean:'4719331864866',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB X870E AORUS PRO.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45079.png',stock:false},

  {id:185,name:'GB X870E AORUS PRO X3D',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:688,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870E AORUS PRO X 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB X870E AORUS PRO X3D.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52019.png',stock:false},

  {id:186,name:'GB X870E AORUS MASTER /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:832,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870E AORUS MASTER 1.0',ean:'4719331864354',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB X870E AORUS MASTER /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42804.png',stock:true},

  {id:187,name:'GB X870E AORU ELITE WIFI7 /AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:541,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870E AORUS ELITE WIFI7 1.2',ean:'4719331864613',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB X870E AORU ELITE WIFI7 /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44557.png',stock:true},

  {id:188,name:'GB X870E A ELITE WF7 ICE/AM5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:542,old:null,pct:null,badge:null,emoji:'⚙️',sku:'X870E AORUS ELITE WF7 ICE 1.2',ean:null,
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB X870E A ELITE WF7 ICE/AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49148.png',stock:false},

  {id:189,name:'GB H510M S2H V3 /LGA1200',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:97,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H510M S2H V3  1.0',ean:null,
   specs:{'Памет':'4× DDR4','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DVI / VGA','Форм фактор':'ATX','Сокет':'LGA1200'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB H510M S2H V3 /LGA1200.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38613.png',stock:false},

  {id:190,name:'GB H610M H V2 /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:114,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H610M H V2 1.0',ean:'4719331859985',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR5','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB H610M H V2 /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43482.png',stock:false},

  {id:191,name:'GB H610M H V3 DDR4 /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:106,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H610M H V3 DDR4 1.0',ean:'4719331859718',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR4','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB H610M H V3 DDR4 /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/39865.jpeg',stock:false},

  {id:192,name:'GB H610M S2H V2 /DDR5 /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:124,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H610M S2H V2 1.0',ean:'4719331859817',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR5','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB H610M S2H V2 /DDR5 /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42810.png',stock:false},

  {id:193,name:'GB H610M S2H V3 DDR4 /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:113,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H610M S2H V3 DDR4  1.0',ean:'4719331859732',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR4','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB H610M S2H V3 DDR4 /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38617.png',stock:false},

  {id:194,name:'GB H610M K DDR4 / LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:101,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H610M K DDR4  2.0',ean:'4719331851675',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR4','SATA3':'2×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB H610M K DDR4 / LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37645.jpeg',stock:true},

  {id:195,name:'GB H610M GAMING WIFI DDR4',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:152,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H610M GAMING WIFI DDR4 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR4','SATA3':'4×SATA3','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB H610M GAMING WIFI DDR4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47991.png',stock:false},

  {id:196,name:'GB B760M H DDR4 / LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:143,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M H DDR4  1.0',ean:'4719331854645',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'2× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760M H DDR4 / LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/39861.jpeg',stock:true},

  {id:197,name:'GB B760M H V2 / LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:161,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M H V2 1.0',ean:'4719331854645',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760M H V2 / LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50875.png',stock:true},

  {id:198,name:'GB B760M GAMING X AX /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:232,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M GAMING X AX  1.1',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760M GAMING X AX /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38610.png',stock:false},

  {id:199,name:'GB B760M GAMING DDR4 / LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:162,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M GAMING DDR4 1.1',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'2× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760M GAMING DDR4 / LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33767.png',stock:false},

  {id:200,name:'GB B760M GAMING PLUS WIFI DDR4',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:202,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M GAMING PLUS WIFI DDR4 1.',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760M GAMING PLUS WIFI DDR4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47995.png',stock:false},

  {id:201,name:'GB B760M AORUS ELITE WF6E GEN5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:295,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M AORUS ELITE WF6E GEN5',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760M AORUS ELITE WF6E GEN5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49288.png',stock:true},

  {id:202,name:'GB B760 GAMING X AX /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:250,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760 GAMING X AX  1.3',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760 GAMING X AX /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/34863.png',stock:false},

  {id:203,name:'GB B760 GAMING X / LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:236,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760 GAMING X  1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760 GAMING X / LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/34026.png',stock:false},

  {id:204,name:'GB B760 GAMING X GEN5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:234,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760 GAMING X GEN5',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760 GAMING X GEN5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52025.png',stock:true},

  {id:205,name:'GB B760 GAMING X WF6E GEN5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:270,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760 G X WF6E GEN5 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760 GAMING X WF6E GEN5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49292.png',stock:true},

  {id:206,name:'GB B760 GAMING X D4 GEN5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:222,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760 GAMING X D4 GEN5 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760 GAMING X D4 GEN5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50879.png',stock:false},

  {id:207,name:'GB B760 GAMING X DDR4 /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:213,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760 GAMING X DDR4 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760 GAMING X DDR4 /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37673.png',stock:false},

  {id:208,name:'GB B760 DS3H DDR4 /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:189,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760 DS3H DDR4 1.0',ean:'4719331850999',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760 DS3H DDR4 /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33750.png',stock:false},

  {id:209,name:'GB B760 DS3H /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:210,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760 DS3H 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760 DS3H /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/34682.png',stock:false},

  {id:210,name:'GB B760 DS3H GEN5 /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:213,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760 DS3H GEN5 1.0',ean:'4719331872892',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760 DS3H GEN5 /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49296.png',stock:true},

  {id:211,name:'GB B760 DS3H WF6E GEN5/LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:242,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760 DS3H WF6E GEN5 1.0',ean:'4719331872939',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760 DS3H WF6E GEN5/LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50883.png',stock:true},

  {id:212,name:'GB B760 DS3H AX/LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:236,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760 DS3H AX 1.1',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760 DS3H AX/LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38605.png',stock:false},

  {id:213,name:'GB B760 DS3H AX DDR4 /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:217,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760 DS3H AX DDR4  1.2',ean:'4719331850999',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760 DS3H AX DDR4 /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43485.png',stock:false},

  {id:214,name:'GB B760M DS3H DDR4 /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:171,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M DS3H DDR4 1.0',ean:'4719331850876',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760M DS3H DDR4 /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33764.png',stock:true},

  {id:215,name:'GB B760M DS3H AX /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:201,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M DS3H AX 1.3',ean:null,
   specs:{'Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760M DS3H AX /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42814.png',stock:false},

  {id:216,name:'GB B760M DS3H / LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:200,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M DS3H  1.0',ean:'4719331851736',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760M DS3H / LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38608.png',stock:false},

  {id:217,name:'GB B760M DS3H GEN5 / LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:194,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M DS3H GEN5 1.0',ean:'4719331872793',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760M DS3H GEN5 / LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49300.png',stock:true},

  {id:218,name:'GB B760M DS3H WF6E GEN5',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:234,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M DS3H WF6E GEN5 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760M DS3H WF6E GEN5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50887.png',stock:true},

  {id:219,name:'GB B760M D3HP DDR4  /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:161,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M D3HP DDR4 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760M D3HP DDR4  /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42817.png',stock:true},

  {id:220,name:'GB B760M D3HP  /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:178,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M D3HP 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760M D3HP  /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42820.png',stock:true},

  {id:221,name:'GB B760M D3HP WIFI6',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:194,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B760M D3HP WIFI6 1.0',ean:'4719331867638',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B760M D3HP WIFI6.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45084.png',stock:true},

  {id:222,name:'GB Z790 D / LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:267,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z790 D 1.2',ean:null,
   specs:{'Чипсет':'AMD/Intel Z790','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB Z790 D / LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/39881.jpeg',stock:true},

  {id:223,name:'GB Z790 EAGLE AX /LGA1700',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:315,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z790 EAGLE AX 1.2',ean:null,
   specs:{'Чипсет':'AMD/Intel Z790','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB Z790 EAGLE AX /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/39261.jpeg',stock:true},

  {id:224,name:'GB H810M S2H /LGA1851',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:163,old:null,pct:null,badge:null,emoji:'⚙️',sku:'H810M S2H 1.0',ean:'4719331869168',
   specs:{'Памет':'2× DDR5','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB H810M S2H /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45058.png',stock:true},

  {id:225,name:'GB B860 DS3H /LGA1851',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:258,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860 DS3H 1.0',ean:'4719331868178',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B860 DS3H /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44566.png',stock:true},

  {id:226,name:'GB B860M E /LGA1851',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:190,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M E',ean:'4719331868260',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B860M E /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52060.png',stock:false},

  {id:227,name:'GB B860M EAGLE /LGA1851',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:192,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M EAGLE 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B860','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B860M EAGLE /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44570.png',stock:false},

  {id:228,name:'GB B860 EAGLE WIFI6E /LGA1851',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:318,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860 EAGLE WIFI6E 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B860 EAGLE WIFI6E /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44574.png',stock:true},

  {id:229,name:'GB B860 GAMING X WIFI6E /1851',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:318,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860 GAMING X WIFI6E 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B860 GAMING X WIFI6E /1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44578.png',stock:true},

  {id:230,name:'GB B860M A ELT WF6E ICE /1851',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:343,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M A ELT WF6E ICE 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B860M A ELT WF6E ICE /1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44582.png',stock:true},

  {id:231,name:'GB B860M D3HP',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:230,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M D3HP 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B860M D3HP.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50891.png',stock:true},

  {id:232,name:'GB B860M DS3H',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:251,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M DS3H 1.0',ean:'4719331866709',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B860M DS3H.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50895.png',stock:true},

  {id:233,name:'GB B860M DS3H WIFI6E',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:266,old:null,pct:null,badge:null,emoji:'⚙️',sku:'B860M DS3H WIFI6E',ean:'4719331866814',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB B860M DS3H WIFI6E.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45088.png',stock:false},

  {id:234,name:'GB Z890M GAMING X /LGA1851',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:338,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890M GAMING X 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB Z890M GAMING X /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42823.png',stock:true},

  {id:235,name:'GB Z890M AORUS ELITE WF7 ICE',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:417,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890M AORUS ELITE WF7 ICE',ean:null,
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB Z890M AORUS ELITE WF7 ICE.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52029.png',stock:true},

  {id:236,name:'GB Z890 A ELITE WIFI7 /LGA1851',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:443,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890 A ELITE WIFI7 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB Z890 A ELITE WIFI7 /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42826.png',stock:false},

  {id:237,name:'GB Z890 A ELITE WF7 ICE',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:495,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890 A ELITE WF7 ICE  1.0',ean:'4719331865221',
   specs:{'Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB Z890 A ELITE WF7 ICE.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45092.png',stock:false},

  {id:238,name:'GB Z890 EAGLE WIFI7',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:396,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890 A EAGLE WIFI7 1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB Z890 EAGLE WIFI7.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49153.png',stock:false},

  {id:239,name:'GB Z890 AORUS PRO ICE',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:558,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890 AORUS PRO ICE  1.0',ean:'4719331864712',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB Z890 AORUS PRO ICE.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45097.png',stock:true},

  {id:240,name:'GB Z890 AORUS MASTER /LGA1851',brand:'Gigabyte',cat:'components',subcat:'motherboard',
   price:920,old:null,pct:null,badge:null,emoji:'⚙️',sku:'Z890 AORUS MASTER  1.0',ean:null,
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'Gigabyte дънна платка GB Z890 AORUS MASTER /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42831.png',stock:true},

  {id:241,name:'MSI A520M-A PRO /AM4',brand:'MSI',cat:'components',subcat:'motherboard',
   price:82,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7C96-044',ean:'4719072749927',
   specs:{'Чипсет':'AMD/Intel A520','Памет':'2× DDR4','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DVI','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI A520M-A PRO /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/26322.png',stock:true},

  {id:242,name:'MSI A520M PRO',brand:'MSI',cat:'components',subcat:'motherboard',
   price:98,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7D14-020',ean:null,
   specs:{'Чипсет':'AMD/Intel A520','Памет':'2× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DVI / VGA','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI A520M PRO.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:false},

  {id:243,name:'MSI PRO A620M-E / AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:120,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E28-014',ean:'4711377093804',
   specs:{'Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO A620M-E / AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37149.png',stock:false},

  {id:244,name:'MSI PRO A620M-B',brand:'MSI',cat:'components',subcat:'motherboard',
   price:129,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E28-017',ean:'4711377276597',
   specs:{'Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO A620M-B.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44750.png',stock:false},

  {id:245,name:'MSI B550M PRO-VDH /AM4',brand:'MSI',cat:'components',subcat:'motherboard',
   price:134,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7C95-084',ean:'4719072758417',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DVI / VGA','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B550M PRO-VDH /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/26849.png',stock:true},

  {id:246,name:'MSI MPG B550 GAMING CARBON WIF',brand:'MSI',cat:'components',subcat:'motherboard',
   price:333,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7C90-002',ean:null,
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'6×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'3xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MPG B550 GAMING CARBON WIF.',
   img:'https://portal.mostbg.com/api/images/imageFileData/26027.png',stock:false},

  {id:247,name:'MSI B550M PRO-VDH WIFI /AM4',brand:'MSI',cat:'components',subcat:'motherboard',
   price:180,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7C95-081',ean:'4719072733698',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B550M PRO-VDH WIFI /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/24965.png',stock:true},

  {id:248,name:'MSI B550-A PRO /AM4',brand:'MSI',cat:'components',subcat:'motherboard',
   price:173,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7C56-076',ean:'4719072733667',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'6×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B550-A PRO /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/25341.jpeg',stock:true},

  {id:249,name:'MSI MAG B550 TOMAHAWK MAX WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:274,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7C91-062',ean:'4719072957957',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'6×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MAG B550 TOMAHAWK MAX WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/39626.png',stock:false},

  {id:250,name:'MSI MPG B550 GAMING PLUS /AM4',brand:'MSI',cat:'components',subcat:'motherboard',
   price:205,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7C56-075',ean:'4719072731885',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'6×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MPG B550 GAMING PLUS /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/34239.png',stock:true},

  {id:251,name:'MSI MAG B650 TOMAHAWK WIFI/AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:308,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7D75-010',ean:'4711377010153',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MAG B650 TOMAHAWK WIFI/AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/32503.png',stock:false},

  {id:252,name:'MSI B650M GAMING PLUS WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:239,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E24-013',ean:'4711377180955',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B650M GAMING PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/40333.png',stock:false},

  {id:253,name:'MSI B650M PROJECT ZERO',brand:'MSI',cat:'components',subcat:'motherboard',
   price:277,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E09-010',ean:'4711377126649',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B650M PROJECT ZERO.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:254,name:'MSI B650 GAMING PLUS WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:264,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E26-024',ean:'4711377098052',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B650 GAMING PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38288.png',stock:false},

  {id:255,name:'MSI MPG B650 EDGE WIFI /AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:392,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E10-002',ean:null,
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'6×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MPG B650 EDGE WIFI /AM5.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:false},

  {id:256,name:'MSI MPG B650I EDGE WIFI /AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:408,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7D73-008',ean:'4711377010146',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MPG B650I EDGE WIFI /AM5.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:257,name:'MSI PRO B650M-B /AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:132,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E28-020',ean:'4711377144797',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO B650M-B /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38864.png',stock:false},

  {id:258,name:'MSI PRO B650M-P/ AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:207,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E27-007',ean:'4711377100953',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO B650M-P/ AM5.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:259,name:'MSI PRO B650-S WIFI /AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:241,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E26-019',ean:'4711377132862',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO B650-S WIFI /AM5.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:false},

  {id:260,name:'MSI X670E GAMING PLUS WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:378,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E16-009',ean:'4711377170345',
   specs:{'Чипсет':'AMD/Intel X670','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI X670E GAMING PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/39187.png',stock:false},

  {id:261,name:'MSI MPG X670E CARBON WIFI /AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:692,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7D70-016',ean:'4711377004879',
   specs:{'Чипсет':'AMD/Intel X670','Памет':'4× DDR5','SATA3':'6×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MPG X670E CARBON WIFI /AM5.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:false},

  {id:262,name:'MSI B840 GAMING PLUS WIFI /AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:277,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E57-002',ean:'4711377286589',
   specs:{'Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B840 GAMING PLUS WIFI /AM5.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:263,name:'MSI PRO B840-P WIFI /AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:246,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E57-001',ean:'4711377286596',
   specs:{'Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO B840-P WIFI /AM5.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:false},

  {id:264,name:'MSI PRO B850-P WIFI /AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:309,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E56-021',ean:'4711377286046',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO B850-P WIFI /AM5.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:265,name:'MSI B850 GAMING PLUS WIFI /AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:360,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E56-014',ean:'4711377285438',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B850 GAMING PLUS WIFI /AM5.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:266,name:'MSI B850 GAMING PLUS WIFI6E',brand:'MSI',cat:'components',subcat:'motherboard',
   price:281,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E80-001',ean:'4711377365321',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B850 GAMING PLUS WIFI6E.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51065.png',stock:true},

  {id:267,name:'MSI B850M GAMING PLUS WIFI/AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:328,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E66-001',ean:'4711377347570',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B850M GAMING PLUS WIFI/AM5.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:268,name:'MSI B850M GAMING PLUS WIFI6E',brand:'MSI',cat:'components',subcat:'motherboard',
   price:267,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E81-002',ean:'4711377365345',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B850M GAMING PLUS WIFI6E.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51069.png',stock:true},

  {id:269,name:'MSI PRO B850M-P WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:264,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E71-001',ean:'4711377350181',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO B850M-P WIFI.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:270,name:'MSI MPG B850 EDGE TI WIFI /AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:498,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E62-001',ean:'4711377290616',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MPG B850 EDGE TI WIFI /AM5.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:false},

  {id:271,name:'MSI MAG B850 TOMAHAWK MAX WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:432,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E62-002',ean:'4711377290623',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MAG B850 TOMAHAWK MAX WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44094.png',stock:true},

  {id:272,name:'MSI PRO X870-P WIFI /AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:435,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E47-010',ean:'4711377256339',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO X870-P WIFI /AM5.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:false},

  {id:273,name:'MSI MAG X870E TOMAHAWK WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:587,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E59-006',ean:'4711377291927',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','LAN':'Gigabit','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MAG X870E TOMAHAWK WIFI.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:274,name:'MSI MPG X870E CARBON WIFI /AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:867,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E49-014',ean:'4711377253536',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','LAN':'Gigabit','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MPG X870E CARBON WIFI /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42865.png',stock:true},

  {id:275,name:'MSI MPG X870E EDGE TI WIFI/AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:658,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E59-001',ean:'4711377290630',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MPG X870E EDGE TI WIFI/AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44102.png',stock:true},

  {id:276,name:'MSI MEG X870E GODLIKE',brand:'MSI',cat:'components',subcat:'motherboard',
   price:2123,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E48-006',ean:'4711377276221',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MEG X870E GODLIKE.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47421.png',stock:false},

  {id:277,name:'MSI PRO X870E-P WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:432,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E70-002',ean:'4711377347600',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO X870E-P WIFI.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:278,name:'MSI MAG X870 TOMAHAWK WIFI/AM5',brand:'MSI',cat:'components',subcat:'motherboard',
   price:510,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E51-010',ean:'4711377254557',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MAG X870 TOMAHAWK WIFI/AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42870.png',stock:true},

  {id:279,name:'MSI PRO H610M-G DDR4 /LGA1700',brand:'MSI',cat:'components',subcat:'motherboard',
   price:111,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7D46-221',ean:'4719072925024',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR4','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO H610M-G DDR4 /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29758.png',stock:false},

  {id:280,name:'MSI PRO H610M-E / LGA1700',brand:'MSI',cat:'components',subcat:'motherboard',
   price:115,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7D48-075',ean:'4711377125147',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR5','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO H610M-E / LGA1700.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:281,name:'MSI PRO H610M-E DDR4 /LGA1700',brand:'MSI',cat:'components',subcat:'motherboard',
   price:98,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7D48-062',ean:'4711377002660',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR4','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO H610M-E DDR4 /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/34243.png',stock:true},

  {id:282,name:'MSI B760 GAMING PLUS WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:243,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7D98-051',ean:'4711377086561',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B760 GAMING PLUS WIFI.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:283,name:'MSI MAG B760 TOMAHAWK WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:315,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7D96-024',ean:'4711377034210',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MAG B760 TOMAHAWK WIFI.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:284,name:'MSI PRO B760-P II',brand:'MSI',cat:'components',subcat:'motherboard',
   price:207,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E29-009',ean:'4711377193887',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO B760-P II.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:285,name:'MSI PRO B760M-P DDR4 /LGA1700',brand:'MSI',cat:'components',subcat:'motherboard',
   price:155,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E02-029',ean:'4711377030991',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO B760M-P DDR4 /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33502.png',stock:true},

  {id:286,name:'MSI PRO B760M-P /LGA1700',brand:'MSI',cat:'components',subcat:'motherboard',
   price:165,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E02-030',ean:'4711377086578',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO B760M-P /LGA1700.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:287,name:'MSI B760M GAMING PLUS WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:243,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7D99-060',ean:'4711377154017',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B760M GAMING PLUS WIFI.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:288,name:'MSI B760M PROJECT ZERO',brand:'MSI',cat:'components',subcat:'motherboard',
   price:301,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E14-007',ean:'4711377143660',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B760M PROJECT ZERO.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:289,name:'MSI PRO Z790-A MAX WIFI /1700',brand:'MSI',cat:'components',subcat:'motherboard',
   price:402,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E07-025',ean:'4711377139939',
   specs:{'Чипсет':'AMD/Intel Z790','Памет':'4× DDR5','SATA3':'6×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO Z790-A MAX WIFI /1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37063.png',stock:false},

  {id:290,name:'MSI PRO Z790-P WIFI /LGA1700',brand:'MSI',cat:'components',subcat:'motherboard',
   price:333,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E06-091',ean:'4711377015738',
   specs:{'Чипсет':'AMD/Intel Z790','Памет':'4× DDR5','SATA3':'6×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO Z790-P WIFI /LGA1700.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:291,name:'MSI MAG Z790 TOMAHAWK WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:385,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7D91-046',ean:'4711377025492',
   specs:{'Чипсет':'AMD/Intel Z790','Памет':'4× DDR5','RAID':'Да','M.2':'4xM2','LAN':'Gigabit','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MAG Z790 TOMAHAWK WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/34740.png',stock:true},

  {id:292,name:'MSI Z790 GAMING PLUS WIFI/1700',brand:'MSI',cat:'components',subcat:'motherboard',
   price:343,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E06-084',ean:'4711377134712',
   specs:{'Чипсет':'AMD/Intel Z790','Памет':'4× DDR5','SATA3':'6×SATA3','RAID':'Да','M.2':'4xM2','LAN':'Gigabit','PCIe x16':'3×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI Z790 GAMING PLUS WIFI/1700.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:293,name:'MSI PRO B860-P WIFI /LGA1851',brand:'MSI',cat:'components',subcat:'motherboard',
   price:317,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E41-001',ean:'4711377286572',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO B860-P WIFI /LGA1851.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:false},

  {id:294,name:'MSI PRO B860-P /LGA1851',brand:'MSI',cat:'components',subcat:'motherboard',
   price:306,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E41-002',ean:'4711377289757',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO B860-P /LGA1851.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:295,name:'MSI B860M GAMING PLUS WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:307,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E42-003',ean:'4711377286558',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B860M GAMING PLUS WIFI.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:296,name:'MSI PRO B860M-A WIFI /LGA1851',brand:'MSI',cat:'components',subcat:'motherboard',
   price:307,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E42-002',ean:'4711377286565',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO B860M-A WIFI /LGA1851.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:297,name:'MSI B860 GAMING PLUS WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:333,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E41-003',ean:'4711377289764',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI B860 GAMING PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43899.png',stock:true},

  {id:298,name:'MSI MAG B860 TOMAHAWK WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:412,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E39-001',ean:'4711377279642',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MAG B860 TOMAHAWK WIFI.',
   img:'https://portal.mostbg.com/img/ProductInfo/PL_4.gif',stock:true},

  {id:299,name:'MSI MEG Z890 ACE /LGA1851',brand:'MSI',cat:'components',subcat:'motherboard',
   price:1120,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E22-001',ean:null,
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','LAN':'Gigabit','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MEG Z890 ACE /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42875.png',stock:false},

  {id:300,name:'MSI MEG Z890 GODLIKE /LGA1851',brand:'MSI',cat:'components',subcat:'motherboard',
   price:2101,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E21-002',ean:null,
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','LAN':'Gigabit','PCIe x16':'3×PCIEx16','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MEG Z890 GODLIKE /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44211.png',stock:false},

  {id:301,name:'MSI Z890 GAMING PLUS WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:420,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E34-002',ean:'4711377257718',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','LAN':'Gigabit','PCIe x16':'3×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI Z890 GAMING PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49356.png',stock:false},

  {id:302,name:'MSI PRO Z890-S WIFI /LGA1851',brand:'MSI',cat:'components',subcat:'motherboard',
   price:370,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E54-001',ean:'4526541055959',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','LAN':'Gigabit','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO Z890-S WIFI /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42880.png',stock:false},

  {id:303,name:'MSI PRO Z890-A WIFI /LGA1851',brand:'MSI',cat:'components',subcat:'motherboard',
   price:483,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E32-004',ean:'4711377259729',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','LAN':'Gigabit','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI PRO Z890-A WIFI /LGA1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42885.png',stock:true},

  {id:304,name:'MSI MPG Z890 CARBON WIFI /1851',brand:'MSI',cat:'components',subcat:'motherboard',
   price:877,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E17-001',ean:'4711377260794',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','LAN':'Gigabit','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MPG Z890 CARBON WIFI /1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42890.png',stock:true},

  {id:305,name:'MSI MPG Z890 EDGE TI WIFI/1851',brand:'MSI',cat:'components',subcat:'motherboard',
   price:660,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E19-002',ean:null,
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','LAN':'Gigabit','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1851'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MPG Z890 EDGE TI WIFI/1851.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42895.png',stock:false},

  {id:306,name:'MSI MAG Z890 TOMAHAWK WIFI',brand:'MSI',cat:'components',subcat:'motherboard',
   price:533,old:null,pct:null,badge:null,emoji:'⚙️',sku:'911-7E32-003',ean:'4711377259712',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','LAN':'Gigabit','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'MSI дънна платка MSI MAG Z890 TOMAHAWK WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42900.png',stock:true},

  {id:307,name:'ASUS PRIME A520M-K / AM4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:98,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1500-M0EAY0',ean:'4718017826921',
   specs:{'Чипсет':'AMD/Intel A520','Памет':'2× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME A520M-K / AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/25171.jpeg',stock:false},

  {id:308,name:'ASUS PRIME A520M-E/CSM AM4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:127,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1510-M0EAYC',ean:'4718017826396',
   specs:{'Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME A520M-E/CSM AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/25848.png',stock:false},

  {id:309,name:'ASUS PRO A520M-C II/CSM /AM4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:137,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB18F0-M0EAY0',ean:'4711081250098',
   specs:{'Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRO A520M-C II/CSM /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45426.png',stock:false},

  {id:310,name:'ASUS TUF GAMING A520M-PLUS II',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:152,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB17G0-M0EAYO',ean:'4718017826921',
   specs:{'Чипсет':'AMD/Intel A520','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING A520M-PLUS II.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29015.png',stock:false},

  {id:311,name:'ASUS PRIME B450M-K II /AM4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:97,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1600-M0EAY0',ean:'4718017932387',
   specs:{'Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B450M-K II /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/25653.jpeg',stock:false},

  {id:312,name:'ASUS PRIME B450M-A II /AM4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:127,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB15Z0-M0EAY0',ean:'4718017924986',
   specs:{'Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B450M-A II /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/25854.png',stock:false},

  {id:313,name:'ASUS PRIME B550M-K /AM4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:135,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB14V0-MOEAY0',ean:'4718017758284',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DVI / VGA','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B550M-K /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/24649.jpeg',stock:true},

  {id:314,name:'ASUS PRIME B550M-K ARGB /AM4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:144,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1GC0-M0EAY0',ean:'4711387316030',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'2× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B550M-K ARGB /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48176.png',stock:false},

  {id:315,name:'ASUS PRIME B550M-A /AM4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:137,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB14I0-M0EAY0',ean:'4718017755535',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DVI / VGA','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B550M-A /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/27094.png',stock:false},

  {id:316,name:'ASUS TUF GAMING B550M-PLUS/AM4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:251,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB14A0-M0EAY0',ean:'4718017623544',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING B550M-PLUS/AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/24724.jpeg',stock:false},

  {id:317,name:'ASUS TUF GAM B550-PLUS WIFI II',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:298,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB19U0-MOEAY0',ean:'4711081338413',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'6×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'3xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAM B550-PLUS WIFI II.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37075.png',stock:false},

  {id:318,name:'ASUS PRIME B550-PLUS /AM4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:257,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB14U0-M0EAY0',ean:'4718017782340',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'6×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'3xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B550-PLUS /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/24115.jpeg',stock:true},

  {id:319,name:'ASUS TUF GAMING B550-PLUS /AM4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:187,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB14G0-M0EAY0',ean:'4718017749435',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'6×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'3xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING B550-PLUS /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/24085.jpeg',stock:false},

  {id:320,name:'ASUS TUF GAMING B550-PRO /AM4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:220,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB17R0-M0EAY0',ean:'4711081033721',
   specs:{'Чипсет':'AMD/Intel B550','Памет':'4× DDR4','SATA3':'6×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'3xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING B550-PRO /AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/26474.png',stock:false},

  {id:321,name:'ASUS PRIME A620M-K',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:165,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1F40-M0EAY0',ean:'4711387242087',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME A620M-K.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45436.png',stock:false},

  {id:322,name:'ASUS PRIME A620M-A-CSM',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:227,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1F10-M0EAY0',ean:'4711387176405',
   specs:{'Памет':'4× DDR5','SATA3':'4×SATA3','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME A620M-A-CSM.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48179.png',stock:true},

  {id:323,name:'ASUS TUF GAMING A620M-PLUS WIF',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:241,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1F00-M0EAY0',ean:'4711387164266',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING A620M-PLUS WIF.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45430.png',stock:false},

  {id:324,name:'ASUS PRIME B650-PLUS /AM5',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:254,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1BS0-M0EAY0',ean:'4711081923381',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B650-PLUS /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42321.png',stock:false},

  {id:325,name:'ASUS PRIME B650-PLUS-CSM /AM5',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:228,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1BS0-M0EAYC',ean:'4718017924986',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B650-PLUS-CSM /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50083.png',stock:true},

  {id:326,name:'ASUS PRIME B650M-K',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:156,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1F60-M0EAY0',ean:'4711387236628',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B650M-K.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42326.png',stock:true},

  {id:327,name:'ASUS PRIME B650M-R',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:212,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1H30-M0EAY0',ean:'4711387429761',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B650M-R.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48183.png',stock:false},

  {id:328,name:'ASUS PRIME B650M-A WIFI II/AM5',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:314,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1EG0-M0EAY0',ean:'4711387034934',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B650M-A WIFI II/AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38434.png',stock:true},

  {id:329,name:'ASUS TUF GAMING B650M-PLUS WIF',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:380,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1BF0-M0EAY0',ean:'4711081912118',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING B650M-PLUS WIF.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42331.png',stock:false},

  {id:330,name:'ASUS TUF GAMING B650M-PLUS',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:330,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1BG0-M0EAY0',ean:'4711081912392',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING B650M-PLUS.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33619.png',stock:true},

  {id:331,name:'ASUS PRIME B650-PLUS WIFI /AM5',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:240,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1KP0-M0EAY0',ean:'4711387760895',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B650-PLUS WIFI /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48187.png',stock:false},

  {id:332,name:'ASUS TUF GAMING B650-PLUS WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:403,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1BZ0-M0EAY0',ean:'4711081912651',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING B650-PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33626.png',stock:false},

  {id:333,name:'ASUS ROG STRIX B650-A GAMI WF',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:443,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1BP0-M0EAY0',ean:'4711081917762',
   specs:{'Чипсет':'AMD/Intel B650','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS ROG STRIX B650-A GAMI WF.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45451.png',stock:true},

  {id:334,name:'ASUS TUF GAMIN B650E-PLUS WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:438,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1M20-M0EAY0',ean:'4711387995488',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMIN B650E-PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48190.png',stock:false},

  {id:335,name:'ASUS PRIME H810M-A WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:228,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1KJ0-M0EAY0',ean:'4711387842522',
   specs:{'Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME H810M-A WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50934.png',stock:true},

  {id:336,name:'ASUS PRIME B840M-A WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:324,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1J20-M0EAY0',ean:'4711387797143',
   specs:{'Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B840M-A WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45456.png',stock:true},

  {id:337,name:'ASUS PRIME B840-PLUS WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:349,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1IZ0-M0EAY0',ean:'4711387797273',
   specs:{'Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B840-PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45461.png',stock:true},

  {id:338,name:'ASUS PRIME B850-PLUS WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:357,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1L80-M0EAY0',ean:'4711387931509',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B850-PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48195.png',stock:true},

  {id:339,name:'ASUS TUF GAMING B850-PLUS WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:447,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1J30-M0EAY0',ean:'4711387781609',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING B850-PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45466.jpeg',stock:false},

  {id:340,name:'ASUS TUF GAMING B850-E WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:433,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1L20-M0EAY0',ean:'4711387987544',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING B850-E WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48201.png',stock:false},

  {id:341,name:'ASUS PRIME B850M-K',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:267,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1LV0-M0EAY0',ean:'4711636005517',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B850M-K.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48206.png',stock:false},

  {id:342,name:'ASUS PRIME B850M-A WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:337,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1LN0-M0EAY0',ean:'4711636051125',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B850M-A WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48212.png',stock:true},

  {id:343,name:'ASUS TUF GAMIN B850M-PLUS WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:437,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1IY0-M0EAY0',ean:'4711387764916',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMIN B850M-PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48217.png',stock:false},

  {id:344,name:'ASUS TUF GAMI B850M-PLUS WIFI7',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:448,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1MU0-MOEAY0',ean:'4711636167451',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMI B850M-PLUS WIFI7.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50940.png',stock:true},

  {id:345,name:'ASUS B850 MAX GAMING WIFI W',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:403,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1M10-M0EAY0',ean:'4711387981016',
   specs:{'Чипсет':'AMD/Intel B850','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS B850 MAX GAMING WIFI W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48222.png',stock:false},

  {id:346,name:'ASUS PRIME X870-P /AM5',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:503,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1IT0-M0EAY0',ean:'4711387723036',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'3×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME X870-P /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45470.png',stock:false},

  {id:347,name:'ASUS PRIME X870-P WIFI /AM5',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:403,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1IS0-M0EAY0',ean:'4711387718148',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME X870-P WIFI /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42338.png',stock:true},

  {id:348,name:'ASUS TUF GAMING X870-PLUS WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:647,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1IU0-M0EAY0',ean:'4711387723609',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING X870-PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44681.png',stock:false},

  {id:349,name:'ASUS TUF GAMIN X870E-PLUS WIF7',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:445,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1M70-M0EAY0',ean:'4711636100342',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMIN X870E-PLUS WIF7.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48227.png',stock:false},

  {id:350,name:'ASUS ROG STRIX X870E-E GAM WIF',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:987,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1IB0-M0EAY0',ean:'4711387724163',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS ROG STRIX X870E-E GAM WIF.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48232.png',stock:false},

  {id:351,name:'ASUS ROG CROSSHAIR X870E APEX',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:1328,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1KR0-M0EAY0',ean:'4711387890240',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS ROG CROSSHAIR X870E APEX.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48237.png',stock:true},

  {id:352,name:'ASUS ROG CROSSHAIR X870E HERO',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:1256,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1IE0-M0EAY0',ean:'4711387710302',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS ROG CROSSHAIR X870E HERO.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48242.png',stock:false},

  {id:353,name:'ASUS X870 MAX GAMING WIFI7 W',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:613,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1LZ0-M0EAY0',ean:'4711636007856',
   specs:{'Чипсет':'AMD/Intel X870','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS X870 MAX GAMING WIFI7 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50086.png',stock:true},

  {id:354,name:'ASUS PRIME H510M-K R2.0 /1200',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:94,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1E80-M0EAY0',ean:'4711387113189',
   specs:{'Памет':'2× DDR4','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1200'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME H510M-K R2.0 /1200.',
   img:'https://portal.mostbg.com/api/images/imageFileData/34422.png',stock:false},

  {id:355,name:'ASUS PRIME H610M-K-D4 /LGA1700',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:123,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1A10-M0EAY0',ean:'4711081565499',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR4','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME H610M-K-D4 /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29657.png',stock:false},

  {id:356,name:'ASUS PRIME H610M-K /LGA1700',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:116,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1GA0-M0EAY0',ean:'4711387336328',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR5','SATA3':'4×SATA3','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME H610M-K /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42344.png',stock:false},

  {id:357,name:'ASUS PRIME H610M-A WIFI D4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:147,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1C80-M0EAY0',ean:'4711081758211',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME H610M-A WIFI D4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43036.png',stock:false},

  {id:358,name:'ASUS PRIME H610M-A D4-CSM',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:128,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB19P0-M0EAYC',ean:'4711387309902',
   specs:{'Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME H610M-A D4-CSM.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48248.png',stock:false},

  {id:359,name:'ASUS PRIME H610M-R-SI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:101,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1GL0-M0ECY0',ean:'4711387321515',
   specs:{'Чипсет':'AMD/Intel H610','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'1xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME H610M-R-SI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51254.png',stock:true},

  {id:360,name:'ASUS PRIME B660M-K D4 /LGA1700',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:132,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1950-M1EAY0',ean:'4711081511830',
   specs:{'Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B660M-K D4 /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29653.png',stock:false},

  {id:361,name:'ASUS PRIME B660-PLUS D4 /1700',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:165,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB18X0-M1EAY0',ean:'4711081523017',
   specs:{'Чипсет':'AMD/Intel B660','Памет':'4× DDR4','SATA3':'4×SATA3','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B660-PLUS D4 /1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33058.png',stock:true},

  {id:362,name:'ASUS PRIME B760M-PLUS',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:266,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1GY0-M0EAY0',ean:'4711387469910',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B760M-PLUS.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42349.png',stock:true},

  {id:363,name:'ASUS PRIME B760M-K /LGA1700',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:153,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1FI0-M1EAY0',ean:'4711387198506',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B760M-K /LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38468.png',stock:false},

  {id:364,name:'ASUS PRIME B760M-K D4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:141,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1DS0-M1EAY0',ean:'4711387006917',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'2× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B760M-K D4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33672.png',stock:false},

  {id:365,name:'ASUS PRIME B760M-A WIFI D4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:206,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1CX0-M1EAY0',ean:'4711081982661',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'3×PCIEx16','Изходи':'DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B760M-A WIFI D4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42354.png',stock:true},

  {id:366,name:'ASUS PRIME B760M-A WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:281,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1EL0-M1EAY0',ean:'4711387131435',
   specs:{'Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B760M-A WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45474.png',stock:false},

  {id:367,name:'ASUS PRIME B760M-R D4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:186,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1HA0-M0EAY0',ean:'4711387423769',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'2× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B760M-R D4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48252.png',stock:false},

  {id:368,name:'ASUS PRIME B760M-A-CSM/LGA1700',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:215,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1EK0-M1EAYC',ean:'4711387140710',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'3×PCIEx16','Изходи':'DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B760M-A-CSM/LGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38439.png',stock:true},

  {id:369,name:'ASUS TUF GAMING B760M-PLUS D4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:207,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1DI0-M1EAY0',ean:'4711387005316',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING B760M-PLUS D4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33662.png',stock:false},

  {id:370,name:'ASUS TUF GAM B760M-PLUS WIF II',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:343,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1HE0-M0EAY0',ean:'4711387461365',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAM B760M-PLUS WIF II.',
   img:'https://portal.mostbg.com/api/images/imageFileData/39904.png',stock:true},

  {id:371,name:'ASUS TUF GAMING B760M-PLUS II',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:316,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1HD0-M0EAY0',ean:'4711387469798',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING B760M-PLUS II.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42360.png',stock:true},

  {id:372,name:'ASUS PRIME B760-PLUS D4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:181,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1CW0-M1EAY0',ean:'4711081970309',
   specs:{'Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B760-PLUS D4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33677.png',stock:false},

  {id:373,name:'ASUS PRIME B760-PLUS /1700',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:196,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1EF0-M1EAY0',ean:'4711387102985',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP / VGA','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B760-PLUS /1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/35101.png',stock:false},

  {id:374,name:'ASUS TUF GAMIN B760-PLUS WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:342,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1ER0-M1EAY0',ean:'4711387009499',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMIN B760-PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/39916.png',stock:false},

  {id:375,name:'ASUS TUF GAMIN B760-PLUS WF D4',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:317,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1DF0-M1EAY0',ean:'4711387009499',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR4','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMIN B760-PLUS WF D4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50094.png',stock:false},

  {id:376,name:'ASUS ROG STRIX B760-F GAM WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:453,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1CT0-M1EAY0',ean:'4711081974666',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS ROG STRIX B760-F GAM WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38484.png',stock:false},

  {id:377,name:'ASUS PRIME Z790-P',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:402,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1CK0-M1EAY0',ean:'4711081937449',
   specs:{'Чипсет':'AMD/Intel Z790','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME Z790-P.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33682.png',stock:false},

  {id:378,name:'ASUS PRIME Z790-P WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:427,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1CJ0-M1EAY0',ean:'4711081937227',
   specs:{'Чипсет':'AMD/Intel Z790','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME Z790-P WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48256.png',stock:false},

  {id:379,name:'ASUS PRIME Z790-A WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:513,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1CS0-M1EAY0',ean:'4711081939320',
   specs:{'Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME Z790-A WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45477.png',stock:false},

  {id:380,name:'ASUS PRIME B860M-K',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:253,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1JT0-M0EAY0',ean:'4711387808498',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'2× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'1×PCIEx16','PCIe x1':'2xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B860M-K.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48260.png',stock:true},

  {id:381,name:'ASUS PRIME B860M-A WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:339,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1JY0-M0EAY0',ean:'4711387806289',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B860M-A WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50099.png',stock:true},

  {id:382,name:'ASUS TUF GAMIN B860M-PLUS WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:397,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1JV0-M0EAY0',ean:'4711387783092',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'1×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMIN B860M-PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45493.png',stock:false},

  {id:383,name:'ASUS PRIME B860-PLUS WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:352,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1K50-M0EAY0',ean:'4711387814697',
   specs:{'Чипсет':'AMD/Intel B760','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'2xM2','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME B860-PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45487.png',stock:true},

  {id:384,name:'ASUS TUF GAMIN B860-PLUS WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:292,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1JL0-M0EAY0',ean:'4711387815144',
   specs:{'Чипсет':'AMD/Intel B860','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'2×PCIEx16','PCIe x1':'1xPCIEx1','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMIN B860-PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45482.png',stock:false},

  {id:385,name:'ASUS PRIME Z890-P',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:438,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1I50-M0EAY0',ean:'4711387759103',
   specs:{'Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME Z890-P.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42840.png',stock:false},

  {id:386,name:'ASUS PRIME Z890-P WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:457,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1I70-M0EAY0',ean:'4711387754818',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','M.2':'4xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME Z890-P WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45497.png',stock:true},

  {id:387,name:'ASUS TUF GAMING Z890-PLUS WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:575,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1IQ0-M0EAY0',ean:'4711387763926',
   specs:{'Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING Z890-PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42846.png',stock:false},

  {id:388,name:'ASUS TUF GAMING Z890-PRO WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:619,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1IR0-M0EAY0',ean:'4711387762639',
   specs:{'Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS TUF GAMING Z890-PRO WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42852.png',stock:false},

  {id:389,name:'ASUS ROG MAXIMUS Z890 HERO',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:1213,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1ID0-M0EAY0',ean:'4711387747223',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','LAN':'Gigabit','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS ROG MAXIMUS Z890 HERO.',
   img:'https://portal.mostbg.com/api/images/imageFileData/42858.png',stock:true},

  {id:390,name:'ASUS ROG MAXIMUS Z890 EXTREME',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:2213,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1IA0-M0EAY0',ean:'4711387754153',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','LAN':'Gigabit','PCIe x16':'2×PCIEx16','Изходи':'HDMI','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS ROG MAXIMUS Z890 EXTREME.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48264.png',stock:true},

  {id:391,name:'ASUS ROG STRIX Z890-F GAM WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:802,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1I40-M0EAY0',ean:'4711387755921',
   specs:{'Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS ROG STRIX Z890-F GAM WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48267.png',stock:false},

  {id:392,name:'ASUS ROG STRIX Z890-E GAM WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:902,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1IM0-M0EAY0',ean:'4711387756133',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'4×SATA3','RAID':'Да','PCIe x16':'2×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS ROG STRIX Z890-E GAM WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48273.png',stock:false},

  {id:393,name:'ASUS PRIME Z890M-PLUS WIFI',brand:'ASUS',cat:'components',subcat:'motherboard',
   price:410,old:null,pct:null,badge:null,emoji:'⚙️',sku:'90MB1J80-M0EAY0',ean:'4711387755419',
   specs:{'Чипсет':'AMD/Intel Z890','Памет':'4× DDR5','SATA3':'6×SATA3','RAID':'Да','M.2':'3xM2','PCIe x16':'4×PCIEx16','Изходи':'HDMI / DP','Форм фактор':'ATX','Сокет':'LGA1700'},
   rating:4.4,rv:0,reviews:[],
   desc:'ASUS дънна платка ASUS PRIME Z890M-PLUS WIFI.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50105.png',stock:true},

  {id:394,name:'SAPPHIRE A520M-E / AM4',brand:'Sapphire',cat:'components',subcat:'motherboard',
   price:100,old:null,pct:null,badge:null,emoji:'⚙️',sku:'52119-04-40G',ean:null,
   specs:{'Форм фактор':'ATX','Сокет':'AM4'},
   rating:4.4,rv:0,reviews:[],
   desc:'Sapphire дънна платка SAPPHIRE A520M-E / AM4.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50301.png',stock:false},

  {id:395,name:'SAPPHIRE B650M-E / AM5',brand:'Sapphire',cat:'components',subcat:'motherboard',
   price:167,old:null,pct:null,badge:null,emoji:'⚙️',sku:'52112-04-40G',ean:null,
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Sapphire дънна платка SAPPHIRE B650M-E / AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50304.png',stock:false},

  {id:396,name:'SAPPHIRE PULSE B850M WIFI /AM5',brand:'Sapphire',cat:'components',subcat:'motherboard',
   price:226,old:null,pct:null,badge:null,emoji:'⚙️',sku:'52123-04-40G',ean:null,
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Sapphire дънна платка SAPPHIRE PULSE B850M WIFI /AM5.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50307.png',stock:false},

  {id:397,name:'SAPPHIRE NITRO+ B850A WIFI7',brand:'Sapphire',cat:'components',subcat:'motherboard',
   price:324,old:null,pct:null,badge:null,emoji:'⚙️',sku:'52123-03-40G',ean:'4895106296930',
   specs:{'Форм фактор':'ATX','Сокет':'AM5'},
   rating:4.4,rv:0,reviews:[],
   desc:'Sapphire дънна платка SAPPHIRE NITRO+ B850A WIFI7.',
   img:null,stock:true},


  // ── CPU Import — 2026-04-20 — categoryId=3 (Most BG) — 183 процесора ──
  {id:398,name:'INTEL G5905 3.5GHZ/4M BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:68,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB701G5905SRK27',ean:null,
   specs:{'Сокет':'FCLGA1200','Ядра':'2','Нишки':'2','Честота':'3.50 GHz','Кеш':'4 MB Smart Cache','Памет':'Макс: 128 GB | Тип: DDR4-2666 | Канали: 2 | 41.6 GB/s','Интегрирана графика':'UHD Graphics 610','TDP':'58 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel G5905 3.5GHZ/4M BOX — сокет FCLGA1200, 2 ядра, TDP 58 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/25457.jpeg',stock:false},

  {id:399,name:'INTEL G6400 4.0GHZ/4MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:118,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB701G6400SRH3Y',ean:null,
   specs:{'Сокет':'FCLGA1200','Ядра':'2','Нишки':'4','Честота':'4.00 GHz','Кеш':'4 MB Smart Cache','Памет':'Макс: 128 GB | Тип: DDR4-2666 | Канали: 2 | 41.6 GB/s','Интегрирана графика':'UHD Graphics 610','TDP':'58 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel G6400 4.0GHZ/4MB BOX — сокет FCLGA1200, 2 ядра, TDP 58 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/25459.jpeg',stock:false},

  {id:400,name:'INTEL I3-10105 3.7GHZ 6MB LGA1200 BX',brand:'Intel',cat:'components',subcat:'cpu',
   price:146,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB70110105SRH3P',ean:null,
   specs:{'Сокет':'FCLGA1200','Ядра':'4','Нишки':'8','Честота':'Max Turbo Frequency: 4.40 GHz; Turbo Boost Technology 2.0 Frequency‡: 4.40 GHz; 3.70 GHz','Кеш':'6 MB Smart Cache','Памет':'Макс: 128 GB | Тип: DDR4-2666 | Канали: 2 | 41.6 GB/s','Интегрирана графика':'UHD Graphics 630','TDP':'65 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I3-10105 3.7GHZ 6MB LGA1200 BX — сокет FCLGA1200, 4 ядра, TDP 65 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29245.jpeg',stock:false},

  {id:401,name:'INTEL I5-10400 2.9GHZ/12MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:232,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB70110400SRH3C',ean:null,
   specs:{'Сокет':'FCLGA1200','Ядра':'6','Нишки':'12','Честота':'2.90 GHz; Max Turbo Frequency:4.30 GHz','Кеш':'12 MB Smart Cache','Памет':'Max Memory Size (dependent on memory type)128 GB | Тип: DDR4-2666 | Канали: 2 | 41.6 GB/s','Интегрирана графика':'UHD Graphics 630','TDP':'65 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-10400 2.9GHZ/12MB BOX — сокет FCLGA1200, 6 ядра, TDP 65 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/24319.jpeg',stock:false},

  {id:402,name:'INTEL I5-11400F 2.6GHZ/12M BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:165,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX8070811400F',ean:null,
   specs:{'Сокет':'FCLGA1200','Ядра':'6','Нишки':'12','Честота':'2.60 GHz; Max Turbo Frequency:4.40 GHz','Кеш':'12 MB Smart Cache','Памет':'Max Memory Size (dependent on memory type)128 GB | Тип: DDR4-3200 | Канали: 2 | 50 GB/s','TDP':'65 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-11400F 2.6GHZ/12M BOX — сокет FCLGA1200, 6 ядра, TDP 65 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/26858.jpeg',stock:false},

  {id:403,name:'INTEL I5-11400 2.6GHZ/12MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:287,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB70811400SRKP0',ean:'5032037214902',
   specs:{'Сокет':'FCLGA1200','Ядра':'6','Нишки':'12','Честота':'2.60 GHz; Max Turbo Frequency:4.40 GHz','Кеш':'12 MB Smart Cache','Памет':'Max Memory Size (dependent on memory type)128 GB | Тип: DDR4-3200 | Канали: 2 | 50 GB/s','Интегрирана графика':'UHD Graphics 730','TDP':'65 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-11400 2.6GHZ/12MB BOX — сокет FCLGA1200, 6 ядра, TDP 65 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/26857.jpeg',stock:false},

  {id:404,name:'INTEL I5-11600 2.8GHZ/12MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:220,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB70811600SRKNW',ean:null,
   specs:{'Сокет':'FCLGA1200','Ядра':'6','Нишки':'12','Честота':'Max Turbo Frequency:4.80 GHz; Turbo Boost Technology 2.0 Frequency‡:4.80 GHz; 2.80 GHz','Кеш':'12 MB Smart Cache','Памет':'Max Memory Size (dependent on memory type)128 GB | Тип: DDR4-3200 | Канали: 2 | 50 GB/s','Интегрирана графика':'UHD Graphics 750','TDP':'65 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-11600 2.8GHZ/12MB BOX — сокет FCLGA1200, 6 ядра, TDP 65 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29251.jpeg',stock:false},

  {id:405,name:'INTEL I3-12100 3.3G /12М BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:221,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX8071512100',ean:'5032037238458',
   specs:{'Сокет':'FCLGA1700','Ядра':'4','Нишки':'8','Честота':'4.30 GHz','Кеш':'12 MB Smart Cache','Памет':'Макс: 128 GB Memory Types: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 Max Memory Bandwid','Интегрирана графика':'UHD Graphics 730'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I3-12100 3.3G /12М BOX — сокет FCLGA1700, 4 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/30419.jpeg',stock:true},

  {id:406,name:'INTEL I3-12100 3.3G /12М/ TRAY',brand:'Intel',cat:'components',subcat:'cpu',
   price:223,old:null,pct:null,badge:null,emoji:'🔵',sku:'CM8071504651012',ean:'8592978363291',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1700','Ядра':'4','Нишки':'8','Честота':'3.30 GHz','Кеш':'Cache: 12 MB Smart Cache;Total L2 Cache: 5 MB','Памет':'Max Memory Size: 128 GB | Тип: Up to DDR5 4800 MT/s, Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Tray':'Yes','Интегрирана графика':'UHD Graphics 730 300 MHz 1.40 GHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I3-12100 3.3G /12М/ TRAY — сокет FCLGA1700, 4 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52221.png',stock:true},

  {id:407,name:'INTEL I3-12100F 4.3G/12М BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:147,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71512100FSRL63',ean:'5032037238731',
   specs:{'Сокет':'FCLGA1700','Ядра':'4','Нишки':'8','Честота':'4.30 GHz','Кеш':'12 MB Smart Cache','Памет':'Max Memory Size (dependent on memory type)128 GB | Тип: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s |'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I3-12100F 4.3G/12М BOX — сокет FCLGA1700, 4 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/30420.jpeg',stock:true},

  {id:408,name:'INTEL I3-13100F 3.4G 12M BOX LGA1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:143,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71513100FSRMBV',ean:null,
   specs:{'Сокет':'FCLGA1700','Честота':'Max Turbo Frequency:4.50 GHz; Performance-core Max Turbo Frequency:4.50 GHz; Performance-core Base F','Кеш':'12 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I3-13100F 3.4G 12M BOX LGA1700 — сокет FCLGA1700.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33442.jpeg',stock:false},

  {id:409,name:'INTEL I3-13100 3.4G 12M TRAY LGA1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:280,old:null,pct:null,badge:null,emoji:'🔵',sku:'CM8071505092202',ean:'5032037260305',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1700','Ядра':'4','Нишки':'8','Честота':'3.40 GHz','Кеш':'12 MB Smart Cache;Total L2 Cache: 5 MB','Памет':'Max Memory Size: 192 GB | Тип: Up to DDR5 4800 MT/s, Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Tray':'Yes','Интегрирана графика':'UHD Graphics 730, 300 MHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I3-13100 3.4G 12M TRAY LGA1700 — сокет FCLGA1700, 4 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50548.png',stock:true},

  {id:410,name:'INTEL I3-13100 3.4G 12M BOX LGA1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:275,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71513100SRMBU',ean:'5032037260312',
   specs:{'Сокет':'FCLGA1700','Ядра':'4','Нишки':'8','Честота':'Max Turbo Frequency:4.50 GHz; Performance-core Max Turbo Frequency:4.50 GHz; Performance-core Base F','Кеш':'12 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Интегрирана графика':'UHD Graphics 730'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I3-13100 3.4G 12M BOX LGA1700 — сокет FCLGA1700, 4 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33441.jpeg',stock:false},

  {id:411,name:'INTEL I5-12400 /2.5G/18MB TRAY',brand:'Intel',cat:'components',subcat:'cpu',
   price:322,old:null,pct:null,badge:null,emoji:'🔵',sku:'CM8071504650608',ean:'8592978355135',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1700','Ядра':'6','Нишки':'12','Честота':'2.50 GHz','Кеш':'18 MB Smart Cache;Total L2 Cache: 7.5 MB','Памет':'Max Memory Size: 128 GB;Memory Types : Up to DDR5 4800 MT/s, Up to DDR4 3200 MT/s | Канали: 2 | 76.8','Tray':'Yes','Интегрирана графика':'UHD Graphics 730, 300 MHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-12400 /2.5G/18MB TRAY — сокет FCLGA1700, 6 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50436.png',stock:false},

  {id:412,name:'INTEL I5-12400 /2.5G/18MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:353,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71512400SRL5Y',ean:'5032037237741',
   specs:{'Сокет':'FCLGA1700','Ядра':'6','Нишки':'12','Честота':'Max Turbo Frequency:4.40 GHz; Performance-core Max Turbo Frequenc:4.40 GHz; Performance-core Base Fr','Кеш':'18 MB Smart Cache','Памет':'Макс: 128 GB Memory Types: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Интегрирана графика':'UHD Graphics 730'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-12400 /2.5G/18MB BOX — сокет FCLGA1700, 6 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29632.jpeg',stock:false},

  {id:413,name:'INTEL I5-12400F/2.5G/18MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:199,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71512400FSRL4W',ean:null,
   specs:{'Сокет':'FCLGA1700','Ядра':'6','Нишки':'12','Честота':'Max Turbo Frequency:4.40 GHz; Performance-core Max Turbo Frequency:4.40 GHz; Performance-core Base F','Кеш':'18 MB Smart Cache','Памет':'Макс: 128 GB Memory Types:Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-12400F/2.5G/18MB BOX — сокет FCLGA1700, 6 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29842.jpeg',stock:false},

  {id:414,name:'INTEL I5-12500 /3.0G/18MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:367,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71512500SRL5V',ean:'5032037238564',
   specs:{'Сокет':'FCLGA1700, FCBGA1700','Ядра':'6','Нишки':'12','Честота':'Max Turbo Frequency:4.60 GHz; Performance-core Max Turbo Frequency:4.60 GHz; Performance-core Base F','Кеш':'18 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Интегрирана графика':'UHD Graphics 770'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-12500 /3.0G/18MB BOX — сокет FCLGA1700, FCBGA1700, 6 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29843.jpeg',stock:true},

  {id:415,name:'INTEL I5-12500 /3.0G/18MBTRAY',brand:'Intel',cat:'components',subcat:'cpu',
   price:318,old:null,pct:null,badge:null,emoji:'🔵',sku:'CM8071504647605',ean:null,
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1700','Ядра':'6','Нишки':'12','Честота':'Max Turbo Frequency: 4.60 GHz;Performance-core Max Turbo Frequency: 4.60 GHz;Performance-core Base F','Кеш':'18 MB Smart Cache;Total L2 Cache: 7.5 MB','Памет':'Макс: 128 GB | Тип: Up to DDR5 4800 MT/s, Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Tray':'Yes','Интегрирана графика':'UHD Graphics 770 300 MHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-12500 /3.0G/18MBTRAY — сокет FCLGA1700, 6 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47233.jpeg',stock:false},

  {id:416,name:'INTEL I5-12600 3.3G/18MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:470,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71512600SRL5T',ean:'5032037238540',
   specs:{'Сокет':'FCLGA1700','Ядра':'6','Нишки':'12','Честота':'Max Turbo Frequency: 4.80 GHz; Performance-core Max Turbo Frequency: 4.80 GHz; Performance-core Base','Кеш':'18 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Интегрирана графика':'UHD Graphics 770'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-12600 3.3G/18MB BOX — сокет FCLGA1700, 6 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29633.jpeg',stock:true},

  {id:417,name:'INTEL I5-12600K /3.7G/20MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:337,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71512600KSRL4T',ean:null,
   specs:{'Сокет':'FCLGA1700','Ядра':'10','Нишки':'16','Честота':'Performance-core Max Turbo Frequency:4.90 GHz; Efficient-core Max Turbo Frequency:3.60 GHz; Performa','Кеш':'20 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Интегрирана графика':'UHD Graphics 770'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-12600K /3.7G/20MB BOX — сокет FCLGA1700, 10 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29864.png',stock:false},

  {id:418,name:'INTEL I5-12600KF /3.7G/20MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:297,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71512600KFSRL4U',ean:'5032037234115',
   specs:{'Сокет':'FCLGA1700','Ядра':'10','Нишки':'16','Честота':'Max Turbo Frequency:4.90 GHz; Performance-core Max Turbo Frequency:4.90 GHz; Efficient-core Max Turb','Кеш':'20 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-12600KF /3.7G/20MB BOX — сокет FCLGA1700, 10 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29865.png',stock:false},

  {id:419,name:'INTEL I5-13400F 2.5G 20M BOX LGA1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:224,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71513400FSRMBN',ean:null,
   specs:{'Сокет':'FCLGA1700','Ядра':'10','Нишки':'16','Честота':'Max Turbo Frequency:4.60 GHz; Performance-core Max Turbo Frequency:4.60 GHz; Efficient-core Max Turb','Кеш':'20 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-13400F 2.5G 20M BOX LGA1700 — сокет FCLGA1700, 10 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33443.png',stock:false},

  {id:420,name:'INTEL I5-13400 2.5G 20M BOX LGA1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:481,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX8071513400',ean:'5032037260275',
   specs:{'Сокет':'FCLGA1700','Ядра':'10','Нишки':'16','Честота':'Max Turbo Frequency: 4.60 GHz; Performance-core Max Turbo Frequency: 4.60 GHz; Efficient-core Max Tu','Кеш':'20 MB Smart Cache','Памет':'Макс: 192 GB; Memory Types Up to: DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Интегрирана графика':'UHD Graphics 730','TDP':'Processor Base Power: 65 W; Maximum Turbo Power: 148 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-13400 2.5G 20M BOX LGA1700 — сокет FCLGA1700, 10 ядра, TDP Processor .',
   img:'https://portal.mostbg.com/api/images/imageFileData/38010.jpeg',stock:true},

  {id:421,name:'INTEL I5-13500 2.5G 24M BOX LGA1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:498,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71513500SRMBM',ean:'0735858528290',
   specs:{'Сокет':'FCLGA1700','Ядра':'14','Нишки':'20','Честота':'Max Turbo Frequency:4.80 GHz; Performance-core Max Turbo Frequency:4.80 GHz; Efficient-core Max Turb','Кеш':'24 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Интегрирана графика':'UHD Graphics 770'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-13500 2.5G 24M BOX LGA1700 — сокет FCLGA1700, 14 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33444.png',stock:true},

  {id:422,name:'INTEL I5-13600KF 3.5G/20MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:432,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71513600KFSRMBE',ean:null,
   specs:{'Сокет':'FCLGA1700','Ядра':'14','Нишки':'20','Честота':'Max Turbo Frequency:5.10 GHz; Performance-core Max Turbo Frequency:5.10 GHz; Efficient-core Max Turb','Кеш':'24 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 5600 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-13600KF 3.5G/20MB BOX — сокет FCLGA1700, 14 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/32559.jpeg',stock:false},

  {id:423,name:'INTEL I5-13600K 3.5G/20MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:437,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71513600KSRMBD',ean:null,
   specs:{'Сокет':'FCLGA1700','Ядра':'14','Нишки':'20','Честота':'Max Turbo Frequency:5.10 GHz; Performance-core Max Turbo Frequency:5.10 GHz; Efficient-core Max Turb','Кеш':'24 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 5600 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s','Интегрирана графика':'UHD Graphics 770'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-13600K 3.5G/20MB BOX — сокет FCLGA1700, 14 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/32452.jpeg',stock:false},

  {id:424,name:'INTEL I7-12700F /2.1G/25MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:470,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX8071512700F',ean:'5032037237826',
   specs:{'Сокет':'FCLGA1700','Ядра':'12','Нишки':'20','Честота':'Max Turbo Frequency: 4.90 GHz; Turbo Boost Max Technology 3.0 Frequency: 4.90 GHz; Performance-core ','Кеш':'25 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I7-12700F /2.1G/25MB BOX — сокет FCLGA1700, 12 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29635.png',stock:true},

  {id:425,name:'INTEL I7-12700K /3.6G/25MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:495,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71512700KSRL4N',ean:'5032037233989',
   specs:{'Сокет':'FCLGA1700','Ядра':'12','Нишки':'20','Честота':'Turbo Boost Max Technology 3.0 Frequency ‡:5.00 GHz; Performance-core Max Turbo Frequency:4.90 GHz; ','Кеш':'25 MB Smart Cache','Памет':'Max Memory Size (dependent on memory type)128 GB | Тип: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s |','Интегрирана графика':'UHD Graphics 770'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I7-12700K /3.6G/25MB BOX — сокет FCLGA1700, 12 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29252.jpeg',stock:true},

  {id:426,name:'INTEL I7-12700 /2.1G/25MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:522,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71512700SRL4Q',ean:null,
   specs:{'Сокет':'FCLGA1700','Ядра':'12','Нишки':'20','Честота':'Turbo Boost Max Technology 3.0 Frequency: 4.90 GHz; Performance-core Max Turbo Frequency: 4.80 GHz; ','Кеш':'25 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Интегрирана графика':'UHD Graphics 770'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I7-12700 /2.1G/25MB BOX — сокет FCLGA1700, 12 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29634.png',stock:false},

  {id:427,name:'INTEL I7-13700F /2.1G/30MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:493,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71513700FSRMBB',ean:'5032037260315',
   specs:{'Сокет':'FCLGA1700','Ядра':'16','Нишки':'24','Честота':'Max Turbo Frequency:5.20 GHz; Turbo Boost Max Technology 3.0 Frequency ‡ :5.20 GHz; Performance-core','Кеш':'30 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 5600 MT/s; Up to DDR4: 3200 MT/s | Канали: 2 | 89.6 GB/s'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I7-13700F /2.1G/30MB BOX — сокет FCLGA1700, 16 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33467.png',stock:true},

  {id:428,name:'INTEL I7-13700K /3.4G/30MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:652,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71513700KSRMB8',ean:null,
   specs:{'Сокет':'FCLGA1700','Ядра':'16','Нишки':'24','Честота':'Max Turbo Frequency:5.40 GHz; Turbo Boost Max Technology 3.0 Frequency:5.40 GHz; Performance-core Ma','Кеш':'30 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 5600 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s','Интегрирана графика':'UHD Graphics 770'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I7-13700K /3.4G/30MB BOX — сокет FCLGA1700, 16 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/32458.jpeg',stock:false},

  {id:429,name:'INTEL I7-13700KF /3.4G/24MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:578,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71513700KFSRMB9',ean:null,
   specs:{'Сокет':'FCLGA1700','Ядра':'16','Нишки':'24','Честота':'Max Turbo Frequency:5.40 GHz; Turbo Boost Max Technology 3.0 Frequency:5.40 GHz; Performance-core Ma','Кеш':'30 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 5600 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I7-13700KF /3.4G/24MB BOX — сокет FCLGA1700, 16 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/32457.jpeg',stock:false},

  {id:430,name:'INTEL I9-12900K 3.2GHZ 30MB BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:675,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX7071512900K',ean:'5032037234641',
   specs:{'Сокет':'FCLGA1700','Ядра':'16','Нишки':'24','Честота':'Turbo Boost Max Technology 3.0 Frequency ‡:5.20 GHz; Performance-core Max Turbo Frequency:5.10 GHz; ','Кеш':'30 MB Smart Cache','Памет':'Max Memory Size (dependent on memory type)128 GB | Тип: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s |','Интегрирана графика':'UHD Graphics 770'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I9-12900K 3.2GHZ 30MB BOX 1700 — сокет FCLGA1700, 16 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29254.png',stock:true},

  {id:431,name:'INTEL I9-13900KF 3GHZ 32MB BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:792,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71513900KFSRMBJ',ean:'5032037258623',
   specs:{'Сокет':'FCLGA1700','Ядра':'24','Нишки':'32','Честота':'Max Turbo Frequency:5.80 GHz; Thermal Velocity Boost Frequency:5.80 GHz; Turbo Boost Max Technology ','Кеш':'32 MB','Памет':'Макс: 128 GB | Тип: Up to DDR5 5600 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I9-13900KF 3GHZ 32MB BOX 1700 — сокет FCLGA1700, 24 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/32850.png',stock:false},

  {id:432,name:'INTEL I9-13900F 2.0G 36MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:658,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71513900FSRMB7',ean:null,
   specs:{'Сокет':'FCLGA1700','Ядра':'24','Нишки':'32','Честота':'Max Turbo Frequency:5.60 GHz; Thermal Velocity Boost Frequency:5.60 GHz; Turbo Boost Max Technology ','Кеш':'36 MB Smart Cache','Памет':'Макс: 128 GB | Тип: Up to DDR5 5600 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I9-13900F 2.0G 36MB BOX — сокет FCLGA1700, 24 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33469.jpeg',stock:false},

  {id:433,name:'INTEL I9-13900K 3GHZ 32MB BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:910,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX8071513900K',ean:null,
   specs:{'Сокет':'FCLGA1700','Ядра':'24','Нишки':'32','Честота':'Max Turbo Frequency:5.80 GHz; Thermal Velocity Boost Frequency:5.80 GHz; Turbo Boost Max Technology ','Кеш':'32 MB','Памет':'Макс: 128 GB; Memory Types Up to :DDR5 5600 MT/s; Up to DDR4 3200 MT/s | Канали: 2; Max Memory Bandw','Интегрирана графика':'UHD Graphics 770'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I9-13900K 3GHZ 32MB BOX 1700 — сокет FCLGA1700, 24 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/32560.jpeg',stock:false},

  {id:434,name:'INTEL I3-14100 3.5GHZ 12MB BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:302,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71514100SRMX1',ean:'5032037279079',
   specs:{'Сокет':'FCLGA1700','Ядра':'4','Нишки':'8','Честота':'Max Turbo Frequency: 4.7 GHz; Performance-core Max Turbo Frequency: 4.7 GHz; Performance-core Base F','Кеш':'12 MB Smart Cache','Памет':'Макс: 192 GB; Memory Types Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Интегрирана графика':'UHD Graphics 730','TDP':'60 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I3-14100 3.5GHZ 12MB BOX 1700 — сокет FCLGA1700, 4 ядра, TDP 60 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38366.jpeg',stock:true},

  {id:435,name:'INTEL I3-14100 3.5GHZ 12M TRAY 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:272,old:null,pct:null,badge:null,emoji:'🔵',sku:'CM8071505092206',ean:'4251538816816',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1700','Ядра':'4','Нишки':'8','Честота':'Max Turbo Frequency: 4.7 GHz;Performance-core Max Turbo Frequency: 4.7 GHz;Performance-core Base Fre','Кеш':'12 MB Smart Cache;Total L2 Cache: 5 MB','Памет':'Max Memory Size: 192 GB | Тип: Up to DDR5 4800 MT/s, Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Tray':'Yes','Интегрирана графика':'UHD Graphics 730, 1.5 GHz,'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I3-14100 3.5GHZ 12M TRAY 1700 — сокет FCLGA1700, 4 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50430.png',stock:true},

  {id:436,name:'INTEL I3-14100F 3.5GHZ 12MB BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:167,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX807151400F',ean:null,
   specs:{'Сокет':'FCLGA1700','Ядра':'4','Нишки':'8','Честота':'Max Turbo Frequency :4.7 GHz; Performance-core Max Turbo Frequency: 4.7 GHz; Performance-core Base F','Кеш':'12 MB Smart Cache','Памет':'Макс: 192 GB; Memory Types Up to: DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2; Max Memory Bandw','TDP':'58 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I3-14100F 3.5GHZ 12MB BOX 1700 — сокет FCLGA1700, 4 ядра, TDP 58 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38707.jpeg',stock:false},

  {id:437,name:'INTEL I5-14400F 3.5GHZ 20MB TRAY',brand:'Intel',cat:'components',subcat:'cpu',
   price:288,old:null,pct:null,badge:null,emoji:'🔵',sku:'INCM71505093011SRN3R',ean:'4251538816878',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1700','Ядра':'10','Нишки':'16','Честота':'Max Turbo Frequency: 4.7 GHz;Performance-core Max Turbo Frequency: 4.7 GHz;Efficient-core Max Turbo ','Кеш':'20 MB Smart Cache;Total L2 Cache: 9.5 MB','Памет':'Макс: 192 GB | Тип: Up to DDR5 4800 MT/s, Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Tray':'Yes'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-14400F 3.5GHZ 20MB TRAY — сокет FCLGA1700, 10 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51848.png',stock:false},

  {id:438,name:'INTEL I5-14400F 3.5GHZ 20MB BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:334,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71514400FFSRN47',ean:'8032037279147',
   specs:{'Сокет':'FCLGA1700','Ядра':'10','Нишки':'16','Честота':'Max Turbo Frequency :4.7 GHz; Performance-core Max Turbo Frequency: 4.7 GHz; Efficient-core Max Turb','Кеш':'20 MB Smart Cache','Памет':'Макс: 192 GB; Memory Types Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','TDP':'65 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-14400F 3.5GHZ 20MB BOX 1700 — сокет FCLGA1700, 10 ядра, TDP 65 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38368.jpeg',stock:true},

  {id:439,name:'INTEL I5-14400 3.5GHZ 20MB BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:464,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB71514400SRN46',ean:'5032037279130',
   specs:{'Сокет':'FCLGA1700','Ядра':'10','Нишки':'16','Честота':'Performance-core Max Turbo Frequency: 4.7 GHz; Efficient-core Max Turbo Frequency: 3.5 GHz; Performa','Кеш':'20 MB Smart Cache','Памет':'Max Memory Size (dependent on memory type) :192 GB; Memory Types Up to DDR5 4800 MT/s; Up to DDR4 32','Интегрирана графика':'UHD Graphics 730','TDP':'65 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-14400 3.5GHZ 20MB BOX 1700 — сокет FCLGA1700, 10 ядра, TDP 65 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38367.jpeg',stock:true},

  {id:440,name:'INTEL I5-14400 3.5GHZ 20MB TRAY 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:462,old:null,pct:null,badge:null,emoji:'🔵',sku:'CM8071504821112',ean:'3807000011961',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1700','Ядра':'10','Нишки':'16','Честота':'Max Turbo Frequency: 4.7 GHz;Performance-core Max Turbo Frequency: 4.7 GHz;Efficient-core Max Turbo ','Кеш':'20 MB Smart Cache;Total L2 Cache: 9.5 MB','Памет':'Max Memory Size: 192 GB | Тип: Up to DDR5 4800 MT/s, Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Tray':'Yes','Интегрирана графика':'UHD Graphics 730, 1.55 GHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-14400 3.5GHZ 20MB TRAY 1700 — сокет FCLGA1700, 10 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50431.png',stock:false},

  {id:441,name:'INTEL I5-14500 3.7GHZ 24MB BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:500,old:null,pct:null,badge:null,emoji:'🔵',sku:'INV71514500SRN3T',ean:'5032037279185',
   specs:{'Сокет':'FCLGA1700','Ядра':'14','Нишки':'20','Честота':'Max Turbo Frequency:5 GHz; Performance-core Max Turbo Frequency:5 GHz; Efficient-core Max Turbo Freq','Кеш':'24 MB Smart Cache','Памет':'Макс: 192 GB | Тип: Up to DDR5 4800 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 76.8 GB/s','Интегрирана графика':'UHD Graphics 770'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-14500 3.7GHZ 24MB BOX 1700 — сокет FCLGA1700, 14 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38369.jpeg',stock:true},

  {id:442,name:'INTEL I5-14600KF 5.3GHZ 20M TRAY',brand:'Intel',cat:'components',subcat:'cpu',
   price:372,old:null,pct:null,badge:null,emoji:'🔵',sku:'CM8071504821014',ean:'5032037278461',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1700','Ядра':'14','Нишки':'20','Честота':'Max Turbo Frequency: 5.3 GHz;Performance-core Max Turbo Frequency: 5.3 GHz;Efficient-core Max Turbo ','Кеш':'24 MB Smart Cache;Total L2 Cache: 20 MB','Памет':'Max Memory Size:192 GB | Тип: Up to DDR5 5600 MT/s, Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s','Tray':'Yes'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-14600KF 5.3GHZ 20M TRAY — сокет FCLGA1700, 14 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50432.png',stock:false},

  {id:443,name:'INTEL I5-14600KF 5.3GHZ 20M BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:432,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX8071514600KF',ean:'53032037278464',
   specs:{'Сокет':'FCLGA1700','Ядра':'14','Нишки':'20','Честота':'Max Turbo Frequency: 5.3 GHz; Performance-core Max Turbo Frequency: 5.3 GHz; Efficient-core Max Turb','Кеш':'20 MB','Памет':'Макс: 192 GB; Memory Types Up to DDR5 5600 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s','TDP':'125 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-14600KF 5.3GHZ 20M BOX 1700 — сокет FCLGA1700, 14 ядра, TDP 125 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37392.jpeg',stock:false},

  {id:444,name:'INTEL I5-14600K 5.3GHZ 20MB BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:457,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX8071514600K',ean:'5032037278447',
   specs:{'Сокет':'FCLGA1700','Ядра':'14','Нишки':'20','Честота':'Max Turbo Frequency:5.3 GHz; Performance-core Max Turbo Frequency:5.3 GHz; Efficient-core Max Turbo ','Кеш':'20 MB','Памет':'Макс: 192 GB | Тип: Up to DDR5 5600 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s','Интегрирана графика':'UHD Graphics 770','TDP':'125 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-14600K 5.3GHZ 20MB BOX 1700 — сокет FCLGA1700, 14 ядра, TDP 125 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37391.jpeg',stock:true},

  {id:445,name:'INTEL I5-14600K 5.3GHZ 20M TRAY 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:388,old:null,pct:null,badge:null,emoji:'🔵',sku:'CM8071504821015',ean:null,
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1700','Ядра':'14','Нишки':'20','Честота':'Max Turbo Frequency: 5.3 GHz;Performance-core Max Turbo Frequency: 5.3 GHz;Efficient-core Max Turbo ','Кеш':'24 MB Smart Cache;Total L2 Cache: 20 MB','Памет':'Max Memory Size:192 GB | Тип: Up to DDR5 5600 MT/s, Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s','Tray':'Yes','Интегрирана графика':'UHD Graphics 770, 300 MHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I5-14600K 5.3GHZ 20M TRAY 1700 — сокет FCLGA1700, 14 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50433.png',stock:false},

  {id:446,name:'INTEL I7-14700F 5.4GHZ 28M BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:588,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX8071514700F',ean:'5032037279246',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1700','Ядра':'20','Нишки':'28','Честота':'5.4 GHz','Кеш':'33 MB Smart Cache;Total L2 Cache: 28 MB','Памет':'Макс: 192 GB | Тип: Up to DDR5 5600 MT/s, Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I7-14700F 5.4GHZ 28M BOX 1700 — сокет FCLGA1700, 20 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51083.png',stock:true},

  {id:447,name:'INTEL I7-14700KF 5.5GHZ 28M BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:613,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX8071514700KF',ean:'5032037278508',
   specs:{'Сокет':'FCLGA1700','Ядра':'20','Нишки':'28','Честота':'Max Turbo Frequency: 5.6 GHz; Turbo Boost Max Technology 3.0 Frequency: ‡ 5.6 GHz; Performance-core ','Кеш':'28 MB','Памет':'Макс: 192 GB | Тип: Up to DDR5 5600 MT/s; Up to DDR4 3200 MT/s | Канали: 2; Max Memory Bandwidth 89.','TDP':'125 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I7-14700KF 5.5GHZ 28M BOX 1700 — сокет FCLGA1700, 20 ядра, TDP 125 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37394.jpeg',stock:false},

  {id:448,name:'INTEL I7-14700K 5.5GHZ 28M BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:683,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX8071514700K',ean:'5032037278485',
   specs:{'Сокет':'FCLGA1700','Ядра':'20','Нишки':'28','Честота':'Max Turbo Frequency: 5.6 GHz; Turbo Boost Max Technology 3.0 Frequency: ‡ 5.6 GHz; Performance-core ','Кеш':'28 MB','Памет':'Max Memory Size (dependent on memory type:) 192 GB | Тип: Up to DDR5 5600 MT/s; Up to DDR4 3200 MT/s','Интегрирана графика':'UHD Graphics 770'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I7-14700K 5.5GHZ 28M BOX 1700 — сокет FCLGA1700, 20 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37393.jpeg',stock:true},

  {id:449,name:'INTEL I7-14700 5.4GHZ 33M TRAY 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:682,old:null,pct:null,badge:null,emoji:'🔵',sku:'CM8071504820817',ean:'4251538816939',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1700','Ядра':'20','Нишки':'28','Честота':'Max Turbo Frequency: 5.4 GHz;Turbo Boost Max Technology 3.0 Frequency: 5.4 GHz;Performance-core Max ','Кеш':'33 MB Smart Cache;Total L2 Cache: 28 MB','Памет':'Max Memory Size:192 GB | Тип: Up to DDR5 5600 MT/s, Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s','Tray':'Yes','Интегрирана графика':'UHD Graphics 770, 300 MHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I7-14700 5.4GHZ 33M TRAY 1700 — сокет FCLGA1700, 20 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50434.png',stock:false},

  {id:450,name:'INTEL I9-14900KF 5.6GHZ 32M BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:810,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX8071514900KF',ean:'5032037278546',
   specs:{'Сокет':'FCLGA1700','Ядра':'24','Нишки':'32','Честота':'Max Turbo Frequency:6 GHz; Thermal Velocity Boost Frequency:6 GHz; Turbo Boost Max Technology 3.0 Fr','Кеш':'Cache:36 MB Smart Cache; Total L2 Cache:32 MB','Памет':'Макс: 192 GB | Тип: Up to DDR5 5600 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s','TDP':'125 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I9-14900KF 5.6GHZ 32M BOX 1700 — сокет FCLGA1700, 24 ядра, TDP 125 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38071.jpeg',stock:true},

  {id:451,name:'INTEL I9-14900K 5.6GHZ 32M BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:847,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX8071514900K',ean:'5032037278522',
   specs:{'Сокет':'FCLGA1700','Ядра':'24','Нишки':'32','Честота':'Max Turbo Frequency: 6 GHz; Thermal Velocity Boost Frequency: 6 GHz; Turbo Boost Max Technology 3.0 ','Кеш':'32 MB','Памет':'Макс: 192 GB | Тип: Up to DDR5 5600 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s','Интегрирана графика':'UHD Graphics 770','TDP':'125 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I9-14900K 5.6GHZ 32M BOX 1700 — сокет FCLGA1700, 24 ядра, TDP 125 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37395.jpeg',stock:true},

  {id:452,name:'INTEL I9-14900F 5.8GHZ 32M BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:895,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX8071514900F',ean:null,
   specs:{'Сокет':'FCLGA1700','Ядра':'24','Нишки':'32','Честота':'Max Turbo Frequency: 5.8 GHz; Thermal Velocity Boost Frequency: 5.8 GHz; Turbo Boost Max Technology ','Кеш':'Cache: 36 MB Smart Cache; Total L2 Cache:32 MB','Памет':'Макс: 192 GB | Тип: Up to DDR5 5600 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I9-14900F 5.8GHZ 32M BOX 1700 — сокет FCLGA1700, 24 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/40315.jpeg',stock:false},

  {id:453,name:'INTEL I9-14900F 5.8GHZ 32M TRAY 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:833,old:null,pct:null,badge:null,emoji:'🔵',sku:'CM8071504820610',ean:null,
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1700','Ядра':'24','Нишки':'32','Честота':'5.8 GHz','Кеш':'Cache: 36 MB Smart Cache; Total L2 Cache: 32 MB','Max. PCI Express Lanes':'20','Памет':'Макс: 192 GB | Тип: Up to DDR5 5600 MT/s, Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s','Tray':'Yes'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I9-14900F 5.8GHZ 32M TRAY 1700 — сокет FCLGA1700, 24 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/100512.jpg',stock:true},

  {id:454,name:'INTEL I9-14900 5.8GHZ 32M BOX 1700',brand:'Intel',cat:'components',subcat:'cpu',
   price:1050,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX8071514900',ean:'5032037279192',
   specs:{'Сокет':'FCLGA1700','Ядра':'24','Нишки':'32','Честота':'Max Turbo Frequency: 5.8 GHz; Thermal Velocity Boost Frequency: 5.8 GHz; Turbo Boost Max Technology ','Кеш':'Cache: 36 MB Smart Cache; Total L2 Cache:32 MB','Памет':'Макс: 192 GB | Тип: Up to DDR5 5600 MT/s; Up to DDR4 3200 MT/s | Канали: 2 | 89.6 GB/s','Интегрирана графика':'UHD Graphics 770','TDP':'65 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel I9-14900 5.8GHZ 32M BOX 1700 — сокет FCLGA1700, 24 ядра, TDP 65 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/40314.jpeg',stock:true},

  {id:455,name:'INTEL CORE ULTRA 5 245 TRAY',brand:'Intel',cat:'components',subcat:'cpu',
   price:482,old:null,pct:null,badge:null,emoji:'🔵',sku:'AT8076806775',ean:'4251538817098',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1851','Ядра':'Total Cores: 14;of Performance-cores: 6;of Efficient-cores: 8','Нишки':'14','Честота':'Max Turbo Frequency: 5.1 GHz;Performance-core Max Turbo Frequency: 5.1 GHz;Efficient-core Max Turbo ','Кеш':'Cache: 24 MB Smart Cache;Total L2 Cache: 26 MB','Памет':'Макс: 256 GB | Тип: Up to DDR5 6400 MT/s | Канали: 2','Tray':'Yes','Интегрирана графика':'GPU Name: Graphics;Graphics Base Frequency: 300 MHz;Graphics Max Dynamic Frequency: 1.9 GHz;GPU Peak'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel INTEL CORE ULTRA 5 245 TRAY — сокет FCLGA1851, Total ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49851.png',stock:true},

  {id:456,name:'INTEL CORE ULTRA 5 225F BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:273,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX80768225F',ean:'5032037282376',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1851','Ядра':'10','Нишки':'10','Честота':'Max Turbo Frequency: 4.9 GHz;Performance-core Max Turbo Frequency: 4.9 GHz;Efficient-core Max Turbo ','Кеш':'20 MB Smart Cache;Total L2 Cache: 22 MB','Памет':'Max Memory Size: 256 GB | Тип: Up to DDR5 6400 MT/s | Канали: 2','Интегрирана графика':'None'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel INTEL CORE ULTRA 5 225F BOX — сокет FCLGA1851, 10 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50435.png',stock:true},

  {id:457,name:'INTEL CORE ULTRA 5 225 BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:308,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX80768225',ean:'5032037282352',
   specs:{'Manufacturer':'INTEL','Сокет':'FCLGA1851','Ядра':'10','Нишки':'10','Честота':'Max Turbo Frequency: 4.9 GHz; Performance-core Max Turbo Frequency: 4.9 GHz; Efficient-core Max Turb','Кеш':'Cache: 20 MB Smart Cache; Total L2 Cache: 22 MB','Max. PCI Express Lanes':'24','Памет':'Макс: 256 GB | Тип: Up to DDR5 6400 MT/s | Канали: 2','Интегрирана графика':'Graphics 300 MHz, 1.8 GHz, TOPS 4','Other':'NPU: AI Boost 13'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel INTEL CORE ULTRA 5 225 BOX — сокет FCLGA1851, 10 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/100196.png',stock:true},

  {id:458,name:'INTEL CORE ULTRA 5 235 BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:477,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX80768235',ean:'5032037282925',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1851','Ядра':'14','Нишки':'14','Честота':'5 GHz','Кеш':'24 MB Smart Cache;Total L2 Cache: 26 MB','Памет':'Макс: 256 GB | Тип: Up to DDR5 6400 MT/s | Канали: 2','Интегрирана графика':'Graphics 300 MHz, 2 GHz, 6 Peak TOPS'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel INTEL CORE ULTRA 5 235 BOX — сокет FCLGA1851, 14 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51084.png',stock:true},

  {id:459,name:'INTEL CORE ULTRA 5 245K BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:385,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB768245KSRQCT',ean:'5032037282086',
   specs:{'Сокет':'FCLGA1851','Ядра':'14;# of Performance-cores 6;# of Efficient-cores 8','Нишки':'14','Честота':'Max Turbo Frequency 5.2 GHz;Performance-core Max Turbo Frequency 5.2 GHz;Efficient-core Max Turbo Fr','Кеш':'24 MB Smart Cache;Total L2 Cache 26 MB','Памет':'Max Memory Size (dependent on memory type) 192 GB;Memory Types Up to DDR5 6400 MT/s;Maximum Memory S','Интегрирана графика':'GPU Name Graphics;Graphics Base Frequency 300 MHz;Graphics Max Dynamic Frequency 1.9 GHz;GPU Peak TO','TDP':'125 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel INTEL CORE ULTRA 5 245K BOX — сокет FCLGA1851, 14;#  ядра, TDP 125 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43041.jpeg',stock:false},

  {id:460,name:'INTEL CORE ULTRA 5 245KF TRAY',brand:'Intel',cat:'components',subcat:'cpu',
   price:337,old:null,pct:null,badge:null,emoji:'🔵',sku:'AT8076806414',ean:'4251538818551',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1851','Ядра':'14','Нишки':'14','Честота':'5.2 GHz','Кеш':'24 MB Smart Cache;Total L2 Cache: 26 MB','Памет':'Макс: 256 GB | Тип: Up to DDR5 6400 MT/s | Канали: 2','Tray':'Yes'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel INTEL CORE ULTRA 5 245KF TRAY — сокет FCLGA1851, 14 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51085.png',stock:false},

  {id:461,name:'INTEL CORE ULTRA 5 245KF BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:357,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX80768245KF',ean:'5032037282109',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1851','Ядра':'Total Cores: 14;# of Performance-cores: 6;# of Efficient-cores: 8','Нишки':'14','Честота':'Max Turbo Frequency: 5.2 GHz;Performance-core Max Turbo Frequency: 5.2 GHz;Efficient-core Max Turbo ','Кеш':'Cache: 24 MB Smart Cache;Total L2 Cache: 26 MB','Памет':'Макс: 256 GB | Тип: Up to DDR5 6400 MT/s;Maximum Memory Speed: 6400 MHz | Канали: 2','Интегрирана графика':'None'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel INTEL CORE ULTRA 5 245KF BOX — сокет FCLGA1851, Total ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49852.png',stock:false},

  {id:462,name:'INTEL CORE ULTRA 7 265F BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:592,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX80768265F',ean:'5032037282734',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1851','Ядра':'20','Нишки':'20','Честота':'5.3 GHz','Кеш':'30 MB Smart Cache;Total L2 Cache: 36 MB','Памет':'Макс: 256 GB | Тип: Up to DDR5 6400 MT/s | Канали: 2'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel INTEL CORE ULTRA 7 265F BOX — сокет FCLGA1851, 20 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51086.png',stock:true},

  {id:463,name:'INTEL CORE ULTRA 7 265KF BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:532,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX80768265KF',ean:'5032037281980',
   specs:{'Сокет':'FCLGA1851','Ядра':'Total Cores 20;# of Performance-cores 8;# of Efficient-cores 12','Нишки':'20','Честота':'Max Turbo Frequency 5.5 GHz;Turbo Boost Max Technology 3.0 Frequency 5.5GHz;Performance-core Max Tur','Кеш':'Cache 30 MB Smart Cache;Total L2 Cache 36 MB','Памет':'Max Memory Size (dependent on memory type) 192 GB;Memory Types Up to DDR5 6400 MT/s;Maximum Memory S'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel INTEL CORE ULTRA 7 265KF BOX — сокет FCLGA1851, Total ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43042.jpeg',stock:true},

  {id:464,name:'INTEL CORE ULTRA 7 265K BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:558,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX80768265K',ean:'5032037282062',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1851','Ядра':'Total Cores: 20;# of Performance-cores: 8;# of Efficient-cores: 12','Нишки':'20','Честота':'Max Turbo Frequency: 5.5 GHz;Turbo Boost Max Technology 3.0 Frequency: 5.5 GHz;Performance-core Max ','Кеш':'Cache: 30 MB Smart Cache;Total L2 Cache: 36 MB','Памет':'Макс: 256 GB | Тип: Up to DDR5 6400 MT/s;Maximum Memory Speed: 6400 MHz | Канали: 2','Интегрирана графика':'GPU Name: Graphics;Graphics Base Frequency: 300 MHz;Graphics Max Dynamic Frequency: 2 GHz;GPU Peak T'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel INTEL CORE ULTRA 7 265K BOX — сокет FCLGA1851, Total ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49853.png',stock:false},

  {id:465,name:'INTEL CORE ULTRA 7 265 BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:642,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX80768265',ean:'5032037282512',
   specs:{'Manufacturer':'INTEL','Сокет':'FCLGA1851','Ядра':'20','Нишки':'20','Честота':'Max Turbo Frequency: 5.3 GHz; Turbo Boost Max Technology 3.0 Frequency: 5.3 GHz; Performance-core Ma','Кеш':'Cache: 30 MB Smart Cache; Total L2 Cache: 36 MB','Max. PCI Express Lanes':'24','Памет':'Макс: 256 GB | Тип: Up to DDR5 6400 MT/s | Канали: 2','Интегрирана графика':'Graphics 300 MHz, 1.95 GHz, TOPS 8','Other':'NPU: AI Boost 13'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel INTEL CORE ULTRA 7 265 BOX — сокет FCLGA1851, 20 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/100202.jpg',stock:true},

  {id:466,name:'INTEL CORE ULTRA 9 285 BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:1026,old:null,pct:null,badge:null,emoji:'🔵',sku:'BX80768285',ean:'5032037282390',
   specs:{'Manufacturer':'Intel','Сокет':'FCLGA1851','Ядра':'24','Нишки':'24','Честота':'5.6 GHz','Кеш':'36 MB Smart Cache;Total L2 Cache: 40 MB','Памет':'Макс: 256 GB | Тип: Up to DDR5 6400 MT/s | Канали: 2','Интегрирана графика':'Graphics 300 MHz, 2 GHz, Peak TOPS 8'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel INTEL CORE ULTRA 9 285 BOX — сокет FCLGA1851, 24 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51087.png',stock:false},

  {id:467,name:'INTEL CORE ULTRA 9 285 TRAY',brand:'Intel',cat:'components',subcat:'cpu',
   price:1001,old:null,pct:null,badge:null,emoji:'🔵',sku:'',ean:null,
   specs:{'Manufacturer':'INTEL','Сокет':'FCLGA1851','Ядра':'24','Нишки':'24','Честота':'Max Turbo Frequency: 5.6 GHz; Thermal Velocity Boost Frequency: 5.6 GHz; Turbo Boost Max Technology ','Кеш':'Cache: 36 MB Smart Cache; Total L2 Cache: 40 MB','Max. PCI Express Lanes':'24','Памет':'Макс: 256 GB | Тип: Up to DDR5 6400 MT/s | Канали: 2','Tray':'Yes','Интегрирана графика':'Graphics 300 MHz, 2 GHz, TOPS 8','Other':'NPU: AI Boost 13'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel INTEL CORE ULTRA 9 285 TRAY — сокет FCLGA1851, 24 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/100201.jpg',stock:true},

  {id:468,name:'INTEL CORE ULTRA 9 285K',brand:'Intel',cat:'components',subcat:'cpu',
   price:1030,old:null,pct:null,badge:null,emoji:'🔵',sku:'INB768285KSRQD5',ean:'5032037281928',
   specs:{'Manufacturer':'INTEL','Сокет':'FCLGA1851','Ядра':'Total Cores: 24;# of Performance-cores: 8;# of Efficient-cores: 16','Нишки':'24','Честота':'Max Turbo Frequency: 5.7 GHz;Thermal Velocity Boost Frequency: 5.7 GHz;Turbo Boost Max Technology 3.','Кеш':'Cache: 36 MB Smart Cache;Total L2 Cache: 40 MB','Памет':'Макс: 192 GB | Тип: Up to DDR5 6400 MT/s;Maximum Memory Speed: 6400 MHz | Канали: 2','Fan':'No','Интегрирана графика':'GPU Name: Graphics;Graphics Base Frequency: 300 MHz;Graphics Max Dynamic Frequency: 2 GHz;GPU Peak T'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel INTEL CORE ULTRA 9 285K — сокет FCLGA1851, Total ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43688.png',stock:false},

  {id:469,name:'Supermicro SM XEON W-2123 3.6GHZ 8.25M',brand:'Supermicro',cat:'components',subcat:'cpu',
   price:440,old:null,pct:null,badge:null,emoji:'🔵',sku:'P4X-SKLW2123-SR3LJ',ean:null,
   specs:{'Честота':'3.6GHz','Ядра':'4','TDP':'120W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Supermicro SM XEON W-2123 3.6GHZ 8.25M, 4 ядра, TDP 120W.',
   img:null,stock:true},

  {id:470,name:'Supermicro SM XEON E-2124 3.3G 8M',brand:'Supermicro',cat:'components',subcat:'cpu',
   price:427,old:null,pct:null,badge:null,emoji:'🔵',sku:'P4X-UPE2124-SR3WQ',ean:null,
   specs:{'Честота':'3.3GHz','Ядра':'4'},
   rating:4.5,rv:0,reviews:[],
   desc:'Supermicro SM XEON E-2124 3.3G 8M, 4 ядра.',
   img:null,stock:false},

  {id:471,name:'INTEL XEON 3.0G/800M/2M PASSIVE',brand:'Intel',cat:'components',subcat:'cpu',
   price:133,old:null,pct:null,badge:null,emoji:'🔵',sku:'',ean:null,
   specs:{'Part number / Product code':'BX80546KG3000FP','Mnfr ID':'-','Model':'XEON 3.0G/800M/2M PASSIVE','Сокет':'Micro-FCPGA','Ядра':'1','Нишки':'-','Честота':'3.00 GHz','Кеш':'2 MB','Интегрирана графика':'-'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel XEON 3.0G/800M/2M PASSIVE — сокет Micro-FCPGA, 1 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/1222.jpeg',stock:true},

  {id:472,name:'INTEL XEON 3.2G/800MHZ/2MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:172,old:null,pct:null,badge:null,emoji:'🔵',sku:'873397',ean:null,
   specs:{'Part number / Product code':'BX80546KG3200FA','Mnfr ID':'873397','Model':'Xeon (3.20GHz, 2M Cache)','Сокет':'PPGA604','Ядра':'1','Нишки':'-','Честота':'3.20 GHz','Кеш':'2 MB L2','Интегрирана графика':'None','TDP':'110 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel XEON 3.2G/800MHZ/2MB BOX — сокет PPGA604, 1 ядра, TDP 110 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/1221.jpeg',stock:true},

  {id:473,name:'INTEL XEON 3.6G/800MHZ/1MB BOX',brand:'Intel',cat:'components',subcat:'cpu',
   price:190,old:null,pct:null,badge:null,emoji:'🔵',sku:'',ean:null,
   specs:{'Part number / Product code':'BX80546KG3600EA','Mnfr ID':'865843','Model':'Xeon','Сокет':'PPGA604','Ядра':'1','Нишки':'-','Честота':'3.60 GHz','Кеш':'1 MB','Интегрирана графика':'None','TDP':'103 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'Intel XEON 3.6G/800MHZ/1MB BOX — сокет PPGA604, 1 ядра, TDP 103 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/2406.jpeg',stock:true},

  {id:474,name:'AMD RYZEN 3 3200G 3.6G BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:91,old:null,pct:null,badge:null,emoji:'🔴',sku:'YD3200C5FHBOX',ean:'0730143309851',
   specs:{'Сокет':'AM4','Ядра':'4','Нишки':'4','Честота':'Base Clock:3.6GHz; Max Boost Clock:4GHz','Кеш':'Total L1 Cache:384KB; Total L2 Cache:2MB; Total L3 Cache:4MB','Памет':'System Memory Specification:2933MHz; System Memory Type:DDR4; Memory Channels:2','Интегрирана графика':'Graphics Frequency:1250 MHz; Graphics Model:Radeon™ Vega 8 Graphics; Graphics Core Count:8','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 3 3200G 3.6G BOX — сокет AM4, 4 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/21225.jpeg',stock:false},

  {id:475,name:'AMD RYZEN 5 3400G 3.7G BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:109,old:null,pct:null,badge:null,emoji:'🔴',sku:'AWYD3400C5FHBOX',ean:'0730143309837',
   specs:{'Essentials':'Graphics Frequency:1400 MHz; Graphics Model:Radeon™ RX Vega 11 Graphics; Graphics Core Count:11','Сокет':'AM4','Ядра':'4','Нишки':'8','Честота':'Base Clock:3.7GHz; Max Boost Clock:4.2GHz','Кеш':'Total L1 Cache:384KB; Total L2 Cache:2MB; Total L3 Cache:4MB','Памет':'System Memory Specification:2933MHz; System Memory Type:DDR4; Memory Channels:2','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 3400G 3.7G BOX — сокет AM4, 4 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/21226.jpeg',stock:false},

  {id:476,name:'AMD RYZEN 5 3600 4.2G BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:119,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000031SBX',ean:null,
   specs:{'Manufacturer':'Advanced Micro Devices;TSMC 7nm FinFET','Essentials':'PCI Express® Version PCIe 4.0 x16','Model':'AMD Ryzen™ 5 Desktop Processors','Ядра':'6','Нишки':'12','Честота':'Base Clock 3.6GHz;Max Boost Clock 4.2GHz','Кеш':'Total L2 Cache 3MB;Total L3 Cache 32MB','Памет':'System Memory Specification 3200MHz;System Memory Type DDR4;Memory Channels 2','Package':'AM4','Интегрирана графика':'None;Discrete Graphics Card Required','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 3600 4.2G BOX, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/21200.jpeg',stock:false},

  {id:477,name:'AMD RYZEN 3 4100 BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:99,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000510BOX',ean:'0730143314060',
   specs:{'Сокет':'AM4','Ядра':'4','Нишки':'8','Честота':'Max. Boost Clock:Up to 4.0GHz; Base Clock:3.8GHz','Кеш':'L1 Cache:256KB; L2 Cache:2MB; L3 Cache:4MB','Памет':'PCI Express® Version:PCIe 3.0; System Memory Type:DDR4; Memory Channels:2; System Memory Specificati','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 3 4100 BOX — сокет AM4, 4 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/31195.jpeg',stock:true},

  {id:478,name:'AMD RYZEN 3 4300G 3.8G 6MB BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:139,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000144BOX',ean:null,
   specs:{'Сокет':'AM4','Ядра':'4','Нишки':'8','Честота':'Max. Boost Clock:Up to 4.0GHz; Base Clock:3.8GHz','Кеш':'6MB','Памет':'PCI Express® Version:PCIe® 3.0; System Memory Type:DDR4; Memory Channels:2; System Memory Specificat','Интегрирана графика':'Radeon™ Graphics','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 3 4300G 3.8G 6MB BOX — сокет AM4, 4 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33470.jpeg',stock:false},

  {id:479,name:'AMD RYZEN 3 PRO 4350G MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:153,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000148MPK',ean:null,
   specs:{'Сокет':'AM4','Ядра':'4','Нишки':'8','Честота':'Max. Boost Clock: Up to 4.0GHz; Base Clock: 3.8GHz','Кеш':'Total L2 Cache: 2MB; Total L3 Cache: 4MB','Памет':'System Memory Type: DDR4; Memory Channels: 2; System Memory Specification: Up to 3200MHz','Интегрирана графика':'Radeon™ Graphics'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 3 PRO 4350G MPK — сокет AM4, 4 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29869.jpeg',stock:false},

  {id:480,name:'AMD RYZEN 5 4500 MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:107,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000644MPK',ean:null,
   specs:{'Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 4.1GHz; Base Clock: 3.6GHz','Кеш':'L1 Cache: 384KB; L2 Cache: 3MB; L3 Cache: 8MB','Памет':'PCI Express® Version: PCIe 3.0; System Memory Type: DDR4; Memory Channels: 2; System Memory Specific','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 4500 MPK — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/30409.jpeg',stock:false},

  {id:481,name:'AMD RYZEN 5 4500 TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:94,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000000644',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 4.1 GHz;Base Clock: 3.6 GHz','Кеш':'L1 Cache: 64 KB;L2 Cache: 512 KB;L3 Cache: 8 MB','Памет':'System Memory Type: DDR4 - Up to 3200 , LPDDR4 - Up to 4266','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 6 \\t1500 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 4500 TRAY — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/46349.jpeg',stock:false},

  {id:482,name:'AMD RYZEN 5 4500 BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:102,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000644BOX',ean:null,
   specs:{'Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock :Up to 4.1GHz; Base Clock:3.6GHz','Кеш':'L1 Cache:384KB; L2 Cache:3MB; L3 Cache:8MB','Памет':'PCI Express® Version:PCIe 3.0; System Memory Type:DDR4; Memory Channels:2; System Memory Specificati','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 4500 BOX — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/31276.jpeg',stock:false},

  {id:483,name:'AMD RYZEN 5 4600G BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:159,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000147BOX',ean:null,
   specs:{'Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock:Up to 4.2GHz; Base Clock:3.7GHz','Кеш':'L1 Cache:384KB; L2 Cache:3MB; L3 Cache:8MB','Памет':'PCI Express® Version:PCIe® 3.0; System Memory Type:DDR4; Memory Channels:2; System Memory Specificat','Интегрирана графика':'Radeon™ Graphics'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 4600G BOX — сокет AM4, 6 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/31065.jpeg',stock:false},

  {id:484,name:'AMD RYZEN 5 PRO 4650G MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:161,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000143MPK',ean:null,
   specs:{'Model':'AMD Ryzen™ PRO Processors','Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'3.7GHz','Кеш':'Total L1 Cache 384KB;Total L2 Cache 3MB;Total L3 Cache 8MB','Памет':'Up to 3200MHz','Package':'MPK','Интегрирана графика':'Radeon™ Graphics','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 PRO 4650G MPK — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/25903.jpeg',stock:false},

  {id:485,name:'AMD RYZEN 3 5300G TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:175,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000000253',ean:'8592978442366',
   specs:{'Manufacturer':'AMD','Сокет':'AM4','Ядра':'4','Нишки':'8','Честота':'Max. Boost Clock: Up to 4.2 GHz;Base Clock: 4 GHz','Кеш':'L2 Cache: 2 MB;L3 Cache: 8 MB','Памет':'System Memory Type: DDR4;Memory Channels: 2;System Memory Specification: Up to 3200 MT/s','Fan':'Not included','Tray':'Yes','Интегрирана графика':'Radeon™ Graphics 6 1700 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 3 5300G TRAY — сокет AM4, 4 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45876.jpeg',stock:false},

  {id:486,name:'AMD RYZEN 5 5500 BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:131,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000457BOX',ean:null,
   specs:{'Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock:Up to 4.2GHz; Base Clock:3.6GHz','Кеш':'L1 Cache:384KB; L2 Cache:3MB; L3 Cache:16MB','Памет':'PCI Express® Version:PCIe 3.0; System Memory Type:DDR4; Memory Channels:2; System Memory Specificati','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5500 BOX — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/30410.jpeg',stock:false},

  {id:487,name:'AMD RYZEN 5 5500GT TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:204,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001489',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 4.4 GHz;Base Clock: 3.6 GHz','Кеш':'L1 Cache: 384 KB;L2 Cache: 3 MB;L3 Cache: 16 MB','Памет':'System Memory Type: DDR4;Memory Channels: 2;Max. Memory: 128 GB;System Memory Subtype: UDIMM;Max Mem','Интегрирана графика':'Radeon™ Graphics 7 1900 MHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5500GT TRAY — сокет AM4, 6 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49305.png',stock:false},

  {id:488,name:'AMD RYZEN 5 5500GT3.6G BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:204,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001489BOX',ean:null,
   specs:{'Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock:Up to 4.4GHz; Base Clock:3.6GHz','Кеш':'L1 Cache:384KB; L2 Cache:3MB; L3 Cache:16MB','Памет':'PCI Express® Version:PCIe® 3.0; System Memory Type:DDR4; Memory Channels:2; Max Memory Speed: 2x1R-D','Интегрирана графика':'Graphics Model:Radeon™ Graphics; Graphics Core Count:7; Graphics Frequency:1900 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5500GT3.6G BOX — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38703.jpeg',stock:false},

  {id:489,name:'AMD RYZEN 5 5600G MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:214,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000252MPK',ean:null,
   specs:{'Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 4.4GHz; Base Clock: 3.9GHz','Кеш':'Total L2 Cache: 3MB; Total L3 Cache 16MB','Памет':'System Memory Type: DDR4; Memory Channels: 2; System Memory Specification: Up to 3200MHz','Интегрирана графика':'Radeon™ Graphics'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5600G MPK — сокет AM4, 6 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29868.jpeg',stock:false},

  {id:490,name:'AMD RYZEN 5 5600G BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:252,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000252BOX',ean:null,
   specs:{'Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 4.4GHz; Base Clock: 3.9GHz','Кеш':'Total L2 Cache: 3MB; Total L3 Cache: 16MB','Памет':'System Memory Type: DDR4; Memory Channels: 2; System Memory Specification: Up to 3200MHz','Интегрирана графика':'Radeon™ Graphics','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5600G BOX — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29259.jpeg',stock:false},

  {id:491,name:'AMD RYZEN 5 5600GT MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:209,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001488MPK',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 4.6 GHz;Base Clock: 3.6 GHz','Кеш':'L1 Cache: 384 KB;L2 Cache: 3 MB;L3 Cache: 16 MB','Памет':'System Memory Type: DDR4;Memory Channels: 2;Max. Memory: 128 GB;System Memory Subtype: UDIMM;System ','Fan':'Yes','Интегрирана графика':'Radeon™ Graphics 7 1900 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5600GT MPK — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45877.jpeg',stock:false},

  {id:492,name:'AMD RYZEN 5 5600GT 3.6G BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:241,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001488BOX',ean:'0730143316002',
   specs:{'Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock:Up to 4.6GHz; Base Clock:3.6GHz','Кеш':'L1 Cache:384KB; L2 Cache:3MB; L3 Cache:16MB','Памет':'PCI Express® Version:PCIe® 3.0; System Memory Type:DDR4; Memory Channels:2; System Memory Specificat','Интегрирана графика':'Graphics Model:Radeon™ Graphics; Graphics Core Count:7; Graphics Frequency:1900 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5600GT 3.6G BOX — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38704.jpeg',stock:false},

  {id:493,name:'AMD RYZEN 5 5600 TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:176,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000927MPK',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 4.4 GHz;Base Clock: 3.5 GHz','Кеш':'L1 Cache: 384 KB;L2 Cache: 3 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'24 , 20 (Total/Usable)','Памет':'System Memory Type DDR4;Memory Channels 2;Max. Memory 128 GB;System Memory Subtype UDIMM;System Memo','Tray':'Yes','Интегрирана графика':'Discrete Graphics Card Required','TDP':'65W','Other':'Architecture: Zen 3;Processor Technology for CPU Cores: TSMC 7nm FinFET;Processor Technology for I/O'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5600 TRAY — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44484.jpeg',stock:false},

  {id:494,name:'AMD RYZEN 5 5600 MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:172,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000927MPK',ean:null,
   specs:{'Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock:Up to 4.4GHz; Base Clock:3.5GHz','Кеш':'L1 Cache:384KB; L2 Cache:3MB; L3 Cache:32MB','Памет':'PCI Express® Version:PCIe 4.0; System Memory Type:DDR4; Memory Channels:2; System Memory Specificati','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5600 MPK — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37868.jpeg',stock:false},

  {id:495,name:'AMD RYZEN 5 5600 BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:157,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000927BOX',ean:null,
   specs:{'Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock:Up to 4.4GHz; Base Clock:3.5GHz','Кеш':'L1 Cache:384KB; L2 Cache:3MB; L3 Cache:32MB','Памет':'PCI Express® Version:PCIe 4.0; System Memory Type:DDR4; Memory Channels:2; System Memory Specificati','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5600 BOX — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/31066.jpeg',stock:false},

  {id:496,name:'AMD RYZEN 5 5600X MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:190,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000065MPK',ean:null,
   specs:{'Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock:Up to 4.6GHz; Base Clock:3.7GHz','Кеш':'L2 Cache:3MB; L3 Cache:32MB','Памет':'PCI Express® Version:PCIe 4.0; System Memory Type:DDR4; System Memory Specification:Up to 3200MHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5600X MPK — сокет AM4, 6 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/30412.jpeg',stock:false},

  {id:497,name:'AMD RYZEN 5 5600X BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:197,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000065BOX',ean:null,
   specs:{'Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 4.6GHz; Base Clock: 3.7GHz','Кеш':'Total L2 Cache: 3MB; Total L3 Cache: 32MB','Памет':'System Memory Type: DDR4; System Memory Specification: Up to 3200MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5600X BOX, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29260.jpeg',stock:false},

  {id:498,name:'AMD RYZEN 5 5600T BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:217,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001584BOX',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock Up to 4.5 GHz;Base Clock 3.5 GHz','Кеш':'L1 Cache 384 KB;L2 Cache 3 MB;L3 Cache 32 MB','Max. PCI Express Lanes':'Total 24;Usable 20','Памет':'System Memory Type DDR4;Memory Channels 2;Max. Memory 128 GB;System Memory Subtype UDIMM;System Memo','Fan':'Wraith Stealth','Интегрирана графика':'Discrete Graphics Card Required','TDP':'65W','Other':'Architecture Zen 3;Processor Technology for CPU Cores TSMC 7nm FinFET;Processor Technology for I/O D'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5600T BOX — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43466.png',stock:false},

  {id:499,name:'AMD RYZEN 5 5600XT TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:196,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000001585',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock Up to 4.7 GHz;Base Clock 3.7 GHz','Кеш':'L1 Cache 384 KB;L2 Cache 3 MB;L3 Cache 32 MB','Max. PCI Express Lanes':'Total 24 / Usable 20','Памет':'System Memory Type: DDR4;Memory Channels: 2;Max. Memory: 128 GB;System Memory Subtype: UDIMM;System ','Fan':'Not included','Tray':'Yes','Интегрирана графика':'Discrete Graphics Card Required','TDP':'65W','Other':'Supported Technologies: AMD StoreMI Technology , AMD Ryzen™ Master Utility , AMD Ryzen™ VR-Ready Pre'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5600XT TRAY — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45886.jpeg',stock:false},

  {id:500,name:'AMD RYZEN 5 5600XT BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:259,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001585BOX',ean:'730143316613',
   specs:{'Manufacturer':'AMD','Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock Up to 4.7 GHz;Base Clock 3.7 GHz','Кеш':'L1 Cache 384 KB;L2 Cache 3 MB;L3 Cache 32 MB','Max. PCI Express Lanes':'Total 24;Usable 20','Памет':'System Memory Type DDR4;Memory Channels 2;Max. Memory 128 GB;System Memory Subtype UDIMM;System Memo','Fan':'Wraith Stealth','Интегрирана графика':'Discrete Graphics Card Required','TDP':'65W','Other':'Architecture Zen 3;Processor Technology for CPU Cores TSMC 7nm FinFET;Processor Technology for I/O D'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 5600XT BOX — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43467.png',stock:false},

  {id:501,name:'AMD RYZEN 5 PRO 5650G MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:212,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000255MPK',ean:null,
   specs:{'Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock:Up to 4.4GHz; Base Clock:3.9GHz','Кеш':'L2 Cache:3MB; L3 Cache:16MB','Памет':'PCI Express® Version:PCIe® 3.0; System Memory Type:DDR4; Memory Channels:2; System Memory Specificat','Интегрирана графика':'Graphics Model:Radeon™ Graphics; Graphics Core Count:7; Graphics Frequency:1900 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 PRO 5650G MPK — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/35325.jpeg',stock:false},

  {id:502,name:'AMD RYZEN 5 PRO 5655G MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:209,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001513MPK',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM4','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 4.4 GHz;Base Clock: 3.9 GHz','Кеш':'L2 Cache: 3 MB;L3 Cache: 16 MB','Памет':'System Memory Type: DDR4;Memory Channels: 2;System Memory Specification: Up to 3200 MT/s','Fan':'Yes','Интегрирана графика':'Graphics Model: Radeon™ Graphics;Graphics Core Count: 7;Graphics Frequency: 1900 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 PRO 5655G MPK — сокет AM4, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49854.png',stock:false},

  {id:503,name:'AMD RYZEN 7 5700G MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:355,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000263MPK',ean:'730143312714',
   specs:{'Сокет':'AM4','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 4.6GHz; Base Clock: 3.8GHz','Кеш':'Total L2 Cache: 4MB; Total L3 Cache: 16MB','Памет':'System Memory Type: DDR4; Memory Channels: 2; System Memory Specification: Up to 3200MHz','Интегрирана графика':'Radeon™ Graphics','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 5700G MPK — сокет AM4, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29867.jpeg',stock:true},

  {id:504,name:'AMD RYZEN 7 5700G BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:327,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000263BOX',ean:'0730143313377',
   specs:{'Сокет':'AM4','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 4.6GHz; Base Clock: 3.8GHz','Кеш':'Total L2 Cache: 4MB; Total L3 Cache: 16MB','Памет':'System Memory Type: DDR4; Memory Channels: 2; System Memory Specification: Up to 3200MHz','Интегрирана графика':'Radeon™ Graphics','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 5700G BOX — сокет AM4, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29261.jpeg',stock:true},

  {id:505,name:'AMD RYZEN 7 5700X TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:237,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000000926',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM4','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock:Up to 4.6GHz;Base Clock:3.4GHz','Кеш':'L1 Cache:512KB;L2 Cache:4MB;L3 Cache:32MB','Памет':'System Memory Type:DDR4;Memory Channels:2;System Memory Specification:Up to 3200MHz;Max Memory Speed','Tray':'Yes','Интегрирана графика':'Discrete Graphics Card Required','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 5700X TRAY — сокет AM4, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/46351.jpeg',stock:false},

  {id:506,name:'AMD RYZEN 7 5700X MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:303,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000926NPK',ean:'0730143317870',
   specs:{'Manufacturer':'AMD','Сокет':'AM4','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 4.6 GHz;Base Clock: 3.4 GHz','Кеш':'L1 Cache: 512 KB;L2 Cache: 4 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'24 , 20 (Total/Usable)','Памет':'NVMe Support: Boot , RAID0 , RAID1 , RAID10;System Memory Type: DDR4;Memory Channels: 2;Max. Memory:','Fan':'Yes','Интегрирана графика':'Discrete Graphics Card Required'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 5700X MPK — сокет AM4, 8 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51901.png',stock:true},

  {id:507,name:'AMD RYZEN 7 5700X BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:306,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000926WOF',ean:'730143314275',
   specs:{'Сокет':'AM4','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock:Up to 4.6GHz; Base Clock:3.4GHz','Кеш':'L1 Cache:512KB; L2 Cache:4MB; L3 Cache:32MB','Памет':'PCI Express® Version:PCIe 4.0; System Memory Type:DDR4; Memory Channels:2; System Memory Specificati','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 5700X BOX — сокет AM4, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/30408.jpeg',stock:false},

  {id:508,name:'AMD RYZEN 7 5700X3D 3.0G TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:317,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000001503',ean:null,
   specs:{'Сокет':'AM4','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock:Up to 4.1GHz;Base Clock:3.0GHz','Кеш':'L1 Cache:512KB;L2 Cache:4MB;L3 Cache:96MB','Памет':'PCI Express® Version:PCIe 4.0;System Memory Type:DDR4;Memory Channels:2;Max Memory Speed: 2x1R-DDR4-','Tray':'Yes'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 5700X3D 3.0G TRAY — сокет AM4, 8 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44976.jpeg',stock:false},

  {id:509,name:'AMD RYZEN 7 5700X3D 3.0G BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:430,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001503WOF',ean:null,
   specs:{'Сокет':'AM4','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock:Up to 4.1GHz; Base Clock:3.0GHz','Кеш':'L1 Cache:512KB; L2 Cache:4MB; L3 Cache:96MB','Памет':'PCI Express® Version:PCIe 4.0; System Memory Type:DDR4; Memory Channels:2; Max Memory Speed: 2x1R-DD','TDP':'105W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 5700X3D 3.0G BOX — сокет AM4, 8 ядра, TDP 105W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38706.jpeg',stock:false},

  {id:510,name:'AMD RYZEN 7 5800X BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:353,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000063WOF',ean:'0730143312714',
   specs:{'Сокет':'AM4','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 4.7GHz; Base Clock: 3.8GHz','Кеш':'Total L2 Cache: 4MB; Total L3 Cache: 32MB','Памет':'System Memory Type: DDR4; System Memory Specification: Up to 3200MHz','TDP':'105W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 5800X BOX — сокет AM4, 8 ядра, TDP 105W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29262.jpeg',stock:false},

  {id:511,name:'AMD RYZEN 7 5800XT BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:373,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001582BOX',ean:'0730143316576',
   specs:{'Model':'AMD RYZEN 7 5800XT','Сокет':'AM4','Ядра':'8','Нишки':'16','Честота':'4.8 GHz','Кеш':'32 MB','Памет':'DDR4 Up to 3200 MHz;Max Boost Clock 16; Up to 4.8 GHz; Base Clock; 3.8 GHz; L1 Cache; 512 KB; L2 Cac','Package':'1.725 lb','TDP':'105 W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 5800XT BOX — сокет AM4, 8 ядра, TDP 105 W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/41484.jpeg',stock:false},

  {id:512,name:'AMD RYZEN 9 5900XT BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:527,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100001581WOF',ean:'730143316552',
   specs:{'Model':'Ryzen 9','Сокет':'AM4','Нишки':'16','Кеш':'Up to 4.8 GHz; 3.3 GHz; L1 Cache 1024 KB; L2 Cache 8 MB; L3 Cache 64 MB;','Памет':'DDR4; Memory Channels 2; Max. Memory 128 GB; Max Memory Speed; 2x1R DDR4-3200; 2x2R DDR4-3200; 4x1R ','Package':'3','Интегрирана графика':'Discrete Graphics Card Required','TDP':'105W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 5900XT BOX — сокет AM4, TDP 105W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/41486.jpeg',stock:false},

  {id:513,name:'AMD RYZEN 9 5950X BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:535,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100000000059WOF',ean:null,
   specs:{'Сокет':'AM4','Ядра':'16','Нишки':'32','Честота':'Max. Boost Clock: Up to 4.9GHz; Base Clock: 3.4GHz','Кеш':'Total L2 Cache: 8MB; Total L3 Cache: 64MB','Памет':'System Memory Type: DDR4; System Memory Specification: Up to 3200MHz','TDP':'105W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 5950X BOX — сокет AM4, 16 ядра, TDP 105W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/29267.png',stock:false},

  {id:514,name:'AMD RYZEN 5 7500F TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:247,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000000597',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 5 GHz;Base Clock: 3.7 GHz','Кеш':'L1 Cache: 384 KB;L2 Cache: 6 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'Total 28 /Usable 24','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 128 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Not included','Tray':'Yes','Интегрирана графика':'Discrete Graphics Card Required','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 7500F TRAY — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45878.png',stock:true},

  {id:515,name:'AMD RYZEN 5 7500F MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:247,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000597MPK',ean:null,
   specs:{'Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock:Up to 5.0GHz; Base Clock:3.7GHz','Кеш':'L1 Cache:384KB; L2 Cache:6MB; L3 Cache:32MB','Памет':'PCI Express® Version:PCIe 5.0; System Memory Type:DDR5; Memory Channels:2; Max Memory Speed:2x1R-DDR','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 7500F MPK — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/36725.png',stock:false},

  {id:516,name:'AMD RYZEN 5 7500X3D TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:399,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000001904',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 4.5 GHz;Base Clock: 4 GHz','Кеш':'L1 Cache: 384 KB;L2 Cache: 6 MB;L3 Cache: 96 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 128 GB;System Memory Subtype: UDIMM;Max Mem','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 7500X3D TRAY — сокет AM5, 6 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51090.png',stock:true},

  {id:517,name:'AMD RYZEN 5 7500X3D BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:430,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001904WOF',ean:'730143318167',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 4.5 GHz;Base Clock: 4 GHz','Кеш':'L1 Cache: 384 KB;L2 Cache: 6 MB;L3 Cache: 96 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 128 GB;System Memory Subtype: UDIMM;Max Mem','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 7500X3D BOX — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50429.png',stock:true},

  {id:518,name:'AMD RYZEN 5 7600X TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:315,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000000593',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 5.3 GHz;Base Clock: 4.7 GHz','Кеш':'L1 Cache: 384 KB;L2 Cache: 6 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'Total 28/Usable 24','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 128 GB;System Memory Subtype: UDIMM;Max Mem','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz','TDP':'105W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 7600X TRAY — сокет AM5, 6 ядра, TDP 105W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/46352.png',stock:true},

  {id:519,name:'AMD RYZEN 5 7600 3.8G 32MB BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:333,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001015BOX',ean:null,
   specs:{'Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock:Up to 5.1GHz; Base Clock:3.8GHz','Кеш':'L1 Cache:384KB; L2 Cache:6MB; L3 Cache:32MB','Памет':'PCI Express® Version:PCIe® 5.0; System Memory Type:DDR5; Memory Channels:2; Max Memory Speed:2x1R-DD','Интегрирана графика':'Graphics Model:AMD Radeon™ Graphics; Graphics Core Count:2; Graphics Frequency:2200 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 7600 3.8G 32MB BOX — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/35197.png',stock:false},

  {id:520,name:'AMD RYZEN 5 7600X 4.7G 38M BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:345,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000593WOF',ean:'0730143314442',
   specs:{'Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock:Up to 5.3GHz; Base Clock:4.7GHz','Кеш':'L1 Cache:384KB; L2 Cache:6MB; L3 Cache:32MB','Памет':'System Memory Type:DDR5; Memory Channels:2; Max Memory Speed: 2x1R-DDR5-5200','Интегрирана графика':'AMD Radeon™ Graphics','TDP':'105W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 7600X 4.7G 38M BOX — сокет AM5, 6 ядра, TDP 105W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33866.jpeg',stock:true},

  {id:521,name:'AMD RYZEN 5 PRO 7445 MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:260,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001899MPK',ean:'730143318051',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 4.3 GHz;Base Clock: 3.3 GHz','Кеш':'L1 Cache: 384 KB;L2 Cache: 6 MB;L3 Cache: 16 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 128 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 PRO 7445 MPK — сокет AM5, 6 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51092.png',stock:true},

  {id:522,name:'AMD RYZEN 5 PRO 7645 MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:300,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000600MPK',ean:'0730143315197',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 5.1 GHz;Base Clock: 3.8 GHz','Кеш':'L1 Cache: 384 KB;L2 Cache: 6 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 128 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 PRO 7645 MPK — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47057.png',stock:true},

  {id:523,name:'AMD RYZEN 7 7700 3.8G 32M TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:364,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000000592',ean:'730143314954',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 5.3 GHz;Base Clock: 3.8 GHz','Кеш':'L1 Cache: 512 KB;L2 Cache: 8 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 128 GB;System Memory Subtype: UDIMM;Max Mem','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 7700 3.8G 32M TRAY — сокет AM5, 8 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52034.png',stock:true},

  {id:524,name:'AMD RYZEN 7 7700 3.8G 32M BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:510,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000592BOX',ean:'0730143314497',
   specs:{'Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock:Up to 5.3GHz; Base Clock:3.8GHz','Кеш':'L1 Cache:512KB; L2 Cache:8MB; L3 Cache:32MB','Памет':'PCI Express® Version:PCIe® 5.0; System Memory Type:DDR5; Memory Channels:2; Max Memory Speed:2x1R-DD','Интегрирана графика':'Graphics Model:AMD Radeon™ Graphics; Graphics Core Count:2; Graphics Frequency:2200 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 7700 3.8G 32M BOX — сокет AM5, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/35198.png',stock:true},

  {id:525,name:'AMD RYZEN 7 7700 MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:412,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000592SPK',ean:'0730143314509',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 5.3 GHz;Base Clock: 3.8 GHz','Кеш':'L1 Cache: 512 KB;L2 Cache: 8 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 128 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 7700 MPK — сокет AM5, 8 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51902.png',stock:true},

  {id:526,name:'AMD RYZEN 7 7700X 4.5G 40M BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:563,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000591WOF',ean:null,
   specs:{'Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock:Up to 5.4GHz; Base Clock:4.5GHz','Кеш':'L1 Cache:512KB; L2 Cache:8MB; L3 Cache:32MB','Памет':'System Memory Type:DDR5; Memory Channels:2; Max Memory Speed: 2x1R-DDR5-5200; 2x2R-DDR5-5200; 4x1R-D','Интегрирана графика':'AMD Radeon™ Graphics','TDP':'105W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 7700X 4.5G 40M BOX — сокет AM5, 8 ядра, TDP 105W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33865.jpeg',stock:false},

  {id:527,name:'AMD RYZEN 7 PRO 7745 MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:378,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000599MPK',ean:'8592978464974',
   specs:{'Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock:Up to 5.3GHz; Base Clock:3.8GHz','Кеш':'L1 Cache:512KB; L2 Cache:8MB; L3 Cache:32MB','Памет':'PCI Express® Version:PCIe® 5.0; System Memory Type:DDR5; Memory Channels:2; Max Memory Speed: 2x1R-D','Интегрирана графика':'Graphics Model:AMD Radeon™ Graphics; Graphics Core Count:2; Graphics Frequency:2200 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 PRO 7745 MPK — сокет AM5, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37965.jpeg',stock:true},

  {id:528,name:'AMD RYZEN 7 7800X3D TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:566,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-1000000910',ean:'4251538815963',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 5 GHz;Base Clock: 4.2 GHz','Кеш':'L1 Cache:512KB;L2 Cache:8MB;L3 Cache:96MB','Max. PCI Express Lanes':'Total 28 /Usable 24','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 128 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Not included','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics;Graphics Core Count: 2;Graphics Frequency: 2200 MHz;USB Type-C® DisplayPort™ Al','TDP':'120W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 7800X3D TRAY — сокет AM5, 8 ядра, TDP 120W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45880.png',stock:false},

  {id:529,name:'AMD RYZEN 7 7800X3D BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:738,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000910WOF',ean:'0730143314930',
   specs:{'Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock:Up to 5.0GHz; Base Clock:4.2GHz','Кеш':'L1 Cache:512KB; L2 Cache:8MB; L3 Cache:96MB','Памет':'PCI Express® Version:PCIe® 5.0; System Memory Type:DDR5; Memory Channels:2; Max Memory Speed: 2x1R; ','Интегрирана графика':'Graphics Model:AMD Radeon™ Graphics; Graphics Core Count:2; Graphics Frequency:2200 MHz','TDP':'120W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 7800X3D BOX — сокет AM5, 8 ядра, TDP 120W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/35195.png',stock:true},

  {id:530,name:'AMD RYZEN 9 7900X TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:560,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000000589',ean:'730143314411',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'12','Нишки':'24','Честота':'Max. Boost Clock: Up to 5.6 GHz;Base Clock: 4.7 GHz','Кеш':'L1 Cache: 768 KB;L2 Cache: 12 MB;L3 Cache: 64 MB','Max. PCI Express Lanes':'Total 28/Usable 24','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 128 GB;System Memory Subtype: UDIMM;Max Mem','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz','TDP':'170W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 7900X TRAY — сокет AM5, 12 ядра, TDP 170W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/46354.jpeg',stock:true},

  {id:531,name:'AMD RYZEN 9 7900X 4.7G 76M BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:615,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000589WOF',ean:'0730143314558',
   specs:{'Ядра':'12','Нишки':'24','Честота':'Max. Boost Clock:Up to 5.6GHz; Base Clock:4.7GHz','Кеш':'L1 Cache:768KB; L2 Cache:12MB; L3 Cache:64MB','Памет':'System Memory Type:DDR5; Memory Channels:2; Max Memory Speed: 2x1R-DDR5-5200; 2x2R-DDR5-5200; 4x1R-D','Интегрирана графика':'AMD Radeon™ Graphics','TDP':'170W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 7900X 4.7G 76M BOX, 12 ядра, TDP 170W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/33867.jpeg',stock:true},

  {id:532,name:'AMD RYZEN 9 7900 MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:552,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000590MPK',ean:'0730143314473',
   specs:{'Сокет':'AM5','Ядра':'12','Нишки':'24','Честота':'Max. Boost Clock:Up to 5.4GHz; Base Clock:3.7GHz','Кеш':'L1 Cache:768KB; L2 Cache:12MB; L3 Cache:64MB','Памет':'PCI Express® Version:PCIe® 5.0; System Memory Type:DDR5; Memory Channels:2; Max Memory Speed: 2x1R-D','Интегрирана графика':'Graphics Model:AMD Radeon™ Graphics; Graphics Core Count:2; Graphics Frequency:2200 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 7900 MPK — сокет AM5, 12 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/36978.jpeg',stock:true},

  {id:533,name:'AMD RYZEN 9 7900 BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:580,old:null,pct:null,badge:null,emoji:'🔴',sku:'100100000590BOX',ean:'730143314466',
   specs:{'Сокет':'AM5','Ядра':'12','Нишки':'24','Честота':'Max. Boost Clock:Up to 5.4GHz; Base Clock:3.7GHz','Кеш':'L1 Cache:768KB; L2 Cache:12MB; L3 Cache:64MB','Памет':'PCI Express® Version:PCIe® 5.0; System Memory Type:DDR5; Memory Channels:2; Max Memory Speed:2x1R-DD','Интегрирана графика':'AMD Radeon™ Graphics','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 7900 BOX — сокет AM5, 12 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/37898.png',stock:true},

  {id:534,name:'AMD RYZEN 9 7900X3D BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:763,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000909WOF',ean:null,
   specs:{'Сокет':'AM5','Ядра':'12','Нишки':'24','Честота':'Max. Boost Clock:Up to 5.6GHz; Base Clock:4.4GHz','Кеш':'L1 Cache:768KB; L2 Cache:12MB; L3 Cache:128MB','Памет':'PCI Express® Version:PCIe® 5.0; System Memory Type:DDR5; Memory Channels:2; Max Memory Speed:2x1R-DD','Интегрирана графика':'Graphics Model:AMD Radeon™ Graphics; Graphics Core Count:2; Graphics Frequency:2200 MHz; GPU Base:40','TDP':'120W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 7900X3D BOX — сокет AM5, 12 ядра, TDP 120W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/34960.png',stock:false},

  {id:535,name:'AMD RYZEN 9 7950X TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:770,old:null,pct:null,badge:null,emoji:'🔴',sku:'RYZEN 9 7950X TRAY',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'16','Нишки':'32','Честота':'Max. Boost Clock: Up to 5.7 GHz;Base Clock: 4.5 GHz','Кеш':'L1 Cache: 1024 KB;L2 Cache: 16 MB;L3 Cache: 64 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 128 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Not included','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz','TDP':'170W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 7950X TRAY — сокет AM5, 16 ядра, TDP 170W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47058.jpeg',stock:false},

  {id:536,name:'AMD RYZEN 9 7950X BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:877,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000514WOF',ean:'730143314534',
   specs:{'Сокет':'AM5','Ядра':'16','Нишки':'32','Честота':'Max. Boost Clock:Up to 5.7GHz; Base Clock:4.5GHz','Кеш':'L1 Cache:1MB; L2 Cache:16MB; L3 Cache:64MB','Памет':'Memory Channels:2 Max Memory Speed: 1x1R-5200 MT/s; 1x2R-5200 MT/s; 2x1R-3600 MT/s; 2x2R-3600 MT/s','Интегрирана графика':'Graphics Model:AMD Radeon™ Graphics; Graphics Core Count:2; Graphics Frequency:2200 MHz; GPU Base:40','TDP':'170W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 7950X BOX — сокет AM5, 16 ядра, TDP 170W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/32171.png',stock:false},

  {id:537,name:'AMD RYZEN 9 7950X3D BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:1278,old:null,pct:null,badge:null,emoji:'🔴',sku:'AW100100000908WOF',ean:null,
   specs:{'Сокет':'AM5','Ядра':'16','Нишки':'32','Честота':'Max. Boost Clock:Up to 5.7GHz; Base Clock:4.2GHz','Кеш':'L1 Cache:1MB; L2 Cache:16MB; L3 Cache:128MB','Памет':'PCI Express® Version:PCIe® 5.0; System Memory Type:DDR5; Memory Channels:2; Max Memory Speed:2x1R-DD','Интегрирана графика':'Graphics Model:AMD Radeon™ Graphics; Graphics Core Count:2; Graphics Frequency:2200 MHz','TDP':'120W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 7950X3D BOX — сокет AM5, 16 ядра, TDP 120W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/35196.jpeg',stock:false},

  {id:538,name:'AMD RYZEN 3 PRO 8300G TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:220,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000001187',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'4','Нишки':'8','Честота':'Max. Boost Clock: Up to 4.9 GHz;Max Zen4c Clock: Up to 3.6 GHz;Base Clock: 3.4 GHz;Zen4 Base Clock: ','Кеш':'L2 Cache: 4 MB;L3 Cache: 8 MB','Max. PCI Express Lanes':'14 , 10','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 256 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Not included','Tray':'Yes','Интегрирана графика':'AMD Radeon™ 740M 4 2600 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 3 PRO 8300G TRAY — сокет AM5, 4 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47059.png',stock:false},

  {id:539,name:'AMD RYZEN 3 PRO 8300G MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:242,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001187MPK',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'4','Нишки':'8','Честота':'Max. Boost Clock Up to 4.9 GHz;Max Zen4c Clock Up to 3.6 GHz;Base Clock 3.4 GHz;Zen4 Base Clock 4 GH','Кеш':'L2 Cache 4 MB;L3 Cache 8 MB','Max. PCI Express Lanes':'Total 14/Usable 10','Памет':'System Memory Type DDR5;Memory Channels 2;Max. Memory 256 GB;System Memory Subtype UDIMM;Max Memory ','Fan':'Wraith Stealth','Интегрирана графика':'Graphics Model: AMD Radeon™ 740M;Graphics Core Count 4;Graphics Frequency 2600 MHz;DirectX® Version ','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 3 PRO 8300G MPK — сокет AM5, 4 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43998.png',stock:false},

  {id:540,name:'AMD RYZEN 5 8400F 4.2G TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:166,old:null,pct:null,badge:null,emoji:'🔴',sku:'RYZEN 5 8400F 4.2G TRAY',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 4.7 GHz;Base Clock: 4.2 GHz','Кеш':'L2 Cache: 6 MB;L3 Cache: 16 MB','Max. PCI Express Lanes':'20 , 16 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 256 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Not included','Tray':'Yes','Интегрирана графика':'Discrete Graphics Card Required','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 8400F 4.2G TRAY — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47060.png',stock:false},

  {id:541,name:'AMD RYZEN 5 8400F 4.2G MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:242,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001591MPK',ean:'0730143316750',
   specs:{'Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock Up to 4.7 GHz;Base Clock 4.2 GHz','Кеш':'L2 Cache 6 MB;L3 Cache 16 MB','Max. PCI Express Lanes':'Total 20/Usable 16','Памет':'System Memory Type DDR5;Memory Channels 2;Max. Memory 256 GB;System Memory Subtype UDIMM;Max Memory ','Fan':'Wraith Stealth','Интегрирана графика':'Discrete Graphics Card Required','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 8400F 4.2G MPK — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44073.png',stock:true},

  {id:542,name:'AMD RYZEN 5 8400F 4.2G BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:245,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001591BOX',ean:'730143316736',
   specs:{'Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock:Up to 4.7 GHz; Base Clock:4.2 GHz','Кеш':'L2 Cache:6 MB; L3 Cache:16 MB','Памет':'System Memory Type:DDR5; Memory Channels:2; Max. Memory:256 GB; System Memory Subtype:UDIMM; Max Mem','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 8400F 4.2G BOX — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/40310.jpeg',stock:true},

  {id:543,name:'AMD RYZEN 5 8500G 4.1G BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:246,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000931BOX',ean:null,
   specs:{'Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock :Up to 5 GHz; Max Zen C Clock :Up to 3.7 GHz; Base Clock :3.5 GHz; Zen4 Base Clock:','Кеш':'L2 Cache:6 MB; L3 Cache:16 MB','Памет':'System Memory Type:DDR5; Memory Channels:2; Max. Memory:256 GB; System Memory Subtype:UDIMM; Max Mem','Интегрирана графика':'AMD Radeon™ 740M','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 8500G 4.1G BOX — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/40311.jpeg',stock:false},

  {id:544,name:'AMD RYZEN 5 PRO 8500G TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:340,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000001183',ean:'5054444595115',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 5 GHz;Base Clock: Up to 3.7 GHz','Кеш':'L2 Cache: 6 MB;L3 Cache: 16 MB','Max. PCI Express Lanes':'Total 14/Usable 10','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 256 GB;System Memory Subtype: UDIMM;Max Mem','Tray':'Yes','Интегрирана графика':'AMD Radeon™ 740M 4 2800 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 PRO 8500G TRAY — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/46355.png',stock:true},

  {id:545,name:'AMD RYZEN 5 PRO 8500G MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:250,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001183MPK',ean:'0730143316460',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 5 GHz;Max Zen4c Clock: Up to 3.7 GHz;Base Clock: 3.5 GHz;Zen4 Base Clock: 4.','Кеш':'L2 Cache: 6 MB;L3 Cache: 16 MB','Max. PCI Express Lanes':'Total 14;Usable 10','Памет':'System Memory Type DDR5;Memory Channels 2;Max. Memory 256 GB;System Memory Subtype UDIMM;Max Memory ','Fan':'Wraith Stealth','Интегрирана графика':'Graphics Model AMD Radeon™ 740M;Graphics Core Count 4;Graphics Frequency 2800 MHz;DirectX® Version 1','TDP':'65W','Other':'Architecture: 2x Zen 4 , 4x Zen 4c;AMD Configurable TDP (cTDP): 45-65W;Processor Technology for CPU '},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 PRO 8500G MPK — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43518.png',stock:false},

  {id:546,name:'AMD RYZEN 5 8600G 4.3G BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:313,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001237BOX',ean:'730143316163',
   specs:{'Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock:Up to 5.0GHz; Base Clock:4.3GHz','Кеш':'L2 Cache:6MB; L3 Cache:16MB','Памет':'PCI Express® Version:PCIe® 4.0; System Memory Type:DDR5; Memory Channels:2 Max Memory Speed: 2x1R-DD','Интегрирана графика':'Graphics Model:AMD Radeon™ 760M; Graphics Core Count:8; Graphics Frequency:2800 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 8600G 4.3G BOX — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/38705.jpeg',stock:true},

  {id:547,name:'AMD RYZEN 5 PRO 8600G TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:299,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000001239',ean:'8592978551469',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 5 GHz;Base Clock: 4.3 GHz','Кеш':'L2 Cache: 6 MB;L3 Cache: 16 MB','Max. PCI Express Lanes':'Total 20/ Usable 16','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 256 GB;System Memory Subtype: UDIMM;Max Mem','Tray':'Yes','Интегрирана графика':'AMD Radeon™ 760M 8 2800 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 PRO 8600G TRAY — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48765.png',stock:true},

  {id:548,name:'AMD RYZEN 5 PRO 8600G MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:307,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001239MPK',ean:'730143316224',
   specs:{'Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock Up to 5 GHz;Base Clock 4.3 GHz','Кеш':'L2 Cache 6 MB;L3 Cache 16 MB','Max. PCI Express Lanes':'Total 20; Usable 16','Памет':'System Memory Type DDR5;Memory Channels2;Max. Memory 256 GB;System Memory Subtype UDIMM;Max Memory S','Интегрирана графика':'Graphics Model AMD Radeon™ 760M;Graphics Core Count 8;Graphics Frequency 2800 MHz;DirectX® Version 1','TDP':'65W','Other':'Architecture Zen 4;AMD Configurable TDP (cTDP) 45-65W;Processor Technology for CPU Cores TSMC 4nm Fi'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 PRO 8600G MPK — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43519.png',stock:true},

  {id:549,name:'AMD RYZEN 7 8700F TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:304,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000001590',ean:'4251538817806',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 5 GHz;Base Clock: 4.1 GHz','Кеш':'L2 Cache: 8 MB;L3 Cache: 16 MB','Max. PCI Express Lanes':'Total 20 /Usable 16','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 256 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Not included','Tray':'Yes','Интегрирана графика':'Graphics Model: Discrete Graphics Card Required;AMD SmartAccess Memory: Available','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 8700F TRAY — сокет AM5, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45881.png',stock:true},

  {id:550,name:'AMD RYZEN 7 8700F MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:317,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001590MPK',ean:'0730143316712',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 5 GHz;Base Clock: 4.1 GHz','Кеш':'L2 Cache: 8 MB;L3 Cache: 16 MB','Max. PCI Express Lanes':'20 , 16 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 256 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Yes','Интегрирана графика':'Discrete Graphics Card Required','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 8700F MPK — сокет AM5, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47061.png',stock:true},

  {id:551,name:'AMD RYZEN 7 8700F BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:431,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001590BOX',ean:'730143316699',
   specs:{'Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock :Up to 5 GHz; Base Clock :4.1 GHz','Кеш':'L2 Cache:8 MB; L3 Cache:16 MB','Памет':'System Memory Type:DDR5 Memory Channels:2 Max. Memory:256 GB System Memory Subtype:UDIMM Max Memory ','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 8700F BOX — сокет AM5, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/40312.jpeg',stock:true},

  {id:552,name:'AMD RYZEN 7 8700G 4.2G BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:458,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001236BOX',ean:null,
   specs:{'Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock :Up to 5.1 GHz; Base Clock :4.2 GHz','Кеш':'L2 Cache:8 MB; L3 Cache:16 MB','Памет':'System Memory Type:DDR5; Memory Channels:2; Max. Memory:256 GB; System Memory Subtype:UDIMM; Max Mem','Интегрирана графика':'AMD Radeon™ 780M','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 8700G 4.2G BOX, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/40313.jpeg',stock:false},

  {id:553,name:'AMD RYZEN 7 8700G 4.2G SR1 BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:467,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001236SBX',ean:'730143317696',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 5.1 GHz;Base Clock: 4.2 GHz','Кеш':'L2 Cache: 8 MB;L3 Cache: 16 MB','Max. PCI Express Lanes':'20 , 16 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 256 GB;System Memory Subtype: UDIMM;Max Mem','Интегрирана графика':'AMD Radeon™ 780M, 2900 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 8700G 4.2G SR1 BOX — сокет AM5, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/50294.png',stock:true},

  {id:554,name:'AMD RYZEN 7 PRO 8700G TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:452,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000001238',ean:'5054444606408',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 5.1 GHz;Base Clock: 4.2 GHz','Кеш':'L2 Cache: 8 MB;L3 Cache: 16 MB','Max. PCI Express Lanes':'20 , 16 (Total/Usable)','Памет':'Max Memory Speed: 2x1R DDR5-5200;2x2R DDR5-5200;4x1R DDR5-3600;4x2R DDR5-3600','Tray':'Yes','Интегрирана графика':'AMD Radeon™ 780M, 12, 2900 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 PRO 8700G TRAY — сокет AM5, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49798.png',stock:true},

  {id:555,name:'AMD RYZEN 7 PRO 8700G MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:508,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001238MPK',ean:'00730143316217',
   specs:{'Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock Up to 5.1 GHz;Base Clock 4.2 GHz','Кеш':'L2 Cache 8 MB;L3 Cache 16 MB','Max. PCI Express Lanes':'Total 20;Usable 16','Памет':'System Memory Type DDR5;Memory Channels 2;Max. Memory 256 GB;System Memory Subtype UDIMM;Max Memory ','Интегрирана графика':'Graphics Model AMD Radeon™ 780M;Graphics Core Count 12;Graphics Frequency 2900 MHz;DirectX® Version ','TDP':'65W','Other':'Architecture Zen 4;AMD Configurable TDP (cTDP) 45-65W;Processor Technology for CPU Cores TSMC 4nm Fi'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 PRO 8700G MPK — сокет AM5, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43520.png',stock:true},

  {id:556,name:'AMD RYZEN 7 PRO 9745 MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:688,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001408MPK',ean:'0730143317986',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 5.4 GHz;Base Clock: 3.8 GHz','Кеш':'L1 Cache: 640 KB;L2 Cache: 8 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 192 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'AMD Wraith Stealth','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 PRO 9745 MPK — сокет AM5, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52330.png',stock:true},

  {id:557,name:'AMD RYZEN 5 9500F TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:325,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000001406',ean:'3807000012203',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 5 GHz;Base Clock: 3.8 GHz','Кеш':'L1 Cache: 480 KB;L2 Cache: 6 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 256 GB;System Memory Subtype: UDIMM;Max Mem','Tray':'Yes','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 9500F TRAY — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52331.png',stock:true},

  {id:558,name:'AMD RYZEN 5 9600 TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:342,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000000718',ean:'0730143316958',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 5.2 GHz;Base Clock: 3.8 GHz','Кеш':'L1 Cache: 480 KB;L2 Cache: 6 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 192 GB;System Memory Subtype: UDIMM;Max Mem','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics, 2, 2200 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 9600 TRAY — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49797.png',stock:true},

  {id:559,name:'AMD RYZEN 5 9600 MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:359,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000718MPK',ean:'730143316958',
   specs:{'Manufacturer':'AMD','Mnfr ID':'28 , 24 (Total/Usable)','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 5.2 GHz;Base Clock: 3.8 GHz','Кеш':'L1 Cache: 480 KB;L2 Cache: 6 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 192 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 9600 MPK — сокет AM5, 6 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/49304.png',stock:true},

  {id:560,name:'AMD RYZEN 5 PRO 9645 MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:503,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001409MPK',ean:'0730143318006',
   specs:{'Manufacturer':'AMD','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 5.4 GHz;Base Clock: 3.9 GHz','Кеш':'L1 Cache: 480 KB;L2 Cache: 6 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 192 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 PRO 9645 MPK, 6 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51093.png',stock:true},

  {id:561,name:'AMD RYZEN 5 9600 BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:377,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000718BOX',ean:'0730143316934',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 5.2 GHz;Base Clock: 3.8 GHz','Кеш':'L1 Cache: 480 KB;L2 Cache: 6 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'Total 28/Usable 24','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 192 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Wraith Stealth','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 9600 BOX — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48766.png',stock:true},

  {id:562,name:'AMD RYZEN 5 9600X 3.9GZ MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:368,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001405MPK',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock Up to 5.4 GHz;Base Clock 3.9 GHz','Кеш':'L1 Cache 480 KB;L2 Cache 6 MB;L3 Cache 32 MB','Max. PCI Express Lanes':'Total 28/Usable 24','Памет':'System Memory Type DDR5;Memory Channels 2;Max. Memory 192 GB;System Memory Subtype UDIMM;Max Memory ','Fan':'Wraith Stealth','Интегрирана графика':'Graphics Model AMD Radeon™ Graphics;Graphics Core Count 2;Graphics Frequency 2200 MHz;USB Type-C® Di','TDP':'65W','Other':'Architecture Zen 5;Multithreading (SMT) Yes;Processor Technology for CPU Cores TSMC 4nm FinFET;Proce'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 9600X 3.9GZ MPK — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43999.jpeg',stock:false},

  {id:563,name:'AMD RYZEN 5 9600X 3.9GZ TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:360,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000001405',ean:'0730143316958',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'Max. Boost Clock: Up to 5.4 GHz;Base Clock: 3.9 GHz','Кеш':'L1 Cache: 480 KB;L2 Cache: 6 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'Total 28/ Usable 24','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 192 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Not included','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics, Core Count 2 2200 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 9600X 3.9GZ TRAY — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48584.jpeg',stock:true},

  {id:564,name:'AMD RYZEN 5 9600X 3.9GZ BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:392,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001405WOF',ean:'0730143315609',
   specs:{'Model':'AMD Ryzen™ 5 9600X','Сокет':'AM5','Ядра':'6','Нишки':'12','Честота':'3.9 GHz','Кеш':'32 MB','Памет':'Memory Channels 2; Max. Memory; 192 GB; UDIMM; 2x1R DDR5-5600; 2x2R DDR5-5600; 4x1R DDR5-3600; 4x2R ','Package':'2','Интегрирана графика':'AMD Radeon™ Graphics;Graphics Core Count 2; 2200 MHz;','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 5 9600X 3.9GZ BOX — сокет AM5, 6 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/41620.jpeg',stock:true},

  {id:565,name:'AMD RYZEN 7 9700X 3.8G TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:490,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000001404',ean:null,
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 5.5 GHz;Base Clock: 3.8 GHz','Кеш':'L1 Cache: 640 KB;L2 Cache: 8 MB;L3 Cache: 32 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 192 GB;System Memory Subtype: UDIMM;Max Mem','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics, 2 Core, 2200 MHz','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 9700X 3.8G TRAY — сокет AM5, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/47056.jpeg',stock:false},

  {id:566,name:'AMD RYZEN 7 9700X 3.8G MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:495,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001404MPK',ean:'0730143316972',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock Up to 5.5 GHz;Base Clock 3.8 GHz','Кеш':'L1 Cache 640 KB;L2 Cache 8 MB;L3 Cache 32 MB','Max. PCI Express Lanes':'Total 28;Usable 24','Fan':'Wraith Stealth','Интегрирана графика':'Graphics Model: AMD Radeon™ Graphics;Graphics Core Count: 2;Graphics Frequency: 2200 MHz;USB Type-C®','TDP':'65W','Other':'Architecture Zen 5;Processor Technology for CPU Cores TSMC 4nm FinFET;Processor Technology for I/O D'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 9700X 3.8G MPK — сокет AM5, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43488.png',stock:true},

  {id:567,name:'AMD RYZEN 7 9700X 3.8G BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:565,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001404WOF',ean:'0730143315593',
   specs:{'Model':'Ryzen 9000 Series','Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'5.5 GHz','Кеш':'640 KB; L2 Cache; 8 MB; L3 Cache; 32 MB;','Памет':'Boot,RAID0,RAID1,RAID5,RAID10; System Memory Type DDR5; Memory Channels 2; Max. Memory 192 GB; Syste','Package':'2','Интегрирана графика':'AMD Radeon™ Graphics; Graphics Core Count 2; Graphics Frequency; 2200 MHz;','TDP':'65W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 9700X 3.8G BOX — сокет AM5, 8 ядра, TDP 65W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/41621.jpeg',stock:true},

  {id:568,name:'AMD RYZEN 7 9800X3D TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:822,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000001084',ean:'3807000011626',
   specs:{'Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock Up to 5.2 GHz;Base Clock 4.7 GHz','Кеш':'L1 Cache 640 KB;L2 Cache 8 MB;L3 Cache 96 MB','Max. PCI Express Lanes':'Total 28/Usable 24','Памет':'System Memory Type DDR5;Memory Channels 2;Max. Memory 192 GB;System Memory Subtype UDIMM;Max Memory ','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2200 MHz, Graphics Core Count 2, USB Type-C® DisplayPort™ Alternate Mode','TDP':'120W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 9800X3D TRAY — сокет AM5, 8 ядра, TDP 120W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44074.png',stock:true},

  {id:569,name:'AMD RYZEN 7 9800X3D BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:835,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001084WOF',ean:'0730143315289',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 5.2 GHz;Base Clock: 4.7 GHz','Кеш':'L1 Cache: 640 KB;L2 Cache: 8 MB;L3 Cache: 96 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type DDR5;Memory Channels 2;Max. Memory 192 GB;System Memory Subtype UDIMM;Max Memory ','Fan':'Not included','Интегрирана графика':'AMD Radeon™ Graphics;Core Count 2;Frequency 2200 MHz;USB Type-C® DisplayPort™ Alternate Mode Yes','TDP':'120W','Other':'Architecture: Zen 5;Processor Technology for CPU Cores: TSMC 4nm FinFET;Processor Technology for I/O'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 9800X3D BOX — сокет AM5, 8 ядра, TDP 120W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44485.jpeg',stock:true},

  {id:570,name:'AMD RYZEN 7 9850X3D TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:840,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001973',ean:'3807000012953',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 5.6 GHz;Base Clock: 4.7 GHz','Кеш':'L1 Cache: 640 KB;L2 Cache: 8 MB;L3 Cache: 96 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 256 GB;System Memory Subtype: UDIMM;Max Mem','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz','TDP':'120W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 9850X3D TRAY — сокет AM5, 8 ядра, TDP 120W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52333.png',stock:true},

  {id:571,name:'AMD RYZEN 7 9850X3D BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:907,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001973WOF',ean:'0730143318280',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'8','Нишки':'16','Честота':'Max. Boost Clock: Up to 5.6 GHz;Base Clock: 4.7 GHz','Кеш':'L1 Cache: 640 KB;L2 Cache: 8 MB;L3 Cache: 96 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 256 GB;System Memory Subtype: UDIMM;Max Mem','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz','TDP':'120W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 7 9850X3D BOX — сокет AM5, 8 ядра, TDP 120W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/52334.png',stock:true},

  {id:572,name:'AMD RYZEN 9 9900X TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:691,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000000662',ean:'4251538819299',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'12','Нишки':'24','Честота':'Max. Boost Clock: Up to 5.6 GHz;Base Clock: 4.4 GHz','Кеш':'L1 Cache: 960 KB;L2 Cache: 12 MB;L3 Cache: 64 MB','Max. PCI Express Lanes':'Total 28 /Usable 24','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 192 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Not included','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz;USB Type-C® DisplayPort™ Alternate Mode','TDP':'120W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 9900X TRAY — сокет AM5, 12 ядра, TDP 120W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45883.png',stock:true},

  {id:573,name:'AMD RYZEN 9 PRO 9945 MPK',brand:'AMD',cat:'components',subcat:'cpu',
   price:820,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001407MPK',ean:'8592978670740',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'12','Нишки':'24','Честота':'Max. Boost Clock: Up to 5.4 GHz;Base Clock: 3.4 GHz','Кеш':'L1 Cache: 960 KB;L2 Cache: 12 MB;L3 Cache: 64 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 192 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 PRO 9945 MPK — сокет AM5, 12 ядра.',
   img:'https://portal.mostbg.com/api/images/imageFileData/51094.png',stock:true},

  {id:574,name:'AMD RYZEN 9 9900X 4.4G 64M BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:708,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000662WOF',ean:'0730143315296',
   specs:{'Model':'AMD Ryzen™ 9 9900X','Сокет':'AM5','Ядра':'12','Нишки':'24','Честота':'Up to 5.6 GHz; Base Clock ; 4.4 GHz;','Кеш':'L1 Cache; 960 KB; L2 Cache; 12 MB; L3 Cache; 64 MB;','Памет':'System Memory Type DDR5; Memory Channels 2; Max. Memory 192 GB; System Memory Subtype UDIMM; Max Mem','Package':'3','Интегрирана графика':'AMD Radeon™ Graphics','TDP':'120W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 9900X 4.4G 64M BOX — сокет AM5, 12 ядра, TDP 120W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/41781.jpeg',stock:true},

  {id:575,name:'AMD RYZEN 9 9900X3D BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:1038,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001368WOF',ean:'0730143315579',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'12','Нишки':'24','Честота':'Max. Boost Clock: Up to 5.5 GHz;Base Clock: 4.4 GHz','Кеш':'L1 Cache: 960 KB;L2 Cache: 12 MB;L3 Cache: 128 MB','Max. PCI Express Lanes':'Total 28/ Usable 24','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 192 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Not included','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz','TDP':'120W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 9900X3D BOX — сокет AM5, 12 ядра, TDP 120W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48767.png',stock:true},

  {id:576,name:'AMD RYZEN 9 9900X3D TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:940,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000001368',ean:'4251538817126',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'12','Нишки':'24','Честота':'Max. Boost Clock: Up to 5.5 GHz;Base Clock: 4.4 GHz','Кеш':'L1 Cache: 960 KB;L2 Cache: 12 MB;L3 Cache: 128 MB','Max. PCI Express Lanes':'Total 28/ Usable 24','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 192 GB;System Memory Subtype: UDIMM;Max Mem','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz','TDP':'120W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 9900X3D TRAY — сокет AM5, 12 ядра, TDP 120W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/48768.png',stock:false},

  {id:577,name:'AMD RYZEN 9 9950X BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:998,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100001277WOF',ean:'730143315272',
   specs:{'Manufacturer':'AMD','Model':'AMD Ryzen™ 9 9950X','Сокет':'AM5','Ядра':'16;Processor Technology for CPU Cores: TSMC 4nm FinFET','Нишки':'32','Кеш':'L1 Cache 1280 KB;L2 Cache 16 MB;L3 Cache 64 MB','Fan':'Not included','Интегрирана графика':'Graphics Model AMD Radeon™ Graphics;Graphics Core Count 2;Graphics Frequency 2200 MHz;USB Type-C® Di','TDP':'170W','Other':'Unlocked for Overclocking Yes;AMD EXPO™ Memory Overclocking Technology Yes;Precision Boost Overdrive'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 9950X BOX — сокет AM5, 16;Pr ядра, TDP 170W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/43307.png',stock:false},

  {id:578,name:'AMD RYZEN 9 9950X TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:877,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000001277',ean:'4251538819282',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'16','Нишки':'32','Честота':'Max. Boost Clock: Up to 5.7 GHz;Base Clock: 4.3 GHz','Кеш':'L1 Cache: 1280 KB;L2 Cache: 16 MB;L3 Cache: 64 MB','Max. PCI Express Lanes':'Total 28 /Usable 24','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 192 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Not included','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics 2 2200 MHz ;USB Type-C® DisplayPort™ Alternate Mode','TDP':'170W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 9950X TRAY — сокет AM5, 16 ядра, TDP 170W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45882.jpeg',stock:false},

  {id:579,name:'AMD RYZEN 9 9950X3D TRAY',brand:'AMD',cat:'components',subcat:'cpu',
   price:1193,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-000000719',ean:'9900004006729',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'16','Нишки':'32','Честота':'Max. Boost Clock: Up to 5.7 GHz;Base Clock: 4.3 GHz','Кеш':'L1 Cache:1280 KB;L2 Cache: 16 MB;L3 Cache: 128 MB','Max. PCI Express Lanes':'Total 28/Usable 24','Памет':'Memory Type: DDR5;Memory Channels: 2;Max. Memory: 192 GB;System Memory Subtype: UDIMM;Max Memory Spe','Fan':'Not included','Tray':'Yes','Интегрирана графика':'AMD Radeon™ Graphics;Graphics Core Count 2;Graphics Frequency: 2200 MHz;USB Type-C® DisplayPort™ Alt','TDP':'170W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 9950X3D TRAY — сокет AM5, 16 ядра, TDP 170W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/45215.jpeg',stock:false},

  {id:580,name:'AMD RYZEN 9 9950X3D BOX',brand:'AMD',cat:'components',subcat:'cpu',
   price:1228,old:null,pct:null,badge:null,emoji:'🔴',sku:'100-100000719WOF',ean:'730143315555',
   specs:{'Manufacturer':'AMD','Сокет':'AM5','Ядра':'16','Нишки':'32','Честота':'Max. Boost Clock: Up to 5.7 GHz;Base Clock: 4.3 GHz','Кеш':'L1 Cache: 1280 KB;L2 Cache: 16 MB;L3 Cache: 128 MB','Max. PCI Express Lanes':'28 , 24 (Total/Usable)','Памет':'System Memory Type: DDR5;Memory Channels: 2;Max. Memory: 192 GB;System Memory Subtype: UDIMM;Max Mem','Fan':'Not Included','Интегрирана графика':'Graphics Model: AMD Radeon™ Graphics;Graphics Core Count: 2;Graphics Frequency: 2200 MHz;USB Type-C®','TDP':'170W'},
   rating:4.5,rv:0,reviews:[],
   desc:'AMD AMD RYZEN 9 9950X3D BOX — сокет AM5, 16 ядра, TDP 170W.',
   img:'https://portal.mostbg.com/api/images/imageFileData/44782.png',stock:true},


];

let cart=[], compareList=[], modalQtyVal=1, modalProductId=null, quickOrderProductId=null, currentFilter='all', currentSort='bestseller';

// ── Persist & restore products from localStorage ──
const _LS_VERSION = '20260420a'; // bump when localStorage schema changes
function persistProducts() {
  try {
    localStorage.setItem('mc_products', JSON.stringify(products));
    localStorage.setItem('mc_products_ver', _LS_VERSION);
  } catch(e) {}
}
// Snapshot static badge/pct/old before localStorage may overwrite them
const _staticProductsMap = Object.fromEntries(products.map(p => [p.id, { old: p.old, pct: p.pct, badge: p.badge }]));
(function restoreProducts() {
  try {
    // Clear stale localStorage if it predates the EAN/SKU corruption fix
    if (localStorage.getItem('mc_products_ver') !== _LS_VERSION) {
      localStorage.removeItem('mc_products');
      localStorage.removeItem('mc_products_ver');
      return;
    }
    const saved = localStorage.getItem('mc_products');
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.length) return;
    // Merge strategy:
    // - data.js is always the base (new products are never lost)
    // - localStorage overrides ONLY if it's the same product (EAN or SKU match)
    //   → prevents old XML imports that reused IDs from corrupting data.js products
    // - localStorage-only products (added via XML import, no data.js match) are appended
    const lsMap = new Map(parsed.map(p => [p.id, p]));
    const dataIds = new Set(products.map(p => p.id));
    const merged = products.map(p => {
      if (!lsMap.has(p.id)) return p;
      const ls = lsMap.get(p.id);
      const sameProduct = (p.ean && ls.ean && p.ean === ls.ean) ||
                          (p.sku && ls.sku && p.sku === ls.sku);
      if (!sameProduct) return p; // ID conflict — data.js wins
      return { ...p, ...ls, id: p.id };
    });
    parsed.forEach(p => { if (!dataIds.has(p.id)) merged.push(p); });
    products.splice(0, products.length, ...merged);
    // Re-sync localStorage with corrected merged state
    try { localStorage.setItem('mc_products', JSON.stringify(products)); } catch(_) {}
  } catch(e) {}
})();


function starsHTML(r){return '★'.repeat(Math.round(r))+'☆'.repeat(5-Math.round(r));}

function makeCard(p,small=false){
  const save=p.old?Math.round(((p.old-p.price)/p.old)*100):0;
  const _eName = escHtml(p.name);
  const imgHtml = p.img
    ? `<img class="product-img-real" src="${escHtml(p.img)}" alt="${_eName}" itemprop="image" loading="lazy" width="300" height="300" decoding="async" onload="this.classList.add('img-loaded')" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-img-emoji is-hidden" aria-hidden="true">${p.emoji}</span>`
    : `<span class="product-img-emoji">${p.emoji}</span>`;
  return `<article class="product-card pos-rel" itemscope itemtype="https://schema.org/Product">
    <div class="product-badge-wrap">
      ${p.badge==='sale'?'<span class="badge badge-sale">Промо</span>':''}
      ${p.badge==='new'?'<span class="badge badge-new">Ново</span>':''}
      ${p.badge==='hot'?'<span class="badge badge-hot">Горещо</span>':''}
      ${p.pct>0?`<span class="badge badge-pct">-${p.pct}%</span>`:''}
      ${p.stock===false?'<span class="badge badge-oos">Изчерпан</span>':p.stock!=null&&p.stock<=5?`<span class="badge badge-low">Последни ${p.stock} бр.</span>`:''}
    </div>
    <button class="product-wishlist" id="wl-${p.id}" type="button" onclick="toggleWishlist(${p.id},event)" title="Добави в любими" aria-label="Добави в любими"><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-heart"/></svg></button>
    <a href="?product=${p.id}" class="product-img-wrap${small?' small':''}" onclick="openProductPage(${p.id});return false;" style="cursor:pointer;" aria-label="${_eName}" itemprop="url">
      ${imgHtml}
    </a>
    <div class="product-body">
      <div class="product-brand" itemprop="brand">${escHtml(p.brand)}</div>
      <h3 class="product-name" itemprop="name"><a href="?product=${p.id}" onclick="openProductPage(${p.id});return false;" style="color:inherit;text-decoration:none;">${_eName}</a></h3>
      <div class="product-rating"><span class="stars">${starsHTML(p.rating)}</span><span class="rating-num">${p.rating} (${p.rv})</span></div>
      <div class="product-footer">
        <div class="price-row">
          <div class="price-current${p.badge==='sale'?' sale':''}" itemprop="offers" itemscope itemtype="https://schema.org/Offer"><meta itemprop="priceCurrency" content="EUR"><link itemprop="availability" href="${p.stock===false?'https://schema.org/OutOfStock':'https://schema.org/InStock'}"><span itemprop="price" content="${p.price}">${fmtPrice(p.price, p.badge==='sale'?'sale':'')}</span></div>
          ${p.old?`<div class="price-old">${fmtEur(p.old)}</div><div class="price-save">-${save}%</div>`:''}
        </div>
        ${p.stock!==false&&p.stock!=null&&p.stock<=5?`<div style="font-size:11px;color:var(--sale);font-weight:700;margin-bottom:5px;">🔥 Последни ${p.stock} бр. в наличност!</div>`:''}
        ${p.stock!==false?`<div class="card-delivery-hint">📦 Доставка до 2 работни дни</div>`:''}
        ${p.price>999&&p.stock!==false?`<div class="card-finance-hint">или от ${Math.ceil(p.price/24)} лв./мес. на изплащане</div>`:''}
        <button type="button" class="add-cart-btn" id="cb-${p.id}" onclick="addToCart(${p.id})" ${p.stock===false?'disabled':''}><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> ${p.stock===false?'Изчерпан':'Добави в кошница'}</button>
        <div class="row-gap-6 card-secondary-btns" style="margin-top:6px;">
          <button type="button" class="product-quick-view-btn" onclick="openProductPage(${p.id})" title="Бърз преглед" style="flex:1;flex-direction:column;gap:3px;"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-eye"/></svg><span style="font-size:10px;color:var(--muted);font-weight:500;">Преглед</span></button>
          <button type="button" onclick="openQuickOrder(${p.id})" title="Бърза поръчка" style="flex:1;flex-direction:column;gap:3px;background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:9px 10px;transition:all 0.2s;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.background='var(--primary-light)'" onmouseout="this.style.background='var(--bg)'"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-bolt"/></svg><span style="font-size:10px;color:var(--muted);font-weight:500;">Бърза поръчка</span></button>
          <button type="button" id="cmp-btn-${p.id}" onclick="toggleCompare(${p.id},!compareList.includes(${p.id}))" title="Сравни" style="flex:1;flex-direction:column;gap:3px;background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:9px 10px;transition:all 0.2s;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.background='var(--primary-light)'" onmouseout="this.style.background=compareList.includes(${p.id})?'var(--primary-light)':'var(--bg)'"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-compare"/></svg><span style="font-size:10px;color:var(--muted);font-weight:500;">Сравни</span></button>
        </div>
      </div>
    </div>
  </article>`;
}


// ===== SKELETON LOADING =====
function showSkeletons(containerId, count=8) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const sk = () => `<div class="skeleton-card">
    <div class="skeleton sk-img"></div>
    <div class="sk-body">
      <div class="skeleton sk-brand"></div>
      <div class="skeleton sk-title"></div>
      <div class="skeleton sk-title2"></div>
      <div class="skeleton sk-stars"></div>
      <div class="skeleton sk-price"></div>
      <div class="skeleton sk-btn"></div>
    </div>
  </div>`;
  el.innerHTML = `<div class="products-row">${Array(count).fill(0).map(sk).join('')}</div>`;
}

// ===== COOKIE BANNER =====
function initCookies() {
  if (!localStorage.getItem('mc_cookies_set')) {
    setTimeout(() => document.getElementById('cookieBanner').classList.add('show'), 1200);
  }
}
function acceptCookies() {
  localStorage.setItem('mc_cookies_set', 'all');
  hideCookieBanner();
  showToast('🍪 Бисквитките са приети');
}
function declineCookies() {
  localStorage.setItem('mc_cookies_set', 'essential');
  hideCookieBanner();
}
function hideCookieBanner() {
  document.getElementById('cookieBanner').classList.remove('show');
}
function openCookieSettings() {
  document.getElementById('cookieModalBackdrop').classList.add('open');
}
function closeCookieSettings(e) {
  if (e.target === e.currentTarget) closeCookieSettingsDirect();
}
function closeCookieSettingsDirect() {
  document.getElementById('cookieModalBackdrop').classList.remove('open');
}
function saveCookieSettings() {
  const prefs = {
    analytics: document.getElementById('ck-analytics')?.checked || false,
    marketing: document.getElementById('ck-marketing')?.checked || false,
    functional: document.getElementById('ck-functional')?.checked || false,
  };
  localStorage.setItem('mc_cookies_set', JSON.stringify(prefs));
  closeCookieSettingsDirect();
  hideCookieBanner();
  showToast('⚙ Настройките са запазени');
}

// ===== SCROLL ANIMATIONS =====
function initSectionAnimations() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('sa-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.section-wrap, .banner-row, .promo-strip, .hp-cats-grid, .sfb-block').forEach(el => {
    el.classList.add('sa-el');
    obs.observe(el);
  });
}

// ===== BACK TO TOP =====
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
function scrollToFeatured() { document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' }); }
function scrollToSale()     { document.getElementById('sale')?.scrollIntoView({ behavior: 'smooth' }); }

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', scrollToTop);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
}

// ===== BOTTOM NAV =====
function setBottomNavActive(id) {
  document.querySelectorAll('.bn-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#' + id).forEach(el => el.classList.add('active'));
}
function closePagesGoHome() {
  ['wishlistPage','contactPage','searchResultsPage','checkoutPage','thankyouPage','myOrdersPage'].forEach(id => {
    document.getElementById(id)?.classList.remove('open');
  });
  document.body.style.overflow = '';
  setBottomNavActive('bn-home');
  window.scrollTo({top:0,behavior:'smooth'});
}
function focusSearch() {
  const inp = document.getElementById('searchInput');
  if (inp) { inp.focus(); inp.scrollIntoView({behavior:'smooth',block:'center'}); }
  setBottomNavActive('bn-search');
}
// Sync bottom nav cart badge with main cart
const _origUpdateCart = typeof updateCart !== 'undefined' ? updateCart : null;
function syncBnCartBadge() {
  const count = cart.reduce((s,x)=>s+x.qty,0);
  document.querySelectorAll('#bnCartBadge').forEach(badge => {
    badge.textContent = count; badge.classList.toggle('show', count>0);
  });
}


// ===== DARK MODE =====
(function(){
  // On mobile screens, always force light mode and clear any saved dark preference
  if (window.innerWidth <= 768) {
    document.body.classList.remove('dark');
    try { localStorage.setItem('mc_dark', '0'); } catch(e){}
    return;
  }
  const saved = localStorage.getItem('mc_dark');
  if(saved === '1') document.body.classList.add('dark');
})();
function _applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  // Also keep body.dark for backward-compat with existing CSS rules
  document.body ? document.body.classList.toggle('dark', dark) : null;
  const dmIcon = document.getElementById('dmIcon');
  if (dmIcon) dmIcon.innerHTML = dark
    ? '<svg width="18" height="18" class="svg-ic" aria-hidden="true"><use href="#ic-sun"/></svg>'
    : '<svg width="18" height="18" class="svg-ic" aria-hidden="true"><use href="#ic-moon"/></svg>';
}
function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const next = !isDark;
  _applyTheme(next);
  try { localStorage.setItem('mc_dark', next ? '1' : '0'); } catch(e) {}
  showToast(next ? '🌙 Тъмен режим включен' : '☀️ Светъл режим');
}
// Restore saved theme on load (before first paint flicker)
(function () {
  let saved = '0';
  try { saved = localStorage.getItem('mc_dark') || '0'; } catch(e) {}
  if (saved === '1') _applyTheme(true);
})();

try { localStorage.removeItem('mc_lang'); } catch(e){}

// ===== LIVE CHAT =====
let chatOpen = false;
setTimeout(() => { const dot = document.getElementById('chatDot'); if(dot) dot.style.display = 'block'; }, 5000);
function toggleChat(){
  chatOpen = !chatOpen;
  document.getElementById('liveChatPopup').classList.toggle('show', chatOpen);
  const ic = document.getElementById('chatBtnIcon'); if(ic) ic.textContent = chatOpen ? '×' : '💬';
  const dot = document.getElementById('chatDot'); if(dot && chatOpen) dot.style.display = 'none';
}
document.addEventListener('click', e => {
  if(chatOpen && !e.target.closest('#liveChatWrap')){
    chatOpen = false;
    document.getElementById('liveChatPopup').classList.remove('show');
    const ic = document.getElementById('chatBtnIcon'); if(ic) ic.textContent = '💬';
  }
});


// ===== LAZY IMAGE LOADING =====
function initLazyImages(){
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting){
          const img = e.target;
          if(img.dataset.src){ img.src=img.dataset.src; img.removeAttribute('data-src'); }
          img.addEventListener('load', () => img.classList.add('img-loaded'), {once:true});
          img.addEventListener('error', () => { img.style.display='none'; const em=img.nextElementSibling; if(em) em.style.display='block'; }, {once:true});
          obs.unobserve(img);
        }
      });
    }, {rootMargin:'200px 0px'});
    document.querySelectorAll('.product-img-real').forEach(img => {
      img.addEventListener('load', () => img.classList.add('img-loaded'), {once:true});
      if(img.complete && img.naturalWidth>0) img.classList.add('img-loaded');
      obs.observe(img);
    });
  } else {
    document.querySelectorAll('.product-img-real').forEach(img => img.classList.add('img-loaded'));
  }
}
setTimeout(initLazyImages, 900);

// ===== TOUCH SWIPE FOR HERO =====
(function(){
  let sx=0;
  const slider = document.querySelector('.hero-slider');
  if(!slider) return;
  slider.addEventListener('touchstart', e => { sx=e.touches[0].clientX; }, {passive:true});
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    const total = document.querySelectorAll('.slide').length;
    if(Math.abs(dx) > 50) goSlide(dx<0 ? (currentSlide+1)%total : (currentSlide-1+total)%total);
  }, {passive:true});
})();



// ===== MEGAMENU =====
const megaCategories = [
  { cat:'laptops',     icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-laptop"/></svg>', name:'Лаптопи' },
  { cat:'desktops',    icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-desktop"/></svg>', name:'Настолни компютри' },
  { cat:'components',  icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-cpu"/></svg>', name:'Компоненти' },
  { cat:'peripherals', icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-mouse"/></svg>', name:'Периферия' },
  { cat:'network',     icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-wifi"/></svg>', name:'Мрежово оборудване' },
  { cat:'storage',     icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-storage"/></svg>', name:'Сървъри и сторидж' },
  { cat:'software',    icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-tag"/></svg>', name:'Софтуер' },
  { cat:'accessories', icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-truck"/></svg>', name:'Аксесоари' },
];
const megaBrands = ['Intel', 'ASUS', 'Acer', 'Microsoft', 'Lenovo', 'Gigabyte', 'LG', 'HP', 'ADATA', 'Sapphire', 'Tenda', 'Kingston', 'Seagate', 'AMD', 'Seasonic', 'ASRock', 'Repotec', 'Realme', 'MSI', 'Tuncmatik', 'Palit', 'Nokia', 'Dynac', 'Cooler Master', 'Fractal', 'NZXT', 'Canon', 'Fnatic', 'GeIL', 'FSP Group', 'Omega', 'Inform UPS', 'QNAP', 'D-Link', 'AV Tech', 'HyperX', 'Anker'];

function openMegamenu() {
  // Render cats
  const catsEl = document.getElementById('megamenuCats');
  if (!catsEl) return;
  catsEl.innerHTML = megaCategories.map(c => {
    const count = products.filter(p=>p.cat===c.cat).length;
    return `<div class="megamenu-cat-card" onclick="megaFilterCat('${c.cat}')">
      <div class="megamenu-cat-icon">${c.icon}</div>
      <div class="megamenu-cat-name">${c.name}</div>
      <div class="megamenu-cat-count">${count} продукта</div>
    </div>`;
  }).join('');

  // Render brands
  var _el_megamenuBrands=document.getElementById('megamenuBrands'); if(_el_megamenuBrands) _el_megamenuBrands.innerHTML = megaBrands.map(b => {
    const count = products.filter(p=>p.brand===b).length;
    return `<div class="megamenu-brand-card" onclick="megaFilterBrand('${b}')">
      <div>${b}</div>
      <div style="font-size:10px;color:var(--muted);margin-top:2px;">${count} продукта</div>
    </div>`;
  }).join('');

  // Render top featured
  const featured = [...products].sort((a,b)=>b.rating-a.rating).slice(0,4);
  var _el_megamenuFeatured=document.getElementById('megamenuFeatured'); if(_el_megamenuFeatured) _el_megamenuFeatured.innerHTML = featured.map(p => makeCard(p)).join('');

  document.getElementById('megamenuPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(initLazyImages, 200);
}

function closeMegamenu() {
  document.getElementById('megamenuPage').classList.remove('open');
  document.body.style.overflow = '';
}

function megaFilterCat(cat) {
  closeMegamenu();
  if (typeof openCatPage === 'function') openCatPage(cat);
  else filterCat(cat);
}

function megaFilterBrand(brand) {
  closeMegamenu();
  const si = document.getElementById('searchInput'); if(si) si.value = brand;
  showSearchResultsPage(brand);
}


// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', e => {
  const tag = document.activeElement.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || document.activeElement.isContentEditable) return;
  if (e.code === 'KeyS') {
    e.preventDefault();
    focusSearch();
  } else if (e.code === 'KeyC') {
    e.preventDefault();
    toggleCart();
  } else if (e.key === 'Escape') {
    const panels = [
      { id: 'cartPanel',            close: toggleCart },
      { id: 'pdpBackdrop',          close: closeProductPage },
      { id: 'productModalBackdrop', close: closeProductModalDirect },
      { id: 'searchResultsPage',    close: closeSearchPage },
      { id: 'wishlistPage',         close: () => { document.getElementById('wishlistPage').classList.remove('open'); document.body.style.overflow = ''; } },
      { id: 'megamenuPage',         close: closeMegamenu },
      { id: 'adminPage',            close: closeAdminPage },
      { id: 'comparePage',          close: closeComparePage, checkFn: el => el.style.display === 'block' },
      { id: 'catPage',              close: () => typeof closeCatPage === 'function' && closeCatPage() },
      { id: 'mobDrawer',            close: () => typeof closeMobMenu === 'function' && closeMobMenu(), checkFn: el => el.classList.contains('open') },
      { id: 'authBackdrop',         close: () => { document.getElementById('authBackdrop').classList.remove('open'); document.body.style.overflow = ''; } },
      { id: 'checkoutPage',         close: () => { if (typeof closeCheckoutPage === 'function') closeCheckoutPage(); else { document.getElementById('checkoutPage').classList.remove('open'); document.body.style.overflow = ''; } } },
      { id: 'blogPage',             close: () => typeof closeBlogPage === 'function' && closeBlogPage() },
      { id: 'servicePage',          close: () => typeof closeServicePage === 'function' && closeServicePage() },
      { id: 'deliveryPage',         close: () => typeof closeDeliveryPage === 'function' && closeDeliveryPage() },
      { id: 'contactsPage',         close: () => typeof closeContactsPage === 'function' && closeContactsPage() },
      { id: 'aboutPage',            close: () => typeof closeAboutPage === 'function' && closeAboutPage(), checkFn: el => el.classList.contains('open') },
      { id: 'myOrdersPage',         close: () => typeof closeMyOrders === 'function' && closeMyOrders() },
    ];
    for (const { id, close, checkFn } of panels) {
      const el = document.getElementById(id);
      const isOpen = el && (checkFn ? checkFn(el) : el.classList.contains('open'));
      if (isOpen) { close(); break; }
    }
  }
});


// ===== 404 PAGE =====
function open404() {
  document.getElementById('page404').classList.add('open');
  document.body.style.overflow='hidden';
}
function close404() {
  document.getElementById('page404').classList.remove('open');
  document.body.style.overflow='';
}


// ===== PRODUCT COMPARISON =====
// toggleCompare, clearCompare, openComparePage, _renderCompareBar and compareIds
// are defined in gallery.js (canonical version using global compareList from data.js).

function closeComparePage() {
  document.getElementById('comparePage').style.display = 'none';
  document.body.style.overflow = '';
}

// ===== MOBILE FILTER DRAWER =====
function toggleMobileFilters() {
  if (window.innerWidth > 1024) return;
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sidebar) return;
  const isOpen = sidebar.classList.contains('mobile-open');
  sidebar.classList.toggle('mobile-open', !isOpen);
  if (overlay) overlay.classList.toggle('active', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
}
function closeMobileFilters() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ===== FOCUS TRAP =====
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

let _trapStack = [];

function trapFocus(containerEl) {
  if (!containerEl) return;
  const prevFocus = document.activeElement;
  _trapStack.push({ el: containerEl, prevFocus });

  function onKeyDown(e) {
    if (e.key !== 'Tab') return;
    const focusable = [...containerEl.querySelectorAll(FOCUSABLE)].filter(el =>
      el.offsetParent !== null && !el.closest('[style*="display: none"]') && !el.closest('[style*="display:none"]')
    );
    if (!focusable.length) { e.preventDefault(); return; }
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  containerEl._trapHandler = onKeyDown;
  document.addEventListener('keydown', onKeyDown);
  const first = containerEl.querySelector(FOCUSABLE);
  if (first) setTimeout(() => first.focus(), 60);
}

function releaseFocus(containerEl) {
  if (!containerEl) return;
  if (containerEl._trapHandler) {
    document.removeEventListener('keydown', containerEl._trapHandler);
    delete containerEl._trapHandler;
  }
  const entry = _trapStack.findIndex(t => t.el === containerEl);
  if (entry !== -1) {
    const { prevFocus } = _trapStack[entry];
    _trapStack.splice(entry, 1);
    try { if (prevFocus && prevFocus.focus) prevFocus.focus(); } catch(e) {}
  }
}

// Auto-hook modals: watch for open/close class changes
(function() {
  const MODAL_IDS = [
    'productModalBackdrop','compareModalBackdrop','quickOrderBackdrop',
    'pdpBackdrop','cartDrawer','searchResultsPage','wishlistPage',
    'cookieModalBackdrop','pwaIosModal','comparePage',
    'authBackdrop','checkoutPage','blogPage','servicePage',
    'deliveryPage','contactsPage','aboutPage','myOrdersPage'
  ];
  function hookModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    new MutationObserver(() => {
      const isOpen = el.classList.contains('open') || el.classList.contains('active') || el.style.display === 'block';
      if (isOpen && !el._trapActive) { el._trapActive = true; trapFocus(el); }
      else if (!isOpen && el._trapActive) { el._trapActive = false; releaseFocus(el); }
    }).observe(el, { attributes: true, attributeFilter: ['class','style'] });
  }
  document.addEventListener('DOMContentLoaded', () => MODAL_IDS.forEach(hookModal));
})();

// ===== SCROLL ANIMATIONS =====
let _scrollAnimObs = null;
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;
  if (_scrollAnimObs) return; // already initialised
  _scrollAnimObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
        _scrollAnimObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  function observeCards() {
    document.querySelectorAll('.product-card:not(.card-visible)').forEach(el => {
      if (!el.classList.contains('card-animate')) el.classList.add('card-animate');
      _scrollAnimObs.observe(el);
    });
  }
  observeCards();
  // Watch for dynamically added cards
  const mo = new MutationObserver(observeCards);
  mo.observe(document.body, { childList: true, subtree: true });
}



// ===== XSS ESCAPE HELPER =====
function _esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ===== GALLERY STATE =====
let galleryImages = [], galleryIdx = 0;

function getProductImages(p) {
  const imgs = [];
  const seen = new Set();

  // Use gallery[] array if present (from XML import), else fall back to img
  const sources = (Array.isArray(p.gallery) && p.gallery.length)
    ? p.gallery
    : (p.img ? [p.img] : []);

  sources.forEach((src, i) => {
    if (src && !seen.has(src)) {
      seen.add(src);
      imgs.push({ src, label: i === 0 ? 'Основна' : `Изглед ${i + 1}` });
    }
  });

  // Always add emoji fallback as last "image"
  imgs.push({ src: null, emoji: p.emoji, label: 'Икона' });
  return imgs;
}

function renderGallery(p, idx=0) {
  galleryImages = getProductImages(p);
  galleryIdx = Math.min(idx, galleryImages.length - 1);
  const imgEl = document.getElementById('modalImg');
  const emojiEl = document.getElementById('modalEmoji');
  const thumbsEl = document.getElementById('modalThumbs');
  const cur = galleryImages[galleryIdx];

  // Show/hide nav arrows
  const prev = document.getElementById('modalNavPrev');
  const next = document.getElementById('modalNavNext');
  if (prev) prev.style.display = galleryImages.length > 1 ? '' : 'none';
  if (next) next.style.display = galleryImages.length > 1 ? '' : 'none';

  // Main image
  if (cur.src) {
    imgEl.style.display = 'block'; emojiEl.style.display = 'none';
    imgEl.src = cur.src; imgEl.alt = p.name;
    imgEl.classList.add('img-loaded');
    imgEl.onerror = () => {
      imgEl.style.display='none'; emojiEl.style.display='block';
      emojiEl.textContent = p.emoji;
      // Remove this thumb from gallery
      galleryImages[galleryIdx] = { src:null, emoji:p.emoji, label:'Икона' };
      renderThumbs(p);
    };
  } else {
    imgEl.style.display = 'none'; emojiEl.style.display = 'block';
    emojiEl.textContent = cur.emoji || p.emoji;
  }
  renderThumbs(p);
}

function renderThumbs(p) {
  const thumbsEl = document.getElementById('modalThumbs');
  if (!thumbsEl || galleryImages.length <= 1) { if(thumbsEl) thumbsEl.innerHTML=''; return; }
  thumbsEl.innerHTML = galleryImages.map((img, i) =>
    `<div class="modal-thumb ${i===galleryIdx?'active':''}" onclick="switchGalleryImg(${i})">
      ${img.src
        ? `<img src="${img.src}" alt="${p.name}" onerror="this.parentElement.style.display='none'">`
        : `<span class="modal-thumb-emoji">${img.emoji||p.emoji}</span>`}
    </div>`
  ).join('');
}

function switchGalleryImg(idx) {
  const p = products.find(x=>x.id===modalProductId); if(!p) return;
  const imgEl = document.getElementById('modalImg');
  imgEl.classList.add('fading');
  setTimeout(() => {
    galleryIdx = idx;
    renderGallery(p, idx);
    imgEl.classList.remove('fading');
  }, 200);
}

function galleryNav(dir) {
  const total = galleryImages.length;
  switchGalleryImg((galleryIdx + dir + total) % total);
}

function openProductModal(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  modalProductId=id;modalQtyVal=1;

  // Track recently viewed
  addToRecentlyViewed(id);

  // Gallery
  renderGallery(p, 0);

  document.getElementById('modalBrand').textContent=p.brand;
  document.getElementById('modalName').textContent=p.name;
  document.getElementById('modalStars').textContent=starsHTML(p.rating);
  document.getElementById('modalRv').textContent=`${p.rating} (${p.rv} ревюта)`;
  const pe=document.getElementById('modalPrice');
  pe.innerHTML=fmtPrice(p.price, p.badge==='sale'?'sale':'');
  pe.className='modal-price'+(p.badge==='sale'?' sale':'');
  const oe=document.getElementById('modalOld'),se=document.getElementById('modalSave');
  if(p.old){oe.textContent=fmtEur(p.old)+' / '+fmtBgn(p.old);se.textContent='-'+Math.round((p.old-p.price)/p.old*100)+'%';se.style.display='';}else{oe.textContent='';se.style.display='none';}
  document.getElementById('modalMonthly').innerHTML='';
  document.getElementById('modalQty').textContent='1';
  document.getElementById('modalSpecs').innerHTML=Object.keys(p.specs).slice(0,4).map(k=>`<div class="spec-chip"><div class="spec-chip-key">${_esc(k)}</div><div class="spec-chip-val">${_esc(p.specs[k])}</div></div>`).join('');
  let b='';if(p.badge==='sale')b+='<span class="badge badge-sale">Промо</span>';if(p.badge==='new')b+='<span class="badge badge-new">Ново</span>';if(p.badge==='hot')b+='<span class="badge badge-hot">Горещо</span>';
  document.getElementById('modalBadges').innerHTML=b;
  document.getElementById('modalDesc').textContent=p.desc;
  var _el_modalSpecsFull=document.getElementById('modalSpecsFull'); if(_el_modalSpecsFull) _el_modalSpecsFull.innerHTML =
    `<div class="spec-chip"><div class="spec-chip-key">SKU</div><div class="spec-chip-val mono-12">${_esc(p.sku)}</div></div>` +
    `<div class="spec-chip"><div class="spec-chip-key">EAN</div><div class="spec-chip-val mono-12">${_esc(p.ean)}</div></div>` +
    Object.entries(p.specs).map(([k,v])=>`<div class="spec-chip"><div class="spec-chip-key">${_esc(k)}</div><div class="spec-chip-val">${_esc(v)}</div></div>`).join('');
  document.getElementById('modalReviews').innerHTML=p.reviews.map(r=>`<div class="review-item"><div class="review-header"><span class="review-name">${_esc(r.name)}</span><span class="review-stars">${starsHTML(r.stars)}</span><span class="review-date">${_esc(r.date)}</span></div><div class="review-text">${_esc(r.text)}</div></div>`).join('');
  switchTab('desc');
  document.getElementById('productModalBackdrop').classList.add('open');document.body.style.overflow='hidden';
}
function closeProductModal(e){if(e.target===e.currentTarget)closeProductModalDirect();}
function closeProductModalDirect(){
  document.getElementById('productModalBackdrop').classList.remove('open');
  document.body.style.overflow='';
  // Restore title if no category page is open
  if (!document.getElementById('catPage')?.classList.contains('open') && !document.getElementById('pdpBackdrop')?.classList.contains('open')) {
    document.title = 'Most Computers — Техника и Електроника';
  }
}
function switchTab(tab){
  document.querySelectorAll('.modal-tab').forEach((t,i)=>t.classList.toggle('active',['desc','specs','reviews'][i]===tab));
  document.querySelectorAll('.modal-tab-content').forEach(c=>c.classList.remove('active'));
  document.getElementById('tab-'+tab).classList.add('active');
}
function changeModalQty(d){modalQtyVal=Math.max(1,modalQtyVal+d);document.getElementById('modalQty').textContent=modalQtyVal;}
function addFromModal(){
  if(!modalProductId)return;const p=products.find(x=>x.id===modalProductId);if(!p)return;
  const ex=cart.find(x=>x.id===modalProductId);if(ex){ex.qty+=modalQtyVal;}else{cart.push({...p,qty:modalQtyVal});}
  updateCart();const btn=document.getElementById('modalAddBtn');
  btn.innerHTML='✓ Добавен!';btn.style.background='var(--new)';
  setTimeout(()=>{btn.innerHTML='🛒 Добави в кошница';btn.style.background='';},2000);
  showToast(`✓ ${p.name.substring(0,32)}... добавен!`);
}

// COMPARE
function toggleCompare(id,checked){
  if(checked){
    const p = products.find(x=>x.id===id);
    if(compareList.length>0){
      const firstCat = products.find(x=>x.id===compareList[0])?.cat;
      if(p.cat !== firstCat){ showToast('⚠️ Можеш да сравняваш само продукти от една и съща категория!'); return; }
    }
    if(compareList.length>=3){showToast('Максимум 3 продукта за сравнение!');return;}
    if(!compareList.includes(id))compareList.push(id);
  }
  else{compareList=compareList.filter(x=>x!==id);}
  // Update button visual state
  const btn=document.getElementById('cmp-btn-'+id);
  if(btn) btn.style.background=compareList.includes(id)?'var(--primary-light)':'var(--bg)';
  updateCompareBar();
}
function updateCompareBar(){
  const bar=document.getElementById('compareBar');
  const preview=document.getElementById('comparePreview');
  const cnt=document.getElementById('compareCnt');
  if(compareList.length===0){bar.classList.remove('visible');return;}
  bar.classList.add('visible');
  if(cnt) cnt.textContent=compareList.length;
  let html='';
  for(let i=0;i<3;i++){
    if(i<compareList.length){const p=products.find(x=>x.id===compareList[i]);if(!p){compareList.splice(i,1);updateCompareBar();return;}html+=`<div class="compare-slot filled"><span class="compare-slot-emoji">${p.emoji}</span><span class="compare-slot-name">${p.name.length>22?p.name.slice(0,22)+'…':p.name}</span><button type="button" class="compare-slot-remove" onclick="removeCompare(${p.id})">×</button></div>`;}
    else html+=`<div class="compare-slot"><span style="color:rgba(255,255,255,0.4);font-size:11px;">+ Добави продукт</span></div>`;
  }
  if(preview) preview.innerHTML=html;
}

function openComparePage(){
  if(compareList.length<2){showToast('Избери поне 2 продукта за сравнение!');return;}
  const prods=compareList.map(id=>products.find(x=>x.id===id)).filter(Boolean);
  if(prods.length<2){showToast('Избери поне 2 налични продукта!');return;}
  const allKeys=[...new Set(prods.flatMap(p=>Object.keys(p.specs||{})))];
  const minP=Math.min(...prods.map(p=>p.price)),maxR=Math.max(...prods.map(p=>p.rating));
  let html=`<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:13px;">`;
  html+=`<thead><tr><th style="text-align:left;padding:12px;background:var(--bg2);border-radius:8px 0 0 0;">Продукт</th>`;
  prods.forEach(p=>html+=`<td style="padding:16px;text-align:center;background:var(--bg2);border-left:1px solid var(--border);"><span style="font-size:36px;display:block;margin-bottom:8px;">${p.emoji}</span><div style="font-weight:800;font-size:14px;margin-bottom:4px;">${p.name}</div><div style="font-size:18px;font-weight:900;color:var(--primary);">${fmtEur(p.price)}</div><div style="font-size:11px;color:var(--muted);">${fmtBgn(p.price)}</div><button type="button" onclick="addToCart(${p.id})" style="margin-top:10px;background:var(--primary);color:#fff;border:none;border-radius:8px;padding:8px 16px;font-size:12px;font-weight:700;cursor:pointer;">🛒 Добави</button></td>`);
  html+=`</tr></thead><tbody>`;
  html+=`<tr><th style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);">Цена</th>`;
  prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);${p.price===minP?'background:var(--primary-light);font-weight:800;color:var(--primary);':''}">${fmtEur(p.price)}</td>`);
  html+=`</tr><tr><th style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);">Рейтинг</th>`;
  prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);${p.rating===maxR?'background:var(--primary-light);font-weight:800;':''}">${starsHTML(p.rating)} ${p.rating}</td>`);
  html+=`</tr>`;
  allKeys.forEach(k=>{
    html+=`<tr><th style="text-align:left;padding:10px 12px;background:var(--bg);border-top:1px solid var(--border);color:var(--muted);font-weight:600;">${k}</th>`;
    prods.forEach(p=>html+=`<td style="padding:10px 12px;text-align:center;border-top:1px solid var(--border);border-left:1px solid var(--border);">${(p.specs||{})[k]||'—'}</td>`);
    html+=`</tr>`;
  });
  html+=`</tbody></table></div>`;
  document.getElementById('compareTable').innerHTML=html;
  document.getElementById('comparePage').style.display='block';
  document.body.style.overflow='hidden';
}
function removeCompare(id){compareList=compareList.filter(x=>x!==id);const btn=document.getElementById('cmp-btn-'+id);if(btn)btn.style.background='var(--bg)';updateCompareBar();}
function clearCompare(){compareList.forEach(id=>{const cb=document.getElementById('cmp-'+id);if(cb)cb.checked=false;});compareList=[];updateCompareBar();}
function openCompareModal(){
  if(compareList.length<2){showToast('Избери поне 2 продукта!');return;}
  const prods=compareList.map(id=>products.find(x=>x.id===id)).filter(Boolean);
  if(prods.length<2){showToast('Избери поне 2 налични продукта!');return;}
  const allKeys=[...new Set(prods.flatMap(p=>Object.keys(p.specs)))];
  const minP=Math.min(...prods.map(p=>p.price)),maxR=Math.max(...prods.map(p=>p.rating));
  let html=`<thead><tr><th>Продукт</th>`;
  prods.forEach(p=>html+=`<td class="cmp-product-header"><span class="cmp-emoji">${p.emoji}</span><div class="cmp-name">${p.name}</div><div class="cmp-price">${fmtEur(p.price)}<span class="text-11-muted-block">${fmtBgn(p.price)}</span></div><button type="button" class="cmp-add-btn" onclick="addToCart(${p.id})">🛒 Добави</button></td>`);
  html+=`</tr></thead><tbody><tr><th>Цена</th>`;
  prods.forEach(p=>html+=`<td class="${p.price===minP?'cmp-highlight':''}">${fmtEur(p.price)}<span class="text-11-muted-block">${fmtBgn(p.price)}</span></td>`);
  html+=`</tr><tr><th>Рейтинг</th>`;
  prods.forEach(p=>html+=`<td class="${p.rating===maxR?'cmp-highlight':''}">${starsHTML(p.rating)} ${p.rating}</td>`);
  html+=`</tr>`;
  allKeys.forEach(k=>{html+=`<tr><th>${_esc(k)}</th>`;prods.forEach(p=>html+=`<td>${_esc(p.specs[k]||'—')}</td>`);html+=`</tr>`;});
  html+=`</tbody>`;
  document.getElementById('compareTableModal').innerHTML=html;
  document.getElementById('compareModalBackdrop').classList.add('open');document.body.style.overflow='hidden';
}
function closeCompareModal(e){if(e.target===e.currentTarget)closeCompareModalDirect();}
function closeCompareModalDirect(){document.getElementById('compareModalBackdrop').classList.remove('open');document.body.style.overflow='';}

// QUICK ORDER
function openQuickOrder(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  quickOrderProductId=id;
  document.getElementById('qoEmoji').textContent=p.emoji;
  document.getElementById('qoName').textContent=p.name;
  document.getElementById('qoPrice').textContent=fmtEur(p.price)+' / '+fmtBgn(p.price);
  document.getElementById('qoFormWrap').style.display='';
  document.getElementById('qoSuccess').classList.remove('show');
  ['qoName2','qoPhone','qoCity','qoAddr','qoNote'].forEach(fid=>{const el=document.getElementById(fid);if(el){el.value='';el.classList.remove('error');}});
  document.getElementById('quickOrderBackdrop').classList.add('open');document.body.style.overflow='hidden';
}
function closeQuickOrder(e){if(e.target===e.currentTarget)closeQuickOrderDirect();}
function closeQuickOrderDirect(){document.getElementById('quickOrderBackdrop').classList.remove('open');document.body.style.overflow='';}
function selectDelivery(el){document.querySelectorAll('.qo-delivery-opt').forEach(o=>o.classList.remove('selected'));el.classList.add('selected');}
function submitQuickOrder(){
  let ok=true;
  ['qoName2','qoPhone','qoCity','qoAddr'].forEach(fid=>{const el=document.getElementById(fid);if(!el.value.trim()){el.classList.add('error');ok=false;}else el.classList.remove('error');});
  if(!ok){showToast('Попълни всички задължителни полета!');return;}
  document.getElementById('qoFormWrap').style.display='none';
  document.getElementById('qoSuccess').classList.add('show');
  showToast('Поръчката е изпратена успешно!');
  setTimeout(closeQuickOrderDirect,4000);
}

// SLIDER
let currentSlide=0;
const slides=document.querySelectorAll('.slide'),dots=document.querySelectorAll('.dot');
function goSlide(n){if(!slides.length||!slides[n])return;slides[currentSlide].classList.remove('active');dots[currentSlide].classList.remove('active');dots[currentSlide].removeAttribute('aria-current');currentSlide=n;slides[currentSlide].classList.add('active');dots[currentSlide].classList.add('active');dots[currentSlide].setAttribute('aria-current','true');}
let _heroSliderIv=null;
if(slides.length){if(_heroSliderIv)clearInterval(_heroSliderIv);_heroSliderIv=setInterval(()=>goSlide((currentSlide+1)%slides.length),5000);}

// COUNTDOWN — persistent across page reloads via localStorage
(function(){
  const DURATION = 4*3600; // 4 hours flash sale window
  let endTs = 0;
  try { endTs = parseInt(localStorage.getItem('mc_flash_end')||'0'); } catch(e) {}
  if(!endTs || Date.now() > endTs) {
    endTs = Date.now() + DURATION*1000;
    try { localStorage.setItem('mc_flash_end', endTs); } catch(e) {}
  }
  function tick(){
    let totalSecs = Math.max(0, Math.floor((endTs - Date.now())/1000));
    const th=document.getElementById('th'),tm=document.getElementById('tm'),ts=document.getElementById('ts');
    if(th) th.textContent=String(Math.floor(totalSecs/3600)).padStart(2,'0');
    if(tm) tm.textContent=String(Math.floor((totalSecs%3600)/60)).padStart(2,'0');
    if(ts) ts.textContent=String(totalSecs%60).padStart(2,'0');
    if(totalSecs===0){ localStorage.removeItem('mc_flash_end'); }
  }
  tick();
  if(window._countdownIv)clearInterval(window._countdownIv);
  window._countdownIv=setInterval(tick,1000);
})();

// TOAST
function showToast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2800);}


// CART
function saveCart(){try{localStorage.setItem('mc_cart',JSON.stringify(cart.map(x=>({id:x.id,qty:x.qty}))));} catch(e){}}
function loadCart(){
  try{
    const saved=JSON.parse(localStorage.getItem('mc_cart')||'[]');
    if(saved.length){cart=saved.map(x=>{const p=products.find(p=>p.id===x.id);return p?{...p,qty:x.qty}:null;}).filter(Boolean);updateCart();}
  }catch(e){}
}

function addToCart(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  const ex=cart.find(x=>x.id===id);if(ex){ex.qty++;}else{cart.push({...p,qty:1});}
  updateCart();saveCart();
  const btn=document.getElementById('cb-'+id);
  if(btn){btn.classList.add('added');btn.innerHTML='✓ Добавен';btn.disabled=true;setTimeout(()=>{btn.classList.remove('added');btn.innerHTML='<svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> Добави в кошница';btn.disabled=false;},1200);}
  showToast(`✓ ${p.name.substring(0,32)}... добавен!`);
  if (!document.getElementById('recPanel')) showRecommended(p);
}

function showRecommended(p) {
  const inCart = new Set(cart.map(x => x.id));
  let recs = products.filter(x => x.id !== p.id && x.cat === p.cat && !inCart.has(x.id));
  if (recs.length < 2) recs = products.filter(x => x.id !== p.id && !inCart.has(x.id));
  recs = recs.slice(0, 3);
  if (!recs.length) return;

  const panel = document.createElement('div');
  panel.id = 'recPanel';
  panel.style.cssText = 'position:fixed;bottom:80px;right:20px;z-index:2000;background:var(--white);border:1px solid var(--border);border-radius:14px;padding:14px 16px;max-width:300px;width:calc(100vw - 40px);box-shadow:0 8px 32px rgba(0,0,0,0.18);opacity:0;transform:translateY(10px);transition:opacity 0.25s,transform 0.25s;';
  panel.innerHTML = `
    <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:10px;">Клиентите купуват и…</div>
    ${recs.map(r => `
      <div onclick="openProductPage(${r.id})" style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);cursor:pointer;">
        <div style="font-size:22px;min-width:34px;text-align:center;">${r.emoji}</div>
        <div style="flex:1;min-width:0;">
          <div style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.name.length>32?r.name.substring(0,32)+'…':r.name}</div>
          <div style="font-size:12px;color:var(--primary);font-weight:700;">${fmtEur(r.price)}</div>
        </div>
        <button type="button" onclick="event.stopPropagation();addToCart(${r.id})" style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:5px 10px;font-size:11px;cursor:pointer;white-space:nowrap;font-family:'Outfit',sans-serif;font-weight:700;">+</button>
      </div>`).join('')}
    <button type="button" onclick="document.getElementById('recPanel').remove()" style="width:100%;margin-top:8px;background:none;border:none;color:var(--muted);font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;padding:4px;">Затвори ×</button>`;
  document.body.appendChild(panel);
  requestAnimationFrame(() => { panel.style.opacity = '1'; panel.style.transform = 'translateY(0)'; });
  panel._t = setTimeout(() => { panel.style.opacity = '0'; setTimeout(() => panel.remove(), 280); }, 8000);
}
function addToCartById(id){addToCart(id);}
const FREE_SHIP_BGN = Math.round(100 * EUR_RATE * 100) / 100; // 100 EUR в лева

// Social proof counter — random-ish but deterministic per day so it feels real
(function initCartSocialProof() {
  const sp = document.getElementById('cartSocialProof');
  const txt = document.getElementById('cartSpText');
  if (!sp || !txt) return;
  // Seed by day so number changes daily but stays stable per session
  const seed = Math.floor(Date.now() / 86400000);
  const n = 28 + (seed % 41); // 28–68
  txt.textContent = `${n} души поръчаха от нас днес`;
  sp.style.display = '';
})();
function updateCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const badge=document.getElementById('cartBadge');if(badge)badge.textContent=count;
  const cartTotalEl=document.getElementById('cartTotal');if(cartTotalEl)cartTotalEl.textContent=fmtEur(total) + ' / ' + fmtBgn(total);
  // sync PDP mini-header cart badge
  const pdpB = document.getElementById('pdpMhdrCartBadge');
  if(pdpB){pdpB.textContent=count;pdpB.style.display=count>0?'':'none';}
  // sync bottom nav badges (two nav bars exist — update all)
  document.querySelectorAll('#bnCartBadge, #bnCartBadge2').forEach(bnB => {
    bnB.textContent=count; bnB.classList.toggle('show',count>0);
  });
  const body=document.getElementById('cartBody');
  if(!body)return;
  if(cart.length===0){body.innerHTML='<div class="cart-empty-msg"><div class="ce-icon"><svg width="44" height="44" class="svg-ic" aria-hidden="true" style="opacity:.25"><use href="#ic-cart"/></svg></div><p>Кошницата е празна.<br>Добави продукти!</p></div>';
    // Return focus to cart icon button when cart becomes empty and panel is open
    const panel=document.getElementById('cartPanel');
    if(panel&&panel.classList.contains('open')){const cartBtn=document.querySelector('[onclick*="toggleCart"]')||document.querySelector('#cartIcon');if(cartBtn)cartBtn.focus();}
    return;}
  let html=cart.map(x=>`<div class="cart-item-row"><div class="ci-emoji">${escHtml(x.emoji||'')}</div><div class="ci-details"><div class="ci-name">${escHtml(x.name||'')}</div><div class="ci-price">${fmtEur(x.price*x.qty)}<span class="text-11-muted-block">${fmtBgn(x.price*x.qty)}</span></div><div class="ci-qty"><button type="button" class="qty-btn" onclick="changeQty(${x.id},-1)">−</button><span class="qty-num">${x.qty}</span><button type="button" class="qty-btn" onclick="changeQty(${x.id},1)">+</button></div></div><button type="button" class="ci-remove" onclick="removeFromCart(${x.id})">×</button></div>`).join('');
  // Free shipping progress bar + delivery row
  const pct=Math.min(100,(total/FREE_SHIP_BGN)*100);
  const deliveryRow=document.getElementById('cartDeliveryRow');
  const deliveryVal=document.getElementById('cartDeliveryVal');
  if(total>=FREE_SHIP_BGN){
    html+=`<div class="cart-ship-bar"><div class="cart-ship-msg ship-free">🎉 Имаш безплатна доставка!</div><div class="cart-ship-progress"><div class="cart-ship-fill" style="transform:scaleX(1)"></div></div></div>`;
    if(deliveryRow) deliveryRow.style.display='none';
  }else{
    const rem=(FREE_SHIP_BGN-total).toFixed(2);
    html+=`<div class="cart-ship-bar"><div class="cart-ship-msg">Добави още <strong>${rem} лв.</strong> за безплатна доставка!</div><div class="cart-ship-progress"><div class="cart-ship-fill" style="transform:scaleX(${(pct/100).toFixed(3)})"></div></div></div>`;
    if(deliveryRow) deliveryRow.style.display='flex';
    if(deliveryVal) deliveryVal.textContent='5.99 лв.';
  }
  // COD fee notice — always visible so no surprise at checkout
  html += `<div style="font-size:11px;color:var(--muted);padding:6px 10px;background:var(--bg2);border-radius:6px;margin-top:6px;">
    💳 Карта/превод — без такса &nbsp;|&nbsp; 📦 Наложен платеж — +1.50 лв.
  </div>`;
  // Promo code hint — show when no promo applied and subtotal ≥ 80 лв.
  if (!promoApplied && total >= 80) {
    html += `<div class="cart-promo-hint" onclick="handleCheckout()" title="Приложи при поръчка">
      🎁 Имаш промо код? <strong>MOSTCOMP10</strong> дава <strong>-10%</strong> от поръчката!
    </div>`;
  }
  // Recently viewed not in cart
  try{
    const rvIds=JSON.parse(localStorage.getItem('mc_rv')||'[]');
    const inCart=new Set(cart.map(x=>x.id));
    const rvItems=rvIds.map(id=>products.find(p=>p.id===id)).filter(p=>p&&!inCart.has(p.id)).slice(0,3);
    if(rvItems.length){
      html+=`<div class="cart-rv-section"><div class="cart-rv-title">Забрави ли нещо?</div><div class="cart-rv-list">${rvItems.map(p=>`<div class="cart-rv-item"><div class="cart-rv-emoji">${escHtml(p.emoji||'')}</div><div class="cart-rv-info"><div class="cart-rv-name">${escHtml(p.name.length>28?p.name.substring(0,28)+'…':p.name)}</div><div class="cart-rv-price">${fmtEur(p.price)}</div></div><button type="button" class="cart-rv-add" onclick="addToCart(${p.id})" title="Добави">+</button></div>`).join('')}</div></div>`;
    }
  }catch(e){}
  body.innerHTML=html;
  // Sidebar upsell — show 2 products from cart categories not already in cart
  const upsellEl=document.getElementById('cartUpsell');
  if(upsellEl){
    const inCart=new Set(cart.map(x=>x.id));
    const cats=cart.map(x=>x.cat);
    let upsellProds=products.filter(x=>!inCart.has(x.id)&&cats.includes(x.cat)&&x.stock!==false).sort((a,b)=>(b.rv||0)-(a.rv||0)).slice(0,2);
    if(!upsellProds.length) upsellProds=products.filter(x=>!inCart.has(x.id)&&x.stock!==false).sort((a,b)=>(b.rv||0)-(a.rv||0)).slice(0,2);
    if(upsellProds.length){
      upsellEl.style.display='';
      upsellEl.innerHTML=`<div class="cart-upsell-title">⚡ Може да те заинтересува</div><div class="cart-upsell-items">${upsellProds.map(p=>`<div class="cu-item"><div class="cu-emoji">${escHtml(p.emoji||'')}</div><div class="cu-info"><div class="cu-name">${escHtml(p.name.length>30?p.name.substring(0,30)+'…':p.name)}</div><div class="cu-price">${fmtEur(p.price)}</div></div><button type="button" class="cu-add" onclick="addToCart(${p.id})" title="Добави в кошницата">+</button></div>`).join('')}</div>`;
    } else {
      upsellEl.style.display='none';
    }
  }
  // Sync cart page if open
  if(typeof renderCartPageSummary==='function'&&document.getElementById('cartPage')?.style.display!=='none'){renderCartPageSummary();}
}
function changeQty(id,d){const i=cart.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);updateCart();saveCart();}
function removeFromCart(id){
  const removed=cart.find(x=>x.id===id);
  cart=cart.filter(x=>x.id!==id);
  updateCart();saveCart();
  if(!removed)return;
  // Undo toast
  const t=document.getElementById('toast');
  if(!t)return;
  clearTimeout(t._timer);
  t.innerHTML='';
  const _rSpan=document.createElement('span');
  _rSpan.textContent=removed.name.substring(0,28)+'… премахнат. ';
  const _rBtn=document.createElement('button');
  _rBtn.type='button'; _rBtn.onclick=undoRemoveCart;
  _rBtn.style.cssText='margin-left:8px;background:rgba(255,255,255,0.25);border:none;border-radius:5px;padding:2px 8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;color:#fff;';
  _rBtn.textContent='Отмяна';
  t.appendChild(_rSpan); t.appendChild(_rBtn);
  t.classList.add('show');
  t._undoItem=removed;
  t._timer=setTimeout(()=>{t.classList.remove('show');t._undoItem=null;},4500);
}
function undoRemoveCart(){
  const t=document.getElementById('toast');
  if(!t||!t._undoItem)return;
  const item=t._undoItem;
  t._undoItem=null;
  clearTimeout(t._timer);
  t.classList.remove('show');
  const ex=cart.find(x=>x.id===item.id);
  if(ex){ex.qty+=item.qty;}else{cart.push(item);}
  updateCart();saveCart();
  showToast('✓ '+item.name.substring(0,28)+'… върнат в кошницата');
}
function toggleCart(){document.getElementById('cartOverlay').classList.toggle('open');document.getElementById('cartPanel').classList.toggle('open');}
// ===== CHECKOUT & THANK YOU =====
let ckDeliveryIdx = 0;
let ckDeliveryCosts = [5.99, 4.99, 0];
let ckDeliveryNames = ['Еконт', 'Еконт', 'Вземи от магазин'];
let ckPaymentType = 'card';
let promoApplied = false;

function handleCheckout() {
  if (cart.length === 0) { showToast('Добави продукти в кошницата!'); return; }
  // Pre-fill from logged-in user
  if (currentUser) {
    document.getElementById('ckFirst').value = currentUser.firstName || '';
    document.getElementById('ckLast').value = currentUser.lastName || '';
    document.getElementById('ckEmail').value = currentUser.email || '';
    document.getElementById('ckPhone').value = currentUser.phone || '';
  }
  // Restore saved address
  try {
    const sa = JSON.parse(localStorage.getItem('mc_saved_addr') || 'null');
    if (sa) {
      if (sa.phone && !document.getElementById('ckPhone').value) document.getElementById('ckPhone').value = sa.phone;
      if (sa.city)  document.getElementById('ckCity').value  = sa.city;
      if (sa.addr)  document.getElementById('ckAddr').value  = sa.addr;
      if (sa.zip)   document.getElementById('ckZip').value   = sa.zip;
    }
  } catch(e) {}
  renderOrderSummary();
  document.getElementById('checkoutPage').classList.add('open');
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = 'hidden';
  showCheckoutStep(1);
  // Clear previous validation states
  document.querySelectorAll('#checkoutPage .ck-input').forEach(el => el.classList.remove('error','valid'));
  // Populate estimated delivery dates
  const fmt = d => d.toLocaleDateString('bg-BG', { weekday:'long', day:'numeric', month:'long' });
  const now = new Date();
  const workDay = (d, n) => { let c = new Date(d); let added = 0; while(added < n){ c.setDate(c.getDate()+1); if(c.getDay()!==0&&c.getDay()!==6) added++; } return c; };
  const d0 = document.getElementById('delivDate0'); if(d0) d0.textContent = '· до ' + fmt(workDay(now,2));
  const d1 = document.getElementById('delivDate1'); if(d1) d1.textContent = '· до ' + fmt(workDay(now,3));
  const d2 = document.getElementById('delivDate2'); if(d2) d2.textContent = '· готово днес';
}

function closeCheckoutPage() {
  document.getElementById('checkoutPage').classList.remove('open');
  document.body.style.overflow = '';
}

function renderOrderSummary() {
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const savings = cart.reduce((s, x) => s + (x.old ? (x.old - x.price) * x.qty : 0), 0);
  const delivery = ckDeliveryCosts[ckDeliveryIdx];
  const codFee = ckPaymentType === 'cod' ? 1.50 : 0;
  const promoDisc = promoApplied ? subtotal * ((promoDiscountPct || 10) / 100) : 0;
  const total = subtotal + delivery + codFee - promoDisc;

  document.getElementById('osSummaryItems').innerHTML = cart.map(x => `
    <div class="os-item">
      <div class="os-emoji">${escHtml(x.emoji||'')}</div>
      <div class="os-item-info">
        <div class="os-item-name">${escHtml(x.name||'')}</div>
        <div class="os-qty-ctrl">
          <button type="button" class="os-qty-btn" onclick="osChangeQty(${x.id},-1)">−</button>
          <span class="os-qty-num">${x.qty}</span>
          <button type="button" class="os-qty-btn" onclick="osChangeQty(${x.id},1)">+</button>
        </div>
      </div>
      <div class="os-item-price">${fmtEur(x.price * x.qty)}<span class="text-10-muted-block">${fmtBgn(x.price * x.qty)}</span></div>
    </div>`).join('');

  document.getElementById('osSubtotal').textContent = fmtEur(subtotal) + ' / ' + fmtBgn(subtotal);
  document.getElementById('osDelivery').textContent = delivery === 0 ? 'Безплатно' : fmtEur(delivery) + ' / ' + fmtBgn(delivery);
  document.getElementById('osTotal').textContent = fmtEur(total) + ' / ' + fmtBgn(total);

  const saveRow = document.getElementById('osSaveRow');
  if (savings > 0) { saveRow.style.display = ''; document.getElementById('osSave').textContent = '-' + fmtEur(savings) + ' / ' + fmtBgn(savings); }
  else saveRow.style.display = 'none';

  const promoRow = document.getElementById('osPromoRow');
  if (promoApplied) { promoRow.style.display = ''; document.getElementById('osPromoAmt').textContent = '-' + fmtEur(promoDisc) + ' / ' + fmtBgn(promoDisc); }
  else promoRow.style.display = 'none';
}

function selectCheckoutMode(mode) {
  const guestOpt   = document.getElementById('ckModeGuest');
  const loginOpt   = document.getElementById('ckModeLogin');
  const guestRadio = document.getElementById('ckModeGuestRadio');
  const loginRadio = document.getElementById('ckModeLoginRadio');
  if (mode === 'guest') {
    guestOpt?.classList.add('selected');
    loginOpt?.classList.remove('selected');
    guestRadio?.classList.add('checked');
    loginRadio?.classList.remove('checked');
  } else {
    loginOpt?.classList.add('selected');
    guestOpt?.classList.remove('selected');
    loginRadio?.classList.add('checked');
    guestRadio?.classList.remove('checked');
    if (typeof openAuthModal === 'function') openAuthModal('login');
  }
}

function osChangeQty(id, d) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  updateCart();
  saveCart();
  renderOrderSummary();
}

function selectDeliveryCk(el, idx) {
  document.querySelectorAll('#checkoutPage .delivery-opt').forEach(o => {
    o.classList.remove('selected');
    o.setAttribute('aria-checked', 'false');
    o.setAttribute('tabindex', '-1');
  });
  el.classList.add('selected');
  el.setAttribute('aria-checked', 'true');
  el.setAttribute('tabindex', '0');
  ckDeliveryIdx = idx;
  renderOrderSummary();
  // Show/hide Econt office field and address section based on delivery type
  const officeRow = document.getElementById('ckEcontOfficeRow');
  const addrSection = document.getElementById('ckAddressSection');
  const isPickup = idx === 2;
  if (officeRow) officeRow.style.display = isPickup ? 'none' : '';
  if (addrSection) addrSection.style.display = isPickup ? 'none' : '';
}

function selectPayment(el, type) {
  document.querySelectorAll('.payment-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  ckPaymentType = type;
  document.getElementById('cardFields').classList.toggle('show', type === 'card');
  renderOrderSummary();
}

function formatCardNum(el) {
  let v = el.value.replace(/\D/g,'').substring(0,16);
  el.value = v.replace(/(.{4})/g,'$1 ').trim();
}
function formatExpiry(el) {
  let v = el.value.replace(/\D/g,'').substring(0,4);
  if (v.length >= 2) v = v.substring(0,2) + '/' + v.substring(2);
  el.value = v;
}

let promoDiscountPct = 10; // set by applyPromo based on matched code

function applyPromo(codeArg) {
  const inputEl = document.getElementById('promoInput');
  const code = (codeArg || (inputEl ? inputEl.value : '')).trim().toUpperCase();

  // Load admin-managed codes from localStorage, fallback to built-in
  let codes = [{ code: 'MOSTCOMP10', discount: 10, active: true }];
  try {
    const stored = JSON.parse(localStorage.getItem('mc_promo_codes') || '[]');
    if (stored.length) codes = stored;
  } catch(e) {}

  const match = codes.find(c => c.code === code && c.active !== false);
  if (match) {
    promoApplied = true;
    promoDiscountPct = match.discount || 10;
    // Increment use counter
    try {
      const stored = JSON.parse(localStorage.getItem('mc_promo_codes') || '[]');
      const mc = stored.find(c => c.code === code);
      if (mc) { mc.uses = (mc.uses || 0) + 1; localStorage.setItem('mc_promo_codes', JSON.stringify(stored)); }
    } catch(e) {}
    if (inputEl) { document.getElementById('promoOk').classList.add('show'); inputEl.disabled = true; }
    renderOrderSummary();
    showToast(`✓ Промо код приложен — -${promoDiscountPct}%!`);
  } else {
    showToast('Невалиден промо код!');
    if (inputEl) { inputEl.classList.add('error'); setTimeout(() => inputEl.classList.remove('error'), 1500); }
  }
}

function showCheckoutStep(n) {
  [1,2,3].forEach(i => {
    const card = document.getElementById('ck-step'+i);
    if (card) card.style.display = i === n ? '' : 'none';
  });
  updateCheckoutSteps(n);
  const page = document.getElementById('checkoutPage');
  if (page) page.scrollTo({ top: 0, behavior: 'smooth' });
  // Auto-focus first empty required input in the new step
  setTimeout(() => {
    const card = document.getElementById('ck-step'+n);
    if (!card) return;
    const inputs = card.querySelectorAll('input.ck-input:not([disabled])');
    const firstEmpty = Array.from(inputs).find(el => !el.value.trim() && el.offsetParent !== null);
    if (firstEmpty) firstEmpty.focus();
  }, 120);
}

function ckNextStep(current) {
  if (!validateCkStep(current)) return;
  showCheckoutStep(current + 1);
}

function validateCkStep(step) {
  if (step === 1) {
    let valid = true;
    ['ckFirst','ckLast'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) { el.classList.add('error'); el.classList.remove('valid'); el.setAttribute('aria-invalid','true'); valid = false; }
      else if (el) el.setAttribute('aria-invalid','false');
    });
    const email = document.getElementById('ckEmail');
    if (email && (!email.value.trim() || !email.value.includes('@'))) {
      email.classList.add('error'); email.classList.remove('valid'); email.setAttribute('aria-invalid','true'); valid = false;
    } else if (email) { email.setAttribute('aria-invalid','false'); }
    const phone = document.getElementById('ckPhone');
    if (phone) { ckValidatePhone(phone); if (phone.classList.contains('error')) valid = false; }
    if (!valid) showToast('⚠️ Попълни всички задължителни полета!');
    return valid;
  }
  if (step === 2) {
    let valid = true;
    if (ckDeliveryIdx === 2) return true; // pickup — no address needed
    // Validate Econt office if Econt selected
    const officeEl = document.getElementById('ckEcontOffice');
    if (officeEl && !officeEl.classList.contains('is-hidden')) {
      if (!officeEl.value.trim()) { officeEl.classList.add('error'); officeEl.classList.remove('valid'); officeEl.setAttribute('aria-invalid','true'); valid = false; }
      else { officeEl.classList.remove('error'); officeEl.classList.add('valid'); officeEl.setAttribute('aria-invalid','false'); }
    }
    ['ckCity','ckAddr'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) { el.classList.add('error'); el.classList.remove('valid'); el.setAttribute('aria-invalid','true'); valid = false; }
      else if (el) { el.classList.remove('error'); el.setAttribute('aria-invalid','false'); }
    });
    if (!valid) showToast('⚠️ Попълни адреса за доставка!');
    return valid;
  }
  return true;
}

function _ckSetError(el, msg) {
  const errEl = el.id ? document.getElementById(el.id + '-err') : null;
  if (errEl) errEl.textContent = msg || '';
}

function ckValidateField(el) {
  if (!el.value.trim()) {
    el.classList.add('error'); el.classList.remove('valid'); el.setAttribute('aria-invalid','true');
    _ckSetError(el, 'Полето е задължително.');
  } else {
    el.classList.remove('error'); el.classList.add('valid'); el.setAttribute('aria-invalid','false');
    _ckSetError(el, '');
  }
}

function ckValidateEmail(el) {
  const ok = el.value.trim() && el.value.includes('@') && el.value.includes('.');
  el.classList.toggle('error', !ok);
  el.classList.toggle('valid', !!ok);
  el.setAttribute('aria-invalid', ok ? 'false' : 'true');
  _ckSetError(el, ok ? '' : 'Въведи валиден имейл адрес.');
}

// BG phone: 08xx, 09xx, +359 8xx, 00359 8xx — at least 10 digits
function ckValidatePhone(el) {
  const raw = el.value.replace(/[\s\-().]/g, '');
  const ok = /^(\+359|00359|0)[89]\d{8}$/.test(raw) || /^[1-9]\d{9,}$/.test(raw);
  el.classList.toggle('error', !ok);
  el.classList.toggle('valid', ok);
  el.setAttribute('aria-invalid', ok ? 'false' : 'true');
  _ckSetError(el, ok ? '' : 'Въведи валиден телефон (напр. 0888 123 456).');
}

// Auto-format phone as user types: 0888 123 456
function ckFormatPhone(el) {
  let v = el.value.replace(/[^\d+]/g, '');
  if (v.startsWith('+')) {
    // keep international prefix as-is
  } else if (v.length > 4) {
    v = v.substring(0,4) + ' ' + v.substring(4, 7) + (v.length > 7 ? ' ' + v.substring(7, 11) : '');
  }
  el.value = v;
}

function updateCheckoutSteps(active) {
  [1,2,3].forEach(n => {
    const step = document.getElementById('cs'+n);
    const num = document.getElementById('csn'+n);
    if (!step) return;
    step.classList.remove('active','done');
    if (n < active) {
      step.classList.add('done');
      if (num) num.textContent = '✓';
      step.style.cursor = 'pointer';
      step.onclick = () => showCheckoutStep(n);
    } else if (n === active) {
      step.classList.add('active');
      step.style.cursor = '';
      step.onclick = null;
    } else {
      if (num) num.textContent = n;
      step.style.cursor = '';
      step.onclick = null;
    }
  });
}

function submitOrder() {
  // Validate required fields — skip city/address for pickup (ckDeliveryIdx === 2)
  const isPickup = ckDeliveryIdx === 2;
  const required = [
    ['ckFirst','Ime'], ['ckLast','Familiya'], ['ckEmail','Email'], ['ckPhone','Telefon'],
    ...(!isPickup ? [['ckCity','Grad'], ['ckAddr','Adres']] : [])
  ];
  let valid = true;
  required.forEach(([id]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) { el.classList.add('error'); el.setAttribute('aria-invalid','true'); valid = false; }
    else { el.classList.remove('error'); el.setAttribute('aria-invalid','false'); }
  });
  if (ckPaymentType === 'card') {
    ['ckCardNum','ckCardName','ckCardExp','ckCardCvv'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (!el.value.trim()) { el.classList.add('error'); el.setAttribute('aria-invalid','true'); valid = false; }
      else { el.classList.remove('error'); el.setAttribute('aria-invalid','false'); }
    });
  }
  if (!valid) { showToast('Моля попълни всички задължителни полета!'); return; }

  // Loading state
  const submitBtn = document.querySelector('.os-submit');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<span class="ck-spinner"></span> Обработва се…'; }

  // Animate steps
  updateCheckoutSteps(2);
  setTimeout(() => updateCheckoutSteps(3), 400);
  setTimeout(() => {
    // Build order data — sequential number based on existing order count
    let _prevOrders = [];
    try { _prevOrders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch(e) {}
    const orderNum = 'MC-' + String(_prevOrders.length + 1).padStart(6, '0');
    const subtotal = cart.reduce((s,x) => s + x.price*x.qty, 0);
    const delivery = ckDeliveryCosts[ckDeliveryIdx];
    const codFee = ckPaymentType === 'cod' ? 1.50 : 0;
    const promoDisc = promoApplied ? subtotal * ((promoDiscountPct || 10) / 100) : 0;
    const total = subtotal + delivery + codFee - promoDisc;
    const payNames = {card:'Карта', cod:'Наложен платеж', bank:'Банков превод'};
    const now = new Date();
    const delivDays = ckDeliveryIdx === 2 ? 0 : ckDeliveryIdx === 1 ? 3 : 2;
    const delivDate = new Date(now.getTime() + delivDays * 86400000);
    const fmt = d => d.toLocaleDateString('bg-BG', {day:'numeric',month:'long'});

    // Populate thank-you page
    const _set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
    const _setHTML = (id, val) => { const el = document.getElementById(id); if(el) el.innerHTML = val; };
    _set('tyOrderNum', orderNum);
    _set('tyEmail', document.getElementById('ckEmail').value);
    _set('tyDeliveryDate', ckDeliveryIdx === 2 ? 'При вземане от магазин' : fmt(delivDate));
    _set('tyPayment', payNames[ckPaymentType]);
    _set('tyName', document.getElementById('ckFirst').value + ' ' + document.getElementById('ckLast').value);
    _set('tyPhone', document.getElementById('ckPhone').value);
    const _isPickup = ckDeliveryIdx === 2;
    const _econtOffice = (document.getElementById('ckEcontOffice') || {}).value || '';
    _set('tyCity', _isPickup ? 'София (магазин)' : document.getElementById('ckCity').value);
    _set('tyAddr', _isPickup ? 'бул. „Шипченски проход" бл.240' : (_econtOffice ? 'Офис: ' + _econtOffice + ', ' : '') + document.getElementById('ckAddr').value + (document.getElementById('ckZip').value ? ', ' + document.getElementById('ckZip').value : ''));
    _set('tyCourier', ckDeliveryNames[ckDeliveryIdx]);
    _set('tyNote', document.getElementById('ckNote').value || '—');
    _set('tyTimestamp', now.toLocaleString('bg-BG'));
    _set('tyDeliveryDateLine', ckDeliveryIdx === 2 ? 'Готова за вземане' : 'Очаквана: ' + fmt(delivDate));
    _set('tySubtotal', fmtEur(subtotal) + ' / ' + fmtBgn(subtotal));
    _set('tyDeliveryCost', delivery === 0 ? 'Безплатно' : fmtEur(delivery) + ' / ' + fmtBgn(delivery));
    _set('tyTotal', fmtEur(total) + ' / ' + fmtBgn(total));
    if (promoApplied) {
      const tyPromoRow = document.getElementById('tyPromoRow'); if(tyPromoRow) tyPromoRow.style.display = '';
      _set('tyPromoAmt', '-' + fmtEur(promoDisc) + ' / ' + fmtBgn(promoDisc));
    }
    _setHTML('tyItems', cart.map(x => `
      <div class="ty-item">
        <div class="ty-item-emoji">${escHtml(x.emoji||'')}</div>
        <div class="ty-item-info">
          <div class="ty-item-name">${escHtml(x.name||'')}</div>
          <div class="ty-item-meta">${escHtml(x.brand||'')} · Количество: ${Number(x.qty)||0}</div>
        </div>
        <div class="ty-item-price">${fmtEur(x.price*x.qty)}<span class="text-11-muted-block">${fmtBgn(x.price*x.qty)}</span></div>
      </div>`).join(''));

    // Save order to localStorage
    const orderData = {
      num: orderNum,
      customer: document.getElementById('ckFirst').value + ' ' + document.getElementById('ckLast').value,
      email: document.getElementById('ckEmail').value,
      phone: document.getElementById('ckPhone').value,
      city: _isPickup ? 'София (магазин)' : document.getElementById('ckCity').value,
      addr: _isPickup ? 'бул. „Шипченски проход" бл.240' : (_econtOffice ? 'Офис: ' + _econtOffice + ', ' : '') + document.getElementById('ckAddr').value + (document.getElementById('ckZip').value ? ', ' + document.getElementById('ckZip').value : ''),
      note: document.getElementById('ckNote').value || '',
      items: cart.map(x => x.name + ' ×' + x.qty).join(', '),
      itemsData: cart.map(x => ({id:x.id, name:x.name, brand:x.brand, emoji:x.emoji, price:x.price, qty:x.qty})),
      subtotal, delivery, total,
      payment: ckPaymentType,
      deliveryType: ckDeliveryNames[ckDeliveryIdx],
      status: 'pending',
      date: now.toLocaleDateString('bg-BG'),
      ts: now.getTime()
    };
    try {
      _prevOrders.unshift(orderData);
      localStorage.setItem('mc_orders', JSON.stringify(_prevOrders.slice(0, 200)));
    } catch(e) {}
    // Записване в Supabase (реална база данни)
    if (typeof saveOrderToSupabase === 'function') {
      saveOrderToSupabase(orderData).catch(e => console.error('Supabase save failed:', e));
    }
    // Save address for next order
    try {
      localStorage.setItem('mc_saved_addr', JSON.stringify({
        phone: document.getElementById('ckPhone').value,
        city:  document.getElementById('ckCity').value,
        addr:  document.getElementById('ckAddr').value,
        zip:   document.getElementById('ckZip').value,
      }));
    } catch(e) {}

    // Show thank-you page, clear cart
    closeCheckoutPage();
    document.getElementById('thankyouPage').classList.add('open');
    cart = [];
    updateCart();saveCart();
    promoApplied = false;
  }, 800);
}

function closeThankyouPage() {
  document.getElementById('thankyouPage').classList.remove('open');
  document.body.style.overflow = '';
}

// MOBILE MENU
function toggleMobMenu(){
  const overlay = document.getElementById('mobOverlay');
  const drawer  = document.getElementById('mobDrawer');
  const isOpen  = drawer.classList.toggle('open');
  overlay.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
function closeMobMenu(){
  document.getElementById('mobOverlay').classList.remove('open');
  document.getElementById('mobDrawer').classList.remove('open');
  document.body.style.overflow = '';
}
function handleMobSearch(){
  const q=document.getElementById('mobSearchInput').value.trim();
  if(q){
    document.getElementById('searchInput').value = q;
    toggleMobMenu();
    showSearchResultsPage(q);
  }
}

// ===== CART PAGE =====
function openCartPage() {
  // Close drawer if open
  const panel = document.getElementById('cartPanel');
  const overlay = document.getElementById('cartOverlay');
  if (panel) panel.classList.remove('open');
  if (overlay) overlay.classList.remove('open');

  renderCartPage();
  const page = document.getElementById('cartPage');
  if (page) { page.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}

function closeCartPage() {
  const page = document.getElementById('cartPage');
  if (page) { page.style.display = 'none'; }
  document.body.style.overflow = '';
}

function renderCartPage() {
  const count = cart.reduce((s, x) => s + x.qty, 0);
  const countEl = document.getElementById('cpItemCount');
  if (countEl) countEl.textContent = count + ' бр.';

  const itemsEl = document.getElementById('cpItems');
  const emptyEl = document.getElementById('cpEmpty');
  const promoRow = document.getElementById('cpPromoRow');

  if (!itemsEl) return;

  if (cart.length === 0) {
    itemsEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    if (promoRow) promoRow.style.display = 'none';
    renderCartPageSummary();
    renderCartPageUpsell();
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (promoRow) promoRow.style.display = '';

  itemsEl.innerHTML = cart.map(x => {
    const save = x.old ? Math.round(((x.old - x.price) / x.old) * 100) : 0;
    const badgeHtml = x.badge === 'sale'
      ? `<span class="cp-badge cp-badge-sale">Промо -${save}%</span>`
      : x.badge === 'new' ? `<span class="cp-badge cp-badge-new">Ново</span>`
      : x.badge === 'hot' ? `<span class="cp-badge cp-badge-hot">Горещо</span>` : '';

    const imgHtml = x.img
      ? `<img src="${x.img}" alt="${x.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="cp-item-emoji is-hidden">${x.emoji}</span>`
      : `<span class="cp-item-emoji">${x.emoji}</span>`;

    return `<div class="cp-card">
      <div class="cp-item-thumb">${imgHtml}</div>
      <div class="cp-item-info">
        <div class="cp-item-brand">${x.brand}</div>
        <div class="cp-item-name">${x.name}</div>
        <div class="cp-item-sku">${x.sku || ''}</div>
        <div class="cp-item-badges">${badgeHtml}</div>
      </div>
      <div class="cp-item-right">
        <div class="cp-item-prices">
          ${x.old ? `<div class="cp-item-old">${fmtEur(x.old)}</div>` : ''}
          <div class="cp-item-price">${fmtEur(x.price * x.qty)}</div>
          <div class="cp-item-bgn">${fmtBgn(x.price * x.qty)}</div>
        </div>
        <div class="cp-qty-wrap">
          <button class="cp-qty-btn" onclick="cpChangeQty(${x.id},-1)">−</button>
          <span class="cp-qty-val">${x.qty}</span>
          <button class="cp-qty-btn" onclick="cpChangeQty(${x.id},1)">+</button>
        </div>
        <button class="cp-remove-btn" onclick="cpRemoveItem(${x.id})" title="Премахни">×</button>
      </div>
    </div>`;
  }).join('');

  renderCartPageSummary();
  renderCartPageUpsell();
}

function renderCartPageSummary() {
  const el = document.getElementById('cpSummary');
  if (!el) return;
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const savings  = cart.reduce((s, x) => s + (x.old ? (x.old - x.price) * x.qty : 0), 0);
  const delivery = subtotal >= FREE_SHIP_BGN ? 0 : 9.99;
  const total    = subtotal + delivery;

  if (cart.length === 0) {
    el.innerHTML = '<div style="text-align:center;color:var(--muted);padding:24px 0;font-size:13px;">Добави продукти в кошницата</div>';
    return;
  }

  el.innerHTML = `
    <div class="cp-sum-row"><span>Продукти (${cart.reduce((s,x)=>s+x.qty,0)} бр.)</span><span>${fmtEur(subtotal)}<small>${fmtBgn(subtotal)}</small></span></div>
    ${savings > 0 ? `<div class="cp-sum-row cp-sum-save"><span>✓ Спестяваш</span><span>−${fmtEur(savings)}</span></div>` : ''}
    <div class="cp-sum-row"><span>Доставка</span><span>${delivery === 0 ? '<b style="color:var(--accent2)">Безплатна</b>' : fmtEur(delivery)}</span></div>
    <div class="cp-sum-row"><span>ДДС (вкл.)</span><span>${fmtEur(total * 0.2)}</span></div>
    <hr class="cp-sum-divider">
    <div class="cp-sum-row cp-sum-total"><span>Общо</span><span>${fmtEur(total)}<small>${fmtBgn(total)}</small></span></div>
    ${subtotal < FREE_SHIP_BGN ? `<div class="cp-ship-hint">Добави още <b>${fmtBgn(FREE_SHIP_BGN - subtotal)}</b> за безплатна доставка</div>` : ''}`;
}

function renderCartPageUpsell() {
  const el = document.getElementById('cpUpsell');
  if (!el) return;
  const inCart = new Set(cart.map(x => x.id));
  const cats = cart.map(x => x.cat);
  let recs = products.filter(p => !inCart.has(p.id) && cats.includes(p.cat)).slice(0, 3);
  if (recs.length < 2) recs = products.filter(p => !inCart.has(p.id)).slice(0, 3);
  if (!recs.length) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <div class="cp-upsell-header">⚡ Може да те заинтересува</div>
    ${recs.map(p => `
      <div class="cp-upsell-item" onclick="openProductPage(${p.id});closeCartPage()">
        <div class="cp-upsell-emoji">${p.emoji}</div>
        <div class="cp-upsell-info">
          <div class="cp-upsell-name">${p.name.length > 40 ? p.name.substring(0,40)+'…' : p.name}</div>
          <div class="cp-upsell-price">${fmtEur(p.price)} / ${fmtBgn(p.price)}</div>
        </div>
        <button class="cp-upsell-add" onclick="event.stopPropagation();cpAddUpsell(${p.id})">+ Добави</button>
      </div>`).join('')}`;
}

function cpChangeQty(id, d) {
  changeQty(id, d);
  renderCartPage();
}

function cpRemoveItem(id) {
  removeFromCart(id);
  renderCartPage();
}

function cpAddUpsell(id) {
  addToCart(id);
  renderCartPage();
}

function cpClearCart() {
  if (!cart.length) return;
  if (!confirm('Изчисти цялата кошница?')) return;
  cart = [];
  updateCart(); saveCart();
  renderCartPage();
}

function cpApplyPromo() {
  const input = document.getElementById('cpPromoInput');
  if (!input || !input.value.trim()) return;
  applyPromo(input.value.trim());
}

function cpGoCheckout() {
  closeCartPage();
  handleCheckout();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addToCart, removeFromCart, changeQty,
    applyPromo, renderOrderSummary, formatCardNum, formatExpiry,
    _resetCheckout: () => { ckDeliveryIdx = 0; ckPaymentType = 'card'; promoApplied = false; },
    _setDelivery:   (idx) => { ckDeliveryIdx = idx; },
    _setPayment:    (type) => { ckPaymentType = type; },
  };
}

// ===== LIVE SEARCH SYSTEM =====
let recentSearches = [];
try { recentSearches = JSON.parse(localStorage.getItem('mc_recent') || '[]'); } catch(e) { localStorage.removeItem('mc_recent'); }
let searchFocusIdx = -1;
let searchDebounce = null;
let _srpQuery = ''; // current SRP query — never embed user input in HTML attributes

const searchInput = document.getElementById('searchInput');
const searchDropdown = document.getElementById('searchDropdown');
const searchBar = document.getElementById('searchBar');

function highlightMatch(text, query) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

function normStr(s) {
  return String(s).toLowerCase()
    .replace(/[àáâãäå]/g,'a').replace(/[èéêë]/g,'e').replace(/[ìíîï]/g,'i')
    .replace(/[òóôõö]/g,'o').replace(/[ùúûü]/g,'u').replace(/[ñ]/g,'n');
}

// Levenshtein distance for fuzzy matching
function _levenshtein(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const row = Array.from({length: b.length + 1}, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i-1] === b[j-1] ? row[j-1] : 1 + Math.min(row[j-1], row[j], prev);
      row[j-1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

// Check if query token fuzzy-matches any word in text (1 typo tolerance per 4 chars)
function _fuzzyTokenMatch(token, text) {
  const maxDist = token.length <= 4 ? 1 : token.length <= 7 ? 1 : 2;
  const words = text.split(/\s+/);
  return words.some(w => {
    if (w.length < token.length - maxDist) return false;
    if (w.includes(token)) return true;
    return _levenshtein(token, w.substring(0, token.length + maxDist)) <= maxDist;
  });
}

function matchesQuery(p, q) {
  try {
    const ql = q.toLowerCase();
    // EAN exact (numeric only)
    if (/^\d{8,14}$/.test(q)) return !!(p.ean && p.ean.includes(q));
    // Original field-by-field includes (preserves all existing behaviour)
    const basic =
      p.name.toLowerCase().includes(ql) ||
      p.brand.toLowerCase().includes(ql) ||
      (p.sku  && p.sku.toLowerCase().includes(ql)) ||
      (p.ean  && p.ean.includes(q)) ||
      (p.desc && p.desc.toLowerCase().includes(ql)) ||
      Object.values(p.specs||{}).some(v => String(v).toLowerCase().includes(ql));
    if (basic) return true;
    // Multi-word fallback: all words must appear across all fields combined
    const allFields = normStr([
      p.name, p.brand, p.sku||'', p.ean||'', p.desc||'',
      ...Object.values(p.specs||{})
    ].join(' '));
    if (q.includes(' ')) {
      if (q.split(/\s+/).filter(Boolean).every(w => allFields.includes(normStr(w)))) return true;
    }
    // Fuzzy fallback: each query token must fuzzy-match something in allFields
    if (q.length >= 3) {
      const tokens = normStr(q).split(/\s+/).filter(t => t.length >= 3);
      if (tokens.length > 0 && tokens.every(t => _fuzzyTokenMatch(t, allFields))) return true;
    }
    return false;
  } catch(e) { return false; }
}

function searchProducts(query, cat) {
  const q = query.trim();
  if (!q) return [];
  const catFilter = cat && cat !== 'all' ? cat : '';
  return products.filter(p => (!catFilter || normalizeCat(p.cat) === catFilter) && matchesQuery(p, q));
}

// Detect if query looks like SKU or EAN
function queryType(q) {
  if (/^\d{8,14}$/.test(q.trim())) return 'ean';
  if (/^mc-/i.test(q.trim())) return 'sku';
  return 'text';
}

function renderDropdown(query) {
  if (!searchDropdown || !searchBar) return;
  const cat = '';
  const results = searchProducts(query, cat);
  const q = query.trim();
  const qtype = queryType(q);

  if (!q) {
    // Show recent searches + hint chips
    const hints = recentSearches.length === 0
      ? `<div class="sd-section-title">💡 Можеш да търсиш по</div>
         <div class="sd-recent">
           <div class="sd-recent-chip" onclick="void(0)">📝 Име / марка</div>
           <div class="sd-recent-chip" onclick="void(0)">🔖 SKU (напр. MC-SONY-WH1000XM6)</div>
           <div class="sd-recent-chip" onclick="void(0)">📦 EAN баркод (13 цифри)</div>
         </div>`
      : `<div class="sd-section-title">🕐 Последни търсения</div>
         <div class="sd-recent">
           ${recentSearches.map((s,i) => `
             <div class="sd-recent-chip" data-recent-search="${escHtml(s)}">
               🔍 ${escHtml(s)}
               <button type="button" class="sd-recent-remove" onclick="removeRecent(event,${i})">×</button>
             </div>`).join('')}
         </div>
         <div class="sd-section-title">💡 Търси и по</div>
         <div class="sd-recent">
           <div class="sd-recent-chip cursor-default">🔖 SKU код</div>
           <div class="sd-recent-chip cursor-default">📦 EAN баркод</div>
         </div>`;
    searchDropdown.innerHTML = hints;
    searchDropdown.classList.add('open');
    searchBar.classList.add('active');
    return;
  }

  if (results.length === 0) {
    let hint = '';
    if (qtype === 'ean') hint = '<div class="sd-empty-sub">Търсенето по EAN не намери продукт с баркод <strong>' + escHtml(q) + '</strong></div>';
    else if (qtype === 'sku') hint = '<div class="sd-empty-sub">Търсенето по SKU не намери продукт с код <strong>' + escHtml(q) + '</strong></div>';
    else hint = '<div class="sd-empty-sub">Провери правописа или опитай с SKU / EAN баркод</div>';
    searchDropdown.innerHTML = `
      <div class="sd-empty">
        <div class="sd-empty-icon">🔍</div>
        <div class="sd-empty-text">Няма резултати за "<strong>${escHtml(q)}</strong>"</div>
        ${hint}
      </div>`;
    searchDropdown.classList.add('open');
    searchBar.classList.add('active');
    return;
  }

  const shown = results.slice(0, 6);
  // Section title differs by query type
  const sectionTitle = qtype === 'ean'
    ? `📦 EAN резултат (${results.length})`
    : qtype === 'sku'
    ? `🔖 SKU резултат (${results.length})`
    : `🛍 Продукти (${results.length})`;

  searchDropdown.innerHTML = `
    <div class="sd-section-title">${sectionTitle}</div>
    ${shown.map((p, i) => {
      const save = p.old ? Math.round(((p.old - p.price) / p.old) * 100) : 0;
      let badgeHtml = '';
      if (p.badge === 'sale') badgeHtml = `<span class="sd-badge-small sd-badge-sale">-${save}%</span>`;
      else if (p.badge === 'new') badgeHtml = `<span class="sd-badge-small sd-badge-new">Ново</span>`;
      else if (p.badge === 'hot') badgeHtml = `<span class="sd-badge-small sd-badge-hot">Горещо</span>`;
      // Highlight SKU/EAN if that's what matched
      const skuMatch = p.sku && p.sku.toLowerCase().includes(q.toLowerCase());
      const eanMatch = p.ean && p.ean.includes(q);
      const extraMeta = skuMatch
        ? `<span class="text-primary-strong">🔖 ${highlightMatch(p.sku, q)}</span>`
        : eanMatch
        ? `<span class="text-primary-strong">📦 EAN: ${highlightMatch(p.ean, q)}</span>`
        : `<span>SKU: ${p.sku}</span>`;
      return `
        <div class="sd-result" data-idx="${i}" onclick="selectSearchResult(${p.id})">
          <div class="sd-emoji">${p.emoji}</div>
          <div class="sd-info">
            <div class="sd-name">${highlightMatch(escHtml(p.name), q)}</div>
            <div class="sd-meta">
              <span class="sd-brand">${escHtml(p.brand)}</span>
              ${extraMeta}
            </div>
          </div>
          ${badgeHtml}
          <div class="sd-price">${fmtEur(p.price)}<span class="text-10-muted-block">${fmtBgn(p.price)}</span></div>
        </div>`;
    }).join('')}
    ${results.length > 6 ? `
      <div class="sd-footer">
        <span class="sd-footer-count">Показани ${shown.length} от ${results.length}</span>
        <button type="button" class="sd-footer-btn" onclick="doFullSearch()">Виж всички резултати →</button>
      </div>` : ''}`;
  searchDropdown.classList.add('open');
  searchBar.classList.add('active');
  searchFocusIdx = -1;
}

function selectSearchResult(id) {
  saveRecentSearch(searchInput.value.trim());
  closeSearchDropdown();
  openProductPage(id);
}

function doFullSearch() {
  const q = searchInput.value.trim();
  if (!q) return;
  saveRecentSearch(q);
  closeSearchDropdown();
  showSearchResultsPage(q);
}

function showSearchResultsPage(query) {
  // Reset price filter state
  srpCurrentQuery = query; srpCurrentCatFilter = ''; srpPriceMinVal = 0; srpPriceMaxVal = 5000;

  const cat = '';
  let results = searchProducts(query, cat);
  const page = document.getElementById('searchResultsPage');
  document.getElementById('srpQuery').textContent = `"${query}"`;
  document.getElementById('srpCount').textContent = `${results.length} резултата`;
  // Breadcrumb
  const srpBc = document.getElementById('srpBreadcrumb');
  if (srpBc) {
    srpBc.innerHTML = '<span class="srp-bc-item" onclick="closeSearchPage()">Начало</span><span class="srp-bc-sep">›</span><span class="srp-bc-item">Търсене</span><span class="srp-bc-sep">›</span><span class="srp-bc-current"></span>';
    srpBc.querySelector('.srp-bc-current').textContent = query;
  }

  // Category filter pills for SRP — store query in module var, never embed user input in HTML attributes
  _srpQuery = query;
  const cats = [...new Set(results.map(p => p.cat))];
  const catLabels = {phones:'Телефони и таблети',laptops:'Лаптопи',desktops:'Десктопи',gaming:'Гейминг',monitors:'Монитори',components:'Компоненти',peripherals:'Периферия',network:'Мрежа',storage:'Съхранение',accessories:'Аксесоари',software:'Софтуер'};
  var _el_srpFilters=document.getElementById('srpFilters'); if(_el_srpFilters) _el_srpFilters.innerHTML = `
    <button type="button" class="srp-filter-pill active" data-cat="" onclick="srpFilter(this,'')">Всички (${results.length})</button>
    ${cats.map(c => `<button type="button" class="srp-filter-pill" data-cat="${escHtml(c)}" onclick="srpFilter(this,'${escHtml(c)}')">${escHtml(catLabels[c]||c)} (${results.filter(p=>p.cat===c).length})</button>`).join('')}
  `;

  // Show & reset price slider
  const pf = document.getElementById('srpPriceFilter');
  if (pf) pf.style.display = '';
  const mn = document.getElementById('priceMin'), mx = document.getElementById('priceMax');
  if (mn) mn.value = 0; if (mx) mx.value = 5000;
  const pv = document.getElementById('srpPriceVals'); if (pv) pv.textContent = '0 лв. — 5 000 лв.';
  const rng = document.getElementById('sliderRange'); if (rng){ rng.style.left='0%'; rng.style.width='100%'; }

  renderSRPGrid(results, query);
  page.classList.add('open');
  page.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function renderSRPGrid(results, query) {
  const grid = document.getElementById('srpGrid');
  if (results.length === 0) {
    const popular = products.slice(0, 4);
    grid.innerHTML = `
      <div class="srp-no-results">
        <div class="nri">🔍</div>
        <h3>Няма намерени продукти</h3>
        <p>Опитай с различна дума или разгледай популярните търсения:</p>
        <div class="srp-suggestions">
          ${['лаптоп','слушалки','телефон','таблет','камера'].map(s =>
            `<button type="button" class="srp-suggestion" onclick="document.getElementById('searchInput').value='${s}';showSearchResultsPage('${s}')">${s}</button>`
          ).join('')}
        </div>
      </div>
      <div style="margin-top:32px;">
        <div style="font-size:16px;font-weight:800;margin-bottom:16px;">Популярни продукти</div>
        <div class="srp-grid">${popular.map(p => makeCard(p)).join('')}</div>
      </div>`;
  } else {
    grid.innerHTML = `<div class="srp-grid">${results.map(p => makeCard(p)).join('')}</div>`;
  }
}

function srpFilter(btn, cat) {
  document.querySelectorAll('.srp-filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const results = searchProducts(_srpQuery, cat);
  document.getElementById('srpCount').textContent = `${results.length} резултата`;
  renderSRPGrid(results, _srpQuery);
}

function closeSearchPage() {
  document.getElementById('searchResultsPage').classList.remove('open');
  document.body.style.overflow = '';
}

function closeSearchDropdown() {
  if (searchDropdown) searchDropdown.classList.remove('open');
  if (searchBar) searchBar.classList.remove('active');
  searchFocusIdx = -1;
}

function saveRecentSearch(q) {
  if (!q) return;
  recentSearches = [q, ...recentSearches.filter(s => s !== q)].slice(0, 6);
  try { localStorage.setItem('mc_recent', JSON.stringify(recentSearches)); } catch(e) {}
}

function removeRecent(e, idx) {
  e.stopPropagation();
  recentSearches.splice(idx, 1);
  try { localStorage.setItem('mc_recent', JSON.stringify(recentSearches)); } catch(e) {}
  renderDropdown('');
}

function applyRecentSearch(q) {
  searchInput.value = q;
  renderDropdown(q);
  setTimeout(doFullSearch, 100);
}

// Keyboard navigation in dropdown
if (searchInput) {
  searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => renderDropdown(searchInput.value), 180);
  });

  searchInput.addEventListener('keydown', e => {
    const items = searchDropdown ? searchDropdown.querySelectorAll('.sd-result') : [];
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      searchFocusIdx = Math.min(searchFocusIdx + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle('focused', i === searchFocusIdx));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      searchFocusIdx = Math.max(searchFocusIdx - 1, -1);
      items.forEach((el, i) => el.classList.toggle('focused', i === searchFocusIdx));
    } else if (e.key === 'Enter') {
      if (searchFocusIdx >= 0 && items[searchFocusIdx]) {
        items[searchFocusIdx].click();
      } else {
        doFullSearch();
      }
    } else if (e.key === 'Escape') {
      closeSearchDropdown();
      searchInput.blur();
    }
  });

  searchInput.addEventListener('focus', () => renderDropdown(searchInput.value));
}

document.addEventListener('click', e => {
  // Safe delegation for recent search chips (avoids XSS via inline onclick)
  const chip = e.target.closest('[data-recent-search]');
  if (chip && !e.target.closest('.sd-recent-remove')) {
    applyRecentSearch(chip.dataset.recentSearch);
    return;
  }
  if (!e.target.closest('.search-wrap')) closeSearchDropdown();
});

// ===== KEYBOARD SHORTCUT: / or Ctrl+K focuses search =====
document.addEventListener('keydown', e => {
  if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) &&
      !e.target.matches('input,textarea,select,[contenteditable]')) {
    e.preventDefault();
    const si = document.getElementById('searchInput');
    if (si) { si.focus(); si.select(); }
  }
});

function handleSearch() { doFullSearch(); }
function subscribeNL() {
  const input = document.getElementById('nlEmail') || document.getElementById('tyNlEmail');
  const v = input?.value?.trim() || '';
  if (!v || !v.includes('@') || !v.includes('.')) { showToast('Въведи валиден имейл!'); return; }
  try {
    const subs = JSON.parse(localStorage.getItem('mc_newsletter') || '[]');
    if (!subs.includes(v)) { subs.push(v); localStorage.setItem('mc_newsletter', JSON.stringify(subs)); }
  } catch(e) {}
  showToast('✓ Абониран успешно! Ще получаваш най-добрите оферти.');
  if (input) input.value = '';
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    highlightMatch, searchProducts, queryType, saveRecentSearch,
    _resetRecentSearches: () => { recentSearches = []; },
  };
}


// ===== AUTH SYSTEM =====
let currentUser = null;

// Demo users — client-side only prototype auth (replace with server-side in production)
const demoUsers = [
  { email: 'test@test.bg', password: 'demo-only', firstName: 'Иван', lastName: 'Петров', phone: '0888123456' }
];

function openAuthModal(tab = 'login') {
  switchAuthTab(tab);
  resetAuthForms();
  document.getElementById('authBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAuthModal(e) { if (e.target === e.currentTarget) closeAuthModalDirect(); }
function closeAuthModalDirect() { document.getElementById('authBackdrop').classList.remove('open'); document.body.style.overflow = ''; }

function switchAuthTab(tab) {
  document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
  document.getElementById('tabRegister').classList.toggle('active', tab === 'register');
  document.getElementById('formLogin').classList.toggle('active', tab === 'login');
  document.getElementById('formRegister').classList.toggle('active', tab === 'register');
  document.getElementById('formForgot').classList.toggle('active', tab === 'forgot');
  document.getElementById('authSuccess').classList.remove('show');
  const subs = { login: 'Влез в своя профил', register: 'Създай нов акаунт безплатно', forgot: 'Нулиране на парола' };
  document.getElementById('authHeaderSub').textContent = subs[tab] || '';
}

function showForgotPw() { switchAuthTab('forgot'); document.getElementById('tabLogin').classList.remove('active'); document.getElementById('tabRegister').classList.remove('active'); }

function resetAuthForms() {
  ['loginEmail','loginPassword','regFirstName','regLastName','regEmail','regPhone','regPassword','regPassword2','forgotEmail'].forEach(id => { const el = document.getElementById(id); if (el) { el.value = ''; el.classList.remove('error'); } });
  document.getElementById('loginError').classList.remove('show');
  document.getElementById('registerError').classList.remove('show');
  document.getElementById('authSuccess').classList.remove('show');
  document.getElementById('pwFill').style.width = '0';
  document.getElementById('pwText').textContent = '';
}

function togglePwVis(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
  else { inp.type = 'password'; btn.textContent = '👁'; }
}

function checkPwStrength(val) {
  const fill = document.getElementById('pwFill');
  const text = document.getElementById('pwText');
  if (!val) { fill.style.width = '0'; text.textContent = ''; return; }
  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const levels = [
    { w: '20%', c: '#ff3d00', t: 'Много слаба' },
    { w: '40%', c: '#ff6b00', t: 'Слаба' },
    { w: '60%', c: '#fbbf24', t: 'Средна' },
    { w: '80%', c: '#00c853', t: 'Силна' },
    { w: '100%', c: '#00a843', t: 'Много силна 💪' },
  ];
  const l = levels[Math.min(score - 1, 4)] || levels[0];
  fill.style.width = l.w; fill.style.background = l.c;
  text.textContent = l.t; text.style.color = l.c;
}

function _authErr(id, msg) {
  const el = document.getElementById(id + '-err');
  if (el) el.textContent = msg || '';
}

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.classList.remove('show');
  let valid = true;
  if (!email || !email.includes('@')) {
    document.getElementById('loginEmail').classList.add('error');
    _authErr('loginEmail', 'Въведи валиден имейл адрес.');
    valid = false;
  } else {
    document.getElementById('loginEmail').classList.remove('error');
    _authErr('loginEmail', '');
  }
  if (!pass) {
    document.getElementById('loginPassword').classList.add('error');
    _authErr('loginPassword', 'Паролата е задължителна.');
    valid = false;
  } else {
    document.getElementById('loginPassword').classList.remove('error');
    _authErr('loginPassword', '');
  }
  if (!valid) return;
  const user = demoUsers.find(u => u.email === email && u.password === pass);
  if (!user) {
    errEl.classList.add('show');
    document.getElementById('loginPassword').classList.add('error');
    _authErr('loginPassword', 'Грешен имейл или парола.');
    return;
  }
  loginSuccess(user);
}

function handleRegister() {
  const fn = document.getElementById('regFirstName').value.trim();
  const ln = document.getElementById('regLastName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pw = document.getElementById('regPassword').value;
  const pw2 = document.getElementById('regPassword2').value;
  const errEl = document.getElementById('registerError');
  errEl.classList.remove('show');
  let valid = true;
  const fieldChecks = [
    ['regFirstName', fn.length > 0, 'Името е задължително.'],
    ['regLastName', ln.length > 0, 'Фамилията е задължителна.'],
    ['regEmail', email.includes('@'), 'Въведи валиден имейл адрес.'],
    ['regPassword', pw.length >= 6, 'Паролата трябва да е поне 6 символа.'],
    ['regPassword2', pw === pw2 && pw.length >= 6, pw !== pw2 ? 'Паролите не съвпадат.' : 'Повтори паролата.'],
  ];
  fieldChecks.forEach(([id, ok, msg]) => {
    document.getElementById(id).classList.toggle('error', !ok);
    _authErr(id, ok ? '' : msg);
    if (!ok) valid = false;
  });
  if (!valid) { errEl.textContent = pw !== pw2 ? '⚠ Паролите не съвпадат!' : '⚠ Моля провери данните!'; errEl.classList.add('show'); return; }
  if (demoUsers.find(u => u.email === email)) {
    errEl.textContent = '⚠ Имейлът вече е регистриран!'; errEl.classList.add('show');
    document.getElementById('regEmail').classList.add('error');
    _authErr('regEmail', 'Този имейл вече е регистриран.');
    return;
  }
  const newUser = { email, password: pw, firstName: fn, lastName: ln, phone: document.getElementById('regPhone').value };
  demoUsers.push(newUser);
  registerSuccess(newUser);
}

function handleForgot() {
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email.includes('@')) {
    document.getElementById('forgotEmail').classList.add('error');
    _authErr('forgotEmail', 'Въведи валиден имейл адрес.');
    return;
  }
  document.getElementById('forgotEmail').classList.remove('error');
  _authErr('forgotEmail', '');
  showAuthSuccess('📧', 'Имейлът е изпратен!', `Провери ${email} за линк за нулиране на паролата.`);
}

function socialLogin(provider) {
  const mockUser = { email: `user@${provider.toLowerCase()}.com`, firstName: 'Потребител', lastName: provider, phone: '' };
  loginSuccess(mockUser);
}

function loginSuccess(user) {
  currentUser = user;
  showAuthSuccess('🎉', `Добре дошъл, ${user.firstName}!`, 'Влезе успешно в профила си.');
  setTimeout(() => { closeAuthModalDirect(); updateAuthUI(); }, 1800);
}

function registerSuccess(user) {
  currentUser = user;
  showAuthSuccess('🎊', 'Акаунтът е създаден!', `Добре дошъл, ${user.firstName}! Можеш да пазаруваш веднага.`);
  setTimeout(() => { closeAuthModalDirect(); updateAuthUI(); }, 2000);
}

function showAuthSuccess(icon, title, text) {
  ['formLogin','formRegister','formForgot'].forEach(id => { const f = document.getElementById(id); if(f) f.classList.remove('active'); });
  document.getElementById('authSuccessIcon').textContent = icon;
  document.getElementById('authSuccessTitle').textContent = title;
  document.getElementById('authSuccessText').textContent = text;
  document.getElementById('authSuccess').classList.add('show');
}

function updateAuthUI() {
  const topLogin = document.getElementById('topbarLogin');
  const topReg = document.getElementById('topbarRegister');
  const profileBtn = document.getElementById('profileBtn');
  const profileLabel = document.getElementById('profileLabel');
  const profileIcon = document.getElementById('profileIcon');
  if (currentUser) {
    const initials = (currentUser.firstName[0] + (currentUser.lastName ? currentUser.lastName[0] : '')).toUpperCase();
    if (topLogin) topLogin.style.display = 'none';
    if (topReg) topReg.style.display = 'none';
    if (profileBtn) profileBtn.style.display = '';
    if (profileLabel) profileLabel.textContent = currentUser.firstName;
    if (profileIcon) profileIcon.innerHTML = `<div class="hdr-btn-avatar">${escHtml(initials)}</div>`;
    const pdAvatar = document.getElementById('pdAvatar'); if (pdAvatar) pdAvatar.textContent = initials;
    const pdName = document.getElementById('pdName'); if (pdName) pdName.textContent = `${currentUser.firstName} ${currentUser.lastName || ''}`.trim();
    const pdEmail = document.getElementById('pdEmail'); if (pdEmail) pdEmail.textContent = currentUser.email;
    showToast(`👋 Добре дошъл, ${currentUser.firstName}!`);
  } else {
    if (topLogin) topLogin.style.display = '';
    if (topReg) topReg.style.display = '';
    if (profileBtn) profileBtn.style.display = 'none';
    const pdAvatar = document.getElementById('pdAvatar'); if (pdAvatar) pdAvatar.textContent = '?';
    const pdName = document.getElementById('pdName'); if (pdName) pdName.textContent = 'Гост';
    const pdEmail = document.getElementById('pdEmail'); if (pdEmail) pdEmail.textContent = '—';
  }
}

function handleProfileClick() {
  if (currentUser) {
    document.getElementById('profileDropdown').classList.toggle('open');
  } else {
    openAuthModal('login');
  }
}

function closeDropdown() {
  document.getElementById('profileDropdown').classList.remove('open');
}

function handleLogout() {
  currentUser = null;
  closeDropdown();
  updateAuthUI();
  showToast('Излязохте успешно от профила.');
}

// Close dropdown on outside click
document.addEventListener('click', e => {
  const wrap = document.querySelector('.profile-dropdown-wrap');
  if (wrap && !wrap.contains(e.target)) closeDropdown();
});

// ===== WISHLIST =====
let wishlist = [];
try { wishlist = JSON.parse(localStorage.getItem('mc_wishlist') || '[]'); } catch(e) {}

function toggleWishlist(id, e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    showToast('❤ Добавено в любими!');
  } else {
    wishlist.splice(idx, 1);
    showToast('♡ Премахнато от любими');
  }
  try { localStorage.setItem('mc_wishlist', JSON.stringify(wishlist)); } catch(err){}
  updateWishlistUI();
  // Update specific button if visible
  const btn = document.getElementById('wl-' + id);
  if (btn) {
    btn.innerHTML = wishlist.includes(id)
      ? '<svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-heart-fill"/></svg>'
      : '<svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-heart"/></svg>';
    btn.classList.toggle('wishlisted', wishlist.includes(id));
    // Brief pointer-events block to prevent accidental double-tap
    btn.style.pointerEvents = 'none';
    setTimeout(() => { btn.style.pointerEvents = ''; }, 400);
  }
  // Refresh wishlist page if open
  if (document.getElementById('wishlistPage').classList.contains('open')) renderWishlistGrid();
}

function updateWishlistUI() {
  const count = wishlist.length;
  // Header badge
  const hdrBadge = document.getElementById('wlHdrBadge');
  if (hdrBadge) { hdrBadge.textContent = count; hdrBadge.style.display = count > 0 ? 'flex' : 'none'; }
  const hdrIcon = document.getElementById('wlHdrIcon');
  if (hdrIcon) hdrIcon.textContent = count > 0 ? '❤' : '♡';
  // Bottom nav badges (two nav bars exist — update all)
  document.querySelectorAll('#bnWishBadge, #bnWishBadge2').forEach(bnBadge => {
    bnBadge.textContent = count; bnBadge.classList.toggle('show', count > 0);
  });
  // Wishlist count label
  const cl = document.getElementById('wishlistCount');
  if (cl) cl.textContent = count + (count === 1 ? ' продукт' : ' продукта');
}

function openWishlist() {
  renderWishlistGrid();
  document.getElementById('wishlistPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  setBottomNavActive('bn-wish');
}
function closeWishlist() {
  document.getElementById('wishlistPage').classList.remove('open');
  document.body.style.overflow = '';
  setBottomNavActive('bn-home');
}

function renderWishlistGrid() {
  const grid = document.getElementById('wishlistGrid');
  const count = document.getElementById('wishlistCount');
  if (wishlist.length === 0) {
    grid.innerHTML = `<div class="wishlist-empty">
      <div class="wishlist-empty-icon">♡</div>
      <h3>Нямаш любими продукти</h3>
      <p>Кликни на сърчицето на продукт,<br>за да го добавиш в любими.</p>
      <button type="button" class="wishlist-empty-btn" onclick="closeWishlist()">← Разгледай продуктите</button>
    </div>`;
  } else {
    const prods = wishlist.map(id => products.find(p => p.id === id)).filter(Boolean);
    count.textContent = prods.length + (prods.length === 1 ? ' продукт' : ' продукта');
    // Add-all button before the grid
    const addAllHtml = `<div class="wl-add-all-row"><button type="button" class="wl-add-all-btn" onclick="addAllWishlistToCart()"><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> Добави всички в кошницата (${prods.length})</button></div>`;
    grid.innerHTML = addAllHtml + `<div class="wishlist-grid">${prods.map(p => {
      const save = p.old ? Math.round(((p.old-p.price)/p.old)*100) : 0;
      const _wlName = escHtml(p.name);
      const imgHtml = p.img
        ? `<img class="product-img-real" src="${escHtml(p.img)}" alt="${_wlName}" loading="lazy" onload="this.classList.add('img-loaded')" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-img-emoji is-hidden" aria-hidden="true">${escHtml(p.emoji)}</span>`
        : `<span class="product-img-emoji">${escHtml(p.emoji)}</span>`;
      return `<div class="product-card pos-rel">
        <button type="button" class="wishlist-remove-btn" onclick="toggleWishlist(${p.id},{stopPropagation:()=>{}})" title="Премахни">×</button>
        <div class="product-img-wrap cursor-pointer" onclick="openProductPage(${p.id});closeWishlist();">${imgHtml}</div>
        <div class="product-body">
          <div class="product-brand">${escHtml(p.brand)}</div>
          <div class="product-name">${_wlName}</div>
          <div class="product-rating"><span class="stars">${starsHTML(p.rating)}</span><span class="rating-num">${p.rating}</span></div>
          <div class="product-footer">
            <div class="price-row">
              <div class="price-current${p.badge==='sale'?' sale':''}">${fmtPrice(p.price,p.badge==='sale'?'sale':'')}</div>
              ${p.old?`<div class="price-save">-${save}%</div>`:''}
            </div>
            <button type="button" class="add-cart-btn" onclick="addToCart(${p.id})">🛒 Добави в кошница</button>
          </div>
        </div>
      </div>`;
    }).join('')}</div>`;
  }
}


function addAllWishlistToCart() {
  const prods = wishlist.map(id => products.find(p => p.id === id)).filter(p => p && p.stock !== false);
  if (!prods.length) { showToast('⚠️ Няма налични продукти в любими!'); return; }
  prods.forEach(p => {
    const ex = cart.find(x => x.id === p.id);
    if (ex) ex.qty++; else cart.push({...p, qty: 1});
  });
  updateCart(); saveCart();
  showToast(`🛒 ${prods.length} продукта добавени в кошницата!`);
}

// ===== MY ORDERS PAGE =====
function openMyOrders() {
  if (!currentUser) { openAuthModal('login'); return; }
  renderMyOrders();
  document.getElementById('myOrdersPage').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMyOrders() {
  document.getElementById('myOrdersPage').classList.remove('open');
  document.body.style.overflow = '';
}

function renderMyOrders() {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch(e) {}
  const grid = document.getElementById('myOrdersGrid');
  if (!grid) return;

  if (orders.length === 0) {
    grid.innerHTML = `
      <div class="mo-empty">
        <div class="mo-empty-icon">📦</div>
        <p class="mo-empty-text">Нямаш поръчки все още.<br>Разгледай нашите продукти!</p>
        <button type="button" class="mo-empty-btn" data-action="closeMyOrders">Към магазина →</button>
      </div>`;
    return;
  }

  const statusLabels = { pending:'⏳ Изчаква', processing:'⚙ Обработва се', shipped:'🚚 Изпратена', delivered:'✅ Доставена', cancelled:'❌ Отказана' };
  const statusClass  = { pending:'mo-st-pending', processing:'mo-st-processing', shipped:'mo-st-shipped', delivered:'mo-st-delivered', cancelled:'mo-st-cancelled' };

  grid.innerHTML = orders.map(o => {
    const _oNum = escHtml(o.num || '');
    const _oDate = escHtml(o.date || '');
    const _oDel = escHtml(o.deliveryType || '—');
    const _oStatus = escHtml(statusLabels[o.status] || o.status || '');
    const _oStatusCls = statusClass[o.status] || 'mo-st-pending';
    const items = (o.itemsData || []).map(x =>
      `<div class="mo-item-row">
        <span class="mo-item-emoji">${escHtml(x.emoji||'📦')}</span>
        <div class="mo-item-info">
          <div class="mo-item-name">${escHtml(x.name||'')}</div>
          <div class="mo-item-meta">${escHtml(x.brand||'')} · ×${Number(x.qty)||0}</div>
        </div>
        <div class="mo-item-price">${fmtEur(x.price * x.qty)}</div>
      </div>`
    ).join('');
    return `
      <div class="mo-card">
        <div class="mo-card-header">
          <div>
            <div class="mo-card-num">${_oNum}</div>
            <div class="mo-card-date">${_oDate}</div>
          </div>
          <span class="mo-status ${_oStatusCls}">${_oStatus}</span>
        </div>
        <div class="mo-card-items">${items}</div>
        <div class="mo-card-footer">
          <span class="mo-card-delivery">🚚 ${_oDel}</span>
          <div class="mo-card-total">
            <span class="mo-card-total-label">Общо:</span>
            <span class="mo-card-total-val">${fmtEur(o.total)} <span class="mo-card-total-bgn">/ ${fmtBgn(o.total)}</span></span>
          </div>
          <button type="button" class="mo-print-btn" onclick="printOrder(${JSON.stringify(o.num||'')})" title="Принтирай поръчката">
            <svg width="14" height="14" class="svg-ic" aria-hidden="true"><use href="#ic-printer"/></svg> Принтирай
          </button>
        </div>
      </div>`;
  }).join('');
}

function printOrder(num) {
  let orders = [];
  try { orders = JSON.parse(localStorage.getItem('mc_orders') || '[]'); } catch(e) {}
  const o = orders.find(x => x.num === num);
  if (!o) { showToast('Поръчката не е намерена'); return; }
  const statusLabels = { pending:'Изчаква', processing:'Обработва се', shipped:'Изпратена', delivered:'Доставена', cancelled:'Отказана', paid:'Платена' };
  const statusColors = { pending:'#f59e0b', paid:'#10b981', shipped:'#6366f1', delivered:'#10b981', cancelled:'#ef4444' };
  const delivery = o.delivery || 0;
  const subtotal = o.subtotal || (o.total - delivery);
  const _h = s => escHtml(String(s||''));
  const payLabel = o.payment==='card'?'Карта':o.payment==='cod'?'Наложен платеж':'Банков превод';
  const items = (o.itemsData && o.itemsData.length)
    ? o.itemsData.map(x => `<tr><td>${_h(x.emoji||'')}${_h(x.name||'')}</td><td>${_h(x.brand||'')}</td><td style="text-align:center;">×${Number(x.qty)||0}</td><td style="text-align:right;font-weight:700;">${(x.price*x.qty).toFixed(2)} лв.<br><span style="font-size:10px;color:#6b7280;">${((x.price*x.qty)/1.95583).toFixed(2)} €</span></td></tr>`).join('')
    : `<tr><td colspan="4" style="color:#9ca3af;text-align:center;padding:16px;">${_h(o.items||'—')}</td></tr>`;
  const win = window.open('', '_blank', 'width=760,height=700');
  if (!win) { showToast('⚠️ Попъп прозорецът е блокиран. Разреши попъпи за този сайт.'); return; }
  win.document.write(`<!DOCTYPE html><html lang="bg"><head><meta charset="utf-8">
    <title>Фактура ${_h(o.num)} — Most Computers</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'Segoe UI',Arial,sans-serif;background:#f8f9fa;color:#1f2937;font-size:13px;padding:0}
      .page{max-width:700px;margin:0 auto;background:#fff;min-height:100vh;padding:40px}
      .header{display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:24px;border-bottom:2px solid #e5e7eb;margin-bottom:28px}
      .logo{font-size:22px;font-weight:900;color:#111;letter-spacing:-0.5px}
      .logo span{color:#6366f1}
      .logo-sub{font-size:11px;color:#9ca3af;margin-top:3px}
      .inv-meta{text-align:right}
      .inv-num{font-size:18px;font-weight:800;color:#6366f1}
      .inv-date{font-size:11px;color:#9ca3af;margin-top:4px}
      .status-badge{display:inline-block;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;margin-top:6px;color:#fff;background:${statusColors[o.status]||'#6b7280'}}
      .section{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px}
      .box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px}
      .box-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;margin-bottom:10px}
      .box-val{font-size:13px;color:#1f2937;line-height:1.7}
      table{width:100%;border-collapse:collapse;margin-bottom:20px}
      thead th{background:#f3f4f6;padding:10px 12px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#6b7280;text-align:left;border-bottom:2px solid #e5e7eb}
      tbody td{padding:10px 12px;border-bottom:1px solid #f3f4f6;color:#374151;vertical-align:top}
      tbody tr:last-child td{border-bottom:none}
      .totals{margin-left:auto;max-width:280px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px}
      .tot-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:#6b7280}
      .tot-row.grand{font-size:16px;font-weight:800;color:#1f2937;border-top:2px solid #e5e7eb;margin-top:8px;padding-top:12px}
      .footer{margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;font-size:11px;color:#9ca3af}
      @media print{body{background:#fff}.page{padding:24px;box-shadow:none}button{display:none!important}}
      .print-btn{display:block;margin:0 auto 20px;padding:10px 28px;background:#6366f1;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Segoe UI',sans-serif}
    </style></head><body>
    <div class="page">
      <button class="print-btn" onclick="window.print()">🖨 Принтирай фактурата</button>
      <div class="header">
        <div>
          <div class="logo">Most <span>Computers</span></div>
          <div class="logo-sub">mostcomputers.bg &nbsp;·&nbsp; office@mostcomputers.bg</div>
        </div>
        <div class="inv-meta">
          <div class="inv-num">Поръчка ${_h(o.num)}</div>
          <div class="inv-date">Дата: ${_h(o.date)}</div>
          <div class="inv-date">Доставка: ${_h(o.deliveryType||'—')} &nbsp;·&nbsp; Плащане: ${_h(payLabel)}</div>
          <div><span class="status-badge">${_h(statusLabels[o.status]||o.status)}</span></div>
        </div>
      </div>
      <div class="section">
        <div class="box">
          <div class="box-title">Клиент</div>
          <div class="box-val">
            <strong>${_h(o.customer||'—')}</strong><br>
            ${_h(o.email||'')}<br>
            ${_h(o.phone||'')}
          </div>
        </div>
        <div class="box">
          <div class="box-title">Адрес за доставка</div>
          <div class="box-val">
            ${_h(o.city||'—')}, ${_h(o.addr||'')}<br>
            ${o.zip ? 'ПК ' + _h(o.zip) : ''}
          </div>
        </div>
      </div>
      <table>
        <thead><tr><th>Продукт</th><th>Марка</th><th style="text-align:center">Бр.</th><th style="text-align:right">Сума</th></tr></thead>
        <tbody>${items}</tbody>
      </table>
      <div class="totals">
        <div class="tot-row"><span>Продукти</span><span>${subtotal.toFixed(2)} лв.</span></div>
        <div class="tot-row"><span>Доставка</span><span>${delivery===0?'Безплатно':delivery.toFixed(2)+' лв.'}</span></div>
        <div class="tot-row grand"><span>Общо</span><span>${o.total.toFixed(2)} лв. / ${(o.total/1.95583).toFixed(2)} €</span></div>
      </div>
      <div class="footer">
        <span>Most Computers ЕООД &nbsp;·&nbsp; ЕИК 123456789</span>
        <span>Генерирано: ${new Date().toLocaleString('bg-BG')}</span>
      </div>
    </div>
    </body></html>`);
  win.document.close();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { toggleWishlist, _resetWishlist: () => { wishlist = []; } };
}

// ===== RECENTLY VIEWED =====
let recentlyViewed = [];
try { recentlyViewed = JSON.parse(localStorage.getItem('mc_rv') || '[]'); } catch(e) {}

function addToRecentlyViewed(id) {
  recentlyViewed = [id, ...recentlyViewed.filter(x=>x!==id)].slice(0, 10);
  try { localStorage.setItem('mc_rv', JSON.stringify(recentlyViewed)); } catch(e){}
  renderRecentlyViewed();
}

function renderRecentlyViewed() {
  const section = document.getElementById('recentlyViewedSection');
  const scroll = document.getElementById('rvScroll');
  if (!section || !scroll) return;
  const items = recentlyViewed.map(id => products.find(p=>p.id===id)).filter(Boolean);
  if (items.length < 2) { section.style.display='none'; return; }
  section.style.display = '';
  scroll.innerHTML = items.map(p => `
    <div class="rv-card" onclick="openProductPage(${p.id})">
      ${p.img
        ? `<img class="rv-card-img" src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="rv-card-emoji is-hidden">${p.emoji}</span>`
        : `<span class="rv-card-emoji">${p.emoji}</span>`}
      <div class="rv-card-name">${p.name}</div>
      <div class="rv-card-price">${fmtEur(p.price)}</div>
    </div>`).join('');
}

function clearRecentlyViewed() {
  recentlyViewed = [];
  try { localStorage.removeItem('mc_rv'); } catch(e){}
  const section = document.getElementById('recentlyViewedSection');
  if (section) section.style.display = 'none';
  showToast('🗑 История изчистена');
}

// Init recently viewed on load
// renderRecentlyViewed called in DOMContentLoaded


// ── Canonical category normalization ─────────────────────────────────────────
// Maps any cat value (old-style or XML-imported) → one of the 11 canonical cats:
// laptops | desktops | gaming | components | monitors | peripherals | phones | network | storage | software | accessories
function normalizeCat(cat) {
  const m = {
    laptop:'laptops',    laptops:'laptops',
    desktop:'desktops',  desktops:'desktops',
    gaming:'gaming',     game:'gaming',
    components:'components', component:'components',
    monitor:'monitors',  monitors:'monitors',  display:'monitors',
    audio:'peripherals', camera:'peripherals',
    print:'peripherals', peripherals:'peripherals',
    phone:'phones',      phones:'phones',      mobile:'phones',
    tablet:'phones',     smartphones:'phones',
    tv:'accessories',    smart:'accessories',
    network:'network',
    storage:'storage',   nas:'storage',
    software:'software',
    acc:'accessories',   accessories:'accessories', accessory:'accessories',
  };
  return m[(cat||'').toLowerCase()] || 'accessories';
}

let _filterCache = null;
function _invalidateFilterCache(){ _filterCache = null; }
function getFilteredSorted(){
  const _cacheKey = JSON.stringify([currentFilter, currentSort, currentSubcat,
    typeof advFilterBrands!=='undefined'?[...advFilterBrands]:[],
    typeof advFilterRating!=='undefined'?advFilterRating:0,
    typeof advFilterSaleOnly!=='undefined'?advFilterSaleOnly:false,
    typeof advFilterNewOnly!=='undefined'?advFilterNewOnly:false,
    typeof advFilterStockOnly!=='undefined'?advFilterStockOnly:false,
    typeof advPriceMin!=='undefined'?advPriceMin:0,
    typeof advPriceMax!=='undefined'?advPriceMax:2000,
    typeof catSpecActiveFilters!=='undefined'?JSON.stringify(Object.fromEntries(Object.entries(catSpecActiveFilters).map(([k,v])=>[k,[...v]]))):'{}',
  ]);
  if (_filterCache && _filterCache.key === _cacheKey) return _filterCache.list;
  let list=currentFilter==='all'?[...products]:products.filter(p=>normalizeCat(p.cat)===currentFilter);
  // Subcat filter
  if(typeof matchesSubcat==='function' && currentSubcat && currentSubcat!=='all')
    list=list.filter(p=>matchesSubcat(p, currentSubcat));
  // Category-specific spec filters
  if(typeof matchesCatSpec==='function')
    list=list.filter(p=>matchesCatSpec(p));
  // Sort
  if(currentSort==='bestseller')list.sort((a,b)=>(b.rating*Math.log1p(b.rv||1))-(a.rating*Math.log1p(a.rv||1)));
  else if(currentSort==='price-asc')list.sort((a,b)=>a.price-b.price);
  else if(currentSort==='price-desc')list.sort((a,b)=>b.price-a.price);
  else if(currentSort==='rating')list.sort((a,b)=>b.rating-a.rating);
  else if(currentSort==='discount')list.sort((a,b)=>b.pct-a.pct);
  // Advanced sidebar filters
  if(typeof advFilterBrands!=='undefined' && advFilterBrands.size>0) list=list.filter(p=>advFilterBrands.has(p.brand));
  if(typeof advFilterRating!=='undefined' && advFilterRating>0) list=list.filter(p=>p.rating>=advFilterRating);
  if(typeof advFilterSaleOnly!=='undefined' && advFilterSaleOnly) list=list.filter(p=>p.badge==='sale');
  if(typeof advFilterNewOnly!=='undefined'  && advFilterNewOnly)  list=list.filter(p=>p.badge==='new'||p.badge==='hot');
  if(typeof advFilterStockOnly!=='undefined' && advFilterStockOnly) list=list.filter(p=>p.stock!==false&&p.stock!==0);
  // Price range filter (EUR)
  if(typeof advPriceMin!=='undefined' && (advPriceMin>0 || advPriceMax<(_sbPriceAbsMax||2000))){
    const _rate=typeof EUR_RATE!=='undefined'&&EUR_RATE?EUR_RATE:1.95583;
    list=list.filter(p=>{ const eur=p.price/_rate; return eur>=advPriceMin && eur<=advPriceMax; });
  }
  _filterCache = { key: _cacheKey, list };
  return list;
}
let topGridPage = 1;
const TOP_PAGE_SIZE = 12;

function applyFilter(btn,cat){
  document.querySelectorAll('.filter-pill').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter=cat;
  currentSubcat='all';
  topGridPage=1;
  // Show subcategory pills
  if(typeof renderSubcatBar==='function') renderSubcatBar(cat);
  // Show category-specific filters in sidebar
  if(typeof renderCatSpecFilters==='function'){
    if(cat==='all') hideCatSpecFilters();
    else renderCatSpecFilters(cat);
  }
  // Breadcrumb
  if(typeof bcOnFilterCat==='function') bcOnFilterCat(cat);
  renderTopGrid();
}
function applySort(val){currentSort=val;topGridPage=1;renderTopGrid();}
function _ensureTopSortBar() {
  if (document.getElementById('topSortBar')) return;
  const grid = document.getElementById('topGrid');
  if (!grid) return;
  const bar = document.createElement('div');
  bar.id = 'topSortBar';
  bar.className = 'top-sort-bar';
  bar.innerHTML = `<span class="top-sort-label">Сортирай:</span>
    <select class="sort-select" id="topSortSelect" onchange="applySort(this.value)">
      <option value="bestseller">🏆 Най-продавани</option>
      <option value="price-asc">Цена ↑</option>
      <option value="price-desc">Цена ↓</option>
      <option value="rating">⭐ Рейтинг</option>
      <option value="discount">% Отстъпка</option>
    </select>
    <span class="top-sort-count" id="topSortCount"></span>`;
  grid.before(bar);
}

function goToPage(n) {
  topGridPage = n;
  renderTopGrid();
  const grid = document.getElementById('topGrid');
  if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function _buildPagination(current, total) {
  if (total <= 1) return '';
  const pages = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('…');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push('…');
    pages.push(total);
  }
  const btn = (p) => p === '…'
    ? `<span class="pg-ellipsis">…</span>`
    : `<button type="button" class="pg-btn${p === current ? ' active' : ''}" onclick="goToPage(${p})">${p}</button>`;
  return `<div class="pagination-bar" style="grid-column:1/-1;">
    <button type="button" class="pg-btn pg-prev" onclick="goToPage(${current - 1})"${current === 1 ? ' disabled' : ''}>‹</button>
    ${pages.map(btn).join('')}
    <button type="button" class="pg-btn pg-next" onclick="goToPage(${current + 1})"${current === total ? ' disabled' : ''}>›</button>
    <span class="pg-info">${(current - 1) * TOP_PAGE_SIZE + 1}–${Math.min(current * TOP_PAGE_SIZE, _filterCache && _filterCache.list ? _filterCache.list.length : current * TOP_PAGE_SIZE)} от <strong id="pgTotal"></strong></span>
  </div>`;
}

function renderTopGrid(){
  _ensureTopSortBar();
  const list = getFilteredSorted();
  const totalPages = Math.max(1, Math.ceil(list.length / TOP_PAGE_SIZE));
  if (topGridPage > totalPages) topGridPage = totalPages;
  const grid = document.getElementById('topGrid');
  if (typeof showSkeletons === 'function') showSkeletons('topGrid', 8);
  const from = (topGridPage - 1) * TOP_PAGE_SIZE;
  const shown = list.slice(from, from + TOP_PAGE_SIZE);
  // Sync sort select
  const sel = document.getElementById('topSortSelect'); if (sel) sel.value = currentSort;
  // Update count
  const cnt = document.getElementById('topSortCount'); if (cnt) cnt.textContent = list.length + ' продукта';
  grid.innerHTML = list.length === 0
    ? `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);">
        <div style="font-size:48px;margin-bottom:12px;">🔍</div>
        <div style="font-size:16px;font-weight:700;color:var(--text);">Няма продукти в тази категория</div>
        <div style="font-size:13px;margin-top:6px;">Опитай да смениш филтъра или добави продукти от Admin панела.</div>
      </div>`
    : shown.map(p => makeCard(p)).join('') + _buildPagination(topGridPage, totalPages);
  const pgTotal = document.getElementById('pgTotal'); if (pgTotal) pgTotal.textContent = list.length;
  const rc = document.getElementById('resultsCount'); if (rc) rc.textContent = list.length + ' продукта';
  compareList.forEach(id => { const cb = document.getElementById('cmp-' + id); if (cb) cb.checked = true; });
  updateLiveCount(list.length);
}
function renderGrids(){
  const _flashProds=[...products].filter(p=>p.old&&p.pct>0).sort((a,b)=>b.pct-a.pct).slice(0,5);
  const flashSection=document.getElementById('sale');
  if(flashSection) flashSection.style.display=_flashProds.length?'':'none';
  const fg=document.getElementById('flashGrid'); if(fg) fg.innerHTML=_flashProds.map(p=>makeCard(p,true)).join('');
  renderTopGrid();
  const _saleProds=products.filter(p=>p.badge==='sale');
  const sg=document.getElementById('specialGrid');
  if(sg){
    sg.innerHTML=_saleProds.slice(0,8).map(p=>makeCard(p)).join('');
    const _sgMore=document.getElementById('specialGridMore');
    if(_sgMore) _sgMore.style.display=_saleProds.length>8?'':'none';
    sg.closest('.section-wrap').style.display=_saleProds.length?'':'none';
  }
  // Slide 1 — cheapest flash-sale product
  const _s1Prods = [...products].filter(p=>p.old&&p.pct>0).sort((a,b)=>a.price-b.price);
  const _s1el = document.getElementById('slide1Price');
  if(_s1Prods.length && _s1el) {
    const _s1min = _s1Prods[0], _s1max = _s1Prods[_s1Prods.length-1];
    _s1el.innerHTML = `от <b>${(_s1min.price/EUR_RATE).toFixed(2)} €</b> / ${_s1min.price} лв. <small>вместо ${(_s1min.old/EUR_RATE).toFixed(2)} € / ${_s1min.old} лв.</small>`;
  }
  // Slide 2 — sync price from products array (id:99 = MacBook Pro M4)
  const _s2 = products.find(p=>p.id===99);
  const _s2el = document.getElementById('slide2Price');
  if(_s2 && _s2el) _s2el.innerHTML = `${(_s2.price/EUR_RATE).toFixed(2)} € / ${_s2.price} лв. <small>с ДДС</small>`;
  const ng=document.getElementById('newGrid'); if(ng) ng.innerHTML=products.filter(p=>p.badge==='new').concat(products.filter(p=>p.badge==='hot')).slice(0,5).map(p=>makeCard(p,true)).join('');
  // Promo strip — update free delivery threshold with current EUR rate
  const _freeDelEur = 100;
  const _freeDelBgn = (Math.round(_freeDelEur * EUR_RATE * 100) / 100).toFixed(2);
  document.querySelectorAll('.promo-free-del').forEach((el, i) => {
    const prefix = i === 0
      ? `<svg width="14" height="14" class="svg-ic" aria-hidden="true"><use href="#ic-truck"/></svg> `
      : '🚚 ';
    el.innerHTML = prefix + `Безплатна доставка над ${_freeDelEur} € / ${_freeDelBgn} лв.`;
  });
  renderHeroPanel();
  renderPromoBanner();
  updateWishlistUI();
  if(typeof initLazyImages==='function') initLazyImages();
  if(typeof renderHpSubcatsStrip==='function') renderHpSubcatsStrip();
}

function renderHeroPanel(){
  const panel = document.getElementById('heroRightPanel');
  if(!panel) return;
  const byScore = [...products].sort((a,b)=>(b.rating*(b.rv||1))-(a.rating*(a.rv||1)));
  const picks = [
    { p: byScore[0], label:'⭐ Препоръчано', cls:'mini-promo-recommended' },
    { p: byScore.find(p=>p.badge==='sale'), label:'🔥 Бестселър', cls:'mini-promo-bestseller' },
    { p: [...products].filter(p=>p.badge==='new'||p.badge==='hot')[0], label:'🆕 Ново', cls:'mini-promo-new' },
  ];
  panel.innerHTML = picks.filter(x=>x.p).map(({p,label,cls})=>`
    <div class="mini-promo ${cls}">
      <div class="mini-promo-emoji">${p.emoji}</div>
      <div class="mini-promo-text">
        <div class="mini-promo-label">${label}</div>
        <div class="mini-promo-name">${p.name.length>32?p.name.slice(0,32)+'…':p.name}</div>
        ${p.old?`<div class="mini-promo-old">${(p.old/EUR_RATE).toFixed(2)} € / ${p.old} лв.</div>`:''}
        <div class="mini-promo-price">${(p.price/EUR_RATE).toFixed(2)} € / ${p.price} лв.</div>
      </div>
      <button type="button" class="mini-promo-view" onclick="event.stopPropagation();openProductPage(${p.id})">Виж →</button>
    </div>`).join('');
}

function renderPromoBanner(){
  const banner = document.getElementById('promoBanner');
  if(!banner) return;
  // Top new product + top sale product
  const newP  = [...products].filter(p=>p.badge==='new'||p.badge==='hot').sort((a,b)=>b.rating-a.rating)[0];
  const saleP = [...products].filter(p=>p.badge==='sale').sort((a,b)=>b.pct-a.pct)[0];
  if(!newP||!saleP) return;
  const themes = [
    { p:newP,  cls:'blue', badge:`🆕 Ново`,      sub: newP.desc  ? newP.desc.slice(0,80)+'…'  : newP.name },
    { p:saleP, cls:'dark', badge:`🔥 -${saleP.pct}%`, sub: saleP.desc ? saleP.desc.slice(0,80)+'…' : saleP.name },
  ];
  banner.innerHTML = themes.map(({p,cls,badge,sub})=>`
    <div class="promo-half ${cls}">
      <span class="badge">${badge}</span>
      <h3>${p.name.length>36?p.name.slice(0,36)+'…':p.name}</h3>
      <p>${sub}</p>
      <div class="promo-price">${(p.price/EUR_RATE).toFixed(2)} € / ${p.price} лв.</div>
      <button type="button" class="promo-btn" onclick="addToCart(${p.id})">Добави в кошница +</button>
      <div class="promo-emoji">${p.emoji}</div>
    </div>`).join('');
}


// ===== PRICE SLIDER =====
let srpPriceMinVal=0, srpPriceMaxVal=5000, srpCurrentQuery='', srpCurrentCatFilter='';
function updatePriceSlider(){
  const mn = document.getElementById('priceMin'), mx = document.getElementById('priceMax');
  if(!mn||!mx) return;
  let minV=parseInt(mn.value), maxV=parseInt(mx.value);
  if(isNaN(minV)) minV=0; if(isNaN(maxV)) maxV=5000;
  if(minV > maxV-50){ minV=maxV-50; mn.value=minV; }
  srpPriceMinVal=minV; srpPriceMaxVal=maxV;
  const srpVals=document.getElementById('srpPriceVals'); if(srpVals) srpVals.textContent = fmtBgn(minV) + ' — ' + fmtBgn(maxV);
  const rng = document.getElementById('sliderRange');
  if(rng){ rng.style.left=(minV/5000*100)+'%'; rng.style.width=((maxV-minV)/5000*100)+'%'; }
  let res = searchProducts(srpCurrentQuery, srpCurrentCatFilter).filter(p => p.price>=minV && p.price<=maxV);
  const srpCnt=document.getElementById('srpCount'); if(srpCnt) srpCnt.textContent = res.length + ' резултата';
  renderSRPGrid(res, srpCurrentQuery);
}
// price slider integrated into showSearchResultsPage directly


// ===== ADVANCED SIDEBAR FILTERS =====
let advFilterBrands = new Set();
let advFilterRating = 0;
let advFilterSaleOnly = false;
let advFilterNewOnly = false;
let advFilterStockOnly = false;



function initSidebarFilters() {
  // Dynamic brand list from actual products, sorted by count desc
  const EXCLUDE_BRANDS = new Set(['Apple','Samsung','Sony','TP-Link','Bose','Xiaomi','Google','Dell','Philips','JBL','GoPro','WD','Anker','_NONAME']);
  const brandCounts = {};
  products.forEach(p => { if(p.brand) brandCounts[p.brand] = (brandCounts[p.brand]||0) + 1; });
  const ALL_BRANDS = Object.entries(brandCounts)
    .filter(([b]) => !EXCLUDE_BRANDS.has(b))
    .sort((a,b) => b[1]-a[1])
    .map(([b]) => b);
  const el = document.getElementById('brandFilterList');
  if (el) {
    el.innerHTML = ALL_BRANDS.map(b => {
      const c = brandCounts[b];
      const esc = b.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const jsEsc = b.replace(/\\/g,'\\\\').replace(/'/g,"\\'"); // escape for JS string literal
      return `<label class="brand-filter-item">
        <input type="checkbox" value="${esc}" onchange="toggleBrandFilter('${jsEsc}',this.checked)">
        <span>${esc}</span>
        <span class="brand-count">${c}</span>
      </label>`;
    }).join('');
  }
  // Rating counts
  const rc = (min) => products.filter(p=>p.rating>=min).length;
  const r0 = document.getElementById('rc-0'); if(r0) r0.textContent = products.length;
  const r45 = document.getElementById('rc-45'); if(r45) r45.textContent = rc(4.5);
  const r40 = document.getElementById('rc-40'); if(r40) r40.textContent = rc(4.0);
  const r30 = document.getElementById('rc-30'); if(r30) r30.textContent = rc(3.0);
  // Dynamic price range from actual products
  if (products.length > 0) {
    const prices = products.map(p => p.price / (typeof EUR_RATE !== 'undefined' ? EUR_RATE : 1.96)).filter(v => v > 0);
    if (prices.length > 0) {
      const rawMax = Math.max(...prices);
      _sbPriceAbsMax = Math.ceil(rawMax / 100) * 100; // round up to nearest 100€
      advPriceMax = _sbPriceAbsMax;
      const mnEl = document.getElementById('sbPriceMin');
      const mxEl = document.getElementById('sbPriceMax');
      if (mnEl) { mnEl.max = _sbPriceAbsMax; mnEl.value = 0; }
      if (mxEl) { mxEl.max = _sbPriceAbsMax; mxEl.value = _sbPriceAbsMax; }
      const vals = document.getElementById('sbPriceVals');
      if (vals) vals.textContent = 'Всички цени';
    }
  }
  // Price group counts
  initPriceGroupCounts();
  // Init live count
  updateLiveCount(products.length);
  // Init slider track
  const rng = document.getElementById('sbSliderRange');
  if(rng){rng.style.left='0%';rng.style.width='100%';}
}

// Initialize UI actions


function toggleSfb(id) {
  const body = document.getElementById(id);
  const arrow = document.getElementById(id+'-arrow');
  if (!body) return;
  const isOpen = body.classList.toggle('open');
  if (arrow) arrow.classList.toggle('open', isOpen);
}

function toggleBrandFilter(brand, checked) {
  if (checked) advFilterBrands.add(brand);
  else advFilterBrands.delete(brand);
  applyAdvFilters();
}

function applyAdvFilters() {
  advFilterRating = parseFloat(document.querySelector('input[name="ratingFilter"]:checked')?.value||'0');
  advFilterSaleOnly = document.getElementById('saleOnlyToggle')?.checked||false;
  advFilterNewOnly  = document.getElementById('newOnlyToggle')?.checked||false;
  advFilterStockOnly = document.getElementById('stockOnlyToggle')?.checked||false;
  topGridPage = 1;
  renderTopGrid();
  updateActiveFiltersBar();
  // Update live count
  const filtered = getFilteredSorted();
  updateLiveCount(filtered.length);
}

// Store active filter removers by index to avoid closure serialization
window._afRemove = [];
function updateActiveFiltersBar() {
  const bar = document.getElementById('activeFiltersBar');
  const chips = document.getElementById('activeFilterChips');
  if (!bar || !chips) return;
  window._afRemove = [];
  const active = [];
  // Category chip
  const _catLabels = { phones:'📱 Телефони', laptops:'💻 Лаптопи', desktops:'🖥 Настолни', gaming:'🎮 Гейминг', monitors:'🖥 Монитори', components:'⚙️ Компоненти', peripherals:'🖱 Периферия', network:'📡 Мрежово', storage:'💾 Сторидж', software:'📀 Софтуер', accessories:'🎒 Аксесоари' };
  if (currentFilter && currentFilter !== 'all') {
    const idx = window._afRemove.length;
    window._afRemove.push(() => {
      currentFilter = 'all';
      currentSubcat = 'all';
      document.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      const allPill = document.querySelector('.filter-pill:first-of-type');
      if (allPill) allPill.classList.add('active');
      if (typeof renderSubcatBar === 'function') renderSubcatBar('all');
      if (typeof hideCatSpecFilters === 'function') hideCatSpecFilters();
      if (typeof bcOnFilterCat === 'function') bcOnFilterCat('all');
      topGridPage = 1;
      renderTopGrid();
      updateURL();
      updateActiveFiltersBar();
    });
    active.push({ label: _catLabels[currentFilter] || currentFilter, idx });
  }
  advFilterBrands.forEach(b => {
    const idx = window._afRemove.length;
    window._afRemove.push(() => { const cb=document.querySelector(`input[type=checkbox][value="${CSS.escape(b)}"]`); if(cb) cb.checked=false; advFilterBrands.delete(b); applyAdvFilters(); });
    active.push({ label: '🏷 '+b, idx });
  });
  if (advFilterRating > 0) {
    const idx = window._afRemove.length;
    window._afRemove.push(() => { const r=document.querySelector('input[name="ratingFilter"][value="0"]'); if(r) r.checked=true; applyAdvFilters(); });
    active.push({ label:`⭐ ${advFilterRating}+`, idx });
  }
  if (advFilterSaleOnly) {
    const idx = window._afRemove.length;
    window._afRemove.push(() => { const el=document.getElementById('saleOnlyToggle'); if(el) el.checked=false; applyAdvFilters(); });
    active.push({ label:'🔥 Само намалени', idx });
  }
  if (advFilterNewOnly) {
    const idx = window._afRemove.length;
    window._afRemove.push(() => { const el=document.getElementById('newOnlyToggle'); if(el) el.checked=false; applyAdvFilters(); });
    active.push({ label:'🆕 Само нови', idx });
  }
  if (advFilterStockOnly) {
    const idx = window._afRemove.length;
    window._afRemove.push(() => { const el=document.getElementById('stockOnlyToggle'); if(el) el.checked=false; applyAdvFilters(); });
    active.push({ label:'✓ В наличност', idx });
  }
  if (typeof advPriceMin!=='undefined' && (advPriceMin>0||advPriceMax<2000)) {
    const idx = window._afRemove.length;
    window._afRemove.push(() => { setPriceGroup(0,2000,'pg-all'); applyAdvFilters(); });
    active.push({ label:`💰 ${advPriceMin}€–${advPriceMax}€`, idx });
  }
  if (active.length === 0) { bar.classList.remove('show'); return; }
  bar.classList.add('show');
  chips.innerHTML = active.map(f =>
    `<span class="active-filter-chip" onclick="window._afRemove[${f.idx}]&&window._afRemove[${f.idx}]()">${f.label} ✕</span>`
  ).join('');
}

function resetAllFilters() {
  // Reset subcategory
  currentSubcat = 'all';
  if (typeof catSpecActiveFilters !== 'undefined') catSpecActiveFilters = {};
  const subcatBar = document.getElementById('subcatBar');
  if (subcatBar) { subcatBar.classList.remove('visible'); subcatBar.innerHTML = ''; }
  if (typeof hideCatSpecFilters === 'function') hideCatSpecFilters();
  document.querySelectorAll('#catSpecFiltersInner input[type=checkbox]').forEach(cb => cb.checked = false);
  advFilterBrands.clear();
  advFilterRating = 0;
  document.querySelectorAll('#brandFilterList input').forEach(c=>c.checked=false);
  const r0 = document.querySelector('input[name="ratingFilter"][value="0"]'); if(r0) r0.checked=true;
  const st = document.getElementById('stockOnlyToggle'); if(st) st.checked=false;
  const sa = document.getElementById('saleOnlyToggle'); if(sa) sa.checked=false;
  const nw = document.getElementById('newOnlyToggle'); if(nw) nw.checked=false;
  advFilterSaleOnly=false; advFilterNewOnly=false; advFilterStockOnly=false;
  // Reset price
  setPriceGroup(0, _sbPriceAbsMax || 2000, 'pg-all');
  clearBrandSearch();
  applyAdvFilters();
  // Clear URL params
  if (typeof updateURL === 'function') updateURL();
}

// Adv filters applied inside getFilteredSorted directly (no override needed)

// Override filterCat to scroll + filter
function filterCat(cat) {
  const pill = document.querySelector(`.filter-pill[onclick*="'${cat}'"]`);
  if (pill) { applyFilter(pill, cat); }
  else { currentFilter = cat; currentSubcat = 'all'; renderTopGrid(); updateURL(); updateActiveFiltersBar(); }
  const featured = document.getElementById('featured');
  if (featured) featured.scrollIntoView({behavior:'smooth'});
  if (typeof bcOnFilterCat === 'function') bcOnFilterCat(cat);
  // Dynamic meta
  if (typeof setPageMeta === 'function' && cat && cat !== 'all') {
    const label = (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[cat]) ? CAT_LABELS[cat] : cat;
    setPageMeta(
      label + ' — Most Computers',
      'Купи ' + label + ' онлайн от Most Computers. Най-добри цени, гаранция, бърза доставка.'
    );
  } else if (typeof restorePageMeta === 'function' && (!cat || cat === 'all')) {
    restorePageMeta();
  }
  if (typeof injectCategoryItemList === 'function') injectCategoryItemList(cat);
}

// Init on load
// initSidebarFilters called in DOMContentLoaded

// Export for tests/environment detection

// syncFiltersToUrl е псевдоним на updateURL() — дефинирана по-долу в файла
function syncFiltersToUrl() { if (typeof updateURL === 'function') updateURL(); }

// ===== SIDEBAR PRICE SLIDER =====
let advPriceMin = 0, advPriceMax = 2000, activePriceGroup = 'pg-all';
let _sbPriceAbsMax = 2000; // обновява се динамично от initSidebarFilters
// EUR_RATE comes from currency.js

function updateSbSlider() {
  const mn = document.getElementById('sbPriceMin');
  const mx = document.getElementById('sbPriceMax');
  if (!mn || !mx) return;
  let minV = parseFloat(mn.value), maxV = parseFloat(mx.value);
  if (minV > maxV - 10) { minV = maxV - 10; mn.value = minV; }
  advPriceMin = minV; advPriceMax = maxV;

  // Update track fill
  const _absMax1 = _sbPriceAbsMax || 2000;
  const pct1 = (minV/_absMax1)*100, pct2 = (maxV/_absMax1)*100;
  const rng = document.getElementById('sbSliderRange');
  if (rng) { rng.style.left = pct1+'%'; rng.style.width = (pct2-pct1)+'%'; }

  // Update label
  const vals = document.getElementById('sbPriceVals');
  if (vals) vals.textContent = `${minV} € — ${maxV} €`;

  // Deactivate price group buttons
  document.querySelectorAll('.price-group-btn').forEach(b => b.classList.remove('active'));
  activePriceGroup = null;

  applyAdvFilters();
}

function setPriceGroup(minEur, maxEur, groupId) {
  advPriceMin = minEur; advPriceMax = maxEur;
  activePriceGroup = groupId;

  // Update sliders
  const mn = document.getElementById('sbPriceMin');
  const mx = document.getElementById('sbPriceMax');
  if (mn) mn.value = minEur;
  if (mx) mx.value = maxEur;

  // Update track
  const _absMax2 = _sbPriceAbsMax || 2000;
  const pct1 = (minEur/_absMax2)*100, pct2 = (maxEur/_absMax2)*100;
  const rng = document.getElementById('sbSliderRange');
  if (rng) { rng.style.left=pct1+'%'; rng.style.width=(pct2-pct1)+'%'; }

  // Update label
  const vals = document.getElementById('sbPriceVals');
  if (vals) vals.textContent = minEur === 0 && maxEur >= _sbPriceAbsMax ? 'Всички цени' : `${minEur} € — ${maxEur} €`;

  // Highlight active group
  document.querySelectorAll('.price-group-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(groupId);
  if (btn) btn.classList.add('active');

  applyAdvFilters();
}

function initPriceGroupCounts() {
  const ranges = [
    { id:'pgc-all', min:0,   max:999999 },
    { id:'pgc-1',   min:0,   max:102 },
    { id:'pgc-2',   min:102, max:256 },
    { id:'pgc-3',   min:256, max:511 },
    { id:'pgc-4',   min:511, max:999999 },
  ];
  ranges.forEach(r => {
    const el = document.getElementById(r.id);
    if (el) el.textContent = products.filter(p => {
      const eur = p.price / EUR_RATE;
      return eur >= r.min && eur < r.max;
    }).length;
  });
}

// ===== BRAND FUZZY SEARCH =====
function filterBrandList(query) {
  const q = query.trim().toLowerCase();
  const items = document.querySelectorAll('#brandFilterList .brand-filter-item');
  const clearBtn = document.getElementById('brandSearchClear');
  const noRes = document.getElementById('brandNoResults');
  if (clearBtn) clearBtn.classList.toggle('show', q.length > 0);

  let visCount = 0;
  items.forEach(item => {
    const brand = item.querySelector('span')?.textContent?.toLowerCase() || '';
    // Fuzzy: all query chars appear in order in brand name
    let matches = true;
    if (q.length > 0) {
      let bi = 0;
      for (let qi = 0; qi < q.length; qi++) {
        const found = brand.indexOf(q[qi], bi);
        if (found === -1) { matches = false; break; }
        bi = found + 1;
      }
      // Highlight match
      if (matches) {
        const span = item.querySelector('span');
        if (span) {
          const orig = span.dataset.orig || span.textContent;
          span.dataset.orig = orig;
          // Simple highlight: bold matching chars
          let result = '', bi2 = 0, origLow = orig.toLowerCase();
          for (let qi = 0; qi < q.length; qi++) {
            const found = origLow.indexOf(q[qi], bi2);
            if (found === -1) break;
            result += orig.slice(bi2, found) + `<mark style="background:var(--primary-light);color:var(--primary);border-radius:2px;padding:0 1px;">${orig[found]}</mark>`;
            bi2 = found + 1;
          }
          result += orig.slice(bi2);
          span.innerHTML = result;
        }
      }
    } else {
      // Clear highlights
      const span = item.querySelector('span');
      if (span && span.dataset.orig) { span.textContent = span.dataset.orig; }
    }
    item.style.display = matches ? '' : 'none';
    if (matches) visCount++;
  });

  if (noRes) noRes.classList.toggle('show', visCount === 0 && q.length > 0);
}

function clearBrandSearch() {
  const inp = document.getElementById('brandSearch');
  if (inp) { inp.value = ''; filterBrandList(''); inp.focus(); }
}

// ===== LIVE RESULTS COUNT =====
function updateLiveCount(count) {
  const total = products.length;
  const numEl = document.getElementById('srcNum');
  const barEl = document.getElementById('srcBarFill');
  if (numEl) numEl.textContent = count;
  if (barEl) barEl.style.width = total > 0 ? Math.round((count/total)*100)+'%' : '0%';
}



// ===== SUBCATEGORIES & CATEGORY-SPECIFIC FILTERS =====

let currentSubcat = 'all'; // subcat filter value
let catSpecActiveFilters = {}; // { specKey: Set(values) }

// Subcategory definitions
const SUBCATS = {
  phones: [
    { id: 'smartphone',   label: '📱 Смартфони' },
    { id: 'tablet',       label: '📟 Таблети' },
    { id: 'smartwatch',   label: '⌚ Смарт часовници' },
  ],
  laptops: [
    { id: 'work',         label: '💼 За работа' },
    { id: 'gaming_l',     label: '🎮 За гейминг' },
    { id: 'ultrabook',    label: '✈ Ултрабуци' },
    { id: 'budget',       label: '💰 Бюджетни' },
    { id: 'convertible',  label: '🔄 2-в-1' },
    { id: 'for_students', label: '🎓 За студенти' },
    { id: 'for_devs',     label: '👨‍💻 За програмисти' },
    { id: 'for_design',   label: '🎨 За дизайнери' },
    { id: 'for_gaming',   label: '🕹 За игри' },
  ],
  desktops: [
    { id: 'office_pc',    label: '💼 Офис компютри' },
    { id: 'workstation',  label: '🔬 Workstation' },
    { id: 'aio',          label: '🖥 All-in-One' },
    { id: 'mac_desktop',  label: '🍎 Mac' },
  ],
  gaming: [
    { id: 'gaming_laptop_s', label: '💻 Геймърски лаптопи' },
    { id: 'gaming_pc_s',     label: '🖥 Геймърски конфигурации' },
    { id: 'gaming_mouse',    label: '🖱 Геймърски мишки' },
    { id: 'gaming_kb',       label: '⌨ Геймърски клавиатури' },
    { id: 'gaming_headset',  label: '🎧 Геймърски слушалки' },
  ],
  monitors: [
    { id: 'gaming_mon',   label: '🎮 Gaming 144Hz+' },
    { id: 'mon_4k',       label: '🖥 4K / UHD' },
    { id: 'ultrawide',    label: '↔ UltraWide' },
    { id: 'oled_mon',     label: '✨ OLED' },
    { id: 'office_mon',   label: '💼 Офис монитори' },
  ],
  components: [
    { id: 'cpu',         label: '⚙ Процесори' },
    { id: 'gpu',         label: '🎮 Видео карти' },
    { id: 'ram',         label: '🧠 RAM памет' },
    { id: 'ssd',         label: '💿 SSD / NVMe' },
    { id: 'hdd',         label: '💾 HDD дискове' },
    { id: 'motherboard', label: '🔩 Дънни платки' },
    { id: 'psu',         label: '⚡ Захранвания' },
    { id: 'case',        label: '🗄 Кутии' },
    { id: 'cooling',     label: '❄ Охлаждане' },
  ],
  peripherals: [
    { id: 'monitor',      label: '🖥 Монитори' },
    { id: 'keyboard',     label: '⌨ Клавиатури' },
    { id: 'mouse',        label: '🖱 Мишки' },
    { id: 'headphones',   label: '🎧 Слушалки' },
    { id: 'webcam',       label: '📷 Уеб камери' },
    { id: 'printer',      label: '🖨 Принтери' },
  ],
  network: [
    { id: 'router',       label: '📶 Рутери' },
    { id: 'switch',       label: '🔌 Суичове' },
    { id: 'ap',           label: '📡 Access Points' },
    { id: 'mesh',         label: '🔗 Mesh системи' },
  ],
  storage: [
    { id: 'nas',          label: '🗄 NAS устройства' },
    { id: 'server',       label: '🖥 Сървъри' },
    { id: 'ext_drive',    label: '💾 Външни дискове' },
    { id: 'flash',        label: '📱 Флаш памет' },
  ],
  accessories: [
    { id: 'bag',          label: '🎒 Чанти' },
    { id: 'cable',        label: '🔌 Кабели и зарядни' },
    { id: 'hub',          label: '🔀 Хъбове / Адаптери' },
    { id: 'smart_dev',    label: '⌚ Смарт устройства' },
    { id: 'mobile_acc',   label: '📱 Телефони и таблети' },
    { id: 'av',           label: '📺 Аудио / Видео' },
  ],
};

// Mega-menu flyout data: category → columns → items
const MEGA_MENU = {
  phones: [
    { title: 'Смартфони', id: 'smartphone', items: ['Apple iPhone', 'Samsung Galaxy', 'Google Pixel', 'Xiaomi'] },
    { title: 'Таблети', id: 'tablet', items: ['Apple iPad', 'Samsung Galaxy Tab', 'Android таблети'] },
    { title: 'Смарт часовници', id: 'smartwatch', items: ['Apple Watch', 'Samsung Galaxy Watch', 'Garmin', 'Fitbit'] },
  ],
  laptops: [
    { title: 'По предназначение', id: 'work', items: ['За работа', 'За гейминг', 'Ултрабуци', 'Workstation'] },
    { title: 'По марка', id: 'ultrabook', items: ['Apple MacBook', 'Dell XPS', 'ASUS ROG', 'Lenovo ThinkPad', 'HP EliteBook'] },
    { title: 'По бюджет', id: 'budget', items: ['До 500 €', '500–800 €', '800–1500 €', '1500 €+'] },
    { title: 'Use-case', id: 'for_students', items: ['За студенти', 'За програмисти', 'За дизайнери', 'За игри'] },
  ],
  desktops: [
    { title: 'Офис и Workstation', id: 'office_pc', items: ['Офис компютри', 'Workstation', 'Mac Mini / iMac', 'All-in-One'] },
    { title: 'По марка', id: 'mac_desktop', items: ['Apple', 'ASUS', 'Dell', 'HP', 'Lenovo'] },
  ],
  gaming: [
    { title: 'Геймърски лаптопи', id: 'gaming_laptop_s', items: ['ASUS ROG', 'Razer Blade', 'MSI Titan', 'Lenovo Legion'] },
    { title: 'Геймърски PC', id: 'gaming_pc_s', items: ['RTX 4070', 'RTX 4080 / 4090', 'AMD Radeon RX 7000', 'Готови конфигурации'] },
    { title: 'Периферия', id: 'gaming_mouse', items: ['Геймърски мишки', 'Механични клавиатури', 'Геймърски слушалки'] },
  ],
  monitors: [
    { title: 'Gaming монитори', id: 'gaming_mon', items: ['144Hz', '165Hz', '240Hz', '360Hz', 'QHD Gaming', '4K Gaming'] },
    { title: 'По резолюция', id: 'mon_4k', items: ['4K UHD 3840×2160', 'QHD 2560×1440', 'Full HD 1080p'] },
    { title: 'По тип', id: 'oled_mon', items: ['OLED монитори', 'IPS панели', 'VA панели', 'UltraWide 21:9', 'Curved'] },
  ],
  components: [
    { title: 'Процесори', id: 'cpu', items: ['Intel Core i5/i7/i9', 'Intel Core Ultra', 'AMD Ryzen 5/7/9', 'AMD Threadripper'] },
    { title: 'Видео карти', id: 'gpu', items: ['NVIDIA GeForce RTX 40', 'AMD Radeon RX 7000', 'Работни карти'] },
    { title: 'Памет', id: 'ram', items: ['DDR5 RAM', 'DDR4 RAM', 'SO-DIMM лаптоп'] },
    { title: 'Дискове', id: 'ssd_hdd', items: ['SSD M.2 NVMe', 'SSD SATA', 'HDD 2.5"', 'HDD 3.5"'] },
    { title: 'Дъно и корпус', id: 'motherboard', items: ['Intel LGA1851', 'Intel LGA1700', 'AMD AM5', 'AMD AM4', 'Захранвания', 'Кутии'] },
  ],
  peripherals: [
    { title: 'Въвеждане', id: 'keyboard', items: ['Механични клавиатури', 'Офис мишки', 'Trackpad', 'Геймпадове'] },
    { title: 'Аудио и видео', id: 'headphones', items: ['Слушалки', 'Тонколони', 'Уеб камери', 'Принтери'] },
  ],
  network: [
    { title: 'Рутери', id: 'router', items: ['WiFi 7', 'WiFi 6E', 'WiFi 6', 'Dual Band'] },
    { title: 'Мрежова инфра', id: 'switch', items: ['Mesh системи', 'Суичове 8p', 'Суичове 16p+', 'Access Points', 'PoE'] },
  ],
  storage: [
    { title: 'Сторидж', id: 'nas', items: ['NAS устройства', 'Сървъри', 'Rack системи'] },
    { title: 'Носители', id: 'ext_drive', items: ['Портативни SSD', 'Портативни HDD', 'USB Flash', 'SD карти'] },
  ],
  accessories: [
    { title: 'Периферни аксесоари', id: 'cable', items: ['Кабели USB-C/HDMI', 'Зарядни', 'Хъбове', 'Докинг станции'] },
    { title: 'Носене', id: 'bag', items: ['Чанти за лаптоп', 'Раници', 'Калъфи и протектори'] },
    { title: 'Смарт и мобилни', id: 'smart_dev', items: ['Смарт часовници', 'Смартфони', 'Таблети', 'Smart Home'] },
    { title: 'Аудио / Видео', id: 'av', items: ['Тонколони', 'Телевизори', 'Фотоапарати', 'Action камери'] },
  ],
};

// Category-specific spec filters

const CAT_SPEC_FILTERS = {
  phones: [
    { key: 'OS',       label: '📱 Операционна система', values: ['iOS','Android'] },
    { key: 'RAM',      label: '🧠 RAM',                 values: ['6 GB','8 GB','12 GB','16 GB'] },
    { key: 'Storage',  label: '💾 Памет',               values: ['128 GB','256 GB','512 GB','1 TB'] },
    { key: 'Display',  label: '📐 Диагонал',            values: ['6"','6.1"','6.7"','11"','13"'] },
  ],
  gaming: [
    { key: 'Type',  label: '📦 Тип',                    values: ['Лаптоп','Настолен','Мишка','Клавиатура','Слушалки'] },
    { key: 'GPU',   label: '🎮 Видео карта',            values: ['RTX 4060','RTX 4070','RTX 4080','RTX 4090','RX 7900'] },
    { key: 'RAM',   label: '🧠 Оперативна памет',       values: ['16 GB','32 GB','64 GB'] },
  ],
  monitors: [
    { key: 'Resolution',  label: '🔍 Резолюция',        values: ['Full HD 1080p','QHD 1440p','4K UHD','Ultra-Wide'] },
    { key: 'RefreshRate', label: '⚡ Честота опресняване', values: ['60 Hz','144 Hz','165 Hz','240 Hz','360 Hz'] },
    { key: 'Panel',       label: '🖥 Тип панел',        values: ['IPS','VA','OLED','Mini-LED'] },
    { key: 'Size',        label: '📐 Диагонал',         values: ['24"','27"','32"','34"','49"'] },
  ],
  laptops: [
    { key: 'CPU',     label: '💻 Процесор',            values: ['Intel Core i5','Intel Core i7','Intel Core i9','Intel Core Ultra','AMD Ryzen 5','AMD Ryzen 7','AMD Ryzen 9','Apple M3','Apple M4'] },
    { key: 'RAM',     label: '🧠 Оперативна памет',    values: ['8 GB','16 GB','24 GB','32 GB','64 GB'] },
    { key: 'GPU',     label: '🎮 Видео карта',         values: ['RTX 4050','RTX 4060','RTX 4070','RTX 4080','RTX 4090','Integrated','Apple GPU'] },
    { key: 'Display', label: '📐 Диагонал',            values: ['13"','14"','15.6"','16"','17"'] },
    { key: 'OS',      label: '🪟 Операционна система', values: ['Windows 11','macOS','Linux','Без OS'] },
  ],
  desktops: [
    { key: 'CPU',     label: '💻 Процесор',            values: ['Intel Core i5','Intel Core i7','Intel Core i9','AMD Ryzen 7','AMD Ryzen 9','Apple M4'] },
    { key: 'RAM',     label: '🧠 Оперативна памет',    values: ['16 GB','32 GB','64 GB','128 GB'] },
    { key: 'GPU',     label: '🎮 Видео карта',         values: ['RTX 4070','RTX 4080','RTX 4090','AMD Radeon','Интегрирана'] },
    { key: 'OS',      label: '🪟 Операционна система', values: ['Windows 11','macOS','Без OS'] },
  ],
  components: [
    { key: 'Тип',      label: '📦 Тип компонент',     values: ['Процесор','Видеокарта','Дънна платка','RAM','SSD NVMe','HDD','Захранване','Кутия','Охлаждане'] },
    { key: 'Brand',    label: '🏷 Производител',      values: ['Intel','AMD','ASUS','MSI','Gigabyte','ASRock','Sapphire','Palit','PowerColor','Zotac'] },
    { key: 'Socket',   label: '🔩 Сокет / Слот',      values: ['LGA1851','LGA1700','LGA1200','AM5','AM4','DDR5','DDR4','PCIe 5.0','PCIe 4.0'] },
    { key: 'TDP',      label: '🌡 TDP / Мощност',     values: ['35 W','45 W','65 W','95 W','105 W','125 W','165 W','250 W','320 W'] },
  ],
  peripherals: [
    { key: 'Type',        label: '📦 Тип',             values: ['Монитор','Клавиатура','Мишка','Слушалки','Уеб камера','Принтер'] },
    { key: 'Resolution',  label: '🔍 Резолюция',       values: ['Full HD 1080p','QHD 1440p','4K UHD','Ultra-Wide'] },
    { key: 'RefreshRate', label: '⚡ Честота',         values: ['60 Hz','144 Hz','165 Hz','240 Hz+','360 Hz'] },
    { key: 'Panel',       label: '🖥 Тип панел',       values: ['IPS','VA','OLED','Mini-LED'] },
    { key: 'Connection',  label: '🔗 Връзка',          values: ['USB','Bluetooth','Безжична','2.4GHz'] },
  ],
  network: [
    { key: 'WiFi',   label: '📡 WiFi стандарт',        values: ['WiFi 5','WiFi 6','WiFi 6E','WiFi 7'] },
    { key: 'Ports',  label: '🔌 Портове',              values: ['4 порта','8 порта','16+ порта','PoE'] },
    { key: 'Type',   label: '📦 Тип',                  values: ['Рутер','Суич','Access Point','Mesh нод'] },
  ],
  storage: [
    { key: 'Type',      label: '💾 Тип',               values: ['NAS','Сървър','Портативен SSD','Портативен HDD','USB Flash','SD карта'] },
    { key: 'Capacity',  label: '📦 Капацитет',         values: ['256 GB','512 GB','1 TB','2 TB','4 TB','8 TB+'] },
    { key: 'Interface', label: '🔌 Интерфейс',         values: ['USB-C','USB-A','Thunderbolt','Ethernet'] },
  ],
  accessories: [
    { key: 'Type',   label: '📦 Тип аксесоар',         values: ['Чанта','Кабел','Зарядно','Хъб','Докинг','Смарт часовник','Смартфон','Таблет','Тонколона','Телевизор'] },
    { key: 'Connection', label: '🔗 Връзка',           values: ['USB-A','USB-C','Bluetooth','WiFi','HDMI'] },
  ],
};

// Subcat-specific spec filters (shown when a subcat pill is active)
const SUBCAT_SPEC_FILTERS = {
  cpu: [
    { key: 'Серия',    label: '📋 Серия',                values: ['Ryzen 9','Ryzen 7','Ryzen 5','Ryzen 3','Core i9','Core i7','Core i5','Core i3','Core Ultra'] },
    { key: 'Сокет',   label: '🔩 Сокет',                values: ['LGA1851','LGA1700','LGA1200','AM5','AM4'] },
    { key: 'Ядра',    label: '🧮 Брой ядра',            values: ['4 ядра','6 ядра','8 ядра','10 ядра','12 ядра','16 ядра','20 ядра','24 ядра'] },
    { key: 'TDP',     label: '🌡 TDP',                  values: ['35 W','45 W','65 W','95 W','105 W','125 W','170 W'] },
    { key: 'iGPU',    label: '🖥 Интегрирана графика',  values: ['С iGPU','Без iGPU'] },
    { key: 'Опаковка',label: '📦 Опаковка',             values: ['BOX','TRAY','MPK'] },
  ],
  gpu: [
    { key: 'Памет', label: '💾 Видео памет',  values: ['4 GB','6 GB','8 GB','10 GB','12 GB','16 GB','24 GB'] },
    { key: 'Слот',  label: '🔌 Интерфейс',   values: ['PCI-E 5.0','PCI-E 4.0','PCI-E 3.0'] },
  ],
  motherboard: [
    { key: 'Сокет',       label: '🔩 Сокет',       values: ['AM5','AM4','LGA1851','LGA1700','LGA1200'] },
    { key: 'Форм фактор', label: '📐 Форм фактор', values: ['ATX','Micro-ATX','Mini-ITX'] },
    { key: 'Памет',       label: '🧠 Вид RAM',      values: ['DDR5','DDR4'] },
    { key: 'WiFi',        label: '📡 WiFi',         values: ['WiFi 7','WiFi 6E','WiFi 6'] },
  ],
};

function renderSubcatBar(cat) {
  const bar = document.getElementById('subcatBar');
  if (!bar) return;
  const subs = SUBCATS[cat];
  if (!subs || !subs.length) {
    bar.classList.remove('visible');
    bar.innerHTML = '';
    currentSubcat = 'all';
    return;
  }
  bar.classList.add('visible');
  bar.innerHTML =
    `<button type="button" class="subcat-pill active" onclick="applySubcat('all', this)">Всички</button>` +
    subs.map(s =>
      `<button type="button" class="subcat-pill" onclick="applySubcat('${s.id}', this)">${s.label}</button>`
    ).join('');
  currentSubcat = 'all';
}

function applySubcat(id, btn) {
  currentSubcat = id;
  document.querySelectorAll('.subcat-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (typeof renderCatSpecFilters === 'function' && currentFilter && currentFilter !== 'all')
    renderCatSpecFilters(currentFilter, id);
  renderTopGrid();
}

function renderCatSpecFilters(cat, subcat) {
  const block = document.getElementById('catSpecFilterBlock');
  const inner = document.getElementById('catSpecFiltersInner');
  const title = document.getElementById('catSpecTitle');
  if (!block || !inner) return;

  catSpecActiveFilters = {};
  const specs = (subcat && subcat !== 'all' && SUBCAT_SPEC_FILTERS[subcat])
    ? SUBCAT_SPEC_FILTERS[subcat]
    : CAT_SPEC_FILTERS[cat];
  if (!specs || !specs.length) {
    block.style.display = 'none';
    return;
  }

  const subcatLabels = { cpu:'Процесори', gpu:'Видео карти', motherboard:'Дънни платки', ram:'RAM памет', ssd:'SSD / NVMe', hdd:'HDD дискове' };
  const titleText = (subcat && subcat !== 'all' && subcatLabels[subcat])
    ? `⚙ ${subcatLabels[subcat]} — филтри`
    : `⚙ ${CAT_LABELS[cat] || cat} — филтри`;
  if (title) title.textContent = titleText;

  inner.innerHTML = specs.map(spec => `
    <div class="csf-block">
      <div class="csf-title">${spec.label}</div>
      <div class="csf-options">
        ${spec.values.map(val => `
          <label class="csf-opt">
            <input type="checkbox" onchange="toggleCatSpecFilter('${spec.key}', '${val}', this.checked)">
            <span>${val}</span>
          </label>`).join('')}
      </div>
    </div>`).join('');

  block.style.display = '';
}

function toggleCatSpecFilter(key, val, checked) {
  if (!catSpecActiveFilters[key]) catSpecActiveFilters[key] = new Set();
  if (checked) catSpecActiveFilters[key].add(val);
  else {
    catSpecActiveFilters[key].delete(val);
    if (!catSpecActiveFilters[key].size) delete catSpecActiveFilters[key];
  }
  renderTopGrid();
}

function hideCatSpecFilters() {
  const block = document.getElementById('catSpecFilterBlock');
  if (block) block.style.display = 'none';
  catSpecActiveFilters = {};
}

// Subcat filtering logic — maps subcat ID to product spec matching
function matchesSubcat(p, subcat) {
  if (subcat === 'all') return true;
  if (p.subcat === subcat) return true;
  const name  = (p.name  || '').toLowerCase();
  const desc  = (p.desc  || '').toLowerCase();
  const brand = (p.brand || '').toLowerCase();
  const specsStr = Object.values(p.specs || {}).join(' ').toLowerCase();
  const all = name + ' ' + desc + ' ' + specsStr;

  const rules = {
    // Phones
    smartphone:      () => all.includes('iphone') || all.includes('galaxy s') || all.includes('pixel') || all.includes('xiaomi') || all.includes('смартфон') || (p.emoji === '📱'),
    tablet:          () => all.includes('ipad') || all.includes('galaxy tab') || all.includes('таблет') || all.includes('tablet') || (p.emoji === '📟'),
    smartwatch:      () => all.includes('watch') || all.includes('часов') || all.includes('band') || (p.emoji === '⌚'),
    // Laptops
    work:          () => all.includes('business') || all.includes('thinkpad') || all.includes('latitude') || all.includes('elitebook') || all.includes('бизнес') || all.includes('xps'),
    gaming_l:      () => all.includes('gaming') || all.includes('rog') || all.includes('rtx') || all.includes('геймърски') || all.includes('republic of gamers'),
    ultrabook:     () => all.includes('ultra') || all.includes('air') || all.includes('slim') || p.price < 3000,
    budget:        () => (p.price / (typeof EUR_RATE!=='undefined'&&EUR_RATE?EUR_RATE:1.95583)) < 500,
    convertible:   () => all.includes('2-in-1') || all.includes('2 в 1') || all.includes('convertible') || all.includes('flip') || all.includes('surface pro') || all.includes('yoga'),
    for_students:  () => (p.price / (typeof EUR_RATE!=='undefined'&&EUR_RATE?EUR_RATE:1.95583)) < 700 || all.includes('student') || all.includes('студент') || all.includes('chromebook'),
    for_devs:      () => all.includes('thinkpad') || all.includes('xps') || all.includes('macbook pro') || all.includes('linux') || all.includes('програмист'),
    for_design:    () => all.includes('macbook') || all.includes('design') || all.includes('creator') || all.includes('дизайн') || all.includes('retina') || all.includes('4k display'),
    for_gaming:    () => all.includes('gaming') || all.includes('rtx') || all.includes('rog') || all.includes('rx 6') || all.includes('rx 7'),
    // Desktops
    office_pc:     () => all.includes('office') || all.includes('офис') || all.includes('business') || (p.price/(typeof EUR_RATE!=='undefined'&&EUR_RATE?EUR_RATE:1.95583) < 800 && !all.includes('gaming')),
    workstation:   () => all.includes('workstation') || all.includes('xeon') || all.includes('quadro') || p.price > 4000,
    aio:           () => all.includes('all-in-one') || all.includes('aio') || all.includes('imac') || all.includes('моноблок'),
    mac_desktop:   () => brand === 'apple' || all.includes('mac mini') || all.includes('imac') || all.includes('mac studio') || all.includes('mac pro'),
    // Gaming
    gaming_laptop_s: () => all.includes('laptop') || all.includes('лаптоп') || all.includes('notebook') || (p.emoji === '💻'),
    gaming_pc_s:     () => all.includes('desktop') || all.includes('настолен') || all.includes('tower') || all.includes('gaming desktop') || (p.emoji === '🖥' && !all.includes('monitor')),
    gaming_mouse:    () => all.includes('mouse') || all.includes('мишк') || (p.emoji === '🖱'),
    gaming_kb:       () => all.includes('keyboard') || all.includes('клавиатур') || (p.emoji === '⌨'),
    gaming_headset:  () => all.includes('headset') || all.includes('headphone') || all.includes('слушалк') || (p.emoji === '🎧'),
    // Monitors
    gaming_mon:   () => all.includes('hz') && (parseInt(all.match(/(\d+)hz/)?.[1]||0) >= 144 || all.includes('144') || all.includes('165') || all.includes('240') || all.includes('360')),
    mon_4k:       () => all.includes('4k') || all.includes('uhd') || all.includes('3840') || all.includes('4к'),
    ultrawide:    () => all.includes('ultrawide') || all.includes('ultra-wide') || all.includes('34"') || all.includes('49"') || all.includes('21:9') || all.includes('32:9'),
    oled_mon:     () => all.includes('oled'),
    office_mon:   () => !all.includes('gaming') && !all.includes('oled') && (p.price / (typeof EUR_RATE!=='undefined'&&EUR_RATE?EUR_RATE:1.95583)) < 600,
    // Components
    cpu:           () => all.includes('процесор') || all.includes('processor') || all.includes('cpu') || all.includes('ryzen') || all.includes('core i') || all.includes('core ultra'),
    gpu:           () => all.includes('видеокарт') || all.includes('gpu') || all.includes('geforce') || all.includes('radeon') || all.includes('rtx') || all.includes('rx 6') || all.includes('rx 7') || all.includes('arc'),
    ram:           () => all.includes(' ram') || all.includes('памет') || all.includes('ddr4') || all.includes('ddr5') || all.includes('dimm') || all.includes('sodimm'),
    ssd_hdd:       () => all.includes('ssd') || all.includes('hdd') || all.includes('nvme') || all.includes('диск') || all.includes('m.2'),
    ssd:           () => all.includes('ssd') || all.includes('nvme') || all.includes('m.2') || all.includes('solid state'),
    hdd:           () => (all.includes('hdd') || all.includes('hard drive') || all.includes('твърд диск') || all.includes(' hd ')) && !all.includes('ssd') && !all.includes('nvme'),
    motherboard:   () => all.includes('дънна') || all.includes('motherboard') || all.includes('mainboard') || all.includes('платка'),
    psu:           () => all.includes('захранван') || all.includes('psu') || all.includes('power supply') || all.includes(' w ') || (all.includes('watt') && !all.includes('battery')),
    case_cooling:  () => all.includes('кутия') || all.includes('chassis') || all.includes('case') || all.includes('охлади') || all.includes('cooler') || all.includes('cooling'),
    case:          () => all.includes('кутия') || all.includes('chassis') || (all.includes('case') && !all.includes('cooler') && !all.includes('cooling')),
    cooling:       () => all.includes('охлади') || all.includes('cooler') || all.includes('cooling') || all.includes('fan') || all.includes('вентилатор') || all.includes('water cool') || all.includes('aio cooler'),
    // Peripherals
    monitor:       () => (normalizeCat(p.cat) === 'peripherals') && (all.includes('монитор') || all.includes('monitor') || (all.includes('hz') && (all.includes('ips') || all.includes('oled') || all.includes('va') || all.includes('qhd') || all.includes('4k') || all.includes('1440')))),
    keyboard:      () => all.includes('клавиатур') || all.includes('keyboard'),
    mouse:         () => all.includes('мишк') || all.includes('mouse') || all.includes('trackpad'),
    headphones:    () => all.includes('слушалк') || all.includes('headphone') || all.includes('headset') || all.includes('earphone') || all.includes('earbud'),
    webcam:        () => all.includes('webcam') || all.includes('уеб камер') || all.includes('web camera'),
    printer:       () => all.includes('принтер') || all.includes('printer') || all.includes('лазер') || all.includes('laser') || all.includes('mfp'),
    // Network
    router:        () => all.includes('router') || all.includes('рутер') || all.includes('ax') || all.includes('wi-fi'),
    switch:        () => all.includes('switch') || all.includes('суич'),
    ap:            () => all.includes('access point') || all.includes('ap ') || all.includes('точка за достъп'),
    mesh:          () => all.includes('mesh') || all.includes('deco') || all.includes('orbi'),
    // Storage
    nas:           () => all.includes('nas') || all.includes('network attached') || all.includes('qnap') || all.includes('synology'),
    server:        () => all.includes('сървър') || all.includes('server') || all.includes('rack'),
    ext_drive:     () => all.includes('portable') || all.includes('портативен') || all.includes('external') || all.includes('външен'),
    flash:         () => all.includes('usb flash') || all.includes('флаш') || all.includes('sd card') || all.includes('microsd') || all.includes('sd карт'),
    // Accessories
    bag:           () => all.includes('чант') || all.includes('bag') || all.includes('backpack') || all.includes('case') || all.includes('sleeve'),
    cable:         () => all.includes('кабел') || all.includes('cable') || all.includes('cord') || all.includes('зарядн') || all.includes('charger'),
    hub:           () => all.includes('hub') || all.includes('хъб') || all.includes('dock') || all.includes('adapter') || all.includes('адаптер'),
    smart_dev:     () => all.includes('watch') || all.includes('часов') || all.includes('band') || all.includes('smart home') || all.includes('умен') || all.includes('hue') || all.includes('смарт'),
    mobile_acc:    () => (p.name||'').toLowerCase().includes('phone') || all.includes('iphone') || all.includes('samsung galaxy') || all.includes('xiaomi') || all.includes('ipad') || all.includes('tablet'),
    av:            () => all.includes('тонколон') || all.includes('speaker') || all.includes('телевизор') || all.includes('tv') || all.includes('camera') || all.includes('фото') || all.includes('gopro'),
  };

  const fn = rules[subcat];
  return fn ? fn() : true;
}

// Cat-spec filter matching
function matchesCatSpec(p) {
  const keys = Object.keys(catSpecActiveFilters);
  if (!keys.length) return true;
  const specsStr = Object.values(p.specs || {}).join(' ');
  const all = (p.name + ' ' + p.desc + ' ' + specsStr).toLowerCase().replace(/\s+/g, ' ');
  const allNorm = all.replace(/\s/g, '');
  return keys.every(key => {
    const vals = catSpecActiveFilters[key];
    if (key === 'Тип') {
      const typeMap = {
        'процесор':'cpu','видеокарта':'gpu','дънна платка':'motherboard',
        'ram':'ram','ssd nvme':'ssd','ssd sata':'ssd','hdd':'hdd',
        'захранване':'psu','кутия':'case','охлаждане':'cooling',
      };
      return [...vals].some(v => {
        const sub = typeMap[v.toLowerCase()];
        return sub ? (p.subcat === sub) : all.includes(v.toLowerCase());
      });
    }
    // CPU Series — extracted from product name
    if (key === 'Серия') {
      const n = (p.name || '').toUpperCase();
      const getSeries = () => {
        if (/CORE ULTRA/i.test(n)) return 'Core Ultra';
        if (/RYZEN\s*9|R9-/i.test(n)) return 'Ryzen 9';
        if (/RYZEN\s*7|R7-/i.test(n)) return 'Ryzen 7';
        if (/RYZEN\s*5|R5-/i.test(n)) return 'Ryzen 5';
        if (/RYZEN\s*3|R3-/i.test(n)) return 'Ryzen 3';
        if (/I9-|CORE I9/i.test(n)) return 'Core i9';
        if (/I7-|CORE I7/i.test(n)) return 'Core i7';
        if (/I5-|CORE I5/i.test(n)) return 'Core i5';
        if (/I3-|CORE I3/i.test(n)) return 'Core i3';
        return '';
      };
      const series = getSeries();
      return [...vals].some(v => v === series);
    }
    // Integrated GPU filter
    if (key === 'iGPU') {
      const hasIgpu = !!((p.specs || {})['Интегрирана графика']);
      return [...vals].some(v => v === 'С iGPU' ? hasIgpu : !hasIgpu);
    }
    // Package type — BOX / TRAY / MPK from product name
    if (key === 'Опаковка') {
      return [...vals].some(v => new RegExp(v, 'i').test(p.name || ''));
    }
    // Cores — "N ядра" filter values matched against numeric spec
    if (key === 'Ядра') {
      const coreNum = ((p.specs || {})['Ядра'] || '').trim();
      return [...vals].some(v => coreNum === (v.match(/^(\d+)/)?.[1] || ''));
    }
    // Form factor — exact match to avoid 'ATX' matching 'Micro-ATX'
    if (key === 'Форм фактор') {
      const ff = ((p.specs || {})['Форм фактор'] || '').toLowerCase();
      return [...vals].some(v => ff === v.toLowerCase());
    }
    // Direct spec lookup with substring (handles FCLGA1700 matching LGA1700)
    const specVal = ((p.specs || {})[key] || '').toLowerCase();
    if (specVal) return [...vals].some(v => specVal.includes(v.toLowerCase()));
    // Fallback: full-text search with whitespace normalization
    return [...vals].some(v => all.includes(v.toLowerCase()) || allNorm.includes(v.toLowerCase().replace(/\s/g, '')));
  });
}


// ===== 1. URL PARAMS FOR FILTERS =====
function updateURL() {
  const params = new URLSearchParams();
  if (currentFilter !== 'all') params.set('cat', currentFilter);
  if (typeof currentSubcat !== 'undefined' && currentSubcat && currentSubcat !== 'all') params.set('sub', currentSubcat);
  if (currentSort !== 'bestseller') params.set('sort', currentSort);
  if (advFilterBrands.size > 0) params.set('brand', [...advFilterBrands].join(','));
  if (advFilterRating > 0) params.set('rating', advFilterRating);
  if (advFilterSaleOnly) params.set('sale', '1');
  if (advFilterNewOnly) params.set('new', '1');
  if (advFilterStockOnly) params.set('stock', '1');
  if (advPriceMin > 0) params.set('priceMin', advPriceMin);
  if (advPriceMax < (_sbPriceAbsMax || 2000)) params.set('priceMax', advPriceMax);
  if (modalProductId) params.set('product', modalProductId);
  const qs = params.toString();
  const newUrl = qs ? `${location.pathname}?${qs}` : location.pathname;
  history.replaceState(null, '', newUrl);
}

function readURLParams() {
  const params = new URLSearchParams(location.search);
  if (params.get('cat') && params.get('cat') !== 'all') {
    currentFilter = params.get('cat');
    // Activate correct pill
    const pill = document.querySelector(`.filter-pill[onclick*="'${currentFilter}'"]`);
    if (pill) { document.querySelectorAll('.filter-pill').forEach(b=>b.classList.remove('active')); pill.classList.add('active'); }
  }
  if (params.get('sort')) { currentSort = params.get('sort'); const sel = document.querySelector('.sort-select'); if(sel) sel.value = currentSort; }
  if (params.get('brand')) { params.get('brand').split(',').forEach(b => { advFilterBrands.add(b); const cb = document.querySelector(`#brandFilterList input[value="${b}"]`); if(cb) cb.checked=true; }); }
  if (params.get('rating')) { advFilterRating = parseFloat(params.get('rating')); const rb = document.querySelector(`input[name="ratingFilter"][value="${advFilterRating}"]`); if(rb) rb.checked=true; }
  if (params.get('sale') === '1') { advFilterSaleOnly=true; const el=document.getElementById('saleOnlyToggle'); if(el) el.checked=true; }
  if (params.get('new') === '1') { advFilterNewOnly=true; const el=document.getElementById('newOnlyToggle'); if(el) el.checked=true; }
  if (params.get('sub')) { currentSubcat = params.get('sub'); }
  if (params.get('stock') === '1') { advFilterStockOnly=true; const el=document.getElementById('stockOnlyToggle'); if(el) el.checked=true; }
  if (params.get('priceMin')) { advPriceMin=parseFloat(params.get('priceMin')); const el=document.getElementById('sbPriceMin'); if(el) el.value=advPriceMin; }
  if (params.get('priceMax')) { advPriceMax=parseFloat(params.get('priceMax')); const el=document.getElementById('sbPriceMax'); if(el) el.value=advPriceMax; }
  // Re-render grid with all restored params
  const needsRender = params.has('cat') || params.has('sort') || params.has('brand') ||
                      params.has('rating') || params.has('sale') || params.has('new') ||
                      params.has('priceMin') || params.has('priceMax');
  if (needsRender) {
    // Show subcat bar and cat-spec filters if a category is active
    if (currentFilter !== 'all') {
      if (typeof renderSubcatBar === 'function') renderSubcatBar(currentFilter);
      // Activate subcat pill if ?sub= param was present
      if (currentSubcat && currentSubcat !== 'all') {
        const subPill = document.querySelector(`.subcat-pill[onclick*="'${currentSubcat}'"]`);
        if (subPill) { document.querySelectorAll('.subcat-pill').forEach(p => p.classList.remove('active')); subPill.classList.add('active'); }
      }
      if (typeof renderCatSpecFilters === 'function') renderCatSpecFilters(currentFilter);
      if (typeof bcOnFilterCat === 'function') bcOnFilterCat(currentFilter);
    }
    renderTopGrid();
    updateActiveFiltersBar();
  }
  if (params.get('product')) { setTimeout(()=>openProductPage(parseInt(params.get('product'))),400); }
}

// URL + skeleton + carousel hooks — using var to avoid redeclaration
var _urlHooked = false;
if (!_urlHooked) {
  _urlHooked = true;

  var _baseApplyFilter = applyFilter;
  applyFilter = function(btn, cat) { _baseApplyFilter(btn, cat); updateURL(); updateActiveFiltersBar(); };

  var _baseApplySort = applySort;
  applySort = function(val) { _baseApplySort(val); updateURL(); };

  var _baseApplyAdvFilters = applyAdvFilters;
  applyAdvFilters = function() { _baseApplyAdvFilters(); updateURL(); };

  var _baseOpenProductModal = openProductModal;
  openProductModal = function(id) {
    _baseOpenProductModal(id);
    renderRelated(id);
    updateURL();
    document.dispatchEvent(new CustomEvent('mc:productopen', {detail: id}));
  };

  var _baseCloseProductModalDirect = closeProductModalDirect;
  closeProductModalDirect = function() {
    _baseCloseProductModalDirect();
    // Keep body locked if cat-page or pdp still open
    if (document.getElementById('catPage')?.classList.contains('open') ||
        document.getElementById('pdpBackdrop')?.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    }
    const params = new URLSearchParams(location.search);
    params.delete('product');
    const qs = params.toString();
    history.replaceState(null, '', qs ? `${location.pathname}?${qs}` : location.pathname);
  };
}


if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getFilteredSorted, normalizeCat, advFilterBrands, renderGrids, syncFiltersToUrl };
}

// ===== MEGA MENU =====
let _megaMenuTimer = null;
let _megaMenuOpen = false;
let _megaMenuScrollHandler = null;
let _megaMenuActiveCat = null;

// On touch devices: first tap opens menu, second tap navigates
function megaMenuTouchHandler(catEl, cat, event) {
  const hasMega = MEGA_MENU[cat] && MEGA_MENU[cat].length;
  if (!hasMega) return; // no mega menu — let click through normally
  if (_megaMenuActiveCat === cat && _megaMenuOpen) return; // second tap — let openCatPage run
  event.preventDefault();
  event.stopPropagation();
  megaMenuOpen(catEl, cat);
}

function megaMenuOpen(catEl, cat) {
  clearTimeout(_megaMenuTimer);
  const data = MEGA_MENU[cat];
  const menu = document.getElementById('megaMenu');
  if (!menu) return;

  if (!data || !data.length) {
    megaMenuClose();
    return;
  }

  // Highlight active cat item
  document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('mega-active'));
  catEl.classList.add('mega-active');
  _megaMenuActiveCat = cat;

  // Position: right of the sidebar, aligned to top of cat item
  function reposition() {
    const rect = catEl.getBoundingClientRect();
    const sidebarRect = catEl.closest('.sidebar-categories').getBoundingClientRect();
    menu.style.top = rect.top + 'px';
    menu.style.left = (sidebarRect.right - 1) + 'px';
  }
  reposition();

  // Close on scroll
  if (_megaMenuScrollHandler) window.removeEventListener('scroll', _megaMenuScrollHandler, true);
  _megaMenuScrollHandler = () => { megaMenuCloseDirect(); };
  window.addEventListener('scroll', _megaMenuScrollHandler, { capture: true, once: true });

  // Header row
  const catLabel = (typeof CAT_META !== 'undefined' && CAT_META[cat]) ? CAT_META[cat].label.toUpperCase() : cat.toUpperCase();
  const header = `<div class="mega-header"><span class="mega-header-all" onclick="openCatPage('${cat}')">ВСИЧКИ ${catLabel} ›</span></div>`;

  // Render columns
  const cols = data.map(col => `
    <div class="mega-col">
      <div class="mega-col-title" onclick="openCatPage('${cat}'); applySubcatById('${col.id}')">${col.title}</div>
      ${col.items.map(item => `<span class="mega-item" onclick="openCatPage('${cat}'); applySubcatById('${col.id}')">${item}</span>`).join('')}
      <span class="mega-item mega-item-all" onclick="openCatPage('${cat}')">Всички</span>
    </div>
  `).join('');

  menu.innerHTML = header + `<div class="mega-cols">${cols}</div>`;

  menu.classList.add('open');
  _megaMenuOpen = true;
}

function megaMenuClose() {
  _megaMenuTimer = setTimeout(() => megaMenuCloseDirect(), 120);
}

function megaMenuCloseDirect() {
  clearTimeout(_megaMenuTimer);
  const menu = document.getElementById('megaMenu');
  if (menu) menu.classList.remove('open');
  document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('mega-active'));
  _megaMenuOpen = false;
  _megaMenuActiveCat = null;
  if (_megaMenuScrollHandler) {
    window.removeEventListener('scroll', _megaMenuScrollHandler, true);
    _megaMenuScrollHandler = null;
  }
}

// Close mega menu on tap outside (touch devices)
document.addEventListener('touchstart', e => {
  if (!_megaMenuOpen) return;
  const menu = document.getElementById('megaMenu');
  if (!menu) return;
  if (!menu.contains(e.target) && !e.target.closest('.cat-item')) {
    megaMenuCloseDirect();
  }
}, { passive: true });

function megaMenuKeepOpen() {
  clearTimeout(_megaMenuTimer);
}

function applySubcatById(id) {
  setTimeout(() => {
    // catPage is open — use cpApplySubcat
    if (document.getElementById('catPage')?.classList.contains('open')) {
      const pill = document.querySelector(`#cpSubcatBar .subcat-pill[onclick*="'${id}'"]`);
      if (pill) { pill.click(); }
      else if (typeof cpApplySubcat === 'function') cpApplySubcat(id, null);
      return;
    }
    // Homepage subcat bar
    const pill = document.querySelector(`#subcatBar .subcat-pill[onclick*="'${id}'"]`);
    if (pill) { pill.click(); }
  }, 150);
}

// ===== ORDER TRACKER =====
const fakeOrders = {
  'MC-TEST01': {
    num: 'MC-TEST01', name: 'Sony WH-1000XM6 Безжични слушалки',
    date: '07.03.2026 14:23', dest: 'София, ул. Витоша 15',
    courier: 'Еконт', courierNum: 'EKT-8821-2026-BG',
    status: 'В доставка',
    steps: [
      { icon:'✓', title:'Поръчката е получена', sub:'Потвърдена и платена успешно', time:'07.03.2026 14:23', state:'done' },
      { icon:'✓', title:'Обработва се', sub:'Продуктите са подготвени за изпращане', time:'07.03.2026 15:45', state:'done' },
      { icon:'✓', title:'Предадена на куриера', sub:'Еконт е получил пратката', time:'08.03.2026 09:12', state:'done' },
      { icon:'🚚', title:'В доставка', sub:'Пратката е на път към вас', time:'09.03.2026 08:30', state:'active' },
      { icon:'🏠', title:'Доставена', sub:'Очаквана дата: 09.03.2026', time:'', state:'' },
    ]
  },
  'MC-TEST02': {
    num: 'MC-TEST02', name: 'MacBook Pro 16" M4 Pro + Apple Watch Ultra 2',
    date: '05.03.2026 11:05', dest: 'Пловдив, бул. България 88',
    courier: 'Еконт', courierNum: 'ECO-5523781-BG',
    status: '✓ Доставена',
    steps: [
      { icon:'✓', title:'Поръчката е получена', sub:'Потвърдена и платена успешно', time:'05.03.2026 11:05', state:'done' },
      { icon:'✓', title:'Обработва се', sub:'Продуктите са подготвени', time:'05.03.2026 13:22', state:'done' },
      { icon:'✓', title:'Предадена на куриера', sub:'Еконт е получил пратката', time:'06.03.2026 10:00', state:'done' },
      { icon:'✓', title:'В доставка', sub:'Пратката е пристигнала в Пловдив', time:'07.03.2026 09:15', state:'done' },
      { icon:'✓', title:'Доставена', sub:'Получена от клиента', time:'07.03.2026 14:40', state:'done' },
    ]
  },
};

function openOrderTracker(prefillNum) {
  document.getElementById('orderTrackerPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('otResult').classList.remove('show');
  document.getElementById('otError').classList.remove('show');
  if (prefillNum) {
    document.getElementById('otInput').value = prefillNum;
    setTimeout(trackOrder, 300);
  } else {
    document.getElementById('otInput').value = '';
  }
}

function closeOrderTracker() {
  document.getElementById('orderTrackerPage').classList.remove('open');
  document.body.style.overflow = '';
}

const _otStatusMap   = { pending:1, processing:2, shipped:3, delivered:4, cancelled:1 };
const _otStatusLabel = { pending:'Изчаква потвърждение', processing:'Обработва се', shipped:'В доставка', delivered:'Доставена', cancelled:'Отказана' };
const _otStepTitles  = [
  { title:'Поръчката е получена', sub:'Потвърдена успешно' },
  { title:'Обработва се',         sub:'Очаквано завършване: до 2 часа' },
  { title:'Предадена на куриера', sub:'Ще получиш известие' },
  { title:'В доставка',           sub:'' },
  { title:'Доставена',            sub:'' },
];
function _otBuildSteps(activeStep, firstTime) {
  return _otStepTitles.map((s, i) => ({
    ...s,
    time:  i === 0 ? firstTime : '',
    icon:  i < activeStep ? '✓' : '○',
    state: i < activeStep ? 'done' : i === activeStep ? 'active' : ''
  }));
}

function trackOrder() {
  const num = document.getElementById('otInput').value.trim().toUpperCase();
  const result = document.getElementById('otResult');
  const error = document.getElementById('otError');
  result.classList.remove('show');
  error.classList.remove('show');

  // 1. Check demo/fake orders
  let order = fakeOrders[num];

  // 2. Check real saved orders from localStorage
  if (!order) {
    try {
      const saved = JSON.parse(localStorage.getItem('mc_orders') || '[]');
      const real = saved.find(o => o.num === num);
      if (real) {
        const activeStep = _otStatusMap[real.status] ?? 1;
        order = {
          num: real.num,
          name: real.items || real.customer,
          date: real.date,
          dest: (real.city ? real.city + ', ' : '') + (real.addr || ''),
          courier: 'Еконт',
          courierNum: 'EKT-' + real.num.replace('MC-','').slice(0,6) + '-BG',
          status: _otStatusLabel[real.status] || real.status,
          steps: _otBuildSteps(activeStep, real.date)
        };
      }
    } catch(e) {}
  }

  // 3. Generic fallback for unrecognised MC- numbers
  if (!order && num.startsWith('MC-') && num.length >= 8) {
    const now = new Date().toLocaleString('bg-BG');
    order = {
      num, name: 'Most Computers поръчка',
      date: now, dest: 'Адрес на доставка',
      courier: 'Еконт', courierNum: 'EKT-' + Math.random().toString().slice(2,8) + '-BG',
      status: 'Обработва се',
      steps: _otBuildSteps(1, now)
    };
  }

  if (!order) { error.classList.add('show'); return; }

  document.getElementById('otOrderNum').textContent = 'Поръчка № ' + order.num;
  document.getElementById('otOrderName').textContent = order.name;
  document.getElementById('otOrderDate').textContent = 'Поръчана на: ' + order.date;
  document.getElementById('otStatusBadge').textContent = order.status;
  document.getElementById('otDestVal').textContent = order.dest;
  document.getElementById('otCourierName').textContent = order.courier;
  document.getElementById('otCourierNum').textContent = 'Товарителница: ' + order.courierNum;
  document.getElementById('otCourierIcon').textContent = order.courier === 'Еконт' ? 'EKT' : 'SPD';

  var _el_otTimeline=document.getElementById('otTimeline'); if(_el_otTimeline) _el_otTimeline.innerHTML = order.steps.map(s => `
    <div class="ot-step ${s.state}">
      <div class="ot-dot">${s.state==='done'?'✓':s.state==='active'?s.icon:s.icon}</div>
      <div class="ot-step-content">
        <div class="ot-step-title">${s.title}</div>
        <div class="ot-step-sub">${s.sub}</div>
        ${s.time ? `<div class="ot-step-time">${s.time}</div>` : ''}
      </div>
    </div>`).join('');

  result.classList.add('show');
}

function closeCheckoutPageAndTrack() {
  const orderNum = document.getElementById('tyOrderNum')?.textContent;
  closeThankyouPage();
  if (!orderNum || orderNum.trim() === 'MC-') { setTimeout(() => openOrderTracker(''), 300); return; }
  setTimeout(() => openOrderTracker('MC-' + orderNum.replace('MC-','').trim()), 300);
}



// ===== PWA =====
(function() {
  // 1. Generate SVG icon as data URL
  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="115" fill="#bd1105"/>
    <text x="256" y="340" font-size="280" text-anchor="middle" fill="white">🛒</text>
    <text x="256" y="430" font-size="72" font-family="Arial" font-weight="900" text-anchor="middle" fill="white">MC</text>
  </svg>`;
  const iconUrl = 'data:image/svg+xml,' + encodeURIComponent(iconSvg);

  // Apply apple-touch-icon
  const appleIcon = document.getElementById('pwaAppleIcon');
  if (appleIcon) { appleIcon.rel='apple-touch-icon'; appleIcon.href=iconUrl; }

  // 2. Generate and inject manifest via Blob URL
  const manifest = {
    name: 'Most Computers',
    short_name: 'Most Computers',
    description: 'Онлайн магазин за електроника',
    start_url: './',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#bd1105',
    lang: 'bg',
    icons: [
      { src: iconUrl, sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
      { src: iconUrl, sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
    ],
    screenshots: [],
    categories: ['shopping', 'electronics'],
  };
  try {
    const blob = new Blob([JSON.stringify(manifest)], {type:'application/json'});
    const manifestUrl = URL.createObjectURL(blob);
    const manifestLink = document.getElementById('pwaManifest');
    if (manifestLink) manifestLink.href = manifestUrl;
  } catch(e) {}

  // 3. Service Worker — registers when hosted on HTTPS
  // (Blob URLs not supported for SW — browser security restriction)
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => { console.log('MC SW ✓', reg.scope); window._mcSwReg = reg; })
      .catch(err => console.warn('MC SW:', err.message));
  }

  // 4. Install prompt logic
  let deferredPrompt = null;
  const banner = document.getElementById('pwaBanner');
  const dismissed = localStorage.getItem('mc_pwa_dismissed');
  const installed = localStorage.getItem('mc_pwa_installed');

  if (installed || dismissed) return; // already handled

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  // avoid errors during testing where matchMedia may be undefined
  const isInStandalone = window.navigator.standalone === true
    || (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches);

  if (isInStandalone) return; // already installed

  if (isIos) {
    // Show iOS instructions after 4s
    setTimeout(() => { if (banner) banner.classList.add('show'); }, 4000);
    window.__pwaIsIos = true;
  } else {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e;
      setTimeout(() => { if (banner) banner.classList.add('show'); }, 3000);
    });
    window.__pwaPrompt = () => deferredPrompt;
  }
})();

function pwaInstall() {
  if (window.__pwaIsIos) {
    document.getElementById('pwaBanner').classList.remove('show');
    document.getElementById('pwaIosModal').classList.add('open');
    return;
  }
  const prompt = window.__pwaPrompt?.();
  if (prompt) {
    prompt.prompt();
    prompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        localStorage.setItem('mc_pwa_installed', '1');
        showToast('✓ Most Computers е инсталиран!');
      }
      document.getElementById('pwaBanner').classList.remove('show');
    });
  } else {
    // Fallback: show iOS style instructions
    document.getElementById('pwaBanner').classList.remove('show');
    document.getElementById('pwaIosModal').classList.add('open');
  }
}

function pwaDismiss() {
  document.getElementById('pwaBanner').classList.remove('show');
  localStorage.setItem('mc_pwa_dismissed', '1');
}

// helper called from data-action to scroll modal to top
function scrollProductModalTop() {
  const modal = document.getElementById('productModal');
  if (modal) modal.scrollTo({top:0,behavior:'smooth'});
}

function closePwaIos() {
  document.getElementById('pwaIosModal').classList.remove('open');
}



// ===== PUSH NOTIFICATIONS =====
async function requestPushPermission() {
  if (!('Notification' in window)) {
    showToast('⚠️ Браузърът ти не поддържа известия');
    return;
  }
  if (Notification.permission === 'granted') {
    showToast('✓ Известията вече са активирани!');
    return;
  }
  if (Notification.permission === 'denied') {
    showToast('⚠️ Известията са блокирани в браузъра');
    return;
  }
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    showToast('🔔 Ще получаваш известия за горещи оферти!');
    localStorage.setItem('mc_push_granted', '1');
    // Demo: send a test notification after 3s
    setTimeout(() => {
      new Notification('Most Computers 🔥', {
        body: 'Добре дошъл! Следи за ексклузивни оферти.',
        icon: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="115" fill="#bd1105"/><text x="256" y="340" font-size="280" text-anchor="middle" fill="white">🛒</text></svg>'),
        tag: 'mc-welcome'
      });
    }, 3000);
  } else {
    showToast('Известията не са активирани');
  }
}

function sendPromoNotification(title, body, url) {
  if (Notification.permission !== 'granted') return;
  const n = new Notification(title || 'Most Computers 🔥', {
    body: body || 'Нова оферта те очаква!',
    icon: 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="115" fill="#bd1105"/><text x="256" y="340" font-size="280" text-anchor="middle" fill="white">🛒</text></svg>'),
    tag: 'mc-promo',
    renotify: true
  });
  if (url) n.addEventListener('click', () => window.focus());
}

// Auto-show push opt-in after 30s (only once)
setTimeout(() => {
  if (localStorage.getItem('mc_push_granted')) return;
  if (localStorage.getItem('mc_push_dismissed')) return;
  if (!('Notification' in window) || Notification.permission !== 'default') return;
  const banner = document.getElementById('pushOptInBanner');
  if (banner) banner.classList.add('show');
}, 30000);

function dismissPushBanner() {
  const banner = document.getElementById('pushOptInBanner');
  if (banner) banner.classList.remove('show');
  localStorage.setItem('mc_push_dismissed', '1');
}



// ── Lazy Admin Loader ────────────────────────────────────────────────────────
// admin.js (144 KB) се зарежда само когато потребителят отвори admin панела.
// Стубовете по-долу се заменят автоматично от реалните функции след зареждане.

let _adminLoaded = false;
let _adminLoading = false;
const _adminQueue = [];

function _loadAdminScript(cb) {
  if (_adminLoaded) { if (cb) cb(); return; }
  if (cb) _adminQueue.push(cb);
  if (_adminLoading) return;
  _adminLoading = true;
  const s = document.createElement('script');
  s.src = 'js/admin.js?v=' + (typeof SW_VERSION !== 'undefined' ? SW_VERSION : Date.now());
  s.onload = () => {
    _adminLoaded = true;
    _adminLoading = false;
    _adminQueue.splice(0).forEach(fn => fn());
  };
  s.onerror = () => {
    _adminLoading = false;
    showToast('⚠️ Грешка при зареждане на Admin панела');
  };
  document.head.appendChild(s);
}

// Stub — заменя се от реалната функция в admin.js след зареждане
function openAdminPage() {
  _loadAdminScript(() => {
    if (typeof openAdminPage === 'function') openAdminPage();
  });
}

// Stub — нужен на ui.js преди admin.js да се зареди
function closeAdminPage() {
  const page = document.getElementById('adminPage');
  if (page) page.style.display = 'none';
  document.body.style.overflow = '';
}

// ===== PRODUCT PAGE =====
let pdpProductId = null;
let pdpQtyVal    = 1;
let pdpGallery   = [];
let pdpGalleryIdx = 0;


let _pdpScrollY = 0;
function openProductPage(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  // Save scroll position only when not inside catPage (catPage has its own scroll)
  if (!document.getElementById('catPage')?.classList.contains('open')) {
    _pdpScrollY = window.scrollY || document.documentElement.scrollTop;
  }
  pdpProductId = id;
  pdpQtyVal = 1;
  addToRecentlyViewed(id);

  // Breadcrumb (inline — no wrapper needed)
  const _bcCatLabel = (typeof CAT_LABELS !== 'undefined' ? CAT_LABELS[p.cat] : null) || p.cat;
  if (typeof bcSet === 'function') {
    const _bcCatFn = () => {
      closeProductPage();
      filterCat(p.cat);
      bcSet([{ label: _bcCatLabel, fn: _bcCatFn }]);
    };
    bcSet([
      { label: _bcCatLabel, url: `https://mostcomputers.bg/?cat=${p.cat}`, fn: _bcCatFn },
      { label: p.name, url: `https://mostcomputers.bg/?product=${p.id}`, fn: null }
    ]);
  }
  document.title = p.name + ' | Most Computers';

  // SEO — Dynamic meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const descText = p.desc
      ? p.desc.substring(0, 155) + (p.desc.length > 155 ? '…' : '')
      : `${p.name} — ${p.brand} | Цена: ${(p.price/EUR_RATE).toFixed(2)} € / ${p.price} лв. Купи онлайн от Most Computers.`;
    metaDesc.setAttribute('content', descText);
  }

  // Open Graph tags
  function setOG(prop, val) {
    let tag = document.querySelector(`meta[property="${prop}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', prop); document.head.appendChild(tag); }
    tag.setAttribute('content', val);
  }
  function setOGName(name, val) {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute('name', name); document.head.appendChild(tag); }
    tag.setAttribute('content', val);
  }
  setOG('og:title',       p.name + ' | Most Computers');
  setOG('og:description', p.desc ? p.desc.substring(0,200) : `${p.name} от ${p.brand}. Цена: ${(p.price/EUR_RATE).toFixed(2)} €`);
  setOG('og:image',       p.img || 'https://mostcomputers.bg/og-default.jpg');
  setOG('og:url',         window.location.href);
  setOG('og:type',        'product');
  setOG('og:site_name',   'Most Computers');
  setOG('product:price:amount',   (p.price/EUR_RATE).toFixed(2));
  setOG('product:price:currency', 'EUR');
  setOGName('twitter:card',        'summary_large_image');
  setOGName('twitter:title',       p.name + ' | Most Computers');
  setOGName('twitter:description', p.desc ? p.desc.substring(0,200) : `${p.brand} — ${p.name}`);
  setOGName('twitter:image',       p.img || '');
  const _canonical = document.querySelector('link[rel="canonical"]');
  if (_canonical) _canonical.setAttribute('href', `https://mostcomputers.bg/?product=${p.id}`);

  // Badges
  let b = '';
  if (p.badge==='sale') b += '<span class="badge badge-sale">Промо</span>';
  if (p.badge==='new')  b += '<span class="badge badge-new">Ново</span>';
  if (p.badge==='hot')  b += '<span class="badge badge-hot">Горещо</span>';
  var _el_pdpBadges=document.getElementById('pdpBadges'); if(_el_pdpBadges) _el_pdpBadges.innerHTML = b;

  // Brand / Name / Rating
  document.getElementById('pdpBrand').textContent = p.brand || '';
  document.getElementById('pdpName').textContent  = p.name;
  document.getElementById('pdpStars').innerHTML   = starsHTML(p.rating);
  document.getElementById('pdpRv').textContent    = `${p.rating} (${p.rv} ревюта)`;

  // Price
  const priceBgn = p.price;
  const prEl = document.getElementById('pdpPrice');
  prEl.textContent = fmtEur(priceBgn);
  prEl.className   = 'pdp-price-main' + (p.badge==='sale' ? ' sale' : '');
  document.getElementById('pdpPriceEur').textContent = `${fmtBgn(priceBgn)}`;

  const oldRow = document.getElementById('pdpOldRow');
  if (p.old) {
    document.getElementById('pdpOld').textContent = fmtEur(p.old) + ' / ' + fmtBgn(p.old);
    document.getElementById('pdpSave').textContent = '-' + Math.round((p.old-p.price)/p.old*100) + '%';
    oldRow.style.display = 'flex';
  } else {
    oldRow.style.display = 'none';
  }
  var _el_pdpMonthly=document.getElementById('pdpMonthly');
  if(_el_pdpMonthly){
    if(p.price>=999){
      const mo=Math.ceil(p.price/12);
      _el_pdpMonthly.innerHTML=`<span>или от <strong>${mo.toFixed(2)} лв./мес.</strong> на 12 вноски</span>`;
      _el_pdpMonthly.style.display='';
    } else {
      _el_pdpMonthly.innerHTML='';
      _el_pdpMonthly.style.display='none';
    }
  }

  // Stock
  const inStock = p.stock !== false;
  const stockEl = document.getElementById('pdpStock');
  stockEl.className = 'pdp-stock ' + (inStock ? 'in' : 'out');
  const stockNum = typeof p.stock === 'number' && p.stock > 0 ? p.stock : null;
  let stockTxt = 'Изчерпан';
  if (inStock) {
    if (stockNum !== null && stockNum <= 5) stockTxt = `🔥 Само ${stockNum} бр. в наличност!`;
    else if (stockNum !== null && stockNum <= 10) stockTxt = `⚡ Последни ${stockNum} бр.`;
    else stockTxt = '✓ В наличност';
  }
  document.getElementById('pdpStockTxt').textContent = stockTxt;
  // Show/hide back-in-stock notify button
  const bisBtn = document.getElementById('pdpNotifyStock');
  if (bisBtn) bisBtn.style.display = inStock ? 'none' : 'flex';
  const pdpAddBtn = document.getElementById('pdpAddBtn');
  if (pdpAddBtn) { pdpAddBtn.disabled = !inStock; pdpAddBtn.style.opacity = inStock ? '' : '0.4'; }
  // Restore BIS subscription state
  if (!inStock) {
    const savedBisEmail = localStorage.getItem('mc_bis_' + id);
    const notifyForm = document.getElementById('pdpNotifyForm');
    const notifySuccess = document.getElementById('pdpNotifySuccess');
    const notifyEmail = document.getElementById('pdpNotifyEmail');
    if (savedBisEmail && notifyForm && notifySuccess) {
      notifyForm.style.display = 'none';
      notifySuccess.style.display = 'block';
      notifySuccess.textContent = `✓ Ще те уведомим на ${savedBisEmail} веднага щом продуктът е наличен!`;
    } else if (notifyForm && notifySuccess) {
      notifyForm.style.display = '';
      notifySuccess.style.display = 'none';
      if (notifyEmail) notifyEmail.value = '';
    }
  }

  // Quick specs hidden
  const specs = p.specs || {};
  var _el_pdpQuickSpecs=document.getElementById('pdpQuickSpecs'); if(_el_pdpQuickSpecs) _el_pdpQuickSpecs.innerHTML = '';

  // Qty
  document.getElementById('pdpQty').textContent = '1';

  // Wishlist btn
  const wishBtn = document.getElementById('pdpWishBtn');
  if (wishBtn) wishBtn.innerHTML = wishlist.includes(id) ? '❤ В любими' : '♡ Добави в желания';

  // Meta
  document.getElementById('pdpSku').textContent     = p.sku  || '—';
  document.getElementById('pdpEan').textContent     = p.ean  || p.sku || '—';
  document.getElementById('pdpWarranty').textContent = specs['Warranty'] || specs['Гаранция'] || specs['warrantyInMonths'] || '24 месеца';

  // ── Gallery ──
  pdpGallery = [];
  if (p.gallery && p.gallery.length) {
    pdpGallery = p.gallery;
  } else if (p.img) {
    pdpGallery = [p.img];
  }
  pdpGalleryIdx = 0;
  // Show skeleton while image loads
  const _imgWrap = document.querySelector('.pdp-main-img-wrap');
  if (_imgWrap) _imgWrap.classList.add('img-loading');
  pdpRenderGallery();
  const _mainImg = document.getElementById('pdpMainImg');
  if (_mainImg) {
    const _removeLoading = function(){ if(_imgWrap) _imgWrap.classList.remove('img-loading'); };
    _mainImg.addEventListener('load', _removeLoading, { once: true });
    _mainImg.addEventListener('error', _removeLoading, { once: true });
    if (_mainImg.complete) _removeLoading();
  }

  // ── Full specs table ──
  const tbody = document.getElementById('pdpSpecsTbody');
  if (tbody) {
    let specRows = `<tr><td>SKU / Part Number</td><td style="font-family:'JetBrains Mono',monospace;font-size:12px;">${p.sku||'—'}</td></tr>`;
    if (p.ean) specRows += `<tr><td>EAN / Баркод</td><td style="font-family:'JetBrains Mono',monospace;font-size:12px;">${p.ean}</td></tr>`;
    const _se = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    specRows += Object.entries(specs).map(([k,v]) => `<tr><td>${_se(k)}</td><td>${_se(v)}</td></tr>`).join('');
    tbody.innerHTML = specRows || '<tr><td colspan="2" style="color:var(--muted);text-align:center;padding:24px;">Няма данни за спецификации.</td></tr>';
  }

  // ── Description (HTML) ──
  const htmlContent = document.getElementById('pdpHtmlContent');
  if (htmlContent) {
    if (p.htmlDesc) {
      // htmlDesc is admin-authored HTML — kept as-is (trusted source)
      htmlContent.innerHTML = p.htmlDesc;
    } else if (p.desc) {
      // p.desc may come from XML — render as plain text to prevent XSS
      htmlContent.innerHTML = '';
      const para = document.createElement('p');
      para.style.cssText = 'font-size:14px;line-height:1.8;color:var(--text2);';
      para.textContent = p.desc;
      htmlContent.appendChild(para);
    } else {
      htmlContent.innerHTML = '<p style="color:var(--muted);font-size:13px;">Няма добавено описание за този продукт.</p>';
    }
  }

  // ── Video ──
  const videoWrap = document.getElementById('pdpVideoWrap');
  if (p.videoUrl) {
    pdpRenderVideo(p.videoUrl, videoWrap);
  } else {
    videoWrap.innerHTML = `<div class="pdp-video-placeholder"><span>▶</span><div style="font-size:13px;color:var(--muted);">Няма добавено видео за този продукт.</div></div>`;
  }

  // ── Reviews ──
  const revEl = document.getElementById('pdpReviews');
  // Build merged review list without mutating the shared product object
  let displayRevs = p.reviews ? [...p.reviews] : [];
  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    const userRevs = saved[id] || [];
    if (userRevs.length) {
      const existingKeys = new Set(displayRevs.map(r => r.name + '|' + r.date));
      userRevs.forEach(r => {
        if (!existingKeys.has(r.name + '|' + r.date)) displayRevs.unshift(r);
      });
    }
  } catch(e) {}
  // Show only approved reviews publicly; pending ones need admin approval
  const publicRevs = displayRevs.filter(r => !r.pending);
  if (typeof pdpRenderRatingBreakdown === 'function') pdpRenderRatingBreakdown(publicRevs);
  if (publicRevs.length) {
    const _esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    revEl.innerHTML = publicRevs.map(r =>
      `<div class="review-item"><div class="review-header"><span class="review-name">${_esc(r.name)}</span><span class="review-stars">${starsHTML(r.stars)}</span><span class="review-date">${_esc(r.date)}</span></div><div class="review-text">${_esc(r.text)}</div></div>`
    ).join('');
  } else {
    revEl.innerHTML = '<p style="color:var(--muted);font-size:13px;">Все още няма ревюта за този продукт.</p>';
  }

  // ── Vendor ──
  const vendorDiv = document.getElementById('pdpVendorContent');
  if (vendorDiv) {
    if (p.vendorUrl) {
      vendorDiv.innerHTML = `
        <p style="font-size:13px;color:var(--text2);margin-bottom:12px;">Посетете официалния сайт на производителя за повече информация.</p>
        <a class="pdp-vendor-link" href="${p.vendorUrl}" target="_blank" rel="noopener">
          🌐 <span>Официален сайт — ${p.brand || 'Производител'}</span>
          <span style="margin-left:auto;font-size:11px;color:var(--muted);">↗</span>
        </a>`;
    } else {
      vendorDiv.innerHTML = '<p style="color:var(--muted);font-size:13px;">Няма добавен линк към производителя.</p>';
    }
  }

  // Show reviews tab by default if product has reviews, otherwise specs
  const _hasPublicRevs = (p.reviews || []).filter(r => !r.pending).length > 0
    || (() => { try { return (JSON.parse(localStorage.getItem('mc_reviews') || '{}')[p.id] || []).length > 0; } catch(e) { return false; } })();
  pdpSwitchTab(_hasPublicRevs ? 'reviews' : 'specs');
  pdpUpdateStickyBar(p);
  pdpInitDeliveryTimer();
  pdpRenderBundle(p);
  pdpRenderRelated(p);
  pdpRenderRvCarousel();
  pdpInitZoom();
  pdpInitSwipe();
  pdpInitTabsScroll();
  // Sidebar disabled — specs already shown in main tab
  if (typeof pdpInitPinch === 'function') pdpInitPinch();
  if (typeof _pdpCompareReset === 'function') _pdpCompareReset();
  document.getElementById('pdpBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('pdpBackdrop').scrollTop = 0;

  // ── Structured Data (Product + BreadcrumbList) ──
  const _avgRating = p.rating || 0;
  const _rvCount   = p.rv    || 0;
  const _schemaId  = 'pdpJsonLd';
  let _schemaTag   = document.getElementById(_schemaId);
  if (!_schemaTag) {
    _schemaTag = document.createElement('script');
    _schemaTag.type = 'application/ld+json';
    _schemaTag.id   = _schemaId;
    document.head.appendChild(_schemaTag);
  }
  const _catLabel = (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[p.cat]) ? CAT_LABELS[p.cat] : p.cat;
  const _priceValidUntil = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const _images = Array.isArray(p.gallery) && p.gallery.length ? p.gallery : (p.img ? [p.img] : []);
  const _productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": p.name,
    "image": _images,
    "description": p.desc || p.name,
    "brand": { "@type": "Brand", "name": p.brand || '' },
    "sku": p.sku || '',
    ...(p.ean ? { "gtin13": p.ean } : {}),
    "offers": {
      "@type": "Offer",
      "url": `${location.origin}/?product=${p.id}`,
      "priceCurrency": "BGN",
      "price": p.price,
      "priceValidUntil": _priceValidUntil,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": p.stock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Most Computers" }
    },
    ...(_avgRating && _rvCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": _avgRating,
        "reviewCount": _rvCount,
        "bestRating": 5,
        "worstRating": 1
      }
    } : {})
  };
  if (Array.isArray(p.reviews) && p.reviews.length > 0) {
    _productSchema.review = p.reviews.slice(0, 5).map(r => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.name },
      "datePublished": r.date,
      "reviewBody": r.text,
      "reviewRating": { "@type": "Rating", "ratingValue": r.stars, "bestRating": 5, "worstRating": 1 }
    }));
  }
  _schemaTag.textContent = JSON.stringify([
    _productSchema,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Начало", "item": window.location.origin + "/" },
        { "@type": "ListItem", "position": 2, "name": _catLabel, "item": window.location.origin + "/?cat=" + p.cat },
        { "@type": "ListItem", "position": 3, "name": p.name }
      ]
    }
  ]);
}

function closeProductPage() {
  pdpSearchDropClose();
  const _st = document.getElementById('pdpScrollTop');
  if (_st) _st.style.display = 'none';
  document.getElementById('pdpBackdrop').classList.remove('open');
  // Keep body locked if cat-page is still open
  if (!document.getElementById('catPage')?.classList.contains('open')) {
    document.body.style.overflow = '';
    // Restore scroll position
    requestAnimationFrame(() => window.scrollTo(0, _pdpScrollY));
  }
  // Stop any video
  const videoWrap = document.getElementById('pdpVideoWrap');
  if (videoWrap) {
    const iframe = videoWrap.querySelector('iframe');
    if (iframe) iframe.src = iframe.src;
  }
  // Breadcrumb — pop back to category if present
  document.title = 'Most Computers | Онлайн магазин за компютри и компоненти';
  // Reset meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', 'Most Computers – онлайн магазин за компютри, компоненти, монитори, периферия и мрежово оборудване.');
  // Reset OG
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', 'Most Computers | Онлайн магазин за компютри и компоненти');
  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.setAttribute('content', 'https://mostcomputers.bg/og-default.jpg');
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'website');
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', 'https://mostcomputers.bg/');
  if (typeof bcSet === 'function') {
    if (_bcTrail.length >= 2) {
      bcSet([_bcTrail[0]]);
    } else {
      bcSet([]);
    }
  }
}

function pdpSwitchTab(tab) {
  document.querySelectorAll('.pdp-tab').forEach(t => {
    const action = t.getAttribute('data-action') || t.getAttribute('onclick') || '';
    t.classList.toggle('active', action.includes(`'${tab}'`));
  });
  document.querySelectorAll('.pdp-tab-content').forEach(c => c.classList.remove('active'));
  const el = document.getElementById(`pdp-tab-${tab}`);
  if (el) el.classList.add('active');
  // Re-read reviews from localStorage every time the tab is opened
  if (tab === 'reviews' && pdpProductId != null) {
    const p = products.find(x => x.id === pdpProductId);
    const revEl = document.getElementById('pdpReviews');
    if (!p || !revEl) return;
    let displayRevs = p.reviews ? [...p.reviews] : [];
    try {
      const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
      const userRevs = saved[pdpProductId] || [];
      const existingKeys = new Set(displayRevs.map(r => r.name + '|' + r.date));
      userRevs.forEach(r => { if (!existingKeys.has(r.name + '|' + r.date)) displayRevs.unshift(r); });
    } catch(e) {}
    const publicRevs = displayRevs.filter(r => !r.pending);
    if (typeof pdpRenderRatingBreakdown === 'function') pdpRenderRatingBreakdown(publicRevs);
    revEl.innerHTML = publicRevs.length
      ? publicRevs.map(r => `<div class="review-item"><div class="review-header"><span class="review-name">${r.name}</span><span class="review-stars">${starsHTML(r.stars)}</span><span class="review-date">${r.date}</span></div><div class="review-text">${r.text}</div></div>`).join('')
      : '<p style="color:var(--muted);font-size:13px;">Все още няма ревюта за този продукт.</p>';
  }
}

function pdpRenderGallery() {
  const mainImg   = document.getElementById('pdpMainImg');
  const mainEmoji = document.getElementById('pdpMainEmoji');
  const thumbsEl  = document.getElementById('pdpThumbs');
  const p = products.find(x => x.id === pdpProductId);
  if (!p) return;

  if (pdpGallery.length && pdpGallery[pdpGalleryIdx]) {
    mainImg.src = pdpGallery[pdpGalleryIdx];
    mainImg.alt = p.name;
    mainImg.style.display = '';
    mainEmoji.style.display = 'none';
    mainImg.onerror = function() {
      this.style.display = 'none';
      mainEmoji.style.display = '';
      mainEmoji.textContent = p.emoji || '🖥';
      this.onerror = null;
    };
  } else {
    mainImg.style.display = 'none';
    mainEmoji.style.display = '';
    mainEmoji.textContent = p.emoji || '🖥';
  }

  if (pdpGallery.length > 1) {
    thumbsEl.innerHTML = pdpGallery.map((url, i) =>
      `<div class="pdp-thumb ${i===pdpGalleryIdx?'active':''}" onclick="pdpGallerySet(${i})">
        <img src="${url}" alt="" onerror="this.style.display='none'">
      </div>`
    ).join('');
  } else {
    thumbsEl.innerHTML = '';
  }
}

function pdpGalleryNav(dir) {
  if (!pdpGallery.length) return;
  pdpGalleryIdx = (pdpGalleryIdx + dir + pdpGallery.length) % pdpGallery.length;
  pdpRenderGallery();
}

function pdpGallerySet(i) {
  pdpGalleryIdx = i;
  pdpRenderGallery();
}

function pdpRenderVideo(url, wrap) {
  let embedUrl = url;
  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vmMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vmMatch) embedUrl = `https://player.vimeo.com/video/${vmMatch[1]}`;

  const isEmbed = embedUrl !== url || url.includes('embed') || url.includes('youtube') || url.includes('vimeo');
  if (isEmbed || url.startsWith('http')) {
    if (url.match(/\.(mp4|webm|ogg)$/i)) {
      wrap.innerHTML = `<video controls><source src="${url}"></video>`;
    } else {
      wrap.innerHTML = `<iframe src="${embedUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
  } else {
    wrap.innerHTML = `<div class="pdp-video-placeholder"><span>▶</span><div style="font-size:13px;color:var(--muted);">Невалиден видео линк.</div></div>`;
  }
}

function pdpChangeQty(d) {
  pdpQtyVal = Math.max(1, pdpQtyVal + d);
  // Sync all qty displays (main page, sticky bar, bottom sheet)
  ['pdpQty', 'pdpStickyQty', 'pdpBsQty'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = pdpQtyVal;
  });
}

function pdpAddToCart() {
  if (!pdpProductId) return;
  const p = products.find(x => x.id === pdpProductId);
  if (!p) return;
  const ex = cart.find(x => x.id === pdpProductId);
  if (ex) { ex.qty += pdpQtyVal; } else { cart.push({...p, qty: pdpQtyVal}); }
  updateCart();
  if (typeof saveCart === 'function') saveCart();
  // Visual feedback on ALL add-to-cart buttons (main, sticky bar, bottom sheet)
  const addBtns = [
    document.getElementById('pdpAddBtn'),
    document.querySelector('#pdpStickyBar .pdp-sticky-atc'),
    document.querySelector('#pdpBottomSheet .pdp-add-btn'),
  ];
  addBtns.forEach(btn => {
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ Добавен!';
    btn.style.background = 'var(--accent2)';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2000);
  });
  showToast(`✓ ${p.name.substring(0,32)}… добавен в кошницата!`);
  // Reveal checkout shortcut buttons
  const ckBtn = document.getElementById('pdpCheckoutBtn');
  if (ckBtn) ckBtn.style.display = '';
  const stickyBtn = document.getElementById('pdpStickyCheckoutBtn');
  if (stickyBtn) stickyBtn.style.display = '';
}

function pdpCopyProductLink() {
  const url = location.origin + location.pathname + '?product=' + pdpProductId;
  navigator.clipboard.writeText(url).then(() => showToast('🔗 Линкът е копиран!')).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    showToast('🔗 Линкът е копиран!');
  });
}

function pdpShareFacebook() {
  const url = encodeURIComponent(location.origin + location.pathname + '?product=' + pdpProductId);
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank', 'width=600,height=400');
}

function pdpShareViber() {
  const p = products.find(x => x.id === pdpProductId);
  const url = location.origin + location.pathname + '?product=' + pdpProductId;
  const text = encodeURIComponent((p ? p.name + ' — ' : '') + url);
  window.open('viber://forward?text=' + text, '_blank');
}

function pdpToggleWish() {
  if (!pdpProductId) return;
  toggleWishlist(pdpProductId, null);
  const wishBtn = document.getElementById('pdpWishBtn');
  if (wishBtn) wishBtn.innerHTML = wishlist.includes(pdpProductId) ? '❤ В любими' : '♡ Добави в желания';
}



// ===== 2. MODAL SKELETON =====
function showModalSkeleton() {
  const backdrop = document.getElementById('productModalBackdrop');
  const gallery = document.getElementById('modalGallery');
  const info = document.querySelector('.modal-info');
  if (!backdrop || !gallery || !info) return;

  gallery.innerHTML = `<div class="modal-skeleton"><div class="modal-sk-img"></div></div>`;
  info.innerHTML = `
    <div class="modal-skeleton" style="padding:8px 0;">
      <div class="modal-sk-badge" style="width:70px;height:18px;border-radius:9px;background:var(--bg2);margin-bottom:10px;"></div>
      <div class="modal-sk-title" style="width:90%;height:22px;border-radius:6px;background:var(--bg2);margin-bottom:8px;"></div>
      <div class="modal-sk-title" style="width:60%;height:14px;border-radius:6px;background:var(--bg2);margin-bottom:16px;"></div>
      <div class="modal-sk-price"></div>
      <div class="modal-sk-line" style="width:100%;margin-top:16px;"></div>
      <div class="modal-sk-line" style="width:85%;"></div>
      <div class="modal-sk-line" style="width:70%;"></div>
      <div class="modal-sk-btn"></div>
      <div class="modal-sk-btn" style="margin-top:8px;opacity:.5;"></div>
    </div>`;

  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ===== 3. GALLERY SWIPE =====
(function initGallerySwipe() {
  let startX = 0, startY = 0;
  document.addEventListener('touchstart', e => {
    const gallery = e.target.closest('.modal-gallery');
    if (!gallery) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const gallery = e.target.closest('.modal-gallery');
    if (!gallery) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      galleryNav(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
})();


// ===== 4. RELATED CAROUSEL =====
let relatedOffset = 0;
function renderRelated(currentId) {
  const p = products.find(x => x.id === currentId);
  if (!p) return;
  // Same category, different product; fallback to all if <3
  let related = products.filter(x => x.id !== currentId && x.cat === p.cat);
  if (related.length < 3) related = products.filter(x => x.id !== currentId).slice(0, 6);
  related = related.slice(0, 8);

  const track = document.getElementById('relatedTrack');
  if (!track) return;
  relatedOffset = 0;
  track.style.transform = 'translateX(0)';
  track.innerHTML = related.map(r => `
    <div class="related-card" onclick="openProductModal(${r.id})">
      <span class="related-card-emoji">${escHtml(r.emoji||'')}</span>
      <div class="related-card-name">${escHtml(r.name)}</div>
      <div class="related-card-price">${fmtEur(r.price)}</div>
    </div>`).join('');
  updateRelatedNav(related.length);
}

function relatedNav(dir) {
  const track = document.getElementById('relatedTrack');
  const wrap = document.getElementById('relatedWrap');
  if (!track || !wrap) return;
  const cardW = 152; // 140px + 12px gap
  const visible = Math.floor(wrap.offsetWidth / cardW);
  const total = track.children.length;
  const maxOffset = Math.max(0, total - visible);
  relatedOffset = Math.max(0, Math.min(maxOffset, relatedOffset + dir));
  track.style.transform = `translateX(-${relatedOffset * cardW}px)`;
  updateRelatedNav(total);
}

function updateRelatedNav(total) {
  const wrap = document.getElementById('relatedWrap');
  const cardW = 152;
  const visible = wrap ? Math.floor(wrap.offsetWidth / cardW) : 3;
  const prevBtn = document.getElementById('relatedPrev');
  const nextBtn = document.getElementById('relatedNext');
  if (prevBtn) prevBtn.classList.toggle('hidden', relatedOffset === 0);
  if (nextBtn) nextBtn.classList.toggle('hidden', relatedOffset >= total - visible);
}


// ===== 🖼 IMAGE ZOOM =====
(function initImageZoom() {
  document.addEventListener('mousemove', e => {
    const wrap = e.target.closest('.modal-gallery-zoom');
    if (!wrap) return;
    const img = wrap.querySelector('.modal-main-img');
    if (!img || img.style.display === 'none') return;
    const rect = wrap.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    wrap.style.setProperty('--zoom-x', x + '%');
    wrap.style.setProperty('--zoom-y', y + '%');
  });

  // Touch zoom toggle (mobile double-tap)
  let lastTap = 0;
  document.addEventListener('touchend', e => {
    const wrap = e.target.closest('.modal-gallery-zoom');
    if (!wrap) return;
    const now = Date.now();
    if (now - lastTap < 300) {
      wrap.classList.toggle('zoomed');
      e.preventDefault();
    }
    lastTap = now;
  }, { passive: false });
})();


// ===== BACK IN STOCK =====
function submitNotifyStock() {
  const email = document.getElementById('pdpNotifyEmail')?.value.trim();
  if (!email || !email.includes('@')) { showToast('⚠️ Въведи валиден имейл'); return; }
  // Save to localStorage
  const key = 'mc_bis_' + pdpProductId;
  localStorage.setItem(key, email);
  document.getElementById('pdpNotifyForm').style.display = 'none';
  document.getElementById('pdpNotifySuccess').style.display = 'block';
  showToast('📬 Ще те уведомим при наличност!');
}

// ===== STICKY ADD-TO-CART =====
(function() {
  function initStickyBar() {
    const backdrop = document.getElementById('pdpBackdrop');
    if (!backdrop) return;
    let ticking = false;
    backdrop.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const bar = document.getElementById('pdpStickyBar');
          const addBtn = document.getElementById('pdpAddBtn');
          if (!bar || !addBtn) { ticking = false; return; }
          const rect = addBtn.getBoundingClientRect();
          const show = rect.bottom < 0;
          bar.classList.toggle('visible', show);
          // Sync qty
          const qtyMain = document.getElementById('pdpQty');
          const qtySticky = document.getElementById('pdpStickyQty');
          if (qtyMain && qtySticky) qtySticky.textContent = qtyMain.textContent;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
  document.addEventListener('DOMContentLoaded', initStickyBar);
})();

function pdpUpdateStickyBar(p) {
  const nameEl = document.getElementById('pdpStickyName');
  const priceEl = document.getElementById('pdpStickyPrice');
  if (nameEl) nameEl.textContent = p.name;
  if (priceEl) priceEl.textContent = fmtEur(p.price) + ' / ' + fmtBgn(p.price);
}

// ===== RECENTLY DISCOUNTED =====
function renderRecentlyDiscounted() {
  const el = document.getElementById('recentlyDiscountedGrid');
  if (!el) return;
  const discounted = products
    .filter(p => p.old && p.old > p.price)
    .sort((a,b) => ((b.old-b.price)/b.old) - ((a.old-a.price)/a.old))
    .slice(0, 5);
  if (!discounted.length) { el.closest('.section-wrap')?.remove(); return; }
  el.innerHTML = discounted.map(p => makeCard(p)).join('');
  updateWishlistUI();
}


// ===== REVIEW FORM =====
let rfStarVal = 0;

function rfSetStar(n) {
  rfStarVal = n;
  const labels = ['Ужасно', 'Лошо', 'Средно', 'Добро', 'Отлично'];
  const lbl = document.getElementById('rfStarLabel');
  if (lbl) lbl.textContent = labels[n - 1] || '';
  document.querySelectorAll('.rf-star').forEach(s => {
    s.style.color = parseInt(s.dataset.v) <= n ? '#fbbf24' : '';
  });
}

function submitPdpReview() {
  const name = document.getElementById('rfName')?.value.trim();
  const text = document.getElementById('rfText')?.value.trim();
  if (!name) { showToast('⚠️ Въведи твоето ime'); return; }
  if (!rfStarVal) { showToast('⚠️ Избери рейтинг'); return; }
  if (!text || text.length < 10) { showToast('⚠️ Ревюто трябва да е поне 10 символа'); return; }

  const review = {
    name,
    stars: rfStarVal,
    text,
    date: new Date().toLocaleDateString('bg-BG'),
    pending: true,
    productId: pdpProductId,
  };

  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    if (!saved[pdpProductId]) saved[pdpProductId] = [];
    saved[pdpProductId].unshift(review);
    localStorage.setItem('mc_reviews', JSON.stringify(saved));
  } catch(e) {}

  // Reset form
  document.getElementById('rfName').value = '';
  document.getElementById('rfText').value = '';
  rfStarVal = 0;
  document.querySelectorAll('.rf-star').forEach(s => s.style.color = '');
  const lbl = document.getElementById('rfStarLabel');
  if (lbl) lbl.textContent = 'Избери рейтинг';

  showToast('✅ Ревюто е изпратено и ще бъде публикувано след преглед!');
}


// ===== PDP subheader search =====
let _pdpSrchIdx = -1;
let _pdpSrchResults = [];
let _pdpSrchTimer = null;

function pdpSearchLive(q) {
  const clear = document.getElementById('pdpShClear');
  if (clear) clear.style.display = q ? '' : 'none';
  clearTimeout(_pdpSrchTimer);
  if (!q.trim()) { pdpSearchDropClose(); return; }
  _pdpSrchTimer = setTimeout(() => _pdpSrchRender(q.trim()), 220);
}

function _pdpSrchRender(q) {
  const drop = document.getElementById('pdpSearchDrop');
  if (!drop) return;

  _pdpSrchResults = typeof searchProducts === 'function'
    ? searchProducts(q, '').slice(0, 7)
    : [];
  _pdpSrchIdx = -1;

  if (!_pdpSrchResults.length) {
    drop.innerHTML = `<div class="pdp-drop-empty">Няма намерени продукти за <strong>${escHtml(q)}</strong></div>`;
    drop.style.display = '';
    return;
  }

  drop.innerHTML = _pdpSrchResults.map((p, i) => {
    const price = typeof formatPrice === 'function' ? formatPrice(p.price) : p.price + ' лв.';
    const img = p.img
      ? `<img src="${escHtml(p.img)}" alt="" class="pdp-drop-img" loading="lazy">`
      : `<span class="pdp-drop-emoji">${escHtml(p.emoji || '📦')}</span>`;
    return `<div class="pdp-drop-item" role="option" data-idx="${i}" onmousedown="pdpSearchPick(${i})">
      <div class="pdp-drop-thumb">${img}</div>
      <div class="pdp-drop-info">
        <div class="pdp-drop-name">${escHtml(p.name)}</div>
        <div class="pdp-drop-price">${price}</div>
      </div>
    </div>`;
  }).join('') +
  `<div class="pdp-drop-all" onmousedown="pdpSearchGo(document.getElementById('pdpSearchInput').value)">
    Виж всички резултати за „${escHtml(q)}" →
  </div>`;

  drop.style.display = '';
}

function pdpSearchPick(idx) {
  const p = _pdpSrchResults[idx];
  if (!p) return;
  pdpSearchDropClose();
  const inp = document.getElementById('pdpSearchInput');
  if (inp) inp.value = '';
  const clear = document.getElementById('pdpShClear');
  if (clear) clear.style.display = 'none';
  openProductPage(p.id);
}

function pdpSearchGo(q) {
  q = (q || '').trim();
  if (!q) return;
  pdpSearchDropClose();
  closeProductPage();
  const inp = document.getElementById('searchInput');
  if (inp) { inp.value = q; }
  if (typeof showSearchResultsPage === 'function') showSearchResultsPage(q);
}

function pdpSearchClear() {
  const inp = document.getElementById('pdpSearchInput');
  if (inp) { inp.value = ''; inp.focus(); }
  const clear = document.getElementById('pdpShClear');
  if (clear) clear.style.display = 'none';
  pdpSearchDropClose();
}

function pdpSearchDropClose() {
  const drop = document.getElementById('pdpSearchDrop');
  if (drop) drop.style.display = 'none';
  _pdpSrchIdx = -1;
}

function pdpSearchKey(e) {
  const drop = document.getElementById('pdpSearchDrop');
  const items = drop ? drop.querySelectorAll('.pdp-drop-item') : [];
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    _pdpSrchIdx = Math.min(_pdpSrchIdx + 1, items.length - 1);
    _pdpSrchHighlight(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    _pdpSrchIdx = Math.max(_pdpSrchIdx - 1, -1);
    _pdpSrchHighlight(items);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (_pdpSrchIdx >= 0 && items[_pdpSrchIdx]) {
      pdpSearchPick(Number(items[_pdpSrchIdx].dataset.idx));
    } else {
      pdpSearchGo(e.target.value);
    }
  } else if (e.key === 'Escape') {
    pdpSearchClear();
  }
}

function _pdpSrchHighlight(items) {
  items.forEach((el, i) => el.classList.toggle('active', i === _pdpSrchIdx));
}

// Close PDP search dropdown on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('#pdpShSearch') && !e.target.closest('#pdpSearchDrop')) {
    pdpSearchDropClose();
  }
});

// ===== BUNDLE OFFER =====
function pdpRenderBundle(p) {
  const wrap = document.getElementById('pdpBundle');
  if (!wrap) return;
  if (!p.bundle || !p.bundle.length) { wrap.style.display = 'none'; return; }

  const bundleProds = p.bundle.map(id => products.find(x => x.id === id)).filter(Boolean);
  if (!bundleProds.length) { wrap.style.display = 'none'; return; }

  const disc = p.bundleDiscount || 10;
  const allProds = [p, ...bundleProds];
  const totalFull = allProds.reduce((s, x) => s + x.price, 0);
  const totalDisc = Math.round(totalFull * (1 - disc / 100));
  const saving = totalFull - totalDisc;

  const _esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const itemsHtml = allProds.map((x, i) => `
    <div class="bundle-item" onclick="openProductPage(${x.id})">
      <div class="bundle-emoji">${x.emoji}</div>
      <div class="bundle-info">
        <div class="bundle-item-name">${_esc(x.name.length > 40 ? x.name.slice(0,40)+'…' : x.name)}</div>
        <div class="bundle-item-price">${fmtEur(x.price)}</div>
      </div>
    </div>
    ${i < allProds.length - 1 ? '<div class="bundle-plus">+</div>' : ''}
  `).join('');

  wrap.innerHTML = `
    <div class="bundle-section">
      <div class="bundle-header">
        <span class="bundle-tag">🎁 Купи заедно</span>
        <span class="bundle-save-badge">Спести ${fmtEur(saving)}</span>
      </div>
      <div class="bundle-items">${itemsHtml}</div>
      <div class="bundle-footer">
        <div class="bundle-totals">
          <span class="bundle-old-total">${fmtEur(totalFull)}</span>
          <span class="bundle-new-total">${fmtEur(totalDisc)}</span>
          <span class="bundle-disc-label">-${disc}% при комплект</span>
        </div>
        <button type="button" class="bundle-add-btn" onclick="pdpAddBundle(${JSON.stringify(allProds.map(x=>x.id))})">
          🛒 Добави всички в кошницата
        </button>
      </div>
    </div>`;
  wrap.style.display = '';
}

function pdpAddBundle(ids) {
  ids.forEach(id => { if (typeof addToCart === 'function') addToCart(id); });
  showToast('✅ Комплектът е добавен в кошницата!');
}

// ===== PDP UX ENHANCEMENTS =====

// ── LIGHTBOX ──
function pdpLbOpen() {
  var img = document.getElementById('pdpMainImg');
  if (!img || !img.src || img.style.display === 'none') return;
  var lb = document.getElementById('pdpLightbox');
  var lbImg = document.getElementById('pdpLbImg');
  if (!lb || !lbImg) return;
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbImg.style.setProperty('--lb-scale', '1');
  lb.style.display = 'flex';
  document.addEventListener('keydown', _pdpLbKey);
}
function pdpLbClose() {
  var lb = document.getElementById('pdpLightbox');
  if (lb) lb.style.display = 'none';
  document.removeEventListener('keydown', _pdpLbKey);
}
function pdpLbNav(dir) {
  pdpGalleryNav(dir);
  var img = document.getElementById('pdpMainImg');
  var lbImg = document.getElementById('pdpLbImg');
  if (img && lbImg) lbImg.src = img.src;
}
function _pdpLbKey(e) {
  if (e.key === 'Escape') pdpLbClose();
  if (e.key === 'ArrowLeft') pdpLbNav(-1);
  if (e.key === 'ArrowRight') pdpLbNav(1);
}
// Wheel zoom
(function() {
  document.addEventListener('wheel', function(e) {
    var lb = document.getElementById('pdpLightbox');
    if (!lb || lb.style.display === 'none') return;
    e.preventDefault();
    var lbImg = document.getElementById('pdpLbImg');
    var cur = parseFloat(lbImg.style.getPropertyValue('--lb-scale') || '1');
    var next = Math.min(4, Math.max(1, cur - e.deltaY * 0.003));
    lbImg.style.setProperty('--lb-scale', next);
  }, { passive: false });
})();

// Scroll-to-top button visibility + action
function pdpGoToTop() {
  var b = document.getElementById('pdpBackdrop');
  if (!b) return;
  b.scrollTop = 0;
}
(function() {
  var backdrop = document.getElementById('pdpBackdrop');
  if (!backdrop) return;
  backdrop.addEventListener('scroll', function() {
    var btn = document.getElementById('pdpScrollTop');
    if (!btn) return;
    var show = backdrop.scrollTop > 400;
    btn.style.display = show ? '' : 'none';
  }, { passive: true });
  // wire button via JS (works on both click and touch)
  var _wireBtn = function() {
    var btn = document.getElementById('pdpScrollTop');
    if (!btn) return;
    btn.addEventListener('click', pdpGoToTop);
    btn.addEventListener('touchstart', function(e) { e.preventDefault(); pdpGoToTop(); }, { passive: false });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _wireBtn);
  } else {
    _wireBtn();
  }
})();

// 1. DELIVERY TIMER
function pdpInitDeliveryTimer() {
  const el = document.getElementById('pdpDeliveryMsg');
  const cd = document.getElementById('pdpDeliveryCd');
  if (!el) return;
  clearInterval(pdpInitDeliveryTimer._iv);

  function update() {
    const now = new Date();
    const h = now.getHours(), m = now.getMinutes();
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;
    if (isWeekend) {
      el.innerHTML = 'Поръчай сега и получи в <strong>понеделник</strong>';
      if (cd) cd.textContent = '';
      return;
    }
    // Cutoff: 16:30 = 16h 30m
    const cutoffSec = 16 * 3600 + 30 * 60;
    const nowSec = h * 3600 + m * 60 + now.getSeconds();
    if (nowSec < cutoffSec) {
      const secLeft = cutoffSec - nowSec;
      const hh = Math.floor(secLeft / 3600);
      const mm = String(Math.floor((secLeft % 3600) / 60)).padStart(2, '0');
      const ss = String(secLeft % 60).padStart(2, '0');
      el.innerHTML = 'Поръчай до <strong>16:30 ч.</strong> и получи <strong>утре</strong>';
      if (cd) cd.textContent = '(остават ' + hh + ':' + mm + ':' + ss + ')';
    } else {
      el.innerHTML = 'Поръчай сега — изпращаме <strong>утре</strong>';
      if (cd) cd.textContent = '';
    }
  }
  update();
  pdpInitDeliveryTimer._iv = setInterval(update, 1000);
}

// 2. RATING BREAKDOWN
function pdpRenderRatingBreakdown(revs) {
  const wrap = document.getElementById('pdpRvBreakdown');
  if (!wrap) return;
  if (!revs || !revs.length) { wrap.style.display = 'none'; return; }
  const counts = [0, 0, 0, 0, 0];
  revs.forEach(function(r) {
    const i = Math.round(r.stars) - 1;
    if (i >= 0 && i < 5) counts[i]++;
  });
  const avg = (revs.reduce(function(s, r) { return s + r.stars; }, 0) / revs.length).toFixed(1);
  const total = revs.length;
  var barsHtml = '';
  [5,4,3,2,1].forEach(function(s) {
    var c = counts[s-1];
    var pct = total ? Math.round(c / total * 100) : 0;
    barsHtml += '<div class="pdp-rvb-row">' +
      '<span class="pdp-rvb-lbl">' + s + ' ★</span>' +
      '<div class="pdp-rvb-bar"><div class="pdp-rvb-fill" style="width:' + pct + '%"></div></div>' +
      '<span class="pdp-rvb-num">' + c + '</span>' +
      '</div>';
  });
  wrap.innerHTML = '<div class="pdp-rvb">' +
    '<div class="pdp-rvb-avg">' +
      '<div class="pdp-rvb-big">' + avg + '</div>' +
      '<div class="pdp-rvb-stars">' + starsHTML(parseFloat(avg)) + '</div>' +
      '<div class="pdp-rvb-count">' + total + ' ревют' + (total === 1 ? 'о' : 'а') + '</div>' +
    '</div>' +
    '<div class="pdp-rvb-bars">' + barsHtml + '</div>' +
  '</div>';
  wrap.style.display = '';
}

// 3. IMAGE ZOOM
function pdpInitZoom() {
  const wrap = document.querySelector('.pdp-main-img-wrap');
  if (!wrap) return;
  // Remove previous listeners via flag
  if (wrap._zoomInited) {
    wrap.removeEventListener('mousemove', wrap._zoomMove);
    wrap.removeEventListener('mouseleave', wrap._zoomLeave);
  }
  wrap._zoomMove = function(e) {
    const img = document.getElementById('pdpMainImg');
    if (!img || img.style.display === 'none') return;
    const r = wrap.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
    const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
    img.style.transformOrigin = x + '% ' + y + '%';
    img.style.transform = 'scale(2.2)';
    wrap.style.cursor = 'zoom-in';
  };
  wrap._zoomLeave = function() {
    const img = document.getElementById('pdpMainImg');
    if (!img) return;
    img.style.transform = '';
    img.style.transformOrigin = 'center center';
  };
  wrap.addEventListener('mousemove', wrap._zoomMove);
  wrap.addEventListener('mouseleave', wrap._zoomLeave);
  wrap._zoomInited = true;
}

// 4. MOBILE SWIPE
function pdpInitSwipe() {
  const wrap = document.querySelector('.pdp-main-img-wrap');
  if (!wrap || wrap._swipeInited) return;
  var sx = 0;
  wrap.addEventListener('touchstart', function(e) {
    sx = e.touches[0].clientX;
  }, { passive: true });
  wrap.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) {
      pdpGalleryNav(dx < 0 ? 1 : -1);
      wrap.classList.remove('swipe-bounce');
      void wrap.offsetWidth; // reflow to restart animation
      wrap.classList.add('swipe-bounce');
      setTimeout(function(){ wrap.classList.remove('swipe-bounce'); }, 320);
    }
  }, { passive: true });
  wrap._swipeInited = true;
}

// 5. TABS SCROLL SYNC
var _pdpTabsObs = null;
function pdpInitTabsScroll() {
  if (_pdpTabsObs) { _pdpTabsObs.disconnect(); _pdpTabsObs = null; }
  var backdrop = document.getElementById('pdpBackdrop');
  if (!backdrop || !('IntersectionObserver' in window)) return;
  var tabs = ['specs','desc','video','reviews','vendor'];
  _pdpTabsObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var tab = entry.target.id.replace('pdp-tab-', '');
        document.querySelectorAll('.pdp-tab').forEach(function(t) {
          var act = t.getAttribute('data-action') || '';
          t.classList.toggle('active', act.indexOf("'" + tab + "'") !== -1);
        });
      }
    });
  }, { root: backdrop, rootMargin: '-10% 0px -75% 0px', threshold: 0 });
  tabs.forEach(function(t) {
    var el = document.getElementById('pdp-tab-' + t);
    if (el) _pdpTabsObs.observe(el);
  });
}

// 6. SPECS SEARCH/FILTER
function pdpFilterSpecs(q) {
  var rows = document.querySelectorAll('#pdpSpecsTbody tr');
  var ql = q.toLowerCase().trim();
  rows.forEach(function(row) {
    row.style.display = (!ql || row.textContent.toLowerCase().indexOf(ql) !== -1) ? '' : 'none';
  });
  var noRes = document.getElementById('pdpSpecsNoResult');
  var visible = Array.from(rows).some(function(r) { return r.style.display !== 'none'; });
  if (noRes) noRes.style.display = (ql && !visible) ? '' : 'none';
}

// 7. RELATED PRODUCTS CAROUSEL
function pdpRenderRelated(p) {
  var section = document.getElementById('pdpRelated');
  var scroll  = document.getElementById('pdpRelatedScroll');
  var title   = document.getElementById('pdpRelatedTitle');
  if (!section || !scroll) return;
  var all = (typeof products !== 'undefined') ? products : [];
  var related = all.filter(function(x) { return x.id !== p.id && x.cat === p.cat; })
    .sort(function() { return Math.random() - 0.5; })
    .slice(0, 14);
  if (related.length < 2) { section.style.display = 'none'; return; }
  if (title) {
    var catLabel = (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[p.cat]) ? CAT_LABELS[p.cat] : '';
    title.textContent = catLabel ? ('Подобни — ' + catLabel) : 'Подобни продукти';
  }
  scroll.innerHTML = related.map(_pdpCarCard).join('');
  section.style.display = '';
}

// 8. RECENTLY VIEWED CAROUSEL IN PDP
function pdpRenderRvCarousel() {
  var section = document.getElementById('pdpRvSection');
  var scroll  = document.getElementById('pdpRvCarousel');
  if (!section || !scroll) return;
  var rv = [];
  try { rv = JSON.parse(localStorage.getItem('mc_rv') || '[]'); } catch(e) {}
  var all = (typeof products !== 'undefined') ? products : [];
  var items = rv.map(function(id) { return all.find(function(p) { return p.id === id; }); })
    .filter(Boolean).slice(0, 14);
  if (items.length < 2) { section.style.display = 'none'; return; }
  scroll.innerHTML = items.map(_pdpCarCard).join('');
  section.style.display = '';
}

// Shared carousel card renderer
function _pdpCarCard(p) {
  var price = (typeof fmtEur === 'function') ? fmtEur(p.price) : (p.price + ' лв.');
  var thumb = p.img
    ? '<img class="pdp-car-img" src="' + p.img + '" alt="" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
    : '';
  var emoji = '<span class="pdp-car-emoji"' + (p.img ? ' style="display:none"' : '') + '>' + (p.emoji || '📦') + '</span>';
  var stars = p.rating ? '<div class="pdp-car-stars">' + starsHTML(p.rating) + '</div>' : '';
  var badge = p.badge === 'sale' ? '<span class="pdp-car-badge">Промо</span>'
    : p.badge === 'new' ? '<span class="pdp-car-badge pdp-car-badge-new">Ново</span>' : '';
  return '<div class="pdp-car-card" onclick="openProductPage(' + p.id + ')">' +
    '<div class="pdp-car-thumb">' + badge + thumb + emoji + '</div>' +
    '<div class="pdp-car-info">' +
      '<div class="pdp-car-name">' + (typeof _esc === 'function' ? _esc(p.name) : escHtml(p.name)) + '</div>' +
      stars +
      '<div class="pdp-car-price">' + price + '</div>' +
    '</div>' +
  '</div>';
}

// Carousel scroll helper
function pdpCarScroll(id, dir) {
  var el = document.getElementById(id);
  if (el) el.scrollBy({ left: dir * 230, behavior: 'smooth' });
}

// ===== 9. STICKY SPECS SIDEBAR =====
function pdpRenderSpecsSidebar(p) {
  var sb = document.getElementById('pdpSpecsSidebar');
  if (!sb) return;
  var specs = p.specs || {};
  var keys = Object.keys(specs).slice(0, 10);
  if (!keys.length) { sb.style.display = 'none'; return; }
  var rows = keys.map(function(k) {
    var _e = typeof _esc === 'function' ? _esc : escHtml;
    return '<tr><td class="pdp-sb-key">' + _e(k) + '</td><td class="pdp-sb-val">' + _e(specs[k]) + '</td></tr>';
  }).join('');
  sb.innerHTML =
    '<div class="pdp-sb-title">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' +
      ' Основни характеристики' +
    '</div>' +
    '<table class="pdp-sb-table"><tbody>' + rows + '</tbody></table>' +
    '<button type="button" class="pdp-sb-more" onclick="pdpSwitchTab(\'specs\');document.getElementById(\'pdp-tab-specs\').scrollIntoView({behavior:\'smooth\'})">Виж всички →</button>';
  sb.style.display = '';
}

// ===== 10. PRINT / PDF =====
function pdpPrintSpecs() {
  var p = (typeof products !== 'undefined') ? products.find(function(x) { return x.id === pdpProductId; }) : null;
  if (!p) return;
  var specs = p.specs || {};
  var _ep = function(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };
  var rows = Object.keys(specs).map(function(k) {
    return '<tr><td style="padding:7px 12px;font-weight:600;color:#444;width:38%;border-bottom:1px solid #eee;">' + _ep(k) +
           '</td><td style="padding:7px 12px;border-bottom:1px solid #eee;">' + _ep(specs[k]) + '</td></tr>';
  }).join('');
  var win = window.open('', '_blank', 'width=800,height=700');
  if (!win) { showToast('⚠️ Попъп прозорецът е блокиран. Разреши попъпи за този сайт.'); return; }
  win.document.write(
    '<!DOCTYPE html><html><head><title>' + _ep(p.name) + ' — Характеристики</title>' +
    '<style>body{font-family:Arial,sans-serif;padding:32px;color:#1a1a1a;}h1{font-size:20px;margin-bottom:4px;}' +
    '.sub{color:#888;font-size:13px;margin-bottom:24px;}table{width:100%;border-collapse:collapse;}' +
    'tr:nth-child(even){background:#f9f9f9;}' +
    '@media print{button{display:none!important;}}' +
    '</style></head><body>' +
    '<h1>' + _ep(p.name) + '</h1>' +
    '<div class="sub">' + _ep(p.brand || '') + (p.sku ? ' · SKU: ' + _ep(p.sku) : '') + '</div>' +
    '<table><tbody>' + rows + '</tbody></table>' +
    '<br><button onclick="window.print()" style="padding:10px 22px;background:#bd1105;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;">🖨 Принтирай</button>' +
    '</body></html>'
  );
  win.document.close();
}

// ===== 11. COMPARE BUTTON IN PDP =====
function pdpToggleCompare() {
  var btn = document.getElementById('pdpCompareBtn');
  if (!pdpProductId || typeof toggleCompare !== 'function') return;
  var isActive = btn && btn.classList.contains('active');
  toggleCompare(pdpProductId, !isActive);
  if (btn) {
    if (!isActive) {
      btn.innerHTML = btn.innerHTML.replace('Сравни', 'Сравнено ✓');
      btn.classList.add('active');
    } else {
      btn.innerHTML = btn.innerHTML.replace('Сравнено ✓', 'Сравни');
      btn.classList.remove('active');
    }
  }
}

// Reset compare button state when new product opens
var _pdpCompareReset = function() {
  var btn = document.getElementById('pdpCompareBtn');
  if (!btn) return;
  btn.classList.remove('active');
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> Сравни';
};

// ===== 12. MOBILE BOTTOM SHEET =====
var _pdpBsVisible = false;

function pdpBsOpen(p) {
  var sheet = document.getElementById('pdpBottomSheet');
  var overlay = document.getElementById('pdpBsOverlay');
  if (!sheet || !p) return;
  // Populate
  var nameEl = document.getElementById('pdpBsName');
  var priceEl = document.getElementById('pdpBsPrice');
  var thumbEl = document.getElementById('pdpBsThumb');
  if (nameEl) nameEl.textContent = p.name;
  if (priceEl) priceEl.textContent = (typeof fmtEur === 'function') ? fmtEur(p.price) : p.price + ' лв.';
  if (thumbEl) {
    thumbEl.innerHTML = p.img
      ? '<img src="' + p.img + '" style="width:44px;height:44px;object-fit:contain;border-radius:6px;">'
      : '<span style="font-size:28px;">' + (p.emoji || '📦') + '</span>';
  }
  sheet.classList.add('open');
  if (overlay) { overlay.style.display = ''; }
  _pdpBsVisible = true;
}

function pdpBsClose() {
  var sheet = document.getElementById('pdpBottomSheet');
  var overlay = document.getElementById('pdpBsOverlay');
  if (sheet) sheet.classList.remove('open');
  if (overlay) overlay.style.display = 'none';
  _pdpBsVisible = false;
}

// Show bottom sheet when add button scrolls out of view (mobile only)
(function() {
  var backdrop = document.getElementById('pdpBackdrop');
  if (!backdrop) return;
  backdrop.addEventListener('scroll', function() {
    if (window.innerWidth > 768) return;
    var addBtn = document.getElementById('pdpAddBtn');
    if (!addBtn) return;
    var rect = addBtn.getBoundingClientRect();
    var outOfView = rect.bottom < 0 || rect.top > window.innerHeight;
    var sheet = document.getElementById('pdpBottomSheet');
    if (!sheet) return;
    if (outOfView && !sheet.classList.contains('open')) {
      var p = (typeof products !== 'undefined' && pdpProductId != null)
        ? products.find(function(x) { return x.id === pdpProductId; }) : null;
      if (p) pdpBsOpen(p);
    } else if (!outOfView && sheet.classList.contains('open')) {
      pdpBsClose();
    }
  }, { passive: true });
})();

// Sync bottom sheet qty display
var _origPdpChangeQty = typeof pdpChangeQty === 'function' ? pdpChangeQty : null;

// ===== 13. PINCH-TO-ZOOM =====
function pdpInitPinch() {
  var wrap = document.querySelector('.pdp-main-img-wrap');
  if (!wrap || wrap._pinchInited) return;
  var startDist = 0, curScale = 1;

  wrap.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      startDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: true });

  wrap.addEventListener('touchmove', function(e) {
    if (e.touches.length !== 2) return;
    var dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    var img = document.getElementById('pdpMainImg');
    if (!img || img.style.display === 'none') return;
    curScale = Math.min(Math.max(dist / startDist, 1), 3.5);
    img.style.transform = 'scale(' + curScale + ')';
  }, { passive: true });

  wrap.addEventListener('touchend', function(e) {
    if (e.touches.length < 2) {
      // reset after short delay
      setTimeout(function() {
        var img = document.getElementById('pdpMainImg');
        if (img) { img.style.transform = ''; curScale = 1; }
      }, 300);
    }
  }, { passive: true });

  wrap._pinchInited = true;
}

// ===== BREADCRUMBS =====
// State: array of {label, action}  — action is a function or null for current
let _bcTrail = []; // [{label, fn}]

// BC_CAT_LABELS → вж. глобалния CAT_LABELS в currency.js
const BC_CAT_LABELS = CAT_LABELS;

function bcRender() {
  const inner = document.getElementById('bcInner');
  if (!inner) return;

  // Always start with Home
  const crumbs = [{ label: 'Начало', fn: () => { closeProductPage(); bcSet([]); } }, ..._bcTrail];

  window._bcFns = window._bcFns || {};
  const html = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    const sep    = i > 0 ? '<span class="bc-sep" aria-hidden="true">›</span>' : '';
    if (isLast) {
      return `${sep}<div class="bc-item current" aria-current="page"><span title="${c.label}">${c.label}</span></div>`;
    }
    window._bcFns[i] = c.fn;
    return `${sep}<div class="bc-item"><button type="button" onclick="if(window._bcFns[${i}])window._bcFns[${i}]()">${c.label}</button></div>`;
  }).join('');

  inner.innerHTML = html;

  // Mirror into PDP subheader breadcrumb
  const pdpBc = document.getElementById('pdpBcInner');
  if (pdpBc) pdpBc.innerHTML = html;

  // JSON-LD structured data
  const ldCrumbs = crumbs.map((c, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": c.label,
    "item": c.url || (i === 0 ? 'https://mostcomputers.bg/' : window.location.href.split('?')[0])
  }));
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": ldCrumbs
  };
  const ldEl = document.getElementById('bcJsonLd');
  if (ldEl) ldEl.textContent = JSON.stringify(ld, null, 2);
}

function bcSet(trail) {
  _bcTrail = trail;
  bcRender();
}

function bcPush(label, fn) {
  _bcTrail.push({ label, fn });
  bcRender();
}

function bcPopTo(idx) {
  _bcTrail = _bcTrail.slice(0, idx);
  bcRender();
}

// ── Hook into navigation events ──

// Category filter
function bcOnFilterCat(cat) {
  if (cat === 'all') {
    bcSet([]);
  } else {
    const label = BC_CAT_LABELS[cat] || cat;
    const url = `https://mostcomputers.bg/?cat=${cat}`;
    bcSet([{
      label,
      url,
      fn: () => { filterCat(cat); bcSet([{ label, url, fn: () => filterCat(cat) }]); }
    }]);
  }
}

// Product page open
// breadcrumb hooks are inlined in openProductPage and closeProductPage

// Search results
function bcOnSearch(query) {
  bcSet([{ label: `Търсене: „${query}"`, fn: null }]);
}

// Blog / Service / Delivery pages
function bcOnPage(label) {
  bcSet([{ label, fn: null }]);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  bcRender(); // renders just "Начало"
});



// ===== ItemList schema for category pages =====
function injectCategoryItemList(cat) {
  let el = document.getElementById('category-jsonld');
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'category-jsonld'; document.head.appendChild(el); }
  if (!cat || cat === 'all') { el.textContent = ''; return; }
  const list = (typeof getFilteredSorted === 'function')
    ? getFilteredSorted().slice(0, 20)
    : (typeof products !== 'undefined' ? products.filter(p => p.cat === cat).slice(0, 20) : []);
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[cat]) ? CAT_LABELS[cat] + ' — Most Computers' : cat,
    "url": `https://mostcomputers.bg/?cat=${cat}`,
    "numberOfItems": list.length,
    "itemListElement": list.map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `https://mostcomputers.bg/?product=${p.id}`,
      "name": p.name
    }))
  };
  el.textContent = JSON.stringify(schema);
}

// ===== 5. JSON-LD STRUCTURED DATA =====
function injectProductSchema(p) {
  let el = document.getElementById('product-jsonld');
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'product-jsonld'; document.head.appendChild(el); }
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const imgSrc = (Array.isArray(p.gallery) && p.gallery[0]) ? p.gallery[0] : (p.img || null);
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": p.name,
    "brand": { "@type": "Brand", "name": p.brand },
    "sku": p.sku,
    "gtin13": p.ean,
    "description": p.desc,
    ...(imgSrc ? { "image": [imgSrc] } : {}),
    "offers": {
      "@type": "Offer",
      "url": `${location.href.split('?')[0]}?product=${p.id}`,
      "priceCurrency": "BGN",
      "price": p.price,
      "priceValidUntil": priceValidUntil,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": p.stock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "Most Computers" }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": p.rating,
      "reviewCount": p.rv,
      "bestRating": 5,
      "worstRating": 1
    }
  };
  if (Array.isArray(p.reviews) && p.reviews.length > 0) {
    schema.review = p.reviews.slice(0, 5).map(r => ({
      "@type": "Review",
      "author": { "@type": "Person", "name": r.name },
      "datePublished": r.date,
      "reviewBody": r.text,
      "reviewRating": { "@type": "Rating", "ratingValue": r.stars, "bestRating": 5, "worstRating": 1 }
    }));
  }
  el.textContent = JSON.stringify(schema);
}

// JSON-LD injected via mc:productopen event (fired in openProductModal)
document.addEventListener('mc:productopen', e => {
  const p = products.find(x => x.id === e.detail);
  if (!p) return;
  injectProductSchema(p);
  document.title = p.name + ' | Most Computers';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    const descText = p.desc
      ? p.desc.substring(0, 155) + (p.desc.length > 155 ? '…' : '')
      : `${p.name} — ${p.brand} | Цена: ${(p.price/EUR_RATE).toFixed(2)} €. Купи онлайн от Most Computers.`;
    metaDesc.setAttribute('content', descText);
  }
  // Update Open Graph meta tags for social sharing
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', p.name + ' | Most Computers');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    const descText = p.desc
      ? p.desc.substring(0, 200) + (p.desc.length > 200 ? '…' : '')
      : `${p.name} — ${p.brand}. Цена: ${(p.price/EUR_RATE).toFixed(2)} €. Купи онлайн от Most Computers.`;
    ogDesc.setAttribute('content', descText);
  }
  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) {
    const imgSrc = (Array.isArray(p.gallery) && p.gallery[0]) ? p.gallery[0]
      : (p.img || 'https://mostcomputers.bg/og-default.jpg');
    ogImg.setAttribute('content', imgSrc);
  }
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', `https://mostcomputers.bg/?product=${p.id}`);
  const imgSrc = (Array.isArray(p.gallery) && p.gallery[0]) ? p.gallery[0]
    : (p.img || 'https://mostcomputers.bg/og-default.jpg');
  const twImg = document.querySelector('meta[name="twitter:image"]');
  if (twImg) twImg.setAttribute('content', imgSrc);
  // og:type → product
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'product');
  // og:image:alt
  const ogImgAlt = document.querySelector('meta[property="og:image:alt"]');
  if (ogImgAlt) ogImgAlt.setAttribute('content', p.name + ' — Most Computers');
  // Twitter title + description
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', p.name + ' | Most Computers');
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) {
    const d = p.desc
      ? p.desc.substring(0, 155) + (p.desc.length > 155 ? '…' : '')
      : `${p.name} — ${p.brand}. Цена: ${(p.price/EUR_RATE).toFixed(2)} €.`;
    twDesc.setAttribute('content', d);
  }
  // Canonical URL
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', `https://mostcomputers.bg/?product=${p.id}`);
});

// ===== 6. SITEMAP GENERATOR =====
function generateSitemap() {
  const base = 'https://mostcomputers.bg';
  const today = new Date().toISOString().split('T')[0];
  const staticPages = [
    { url: '/', priority: '1.0', freq: 'daily' },
    { url: '/?cat=laptops', priority: '0.9', freq: 'weekly' },
    { url: '/?cat=desktops', priority: '0.9', freq: 'weekly' },
    { url: '/?cat=components', priority: '0.8', freq: 'weekly' },
    { url: '/?cat=peripherals', priority: '0.8', freq: 'weekly' },
    { url: '/?cat=network', priority: '0.7', freq: 'weekly' },
    { url: '/?cat=storage', priority: '0.7', freq: 'weekly' },
    { url: '/?cat=accessories', priority: '0.7', freq: 'weekly' },
  ];
  const productPages = products.map(p => ({
    url: `/?product=${p.id}`,
    priority: '0.8',
    freq: 'monthly'
  }));
  const allPages = [...staticPages, ...productPages];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    allPages.map(pg => `  <url>\n    <loc>${base}${pg.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${pg.freq}</changefreq>\n    <priority>${pg.priority}</priority>\n  </url>`).join('\n') +
    `\n</urlset>`;

  // Download as file
  const blob = new Blob([xml], { type: 'application/xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sitemap.xml';
  a.click();
  URL.revokeObjectURL(a.href);
  showToast('✓ sitemap.xml изтеглен успешно!');
}

// Init URL params on load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(readURLParams, 100);
});



// ===== EMAIL PROTECTION =====
function epClick(el) {
  const u = el.dataset.u, d = el.dataset.d;
  const addr = u + '@' + d;
  // Activate mailto on the parent <a> if present, otherwise open directly
  const link = el.closest('a') || el;
  link.href = 'mailto:' + addr;
}
// Also handle direct span clicks
document.addEventListener('click', e => {
  const ep = e.target.closest('.ep');
  if (ep) {
    e.preventDefault();
    const addr = ep.dataset.u + '@' + ep.dataset.d;
    location.href = 'mailto:' + addr;
  }
});



// ===== 📲 SHARE PRODUCT (Web Share API) =====
function shareProduct() {
  const p = products.find(x => x.id === modalProductId);
  if (!p) return;
  const url = location.origin + location.pathname + '?product=' + p.id;
  const title = p.name + ' — Most Computers';
  const text = p.name + ' от ' + p.brand + ' — ' + (p.price / EUR_RATE).toFixed(2) + ' €';

  if (navigator.share) {
    navigator.share({ title, text, url })
      .catch(() => {}); // user cancelled — silent
  } else {
    // Fallback: показваме popup с линка
    document.getElementById('shareUrl').textContent = url;
    document.getElementById('shareFallback').classList.add('open');
    // Auto-close след 8 сек
    clearTimeout(window._shareTimer);
    window._shareTimer = setTimeout(closeShareFallback, 8000);
  }
}

function copyShareUrl() {
  const url = document.getElementById('shareUrl').textContent;
  navigator.clipboard.writeText(url).then(() => {
    const el = document.getElementById('shareUrl');
    const orig = el.textContent;
    el.textContent = '✓ Копирано!';
    setTimeout(() => { el.textContent = orig; }, 1800);
  }).catch(() => {
    // Fallback за по-стари браузъри
    const ta = document.createElement('textarea');
    ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('✓ Линкът е копиран!');
    closeShareFallback();
  });
}

function closeShareFallback() {
  document.getElementById('shareFallback').classList.remove('open');
}

// Close share fallback on backdrop click
document.addEventListener('click', e => {
  const fb = document.getElementById('shareFallback');
  if (fb && fb.classList.contains('open') && !fb.contains(e.target)) {
    closeShareFallback();
  }
});


// ═══════════════════════════════════════
// CATEGORY META
// ═══════════════════════════════════════
const CAT_META = {
  phones:     { emoji:'📱', icon:'ic-phone',      label:'Телефони и таблети',   sub:'Смартфони, Таблети, Смарт часовници', badge:null },
  laptops:    { emoji:'💻', icon:'ic-laptop',     label:'Лаптопи',              sub:'За работа, Гейминг, Ултрабуци', badge:null },
  desktops:   { emoji:'🖥', icon:'ic-desktop',    label:'Настолни компютри',    sub:'Офис, Workstation, All-in-One', badge:null },
  gaming:     { emoji:'🎮', icon:'ic-gamepad',    label:'Гейминг',              sub:'Gaming лаптопи, PC, Мишки, Клавиатури', badge:'hot' },
  monitors:   { emoji:'🖥', icon:'ic-monitor',    label:'Монитори',             sub:'Gaming 144Hz+, 4K, OLED, UltraWide', badge:null },
  components: { emoji:'⚙️', icon:'ic-cpu',        label:'Компоненти',           sub:'CPU, GPU, RAM, SSD/HDD, Дъна', badge:null },
  peripherals:{ emoji:'🖱', icon:'ic-mouse',      label:'Периферия',            sub:'Клавиатури, Мишки, Слушалки, Камери', badge:null },
  network:    { emoji:'📡', icon:'ic-wifi',       label:'Мрежово оборудване',   sub:'Рутери, Суичове, Mesh, AP', badge:null },
  storage:    { emoji:'💾', icon:'ic-storage',    label:'Сървъри и сторидж',    sub:'NAS, Сървъри, Външни дискове', badge:null },
  accessories:{ emoji:'🎒', icon:'ic-mouse',      label:'Аксесоари',            sub:'Чанти, Кабели, Smart Home, TV', badge:null },
  new:        { emoji:'🆕', icon:'ic-star',       label:'Нови продукти',        sub:'Пресни пристигания', badge:'NEW' },
  sale:       { emoji:'%',  icon:'ic-tag',        label:'Намаления',            sub:'До -60% на избрани продукти', badge:'SALE' },
};
const HP_CAT_ORDER = ['laptops','desktops','components','peripherals','network','storage','accessories'];

// ═══════════════════════════════════════
// RENDER HOMEPAGE CATEGORY CARDS (kept for fallback)
// ═══════════════════════════════════════
function renderHpCats() {
  const grid = document.getElementById('hpCatsGrid');
  if (!grid) return;
  grid.innerHTML = HP_CAT_ORDER.map(cat => {
    const m = CAT_META[cat];
    const count = products.filter(p => p.cat === cat).length;
    return `
      <div class="hp-cat-card" onclick="openCatPage('${cat}')" role="button" tabindex="0" aria-label="Разгледай ${m.label}" onkeydown="if(event.key==='Enter'||event.key===' ')openCatPage('${cat}')">
        ${m.badge ? `<span class="hp-cat-badge">${m.badge}</span>` : ''}
        <span class="hp-cat-icon"><svg width="36" height="36" aria-hidden="true"><use href="#${m.icon}"/></svg></span>
        <div class="hp-cat-name">${m.label}</div>
        <div class="hp-cat-count">${count > 0 ? count + ' продукта' : ''}</div>
      </div>`;
  }).join('');
}

// ═══════════════════════════════════════
// RENDER HOMEPAGE SUBCATEGORY STRIP
// ═══════════════════════════════════════
const HP_SUBCATS = [
  { cat:'laptops',    id:'gaming_l',    label:'Gaming лаптопи',        icon:'🎮', trending:true  },
  { cat:'components', id:'gpu',         label:'Видеокарти',            icon:'🎴', trending:true  },
  { cat:'peripherals',id:'monitor',     label:'Монитори',              icon:'🖥', trending:true  },
  { cat:'desktops',   id:'gaming_pc',   label:'Gaming PC',             icon:'🕹'                },
  { cat:'components', id:'cpu',         label:'Процесори',             icon:'⚡'                },
  { cat:'laptops',    id:'ultrabook',   label:'Ултрабуци',             icon:'💼'                },
  { cat:'peripherals',id:'keyboard',    label:'Клавиатури',            icon:'⌨️'               },
  { cat:'network',    id:'router',      label:'Рутери',                icon:'📡'                },
  { cat:'storage',    id:'nas',         label:'NAS / Сторидж',         icon:'💾'                },
  { cat:'laptops',    id:'for_students',label:'Студентски лаптопи',    icon:'🎓'                },
  { cat:'peripherals',id:'mouse',       label:'Геймърски мишки',       icon:'🖱'                },
  { cat:'peripherals',id:'webcam',      label:'Уеб камери',            icon:'📸'                },
  { cat:'components', id:'ram',         label:'RAM памет',             icon:'🧠'                },
  { cat:'components', id:'ssd_hdd',     label:'SSD дискове',           icon:'💿'                },
  { cat:'desktops',   id:'workstation', label:'Работни станции',       icon:'🖥'                },
  { cat:'peripherals',id:'headphones',  label:'Слушалки',              icon:'🎧'                },
  { cat:'network',    id:'switch',      label:'Суичове',               icon:'🔀'                },
  { cat:'accessories',id:'hub',         label:'USB хъбове',            icon:'🔌'                },
  { cat:'components', id:'psu',         label:'Захранвания',           icon:'🔋'                },
  { cat:'laptops',    id:'for_design',  label:'За дизайн',             icon:'🎨'                },
  { cat:'peripherals',id:'printer',     label:'Принтери',              icon:'🖨'                },
  { cat:'components', id:'case_cooling',label:'Кутии и охлаждане',     icon:'❄️'               },
];

const HP_SUBCATS_VISIBLE = 10;

function renderHpSubcatsStrip() {
  const wrap = document.getElementById('hpCatsGrid');
  if (!wrap) return;
  const pills = HP_SUBCATS.map((s, i) => {
    const count = (typeof matchesSubcat === 'function')
      ? products.filter(p => p.cat === s.cat && matchesSubcat(p, s.id)).length
      : products.filter(p => p.cat === s.cat).length;
    const hidden = i >= HP_SUBCATS_VISIBLE ? ' hp-subcat-hidden' : '';
    return `<button type="button" class="hp-subcat-pill${hidden}" data-cattype="${s.cat}" onclick="openCatPage('${s.cat}');applySubcatById('${s.id}')" aria-label="${s.label}">
      ${s.trending ? '<span class="hp-subcat-trend">🔥</span>' : ''}
      <span class="hp-subcat-pill-icon">${s.icon}</span>
      <span class="hp-subcat-pill-label">${s.label}</span>
      ${count > 0 ? `<span class="hp-subcat-pill-count">${count}</span>` : ''}
    </button>`;
  }).join('');
  const remaining = HP_SUBCATS.length - HP_SUBCATS_VISIBLE;
  const moreBtn = remaining > 0
    ? `<button type="button" class="hp-subcat-more" onclick="hpShowMoreSubcats(this)">+ ${remaining} още ▾</button>`
    : '';
  wrap.innerHTML = pills + moreBtn;
}

function hpShowMoreSubcats(btn) {
  document.querySelectorAll('#hpCatsGrid .hp-subcat-hidden').forEach(el => el.classList.remove('hp-subcat-hidden'));
  btn.remove();
}

// ═══════════════════════════════════════
// CATEGORY PAGE STATE
// ═══════════════════════════════════════
let cpCat = 'all';
let cpSort = 'bestseller';
let cpPriceMin = 0, cpPriceMax = 2000;
let cpBrands = new Set();
let cpRating = 0;
let cpSaleOnly = false, cpNewOnly = false;
let cpSpecFilters = {};
let cpSubcat = 'all';

let _catPageScrollY = 0;
function openCatPage(cat) {
  _catPageScrollY = window.scrollY || document.documentElement.scrollTop;
  cpCat = cat;
  cpSort = 'bestseller';
  cpPriceMin = 0; cpPriceMax = 2000;
  cpBrands = new Set();
  cpRating = 0; cpSaleOnly = false; cpNewOnly = false;
  cpSpecFilters = {};
  cpSubcat = 'all';

  const m = CAT_META[cat] || { emoji:'🗂', label: cat, sub:'' };
  const cpEmoji = document.getElementById('cpEmoji');
  const cpTitle = document.getElementById('cpTitle');
  const cpSubtitle = document.getElementById('cpSubtitle');
  if (cpEmoji) cpEmoji.textContent = m.emoji;
  if (cpTitle) cpTitle.textContent = m.label;
  if (cpSubtitle) cpSubtitle.textContent = m.sub;

  // Build sidebar HTML
  buildCpSidebar(cat);
  // Build subcat bar
  cpRenderSubcatBar(cat);

  // Update SEO
  const _catDesc = m.label + ' — ' + m.sub + '. Купи онлайн от Most Computers.';
  setPageMeta(m.label + ' | Most Computers', _catDesc);
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', `https://mostcomputers.bg/?cat=${cat}`);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', `https://mostcomputers.bg/?cat=${cat}`);

  // Open page first so grid element is visible, then render
  document.getElementById('catPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  try{history.pushState({ catPage: cat }, '', '?cat=' + cat);}catch(e){}
  // Render after page is shown
  cpRenderGrid();
}

function closeCatPage() {
  // Close any open product page or modal first
  const pdp = document.getElementById('pdpBackdrop');
  if (pdp && pdp.classList.contains('open')) pdp.classList.remove('open');
  const modal = document.getElementById('productModalBackdrop');
  if (modal && modal.classList.contains('open')) modal.classList.remove('open');
  document.getElementById('catPage').classList.remove('open');
  document.body.style.overflow = '';
  restorePageMeta();
  // Restore Open Graph extras
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', 'Most Computers | Лаптопи, Телефони, Телевизори — От 1997 г.');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', 'Most Computers — специализиран магазин за електроника от 1997 г. Смартфони, лаптопи, телевизори от Apple, Samsung, Sony. Безплатна доставка над 100 €.');
  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.setAttribute('content', 'https://mostcomputers.bg/og-default.jpg');
  const ogImgAlt = document.querySelector('meta[property="og:image:alt"]');
  if (ogImgAlt) ogImgAlt.setAttribute('content', 'Most Computers — магазин за електроника от 1997 г.');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', 'https://mostcomputers.bg/');
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'website');
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute('content', 'Most Computers | Електроника от 1997 г.');
  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute('content', 'Лаптопи, Телефони, Телевизори, Аудио и аксесоари от Apple, Samsung, Sony. Безплатна доставка над 100 €.');
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', 'https://mostcomputers.bg/');
  try{history.pushState({}, '', location.pathname);}catch(e){}
  // Restore scroll position
  requestAnimationFrame(() => window.scrollTo(0, _catPageScrollY));
}

// Back button support
window.addEventListener('popstate', e => {
  // If we navigated back to a cat page state, keep or re-open it
  if (e.state?.catPage) {
    const pg = document.getElementById('catPage');
    if (pg && !pg.classList.contains('open')) {
      openCatPage(e.state.catPage);
    }
  } else {
    // Navigated back to homepage
    const pg = document.getElementById('catPage');
    if (pg) pg.classList.remove('open');
    const pdp = document.getElementById('pdpBackdrop');
    if (pdp) pdp.classList.remove('open');
    const modal = document.getElementById('productModalBackdrop');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ═══════════════════════════════════════
// BUILD CAT PAGE SIDEBAR
// ═══════════════════════════════════════
function buildCpSidebar(cat) {
  const sb = document.getElementById('cpSidebar');
  if (!sb) return;

  const catProds = cat === 'all' ? products : products.filter(p =>
    normalizeCat(p.cat) === cat || (cat === 'new' && p.badge === 'new') || (cat === 'sale' && p.badge === 'sale'));
  const allBrands = [...new Set(products.map(p => p.brand))].sort();
  const brands = allBrands.filter(b => catProds.some(p => p.brand === b));
  const maxPrice = Math.max(...catProds.map(p => toEur(p.price)));
  const maxPriceRound = Math.min(2000, Math.ceil(maxPrice / 100) * 100);

  // ── Price block ──
  let html = `
    <div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);padding:16px;">
      <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;">💰 Ценови диапазон</div>
      <div class="sidebar-price-slider">
        <div class="price-slider-header">
          <span style="font-size:11px;color:var(--muted);font-weight:600;">Диапазон (€):</span>
          <span class="price-slider-vals" id="cpPriceVals">0 € — ${maxPriceRound} €</span>
        </div>
        <div class="sb-slider-wrap">
          <div class="sb-slider-track"><div class="sb-slider-range" id="cpSliderRange"></div></div>
          <input type="range" class="sb-slider" id="cpPriceMinSlider" min="0" max="${maxPriceRound}" value="0" step="5" oninput="cpUpdateSlider()">
          <input type="range" class="sb-slider" id="cpPriceMaxSlider" min="0" max="${maxPriceRound}" value="${maxPriceRound}" step="5" oninput="cpUpdateSlider()">
        </div>
      </div>
    </div>`;

  // ── Spec filters ──
  const specs = CAT_SPEC_FILTERS[cat];
  if (specs && specs.length) {
    specs.forEach(spec => {
      html += `<div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);padding:16px;">
        <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;">${spec.label}</div>
        <div style="display:flex;flex-direction:column;gap:4px;">`;
      spec.values.forEach(val => {
        html += `<label class="brand-filter-item" style="display:flex;align-items:center;gap:8px;cursor:pointer;">
          <input type="checkbox" data-spec-key="${spec.key}" value="${val}" onchange="cpSpecChange(this)">
          <span style="flex:1;font-size:13px;">${val}</span>
        </label>`;
      });
      html += `</div></div>`;
    });
  }

  // ── Brands (collapsed by default) ──
  html += `<div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);">
    <div onclick="cpToggleBrands(this)" style="display:flex;align-items:center;justify-content:space-between;padding:16px;cursor:pointer;user-select:none;">
      <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin:0;">🏷 Марка</div>
      <span id="cpBrandArrow" style="color:var(--muted);font-size:13px;transition:transform .2s;">▾</span>
    </div>
    <div id="cpBrandBody" style="display:none;padding:0 16px 14px;">
      <input id="cpBrandSearch" placeholder="🔍  Търси марка..." oninput="cpFilterBrandList(this.value)" autocomplete="off" style="width:100%;padding:7px 10px;border:1px solid var(--border);border-radius:8px;font-size:12px;font-family:'Outfit',sans-serif;background:var(--bg);color:var(--text);box-sizing:border-box;margin-bottom:8px;">
      <div class="brand-filter-list" id="cpBrandList" style="max-height:220px;overflow-y:auto;">`;
  brands.forEach(b => {
    const cnt = catProds.filter(p => p.brand === b).length;
    html += `<label class="brand-filter-item">
      <input type="checkbox" value="${b}" onchange="cpBrandChange(this)">
      <span style="flex:1;">${b}</span>
      <span class="brand-count">${cnt}</span>
    </label>`;
  });
  html += `</div></div></div>`;

  // ── Rating ──
  html += `<div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);padding:16px;">
    <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;">⭐ Рейтинг</div>
    <div class="rating-filter-list">
      <label class="rating-filter-item" style="display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:13px;"><input type="radio" name="cpRating" value="0" checked onchange="cpRatingChange(this)"><span>Всички</span></label>
      <label class="rating-filter-item" style="display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:13px;"><input type="radio" name="cpRating" value="4.5" onchange="cpRatingChange(this)"><span>★★★★★ 4.5+</span></label>
      <label class="rating-filter-item" style="display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:13px;"><input type="radio" name="cpRating" value="4" onchange="cpRatingChange(this)"><span>★★★★☆ 4.0+</span></label>
      <label class="rating-filter-item" style="display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:13px;"><input type="radio" name="cpRating" value="3" onchange="cpRatingChange(this)"><span>★★★☆☆ 3.0+</span></label>
    </div>
  </div>`;

  // ── Toggles ──
  html += `<div class="sidebar-filter-block" style="border-bottom:1px solid var(--border);padding:16px;">
    <div class="sfb-title" style="font-size:12px;font-weight:800;color:var(--text2);text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;">📦 Наличност</div>
    <div class="stock-filter-list">
      <div class="stock-toggle-row">
        <span class="text-13">🔥 Само намалени</span>
        <label class="stock-toggle"><input type="checkbox" id="cpSaleToggle" onchange="cpApplyFilters()"><span class="stock-slider-toggle"></span></label>
      </div>
      <div class="stock-toggle-row" style="margin-top:8px;">
        <span class="text-13">🆕 Само нови</span>
        <label class="stock-toggle"><input type="checkbox" id="cpNewToggle" onchange="cpApplyFilters()"><span class="stock-slider-toggle"></span></label>
      </div>
    </div>
  </div>`;

  // ── Reset button ──
  html += `<div style="padding:12px 16px 16px;">
    <button type="button" onclick="cpResetFilters()" style="width:100%;background:none;border:1px solid var(--border);border-radius:8px;padding:9px;font-size:12px;font-weight:700;color:var(--text2);cursor:pointer;font-family:'Outfit',sans-serif;transition:all .18s;" onmouseover="this.style.borderColor='var(--primary)';this.style.color='var(--primary)'" onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text2)'">
      ✕ Изчисти всички филтри
    </button>
  </div>`;

  sb.innerHTML = html;
  cpUpdateSlider();
}

function cpUpdateSlider() {
  if (!document.getElementById('catPage')?.classList.contains('open')) return;
  const minEl = document.getElementById('cpPriceMinSlider');
  const maxEl = document.getElementById('cpPriceMaxSlider');
  const range = document.getElementById('cpSliderRange');
  const vals  = document.getElementById('cpPriceVals');
  if (!minEl || !maxEl) return;
  let lo = parseFloat(minEl.value), hi = parseFloat(maxEl.value);
  if (lo > hi) { [lo, hi] = [hi, lo]; }
  cpPriceMin = lo; cpPriceMax = hi;
  const max = parseFloat(maxEl.max);
  if (range) { range.style.left = (lo/max*100)+'%'; range.style.right = ((1-hi/max)*100)+'%'; }
  if (vals) vals.textContent = lo + ' € — ' + hi + ' €';
  cpRenderGrid();
}

function cpBrandChange(cb) {
  if (cb.checked) cpBrands.add(cb.value);
  else cpBrands.delete(cb.value);
  cpRenderGrid();
}

function cpRatingChange(rb) {
  cpRating = parseFloat(rb.value);
  cpRenderGrid();
}

function cpApplyFilters() {
  if (!document.getElementById('catPage')?.classList.contains('open')) return;
  cpSaleOnly = document.getElementById('cpSaleToggle')?.checked || false;
  cpNewOnly  = document.getElementById('cpNewToggle')?.checked || false;
  cpRenderGrid();
}

function cpApplySort(val) {
  cpSort = val;
  cpRenderGrid();
}

function cpSpecChange(cb) {
  const key = cb.dataset.specKey;
  const val = cb.value;
  if (!cpSpecFilters[key]) cpSpecFilters[key] = new Set();
  if (cb.checked) cpSpecFilters[key].add(val);
  else {
    cpSpecFilters[key].delete(val);
    if (!cpSpecFilters[key].size) delete cpSpecFilters[key];
  }
  cpRenderGrid();
}

function cpToggleBrands(header) {
  const body = document.getElementById('cpBrandBody');
  const arrow = document.getElementById('cpBrandArrow');
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (arrow) arrow.style.transform = open ? '' : 'rotate(180deg)';
}

function cpFilterBrandList(q) {
  const items = document.querySelectorAll('#cpBrandList .brand-filter-item');
  const s = q.toLowerCase().trim();
  items.forEach(item => {
    const name = item.querySelector('span')?.textContent.toLowerCase() || '';
    item.style.display = (!s || name.includes(s)) ? '' : 'none';
  });
}

function cpResetFilters() {
  cpPriceMin = 0;
  cpSpecFilters = {};
  document.querySelectorAll('#cpSidebar input[data-spec-key]').forEach(cb => cb.checked = false);
  const maxEl = document.getElementById('cpPriceMaxSlider');
  cpPriceMax = maxEl ? parseFloat(maxEl.max) : _cpMaxEur;
  cpBrands = new Set();
  cpRating = 0; cpSaleOnly = false; cpNewOnly = false;
  if (document.getElementById('cpPriceMinSlider')) document.getElementById('cpPriceMinSlider').value = 0;
  if (maxEl) maxEl.value = cpPriceMax;
  document.querySelectorAll('#cpBrandList input[type=checkbox]').forEach(c => c.checked = false);
  const r0 = document.querySelector('input[name="cpRating"][value="0"]');
  if (r0) r0.checked = true;
  const st = document.getElementById('cpSaleToggle'); if (st) st.checked = false;
  const nt = document.getElementById('cpNewToggle'); if (nt) nt.checked = false;
  cpSubcat = 'all';
  cpUpdateSlider();
  cpRenderGrid();
  cpRenderSubcatBar(cpCat);
}

// ═══════════════════════════════════════
// SUBCAT BAR IN CAT PAGE
// ═══════════════════════════════════════
function cpRenderSubcatBar(cat) {
  const bar = document.getElementById('cpSubcatBar');
  if (!bar) return;
  const subs = typeof SUBCATS !== 'undefined' ? SUBCATS[cat] : null;
  if (!subs || !subs.length) { bar.innerHTML = ''; bar.style.display = 'none'; return; }
  bar.style.display = '';
  bar.innerHTML =
    `<button type="button" class="subcat-pill active" onclick="cpApplySubcat('all',this)">Всички</button>` +
    subs.map(s =>
      `<button type="button" class="subcat-pill" onclick="cpApplySubcat('${s.id}',this)">${s.label}</button>`
    ).join('');
}

function cpApplySubcat(id, btn) {
  cpSubcat = id;
  document.querySelectorAll('#cpSubcatBar .subcat-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  cpRenderGrid();
}

// ═══════════════════════════════════════
// RENDER CAT PAGE GRID
// ═══════════════════════════════════════
function cpGetFiltered() {
  let list = products.slice();
  // category filter
  if (cpCat === 'new') list = list.filter(p => p.badge === 'new');
  else if (cpCat === 'sale') list = list.filter(p => p.badge === 'sale');
  else if (cpCat !== 'all') list = list.filter(p => normalizeCat(p.cat) === cpCat);
  // subcat filter
  if (cpSubcat && cpSubcat !== 'all' && typeof matchesSubcat === 'function')
    list = list.filter(p => matchesSubcat(p, cpSubcat));
  // price
  list = list.filter(p => { const e = toEur(p.price); return e >= cpPriceMin && e <= cpPriceMax; });
  // brands
  if (cpBrands.size > 0) list = list.filter(p => cpBrands.has(p.brand));
  // rating
  if (cpRating > 0) list = list.filter(p => p.rating >= cpRating);
  // toggles
  if (cpSaleOnly) list = list.filter(p => p.badge === 'sale' || p.old);
  if (cpNewOnly)  list = list.filter(p => p.badge === 'new');
  // Spec filters
  Object.entries(cpSpecFilters).forEach(([key, vals]) => {
    if (!vals || !vals.size) return;
    list = list.filter(p => {
      const sv = p.specs[key] || p.specs[Object.keys(p.specs).find(k => k.toLowerCase() === key.toLowerCase()) || ''] || '';
      if (sv) return [...vals].some(v => sv.toString().toLowerCase().includes(v.toLowerCase()));
      // Fallback: search through all spec values + name + desc (handles Cyrillic keys)
      const allText = (p.name + ' ' + (p.desc||'') + ' ' + Object.values(p.specs||{}).join(' ')).toLowerCase();
      return [...vals].some(v => allText.includes(v.toLowerCase()));
    });
  });
  // sort
  if (cpSort === 'price-asc') list.sort((a,b) => a.price - b.price);
  else if (cpSort === 'price-desc') list.sort((a,b) => b.price - a.price);
  else if (cpSort === 'rating') list.sort((a,b) => b.rating - a.rating);
  else if (cpSort === 'discount') list.sort((a,b) => (b.old ? (b.old-b.price)/b.old : 0) - (a.old ? (a.old-a.price)/a.old : 0));
  else list.sort((a,b) => (b.rv||0) - (a.rv||0)); // bestseller default
  return list;
}

function cpRenderGrid() {
  const grid = document.getElementById('cpGrid');
  const count = document.getElementById('cpResultsCount');
  if (!grid) return;
  const list = cpGetFiltered();
  if (count) count.textContent = list.length + ' продукта';
  if (list.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);">
      <div style="font-size:48px;margin-bottom:12px;">🔍</div>
      <div style="font-size:16px;font-weight:700;">Няма продукти по тези критерии</div>
      <button type="button" onclick="cpResetFilters()" style="margin-top:14px;background:var(--primary);color:#fff;border:none;padding:10px 22px;border-radius:9px;font-weight:700;font-size:13px;cursor:pointer;font-family:'Outfit',sans-serif;">Изчисти филтрите</button>
    </div>`;
    return;
  }
  grid.innerHTML = list.map(p => makeCard(p)).join('');
}

// ═══════════════════════════════════════
// MOBILE SIDEBAR DRAWER
// ═══════════════════════════════════════
function cpOpenSidebar() {
  document.getElementById('cpSidebar')?.classList.add('open');
  document.getElementById('cpSidebarOverlay')?.classList.add('open');
}
function cpCloseSidebar() {
  document.getElementById('cpSidebar')?.classList.remove('open');
  document.getElementById('cpSidebarOverlay')?.classList.remove('open');
}

// ═══════════════════════════════════════
// DYNAMIC META TAGS
// Updates <title> and <meta description> when a category / page opens.
// Call setPageMeta(title, description) — pass null to restore defaults.
// ═══════════════════════════════════════
const _defaultTitle = document.title;
const _defaultDesc  = (document.querySelector('meta[name="description"]') || {}).content || '';

function setPageMeta(title, description) {
  document.title = title || _defaultTitle;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', description || _defaultDesc);
  // OG tags
  const og = document.querySelector('meta[property="og:title"]');
  if (og) og.setAttribute('content', title || _defaultTitle);
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', description || _defaultDesc);
}

function restorePageMeta() { setPageMeta(_defaultTitle, _defaultDesc); }

// ═══════════════════════════════════════
// INIT HP CATS on DOMContentLoaded
// ═══════════════════════════════════════


// ===== BLOG / SERVICE / DELIVERY PAGES =====
const blogPosts = [
  { emoji:'💻', cat:'Ревю', title:'MacBook Pro M4 Pro — Worth It?', date:'07 Март 2026', read:'5 мин', summary:'Тествахме новия MacBook Pro M4 Pro в реални условия — видео монтаж, код и gaming. Ето резултатите.' },
  { emoji:'📱', cat:'Сравнение', title:'iPhone 16 Pro Max vs Samsung S25 Ultra', date:'03 Март 2026', read:'7 мин', summary:'Двата флагмана се срещат в директен дуел. Камера, дисплей, батерия — кой печели?' },
  { emoji:'🎧', cat:'Топ 5', title:'Най-добри безжични слушалки за 2026', date:'28 Фев 2026', read:'4 мин', summary:'Sony, Bose, Apple — кои слушалки дават най-добро качество за парите си?' },
  { emoji:'🖥', cat:'Съвети', title:'Как да изберем монитор за работа от вкъщи', date:'22 Фев 2026', read:'6 мин', summary:'4K или 1440p? IPS или OLED? Пълен наръчник за правилния избор.' },
  { emoji:'🔋', cat:'Съвети', title:'10 начина да удължим живота на батерията', date:'15 Фев 2026', read:'3 мин', summary:'Простите навици, които могат да удвоят живота на батерията на твоя телефон или лаптоп.' },
  { emoji:'🏠', cat:'Smart Home', title:'Как да изградим умен дом за под 500 лв.', date:'10 Фев 2026', read:'8 мин', summary:'Philips Hue, смарт контакти, гласов асистент — пълна система без да се разоряваме.' },
];

const reviewPosts = [
  { emoji:'⭐', title:'Sony WH-1000XM6 — 9.4/10', sub:'Най-добрите ANC слушалки на пазара' },
  { emoji:'⭐', title:'ASUS ROG Zephyrus G16 — 9.1/10', sub:'Мощ и стил в тънко тяло' },
  { emoji:'⭐', title:'Samsung S95C OLED — 9.6/10', sub:'Безкомпромисен телевизор' },
  { emoji:'⭐', title:'iPad Pro M4 — 8.8/10', sub:'Лаптоп в тялото на таблет' },
];

function openBlogPage() {
  const grid = document.getElementById('blogGrid');
  if (grid) grid.innerHTML = blogPosts.map(p => `
    <div style="background:var(--white);border-radius:14px;border:1px solid var(--border);overflow:hidden;cursor:pointer;transition:all .22s;box-shadow:var(--shadow-card);"
         onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--shadow-hover)'"
         onmouseout="this.style.transform='';this.style.boxShadow='var(--shadow-card)'"
         onclick="showToast('📰 Статията се зарежда...')">
      <div style="background:linear-gradient(135deg,var(--primary-light),var(--bg2));height:120px;display:flex;align-items:center;justify-content:center;font-size:52px;">${p.emoji}</div>
      <div style="padding:16px 18px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="background:var(--primary-light);color:var(--primary);font-size:10px;font-weight:800;padding:2px 8px;border-radius:10px;letter-spacing:.05em;">${p.cat}</span>
          <span class="text-11-muted">${p.date}</span>
          <span style="font-size:11px;color:var(--muted);margin-left:auto;">📖 ${p.read}</span>
        </div>
        <div style="font-size:15px;font-weight:800;margin-bottom:8px;line-height:1.3;">${p.title}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.6;">${p.summary}</div>
        <div style="margin-top:12px;font-size:12px;color:var(--primary);font-weight:700;">Прочети повече →</div>
      </div>
    </div>`).join('');
  const rGrid = document.getElementById('reviewsGrid');
  if (rGrid) rGrid.innerHTML = reviewPosts.map(r => `
    <div class="megamenu-cat-card" onclick="showToast('📝 Ревюто се зарежда...')" style="flex-direction:row;text-align:left;gap:14px;">
      <div style="font-size:28px;">${r.emoji}</div>
      <div><div style="font-size:13px;font-weight:800;">${r.title}</div><div style="font-size:11px;color:var(--muted);margin-top:3px;">${r.sub}</div></div>
    </div>`).join('');
  document.getElementById('blogPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Блог — Most Computers', 'Ревюта, сравнения и съвети за компютри, лаптопи и електроника от екипа на Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('Блог');
  try { history.pushState({ page: 'blog' }, '', '?page=blog'); } catch(e) {}
}
function closeBlogPage() {
  document.getElementById('blogPage').classList.remove('open');
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
function openServicePage() {
  document.getElementById('servicePage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Сервизен център — Most Computers', 'Сертифициран сервиз за лаптопи, компютри и електроника. Диагностика, ремонт и гаранционно обслужване в Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('Сервизен център');
  try { history.pushState({ page: 'service' }, '', '?page=service'); } catch(e) {}
}
function closeServicePage() {
  document.getElementById('servicePage').classList.remove('open');
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
function openDeliveryPage() {
  document.getElementById('deliveryPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Доставка и плащане — Most Computers', 'Безплатна доставка при поръчки над 100 €. Доставяме с куриер в рамките на 1-3 работни дни в цяла България.');
  if (typeof bcOnPage === 'function') bcOnPage('Доставка и плащане');
  try { history.pushState({ page: 'delivery' }, '', '?page=delivery'); } catch(e) {}
}
function closeDeliveryPage() {
  document.getElementById('deliveryPage').classList.remove('open');
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
function filterCatScroll(type) {
  if (type === 'sale') {
    document.querySelectorAll('.filter-pill').forEach(p => {
      if (p.textContent.includes('Промо') || p.textContent.includes('sale')) p.click();
    });
  }
  const featured = document.getElementById('featured');
  if (featured) featured.scrollIntoView({behavior:'smooth'});
}


// ===== CONTACTS PAGE =====
function openContactsPage() {
  document.getElementById('contactsPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  checkOpenNow();
  // Update URL
  try{history.pushState({page:'contacts'}, '', '?page=contacts');}catch(e){}
}

function closeContactsPage() {
  document.getElementById('contactsPage').classList.remove('open');
  document.body.style.overflow = '';
  try{history.pushState(null, '', window.location.pathname);}catch(e){}
}

function switchDirTab(type, btn) {
  document.querySelectorAll('.dir-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.dir-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById('dir-' + type);
  if (el) el.classList.add('active');
}

function copyAddress() {
  const addr = 'бул. Шипченски проход бл.240, ж.к. Гео Милев, 1111 София';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(addr).then(() => showToast('📋 Адресът е копиран!')).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = addr; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('📋 Адресът е копиран!');
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = addr; document.body.appendChild(ta);
    ta.select(); document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('📋 Адресът е копиран!');
  }
}

function copyPlusCode() {
  const code = 'M9H5+XJ Sofia';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(() => showToast('📍 Plus Code е копиран!')).catch(() => showToast('Plus Code: M9H5+XJ Sofia'));
  } else {
    showToast('Plus Code: M9H5+XJ Sofia');
  }
}

function checkOpenNow() {
  const badge = document.getElementById('openNowBadge');
  if (!badge) return;
  const now = new Date();
  const day  = now.getDay(); // 0=Sun, 1=Mon, 6=Sat
  const h    = now.getHours();
  const m    = now.getMinutes();
  const time = h * 60 + m;

  let isOpen = false;
  // Mon-Fri 09:30-18:30
  if (day >= 1 && day <= 5 && time >= 570 && time < 1110) isOpen = true;
  // Sat 10:00-14:00
  if (day === 6 && time >= 600 && time < 840) isOpen = true;

  // Highlight today in table
  const rows = document.querySelectorAll('#hoursTable tr');
  const dayMap = [6, 0, 1, 2, 3, 4, 5]; // table row index for each JS day
  rows.forEach(r => r.style.fontWeight = '');
  if (rows[dayMap[day]]) {
    rows[dayMap[day]].style.background = 'var(--primary-light)';
    rows[dayMap[day]].style.borderRadius = '6px';
  }

  badge.innerHTML = isOpen
    ? '<span style="display:inline-flex;align-items:center;gap:6px;background:#e8f9ed;color:#1a7f37;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:800;"><span style="width:8px;height:8px;border-radius:50%;background:#34c759;display:inline-block;"></span> Отворено сега</span>'
    : '<span style="display:inline-flex;align-items:center;gap:6px;background:#fef2f2;color:#dc2626;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:800;"><span style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block;"></span> Затворено</span>';
}



// ===== REVIEW FORM =====
let rfRating = 0;
function rfSetStar(v) {
  rfRating = v;
  const labels = ['', 'Лошо', 'Незадоволително', 'Добро', 'Много добро', 'Отлично'];
  document.querySelectorAll('.rf-star').forEach(s => {
    s.classList.toggle('active', parseInt(s.dataset.v) <= v);
    s.style.color = parseInt(s.dataset.v) <= v ? '#fbbf24' : '';
  });
  const lbl = document.getElementById('rfStarLabel');
  if (lbl) lbl.textContent = labels[v] || '';
}
function submitPdpReview() {
  const name = document.getElementById('rfName')?.value.trim();
  const text = document.getElementById('rfText')?.value.trim();
  if (!name) { showToast('⚠️ Въведи своето име'); return; }
  if (!rfRating) { showToast('⚠️ Избери рейтинг'); return; }
  if (!text || text.length < 10) { showToast('⚠️ Ревюто трябва да е поне 10 символа'); return; }

  const now = new Date();
  const dateStr = now.toLocaleDateString('bg-BG', { day:'2-digit', month:'2-digit', year:'numeric' });
  const newRev = { name, stars: rfRating, text, date: dateStr, pending: true, productId: pdpProductId };

  // Persist to localStorage — pending until admin approves
  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    if (!saved[pdpProductId]) saved[pdpProductId] = [];
    saved[pdpProductId].unshift(newRev);
    localStorage.setItem('mc_reviews', JSON.stringify(saved));
  } catch(e) {}

  // Reset form
  document.getElementById('rfName').value = '';
  document.getElementById('rfText').value = '';
  rfRating = 0;
  document.querySelectorAll('.rf-star').forEach(s => { s.classList.remove('active'); s.style.color = ''; });
  const lbl = document.getElementById('rfStarLabel');
  if (lbl) lbl.textContent = 'Избери рейтинг';
  showToast('✅ Ревюто е изпратено и ще бъде публикувано след преглед!');
}


// ===== ABOUT PAGE =====
function openAboutPage() {
  const page = document.getElementById('aboutPage');
  if (!page) return;
  page.style.display = 'flex';
  page.style.flexDirection = 'column';
  requestAnimationFrame(() => page.classList.add('open'));
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('За нас — Most Computers', 'Most Computers — над 27 години опит в продажбата на компютри и електроника. Специализиран магазин в центъра на София.');
  if (typeof bcOnPage === 'function') bcOnPage('За нас');
  try{history.pushState({ page: 'about' }, '', '?page=about');}catch(e){}
}
function closeAboutPage() {
  const page = document.getElementById('aboutPage');
  if (!page) return;
  page.classList.remove('open');
  setTimeout(() => { page.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try{history.pushState(null, '', window.location.pathname);}catch(e){}
}

// renderHpSubcatsStrip and renderRecentlyDiscounted are called
// directly in main.js — no DOMContentLoaded wrapper needed here
// (deferred scripts run before DOMContentLoaded, so the handler
//  would cause a redundant second render on every page load).

// migrate any remaining inline onclick attributes into data-action
function migrateInlineClickHandlers() {
  document.querySelectorAll('[onclick]').forEach(el => {
    const code = el.getAttribute('onclick');
    if (!code) return;
    if (code.includes('this.')) return; // skip — requires DOM context
    // remove return false and trim
    let action = code.replace(/return\s+false;?/g, '').trim();
    // strip trailing parentheses for simple calls
    action = action.replace(/\(\)\s*;?$/, '');
    el.dataset.action = action;
    el.removeAttribute('onclick');
  });

  // Remove redundant onkeydown handlers that only simulate click for keyboard users
  document.querySelectorAll('[onkeydown]').forEach(el => {
    const code = el.getAttribute('onkeydown');
    if (!code) return;
    // if the handler just triggers click on Enter/Space (handled by our keyboard handler), drop it
    if (/this\.click\(\)/.test(code)) {
      el.removeAttribute('onkeydown');
    }
  });
}

// parse and execute a data-action string
function runActionString(str, event, button) {
  if (!str) return;
  str.split(';').forEach(cmd => {
    cmd = cmd.trim();
    if (!cmd) return;
    // Handle functionName('arg') / functionName(123) call syntax
    const callMatch = cmd.match(/^(\w+)\((.*)\)$/);
    if (callMatch) {
      const fn = window[callMatch[1]];
      if (typeof fn === 'function') {
        const argsStr = callMatch[2].trim();
        const args = argsStr
          ? argsStr.split(',').map(a => {
              const wasQuoted = /^['"`]/.test(a.trim());
              a = a.trim().replace(/^['"`]|['"`]$/g, '');
              if (!wasQuoted) {
                if (a === 'this' || a === 'self') return button;
                if (a === 'event') return event;
                if (!isNaN(a) && a !== '') return Number(a);
              }
              return a;
            })
          : [];
        fn.apply(null, args);
      }
      return;
    }
    // Colon syntax: functionName:arg1,arg2
    const [fnName, ...rawArgs] = cmd.split(':');
    const fn = window[fnName];
    if (typeof fn === 'function') {
      let args = [];
      if (rawArgs.length) {
        args = rawArgs.join(':').split(',').map(a => {
          a = a.trim();
          if (a === 'event') return event;
          if (a === 'this' || a === 'self') return button;
          if (a === '') return '';
          if (!isNaN(a)) return Number(a);
          return a;
        });
      }
      fn.apply(null, args);
    }
  });
}

let _dataActionsInited = false;
function initDataActions() {
  if (_dataActionsInited) return;
  _dataActionsInited = true;

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    runActionString(button.dataset.action, event, button);
  });

  // Keyboard support for focusable action elements
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const button = event.target.closest('[data-action]');
    if (!button) return;
    event.preventDefault();
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    button.dispatchEvent(clickEvent);
  });

  migrateInlineClickHandlers();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    migrateInlineClickHandlers,
    runActionString,
    initDataActions,
  };
}

// ===== ERROR BOUNDARY =====
function _isNetworkErr(val) {
  const s = val ? String(val.message || val) : '';
  return /fetch|network|NetworkError|Failed to fetch|Load failed|ERR_/i.test(s);
}
window.onerror = function(msg, src, line, col, err) {
  console.error('[MC Error]', msg, src, line, col, err);
  if (typeof showToast === 'function' && !_isNetworkErr(msg) && !_isNetworkErr(err)) {
    showToast('⚠️ Нещо се обърка. Моля опресни страницата.');
  }
  return true;
};
window.addEventListener('unhandledrejection', function(e) {
  console.error('[MC Unhandled Promise]', e.reason);
  if (typeof showToast === 'function' && !_isNetworkErr(e.reason)) {
    showToast('⚠️ Нещо се обърка. Моля опресни страницата.');
  }
});

// ===== INIT ALL =====
initCookies();
initBackToTop();
updateWishlistUI();

// renderGrids called in DOMContentLoaded
function openContactPage() { openContactsPage(); }

function closeContactPage() {
  document.getElementById('contactsPage').classList.remove('open');
  document.body.style.overflow = '';
}
function submitContactForm() {
  const name    = document.getElementById('cfName');
  const email   = document.getElementById('cfEmail');
  const subject = document.getElementById('cfSubject');
  const message = document.getElementById('cfMessage');
  const consent = document.getElementById('cfConsent');
  let valid = true;
  [name, email, subject, message].forEach(el => {
    if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    else el.classList.remove('error');
  });
  if (!email.value.includes('@')) { email.classList.add('error'); valid = false; }
  if (!consent.checked) { showToast('Трябва да се съгласиш с условията!'); valid = false; }
  if (!valid) { showToast('Моля попълни всички задължителни полета!'); return; }
  document.getElementById('cfFormWrap').style.display = 'none';
  document.getElementById('cfSuccess').classList.add('show');
  showToast('✅ Запитването е изпратено успешно!');
}


// ===== CATEGORY NORMALIZATION =====
// Source data in data.js already uses canonical cat values (migrated 2026-04-15).
// This map remains as a safety net for products loaded from localStorage or external feeds.
const _CAT_MIGRATE = {
  laptop:'laptops', desktop:'desktops', monitor:'monitors',
  mobile:'phones', tablet:'phones', tv:'accessories',
  audio:'peripherals', camera:'peripherals', print:'peripherals',
  smart:'accessories', acc:'accessories',
};
products.forEach(p => { if (_CAT_MIGRATE[p.cat]) p.cat = _CAT_MIGRATE[p.cat]; });

// Gaming laptops → laptops (not desktops) — safety for mislabeled imports
products.forEach(p => {
  if (p.cat === 'desktops') {
    const n = (p.name + ' ' + (p.desc || '')).toLowerCase();
    if (n.includes('laptop') || n.includes('notebook') || n.includes('лаптоп') || n.includes('macbook')) p.cat = 'laptops';
  }
});

// Speakers/soundbars → accessories (headphones stay in peripherals)
products.forEach(p => {
  if (p.cat === 'peripherals') {
    const n = (p.name + ' ' + (p.desc || '')).toLowerCase();
    if (n.includes('тонколон') || n.includes('speaker') || n.includes('soundbar')) p.cat = 'accessories';
  }
});

// ===== NORMALIZE BADGE / PCT FOR RESTORED PRODUCTS =====
// Products restored from localStorage (XML feed) have old:null, pct:0, badge:''.
// Restore old/pct/badge from the static snapshot (_staticProductsMap from data.js).
products.forEach(p => {
  const orig = _staticProductsMap[p.id];
  if (orig) {
    if (!p.old && orig.old)        p.old   = orig.old;
    if (!(p.pct > 0) && orig.pct > 0) p.pct = orig.pct;
    if (!p.badge && orig.badge)    p.badge = orig.badge;
  }
  // Fallback: compute pct/badge from old vs price if still missing
  if (p.old && p.old > p.price && !(p.pct > 0)) {
    p.pct = Math.round((1 - p.price / p.old) * 100);
  }
  if (!p.badge && p.pct > 0) {
    p.badge = 'sale';
  }
});

// All scripts are deferred — DOM is ready, call directly
initDataActions();
initSidebarFilters();
renderGrids();
loadCart();
renderHpSubcatsStrip();
renderRecentlyDiscounted();
renderRecentlyViewed();
initSectionAnimations();
initScrollAnimations();

// 404 popular products grid
(function() {
  const g = document.getElementById('err404Grid');
  if (!g) return;
  const top4 = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  g.innerHTML = top4.map(p => `<div class="err-popular-card" onclick="close404();openProductModal(${p.id})"><div class="err-popular-emoji">${escHtml(p.emoji||'')}</div><div><div class="err-popular-name">${escHtml((p.name||'').substring(0,22))}…</div><div class="err-popular-price">${p.price} лв.</div></div></div>`).join('');
})();


// ===== ANALYTICS — Most Computers =====
// GA4 + Meta Pixel + dev console
// Load order: after main.js (last) so all functions are defined
// ======================================

(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────────────────────────
  const IS_DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  const GA4_ID = 'G-XXXXXXXXXX'; // замени с реален Measurement ID от GA4
  const FB_PIXEL = ''; // опционален Meta Pixel ID

  // ── Core trackEvent ──────────────────────────────────────────────────────────
  function trackEvent(eventName, data) {
    const payload = Object.assign({ timestamp: Date.now() }, data || {});

    // Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', eventName, payload);
    }

    // Meta Pixel
    if (typeof fbq === 'function' && FB_PIXEL) {
      fbq('trackCustom', eventName, payload);
    }

    // Dev console
    if (IS_DEV) {
      console.log('%c[Analytics]%c ' + eventName, 'color:#bd1105;font-weight:700', 'color:inherit', payload);
    }

    // LocalStorage event log (capped at 200 entries — for debugging & simple analytics)
    try {
      const log = JSON.parse(localStorage.getItem('mc_analytics_log') || '[]');
      log.unshift({ event: eventName, data: payload });
      if (log.length > 200) log.length = 200;
      localStorage.setItem('mc_analytics_log', JSON.stringify(log));
    } catch (_) {}
  }

  // ── page_view ────────────────────────────────────────────────────────────────
  function trackPageView() {
    trackEvent('page_view', {
      page_title: document.title,
      page_location: location.href,
      referrer: document.referrer || '(direct)'
    });
  }

  // ── view_product ─────────────────────────────────────────────────────────────
  function hookOpenProductPage() {
    const _orig = window.openProductPage;
    if (typeof _orig !== 'function') return;
    window.openProductPage = function (id) {
      const result = _orig.apply(this, arguments);
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      if (p) {
        trackEvent('view_product', {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          brand: p.brand || '',
          currency: 'BGN'
        });
        // GA4 standard ecommerce
        if (typeof gtag === 'function') {
          gtag('event', 'view_item', {
            currency: 'BGN',
            value: p.price,
            items: [{ item_id: String(p.id), item_name: p.name, item_category: p.cat, price: p.price }]
          });
        }
      }
      return result;
    };
  }

  // ── add_to_cart ───────────────────────────────────────────────────────────────
  function hookAddToCart() {
    const _orig = window.addToCart;
    if (typeof _orig !== 'function') return;
    window.addToCart = function (id) {
      const result = _orig.apply(this, arguments);
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      if (p) {
        trackEvent('add_to_cart', {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          brand: p.brand || '',
          currency: 'BGN'
        });
        if (typeof gtag === 'function') {
          gtag('event', 'add_to_cart', {
            currency: 'BGN',
            value: p.price,
            items: [{ item_id: String(p.id), item_name: p.name, item_category: p.cat, price: p.price, quantity: 1 }]
          });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'AddToCart', { content_ids: [p.id], content_name: p.name, value: p.price, currency: 'BGN' });
        }
      }
      return result;
    };
  }

  // ── remove_from_cart ─────────────────────────────────────────────────────────
  function hookRemoveFromCart() {
    const _orig = window.removeFromCart;
    if (typeof _orig !== 'function') return;
    window.removeFromCart = function (id) {
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      const result = _orig.apply(this, arguments);
      if (p) {
        trackEvent('remove_from_cart', {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          currency: 'BGN'
        });
        if (typeof gtag === 'function') {
          gtag('event', 'remove_from_cart', {
            currency: 'BGN',
            value: p.price,
            items: [{ item_id: String(p.id), item_name: p.name, item_category: p.cat, price: p.price }]
          });
        }
      }
      return result;
    };
  }

  // ── add_to_wishlist / remove_from_wishlist ────────────────────────────────────
  function hookToggleWishlist() {
    const _orig = window.toggleWishlist;
    if (typeof _orig !== 'function') return;
    window.toggleWishlist = function (id, e) {
      const wishlistBefore = (typeof wishlist !== 'undefined') ? wishlist.slice() : [];
      const result = _orig.apply(this, arguments);
      const p = (typeof products !== 'undefined') ? products.find(x => x.id === id) : null;
      if (p) {
        const wasInWishlist = wishlistBefore.indexOf(id) !== -1;
        const eventName = wasInWishlist ? 'remove_from_wishlist' : 'add_to_wishlist';
        trackEvent(eventName, {
          product_id: p.id,
          product_name: p.name,
          price: p.price,
          category: p.cat,
          currency: 'BGN'
        });
        if (!wasInWishlist && typeof fbq === 'function') {
          fbq('track', 'AddToWishlist', { content_ids: [p.id], content_name: p.name, value: p.price, currency: 'BGN' });
        }
      }
      return result;
    };
  }

  // ── begin_checkout ───────────────────────────────────────────────────────────
  function hookToggleCart() {
    const _orig = window.toggleCart;
    if (typeof _orig !== 'function') return;
    window.toggleCart = function () {
      const result = _orig.apply(this, arguments);
      const cartEl = document.getElementById('cartPanel');
      const isOpening = cartEl && cartEl.classList.contains('open');
      if (isOpening && typeof cart !== 'undefined' && cart.length > 0) {
        const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
        trackEvent('view_cart', {
          cart_total: Math.round(total * 100) / 100,
          item_count: cart.reduce((s, x) => s + x.qty, 0),
          currency: 'BGN'
        });
      }
      return result;
    };
  }

  function hookShowCheckoutStep() {
    const _orig = window.showCheckoutStep;
    if (typeof _orig !== 'function') return;
    window.showCheckoutStep = function (n) {
      const result = _orig.apply(this, arguments);
      if (n === 1 && typeof cart !== 'undefined') {
        const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
        const items = cart.map(x => ({ item_id: String(x.id), item_name: x.name, price: x.price, quantity: x.qty }));
        trackEvent('begin_checkout', {
          cart_total: Math.round(total * 100) / 100,
          item_count: cart.reduce((s, x) => s + x.qty, 0),
          currency: 'BGN'
        });
        if (typeof gtag === 'function') {
          gtag('event', 'begin_checkout', { currency: 'BGN', value: total, items });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'InitiateCheckout', { value: total, currency: 'BGN', num_items: items.length });
        }
      }
      return result;
    };
  }

  // ── apply_promo ──────────────────────────────────────────────────────────────
  function hookApplyPromo() {
    const _orig = window.applyPromo;
    if (typeof _orig !== 'function') return;
    window.applyPromo = function (codeArg) {
      const codeBefore = typeof promoApplied !== 'undefined' ? promoApplied : false;
      const result = _orig.apply(this, arguments);
      const codeAfter = typeof promoApplied !== 'undefined' ? promoApplied : false;
      const code = (codeArg || '').trim().toUpperCase();
      if (!codeBefore && codeAfter) {
        const total = (typeof cart !== 'undefined') ? cart.reduce((s, x) => s + x.price * x.qty, 0) : 0;
        trackEvent('apply_promo', {
          promo_code: code,
          discount_pct: 10,
          discount_amount: Math.round(total * 0.10 * 100) / 100,
          currency: 'BGN'
        });
      } else if (!codeAfter && code) {
        trackEvent('promo_failed', { promo_code: code });
      }
      return result;
    };
  }

  // ── purchase ─────────────────────────────────────────────────────────────────
  function hookSubmitOrder() {
    const _orig = window.submitOrder;
    if (typeof _orig !== 'function') return;
    window.submitOrder = function () {
      // Snapshot cart before submit clears it
      const cartSnapshot = (typeof cart !== 'undefined') ? cart.map(x => ({
        item_id: String(x.id),
        item_name: x.name,
        item_category: x.cat,
        price: x.price,
        quantity: x.qty
      })) : [];
      const subtotal = cartSnapshot.reduce((s, x) => s + x.price * x.quantity, 0);
      const promo = (typeof promoApplied !== 'undefined' && promoApplied) ? subtotal * 0.10 : 0;
      const delivery = (typeof ckDeliveryCosts !== 'undefined' && typeof ckDeliveryIdx !== 'undefined')
        ? ckDeliveryCosts[ckDeliveryIdx] : 0;
      const total = Math.round((subtotal - promo + delivery) * 100) / 100;

      const result = _orig.apply(this, arguments);

      // Fire after a tick (submitOrder has a setTimeout internally)
      setTimeout(function () {
        const orderNumEl = document.getElementById('tyOrderNum');
        const orderNum = orderNumEl ? orderNumEl.textContent : 'unknown';
        trackEvent('purchase', {
          transaction_id: orderNum,
          value: total,
          subtotal: Math.round(subtotal * 100) / 100,
          discount: Math.round(promo * 100) / 100,
          shipping: delivery,
          currency: 'BGN',
          payment_method: (typeof ckPaymentType !== 'undefined') ? ckPaymentType : 'unknown',
          item_count: cartSnapshot.reduce((s, x) => s + x.quantity, 0)
        });
        if (typeof gtag === 'function') {
          gtag('event', 'purchase', {
            transaction_id: orderNum,
            currency: 'BGN',
            value: total,
            shipping: delivery,
            coupon: (typeof promoApplied !== 'undefined' && promoApplied) ? 'MOSTCOMP10' : '',
            items: cartSnapshot
          });
        }
        if (typeof fbq === 'function') {
          fbq('track', 'Purchase', { value: total, currency: 'BGN', num_items: cartSnapshot.length });
        }
      }, 600);

      return result;
    };
  }

  // ── search ───────────────────────────────────────────────────────────────────
  function hookSearch() {
    const _origFull = window.doFullSearch;
    if (typeof _origFull === 'function') {
      window.doFullSearch = function () {
        const q = (document.getElementById('searchInput') || {}).value || '';
        const result = _origFull.apply(this, arguments);
        if (q.trim()) {
          // Results count available after render — approximate with DOM query
          setTimeout(function () {
            const count = document.querySelectorAll('.srp-card').length;
            trackEvent('search', {
              search_term: q.trim(),
              results_count: count
            });
            if (typeof gtag === 'function') {
              gtag('event', 'search', { search_term: q.trim() });
            }
            // Track zero-result searches separately
            if (count === 0) {
              trackEvent('search_no_results', { search_term: q.trim() });
            }
          }, 200);
        }
        return result;
      };
    }
  }

  // ── view_category ─────────────────────────────────────────────────────────────
  function hookFilterCat() {
    const _orig = window.filterCat;
    if (typeof _orig !== 'function') return;
    window.filterCat = function (cat) {
      const result = _orig.apply(this, arguments);
      const label = (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[cat]) ? CAT_LABELS[cat] : cat;
      trackEvent('view_category', {
        category: cat,
        category_label: label
      });
      return result;
    };
  }

  // ── Init: wire up all hooks ───────────────────────────────────────────────────
  function init() {
    hookOpenProductPage();
    hookAddToCart();
    hookRemoveFromCart();
    hookToggleWishlist();
    hookToggleCart();
    hookShowCheckoutStep();
    hookApplyPromo();
    hookSubmitOrder();
    hookSearch();
    hookFilterCat();
    trackPageView();

    if (IS_DEV) {
      console.log('%c[Analytics] Initialized — hooks active', 'color:#34c759;font-weight:700');
    }
  }

  // Run after DOM + app.js are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOMContentLoaded already fired — defer one tick so app.js globals are set
    setTimeout(init, 0);
  }

  // ── Public API ───────────────────────────────────────────────────────────────
  window.mcTrack = trackEvent;
  window.mcAnalyticsLog = function () {
    try { return JSON.parse(localStorage.getItem('mc_analytics_log') || '[]'); } catch (_) { return []; }
  };
})();
