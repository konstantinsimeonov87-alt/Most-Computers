// ===== BLOG / SERVICE / DELIVERY PAGES =====
const blogPosts = [
  {
    slug: 'macbook-pro-m4-pro-review',
    emoji: '💻', cat: 'Ревю', title: 'MacBook Pro M4 Pro — Worth It?',
    date: '07 Март 2026', dateISO: '2026-03-07', read: '5 мин', author: 'Most Computers',
    summary: 'Тествахме новия MacBook Pro M4 Pro в реални условия — видео монтаж, код и gaming. Ето резултатите.',
    metaDesc: 'MacBook Pro M4 Pro ревю — производителност, батерия, дисплей. Струва ли си цената? Тест в реални условия от Most Computers.',
    tags: ['MacBook', 'Apple', 'лаптопи', 'ревю'],
    body: `<h2>Дизайн и конструкция</h2>
<p>MacBook Pro M4 Pro запазва емблематичния алуминиев корпус в Space Black. При 14-инчовия модел тежи 1.55 кг — незначително повече от M3, но усещането за качество е на ниво. Notch-ът е намален с 20% спрямо предишното поколение.</p>
<h2>Производителност — M4 Pro чип</h2>
<p>12-ядреният CPU на M4 Pro е около <strong>22% по-бърз</strong> от M3 Pro при многоядрени задачи. Рендерирането на 4K проект в Final Cut Pro, което на M3 Pro отнемаше 8 минути, при M4 Pro приключва за 6:20. Компилацията на голям Swift проект се ускорява с ~18%.</p>
<p>При gaming чрез Game Mode и Rosetta 2 постиженията са изненадващи — Baldur's Gate 3 тече стабилно на средни настройки при 1080p, около 55-60 fps.</p>
<h2>Дисплей и батерия</h2>
<p>Liquid Retina XDR панелът с 1000 нита за SDR и 1600 нита за HDR остава еталон. ProMotion адаптивно управлява честотата между 24 и 120 Hz. При смесено натоварване (код, видео конференции, Safari) изкарахме <strong>16-17 часа</strong> от зареждане до зареждане — резултат, недостижим за Windows алтернативите.</p>
<h2>Струва ли си надстройката от M3 Pro?</h2>
<p>Ако работиш с M3 Pro Mac — не бързай. Подобрението е реално, но не революционно. Ако обаче идваш от Intel Mac или M1, разликата е <em>огромна</em>. M4 Pro е най-балансираният MacBook Pro засега.</p>
<p><strong>Оценка: 9.2 / 10</strong></p>`
  },
  {
    slug: 'iphone-16-pro-max-vs-s25-ultra',
    emoji: '📱', cat: 'Сравнение', title: 'iPhone 16 Pro Max vs Samsung S25 Ultra',
    date: '03 Март 2026', dateISO: '2026-03-03', read: '7 мин', author: 'Most Computers',
    summary: 'Двата флагмана се срещат в директен дуел. Камера, дисплей, батерия — кой печели?',
    metaDesc: 'iPhone 16 Pro Max срещу Samsung Galaxy S25 Ultra — пълно сравнение на камера, дисплей, батерия и производителност.',
    tags: ['iPhone', 'Samsung', 'смартфони', 'сравнение'],
    body: `<h2>Дизайн</h2>
<p>iPhone 16 Pro Max е преминал към титаниева рамка с по-заоблени ъгли. S25 Ultra залага на плоски ръбове и вградена S Pen — уникален плюс за творческата работа. И двата са в premium сегмента, но Apple изглежда по-изтънчено.</p>
<h2>Дисплей</h2>
<p>S25 Ultra предлага 6.9" Dynamic AMOLED 2X с 2600 нита пик яркост и 1-120 Hz адаптивен ProMotion. iPhone 16 Pro Max разполага с 6.9" Super Retina XDR OLED с ProMotion. В пряка конкуренция Samsung печели по яркост при директна слънчева светлина, докато Apple превъзхожда при точност на цветопредаването.</p>
<h2>Камера</h2>
<p>iPhone 16 Pro Max разполага с 48 MP главна, 48 MP ултраширока и 5x оптичен зум. S25 Ultra предлага 200 MP главна с 50 MP телефото при 5x и 10x зум. При дневна светлина двете системи са практически равни. Нощното снимане леко предпочита Samsung заради агресивната обработка, докато Apple дава по-естествен резултат.</p>
<h2>Производителност</h2>
<p>A18 Pro (Apple) срещу Snapdragon 8 Elite (Samsung) — в ежедневна употреба разликата е невидима. При тежко натоварване (видео рендериране, ML задачи) Apple губи по-малко производителност при топлинно дросиране.</p>
<h2>Батерия</h2>
<p>S25 Ultra предлага 5000 mAh батерия с 45W зареждане. iPhone 16 Pro Max — 4685 mAh с 27W. При реална употреба Samsung дава около 1 час повече автономия, но Apple зарежда безжично по-бързо (MagSafe 25W).</p>
<h2>Заключение</h2>
<p>Ако ти трябва S Pen, максимален зум и Android — <strong>S25 Ultra</strong>. Ако искаш iOS екосистема, по-добро видео и по-плавен софтуер — <strong>iPhone 16 Pro Max</strong>.</p>`
  },
  {
    slug: 'top-5-bejichni-slushalki-2026',
    emoji: '🎧', cat: 'Топ 5', title: 'Най-добри безжични слушалки за 2026',
    date: '28 Февруари 2026', dateISO: '2026-02-28', read: '4 мин', author: 'Most Computers',
    summary: 'Sony, Bose, Apple — кои слушалки дават най-добро качество за парите си?',
    metaDesc: 'Топ 5 безжични слушалки за 2026 — Sony WH-1000XM6, Bose QC45, Apple AirPods Max. Коя да избереш?',
    tags: ['слушалки', 'Sony', 'Bose', 'Apple', 'топ 5'],
    body: `<h2>1. Sony WH-1000XM6 — Най-добро шумопотискане</h2>
<p>Sony продължава да доминира в сегмента на ANC слушалките. XM6 предлага 40 ч. автономия, Multipoint свързване с 2 устройства и подобрен процесор V2 за по-прецизно шумопотискане. Звукът е наситен и детайлен, особено при Hi-Res Wireless с LDAC кодек.</p>
<h2>2. Bose QuietComfort Ultra</h2>
<p>Bose е поставил акцент върху Immersive Audio — пространствен звук, който се адаптира спрямо движенията на главата. Ако пътуваш много и шумопотискането е приоритет, QC Ultra е равностоен конкурент на Sony.</p>
<h2>3. Apple AirPods Max (2025)</h2>
<p>С новия USB-C порт и актуализирани H2 чипове, AirPods Max вече имат смисъл за iOS потребителите. Интеграцията с Apple екосистемата е безупречна — автоматично превключване между iPhone, iPad и Mac за секунди.</p>
<h2>4. Jabra Evolve2 85 — За офиса</h2>
<p>Ако работиш в open space, Jabra предлага 8-микрофонен array за кристални обаждания, 37 ч. батерия и сертификация за Microsoft Teams. Звукът е малко по-неутрален от Sony, но за видеоконференции е идеален.</p>
<h2>5. Sennheiser Momentum 4</h2>
<p>Германска инженерия, 60 ч. батерия и естествен звук без прекомерна обработка. Momentum 4 е изборът на аудиофилите с бюджет под 350 €.</p>
<h2>Заключение</h2>
<p>За повечето хора — <strong>Sony WH-1000XM6</strong>. За Apple потребители — <strong>AirPods Max</strong>. За офис употреба — <strong>Jabra Evolve2 85</strong>.</p>`
  },
  {
    slug: 'kak-da-izberem-monitor-rabota-vkashti',
    emoji: '🖥', cat: 'Съвети', title: 'Как да изберем монитор за работа от вкъщи',
    date: '22 Февруари 2026', dateISO: '2026-02-22', read: '6 мин', author: 'Most Computers',
    summary: '4K или 1440p? IPS или OLED? Пълен наръчник за правилния избор.',
    metaDesc: 'Как да изберем монитор за работа от вкъщи — 4K, 1440p, IPS, OLED. Пълен наръчник 2026.',
    tags: ['монитори', 'работа от вкъщи', 'съвети', '4K'],
    body: `<h2>Резолюция: 1080p, 1440p или 4K?</h2>
<p>При 24-27" монитор <strong>1440p (2K)</strong> е оптималният баланс — достатъчно остра картина без прекомерно натоварване на GPU. 4K има смисъл при 32"+ или ако работиш с видео/снимки и имаш мощна графична карта.</p>
<h2>Матрица: IPS, VA или OLED?</h2>
<ul>
<li><strong>IPS</strong> — най-добри ъгли на видимост, точни цветове. Идеален за дизайн и фото работа.</li>
<li><strong>VA</strong> — по-висок контраст, по-добри черни. Добър за филми и кодиране.</li>
<li><strong>OLED</strong> — перфектни черни, изключителни цветове, но риск от burn-in при статично съдържание.</li>
</ul>
<h2>Честота на опресняване</h2>
<p>За офис работа 60-75 Hz е достатъчно. Ако пишеш код или четеш много — 120-144 Hz прави скролването значително по-плавно и намалява умората на очите.</p>
<h2>Размер и ергономия</h2>
<p>27" е стандартът за работа от вкъщи. Ако имаш пространство — помисли за ултраширок 34" (21:9), който заменя два отделни монитора. Стойка с регулиране на височина е задължителна за правилна поза.</p>
<h2>Препоръки по бюджет</h2>
<ul>
<li><strong>до 200 €</strong> — LG 27MN60T (IPS, 1080p, 75Hz)</li>
<li><strong>до 350 €</strong> — Dell U2722D (IPS, 1440p, USB-C 90W)</li>
<li><strong>до 600 €</strong> — LG 27UK850 (IPS, 4K, USB-C)</li>
<li><strong>без ограничение</strong> — ASUS ProArt PA329CRV (4K OLED, 144Hz)</li>
</ul>`
  },
  {
    slug: '10-nachina-udalzhim-bateriya',
    emoji: '🔋', cat: 'Съвети', title: '10 начина да удължим живота на батерията',
    date: '15 Февруари 2026', dateISO: '2026-02-15', read: '3 мин', author: 'Most Computers',
    summary: 'Простите навици, които могат да удвоят живота на батерията на твоя телефон или лаптоп.',
    metaDesc: '10 съвета за по-дълъг живот на батерията на смартфон и лаптоп. Практични навици от Most Computers.',
    tags: ['батерия', 'съвети', 'смартфон', 'лаптоп'],
    body: `<h2>За смартфони</h2>
<ol>
<li><strong>Оптимизирано зареждане</strong> — iPhone и Android имат функция, която ограничава зареждането до 80% за нощни зарядки. Включи я.</li>
<li><strong>Избягвай крайностите</strong> — не изтощавай батерията до 0% и не я дръж постоянно на 100%. Оптималният диапазон е 20-80%.</li>
<li><strong>Намали яркостта</strong> — дисплеят е най-големият консуматор. Автоматична яркост + тъмен режим могат да спестят до 30% от батерията.</li>
<li><strong>Ограничи Background App Refresh</strong> — приложенията, които се обновяват на заден план, изяждат батерия незабележимо.</li>
<li><strong>Изключи Location Services</strong> за приложения, които не го нуждаят.</li>
</ol>
<h2>За лаптопи</h2>
<ol start="6">
<li><strong>Батерийни режими</strong> — Windows има "Battery Saver", macOS има "Low Power Mode". Включи при работа без захранване.</li>
<li><strong>Охлаждане</strong> — батериите деградират по-бързо при висока температура. Не работи с лаптопа върху меки повърхности.</li>
<li><strong>Hibernation вместо Sleep</strong> при дълго неизползване пести значително повече батерия.</li>
<li><strong>RAM вместо HDD/SSD swap</strong> — ако лаптопът постоянно пише на диска, добави RAM.</li>
<li><strong>Калибрация</strong> — веднъж на 3 месеца напълно зареди до 100%, след което изтощи до ~5%. Помага за точното отчитане на заряда.</li>
</ol>
<p>При правилна грижа, литиево-йонна батерия може да запази над 80% от капацитета след 500 цикъла зареждане.</p>`
  },
  {
    slug: 'umen-dom-pod-500-leva',
    emoji: '🏠', cat: 'Smart Home', title: 'Как да изградим умен дом за под 500 лв.',
    date: '10 Февруари 2026', dateISO: '2026-02-10', read: '8 мин', author: 'Most Computers',
    summary: 'Philips Hue, смарт контакти, гласов асистент — пълна система без да се разоряваме.',
    metaDesc: 'Умен дом за под 500 лева — Philips Hue, Google Home, смарт контакти. Ръководство стъпка по стъпка.',
    tags: ['умен дом', 'Smart Home', 'Philips Hue', 'Google Home'],
    body: `<h2>Отправна точка: Гласов асистент</h2>
<p>Всичко започва с централен хъб. <strong>Google Nest Mini</strong> (около 50 лв.) или <strong>Amazon Echo Dot</strong> (около 45 лв.) са идеалните отправни точки. Веднъж инсталиран, асистентът управлява всички останали устройства с гласови команди.</p>
<h2>Интелигентно осветление (~150 лв.)</h2>
<p>Philips Hue Starter Kit с 3 крушки и хъб е класическият избор — стабилен Zigbee протокол, богата екосистема и страхотно приложение. Алтернативата е IKEA TRÅDFRI (по-евтино, малко по-ограничено). Смарт крушките с WiFi (SONOFF, Tapo) не изискват отделен хъб.</p>
<h2>Смарт контакти (~80 лв. за 2 бр.)</h2>
<p>Смарт контактите трансформират обикновени уреди в интелигентни. Стар вентилатор, кафемашина или лампа могат да се управляват от телефона или таймер. TP-Link Tapo P115 е любимецът — мери и консумацията на ток.</p>
<h2>Сигурност (~150 лв.)</h2>
<p>Смарт видеокамера (Tapo C200 — около 60 лв.) + смарт звънец (Reolink Video Doorbell — около 90 лв.) покриват основната домашна сигурност. И двата работят с Google Home и Alexa.</p>
<h2>Примерен бюджет</h2>
<ul>
<li>Google Nest Mini — 50 лв.</li>
<li>Philips Hue Starter Kit — 150 лв.</li>
<li>2x Tapo P115 смарт контакт — 80 лв.</li>
<li>Tapo C200 камера — 60 лв.</li>
<li>Reolink Doorbell — 90 лв.</li>
<li><strong>Общо: ~430 лв.</strong></li>
</ul>
<p>Ако разпределиш покупките за 2-3 месеца, усещането за „умен дом" идва постепенно — и е много по-достъпно, отколкото изглежда.</p>`
  },
];

