"use client";

import { cmsSeed } from "@/lib/cms-seed";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";
import { CmsSite } from "@/types/cms";

const STORAGE_KEY = "neuropgen-cms-site";
const SITE_ID = "site";

export async function loadCmsSite(): Promise<CmsSite> {
  if (hasSupabaseConfig && supabase) {
    const { data } = await supabase.from("cms").select("payload").eq("id", SITE_ID).maybeSingle();
    if (data) return data.payload as CmsSite;
  }

  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as CmsSite;
  }

  return cmsSeed;
}

export async function saveCmsSite(site: CmsSite): Promise<void> {
  const payload = { ...site, updatedAt: new Date().toISOString() };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
  if (hasSupabaseConfig && supabase) {
    await supabase.from("cms").upsert({ id: SITE_ID, payload });
  }
}

export function resetCmsDemo() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
