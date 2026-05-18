import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

export const supabaseAdmin = createClient(
  config.supabaseUrl,
  config.supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export const supabaseAnon = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey
);
