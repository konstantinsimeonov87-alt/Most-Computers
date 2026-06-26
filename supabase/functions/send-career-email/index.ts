const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const RESEND_KEY = Deno.env.get('RESEND_API_KEY');
    const HR_EMAIL   = Deno.env.get('HR_EMAIL') || 'konstantinsimeonov87@gmail.com';

    if (!RESEND_KEY) {
      return new Response(JSON.stringify({ error: 'Missing RESEND_API_KEY' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { job_title, applicant_name, applicant_email, applicant_phone, cover_letter, cv_url } = body;

    const hrHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#bd1105;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">Most Computers — Нова кандидатура</h1>
        </div>
        <div style="padding:28px 24px;background:#fff">
          <h2 style="color:#1a1a1a;margin-top:0">👤 ${applicant_name}</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr>
              <td style="padding:7px 0;color:#555;width:130px"><strong>Позиция:</strong></td>
              <td style="padding:7px 0;color:#bd1105;font-weight:700">${job_title || '-'}</td>
            </tr>
            <tr>
              <td style="padding:7px 0;color:#555"><strong>Имейл:</strong></td>
              <td style="padding:7px 0"><a href="mailto:${applicant_email}" style="color:#bd1105">${applicant_email}</a></td>
            </tr>
            ${applicant_phone ? `<tr>
              <td style="padding:7px 0;color:#555"><strong>Телефон:</strong></td>
              <td style="padding:7px 0">${applicant_phone}</td>
            </tr>` : ''}
          </table>
          ${cover_letter ? `
          <div style="background:#f8f9fa;border-left:3px solid #bd1105;padding:16px;border-radius:4px;margin-bottom:20px">
            <strong style="display:block;margin-bottom:8px;color:#555">Мотивационно писмо:</strong>
            <p style="margin:0;color:#333;white-space:pre-line">${cover_letter}</p>
          </div>` : ''}
          ${cv_url ? `
          <div style="margin-top:20px">
            <a href="${cv_url}" style="display:inline-block;background:#bd1105;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">
              📄 Изтегли CV
            </a>
          </div>` : ''}
        </div>
        <div style="background:#1a1a1a;padding:16px;text-align:center">
          <p style="color:#999;margin:0;font-size:12px">Most Computers · Кариери · ${new Date().toLocaleDateString('bg-BG')}</p>
        </div>
      </div>`;

    const confirmHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#bd1105;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:22px">Most Computers</h1>
        </div>
        <div style="padding:28px 24px;background:#fff">
          <h2 style="color:#1a1a1a">Здравей, ${applicant_name}!</h2>
          <p style="color:#555;line-height:1.6">
            Получихме кандидатурата ти за позицията <strong>${job_title || 'в Most Computers'}</strong>.
          </p>
          <p style="color:#555;line-height:1.6">
            Ще разгледаме CV-то ти и ще се свържем с теб в рамките на <strong>5 работни дни</strong>.
          </p>
          <p style="color:#555;line-height:1.6;margin-top:24px">
            Благодарим за интереса към нашия екип!
          </p>
        </div>
        <div style="background:#1a1a1a;padding:16px;text-align:center">
          <p style="color:#999;margin:0;font-size:13px">Most Computers · бул. „Шипченски проход" бл.240, София · +359 2 919 1823</p>
        </div>
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

    await send(HR_EMAIL, `👤 Нова кандидатура: ${applicant_name} — ${job_title || 'Most Computers'}`, hrHtml);
    await send(applicant_email, `Потвърждение: Кандидатура за ${job_title || 'Most Computers'}`, confirmHtml);

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
