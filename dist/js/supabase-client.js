// ===== SUPABASE CLIENT =====

const SUPABASE_URL = 'https://zdwzccucqfvlsgxlspby.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpkd3pjY3VjcWZ2bHNneGxzcGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMzY0MjQsImV4cCI6MjA5MTkxMjQyNH0.tTDSpQFBx1sY1iXsQIRYO0GfoheJsiulk--vxAe7rFg';

if (typeof window.supabase !== 'undefined') {
  try {
    const { createClient } = window.supabase;
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession:    true,
        autoRefreshToken:  true,
        detectSessionInUrl: true,
      }
    });
    window._sb_client = sb;

    // ===== AUTH API =====
    // Exposed as window._sbAuth so auth.js can call without importing sb directly.
    window._sbAuth = {
      signIn: (email, pass) =>
        sb.auth.signInWithPassword({ email, password: pass }),

      signUp: (email, pass, meta) =>
        sb.auth.signUp({ email, password: pass, options: { data: meta } }),

      signOut: () => sb.auth.signOut(),

      resetPassword: (email) =>
        sb.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }),
    };

    // ===== AUTH STATE BRIDGE =====
    // auth.js defines window._onSupabaseSignIn / window._onSupabaseSignOut.
    // We call them here whenever Supabase fires an auth event.
    sb.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const u = session.user;
        const m = u.user_metadata || {};
        const user = {
          id:        u.id,
          email:     u.email,
          firstName: m.firstName || u.email.split('@')[0],
          lastName:  m.lastName  || '',
          phone:     m.phone     || '',
        };
        if (typeof window._onSupabaseSignIn === 'function') {
          window._onSupabaseSignIn(user);
        }
      }
      if (event === 'SIGNED_OUT') {
        if (typeof window._onSupabaseSignOut === 'function') {
          window._onSupabaseSignOut();
        }
      }
    });

    // Restore existing session on page load (fires after scripts are parsed).
    sb.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) return;
      const u = session.user;
      const m = u.user_metadata || {};
      const user = {
        id:        u.id,
        email:     u.email,
        firstName: m.firstName || u.email.split('@')[0],
        lastName:  m.lastName  || '',
        phone:     m.phone     || '',
      };
      // Delay one tick so auth.js has time to define _onSupabaseSignIn.
      const fire = () => {
        if (typeof window._onSupabaseSignIn === 'function') window._onSupabaseSignIn(user);
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fire, { once: true });
      } else {
        setTimeout(fire, 0);
      }
    }).catch(() => {});

    // ===== ORDERS =====
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
          status:           'pending',
        }]);
        if (error) { console.error('Supabase грешка:', error.message); return false; }
        sb.functions.invoke('send-order-email', { body: orderData })
          .catch(e => console.error('Email грешка:', e));
        return true;
      } catch(e) {
        console.error('Грешка при запис на поръчка:', e);
        return false;
      }
    };

    // ===== WISHLIST SYNC =====
    window.syncWishlistToSupabase = async function(email, ids) {
      if (!email || !ids) return;
      try {
        await sb.from('wishlists').upsert(
          { email, product_ids: ids, updated_at: new Date().toISOString() },
          { onConflict: 'email' }
        );
      } catch(e) {}
    };

    window.loadWishlistFromSupabase = async function(email) {
      if (!email) return null;
      try {
        const { data } = await sb.from('wishlists').select('product_ids').eq('email', email).single();
        return data?.product_ids || null;
      } catch(e) { return null; }
    };

  } catch(e) {
    console.warn('Supabase инициализация неуспешна:', e.message);
  }
} else {
  console.warn('Supabase CDN библиотеката не е заредена — поръчките се записват само в localStorage');
}
