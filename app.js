// ===== CURRENCY =====
let EUR_RATE = parseFloat(localStorage.getItem('eurRate')) || 1.95583; // 1 EUR = x BGN
if (isNaN(EUR_RATE)) EUR_RATE = 1.95583;
function toEur(bgn) { return bgn / EUR_RATE; }
function fmtEur(bgn) { return toEur(bgn).toLocaleString('de-DE', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' €'; }
function fmtBgn(bgn) { return bgn.toLocaleString('bg-BG', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' лв.'; }
// Primary display: EUR bold, BGN muted below
function fmtPrice(bgn, saleCls='') {
  return `<span class="price-eur${saleCls ? ' '+saleCls : ''}">${fmtEur(bgn)}</span><span class="price-bgn">${fmtBgn(bgn)}</span>`;
}
// Inline dual: "2.30 € / 4.49 лв."
function fmtDual(bgn) { return `${fmtEur(bgn)} / ${fmtBgn(bgn)}`; }

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EUR_RATE, toEur, fmtEur, fmtBgn, fmtPrice, fmtDual };
}
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

function starsHTML(r){return '★'.repeat(Math.round(r))+'☆'.repeat(5-Math.round(r));}

function makeCard(p,small=false){
  const save=p.old?Math.round(((p.old-p.price)/p.old)*100):0;
  const imgHtml = p.img
    ? `<img class="product-img-real" src="${p.img}" alt="${p.name}" itemprop="image" loading="lazy" width="300" height="300" decoding="async" onload="this.classList.add('img-loaded')" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-img-emoji is-hidden" aria-hidden="true">${p.emoji}</span>`
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
    <a href="?product=${p.id}" class="product-img-wrap${small?' small':''}" onclick="openProductPage(${p.id});return false;" style="cursor:pointer;" aria-label="${p.name}" itemprop="url">
      ${imgHtml}
      ${Object.keys(p.specs||{}).length ? `<div class="card-specs-overlay" aria-hidden="true">${Object.entries(p.specs).slice(0,3).map(([k,v])=>`<div class="cso-row"><span class="cso-key">${k}</span><span class="cso-val">${v}</span></div>`).join('')}</div>` : ''}
    </a>
    <div class="product-body">
      <div class="product-brand" itemprop="brand">${p.brand}</div>
      <h3 class="product-name" itemprop="name"><a href="?product=${p.id}" onclick="openProductPage(${p.id});return false;" style="color:inherit;text-decoration:none;">${p.name}</a></h3>
      <div class="product-rating"><span class="stars">${starsHTML(p.rating)}</span><span class="rating-num">${p.rating} (${p.rv})</span></div>
      <div class="product-footer">
        <div class="price-row">
          <div class="price-current${p.badge==='sale'?' sale':''}" itemprop="offers" itemscope itemtype="https://schema.org/Offer"><meta itemprop="priceCurrency" content="EUR"><link itemprop="availability" href="${p.stock===false?'https://schema.org/OutOfStock':'https://schema.org/InStock'}"><span itemprop="price" content="${p.price}">${fmtPrice(p.price, p.badge==='sale'?'sale':'')}</span></div>
          ${p.old?`<div class="price-old">${fmtEur(p.old)} / ${fmtBgn(p.old)}</div><div class="price-save">-${save}%</div>`:''}
        </div>
        <div class="row-gap-6">
          <button type="button" class="add-cart-btn" id="cb-${p.id}" onclick="addToCart(${p.id})" style="flex:1;"><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> Добави</button>
          <button type="button" class="product-quick-view-btn" onclick="openProductModal(${p.id})" title="Бърз преглед"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-eye"/></svg><span class="qv-tooltip">Бърз преглед</span></button>
          <button type="button" onclick="openQuickOrder(${p.id})" title="Бърза поръчка" style="background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:9px 10px;transition:all 0.2s;" onmouseover="this.style.background='var(--primary-light)'" onmouseout="this.style.background='var(--bg)'"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-bolt"/></svg></button>
        </div>
        <div class="product-compare-cb">
          <input type="checkbox" id="cmp-${p.id}" onchange="toggleCompare(${p.id},this.checked)">
          <label for="cmp-${p.id}">Сравни</label>
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
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
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
  const badge = document.getElementById('bnCartBadge');
  if (badge) { badge.textContent = count; badge.classList.toggle('show', count>0); }
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
function toggleDarkMode(){
  // Dark mode not available on mobile
  if (window.innerWidth <= 768) {
    showToast('☀️ Тъмният режим не е наличен на мобилно');
    return;
  }
  const dark = document.body.classList.toggle('dark');
  const dmIcon = document.getElementById('dmIcon');
  if (dmIcon) dmIcon.innerHTML = dark
    ? '<svg width="18" height="18" class="svg-ic" aria-hidden="true"><use href="#ic-sun"/></svg>'
    : '<svg width="18" height="18" class="svg-ic" aria-hidden="true"><use href="#ic-moon"/></svg>';
  try { localStorage.setItem('mc_dark', dark ? '1' : '0'); } catch(e){}
  showToast(dark ? '🌙 Тъмен режим включен' : '☀️ Светъл режим');
}
(function(){
  const dark = document.body.classList.contains('dark');
  const ic = document.getElementById('dmIcon');
  if (ic) ic.innerHTML = dark
    ? '<svg width="18" height="18" class="svg-ic" aria-hidden="true"><use href="#ic-sun"/></svg>'
    : '<svg width="18" height="18" class="svg-ic" aria-hidden="true"><use href="#ic-moon"/></svg>';
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
  { cat:'laptop',  icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-laptop"/></svg>', name:'Лаптопи и компютри' },
  { cat:'mobile',  icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-phone"/></svg>', name:'Телефони' },
  { cat:'tablet',  icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-tablet"/></svg>', name:'Таблети' },
  { cat:'audio',   icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-headphones"/></svg>', name:'Аудио и слушалки' },
  { cat:'tv',      icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-tv"/></svg>', name:'Телевизори' },
  { cat:'camera',  icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-camera"/></svg>', name:'Фотоапарати' },
  { cat:'gaming',  icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-gamepad"/></svg>', name:'Гейминг' },
  { cat:'smart',   icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-watch"/></svg>', name:'Смарт устройства' },
  { cat:'network', icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-wifi"/></svg>', name:'Мрежово оборудване' },
  { cat:'print',   icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-printer"/></svg>', name:'Принтери' },
  { cat:'acc',     icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-mouse"/></svg>', name:'Аксесоари' },
];
const megaBrands = ['Intel', 'ASUS', 'Acer', 'Microsoft', 'Lenovo', 'Gigabyte', 'LG', 'HP', 'ADATA', 'Sapphire', 'Tenda', 'Kingston', 'Seagate', 'AMD', 'Seasonic', 'ASRock', 'Repotec', 'Realme', 'MSI', 'Tuncmatik', 'Palit', 'Nokia', 'Dynac', 'Cooler Master', 'Fractal', 'NZXT', 'Canon', 'Fnatic', 'GeIL', 'FSP Group', 'Omega', 'Inform UPS', 'QNAP', 'D-Link', 'AV Tech'];

function openMegamenu() {
  // Render cats
  const catsEl = document.getElementById('megamenuCats');
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
  // Apply filter on main page
  const pill = document.querySelector(`.filter-pill[onclick*="'${cat}'"]`);
  if (pill) { applyFilter(pill, cat); document.getElementById('featured').scrollIntoView({behavior:'smooth'}); }
  else { showSearchResultsPage(cat); }
}

function megaFilterBrand(brand) {
  closeMegamenu();
  document.getElementById('searchInput').value = brand;
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
      { id: 'productModalBackdrop', close: closeModal },
      { id: 'searchResultsPage',    close: closeSearchPage },
      { id: 'wishlistPage',         close: () => { document.getElementById('wishlistPage').classList.remove('open'); document.body.style.overflow = ''; } },
      { id: 'megamenuPage',         close: closeMegamenu },
      { id: 'adminPage',            close: closeAdminPage },
      { id: 'comparePage',          close: closeComparePage, checkFn: el => el.style.display === 'block' },
      { id: 'catPage',              close: () => typeof closeCatPage === 'function' && closeCatPage() },
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
let compareIds = [];

function toggleCompare(id, checked) {
  if (checked) {
    if (compareIds.length >= 3) {
      showToast('⚠️ Може да сравниш максимум 3 продукта');
      const cb = document.getElementById('cmp-' + id);
      if (cb) cb.checked = false;
      return;
    }
    if (!compareIds.includes(id)) compareIds.push(id);
  } else {
    compareIds = compareIds.filter(x => x !== id);
  }
  _renderCompareBar();
}

function _renderCompareBar() {
  const bar = document.getElementById('compareBar');
  if (!bar) return;
  bar.classList.toggle('visible', compareIds.length > 0);
  if (compareIds.length === 0) return;
  const cnt = document.getElementById('compareCnt');
  if (cnt) cnt.textContent = compareIds.length;
  const preview = document.getElementById('comparePreview');
  if (preview) {
    preview.innerHTML = compareIds.map(id => {
      const p = products.find(x => x.id === id);
      if (!p) return '';
      return `<div style="background:#252840;border:1px solid #2d3148;border-radius:8px;padding:6px 10px;display:flex;align-items:center;gap:6px;font-size:12px;color:#e5e7eb;">
        <span>${p.emoji}</span>
        <span style="max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.name.substring(0,18)}</span>
        <button type="button" onclick="toggleCompare(${id},false);document.getElementById('cmp-${id}').checked=false;" style="background:none;border:none;color:#6b7280;cursor:pointer;font-size:14px;line-height:1;padding:0 2px;">×</button>
      </div>`;
    }).join('');
  }
}

function clearCompare() {
  compareIds.forEach(id => {
    const cb = document.getElementById('cmp-' + id);
    if (cb) cb.checked = false;
  });
  compareIds = [];
  _renderCompareBar();
}

function openComparePage() {
  if (compareIds.length < 2) { showToast('⚠️ Избери поне 2 продукта за сравнение'); return; }
  const ps = compareIds.map(id => products.find(x => x.id === id)).filter(Boolean);
  const allKeys = [...new Set(ps.flatMap(p => Object.keys(p.specs || {})))];

  const colW = `${Math.floor(80 / ps.length)}%`;
  let html = `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-family:'Outfit',sans-serif;">`;

  // Header row
  html += `<thead><tr><th style="width:20%;padding:12px;text-align:left;color:#6b7280;font-size:12px;border-bottom:1px solid var(--border);">Характеристика</th>`;
  ps.forEach(p => {
    html += `<th style="width:${colW};padding:12px;text-align:center;border-bottom:1px solid var(--border);">
      <div style="font-size:32px;margin-bottom:6px;">${p.emoji}</div>
      <div style="font-size:13px;font-weight:700;color:var(--text);">${p.name.substring(0,30)}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:2px;">${p.brand}</div>
    </th>`;
  });
  html += `</tr></thead><tbody>`;

  // Price row
  html += `<tr style="background:rgba(99,102,241,0.05);"><td style="padding:10px 12px;font-size:12px;color:#6b7280;font-weight:700;">Цена</td>`;
  const minPrice = Math.min(...ps.map(p => p.price));
  ps.forEach(p => {
    html += `<td style="padding:10px 12px;text-align:center;font-size:16px;font-weight:800;color:${p.price===minPrice?'#34d399':'var(--text)'};">${fmtBgn(p.price)}</td>`;
  });
  html += `</tr>`;

  // Rating row
  html += `<tr><td style="padding:10px 12px;font-size:12px;color:#6b7280;font-weight:700;">Рейтинг</td>`;
  ps.forEach(p => {
    html += `<td style="padding:10px 12px;text-align:center;">⭐ ${p.rating} <span style="font-size:11px;color:var(--muted);">(${p.rv})</span></td>`;
  });
  html += `</tr>`;

  // Stock row
  html += `<tr style="background:rgba(99,102,241,0.05);"><td style="padding:10px 12px;font-size:12px;color:#6b7280;font-weight:700;">Наличност</td>`;
  ps.forEach(p => {
    const s = p.stock===false||p.stock===0?'<span style="color:#f87171;">Изчерпан</span>':p.stock!=null&&p.stock<=5?`<span style="color:#fbbf24;">${p.stock} бр.</span>`:'<span style="color:#34d399;">В наличност</span>';
    html += `<td style="padding:10px 12px;text-align:center;font-size:12px;">${s}</td>`;
  });
  html += `</tr>`;

  // Spec rows
  allKeys.forEach((key, i) => {
    html += `<tr${i%2===0?' style="background:rgba(99,102,241,0.03);"':''}>
      <td style="padding:10px 12px;font-size:12px;color:#6b7280;font-weight:700;">${key}</td>`;
    ps.forEach(p => {
      const val = (p.specs || {})[key] || '<span style="color:#4b5563;">—</span>';
      html += `<td style="padding:10px 12px;text-align:center;font-size:13px;color:var(--text);">${val}</td>`;
    });
    html += `</tr>`;
  });

  // Add to cart row
  html += `<tr><td style="padding:12px;"></td>`;
  ps.forEach(p => {
    html += `<td style="padding:12px;text-align:center;"><button type="button" onclick="addToCart(${p.id})" style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:10px 18px;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;cursor:pointer;width:100%;">🛒 Добави</button></td>`;
  });
  html += `</tr>`;

  html += `</tbody></table></div>`;

  document.getElementById('compareTable').innerHTML = html;
  const page = document.getElementById('comparePage');
  page.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

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
    'cookieModalBackdrop','pwaIosModal','comparePage'
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
  document.getElementById('modalSpecs').innerHTML=Object.keys(p.specs).slice(0,4).map(k=>`<div class="spec-chip"><div class="spec-chip-key">${k}</div><div class="spec-chip-val">${p.specs[k]}</div></div>`).join('');
  let b='';if(p.badge==='sale')b+='<span class="badge badge-sale">Промо</span>';if(p.badge==='new')b+='<span class="badge badge-new">Ново</span>';if(p.badge==='hot')b+='<span class="badge badge-hot">Горещо</span>';
  document.getElementById('modalBadges').innerHTML=b;
  document.getElementById('modalDesc').textContent=p.desc;
  var _el_modalSpecsFull=document.getElementById('modalSpecsFull'); if(_el_modalSpecsFull) _el_modalSpecsFull.innerHTML =
    `<div class="spec-chip"><div class="spec-chip-key">SKU</div><div class="spec-chip-val mono-12">${p.sku}</div></div>` +
    `<div class="spec-chip"><div class="spec-chip-key">EAN</div><div class="spec-chip-val mono-12">${p.ean}</div></div>` +
    Object.entries(p.specs).map(([k,v])=>`<div class="spec-chip"><div class="spec-chip-key">${k}</div><div class="spec-chip-val">${v}</div></div>`).join('');
  document.getElementById('modalReviews').innerHTML=p.reviews.map(r=>`<div class="review-item"><div class="review-header"><span class="review-name">${r.name}</span><span class="review-stars">${starsHTML(r.stars)}</span><span class="review-date">${r.date}</span></div><div class="review-text">${r.text}</div></div>`).join('');
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
    // Same category check
    if(compareList.length>0){
      const firstCat = products.find(x=>x.id===compareList[0])?.cat;
      if(p.cat !== firstCat){
        showToast('⚠️ Можеш да сравняваш само продукти от една и съща категория!');
        document.getElementById('cmp-'+id).checked=false;
        return;
      }
    }
    if(compareList.length>=3){showToast('Максимум 3 продукта за сравнение!');document.getElementById('cmp-'+id).checked=false;return;}
    if(!compareList.includes(id))compareList.push(id);
  }
  else{compareList=compareList.filter(x=>x!==id);}
  updateCompareBar();
}
function updateCompareBar(){
  const bar=document.getElementById('compareBar'),slots=document.getElementById('compareSlots');
  if(compareList.length===0){bar.classList.remove('visible');return;}
  bar.classList.add('visible');
  let html='';
  for(let i=0;i<3;i++){
    if(i<compareList.length){const p=products.find(x=>x.id===compareList[i]);if(!p){compareList.splice(i,1);updateCompareBar();return;}html+=`<div class="compare-slot filled"><span class="compare-slot-emoji">${p.emoji}</span><span class="compare-slot-name">${p.name}</span><button type="button" class="compare-slot-remove" onclick="removeCompare(${p.id})">×</button></div>`;}
    else html+=`<div class="compare-slot"><span style="color:rgba(255,255,255,0.4);font-size:11px;">+ Добави продукт</span></div>`;
  }
  slots.innerHTML=html;
}
function removeCompare(id){compareList=compareList.filter(x=>x!==id);const cb=document.getElementById('cmp-'+id);if(cb)cb.checked=false;updateCompareBar();}
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
  allKeys.forEach(k=>{html+=`<tr><th>${k}</th>`;prods.forEach(p=>html+=`<td>${p.specs[k]||'—'}</td>`);html+=`</tr>`;});
  html+=`</tbody>`;
  document.getElementById('compareTable').innerHTML=html;
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
function goSlide(n){slides[currentSlide].classList.remove('active');dots[currentSlide].classList.remove('active');currentSlide=n;slides[currentSlide].classList.add('active');dots[currentSlide].classList.add('active');}
setInterval(()=>goSlide((currentSlide+1)%slides.length),5000);

// COUNTDOWN — persistent across page reloads via localStorage
(function(){
  const DURATION = 4*3600; // 4 hours flash sale window
  let endTs = parseInt(localStorage.getItem('mc_flash_end')||'0');
  if(!endTs || Date.now() > endTs) {
    endTs = Date.now() + DURATION*1000;
    localStorage.setItem('mc_flash_end', endTs);
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
  setInterval(tick,1000);
})();

// TOAST
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove('show'),2800);}

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
  if(btn){btn.classList.add('added');btn.innerHTML='✓ Добавен';setTimeout(()=>{btn.classList.remove('added');btn.innerHTML='🛒 Добави';},1500);}
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
      <div onclick="openProductModal(${r.id})" style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);cursor:pointer;">
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
const FREE_SHIP_BGN = 200;
function updateCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  document.getElementById('cartBadge').textContent=count;
  document.getElementById('cartTotal').textContent=fmtEur(total) + ' / ' + fmtBgn(total);
  // sync PDP mini-header cart badge
  const pdpB = document.getElementById('pdpMhdrCartBadge');
  if(pdpB){pdpB.textContent=count;pdpB.style.display=count>0?'':'none';}
  // sync bottom nav badge
  const bnB = document.getElementById('bnCartBadge');
  if(bnB){bnB.textContent=count;bnB.classList.toggle('show',count>0);}
  const body=document.getElementById('cartBody');
  if(cart.length===0){body.innerHTML='<div class="cart-empty-msg"><div class="ce-icon"><svg width="44" height="44" class="svg-ic" aria-hidden="true" style="opacity:.25"><use href="#ic-cart"/></svg></div><p>Кошницата е празна.<br>Добави продукти!</p></div>';return;}
  let html=cart.map(x=>`<div class="cart-item-row"><div class="ci-emoji">${x.emoji}</div><div class="ci-details"><div class="ci-name">${x.name}</div><div class="ci-price">${fmtEur(x.price*x.qty)}<span class="text-11-muted-block">${fmtBgn(x.price*x.qty)}</span></div><div class="ci-qty"><button type="button" class="qty-btn" onclick="changeQty(${x.id},-1)">−</button><span class="qty-num">${x.qty}</span><button type="button" class="qty-btn" onclick="changeQty(${x.id},1)">+</button></div></div><button type="button" class="ci-remove" onclick="removeFromCart(${x.id})">×</button></div>`).join('');
  // Free shipping progress bar
  const pct=Math.min(100,(total/FREE_SHIP_BGN)*100);
  if(total>=FREE_SHIP_BGN){
    html+=`<div class="cart-ship-bar"><div class="cart-ship-msg ship-free">🎉 Имаш безплатна доставка!</div><div class="cart-ship-progress"><div class="cart-ship-fill" style="width:100%"></div></div></div>`;
  }else{
    const rem=(FREE_SHIP_BGN-total).toFixed(2);
    html+=`<div class="cart-ship-bar"><div class="cart-ship-msg">Добави още <strong>${rem} лв.</strong> за безплатна доставка!</div><div class="cart-ship-progress"><div class="cart-ship-fill" style="width:${pct.toFixed(1)}%"></div></div></div>`;
  }
  // Recently viewed not in cart
  try{
    const rvIds=JSON.parse(localStorage.getItem('mc_rv')||'[]');
    const inCart=new Set(cart.map(x=>x.id));
    const rvItems=rvIds.map(id=>products.find(p=>p.id===id)).filter(p=>p&&!inCart.has(p.id)).slice(0,3);
    if(rvItems.length){
      html+=`<div class="cart-rv-section"><div class="cart-rv-title">Забрави ли нещо?</div><div class="cart-rv-list">${rvItems.map(p=>`<div class="cart-rv-item"><div class="cart-rv-emoji">${p.emoji}</div><div class="cart-rv-info"><div class="cart-rv-name">${p.name.length>28?p.name.substring(0,28)+'…':p.name}</div><div class="cart-rv-price">${fmtEur(p.price)}</div></div><button type="button" class="cart-rv-add" onclick="addToCart(${p.id})" title="Добави">+</button></div>`).join('')}</div></div>`;
    }
  }catch(e){}
  body.innerHTML=html;
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
  t.innerHTML=removed.name.substring(0,28)+'… премахнат. <button type="button" onclick="undoRemoveCart()" style="margin-left:8px;background:rgba(255,255,255,0.25);border:none;border-radius:5px;padding:2px 8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;color:#fff;">Отмяна</button>';
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
  const promoDisc = promoApplied ? subtotal * 0.10 : 0;
  const total = subtotal + delivery + codFee - promoDisc;

  document.getElementById('osSummaryItems').innerHTML = cart.map(x => `
    <div class="os-item">
      <div class="os-emoji">${x.emoji}</div>
      <div class="os-item-info">
        <div class="os-item-name">${x.name}</div>
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
  document.querySelectorAll('#checkoutPage .delivery-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  ckDeliveryIdx = idx;
  renderOrderSummary();
  // Show/hide address fields for pickup
  const addrFields = document.querySelector('#ck-step2 .ck-field');
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

function applyPromo() {
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  if (code === 'MOSTCOMP10') {
    promoApplied = true;
    document.getElementById('promoOk').classList.add('show');
    document.getElementById('promoInput').disabled = true;
    renderOrderSummary();
    showToast('✓ Промо код приложен — -10%!');
  } else {
    showToast('Невалиден промо код!');
    document.getElementById('promoInput').classList.add('error');
    setTimeout(() => document.getElementById('promoInput').classList.remove('error'), 1500);
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
}

function ckNextStep(current) {
  if (!validateCkStep(current)) return;
  showCheckoutStep(current + 1);
}

function validateCkStep(step) {
  if (step === 1) {
    let valid = true;
    ['ckFirst','ckLast','ckPhone'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) { el.classList.add('error'); el.classList.remove('valid'); valid = false; }
    });
    const email = document.getElementById('ckEmail');
    if (email && (!email.value.trim() || !email.value.includes('@'))) {
      email.classList.add('error'); email.classList.remove('valid'); valid = false;
    }
    if (!valid) showToast('⚠️ Попълни всички задължителни полета!');
    return valid;
  }
  if (step === 2) {
    let valid = true;
    ['ckCity','ckAddr'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) { el.classList.add('error'); el.classList.remove('valid'); valid = false; }
    });
    if (!valid) showToast('⚠️ Попълни адреса за доставка!');
    return valid;
  }
  return true;
}

function ckValidateField(el) {
  if (!el.value.trim()) { el.classList.add('error'); el.classList.remove('valid'); }
  else { el.classList.remove('error'); el.classList.add('valid'); }
}

function ckValidateEmail(el) {
  const ok = el.value.trim() && el.value.includes('@') && el.value.includes('.');
  el.classList.toggle('error', !ok);
  el.classList.toggle('valid', !!ok);
}

function updateCheckoutSteps(active) {
  [1,2,3].forEach(n => {
    const step = document.getElementById('cs'+n);
    const num = document.getElementById('csn'+n);
    step.classList.remove('active','done');
    if (n < active) {
      step.classList.add('done');
      num.textContent = '✓';
      step.style.cursor = 'pointer';
      step.onclick = () => showCheckoutStep(n);
    } else if (n === active) {
      step.classList.add('active');
      step.style.cursor = '';
      step.onclick = null;
    } else {
      num.textContent = n;
      step.style.cursor = '';
      step.onclick = null;
    }
  });
}

function submitOrder() {
  // Validate required fields
  const required = [
    ['ckFirst','Ime'], ['ckLast','Familiya'], ['ckEmail','Email'], ['ckPhone','Telefon'],
    ['ckCity','Grad'], ['ckAddr','Adres']
  ];
  let valid = true;
  required.forEach(([id]) => {
    const el = document.getElementById(id);
    if (!el.value.trim()) { el.classList.add('error'); valid = false; }
    else el.classList.remove('error');
  });
  if (ckPaymentType === 'card') {
    ['ckCardNum','ckCardName','ckCardExp','ckCardCvv'].forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim()) { el.classList.add('error'); valid = false; }
      else el.classList.remove('error');
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
    const _prevOrders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    const orderNum = 'MC-' + String(_prevOrders.length + 1).padStart(6, '0');
    const subtotal = cart.reduce((s,x) => s + x.price*x.qty, 0);
    const delivery = ckDeliveryCosts[ckDeliveryIdx];
    const codFee = ckPaymentType === 'cod' ? 1.50 : 0;
    const promoDisc = promoApplied ? subtotal * 0.10 : 0;
    const total = subtotal + delivery + codFee - promoDisc;
    const payNames = {card:'Карта', cod:'Наложен платеж', bank:'Банков превод'};
    const now = new Date();
    const delivDays = ckDeliveryIdx === 2 ? 0 : ckDeliveryIdx === 1 ? 3 : 2;
    const delivDate = new Date(now.getTime() + delivDays * 86400000);
    const fmt = d => d.toLocaleDateString('bg-BG', {day:'numeric',month:'long'});

    // Populate thank-you page
    document.getElementById('tyOrderNum').textContent = orderNum;
    document.getElementById('tyEmail').textContent = document.getElementById('ckEmail').value;
    document.getElementById('tyDeliveryDate').textContent = ckDeliveryIdx === 2 ? 'При вземане от магазин' : fmt(delivDate);
    document.getElementById('tyPayment').textContent = payNames[ckPaymentType];
    document.getElementById('tyName').textContent = document.getElementById('ckFirst').value + ' ' + document.getElementById('ckLast').value;
    document.getElementById('tyPhone').textContent = document.getElementById('ckPhone').value;
    document.getElementById('tyCity').textContent = document.getElementById('ckCity').value;
    document.getElementById('tyAddr').textContent = document.getElementById('ckAddr').value + (document.getElementById('ckZip').value ? ', ' + document.getElementById('ckZip').value : '');
    document.getElementById('tyCourier').textContent = ckDeliveryNames[ckDeliveryIdx];
    document.getElementById('tyNote').textContent = document.getElementById('ckNote').value || '—';
    document.getElementById('tyTimestamp').textContent = now.toLocaleString('bg-BG');
    document.getElementById('tyDeliveryDateLine').textContent = ckDeliveryIdx === 2 ? 'Готова за вземане' : 'Очаквана: ' + fmt(delivDate);
    document.getElementById('tySubtotal').textContent = fmtEur(subtotal) + ' / ' + fmtBgn(subtotal);
    document.getElementById('tyDeliveryCost').textContent = delivery === 0 ? 'Безплатно' : fmtEur(delivery) + ' / ' + fmtBgn(delivery);
    document.getElementById('tyTotal').textContent = fmtEur(total) + ' / ' + fmtBgn(total);
    if (promoApplied) {
      document.getElementById('tyPromoRow').style.display = '';
      document.getElementById('tyPromoAmt').textContent = '-' + fmtEur(promoDisc) + ' / ' + fmtBgn(promoDisc);
    }
    document.getElementById('tyItems').innerHTML = cart.map(x => `
      <div class="ty-item">
        <div class="ty-item-emoji">${x.emoji}</div>
        <div class="ty-item-info">
          <div class="ty-item-name">${x.name}</div>
          <div class="ty-item-meta">${x.brand} · Количество: ${x.qty}</div>
        </div>
        <div class="ty-item-price">${fmtEur(x.price*x.qty)}<span class="text-11-muted-block">${fmtBgn(x.price*x.qty)}</span></div>
      </div>`).join('');

    // Save order to localStorage
    const orderData = {
      num: orderNum,
      customer: document.getElementById('ckFirst').value + ' ' + document.getElementById('ckLast').value,
      email: document.getElementById('ckEmail').value,
      phone: document.getElementById('ckPhone').value,
      city: document.getElementById('ckCity').value,
      addr: document.getElementById('ckAddr').value + (document.getElementById('ckZip').value ? ', ' + document.getElementById('ckZip').value : ''),
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
function toggleMobMenu(){document.getElementById('mobOverlay').classList.toggle('open');document.getElementById('mobDrawer').classList.toggle('open');}
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
      <div class="cp-upsell-item" onclick="openProductModal(${p.id});closeCartPage()">
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
  return products.filter(p => (!catFilter || p.cat === catFilter) && matchesQuery(p, q));
}

// Detect if query looks like SKU or EAN
function queryType(q) {
  if (/^\d{8,14}$/.test(q.trim())) return 'ean';
  if (/^mc-/i.test(q.trim())) return 'sku';
  return 'text';
}

function renderDropdown(query) {
  const cat = document.getElementById('searchCat').value;
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
             <div class="sd-recent-chip" onclick="applyRecentSearch('${s}')">
               🔍 ${s}
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
    if (qtype === 'ean') hint = '<div class="sd-empty-sub">Търсенето по EAN не намери продукт с баркод <strong>' + q + '</strong></div>';
    else if (qtype === 'sku') hint = '<div class="sd-empty-sub">Търсенето по SKU не намери продукт с код <strong>' + q + '</strong></div>';
    else hint = '<div class="sd-empty-sub">Провери правописа или опитай с SKU / EAN баркод</div>';
    searchDropdown.innerHTML = `
      <div class="sd-empty">
        <div class="sd-empty-icon">🔍</div>
        <div class="sd-empty-text">Няма резултати за "<strong>${q}</strong>"</div>
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
            <div class="sd-name">${highlightMatch(p.name, q)}</div>
            <div class="sd-meta">
              <span class="sd-brand">${p.brand}</span>
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
  openProductModal(id);
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

  const cat = document.getElementById('searchCat').value;
  let results = searchProducts(query, cat);
  const page = document.getElementById('searchResultsPage');
  document.getElementById('srpQuery').textContent = `"${query}"`;
  document.getElementById('srpCount').textContent = `${results.length} резултата`;
  // Breadcrumb
  const srpBc = document.getElementById('srpBreadcrumb');
  if (srpBc) srpBc.innerHTML = `<span class="srp-bc-item" onclick="closeSearchPage()">Начало</span><span class="srp-bc-sep">›</span><span class="srp-bc-item">Търсене</span><span class="srp-bc-sep">›</span><span class="srp-bc-current">${query}</span>`;

  // Category filter pills for SRP
  const cats = [...new Set(results.map(p => p.cat))];
  const catLabels = {audio:'Аудио',mobile:'Телефони',laptop:'Лаптопи',tablet:'Таблети',tv:'Телевизори',camera:'Камери',gaming:'Гейминг',smart:'Smart Home',network:'Мрежа',acc:'Аксесоари',print:'Принтери',components:'Компоненти',monitor:'Монитори',desktop:'Десктопи',storage:'Съхранение'};
  var _el_srpFilters=document.getElementById('srpFilters'); if(_el_srpFilters) _el_srpFilters.innerHTML = `
    <button type="button" class="srp-filter-pill active" onclick="srpFilter(this,'',${JSON.stringify(query)})">Всички (${results.length})</button>
    ${cats.map(c => `<button type="button" class="srp-filter-pill" onclick="srpFilter(this,'${c}',${JSON.stringify(query)})">${catLabels[c]||c} (${results.filter(p=>p.cat===c).length})</button>`).join('')}
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

function srpFilter(btn, cat, query) {
  document.querySelectorAll('.srp-filter-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const results = searchProducts(query, cat);
  document.getElementById('srpCount').textContent = `${results.length} резултата`;
  renderSRPGrid(results, query);
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
  if (!e.target.closest('.search-wrap')) closeSearchDropdown();
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

// Demo users (in real app this would be server-side)
const demoUsers = [
  { email: 'test@test.bg', password: '123456', firstName: 'Иван', lastName: 'Петров', phone: '0888123456' }
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

function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value;
  const errEl = document.getElementById('loginError');
  errEl.classList.remove('show');
  let valid = true;
  if (!email || !email.includes('@')) { document.getElementById('loginEmail').classList.add('error'); valid = false; }
  else document.getElementById('loginEmail').classList.remove('error');
  if (!pass) { document.getElementById('loginPassword').classList.add('error'); valid = false; }
  else document.getElementById('loginPassword').classList.remove('error');
  if (!valid) return;
  // Check credentials
  const user = demoUsers.find(u => u.email === email && u.password === pass);
  if (!user) { errEl.classList.add('show'); document.getElementById('loginPassword').classList.add('error'); return; }
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
  const fields = [
    ['regFirstName', fn.length > 0],
    ['regLastName', ln.length > 0],
    ['regEmail', email.includes('@')],
    ['regPassword', pw.length >= 6],
    ['regPassword2', pw === pw2 && pw.length >= 6],
  ];
  fields.forEach(([id, ok]) => { document.getElementById(id).classList.toggle('error', !ok); if (!ok) valid = false; });
  if (!valid) { errEl.textContent = pw !== pw2 ? '⚠ Паролите не съвпадат!' : '⚠ Моля провери данните!'; errEl.classList.add('show'); return; }
  if (demoUsers.find(u => u.email === email)) { errEl.textContent = '⚠ Имейлът вече е регистриран!'; errEl.classList.add('show'); document.getElementById('regEmail').classList.add('error'); return; }
  const newUser = { email, password: pw, firstName: fn, lastName: ln, phone: document.getElementById('regPhone').value };
  demoUsers.push(newUser);
  registerSuccess(newUser);
}

function handleForgot() {
  const email = document.getElementById('forgotEmail').value.trim();
  if (!email.includes('@')) { document.getElementById('forgotEmail').classList.add('error'); return; }
  document.getElementById('forgotEmail').classList.remove('error');
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
    if (topLogin) topLogin.textContent = `👋 ${currentUser.firstName}`;
    if (topReg) topReg.style.display = 'none';
    if (profileLabel) profileLabel.textContent = currentUser.firstName;
    if (profileIcon) profileIcon.innerHTML = `<div class="hdr-btn-avatar">${initials}</div>`;
    const pdAvatar = document.getElementById('pdAvatar'); if (pdAvatar) pdAvatar.textContent = initials;
    const pdName = document.getElementById('pdName'); if (pdName) pdName.textContent = `${currentUser.firstName} ${currentUser.lastName || ''}`.trim();
    const pdEmail = document.getElementById('pdEmail'); if (pdEmail) pdEmail.textContent = currentUser.email;
    showToast(`👋 Добре дошъл, ${currentUser.firstName}!`);
  } else {
    if (topLogin) topLogin.textContent = 'Вход';
    if (topReg) topReg.style.display = '';
    if (profileLabel) profileLabel.textContent = 'Профил';
    if (profileIcon) profileIcon.innerHTML = '👤';
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
let wishlist = JSON.parse(localStorage.getItem('mc_wishlist') || '[]');

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
    btn.textContent = wishlist.includes(id) ? '❤' : '♡';
    btn.classList.toggle('wishlisted', wishlist.includes(id));
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
  // Bottom nav badge
  const bnBadge = document.getElementById('bnWishBadge');
  if (bnBadge) { bnBadge.textContent = count; bnBadge.classList.toggle('show', count > 0); }
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
      const imgHtml = p.img
        ? `<img class="product-img-real" src="${p.img}" alt="${p.name}" loading="lazy" onload="this.classList.add('img-loaded')" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-img-emoji is-hidden" aria-hidden="true">${p.emoji}</span>`
        : `<span class="product-img-emoji">${p.emoji}</span>`;
      return `<div class="product-card pos-rel">
        <button type="button" class="wishlist-remove-btn" onclick="toggleWishlist(${p.id},{stopPropagation:()=>{}})" title="Премахни">×</button>
        <div class="product-img-wrap" onclick="openProductModal(${p.id});closeWishlist();" class="cursor-pointer">${imgHtml}</div>
        <div class="product-body">
          <div class="product-brand">${p.brand}</div>
          <div class="product-name">${p.name}</div>
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
  const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
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
    const items = (o.itemsData || []).map(x =>
      `<div class="mo-item-row">
        <span class="mo-item-emoji">${x.emoji||'📦'}</span>
        <div class="mo-item-info">
          <div class="mo-item-name">${x.name}</div>
          <div class="mo-item-meta">${x.brand} · ×${x.qty}</div>
        </div>
        <div class="mo-item-price">${fmtEur(x.price * x.qty)}</div>
      </div>`
    ).join('');
    return `
      <div class="mo-card">
        <div class="mo-card-header">
          <div>
            <div class="mo-card-num">${o.num}</div>
            <div class="mo-card-date">${o.date}</div>
          </div>
          <span class="mo-status ${statusClass[o.status] || 'mo-st-pending'}">${statusLabels[o.status] || o.status}</span>
        </div>
        <div class="mo-card-items">${items}</div>
        <div class="mo-card-footer">
          <span class="mo-card-delivery">🚚 ${o.deliveryType || '—'}</span>
          <div class="mo-card-total">
            <span class="mo-card-total-label">Общо:</span>
            <span class="mo-card-total-val">${fmtEur(o.total)} <span class="mo-card-total-bgn">/ ${fmtBgn(o.total)}</span></span>
          </div>
          <button type="button" class="mo-print-btn" onclick="printOrder('${o.num}')" title="Принтирай поръчката">
            <svg width="14" height="14" class="svg-ic" aria-hidden="true"><use href="#ic-printer"/></svg> Принтирай
          </button>
        </div>
      </div>`;
  }).join('');
}

function printOrder(num) {
  const orders = JSON.parse(localStorage.getItem('mc_orders') || '[]');
  const o = orders.find(x => x.num === num);
  if (!o) { showToast('Поръчката не е намерена'); return; }
  const statusLabels = { pending:'Изчаква', processing:'Обработва се', shipped:'Изпратена', delivered:'Доставена', cancelled:'Отказана', paid:'Платена' };
  const statusColors = { pending:'#f59e0b', paid:'#10b981', shipped:'#6366f1', delivered:'#10b981', cancelled:'#ef4444' };
  const delivery = o.delivery || 0;
  const subtotal = o.subtotal || (o.total - delivery);
  const items = (o.itemsData && o.itemsData.length)
    ? o.itemsData.map(x => `<tr><td>${x.emoji||''}${x.name}</td><td>${x.brand||''}</td><td style="text-align:center;">×${x.qty}</td><td style="text-align:right;font-weight:700;">${(x.price*x.qty).toFixed(2)} лв.<br><span style="font-size:10px;color:#6b7280;">${((x.price*x.qty)/1.95583).toFixed(2)} €</span></td></tr>`).join('')
    : `<tr><td colspan="4" style="color:#9ca3af;text-align:center;padding:16px;">${o.items||'—'}</td></tr>`;
  const win = window.open('', '_blank', 'width=760,height=700');
  win.document.write(`<!DOCTYPE html><html lang="bg"><head><meta charset="utf-8">
    <title>Фактура ${o.num} — Most Computers</title>
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
          <div class="inv-num">Поръчка ${o.num}</div>
          <div class="inv-date">Дата: ${o.date}</div>
          <div class="inv-date">Доставка: ${o.deliveryType||'—'} &nbsp;·&nbsp; Плащане: ${o.payment==='card'?'Карта':o.payment==='cod'?'Наложен платеж':'Банков превод'}</div>
          <div><span class="status-badge">${statusLabels[o.status]||o.status}</span></div>
        </div>
      </div>
      <div class="section">
        <div class="box">
          <div class="box-title">Клиент</div>
          <div class="box-val">
            <strong>${o.customer||'—'}</strong><br>
            ${o.email||''}<br>
            ${o.phone||''}
          </div>
        </div>
        <div class="box">
          <div class="box-title">Адрес за доставка</div>
          <div class="box-val">
            ${o.city||'—'}, ${o.addr||''}<br>
            ${o.zip ? 'ПК ' + o.zip : ''}
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
let recentlyViewed = JSON.parse(localStorage.getItem('mc_rv') || '[]');

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
    <div class="rv-card" onclick="openProductModal(${p.id})">
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

let _filterCache = null;
function _invalidateFilterCache(){ _filterCache = null; }
function getFilteredSorted(){
  const _cacheKey = JSON.stringify([currentFilter, currentSort, currentSubcat,
    typeof advFilterBrands!=='undefined'?[...advFilterBrands]:[],
    typeof advFilterRating!=='undefined'?advFilterRating:0,
    typeof advFilterSaleOnly!=='undefined'?advFilterSaleOnly:false,
    typeof advFilterNewOnly!=='undefined'?advFilterNewOnly:false,
    typeof advPriceMin!=='undefined'?advPriceMin:0,
    typeof advPriceMax!=='undefined'?advPriceMax:2000
  ]);
  if (_filterCache && _filterCache.key === _cacheKey) return _filterCache.list;
  let list=currentFilter==='all'?[...products]:products.filter(p=>p.cat===currentFilter);
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
  // Price range filter (EUR)
  if(typeof advPriceMin!=='undefined' && (advPriceMin>0 || advPriceMax<2000)){
    list=list.filter(p=>{ const eur=p.price/EUR_RATE; return eur>=advPriceMin && eur<=advPriceMax; });
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

function renderTopGrid(){
  _ensureTopSortBar();
  const list=getFilteredSorted();
  const grid=document.getElementById('topGrid');
  if (typeof showSkeletons === 'function') showSkeletons('topGrid', 8);
  const shown=list.slice(0, topGridPage * TOP_PAGE_SIZE);
  const hasMore=shown.length < list.length;
  // Sync sort select value
  const sel=document.getElementById('topSortSelect');if(sel) sel.value=currentSort;
  // Update count
  const cnt=document.getElementById('topSortCount');if(cnt) cnt.textContent=list.length+' продукта';
  grid.innerHTML=list.length===0
    ?`<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);">
        <div style="font-size:48px;margin-bottom:12px;">🔍</div>
        <div style="font-size:16px;font-weight:700;color:var(--text);">Няма продукти в тази категория</div>
        <div style="font-size:13px;margin-top:6px;">Опитай да смениш филтъра или добави продукти от Admin панела.</div>
      </div>`
    :shown.map(p=>makeCard(p)).join('')
    +(hasMore?`<div class="load-more-wrap" style="grid-column:1/-1;"><button type="button" class="load-more-btn" id="loadMoreBtn" onclick="topGridPage++;renderTopGrid()">Зареди още (${list.length-shown.length} продукта) ↓</button></div>`:'');
  const rc=document.getElementById('resultsCount');if(rc)rc.textContent=`${list.length} продукта`;
  compareList.forEach(id=>{const cb=document.getElementById('cmp-'+id);if(cb)cb.checked=true;});
  updateLiveCount(list.length);
  // Infinite scroll — auto-load when button enters viewport
  if (hasMore && 'IntersectionObserver' in window) {
    const btn = document.getElementById('loadMoreBtn');
    if (btn) {
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { obs.disconnect(); topGridPage++; renderTopGrid(); }
      }, { rootMargin: '200px' });
      obs.observe(btn);
    }
  }
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
  const _freeDelBgn = 200;
  const _freeDelEur = (_freeDelBgn / EUR_RATE).toFixed(2);
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
  if(typeof renderHpCats==='function') renderHpCats();
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
      <button type="button" class="mini-promo-view" onclick="event.stopPropagation();openProductModal(${p.id})">Виж →</button>
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
  if(minV > maxV-50){ minV=maxV-50; mn.value=minV; }
  srpPriceMinVal=minV; srpPriceMaxVal=maxV;
  document.getElementById('srpPriceVals').textContent = fmtBgn(minV) + ' — ' + fmtBgn(maxV);
  const rng = document.getElementById('sliderRange');
  if(rng){ rng.style.left=(minV/5000*100)+'%'; rng.style.width=((maxV-minV)/5000*100)+'%'; }
  let res = searchProducts(srpCurrentQuery, srpCurrentCatFilter).filter(p => p.price>=minV && p.price<=maxV);
  document.getElementById('srpCount').textContent = res.length + ' резултата';
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
  // Fixed brand list — 35 official brands
  const ALL_BRANDS = ['Intel', 'ASUS', 'Acer', 'Microsoft', 'Lenovo', 'Gigabyte', 'LG', 'HP', 'ADATA', 'Sapphire', 'Tenda', 'Kingston', 'Seagate', 'AMD', 'Seasonic', 'ASRock', 'Repotec', 'Realme', 'MSI', 'Tuncmatik', 'Palit', 'Nokia', 'Dynac', 'Cooler Master', 'Fractal', 'NZXT', 'Canon', 'Fnatic', 'GeIL', 'FSP Group', 'Omega', 'Inform UPS', 'QNAP', 'D-Link', 'AV Tech'];
  const brandCounts = {};
  products.forEach(p => { if(p.brand) brandCounts[p.brand] = (brandCounts[p.brand]||0) + 1; });
  const el = document.getElementById('brandFilterList');
  if (el) {
    el.innerHTML = ALL_BRANDS.map(b => {
      const c = brandCounts[b] || 0;
      return `<label class="brand-filter-item">
        <input type="checkbox" value="${b}" onchange="toggleBrandFilter('${b}',this.checked)">
        <span>${b}</span>
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

function updateActiveFiltersBar() {
  const bar = document.getElementById('activeFiltersBar');
  const chips = document.getElementById('activeFilterChips');
  if (!bar || !chips) return;
  const active = [];
  advFilterBrands.forEach(b => active.push({ label: '🏷 '+b, remove: ()=>{ const cb=document.querySelector(`input[type=checkbox][value="${b}"]`); if(cb){cb.checked=false;} advFilterBrands.delete(b); applyAdvFilters(); } }));
  if (advFilterRating > 0) active.push({ label:`⭐ ${advFilterRating}+`, remove:()=>{ document.querySelector('input[name="ratingFilter"][value="0"]').checked=true; applyAdvFilters(); } });
  if (advFilterSaleOnly) active.push({ label:'🔥 Само намалени', remove:()=>{ document.getElementById('saleOnlyToggle').checked=false; applyAdvFilters(); } });
  if (advFilterNewOnly)  active.push({ label:'🆕 Само нови',     remove:()=>{ document.getElementById('newOnlyToggle').checked=false;  applyAdvFilters(); } });
  if (advFilterStockOnly) active.push({ label:'✓ В наличност',   remove:()=>{ document.getElementById('stockOnlyToggle').checked=false; applyAdvFilters(); } });
  if (typeof advPriceMin!=='undefined' && (advPriceMin>0||advPriceMax<2000)) active.push({ label:`💰 ${advPriceMin}€–${advPriceMax}€`, remove:()=>{ setPriceGroup(0,2000,'pg-all'); applyAdvFilters(); } });
  if (active.length === 0) { bar.classList.remove('show'); return; }
  bar.classList.add('show');
  chips.innerHTML = active.map((f,i) =>
    `<span class="active-filter-chip" onclick="(${f.remove.toString()})()">${f.label} ✕</span>`
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
  setPriceGroup(0, 2000, 'pg-all');
  clearBrandSearch();
  applyAdvFilters();
}

// Adv filters applied inside getFilteredSorted directly (no override needed)

// Override filterCat to scroll + filter
function filterCat(cat) {
  const pill = document.querySelector(`.filter-pill[onclick*="'${cat}'"]`);
  if (pill) { applyFilter(pill, cat); }
  else { currentFilter = cat; renderTopGrid(); }
  const featured = document.getElementById('featured');
  if (featured) featured.scrollIntoView({behavior:'smooth'});
  if (typeof bcOnFilterCat === 'function') bcOnFilterCat(cat);
}

// Init on load
// initSidebarFilters called in DOMContentLoaded

// Export for tests/environment detection

// ===== SIDEBAR PRICE SLIDER =====
let advPriceMin = 0, advPriceMax = 2000, activePriceGroup = 'pg-all';
// EUR_RATE comes from currency.js

function updateSbSlider() {
  const mn = document.getElementById('sbPriceMin');
  const mx = document.getElementById('sbPriceMax');
  if (!mn || !mx) return;
  let minV = parseFloat(mn.value), maxV = parseFloat(mx.value);
  if (minV > maxV - 10) { minV = maxV - 10; mn.value = minV; }
  advPriceMin = minV; advPriceMax = maxV;

  // Update track fill
  const pct1 = (minV/2000)*100, pct2 = (maxV/2000)*100;
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
  const pct1 = (minEur/2000)*100, pct2 = (maxEur/2000)*100;
  const rng = document.getElementById('sbSliderRange');
  if (rng) { rng.style.left=pct1+'%'; rng.style.width=(pct2-pct1)+'%'; }

  // Update label
  const vals = document.getElementById('sbPriceVals');
  if (vals) vals.textContent = minEur === 0 && maxEur === 2000 ? 'Всички цени' : `${minEur} € — ${maxEur} €`;

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
      const eur = p.price / EUR;
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
  laptop: [
    { id: 'gaming',      label: '🎮 Геймърски' },
    { id: 'business',   label: '💼 Бизнес' },
    { id: 'ultrabook',  label: '✈ Ултрабук' },
    { id: 'workstation',label: '🔬 Workstation' },
    { id: 'budget',     label: '💰 Бюджетни' },
  ],
  mobile: [
    { id: 'flagship',   label: '👑 Флагмани' },
    { id: 'midrange',   label: '⚡ Среден клас' },
    { id: 'budget',     label: '💰 Бюджетни' },
    { id: 'foldable',   label: '🔄 Сгъваеми' },
  ],
  tablet: [
    { id: 'pro',        label: '💼 Pro' },
    { id: 'kids',       label: '👦 За деца' },
    { id: 'drawing',    label: '✏ За рисуване' },
    { id: 'budget',     label: '💰 Бюджетни' },
  ],
  tv: [
    { id: 'oled',       label: '✨ OLED' },
    { id: 'qled',       label: '💡 QLED' },
    { id: 'small',      label: '📺 до 43"' },
    { id: 'large',      label: '🖥 55"+' },
    { id: '4k',         label: '4K Ultra HD' },
    { id: '8k',         label: '8K' },
  ],
  audio: [
    { id: 'wireless',   label: '📶 Безжични' },
    { id: 'nc',         label: '🔇 Noise Cancelling' },
    { id: 'earbuds',    label: '🎵 True Wireless' },
    { id: 'studio',     label: '🎤 Студийни' },
    { id: 'gaming_h',   label: '🎮 Геймърски' },
  ],
  camera: [
    { id: 'mirrorless', label: '📷 Mirrorless' },
    { id: 'dslr',       label: '📷 DSLR' },
    { id: 'action',     label: '🏄 Action' },
    { id: 'instant',    label: '🖼 Моментални' },
  ],
  gaming: [
    { id: 'console',    label: '🕹 Конзоли' },
    { id: 'pc',         label: '🖥 PC Гейминг' },
    { id: 'accessories',label: '🎮 Аксесоари' },
    { id: 'chairs',     label: '🪑 Геймърски столове' },
  ],
  smart: [
    { id: 'watch',      label: '⌚ Смарт часовници' },
    { id: 'home',       label: '🏠 Умен дом' },
    { id: 'fitness',    label: '🏃 Фитнес' },
    { id: 'speaker',    label: '📣 Смарт тонколони' },
  ],
  network: [
    { id: 'router',     label: '📶 Рутери' },
    { id: 'switch',     label: '🔌 Суичове' },
    { id: 'wifi6',      label: 'WiFi 6/6E' },
    { id: 'mesh',       label: '🔗 Mesh системи' },
  ],
  components: [
    { id: 'cpu_intel',  label: '🔵 Intel процесори' },
    { id: 'cpu_amd',    label: '🔴 AMD процесори' },
    { id: 'gpu',        label: '🎮 Видеокарти' },
    { id: 'ram',        label: '🧠 RAM памет' },
    { id: 'motherboard',label: '🔩 Дънни платки' },
    { id: 'storage',    label: '💾 Дискове' },
    { id: 'psu',        label: '⚡ Захранвания' },
  ],
};

// Mega-menu flyout data: category → columns → items
const MEGA_MENU = {
  components: [
    { title: 'Процесори', id: 'cpu_intel', items: ['Intel Core i3 / i5 / i7 / i9', 'Intel Core Ultra', 'AMD Ryzen 5 / 7 / 9', 'AMD Threadripper'] },
    { title: 'Видеокарти', id: 'gpu', items: ['nVidia GeForce', 'AMD Radeon', 'Работни карти'] },
    { title: 'RAM памет', id: 'ram', items: ['DDR4', 'DDR5', 'SO-DIMM (лаптоп)'] },
    { title: 'Дънни платки', id: 'motherboard', items: ['Intel LGA1700', 'Intel LGA1851', 'AMD AM4', 'AMD AM5'] },
    { title: 'SSD дискове', id: 'storage', items: ['SATA SSD', 'M.2 NVMe', 'M.2 PCIe 5.0'] },
    { title: 'Захранвания', id: 'psu', items: ['до 550W', '600–800W', '850W+', 'Модулни'] },
  ],
  laptop: [
    { title: 'Геймърски', id: 'gaming', items: ['RTX 4060', 'RTX 4070', 'RTX 4080 / 4090', 'До 1500 лв.'] },
    { title: 'Бизнес', id: 'business', items: ['ThinkPad', 'EliteBook', 'Latitude', 'MacBook Pro'] },
    { title: 'Ултрабуци', id: 'ultrabook', items: ['MacBook Air', 'Dell XPS', 'LG Gram', 'До 1.5 кг.'] },
    { title: 'Бюджетни', id: 'budget', items: ['До 500 €', 'Chromebook', 'Студентски'] },
  ],
  mobile: [
    { title: 'Флагмани', id: 'flagship', items: ['iPhone 16 Pro', 'Samsung S25 Ultra', 'Google Pixel 9'] },
    { title: 'Среден клас', id: 'midrange', items: ['Samsung A серия', 'Xiaomi', 'OnePlus'] },
    { title: 'Бюджетни', id: 'budget', items: ['До 300 лв.', 'Dual SIM', 'Голяма батерия'] },
  ],
  audio: [
    { title: 'Слушалки', id: 'nc', items: ['Over-ear', 'On-ear', 'Noise Cancelling', 'Геймърски'] },
    { title: 'True Wireless', id: 'earbuds', items: ['AirPods', 'Sony WF', 'Samsung Buds', 'Xiaomi'] },
    { title: 'Тонколони', id: 'wireless', items: ['Bluetooth', 'Смарт', 'Hi-Fi', 'Саундбар'] },
  ],
  tv: [
    { title: 'По тип панел', id: 'oled', items: ['OLED', 'QD-OLED', 'QLED', 'LED'] },
    { title: 'По размер', id: 'small', items: ['до 43"', '50" – 55"', '65"', '75"+'] },
    { title: 'По резолюция', id: '4k', items: ['Full HD', '4K UHD', '8K'] },
  ],
  gaming: [
    { title: 'Конзоли', id: 'console', items: ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch'] },
    { title: 'PC Гейминг', id: 'pc', items: ['Гейминг компютри', 'Гейминг лаптопи', 'Компоненти'] },
    { title: 'Аксесоари', id: 'accessories', items: ['Геймпади', 'Слушалки', 'Мишки', 'Клавиатури'] },
    { title: 'Столове', id: 'chairs', items: ['Геймърски столове', 'Офис столове'] },
  ],
  network: [
    { title: 'Рутери', id: 'router', items: ['WiFi 6', 'WiFi 6E', 'WiFi 7', 'Mesh системи'] },
    { title: 'Суичове', id: 'switch', items: ['8 порта', '16 порта', 'Managed', 'PoE'] },
  ],
  smart: [
    { title: 'Смарт часовници', id: 'watch', items: ['Apple Watch', 'Samsung Galaxy Watch', 'Garmin', 'Xiaomi Band'] },
    { title: 'Умен дом', id: 'home', items: ['Смарт лампи', 'Smart Hub', 'Камери', 'Термостати'] },
    { title: 'Фитнес', id: 'fitness', items: ['Фитнес гривни', 'GPS часовници', 'Пулсомери'] },
  ],
  monitor: [
    { title: 'По резолюция', id: 'res', items: ['Full HD 1080p', 'QHD 1440p', '4K UHD', 'Ultra-Wide'] },
    { title: 'По диагонал', id: 'size', items: ['24"', '27"', '32"', '34" Ultra-Wide', '49" Super-Wide'] },
    { title: 'По тип панел', id: 'panel', items: ['IPS', 'VA', 'OLED', 'Mini-LED'] },
    { title: 'Gaming монитори', id: 'gaming', items: ['144 Hz', '165 Hz', '240 Hz+', 'G-Sync / FreeSync'] },
  ],
  desktop: [
    { title: 'Gaming компютри', id: 'gaming', items: ['RTX 4070', 'RTX 4080 / 4090', 'AMD Radeon', 'Готови системи'] },
    { title: 'Mac', id: 'mac', items: ['Mac Mini M4', 'Mac Studio', 'iMac', 'Mac Pro'] },
    { title: 'All-in-One', id: 'aio', items: ['За офис', 'За дома', 'За творчество'] },
    { title: 'Workstation', id: 'ws', items: ['3D & CAD', 'Видео монтаж', 'Сървъри'] },
  ],
  storage: [
    { title: 'SSD дискове', id: 'ssd', items: ['M.2 NVMe', 'SATA SSD', 'PCIe 5.0', 'Portable SSD'] },
    { title: 'HDD дискове', id: 'hdd', items: ['2.5" Портативен', '3.5" Desktop', 'NAS дискове'] },
    { title: 'RAM памет', id: 'ram', items: ['DDR4', 'DDR5', 'SO-DIMM (лаптоп)'] },
    { title: 'Flash памет', id: 'flash', items: ['USB флаш', 'SD карти', 'MicroSD'] },
  ],
};

// Category-specific spec filters

const CAT_SPEC_FILTERS = {
  laptop: [
    { key: 'CPU',        label: '💻 Процесор',           values: ['Intel Core i3','Intel Core i5','Intel Core i7','Intel Core i9','AMD Ryzen 5','AMD Ryzen 7','AMD Ryzen 9','Apple M3','Apple M4'] },
    { key: 'RAM',        label: '🧠 Оперативна памет',    values: ['8 GB','16 GB','32 GB','64 GB'] },
    { key: 'Display',    label: '📐 Диагонал',            values: ['13"','14"','15.6"','16"','17"'] },
    { key: 'GPU',        label: '🎮 Видеокарта',          values: ['RTX 4050','RTX 4060','RTX 4070','RTX 4080','RTX 4090','Integrated','Apple GPU'] },
    { key: 'OS',         label: '🪟 Операционна система', values: ['Windows 11','macOS','Linux','Без OS'] },
  ],
  gaming: [
    { key: 'CPU',        label: '💻 Процесор',            values: ['Intel Core i7','Intel Core i9','AMD Ryzen 7','AMD Ryzen 9'] },
    { key: 'RAM',        label: '🧠 RAM',                 values: ['16 GB','32 GB','64 GB'] },
    { key: 'GPU',        label: '🎮 Видеокарта',          values: ['RTX 4060','RTX 4070','RTX 4080','RTX 4090','AMD Radeon'] },
    { key: 'Display',    label: '📐 Диагонал',            values: ['15.6"','16"','17"','18"'] },
  ],
  mobile: [
    { key: 'OS',         label: '📱 Операционна система', values: ['Android','iOS'] },
    { key: 'RAM',        label: '🧠 RAM',                 values: ['6 GB','8 GB','12 GB','16 GB'] },
    { key: 'Storage',    label: '💾 Памет',               values: ['128 GB','256 GB','512 GB','1 TB'] },
    { key: 'Battery',    label: '🔋 Батерия',             values: ['4000+ mAh','5000+ mAh','6000+ mAh'] },
  ],
  tablet: [
    { key: 'OS',         label: '📱 Операционна система', values: ['Android','iPadOS','Windows'] },
    { key: 'Display',    label: '📐 Диагонал',            values: ['8"','10"','11"','12"','13"'] },
    { key: 'RAM',        label: '🧠 RAM',                 values: ['4 GB','6 GB','8 GB','12 GB','16 GB'] },
    { key: 'Storage',    label: '💾 Памет',               values: ['64 GB','128 GB','256 GB','512 GB'] },
    { key: 'Connectivity', label: '📡 Свързаност',        values: ['WiFi','WiFi + 4G','WiFi + 5G'] },
  ],
  tv: [
    { key: 'Size',       label: '📐 Диагонал',            values: ['43"','50"','55"','65"','75"','85"'] },
    { key: 'Panel',      label: '🖥 Тип панел',           values: ['OLED','QD-OLED','QLED','IPS','VA'] },
    { key: 'Resolution', label: '🔍 Резолюция',           values: ['Full HD','4K UHD','8K'] },
    { key: 'SmartOS',    label: '📺 Smart OS',            values: ['Android TV','Tizen','webOS','Google TV'] },
    { key: 'HDR',        label: '✨ HDR',                 values: ['HDR10','HDR10+','Dolby Vision'] },
  ],
  audio: [
    { key: 'Type',       label: '🎧 Тип',                 values: ['Over-ear','On-ear','In-ear','True Wireless'] },
    { key: 'Connection', label: '🔗 Връзка',              values: ['Bluetooth','Кабел','Безжични'] },
    { key: 'NoiseCancelling', label: '🔇 Шумопотискане', values: ['Active NC','Passive NC','Без NC'] },
    { key: 'Battery',    label: '🔋 Батерия',             values: ['20+ часа','30+ часа','40+ часа'] },
  ],
  camera: [
    { key: 'Type',       label: '📷 Тип',                 values: ['Mirrorless','DSLR','Action Camera','Компактна'] },
    { key: 'Sensor',     label: '🖼 Сензор',              values: ['Full Frame','APS-C','Micro 4/3','1"'] },
    { key: 'Resolution', label: '🔢 Резолюция',           values: ['20 MP+','30 MP+','45 MP+','60 MP+'] },
    { key: 'Mount',      label: '🔩 Байонет',             values: ['Sony E','Canon RF','Nikon Z','GoPro'] },
  ],
  network: [
    { key: 'WiFi',       label: '📡 WiFi стандарт',       values: ['WiFi 5','WiFi 6','WiFi 6E','WiFi 7'] },
    { key: 'Ports',      label: '🔌 Портове',             values: ['4 порта','8 порта','16+ порта'] },
  ],
  smart: [
    { key: 'Type',       label: '⌚ Тип',                 values: ['Смарт часовник','Смарт лента','Smart Home'] },
    { key: 'Compatibility', label: '📱 Съвместимост',    values: ['iOS','Android','Universal'] },
  ],
  print: [
    { key: 'Type',       label: '🖨 Тип принтер',         values: ['Лазерен','Мастиленоструен','Многофункционален'] },
    { key: 'Color',      label: '🎨 Цветен',              values: ['Цветен','Черно-бял'] },
    { key: 'Connection', label: '🔗 Връзка',              values: ['USB','WiFi','Ethernet'] },
  ],
  components: [
    { key: 'Type',     label: '📦 Тип компонент',         values: ['Процесор','Видеокарта','RAM','Дънна платка','SSD','HDD','Захранване'] },
    { key: 'Brand',    label: '🏷 Производител',          values: ['Intel','AMD','NVIDIA','ASUS','MSI','Gigabyte','Corsair','Kingston','Samsung','Seasonic'] },
    { key: 'Socket',   label: '🔩 Сокет / Слот',         values: ['LGA1700','LGA1851','AM4','AM5','DDR4','DDR5','PCIe 4.0','PCIe 5.0'] },
    { key: 'TDP',      label: '🌡 TDP / Мощност',        values: ['35W','65W','105W','125W','170W','450W','550W','650W','750W','850W'] },
  ],
  monitor: [
    { key: 'Resolution', label: '🔍 Резолюция',           values: ['Full HD 1080p','QHD 1440p','4K UHD','Ultra-Wide'] },
    { key: 'Size',       label: '📐 Диагонал',            values: ['24"','27"','32"','34"','49"'] },
    { key: 'Panel',      label: '🖥 Тип панел',           values: ['IPS','VA','OLED','Mini-LED'] },
    { key: 'RefreshRate', label: '⚡ Честота',            values: ['60 Hz','144 Hz','165 Hz','240 Hz+'] },
  ],
  desktop: [
    { key: 'CPU',        label: '💻 Процесор',            values: ['Intel Core i5','Intel Core i7','Intel Core i9','AMD Ryzen 7','AMD Ryzen 9','Apple M4'] },
    { key: 'RAM',        label: '🧠 Оперативна памет',    values: ['16 GB','32 GB','64 GB','128 GB'] },
    { key: 'GPU',        label: '🎮 Видеокарта',          values: ['RTX 4070','RTX 4080','RTX 4090','AMD Radeon','Интегрирана'] },
    { key: 'OS',         label: '🪟 Операционна система', values: ['Windows 11','macOS','Без OS'] },
  ],
  storage: [
    { key: 'Type',       label: '💾 Тип',                 values: ['SSD M.2 NVMe','SSD SATA','HDD 2.5"','HDD 3.5"','Портативен SSD','Портативен HDD','RAM','USB Flash'] },
    { key: 'Interface',  label: '🔌 Интерфейс',           values: ['PCIe 5.0','PCIe 4.0','SATA III','USB-C','USB-A','DDR5','DDR4'] },
    { key: 'Capacity',   label: '📦 Капацитет',           values: ['256 GB','512 GB','1 TB','2 TB','4 TB+'] },
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
  renderTopGrid();
}

function renderCatSpecFilters(cat) {
  const block = document.getElementById('catSpecFilterBlock');
  const inner = document.getElementById('catSpecFiltersInner');
  const title = document.getElementById('catSpecTitle');
  if (!block || !inner) return;

  catSpecActiveFilters = {};
  const specs = CAT_SPEC_FILTERS[cat];
  if (!specs || !specs.length) {
    block.style.display = 'none';
    return;
  }

  const CAT_LABELS = {
    laptop:'Лаптопи', mobile:'Телефони', tablet:'Таблети', tv:'Телевизори',
    audio:'Аудио', camera:'Фотоапарати', gaming:'Гейминг', smart:'Смарт',
    network:'Мрежово', print:'Принтери', acc:'Аксесоари'
  };
  if (title) title.textContent = `⚙ ${CAT_LABELS[cat] || cat} — филтри`;

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
  const name  = (p.name  || '').toLowerCase();
  const desc  = (p.desc  || '').toLowerCase();
  const brand = (p.brand || '').toLowerCase();
  const specsStr = Object.values(p.specs || {}).join(' ').toLowerCase();
  const all = name + ' ' + desc + ' ' + specsStr;

  const rules = {
    // Laptop subcats
    gaming:      () => all.includes('gaming') || all.includes('rog') || all.includes('rtx') || all.includes('геймърски') || p.cat === 'gaming',
    business:    () => all.includes('business') || all.includes('thinkpad') || all.includes('latitude') || all.includes('elitebook') || all.includes('бизнес'),
    ultrabook:   () => all.includes('ultra') || all.includes('air') || all.includes('slim') || p.price < 3000,
    workstation: () => all.includes('workstation') || all.includes('xeon') || all.includes('quadro') || p.price > 4000,
    budget:      () => (p.price / EUR_RATE) < 500,
    // Mobile
    flagship:    () => (p.price / EUR_RATE) > 700 || all.includes('pro') || all.includes('ultra') || all.includes('plus'),
    midrange:    () => { const eur = p.price/EUR_RATE; return eur >= 250 && eur <= 700; },
    foldable:    () => all.includes('fold') || all.includes('flip') || all.includes('сгъв'),
    // Tablet
    pro:         () => all.includes('pro') || (p.price/EUR_RATE) > 500,
    kids:        () => all.includes('kid') || all.includes('junior') || all.includes('дет'),
    drawing:     () => all.includes('draw') || all.includes('stylus') || all.includes('pen'),
    // TV
    oled:        () => all.includes('oled'),
    qled:        () => all.includes('qled') || all.includes('neo'),
    small:       () => all.includes('32') || all.includes('40') || all.includes('43'),
    large:       () => all.includes('55') || all.includes('65') || all.includes('75') || all.includes('85'),
    '4k':        () => all.includes('4k') || all.includes('uhd'),
    '8k':        () => all.includes('8k'),
    // Audio
    wireless:    () => all.includes('wireless') || all.includes('bluetooth') || all.includes('безжич'),
    nc:          () => all.includes('noise') || all.includes('anc') || all.includes('шумопотиск'),
    earbuds:     () => all.includes('earbud') || all.includes('true wireless') || all.includes('tws'),
    studio:      () => all.includes('studio') || all.includes('monitor') || all.includes('студий'),
    gaming_h:    () => all.includes('gaming') || all.includes('геймърски'),
    // Camera
    mirrorless:  () => all.includes('mirrorless') || all.includes('alpha') || all.includes('eos r'),
    dslr:        () => all.includes('dslr') || all.includes('rebel') || all.includes('d5') || all.includes('d7'),
    action:      () => all.includes('gopro') || all.includes('action') || all.includes('hero'),
    instant:     () => all.includes('instax') || all.includes('polaroid') || all.includes('моментал'),
    // Network
    router:      () => all.includes('router') || all.includes('рутер') || all.includes('ax') || all.includes('wi-fi'),
    switch:      () => all.includes('switch') || all.includes('суич'),
    wifi6:       () => all.includes('wifi 6') || all.includes('wi-fi 6') || all.includes('ax'),
    mesh:        () => all.includes('mesh') || all.includes('deco') || all.includes('orbi'),
    // Gaming
    console:     () => all.includes('playstation') || all.includes('xbox') || all.includes('nintendo'),
    pc:          () => all.includes('gaming pc') || all.includes('rtx') || all.includes('rx 6') || all.includes('rx 7'),
    accessories: () => all.includes('headset') || all.includes('mouse') || all.includes('keyboard') || all.includes('gamepad'),
    chairs:      () => all.includes('chair') || all.includes('стол') || all.includes('gaming chair'),
    // Smart
    watch:       () => all.includes('watch') || all.includes('часов') || all.includes('band') || all.includes('fit'),
    home:        () => all.includes('smart home') || all.includes('умен') || all.includes('hue') || all.includes('hub'),
    fitness:     () => all.includes('fitness') || all.includes('band') || all.includes('фитнес') || all.includes('sport'),
    speaker:     () => all.includes('speaker') || all.includes('echo') || all.includes('тонколона') || all.includes('smart speaker'),
    // Components
    cpu_intel:   () => brand.includes('intel') || all.includes('intel') || all.includes('core i') || all.includes('core ultra') || all.includes('pentium') || all.includes('celeron') || all.includes('xeon'),
    cpu_amd:     () => brand.includes('amd') || all.includes('amd') || all.includes('ryzen') || all.includes('threadripper') || all.includes('athlon') || all.includes('epyc'),
    gpu:         () => all.includes('видеокарт') || all.includes('gpu') || all.includes('geforce') || all.includes('radeon') || all.includes('rtx') || all.includes('rx 6') || all.includes('rx 7') || all.includes('arc'),
    ram:         () => all.includes(' ram') || all.includes('памет') || all.includes('ddr4') || all.includes('ddr5') || all.includes('dimm') || all.includes('sodimm'),
    motherboard: () => all.includes('дънна') || all.includes('motherboard') || all.includes('mainboard') || all.includes('платка'),
    storage:     () => all.includes('ssd') || all.includes('hdd') || all.includes('nvme') || all.includes('диск') || all.includes('m.2'),
    psu:         () => all.includes('захранван') || all.includes('psu') || all.includes('power supply') || all.includes(' w ') || (all.includes('watt') && !all.includes('battery')),
  };

  const fn = rules[subcat];
  return fn ? fn() : true;
}

// Cat-spec filter matching
function matchesCatSpec(p) {
  const keys = Object.keys(catSpecActiveFilters);
  if (!keys.length) return true;
  const specsStr = Object.values(p.specs || {}).join(' ');
  const all = (p.name + ' ' + p.desc + ' ' + specsStr).toLowerCase();
  return keys.every(key => {
    const vals = catSpecActiveFilters[key];
    return [...vals].some(v => all.includes(v.toLowerCase()));
  });
}


// ===== 1. URL PARAMS FOR FILTERS =====
function updateURL() {
  const params = new URLSearchParams();
  if (currentFilter !== 'all') params.set('cat', currentFilter);
  if (currentSort !== 'bestseller') params.set('sort', currentSort);
  if (advFilterBrands.size > 0) params.set('brand', [...advFilterBrands].join(','));
  if (advFilterRating > 0) params.set('rating', advFilterRating);
  if (advFilterSaleOnly) params.set('sale', '1');
  if (advFilterNewOnly) params.set('new', '1');
  if (advPriceMin > 0) params.set('priceMin', advPriceMin);
  if (advPriceMax < 2000) params.set('priceMax', advPriceMax);
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
      if (typeof renderCatSpecFilters === 'function') renderCatSpecFilters(currentFilter);
      if (typeof bcOnFilterCat === 'function') bcOnFilterCat(currentFilter);
    }
    renderTopGrid();
    updateActiveFiltersBar();
  }
  if (params.get('product')) { setTimeout(()=>openProductModal(parseInt(params.get('product'))),400); }
}

// URL + skeleton + carousel hooks — using var to avoid redeclaration
var _urlHooked = false;
if (!_urlHooked) {
  _urlHooked = true;

  var _baseApplyFilter = applyFilter;
  applyFilter = function(btn, cat) { _baseApplyFilter(btn, cat); updateURL(); };

  var _baseApplySort = applySort;
  applySort = function(val) { _baseApplySort(val); updateURL(); };

  var _baseApplyAdvFilters = applyAdvFilters;
  applyAdvFilters = function() { _baseApplyAdvFilters(); updateURL(); };

  var _baseOpenProductModal = openProductModal;
  openProductModal = function(id) {
    showModalSkeleton();
    setTimeout(() => {
      _baseOpenProductModal(id);
      renderRelated(id);
      updateURL();
      document.dispatchEvent(new CustomEvent('mc:productopen', {detail: id}));
    }, 280);
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
  module.exports = { getFilteredSorted, advFilterBrands, renderGrids };
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
  // Find and click the subcat pill with this id
  setTimeout(() => {
    const pill = document.querySelector(`.subcat-pill[onclick*="'${id}'"]`);
    if (pill) { pill.click(); }
  }, 100);
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
  setTimeout(() => openOrderTracker(orderNum ? 'MC-' + orderNum.replace('MC-','').trim() : ''), 300);
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


// ===== PRODUCT PAGE =====
let pdpProductId = null;
let pdpQtyVal    = 1;
let pdpGallery   = [];
let pdpGalleryIdx = 0;

const CAT_LABELS = {
  audio:'Аудио',mobile:'Телефони',laptop:'Лаптопи',tablet:'Таблети',
  tv:'Телевизори',camera:'Фотоапарати',gaming:'Гейминг',smart:'Смарт устройства',
  network:'Мрежово оборудване',print:'Принтери',acc:'Аксесоари',
  components:'Компоненти',monitor:'Монитори',desktop:'Десктопи',storage:'Съхранение'
};

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
      { label: _bcCatLabel, fn: _bcCatFn },
      { label: p.name, fn: null }
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
    document.getElementById('pdpOld').textContent = fmtBgn(p.old) + ' / ' + fmtEur(p.old);
    document.getElementById('pdpSave').textContent = '-' + Math.round((p.old-p.price)/p.old*100) + '%';
    oldRow.style.display = 'flex';
  } else {
    oldRow.style.display = 'none';
  }
  var _el_pdpMonthly=document.getElementById('pdpMonthly'); if(_el_pdpMonthly) _el_pdpMonthly.innerHTML = '';

  // Stock
  const inStock = p.stock !== false;
  const stockEl = document.getElementById('pdpStock');
  stockEl.className = 'pdp-stock ' + (inStock ? 'in' : 'out');
  document.getElementById('pdpStockTxt').textContent = inStock ? 'В наличност' : 'Изчерпан';
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
  let specRows = `<tr><td>SKU / Part Number</td><td style="font-family:'JetBrains Mono',monospace;font-size:12px;">${p.sku||'—'}</td></tr>`;
  if (p.ean) specRows += `<tr><td>EAN / Баркод</td><td style="font-family:'JetBrains Mono',monospace;font-size:12px;">${p.ean}</td></tr>`;
  specRows += Object.entries(specs).map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');
  tbody.innerHTML = specRows || '<tr><td colspan="2" style="color:var(--muted);text-align:center;padding:24px;">Няма данни за спецификации.</td></tr>';

  // ── Description (HTML) ──
  const htmlContent = document.getElementById('pdpHtmlContent');
  if (p.htmlDesc) {
    htmlContent.innerHTML = p.htmlDesc;
  } else if (p.desc) {
    htmlContent.innerHTML = `<p style="font-size:14px;line-height:1.8;color:var(--text2);">${p.desc}</p>`;
  } else {
    htmlContent.innerHTML = '<p style="color:var(--muted);font-size:13px;">Няма добавено описание за този продукт.</p>';
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

  pdpSwitchTab('specs');
  pdpUpdateStickyBar(p);
  pdpInitDeliveryTimer();
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
  _schemaTag.textContent = JSON.stringify([
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": p.name,
      "image": p.img ? [p.img] : [],
      "description": p.desc || p.name,
      "brand": { "@type": "Brand", "name": p.brand || '' },
      "sku": p.sku || '',
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "BGN",
        "price": p.price,
        "availability": p.stock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        "seller": { "@type": "Organization", "name": "Most Computers" }
      },
      ...(_avgRating && _rvCount ? {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": _avgRating,
          "reviewCount": _rvCount
        }
      } : {})
    },
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
    mainImg.style.display = '';
    mainEmoji.style.display = 'none';
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
      <span class="related-card-emoji">${r.emoji}</span>
      <div class="related-card-name">${r.name}</div>
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
    drop.innerHTML = `<div class="pdp-drop-empty">Няма намерени продукти за <strong>${q}</strong></div>`;
    drop.style.display = '';
    return;
  }

  drop.innerHTML = _pdpSrchResults.map((p, i) => {
    const price = typeof formatPrice === 'function' ? formatPrice(p.price) : p.price + ' лв.';
    const img = p.img
      ? `<img src="${p.img}" alt="" class="pdp-drop-img" loading="lazy">`
      : `<span class="pdp-drop-emoji">${p.emoji || '📦'}</span>`;
    return `<div class="pdp-drop-item" role="option" data-idx="${i}" onmousedown="pdpSearchPick(${i})">
      <div class="pdp-drop-thumb">${img}</div>
      <div class="pdp-drop-info">
        <div class="pdp-drop-name">${p.name}</div>
        <div class="pdp-drop-price">${price}</div>
      </div>
    </div>`;
  }).join('') +
  `<div class="pdp-drop-all" onmousedown="pdpSearchGo(document.getElementById('pdpSearchInput').value)">
    Виж всички резултати за „${q}" →
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
// ===== BREADCRUMBS =====
// State: array of {label, action}  — action is a function or null for current
let _bcTrail = []; // [{label, fn}]

const BC_CAT_LABELS = {
  all:'Всички продукти',
  audio:'Аудио и слушалки', mobile:'Телефони', laptop:'Лаптопи и компютри',
  tablet:'Таблети', tv:'Телевизори', camera:'Фотоапарати', gaming:'Гейминг',
  smart:'Смарт устройства', network:'Мрежово оборудване', print:'Принтери', acc:'Аксесоари',
  sale:'Промоции', new:'Нови продукти',
  monitor:'Монитори', desktop:'Десктопи', storage:'Съхранение'
};

function bcRender() {
  const inner = document.getElementById('bcInner');
  if (!inner) return;

  // Always start with Home
  const crumbs = [{ label: 'Начало', fn: () => { closeProductPage(); bcSet([]); } }, ..._bcTrail];

  const html = crumbs.map((c, i) => {
    const isLast = i === crumbs.length - 1;
    const sep    = i > 0 ? '<span class="bc-sep" aria-hidden="true">›</span>' : '';
    if (isLast) {
      return `${sep}<div class="bc-item current" aria-current="page"><span title="${c.label}">${c.label}</span></div>`;
    }
    return `${sep}<div class="bc-item"><button type="button" onclick="(${c.fn.toString()})()">${c.label}</button></div>`;
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
    "item": window.location.href.split('#')[0] + '#' + c.label.toLowerCase().replace(/\s+/g,'-')
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
    bcSet([{
      label,
      fn: () => { filterCat(cat); bcSet([{ label, fn: () => filterCat(cat) }]); }
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



// ===== 5. JSON-LD STRUCTURED DATA =====
function injectProductSchema(p) {
  let el = document.getElementById('product-jsonld');
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = 'product-jsonld'; document.head.appendChild(el); }
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": p.name,
    "brand": { "@type": "Brand", "name": p.brand },
    "sku": p.sku,
    "gtin13": p.ean,
    "description": p.desc,
    "offers": {
      "@type": "Offer",
      "url": `${location.href.split('?')[0]}?product=${p.id}`,
      "priceCurrency": "BGN",
      "price": p.price,
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
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
  const twImg = document.querySelector('meta[name="twitter:image"]');
  if (twImg) {
    const imgSrc = (Array.isArray(p.gallery) && p.gallery[0]) ? p.gallery[0]
      : (p.img || 'https://mostcomputers.bg/og-default.jpg');
    twImg.setAttribute('content', imgSrc);
  }
});

// ===== 6. SITEMAP GENERATOR =====
function generateSitemap() {
  const base = 'https://mostcomputers.bg';
  const today = new Date().toISOString().split('T')[0];
  const staticPages = [
    { url: '/', priority: '1.0', freq: 'daily' },
    { url: '/?cat=mobile', priority: '0.9', freq: 'weekly' },
    { url: '/?cat=laptop', priority: '0.9', freq: 'weekly' },
    { url: '/?cat=tv', priority: '0.8', freq: 'weekly' },
    { url: '/?cat=audio', priority: '0.8', freq: 'weekly' },
    { url: '/?cat=camera', priority: '0.7', freq: 'weekly' },
    { url: '/?cat=gaming', priority: '0.7', freq: 'weekly' },
    { url: '/?cat=tablet', priority: '0.7', freq: 'weekly' },
    { url: '/?cat=monitor', priority: '0.7', freq: 'weekly' },
    { url: '/?cat=desktop', priority: '0.7', freq: 'weekly' },
    { url: '/?cat=storage', priority: '0.6', freq: 'weekly' },
    { url: '/?cat=components', priority: '0.6', freq: 'weekly' },
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
  laptop:  { emoji:'💻', icon:'ic-laptop',     label:'Лаптопи и компютри',   sub:'Notebook, Gaming, Ultrabook', badge:null },
  mobile:  { emoji:'📱', icon:'ic-phone',      label:'Смартфони',             sub:'Android, iPhone, 5G', badge:'Ново' },
  tablet:  { emoji:'📟', icon:'ic-tablet',     label:'Таблети',               sub:'iPad, Android, E-Reader', badge:null },
  audio:   { emoji:'🎧', icon:'ic-headphones', label:'Аудио и слушалки',      sub:'Bluetooth, Hi-Fi, ANC', badge:null },
  tv:      { emoji:'📺', icon:'ic-tv',         label:'Телевизори',            sub:'OLED, QLED, 4K, 8K', badge:null },
  camera:  { emoji:'📷', icon:'ic-camera',     label:'Фотоапарати',           sub:'Mirrorless, DSLR, GoPro', badge:null },
  gaming:  { emoji:'🎮', icon:'ic-gamepad',    label:'Гейминг',               sub:'PC, Конзоли, Аксесоари', badge:'Hot' },
  smart:   { emoji:'⌚', icon:'ic-watch',      label:'Смарт устройства',      sub:'Часовници, Smart Home', badge:null },
  network: { emoji:'📡', icon:'ic-wifi',       label:'Мрежово оборудване',    sub:'Рутери, Суичове, Wi-Fi 6', badge:null },
  print:   { emoji:'🖨', icon:'ic-printer',    label:'Принтери',              sub:'Лазерни, Мастиленоструйни', badge:null },
  acc:     { emoji:'🖱', icon:'ic-mouse',      label:'Аксесоари',             sub:'Мишки, Клавиатури, Кабели', badge:null },
  components: { emoji:'🔲', icon:'ic-cpu',     label:'Компоненти',            sub:'Процесори, Видеокарти, RAM, Дънни платки', badge:null },
  monitor: { emoji:'🖥', icon:'ic-monitor',   label:'Монитори',              sub:'4K, Gaming, UltraWide', badge:null },
  desktop: { emoji:'🖥', icon:'ic-desktop',   label:'Десктопи',              sub:'Gaming PC, Mac Mini, All-in-One', badge:null },
  storage: { emoji:'💾', icon:'ic-storage',   label:'Съхранение',            sub:'SSD, HDD, RAM, Flash', badge:null },
  new:     { emoji:'🆕', icon:'ic-star',       label:'Нови продукти',         sub:'Пресни пристигания', badge:'NEW' },
  sale:    { emoji:'%',  icon:'ic-tag',        label:'Намаления',             sub:'До -60% на избрани продукти', badge:'SALE' },
};
const HP_CAT_ORDER = ['laptop','mobile','gaming','tv','audio','tablet','components','acc'];

// ═══════════════════════════════════════
// RENDER HOMEPAGE CATEGORY CARDS
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
// CATEGORY PAGE STATE
// ═══════════════════════════════════════
let cpCat = 'all';
let cpSort = 'bestseller';
let cpPriceMin = 0, cpPriceMax = 2000;
let cpBrands = new Set();
let cpRating = 0;
let cpSaleOnly = false, cpNewOnly = false;
let cpSpecFilters = {};

let _catPageScrollY = 0;
function openCatPage(cat) {
  _catPageScrollY = window.scrollY || document.documentElement.scrollTop;
  cpCat = cat;
  cpSort = 'bestseller';
  cpPriceMin = 0; cpPriceMax = 2000;
  cpBrands = new Set();
  cpRating = 0; cpSaleOnly = false; cpNewOnly = false;
  cpSpecFilters = {};

  const m = CAT_META[cat] || { emoji:'🗂', label: cat, sub:'' };
  const cpEmoji = document.getElementById('cpEmoji');
  const cpTitle = document.getElementById('cpTitle');
  const cpSubtitle = document.getElementById('cpSubtitle');
  if (cpEmoji) cpEmoji.textContent = m.emoji;
  if (cpTitle) cpTitle.textContent = m.label;
  if (cpSubtitle) cpSubtitle.textContent = m.sub;

  // Build sidebar HTML
  buildCpSidebar(cat);

  // Update SEO
  document.title = m.label + ' | Most Computers';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', m.label + ' — ' + m.sub + '. Купи онлайн от Most Computers.');

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
  document.title = 'Most Computers — Техника и Електроника';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', 'Лаптопи, Телефони, Таблети, ТВ и аудио техника. Най-добрите цени в България.');
  // Restore Open Graph defaults
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', 'Most Computers | Електроника от 1997 г. — Лаптопи, Телефони, Телевизори');
  const ogImg = document.querySelector('meta[property="og:image"]');
  if (ogImg) ogImg.setAttribute('content', 'https://mostcomputers.bg/og-default.jpg');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', 'https://mostcomputers.bg/');
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
    p.cat === cat || (cat === 'new' && p.badge === 'new') || (cat === 'sale' && p.badge === 'sale'));
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
  cpUpdateSlider();
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
  else if (cpCat !== 'all') list = list.filter(p => p.cat === cpCat);
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
      const sv = p.specs[key] || p.specs[Object.keys(p.specs).find(k => k.toLowerCase() === key.toLowerCase())] || '';
      return [...vals].some(v => sv.toString().toLowerCase().includes(v.toLowerCase()));
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
}
function closeBlogPage() {
  document.getElementById('blogPage').classList.remove('open');
  document.body.style.overflow = '';
}
function openServicePage() {
  document.getElementById('servicePage').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeServicePage() {
  document.getElementById('servicePage').classList.remove('open');
  document.body.style.overflow = '';
}
function openDeliveryPage() {
  document.getElementById('deliveryPage').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDeliveryPage() {
  document.getElementById('deliveryPage').classList.remove('open');
  document.body.style.overflow = '';
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
function scrollToTop() {
  window.scrollTo({top:0,behavior:'smooth'});
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
    navigator.clipboard.writeText(addr).then(() => showToast('📋 Адресът е копиран!'));
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
    navigator.clipboard.writeText(code).then(() => showToast('📍 Plus Code е копиран!'));
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
  try{history.pushState({ page: 'about' }, '', '?page=about');}catch(e){}
}
function closeAboutPage() {
  const page = document.getElementById('aboutPage');
  if (!page) return;
  page.classList.remove('open');
  setTimeout(() => { page.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
  try{history.back();}catch(e){}
}

document.addEventListener('DOMContentLoaded', () => {
  renderHpCats();
  renderRecentlyDiscounted();
});
// migrate any remaining inline onclick attributes into data-action
function migrateInlineClickHandlers() {
  document.querySelectorAll('[onclick]').forEach(el => {
    const code = el.getAttribute('onclick');
    if (!code) return;
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
              a = a.trim().replace(/^['"`]|['"`]$/g, '');
              return (!isNaN(a) && a !== '') ? Number(a) : a;
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
window.onerror = function(msg, src, line, col, err) {
  console.error('[MC Error]', msg, src, line, col, err);
  if (typeof showToast === 'function') {
    showToast('⚠️ Нещо се обърка. Моля опресни страницата.');
  }
  return true; // prevent default browser error
};
window.addEventListener('unhandledrejection', function(e) {
  console.error('[MC Unhandled Promise]', e.reason);
  if (typeof showToast === 'function') {
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
  document.getElementById('contactPage').classList.remove('open');
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


// All scripts are deferred — DOM is ready, call directly
initDataActions();
initSidebarFilters();
renderGrids();
loadCart();
renderHpCats();
renderRecentlyDiscounted();
initSectionAnimations();
initScrollAnimations();
