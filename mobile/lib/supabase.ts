import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zdwzccucqfvlsgxlspby.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpkd3pjY3VjcWZ2bHNneGxzcGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMzY0MjQsImV4cCI6MjA5MTkxMjQyNH0.tTDSpQFBx1sY1iXsQIRYO0GfoheJsiulk--vxAe7rFg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
