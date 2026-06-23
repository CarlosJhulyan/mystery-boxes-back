import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Cliente público (para operaciones del usuario)
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Cliente admin (para operaciones del servidor, usa service key)
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
