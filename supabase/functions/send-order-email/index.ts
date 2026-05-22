const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const order = await req.json();
    const RESEND_KEY = Deno.env.get('RESEND_API_KEY');

    if (!RESEND_KEY) {
      return new Response(JSON.stringify({ error: 'Missing RESEND_API_KEY' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const paymentLabel =
      order.payment === 'cod'  ? 'Наложен платеж' :
      order.payment === 'bank' ? 'Банков превод'   : 'Карта';

    const itemsRows = (order.itemsData || [])
      .map((x: any) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee">${x.emoji || ''} ${x.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center">${x.qty}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right">${(x.price * x.qty).toFixed(2)} лв.</td>
        </tr>`)
      .join('');

    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#bd1105;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Most Computers</h1>
        </div>
        <div style="padding:32px 24px;background:#fff">
          <h2 style="color:#1a1a1a">Благодарим за поръчката, ${order.customer}!</h2>
          <p style="color:#555">Поръчка номер: <strong style="color:#bd1105">${order.num}</strong></p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0">
            <thead>
              <tr style="background:#f8f9fa">
                <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #eee">Продукт</th>
                <th style="padding:10px 12px;text-align:center;border-bottom:2px solid #eee">Брой</th>
                <th style="padding:10px 12px;text-align:right;border-bottom:2px solid #eee">Сума</th>
              </tr>
            </thead>
            <tbody>${itemsRows}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding:12px;text-align:right;font-weight:bold">Обща сума:</td>
                <td style="padding:12px;text-align:right;font-weight:bold;color:#bd1105;font-size:18px">${Number(order.total).toFixed(2)} лв.</td>
              </tr>
            </tfoot>
          </table>
          <table style="width:100%;border-collapse:collapse;background:#f8f9fa;border-radius:8px;padding:16px">
            <tr><td style="padding:6px 16px;color:#555"><strong>Доставка:</strong></td><td style="padding:6px 16px">${order.deliveryType}</td></tr>
            <tr><td style="padding:6px 16px;color:#555"><strong>Плащане:</strong></td><td style="padding:6px 16px">${paymentLabel}</td></tr>
            <tr><td style="padding:6px 16px;color:#555"><strong>Адрес:</strong></td><td style="padding:6px 16px">${order.addr}</td></tr>
          </table>
          <p style="margin-top:24px;color:#555">Ще се свържем с вас скоро за потвърждение.</p>
        </div>
        <div style="background:#1a1a1a;padding:16px;text-align:center">
          <p style="color:#999;margin:0;font-size:13px">Most Computers · бул. „Шипченски проход" бл.240, София · +359 2 919 1823</p>
        </div>
      </div>`;

    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#bd1105">🛒 Нова поръчка: ${order.num}</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#555;width:140px"><strong>Клиент:</strong></td><td>${order.customer}</td></tr>
          <tr><td style="padding:6px 0;color:#555"><strong>Имейл:</strong></td><td>${order.email}</td></tr>
          <tr><td style="padding:6px 0;color:#555"><strong>Телефон:</strong></td><td>${order.phone}</td></tr>
          <tr><td style="padding:6px 0;color:#555"><strong>Адрес:</strong></td><td>${order.addr}</td></tr>
          <tr><td style="padding:6px 0;color:#555"><strong>Доставка:</strong></td><td>${order.deliveryType}</td></tr>
          <tr><td style="padding:6px 0;color:#555"><strong>Плащане:</strong></td><td>${paymentLabel}</td></tr>
          <tr><td style="padding:6px 0;color:#555"><strong>Сума:</strong></td><td><strong style="color:#bd1105;font-size:18px">${Number(order.total).toFixed(2)} лв.</strong></td></tr>
        </table>
        <h3 style="margin-top:24px">Продукти:</h3>
        <p>${order.items}</p>
        ${order.note ? `<p><strong>Бележка:</strong> ${order.note}</p>` : ''}
      </div>`;

    const send = async (to: string, subject: string, html: string) => {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Most Computers <onboarding@resend.dev>',
          to: [to],
          subject,
          html,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('Resend error:', err);
      }
      return res;
    };

    // Имейл до клиента
    await send(order.email, `Поръчка ${order.num} — потвърждение | Most Computers`, customerHtml);

    // Имейл до администратора
    await send('konstantinsimeonov87@gmail.com', `🛒 Нова поръчка ${order.num} — ${order.customer}`, adminHtml);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('Edge function error:', e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
