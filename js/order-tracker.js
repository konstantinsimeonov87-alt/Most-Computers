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


