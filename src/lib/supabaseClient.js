import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase URL과 Key를 가져옵니다. 
// (Vite 환경에서는 import.meta.env를 사용)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
