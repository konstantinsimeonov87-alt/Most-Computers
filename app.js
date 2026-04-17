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
  { id:1,  sku:'MC-SONY-WH1000XM6', ean:'4548736132511', img:'https://www.sony.com/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=600', name:'Sony WH-1000XM6 Безжични слушалки', brand:'Sony',    cat:'peripherals',   emoji:'🎧', price:449,  old:549,  badge:'sale', pct:18, rating:4.9, rv:124, stock:18,
    specs:{Тип:'Over-ear', Тип_аудио:'Over-ear', Връзка:'Bluetooth 5.3', Батерия:'30 часа', ANC:'Да', ANC_filter:'С ANC', Тегло:'254g', Гаранция:'2 год.', Warranty:'24 месеца'},
    desc:'Sony WH-1000XM6 са флагманските шумопотискащи слушалки на Sony с индустриално водещо качество на звука. Разполагат с процесор QN3 за адаптивно шумопотискане, LDAC кодек за Hi-Res аудио и 30 часа живот на батерията.',
    reviews:[{name:'Петър Г.',stars:5,date:'02.03.2025',text:'Невероятно качество на звука! Шумопотискането е на друго ниво спрямо конкурентите.'},{name:'Мария С.',stars:5,date:'15.02.2025',text:'Носят се много удобно дори при дълги пътувания. Препоръчвам!'}] },
  { id:2,  sku:'MC-APPL-IP16PM-512', ean:'0195949769702', img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-white-titanium-select?wid=600&hei=600&fmt=png-alpha',  name:'iPhone 16 Pro Max 512GB Titanium',    brand:'Apple',   cat:'phones',  emoji:'📱', price:2599, old:null, badge:'new',  pct:0,  rating:4.8, rv:89, stock:false,
    specs:{Дисплей:'6.9" OLED', Чип:'A18 Pro', Камера:'48MP + 12MP', Батерия:'4685 mAh', RAM:'8 GB', RAM_raw:'8GB', Памет:'512 GB', Памет_raw:'512GB', ОС:'iOS', Мрежа:'5G', Warranty:'12 месеца'},
    desc:'iPhone 16 Pro Max с чип A18 Pro задава нов стандарт за производителност. Камерна система с 48MP основен сензор, оптична стабилизация и нови функции с Apple Intelligence.',
    reviews:[{name:'Георги Т.',stars:5,date:'20.03.2025',text:'Най-добрият телефон, който съм имал!'},{name:'Иванка П.',stars:4,date:'10.03.2025',text:'Отличен телефон, малко скъп, но си заслужава!'}] },
  { id:3,  sku:'MC-SAMS-S95C-55', ean:'8806094914948', img:'https://images.samsung.com/is/image/samsung/p6pim/levant/qa55s95cakxfe/gallery/levant-oled-s95c-qa55s95cakxfe-thumb-535683452?$684_547_PNG$',  name:'Samsung 55" OLED 4K S95C Smart TV',   brand:'Samsung', cat:'accessories',      emoji:'📺', price:1799, old:2199, badge:'sale', pct:18, rating:4.7, rv:56, stock:25,
    specs:{Размер:'55"', Диагонал_ТВ:'55"', Панел:'QD-OLED', Резолюция:'4K UHD', HDR:'HDR10+', Smart:'Tizen OS', HDMI:'4x HDMI 2.1', Refresh:'120Hz', Warranty:'24 месеца'},
    desc:'Samsung S95C с QD-OLED панел съчетава перфектния контраст на OLED с яркостта на квантовите точки.',
    reviews:[{name:'Стефан М.',stars:5,date:'05.03.2025',text:'Картината е зашеметяваща!'},{name:'Деница В.',stars:4,date:'18.02.2025',text:'Много доволна от покупката.'}] },
  { id:4,  sku:'MC-SONY-A7V', ean:'4548736162617', img:'https://www.bhphotovideo.com/images/images2500x2500/sony_ilce_7m5_b_alpha_a7_iv_mirrorless_1664946.jpg',  name:'Sony Alpha 7 V Mirrorless Camera',    brand:'Sony',    cat:'peripherals',  emoji:'📷', price:3499, old:null, badge:'hot',  pct:0,  rating:4.9, rv:32, stock:3,
    specs:{Сензор:'50MP Full-Frame', Тип_камера:'Mirrorless', Стабилизация:'8-axis IBIS', AF:'AI следене', Видео:'4K 120fps', Буфер:'1000+ кадра', Тегло:'514g', Warranty:'24 месеца'},
    desc:'Sony Alpha 7 V е революционна пълнокадрова камера с 50MP BSI сензор и AI-базирана система за автофокус.',
    reviews:[{name:'Николай Ф.',stars:5,date:'01.03.2025',text:'Невероятен автофокус! Следи перфектно движещи се обекти.'}] },
  { id:5,  sku:'MC-APPL-IPADPRO13', ean:'0195949872649', img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-wifi-spacegray-202405?wid=600&hei=600&fmt=png-alpha',  name:'iPad Pro 13" M4 OLED 256GB WiFi',     brand:'Apple',   cat:'phones',  emoji:'📟', price:1649, old:1999, badge:'sale', pct:17, rating:4.8, rv:78, stock:5,
    specs:{Дисплей:'13" Ultra Retina XDR', Диагонал:'13"', Чип:'M4', Памет:'256 GB', Памет_raw:'256GB', RAM:'8 GB', RAM_raw:'8GB', Камера:'12MP', Батерия:'10 часа', ОС:'iPadOS', Мрежа:'WiFi', Warranty:'12 месеца'},
    desc:'iPad Pro с M4 чип и нов Ultra Retina XDR OLED дисплей е най-мощният iPad досега.',
    reviews:[{name:'Борис Н.',stars:5,date:'22.02.2025',text:'Дисплеят е просто невероятен. Идеален за дизайнери.'}] },
  { id:6,  sku:'MC-XIAO-14TPRO-512', ean:'6941812764992', img:'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-14t-pro/M/daf3d95a9a0fd8d90e6d4c0a3b6afb6e.png',  name:'Xiaomi 14T Pro 512GB черен',          brand:'Xiaomi',  cat:'phones',  emoji:'📱', price:999,  old:1199, badge:'sale', pct:17, rating:4.6, rv:145, stock:30,
    specs:{Дисплей:'6.67" AMOLED', Чип:'Dimensity 9300+', Камера:'Leica 50MP', Батерия:'5000 mAh', Зареждане:'120W', RAM:'12 GB', RAM_raw:'12GB', Памет:'512 GB', Памет_raw:'512GB', ОС:'Android', Мрежа:'5G', Warranty:'24 месеца'},
    desc:'Xiaomi 14T Pro с камерна система Leica предлага флагмански характеристики на достъпна цена. Зарежда от 0 до 100% само за 19 минути.',
    reviews:[{name:'Тодор С.',stars:5,date:'12.03.2025',text:'Страхотно съотношение цена/качество!'},{name:'Анна М.',stars:4,date:'03.03.2025',text:'Много добра камера за цената.'}] },
  { id:7,  sku:'MC-BOSE-QCULT', ean:'017817845014', img:'https://assets.bose.com/content/dam/cloudassets/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc_ultra_headphones/product_silo_images/QCUltraHeadphones_White_EC_Hero.png/jcr:content/renditions/cq5dam.web.600.600.png',  name:'Bose QuietComfort Ultra Headphones',  brand:'Bose',    cat:'peripherals',   emoji:'🎧', price:599,  old:749,  badge:'sale', pct:20, rating:4.7, rv:203, stock:14,
    specs:{Тип:'Over-ear', Тип_аудио:'Over-ear', Връзка:'Bluetooth 5.3', Батерия:'24 часа', ANC:'CustomTune', ANC_filter:'С ANC', Тегло:'251g', Гаранция:'2 год.', Warranty:'24 месеца'},
    desc:'Bose QC Ultra с революционната технология Immersive Audio създава пространствен звук около теб.',
    reviews:[{name:'Красимир Д.',stars:5,date:'08.03.2025',text:'Пространственото аудио е магия! Незаменими за пътувания.'}] },
  { id:8,  sku:'MC-ASUS-ROGZ16-4080', ean:'4711387491928', img:'https://dlcdnwebimgs.asus.com/gain/AF6D21FC-3FA8-4068-8A93-5A6B6F47AEA1/w717/h525',  name:'ASUS ROG Zephyrus G16 RTX 4080',      brand:'ASUS',    cat:'gaming',  emoji:'💻', price:3799, old:4299, badge:'sale', pct:12, rating:4.9, rv:54, stock:4,
    specs:{Процесор:'AMD Ryzen 9 8945HS', CPU:'AMD Ryzen 9', RAM:'32 GB', RAM_raw:'32GB', Диск:'2 TB NVMe', SSD:'2TB', GPU:'RTX 4080 12GB', Видеокарта:'NVIDIA', Дисплей:'16" QHD 240Hz', Диагонал:'16"', ОС:'Windows 11', Батерия:'90Wh', Warranty:'24 месеца'},
    desc:'ASUS ROG Zephyrus G16 е ултра-тънък гейминг лаптоп с RTX 4080. 240Hz QHD дисплей и MUX Switch за максимална производителност.',
    reviews:[{name:'Владимир К.',stars:5,date:'15.03.2025',text:'Играе всичко на ultra настройки!'}] },
  { id:9,  sku:'MC-CANO-MF466DW', ean:'4549292198614', img:'https://www.bhphotovideo.com/images/images500x500/canon_5803c002_imageclass_mf462dw_wireless_1686582786_1745673.jpg',  name:'Canon ImageCLASS Laser Printer MF',   brand:'Canon',   cat:'peripherals',   emoji:'🖨', price:289,  old:359,  badge:'sale', pct:19, rating:4.5, rv:88, stock:22,
    specs:{Тип:'Лазерен', Функции:'Принт/Скан/Копир', Скорост:'36 стр./мин', WiFi:'Да', ADF:'50 листа', Тонер:'2000 стр.'},
    desc:'Canon ImageCLASS е компактен безжичен лазерен принтер с автоматичен двустранен печат.',
    reviews:[{name:'Елена Т.',stars:4,date:'20.03.2025',text:'Бърз и тих принтер. Идеален за домашен офис.'}] },
  { id:10,  sku:'MC-LOGI-MX3S', ean:'5099206103627', img:'https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/mx-master-3s/mx-master-3s-top-graphite.png', name:'Logitech MX Master 3S Мишка',         brand:'Logitech',cat:'accessories',     emoji:'🖱', price:159,  old:189,  badge:'sale', pct:16, rating:4.8, rv:312, stock:40,
    specs:{Сензор:'8000 DPI', Връзка:'Bluetooth / USB', Батерия:'70 дни', Бутони:'7', Скрол:'MagSpeed', Тегло:'141g'},
    desc:'Logitech MX Master 3S е перфектната мишка за продуктивност с безшумни бутони и MagSpeed електромагнитен скрол.',
    reviews:[{name:'Симеон Г.',stars:5,date:'25.02.2025',text:'Най-добрата мишка за работа!'},{name:'Цветелина Й.',stars:5,date:'14.02.2025',text:'Много удобна и точна.'}] },
  { id:11,  sku:'MC-DELL-XPS15-I9', ean:'884116437635', img:'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/gray/notebook-xps-15-9530-gray-gallery-3.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402', name:'Dell XPS 15 i9 / RTX 4070 32GB',      brand:'Dell',    cat:'laptops',  emoji:'💻', price:3299, old:null, badge:'hot',  pct:0,  rating:4.8, rv:41, stock:8,
    specs:{Процесор:'Intel Core i9-14900H', CPU:'Intel Core i9', RAM:'32 GB', RAM_raw:'32GB', Диск:'1 TB SSD', SSD:'1TB', GPU:'RTX 4070 8GB', Видеокарта:'NVIDIA', Дисплей:'15.6" OLED 3.5K', Диагонал:'15.6"', ОС:'Windows 11', Батерия:'86Wh', Warranty:'24 месеца'},
    desc:'Dell XPS 15 с OLED дисплей 3.5K и RTX 4070 е идеален за творци и разработчици. Intel Core i9-14900H, 32GB RAM и 1TB NVMe SSD осигуряват изключителна производителност при видео монтаж и 3D рендеринг.',
    bundle:[10, 1], bundleDiscount:12,
    reviews:[{name:'Радослав В.',stars:5,date:'10.03.2025',text:'OLED дисплеят е невероятен!'}] },
  { id:12,  sku:'MC-APPL-AWU2-49', ean:'0194253425007', img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra2-49-titanium-trail-loop-beige-white-M-L-geo?wid=600&hei=600&fmt=png-alpha', name:'Apple Watch Ultra 2 49mm Titanium',   brand:'Apple',   cat:'accessories',   emoji:'⌚', price:1299, old:1599, badge:'sale', pct:19, rating:4.8, rv:112, stock:false,
    specs:{Корпус:'49mm Titanium', Дисплей:'2.1" OLED', GPS:'L1+L2', Батерия:'60 часа', Водоустойчивост:'100m', Чип:'S9'},
    desc:'Apple Watch Ultra 2 е проектиран за екстремни спортове с Titanium корпус и прецизен GPS.',
    reviews:[{name:'Калоян М.',stars:5,date:'28.02.2025',text:'Издръжлив и точен. Батерията издържа 2 дни.'}] },
  { id:13,  sku:'MC-SAMS-TABS9P-256', ean:'8806094878608', img:'https://images.samsung.com/levant/smartphones/galaxy-tab-s9-plus/images/galaxy-tab-s9-plus-graphite-back.jpg', name:'Samsung Galaxy Tab S9+ 256GB',        brand:'Samsung', cat:'phones',  emoji:'📟', price:899,  old:1099, badge:'sale', pct:18, rating:4.7, rv:67, stock:35,
    specs:{Дисплей:'12.4" Dynamic AMOLED', Диагонал:'12.4"', Чип:'Snapdragon 8 Gen 2', Памет:'256 GB', Памет_raw:'256GB', RAM:'12 GB', RAM_raw:'12GB', Камера:'13MP', Батерия:'10090 mAh', ОС:'Android', Мрежа:'WiFi + 5G', Warranty:'24 месеца'},
    desc:'Samsung Galaxy Tab S9+ е флагманска Android таблет с Dynamic AMOLED 2X дисплей и S Pen.',
    reviews:[{name:'Анастасия Л.',stars:4,date:'05.03.2025',text:'Отличен дисплей и S Pen в кутията!'}] },
  { id:14,  sku:'MC-GOPR-H13-BLACK', ean:'818279028197', img:'https://community.gopro.com/t5/image/serverpage/image-id/148637i9FF2AA716C50F9F2/image-size/large', name:'GoPro Hero 13 Black Edition',         brand:'GoPro',   cat:'peripherals',  emoji:'📷', price:549,  old:null, badge:'new',  pct:0,  rating:4.7, rv:88, stock:19,
    specs:{Видео:'5.3K 60fps', Тип_камера:'Action Camera', Стабилизация:'HyperSmooth 6.0', Водоустойчивост:'10m', Батерия:'89 мин.', Дисплей:'2.27"', Тегло:'154g', Warranty:'12 месеца'},
    desc:'GoPro Hero 13 Black с HyperSmooth 6.0 е незаменим за екшън снимки. Поддържа 5.3K видео.',
    reviews:[{name:'Орлин С.',stars:5,date:'18.03.2025',text:'Страхотна action камера! Стабилизацията е невероятна.'}] },
  { id:15,  sku:'MC-TPLI-AX6000', ean:'6935364010706', img:'https://static.tp-link.com/Archer_AX6000_1.0_05_large_1523940987070t.jpg', name:'TP-Link WiFi 6 Router AX6000',        brand:'TP-Link', cat:'network', emoji:'📡', price:299,  old:399,  badge:'sale', pct:25, rating:4.6, rv:156, stock:28,
    specs:{Стандарт:'WiFi 6 (802.11ax)', WiFi_стандарт:'WiFi 6', Скорост:'6000 Mbps', Обхват:'до 250 кв.м', Антени:'8x', Процесор:'1.8GHz', Портове:'4x Gigabit', Warranty:'24 месеца'},
    desc:'TP-Link AX6000 с WiFi 6 (802.11ax) осигурява ултрабърза безжична мрежа до 6000 Mbps за целия дом. 8 антени, 4 Gigabit порта и 1.8GHz процесор за едновременно свързване на 100+ устройства.',
    reviews:[{name:'Димитър Х.',stars:5,date:'22.03.2025',text:'Покрива перфектно цялото жилище.'}] },
  { id:16,  sku:'MC-PHIL-HUE-KIT', ean:'8719514264182', img:'https://www.assets.signify.com/is/image/PhilipsLighting/fp929002468801-philips-hue-white-and-color-ambiance-e27-starter-kit-2-pack?wid=600&hei=600', name:'Philips Hue Smart Lights Starter Kit',brand:'Philips', cat:'accessories',   emoji:'💡', price:229,  old:279,  badge:'sale', pct:18, rating:4.5, rv:167, stock:50,
    specs:{Крушки:'4x A60 E27', Протокол:'Zigbee', Цветове:'16 милиона', Управление:'App/Voice', Compatibility:'Alexa/Google', Гаранция:'2 год.'},
    desc:'Philips Hue стартов комплект с 4 крушки за пълен контрол над домашното осветление.',
    reviews:[{name:'Вера К.',stars:4,date:'15.03.2025',text:'Лесна инсталация и страхотни цветове!'}] },
  { id:99,  sku:'MC-APPL-MBP16-M4P', ean:'0195949842376', img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-m4pro-silver-select-202410?wid=600&hei=600&fmt=png-alpha', name:'MacBook Pro 16" M4 Pro 24GB',         brand:'Apple',   cat:'laptops',  emoji:'💻', price:4299, old:null, badge:'new',  pct:0,  rating:4.9, rv:73, stock:2,
    specs:{Чип:'M4 Pro', CPU:'Apple M4 Pro', RAM:'24 GB', RAM_raw:'24GB', Диск:'512 GB SSD', SSD:'512GB', Видеокарта:'Интегрирана', Дисплей:'16.2" Liquid Retina XDR', Диагонал:'16"', ОС:'macOS', Батерия:'до 24 часа', Порт:'3x Thunderbolt 4', Warranty:'12 месеца'},
    desc:'MacBook Pro с M4 Pro чип предоставя изключителна производителност. До 24 часа батерия.',
    bundle:[10, 7], bundleDiscount:10,
    reviews:[{name:'Христо В.',stars:5,date:'25.03.2025',text:'Невероятно бърз! Батерията е фантастична.'},{name:'Весела Н.',stars:5,date:'19.03.2025',text:'Перфектен за видео монтаж!'}] },

  // ── МОНИТОРИ ────────────────────────────────────────────────────────────────
  { id:101, sku:'MC-LG-27UK850', ean:'8806098293476', img:'https://www.lg.com/us/images/monitors/md07573612/gallery/medium01.jpg', name:'LG 27" 4K UHD IPS HDR Monitor', brand:'LG', cat:'monitors', emoji:'🖥', price:699, old:849, badge:'sale', pct:18, rating:4.7, rv:98, stock:12,
    specs:{Диагонал:'27"', Панел:'IPS', Резолюция:'4K UHD 3840×2160', Refresh:'60Hz', HDR:'HDR400', Входове:'2x HDMI 2.0 + DP 1.4', USB_C:'Да 60W', Warranty:'24 месеца', Size:'27"', Panel:'IPS', Resolution:'4K UHD', RefreshRate:'60 Hz'},
    desc:'LG 27UK850 с 4K IPS панел и USB-C зареждане е идеален за работа и съдържание. Nanoцветови технология за 98% DCI-P3.',
    reviews:[{name:'Мирослав Д.',stars:5,date:'10.03.2025',text:'Цветовете са страхотни, USB-C е много удобно!'},{name:'Таня Р.',stars:4,date:'01.03.2025',text:'Отличен монитор за цената.'}] },

  { id:102, sku:'MC-ASUS-ROG-PG27AQN', ean:'4711387398982', img:'https://dlcdnwebimgs.asus.com/gain/8D14F6D4-2D43-4E85-95F4-24C9E1F3C8A1/w717/h525', name:'ASUS ROG Swift Pro 27" 360Hz QHD', brand:'ASUS', cat:'monitors', emoji:'🖥', price:1299, old:1599, badge:'sale', pct:19, rating:4.9, rv:41, stock:9,
    specs:{Диагонал:'27"', Панел:'Fast IPS', Резолюция:'QHD 2560×1440', Refresh:'360Hz', Отговор:'1ms GTG', HDR:'HDR600', 'G-Sync':'Compatible', Warranty:'24 месеца', Size:'27"', Panel:'IPS', Resolution:'QHD 1440p', RefreshRate:'240 Hz+'},
    desc:'ASUS ROG Swift Pro с 360Hz е предпочитан от професионални геймъри. Ултра-бърз Fast IPS панел с 1ms отговор.',
    reviews:[{name:'Александър К.',stars:5,date:'18.03.2025',text:'360Hz са истинска разлика в шутъри!'},{name:'Пламен Н.',stars:5,date:'08.03.2025',text:'Най-добрият монитор за gaming!'}] },

  { id:103, sku:'MC-SAMS-LS34BG850', ean:'8806094742480', img:'https://images.samsung.com/levant/monitors/ls34bg850suxen/images/ls34bg850suxen_001_front_black.jpg', name:'Samsung Odyssey OLED G8 34" 175Hz', brand:'Samsung', cat:'monitors', emoji:'🖥', price:1499, old:1899, badge:'sale', pct:21, rating:4.8, rv:63, stock:7,
    specs:{Диагонал:'34"', Панел:'QD-OLED', Резолюция:'UWQHD 3440×1440', Refresh:'175Hz', Отговор:'0.1ms', HDR:'HDR10+', Кривина:'1800R', Warranty:'24 месеца', Size:'34"', Panel:'OLED', Resolution:'Ultra-Wide', RefreshRate:'165 Hz'},
    desc:'Samsung Odyssey OLED G8 съчетава перфектния OLED контраст с ултраширок 34" формат. Нулеви сенки и невероятна яркост.',
    reviews:[{name:'Борислав Е.',stars:5,date:'22.03.2025',text:'Картината е невероятна, OLED е следващото ниво!'},{name:'Соня М.',stars:4,date:'12.03.2025',text:'Широкият формат е перфектен за многозадачност.'}] },

  { id:104, sku:'MC-LG-34WP88C', ean:'8806091545282', img:'https://www.lg.com/us/images/monitors/md08003476/gallery/medium01.jpg', name:'LG 34" UltraWide QHD USB-C Monitor', brand:'LG', cat:'monitors', emoji:'🖥', price:899, old:1099, badge:'sale', pct:18, rating:4.6, rv:77, stock:11,
    specs:{Диагонал:'34"', Панел:'IPS', Резолюция:'UWQHD 3440×1440', Refresh:'100Hz', USB_C:'96W PD', HDR:'HDR10', Входове:'2x HDMI + DP + USB-C', Warranty:'24 месеца', Size:'34"', Panel:'IPS', Resolution:'Ultra-Wide', RefreshRate:'60 Hz'},
    desc:'LG 34WP88C с USB-C зареждане 96W е идеалният монитор за MacBook потребители. Ултраширок формат за максимална продуктивност.',
    reviews:[{name:'Стефания П.',stars:5,date:'05.03.2025',text:'Перфектен за лаптоп — само един кабел!'},{name:'Георги С.',stars:4,date:'25.02.2025',text:'Много по-продуктивен с широкия екран.'}] },

  // ── ДЕСКТОПИ ────────────────────────────────────────────────────────────────
  { id:111, sku:'MC-APPL-MACMINI-M4P', ean:'0195949872809', img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-mini-2024?wid=600&hei=600&fmt=png-alpha', name:'Apple Mac Mini M4 Pro 24GB 512GB', brand:'Apple', cat:'desktops', emoji:'🖥', price:2499, old:null, badge:'new', pct:0, rating:4.9, rv:38, stock:15,
    specs:{Чип:'M4 Pro', CPU:'Apple M4 Pro', RAM:'24 GB', RAM_raw:'24GB', Диск:'512 GB SSD', SSD:'512GB', Порт:'3x Thunderbolt 4 + 3x USB-A', HDMI:'2x HDMI 2.1', WiFi:'WiFi 6E', ОС:'macOS', Warranty:'12 месеца', GPU:'Интегрирана', OS:'macOS'},
    desc:'Mac Mini с M4 Pro е невероятно мощен и компактен. Поддържа до 3 монитора едновременно и е перфектен за творци и разработчици.',
    reviews:[{name:'Ивайло Г.',stars:5,date:'20.03.2025',text:'Невероятна производителност в малка кутия!'},{name:'Надежда К.',stars:5,date:'14.03.2025',text:'Перфектен за видео монтаж!'}] },

  { id:112, sku:'MC-ASUS-ROG-G22CH', ean:'4711387415222', img:'https://dlcdnwebimgs.asus.com/gain/8574C7E0-D5FC-4936-9F97-89F23B5F5A8F/w717/h525', name:'ASUS ROG G22CH Gaming Desktop RTX 4070', brand:'ASUS', cat:'desktops', emoji:'🖥', price:2799, old:3299, badge:'sale', pct:15, rating:4.8, rv:29, stock:false,
    specs:{Процесор:'Intel Core i7-13700F', CPU:'Intel Core i7', RAM:'16 GB', RAM_raw:'16GB', Диск:'1 TB NVMe', SSD:'1TB', GPU:'RTX 4070 12GB', Видеокарта:'NVIDIA', ОС:'Windows 11', Warranty:'24 месеца', OS:'Windows 11'},
    desc:'ASUS ROG G22CH е компактен гейминг компютър с RTX 4070 и Intel i7. Играе всичко на Ultra настройки.',
    reviews:[{name:'Теодор Б.',stars:5,date:'15.03.2025',text:'Страхотен PC в малка кутия! RTX 4070 лети.'}] },

  // ── ЛАПТОПИ ─────────────────────────────────────────────────────────────────
  { id:121, sku:'MC-LENO-X1C-13', ean:'196804694832', img:'https://www.lenovo.com/medias/lenovo-laptop-thinkpad-x1-carbon-gen-13-intel-gallery-1.jpg?context=bWFzdGVyfHJvb3R8MjU4MDM5fGltYWdlL2pwZWd8aGQ5L2g5NS8xMzkzNzE4MzA3ODMwMi5qcGd8YTkxZWNhZDA2Zjk2Y2QyM2E4OWQ4NjVhMzIyMTcwNjhiNDYyM2E1MjBlNDhkNTFjZWZmZmM2MDY1MTZlYTNiZg', name:'Lenovo ThinkPad X1 Carbon Gen 13 i7', brand:'Lenovo', cat:'laptops', emoji:'💻', price:2899, old:3399, badge:'sale', pct:15, rating:4.8, rv:55, stock:10,
    specs:{Процесор:'Intel Core Ultra 7 165H', CPU:'Intel Core Ultra', RAM:'32 GB', RAM_raw:'32GB', Диск:'1 TB SSD', SSD:'1TB', Видеокарта:'Интегрирана', Дисплей:'14" OLED 2.8K', Диагонал:'14"', ОС:'Windows 11 Pro', Батерия:'57Wh', Warranty:'36 месеца'},
    desc:'ThinkPad X1 Carbon е легендата сред бизнес лаптопите. Само 1.12 кг, MIL-SPEC издръжливост и 14" OLED дисплей.',
    reviews:[{name:'Росен А.',stars:5,date:'17.03.2025',text:'Перфектен бизнес лаптоп — лек и мощен!'},{name:'Кристина М.',stars:5,date:'07.03.2025',text:'ThinkPad клавиатурата е несравнима.'}] },

  { id:122, sku:'MC-MSFT-SUR-LAPTOP7', ean:'0889842979763', img:'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4OXRc?ver=2d5a&q=90&m=6&h=600&w=600&b=%23FFFFFF&f=jpg&o=f', name:'Microsoft Surface Laptop 7 15" i7', brand:'Microsoft', cat:'laptops', emoji:'💻', price:2199, old:2599, badge:'sale', pct:15, rating:4.7, rv:43, stock:3,
    specs:{Процесор:'Intel Core Ultra 7 165H', CPU:'Intel Core Ultra', RAM:'16 GB', RAM_raw:'16GB', Диск:'512 GB SSD', SSD:'512GB', Видеокарта:'Intel Arc', Дисплей:'15" PixelSense 2496×1664', Диагонал:'15"', ОС:'Windows 11', Батерия:'54Wh', Warranty:'12 месеца'},
    desc:'Microsoft Surface Laptop 7 с PixelSense дисплей и тъч екран е идеален за студенти и бизнес потребители.',
    reviews:[{name:'Елица В.',stars:5,date:'12.03.2025',text:'Дизайнът е луксозен, дисплеят е отличен!'},{name:'Никола П.',stars:4,date:'04.03.2025',text:'Много лек и бърз. Препоръчвам.'}] },

  // ── СМАРТФОНИ ────────────────────────────────────────────────────────────────
  { id:131, sku:'MC-SAMS-S25U-512', ean:'8806095523223', img:'https://images.samsung.com/levant/smartphones/galaxy-s25-ultra/images/galaxy-s25-ultra-titanium-black-front.jpg', name:'Samsung Galaxy S25 Ultra 512GB', brand:'Samsung', cat:'phones', emoji:'📱', price:2499, old:2799, badge:'sale', pct:11, rating:4.9, rv:112, stock:false,
    specs:{Дисплей:'6.9" Dynamic AMOLED 2X', Чип:'Snapdragon 8 Elite', Камера:'200MP + 50MP + 10MP + 50MP', Батерия:'5000 mAh', Зареждане:'45W', RAM:'12 GB', RAM_raw:'12GB', Памет:'512 GB', Памет_raw:'512GB', ОС:'Android', Мрежа:'5G', Warranty:'24 месеца'},
    desc:'Galaxy S25 Ultra с AI Galaxy Intelligence и вграден S Pen задава нов стандарт за Android флагшипи. 200MP камера с оптичен зуум 10×.',
    reviews:[{name:'Владимир Й.',stars:5,date:'21.03.2025',text:'S Pen е незаменим! Камерата е фантастична.'},{name:'Мариела Д.',stars:5,date:'11.03.2025',text:'Най-добрият Android на пазара!'}] },

  { id:132, sku:'MC-GOOG-PX9PRO-256', ean:'0840244705849', img:'https://lh3.googleusercontent.com/gHOTWz5EJTaEzKuabKjCkGYAC6qpTueFALvUcnfxVr5LYrSuIMuW_iL_tLVaIl_PXF3BrXA7_PFAeA8qoJgqI8sS7f', name:'Google Pixel 9 Pro 256GB Obsidian', brand:'Google', cat:'phones', emoji:'📱', price:1699, old:1999, badge:'sale', pct:15, rating:4.8, rv:87, stock:23,
    specs:{Дисплей:'6.3" LTPO OLED', Чип:'Google Tensor G4', Камера:'50MP + 48MP + 48MP', Батерия:'4700 mAh', Зареждане:'37W', RAM:'16 GB', RAM_raw:'16GB', Памет:'256 GB', Памет_raw:'256GB', ОС:'Android', Мрежа:'5G', Warranty:'24 месеца'},
    desc:'Google Pixel 9 Pro с AI Magic Eraser и Best Take е камерофонът с най-добрия AI на пазара. Чист Android 9 години.',
    reviews:[{name:'Светла Н.',stars:5,date:'19.03.2025',text:'AI функциите са невероятни! Снимките са шедьоври.'},{name:'Антон В.',stars:4,date:'09.03.2025',text:'Перфектен Android, бързи обновления.'}] },

  // ── АУДИО ────────────────────────────────────────────────────────────────────
  { id:141, sku:'MC-APPL-APPRO2', ean:'0195949186547', img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=600&hei=600&fmt=png-alpha', name:'Apple AirPods Pro 2 USB-C', brand:'Apple', cat:'peripherals', emoji:'🎧', price:399, old:449, badge:'sale', pct:11, rating:4.8, rv:198, stock:45,
    specs:{Тип:'In-ear', Тип_аудио:'In-ear', Връзка:'Bluetooth 5.3', ANC:'Адаптивно', ANC_filter:'С ANC', Батерия:'6 часа + 24 с кейс', Чип:'H2', Гаранция:'1 год.', Warranty:'12 месеца'},
    desc:'AirPods Pro 2 с чип H2 предлагат Adaptive Audio, Transparency Mode и USB-C зареждане. Лично пространствено аудио с Head Tracking.',
    reviews:[{name:'Дарина К.',stars:5,date:'23.03.2025',text:'Звукът е кристален, ANC е феноменален!'},{name:'Мартин Н.',stars:5,date:'13.03.2025',text:'Перфектна интеграция с iPhone!'}] },

  { id:142, sku:'MC-JBL-CHARGE5', ean:'6925281982446', img:'https://www.jbl.com/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dweb6b7218/JBL_Charge5_Product%20Image_Hero_Black.png?sw=600&sfrm=png', name:'JBL Charge 5 Bluetooth Speaker', brand:'JBL', cat:'peripherals', emoji:'🔊', price:249, old:299, badge:'sale', pct:17, rating:4.7, rv:234, stock:31,
    specs:{Тип:'Portable Speaker', Тип_аудио:'Говорител', Връзка:'Bluetooth 5.1', Батерия:'20 часа', Мощност:'40W', Водоустойчивост:'IP67', USB_C:'Да', Гаранция:'1 год.', Warranty:'12 месеца'},
    desc:'JBL Charge 5 с 40W мощност и IP67 водоустойчивост е перфектен за навън. Зарежда смартфона ти докато свири.',
    reviews:[{name:'Генади Ж.',stars:5,date:'16.03.2025',text:'Звукът е мощен, батерията издържа 2 дни!'},{name:'Лора Т.',stars:4,date:'06.03.2025',text:'Страхотен звук за тока. IP67 е истина!'}] },

  // ── ГЕЙМИНГ ПЕРИФЕРИЯ ────────────────────────────────────────────────────────
  { id:151, sku:'MC-LOGIG-G502X', ean:'5099206099968', img:'https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g502-x-plus/g502x-plus-top-view.png', name:'Logitech G502 X Plus Gaming Mouse', brand:'Logitech', cat:'gaming', emoji:'🖱', price:199, old:249, badge:'sale', pct:20, rating:4.8, rv:167, stock:26,
    specs:{Сензор:'HERO 25K', DPI:'100-25600', Бутони:'13', Батерия:'130 часа', Зареждане:'Lightspeed Wireless', Тегло:'106g', Warranty:'24 месеца'},
    desc:'Logitech G502 X Plus с HERO 25K сензор и Lightspeed безжична технология е изборът на eSports професионалисти.',
    reviews:[{name:'Ралица В.',stars:5,date:'24.03.2025',text:'Перфектна прецизност! Безжичната е безупречна.'},{name:'Димо С.',stars:5,date:'14.03.2025',text:'Най-добрата мишка за FPS!'}] },

  { id:152, sku:'MC-CORSA-K100-AIR', ean:'0840006657148', img:'https://assets.corsair.com/image/upload/c_pad,q_auto,h_600,w_600/pwa/corsair-k100-rgb-air-wireless-ultra-thin-mechanical-keyboard/COR-CH-913A01A-NA/02.webp', name:'Corsair K100 Air Wireless TKL Keyboard', brand:'Corsair', cat:'gaming', emoji:'⌨', price:349, old:429, badge:'sale', pct:19, rating:4.7, rv:89, stock:17,
    specs:{Превключватели:'Cherry MX ULP', Подсветка:'RGB Per-Key', Батерия:'200 часа', Свързаност:'Bluetooth + 2.4GHz', Профил:'Ultra-low', Тегло:'612g', Warranty:'24 месеца'},
    desc:'Corsair K100 Air с Cherry MX ULP превключватели е най-тънката геймърска клавиатура. 200 часа батерия и двойна свързаност.',
    reviews:[{name:'Тихомир П.',stars:5,date:'20.03.2025',text:'Ниският профил е феноменален за gaming!'},{name:'Нели Д.',stars:4,date:'10.03.2025',text:'Много удобна и тиха. Препоръчвам!'}] },

  { id:153, sku:'MC-HYPER-CLOUD3', ean:'0197644403028', img:'https://hyperx.com/cdn/shop/files/727009-001_HX-HSCC3-BK_NA_HyperX-Cloud-3-Gaming-Headset-Black-3QTR_L.png?v=1702660026&width=600', name:'HyperX Cloud 3 Gaming Headset', brand:'HyperX', cat:'gaming', emoji:'🎧', price:149, old:189, badge:'sale', pct:21, rating:4.7, rv:203, stock:38,
    specs:{Тип:'Over-ear', Тип_аудио:'Over-ear', Дискове:'53mm', Честота:'10–21000 Hz', Микрофон:'Отделяем', Свързаност:'USB-A / 3.5mm', DTS:'Headphone:X', Warranty:'24 месеца'},
    desc:'HyperX Cloud 3 с 53mm динамики и DTS Headphone:X пространствен звук е удобен многочасов геймърски слушалки.',
    reviews:[{name:'Светослав Д.',stars:5,date:'26.03.2025',text:'Комфортни дори при 8 часа игра!'},{name:'Яна М.',stars:4,date:'16.03.2025',text:'Отличен звук за цената.'}] },

  // ── СЪХРАНЕНИЕ ───────────────────────────────────────────────────────────────
  { id:161, sku:'MC-SAMS-990PRO-2T', ean:'8806094534566', img:'https://images.samsung.com/levant/consumer-storage/internal-ssd/990-pro/images/990-pro_images_390x390.jpg', name:'Samsung 990 Pro 2TB NVMe PCIe 4.0', brand:'Samsung', cat:'storage', emoji:'💾', price:249, old:319, badge:'sale', pct:22, rating:4.9, rv:312, stock:42,
    specs:{Обем:'2 TB', Интерфейс:'PCIe 4.0 NVMe M.2', Четене:'7450 MB/s', Запис:'6900 MB/s', Форм_фактор:'M.2 2280', TBW:'1200 TBW', Warranty:'60 месеца', Type:'SSD M.2 NVMe', Interface:'PCIe 4.0', Capacity:'2 TB'},
    desc:'Samsung 990 Pro е най-бързото M.2 NVMe SSD за PS5 и PC. До 7450 MB/s четене за светкавично бързо зареждане.',
    reviews:[{name:'Любомир Б.',stars:5,date:'27.03.2025',text:'PS5 зарежда игрите 2× по-бързо!'},{name:'Миглена Ч.',stars:5,date:'17.03.2025',text:'Страхотна скорост, препоръчвам!'}] },

  { id:162, sku:'MC-WD-MYPASSPORT-4T', ean:'0718037898674', img:'https://shop.westerndigital.com/content/dam/store/en-us/assets/products/portable-drives/my-passport/2023/my-passport-usb-3-2-gen-1-blue-4tb.png.thumb.1280.1280.png', name:'WD My Passport 4TB Portable HDD', brand:'WD', cat:'storage', emoji:'💾', price:199, old:249, badge:'sale', pct:20, rating:4.6, rv:178, stock:60,
    specs:{Обем:'4 TB', Интерфейс:'USB 3.2 Gen 1', Скорост:'130 MB/s', Форм_фактор:'2.5" Portable', Шифриране:'256-bit AES', Warranty:'36 месеца', Type:'Портативен HDD', Interface:'USB-A', Capacity:'4 TB+'},
    desc:'WD My Passport 4TB е компактен преносим хард диск с хардуерно шифриране и автоматичен бекъп. Идеален за снимки и видео.',
    reviews:[{name:'Бисер А.',stars:5,date:'25.03.2025',text:'4TB за тази цена е невероятно!'},{name:'Вяра С.',stars:4,date:'15.03.2025',text:'Надежден и бърз. Работи без проблем.'}] },

  { id:163, sku:'MC-KING-64DDR5-6000', ean:'0740617336177', img:'https://www.kingston.com/dataSheets/KF560C30BB-64_en.jpg', name:'Kingston FURY Beast 64GB DDR5-6000', brand:'Kingston', cat:'storage', emoji:'💾', price:299, old:379, badge:'sale', pct:21, rating:4.8, rv:94, stock:33,
    specs:{Обем:'64 GB (2×32)', Тип:'DDR5', Честота:'6000 MHz', Латентност:'CL30', Voltage:'1.35V', XMP:'XMP 3.0', RGB:'Да', Warranty:'Живот', Type:'RAM', Interface:'DDR5', Capacity:'64 GB'},
    desc:'Kingston FURY Beast DDR5-6000 с RGB и XMP 3.0 профил е перфектната RAM памет за Intel Core 13/14 и AMD AM5 платформи.',
    reviews:[{name:'Живко Т.',stars:5,date:'23.03.2025',text:'Системата стана значително по-бърза!'},{name:'Деяна И.',stars:5,date:'13.03.2025',text:'Лесна инсталация, работи от първия път.'}] },

  // ── ТЕЛЕВИЗОРИ ───────────────────────────────────────────────────────────────
  { id:171, sku:'MC-SONY-XR65A80L', ean:'4548736147454', img:'https://www.sony.com/image/5d02da5df552836db894cead8a68f5f3?fmt=png-alpha&wid=600', name:'Sony BRAVIA 65" OLED 4K A80L XR', brand:'Sony', cat:'accessories', emoji:'📺', price:2999, old:3699, badge:'sale', pct:19, rating:4.9, rv:45, stock:6,
    specs:{Размер:'65"', Диагонал_ТВ:'65"', Панел:'OLED', Резолюция:'4K UHD', HDR:'Dolby Vision + HDR10', Процесор:'XR Cognitive', Smart:'Google TV', HDMI:'4x HDMI 2.1', Refresh:'120Hz', Warranty:'24 месеца'},
    desc:'Sony BRAVIA 65" OLED с процесор XR Cognitive Intelligence анализира съдържанието за перфектна картина и звук.',
    reviews:[{name:'Наско Й.',stars:5,date:'28.03.2025',text:'Картината е толкова реална, забравяш, че е ТВ!'},{name:'Гергана В.',stars:5,date:'18.03.2025',text:'Google TV е много удобна платформа.'}] },

  { id:172, sku:'MC-LG-65C4-OLED', ean:'8806098767977', img:'https://www.lg.com/levant/images/tvs/md08095659/gallery/medium01.jpg', name:'LG OLED 65" C4 4K evo 120Hz', brand:'LG', cat:'accessories', emoji:'📺', price:2699, old:3299, badge:'sale', pct:18, rating:4.8, rv:61, stock:8,
    specs:{Размер:'65"', Диагонал_ТВ:'65"', Панел:'OLED evo', Резолюция:'4K UHD', HDR:'Dolby Vision IQ', Процесор:'α9 Gen7 AI', Smart:'webOS 24', HDMI:'4x HDMI 2.1', Refresh:'120Hz', Warranty:'24 месеца'},
    desc:'LG OLED C4 с процесор α9 Gen7 AI е изборът на геймъри — 4x HDMI 2.1, G-Sync Compatible и VRR до 144Hz.',
    reviews:[{name:'Цветан А.',stars:5,date:'26.03.2025',text:'За PS5 е абсолютно перфектен!'},{name:'Ива Б.',stars:5,date:'16.03.2025',text:'Картината бие всичко, което съм виждал.'}] },

  // ── АКСЕСОАРИ ────────────────────────────────────────────────────────────────
  { id:181, sku:'MC-ANKR-737-140W', ean:'0194644142872', img:'https://cdn.anker.com/media/magicui/products/A1372/A1372T11-1.jpg', name:'Anker 737 GaN 140W Charger 3-Port', brand:'Anker', cat:'accessories', emoji:'🔌', price:129, old:159, badge:'sale', pct:19, rating:4.8, rv:289, stock:55,
    specs:{Мощност:'140W', Портове:'2x USB-C + 1x USB-A', Технология:'GaN II', MacBook_Pro:'Да', Travel_Fuse:'Да', Warranty:'18 месеца'},
    desc:'Anker 737 GaN 140W зарежда MacBook Pro 16", iPad и iPhone едновременно. Интелигентно разпределение на мощността.',
    reviews:[{name:'Кирил М.',stars:5,date:'24.03.2025',text:'Заменя 3 зарядни с едно! Феноменален!'},{name:'Рена В.',stars:5,date:'14.03.2025',text:'Компактен и мощен. Задължителен за пътуване.'}] },

  { id:182, sku:'MC-APPL-MAGSAFE-WALLET', ean:'0194252756027', img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHLR3?wid=600&hei=600&fmt=png-alpha', name:'Apple MagSafe Leather Wallet iPhone', brand:'Apple', cat:'accessories', emoji:'👜', price:99, old:129, badge:'sale', pct:23, rating:4.5, rv:156, stock:70,
    specs:{Съвместимост:'iPhone 12/13/14/15/16', Карти:'1–3', Материал:'Кожа', MagSafe:'Да', Find_My:'Да', Warranty:'12 месеца'},
    desc:'Apple MagSafe Wallet се закача магнитно към iPhone и поддържа Find My. Побира до 3 карти.',
    reviews:[{name:'Яница О.',stars:5,date:'22.03.2025',text:'Много удобно! Нося телефон и портфейл заедно.'},{name:'Мирела Т.',stars:4,date:'12.03.2025',text:'Качеството е отлично, MagSafe е здраво.'}] },

  // ── УМНИ УСТРОЙСТВА ──────────────────────────────────────────────────────────
  { id:191, sku:'MC-GOOG-NESTH-2ND', ean:'0193575003665', img:'https://lh3.googleusercontent.com/hKdqZe_mRFh2_MJxOfmvRZ0nrFHPnvVlnnjT88z0UMr9GGMg1sTJb_YJfr2Z1J0f', name:'Google Nest Hub 2nd Gen 7" Display', brand:'Google', cat:'accessories', emoji:'🏠', price:199, old:249, badge:'sale', pct:20, rating:4.6, rv:134, stock:44,
    specs:{Дисплей:'7" LCD', Гласов_асистент:'Google Assistant', WiFi:'WiFi 6', Bluetooth:'5.0', Камера:'Няма', Sleep_Sensing:'Да', Warranty:'12 месеца'},
    desc:'Google Nest Hub 2nd Gen с Sleep Sensing следи съня ти без камера. Управлява умния ти дом с глас и дисплей.',
    reviews:[{name:'Янита Л.',stars:5,date:'21.03.2025',text:'Използвам го за всичко — новини, рецепти, музика!'},{name:'Огнян Д.',stars:4,date:'11.03.2025',text:'Google Assistant е много полезен.'}] },

  // ── КОМПОНЕНТИ ───────────────────────────────────────────────────────────────
  { id:241, sku:'MC-INTL-I9-14900K', ean:'0735858540773', img:'https://www.bhphotovideo.com/images/images500x500/intel_bx8071514900k_core_i9_14900k_processor_1696436479_1780376.jpg', name:'Intel Core i9-14900K 24-ядрен процесор', brand:'Intel', cat:'components', emoji:'⚙️', price:799, old:999, badge:'sale', pct:20, rating:4.9, rv:87, stock:16,
    specs:{Тип:'Процесор', Ядра:'24 (8P+16E)', Нишки:'32', Макс_честота:'6.0 GHz', TDP:'125W', Сокет:'LGA1700', Кеш:'36 MB', Памет:'DDR4/DDR5', Brand:'Intel', Socket:'LGA1700'},
    desc:'Intel Core i9-14900K с 24 ядра и максимална честота 6.0 GHz е флагманският процесор за геймъри и творци. Съвместим с дънни платки Z790.',
    reviews:[{name:'Добрин В.',stars:5,date:'20.03.2025',text:'Рендерингът е светкавично бърз! Незаменим за видео монтаж.'},{name:'Ралица К.',stars:5,date:'10.03.2025',text:'Играе всичко на максимален FPS без никакво забавяне.'}] },

  { id:242, sku:'MC-AMD-R9-7950X', ean:'0730143314442', img:'https://www.bhphotovideo.com/images/images500x500/amd_100_100000514wof_ryzen_9_7950x_processor_1663270571_1750867.jpg', name:'AMD Ryzen 9 7950X 16-ядрен процесор', brand:'AMD', cat:'components', emoji:'⚙️', price:699, old:899, badge:'sale', pct:22, rating:4.9, rv:64, stock:11,
    specs:{Тип:'Процесор', Ядра:'16', Нишки:'32', Макс_честота:'5.7 GHz', TDP:'170W', Сокет:'AM5', Кеш:'80 MB', Памет:'DDR5', Brand:'AMD', Socket:'AM5'},
    desc:'AMD Ryzen 9 7950X с 16 ядра и 80 MB кеш е абсолютният избор за workstation и рендеринг задачи на платформа AM5.',
    reviews:[{name:'Стоян Б.',stars:5,date:'18.03.2025',text:'В Blender е почти 2x по-бърз от предишния ми i9!'},{name:'Габриела Т.',stars:5,date:'08.03.2025',text:'Compilation времената паднаха наполовина.'}] },

  { id:243, sku:'MC-NVID-RTX4090-MSI', ean:'4719072905217', img:'https://www.bhphotovideo.com/images/images500x500/msi_geforce_rtx_4090_gaming_1663609536_1750944.jpg', name:'MSI GeForce RTX 4090 24GB Gaming X Trio', brand:'MSI', cat:'components', emoji:'🎮', price:3299, old:3999, badge:'sale', pct:18, rating:4.9, rv:43, stock:2,
    specs:{Тип:'Видеокарта', GPU:'RTX 4090', VRAM:'24 GB GDDR6X', TDP:'450W', Разъем:'PCIe 5.0', HDMI:'HDMI 2.1', DP:'3x DP 1.4a', Brand:'NVIDIA'},
    desc:'MSI RTX 4090 Gaming X Trio е най-мощната потребителска видеокарта. 24 GB GDDR6X за 4K gaming, AI и рендеринг без компромис.',
    reviews:[{name:'Петко Г.',stars:5,date:'25.03.2025',text:'4K 120fps в Cyberpunk с RT Ultra. Нищо не я спира!'},{name:'Ваня Д.',stars:5,date:'15.03.2025',text:'За 3D работа е абсолютно незаменима.'}] },

  { id:244, sku:'MC-NVID-RTX4070TIS-ASUS', ean:'4711387403495', img:'https://dlcdnwebimgs.asus.com/gain/1C6DC02C-E0B7-4B18-B4E8-2EDBC2461EA5/w717/h525', name:'ASUS ROG Strix RTX 4070 Ti Super OC 16GB', brand:'ASUS', cat:'components', emoji:'🎮', price:1199, old:1499, badge:'sale', pct:20, rating:4.8, rv:78, stock:7,
    specs:{Тип:'Видеокарта', GPU:'RTX 4070 Ti Super', VRAM:'16 GB GDDR6X', TDP:'285W', Разъем:'PCIe 4.0', HDMI:'HDMI 2.1', DP:'3x DP 1.4a', Brand:'NVIDIA'},
    desc:'ASUS ROG Strix RTX 4070 Ti Super OC с 16 GB GDDR6X е идеалната видеокарта за 4K gaming и AI задачи. DLSS 3.5 и Frame Generation.',
    reviews:[{name:'Мартин С.',stars:5,date:'22.03.2025',text:'1440p на 165Hz е абсолютно плавно!'},{name:'Ирена Л.',stars:4,date:'12.03.2025',text:'Страхотна карта за 3D дизайн.'}] },

  { id:245, sku:'MC-AMD-RX7900XTX-SAPP', ean:'0778901545416', img:'https://www.bhphotovideo.com/images/images500x500/sapphire_technology_11322_02_20g_nitro_radeon_rx_7900_1671220000_1756267.jpg', name:'Sapphire Nitro+ Radeon RX 7900 XTX 24GB', brand:'Sapphire', cat:'components', emoji:'🎮', price:1299, old:1599, badge:'sale', pct:19, rating:4.8, rv:52, stock:4,
    specs:{Тип:'Видеокарта', GPU:'RX 7900 XTX', VRAM:'24 GB GDDR6', TDP:'355W', Разъем:'PCIe 4.0', HDMI:'HDMI 2.1', DP:'2x DP 2.1', Brand:'AMD'},
    desc:'Sapphire Nitro+ RX 7900 XTX с 24 GB GDDR6 е флагманската AMD видеокарта за 4K gaming. DisplayPort 2.1 за 8K резолюция.',
    reviews:[{name:'Христо М.',stars:5,date:'19.03.2025',text:'AMD драйверите са перфектни за Linux!'},{name:'Нина В.',stars:4,date:'09.03.2025',text:'4K gaming е плавен, консумацията приемлива.'}] },

  { id:246, sku:'MC-CORS-64DDR5-6400-VEN', ean:'0840006690299', img:'https://www.bhphotovideo.com/images/images500x500/corsair_cmk64gx5m2b6400c32_vengeance_64gb_2_x_1683308280_1766060.jpg', name:'Corsair Vengeance 64GB DDR5-6400 RGB', brand:'Corsair', cat:'components', emoji:'🧠', price:349, old:429, badge:'sale', pct:19, rating:4.8, rv:118, stock:48,
    specs:{Тип:'RAM', Обем:'64 GB (2×32)', Честота:'6400 MHz', Латентност:'CL32', Voltage:'1.4V', XMP:'XMP 3.0', RGB:'Да', Brand:'Corsair', Socket:'DDR5'},
    desc:'Corsair Vengeance DDR5-6400 с RGB подсветка и XMP 3.0 профил е оптималната RAM за Intel LGA1700/1851 и AMD AM5 платформи.',
    reviews:[{name:'Тихомир Д.',stars:5,date:'24.03.2025',text:'XMP профилът работи от първото зареждане!'},{name:'Силва Н.',stars:5,date:'14.03.2025',text:'RGB е красив, скоростта е усетима.'}] },

  { id:247, sku:'MC-ASUS-ROGZ790E', ean:'4711387488812', img:'https://dlcdnwebimgs.asus.com/gain/3E1F7F74-CCCA-485D-B47E-E9B1E4DABE34/w717/h525', name:'ASUS ROG Strix Z790-E Gaming WiFi Дънна платка', brand:'ASUS', cat:'components', emoji:'🔩', price:799, old:999, badge:'sale', pct:20, rating:4.9, rv:61, stock:6,
    specs:{Тип:'Дънна платка', Чипсет:'Intel Z790', Сокет:'LGA1700', Памет:'DDR5 до 7800 MHz', PCIe:'PCIe 5.0 x16', USB:'Thunderbolt 4', WiFi:'WiFi 6E', Brand:'ASUS', Socket:'LGA1700'},
    desc:'ASUS ROG Strix Z790-E с PCIe 5.0 и WiFi 6E е премиум дънна платка за Intel Core 13/14 поколение. Поддържа DDR5 до 7800 MHz.',
    reviews:[{name:'Кирил Ж.',stars:5,date:'23.03.2025',text:'Безпроблемен оверклок до 7200 MHz на паметта!'},{name:'Боряна М.',stars:5,date:'13.03.2025',text:'Качеството е на ниво. BIOS е интуитивен.'}] },

  { id:248, sku:'MC-MSI-X670EACE', ean:'4719072918774', img:'https://www.bhphotovideo.com/images/images500x500/msi_meg_x670e_ace_atx_am5_1661965793_1750095.jpg', name:'MSI MEG X670E ACE AMD AM5 Дънна платка', brand:'MSI', cat:'components', emoji:'🔩', price:699, old:849, badge:'sale', pct:18, rating:4.8, rv:45, stock:5,
    specs:{Тип:'Дънна платка', Чипсет:'AMD X670E', Сокет:'AM5', Памет:'DDR5 до 6600 MHz', PCIe:'PCIe 5.0 x16', USB:'USB4 40Gbps', WiFi:'WiFi 6E', Brand:'MSI', Socket:'AM5'},
    desc:'MSI MEG X670E ACE с AMD X670E чипсет е флагманска дънна платка за Ryzen 7000. PCIe 5.0 за M.2 и USB4 40Gbps.',
    reviews:[{name:'Владо К.',stars:5,date:'21.03.2025',text:'Ryzen 9 7950X + тази платка = перфектна combo!'},{name:'Деа Й.',stars:4,date:'11.03.2025',text:'Много функционалности, лесна настройка.'}] },

  { id:249, sku:'MC-CORS-RM850X-GOLD', ean:'0840006641956', img:'https://www.bhphotovideo.com/images/images500x500/corsair_cp_9020200_na_rm850x_shift_850_watt_1668626720_1752798.jpg', name:'Corsair RM850x 850W 80+ Gold Modular', brand:'Corsair', cat:'components', emoji:'⚡', price:229, old:289, badge:'sale', pct:21, rating:4.9, rv:203, stock:37,
    specs:{Тип:'Захранване', Мощност:'850W', Сертификат:'80+ Gold', Модулно:'Напълно модулно', Вентилатор:'135mm Zero RPM', Гаранция:'10 год.', Brand:'Corsair', TDP:'850W'},
    desc:'Corsair RM850x с 80+ Gold сертификат и Zero RPM режим работи безшумно при ниско натоварване. Напълно модулни кабели за чист монтаж.',
    reviews:[{name:'Илиян Г.',stars:5,date:'26.03.2025',text:'Абсолютно тих при нормална работа!'},{name:'Пея Т.',stars:5,date:'16.03.2025',text:'10 години гаранция — купуваш веднъж.'}] },

  { id:250, sku:'MC-SEAS-FOCUSGX1000', ean:'4711173876199', img:'https://www.bhphotovideo.com/images/images500x500/seasonic_focus_gx_1000_atx_1548281576_1476476.jpg', name:'Seasonic Focus GX-1000 1000W 80+ Gold', brand:'Seasonic', cat:'components', emoji:'⚡', price:279, old:339, badge:'sale', pct:18, rating:4.8, rv:134, stock:24,
    specs:{Тип:'Захранване', Мощност:'1000W', Сертификат:'80+ Gold', Модулно:'Напълно модулно', Вентилатор:'135mm Hybrid', Гаранция:'10 год.', Brand:'Seasonic', TDP:'1000W'},
    desc:'Seasonic Focus GX-1000 с 1000W и Hybrid Silent Fan Control е идеалното захранване за RTX 4090 системи. Изключително стабилно напрежение.',
    reviews:[{name:'Пенко Р.',stars:5,date:'24.03.2025',text:'Перфектно с RTX 4090! Нито шум, нито проблем.'},{name:'Лена Б.',stars:5,date:'14.03.2025',text:'Seasonic качеството е непостижимо.'}] },

  // ── РЕАЛНИ НОУТБУЦИ ОТ MOSTCOMPUTERS.BG ─────────────────────────────────────
  { id:261, sku:'MC-MSI-KATANA15-282', ean:'4711377355902', img:'https://portal.mostbg.com/api/images/imageFileData/49124.png', name:'MSI Katana 15 HX i5-14 RTX 5050 QHD 165Hz', brand:'MSI', cat:'laptops', emoji:'💻', price:2102, old:null, badge:'new', pct:0, rating:4.6, rv:12, stock:8,
    specs:{Процесор:'Intel Core i5-14450HX', CPU:'Intel Core i5', RAM:'16 GB', RAM_raw:'16GB', Диск:'512 GB NVMe SSD', SSD:'512GB', GPU:'RTX 5050 8GB GDDR7', Видеокарта:'NVIDIA', Дисплей:'15.6" QHD 165Hz', Диагонал:'15.6"', ОС:'Windows 11 (без)', Батерия:'53.5 Wh', WiFi:'WiFi 6E', Warranty:'24 месеца'},
    desc:'MSI Katana 15 HX с новия RTX 5050 и QHD 165Hz дисплей 100% DCI-P3 е перфектният гейминг лаптоп за среден клас. 4-Zone RGB клавиатура, DDR5-5200 памет и PCIe Gen4 SSD.',
    reviews:[{name:'Михаил Д.',stars:5,date:'05.04.2026',text:'Страхотен gaming лаптоп за цената! RTX 5050 играе всичко.'},{name:'Стела Г.',stars:4,date:'02.04.2026',text:'QHD дисплеят е невероятен, цветовете са живи.'}] },

  { id:262, sku:'MC-MSI-VECTOR16-028', ean:'4711377300742', img:'https://portal.mostbg.com/api/images/imageFileData/48292.png', name:'MSI Vector 16 HX AI Ultra 9 RTX 5080 QHD+', brand:'MSI', cat:'laptops', emoji:'💻', price:4875, old:null, badge:'hot', pct:0, rating:4.7, rv:7, stock:3,
    specs:{Процесор:'Intel Core Ultra 9 275HX', CPU:'Intel Core Ultra', RAM:'32 GB', RAM_raw:'32GB', Диск:'1 TB NVMe SSD', SSD:'1TB', GPU:'RTX 5080 16GB GDDR7', Видеокарта:'NVIDIA', Дисплей:'16" QHD+ 240Hz 100% DCI-P3', Диагонал:'16"', ОС:'Windows 11 Home', Батерия:'90 Wh', WiFi:'WiFi 7', Warranty:'24 месеца'},
    desc:'MSI Vector 16 HX AI е флагманският гейминг лаптоп с RTX 5080 и Thunderbolt 5. Intel Core Ultra 9 275HX, 32GB DDR5-6400, 24-Zone RGB клавиатура и Wi-Fi 7 за абсолютна производителност.',
    reviews:[{name:'Александър Н.',stars:5,date:'07.04.2026',text:'Абсолютен звяр! RTX 5080 в лаптоп е невероятно.'},{name:'Гергана Т.',stars:5,date:'04.04.2026',text:'Thunderbolt 5 и WiFi 7 са просто феноменални.'}] },

  { id:263, sku:'MC-MSI-STEALTH-276', ean:'4711377285056', img:'https://portal.mostbg.com/api/images/imageFileData/50117.png', name:'MSI Stealth A16 AI+ Ryzen AI 9 RTX 4060 OLED', brand:'MSI', cat:'laptops', emoji:'💻', price:4119, old:null, badge:'new', pct:0, rating:4.7, rv:9, stock:5,
    specs:{Процесор:'AMD Ryzen AI 9 HX 370', CPU:'AMD Ryzen', RAM:'32 GB', RAM_raw:'32GB', Диск:'1 TB NVMe SSD', SSD:'1TB', GPU:'RTX 4060 8GB GDDR6', Видеокарта:'NVIDIA', Дисплей:'16" QHD+ OLED 240Hz 100% DCI-P3', Диагонал:'16"', ОС:'Windows 11 Home', Батерия:'99.9 Wh', WiFi:'WiFi 7', Warranty:'24 месеца'},
    desc:'MSI Stealth A16 AI+ съчетава AMD Ryzen AI 9 с великолепен QHD+ OLED дисплей 240Hz и RTX 4060. Per-Key RGB клавиатура от SteelSeries, Wi-Fi 7 и огромна 99.9Wh батерия.',
    reviews:[{name:'Петко В.',stars:5,date:'06.04.2026',text:'OLED дисплеят е невероятен! Ryzen AI 9 лети.'}] },

  { id:264, sku:'MC-MSI-PRESTIGE13-218', ean:'4711377270670', img:'https://portal.mostbg.com/api/images/imageFileData/44121.png', name:'MSI Prestige 13 AI EVO Ultra 5 OLED 2.8K бял', brand:'MSI', cat:'laptops', emoji:'💻', price:1851, old:null, badge:'new', pct:0, rating:4.8, rv:15, stock:6,
    specs:{Процесор:'Intel Core Ultra 5 125H', CPU:'Intel Core Ultra', RAM:'16 GB', RAM_raw:'16GB', Диск:'512 GB NVMe SSD', SSD:'512GB', GPU:'Intel Arc (интегрирана)', Видеокарта:'Интегрирана', Дисплей:'13.3" 2.8K OLED', Диагонал:'13.3"', ОС:'Windows 11 Home', Батерия:'LPDDR5 6400', WiFi:'WiFi 6E', Warranty:'24 месеца'},
    desc:'MSI Prestige 13 AI EVO е ултра-тънкият бизнес лаптоп с 2.8K OLED дисплей и Intel Core Ultra 5. Перфектен за творци и бизнес потребители — само 1.26 кг в луксозен бял корпус.',
    reviews:[{name:'Дарина С.',stars:5,date:'03.04.2026',text:'OLED 2.8K дисплеят е невероятен! Лек и красив.'},{name:'Тодор П.',stars:4,date:'01.04.2026',text:'Идеален за работа и пътуване.'}] },

  { id:265, sku:'MC-MSI-CYBORG15-435', ean:'4711377393256', img:'https://portal.mostbg.com/api/images/imageFileData/51843.png', name:'MSI Cyborg 15 B2R Core 5 RTX 5050 FHD 144Hz', brand:'MSI', cat:'laptops', emoji:'💻', price:1767, old:null, badge:'new', pct:0, rating:4.5, rv:18, stock:12,
    specs:{Процесор:'Intel Core 5 210H', CPU:'Intel Core 5', RAM:'16 GB', RAM_raw:'16GB', Диск:'512 GB NVMe SSD', SSD:'512GB', GPU:'RTX 5050 8GB GDDR7', Видеокарта:'NVIDIA', Дисплей:'15.6" FHD 144Hz', Диагонал:'15.6"', ОС:'Windows 11 (без)', Батерия:'52.4 Wh', WiFi:'WiFi 6', Warranty:'24 месеца'},
    desc:'MSI Cyborg 15 с новия RTX 5050 и прозрачен дизайн е достъпният гейминг лаптоп. RGB подсветка, Intel Core 5 210H и 512GB PCIe SSD за страхотна стойност.',
    reviews:[{name:'Николай Б.',stars:5,date:'04.04.2026',text:'За тази цена с RTX 5050 — фантастична сделка!'},{name:'Елена М.',stars:4,date:'02.04.2026',text:'Дизайнът е много готин, прозрачният корпус е unique.'}] },

  { id:266, sku:'MC-LENO-LEGION5-7WBM', ean:'0198158884549', img:'https://portal.mostbg.com/api/images/imageFileData/51333.png', name:'Lenovo Legion 5 15 i7-14700HX RTX 5060 OLED', brand:'Lenovo', cat:'laptops', emoji:'💻', price:2931, old:null, badge:'new', pct:0, rating:4.8, rv:11, stock:7,
    specs:{Процесор:'Intel Core i7-14700HX', CPU:'Intel Core i7', RAM:'32 GB', RAM_raw:'32GB', Диск:'1 TB NVMe SSD', SSD:'1TB', GPU:'RTX 5060 8GB GDDR7', Видеокарта:'NVIDIA', Дисплей:'15.1" WQXGA OLED 165Hz 100% DCI-P3', Диагонал:'15.6"', ОС:'Windows 11 (без)', Батерия:'80 Wh', WiFi:'WiFi 7', Warranty:'24 месеца'},
    desc:'Lenovo Legion 5 с невероятен WQXGA OLED 165Hz дисплей и RTX 5060 GDDR7 е гейминг лаптопът с най-добрия дисплей за класа. Dolby Vision, DisplayHDR True Black 600 и Wi-Fi 7.',
    bundle:[10, 1], bundleDiscount:12,
    reviews:[{name:'Борис Т.',stars:5,date:'08.04.2026',text:'OLED дисплеят на тази цена е невероятен!'},{name:'Силвия К.',stars:5,date:'05.04.2026',text:'RTX 5060 играе всичко отлично. Препоръчвам!'}] },

  { id:267, sku:'MC-LENO-LOQ15-8TBM', ean:'0199274327224', img:'https://portal.mostbg.com/api/images/imageFileData/100478.png', name:'Lenovo LOQ 15 i7-13650HX RTX 5070 FHD G-Sync', brand:'Lenovo', cat:'laptops', emoji:'💻', price:2720, old:null, badge:'new', pct:0, rating:4.7, rv:8, stock:9,
    specs:{Процесор:'Intel Core i7-13650HX', CPU:'Intel Core i7', RAM:'32 GB', RAM_raw:'32GB', Диск:'512 GB NVMe SSD', SSD:'512GB', GPU:'RTX 5070 8GB GDDR7', Видеокарта:'NVIDIA', Дисплей:'15.6" FHD 144Hz G-Sync', Диагонал:'15.6"', ОС:'Windows 11 (без)', Батерия:'60 Wh', WiFi:'WiFi 6', Warranty:'24 месеца'},
    desc:'Lenovo LOQ 15 с RTX 5070 GDDR7 и G-Sync е достъпният premium гейминг лаптоп. 32GB DDR5, 5.0MP камера с E-shutter и Nahimic Audio за immersive гейминг изживяване.',
    reviews:[{name:'Красимир А.',stars:5,date:'07.04.2026',text:'RTX 5070 за тази цена е несравнимо!'},{name:'Яна Р.',stars:4,date:'04.04.2026',text:'32GB RAM от кутията е голям плюс.'}] },

  // ── МРЕЖОВО ОБОРУДВАНЕ ───────────────────────────────────────────────────────
  { id:201, sku:'MC-TPLI-DECO-XE75', ean:'6935364091898', img:'https://static.tp-link.com/upload/product-overview/2022/202209/20220913/1663052267022a.jpg', name:'TP-Link Deco XE75 WiFi 6E Mesh 3-Pack', brand:'TP-Link', cat:'network', emoji:'📡', price:499, old:649, badge:'sale', pct:23, rating:4.7, rv:89, stock:29,
    specs:{Стандарт:'WiFi 6E (802.11axe)', WiFi_стандарт:'WiFi 6E', Диапазони:'Три (2.4+5+6 GHz)', Скорост:'5400 Mbps', Обхват:'до 600 кв.м', Възли:'3', HomeShield:'Да', Warranty:'24 месеца'},
    desc:'TP-Link Deco XE75 Mesh системата елиминира мъртвите зони в целия дом. WiFi 6E на 6 GHz за минимална интерференция.',
    reviews:[{name:'Методи Б.',stars:5,date:'19.03.2025',text:'Цялата къща вече има перфектен сигнал!'},{name:'Таня Х.',stars:4,date:'09.03.2025',text:'Настройката е лесна, сигналът е силен навсякъде.'}] },
];

