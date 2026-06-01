'use strict';
const fs = require('fs');
const path = require('path');

const FILTERS = path.join(__dirname, '../js/filters.js');
let s = fs.readFileSync(FILTERS, 'utf8');

const oldFn = /function renderNewGrid\(days\)\s*\{[\s\S]*?^}/m;

const newFn = `function renderNewGrid(days, page) {
  page = page || 1;
  var PER = 10;
  var cutoff = new Date(Date.now() - days * 86400000);
  var all = [...products]
    .filter(function(p) { return p.stock !== false && p.added && new Date(p.added) >= cutoff; })
    .sort(function(a, b) { return new Date(b.added) - new Date(a.added); });
  var total = Math.max(1, Math.ceil(all.length / PER));
  page = Math.min(page, total);
  var prods = all.slice((page - 1) * PER, page * PER);
  var ng = document.getElementById('newGrid');
  if (ng) {
    ng.className = 'products-row cols5';
    ng.innerHTML = prods.map(function(p) { return makeCard(p, true); }).join('');
  }
  var pager = document.getElementById('newGridPager');
  if (!pager) return;
  if (total <= 1) { pager.innerHTML = ''; return; }
  var d = days;
  function pgBtn(p, lbl, dis, act) {
    return '<button class="ng-pg-btn' + (act ? ' ng-pg-active' : '') + '" ' +
      (dis ? 'disabled' : '') + ' onclick="renderNewGrid(' + d + ',' + p + ')">' + lbl + '</button>';
  }
  var nums = '';
  if (total <= 7) {
    for (var i = 1; i <= total; i++) nums += pgBtn(i, i, false, i === page);
  } else {
    nums += pgBtn(1, 1, false, page === 1);
    if (page > 3) nums += '<span class="ng-pg-ellipsis">…</span>';
    for (var j = Math.max(2, page - 1); j <= Math.min(total - 1, page + 1); j++) nums += pgBtn(j, j, false, j === page);
    if (page < total - 2) nums += '<span class="ng-pg-ellipsis">…</span>';
    nums += pgBtn(total, total, false, page === total);
  }
  pager.innerHTML = '<div class="ng-pager">' +
    pgBtn(page - 1, '‹', page <= 1, false) + nums + pgBtn(page + 1, '›', page >= total, false) +
    '</div>';
}`;

const match = s.match(oldFn);
if (!match) {
  console.error('Pattern not found! Showing context:');
  const idx = s.indexOf('function renderNewGrid');
  console.log(s.slice(idx, idx + 400));
  process.exit(1);
}

console.log('Found old function, length:', match[0].length);
s = s.replace(oldFn, newFn);

console.log('Has newGridPager:', s.includes('newGridPager'));
console.log('Has slice(0,10) after replace:', s.includes('.slice(0, 10)'));

fs.writeFileSync(FILTERS, s, 'utf8');

// Verify from disk
const verify = fs.readFileSync(FILTERS, 'utf8');
const idx = verify.indexOf('function renderNewGrid');
console.log('\nOn disk after write:');
console.log(verify.slice(idx, idx + 150));
