import { unstable_cache } from "next/cache";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase/types";
import { DEFAULT_PUBLIC_SETTINGS, resolvePublicSettings, type PublicSettings } from "./public-settings-defaults";

export type { PublicSettings } from "./public-settings-defaults";

export const getPublicSettings = unstable_cache(async (): Promise<PublicSettings> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return DEFAULT_PUBLIC_SETTINGS;
  const supabase = createSupabaseClient<Database>(url, key);
  const { data, error } = await supabase.from("site_settings").select("key,value");
  if (error || !data) return DEFAULT_PUBLIC_SETTINGS;
  return resolvePublicSettings(new Map(data.map((row) => [row.key, row.value])));
}, ["public-site-settings"], { revalidate: 60 });
