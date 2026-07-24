import { supabase } from '@/lib/supabase';
import type { BuilderPage, BuilderVersion, SeoSettings, ThemeSettings } from '@/types/database';

export async function saveThemeSettings(settings: Omit<ThemeSettings, 'updated_at'>): Promise<ThemeSettings> {
  const { data, error } = await supabase.from('theme_settings').upsert(settings).select('*').single();
  if (error) throw error;
  return data;
}

export async function saveSeoSettings(settings: Omit<SeoSettings, 'updated_at'>): Promise<SeoSettings> {
  const { data, error } = await supabase.from('seo_settings').upsert(settings).select('*').single();
  if (error) throw error;
  return data;
}

export async function saveBuilderPage(page: Omit<BuilderPage, 'created_at' | 'updated_at'>): Promise<BuilderPage> {
  const { data, error } = await supabase.from('builder_pages').upsert(page).select('*').single();
  if (error) throw error;
  return data;
}

export async function listBuilderVersions(pageId: string): Promise<BuilderVersion[]> {
  const { data, error } = await supabase.from('builder_versions').select('*').eq('page_id', pageId).order('version_number', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createBuilderVersion(version: Omit<BuilderVersion, 'id' | 'created_at'>): Promise<BuilderVersion> {
  const { data, error } = await supabase.from('builder_versions').insert(version).select('*').single();
  if (error) throw error;
  return data;
}
