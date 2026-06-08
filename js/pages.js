// ===== BLOG / SERVICE / DELIVERY PAGES =====
function _setPgBc(id, label, closeFnName) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `<ol class="pg-bc-list" itemscope itemtype="https://schema.org/BreadcrumbList"><li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><a href="/" class="pg-bc-home" onclick="${closeFnName}();return false;">Начало</a><meta itemprop="position" content="1"/></li><li class="pg-bc-sep" aria-hidden="true">›</li><li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem"><strong class="pg-bc-current" itemprop="name">${label}</strong><meta itemprop="position" content="2"/></li></ol>`;
}
const blogPosts = [
  {
    slug: 'palit-rtx-4070-super-jetstream-oc-review',
    emoji: '🎮', cat: 'Ревю', title: 'Palit RTX 4070 Super JetStream OC - Крал на средния клас',
    date: '02 Юни 2026', dateISO: '2026-06-02', read: '6 мин', author: 'Мост Компютърс',
    summary: 'RTX 4070 Super JetStream OC от Palit е може би най-балансираната видеокарта за 2026. Тествахме я в игри, рендериране и DLSS 3.',
    metaDesc: 'Palit GeForce RTX 4070 Super JetStream OC ревю - тест при 1440p и 4K, DLSS 3, температури. Най-добрата GeForce за парите?',
    tags: ['Nvidia', 'Palit', 'GPU', 'гейминг', 'ревю'],
    brand: 'palit', rating: '9.1',
    model: 'RTX 4070 Super', modelSub: 'JetStream OC · 12 GB', brandLabel: 'PALIT · GPU',
    productImage: './images/products/38228.webp',
    verdict: 'Безспорен избор за 1440p гейминг с бюджет до 1200 €. JetStream охладителят е сред най-добрите в класа, а factory OC носи реален бонус.',
    specs: {'GPU чип':'Ada Lovelace AD104','CUDA ядра':'7 168','Памет':'12 GB GDDR6X, 192-bit','Boost Clock':'2535 MHz (factory OC)','TDP':'220 W','Охладител':'JetStream 3×90 мм вентилатора'},
    body: `<h2>Паспорт на картата</h2>
<p>Palit GeForce RTX 4070 Super JetStream OC разполага с 7168 CUDA ядра (Ada Lovelace), 12 GB GDDR6X памет на 192-битова шина и factory OC от 2535 MHz boost. Трисекционният охладител с 3 вентилатора × 90 мм осигурява ниски температури и почти безшумна работа при умерено натоварване.</p>
<h2>Производителност при 1440p</h2>
<p>При <strong>1440p Ultra</strong> Palit RTX 4070 Super JetStream OC постига:</p>
<ul>
<li>Cyberpunk 2077 (RT Ultra + DLSS Quality) - 85 fps средно</li>
<li>Alan Wake 2 (Path Tracing + DLSS Quality) - 72 fps средно</li>
<li>CS2 (High) - 260 fps средно</li>
<li>Microsoft Flight Simulator 2024 (High) - 68 fps средно</li>
</ul>
<p>При 1440p без ray tracing практически всяка игра тече над 100 fps - нивото, от което играта е наистина плавна.</p>
<h2>Производителност при 4K</h2>
<p>4K не е основната целева резолюция на тази карта, но с DLSS 3 Quality (реален рендер при 1440p) резултатите изненадват: Cyberpunk 2077 - 62 fps, Alan Wake 2 - 54 fps. За 4K без DLSS Frame Generation е нужна RTX 4080 Super или по-висока карта.</p>
<h2>DLSS 3 и Frame Generation</h2>
<p>Transformer-базираният DLSS 3.7 дава визуално качество, неотличимо от native резолюция. Frame Generation удвоява fps-ите при GPU-bound сценарии без забележима латентност при Reflex + G-Sync. В Cyberpunk 2077 с всички RT ефекти и FG - 165 fps при 1440p.</p>
<h2>Температури и шум</h2>
<p>При full load GPU температурата е 68°C при стайна температура 22°C. Вентилаторите спират напълно при натоварване под 60W. При игри нивото е около 36 dBA - тихо дори в отворен корпус.</p>
<h2>Заключение</h2>
<p>Palit RTX 4070 Super JetStream OC е <strong>безспорният избор за 1440p гейминг</strong> с бюджет до 1200 €. JetStream охладителят е един от най-добрите в класа, а factory OC носи малък, но реален бонус. <strong>Оценка: 9.1 / 10</strong></p>`
  },
  {
    slug: 'amd-ryzen-9-9950x3d-review',
    emoji: '🔴', cat: 'Ревю', title: 'AMD Ryzen 9 9950X3D - Краят на компромисите',
    date: '02 Юни 2026', dateISO: '2026-06-02', read: '7 мин', author: 'Мост Компютърс',
    summary: 'AMD комбинира Zen 5 архитектурата с 3D V-Cache технологията. Резултатът е процесорът, за който геймърите мечтаеха.',
    metaDesc: 'AMD Ryzen 9 9950X3D ревю - Zen 5 + 3D V-Cache. Тест в игри, рендериране и съдържателна работа. Лидерът за 2026.',
    tags: ['AMD', 'процесори', 'гейминг', 'ревю'],
    brand: 'amd', rating: '9.5',
    model: 'Ryzen 9 9950X3D', modelSub: 'Zen 5 · 3D V-Cache · AM5', brandLabel: 'AMD · CPU',
    productImage: './images/products/44782.webp',
    verdict: 'Първият процесор без компромис между гейминг и продуктивност. Скъп, но напълно оправдан за enthusiast системи.',
    specs: {'Архитектура':'Zen 5 (TSMC 4nm)','Ядра / Нишки':'16C / 32T','Boost честота':'5.7 GHz','Кеш (L3)':'128 MB 3D V-Cache + 64 MB','TDP':'170 W','Сокет':'AM5 (LGA1718)'},
    body: `<h2>Zen 5 + 3D V-Cache: мощната комбинация</h2>
<p>Ryzen 9 9950X3D носи 16 ядра / 32 нишки на Zen 5 архитектура с 5.7 GHz boost честота плюс 128 MB 3D V-Cache върху CCD-то. Общо: 192 MB кеш (L2 + L3). AMD е решила дилемата от предишните X3D модели - кешираното CCD вече не ограничава максималните честоти.</p>
<h2>Производителност в игри</h2>
<p>В гейминг тестовете 9950X3D е <strong>недостижим в момента</strong>. При 1080p (CPU-limited) резултатите са:</p>
<ul>
<li>Cyberpunk 2077 - 245 fps средно (+18% vs 9800X3D)</li>
<li>CS2 - 680 fps средно (+22% vs Intel Core Ultra 9 285K)</li>
<li>Microsoft Flight Simulator 2024 - 115 fps (+25% vs 9900X)</li>
</ul>
<p>Подобренията идват от по-бързия Zen 5 IPC и увеличения кеш - двойна полза при силно зависими от кеша игри.</p>
<h2>Производителност в съдържателни задачи</h2>
<p>За разлика от 7950X3D, 9950X3D не жертва производителност при рендериране. В Cinebench 2025 Multi-Core надминава Core Ultra 9 285K с около <strong>12%</strong>. При компилация на голям C++ проект - 9950X3D е ~8% по-бърз от Intel.</p>
<h2>Температура и охлаждане</h2>
<p>TDP е 170W. AMD препоръчва минимум 360 мм AIO охладител. При добро охлаждане температурите са около 72°C при full load - отлично за 16-ядрен процесор.</p>
<h2>Платформа AM5 и надстройка</h2>
<p>Сокет AM5 осигурява дълголетие - платките от X670E клас поддържат DDR5-6400+ и PCIe 5.0 x16. Ако вече имаш AM5 система, 9950X3D е директна надстройка без смяна на дъното.</p>
<h2>Заключение</h2>
<p>9950X3D е първият процесор, при който <em>не е нужен компромис</em> между гейминг и продуктивност. Скъп, но оправдан. <strong>Оценка: 9.5 / 10</strong></p>`
  },
  {
    slug: 'intel-core-ultra-300-arrow-lake-2026',
    emoji: '🔵', cat: 'Новини', title: 'Intel Core Ultra 300 (Arrow Lake-R) - Пресичане на пропастта',
    date: '02 Юни 2026', dateISO: '2026-06-02', read: '5 мин', author: 'Мост Компютърс',
    summary: 'Intel Arrow Lake-R донесе значителни подобрения с BIOS оптимизации. Вече ли е достоен конкурент на AMD Ryzen 9000?',
    metaDesc: 'Intel Core Ultra 300 Arrow Lake-R ревю 2026 - IPC ръст, BIOS оптимизации, AI Boost. Сравнение с AMD Ryzen 9 9900X.',
    tags: ['Intel', 'процесори', 'Arrow Lake', 'новини'],
    brand: 'intel', rating: '8.3',
    model: 'Core Ultra 9 285K', modelSub: 'Arrow Lake-R · LGA1851', brandLabel: 'INTEL · CPU',
    productImage: './images/products/43688.webp',
    verdict: 'Arrow Lake-R затваря голяма част от пропастта с AMD. Добър избор за AI работни натоварвания и смесена употреба.',
    specs: {'Архитектура':'Lion Cove + Skymont E-cores','Ядра':'8P + 16E = 24 ядра','Boost честота':'5.7 GHz','Кеш (L3)':'36 MB','TDP':'125 W (253 W PL2)','Сокет':'LGA1851 (Z890)','NPU':'48 TOPS'},
    body: `<h2>Какво се промени при Arrow Lake-R?</h2>
<p>Серията Core Ultra 300 (Arrow Lake-R) е освежен вариант на Arrow Lake с нови BIOS микрокодове, оптимизации за Thread Director 2.0 и подобрени E-ядра (Skymont). Intel признава, че оригиналният Arrow Lake не постигна очакванията при гейминг - <strong>освежената версия коригира значителна част от проблемите</strong>.</p>
<h2>Core Ultra 9 285K vs предшественика</h2>
<p>При идентичен силиций, новите BIOS оптимизации носят:</p>
<ul>
<li>+11% средно в гейминг тестове при 1080p</li>
<li>+7% в Cinebench 2025 Multi-Core</li>
<li>-15W средна консумация при игри</li>
</ul>
<p>Резултатите поставят 285K по-близо до AMD Ryzen 9 9900X, но без 3D V-Cache вариантите, геймингът все още е предимство на AMD.</p>
<h2>AI Boost - Intel NPU в действие</h2>
<p>Arrow Lake-R включва NPU с <strong>48 TOPS</strong> AI производителност. Microsoft Copilot+, Adobe Firefly локално и GitHub Copilot с локален модел работят значително по-плавно. Ако AI инструментите са ключови за работата ти - Intel е по-добрата платформа в момента.</p>
<h2>Платформа LGA1851 и памет</h2>
<p>Core Ultra 300 изисква DDR5 - DDR4 вече не се поддържа. Оптималното е DDR5-6400 CL32. Intel препоръчва платки от Z890 клас за максимална производителност. PCIe 5.0 x16 за GPU и x4 за NVMe SSD са стандарт.</p>
<h2>За кого е Intel Core Ultra 300?</h2>
<p>Ако работиш интензивно с AI инструменти, нуждаеш се от Thunderbolt 5, или вече имаш LGA1851 платка - Core Ultra 300 е логичният избор. За чист гейминг AMD все още държи короната. За смесена употреба двете платформи са практически равни.</p>
<h2>Заключение</h2>
<p>Intel се върна в играта с Arrow Lake-R. Не е перфектен, но е значително подобрен. Очакваме Panther Lake (края на 2026) да затвори окончателно пропастта с AMD. <strong>Оценка: 8.3 / 10</strong></p>`
  },
  {
    slug: 'amd-ryzen-7-9800x3d-review-2026',
    emoji: '🔴', cat: 'Ревю', title: 'AMD Ryzen 7 9800X3D - Най-добрият геймърски процесор за парите',
    date: '26 Май 2026', dateISO: '2026-05-26', read: '6 мин', author: 'Мост Компютърс',
    summary: 'Ryzen 7 9800X3D предлага 9950X3D гейминг производителност на половин цена. Тествахме го в 12 игри и при рендериране.',
    metaDesc: 'AMD Ryzen 7 9800X3D ревю 2026 - тест в игри, Zen 5 + 3D V-Cache, сравнение с 9950X3D. Най-добрият геймърски CPU за цената.',
    tags: ['AMD', 'процесори', 'гейминг', 'ревю'],
    brand: 'amd', rating: '9.4',
    model: 'Ryzen 7 9800X3D', modelSub: 'Zen 5 · 3D V-Cache · AM5', brandLabel: 'AMD · CPU',
    productImage: './images/products/44485.webp',
    verdict: 'Абсолютният крал на гейминг производителност за цената. Ако бюджетът не позволява 9950X3D - 9800X3D е правилният избор.',
    specs: {'Архитектура':'Zen 5 (TSMC 4nm)','Ядра / Нишки':'8C / 16T','Boost честота':'5.7 GHz','Кеш (L3)':'96 MB 3D V-Cache','TDP':'120 W','Сокет':'AM5 (LGA1718)'},
    body: `<h2>Защо 9800X3D е специален?</h2>
<p>AMD Ryzen 7 9800X3D съчетава Zen 5 IPC с 96 MB 3D V-Cache - комбинация, която е почти недостижима в гейминг при CPU-limited сценарии. За разлика от 7800X3D, новото поколение не жертва честота за кеш - 5.7 GHz boost е реален и постижим при охлаждане с 240+ мм AIO.</p>
<h2>Гейминг тестове при 1080p</h2>
<p>При <strong>1080p CPU-limited</strong> тестове 9800X3D e:</p>
<ul>
<li>Cyberpunk 2077 - 275 fps средно</li>
<li>CS2 - 620 fps средно</li>
<li>Hogwarts Legacy - 198 fps средно</li>
<li>Star Wars Outlaws - 165 fps средно</li>
<li>Microsoft Flight Simulator 2024 - 108 fps средно</li>
</ul>
<p>Разликата спрямо Ryzen 9 9950X3D е под <strong>8% в повечето игри</strong> - незначителна за практически употреби при 1440p с RTX 4070+ GPU.</p>
<h2>Продуктивност - слабата страна?</h2>
<p>При 8 ядра срещу 16 при 9950X3D, разликата в рендериране е реална: Blender Classroom - 9800X3D е ~42% по-бавен. За чиста продуктивна работа 9950X3D или 9900X са по-добри. 9800X3D е оптимален за геймъри, които понякога стриймват или компилират.</p>
<h2>Температура и платформа</h2>
<p>TDP е 120W - по-лесен за охлаждане от 9950X3D. 240 мм AIO е достатъчен. Работи на всяка AM5 платка с актуален BIOS. Препоръчителна памет: DDR5-6000 CL30 в 2×16 GB конфигурация.</p>
<h2>Заключение</h2>
<p>9800X3D е процесорът, който повечето геймъри <em>действително</em> трябва да купят. Оферира 95% от гейминг производителността на 9950X3D на под 60% от цената. <strong>Оценка: 9.4 / 10</strong></p>`
  },
  {
    slug: 'intel-vs-amd-cpu-2026',
    emoji: '⚔️', cat: 'Сравнение', title: 'Intel vs AMD 2026 - Кой процесор да изберем?',
    productImage: './images/products/43688.webp',
    date: '19 Май 2026', dateISO: '2026-05-19', read: '7 мин', author: 'Мост Компютърс',
    summary: 'Arrow Lake-R срещу Zen 5 - пълно сравнение по гейминг, продуктивност, AI и платформа. Кой побеждава в средата на 2026?',
    metaDesc: 'Intel vs AMD 2026 - сравнение Core Ultra 300 Arrow Lake-R срещу Ryzen 9000 Zen 5. Кой CPU да купим за гейминг и работа?',
    tags: ['Intel', 'AMD', 'процесори', 'сравнение'],
    brand: 'general',
    body: `<h2>Платформи - AM5 срещу LGA1851</h2>
<p><strong>AMD AM5</strong> е по-зряла платформа - съществува от 2022 и поддържа Ryzen 7000, 8000 и 9000 серии. Съществуващите AM5 платки (X670E, B650E, B650) работят с нов BIOS. <strong>Intel LGA1851</strong> е по-нова - само Z890 и B860 дъни, DDR5 задължителна. AMD дава по-дълготрайна инвестиция в момента.</p>
<h2>Гейминг - AMD доминира</h2>
<p>При 1080p CPU-limited гейминг, Ryzen 7 9800X3D и 9950X3D са недостижими за Intel. Core Ultra 9 285K изостава с 15-25% в кешово-зависими игри. Без 3D V-Cache Intel губи директния дуел. При 1440p и 4K с мощна GPU разликата намалява до под 5% - практически незначителна.</p>
<h2>Продуктивност - по-изравнена битка</h2>
<p>В Cinebench 2025 Multi-Core: Core Ultra 9 285K е около 8% пред Ryzen 9 9900X, но 12% зад 9950X3D. При video export (DaVinci Resolve) Intel е по-бърз с ~6% спрямо 9900X. AMD печели при компилация и научни изчисления благодарение на по-голям кеш.</p>
<h2>AI - Intel NPU срещу AMD XDNA 2</h2>
<p>Intel Core Ultra 300 предлага <strong>48 TOPS NPU</strong>, AMD Ryzen 9000 - <strong>50 TOPS XDNA 2</strong>. Двете платформи са практически равни при локален AI инфер. Microsoft Copilot+ работи добре и на двете.</p>
<h2>Препоръки по случай</h2>
<ul>
<li><strong>Чист гейминг</strong> → AMD Ryzen 7 9800X3D</li>
<li><strong>Гейминг + продуктивност</strong> → AMD Ryzen 9 9950X3D</li>
<li><strong>AI работни натоварвания + Thunderbolt 5</strong> → Intel Core Ultra 9 285K</li>
<li><strong>Бюджет до 200 €</strong> → Intel Core i5-14600K или AMD Ryzen 5 9600X</li>
</ul>
<h2>Заключение</h2>
<p>AMD печели 2026 при гейминг. Intel отговаря с по-добри AI инструменти и Thunderbolt 5. За повечето потребители - AMD е по-доброто решение в момента.</p>`
  },
  {
    slug: 'palit-rtx-4080-super-jetstream-review',
    emoji: '🎮', cat: 'Ревю', title: 'Palit RTX 4080 Super JetStream OC - За 4K без компромис',
    date: '12 Май 2026', dateISO: '2026-05-12', read: '5 мин', author: 'Мост Компютърс',
    summary: 'RTX 4080 Super с JetStream охладителя на Palit е отговорът за истинско 4K гейминг. Тествахме го при максимални настройки.',
    metaDesc: 'Palit RTX 4080 Super JetStream OC ревю 2026 - 4K гейминг тест, температури, сравнение с RTX 4070 Ti Super. Worth it?',
    tags: ['Nvidia', 'Palit', 'GPU', 'гейминг', 'ревю'],
    brand: 'palit', rating: '8.9',
    model: 'RTX 4080 Super', modelSub: 'JetStream OC · 16 GB', brandLabel: 'PALIT · GPU',
    productImage: './images/products/38666.webp',
    verdict: 'Оптималният избор за 4K гейминг с бюджет под 2000 €. JetStream охладителят го прави тих дори при максимално натоварване.',
    specs: {'GPU чип':'Ada Lovelace AD102','CUDA ядра':'10 240','Памет':'16 GB GDDR6X, 256-bit','Boost Clock':'2595 MHz (factory OC)','TDP':'320 W','Охладител':'JetStream 3×100 мм'},
    body: `<h2>RTX 4080 Super - позицията в линейката</h2>
<p>RTX 4080 Super запълва пространството между RTX 4070 Ti Super и RTX 4090. С 10 240 CUDA ядра и 16 GB GDDR6X на 256-битова шина, картата предлага около <strong>15% повече производителност</strong> спрямо RTX 4070 Ti Super при ~20% по-висока цена. Palit JetStream OC версията идва с factory overclock до 2595 MHz boost.</p>
<h2>4K гейминг производителност</h2>
<p>При <strong>4K Ultra</strong> настройки без ray tracing:</p>
<ul>
<li>Cyberpunk 2077 - 82 fps средно</li>
<li>Alan Wake 2 - 74 fps средно</li>
<li>Red Dead Redemption 2 - 98 fps средно</li>
<li>Microsoft Flight Simulator 2024 - 72 fps средно</li>
</ul>
<p>С DLSS 3 Quality (рендер при 1440p) числата скачат до 130-165 fps - 4K гейминг над 60 fps е постижимо без Frame Generation при повечето заглавия.</p>
<h2>Ray Tracing и DLSS 3</h2>
<p>RTX 4080 Super е <strong>значително по-добър от RTX 4070 Ti Super при RT</strong> - 18-22% разлика при Path Tracing в Cyberpunk 2077. Frame Generation удвоява fps при GPU-bound сценарии, а Reflex 2 запазва латентността под контрол.</p>
<h2>Температури и шум</h2>
<p>Palit JetStream охладителят с три 100 мм вентилатора държи GPU на 72°C при full load при стайна температура 22°C. Шумното ниво е 38 dBA - практически безшумен в затворен корпус. Вентилаторите спират напълно при 2D натоварване.</p>
<h2>Заключение</h2>
<p>Palit RTX 4080 Super JetStream OC е правилният избор за 4K геймъри, които не искат да плащат RTX 4090 цена. При 1440p - RTX 4070 Super е по-добрата стойност. <strong>Оценка: 8.9 / 10</strong></p>`
  },
  {
    slug: 'ddr5-6000-gaming-guide-2026',
    emoji: '🧠', cat: 'Съвети', title: 'DDR5 памет за гейминг 2026 - Колко и каква?',
    date: '05 Май 2026', dateISO: '2026-05-05', read: '5 мин', author: 'Мост Компютърс',
    summary: 'DDR5-6000 или DDR5-6400? 32 GB или 64 GB? Пълен наръчник за избор на памет за AMD AM5 и Intel LGA1851.',
    metaDesc: 'DDR5 памет за гейминг 2026 - DDR5-6000 vs 6400, 32 GB vs 64 GB, AMD AM5 и Intel Z890. Как да изберем правилно.',
    tags: ['памет', 'DDR5', 'AM5', 'съвети'],
    brand: 'general',
    productImage: './images/products/37086.webp',
    body: `<h2>Колко GB памет е нужна за гейминг?</h2>
<p><strong>32 GB (2×16 GB)</strong> е стандартът за 2026. Повечето съвременни игри използват 16-24 GB при максимални настройки. 64 GB има смисъл само ако правиш едновременно гейминг + стрийминг + видео монтаж. За чист гейминг 32 GB е оптималното.</p>
<h2>DDR5-6000 vs DDR5-6400 - каква е разликата?</h2>
<p>За <strong>AMD AM5</strong> - DDR5-6000 CL30 е оптималното: попада в EXPO профила и синхронизира Infinity Fabric към 2000 MHz (1:1 режим). DDR5-6400 CL32 е леко по-бързо, но цената е непропорционална. Над DDR5-6400 AM5 преминава в 1:2 режим и производителността пада.</p>
<p>За <strong>Intel LGA1851</strong> - DDR5-6400 CL32 е препоръчителното. Intel XMP профилите са добре оптимизирани до тази честота. По-бързата памет носи минимални ползи при реална употреба.</p>
<h2>Dual Channel - задължителен</h2>
<p>Никога не купувай един модул. 2×16 GB dual channel е <strong>значително по-бърза</strong> от 1×32 GB single channel - до 20% разлика в гейминг производителност. Ако имаш бюджет за 64 GB - 2×32 GB вместо 4×16 GB (по-малко стрес върху контролера).</p>
<h2>CL (CAS Latency) - важен ли е?</h2>
<p>При равни честоти - по-нисък CL е по-добър. DDR5-6000 CL30 е по-бърза от DDR5-6000 CL36. Формулата е: <strong>латентност (ns) = (CL / честота) × 2000</strong>. При DDR5-6000 CL30: 10 ns - отлично.</p>
<h2>Препоръки за платформа</h2>
<ul>
<li><strong>AMD AM5 (Ryzen 9000)</strong> → DDR5-6000 CL30, 2×16 GB</li>
<li><strong>Intel LGA1851 (Core Ultra 300)</strong> → DDR5-6400 CL32, 2×16 GB</li>
<li><strong>AMD AM4 (Ryzen 5000)</strong> → все още DDR4-3600 CL18</li>
</ul>`
  },
  {
    slug: 'byudzhetna-gaming-sistema-2026',
    emoji: '🖥', cat: 'Съвети', title: 'Бюджетна гейминг система за 2026 - план за 800 €',
    date: '28 Април 2026', dateISO: '2026-04-28', read: '6 мин', author: 'Мост Компютърс',
    summary: 'Как да сглобим пълна гейминг система за около 800 € с компоненти, налични в Мост Компютърс. Съвети за всеки бюджет.',
    metaDesc: 'Бюджетна гейминг система 2026 - AMD Ryzen 5 9600X, Palit RTX 4060, B650 дъна. Как да изберем правилните компоненти за 800 €.',
    tags: ['гейминг', 'AMD', 'Palit', 'съвети', 'build'],
    brand: 'general',
    productImage: './images/products/35948.webp',
    body: `<h2>Стратегия: CPU или GPU - кое е по-важно?</h2>
<p>За гейминг <strong>GPU-то е по-важно</strong>. При ограничен бюджет - вложи повече в видеокартата. Ryzen 5 9600X за 220 € + RTX 4060 8GB за 310 € е по-добра гейминг система от Ryzen 9 9950X3D + GTX 1660 Super. Правилото: GPU = 40-50% от бюджета.</p>
<h2>Примерна конфигурация за ~800 €</h2>
<ul>
<li><strong>CPU:</strong> AMD Ryzen 5 9600X - 220 € (6 ядра, Zen 5, 5.9 GHz boost)</li>
<li><strong>GPU:</strong> Palit GeForce RTX 4060 8GB - 310 € (DLSS 3, Frame Gen, 1080p/1440p)</li>
<li><strong>Дъна:</strong> ASRock B650M-HDV/M.2 AM5 - 110 € (B650, PCIe 4.0, 2× DDR5)</li>
<li><strong>RAM:</strong> DDR5-6000 CL30 2×8 GB - 65 € (достатъчно за гейминг)</li>
<li><strong>SSD:</strong> 1 TB NVMe Gen4 - 60 €</li>
<li><strong>Захранване:</strong> 650W 80+ Bronze - 55 €</li>
</ul>
<p><strong>Общо: ~820 €</strong> - пълна система без корпус и охладяване.</p>
<h2>RTX 4060 - добра ли е за парите?</h2>
<p>При 1080p Ultra - RTX 4060 постига 85-120 fps в повечето AAA заглавия. С DLSS 3 Frame Generation резултатите при 1440p са изненадващо добри (65-90 fps). За геймъри с 1080p монитор е отличен избор. За 1440p - препоръчваме RTX 4070 Super.</p>
<h2>Как да надградиш по-късно?</h2>
<p>AM5 платформата поддържа до Ryzen 9000 серия - можеш да смениш CPU по-късно без смяна на дъното. Захранването от 650W поддържа до RTX 4080 Super надстройка. Инвестирай в добро захранване от самото начало.</p>
<h2>Съвет за спестяване</h2>
<p>Ако бюджетът е под 700 € - замени Ryzen 5 9600X с Ryzen 5 9600 (MPK версия, ~185 €) и RTX 4060 с RTX 3060 12GB (~250 €). Системата ще е около 100 € по-евтина при само ~10% по-ниска производителност.</p>`
  },
  {
    slug: 'am5-motherboard-guide-2026',
    emoji: '🔧', cat: 'Съвети', title: 'AM5 дъна платка 2026 - ASRock, ASUS, Gigabyte или MSI?',
    date: '21 Април 2026', dateISO: '2026-04-21', read: '6 мин', author: 'Мост Компютърс',
    summary: 'B650 или X670? Кой производител предлага най-добро качество за цената при AM5 платформата? Пълен наръчник.',
    metaDesc: 'AM5 дъна платка 2026 - B650 vs X670E, ASRock vs ASUS vs Gigabyte vs MSI. Кое дъно да изберем за AMD Ryzen 9000?',
    tags: ['дъни платки', 'AM5', 'AMD', 'съвети'],
    brand: 'general',
    productImage: './images/products/32593.webp',
    body: `<h2>B650 или X670E - какво да изберем?</h2>
<p><strong>B650</strong> е достатъчен за 95% от потребителите. Поддържа DDR5 ECC, PCIe 4.0 x4 за NVMe и USB 3.2 Gen 2. <strong>X670E</strong> добавя PCIe 5.0 x16 за GPU и PCIe 5.0 x4 за NVMe - полезно само ако имаш PCIe 5.0 SSD или RTX 4090 клас GPU. За Ryzen 5/7 - B650 е оптималното.</p>
<h2>Кой производител?</h2>
<h3>ASRock</h3>
<p>Най-добра стойност за парите. <strong>ASRock B650M Pro RS</strong> и <strong>B650M HDV/M.2</strong> предлагат солидни VRM за Ryzen 9000 на конкурентна цена. Добра BIOS поддръжка с редовни обновявания. Минус: по-скромен дизайн.</p>
<h3>ASUS</h3>
<p>Отлична BIOS среда (UEFI), богата функционалност, добра VRM. <strong>ASUS Prime B650M-A</strong> е популярен избор за mid-range системи. По-скъпо от ASRock, но оправдано при Ryzen 7/9.</p>
<h3>Gigabyte</h3>
<p>Добро охлаждане на VRM зоната. <strong>Gigabyte B650M DS3H</strong> е евтина и надеждна. Pro серията предлага подобрена аудио секция и по-добри конектори. Стабилна опция.</p>
<h3>MSI</h3>
<p>Висококачествен дизайн и богата екосистема с EZ Debug LED. <strong>MSI B650M Gaming Plus WiFi</strong> е отличен избор ако искаш WiFi включен. По-добра геймърска естетика от ASRock.</p>
<h2>Какво да проверим при избор</h2>
<ul>
<li><strong>VRM фазове</strong> - за Ryzen 9 9950X3D трябват минимум 12+2 фази с 60A+ дросели</li>
<li><strong>M.2 слотове</strong> - минимум 2 за система + storage</li>
<li><strong>WiFi</strong> - не всички B650 имат; проверявай спецификациите</li>
<li><strong>USB портове</strong> - USB4 / Thunderbolt само при X670E</li>
</ul>
<h2>Препоръка</h2>
<p>За <strong>Ryzen 5/7 9000</strong> → ASRock B650M Pro RS (~120 €). За <strong>Ryzen 9 9950X3D</strong> → ASUS Prime X670-P или MSI MEG X670E Ace за максимална стабилност.</p>`
  },
  {
    slug: 'macbook-pro-m4-pro-review',
    emoji: '💻', cat: 'Ревю', title: 'MacBook Pro M4 Pro - Worth It?',
    productImage: './images/products/46747.webp',
    date: '07 Март 2026', dateISO: '2026-03-07', read: '5 мин', author: 'Мост Компютърс',
    summary: 'Тествахме новия MacBook Pro M4 Pro в реални условия - видео монтаж, код и gaming. Ето резултатите.',
    metaDesc: 'MacBook Pro M4 Pro ревю - производителност, батерия, дисплей. Струва ли си цената? Тест в реални условия от Most Computers.',
    tags: ['MacBook', 'лаптопи', 'ревю'],
    body: `<h2>Дизайн и конструкция</h2>
<p>MacBook Pro M4 Pro запазва емблематичния алуминиев корпус в Space Black. При 14-инчовия модел тежи 1.55 кг - незначително повече от M3, но усещането за качество е на ниво. Notch-ът е намален с 20% спрямо предишното поколение.</p>
<h2>Производителност - M4 Pro чип</h2>
<p>12-ядреният CPU на M4 Pro е около <strong>22% по-бърз</strong> от M3 Pro при многоядрени задачи. Рендерирането на 4K проект в Final Cut Pro, което на M3 Pro отнемаше 8 минути, при M4 Pro приключва за 6:20. Компилацията на голям Swift проект се ускорява с ~18%.</p>
<p>При gaming чрез Game Mode и Rosetta 2 постиженията са изненадващи - Baldur's Gate 3 тече стабилно на средни настройки при 1080p, около 55-60 fps.</p>
<h2>Дисплей и батерия</h2>
<p>Liquid Retina XDR панелът с 1000 нита за SDR и 1600 нита за HDR остава еталон. ProMotion адаптивно управлява честотата между 24 и 120 Hz. При смесено натоварване (код, видео конференции, Safari) изкарахме <strong>16-17 часа</strong> от зареждане до зареждане - резултат, недостижим за Windows алтернативите.</p>
<h2>Струва ли си надстройката от M3 Pro?</h2>
<p>Ако работиш с M3 Pro Mac - не бързай. Подобрението е реално, но не революционно. Ако обаче идваш от Intel Mac или M1, разликата е <em>огромна</em>. M4 Pro е най-балансираният MacBook Pro засега.</p>
<p><strong>Оценка: 9.2 / 10</strong></p>`
  },
  {
    slug: 'iphone-16-pro-max-vs-s25-ultra',
    emoji: '📱', cat: 'Сравнение', title: 'iPhone 16 Pro Max vs Samsung S25 Ultra',
    productImage: './images/products/42081.webp',
    date: '03 Март 2026', dateISO: '2026-03-03', read: '7 мин', author: 'Мост Компютърс',
    summary: 'Двата флагмана се срещат в директен дуел. Камера, дисплей, батерия - кой печели?',
    metaDesc: 'iPhone 16 Pro Max срещу Samsung Galaxy S25 Ultra - пълно сравнение на камера, дисплей, батерия и производителност.',
    tags: ['iPhone', 'Samsung', 'смартфони', 'сравнение'],
    body: `<h2>Дизайн</h2>
<p>iPhone 16 Pro Max е преминал към титаниева рамка с по-заоблени ъгли. S25 Ultra залага на плоски ръбове и вградена S Pen - уникален плюс за творческата работа. И двата са в premium сегмента, но Apple изглежда по-изтънчено.</p>
<h2>Дисплей</h2>
<p>S25 Ultra предлага 6.9" Dynamic AMOLED 2X с 2600 нита пик яркост и 1-120 Hz адаптивен ProMotion. iPhone 16 Pro Max разполага с 6.9" Super Retina XDR OLED с ProMotion. В пряка конкуренция Samsung печели по яркост при директна слънчева светлина, докато Apple превъзхожда при точност на цветопредаването.</p>
<h2>Камера</h2>
<p>iPhone 16 Pro Max разполага с 48 MP главна, 48 MP ултраширока и 5x оптичен зум. S25 Ultra предлага 200 MP главна с 50 MP телефото при 5x и 10x зум. При дневна светлина двете системи са практически равни. Нощното снимане леко предпочита Samsung заради агресивната обработка, докато Apple дава по-естествен резултат.</p>
<h2>Производителност</h2>
<p>A18 Pro (Apple) срещу Snapdragon 8 Elite (Samsung) - в ежедневна употреба разликата е невидима. При тежко натоварване (видео рендериране, ML задачи) Apple губи по-малко производителност при топлинно дросиране.</p>
<h2>Батерия</h2>
<p>S25 Ultra предлага 5000 mAh батерия с 45W зареждане. iPhone 16 Pro Max - 4685 mAh с 27W. При реална употреба Samsung дава около 1 час повече автономия, но Apple зарежда безжично по-бързо (MagSafe 25W).</p>
<h2>Заключение</h2>
<p>Ако ти трябва S Pen, максимален зум и Android - <strong>S25 Ultra</strong>. Ако искаш iOS екосистема, по-добро видео и по-плавен софтуер - <strong>iPhone 16 Pro Max</strong>.</p>`
  },
  {
    slug: 'top-5-bejichni-slushalki-2026',
    emoji: '🎧', cat: 'Топ 5', title: 'Най-добри безжични слушалки за 2026',
    productImage: './images/products/47243.webp',
    date: '28 Февруари 2026', dateISO: '2026-02-28', read: '4 мин', author: 'Мост Компютърс',
    summary: 'Sony, Bose, ANC технология - кои слушалки дават най-добро качество за парите си?',
    metaDesc: 'Топ 5 безжични слушалки за 2026 - Sony WH-1000XM6, Bose QC45, Jabra. Коя да избереш?',
    tags: ['слушалки', 'аудио', 'топ 5'],
    body: `<h2>1. Sony WH-1000XM6 - Най-добро шумопотискане</h2>
<p>Sony продължава да доминира в сегмента на ANC слушалките. XM6 предлага 40 ч. автономия, Multipoint свързване с 2 устройства и подобрен процесор V2 за по-прецизно шумопотискане. Звукът е наситен и детайлен, особено при Hi-Res Wireless с LDAC кодек.</p>
<h2>2. Bose QuietComfort Ultra</h2>
<p>Bose е поставил акцент върху Immersive Audio - пространствен звук, който се адаптира спрямо движенията на главата. Ако пътуваш много и шумопотискането е приоритет, QC Ultra е равностоен конкурент на Sony.</p>
<h2>3. Jabra Evolve2 85 - За офиса</h2>
<p>Ако работиш в open space, Jabra предлага 8-микрофонен array за кристални обаждания, 37 ч. батерия и сертификация за Microsoft Teams. Звукът е малко по-неутрален от Sony, но за видеоконференции е идеален.</p>
<h2>4. Sennheiser Momentum 4</h2>
<p>Германска инженерия, 60 ч. батерия и естествен звук без прекомерна обработка. Momentum 4 е изборът на аудиофилите с бюджет под 350 €.</p>
<h2>5. Logitech Zone Vibe 130 - Бюджетен избор</h2>
<p>Лека безжична слушалка с 22 ч. батерия, вграден микрофон и Teams/Zoom сертификация. За под 100 € е трудно да се намери по-добър офис вариант.</p>
<h2>Заключение</h2>
<p>За повечето хора - <strong>Sony WH-1000XM6</strong>. За офис употреба - <strong>Jabra Evolve2 85</strong>. На бюджет - <strong>Logitech Zone Vibe 130</strong>.</p>`
  },
  {
    slug: 'kak-da-izberem-monitor-rabota-vkashti',
    emoji: '🖥', cat: 'Съвети', title: 'Как да изберем монитор за работа от вкъщи',
    date: '22 Февруари 2026', dateISO: '2026-02-22', read: '6 мин', author: 'Мост Компютърс',
    summary: '4K или 1440p? IPS или OLED? Пълен наръчник за правилния избор.',
    metaDesc: 'Как да изберем монитор за работа от вкъщи - 4K, 1440p, IPS, OLED. Пълен наръчник 2026.',
    tags: ['монитори', 'работа от вкъщи', 'съвети', '4K'],
    productImage: './images/products/46737.webp',
    body: `<h2>Резолюция: 1080p, 1440p или 4K?</h2>
<p>При 24-27" монитор <strong>1440p (2K)</strong> е оптималният баланс - достатъчно остра картина без прекомерно натоварване на GPU. 4K има смисъл при 32"+ или ако работиш с видео/снимки и имаш мощна графична карта.</p>
<h2>Матрица: IPS, VA или OLED?</h2>
<ul>
<li><strong>IPS</strong> - най-добри ъгли на видимост, точни цветове. Идеален за дизайн и фото работа.</li>
<li><strong>VA</strong> - по-висок контраст, по-добри черни. Добър за филми и кодиране.</li>
<li><strong>OLED</strong> - перфектни черни, изключителни цветове, но риск от burn-in при статично съдържание.</li>
</ul>
<h2>Честота на опресняване</h2>
<p>За офис работа 60-75 Hz е достатъчно. Ако пишеш код или четеш много - 120-144 Hz прави скролването значително по-плавно и намалява умората на очите.</p>
<h2>Размер и ергономия</h2>
<p>27" е стандартът за работа от вкъщи. Ако имаш пространство - помисли за ултраширок 34" (21:9), който заменя два отделни монитора. Стойка с регулиране на височина е задължителна за правилна поза.</p>
<h2>Препоръки по бюджет</h2>
<ul>
<li><strong>до 200 €</strong> - LG 27MN60T (IPS, 1080p, 75Hz)</li>
<li><strong>до 350 €</strong> - LG 27QN850-B (IPS, 1440p, USB-C 60W)</li>
<li><strong>до 600 €</strong> - LG 27UK850 (IPS, 4K, USB-C)</li>
<li><strong>без ограничение</strong> - ASUS ProArt PA329CRV (4K OLED, 144Hz)</li>
</ul>`
  },
  {
    slug: '10-nachina-udalzhim-bateriya',
    emoji: '🔋', cat: 'Съвети', title: '10 начина да удължим живота на батерията',
    productImage: './images/products/52804.webp',
    date: '15 Февруари 2026', dateISO: '2026-02-15', read: '3 мин', author: 'Мост Компютърс',
    summary: 'Простите навици, които могат да удвоят живота на батерията на твоя телефон или лаптоп.',
    metaDesc: '10 съвета за по-дълъг живот на батерията на смартфон и лаптоп. Практични навици от Most Computers.',
    tags: ['батерия', 'съвети', 'смартфон', 'лаптоп'],
    body: `<h2>За смартфони</h2>
<ol>
<li><strong>Оптимизирано зареждане</strong> - iPhone и Android имат функция, която ограничава зареждането до 80% за нощни зарядки. Включи я.</li>
<li><strong>Избягвай крайностите</strong> - не изтощавай батерията до 0% и не я дръж постоянно на 100%. Оптималният диапазон е 20-80%.</li>
<li><strong>Намали яркостта</strong> - дисплеят е най-големият консуматор. Автоматична яркост + тъмен режим могат да спестят до 30% от батерията.</li>
<li><strong>Ограничи Background App Refresh</strong> - приложенията, които се обновяват на заден план, изяждат батерия незабележимо.</li>
<li><strong>Изключи Location Services</strong> за приложения, които не го нуждаят.</li>
</ol>
<h2>За лаптопи</h2>
<ol start="6">
<li><strong>Батерийни режими</strong> - Windows има "Battery Saver", macOS има "Low Power Mode". Включи при работа без захранване.</li>
<li><strong>Охлаждане</strong> - батериите деградират по-бързо при висока температура. Не работи с лаптопа върху меки повърхности.</li>
<li><strong>Hibernation вместо Sleep</strong> при дълго неизползване пести значително повече батерия.</li>
<li><strong>RAM вместо HDD/SSD swap</strong> - ако лаптопът постоянно пише на диска, добави RAM.</li>
<li><strong>Калибрация</strong> - веднъж на 3 месеца напълно зареди до 100%, след което изтощи до ~5%. Помага за точното отчитане на заряда.</li>
</ol>
<p>При правилна грижа, литиево-йонна батерия може да запази над 80% от капацитета след 500 цикъла зареждане.</p>`
  },
  {
    slug: 'umen-dom-pod-500-leva',
    emoji: '🏠', cat: 'Smart Home', title: 'Как да изградим умен дом за под 500 лв.',
    productImage: './images/products/42961.webp',
    date: '10 Февруари 2026', dateISO: '2026-02-10', read: '8 мин', author: 'Мост Компютърс',
    summary: 'Philips Hue, смарт контакти, гласов асистент - пълна система без да се разоряваме.',
    metaDesc: 'Умен дом за под 500 лева - Philips Hue, Google Home, смарт контакти. Ръководство стъпка по стъпка.',
    tags: ['умен дом', 'Smart Home', 'Philips Hue', 'Google Home'],
    body: `<h2>Отправна точка: Гласов асистент</h2>
<p>Всичко започва с централен хъб. <strong>Google Nest Mini</strong> (около 50 лв.) или <strong>Amazon Echo Dot</strong> (около 45 лв.) са идеалните отправни точки. Веднъж инсталиран, асистентът управлява всички останали устройства с гласови команди.</p>
<h2>Интелигентно осветление (~150 лв.)</h2>
<p>Philips Hue Starter Kit с 3 крушки и хъб е класическият избор - стабилен Zigbee протокол, богата екосистема и страхотно приложение. Алтернативата е IKEA TRÅDFRI (по-евтино, малко по-ограничено). Смарт крушките с WiFi (SONOFF, Tapo) не изискват отделен хъб.</p>
<h2>Смарт контакти (~80 лв. за 2 бр.)</h2>
<p>Смарт контактите трансформират обикновени уреди в интелигентни. Стар вентилатор, кафемашина или лампа могат да се управляват от телефона или таймер. TP-Link Tapo P115 е любимецът - мери и консумацията на ток.</p>
<h2>Сигурност (~150 лв.)</h2>
<p>Смарт видеокамера (Tapo C200 - около 60 лв.) + смарт звънец (Reolink Video Doorbell - около 90 лв.) покриват основната домашна сигурност. И двата работят с Google Home и Alexa.</p>
<h2>Примерен бюджет</h2>
<ul>
<li>Google Nest Mini - 50 лв.</li>
<li>Philips Hue Starter Kit - 150 лв.</li>
<li>2x Tapo P115 смарт контакт - 80 лв.</li>
<li>Tapo C200 камера - 60 лв.</li>
<li>Reolink Doorbell - 90 лв.</li>
<li><strong>Общо: ~430 лв.</strong></li>
</ul>
<p>Ако разпределиш покупките за 2-3 месеца, усещането за „умен дом" идва постепенно - и е много по-достъпно, отколкото изглежда.</p>`
  },
];