let cart=[], compareList=[], modalQtyVal=1, modalProductId=null, quickOrderProductId=null, currentFilter='all', currentSort='bestseller';

// ── Persist & restore products from localStorage ──
function persistProducts() {
  try { localStorage.setItem('mc_products', JSON.stringify(products)); } catch(e) {}
}
// Snapshot static badge/pct/old before localStorage may overwrite them
const _staticProductsMap = Object.fromEntries(products.map(p => [p.id, { old: p.old, pct: p.pct, badge: p.badge }]));
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
  // sync bottom nav badge (two nav bars exist — update all)
  document.querySelectorAll('#bnCartBadge').forEach(bnB => {
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
  // Bottom nav badge (two nav bars exist — update all)
  document.querySelectorAll('#bnWishBadge').forEach(bnBadge => {
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
  const EXTRA_BRANDS = ['Nokia','HMD','Koorui','Tenda','Acer','Fortron','Adata','XPG','Kingspec'];
  const brandCounts = {};
  products.forEach(p => { if(p.brand) brandCounts[p.brand] = (brandCounts[p.brand]||0) + 1; });
  const ALL_BRANDS = [
    ...Object.entries(brandCounts).filter(([b]) => !EXCLUDE_BRANDS.has(b)).sort((a,b) => b[1]-a[1]).map(([b]) => b),
    ...EXTRA_BRANDS.filter(b => !brandCounts[b])
  ];
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
    { key: 'Type',      label: '📦 Тип компонент',     values: ['Процесор','Видеокарта','RAM','Дънна платка','SSD NVMe','SSD SATA','HDD','Захранване','Кутия'] },
    { key: 'Brand',     label: '🏷 Производител',      values: ['Intel','AMD','NVIDIA','ASUS','MSI','Gigabyte','Corsair','Kingston','Samsung','Seasonic'] },
    { key: 'Socket',    label: '🔩 Сокет / Слот',      values: ['LGA1700','LGA1851','AM4','AM5','DDR4','DDR5','PCIe 4.0','PCIe 5.0'] },
    { key: 'TDP',       label: '🌡 TDP / Мощност',     values: ['35W','65W','105W','125W','170W','450W','550W','650W','750W','850W'] },
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
  else if (cpCat !== 'all') list = list.filter(p => normalizeCat(p.cat) === cpCat);
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
  g.innerHTML = top4.map(p => `<div class="err-popular-card" onclick="close404();openProductModal(${p.id})"><div class="err-popular-emoji">${p.emoji}</div><div><div class="err-popular-name">${p.name.substring(0,22)}…</div><div class="err-popular-price">${p.price} лв.</div></div></div>`).join('');
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
