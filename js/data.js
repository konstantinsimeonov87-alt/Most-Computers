// ===== DATA =====
const products = [
  { id:1,  sku:'MC-SONY-WH1000XM6', ean:'4548736132511', img:'https://www.sony.com/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=600', name:'Sony WH-1000XM6 Безжични слушалки', brand:'Sony',    cat:'audio',   emoji:'🎧', price:449,  old:549,  badge:'sale', pct:18, rating:4.9, rv:124,
    specs:{Тип:'Over-ear', Тип_аудио:'Over-ear', Връзка:'Bluetooth 5.3', Батерия:'30 часа', ANC:'Да', ANC_filter:'С ANC', Тегло:'254g', Гаранция:'2 год.', Warranty:'24 месеца'},
    desc:'Sony WH-1000XM6 са флагманските шумопотискащи слушалки на Sony с индустриално водещо качество на звука. Разполагат с процесор QN3 за адаптивно шумопотискане, LDAC кодек за Hi-Res аудио и 30 часа живот на батерията.',
    reviews:[{name:'Петър Г.',stars:5,date:'02.03.2025',text:'Невероятно качество на звука! Шумопотискането е на друго ниво спрямо конкурентите.'},{name:'Мария С.',stars:5,date:'15.02.2025',text:'Носят се много удобно дори при дълги пътувания. Препоръчвам!'}] },
  { id:2,  sku:'MC-APPL-IP16PM-512', ean:'0195949769702', img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-select?wid=600&hei=600&fmt=png-alpha',  name:'iPhone 16 Pro Max 512GB Titanium',    brand:'Apple',   cat:'mobile',  emoji:'📱', price:2599, old:null, badge:'new',  pct:0,  rating:4.8, rv:89,
    specs:{Дисплей:'6.9" OLED', Чип:'A18 Pro', Камера:'48MP + 12MP', Батерия:'4685 mAh', RAM:'8 GB', RAM_raw:'8GB', Памет:'512 GB', Памет_raw:'512GB', ОС:'iOS', Мрежа:'5G', Warranty:'12 месеца'},
    desc:'iPhone 16 Pro Max с чип A18 Pro задава нов стандарт за производителност. Камерна система с 48MP основен сензор, оптична стабилизация и нови функции с Apple Intelligence.',
    reviews:[{name:'Георги Т.',stars:5,date:'20.03.2025',text:'Най-добрият телефон, който съм имал!'},{name:'Иванка П.',stars:4,date:'10.03.2025',text:'Отличен телефон, малко скъп, но си заслужава!'}] },
  { id:3,  sku:'MC-SAMS-S95C-55', ean:'8806094914948', img:'https://images.samsung.com/is/image/samsung/p6pim/levant/qa55s95cakxfe/gallery/levant-oled-s95c-qa55s95cakxfe-thumb-535683452?$684_547_PNG$',  name:'Samsung 55" OLED 4K S95C Smart TV',   brand:'Samsung', cat:'tv',      emoji:'📺', price:1799, old:2199, badge:'sale', pct:18, rating:4.7, rv:56,
    specs:{Размер:'55"', Диагонал_ТВ:'55"', Панел:'QD-OLED', Резолюция:'4K UHD', HDR:'HDR10+', Smart:'Tizen OS', HDMI:'4x HDMI 2.1', Refresh:'120Hz', Warranty:'24 месеца'},
    desc:'Samsung S95C с QD-OLED панел съчетава перфектния контраст на OLED с яркостта на квантовите точки.',
    reviews:[{name:'Стефан М.',stars:5,date:'05.03.2025',text:'Картината е зашеметяваща!'},{name:'Деница В.',stars:4,date:'18.02.2025',text:'Много доволна от покупката.'}] },
  { id:4,  sku:'MC-SONY-A7V', ean:'4548736162617', img:'https://www.bhphotovideo.com/images/images2500x2500/sony_ilce_7m5_b_alpha_a7_iv_mirrorless_1664946.jpg',  name:'Sony Alpha 7 V Mirrorless Camera',    brand:'Sony',    cat:'camera',  emoji:'📷', price:3499, old:null, badge:'hot',  pct:0,  rating:4.9, rv:32,
    specs:{Сензор:'50MP Full-Frame', Тип_камера:'Mirrorless', Стабилизация:'8-axis IBIS', AF:'AI следене', Видео:'4K 120fps', Буфер:'1000+ кадра', Тегло:'514g', Warranty:'24 месеца'},
    desc:'Sony Alpha 7 V е революционна пълнокадрова камера с 50MP BSI сензор и AI-базирана система за автофокус.',
    reviews:[{name:'Николай Ф.',stars:5,date:'01.03.2025',text:'Невероятен автофокус! Следи перфектно движещи се обекти.'}] },
  { id:5,  sku:'MC-APPL-IPADPRO13', ean:'0195949872649', img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-wifi-spacegray-202405?wid=600&hei=600&fmt=png-alpha',  name:'iPad Pro 13" M4 OLED 256GB WiFi',     brand:'Apple',   cat:'tablet',  emoji:'📟', price:1649, old:1999, badge:'sale', pct:17, rating:4.8, rv:78,
    specs:{Дисплей:'13" Ultra Retina XDR', Диагонал:'13"', Чип:'M4', Памет:'256 GB', Памет_raw:'256GB', RAM:'8 GB', RAM_raw:'8GB', Камера:'12MP', Батерия:'10 часа', ОС:'iPadOS', Мрежа:'WiFi', Warranty:'12 месеца'},
    desc:'iPad Pro с M4 чип и нов Ultra Retina XDR OLED дисплей е най-мощният iPad досега.',
    reviews:[{name:'Борис Н.',stars:5,date:'22.02.2025',text:'Дисплеят е просто невероятен. Идеален за дизайнери.'}] },
  { id:6,  sku:'MC-XIAO-14TPRO-512', ean:'6941812764992', img:'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-14t-pro/M/daf3d95a9a0fd8d90e6d4c0a3b6afb6e.png',  name:'Xiaomi 14T Pro 512GB черен',          brand:'Xiaomi',  cat:'mobile',  emoji:'📱', price:999,  old:1199, badge:'sale', pct:17, rating:4.6, rv:145,
    specs:{Дисплей:'6.67" AMOLED', Чип:'Dimensity 9300+', Камера:'Leica 50MP', Батерия:'5000 mAh', Зареждане:'120W', RAM:'12 GB', RAM_raw:'12GB', Памет:'512 GB', Памет_raw:'512GB', ОС:'Android', Мрежа:'5G', Warranty:'24 месеца'},
    desc:'Xiaomi 14T Pro с камерна система Leica предлага флагмански характеристики на достъпна цена. Зарежда от 0 до 100% само за 19 минути.',
    reviews:[{name:'Тодор С.',stars:5,date:'12.03.2025',text:'Страхотно съотношение цена/качество!'},{name:'Анна М.',stars:4,date:'03.03.2025',text:'Много добра камера за цената.'}] },
  { id:7,  sku:'MC-BOSE-QCULT', ean:'017817845014', img:'https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc_ultra_headphones/product_silo_images/QCUltraHeadphones_White_EC_Hero.png/jcr:content/renditions/cq5dam.web.600.600.png',  name:'Bose QuietComfort Ultra Headphones',  brand:'Bose',    cat:'audio',   emoji:'🎧', price:599,  old:749,  badge:'sale', pct:20, rating:4.7, rv:203,
    specs:{Тип:'Over-ear', Тип_аудио:'Over-ear', Връзка:'Bluetooth 5.3', Батерия:'24 часа', ANC:'CustomTune', ANC_filter:'С ANC', Тегло:'251g', Гаранция:'2 год.', Warranty:'24 месеца'},
    desc:'Bose QC Ultra с революционната технология Immersive Audio създава пространствен звук около теб.',
    reviews:[{name:'Красимир Д.',stars:5,date:'08.03.2025',text:'Пространственото аудио е магия! Незаменими за пътувания.'}] },
  { id:8,  sku:'MC-ASUS-ROGZ16-4080', ean:'4711387491928', img:'https://dlcdnwebimgs.asus.com/gain/AF6D21FC-3FA8-4068-8A93-5A6B6F47AEA1/w717/h525',  name:'ASUS ROG Zephyrus G16 RTX 4080',      brand:'ASUS',    cat:'gaming',  emoji:'💻', price:3799, old:4299, badge:'sale', pct:12, rating:4.9, rv:54,
    specs:{Процесор:'AMD Ryzen 9 8945HS', CPU:'AMD Ryzen 9', RAM:'32 GB', RAM_raw:'32GB', Диск:'2 TB NVMe', SSD:'2TB', GPU:'RTX 4080 12GB', Видеокарта:'NVIDIA', Дисплей:'16" QHD 240Hz', Диагонал:'16"', ОС:'Windows 11', Батерия:'90Wh', Warranty:'24 месеца'},
    desc:'ASUS ROG Zephyrus G16 е ултра-тънък гейминг лаптоп с RTX 4080. 240Hz QHD дисплей и MUX Switch за максимална производителност.',
    reviews:[{name:'Владимир К.',stars:5,date:'15.03.2025',text:'Играе всичко на ultra настройки!'}] },
  { id:9,  sku:'MC-CANO-MF466DW', ean:'4549292198614', img:'https://www.bhphotovideo.com/images/images500x500/canon_5803c002_imageclass_mf462dw_wireless_1686582786_1745673.jpg',  name:'Canon ImageCLASS Laser Printer MF',   brand:'Canon',   cat:'print',   emoji:'🖨', price:289,  old:359,  badge:'new',  pct:0,  rating:4.5, rv:88,
    specs:{Тип:'Лазерен', Функции:'Принт/Скан/Копир', Скорост:'36 стр./мин', WiFi:'Да', ADF:'50 листа', Тонер:'2000 стр.'},
    desc:'Canon ImageCLASS е компактен безжичен лазерен принтер с автоматичен двустранен печат.',
    reviews:[{name:'Елена Т.',stars:4,date:'20.03.2025',text:'Бърз и тих принтер. Идеален за домашен офис.'}] },
  { id:10,  sku:'MC-LOGI-MX3S', ean:'5099206103627', img:'https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/mx-master-3s/mx-master-3s-top-graphite.png', name:'Logitech MX Master 3S Мишка',         brand:'Logitech',cat:'acc',     emoji:'🖱', price:159,  old:189,  badge:'sale', pct:16, rating:4.8, rv:312,
    specs:{Сензор:'8000 DPI', Връзка:'Bluetooth / USB', Батерия:'70 дни', Бутони:'7', Скрол:'MagSpeed', Тегло:'141g'},
    desc:'Logitech MX Master 3S е перфектната мишка за продуктивност с безшумни бутони и MagSpeed електромагнитен скрол.',
    reviews:[{name:'Симеон Г.',stars:5,date:'25.02.2025',text:'Най-добрата мишка за работа!'},{name:'Цветелина Й.',stars:5,date:'14.02.2025',text:'Много удобна и точна.'}] },
  { id:11,  sku:'MC-DELL-XPS15-I9', ean:'884116437635', img:'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/gray/notebook-xps-15-9530-gray-gallery-3.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402', name:'Dell XPS 15 i9 / RTX 4070 32GB',      brand:'Dell',    cat:'laptop',  emoji:'💻', price:3299, old:null, badge:'hot',  pct:0,  rating:4.8, rv:41,
    specs:{Процесор:'Intel Core i9-14900H', CPU:'Intel Core i9', RAM:'32 GB', RAM_raw:'32GB', Диск:'1 TB SSD', SSD:'1TB', GPU:'RTX 4070 8GB', Видеокарта:'NVIDIA', Дисплей:'15.6" OLED 3.5K', Диагонал:'15.6"', ОС:'Windows 11', Батерия:'86Wh', Warranty:'24 месеца'},
    desc:'Dell XPS 15 с OLED дисплей 3.5K и RTX 4070 е идеален за творци и разработчици.',
    reviews:[{name:'Радослав В.',stars:5,date:'10.03.2025',text:'OLED дисплеят е невероятен!'}] },
  { id:12,  sku:'MC-APPL-AWU2-49', ean:'0194253425007', img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra2-49-titanium-trail-loop-beige-white-M-L-geo?wid=600&hei=600&fmt=png-alpha', name:'Apple Watch Ultra 2 49mm Titanium',   brand:'Apple',   cat:'smart',   emoji:'⌚', price:1299, old:1599, badge:'sale', pct:19, rating:4.8, rv:112,
    specs:{Корпус:'49mm Titanium', Дисплей:'2.1" OLED', GPS:'L1+L2', Батерия:'60 часа', Водоустойчивост:'100m', Чип:'S9'},
    desc:'Apple Watch Ultra 2 е проектиран за екстремни спортове с Titanium корпус и прецизен GPS.',
    reviews:[{name:'Калоян М.',stars:5,date:'28.02.2025',text:'Издръжлив и точен. Батерията издържа 2 дни.'}] },
  { id:13,  sku:'MC-SAMS-TABS9P-256', ean:'8806094878608', img:'https://images.samsung.com/levant/smartphones/galaxy-tab-s9-plus/images/galaxy-tab-s9-plus-graphite-back.jpg', name:'Samsung Galaxy Tab S9+ 256GB',        brand:'Samsung', cat:'tablet',  emoji:'📟', price:899,  old:1099, badge:'sale', pct:18, rating:4.7, rv:67,
    specs:{Дисплей:'12.4" Dynamic AMOLED', Диагонал:'12.4"', Чип:'Snapdragon 8 Gen 2', Памет:'256 GB', Памет_raw:'256GB', RAM:'12 GB', RAM_raw:'12GB', Камера:'13MP', Батерия:'10090 mAh', ОС:'Android', Мрежа:'WiFi + 5G', Warranty:'24 месеца'},
    desc:'Samsung Galaxy Tab S9+ е флагманска Android таблет с Dynamic AMOLED 2X дисплей и S Pen.',
    reviews:[{name:'Анастасия Л.',stars:4,date:'05.03.2025',text:'Отличен дисплей и S Pen в кутията!'}] },
  { id:14,  sku:'MC-GOPR-H13-BLACK', ean:'818279028197', img:'https://community.gopro.com/t5/image/serverpage/image-id/148637i9FF2AA716C50F9F2/image-size/large', name:'GoPro Hero 13 Black Edition',         brand:'GoPro',   cat:'camera',  emoji:'📷', price:549,  old:null, badge:'new',  pct:0,  rating:4.7, rv:88,
    specs:{Видео:'5.3K 60fps', Тип_камера:'Action Camera', Стабилизация:'HyperSmooth 6.0', Водоустойчивост:'10m', Батерия:'89 мин.', Дисплей:'2.27"', Тегло:'154g', Warranty:'12 месеца'},
    desc:'GoPro Hero 13 Black с HyperSmooth 6.0 е незаменим за екшън снимки. Поддържа 5.3K видео.',
    reviews:[{name:'Орлин С.',stars:5,date:'18.03.2025',text:'Страхотна action камера! Стабилизацията е невероятна.'}] },
  { id:15,  sku:'MC-TPLI-AX6000', ean:'6935364010706', img:'https://static.tp-link.com/Archer_AX6000_1.0_05_large_1523940987070t.jpg', name:'TP-Link WiFi 6 Router AX6000',        brand:'TP-Link', cat:'network', emoji:'📡', price:299,  old:399,  badge:'sale', pct:25, rating:4.6, rv:156,
    specs:{Стандарт:'WiFi 6 (802.11ax)', WiFi_стандарт:'WiFi 6', Скорост:'6000 Mbps', Обхват:'до 250 кв.м', Антени:'8x', Процесор:'1.8GHz', Портове:'4x Gigabit', Warranty:'24 месеца'},
    desc:'TP-Link AX6000 с WiFi 6 осигурява ултрабърза безжична мрежа за целия дом.',
    reviews:[{name:'Димитър Х.',stars:5,date:'22.03.2025',text:'Покрива перфектно цялото жилище.'}] },
  { id:16,  sku:'MC-PHIL-HUE-KIT', ean:'8719514264182', img:'https://www.assets.signify.com/is/image/PhilipsLighting/fp929002468801-philips-hue-white-and-color-ambiance-e27-starter-kit-2-pack?wid=600&hei=600', name:'Philips Hue Smart Lights Starter Kit',brand:'Philips', cat:'smart',   emoji:'💡', price:229,  old:279,  badge:'sale', pct:18, rating:4.5, rv:167,
    specs:{Крушки:'4x A60 E27', Протокол:'Zigbee', Цветове:'16 милиона', Управление:'App/Voice', Compatibility:'Alexa/Google', Гаранция:'2 год.'},
    desc:'Philips Hue стартов комплект с 4 крушки за пълен контрол над домашното осветление.',
    reviews:[{name:'Вера К.',stars:4,date:'15.03.2025',text:'Лесна инсталация и страхотни цветове!'}] },
  { id:99,  sku:'MC-APPL-MBP16-M4P', ean:'0195949842376', img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-m4pro-silver-select-202410?wid=600&hei=600&fmt=png-alpha', name:'MacBook Pro 16" M4 Pro 24GB',         brand:'Apple',   cat:'laptop',  emoji:'💻', price:4299, old:null, badge:'new',  pct:0,  rating:4.9, rv:73,
    specs:{Чип:'M4 Pro', CPU:'Apple M4 Pro', RAM:'24 GB', RAM_raw:'24GB', Диск:'512 GB SSD', SSD:'512GB', Видеокарта:'Интегрирана', Дисплей:'16.2" Liquid Retina XDR', Диагонал:'16"', ОС:'macOS', Батерия:'до 24 часа', Порт:'3x Thunderbolt 4', Warranty:'12 месеца'},
    desc:'MacBook Pro с M4 Pro чип предоставя изключителна производителност. До 24 часа батерия.',
    reviews:[{name:'Христо В.',stars:5,date:'25.03.2025',text:'Невероятно бърз! Батерията е фантастична.'},{name:'Весела Н.',stars:5,date:'19.03.2025',text:'Перфектен за видео монтаж!'}] },

  // ── МОНИТОРИ ────────────────────────────────────────────────────────────────
  { id:101, sku:'MC-LG-27UK850', ean:'8806098293476', img:'https://www.lg.com/us/images/monitors/md07573612/gallery/medium01.jpg', name:'LG 27" 4K UHD IPS HDR Monitor', brand:'LG', cat:'monitor', emoji:'🖥', price:699, old:849, badge:'sale', pct:18, rating:4.7, rv:98,
    specs:{Диагонал:'27"', Панел:'IPS', Резолюция:'4K UHD 3840×2160', Refresh:'60Hz', HDR:'HDR400', Входове:'2x HDMI 2.0 + DP 1.4', USB_C:'Да 60W', Warranty:'24 месеца', Size:'27"', Panel:'IPS', Resolution:'4K UHD', RefreshRate:'60 Hz'},
    desc:'LG 27UK850 с 4K IPS панел и USB-C зареждане е идеален за работа и съдържание. Nanoцветови технология за 98% DCI-P3.',
    reviews:[{name:'Мирослав Д.',stars:5,date:'10.03.2025',text:'Цветовете са страхотни, USB-C е много удобно!'},{name:'Таня Р.',stars:4,date:'01.03.2025',text:'Отличен монитор за цената.'}] },

  { id:102, sku:'MC-ASUS-ROG-PG27AQN', ean:'4711387398982', img:'https://dlcdnwebimgs.asus.com/gain/8D14F6D4-2D43-4E85-95F4-24C9E1F3C8A1/w717/h525', name:'ASUS ROG Swift Pro 27" 360Hz QHD', brand:'ASUS', cat:'monitor', emoji:'🖥', price:1299, old:1599, badge:'sale', pct:19, rating:4.9, rv:41,
    specs:{Диагонал:'27"', Панел:'Fast IPS', Резолюция:'QHD 2560×1440', Refresh:'360Hz', Отговор:'1ms GTG', HDR:'HDR600', 'G-Sync':'Compatible', Warranty:'24 месеца', Size:'27"', Panel:'IPS', Resolution:'QHD 1440p', RefreshRate:'240 Hz+'},
    desc:'ASUS ROG Swift Pro с 360Hz е предпочитан от професионални геймъри. Ултра-бърз Fast IPS панел с 1ms отговор.',
    reviews:[{name:'Александър К.',stars:5,date:'18.03.2025',text:'360Hz са истинска разлика в шутъри!'},{name:'Пламен Н.',stars:5,date:'08.03.2025',text:'Най-добрият монитор за gaming!'}] },

  { id:103, sku:'MC-SAMS-LS34BG850', ean:'8806094742480', img:'https://images.samsung.com/levant/monitors/ls34bg850suxen/images/ls34bg850suxen_001_front_black.jpg', name:'Samsung Odyssey OLED G8 34" 175Hz', brand:'Samsung', cat:'monitor', emoji:'🖥', price:1499, old:1899, badge:'sale', pct:21, rating:4.8, rv:63,
    specs:{Диагонал:'34"', Панел:'QD-OLED', Резолюция:'UWQHD 3440×1440', Refresh:'175Hz', Отговор:'0.1ms', HDR:'HDR10+', Кривина:'1800R', Warranty:'24 месеца', Size:'34"', Panel:'OLED', Resolution:'Ultra-Wide', RefreshRate:'165 Hz'},
    desc:'Samsung Odyssey OLED G8 съчетава перфектния OLED контраст с ултраширок 34" формат. Нулеви сенки и невероятна яркост.',
    reviews:[{name:'Борислав Е.',stars:5,date:'22.03.2025',text:'Картината е невероятна, OLED е следващото ниво!'},{name:'Соня М.',stars:4,date:'12.03.2025',text:'Широкият формат е перфектен за многозадачност.'}] },

  { id:104, sku:'MC-LG-34WP88C', ean:'8806091545282', img:'https://www.lg.com/us/images/monitors/md08003476/gallery/medium01.jpg', name:'LG 34" UltraWide QHD USB-C Monitor', brand:'LG', cat:'monitor', emoji:'🖥', price:899, old:1099, badge:'sale', pct:18, rating:4.6, rv:77,
    specs:{Диагонал:'34"', Панел:'IPS', Резолюция:'UWQHD 3440×1440', Refresh:'100Hz', USB_C:'96W PD', HDR:'HDR10', Входове:'2x HDMI + DP + USB-C', Warranty:'24 месеца', Size:'34"', Panel:'IPS', Resolution:'Ultra-Wide', RefreshRate:'60 Hz'},
    desc:'LG 34WP88C с USB-C зареждане 96W е идеалният монитор за MacBook потребители. Ултраширок формат за максимална продуктивност.',
    reviews:[{name:'Стефания П.',stars:5,date:'05.03.2025',text:'Перфектен за лаптоп — само един кабел!'},{name:'Георги С.',stars:4,date:'25.02.2025',text:'Много по-продуктивен с широкия екран.'}] },

  // ── ДЕСКТОПИ ────────────────────────────────────────────────────────────────
  { id:111, sku:'MC-APPL-MACMINI-M4P', ean:'0195949872809', img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-mini-2024?wid=600&hei=600&fmt=png-alpha', name:'Apple Mac Mini M4 Pro 24GB 512GB', brand:'Apple', cat:'desktop', emoji:'🖥', price:2499, old:null, badge:'new', pct:0, rating:4.9, rv:38,
    specs:{Чип:'M4 Pro', CPU:'Apple M4 Pro', RAM:'24 GB', RAM_raw:'24GB', Диск:'512 GB SSD', SSD:'512GB', Порт:'3x Thunderbolt 4 + 3x USB-A', HDMI:'2x HDMI 2.1', WiFi:'WiFi 6E', ОС:'macOS', Warranty:'12 месеца', GPU:'Интегрирана', OS:'macOS'},
    desc:'Mac Mini с M4 Pro е невероятно мощен и компактен. Поддържа до 3 монитора едновременно и е перфектен за творци и разработчици.',
    reviews:[{name:'Ивайло Г.',stars:5,date:'20.03.2025',text:'Невероятна производителност в малка кутия!'},{name:'Надежда К.',stars:5,date:'14.03.2025',text:'Перфектен за видео монтаж!'}] },

  { id:112, sku:'MC-ASUS-ROG-G22CH', ean:'4711387415222', img:'https://dlcdnwebimgs.asus.com/gain/8574C7E0-D5FC-4936-9F97-89F23B5F5A8F/w717/h525', name:'ASUS ROG G22CH Gaming Desktop RTX 4070', brand:'ASUS', cat:'desktop', emoji:'🖥', price:2799, old:3299, badge:'sale', pct:15, rating:4.8, rv:29,
    specs:{Процесор:'Intel Core i7-13700F', CPU:'Intel Core i7', RAM:'16 GB', RAM_raw:'16GB', Диск:'1 TB NVMe', SSD:'1TB', GPU:'RTX 4070 12GB', Видеокарта:'NVIDIA', ОС:'Windows 11', Warranty:'24 месеца', OS:'Windows 11'},
    desc:'ASUS ROG G22CH е компактен гейминг компютър с RTX 4070 и Intel i7. Играе всичко на Ultra настройки.',
    reviews:[{name:'Теодор Б.',stars:5,date:'15.03.2025',text:'Страхотен PC в малка кутия! RTX 4070 лети.'}] },

  // ── ЛАПТОПИ ─────────────────────────────────────────────────────────────────
  { id:121, sku:'MC-LENO-X1C-13', ean:'196804694832', img:'https://www.lenovo.com/medias/lenovo-laptop-thinkpad-x1-carbon-gen-13-intel-gallery-1.jpg?context=bWFzdGVyfHJvb3R8MjU4MDM5fGltYWdlL2pwZWd8aGQ5L2g5NS8xMzkzNzE4MzA3ODMwMi5qcGd8YTkxZWNhZDA2Zjk2Y2QyM2E4OWQ4NjVhMzIyMTcwNjhiNDYyM2E1MjBlNDhkNTFjZWZmZmM2MDY1MTZlYTNiZg', name:'Lenovo ThinkPad X1 Carbon Gen 13 i7', brand:'Lenovo', cat:'laptop', emoji:'💻', price:2899, old:3399, badge:'sale', pct:15, rating:4.8, rv:55,
    specs:{Процесор:'Intel Core Ultra 7 165H', CPU:'Intel Core Ultra', RAM:'32 GB', RAM_raw:'32GB', Диск:'1 TB SSD', SSD:'1TB', Видеокарта:'Интегрирана', Дисплей:'14" OLED 2.8K', Диагонал:'14"', ОС:'Windows 11 Pro', Батерия:'57Wh', Warranty:'36 месеца'},
    desc:'ThinkPad X1 Carbon е легендата сред бизнес лаптопите. Само 1.12 кг, MIL-SPEC издръжливост и 14" OLED дисплей.',
    reviews:[{name:'Росен А.',stars:5,date:'17.03.2025',text:'Перфектен бизнес лаптоп — лек и мощен!'},{name:'Кристина М.',stars:5,date:'07.03.2025',text:'ThinkPad клавиатурата е несравнима.'}] },

  { id:122, sku:'MC-MSFT-SUR-LAPTOP7', ean:'0889842979763', img:'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4OXRc?ver=2d5a&q=90&m=6&h=600&w=600&b=%23FFFFFF&f=jpg&o=f', name:'Microsoft Surface Laptop 7 15" i7', brand:'Microsoft', cat:'laptop', emoji:'💻', price:2199, old:2599, badge:'sale', pct:15, rating:4.7, rv:43,
    specs:{Процесор:'Intel Core Ultra 7 165H', CPU:'Intel Core Ultra', RAM:'16 GB', RAM_raw:'16GB', Диск:'512 GB SSD', SSD:'512GB', Видеокарта:'Intel Arc', Дисплей:'15" PixelSense 2496×1664', Диагонал:'15"', ОС:'Windows 11', Батерия:'54Wh', Warranty:'12 месеца'},
    desc:'Microsoft Surface Laptop 7 с PixelSense дисплей и тъч екран е идеален за студенти и бизнес потребители.',
    reviews:[{name:'Елица В.',stars:5,date:'12.03.2025',text:'Дизайнът е луксозен, дисплеят е отличен!'},{name:'Никола П.',stars:4,date:'04.03.2025',text:'Много лек и бърз. Препоръчвам.'}] },

  // ── СМАРТФОНИ ────────────────────────────────────────────────────────────────
  { id:131, sku:'MC-SAMS-S25U-512', ean:'8806095523223', img:'https://images.samsung.com/levant/smartphones/galaxy-s25-ultra/images/galaxy-s25-ultra-titanium-black-front.jpg', name:'Samsung Galaxy S25 Ultra 512GB', brand:'Samsung', cat:'mobile', emoji:'📱', price:2499, old:2799, badge:'sale', pct:11, rating:4.9, rv:112,
    specs:{Дисплей:'6.9" Dynamic AMOLED 2X', Чип:'Snapdragon 8 Elite', Камера:'200MP + 50MP + 10MP + 50MP', Батерия:'5000 mAh', Зареждане:'45W', RAM:'12 GB', RAM_raw:'12GB', Памет:'512 GB', Памет_raw:'512GB', ОС:'Android', Мрежа:'5G', Warranty:'24 месеца'},
    desc:'Galaxy S25 Ultra с AI Galaxy Intelligence и вграден S Pen задава нов стандарт за Android флагшипи. 200MP камера с оптичен зуум 10×.',
    reviews:[{name:'Владимир Й.',stars:5,date:'21.03.2025',text:'S Pen е незаменим! Камерата е фантастична.'},{name:'Мариела Д.',stars:5,date:'11.03.2025',text:'Най-добрият Android на пазара!'}] },

  { id:132, sku:'MC-GOOG-PX9PRO-256', ean:'0840244705849', img:'https://lh3.googleusercontent.com/gHOTWz5EJTaEzKuabKjCkGYAC6qpTueFALvUcnfxVr5LYrSuIMuW_iL_tLVaIl_PXF3BrXA7_PFAeA8qoJgqI8sS7f', name:'Google Pixel 9 Pro 256GB Obsidian', brand:'Google', cat:'mobile', emoji:'📱', price:1699, old:1999, badge:'sale', pct:15, rating:4.8, rv:87,
    specs:{Дисплей:'6.3" LTPO OLED', Чип:'Google Tensor G4', Камера:'50MP + 48MP + 48MP', Батерия:'4700 mAh', Зареждане:'37W', RAM:'16 GB', RAM_raw:'16GB', Памет:'256 GB', Памет_raw:'256GB', ОС:'Android', Мрежа:'5G', Warranty:'24 месеца'},
    desc:'Google Pixel 9 Pro с AI Magic Eraser и Best Take е камерофонът с най-добрия AI на пазара. Чист Android 9 години.',
    reviews:[{name:'Светла Н.',stars:5,date:'19.03.2025',text:'AI функциите са невероятни! Снимките са шедьоври.'},{name:'Антон В.',stars:4,date:'09.03.2025',text:'Перфектен Android, бързи обновления.'}] },

  // ── АУДИО ────────────────────────────────────────────────────────────────────
  { id:141, sku:'MC-APPL-APPRO2', ean:'0195949186547', img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=600&hei=600&fmt=png-alpha', name:'Apple AirPods Pro 2 USB-C', brand:'Apple', cat:'audio', emoji:'🎧', price:399, old:449, badge:'sale', pct:11, rating:4.8, rv:198,
    specs:{Тип:'In-ear', Тип_аудио:'In-ear', Връзка:'Bluetooth 5.3', ANC:'Адаптивно', ANC_filter:'С ANC', Батерия:'6 часа + 24 с кейс', Чип:'H2', Гаранция:'1 год.', Warranty:'12 месеца'},
    desc:'AirPods Pro 2 с чип H2 предлагат Adaptive Audio, Transparency Mode и USB-C зареждане. Лично пространствено аудио с Head Tracking.',
    reviews:[{name:'Дарина К.',stars:5,date:'23.03.2025',text:'Звукът е кристален, ANC е феноменален!'},{name:'Мартин Н.',stars:5,date:'13.03.2025',text:'Перфектна интеграция с iPhone!'}] },

  { id:142, sku:'MC-JBL-CHARGE5', ean:'6925281982446', img:'https://www.jbl.com/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dweb6b7218/JBL_Charge5_Product%20Image_Hero_Black.png?sw=600&sfrm=png', name:'JBL Charge 5 Bluetooth Speaker', brand:'JBL', cat:'audio', emoji:'🔊', price:249, old:299, badge:'sale', pct:17, rating:4.7, rv:234,
    specs:{Тип:'Portable Speaker', Тип_аудио:'Говорител', Връзка:'Bluetooth 5.1', Батерия:'20 часа', Мощност:'40W', Водоустойчивост:'IP67', USB_C:'Да', Гаранция:'1 год.', Warranty:'12 месеца'},
    desc:'JBL Charge 5 с 40W мощност и IP67 водоустойчивост е перфектен за навън. Зарежда смартфона ти докато свири.',
    reviews:[{name:'Генади Ж.',stars:5,date:'16.03.2025',text:'Звукът е мощен, батерията издържа 2 дни!'},{name:'Лора Т.',stars:4,date:'06.03.2025',text:'Страхотен звук за тока. IP67 е истина!'}] },

  // ── ГЕЙМИНГ ПЕРИФЕРИЯ ────────────────────────────────────────────────────────
  { id:151, sku:'MC-LOGIG-G502X', ean:'5099206099968', img:'https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g502-x-plus/g502x-plus-top-view.png', name:'Logitech G502 X Plus Gaming Mouse', brand:'Logitech', cat:'gaming', emoji:'🖱', price:199, old:249, badge:'sale', pct:20, rating:4.8, rv:167,
    specs:{Сензор:'HERO 25K', DPI:'100-25600', Бутони:'13', Батерия:'130 часа', Зареждане:'Lightspeed Wireless', Тегло:'106g', Warranty:'24 месеца'},
    desc:'Logitech G502 X Plus с HERO 25K сензор и Lightspeed безжична технология е изборът на eSports професионалисти.',
    reviews:[{name:'Ралица В.',stars:5,date:'24.03.2025',text:'Перфектна прецизност! Безжичната е безупречна.'},{name:'Димо С.',stars:5,date:'14.03.2025',text:'Най-добрата мишка за FPS!'}] },

  { id:152, sku:'MC-CORSA-K100-AIR', ean:'0840006657148', img:'https://assets.corsair.com/image/upload/c_pad,q_auto,h_600,w_600/pwa/corsair-k100-rgb-air-wireless-ultra-thin-mechanical-keyboard/COR-CH-913A01A-NA/02.webp', name:'Corsair K100 Air Wireless TKL Keyboard', brand:'Corsair', cat:'gaming', emoji:'⌨', price:349, old:429, badge:'sale', pct:19, rating:4.7, rv:89,
    specs:{Превключватели:'Cherry MX ULP', Подсветка:'RGB Per-Key', Батерия:'200 часа', Свързаност:'Bluetooth + 2.4GHz', Профил:'Ultra-low', Тегло:'612g', Warranty:'24 месеца'},
    desc:'Corsair K100 Air с Cherry MX ULP превключватели е най-тънката геймърска клавиатура. 200 часа батерия и двойна свързаност.',
    reviews:[{name:'Тихомир П.',stars:5,date:'20.03.2025',text:'Ниският профил е феноменален за gaming!'},{name:'Нели Д.',stars:4,date:'10.03.2025',text:'Много удобна и тиха. Препоръчвам!'}] },

  { id:153, sku:'MC-HYPER-CLOUD3', ean:'0197644403028', img:'https://hyperx.com/cdn/shop/files/727009-001_HX-HSCC3-BK_NA_HyperX-Cloud-3-Gaming-Headset-Black-3QTR_L.png?v=1702660026&width=600', name:'HyperX Cloud 3 Gaming Headset', brand:'HyperX', cat:'gaming', emoji:'🎧', price:149, old:189, badge:'sale', pct:21, rating:4.7, rv:203,
    specs:{Тип:'Over-ear', Тип_аудио:'Over-ear', Дискове:'53mm', Честота:'10–21000 Hz', Микрофон:'Отделяем', Свързаност:'USB-A / 3.5mm', DTS:'Headphone:X', Warranty:'24 месеца'},
    desc:'HyperX Cloud 3 с 53mm динамики и DTS Headphone:X пространствен звук е удобен многочасов геймърски слушалки.',
    reviews:[{name:'Светослав Д.',stars:5,date:'26.03.2025',text:'Комфортни дори при 8 часа игра!'},{name:'Яна М.',stars:4,date:'16.03.2025',text:'Отличен звук за цената.'}] },

  // ── СЪХРАНЕНИЕ ───────────────────────────────────────────────────────────────
  { id:161, sku:'MC-SAMS-990PRO-2T', ean:'8806094534566', img:'https://images.samsung.com/levant/consumer-storage/internal-ssd/990-pro/images/990-pro_images_390x390.jpg', name:'Samsung 990 Pro 2TB NVMe PCIe 4.0', brand:'Samsung', cat:'storage', emoji:'💾', price:249, old:319, badge:'sale', pct:22, rating:4.9, rv:312,
    specs:{Обем:'2 TB', Интерфейс:'PCIe 4.0 NVMe M.2', Четене:'7450 MB/s', Запис:'6900 MB/s', Форм_фактор:'M.2 2280', TBW:'1200 TBW', Warranty:'60 месеца', Type:'SSD M.2 NVMe', Interface:'PCIe 4.0', Capacity:'2 TB'},
    desc:'Samsung 990 Pro е най-бързото M.2 NVMe SSD за PS5 и PC. До 7450 MB/s четене за светкавично бързо зареждане.',
    reviews:[{name:'Любомир Б.',stars:5,date:'27.03.2025',text:'PS5 зарежда игрите 2× по-бързо!'},{name:'Миглена Ч.',stars:5,date:'17.03.2025',text:'Страхотна скорост, препоръчвам!'}] },

  { id:162, sku:'MC-WD-MYPASSPORT-4T', ean:'0718037898674', img:'https://shop.westerndigital.com/content/dam/store/en-us/assets/products/portable-drives/my-passport/2023/my-passport-usb-3-2-gen-1-blue-4tb.png.thumb.1280.1280.png', name:'WD My Passport 4TB Portable HDD', brand:'WD', cat:'storage', emoji:'💾', price:199, old:249, badge:'sale', pct:20, rating:4.6, rv:178,
    specs:{Обем:'4 TB', Интерфейс:'USB 3.2 Gen 1', Скорост:'130 MB/s', Форм_фактор:'2.5" Portable', Шифриране:'256-bit AES', Warranty:'36 месеца', Type:'Портативен HDD', Interface:'USB-A', Capacity:'4 TB+'},
    desc:'WD My Passport 4TB е компактен преносим хард диск с хардуерно шифриране и автоматичен бекъп. Идеален за снимки и видео.',
    reviews:[{name:'Бисер А.',stars:5,date:'25.03.2025',text:'4TB за тази цена е невероятно!'},{name:'Вяра С.',stars:4,date:'15.03.2025',text:'Надежден и бърз. Работи без проблем.'}] },

  { id:163, sku:'MC-KING-64DDR5-6000', ean:'0740617336177', img:'https://www.kingston.com/dataSheets/KF560C30BB-64_en.jpg', name:'Kingston FURY Beast 64GB DDR5-6000', brand:'Kingston', cat:'storage', emoji:'💾', price:299, old:379, badge:'sale', pct:21, rating:4.8, rv:94,
    specs:{Обем:'64 GB (2×32)', Тип:'DDR5', Честота:'6000 MHz', Латентност:'CL30', Voltage:'1.35V', XMP:'XMP 3.0', RGB:'Да', Warranty:'Живот', Type:'RAM', Interface:'DDR5', Capacity:'64 GB'},
    desc:'Kingston FURY Beast DDR5-6000 с RGB и XMP 3.0 профил е перфектната RAM памет за Intel Core 13/14 и AMD AM5 платформи.',
    reviews:[{name:'Живко Т.',stars:5,date:'23.03.2025',text:'Системата стана значително по-бърза!'},{name:'Деяна И.',stars:5,date:'13.03.2025',text:'Лесна инсталация, работи от първия път.'}] },

  // ── ТЕЛЕВИЗОРИ ───────────────────────────────────────────────────────────────
  { id:171, sku:'MC-SONY-XR65A80L', ean:'4548736147454', img:'https://www.sony.com/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=600', name:'Sony BRAVIA 65" OLED 4K A80L XR', brand:'Sony', cat:'tv', emoji:'📺', price:2999, old:3699, badge:'sale', pct:19, rating:4.9, rv:45,
    specs:{Размер:'65"', Диагонал_ТВ:'65"', Панел:'OLED', Резолюция:'4K UHD', HDR:'Dolby Vision + HDR10', Процесор:'XR Cognitive', Smart:'Google TV', HDMI:'4x HDMI 2.1', Refresh:'120Hz', Warranty:'24 месеца'},
    desc:'Sony BRAVIA 65" OLED с процесор XR Cognitive Intelligence анализира съдържанието за перфектна картина и звук.',
    reviews:[{name:'Наско Й.',stars:5,date:'28.03.2025',text:'Картината е толкова реална, забравяш, че е ТВ!'},{name:'Гергана В.',stars:5,date:'18.03.2025',text:'Google TV е много удобна платформа.'}] },

  { id:172, sku:'MC-LG-65C4-OLED', ean:'8806098767977', img:'https://www.lg.com/levant/images/tvs/md08095659/gallery/medium01.jpg', name:'LG OLED 65" C4 4K evo 120Hz', brand:'LG', cat:'tv', emoji:'📺', price:2699, old:3299, badge:'sale', pct:18, rating:4.8, rv:61,
    specs:{Размер:'65"', Диагонал_ТВ:'65"', Панел:'OLED evo', Резолюция:'4K UHD', HDR:'Dolby Vision IQ', Процесор:'α9 Gen7 AI', Smart:'webOS 24', HDMI:'4x HDMI 2.1', Refresh:'120Hz', Warranty:'24 месеца'},
    desc:'LG OLED C4 с процесор α9 Gen7 AI е изборът на геймъри — 4x HDMI 2.1, G-Sync Compatible и VRR до 144Hz.',
    reviews:[{name:'Цветан А.',stars:5,date:'26.03.2025',text:'За PS5 е абсолютно перфектен!'},{name:'Ива Б.',stars:5,date:'16.03.2025',text:'Картината бие всичко, което съм виждал.'}] },

  // ── АКСЕСОАРИ ────────────────────────────────────────────────────────────────
  { id:181, sku:'MC-ANKR-737-140W', ean:'0194644142872', img:'https://cdn.anker.com/media/magicui/products/A1372/A1372T11-1.jpg', name:'Anker 737 GaN 140W Charger 3-Port', brand:'Anker', cat:'acc', emoji:'🔌', price:129, old:159, badge:'sale', pct:19, rating:4.8, rv:289,
    specs:{Мощност:'140W', Портове:'2x USB-C + 1x USB-A', Технология:'GaN II', MacBook_Pro:'Да', Travel_Fuse:'Да', Warranty:'18 месеца'},
    desc:'Anker 737 GaN 140W зарежда MacBook Pro 16", iPad и iPhone едновременно. Интелигентно разпределение на мощността.',
    reviews:[{name:'Кирил М.',stars:5,date:'24.03.2025',text:'Заменя 3 зарядни с едно! Феноменален!'},{name:'Рена В.',stars:5,date:'14.03.2025',text:'Компактен и мощен. Задължителен за пътуване.'}] },

  { id:182, sku:'MC-APPL-MAGSAFE-WALLET', ean:'0194252756027', img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHLR3?wid=600&hei=600&fmt=png-alpha', name:'Apple MagSafe Leather Wallet iPhone', brand:'Apple', cat:'acc', emoji:'👜', price:99, old:129, badge:'sale', pct:23, rating:4.5, rv:156,
    specs:{Съвместимост:'iPhone 12/13/14/15/16', Карти:'1–3', Материал:'Кожа', MagSafe:'Да', Find_My:'Да', Warranty:'12 месеца'},
    desc:'Apple MagSafe Wallet се закача магнитно към iPhone и поддържа Find My. Побира до 3 карти.',
    reviews:[{name:'Яница О.',stars:5,date:'22.03.2025',text:'Много удобно! Нося телефон и портфейл заедно.'},{name:'Мирела Т.',stars:4,date:'12.03.2025',text:'Качеството е отлично, MagSafe е здраво.'}] },

  // ── УМНИ УСТРОЙСТВА ──────────────────────────────────────────────────────────
  { id:191, sku:'MC-GOOG-NESTH-2ND', ean:'0193575003665', img:'https://lh3.googleusercontent.com/hKdqZe_mRFh2_MJxOfmvRZ0nrFHPnvVlnnjT88z0UMr9GGMg1sTJb_YJfr2Z1J0f', name:'Google Nest Hub 2nd Gen 7" Display', brand:'Google', cat:'smart', emoji:'🏠', price:199, old:249, badge:'sale', pct:20, rating:4.6, rv:134,
    specs:{Дисплей:'7" LCD', Гласов_асистент:'Google Assistant', WiFi:'WiFi 6', Bluetooth:'5.0', Камера:'Няма', Sleep_Sensing:'Да', Warranty:'12 месеца'},
    desc:'Google Nest Hub 2nd Gen с Sleep Sensing следи съня ти без камера. Управлява умния ти дом с глас и дисплей.',
    reviews:[{name:'Янита Л.',stars:5,date:'21.03.2025',text:'Използвам го за всичко — новини, рецепти, музика!'},{name:'Огнян Д.',stars:4,date:'11.03.2025',text:'Google Assistant е много полезен.'}] },

  // ── КОМПОНЕНТИ ───────────────────────────────────────────────────────────────
  { id:241, sku:'MC-INTL-I9-14900K', ean:'0735858540773', img:'https://www.bhphotovideo.com/images/images500x500/intel_bx8071514900k_core_i9_14900k_processor_1696436479_1780376.jpg', name:'Intel Core i9-14900K 24-ядрен процесор', brand:'Intel', cat:'components', emoji:'⚙️', price:799, old:999, badge:'sale', pct:20, rating:4.9, rv:87,
    specs:{Тип:'Процесор', Ядра:'24 (8P+16E)', Нишки:'32', Макс_честота:'6.0 GHz', TDP:'125W', Сокет:'LGA1700', Кеш:'36 MB', Памет:'DDR4/DDR5', Brand:'Intel', Socket:'LGA1700'},
    desc:'Intel Core i9-14900K с 24 ядра и максимална честота 6.0 GHz е флагманският процесор за геймъри и творци. Съвместим с дънни платки Z790.',
    reviews:[{name:'Добрин В.',stars:5,date:'20.03.2025',text:'Рендерингът е светкавично бърз! Незаменим за видео монтаж.'},{name:'Ралица К.',stars:5,date:'10.03.2025',text:'Играе всичко на максимален FPS без никакво забавяне.'}] },

  { id:242, sku:'MC-AMD-R9-7950X', ean:'0730143314442', img:'https://www.bhphotovideo.com/images/images500x500/amd_100_100000514wof_ryzen_9_7950x_processor_1663270571_1750867.jpg', name:'AMD Ryzen 9 7950X 16-ядрен процесор', brand:'AMD', cat:'components', emoji:'⚙️', price:699, old:899, badge:'sale', pct:22, rating:4.9, rv:64,
    specs:{Тип:'Процесор', Ядра:'16', Нишки:'32', Макс_честота:'5.7 GHz', TDP:'170W', Сокет:'AM5', Кеш:'80 MB', Памет:'DDR5', Brand:'AMD', Socket:'AM5'},
    desc:'AMD Ryzen 9 7950X с 16 ядра и 80 MB кеш е абсолютният избор за workstation и рендеринг задачи на платформа AM5.',
    reviews:[{name:'Стоян Б.',stars:5,date:'18.03.2025',text:'В Blender е почти 2x по-бърз от предишния ми i9!'},{name:'Габриела Т.',stars:5,date:'08.03.2025',text:'Compilation времената паднаха наполовина.'}] },

  { id:243, sku:'MC-NVID-RTX4090-MSI', ean:'4719072905217', img:'https://www.bhphotovideo.com/images/images500x500/msi_geforce_rtx_4090_gaming_1663609536_1750944.jpg', name:'MSI GeForce RTX 4090 24GB Gaming X Trio', brand:'MSI', cat:'components', emoji:'🎮', price:3299, old:3999, badge:'sale', pct:18, rating:5.0, rv:43,
    specs:{Тип:'Видеокарта', GPU:'RTX 4090', VRAM:'24 GB GDDR6X', TDP:'450W', Разъем:'PCIe 5.0', HDMI:'HDMI 2.1', DP:'3x DP 1.4a', Brand:'NVIDIA'},
    desc:'MSI RTX 4090 Gaming X Trio е най-мощната потребителска видеокарта. 24 GB GDDR6X за 4K gaming, AI и рендеринг без компромис.',
    reviews:[{name:'Петко Г.',stars:5,date:'25.03.2025',text:'4K 120fps в Cyberpunk с RT Ultra. Нищо не я спира!'},{name:'Ваня Д.',stars:5,date:'15.03.2025',text:'За 3D работа е абсолютно незаменима.'}] },

  { id:244, sku:'MC-NVID-RTX4070TIS-ASUS', ean:'4711387403495', img:'https://dlcdnwebimgs.asus.com/gain/1C6DC02C-E0B7-4B18-B4E8-2EDBC2461EA5/w717/h525', name:'ASUS ROG Strix RTX 4070 Ti Super OC 16GB', brand:'ASUS', cat:'components', emoji:'🎮', price:1199, old:1499, badge:'sale', pct:20, rating:4.8, rv:78,
    specs:{Тип:'Видеокарта', GPU:'RTX 4070 Ti Super', VRAM:'16 GB GDDR6X', TDP:'285W', Разъем:'PCIe 4.0', HDMI:'HDMI 2.1', DP:'3x DP 1.4a', Brand:'NVIDIA'},
    desc:'ASUS ROG Strix RTX 4070 Ti Super OC с 16 GB GDDR6X е идеалната видеокарта за 4K gaming и AI задачи. DLSS 3.5 и Frame Generation.',
    reviews:[{name:'Мартин С.',stars:5,date:'22.03.2025',text:'1440p на 165Hz е абсолютно плавно!'},{name:'Ирена Л.',stars:4,date:'12.03.2025',text:'Страхотна карта за 3D дизайн.'}] },

  { id:245, sku:'MC-AMD-RX7900XTX-SAPP', ean:'0778901545416', img:'https://www.bhphotovideo.com/images/images500x500/sapphire_technology_11322_02_20g_nitro_radeon_rx_7900_1671220000_1756267.jpg', name:'Sapphire Nitro+ Radeon RX 7900 XTX 24GB', brand:'Sapphire', cat:'components', emoji:'🎮', price:1299, old:1599, badge:'sale', pct:19, rating:4.8, rv:52,
    specs:{Тип:'Видеокарта', GPU:'RX 7900 XTX', VRAM:'24 GB GDDR6', TDP:'355W', Разъем:'PCIe 4.0', HDMI:'HDMI 2.1', DP:'2x DP 2.1', Brand:'AMD'},
    desc:'Sapphire Nitro+ RX 7900 XTX с 24 GB GDDR6 е флагманската AMD видеокарта за 4K gaming. DisplayPort 2.1 за 8K резолюция.',
    reviews:[{name:'Христо М.',stars:5,date:'19.03.2025',text:'AMD драйверите са перфектни за Linux!'},{name:'Нина В.',stars:4,date:'09.03.2025',text:'4K gaming е плавен, консумацията приемлива.'}] },

  { id:246, sku:'MC-CORS-64DDR5-6400-VEN', ean:'0840006690299', img:'https://www.bhphotovideo.com/images/images500x500/corsair_cmk64gx5m2b6400c32_vengeance_64gb_2_x_1683308280_1766060.jpg', name:'Corsair Vengeance 64GB DDR5-6400 RGB', brand:'Corsair', cat:'components', emoji:'🧠', price:349, old:429, badge:'sale', pct:19, rating:4.8, rv:118,
    specs:{Тип:'RAM', Обем:'64 GB (2×32)', Честота:'6400 MHz', Латентност:'CL32', Voltage:'1.4V', XMP:'XMP 3.0', RGB:'Да', Brand:'Corsair', Socket:'DDR5'},
    desc:'Corsair Vengeance DDR5-6400 с RGB подсветка и XMP 3.0 профил е оптималната RAM за Intel LGA1700/1851 и AMD AM5 платформи.',
    reviews:[{name:'Тихомир Д.',stars:5,date:'24.03.2025',text:'XMP профилът работи от първото зареждане!'},{name:'Силва Н.',stars:5,date:'14.03.2025',text:'RGB е красив, скоростта е усетима.'}] },

  { id:247, sku:'MC-ASUS-ROGZ790E', ean:'4711387488812', img:'https://dlcdnwebimgs.asus.com/gain/3E1F7F74-CCCA-485D-B47E-E9B1E4DABE34/w717/h525', name:'ASUS ROG Strix Z790-E Gaming WiFi Дънна платка', brand:'ASUS', cat:'components', emoji:'🔩', price:799, old:999, badge:'sale', pct:20, rating:4.9, rv:61,
    specs:{Тип:'Дънна платка', Чипсет:'Intel Z790', Сокет:'LGA1700', Памет:'DDR5 до 7800 MHz', PCIe:'PCIe 5.0 x16', USB:'Thunderbolt 4', WiFi:'WiFi 6E', Brand:'ASUS', Socket:'LGA1700'},
    desc:'ASUS ROG Strix Z790-E с PCIe 5.0 и WiFi 6E е премиум дънна платка за Intel Core 13/14 поколение. Поддържа DDR5 до 7800 MHz.',
    reviews:[{name:'Кирил Ж.',stars:5,date:'23.03.2025',text:'Безпроблемен оверклок до 7200 MHz на паметта!'},{name:'Боряна М.',stars:5,date:'13.03.2025',text:'Качеството е на ниво. BIOS е интуитивен.'}] },

  { id:248, sku:'MC-MSI-X670EACE', ean:'4719072918774', img:'https://www.bhphotovideo.com/images/images500x500/msi_meg_x670e_ace_atx_am5_1661965793_1750095.jpg', name:'MSI MEG X670E ACE AMD AM5 Дънна платка', brand:'MSI', cat:'components', emoji:'🔩', price:699, old:849, badge:'sale', pct:18, rating:4.8, rv:45,
    specs:{Тип:'Дънна платка', Чипсет:'AMD X670E', Сокет:'AM5', Памет:'DDR5 до 6600 MHz', PCIe:'PCIe 5.0 x16', USB:'USB4 40Gbps', WiFi:'WiFi 6E', Brand:'MSI', Socket:'AM5'},
    desc:'MSI MEG X670E ACE с AMD X670E чипсет е флагманска дънна платка за Ryzen 7000. PCIe 5.0 за M.2 и USB4 40Gbps.',
    reviews:[{name:'Владо К.',stars:5,date:'21.03.2025',text:'Ryzen 9 7950X + тази платка = перфектна combo!'},{name:'Деа Й.',stars:4,date:'11.03.2025',text:'Много функционалности, лесна настройка.'}] },

  { id:249, sku:'MC-CORS-RM850X-GOLD', ean:'0840006641956', img:'https://www.bhphotovideo.com/images/images500x500/corsair_cp_9020200_na_rm850x_shift_850_watt_1668626720_1752798.jpg', name:'Corsair RM850x 850W 80+ Gold Modular', brand:'Corsair', cat:'components', emoji:'⚡', price:229, old:289, badge:'sale', pct:21, rating:4.9, rv:203,
    specs:{Тип:'Захранване', Мощност:'850W', Сертификат:'80+ Gold', Модулно:'Напълно модулно', Вентилатор:'135mm Zero RPM', Гаранция:'10 год.', Brand:'Corsair', TDP:'850W'},
    desc:'Corsair RM850x с 80+ Gold сертификат и Zero RPM режим работи безшумно при ниско натоварване. Напълно модулни кабели за чист монтаж.',
    reviews:[{name:'Илиян Г.',stars:5,date:'26.03.2025',text:'Абсолютно тих при нормална работа!'},{name:'Пея Т.',stars:5,date:'16.03.2025',text:'10 години гаранция — купуваш веднъж.'}] },

  { id:250, sku:'MC-SEAS-FOCUSGX1000', ean:'4711173876199', img:'https://www.bhphotovideo.com/images/images500x500/seasonic_focus_gx_1000_atx_1548281576_1476476.jpg', name:'Seasonic Focus GX-1000 1000W 80+ Gold', brand:'Seasonic', cat:'components', emoji:'⚡', price:279, old:339, badge:'sale', pct:18, rating:4.8, rv:134,
    specs:{Тип:'Захранване', Мощност:'1000W', Сертификат:'80+ Gold', Модулно:'Напълно модулно', Вентилатор:'135mm Hybrid', Гаранция:'10 год.', Brand:'Seasonic', TDP:'1000W'},
    desc:'Seasonic Focus GX-1000 с 1000W и Hybrid Silent Fan Control е идеалното захранване за RTX 4090 системи. Изключително стабилно напрежение.',
    reviews:[{name:'Пенко Р.',stars:5,date:'24.03.2025',text:'Перфектно с RTX 4090! Нито шум, нито проблем.'},{name:'Лена Б.',stars:5,date:'14.03.2025',text:'Seasonic качеството е непостижимо.'}] },

  // ── МРЕЖОВО ОБОРУДВАНЕ ───────────────────────────────────────────────────────
  { id:201, sku:'MC-TPLI-DECO-XE75', ean:'6935364091898', img:'https://static.tp-link.com/upload/product-overview/2022/202209/20220913/1663052267022a.jpg', name:'TP-Link Deco XE75 WiFi 6E Mesh 3-Pack', brand:'TP-Link', cat:'network', emoji:'📡', price:499, old:649, badge:'sale', pct:23, rating:4.7, rv:89,
    specs:{Стандарт:'WiFi 6E (802.11axe)', WiFi_стандарт:'WiFi 6E', Диапазони:'Три (2.4+5+6 GHz)', Скорост:'5400 Mbps', Обхват:'до 600 кв.м', Възли:'3', HomeShield:'Да', Warranty:'24 месеца'},
    desc:'TP-Link Deco XE75 Mesh системата елиминира мъртвите зони в целия дом. WiFi 6E на 6 GHz за минимална интерференция.',
    reviews:[{name:'Методи Б.',stars:5,date:'19.03.2025',text:'Цялата къща вече има перфектен сигнал!'},{name:'Таня Х.',stars:4,date:'09.03.2025',text:'Настройката е лесна, сигналът е силен навсякъде.'}] },
];

let cart=[], compareList=[], modalQtyVal=1, modalProductId=null, quickOrderProductId=null, currentFilter='all', currentSort='bestseller';

// ── Persist & restore products from localStorage ──
function persistProducts() {
  try { localStorage.setItem('mc_products', JSON.stringify(products)); } catch(e) {}
}
(function restoreProducts() {
  try {
    const saved = localStorage.getItem('mc_products');
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length) {
      products.splice(0, products.length, ...parsed);
    }
  } catch(e) {}
})();