const reviewPosts = [
  { emoji:'⭐', title:'Sony WH-1000XM6 — 9.4/10', sub:'Най-добрите ANC слушалки на пазара' },
  { emoji:'⭐', title:'ASUS ROG Zephyrus G16 — 9.1/10', sub:'Мощ и стил в тънко тяло' },
  { emoji:'⭐', title:'Samsung S95C OLED — 9.6/10', sub:'Безкомпромисен телевизор' },
  { emoji:'⭐', title:'iPad Pro M4 — 8.8/10', sub:'Лаптоп в тялото на таблет' },
];

function openBlogPage() {
  const listView = document.getElementById('blogListView');
  const postView = document.getElementById('blogPostView');
  if (listView) listView.style.display = '';
  if (postView) postView.style.display = 'none';
  const titleEl = document.getElementById('blogPageTitle');
  if (titleEl) titleEl.textContent = '📰 Блог и новини';
  _renderBlogGrid();
  document.getElementById('blogPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Блог — Most Computers', 'Ревюта, сравнения и съвети за компютри, лаптопи и електроника от екипа на Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('Блог');
  try { history.pushState({ page: 'blog' }, '', '?page=blog'); } catch(e) {}
}
function _renderBlogGrid() {
  const grid = document.getElementById('blogGrid');
  if (grid) grid.innerHTML = blogPosts.map(p => `
    <div style="background:var(--white);border-radius:14px;border:1px solid var(--border);overflow:hidden;cursor:pointer;transition:all .22s;box-shadow:var(--shadow-card);"
         onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--shadow-hover)'"
         onmouseout="this.style.transform='';this.style.boxShadow='var(--shadow-card)'"
         onclick="openBlogPost('${p.slug}')">
      <div style="background:linear-gradient(135deg,var(--primary-light),var(--bg2));height:120px;display:flex;align-items:center;justify-content:center;font-size:52px;">${p.emoji}</div>
      <div style="padding:16px 18px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="background:var(--primary-light);color:var(--primary);font-size:10px;font-weight:800;padding:2px 8px;border-radius:10px;letter-spacing:.05em;">${escHtml(p.cat)}</span>
          <span class="text-11-muted">${escHtml(p.date)}</span>
          <span style="font-size:11px;color:var(--muted);margin-left:auto;">📖 ${escHtml(p.read)}</span>
        </div>
        <div style="font-size:15px;font-weight:800;margin-bottom:8px;line-height:1.3;">${escHtml(p.title)}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.6;">${escHtml(p.summary)}</div>
        <div style="margin-top:12px;font-size:12px;color:var(--primary);font-weight:700;">Прочети повече →</div>
      </div>
    </div>`).join('');
  const rGrid = document.getElementById('reviewsGrid');
  if (rGrid) rGrid.innerHTML = reviewPosts.map(r => `
    <div class="megamenu-cat-card" style="flex-direction:row;text-align:left;gap:14px;cursor:default;">
      <div style="font-size:28px;">${r.emoji}</div>
      <div><div style="font-size:13px;font-weight:800;">${escHtml(r.title)}</div><div style="font-size:11px;color:var(--muted);margin-top:3px;">${escHtml(r.sub)}</div></div>
    </div>`).join('');
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
  article.innerHTML = `
    <header class="blog-article-header">
      <div class="blog-article-meta">
        <span class="blog-article-cat">${escHtml(post.cat)}</span>
        <time datetime="${post.dateISO}" class="blog-article-date">${escHtml(post.date)}</time>
        <span class="blog-article-read">📖 ${escHtml(post.read)}</span>
      </div>
      <h1 class="blog-article-title">${escHtml(post.title)}</h1>
      <p class="blog-article-summary">${escHtml(post.summary)}</p>
      <div class="blog-article-author">✍️ ${escHtml(post.author)}</div>
    </header>
    <div class="blog-article-body">${post.body}</div>
    <footer class="blog-article-footer">
      <div class="blog-article-tags">${post.tags.map(t => `<span class="blog-tag">${escHtml(t)}</span>`).join('')}</div>
    </footer>`;
  // SEO meta
  if (typeof setPageMeta === 'function') setPageMeta(post.title + ' — Most Computers', post.metaDesc);
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
  if (typeof setPageMeta === 'function') setPageMeta('Блог — Most Computers', 'Ревюта, сравнения и съвети за компютри, лаптопи и електроника от екипа на Most Computers.');
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'website');
  try { history.pushState({ page: 'blog' }, '', '?page=blog'); } catch(e) {}
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
let _svcMap = null;
function openServicePage() {
  document.getElementById('servicePage').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof setPageMeta === 'function') setPageMeta('Сервизен център — Most Computers', 'Сертифициран сервиз за лаптопи, компютри и електроника. Диагностика, ремонт и гаранционно обслужване в Most Computers.');
  if (typeof bcOnPage === 'function') bcOnPage('Сервизен център');
  try { history.pushState({ page: 'service' }, '', '?page=service'); } catch(e) {}
  _svcTrkInit();
  _svcMapInit();
}
function _svcMapInit() {
  if (!window.L) return;
  const el = document.getElementById('svcLeafletMap');
  if (!el) return;
  if (_svcMap) { setTimeout(() => _svcMap.invalidateSize(), 200); return; }
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
    .bindPopup('<strong>Most Computers</strong><br>бул. Шипченски проход 240');
  setTimeout(() => _svcMap.invalidateSize(), 200);
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
let _contactsMap = null;
function openContactsPage() {
  document.getElementById('contactsPage').classList.add('open');
  document.body.style.overflow = 'hidden';
  checkOpenNow();
  try{history.pushState({page:'contacts'}, '', '?page=contacts');}catch(e){}
  _contactsMapInit();
}
function _contactsMapInit() {
  if (!window.L) return;
  const el = document.getElementById('contactsLeafletMap');
  if (!el) return;
  if (_contactsMap) { setTimeout(() => _contactsMap.invalidateSize(), 200); return; }
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
    .bindPopup('<strong>Most Computers</strong><br>бул. Шипченски проход 240');
  setTimeout(() => _contactsMap.invalidateSize(), 200);
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
  // Mon-Fri 09:30-18:15
  if (day >= 1 && day <= 5 && time >= 570 && time < 1095) isOpen = true;
  // Sat-Sun: closed

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
        step:'Изчаква резервни части', location:'Сервизен център — София', searchType, searchValue };
      _svcTrkShowResult(demo, false);
      localStorage.setItem(_SVCTRK_LAST, JSON.stringify(demo));
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
    <div class="svc-result-row"><span class="svc-result-label">Последна актуализация:</span> ${_svcEsc(data.updatedAt || '—')}</div>
    <div class="svc-result-row"><span class="svc-result-label">Етап:</span> ${_svcEsc(data.step || '—')}</div>
    <div class="svc-result-row"><span class="svc-result-label">Локация:</span> ${_svcEsc(data.location || '—')}</div>
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
      <span style="font-size:13px;">${label} → ${sv} — ${st}</span>
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