function openBlogPage() {
  const listView = document.getElementById('blogListView');
  const postView = document.getElementById('blogPostView');
  if (listView) listView.style.display = '';
  if (postView) postView.style.display = 'none';
  const titleEl = document.getElementById('blogPageTitle');
  if (titleEl) titleEl.textContent = '📰 Блог и новини';
  _renderBlogGrid();
  _setPgBc('blogBc', 'Блог и новини', 'closeBlogPage');
  document.getElementById('blogPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Блог - Most Computers', 'Ревюта, сравнения и съвети за компютри, лаптопи и електроника от екипа на Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('Блог');
  try { history.pushState({ page: 'blog' }, '', '?page=blog'); } catch(e) {}
}
function _renderBlogGrid() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  grid.innerHTML = blogPosts.map(p => {
    const brand = p.brand || 'general';
    const hdContent = p.model
      ? `${p.brandLabel ? `<div class="blog-mag-brand-lbl">${escHtml(p.brandLabel)}</div>` : ''}
         <div class="blog-mag-model">${escHtml(p.model)}</div>
         ${p.modelSub ? `<div class="blog-mag-submodel">${escHtml(p.modelSub)}</div>` : ''}`
      : (p.productImage ? '' : `<div class="blog-mag-emoji">${p.emoji}</div>`);
    const hdClass = p.productImage ? (p.model ? ' has-product-img' : ' img-only') : '';
    return `<div class="blog-mag-card" onclick="openBlogPost('${p.slug}')">
      <div class="blog-mag-hd blog-brand-${brand}${hdClass}">
        <span class="blog-mag-cat-pill">${escHtml(p.cat)}</span>
        ${p.rating ? `<span class="blog-mag-rating-badge">${escHtml(p.rating)}</span>` : ''}
        <div class="blog-mag-hd-inner">${hdContent}</div>
        ${p.productImage ? `<img class="blog-mag-product-img" src="${p.productImage}" alt="${escHtml(p.model||p.title)}" loading="lazy">` : ''}
      </div>
      <div class="blog-mag-body">
        <div class="blog-mag-meta">
          <span class="blog-mag-date">${escHtml(p.date)}</span>
          <span class="blog-mag-read"><span class="blog-mag-dot"></span>${escHtml(p.read)} четене</span>
        </div>
        <div class="blog-mag-title">${escHtml(p.title)}</div>
        <div class="blog-mag-summary">${escHtml(p.summary)}</div>
        <div class="blog-mag-footer">
          <span class="blog-mag-tag">${escHtml(p.tags[0]||'')}</span>
          <span class="blog-mag-cta">Прочети →</span>
        </div>
      </div>
    </div>`;
  }).join('');
}
function openBlogPost(slug) {
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return;
  const listView = document.getElementById('blogListView');
  const postView = document.getElementById('blogPostView');
  const article = document.getElementById('blogArticle');
  if (!postView || !article) return;
  if (listView) listView.style.display = 'none';
  postView.style.display = '';
  const titleEl = document.getElementById('blogPageTitle');
  if (titleEl) titleEl.textContent = post.title;
  // Update breadcrumb: Начало > Блог > [Title]
  const bcEl = document.getElementById('blogBc');
  if (bcEl) {
    const shortTitle = post.title.length > 40 ? post.title.slice(0, 40) + '…' : post.title;
    bcEl.innerHTML = `<ol class="pg-bc-list" itemscope itemtype="https://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a href="/" class="pg-bc-home" onclick="closeBlogPage();return false;">Начало</a>
      <meta itemprop="position" content="1"/>
    </li>
    <li class="pg-bc-sep" aria-hidden="true">›</li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a class="pg-bc-home" onclick="closeBlogPost();return false;" style="cursor:pointer">Блог</a>
      <meta itemprop="position" content="2"/>
    </li>
    <li class="pg-bc-sep" aria-hidden="true">›</li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <strong class="pg-bc-current" itemprop="name">${shortTitle}</strong>
      <meta itemprop="position" content="3"/>
    </li>
  </ol>`;
  }
  const brand = post.brand || 'general';
  const specsHtml = post.specs
    ? `<table class="blog-specs-table">${Object.entries(post.specs).map(([k,v]) =>
        `<tr><td>${escHtml(k)}</td><td>${escHtml(v)}</td></tr>`).join('')}</table>`
    : '';
  const verdictHtml = post.rating
    ? `<div class="blog-verdict">
        <div class="blog-verdict-score">${escHtml(post.rating)}<span>/ 10</span></div>
        <div class="blog-verdict-text">
          <h3>Нашата присъда</h3>
          <p>${escHtml(post.verdict||post.summary)}</p>
        </div>
       </div>`
    : '';
  article.innerHTML = `
    <div class="blog-reading-bar"><div class="blog-reading-fill" id="blogReadingFill"></div></div>
    <header class="blog-article-hero blog-brand-${brand}">
      ${post.brandLabel ? `<div class="blog-article-hero-brand">${escHtml(post.brandLabel)}</div>` : ''}
      <h1>${escHtml(post.title)}</h1>
      <div class="blog-article-hero-meta">
        <span class="blog-article-hero-badge cat">${escHtml(post.cat)}</span>
        <time datetime="${post.dateISO}" class="blog-article-hero-badge info">${escHtml(post.date)}</time>
        <span class="blog-article-hero-badge info">📖 ${escHtml(post.read)}</span>
        <span class="blog-article-hero-badge info">✍️ ${escHtml(post.author)}</span>
      </div>
      ${post.productImage ? `<div class="blog-article-hero-product"><img src="${post.productImage}" alt="${escHtml(post.model||post.title)}" loading="lazy"></div>` : ''}
    </header>
    <div class="blog-article-body-wrap">
      <p class="blog-article-lead">${escHtml(post.summary)}</p>
      ${specsHtml}
      <div class="blog-article-body">${post.body}</div>
      ${verdictHtml}
    </div>`;
  // SEO meta
  if (typeof setPageMeta === 'function') setPageMeta(post.title + ' - Most Computers', post.metaDesc);
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.setAttribute('href', 'https://mostcomputers.bg/?page=blog&post=' + post.slug);
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', 'https://mostcomputers.bg/?page=blog&post=' + post.slug);
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'article');
  // Article JSON-LD
  let _ld = document.getElementById('_blogPostLD');
  if (!_ld) { _ld = document.createElement('script'); _ld.type = 'application/ld+json'; _ld.id = '_blogPostLD'; document.head.appendChild(_ld); }
  _ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDesc,
    datePublished: post.dateISO,
    author: { '@type': 'Organization', name: 'Most Computers', url: 'https://mostcomputers.bg' },
    publisher: { '@type': 'Organization', name: 'Most Computers', url: 'https://mostcomputers.bg' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://mostcomputers.bg/?page=blog&post=' + post.slug }
  });
  if (!document.getElementById('blogPage').classList.contains('open')) {
    document.getElementById('blogPage').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  try { history.pushState({ page: 'blog', post: slug }, '', '?page=blog&post=' + slug); } catch(e) {}
  postView.scrollTop = 0;
  const fill = document.getElementById('blogReadingFill');
  if (postView._blogScrollFn) postView.removeEventListener('scroll', postView._blogScrollFn);
  postView._blogScrollFn = () => {
    const total = postView.scrollHeight - postView.clientHeight;
    if (fill && total > 0) fill.style.width = Math.min(100, (postView.scrollTop / total) * 100) + '%';
  };
  postView.addEventListener('scroll', postView._blogScrollFn);
}
function closeBlogPost() {
  const listView = document.getElementById('blogListView');
  const postView = document.getElementById('blogPostView');
  if (postView) postView.style.display = 'none';
  if (listView) listView.style.display = '';
  const titleEl = document.getElementById('blogPageTitle');
  if (titleEl) titleEl.textContent = '📰 Блог и новини';
  // Remove Article JSON-LD
  const _ld = document.getElementById('_blogPostLD');
  if (_ld) _ld.remove();
  if (typeof setPageMeta === 'function') setPageMeta('Блог - Most Computers', 'Ревюта, сравнения и съвети за компютри, лаптопи и електроника от екипа на Most Computers.');
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'website');
  try { history.replaceState({ page: 'blog' }, '', '?page=blog'); } catch(e) {}
  _setPgBc('blogBc', 'Блог и новини', 'closeBlogPage');
}
function closeBlogPage() {
  // If a post is open, close post first and go back to list
  const postView = document.getElementById('blogPostView');
  if (postView && postView.style.display !== 'none' && postView.style.display !== '') {
    closeBlogPost();
    return;
  }
  document.getElementById('blogPage').classList.remove('open');
  document.body.style.overflow = '';
  const _ld = document.getElementById('_blogPostLD');
  if (_ld) _ld.remove();
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
// Lazy-load Leaflet JS + CSS on first map use (saves ~41 KiB from initial load)
var _leafletLoaded = false;
var _leafletLoading = false;
var _leafletQueue = [];
function _loadLeaflet(cb) {
  if (_leafletLoaded) { cb(); return; }
  _leafletQueue.push(cb);
  if (_leafletLoading) return;
  _leafletLoading = true;
  // CSS first (non-blocking)
  var css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  css.crossOrigin = '';
  document.head.appendChild(css);
  // JS
  var s = document.createElement('script');
  s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  s.crossOrigin = '';
  s.onload = function() {
    _leafletLoaded = true;
    _leafletLoading = false;
    _leafletQueue.forEach(function(fn) { fn(); });
    _leafletQueue = [];
  };
  document.head.appendChild(s);
}

let _svcMap = null;
function openServicePage() {
  _setPgBc('serviceBc', 'Сервиз и поддръжка', 'closeServicePage');
  document.getElementById('servicePage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Сервизен център - Most Computers', 'Сертифициран сервиз за лаптопи, компютри и електроника. Диагностика, ремонт и гаранционно обслужване в Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('Сервизен център');
  try { history.pushState({ page: 'service' }, '', '?page=service'); } catch(e) {}
  _svcTrkInit();
  _svcMapInit();
}
function _svcMapInit() {
  const el = document.getElementById('svcLeafletMap');
  if (!el) return;
  if (_svcMap) { setTimeout(() => _svcMap.invalidateSize(), 200); return; }
  _loadLeaflet(function() {
    if (_svcMap) return;
    _svcMap = L.map(el, { zoomControl: true, scrollWheelZoom: false }).setView([42.679938, 23.359063], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(_svcMap);
    const pinIcon = L.divIcon({
      className: '',
      html: '<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22s14-12.667 14-22C28 6.268 21.732 0 14 0z" fill="#bd1105"/><circle cx="14" cy="14" r="5.5" fill="#fff"/></svg>',
      iconSize: [28, 36],
      iconAnchor: [14, 36]
    });
    L.marker([42.679938, 23.359063], { icon: pinIcon })
      .addTo(_svcMap)
      .bindPopup('<strong>Мост Компютърс</strong><br>бул. Шипченски проход 240');
    setTimeout(() => _svcMap.invalidateSize(), 200);
  });
}
function closeServicePage() {
  document.getElementById('servicePage').classList.remove('open');
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
function openDeliveryPage() {
  _setPgBc('deliveryBc', 'Доставка и плащане', 'closeDeliveryPage');
  document.getElementById('deliveryPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Доставка и плащане - Most Computers', 'Безплатна доставка при поръчки над 100 €. Доставяме с куриер в рамките на 1-3 работни дни в цяла България.');
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
// TODO: add dedicated pages for Terms and Privacy
function openTermsPage() { openDeliveryPage(); }
function openPrivacyPage() { openDeliveryPage(); }
function openReturnsSection() {
  openDeliveryPage();
  setTimeout(() => {
    const el = document.getElementById('dlv-faq-returns');
    if (!el) return;
    el.open = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 320);
}
function openWarrantyPage() {
  _setPgBc('warrantyBc', 'Гаранционни условия', 'closeWarrantyPage');
  document.getElementById('warrantyPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Гаранционни условия (ОГУ) - Most Computers', 'Общи гаранционни условия на Мост Компютърс ООД. Гаранционен срок, приемане на рекламации и сервизна мрежа в 34 города в България.');
  if (typeof bcOnPage === 'function') bcOnPage('Гаранционни условия');
  try { history.pushState({ page: 'warranty' }, '', '?page=warranty'); } catch(e) {}
}
function closeWarrantyPage() {
  document.getElementById('warrantyPage').classList.remove('open');
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}
function filterCatScroll(type) {
  if (typeof openCatPage === 'function') { openCatPage(type); return; }
  const featured = document.getElementById('featured');
  if (featured) featured.scrollIntoView({behavior:'smooth'});
}


// ===== CONTACTS PAGE =====
let _contactsMap = null;
let _warehouseMap = null;
function openContactsPage() {
  _setPgBc('contactsBc', 'Контакти', 'closeContactsPage');
  document.getElementById('contactsPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  checkOpenNow();
  try{history.pushState({page:'contacts'}, '', '?page=contacts');}catch(e){}
  const mf = document.querySelector('.map-frame[data-src]');
  if (mf) { mf.src = mf.dataset.src; mf.removeAttribute('data-src'); }
  _contactsMapInit();
  _warehouseMapInit();
}
function _contactsMapInit() {
  const el = document.getElementById('contactsLeafletMap');
  if (!el) return;
  if (_contactsMap) { setTimeout(() => _contactsMap.invalidateSize(), 200); return; }
  _loadLeaflet(function() {
    if (_contactsMap) return;
    _contactsMap = L.map(el, { zoomControl: true, scrollWheelZoom: false }).setView([42.679938, 23.359063], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(_contactsMap);
    const pinIcon = L.divIcon({
      className: '',
      html: '<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22s14-12.667 14-22C28 6.268 21.732 0 14 0z" fill="#bd1105"/><circle cx="14" cy="14" r="5.5" fill="#fff"/></svg>',
      iconSize: [28, 36],
      iconAnchor: [14, 36]
    });
    L.marker([42.679938, 23.359063], { icon: pinIcon })
      .addTo(_contactsMap)
      .bindPopup('<strong>Мост Компютърс</strong><br>бул. Шипченски проход 240');
    setTimeout(() => _contactsMap.invalidateSize(), 200);
  });
}

function _warehouseMapInit() {
  const el = document.getElementById('warehouseLeafletMap');
  if (!el) return;
  if (_warehouseMap) { setTimeout(() => _warehouseMap.invalidateSize(), 200); return; }
  _loadLeaflet(function() {
    if (_warehouseMap) return;
    _warehouseMap = L.map(el, { zoomControl: true, scrollWheelZoom: false }).setView([42.6558, 23.3894], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(_warehouseMap);
    const pinIcon = L.divIcon({
      className: '',
      html: '<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22s14-12.667 14-22C28 6.268 21.732 0 14 0z" fill="#bd1105"/><circle cx="14" cy="14" r="5.5" fill="#fff"/></svg>',
      iconSize: [28, 36],
      iconAnchor: [14, 36]
    });
    L.marker([42.6558, 23.3894], { icon: pinIcon })
      .addTo(_warehouseMap)
      .bindPopup('<strong>Централен склад</strong><br>ул. Магнаурска школа №13, ЗИТ');
    setTimeout(() => _warehouseMap.invalidateSize(), 200);
  });
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

function copyWarehouseAddress() {
  const addr = 'ул. Магнаурска школа №13, 1784 София, ЗИТ, сграда 1';
  navigator.clipboard ? navigator.clipboard.writeText(addr).then(() => showToast('📋 Адресът е копиран!')).catch(() => {
    const ta = document.createElement('textarea'); ta.value = addr; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showToast('📋 Адресът е копиран!');
  }) : (() => { const ta = document.createElement('textarea'); ta.value = addr; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showToast('📋 Адресът е копиран!'); })();
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

  const _scWH = (()=>{ try{return JSON.parse(localStorage.getItem('mc_store_config')||'{}');}catch(e){return {};} })();
  let isOpen = false;
  if (day >= 1 && day <= 5 && time >= (_scWH.storeOpenMin||570) && time < (_scWH.storeCloseMin||1095)) isOpen = true;

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

  // Warehouse badge - Mon-Fri 09:00-17:00 (540-1020)
  const warehouseBadge = document.getElementById('warehouseOpenNowBadge');
  if (warehouseBadge) {
    const whOpen = day >= 1 && day <= 5 && time >= (_scWH.warehouseOpenMin||540) && time < (_scWH.warehouseCloseMin||1020);
    warehouseBadge.innerHTML = whOpen
      ? '<span style="display:inline-flex;align-items:center;gap:6px;background:#e8f9ed;color:#1a7f37;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:800;"><span style="width:8px;height:8px;border-radius:50%;background:#34c759;display:inline-block;"></span> Отворено сега</span>'
      : '<span style="display:inline-flex;align-items:center;gap:6px;background:#fef2f2;color:#dc2626;border-radius:8px;padding:7px 14px;font-size:13px;font-weight:800;"><span style="width:8px;height:8px;border-radius:50%;background:#ef4444;display:inline-block;"></span> Затворено</span>';
    const whRows = document.querySelectorAll('#warehouseHoursTable tr');
    whRows.forEach(r => { r.style.background = ''; });
    if (whRows[dayMap[day]]) {
      whRows[dayMap[day]].style.background = 'var(--primary-light)';
      whRows[dayMap[day]].style.borderRadius = '6px';
    }
  }
}



// ===== SERVICE TRACKER =====
let _svcTrkInited = false;
const _SVCTRK_LAST = 'svcTrkLast';
const _SVCTRK_HIST = 'svcTrkHist';

function _svcEsc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function _svcTrkInit() {
  if (_svcTrkInited) return;
  const form = document.getElementById('svcTrkForm');
  if (!form) return;
  _svcTrkInited = true;

  const inputOrder    = document.getElementById('svcTrkOrder');
  const inputWarranty = document.getElementById('svcTrkWarranty');
  const errEl         = document.getElementById('svcTrkErr');

  inputWarranty.addEventListener('input', e => {
    const v = e.target.value.replace(/\D/g, '');
    if (e.target.value !== v) e.target.value = v;
    inputWarranty.classList.remove('svc-err');
    errEl.style.display = 'none';
    _svcTrkClearResult();
  });
  inputOrder.addEventListener('input', () => {
    inputOrder.classList.remove('svc-err');
    errEl.style.display = 'none';
    _svcTrkClearResult();
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    _svcTrkSearch(inputOrder.value.trim(), inputWarranty.value.trim());
  });

  // Restore last result from localStorage
  try {
    const saved = JSON.parse(localStorage.getItem(_SVCTRK_LAST) || 'null');
    if (saved && saved.searchType && saved.searchValue) {
      if (saved.searchType === 'order') inputOrder.value = saved.searchValue;
      else inputWarranty.value = saved.searchValue;
      _svcTrkShowResult(saved, true);
    }
  } catch(e) {}
  _svcTrkUpdateHistory();
}

function _svcTrkSearch(order, warranty) {
  const inputOrder    = document.getElementById('svcTrkOrder');
  const inputWarranty = document.getElementById('svcTrkWarranty');
  const errEl         = document.getElementById('svcTrkErr');
  inputOrder.classList.remove('svc-err');
  inputWarranty.classList.remove('svc-err');

  if (!order && !warranty) {
    errEl.style.display = 'block';
    inputOrder.classList.add('svc-err');
    inputWarranty.classList.add('svc-err');
    return;
  }
  const val = order || warranty;
  if (val.length < 3) {
    errEl.style.display = 'block';
    (order ? inputOrder : inputWarranty).classList.add('svc-err');
    return;
  }
  errEl.style.display = 'none';

  const btn    = document.getElementById('svcTrkBtn');
  const btnTxt = document.getElementById('svcTrkBtnTxt');
  const loader = document.getElementById('svcTrkLoader');
  btn.disabled = true;
  btnTxt.textContent = 'Проверяваме…';
  loader.style.display = 'inline-block';
  _svcTrkClearResult();

  const searchType  = order ? 'order' : 'warranty';
  const searchValue = val;

  // TODO: replace setTimeout with real API fetch
  setTimeout(() => {
    btn.disabled = false;
    btnTxt.textContent = '🔍 Провери статус';
    loader.style.display = 'none';

    if (searchValue.endsWith('0')) {
      _svcTrkShowError('⚠️ Няма намерена поръчка с този номер. Проверете дали номерът е изписан правилно.');
    } else {
      const demo = { found:true, status:'В ремонт', updatedAt:'20.11.2025',
        step:'Изчаква резервни части', location:'Сервизен център - София', searchType, searchValue };
      _svcTrkShowResult(demo, false);
      try { localStorage.setItem(_SVCTRK_LAST, JSON.stringify(demo)); } catch(e) {}
      _svcTrkSaveHistory(demo);
      _svcTrkUpdateHistory();
    }
  }, 1200);
}

function _svcTrkPillClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('ремонт'))                    return 'svc-pill-repair';
  if (s.includes('изчаква') || s.includes('части')) return 'svc-pill-waiting';
  if (s.includes('готов')   || s.includes('получаване')) return 'svc-pill-ready';
  return 'svc-pill-default';
}

function _svcTrkShowResult(data, fromCache) {
  if (!data || !data.found) { _svcTrkShowError('⚠️ Няма намерена поръчка с този номер.'); return; }
  const box       = document.getElementById('svcTrkResult');
  const pill      = _svcTrkPillClass(data.status);
  const isReady   = pill === 'svc-pill-ready';
  const typeLabel = data.searchType === 'order' ? 'Сервизна поръчка' : 'Гаранционна карта';
  const sv        = _svcEsc(data.searchValue || '');

  box.innerHTML = `
    <div class="svc-result-ok">✅ Поръчката е намерена</div>
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
      <span class="svc-result-label">${typeLabel} → ${sv}</span>
      <button type="button" class="svc-copy-btn"
        onclick="navigator.clipboard&&navigator.clipboard.writeText('${sv}').then(()=>{this.textContent='Копирано';setTimeout(()=>this.textContent='Копирай номер',1500)})">Копирай номер</button>
    </div>
    <div class="svc-result-row"><span class="svc-result-label">Статус:</span> ${_svcEsc(data.status)} <span class="svc-pill ${pill}">${_svcEsc(data.status)}</span></div>
    <div class="svc-result-row"><span class="svc-result-label">Последна актуализация:</span> ${_svcEsc(data.updatedAt || '-')}</div>
    <div class="svc-result-row"><span class="svc-result-label">Етап:</span> ${_svcEsc(data.step || '-')}</div>
    <div class="svc-result-row"><span class="svc-result-label">Локация:</span> ${_svcEsc(data.location || '-')}</div>
    ${isReady ? '<div class="svc-ready-note">✅ Ремонтът е приключил. Носете сервизния протокол при получаване.</div>' : ''}
    ${fromCache ? '<div style="margin-top:8px;font-size:12px;color:var(--muted);"><em>Показан е последният резултат от предишно търсене.</em></div>' : ''}
  `;
  box.style.display = 'block';
  requestAnimationFrame(() => box.classList.add('show'));
}

function _svcTrkShowError(msg) {
  const box = document.getElementById('svcTrkResult');
  box.innerHTML = `
    <div class="svc-result-err">${_svcEsc(msg)}</div>
    <div style="font-size:13px;color:var(--text2);">Проверете дали номерът е изписан правилно и опитайте отново.</div>
    <div style="margin-top:8px;font-size:13px;">При нужда от съдействие: <a href="tel:0700144 11" style="color:var(--primary);font-weight:700;">0700 144 11</a></div>
  `;
  box.style.display = 'block';
  requestAnimationFrame(() => box.classList.add('show'));
}

function _svcTrkClearResult() {
  const box = document.getElementById('svcTrkResult');
  if (!box) return;
  box.classList.remove('show');
  box.style.display = 'none';
  box.innerHTML = '';
}

function _svcTrkGetHistory() {
  try { return JSON.parse(localStorage.getItem(_SVCTRK_HIST) || '[]'); } catch(e) { return []; }
}

function _svcTrkSaveHistory(data) {
  const h = _svcTrkGetHistory().filter(i => !(i.searchType === data.searchType && i.searchValue === data.searchValue));
  h.unshift({ searchType: data.searchType, searchValue: data.searchValue, status: data.status });
  localStorage.setItem(_SVCTRK_HIST, JSON.stringify(h.slice(0, 3)));
}

function _svcTrkUpdateHistory() {
  const box  = document.getElementById('svcTrkHistory');
  const list = document.getElementById('svcTrkHistList');
  if (!box || !list) return;
  const h = _svcTrkGetHistory();
  if (!h.length) { box.style.display = 'none'; return; }
  list.innerHTML = h.map(item => {
    const label = item.searchType === 'order' ? 'Поръчка' : 'Гаранция';
    const sv    = _svcEsc(item.searchValue || '');
    const st    = _svcEsc(item.status || '');
    const type  = _svcEsc(item.searchType || '');
    return `<li style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;gap:6px;flex-wrap:wrap;">
      <span style="font-size:13px;">${label} → ${sv} - ${st}</span>
      <button type="button" class="svc-copy-btn" onclick="_svcTrkRepeat('${type}','${sv}')">Повтори</button>
    </li>`;
  }).join('');
  box.style.display = 'block';
}

function _svcTrkRepeat(type, value) {
  const inputOrder    = document.getElementById('svcTrkOrder');
  const inputWarranty = document.getElementById('svcTrkWarranty');
  if (!inputOrder) return;
  if (type === 'order') { inputOrder.value = value; inputWarranty.value = ''; _svcTrkSearch(value, ''); }
  else                  { inputOrder.value = ''; inputWarranty.value = value; _svcTrkSearch('', value); }
}

// ===== CAREERS PAGE =====
function openCareersPage() {
  const page = document.getElementById('careersPage');
  if (!page) return;
  _setPgBc('careersBc', 'Кариери', 'closeCareersPage');
  page.style.display = 'flex';
  page.style.flexDirection = 'column';
  requestAnimationFrame(() => page.classList.add('open'));
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Кариери - Most Computers', 'Работи с нас. Most Computers търси мотивирани хора за своя екип.');
  if (typeof bcOnPage === 'function') bcOnPage('Кариери');
  if (typeof renderCareersPage === 'function') renderCareersPage();
  try { history.pushState({ page: 'careers' }, '', '?page=careers'); } catch(e) {}
}
function closeCareersPage() {
  const page = document.getElementById('careersPage');
  if (!page) return;
  page.classList.remove('open');
  setTimeout(() => { page.style.display = 'none'; }, 300);
  document.body.style.overflow = '';
  if (typeof restorePageMeta === 'function') restorePageMeta();
  if (typeof bcSet === 'function') bcSet([]);
  try { history.pushState(null, '', window.location.pathname); } catch(e) {}
}

// ===== ABOUT PAGE =====
function openAboutPage() {
  const page = document.getElementById('aboutPage');
  if (!page) return;
  _setPgBc('aboutBc', 'За нас', 'closeAboutPage');
  page.style.display = 'flex';
  page.style.flexDirection = 'column';
  requestAnimationFrame(() => page.classList.add('open'));
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('За нас - Most Computers', 'Most Computers - над 36 години опит в продажбата на компютри и електроника. Специализиран магазин в центъра на София.');
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
// directly in main.js - no DOMContentLoaded wrapper needed here
// (deferred scripts run before DOMContentLoaded, so the handler
//  would cause a redundant second render on every page load).

if (typeof module !== 'undefined') module.exports = {
  openWarrantyPage, closeWarrantyPage,
  openDeliveryPage, closeDeliveryPage,
  openServicePage,  closeServicePage,
  openContactsPage, closeContactsPage,
  openBlogPage,     closeBlogPage,
};
