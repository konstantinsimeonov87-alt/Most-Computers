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
    </a>
    <div class="product-body">
      <div class="product-brand" itemprop="brand">${p.brand}</div>
      <h3 class="product-name" itemprop="name"><a href="?product=${p.id}" onclick="openProductPage(${p.id});return false;" style="color:inherit;text-decoration:none;">${p.name}</a></h3>
      <div class="product-rating"><span class="stars">${starsHTML(p.rating)}</span><span class="rating-num">${p.rating} (${p.rv})</span></div>
      <div class="product-footer">
        <div class="price-row">
          <div class="price-current${p.badge==='sale'?' sale':''}" itemprop="offers" itemscope itemtype="https://schema.org/Offer"><meta itemprop="priceCurrency" content="EUR"><link itemprop="availability" href="${p.stock===false?'https://schema.org/OutOfStock':'https://schema.org/InStock'}"><span itemprop="price" content="${p.price}">${fmtPrice(p.price, p.badge==='sale'?'sale':'')}</span></div>
          ${p.old?`<div class="price-old">${fmtEur(p.old)}</div><div class="price-save">-${save}%</div>`:''}
        </div>
        ${p.stock!==false&&p.stock!=null&&p.stock<=5?`<div style="font-size:11px;color:var(--sale);font-weight:700;margin-bottom:5px;">🔥 Последни ${p.stock} бр. в наличност!</div>`:''}
        <button type="button" class="add-cart-btn" id="cb-${p.id}" onclick="addToCart(${p.id})" ${p.stock===false?'disabled':''}><svg width="15" height="15" class="svg-ic" aria-hidden="true"><use href="#ic-cart"/></svg> ${p.stock===false?'Изчерпан':'Добави в кошница'}</button>
        <div class="row-gap-6" style="margin-top:6px;">
          <button type="button" class="product-quick-view-btn" onclick="openProductPage(${p.id})" title="Бърз преглед" style="flex:1;flex-direction:column;gap:3px;"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-eye"/></svg><span style="font-size:10px;color:var(--muted);font-weight:500;">Преглед</span></button>
          <button type="button" onclick="openQuickOrder(${p.id})" title="Бърза поръчка" style="flex:1;flex-direction:column;gap:3px;background:var(--bg);border:1px solid var(--border);border-radius:7px;padding:9px 10px;transition:all 0.2s;display:flex;align-items:center;justify-content:center;" onmouseover="this.style.background='var(--primary-light)'" onmouseout="this.style.background='var(--bg)'"><svg width="16" height="16" class="svg-ic" aria-hidden="true"><use href="#ic-bolt"/></svg><span style="font-size:10px;color:var(--muted);font-weight:500;">Бърза поръчка</span></button>
          <div class="product-compare-cb"><input type="checkbox" id="cmp-${p.id}" onchange="toggleCompare(${p.id},this.checked)"><label for="cmp-${p.id}">Сравни</label></div>
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
  { cat:'laptops',     icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-laptop"/></svg>', name:'Лаптопи' },
  { cat:'desktops',    icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-desktop"/></svg>', name:'Настолни компютри' },
  { cat:'components',  icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-cpu"/></svg>', name:'Компоненти' },
  { cat:'peripherals', icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-mouse"/></svg>', name:'Периферия' },
  { cat:'network',     icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-wifi"/></svg>', name:'Мрежово оборудване' },
  { cat:'storage',     icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-storage"/></svg>', name:'Сървъри и сторидж' },
  { cat:'software',    icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-tag"/></svg>', name:'Софтуер' },
  { cat:'accessories', icon:'<svg width="32" height="32" class="svg-ic" aria-hidden="true"><use href="#ic-truck"/></svg>', name:'Аксесоари' },
];
const megaBrands = ['Intel', 'ASUS', 'Acer', 'Microsoft', 'Lenovo', 'Gigabyte', 'LG', 'HP', 'ADATA', 'Sapphire', 'Tenda', 'Kingston', 'Seagate', 'AMD', 'Seasonic', 'ASRock', 'Repotec', 'Realme', 'MSI', 'Tuncmatik', 'Palit', 'Nokia', 'Dynac', 'Cooler Master', 'Fractal', 'NZXT', 'Canon', 'Fnatic', 'GeIL', 'FSP Group', 'Omega', 'Inform UPS', 'QNAP', 'D-Link', 'AV Tech'];

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
  document.getElementById('modalSpecs').innerHTML=Object.keys(p.specs).slice(0,4).map(k=>`<div class="spec-chip"><div class="spec-chip-key">${k}</div><div class="spec-chip-val">${p.specs[k]}</div></div>`).join('');
  let b='';if(p.badge==='sale')b+='<span class="badge badge-sale">Промо</span>';if(p.badge==='new')b+='<span class="badge badge-new">Ново</span>';if(p.badge==='hot')b+='<span class="badge badge-hot">Горещо</span>';
  document.getElementById('modalBadges').innerHTML=b;
  document.getElementById('modalDesc').textContent=p.desc;
  var _el_modalSpecsFull=document.getElementById('modalSpecsFull'); if(_el_modalSpecsFull) _el_modalSpecsFull.innerHTML =
    `<div class="spec-chip"><div class="spec-chip-key">SKU</div><div class="spec-chip-val mono-12">${p.sku}</div></div>` +
    `<div class="spec-chip"><div class="spec-chip-key">EAN</div><div class="spec-chip-val mono-12">${p.ean}</div></div>` +
    Object.entries(p.specs).map(([k,v])=>`<div class="spec-chip"><div class="spec-chip-key">${k}</div><div class="spec-chip-val">${v}</div></div>`).join('');
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
function goSlide(n){if(!slides.length||!slides[n])return;slides[currentSlide].classList.remove('active');dots[currentSlide].classList.remove('active');currentSlide=n;slides[currentSlide].classList.add('active');dots[currentSlide].classList.add('active');}
if(slides.length)setInterval(()=>goSlide((currentSlide+1)%slides.length),5000);

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
const FREE_SHIP_BGN = 200;
function updateCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const badge=document.getElementById('cartBadge');if(badge)badge.textContent=count;
  document.getElementById('cartTotal').textContent=fmtEur(total) + ' / ' + fmtBgn(total);
  // sync PDP mini-header cart badge
  const pdpB = document.getElementById('pdpMhdrCartBadge');
  if(pdpB){pdpB.textContent=count;pdpB.style.display=count>0?'':'none';}
  // sync bottom nav badge (two nav bars exist — update all)
  document.querySelectorAll('#bnCartBadge').forEach(bnB => {
    bnB.textContent=count; bnB.classList.toggle('show',count>0);
  });
  const body=document.getElementById('cartBody');
  if(cart.length===0){body.innerHTML='<div class="cart-empty-msg"><div class="ce-icon"><svg width="44" height="44" class="svg-ic" aria-hidden="true" style="opacity:.25"><use href="#ic-cart"/></svg></div><p>Кошницата е празна.<br>Добави продукти!</p></div>';return;}
  let html=cart.map(x=>`<div class="cart-item-row"><div class="ci-emoji">${x.emoji}</div><div class="ci-details"><div class="ci-name">${x.name}</div><div class="ci-price">${fmtEur(x.price*x.qty)}<span class="text-11-muted-block">${fmtBgn(x.price*x.qty)}</span></div><div class="ci-qty"><button type="button" class="qty-btn" onclick="changeQty(${x.id},-1)">−</button><span class="qty-num">${x.qty}</span><button type="button" class="qty-btn" onclick="changeQty(${x.id},1)">+</button></div></div><button type="button" class="ci-remove" onclick="removeFromCart(${x.id})">×</button></div>`).join('');
  // Free shipping progress bar + delivery row
  const pct=Math.min(100,(total/FREE_SHIP_BGN)*100);
  const deliveryRow=document.getElementById('cartDeliveryRow');
  const deliveryVal=document.getElementById('cartDeliveryVal');
  if(total>=FREE_SHIP_BGN){
    html+=`<div class="cart-ship-bar"><div class="cart-ship-msg ship-free">🎉 Имаш безплатна доставка!</div><div class="cart-ship-progress"><div class="cart-ship-fill" style="width:100%"></div></div></div>`;
    if(deliveryRow) deliveryRow.style.display='none';
  }else{
    const rem=(FREE_SHIP_BGN-total).toFixed(2);
    html+=`<div class="cart-ship-bar"><div class="cart-ship-msg">Добави още <strong>${rem} лв.</strong> за безплатна доставка!</div><div class="cart-ship-progress"><div class="cart-ship-fill" style="width:${pct.toFixed(1)}%"></div></div></div>`;
    if(deliveryRow) deliveryRow.style.display='flex';
    if(deliveryVal) deliveryVal.textContent='5.99 лв.';
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
    const _set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
    const _setHTML = (id, val) => { const el = document.getElementById(id); if(el) el.innerHTML = val; };
    _set('tyOrderNum', orderNum);
    _set('tyEmail', document.getElementById('ckEmail').value);
    _set('tyDeliveryDate', ckDeliveryIdx === 2 ? 'При вземане от магазин' : fmt(delivDate));
    _set('tyPayment', payNames[ckPaymentType]);
    _set('tyName', document.getElementById('ckFirst').value + ' ' + document.getElementById('ckLast').value);
    _set('tyPhone', document.getElementById('ckPhone').value);
    _set('tyCity', document.getElementById('ckCity').value);
    _set('tyAddr', document.getElementById('ckAddr').value + (document.getElementById('ckZip').value ? ', ' + document.getElementById('ckZip').value : ''));
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
        <div class="ty-item-emoji">${x.emoji}</div>
        <div class="ty-item-info">
          <div class="ty-item-name">${x.name}</div>
          <div class="ty-item-meta">${x.brand} · Количество: ${x.qty}</div>
        </div>
        <div class="ty-item-price">${fmtEur(x.price*x.qty)}<span class="text-11-muted-block">${fmtBgn(x.price*x.qty)}</span></div>
      </div>`).join(''));

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
      const imgHtml = p.img
        ? `<img class="product-img-real" src="${p.img}" alt="${p.name}" loading="lazy" onload="this.classList.add('img-loaded')" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-img-emoji is-hidden" aria-hidden="true">${p.emoji}</span>`
        : `<span class="product-img-emoji">${p.emoji}</span>`;
      return `<div class="product-card pos-rel">
        <button type="button" class="wishlist-remove-btn" onclick="toggleWishlist(${p.id},{stopPropagation:()=>{}})" title="Премахни">×</button>
        <div class="product-img-wrap cursor-pointer" onclick="openProductPage(${p.id});closeWishlist();">${imgHtml}</div>
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
  if (!win) { showToast('⚠️ Попъп прозорецът е блокиран. Разреши попъпи за този сайт.'); return; }
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
  if(typeof advFilterStockOnly!=='undefined' && advFilterStockOnly) list=list.filter(p=>p.stock!==false&&p.stock!==0);
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

// Store active filter removers by index to avoid closure serialization
window._afRemove = [];
function updateActiveFiltersBar() {
  const bar = document.getElementById('activeFiltersBar');
  const chips = document.getElementById('activeFilterChips');
  if (!bar || !chips) return;
  window._afRemove = [];
  const active = [];
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
    { id: 'gaming_pc',    label: '🎮 Геймърски конфигурации' },
    { id: 'office_pc',    label: '💼 Офис компютри' },
    { id: 'workstation',  label: '🔬 Workstation' },
    { id: 'aio',          label: '🖥 All-in-One' },
    { id: 'mac_desktop',  label: '🍎 Mac' },
  ],
  components: [
    { id: 'cpu',          label: '⚙ Процесори' },
    { id: 'gpu',          label: '🎮 Видео карти' },
    { id: 'ram',          label: '🧠 RAM памет' },
    { id: 'ssd_hdd',      label: '💾 SSD / HDD' },
    { id: 'motherboard',  label: '🔩 Дънни платки' },
    { id: 'psu',          label: '⚡ Захранвания' },
    { id: 'case_cooling', label: '🗄 Кутии и охлаждане' },
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
  laptops: [
    { title: 'По предназначение', id: 'work', items: ['За работа', 'За гейминг', 'Ултрабуци', 'Workstation'] },
    { title: 'По марка', id: 'ultrabook', items: ['Apple MacBook', 'Dell XPS', 'ASUS ROG', 'Lenovo ThinkPad', 'HP EliteBook'] },
    { title: 'По бюджет', id: 'budget', items: ['До 500 €', '500–800 €', '800–1500 €', '1500 €+'] },
    { title: 'Use-case', id: 'for_students', items: ['За студенти', 'За програмисти', 'За дизайнери', 'За игри'] },
  ],
  desktops: [
    { title: 'Gaming PC', id: 'gaming_pc', items: ['RTX 4070', 'RTX 4080 / 4090', 'Готови конфигурации', 'AMD Radeon'] },
    { title: 'Офис и Workstation', id: 'office_pc', items: ['Офис компютри', 'Workstation', 'Mac Mini / iMac', 'All-in-One'] },
    { title: 'По марка', id: 'mac_desktop', items: ['Apple', 'ASUS', 'Dell', 'HP', 'Lenovo'] },
  ],
  components: [
    { title: 'Процесори', id: 'cpu', items: ['Intel Core i5/i7/i9', 'Intel Core Ultra', 'AMD Ryzen 5/7/9', 'AMD Threadripper'] },
    { title: 'Видео карти', id: 'gpu', items: ['NVIDIA GeForce RTX 40', 'AMD Radeon RX 7000', 'Работни карти'] },
    { title: 'Памет', id: 'ram', items: ['DDR5 RAM', 'DDR4 RAM', 'SO-DIMM лаптоп'] },
    { title: 'Дискове', id: 'ssd_hdd', items: ['SSD M.2 NVMe', 'SSD SATA', 'HDD 2.5"', 'HDD 3.5"'] },
    { title: 'Дъно и корпус', id: 'motherboard', items: ['Intel LGA1851', 'Intel LGA1700', 'AMD AM5', 'AMD AM4', 'Захранвания', 'Кутии'] },
  ],
  peripherals: [
    { title: 'Монитори', id: 'monitor', items: ['Gaming 144Hz+', '4K UHD', 'QHD 1440p', 'Ultra-Wide', 'OLED'] },
    { title: 'Въвеждане', id: 'keyboard', items: ['Механични клавиатури', 'Геймърски мишки', 'Офис мишки', 'Trackpad'] },
    { title: 'Аудио и видео', id: 'headphones', items: ['Геймърски слушалки', 'Офис слушалки', 'Уеб камери', 'Принтери'] },
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

  const CAT_LABELS = {
    laptops:'Лаптопи', desktops:'Настолни компютри', components:'Компоненти',
    peripherals:'Периферия', network:'Мрежово оборудване', storage:'Сървъри и сторидж',
    software:'Софтуер', accessories:'Аксесоари'
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
    // Laptops
    work:          () => all.includes('business') || all.includes('thinkpad') || all.includes('latitude') || all.includes('elitebook') || all.includes('бизнес') || all.includes('xps'),
    gaming_l:      () => all.includes('gaming') || all.includes('rog') || all.includes('rtx') || all.includes('геймърски') || all.includes('republic of gamers'),
    ultrabook:     () => all.includes('ultra') || all.includes('air') || all.includes('slim') || p.price < 3000,
    budget:        () => (p.price / EUR_RATE) < 500,
    convertible:   () => all.includes('2-in-1') || all.includes('2 в 1') || all.includes('convertible') || all.includes('flip') || all.includes('surface pro') || all.includes('yoga'),
    for_students:  () => (p.price / EUR_RATE) < 700 || all.includes('student') || all.includes('студент') || all.includes('chromebook'),
    for_devs:      () => all.includes('thinkpad') || all.includes('xps') || all.includes('macbook pro') || all.includes('linux') || all.includes('програмист'),
    for_design:    () => all.includes('macbook') || all.includes('design') || all.includes('creator') || all.includes('дизайн') || all.includes('retina') || all.includes('4k display'),
    for_gaming:    () => all.includes('gaming') || all.includes('rtx') || all.includes('rog') || all.includes('rx 6') || all.includes('rx 7') || p.cat === 'gaming',
    // Desktops
    gaming_pc:     () => all.includes('gaming') || all.includes('rtx') || all.includes('rog') || all.includes('rx 6') || all.includes('rx 7') || all.includes('геймърски'),
    office_pc:     () => all.includes('office') || all.includes('офис') || all.includes('business') || (p.price/EUR_RATE < 800 && !all.includes('gaming')),
    workstation:   () => all.includes('workstation') || all.includes('xeon') || all.includes('quadro') || p.price > 4000,
    aio:           () => all.includes('all-in-one') || all.includes('aio') || all.includes('imac') || all.includes('моноблок'),
    mac_desktop:   () => brand === 'apple' || all.includes('mac mini') || all.includes('imac') || all.includes('mac studio') || all.includes('mac pro'),
    // Components
    cpu:           () => all.includes('процесор') || all.includes('processor') || all.includes('cpu') || all.includes('ryzen') || all.includes('core i') || all.includes('core ultra'),
    gpu:           () => all.includes('видеокарт') || all.includes('gpu') || all.includes('geforce') || all.includes('radeon') || all.includes('rtx') || all.includes('rx 6') || all.includes('rx 7') || all.includes('arc'),
    ram:           () => all.includes(' ram') || all.includes('памет') || all.includes('ddr4') || all.includes('ddr5') || all.includes('dimm') || all.includes('sodimm'),
    ssd_hdd:       () => all.includes('ssd') || all.includes('hdd') || all.includes('nvme') || all.includes('диск') || all.includes('m.2'),
    motherboard:   () => all.includes('дънна') || all.includes('motherboard') || all.includes('mainboard') || all.includes('платка'),
    psu:           () => all.includes('захранван') || all.includes('psu') || all.includes('power supply') || all.includes(' w ') || (all.includes('watt') && !all.includes('battery')),
    case_cooling:  () => all.includes('кутия') || all.includes('chassis') || all.includes('case') || all.includes('охлади') || all.includes('cooler') || all.includes('cooling'),
    // Peripherals
    monitor:       () => all.includes('монитор') || all.includes('monitor') || all.includes('display') || all.includes('hz') && (all.includes('ips') || all.includes('oled') || all.includes('va') || all.includes('qhd') || all.includes('4k') || all.includes('1440')),
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
  if (params.get('product')) { setTimeout(()=>openProductPage(parseInt(params.get('product'))),400); }
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



// ===== ADMIN PANEL =====
const _demoOrders = [
  { num:'MC-241890', customer:'Георги Тодоров', email:'g.todorov@mail.bg', phone:'0888 123 456', city:'София', addr:'ул. Витоша 12', items:'MacBook Pro M4', itemsData:[], subtotal:4299, delivery:0, total:4299, payment:'card', deliveryType:'Еконт', status:'paid',     date:'09.03.2026', ts:0 },
  { num:'MC-241889', customer:'Мария Иванова',  email:'m.ivanova@mail.bg', phone:'0877 234 567', city:'Пловдив', addr:'бул. Марица 5', items:'iPhone 16 Pro Max', itemsData:[], subtotal:2599, delivery:5.99, total:2604.99, payment:'cod', deliveryType:'Еконт', status:'shipped',  date:'09.03.2026', ts:0 },
  { num:'MC-241887', customer:'Петър Стоянов',  email:'p.stoyanov@mail.bg', phone:'0898 345 678', city:'Варна', addr:'ул. Черно море 3', items:'Sony WH-1000XM6 + iPad Pro', itemsData:[], subtotal:2098, delivery:4.99, total:2102.99, payment:'bank', deliveryType:'Еконт', status:'pending',  date:'08.03.2026', ts:0 },
  { num:'MC-241885', customer:'Анна Петрова',   email:'a.petrova@mail.bg', phone:'0888 456 789', city:'Бургас', addr:'ул. Алея 7', items:'Samsung OLED TV', itemsData:[], subtotal:1799, delivery:0, total:1799, payment:'card', deliveryType:'Вземи от магазин', status:'paid',     date:'08.03.2026', ts:0 },
  { num:'MC-241880', customer:'Тодор Николов',  email:'t.nikolov@mail.bg', phone:'0878 567 890', city:'София', addr:'кв. Люлин 14', items:'ASUS ROG Zephyrus', itemsData:[], subtotal:3799, delivery:5.99, total:3804.99, payment:'card', deliveryType:'Еконт', status:'shipped',  date:'07.03.2026', ts:0 },
  { num:'MC-241874', customer:'Ивана Христова', email:'i.hristova@mail.bg', phone:'0897 678 901', city:'Стара Загора', addr:'ул. Цар Симеон 2', items:'Apple Watch Ultra 2', itemsData:[], subtotal:1299, delivery:4.99, total:1303.99, payment:'cod', deliveryType:'Еконт', status:'cancelled', date:'07.03.2026', ts:0 },
];

function getAdminOrders() {
  try {
    const real = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    // Merge: real orders first, then demo orders not already in real
    const realNums = new Set(real.map(o => o.num));
    return [...real, ..._demoOrders.filter(o => !realNums.has(o.num))];
  } catch(e) { return _demoOrders; }
}

function adminSaveOrders(orders) {
  // Only save real (non-demo) orders
  const demoNums = new Set(_demoOrders.map(o => o.num));
  const real = orders.filter(o => !demoNums.has(o.num));
  try { localStorage.setItem('mc_orders', JSON.stringify(real)); } catch(e) {}
}

function adminChangeOrderStatus(num, newStatus) {
  const orders = getAdminOrders();
  const o = orders.find(x => x.num === num);
  if (o) {
    o.status = newStatus;
    adminSaveOrders(orders);
    adminShowTab('orders');
    showToast(`✅ Статус на ${num} → ${adminStatuses[newStatus]}`);
    if (newStatus === 'shipped') adminShowEmailDraft(o);
  }
}

function adminShowEmailDraft(o) {
  const subject = `Вашата поръчка ${o.num} е изпратена — Most Computers`;
  const body = `Здравейте ${(o.customer||'').split(' ')[0]},\n\nПоръчка ${o.num} е изпратена с Еконт!\n\nПродукти: ${o.items}\nОбщо: ${fmtBgn(o.total)}\nДата: ${o.date}\n\nБлагодарим за доверието!\n\nЕкипът на Most Computers\nmostcomputers.bg`;
  let modal = document.getElementById('adminEmailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'adminEmailModal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;padding:20px;';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div style="background:#1a1d35;border:1px solid #2d3148;border-radius:16px;padding:28px;max-width:560px;width:100%;font-family:'Outfit',sans-serif;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <div style="font-size:16px;font-weight:800;color:#fff;">📧 Имейл до клиента</div>
        <button type="button" onclick="document.getElementById('adminEmailModal').remove()" style="background:none;border:none;color:#9ca3af;font-size:22px;cursor:pointer;line-height:1;">×</button>
      </div>
      <div style="font-size:11px;color:#9ca3af;margin-bottom:5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">До:</div>
      <div style="background:#252840;border:1px solid #2d3148;border-radius:8px;padding:9px 14px;color:#e5e7eb;font-size:13px;margin-bottom:12px;">${o.email||'—'}</div>
      <div style="font-size:11px;color:#9ca3af;margin-bottom:5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Относно:</div>
      <div style="background:#252840;border:1px solid #2d3148;border-radius:8px;padding:9px 14px;color:#e5e7eb;font-size:13px;margin-bottom:12px;">${subject}</div>
      <div style="font-size:11px;color:#9ca3af;margin-bottom:5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;">Съдържание:</div>
      <textarea id="adminEmailBody" style="width:100%;box-sizing:border-box;background:#252840;border:1px solid #2d3148;border-radius:8px;padding:12px 14px;color:#e5e7eb;font-size:13px;font-family:'Outfit',sans-serif;resize:vertical;min-height:180px;outline:none;">${body}</textarea>
      <div style="display:flex;gap:10px;margin-top:16px;justify-content:flex-end;">
        <button type="button" onclick="document.getElementById('adminEmailModal').remove()" style="background:#252840;border:1px solid #2d3148;border-radius:8px;padding:9px 18px;color:#9ca3af;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;cursor:pointer;">Отказ</button>
        <button type="button" onclick="adminCopyEmailDraft()" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border:none;border-radius:8px;padding:9px 18px;color:#fff;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;cursor:pointer;">📋 Копирай</button>
        <button type="button" onclick="adminOpenMailto(${JSON.stringify(o.email||'')},${JSON.stringify(subject)})" style="background:linear-gradient(135deg,#10b981,#059669);border:none;border-radius:8px;padding:9px 18px;color:#fff;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;cursor:pointer;">✉️ Имейл клиент</button>
      </div>
    </div>`;
  modal.style.display = 'flex';
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
}

function adminCopyEmailDraft() {
  const body = document.getElementById('adminEmailBody')?.value || '';
  navigator.clipboard.writeText(body).then(() => showToast('📋 Имейлът е копиран!')).catch(() => {
    const ta = document.getElementById('adminEmailBody');
    if (ta) { ta.select(); document.execCommand('copy'); }
    showToast('📋 Имейлът е копиран!');
  });
}

function adminOpenMailto(email, subject) {
  const body = document.getElementById('adminEmailBody')?.value || '';
  window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
}

function adminDeleteOrder(num) {
  if (!confirm(`Изтрий поръчка ${num}?`)) return;
  let orders = getAdminOrders();
  orders = orders.filter(x => x.num !== num);
  adminSaveOrders(orders);
  adminShowTab('orders');
  showToast(`🗑 Поръчка ${num} изтрита`);
}

function adminExportCSV() {
  const orders = getAdminOrders();
  const header = ['#','Клиент','Имейл','Телефон','Продукти','Сума (лв.)','Доставка','Плащане','Статус','Дата'];
  const rows = orders.map(o => [
    o.num, o.customer, o.email||'', o.phone||'',
    '"' + (o.items||'').replace(/"/g,'""') + '"',
    (o.total||0).toFixed(2),
    '"' + (o.deliveryType||'') + '"',
    o.payment||'', o.status||'', o.date||''
  ]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mc-orders-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(`✅ Изтеглени ${orders.length} поръчки като CSV`);
}

function adminExportProductsJSON() {
  const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mc-products-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(`✅ Изтеглени ${products.length} продукта като JSON`);
}

function adminExportProductsCSV() {
  const header = ['id','name','brand','cat','sku','price','old','rating','rv','badge','stock'];
  const rows = products.map(p => header.map(k => {
    const v = p[k] == null ? '' : p[k];
    return typeof v === 'string' && v.includes(',') ? '"' + v.replace(/"/g,'""') + '"' : v;
  }));
  const csv = [header, ...rows].map(r => r.join(',')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mc-products-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(`✅ Изтеглени ${products.length} продукта като CSV`);
}

function adminImportJSON(jsonText) {
  try {
    const data = JSON.parse(jsonText);
    const arr = Array.isArray(data) ? data : [data];
    const saved = JSON.parse(localStorage.getItem('mc_orders') || '[]');
    const existingNums = new Set(saved.map(o => o.num));
    let added = 0;
    arr.forEach(o => {
      if (o.num && !existingNums.has(o.num)) { saved.unshift(o); added++; }
    });
    localStorage.setItem('mc_orders', JSON.stringify(saved.slice(0, 500)));
    showToast(`✅ Импортирани ${added} поръчки`);
    adminShowTab('orders');
  } catch(e) {
    showToast('❌ Невалиден JSON файл');
  }
}

const adminStatuses = { paid:'Платена', pending:'Изчаква', shipped:'Изпратена', cancelled:'Отказана' };
const chartData = [
  {m:'Окт',v:42800},{m:'Ное',v:55100},{m:'Дек',v:98400},{m:'Яну',v:38200},
  {m:'Фев',v:61700},{m:'Мар',v:47300},
];
const maxChart = Math.max(...chartData.map(d=>d.v));
function orderMonth(o) { const d = new Date(o.ts||0); return { m: d.getMonth(), y: d.getFullYear() }; }

let _adminOrdersNotified = 0;
function adminUpdateOrdersBadge() {
  const seenTs = parseInt(localStorage.getItem('mc_orders_seen_ts') || '0');
  const cnt = getAdminOrders().filter(o => o.ts && o.ts > seenTs).length;
  const badge = document.querySelector('.admin-nav-item[data-action*="orders"] .nav-badge');
  if (badge) { badge.textContent = cnt || ''; badge.style.display = cnt > 0 ? '' : 'none'; }
  if (cnt > _adminOrdersNotified) {
    showToast(`🔔 ${cnt} нова${cnt > 1 ? ' поръчки' : ' поръчка'}!`);
    _adminOrdersNotified = cnt;
  } else if (cnt === 0) {
    _adminOrdersNotified = 0;
  }
}

function openAdminPage() {
  if (!window._adminUnlocked) {
    const pin = prompt('Въведи PIN за достъп до администрацията:');
    if (pin !== '1234') { showToast('❌ Грешен PIN!'); return; }
    window._adminUnlocked = true;
  }
  document.getElementById('adminPage').classList.add('open');
  document.body.style.overflow='hidden';
  adminUpdateOrdersBadge();
  // Reviews badge — count pending reviews
  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    const pending = Object.values(saved).flat().filter(r => r.pending).length;
    const rb = document.getElementById('adminReviewsBadge');
    if (rb) { rb.textContent = pending || ''; rb.style.display = pending > 0 ? '' : 'none'; }
  } catch(e) {}
  adminShowTab('dashboard');
}
function closeAdminPage() {
  document.getElementById('adminPage').classList.remove('open');
  document.body.style.overflow='';
}

// ── Admin products table state ────────────────────────────────────────────────
var _adminProd = { sort: '', dir: 1, cat: '', status: '', q: '' };

function _adminSortCol(col) {
  if (_adminProd.sort === col) { _adminProd.dir *= -1; }
  else { _adminProd.sort = col; _adminProd.dir = 1; }
  renderAdminProductsTable();
}
function _adminCatFilter(val) { _adminProd.cat = val; renderAdminProductsTable(); }
function _adminStatusFilter(val) { _adminProd.status = val; renderAdminProductsTable(); }

function renderAdminProductsTable() {
  const tbody = document.getElementById('adminProductsTbody');
  const cntEl = document.getElementById('adminProdCount');
  if (!tbody) return;

  const catNamesMap = {
    laptops:'💻 Лаптопи', desktops:'🖥 Настолни компютри', components:'⚙️ Компоненти',
    peripherals:'🖱 Периферия', network:'📡 Мрежово', storage:'💾 Сторидж',
    software:'📀 Софтуер', accessories:'🎒 Аксесоари',
    laptop:'💻 Лаптопи', desktop:'🖥 Настолни', monitor:'🖥 Монитор', gaming:'🎮 Гейминг',
    mobile:'📱 Телефон', tablet:'📟 Таблет', tv:'📺 TV', audio:'🎧 Аудио',
    camera:'📷 Камера', print:'🖨 Принтер', smart:'⌚ Смарт', acc:'🔌 Аксесоар'
  };

  let list = products.slice();

  // text search
  if (_adminProd.q) {
    const ql = _adminProd.q.toLowerCase();
    list = list.filter(p => (p.name+' '+(p.sku||'')+' '+(p.brand||'')).toLowerCase().includes(ql));
  }

  // category filter
  if (_adminProd.cat) list = list.filter(p => p.cat === _adminProd.cat);

  // status filter
  if (_adminProd.status === 'instock')  list = list.filter(p => p.stock !== false && p.stock !== 0 && (p.stock == null || p.stock > 5));
  else if (_adminProd.status === 'low') list = list.filter(p => p.stock != null && p.stock !== false && p.stock > 0 && p.stock <= 5);
  else if (_adminProd.status === 'oos') list = list.filter(p => p.stock === false || p.stock === 0);
  else if (_adminProd.status === 'sale') list = list.filter(p => p.badge === 'sale');
  else if (_adminProd.status === 'new')  list = list.filter(p => p.badge === 'new');
  else if (_adminProd.status === 'hot')  list = list.filter(p => p.badge === 'hot');

  // sort
  if (_adminProd.sort) {
    list.sort((a, b) => {
      let va, vb;
      if (_adminProd.sort === 'name')   { va = (a.name||'').toLowerCase(); vb = (b.name||'').toLowerCase(); }
      else if (_adminProd.sort === 'price')  { va = a.price; vb = b.price; }
      else if (_adminProd.sort === 'rating') { va = a.rating; vb = b.rating; }
      else if (_adminProd.sort === 'stock') {
        va = a.stock === false || a.stock === 0 ? -1 : (a.stock == null ? 9999 : a.stock);
        vb = b.stock === false || b.stock === 0 ? -1 : (b.stock == null ? 9999 : b.stock);
      }
      if (va < vb) return -1 * _adminProd.dir;
      if (va > vb) return 1 * _adminProd.dir;
      return 0;
    });
  }

  if (cntEl) cntEl.textContent = list.length + ' продукта';

  // update sort indicators on headers
  ['name','price','rating','stock'].forEach(col => {
    const el = document.getElementById('_ath_' + col);
    if (!el) return;
    el.textContent = { name:'Продукт', price:'Цена', rating:'Рейтинг', stock:'Наличност' }[col]
      + (_adminProd.sort === col ? (_adminProd.dir === 1 ? ' ↑' : ' ↓') : ' ↕');
  });

  // update status filter active state
  document.querySelectorAll('.admin-status-btn').forEach(btn => {
    btn.style.background = btn.dataset.val === _adminProd.status
      ? 'rgba(96,165,250,0.25)' : 'rgba(255,255,255,0.05)';
    btn.style.color = btn.dataset.val === _adminProd.status ? '#60a5fa' : '#9ca3af';
    btn.style.borderColor = btn.dataset.val === _adminProd.status ? 'rgba(96,165,250,0.4)' : 'transparent';
  });

  tbody.innerHTML = list.map(p => `
    <tr id="admin-prod-row-${p.id}">
      <td><input type="checkbox" class="admin-prod-cb" data-id="${p.id}" onchange="adminUpdateSelection()" style="cursor:pointer;accent-color:#f87171;width:15px;height:15px;"></td>
      <td><div class="admin-product-thumb">${p.emoji}</div></td>
      <td style="color:#fff;font-weight:600;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.name}</td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#6b7280;">${p.sku}</td>
      <td style="color:#34d399;font-weight:700;">${(p.price/EUR_RATE).toFixed(2)} €<div style="font-size:10px;color:#6b7280;">${p.price} лв.</div></td>
      <td style="color:#9ca3af;">${catNamesMap[p.cat]||p.cat}</td>
      <td>${p.badge==='sale'?'<span style="background:rgba(239,68,68,0.15);color:#f87171;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;">ПРОМО</span>':p.badge==='new'?'<span style="background:rgba(52,211,153,0.15);color:#34d399;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;">НОВО</span>':p.badge==='hot'?'<span style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;">ГОРЕЩО</span>':'<span style="color:#4b5563;font-size:11px;">—</span>'}</td>
      <td>${p.stock===false||p.stock===0?'<span style="color:#f87171;font-size:11px;">Изчерпан</span>':p.stock!=null&&p.stock<=5?`<span style="color:#fbbf24;font-size:11px;">${p.stock} бр.</span>`:'<span style="color:#34d399;font-size:11px;">✓</span>'}</td>
      <td>⭐ ${p.rating}</td>
      <td style="text-align:right;">
        <div style="display:flex;gap:5px;justify-content:flex-end;">
          <button type="button" style="background:rgba(96,165,250,0.1);color:#60a5fa;border:1px solid rgba(96,165,250,0.2);border-radius:6px;padding:5px 9px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.2s;" onclick="closeAdminPage();openProductModal(${p.id})" title="Преглед">👁</button>
          <button type="button" style="background:rgba(251,191,36,0.1);color:#fbbf24;border:1px solid rgba(251,191,36,0.2);border-radius:6px;padding:5px 9px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.2s;" onclick="openProductEditor(${p.id})" title="Редактирай">✏️</button>
          <button type="button" style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:6px;padding:5px 9px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.2s;" onclick="confirmDeleteProduct(${p.id})" title="Изтрий">🗑</button>
        </div>
      </td>
    </tr>`).join('');
}
function adminShowTab(tab) {
  document.querySelectorAll('.admin-nav-item').forEach(b=>b.classList.remove('active'));
  const active = document.querySelector(`.admin-nav-item[onclick*="'${tab}'"]`);
  if(active) active.classList.add('active');
  const main = document.getElementById('adminMain');
  if (!main) return;

  if (tab === 'dashboard') {
    // Compute real stats + chart data in a single pass over orders
    const allOrders = getAdminOrders();
    const nowDate = new Date();
    const thisMonth = nowDate.getMonth();
    const thisYear = nowDate.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    const realRevByMonth = {};
    let thisMoRev = 0, lastMoRev = 0, thisMoCnt = 0, lastMoCnt = 0, cancelledCnt = 0;
    allOrders.forEach(o => {
      const {m, y} = orderMonth(o);
      if (m === thisMonth && y === thisYear) { thisMoRev += o.total||0; thisMoCnt++; }
      if (m === lastMonth && y === lastYear) { lastMoRev += o.total||0; lastMoCnt++; }
      if (o.status === 'cancelled') cancelledCnt++;
      if (o.ts) { const key = y + '-' + m; realRevByMonth[key] = (realRevByMonth[key]||0) + (o.total||0); }
    });
    thisMoRev = thisMoRev || 47300; lastMoRev = lastMoRev || 61700;
    thisMoCnt = thisMoCnt || 143;   lastMoCnt = lastMoCnt || 119;
    const avgOrder = thisMoRev / thisMoCnt;
    const cancelledPct = allOrders.length > 0 ? (cancelledCnt / allOrders.length * 100).toFixed(1) : 2.1;
    const revDelta = lastMoRev > 0 ? ((thisMoRev - lastMoRev) / lastMoRev * 100).toFixed(0) : 18;
    const cntDelta = thisMoCnt - lastMoCnt;

    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">📊 Табло</div><div class="admin-page-sub">Добре дошъл! Ето резюме на магазина.</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      <div class="admin-stats-grid">
        <div class="admin-stat-card"><div class="admin-stat-icon">💰</div><div class="admin-stat-val">${thisMoRev.toLocaleString('bg-BG')} лв.</div><div class="admin-stat-label">Приходи този месец</div><div class="admin-stat-delta ${revDelta>=0?'up':'down'}">${revDelta>=0?'↑ +':'↓ '}${Math.abs(revDelta)}% спрямо м.м.</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">📦</div><div class="admin-stat-val">${thisMoCnt}</div><div class="admin-stat-label">Поръчки този месец</div><div class="admin-stat-delta ${cntDelta>=0?'up':'down'}">${cntDelta>=0?'↑ +':'↓ '}${Math.abs(cntDelta)} спрямо м.м.</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">👥</div><div class="admin-stat-val">${allOrders.length}</div><div class="admin-stat-label">Общо поръчки</div><div class="admin-stat-delta up">↑ всички времена</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">⭐</div><div class="admin-stat-val">4.83</div><div class="admin-stat-label">Среден рейтинг</div><div class="admin-stat-delta up">↑ +0.1 спрямо м.м.</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">🛒</div><div class="admin-stat-val">${avgOrder.toFixed(2)} лв.</div><div class="admin-stat-label">Средна стойност на поръчка</div><div class="admin-stat-delta up">↑ текущ месец</div></div>
        <div class="admin-stat-card"><div class="admin-stat-icon">↩</div><div class="admin-stat-val">${cancelledPct}%</div><div class="admin-stat-label">Отказани поръчки</div><div class="admin-stat-delta ${cancelledPct<=3?'up':'down'}">${cancelledPct<=3?'↓ Под нормата':'↑ Над нормата'}</div></div>
      </div>
      <div class="admin-chart-card">
        <div class="admin-chart-title">📈 Приходи по месеци (лв.)</div>
        <div class="admin-chart-bars">
          ${(()=>{
            const monthLabels = ['Яну','Фев','Мар','Апр','Май','Юни','Юли','Авг','Сеп','Окт','Ное','Дек'];
            const months = [];
            for (let i=5;i>=0;i--) {
              const d = new Date(nowDate.getFullYear(), nowDate.getMonth()-i, 1);
              months.push({m:monthLabels[d.getMonth()], month:d.getMonth(), year:d.getFullYear()});
            }
            const points = months.map((mo,i) => {
              const key = mo.year + '-' + mo.month;
              const realV = realRevByMonth[key];
              return {m: mo.m, v: realV !== undefined ? realV : (chartData[i]?.v||0)};
            });
            const mx = Math.max(...points.map(p=>p.v), 1);
            return points.map(d=>`
              <div class="admin-bar-wrap">
                <div class="admin-bar" style="height:${Math.round(d.v/mx*100)}%" data-val="${d.v.toLocaleString('bg-BG')} лв."></div>
                <div class="admin-bar-label">${d.m}</div>
              </div>`).join('');
          })()}
        </div>
      </div>
      <div class="admin-table-card">
        <div class="admin-table-header"><div class="admin-table-title">📦 Последни поръчки</div><button type="button" class="admin-table-action" onclick="adminShowTab('orders')">Виж всички →</button></div>
        <table class="admin-table">
          <thead><tr><th>#</th><th>Клиент</th><th>Продукти</th><th>Сума</th><th>Статус</th><th>Дата</th></tr></thead>
          <tbody>${allOrders.slice(0,4).map(o=>`<tr><td class="mono-11-gray">${o.num}</td><td class="text-white-semibold">${o.customer}</td><td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${o.items}</td><td class="text-success-strong">${fmtBgn(o.total)}</td><td><span class="admin-status ${o.status}">${adminStatuses[o.status]}</span></td><td>${o.date}</td></tr>`).join('')}</tbody>
        </table>
      </div>
      ${(()=>{
        const low = products.filter(p=>p.stock!==false&&p.stock!=null&&p.stock<=5);
        const oos = products.filter(p=>p.stock===false||p.stock===0);
        if (!low.length && !oos.length) return '';
        return `<div class="admin-table-card" style="border-color:rgba(251,191,36,0.3);">
          <div class="admin-table-header"><div class="admin-table-title" style="color:#fbbf24;">⚠️ Ниска наличност / Изчерпани</div><button type="button" class="admin-table-action" onclick="adminShowTab('inventory')">Виж всички →</button></div>
          <table class="admin-table"><thead><tr><th>Продукт</th><th>Наличност</th></tr></thead><tbody>${[...oos,...low].slice(0,5).map(p=>`<tr><td class="text-white-semibold">${p.name.substring(0,32)}</td><td>${p.stock===false||p.stock===0?'<span style="color:#f87171;font-weight:700;">Изчерпан</span>':`<span style="color:#fbbf24;font-weight:700;">${p.stock} бр.</span>`}</td></tr>`).join('')}</tbody></table>
        </div>`;
      })()}
      <div class="admin-table-card">
        <div class="admin-table-header"><div class="admin-table-title">🏆 Топ продукти</div></div>
        <table class="admin-table">
          <thead><tr><th></th><th>Продукт</th><th>Продадени</th><th>Приход</th><th>Рейтинг</th></tr></thead>
          <tbody>${products.slice(0,6).map(p=>`<tr><td><div class="admin-product-thumb">${p.emoji}</div></td><td class="text-white-semibold">${p.name.substring(0,28)}...</td><td>${Math.floor(Math.random()*80+20)}</td><td class="text-success-strong">${(p.price*(Math.floor(Math.random()*80+20))).toLocaleString()} лв.</td><td>⭐ ${p.rating}</td></tr>`).join('')}</tbody>
        </table>
      </div>`;
  } else if (tab === 'orders') {
    // Mark orders as seen
    try { localStorage.setItem('mc_orders_seen_ts', Date.now()); } catch(e) {}
    adminUpdateOrdersBadge();
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">📦 Поръчки</div><div class="admin-page-sub">Всички поръчки — ${getAdminOrders().length} намерени</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      <div class="admin-table-card">
        <div class="admin-table-header"><div class="admin-table-title">Последни поръчки</div><button type="button" class="admin-table-action" onclick="adminExportCSV()">⬇ CSV</button></div>
        <table class="admin-table">
          <thead><tr><th>#</th><th>Клиент</th><th>Продукти</th><th>Сума</th><th>Статус</th><th>Дата</th><th></th></tr></thead>
          <tbody>${getAdminOrders().map(o=>`<tr>
            <td class="mono-11-gray">${o.num}</td>
            <td class="text-white-semibold">${o.customer}<div style="font-size:10px;color:#6b7280;">${o.email||''}</div></td>
            <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#9ca3af;">${o.items}</td>
            <td class="text-success-strong">${fmtBgn(o.total)}</td>
            <td><select onchange="adminChangeOrderStatus('${o.num}',this.value)" style="background:#252840;border:1px solid #2d3148;border-radius:6px;padding:3px 6px;color:#e5e7eb;font-size:11px;font-family:'Outfit',sans-serif;cursor:pointer;">
              ${['pending','paid','shipped','cancelled'].map(s=>`<option value="${s}"${o.status===s?' selected':''}>${adminStatuses[s]}</option>`).join('')}
            </select></td>
            <td style="color:#6b7280;">${o.date}</td>
            <td style="text-align:right;"><button type="button" style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;" onclick="adminDeleteOrder('${o.num}')">🗑</button></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>`;
  } else if (tab === 'products') {
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">🏷 Продукти</div><div class="admin-page-sub" id="adminProdSub">${products.length} продукта в базата</div></div>
        <div style="display:flex;gap:10px;align-items:center;">
          <button type="button" class="admin-table-action" onclick="openProductEditor(null)">+ Добави продукт</button>
          <button type="button" class="admin-table-action" onclick="adminExportProductsJSON()" title="Изтегли всички продукти като JSON">⬇ JSON</button>
          <button type="button" class="admin-table-action" onclick="adminExportProductsCSV()" title="Изтегли всички продукти като CSV">⬇ CSV</button>
          <button type="button" id="adminBulkDeleteBtn" class="admin-table-action" onclick="adminBulkDelete()" style="display:none;background:rgba(248,113,113,0.15);color:#f87171;border-color:rgba(248,113,113,0.3);">🗑 Изтрий избраните (<span id="adminSelCount">0</span>)</button>
          <div id="adminBulkBadgeWrap" style="display:none;position:relative;">
            <button type="button" class="admin-table-action" onclick="adminToggleBadgeMenu()" style="gap:4px;">🏷 Бадж (<span id="adminBulkBadgeCount">0</span>) ▾</button>
            <div id="adminBadgeMenu" style="display:none;position:absolute;top:calc(100% + 4px);left:0;z-index:200;background:#1a1d35;border:1px solid #2d3148;border-radius:10px;padding:6px;min-width:150px;box-shadow:0 8px 24px rgba(0,0,0,0.4);">
              <div onclick="adminBulkSetBadge('sale')" style="padding:8px 12px;cursor:pointer;border-radius:6px;color:#f87171;font-size:12px;font-family:'Outfit',sans-serif;">🔴 Промо</div>
              <div onclick="adminBulkSetBadge('new')" style="padding:8px 12px;cursor:pointer;border-radius:6px;color:#34d399;font-size:12px;font-family:'Outfit',sans-serif;">🟢 Ново</div>
              <div onclick="adminBulkSetBadge('hot')" style="padding:8px 12px;cursor:pointer;border-radius:6px;color:#fbbf24;font-size:12px;font-family:'Outfit',sans-serif;">🟡 Горещо</div>
              <div onclick="adminBulkSetBadge('')" style="padding:8px 12px;cursor:pointer;border-radius:6px;color:#9ca3af;font-size:12px;font-family:'Outfit',sans-serif;">✖ Без бадж</div>
            </div>
          </div>
          <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
        </div>
      </div>
      <div class="admin-table-card">
        <div style="padding:10px 16px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;border-bottom:1px solid #2d3148;">
          <input id="adminProdSearchInput" style="background:#252840;border:1px solid #2d3148;border-radius:8px;padding:7px 12px;color:#e5e7eb;font-family:'Outfit',sans-serif;font-size:12px;outline:none;width:200px;" placeholder="🔍  Търси продукт…" oninput="adminFilterProducts(this.value)">
          <select onchange="_adminCatFilter(this.value)" style="background:#252840;border:1px solid #2d3148;border-radius:8px;padding:7px 10px;color:#e5e7eb;font-family:'Outfit',sans-serif;font-size:12px;cursor:pointer;outline:none;">
            <option value="">Всички категории</option>
            <option value="laptops">💻 Лаптопи</option>
            <option value="desktops">🖥 Настолни</option>
            <option value="components">⚙️ Компоненти</option>
            <option value="peripherals">🖱 Периферия</option>
            <option value="network">📡 Мрежово</option>
            <option value="storage">💾 Сторидж</option>
            <option value="software">📀 Софтуер</option>
            <option value="accessories">🎒 Аксесоари</option>
          </select>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            ${[['','Всички'],['instock','✓ В наличност'],['low','⚠ Малко'],['oos','✗ Изчерпани'],['sale','🔴 Промо'],['new','🟢 Ново'],['hot','🟡 Горещо']].map(([val,lbl])=>`<button type="button" class="admin-status-btn" data-val="${val}" onclick="_adminStatusFilter('${val}')" style="background:${_adminProd.status===val?'rgba(96,165,250,0.25)':'rgba(255,255,255,0.05)'};color:${_adminProd.status===val?'#60a5fa':'#9ca3af'};border:1px solid ${_adminProd.status===val?'rgba(96,165,250,0.4)':'transparent'};border-radius:6px;padding:4px 9px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;transition:all 0.15s;">${lbl}</button>`).join('')}
          </div>
          <div style="margin-left:auto;font-size:11px;color:#6b7280;" id="adminProdCount">${products.length} продукта</div>
        </div>
        <table class="admin-table" id="adminProductsTable">
          <thead><tr>
            <th style="width:32px;"><input type="checkbox" id="adminSelectAll" onchange="adminToggleSelectAll(this.checked)" style="cursor:pointer;accent-color:#f87171;width:15px;height:15px;"></th>
            <th></th>
            <th onclick="_adminSortCol('name')" style="cursor:pointer;user-select:none;white-space:nowrap;" title="Сортирай по продукт"><span id="_ath_name">Продукт ↕</span></th>
            <th>SKU</th>
            <th onclick="_adminSortCol('price')" style="cursor:pointer;user-select:none;white-space:nowrap;" title="Сортирай по цена"><span id="_ath_price">Цена ↕</span></th>
            <th>Категория</th>
            <th>Бадж</th>
            <th onclick="_adminSortCol('stock')" style="cursor:pointer;user-select:none;white-space:nowrap;" title="Сортирай по наличност"><span id="_ath_stock">Наличност ↕</span></th>
            <th onclick="_adminSortCol('rating')" style="cursor:pointer;user-select:none;white-space:nowrap;" title="Сортирай по рейтинг"><span id="_ath_rating">Рейтинг ↕</span></th>
            <th style="text-align:right;">Действия</th>
          </tr></thead>
          <tbody id="adminProductsTbody"></tbody>
        </table>
      </div>`;
    _adminProd.q = ''; _adminProd.sort = ''; _adminProd.dir = 1; _adminProd.cat = ''; _adminProd.status = '';
    renderAdminProductsTable();
  } else if (tab === 'customers') {
    const customers = ['Георги Тодоров','Мария Иванова','Петър Стоянов','Анна Петрова','Тодор Николов','Ивана Христова','Симон Борисов','Елена Димитрова'];
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">👥 Клиенти</div><div class="admin-page-sub">891 регистрирани клиента</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      <div class="admin-table-card">
        <table class="admin-table">
          <thead><tr><th>Клиент</th><th>Имейл</th><th>Поръчки</th><th>Общо похарчено</th><th>Регистриран</th></tr></thead>
          <tbody>${customers.map((c)=>`<tr><td class="text-white-semibold">${c}</td><td class="text-gray-600">${c.split(' ')[0].toLowerCase()}@gmail.com</td><td>${Math.floor(Math.random()*10+1)}</td><td class="text-success-strong">${(Math.floor(Math.random()*5000+500)).toLocaleString()} лв.</td><td class="text-gray-600">0${Math.floor(Math.random()*9+1)}.0${Math.floor(Math.random()*9+1)}.202${Math.floor(Math.random()*4+2)}</td></tr>`).join('')}</tbody>
        </table>
      </div>`;
  } else if (tab === 'import') {
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">📥 XML Импорт</div><div class="admin-page-sub">Зареди продукти от XML файл</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>

      <div class="xml-mode-tabs">
        <button type="button" class="xml-mode-tab active" onclick="xmlSwitchTab('file')">📁 Файл</button>
        <button type="button" class="xml-mode-tab" onclick="xmlSwitchTab('paste')">📋 Paste XML</button>
        <button type="button" class="xml-mode-tab" onclick="xmlSwitchTab('url')">🌐 URL</button>
        <button type="button" class="xml-mode-tab" onclick="xmlSwitchTab('json')">{ } JSON поръчки</button>
      </div>

      <!-- FILE TAB -->
      <div class="xml-tab-panel active" id="xml-tab-file">
        <div class="xml-drop-zone" id="xmlDropZone"
          ondragover="event.preventDefault();this.classList.add('drag-over')"
          ondragleave="this.classList.remove('drag-over')"
          ondrop="xmlHandleDrop(event)">
          <div class="xml-drop-icon">📂</div>
          <div class="xml-drop-title">Провлачи XML файл тук</div>
          <div class="xml-drop-sub">или избери ръчно от компютъра</div>
          <button type="button" class="xml-file-btn" onclick="document.getElementById('xmlFileInput').click()">📁 Избери файл</button>
          <input type="file" id="xmlFileInput" accept=".xml,text/xml" style="display:none" onchange="xmlHandleFile(this)">
        </div>
      </div>

      <!-- PASTE TAB -->
      <div class="xml-tab-panel" id="xml-tab-paste">
        <textarea class="xml-paste-area" id="xmlPasteArea" placeholder="Постави XML съдържание тук…"></textarea>
        <div style="display:flex;gap:10px;margin-top:12px;">
          <button type="button" class="xml-parse-btn" onclick="xmlParseAndPreview(document.getElementById('xmlPasteArea').value)">
            🔍 Анализирай XML
          </button>
          <button type="button" style="background:#252840;color:#9ca3af;border:1px solid #2d3148;border-radius:8px;padding:10px 16px;font-size:12px;cursor:pointer;font-family:'Outfit',sans-serif;" onclick="document.getElementById('xmlPasteArea').value='';document.getElementById('xmlPreviewArea').innerHTML=''">Изчисти</button>
        </div>
      </div>

      <!-- URL TAB -->
      <div class="xml-tab-panel" id="xml-tab-url">
        <div style="margin-bottom:14px;">
          <label style="font-size:11px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;display:block;margin-bottom:8px;">URL към XML файл</label>
          <div style="display:flex;gap:10px;">
            <input class="aef-input" id="xmlUrlInput" placeholder="https://example.com/products.xml" style="flex:1;font-family:'JetBrains Mono',monospace;font-size:12px;" onkeydown="if(event.key==='Enter')xmlFetchUrl()">
            <button type="button" class="xml-parse-btn" onclick="xmlFetchFromUI()" id="xmlFetchBtn">🌐 Зареди</button>
          </div>
          <div style="font-size:11px;color:#4b5563;margin-top:8px;">
            ⚠️ URL-ът трябва да поддържа <strong style="color:#6b7280;">CORS</strong> или да е от същия домейн. Работи с GitHub Raw, публични API-та и собствени сървъри.
          </div>
        </div>

        <!-- Quick examples -->
        <div style="margin-bottom:16px;">
          <div style="font-size:11px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Примерни формати URL:</div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            <div style="background:#0f1117;border:1px solid #2d3148;border-radius:8px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
              <div>
                <div style="font-size:11px;font-weight:700;color:#9ca3af;margin-bottom:2px;">GitHub Raw</div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#6b7280;">https://raw.githubusercontent.com/user/repo/main/products.xml</div>
              </div>
              <span style="font-size:18px;">🐙</span>
            </div>
            <div style="background:#0f1117;border:1px solid #2d3148;border-radius:8px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
              <div>
                <div style="font-size:11px;font-weight:700;color:#9ca3af;margin-bottom:2px;">Собствен сървър</div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#6b7280;">https://mostcomputers.bg/catalog/products.xml</div>
              </div>
              <span style="font-size:18px;">🖥</span>
            </div>
            <div style="background:#0f1117;border:1px solid #2d3148;border-radius:8px;padding:10px 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
              <div>
                <div style="font-size:11px;font-weight:700;color:#9ca3af;margin-bottom:2px;">Dropbox / Google Drive (public)</div>
                <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#6b7280;">https://dl.dropboxusercontent.com/s/…/products.xml</div>
              </div>
              <span style="font-size:18px;">☁️</span>
            </div>
          </div>
        </div>

        <!-- Auto-update settings -->
        <div class="autoupd-card" style="margin-top:16px;">
          <div class="autoupd-header">
            <div class="autoupd-header-left">
              <span style="font-size:20px;">🔄</span>
              <div>
                <div class="autoupd-title">Автоматично обновяване</div>
                <div class="autoupd-sub">Периодично зареждане от URL</div>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:12px;">
              <div class="autoupd-status-badge inactive" id="autoupdBadge">
                <div class="autoupd-dot"></div>
                <span id="autoupdBadgeText">Изключено</span>
              </div>
              <div class="autoupd-toggle-wrap">
                <span class="autoupd-toggle-label" id="autoupdToggleLabel">OFF</span>
                <label class="big-toggle">
                  <input type="checkbox" id="autoupdToggle" onchange="xmlToggleAutoUpdate(this.checked)">
                  <span class="big-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          <div class="autoupd-body">
            <div class="autoupd-settings">
              <div class="autoupd-field autoupd-field-full">
                <label class="autoupd-label">XML Категории за автоматично зареждане</label>
                <div id="multiFeedList" style="display:flex;flex-direction:column;gap:8px;margin-top:6px;"></div>
                <div style="display:flex;gap:8px;margin-top:10px;">
                  <input class="autoupd-input" id="newFeedUrl" placeholder="https://portal.mostbg.com/api/product/xml/categoryId=XX" style="flex:1;">
                  <input class="autoupd-input" id="newFeedLabel" placeholder="Описание (пр. Телевизори)" style="width:200px;">
                  <button type="button" onclick="addFeedUrl()" style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;font-family:'Outfit',sans-serif;">+ Добави</button>
                </div>
                <div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:6px;">При обновяване се зареждат всички включени категории последователно.</div>
              </div>
              <div class="autoupd-field">
                <label class="autoupd-label">Интервал</label>
                <select class="autoupd-select" id="autoupdInterval" onchange="xmlSaveAutoUpdSettings()">
                  <option value="3600000">На всеки 1 час</option>
                  <option value="7200000" selected>На всеки 2 часа</option>
                  <option value="10800000">На всеки 3 часа</option>
                  <option value="21600000">На всеки 6 часа</option>
                  <option value="43200000">На всеки 12 часа</option>
                  <option value="86400000">Веднъж дневно</option>
                </select>
              </div>
              <div class="autoupd-field">
                <label class="autoupd-label">При update</label>
                <select class="autoupd-select" id="autoupdMode" onchange="xmlSaveAutoUpdSettings()">
                  <option value="merge" selected>Запазват се (добавяне/обновяване)</option>
                  <option value="replace">Пълна замяна</option>
                </select>
              </div>
            </div>
            <div id="autoupdCountdownWrap" style="margin-top:14px;display:none;">
              <div class="autoupd-countdown">
                <div class="autoupd-cd-ring">
                  <svg viewBox="0 0 56 56" width="56" height="56">
                    <circle class="autoupd-cd-track" cx="28" cy="28" r="24"/>
                    <circle class="autoupd-cd-fill" id="autoupdCdCircle" cx="28" cy="28" r="24"
                      stroke-dasharray="150.8" stroke-dashoffset="0"/>
                  </svg>
                  <div class="autoupd-cd-text"><span id="autoupdCdMin">—</span><small>мин.</small></div>
                </div>
                <div class="autoupd-cd-info">
                  <div class="autoupd-cd-title">Следващо обновяване</div>
                  <div class="autoupd-cd-sub">
                    <span id="autoupdNextTime">—</span><br>
                    Последно: <span id="autoupdLastTime">никога</span>
                  </div>
                </div>
                <button type="button" class="autoupd-now-btn" id="autoupdNowBtn" onclick="xmlRunAutoUpdate(true)">
                  ⚡ Обнови сега
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Status indicator -->
        <div id="xmlUrlStatus"></div>
      </div>

      <!-- JSON ORDERS IMPORT TAB -->
      <div class="xml-tab-panel" id="xml-tab-json">
        <div style="font-size:12px;color:#9ca3af;margin-bottom:12px;">Импортирай поръчки от JSON файл (масив от поръчки или единична поръчка).</div>
        <textarea class="xml-paste-area" id="jsonImportArea" placeholder='[{"num":"MC-001","customer":"Иван Иванов","total":299,...}]' style="font-family:\'JetBrains Mono\',monospace;font-size:11px;"></textarea>
        <div style="display:flex;gap:10px;margin-top:12px;">
          <button type="button" class="xml-parse-btn" onclick="adminImportJSON(document.getElementById(\'jsonImportArea\').value)">⬆ Импортирай поръчки</button>
          <button type="button" class="xml-parse-btn" onclick="document.getElementById(\'jsonFileInput\').click()" style="background:#252840;">📁 От файл</button>
          <input type="file" id="jsonFileInput" accept=".json,application/json" style="display:none" onchange="(r=>{r.onload=e=>adminImportJSON(e.target.result);r.readAsText(this.files[0])})(new FileReader())">
        </div>
      </div>

      <!-- PREVIEW -->
      <div id="xmlPreviewArea"></div>

      <!-- UPDATE LOG -->
      <div class="autoupd-log" id="autoupdLogWrap" style="display:none;">
        <div class="autoupd-log-title">
          📋 Лог на обновяванията
          <button type="button" class="autoupd-log-clear" onclick="xmlClearLog()">✕ Изчисти лога</button>
        </div>
        <div class="autoupd-log-list" id="autoupdLogList"></div>
      </div>

      <!-- SAMPLE XML -->
      <div class="xml-sample-card" style="margin-top:24px;">
        <div class="xml-sample-header">
          <span class="xml-sample-title">📄 Примерен XML формат</span>
          <button type="button" class="xml-copy-btn" onclick="xmlCopySample()">📋 Копирай примера</button>
        </div>
        <div class="xml-code" id="xmlSampleCode">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;data&gt;
  &lt;productList&gt;
    &lt;product id="69062"&gt;
      &lt;name&gt;MSI GE68 HX RAIDER&lt;/name&gt;
      &lt;price&gt;2556.00&lt;/price&gt;
      &lt;currency&gt;EUR&lt;/currency&gt;
      &lt;category id="21"&gt;NOTEBOOK&lt;/category&gt;
      &lt;manufacturer id="7"&gt;MSI&lt;/manufacturer&gt;
      &lt;warrantyInMonths&gt;24&lt;/warrantyInMonths&gt;
      &lt;EAN&gt;GE68 HX RAIDER 14VHG-461BG&lt;/EAN&gt;
      &lt;PartNumber&gt;9S7-15M131-461&lt;/PartNumber&gt;
      &lt;product_status&gt;Обадете се&lt;/product_status&gt;
      &lt;gallery&gt;
        &lt;pictureUrl&gt;https://portal.mostbg.com/api/images/imageFileData/38131.png&lt;/pictureUrl&gt;
      &lt;/gallery&gt;
      &lt;searchStringParts&gt;
        &lt;description name="MSI"&gt;Производител - MSI&lt;/description&gt;
        &lt;description name="I9-14"&gt;Процесор Intel i9 14-то поколение&lt;/description&gt;
        &lt;description name="RTX4080"&gt;Видео карта Nvidia RTX 4080&lt;/description&gt;
      &lt;/searchStringParts&gt;
      &lt;properties&gt;
        &lt;property name="CPU model"&gt;Intel Core i9-14900HX&lt;/property&gt;
        &lt;property name="Memory size"&gt;32 GB DDR5&lt;/property&gt;
        &lt;property name="Graphics"&gt;RTX 4080 12GB GDDR6&lt;/property&gt;
        &lt;property name="Screen size"&gt;16"&lt;/property&gt;
        &lt;property name="SSD"&gt;2 TB NVMe&lt;/property&gt;
      &lt;/properties&gt;
    &lt;/product&gt;
  &lt;/productList&gt;
&lt;/data&gt;</div>
      </div>
    `;
    xmlInitDrop();
    // Ensure all products have extended fields
  products.forEach(p => {
    if (!p.gallery)   p.gallery   = p.img ? [p.img] : [];
    if (!p.htmlDesc)  p.htmlDesc  = '';
    if (!p.videoUrl)  p.videoUrl  = '';
    if (!p.vendorUrl) p.vendorUrl = '';
  });
  xmlRestoreAutoUpdSettings();

  } else if (tab === 'export') {
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">📤 XML Експорт</div><div class="admin-page-sub">Изтегли всички продукти като XML</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      <div class="admin-table-card" style="padding:28px;">
        <div style="text-align:center;margin-bottom:28px;">
          <div style="font-size:52px;margin-bottom:12px;">📤</div>
          <div style="font-size:18px;font-weight:800;color:#fff;margin-bottom:8px;">Експортирай продуктовия каталог</div>
          <div style="font-size:13px;color:#6b7280;margin-bottom:24px;">Изтегля XML файл с всичките <strong style="color:#fff">${products.length} продукта</strong>.</div>
          <button type="button" class="xml-parse-btn" style="margin:0 auto;justify-content:center;" onclick="xmlExport()">
            ⬇️ Изтегли products.xml
          </button>
        </div>
        <div style="background:#0f1117;border:1px solid #2d3148;border-radius:10px;padding:16px;">
          <div style="font-size:11px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;">Preview (първи 3 продукта)</div>
          <pre style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#a5b4fc;line-height:1.6;overflow-x:auto;white-space:pre;">${xmlPreviewExport()}</pre>
        </div>
      </div>
    `;

  } else if (tab === 'settings') {
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">⚙ Настройки</div><div class="admin-page-sub">Общи настройки на магазина</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      <div class="admin-table-card" style="padding:28px;display:flex;flex-direction:column;gap:28px;">

        <!-- SEO -->
        <div>
          <div style="font-size:13px;font-weight:800;color:#fff;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #2d3148;">🔍 SEO & Sitemap</div>
          <p style="font-size:12px;color:#6b7280;margin-bottom:14px;">Генерира <code style="color:#a5b4fc;">sitemap.xml</code> с всички продуктови URL-и за Google Search Console.</p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:10px;">
            <input id="sitemapBaseUrl" placeholder="https://mostcomputers.bg" value="https://mostcomputers.bg"
              style="flex:1;min-width:220px;background:#0f1117;border:1px solid #2d3148;border-radius:8px;padding:10px 14px;color:#fff;font-size:13px;font-family:'Outfit',sans-serif;">
            <button type="button" onclick="generateSitemap()"
              style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;white-space:nowrap;">
              ⬇️ Изтегли sitemap.xml
            </button>
          </div>
          <div id="sitemapStatus" style="font-size:12px;color:#6b7280;"></div>
        </div>

        <!-- Currency -->
        <div>
          <div style="font-size:13px;font-weight:800;color:#fff;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #2d3148;">💱 Валутен курс BGN/EUR</div>
          <div style="display:flex;gap:10px;align-items:center;">
            <span style="font-size:12px;color:#6b7280;">1 EUR =</span>
            <input id="eurRateInput" value="${localStorage.getItem('eurRate')||'1.95583'}" type="number" step="0.00001"
              style="width:120px;background:#0f1117;border:1px solid #2d3148;border-radius:8px;padding:8px 12px;color:#fff;font-size:13px;font-family:'JetBrains Mono',monospace;">
            <span style="font-size:12px;color:#6b7280;">BGN</span>
            <button type="button" onclick="saveEurRate()"
              style="background:var(--accent2);color:#fff;border:none;border-radius:8px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">
              Запази
            </button>
          </div>
        </div>

        <!-- Danger zone -->
        <div>
          <div style="font-size:13px;font-weight:800;color:#f87171;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid rgba(248,113,113,0.2);">⚠️ Опасна зона</div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button type="button" onclick="if(confirm('Изтрий всички продукти?')){products=[];renderGrids();showToast('✓ Всички продукти изтрити');}"
              style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:8px;padding:10px 16px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">
              🗑 Изтрий всички продукти
            </button>
            <button type="button" onclick="localStorage.clear();showToast('✓ localStorage изчистен');location.reload();"
              style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:8px;padding:10px 16px;font-size:12px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;">
              🔄 Нулиране на настройките
            </button>
          </div>
        </div>
      </div>
    `;
  } else if (tab === 'settings') {
    main.innerHTML = `<div class="admin-topbar"><div><div class="admin-page-title">⚙ Настройки</div><div class="admin-page-sub">SEO инструменти и системни настройки</div></div><button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button></div>
    <div class="admin-table-card" style="padding:24px;">
      <div class="admin-chart-title">🗺 SEO инструменти</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;">
        <button type="button" class="admin-table-action" style="padding:12px 20px;font-size:13px;" onclick="closeAdminPage();generateSitemap()">🗺 Генерирай sitemap.xml</button>
        <button type="button" class="admin-table-action" style="padding:12px 20px;font-size:13px;background:rgba(96,165,250,0.1);color:#60a5fa;border-color:rgba(96,165,250,0.2);" onclick="showToast('robots.txt: User-agent: * / Allow: /')">🤖 Преглед robots.txt</button>
        <button type="button" class="admin-table-action" style="padding:12px 20px;font-size:13px;background:rgba(52,211,153,0.1);color:#34d399;border-color:rgba(52,211,153,0.2);" onclick="showToast('Schema.org JSON-LD е активен за всички продукти')">📊 Schema.org статус</button>
      </div>
      <div style="margin-top:20px;padding:16px;background:#252840;border-radius:8px;font-size:12px;color:#6b7280;font-family:'JetBrains Mono',monospace;line-height:1.8;">
        <div style="color:#34d399;">✓ JSON-LD Product schema — активен</div>
        <div style="color:#34d399;">✓ OG / Twitter Card meta — активен</div>
        <div style="color:#34d399;">✓ foundingDate: 1997 — активен</div>
        <div style="color:#fbbf24;">⚠ sitemap.xml — генерирай ръчно</div>
        <div style="color:#fbbf24;">⚠ robots.txt — нужен при хостинг</div>
      </div>
    </div>`;
  } else if (tab === 'newsletter') {
    let subs = [];
    try { subs = JSON.parse(localStorage.getItem('mc_newsletter') || '[]'); } catch(e) {}
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">📩 Newsletter</div><div class="admin-page-sub">${subs.length} абонирани имейла</div></div>
        <div style="display:flex;gap:10px;align-items:center;">
          <button type="button" class="admin-table-action" onclick="adminExportNewsletter()">⬇ CSV</button>
          <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
        </div>
      </div>
      <div class="admin-table-card">
        <div class="admin-table-header">
          <div class="admin-table-title">Абонирани имейли</div>
          <div style="font-size:12px;color:#6b7280;">Събрани от newsletter формата на сайта</div>
        </div>
        ${subs.length === 0
          ? `<div style="text-align:center;padding:60px 20px;color:#4b5563;font-size:14px;">Все още няма абонирани имейли.<br><span style="font-size:11px;">Те ще се появят след като клиент се абонира от сайта.</span></div>`
          : `<table class="admin-table">
              <thead><tr><th>#</th><th>Имейл</th><th style="text-align:right;">Действия</th></tr></thead>
              <tbody id="nlTable">${subs.map((email, i) => `
                <tr id="nl-row-${i}">
                  <td class="mono-11-gray">${i + 1}</td>
                  <td style="color:#e5e7eb;font-size:13px;">${email}</td>
                  <td style="text-align:right;"><button type="button" onclick="adminDeleteNL(${i})" style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;">🗑</button></td>
                </tr>`).join('')}
              </tbody>
            </table>`}
      </div>`;
  } else if (tab === 'bis') {
    // Collect all mc_bis_* entries from localStorage
    const bisEntries = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('mc_bis_')) {
        const pid = Number(key.replace('mc_bis_', ''));
        const p = products.find(x => x.id === pid);
        let emails = [];
        try { emails = JSON.parse(localStorage.getItem(key) || '[]'); } catch(e) { emails = [localStorage.getItem(key)]; }
        if (!Array.isArray(emails)) emails = [emails];
        emails.forEach(email => bisEntries.push({ pid, email, pname: p?.name || 'ID: '+pid, emoji: p?.emoji || '📦' }));
      }
    }
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">🔔 BIS заявки</div><div class="admin-page-sub">${bisEntries.length} заявки за уведомяване при наличност</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      <div class="admin-table-card">
        ${bisEntries.length === 0
          ? `<div style="text-align:center;padding:60px 20px;color:#4b5563;font-size:14px;">Няма BIS заявки.<br><span style="font-size:11px;">Появяват се когато клиент иска уведомление при наличност на изчерпан продукт.</span></div>`
          : `<table class="admin-table">
              <thead><tr><th>#</th><th>Продукт</th><th>Имейл</th><th style="text-align:right;">Действия</th></tr></thead>
              <tbody>${bisEntries.map((row, i) => `
                <tr>
                  <td class="mono-11-gray">${i+1}</td>
                  <td><span style="font-size:18px;">${row.emoji}</span> <span style="font-size:12px;color:#e5e7eb;">${row.pname.substring(0,30)}</span></td>
                  <td style="color:#e5e7eb;font-size:13px;">${row.email}</td>
                  <td style="text-align:right;"><button type="button" onclick="adminDeleteBIS(${row.pid},'${row.email}')" style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;">🗑</button></td>
                </tr>`).join('')}
              </tbody>
            </table>`}
      </div>`;
  } else if (tab === 'reviews') {
    let allRevs = [];
    try {
      const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
      Object.entries(saved).forEach(([pid, revs]) => {
        revs.forEach((r, i) => {
          const p = products.find(x => x.id === Number(pid));
          allRevs.push({ ...r, _pid: Number(pid), _idx: i, _pname: p?.name || 'Неизвестен продукт', _emoji: p?.emoji || '📦' });
        });
      });
    } catch(e) {}
    allRevs.sort((a, b) => (b.pending ? 1 : 0) - (a.pending ? 1 : 0));
    const pendingCnt = allRevs.filter(r => r.pending).length;
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">📝 Ревюта</div><div class="admin-page-sub">${allRevs.length} ревюта${pendingCnt > 0 ? ` · <span style="color:#fbbf24;">${pendingCnt} чакат одобрение</span>` : ''}</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      ${allRevs.length === 0
        ? `<div class="admin-table-card"><div style="text-align:center;padding:60px 20px;color:#4b5563;font-size:14px;">Все още няма ревюта.</div></div>`
        : `<div class="admin-table-card">
            <table class="admin-table">
              <thead><tr><th>Продукт</th><th>Клиент</th><th>Рейтинг</th><th>Ревю</th><th>Дата</th><th>Статус</th><th style="text-align:right;">Действия</th></tr></thead>
              <tbody>${allRevs.map(r => `
                <tr>
                  <td style="white-space:nowrap;"><span style="font-size:18px;">${r._emoji}</span> <span style="font-size:11px;color:#9ca3af;max-width:120px;overflow:hidden;text-overflow:ellipsis;display:inline-block;vertical-align:middle;">${r._pname.substring(0,20)}</span></td>
                  <td style="color:#e5e7eb;font-weight:600;">${r.name}</td>
                  <td style="color:#fbbf24;white-space:nowrap;">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</td>
                  <td style="max-width:240px;color:#9ca3af;font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.text}</td>
                  <td style="color:#6b7280;font-size:11px;white-space:nowrap;">${r.date}</td>
                  <td>${r.pending ? '<span style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:2px 10px;border-radius:10px;font-size:11px;font-weight:700;">Чака</span>' : '<span style="background:rgba(52,211,153,0.15);color:#34d399;padding:2px 10px;border-radius:10px;font-size:11px;font-weight:700;">Одобрено</span>'}</td>
                  <td style="text-align:right;white-space:nowrap;">
                    ${r.pending ? `<button type="button" onclick="adminApproveReview(${r._pid},${r._idx})" style="background:rgba(52,211,153,0.1);color:#34d399;border:1px solid rgba(52,211,153,0.2);border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;margin-right:4px;">✓ Одобри</button>` : ''}
                    <button type="button" onclick="adminDeleteReview(${r._pid},${r._idx})" style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;">🗑</button>
                  </td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>`}`;
  } else if (tab === 'inventory') {
    const lowStock = products.filter(p => p.stock !== false && p.stock != null && p.stock <= 5);
    const outOfStock = products.filter(p => p.stock === false || p.stock === 0);
    const inStock = products.filter(p => p.stock == null || (p.stock !== false && p.stock > 5));
    main.innerHTML = `
      <div class="admin-topbar">
        <div><div class="admin-page-title">📦 Инвентар</div><div class="admin-page-sub">Управление на наличности</div></div>
        <button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button>
      </div>
      <div class="admin-stats-grid" style="grid-template-columns:repeat(3,1fr);">
        <div class="admin-stat-card"><div class="admin-stat-icon">✅</div><div class="admin-stat-val">${inStock.length}</div><div class="admin-stat-label">В наличност</div></div>
        <div class="admin-stat-card" style="border-color:rgba(251,191,36,0.3);"><div class="admin-stat-icon">⚠️</div><div class="admin-stat-val" style="color:#fbbf24;">${lowStock.length}</div><div class="admin-stat-label">Ниска наличност (≤5)</div></div>
        <div class="admin-stat-card" style="border-color:rgba(248,113,113,0.3);"><div class="admin-stat-icon">❌</div><div class="admin-stat-val" style="color:#f87171;">${outOfStock.length}</div><div class="admin-stat-label">Изчерпани</div></div>
      </div>
      ${lowStock.length > 0 ? `
      <div class="admin-table-card" style="border-color:rgba(251,191,36,0.3);">
        <div class="admin-table-header"><div class="admin-table-title" style="color:#fbbf24;">⚠️ Ниска наличност</div></div>
        <table class="admin-table">
          <thead><tr><th></th><th>Продукт</th><th>SKU</th><th>Наличност</th><th style="text-align:right;">Действия</th></tr></thead>
          <tbody>${lowStock.map(p=>`<tr>
            <td><div class="admin-product-thumb">${p.emoji}</div></td>
            <td style="color:#fff;font-weight:600;">${p.name.substring(0,40)}</td>
            <td class="mono-11-gray">${p.sku||'—'}</td>
            <td><span style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:700;">${p.stock} бр.</span></td>
            <td style="text-align:right;"><button type="button" onclick="openProductEditor(${p.id})" style="background:rgba(251,191,36,0.1);color:#fbbf24;border:1px solid rgba(251,191,36,0.2);border-radius:6px;padding:5px 9px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;">✏️ Редактирай</button></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>` : ''}
      ${outOfStock.length > 0 ? `
      <div class="admin-table-card" style="border-color:rgba(248,113,113,0.3);">
        <div class="admin-table-header"><div class="admin-table-title" style="color:#f87171;">❌ Изчерпани</div></div>
        <table class="admin-table">
          <thead><tr><th></th><th>Продукт</th><th>SKU</th><th>Статус</th><th style="text-align:right;">Действия</th></tr></thead>
          <tbody>${outOfStock.map(p=>`<tr>
            <td><div class="admin-product-thumb">${p.emoji}</div></td>
            <td style="color:#fff;font-weight:600;">${p.name.substring(0,40)}</td>
            <td class="mono-11-gray">${p.sku||'—'}</td>
            <td><span style="background:rgba(248,113,113,0.15);color:#f87171;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:700;">Изчерпан</span></td>
            <td style="text-align:right;"><button type="button" onclick="openProductEditor(${p.id})" style="background:rgba(251,191,36,0.1);color:#fbbf24;border:1px solid rgba(251,191,36,0.2);border-radius:6px;padding:5px 9px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;">✏️ Редактирай</button></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>` : ''}
      <div class="admin-table-card">
        <div class="admin-table-header">
          <div class="admin-table-title">Всички продукти</div>
          <input style="background:#252840;border:1px solid #2d3148;border-radius:8px;padding:7px 12px;color:#e5e7eb;font-family:'Outfit',sans-serif;font-size:12px;outline:none;width:200px;" placeholder="🔍  Търси…" oninput="adminFilterInventory(this.value)">
        </div>
        <table class="admin-table" id="inventoryTable">
          <thead><tr><th></th><th>Продукт</th><th>SKU</th><th>Цена</th><th>Наличност</th><th style="text-align:right;">Действия</th></tr></thead>
          <tbody id="inventoryTbody">${products.map(p=>`<tr>
            <td><div class="admin-product-thumb">${p.emoji}</div></td>
            <td style="color:#fff;font-weight:600;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.name}</td>
            <td class="mono-11-gray">${p.sku||'—'}</td>
            <td style="color:#34d399;font-weight:700;">${p.price} лв.</td>
            <td>${p.stock===false||p.stock===0?'<span style="background:rgba(248,113,113,0.15);color:#f87171;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:700;">Изчерпан</span>':p.stock!=null&&p.stock<=5?`<span style="background:rgba(251,191,36,0.15);color:#fbbf24;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:700;">${p.stock} бр.</span>`:'<span style="background:rgba(52,211,153,0.15);color:#34d399;padding:2px 10px;border-radius:10px;font-size:12px;font-weight:700;">В наличност</span>'}</td>
            <td style="text-align:right;"><button type="button" onclick="openProductEditor(${p.id})" style="background:rgba(251,191,36,0.1);color:#fbbf24;border:1px solid rgba(251,191,36,0.2);border-radius:6px;padding:5px 9px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;">✏️</button></td>
          </tr>`).join('')}
          </tbody>
        </table>
      </div>`;
  } else {
    main.innerHTML = `<div class="admin-topbar"><div><div class="admin-page-title">🚧 В разработка</div><div class="admin-page-sub">Тази секция скоро ще е готова.</div></div><button type="button" class="admin-close-btn" onclick="closeAdminPage()">✕ Затвори</button></div><div style="text-align:center;padding:80px 20px;color:#4b5563;font-size:48px;">🚧</div>`;
  }
}

// Add admin link to profile dropdown
document.addEventListener('DOMContentLoaded', () => {
  // Pre-configure Most Computers XML feed URL if not already set
  if (!localStorage.getItem('mc_autoupd_url')) {
    localStorage.setItem('mc_autoupd_url', 'https://portal.mostbg.com/api/product/xml/categoryId=21');
  }
  if (!localStorage.getItem('mc_autoupd_urls')) {
    // Default multi-category URLs
    localStorage.setItem('mc_autoupd_urls', JSON.stringify([
      { id: 'cat21', label: 'Лаптопи (cat 21)',         url: 'https://portal.mostbg.com/api/product/xml/categoryId=21', enabled: true },
      { id: 'cat22', label: 'Телефони (cat 22)',         url: 'https://portal.mostbg.com/api/product/xml/categoryId=22', enabled: false },
      { id: 'cat23', label: 'Таблети (cat 23)',          url: 'https://portal.mostbg.com/api/product/xml/categoryId=23', enabled: false },
      { id: 'cat24', label: 'Монитори (cat 24)',         url: 'https://portal.mostbg.com/api/product/xml/categoryId=24', enabled: false },
      { id: 'cat25', label: 'Принтери (cat 25)',         url: 'https://portal.mostbg.com/api/product/xml/categoryId=25', enabled: false },
      { id: 'cat26', label: 'Мрежово оборудване (cat 26)', url: 'https://portal.mostbg.com/api/product/xml/categoryId=26', enabled: false },
      { id: 'cat27', label: 'Аксесоари (cat 27)',        url: 'https://portal.mostbg.com/api/product/xml/categoryId=27', enabled: false },
    ]));
  }
  // Render all grids after DOM is ready
  renderGrids();
  xmlRestoreAutoUpdSettings();
  // Auto-start feed on first load
  if (!localStorage.getItem('mc_feed_initial_done')) {
    localStorage.setItem('mc_feed_initial_done', '1');
    localStorage.setItem('mc_autoupd_enabled', '1');
    setTimeout(() => xmlRunAutoUpdate(false), 1500); // slight delay after render
  }
  initSidebarFilters();
  renderRecentlyViewed();

  // Admin panel link in profile dropdown
  const pdDivider = document.querySelector('.pd-divider');
  if (pdDivider) {
    const adminBtn = document.createElement('button');
    adminBtn.className = 'pd-item';
    adminBtn.innerHTML = '<span class="pd-icon">🔐</span>Admin панел';
    adminBtn.onclick = () => { closeDropdown(); openAdminPage(); };
    pdDivider.parentNode.insertBefore(adminBtn, pdDivider);
  }
  // Init 404 page popular products
  const g = document.getElementById('err404Grid');
  if (g) {
    const top4 = [...products].sort((a,b)=>b.rating-a.rating).slice(0,4);
    g.innerHTML = top4.map(p=>`<div class="err-popular-card" onclick="close404();openProductModal(${p.id})"><div class="err-popular-emoji">${p.emoji}</div><div><div class="err-popular-name">${p.name.substring(0,22)}…</div><div class="err-popular-price">${p.price} лв.</div></div></div>`).join('');
  }
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { openAdminPage, closeAdminPage };
}

// ===== ADMIN PRODUCT EDITOR =====
let aefEditingId = null; // null = new product
let aefSelectedBadge = 'none';

function openProductEditor(id) {
  aefEditingId = id;
  aefSelectedBadge = 'none';

  const isNew = id === null;
  document.getElementById('aefModeIcon').textContent = isNew ? '➕' : '✏️';
  document.getElementById('aefModalTitle').textContent = isNew ? 'Добави нов продукт' : 'Редактирай продукт';
  document.getElementById('aefDeleteBtn').style.display = isNew ? 'none' : 'flex';

  if (!isNew) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('aef-name').value    = p.name || '';
    document.getElementById('aef-brand').value   = p.brand || '';
    document.getElementById('aef-cat').value     = p.cat || 'components';
    aefUpdateSubcats(p.subcat || '');
    document.getElementById('aef-price').value   = p.price || '';
    document.getElementById('aef-old').value     = p.old || '';
    document.getElementById('aef-rating').value  = p.rating || '';
    document.getElementById('aef-rv').value      = p.rv || '';
    document.getElementById('aef-emoji').value   = p.emoji || '';
    document.getElementById('aef-sku').value     = p.sku || '';
    document.getElementById('aef-img').value     = p.img || '';
    document.getElementById('aef-desc').value    = p.desc || '';
    if(document.getElementById('aef-htmldesc')) document.getElementById('aef-htmldesc').value = p.htmlDesc || '';
    if(document.getElementById('aef-video'))    document.getElementById('aef-video').value    = p.videoUrl || '';
    if(document.getElementById('aef-vendor'))   document.getElementById('aef-vendor').value   = p.vendorUrl || '';
    const stockEl = document.getElementById('aef-stock');
    if (stockEl) stockEl.value = p.stock === false ? 0 : (p.stock != null ? p.stock : '');
    previewAefImg(p.img || '');
    aefSelectedBadge = p.badge || 'none';
    // Specs
    buildSpecsUI(p.specs || {});
  } else {
    // Clear all fields
    ['aef-name','aef-brand','aef-price','aef-old','aef-rating','aef-rv','aef-stock','aef-emoji','aef-sku','aef-img','aef-desc','aef-htmldesc','aef-video','aef-vendor'].forEach(id => {
      const el = document.getElementById(id); if(el) el.value = '';
    });
    document.getElementById('aef-cat').value = 'components';
    aefUpdateSubcats('');
    document.getElementById('aef-emoji').value = '📦';
    previewAefImg('');
    buildSpecsUI({});
  }

  // Badge UI
  selectBadge(aefSelectedBadge);

  document.getElementById('adminEditorBackdrop').classList.add('open');
}

function closeProductEditor() {
  document.getElementById('adminEditorBackdrop').classList.remove('open');
}

function selectBadge(val) {
  aefSelectedBadge = val;
  ['none','sale','new','hot'].forEach(b => {
    const el = document.getElementById('badge-' + b);
    if (el) el.classList.toggle('active', b === val);
  });
}

function aefUpdateSubcats(selectedId = '') {
  const cat = document.getElementById('aef-cat')?.value;
  const group = document.getElementById('aef-subcat-group');
  const select = document.getElementById('aef-subcat');
  if (!group || !select) return;
  const subs = (typeof SUBCATS !== 'undefined' && SUBCATS[cat]) ? SUBCATS[cat] : [];
  if (!subs.length) { group.style.display = 'none'; select.value = ''; return; }
  group.style.display = '';
  select.innerHTML = `<option value="">— без подкатегория —</option>` +
    subs.map(s => `<option value="${s.id}" ${s.id === selectedId ? 'selected' : ''}>${s.label}</option>`).join('');
}

function previewAefImg(url) {
  const preview = document.getElementById('aefImgPreview');
  if (!preview) return;
  if (url && url.startsWith('http')) {
    preview.innerHTML = `<img src="${url}" alt="${document.getElementById('aefName')?.value||'Продукт'}" onerror="this.style.display='none';document.getElementById('aefImgPlaceholder').style.display='block'">
      <span class="aef-img-placeholder" id="aefImgPlaceholder" style="display:none">${document.getElementById('aef-emoji')?.value || '🖼'}</span>`;
  } else {
    preview.innerHTML = `<span class="aef-img-placeholder" id="aefImgPlaceholder">${document.getElementById('aef-emoji')?.value || '🖼'}</span>`;
  }
}

function buildSpecsUI(specs) {
  const list = document.getElementById('aefSpecsList');
  if (!list) return;
  list.innerHTML = Object.entries(specs).map(([k,v]) => specRowHTML(k,v)).join('');
}

function specRowHTML(key='', val='') {
  return `<div class="aef-spec-row">
    <input class="aef-input spec-key" placeholder="Ключ (пр. Батерия)" value="${key}" style="max-width:160px;">
    <input class="aef-input spec-val" placeholder="Стойност (пр. 30 часа)" value="${val}">
    <button type="button" class="aef-spec-remove" onclick="this.parentElement.remove()" title="Премахни">−</button>
  </div>`;
}

function addSpecRow() {
  const list = document.getElementById('aefSpecsList');
  if (!list) return;
  list.insertAdjacentHTML('beforeend', specRowHTML());
  list.lastElementChild?.querySelector('.spec-key')?.focus();
}

function getSpecsFromUI() {
  const rows = document.querySelectorAll('#aefSpecsList .aef-spec-row');
  const specs = {};
  rows.forEach(row => {
    const k = row.querySelector('.spec-key')?.value?.trim();
    const v = row.querySelector('.spec-val')?.value?.trim();
    if (k && v) specs[k] = v;
  });
  return specs;
}

function saveProductEditor() {
  const name  = document.getElementById('aef-name').value.trim();
  const price = parseFloat(document.getElementById('aef-price').value);
  const brand = document.getElementById('aef-brand').value.trim();

  if (!name)  { showToast('⚠️ Въведи наименование!'); return; }
  if (!price || price <= 0) { showToast('⚠️ Въведи валидна цена!'); return; }
  if (!brand) { showToast('⚠️ Въведи марка!'); return; }

  const oldPrice = parseFloat(document.getElementById('aef-old').value) || null;
  const pct = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const newImg = document.getElementById('aef-img').value.trim();
  const updatedData = {
    name,
    brand,
    cat:      document.getElementById('aef-cat').value,
    subcat:   document.getElementById('aef-subcat')?.value || '',
    price,
    old:      oldPrice,
    pct,
    rating:   parseFloat(document.getElementById('aef-rating').value) || 4.5,
    rv:       parseInt(document.getElementById('aef-rv').value) || 0,
    emoji:    document.getElementById('aef-emoji').value.trim() || '📦',
    sku:      document.getElementById('aef-sku').value.trim(),
    img:      newImg,
    gallery:  newImg ? [newImg] : [],
    desc:     document.getElementById('aef-desc').value.trim(),
    htmlDesc: document.getElementById('aef-htmldesc')?.value?.trim() || '',
    videoUrl: document.getElementById('aef-video')?.value?.trim() || '',
    vendorUrl:document.getElementById('aef-vendor')?.value?.trim() || '',
    badge:    aefSelectedBadge === 'none' ? '' : aefSelectedBadge,
    specs:    getSpecsFromUI(),
    stock:    (()=>{ const v = document.getElementById('aef-stock')?.value; if(v===''||v==null) return null; const n=parseInt(v); return n===0?false:n; })(),
  };

  if (aefEditingId === null) {
    // New product — generate new ID
    const newId = Math.max(...products.map(p=>p.id)) + 1;
    updatedData.id = newId;
    updatedData.reviews = [];
    products.push(updatedData);
    showToast(`✅ Продуктът "${name.substring(0,24)}…" е добавен!`);
  } else {
    // Edit existing
    const idx = products.findIndex(p => p.id === aefEditingId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updatedData };
      showToast(`✅ "${name.substring(0,24)}…" е обновен!`);
    }
  }

  closeProductEditor();
  persistProducts();
  // Re-render grids and refresh admin table
  renderGrids();
  adminShowTab('products');

  // Flash the row
  if (aefEditingId !== null) {
    setTimeout(() => {
      const row = document.getElementById('admin-prod-row-' + aefEditingId);
      if (row) { row.classList.add('aef-saved-flash'); setTimeout(()=>row.classList.remove('aef-saved-flash'),600); }
    }, 100);
  }
}

function confirmDeleteProduct(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  if (confirm(`Сигурен ли си, че искаш да изтриеш:\n"${p.name}"?\n\nТова действие не може да се отмени.`)) {
    deleteProductById(id);
  }
}

function deleteProduct() {
  if (aefEditingId === null) return;
  confirmDeleteProduct(aefEditingId);
  closeProductEditor();
}

function deleteProductById(id) {
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    const name = products[idx].name;
    products.splice(idx, 1);
    persistProducts();
    showToast(`🗑 "${name.substring(0,28)}…" е изтрит.`);
    renderGrids();
    adminShowTab('products');
  }
}

function adminToggleSelectAll(checked) {
  document.querySelectorAll('.admin-prod-cb').forEach(cb => { cb.checked = checked; });
  adminUpdateSelection();
}

function adminUpdateSelection() {
  const selected = document.querySelectorAll('.admin-prod-cb:checked');
  const btn = document.getElementById('adminBulkDeleteBtn');
  const badgeWrap = document.getElementById('adminBulkBadgeWrap');
  const cnt = document.getElementById('adminSelCount');
  const badgeCnt = document.getElementById('adminBulkBadgeCount');
  if (!btn) return;
  const show = selected.length > 0;
  btn.style.display = show ? '' : 'none';
  if (badgeWrap) badgeWrap.style.display = show ? '' : 'none';
  if (show) {
    if (cnt) cnt.textContent = selected.length;
    if (badgeCnt) badgeCnt.textContent = selected.length;
  }
  const all = document.querySelectorAll('.admin-prod-cb');
  const selAll = document.getElementById('adminSelectAll');
  if (selAll) selAll.checked = all.length > 0 && selected.length === all.length;
}

function adminToggleBadgeMenu() {
  const menu = document.getElementById('adminBadgeMenu');
  if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function adminBulkSetBadge(badge) {
  const selected = [...document.querySelectorAll('.admin-prod-cb:checked')];
  if (!selected.length) return;
  const ids = new Set(selected.map(cb => Number(cb.dataset.id)));
  products.forEach(p => { if (ids.has(p.id)) p.badge = badge || undefined; });
  persistProducts();
  const label = { sale:'Промо', new:'Ново', hot:'Горещо' }[badge] || 'без бадж';
  showToast(`✅ ${ids.size} продукта → ${label}`);
  renderGrids();
  renderAdminProductsTable();
}

function adminApproveReview(pid, idx) {
  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    if (saved[pid] && saved[pid][idx]) {
      delete saved[pid][idx].pending;
      localStorage.setItem('mc_reviews', JSON.stringify(saved));
    }
  } catch(e) {}
  adminShowTab('reviews');
  showToast('✅ Ревюто е одобрено и публикувано!');
}

function adminDeleteReview(pid, idx) {
  try {
    const saved = JSON.parse(localStorage.getItem('mc_reviews') || '{}');
    if (saved[pid]) {
      saved[pid].splice(idx, 1);
      if (!saved[pid].length) delete saved[pid];
      localStorage.setItem('mc_reviews', JSON.stringify(saved));
    }
  } catch(e) {}
  adminShowTab('reviews');
  showToast('🗑 Ревюто е изтрито');
}

function adminExportNewsletter() {
  let subs = [];
  try { subs = JSON.parse(localStorage.getItem('mc_newsletter') || '[]'); } catch(e) {}
  if (!subs.length) { showToast('Няма абонирани имейли за експорт'); return; }
  const csv = 'Email\r\n' + subs.map(e => e).join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `mc-newsletter-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(`✅ Изтеглени ${subs.length} имейла`);
}

function adminDeleteNL(idx) {
  try {
    const subs = JSON.parse(localStorage.getItem('mc_newsletter') || '[]');
    subs.splice(idx, 1);
    localStorage.setItem('mc_newsletter', JSON.stringify(subs));
  } catch(e) {}
  adminShowTab('newsletter');
  showToast('🗑 Имейлът е премахнат');
}

function adminDeleteBIS(pid, email) {
  const key = 'mc_bis_' + pid;
  try {
    let emails = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(emails)) emails = [emails];
    const updated = emails.filter(e => e !== email);
    if (updated.length) localStorage.setItem(key, JSON.stringify(updated));
    else localStorage.removeItem(key);
  } catch(e) { localStorage.removeItem(key); }
  adminShowTab('bis');
  showToast('🗑 BIS заявката е премахната');
}

function adminFilterInventory(q) {
  const rows = document.querySelectorAll('#inventoryTbody tr');
  const ql = q.toLowerCase();
  rows.forEach(row => { row.style.display = !ql || row.textContent.toLowerCase().includes(ql) ? '' : 'none'; });
}

function adminBulkDelete() {
  const selected = [...document.querySelectorAll('.admin-prod-cb:checked')];
  if (!selected.length) return;
  const ids = selected.map(cb => Number(cb.dataset.id));
  ids.forEach(id => {
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) products.splice(idx, 1);
  });
  persistProducts();
  showToast(`🗑 Изтрити ${ids.length} продукта.`);
  renderGrids();
  renderAdminProductsTable();
}

function adminFilterProducts(q) {
  _adminProd.q = q;
  renderAdminProductsTable();
}



// ===== XML IMPORT / EXPORT =====

function xmlSwitchTab(tab) {
  document.querySelectorAll('.xml-mode-tab').forEach((t,i) => {
    t.classList.toggle('active',
      (tab==='file'&&i===0)||(tab==='paste'&&i===1)||(tab==='url'&&i===2)||(tab==='json'&&i===3));
  });
  ['file','paste','url','json'].forEach(id => {
    document.getElementById('xml-tab-'+id)?.classList.toggle('active', tab===id);
  });
  if(tab==='url') setTimeout(()=>document.getElementById('xmlUrlInput')?.focus(), 50);
  if(tab==='json') setTimeout(()=>document.getElementById('jsonImportArea')?.focus(), 50);
}

function xmlInitDrop() {
  // already handled via ondragover/ondrop attrs
}

function xmlHandleDrop(e) {
  e.preventDefault();
  document.getElementById('xmlDropZone')?.classList.remove('drag-over');
  const file = e.dataTransfer?.files?.[0];
  if (file) xmlReadFile(file);
}

function xmlHandleFile(input) {
  const file = input?.files?.[0];
  if (file) xmlReadFile(file);
}

function xmlReadFile(file) {
  if (!file.name.endsWith('.xml') && file.type !== 'text/xml' && file.type !== 'application/xml') {
    showToast('⚠️ Моля, избери .xml файл!'); return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const txt = e.target.result;
    // Switch to paste tab to show content and parse
    xmlSwitchTab('paste');
    const pa = document.getElementById('xmlPasteArea');
    if (pa) pa.value = txt;
    xmlParseAndPreview(txt);
    // Update drop zone to show file name
    const dz = document.getElementById('xmlDropZone');
    if (dz) dz.innerHTML = `<div class="xml-drop-icon">✅</div><div class="xml-drop-title" style="color:#34d399;">Зареден: ${file.name}</div><div class="xml-drop-sub">${(file.size/1024).toFixed(1)} KB · ${txt.split('<product>').length - 1} продукта намерени</div>`;
  };
  reader.readAsText(file, 'UTF-8');
}

function xmlParseAndPreview(xmlStr) {
  const preview = document.getElementById('xmlPreviewArea');
  if (!preview) return;
  if (!xmlStr?.trim()) { preview.innerHTML = ''; return; }

  let parsed;
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, 'text/xml');
    const err = doc.querySelector('parsererror');
    if (err) throw new Error(err.textContent?.split('\n')[0] || 'XML грешка');
    // Auto-detect element name
    const elName = ['product','item','offer','good','Product','Item'].find(n => doc.querySelector(n)) || 'product';
    parsed = doc.querySelectorAll(elName);
    if (parsed.length === 0) throw new Error('Не са намерени продуктови елементи (<product>, <item>, <offer>…)');
  } catch(e) {
    preview.innerHTML = `<div style="background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.2);border-radius:10px;padding:16px;color:#f87171;font-size:13px;">
      ❌ <strong>XML грешка:</strong> ${e.message}
    </div>`;
    return;
  }

  // Parse each product — flexible tag aliases
  const getT   = (el, tag) => el.querySelector(tag)?.textContent?.trim() || '';
  const getAny = (el, ...tags) => { for(const t of tags){ const v=getT(el,t); if(v) return v; } return ''; };

  // Category text → internal cat key
  const CAT_MAP_GENERIC = [
    [['NOTEBOOK','LAPTOP','ЛАПТОП'], 'laptop'],
    [['DESKTOP','СТАЦИОНАРЕН','ALL-IN-ONE','AIO','TOWER PC','НАСТОЛЕН'], 'desktop'],
    [['PHONE','MOBILE','ТЕЛЕФОН','СМАРТФОН'], 'mobile'],
    [['TABLET','ТАБЛЕТ'], 'tablet'],
    [['MONITOR','МОНИТОР','DISPLAY','ДИСПЛЕЙ'], 'monitor'],
    [['TV','ТЕЛЕВИЗОР','TELEVISION'], 'tv'],
    [['AUDIO','HEADPHONE','СЛУШАЛК','SPEAKER','КОЛОНК'], 'audio'],
    [['CAMERA','ФОТОАПАРАТ'], 'camera'],
    [['GAMING','GAME'], 'gaming'],
    [['SMARTWATCH','SMART HOME','SMARTHOME'], 'smart'],
    [['NETWORK','ROUTER','МРЕЖА','SWITCH','ACCESS POINT'], 'network'],
    [['PRINTER','ПРИНТЕР','СКЕНЕР','SCANNER'], 'print'],
    [['ПРОЦЕСОР','PROCESSOR','CPU'], 'components'],
    [['ВИДЕОКАРТ','VIDEO CARD','GPU','GRAPHIC'], 'components'],
    [['RAM','ПАМЕТ','MEMORY','DIMM'], 'components'],
    [['ДЪННА','MOTHERBOARD','MAINBOARD'], 'components'],
    [['SSD','HDD','NVME','ДИСК'], 'components'],
    [['ЗАХРАНВАН','PSU','POWER SUPPLY'], 'components'],
    [['ОХЛАДИТЕЛ','COOLER','COOLING'], 'components'],
    [['КУТИЯ','CHASSIS'], 'components'],
    [['КОМПОНЕНТ','COMPONENT'], 'components'],
    [['EXTERNAL STORAGE','EXTERNAL DRIVE','NAS','ВЪНШЕН ДИСК','USB ДИСК'], 'storage'],
    [['АКСЕСОАР','ACCESSORY','CABLE','КАБЕЛ','KEYBOARD','КЛАВИАТУР','MOUSE','МИШК','BAG','ЧАНТА'], 'acc'],
  ];
  function mapCatGeneric(raw) {
    const u = raw.toUpperCase();
    for (const [keys, cat] of CAT_MAP_GENERIC) {
      if (keys.some(k => u.includes(k))) return cat;
    }
    return 'acc';
  }

  const parsed_products = [];
  let errors = 0;

  parsed.forEach(el => {
    const name  = getAny(el,'name','n','title','productName','product_name','naziv');
    const price = parseFloat(getAny(el,'price','selling_price','sale_price','finalPrice','priceWithVat','price_with_vat','currentPrice'));
    const id    = parseInt(getAny(el,'id','productId','product_id','itemId')) || null;
    const ok    = name && price > 0;
    if (!ok) { errors++; }

    // Specs: <spec key="…">, <param name="…">, <feature name="…">
    const specs = {};
    el.querySelectorAll('spec,param,feature,property,attribute').forEach(s => {
      const k = s.getAttribute('key') || s.getAttribute('name') || s.getAttribute('label');
      if (k) specs[k] = s.textContent.trim();
    });

    // Images — collect ALL from common tags (multiple <image> children, url attrs, numbered tags)
    const allImgs = [];
    el.querySelectorAll('image,img,picture,photo,pic').forEach(n => {
      const src = (n.getAttribute('url') || n.getAttribute('src') || n.textContent || '').trim();
      if (src && src.startsWith('http') && !allImgs.includes(src)) allImgs.push(src);
    });
    // <images><url>…</url></images> / <gallery><pictureUrl>…</pictureUrl></gallery> patterns
    el.querySelectorAll('images url, pictures url, gallery url, gallery pictureUrl, gallery picture, pictures pictureUrl').forEach(n => {
      const src = n.textContent.trim();
      if (src && src.startsWith('http') && !allImgs.includes(src)) allImgs.push(src);
    });
    // Numbered: image1, image2, image3 … image10 / imageUrl, imageUrl2 …
    ['img','image','picture','photo','imageUrl','image_url','picture_url','url_image','thumbnail'].forEach(tag => {
      const v = getT(el, tag);
      if (v && v.startsWith('http') && !allImgs.includes(v)) allImgs.push(v);
    });
    for (let n = 1; n <= 10; n++) {
      ['image','img','picture','photo'].forEach(tag => {
        const v = getT(el, tag + n);
        if (v && v.startsWith('http') && !allImgs.includes(v)) allImgs.push(v);
      });
    }

    const existsIdx = id ? products.findIndex(p=>p.id===id) : -1;
    parsed_products.push({
      id, name, ok, isUpdate: existsIdx !== -1,
      brand:  getAny(el,'brand','manufacturer','vendor','make'),
      cat:    mapCatGeneric(getAny(el,'cat','category','categoryId','group') || ''),
      price,
      old:    parseFloat(getAny(el,'old','oldprice','old_price','original_price','comparePrice','compare_price','regular_price')) || null,
      badge:  getAny(el,'badge','label','tag') || '',
      rating: parseFloat(getAny(el,'rating','rate','stars')) || 4.5,
      rv:     parseInt(getAny(el,'rv','reviews','reviewCount','review_count')) || 0,
      emoji:  getAny(el,'emoji') || '🖥',
      sku:    getAny(el,'sku','code','article','barcode','partNumber','part_number'),
      img:    allImgs[0] || '',
      gallery: allImgs,
      desc:   getAny(el,'desc','description','shortDescription','short_description','summary'),
      specs,
      reviews: [],
    });
  });

  const newCount    = parsed_products.filter(p=>p.ok && !p.isUpdate).length;
  const updateCount = parsed_products.filter(p=>p.ok && p.isUpdate).length;

  // Build preview table
  let rows = parsed_products.map(p => `
    <tr>
      <td>${p.emoji || '📦'}</td>
      <td style="color:#fff;font-weight:600;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${p.name || '<span style="color:#f87171">— липсва —</span>'}</td>
      <td>${p.brand || '—'}</td>
      <td style="color:#34d399;font-weight:700;">${p.price ? p.price+' лв.' : '<span style="color:#f87171">липсва</span>'}</td>
      <td>${p.cat || '—'}</td>
      <td>${p.sku || '—'}</td>
      <td>${p.gallery?.length ? `<span style="color:#34d399">🖼 ${p.gallery.length}</span>` : '<span style="color:#6b7280">—</span>'}</td>
      <td>${p.ok
        ? (p.isUpdate
            ? '<span class="xml-status-update">🔄 Обновяване</span>'
            : '<span class="xml-status-ok">✅ Нов</span>')
        : '<span class="xml-status-err">❌ Грешка</span>'}</td>
    </tr>`).join('');

  // Store parsed for import
  window._xmlParsedProducts = parsed_products.filter(p => p.ok);

  preview.innerHTML = `
    <div class="admin-table-card" style="margin-top:0;">
      <div class="admin-table-header">
        <div class="admin-table-title">🔍 Преглед — ${parsed_products.length} продукта от XML</div>
      </div>
      <table class="xml-preview-table">
        <thead><tr><th></th><th>Наименование</th><th>Марка</th><th>Цена</th><th>Категория</th><th>SKU</th><th>Снимки</th><th>Статус</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${window._xmlParsedProducts.length > 0 ? `
    <div class="xml-import-confirm">
      <div class="xml-import-summary">
        Готови за импорт: <strong>${newCount} нови</strong> продукта
        ${updateCount > 0 ? `+ <strong style="color:#fbbf24">${updateCount} обновявания</strong>` : ''}
        ${errors > 0 ? `<span style="color:#f87171"> · ${errors} с грешки (пропуснати)</span>` : ''}
      </div>
      <button type="button" class="xml-import-go" onclick="xmlDoImport()">⬇️ Импортирай сега</button>
    </div>` : ''}
  `;
}

function xmlDoImport() {
  const toImport = window._xmlParsedProducts;
  if (!toImport?.length) { showToast('⚠️ Няма валидни продукти за импорт!'); return; }

  let added = 0, updated = 0;
  const maxId = Math.max(...products.map(p=>p.id), 0);

  toImport.forEach((p, i) => {
    const existsIdx = p.id ? products.findIndex(x=>x.id===p.id) : -1;
    if (existsIdx !== -1) {
      // Update existing
      products[existsIdx] = { ...products[existsIdx], ...p, id: products[existsIdx].id };
      updated++;
    } else {
      // Add new with auto ID if missing
      p.id = p.id || (maxId + i + 1);
      products.push(p);
      added++;
    }
  });

  window._xmlParsedProducts = [];
  persistProducts();
  renderGrids();
  showToast(`✅ Импортирани: ${added} нови, ${updated} обновени!`);
  adminShowTab('products');
}

// ── EXPORT ──
function xmlPreviewExport() {
  return products.slice(0,3).map(p => {
    const specs = Object.entries(p.specs||{}).map(([k,v])=>`      <spec key="${k}">${v}</spec>`).join('\n');
    return `  <product>
    <id>${p.id}</id>
    <sku>${p.sku||''}</sku>
    <name>${p.name}</name>
    <brand>${p.brand}</brand>
    <cat>${p.cat}</cat>
    <price>${p.price}</price>
    ${p.old?`<old>${p.old}</old>`:''}
    <badge>${p.badge||''}</badge>
    <rating>${p.rating}</rating>
    <rv>${p.rv}</rv>
    <emoji>${p.emoji}</emoji>
    <img>${p.img||''}</img>
    <desc>${(p.desc||'').substring(0,80)}…</desc>
    <specs>
${specs}
    </specs>
  </product>`;
  }).join('\n');
}

function xmlExport() {
  const lines = products.map(p => {
    const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const specs = Object.entries(p.specs||{}).map(([k,v])=>
      `      <spec key="${esc(k)}">${esc(v)}</spec>`).join('\n');
    return `  <product>
    <id>${p.id}</id>
    <sku>${esc(p.sku)}</sku>
    <name>${esc(p.name)}</name>
    <brand>${esc(p.brand)}</brand>
    <cat>${esc(p.cat)}</cat>
    <price>${p.price}</price>
    <old>${p.old||''}</old>
    <badge>${esc(p.badge)}</badge>
    <rating>${p.rating}</rating>
    <rv>${p.rv}</rv>
    <emoji>${esc(p.emoji)}</emoji>
    <img>${esc(p.img)}</img>
    <desc>${esc(p.desc)}</desc>
    <specs>
${specs}
    </specs>
  </product>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<products>\n${lines}\n</products>`;
  const blob = new Blob([xml], {type:'application/xml;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'most-computers-products.xml';
  a.click(); URL.revokeObjectURL(url);
  showToast(`✅ Експортирани ${products.length} продукта!`);
}

function xmlCopySample() {
  const el = document.getElementById('xmlSampleCode');
  if (!el) return;
  // Decode HTML entities for copy
  const txt = el.innerText;
  navigator.clipboard?.writeText(txt).then(()=>showToast('📋 Примерът е копиран!')).catch(()=>showToast('⚠️ Копирането не е налично'));
}


// ── XML FETCH FROM URL ──
async function xmlFetchFromUI() {
  const url = document.getElementById('xmlUrlInput')?.value?.trim();
  const status = document.getElementById('xmlUrlStatus');
  const btn = document.getElementById('xmlFetchBtn');
  const preview = document.getElementById('xmlPreviewArea');

  if (!url) { showToast('⚠️ Въведи URL!'); return; }
  if (!url.startsWith('http')) { showToast('⚠️ URL трябва да започва с https://'); return; }

  // Show loading state
  if (btn) { btn.textContent = '⏳ Зарежда…'; btn.disabled = true; }
  if (status) status.innerHTML = `
    <div style="background:rgba(96,165,250,0.08);border:1px solid rgba(96,165,250,0.2);border-radius:10px;padding:14px 18px;display:flex;align-items:center;gap:12px;margin-bottom:16px;">
      <span style="font-size:20px;">⏳</span>
      <div>
        <div style="font-size:13px;font-weight:700;color:#60a5fa;">Свързване…</div>
        <div style="font-size:11px;color:#6b7280;margin-top:2px;">${url}</div>
      </div>
    </div>`;
  if (preview) preview.innerHTML = '';

  try {
    // Try direct fetch first
    let text = null;
    let method = '';

    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      text = await res.text();
      method = 'директна връзка';
    } catch(e) {
      // CORS blocked — try CORS proxy
      const proxy = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      const res2 = await fetch(proxy, { signal: AbortSignal.timeout(12000) });
      if (!res2.ok) throw new Error(`HTTP ${res2.status} (proxy)`);
      text = await res2.text();
      method = 'CORS proxy';
    }

    // Detect element name: <product>, <item>, <offer>, <good>
    const _elName = ['product','item','offer','good','Product','Item'].find(n => text.includes(`<${n}`)) || 'product';
    if (!_elName) throw new Error('Не са намерени продуктови елементи (<product>, <item>, <offer>)');
    window._xmlElName = _elName;

    const productCount = (text.match(new RegExp('<' + _elName + '[\\s>]','g'))||[]).length;

    if (status) status.innerHTML = `
      <div style="background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.2);border-radius:10px;padding:14px 18px;display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <span style="font-size:20px;">✅</span>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:700;color:#34d399;">Зареден успешно</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">${productCount} продукта · ${(text.length/1024).toFixed(1)} KB · чрез ${method}</div>
        </div>
        <button type="button" style="background:rgba(52,211,153,0.15);color:#34d399;border:1px solid rgba(52,211,153,0.3);border-radius:6px;padding:5px 12px;font-size:11px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif;" onclick="xmlSwitchTab('paste');document.getElementById('xmlPasteArea').value=window._xmlLastFetched||''">Виж XML</button>
      </div>`;

    window._xmlLastFetched = text;
    xmlParseAndPreview(text);

  } catch(err) {
    const isCors = err.message?.includes('fetch') || err.name === 'TypeError';
    if (status) status.innerHTML = `
      <div style="background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);border-radius:10px;padding:14px 18px;margin-bottom:16px;">
        <div style="font-size:13px;font-weight:700;color:#f87171;margin-bottom:6px;">❌ Грешка при зареждане</div>
        <div style="font-size:12px;color:#9ca3af;margin-bottom:8px;">${err.message}</div>
        ${isCors ? `<div style="font-size:11px;color:#6b7280;background:#0f1117;padding:10px;border-radius:6px;line-height:1.6;">
          💡 <strong style="color:#9ca3af;">Съвет:</strong> Ако URL-ът е валиден но не се зарежда, сървърът блокира CORS заявки.<br>
          Решения: използвай <strong style="color:#a5b4fc;">GitHub Raw</strong>, <strong style="color:#a5b4fc;">Dropbox direct link</strong> или настрой CORS заглавки на сървъра.
        </div>` : ''}
      </div>`;
  } finally {
    if (btn) { btn.textContent = '🌐 Зареди'; btn.disabled = false; }
  }
}



// ===== XML AUTO-UPDATE ENGINE =====
let _autoupdTimer        = null;   // setInterval handle
let _autoupdCountdown    = null;   // countdown tick handle
let _autoupdNextTs       = null;   // timestamp of next run
let _autoupdRunning      = false;

const AU_STORE = {
  get url()      { return localStorage.getItem('mc_autoupd_url') || ''; },
  get interval() { return parseInt(localStorage.getItem('mc_autoupd_interval') || '7200000'); },
  get mode()     { return localStorage.getItem('mc_autoupd_mode') || 'merge'; },
  get enabled()  { return localStorage.getItem('mc_autoupd_enabled') === '1'; },
  get lastRun()  { return localStorage.getItem('mc_autoupd_last') || null; },
  set enabled(v) { localStorage.setItem('mc_autoupd_enabled', v ? '1' : '0'); },
  set lastRun(v) { localStorage.setItem('mc_autoupd_last', v); },
};

// ── Restore settings from localStorage on page load ──
function xmlRestoreAutoUpdSettings() {
  setTimeout(renderFeedList, 100); // render feed list when admin tab opens
  const urlEl  = document.getElementById('autoupdUrl');
  const intEl  = document.getElementById('autoupdInterval');
  const modeEl = document.getElementById('autoupdMode');
  const togEl  = document.getElementById('autoupdToggle');
  if (urlEl)  urlEl.value  = AU_STORE.url;
  if (intEl)  intEl.value  = String(AU_STORE.interval);
  if (modeEl) modeEl.value = AU_STORE.mode;
  if (togEl)  togEl.checked = AU_STORE.enabled;
  if (AU_STORE.enabled && AU_STORE.url) {
    xmlStartAutoUpdate(false); // resume silently
  }
  xmlUpdateBadgeUI();
}

function xmlSaveAutoUpdSettings() {
  const intEl  = document.getElementById('autoupdInterval');
  const modeEl = document.getElementById('autoupdMode');
  if (intEl)  localStorage.setItem('mc_autoupd_interval', intEl.value);
  if (modeEl) localStorage.setItem('mc_autoupd_mode', modeEl.value);
  // Restart timer with new interval if running
  if (AU_STORE.enabled) {
    xmlStopAutoUpdate();
    xmlStartAutoUpdate(false);
  }
}

function xmlToggleAutoUpdate(enabled) {
  const urlEl = document.getElementById('autoupdUrl');
  const url   = urlEl?.value?.trim() || AU_STORE.url;
  if (enabled && !url) {
    showToast('⚠️ Въведи URL преди да включиш auto-update!');
    document.getElementById('autoupdToggle').checked = false;
    return;
  }
  if (url) localStorage.setItem('mc_autoupd_url', url);
  AU_STORE.enabled = enabled;
  if (enabled) {
    xmlStartAutoUpdate(true);
  } else {
    xmlStopAutoUpdate();
  }
}

function xmlStartAutoUpdate(runNow) {
  xmlStopAutoUpdate(); // clear any existing
  const interval = AU_STORE.interval;
  _autoupdNextTs = Date.now() + interval;
  _autoupdTimer  = setInterval(() => xmlRunAutoUpdate(false), interval);
  _autoupdCountdown = setInterval(xmlTickCountdown, 1000);
  if (runNow) xmlRunAutoUpdate(true);
  xmlUpdateBadgeUI();
  xmlLog('info', `Auto-update включен — интервал ${Math.round(interval/60000)} мин., URL: ${AU_STORE.url}`);
}

function xmlStopAutoUpdate() {
  if (_autoupdTimer)    { clearInterval(_autoupdTimer);    _autoupdTimer = null; }
  if (_autoupdCountdown){ clearInterval(_autoupdCountdown);_autoupdCountdown = null; }
  _autoupdNextTs = null;
  xmlUpdateBadgeUI();
}

async function xmlFetchUrl(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch(e) {
    const proxy = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const res2  = await fetch(proxy, { signal: AbortSignal.timeout(18000) });
    if (!res2.ok) throw new Error(`HTTP ${res2.status} via proxy`);
    return await res2.text();
  }
}

async function xmlRunAutoUpdate(manual) {
  if (_autoupdRunning) { if(manual) showToast('⏳ Обновяването вече тече…'); return; }

  // Collect enabled feed URLs
  let feeds = [];
  try { feeds = JSON.parse(localStorage.getItem('mc_autoupd_urls') || '[]').filter(f => f.enabled && f.url); } catch(e) {}
  // Fallback to single URL
  if (!feeds.length) {
    const singleUrl = AU_STORE.url;
    if (singleUrl) feeds = [{ url: singleUrl, label: 'XML Feed' }];
  }
  if (!feeds.length) { if(manual) showToast('⚠️ Няма конфигурирани URL-и за зареждане!'); return; }

  _autoupdRunning = true;
  const btn = document.getElementById('autoupdNowBtn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳ Зарежда…'; }

  xmlLog('info', `${manual?'Ръчно':'Автоматично'} обновяване стартира (${feeds.length} категории)`);

  let totalAdded = 0, totalUpdated = 0, totalSkipped = 0;

  try {
    for (const feed of feeds) {
      xmlLog('info', `→ Зарежда: ${feed.label || feed.url}`);
      let text = null;
      try {
        text = await xmlFetchUrl(feed.url);
      } catch(e) {
        xmlLog('err', `✗ ${feed.label}: ${e.message}`);
        continue;
      }
      if (!text?.includes('<product')) { xmlLog('err', `✗ ${feed.label}: няма <product> елементи`); continue; }

    // Parse XML
    const parser  = new DOMParser();
    const doc     = parser.parseFromString(text, 'text/xml');
    const err     = doc.querySelector('parsererror');
    if (err) throw new Error('XML грешка: ' + err.textContent?.split('\n')[0]);

    const _rElName = ['product','item','offer','good','Product','Item'].find(n => doc.querySelector(n)) || 'product';
    const nodes   = doc.querySelectorAll(_rElName);
    const getT    = (el, tag) => el.querySelector(tag)?.textContent?.trim() || '';
    const getAny  = (el, ...tags) => { for(const t of tags){ const v=getT(el,t); if(v) return v; } return ''; };
    const catMap  = {
        'NOTEBOOK': 'laptop', 'ЛАПТОП': 'laptop', 'LAPTOP': 'laptop',
        'PHONE': 'mobile', 'MOBILE': 'mobile', 'ТЕЛЕФОН': 'mobile', 'СМАРТФОН': 'mobile',
        'TABLET': 'tablet', 'ТАБЛЕТ': 'tablet',
        'TV': 'tv', 'ТЕЛЕВИЗОР': 'tv', 'TELEVISION': 'tv',
        'AUDIO': 'audio', 'HEADPHONE': 'audio', 'СЛУШАЛКИ': 'audio',
        'CAMERA': 'camera', 'ФОТОАПАРАТ': 'camera',
        'GAMING': 'gaming', 'GAME': 'gaming',
        'SMARTWATCH': 'smart', 'SMART HOME': 'smart',
        'NETWORK': 'network', 'ROUTER': 'network', 'МРЕЖА': 'network',
        'PRINTER': 'print', 'ПРИНТЕР': 'print',
        'MONITOR': 'acc', 'ACCESSORY': 'acc', 'АКСЕСОАР': 'acc',
        // Components
        'ПРОЦЕСОР': 'components', 'PROCESSOR': 'components', 'CPU': 'components',
        'ВИДЕОКАРТ': 'components', 'VIDEO CARD': 'components', 'GPU': 'components', 'GRAPHIC': 'components',
        'RAM': 'components', 'ПАМЕТ': 'components', 'MEMORY': 'components', 'DIMM': 'components',
        'ДЪННА': 'components', 'MOTHERBOARD': 'components', 'MAINBOARD': 'components',
        'SSD': 'components', 'HDD': 'components', 'NVME': 'components', 'STORAGE': 'components', 'ДИСК': 'components',
        'ЗАХРАНВАН': 'components', 'PSU': 'components', 'POWER SUPPLY': 'components',
        'ОХЛАДИТЕЛ': 'components', 'COOLER': 'components', 'COOLING': 'components',
        'КУТИЯ': 'components', 'CHASSIS': 'components',
        'КОМПОНЕНТ': 'components', 'COMPONENT': 'components',
      };
    const catEmojis = {
      laptops:'💻',desktops:'🖥',components:'⚙️',peripherals:'🖱',
      network:'📡',storage:'💾',software:'📀',accessories:'🎒',
      // legacy:
      laptop:'💻',mobile:'📱',tablet:'📟',tv:'📺',audio:'🎧',camera:'📷',gaming:'🎮',smart:'🏠',print:'🖨',acc:'🖱'
    };
    const mode    = AU_STORE.mode;
    let added = 0, updated = 0, skipped = 0;

    if (mode === 'replace' && feeds.indexOf(feed) === 0) products.length = 0;

    const maxId = () => Math.max(...products.map(p => p.id), 0);

    nodes.forEach(el => {
      const name  = getAny(el,'name','n','title','productName','product_name');
      // Price: Most Computers sends EUR — convert to BGN
      const rawPrice = parseFloat(getT(el,'price'));
      const currency = getT(el,'currency');
      const price = (currency === 'EUR' && rawPrice) ? Math.round(rawPrice * EUR_RATE * 100) / 100 : rawPrice;
      if (!name || !price) { skipped++; return; }

      const id = parseInt(el.getAttribute('id')) || null;

      // Specs from <property name="…">value</property>
      const specs = {};
      el.querySelectorAll('property').forEach(s => {
        const k = s.getAttribute('name');
        if (k) specs[k] = s.textContent.trim();
      });

      // Gallery: first <pictureUrl>
      const firstImg = el.querySelector('gallery pictureUrl')?.textContent?.trim() || '';

      // Category mapping
      const rawCat = getT(el,'category').toUpperCase();
      const mappedCat = Object.entries(catMap).find(([k]) => rawCat.includes(k))?.[1] || 'acc';

      // Stock
      const statusTxt = getT(el,'product_status');
      const inStock = !statusTxt.includes('Изчерпан') && !statusTxt.includes('Няма');

      // Description from searchStringParts
      const ssParts = [];
      el.querySelectorAll('searchStringParts description').forEach(d => ssParts.push(d.textContent.trim()));
      const desc = ssParts.length ? ssParts.join(' · ') : getT(el,'searchstring');

      const data = {
        name, price, specs,
        brand:   getT(el,'manufacturer') || '',
        cat:     mappedCat,
        old:     null,
        badge:   '',
        rating:  4.5,
        rv:      0,
        emoji:   catEmojis[mappedCat] || '🖥',
        sku:     getAny(el,'PartNumber','EAN','ean','sku','code'),
        img:     firstImg,
        desc,
        stock:   inStock,
        gallery: Array.from(el.querySelectorAll('gallery pictureUrl')).map(u=>u.textContent.trim()).filter(Boolean),
        htmlDesc: '',
        videoUrl: '',
        vendorUrl: getAny(el,'Vendor_url') || (el.querySelector('property[name="Vendor_url"]')?.textContent?.trim() || ''),
        reviews: [],
        pct:     0,
      };

      const existsIdx = id ? products.findIndex(p => p.id === id) : -1;
      if (existsIdx !== -1) {
        products[existsIdx] = { ...products[existsIdx], ...data, id: products[existsIdx].id };
        updated++;
      } else {
        data.id = id || (maxId() + added + updated + 1);
        products.push(data);
        added++;
      }
    });

      totalAdded += added; totalUpdated += updated; totalSkipped += skipped;
      xmlLog('ok', `✓ ${feed.label||''}: +${added} нови, ~${updated} обновени${skipped?`, ${skipped} пропуснати`:''}`);
    } // end feed loop

    renderGrids();
    const now = new Date().toLocaleString('bg-BG');
    AU_STORE.lastRun = now;
    _autoupdNextTs = Date.now() + AU_STORE.interval;

    const msg = `✅ Обновяване (${feeds.length} категории): +${totalAdded} нови, ~${totalUpdated} обновени${totalSkipped?`, ${totalSkipped} пропуснати`:''}`;
    xmlLog('ok', msg);
    if (manual) showToast(msg);

    // Update last time in UI
    const lt = document.getElementById('autoupdLastTime');
    if (lt) lt.textContent = now;

    // Flash topbar badge
    const tb = document.getElementById('autoupdTopbarBadge');
    if (tb) { tb.style.background = 'rgba(52,211,153,0.2)'; setTimeout(()=>tb.style.background='',1000); }

  } catch(err) {
    const msg = `❌ Грешка: ${err.message}`;
    xmlLog('err', msg);
    if (manual) showToast(msg);
  } finally {
    _autoupdRunning = false;
    if (btn) { btn.disabled = false; btn.textContent = '⚡ Обнови сега'; }
  }
}

function xmlTickCountdown() {
  if (!_autoupdNextTs) return;
  const remaining = Math.max(0, _autoupdNextTs - Date.now());
  const mins      = Math.floor(remaining / 60000);
  const interval  = AU_STORE.interval;
  const pct       = remaining / interval; // 1 → 0
  const circ      = 150.8;
  const offset    = circ * pct;           // full → 0

  // Update ring
  const circle = document.getElementById('autoupdCdCircle');
  if (circle) circle.style.strokeDashoffset = String(circ - offset);

  // Update minutes text
  const cdMin = document.getElementById('autoupdCdMin');
  if (cdMin) cdMin.textContent = mins < 1 ? '<1' : String(mins);

  // Update next time label
  const nextEl = document.getElementById('autoupdNextTime');
  if (nextEl) {
    const d = new Date(_autoupdNextTs);
    nextEl.textContent = d.toLocaleTimeString('bg-BG', {hour:'2-digit', minute:'2-digit'});
  }
}

function xmlUpdateBadgeUI() {
  const enabled = AU_STORE.enabled && _autoupdTimer !== null;
  const badge   = document.getElementById('autoupdBadge');
  const badgeTx = document.getElementById('autoupdBadgeText');
  const togLbl  = document.getElementById('autoupdToggleLabel');
  const cdWrap  = document.getElementById('autoupdCountdownWrap');
  const topbar  = document.getElementById('autoupdTopbarBadge');
  const dot     = badge?.querySelector('.autoupd-dot');

  if (badge) {
    badge.className = `autoupd-status-badge ${enabled ? 'active' : 'inactive'}`;
  }
  if (badgeTx) badgeTx.textContent = enabled ? 'Активно' : 'Изключено';
  if (togLbl)  togLbl.textContent  = enabled ? 'ON' : 'OFF';
  if (cdWrap)  cdWrap.style.display = enabled ? 'block' : 'none';
  if (topbar)  topbar.classList.toggle('show', enabled);
  if (dot) dot.classList.toggle('pulse', enabled);

  // Restore last run
  const lt = document.getElementById('autoupdLastTime');
  if (lt) lt.textContent = AU_STORE.lastRun || 'никога';
}

// ── LOG ──
const _autoupdLog = [];
function xmlLog(type, msg) {
  const now = new Date().toLocaleTimeString('bg-BG', {hour:'2-digit', minute:'2-digit', second:'2-digit'});
  _autoupdLog.unshift({ type, msg, time: now });
  if (_autoupdLog.length > 50) _autoupdLog.pop();
  xmlRenderLog();
}
function xmlRenderLog() {
  const wrap = document.getElementById('autoupdLogWrap');
  const list = document.getElementById('autoupdLogList');
  if (!list) return;
  if (wrap) wrap.style.display = _autoupdLog.length ? 'block' : 'none';
  list.innerHTML = _autoupdLog.map(e =>
    `<div class="autoupd-log-item autoupd-log-${e.type}">
      <span class="autoupd-log-time">${e.time}</span>
      <span class="autoupd-log-msg">${e.msg}</span>
    </div>`).join('');
}
function xmlClearLog() {
  _autoupdLog.length = 0;
  xmlRenderLog();
}

// ── Init on DOMContentLoaded ──
// (called inside existing DOMContentLoaded listener below)



// ===== MULTI-FEED MANAGER =====
function getFeeds() {
  try { return JSON.parse(localStorage.getItem('mc_autoupd_urls') || '[]'); } catch(e) { return []; }
}
function saveFeeds(feeds) {
  localStorage.setItem('mc_autoupd_urls', JSON.stringify(feeds));
}
function renderFeedList() {
  const el = document.getElementById('multiFeedList');
  if (!el) return;
  const feeds = getFeeds();
  if (!feeds.length) {
    el.innerHTML = '<div style="font-size:12px;color:rgba(255,255,255,0.3);padding:6px 0;">Няма добавени категории.</div>';
    return;
  }
  el.innerHTML = feeds.map((f, i) => `
    <div style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.05);border-radius:8px;padding:8px 10px;">
      <label class="big-toggle" style="transform:scale(0.75);flex-shrink:0;">
        <input type="checkbox" ${f.enabled?'checked':''} onchange="toggleFeed(${i},this.checked)">
        <span class="big-toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0;">
        <div style="font-size:12px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.label||'Feed '+(i+1)}</div>
        <div style="font-size:10px;color:rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.url}</div>
      </div>
      <button type="button" onclick="testFeedUrl(${i})" title="Тест" style="background:rgba(96,165,250,0.15);color:#60a5fa;border:1px solid rgba(96,165,250,0.2);border-radius:6px;padding:5px 8px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;white-space:nowrap;">⚡ Тест</button>
      <button type="button" onclick="removeFeed(${i})" style="background:rgba(248,113,113,0.1);color:#f87171;border:1px solid rgba(248,113,113,0.2);border-radius:6px;padding:5px 8px;font-size:11px;cursor:pointer;font-family:'Outfit',sans-serif;">✕</button>
    </div>`).join('');
}
function addFeedUrl() {
  const urlEl   = document.getElementById('newFeedUrl');
  const labelEl = document.getElementById('newFeedLabel');
  const url   = urlEl?.value?.trim();
  const label = labelEl?.value?.trim() || url;
  if (!url) { showToast('⚠️ Въведи URL!'); return; }
  const feeds = getFeeds();
  feeds.push({ id: 'feed_'+Date.now(), label, url, enabled: true });
  saveFeeds(feeds);
  if (urlEl)   urlEl.value   = '';
  if (labelEl) labelEl.value = '';
  renderFeedList();
  showToast('✓ Категорията е добавена!');
}
function removeFeed(i) {
  const feeds = getFeeds();
  feeds.splice(i, 1);
  saveFeeds(feeds);
  renderFeedList();
}
function toggleFeed(i, enabled) {
  const feeds = getFeeds();
  if (feeds[i]) feeds[i].enabled = enabled;
  saveFeeds(feeds);
}
async function testFeedUrl(i) {
  const feeds = getFeeds();
  const feed  = feeds[i];
  if (!feed) return;
  showToast('⏳ Тества се…');
  try {
    const text = await xmlFetchUrl(feed.url);
    const count = (text.match(/<product/g)||[]).length;
    showToast(`✅ ${feed.label}: ${count} продукта намерени`);
    xmlLog('ok', `Тест ✓ ${feed.label}: ${count} <product> елемента`);
  } catch(e) {
    showToast(`❌ ${feed.label}: ${e.message}`);
    xmlLog('err', `Тест ✗ ${feed.label}: ${e.message}`);
  }
}



function saveEurRate() {
  const val = parseFloat(document.getElementById('eurRateInput')?.value);
  if (isNaN(val) || val <= 0) { showToast('⚠️ Невалиден курс!'); return; }
  window.EUR_RATE = val;
  localStorage.setItem('eurRate', val);
  if (typeof renderGrids === 'function') renderGrids();
  showToast(`✅ Курс запазен: 1 EUR = ${val} BGN`);
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
    document.getElementById('pdpOld').textContent = fmtEur(p.old) + ' / ' + fmtBgn(p.old);
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

// ===== PDP UX ENHANCEMENTS =====

// ── LIGHTBOX ──
function pdpLbOpen() {
  var img = document.getElementById('pdpMainImg');
  if (!img || !img.src || img.style.display === 'none') return;
  var lb = document.getElementById('pdpLightbox');
  var lbImg = document.getElementById('pdpLbImg');
  if (!lb || !lbImg) return;
  lbImg.src = img.src;
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
  document.addEventListener('DOMContentLoaded', function() {}, false);
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
      '<div class="pdp-car-name">' + p.name + '</div>' +
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
    return '<tr><td class="pdp-sb-key">' + k + '</td><td class="pdp-sb-val">' + specs[k] + '</td></tr>';
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
  var rows = Object.keys(specs).map(function(k) {
    return '<tr><td style="padding:7px 12px;font-weight:600;color:#444;width:38%;border-bottom:1px solid #eee;">' + k +
           '</td><td style="padding:7px 12px;border-bottom:1px solid #eee;">' + specs[k] + '</td></tr>';
  }).join('');
  var win = window.open('', '_blank', 'width=800,height=700');
  if (!win) { showToast('⚠️ Попъп прозорецът е блокиран. Разреши попъпи за този сайт.'); return; }
  win.document.write(
    '<!DOCTYPE html><html><head><title>' + p.name + ' — Характеристики</title>' +
    '<style>body{font-family:Arial,sans-serif;padding:32px;color:#1a1a1a;}h1{font-size:20px;margin-bottom:4px;}' +
    '.sub{color:#888;font-size:13px;margin-bottom:24px;}table{width:100%;border-collapse:collapse;}' +
    'tr:nth-child(even){background:#f9f9f9;}' +
    '@media print{button{display:none!important;}}' +
    '</style></head><body>' +
    '<h1>' + p.name + '</h1>' +
    '<div class="sub">' + (p.brand || '') + (p.sku ? ' · SKU: ' + p.sku : '') + '</div>' +
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

const BC_CAT_LABELS = {
  all:'Всички продукти',
  laptops:'Лаптопи', desktops:'Настолни компютри', components:'Компоненти',
  peripherals:'Периферия', network:'Мрежово оборудване', storage:'Сървъри и сторидж',
  software:'Софтуер', accessories:'Аксесоари',
  sale:'Промоции', new:'Нови продукти',
  // legacy keys for backwards compat
  audio:'Аудио и слушалки', mobile:'Телефони', laptop:'Лаптопи и компютри',
  tablet:'Таблети', tv:'Телевизори', camera:'Фотоапарати', gaming:'Гейминг',
  smart:'Смарт устройства', print:'Принтери', acc:'Аксесоари',
  monitor:'Монитори', desktop:'Десктопи'
};

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
  laptops:    { emoji:'💻', icon:'ic-laptop',     label:'Лаптопи',              sub:'За работа, Гейминг, Ултрабуци', badge:null },
  desktops:   { emoji:'🖥', icon:'ic-desktop',    label:'Настолни компютри',    sub:'Gaming PC, Офис, All-in-One', badge:null },
  components: { emoji:'⚙️', icon:'ic-cpu',        label:'Компоненти',           sub:'CPU, GPU, RAM, SSD/HDD, Дъна', badge:null },
  peripherals:{ emoji:'🖱', icon:'ic-mouse',      label:'Периферия',            sub:'Монитори, Клавиатури, Мишки', badge:null },
  network:    { emoji:'📡', icon:'ic-wifi',       label:'Мрежово оборудване',   sub:'Рутери, Суичове, Mesh, AP', badge:null },
  storage:    { emoji:'💾', icon:'ic-storage',    label:'Сървъри и сторидж',    sub:'NAS, Сървъри, Външни дискове', badge:null },
  accessories:{ emoji:'🎒', icon:'ic-mouse',      label:'Аксесоари',            sub:'Чанти, Кабели, Смарт, Аудио', badge:null },
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
  { cat:'laptops',    id:'gaming_l',    label:'Gaming лаптопи',        icon:'🎮' },
  { cat:'components', id:'gpu',         label:'Видеокарти',            icon:'🎴' },
  { cat:'peripherals',id:'monitor',     label:'Монитори',              icon:'🖥' },
  { cat:'desktops',   id:'gaming_pc',   label:'Gaming PC',             icon:'🕹' },
  { cat:'components', id:'cpu',         label:'Процесори',             icon:'⚡' },
  { cat:'laptops',    id:'ultrabook',   label:'Ултрабуци',             icon:'💼' },
  { cat:'peripherals',id:'keyboard',    label:'Клавиатури',            icon:'⌨️' },
  { cat:'network',    id:'router',      label:'Рутери',                icon:'📡' },
  { cat:'storage',    id:'nas',         label:'NAS / Сторидж',         icon:'💾' },
  { cat:'laptops',    id:'for_students',label:'Студентски лаптопи',    icon:'🎓' },
  { cat:'peripherals',id:'mouse',       label:'Геймърски мишки',       icon:'🖱' },
  { cat:'peripherals',id:'webcam',      label:'Уеб камери',            icon:'📸' },
  { cat:'components', id:'ram',         label:'RAM памет',             icon:'🧠' },
  { cat:'components', id:'ssd_hdd',     label:'SSD дискове',           icon:'💿' },
  { cat:'desktops',   id:'workstation', label:'Работни станции',       icon:'🖥' },
  { cat:'peripherals',id:'headphones',  label:'Слушалки',              icon:'🎧' },
  { cat:'network',    id:'switch',      label:'Суичове',               icon:'🔀' },
  { cat:'accessories',id:'hub',         label:'USB хъбове',            icon:'🔌' },
  { cat:'components', id:'psu',         label:'Захранвания',           icon:'🔋' },
  { cat:'laptops',    id:'for_design',  label:'За дизайн',             icon:'🎨' },
  { cat:'peripherals',id:'printer',     label:'Принтери',              icon:'🖨' },
  { cat:'components', id:'case_cooling',label:'Кутии и охлаждане',     icon:'❄️' },
];

function renderHpSubcatsStrip() {
  const wrap = document.getElementById('hpCatsGrid');
  if (!wrap) return;
  wrap.innerHTML = HP_SUBCATS.map(s => {
    const count = products.filter(p => p.cat === s.cat).length;
    return `<button type="button" class="hp-subcat-pill" onclick="openCatPage('${s.cat}');applySubcatById('${s.id}')" aria-label="${s.label}">
      <span class="hp-subcat-pill-icon">${s.icon}</span>
      <span class="hp-subcat-pill-label">${s.label}</span>
      ${count > 0 ? `<span class="hp-subcat-pill-count">${count}</span>` : ''}
    </button>`;
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
  renderHpSubcatsStrip();
  renderRecentlyDiscounted();
});

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
              return (!wasQuoted && !isNaN(a) && a !== '') ? Number(a) : a;
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


// ===== CATEGORY ARCHITECTURE MIGRATION =====
// Category architecture migration
const _CAT_MIGRATE = {
  laptop:'laptops', desktop:'desktops',
  monitor:'peripherals', gaming:'desktops',
  mobile:'accessories', tablet:'accessories',
  tv:'accessories', audio:'peripherals',
  camera:'accessories', print:'peripherals',
  smart:'accessories', network:'network',
  storage:'storage', acc:'accessories',
  components:'components'
};
products.forEach(p => { if(_CAT_MIGRATE[p.cat]) p.cat = _CAT_MIGRATE[p.cat]; });

// Gaming laptops → laptops (not desktops)
products.forEach(p => {
  if(p.cat === 'desktops') {
    const n = (p.name+' '+(p.desc||'')).toLowerCase();
    if(n.includes('laptop') || n.includes('notebook') || n.includes('лаптоп') || n.includes('macbook')) p.cat = 'laptops';
  }
});

// Audio speakers → accessories, headphones stay in peripherals
products.forEach(p => {
  if(p.cat === 'peripherals') {
    const n = (p.name+' '+(p.desc||'')).toLowerCase();
    if(n.includes('тонколон') || n.includes('speaker') || n.includes('soundbar')) p.cat = 'accessories';
  }
});

// All scripts are deferred — DOM is ready, call directly
initDataActions();
initSidebarFilters();
renderGrids();
loadCart();
renderHpSubcatsStrip();
renderRecentlyDiscounted();
initSectionAnimations();
initScrollAnimations();
