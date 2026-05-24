// src/services/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Perhatikan: Key ini tidak pakai NEXT_PUBLIC_ agar tidak bocor ke browser
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    "Supabase URL atau Service Role Key belum diset di environment variables!",
  );
}

// Client admin (Bypass RLS, HANYA BOLEH DIPAKAI DI SERVER/API ROUTE)
export const supabaseAdmin = createClient(
  supabaseUrl || "",
  supabaseServiceRoleKey || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
