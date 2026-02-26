import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { requireSupabaseEnv } from "./env";

let browserClient: SupabaseClient | undefined;

export function createClient() {
  const { supabaseAnonKey, supabaseUrl } = requireSupabaseEnv();

  if (!browserClient) {
    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  return browserClient;
}
