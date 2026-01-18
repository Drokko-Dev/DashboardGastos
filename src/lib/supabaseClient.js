// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Es vital que estas variables existan en el panel de Vercel (Settings > Env Variables)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
