import { supabase } from '@/lib/supabase';
import type { MenuCategory, MenuItem } from '@/types/database';

export type MenuItemInput = Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>;
export type MenuCategoryInput = Omit<MenuCategory, 'id' | 'created_at' | 'updated_at'>;

export async function listCategories(restaurantId: string): Promise<MenuCategory[]> {
  const { data, error } = await supabase.from('menu_categories').select('*').eq('restaurant_id', restaurantId).order('sort_order');
  if (error) throw error;
  return data;
}

export async function upsertCategory(category: MenuCategoryInput & { id?: string }): Promise<MenuCategory> {
  const { data, error } = await supabase.from('menu_categories').upsert(category).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('menu_categories').delete().eq('id', id);
  if (error) throw error;
}

export async function listMenuItems(restaurantId: string): Promise<MenuItem[]> {
  const { data, error } = await supabase.from('menu_items').select('*').eq('restaurant_id', restaurantId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function upsertMenuItem(item: MenuItemInput & { id?: string }): Promise<MenuItem> {
  const { data, error } = await supabase.from('menu_items').upsert(item).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw error;
}
