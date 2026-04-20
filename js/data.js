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
