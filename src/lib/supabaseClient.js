// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Guarda la sesión en el almacenamiento del celu
    autoRefreshToken: true, // Refresca el token antes de que expire
    detectSessionInUrl: true, // Útil para logins sociales o links de email
    storage: window.localStorage, // Asegura que use el almacenamiento local
  },
});
