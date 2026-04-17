// ===== SUPABASE CLIENT =====
// Връзка с базата данни

const SUPABASE_URL = 'https://zdwzccucqfvlsgxlspby.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpkd3pjY3VjcWZ2bHNneGxzcGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMzY0MjQsImV4cCI6MjA5MTkxMjQyNH0.tTDSpQFBx1sY1iXsQIRYO0GfoheJsiulk--vxAe7rFg';

// Guard: зарежда се само ако CDN библиотеката е налична
if (typeof window.supabase !== 'undefined') {
  try {
    const { createClient } = window.supabase;
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });

    // Записва поръчка в Supabase
    window.saveOrderToSupabase = async function saveOrderToSupabase(orderData) {
      try {
        const { error } = await sb.from('orders').insert([{
          order_num:        orderData.num,
          customer_name:    orderData.customer,
          customer_email:   orderData.email,
          customer_phone:   orderData.phone,
          delivery_type:    orderData.deliveryType,
          delivery_address: orderData.addr,
          payment_type:     orderData.payment,
          items:            orderData.itemsData,
          subtotal:         orderData.subtotal,
          delivery_cost:    orderData.delivery,
          total:            orderData.total,
          promo_discount:   orderData.promoDiscount || 0,
          note:             orderData.note || '',
          status:           'pending'
        }]);

        if (error) {
          console.error('Supabase грешка:', error.message);
          return false;
        }
        console.log('✅ Поръчка записана в Supabase:', orderData.num);

        // Изпрати имейл потвърждения
        sb.functions.invoke('send-order-email', { body: orderData })
          .catch(e => console.error('Email грешка:', e));

        return true;
      } catch (e) {
        console.error('Грешка при запис на поръчка:', e);
        return false;
      }
    };

    console.log('✅ Supabase клиент инициализиран');
  } catch (e) {
    console.warn('Supabase инициализация неуспешна:', e.message);
  }
} else {
  console.warn('Supabase CDN библиотеката не е заредена — поръчките се записват само в localStorage');
}
