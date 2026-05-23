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
// Wheel zoom — stored so closeProductPage can remove it
var _pdpWheelHandler = function(e) {
  var lb = document.getElementById('pdpLightbox');
  if (!lb || lb.style.display === 'none') return;
  e.preventDefault();
  var lbImg = document.getElementById('pdpLbImg');
  var cur = parseFloat(lbImg.style.getPropertyValue('--lb-scale') || '1');
  var next = Math.min(4, Math.max(1, cur - e.deltaY * 0.003));
  lbImg.style.setProperty('--lb-scale', next);
};
document.addEventListener('wheel', _pdpWheelHandler, { passive: false });

// Scroll-to-top button visibility + action
function pdpGoToTop() {
  var b = document.getElementById('pdpBackdrop');
  if (!b) return;
  b.scrollTop = 0;
}
var _pdpBackdropScrollHandler = null;
(function() {
  var backdrop = document.getElementById('pdpBackdrop');
  if (!backdrop) return;
  _pdpBackdropScrollHandler = function() {
    var btn = document.getElementById('pdpScrollTop');
    if (!btn) return;
    var show = backdrop.scrollTop > 400;
    btn.style.display = show ? '' : 'none';
  };
  backdrop.addEventListener('scroll', _pdpBackdropScrollHandler, { passive: true });
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

// ── Bulgarian public holiday helpers ──
var _bgHolCache = null;
function _dk(d) {
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function _bgHolidays(year) {
  if (_bgHolCache && _bgHolCache.y === year) return _bgHolCache.h;
  var h = new Set();
  function add(y, m, d) {
    var dt = new Date(y, m-1, d), dow = dt.getDay();
    h.add(_dk(dt));
    // Substitute working day when holiday falls on weekend
    if (dow === 0) h.add(_dk(new Date(y, m-1, d+1)));      // Sunday → Monday
    else if (dow === 6) h.add(_dk(new Date(y, m-1, d+2))); // Saturday → Monday
  }
  // Fixed Bulgarian public holidays (Labour Code art.154)
  add(year,1,1);  add(year,3,3);  add(year,5,1);  add(year,5,6);
  add(year,5,24); add(year,9,6);  add(year,9,22); add(year,12,25); add(year,12,26);
  // Orthodox Easter: Julian calendar algorithm → Gregorian (+13 days, valid through 2099)
  var c=year%19, a=year%4, b=year%7;
  var dv=(19*c+15)%30, ev=(2*a+4*b-dv+34)%7, fv=dv+ev+114;
  var easter = new Date(year, Math.floor(fv/31)-1, fv%31+1);
  easter.setDate(easter.getDate()+13);
  var gf = new Date(easter); gf.setDate(gf.getDate()-2); // Велики петък
  var em = new Date(easter); em.setDate(em.getDate()+1);  // Великденски понеделник
  h.add(_dk(gf)); h.add(_dk(easter)); h.add(_dk(em));
  _bgHolCache = { y: year, h: h };
  return h;
}
function _isWorkday(d) {
  var dow = d.getDay();
  return dow !== 0 && dow !== 6 && !_bgHolidays(d.getFullYear()).has(_dk(d));
}
function _nextWorkday(from) {
  var d = new Date(from);
  d.setDate(d.getDate()+1);
  while (!_isWorkday(d)) d.setDate(d.getDate()+1);
  return d;
}
function _delivLabel(now, del) {
  var tom = new Date(now); tom.setDate(tom.getDate()+1);
  if (_dk(del) === _dk(tom)) return 'утре';
  return 'в ' + ['неделя','понеделник','вторник','сряда','четвъртък','петък','събота'][del.getDay()];
}

// 1. DELIVERY TIMER
function pdpInitDeliveryTimer() {
  var el = document.getElementById('pdpDeliveryMsg');
  var cd = document.getElementById('pdpDeliveryCd');
  if (!el) return;
  clearInterval(pdpInitDeliveryTimer._iv);

  function update() {
    var now = new Date();
    var cutoffSec = 16*3600 + 30*60;
    var nowSec = now.getHours()*3600 + now.getMinutes()*60 + now.getSeconds();
    if (_isWorkday(now) && nowSec < cutoffSec) {
      // Dispatch today → deliver next workday (skips holidays + weekends)
      var del = _nextWorkday(now);
      var secLeft = cutoffSec - nowSec;
      var hh = Math.floor(secLeft/3600);
      var mm = String(Math.floor((secLeft%3600)/60)).padStart(2,'0');
      var ss = String(secLeft%60).padStart(2,'0');
      el.innerHTML = 'Поръчай до <strong>16:30 ч.</strong> и получи <strong>' + _delivLabel(now, del) + '</strong>';
      if (cd) cd.textContent = '(остават ' + hh + ':' + mm + ':' + ss + ')';
    } else {
      // Weekend / holiday / after cutoff → dispatch next workday, deliver workday after that
      var send = _nextWorkday(now);
      var del2 = _nextWorkday(send);
      el.innerHTML = 'Изпращаме <strong>' + _delivLabel(now, send) + '</strong> — получаваш <strong>' + _delivLabel(now, del2) + '</strong>';
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
    const i = Math.min(4, Math.max(0, Math.round(r.stars) - 1));
    counts[i]++;
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
      // Double rAF restarts the animation without a forced synchronous reflow
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          wrap.classList.add('swipe-bounce');
          setTimeout(function(){ wrap.classList.remove('swipe-bounce'); }, 320);
        });
      });
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
  // A: prefer same subcat first, fallback to same cat
  var related = p.subcat
    ? all.filter(function(x) { return x.id !== p.id && x.subcat === p.subcat; })
    : [];
  if (related.length < 4)
    related = all.filter(function(x) { return x.id !== p.id && x.cat === p.cat; });
  related = related.sort(function() { return Math.random() - 0.5; }).slice(0, 14);
  if (related.length < 2) { section.style.display = 'none'; return; }
  if (title) {
    var catLabel = (typeof CAT_LABELS !== 'undefined' && CAT_LABELS[p.cat]) ? CAT_LABELS[p.cat] : '';
    title.textContent = catLabel ? ('Подобни — ' + catLabel) : 'Подобни продукти';
  }
  scroll.innerHTML = related.map(_pdpCarCard).join('');
  section.style.display = '';
}

// 8. CROSS-SELL WIDGET (right column, below CTA)
var _CROSS_SELL = {
  printers:    ['consumables','accessories'],
  printer:     ['consumables','accessories'],
  laptops:     ['accessories','peripherals'],
  phones:      ['accessories'],
  desktops:    ['peripherals','accessories'],
  monitors:    ['accessories','peripherals'],
  tablets:     ['accessories'],
  cameras:     ['accessories'],
  accessories: [],
  peripherals: []
};

function pdpRenderRecsWidget(p) {
  var widget = document.getElementById('pdpRecsWidget');
  if (!widget) return;
  var all = (typeof products !== 'undefined') ? products : [];
  var inCart = new Set((typeof cart !== 'undefined' ? cart : []).map(function(x) { return x.id; }));
  var cats = _CROSS_SELL[p.cat] || [];
  var recs = [];

  // 1. Same category, different subcat (accessories for this type)
  if (p.subcat) {
    recs = all.filter(function(x) {
      return x.id !== p.id && !inCart.has(x.id) && x.cat === p.cat && x.subcat !== p.subcat;
    });
  }

  // 2. Related accessory categories
  if (recs.length < 3 && cats.length) {
    var extra = all.filter(function(x) {
      return x.id !== p.id && !inCart.has(x.id) && cats.indexOf(x.cat) !== -1;
    }).sort(function(a,b) { return (b.rv||0) - (a.rv||0); });
    recs = recs.concat(extra);
  }

  // 3. Fallback: bestsellers from same category
  if (recs.length < 3) {
    var fb = all.filter(function(x) {
      return x.id !== p.id && !inCart.has(x.id) && x.cat === p.cat;
    }).sort(function(a,b) { return (b.rv||0) - (a.rv||0); });
    recs = recs.concat(fb);
  }

  // Deduplicate + take 3
  var seen = new Set();
  recs = recs.filter(function(x) { if (seen.has(x.id)) return false; seen.add(x.id); return true; }).slice(0, 3);

  if (!recs.length) { widget.style.display = 'none'; return; }

  var _e = escHtml;
  var _thumb = function(r) {
    if (r.img) return '<img src="' + _e(r.img) + '" alt="" width="40" height="40" style="width:40px;height:40px;object-fit:contain;border-radius:6px;" loading="lazy" onerror="this.style.display=\'none\'">';
    return '<span style="font-size:22px;line-height:1;">' + _e(r.emoji||'') + '</span>';
  };

  widget.innerHTML =
    '<div class="pdp-rw-hdr"><span class="pdp-rw-flash">⚡</span>Може да те заинтересува</div>' +
    recs.map(function(r) {
      return '<div class="pdp-rw-row" onclick="openProductPage(' + r.id + ')" tabindex="0" role="button" aria-label="' + _e(r.name) + '">' +
        '<div class="pdp-rw-thumb">' + _thumb(r) + '</div>' +
        '<div class="pdp-rw-info">' +
          '<div class="pdp-rw-name">' + _e(r.name.length > 42 ? r.name.substring(0,42)+'…' : r.name) + '</div>' +
          '<div class="pdp-rw-price">' + (typeof fmtEur === 'function' ? fmtEur(r.price) : r.price + ' €') + '</div>' +
        '</div>' +
        '<button type="button" class="pdp-rw-add" onclick="event.stopPropagation();addToCart(' + r.id + ');this.textContent=\'✓\';this.classList.add(\'added\');setTimeout(function(){this.textContent=\'+\';this.classList.remove(\'added\');}.bind(this),1400);" aria-label="Добави ' + _e(r.name) + ' в кошница">+</button>' +
      '</div>';
    }).join('') +
    '<div class="pdp-rw-foot">Добавяни заедно с подобни продукти</div>';

  widget.style.display = '';
}

// 9. RECENTLY VIEWED CAROUSEL IN PDP
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
  var _e = escHtml;
  var price = (typeof fmtEur === 'function') ? fmtEur(p.price) : (p.price + ' лв.');
  var thumb = p.img
    ? '<img class="pdp-car-img" src="' + _e(p.img) + '" alt="" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
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
    var _e = escHtml;
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

// ===== 10. COPY SPECS =====
function pdpCopySpecs() {
  var p = (typeof products !== 'undefined') ? products.find(function(x) { return x.id === pdpProductId; }) : null;
  if (!p) return;
  var specs = p.specs || {};
  var text = p.name + '\n\n' + Object.keys(specs).map(function(k) { return k + ': ' + specs[k]; }).join('\n');
  var btn = document.getElementById('pdpCopyBtn');
  if (!navigator.clipboard) { showToast && showToast('⚠️ Клипборд недостъпен'); return; }
  navigator.clipboard.writeText(text).then(function() {
    if (btn) { btn.textContent = '✓ Копирано'; btn.classList.add('pdp-copy-done'); }
    if (typeof showToast === 'function') showToast('✓ Характеристиките са копирани!');
    setTimeout(function() {
      if (btn) { btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Копирай'; btn.classList.remove('pdp-copy-done'); }
    }, 2000);
  }).catch(function() { if (typeof showToast === 'function') showToast('⚠️ Грешка при копиране'); });
}

// ===== 11. PRINT / PDF =====
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
    var _e = escHtml;
    thumbEl.innerHTML = p.img
      ? '<img src="' + _e(p.img) + '" style="width:44px;height:44px;object-fit:contain;border-radius:6px;">'
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
  var _pdpScrollTicking = false;
  backdrop.addEventListener('scroll', function() {
    if (window.innerWidth > 768) return;
    if (_pdpScrollTicking) return;
    _pdpScrollTicking = true;
    requestAnimationFrame(function() {
      var addBtn = document.getElementById('pdpAddBtn');
      if (addBtn) {
        var rect = addBtn.getBoundingClientRect();
        var outOfView = rect.bottom < 0 || rect.top > window.innerHeight;
        var sheet = document.getElementById('pdpBottomSheet');
        if (sheet) {
          if (outOfView && !sheet.classList.contains('open')) {
            var p = (typeof products !== 'undefined' && pdpProductId != null)
              ? products.find(function(x) { return x.id === pdpProductId; }) : null;
            if (p) pdpBsOpen(p);
          } else if (!outOfView && sheet.classList.contains('open')) {
            pdpBsClose();
          }
        }
      }
      _pdpScrollTicking = false;
    });
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

// ===== PRODUCT PREVIEW BOTTOM SHEET (mobile) =====
var _ppProductId = null;

function openProdPreview(id) {
  if (window.innerWidth > 768) { openProductPage(id); return; }
  var p = typeof products !== 'undefined' ? products.find(function(x) { return x.id === id; }) : null;
  if (!p) { openProductPage(id); return; }
  _ppProductId = id;

  var imgEl = document.getElementById('ppImg');
  var brandEl = document.getElementById('ppBrand');
  var nameEl = document.getElementById('ppName');
  var ratingEl = document.getElementById('ppRating');
  var priceEl = document.getElementById('ppPrice');

  var _e = escHtml;
  if (imgEl) imgEl.innerHTML = p.img
    ? '<img src="' + _e(p.img) + '" style="width:72px;height:72px;object-fit:contain;border-radius:10px;">'
    : '<span style="font-size:44px;">' + (p.emoji || '📦') + '</span>';
  if (brandEl) brandEl.textContent = p.brand || '';
  if (nameEl) nameEl.textContent = p.name;
  if (ratingEl) {
    var stars = Math.round(p.rating || 0);
    ratingEl.innerHTML = '★'.repeat(stars) + '☆'.repeat(5 - stars) + ' <span style="color:var(--muted);font-size:11px;">(' + (p.reviews ? p.reviews.length : p.rv || 0) + ')</span>';
  }
  if (priceEl) priceEl.innerHTML = typeof fmtEur === 'function' ? '<strong>' + fmtEur(p.price) + '</strong>' : '<strong>' + p.price + ' €</strong>';

  var addBtn = document.getElementById('ppAddBtn');
  if (addBtn) {
    addBtn.onclick = function() {
      if (typeof addToCart === 'function') addToCart(_ppProductId);
      closeProdPreview();
    };
    addBtn.textContent = p.stock === false ? '✕ Изчерпан' : '🛒 Добави в кошница';
    addBtn.disabled = p.stock === false;
  }
  var detBtn = document.getElementById('ppDetailsBtn');
  if (detBtn) detBtn.onclick = function() { closeProdPreview(); openProductPage(_ppProductId); };

  var sheet = document.getElementById('prodPreviewSheet');
  var backdrop = document.getElementById('prodPreviewBackdrop');
  if (sheet) sheet.classList.add('open');
  if (backdrop) backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Swipe down to close — use named handlers so old ones are replaced on re-open
  if (sheet._swipeStart) sheet.removeEventListener('touchstart', sheet._swipeStart);
  if (sheet._swipeEnd)   sheet.removeEventListener('touchend',   sheet._swipeEnd);
  var startY = 0;
  sheet._swipeStart = function(e) { startY = e.touches[0].clientY; };
  sheet._swipeEnd   = function(e) { if (e.changedTouches[0].clientY - startY > 70) closeProdPreview(); };
  sheet.addEventListener('touchstart', sheet._swipeStart, { passive: true });
  sheet.addEventListener('touchend',   sheet._swipeEnd,   { passive: true });
}

function closeProdPreview() {
  var sheet = document.getElementById('prodPreviewSheet');
  var backdrop = document.getElementById('prodPreviewBackdrop');
  if (sheet) sheet.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}
