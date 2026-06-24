"use client";

import { hasSupabaseConfig, supabase } from "@/lib/supabase";

export async function uploadAsset(path: string, file: File): Promise<string> {
  if (!hasSupabaseConfig || !supabase) return URL.createObjectURL(file);
  const objectPath = `${path}/${Date.now()}-${file.name}`;
  const { error } = await supabase.storage.from("assets").upload(objectPath, file);
  if (error) return URL.createObjectURL(file);
  const { data } = supabase.storage.from("assets").getPublicUrl(objectPath);
  return data.publicUrl;
}
