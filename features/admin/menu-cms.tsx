'use client';

import { Plus, Save, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { demoRestaurantId } from '@/features/admin/constants';
import { deleteMenuItem, upsertMenuItem } from '@/lib/menu';
import type { MenuCategory, MenuItem } from '@/types/database';

const menuItemSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(8),
  price: z.coerce.number().positive(),
  categoryId: z.string().min(1),
});

type DraftItem = z.infer<typeof menuItemSchema>;

const defaultCategories: MenuCategory[] = [
  { id: '10000000-0000-4000-8000-000000000001', restaurant_id: demoRestaurantId, name: 'Tacos', slug: 'tacos', description: 'Signature masa program', sort_order: 1, is_active: true, created_at: '', updated_at: '' },
  { id: '10000000-0000-4000-8000-000000000002', restaurant_id: demoRestaurantId, name: 'Tasting', slug: 'tasting', description: 'Omakase-style seasonal menu', sort_order: 2, is_active: true, created_at: '', updated_at: '' },
];

const defaultItems: MenuItem[] = [
  { id: 'item-1', restaurant_id: demoRestaurantId, category_id: '10000000-0000-4000-8000-000000000001', name: 'A5 Wagyu Taco', slug: 'a5-wagyu-taco', description: 'Truffle crema, salsa negra, edible gold.', price_cents: 2800, image_url: null, dietary_tags: ['signature'], is_featured: true, is_available: true, created_at: '', updated_at: '' },
];

export function MenuCms() {
  const [items, setItems] = useState<MenuItem[]>(defaultItems);
  const [draft, setDraft] = useState<DraftItem>({ name: '', description: '', price: 18, categoryId: defaultCategories[0].id });
  const [status, setStatus] = useState('Draft changes are local until Supabase credentials are configured.');

  const categoryName = useMemo(() => new Map(defaultCategories.map((category) => [category.id, category.name])), []);

  async function saveDraft() {
    const parsed = menuItemSchema.safeParse(draft);
    if (!parsed.success) {
      setStatus('Please complete the item name, description, category, and price.');
      return;
    }

    const item: MenuItem = {
      id: crypto.randomUUID(),
      restaurant_id: demoRestaurantId,
      category_id: parsed.data.categoryId,
      name: parsed.data.name,
      slug: parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      description: parsed.data.description,
      price_cents: Math.round(parsed.data.price * 100),
      image_url: null,
      dietary_tags: [],
      is_featured: false,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setItems((current) => [item, ...current]);
    setDraft({ name: '', description: '', price: 18, categoryId: defaultCategories[0].id });
    setStatus('Item staged in the CMS. It will sync through upsertMenuItem when Supabase is connected.');

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await upsertMenuItem(item);
    }
  }

  async function removeItem(itemId: string) {
    setItems((current) => current.filter((item) => item.id !== itemId));
    setStatus('Item removed from the local CMS state.');

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await deleteMenuItem(itemId);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <Badge>Menu CMS</Badge>
        <h2 className="mt-4 text-2xl font-semibold">Create menu item</h2>
        <div className="mt-6 space-y-4">
          <Input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Dish name" />
          <Textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Dish description" />
          <Input value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} type="number" min="1" step="0.01" placeholder="Price" />
          <select className="w-full rounded-2xl border border-white/15 bg-black/70 px-4 py-3 text-white" value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}>
            {defaultCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <Button onClick={saveDraft}><Save className="mr-2" size={18} />Save item</Button>
        </div>
        <p className="mt-5 text-sm text-white/50">{status}</p>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Menu items</h2>
          <Button variant="secondary" size="sm"><Plus className="mr-2" size={16} />Category</Button>
        </div>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge variant="glass">{categoryName.get(item.category_id)}</Badge>
                  <h3 className="mt-3 text-xl font-semibold">{item.name}</h3>
                  <p className="mt-1 text-white/55">{item.description}</p>
                </div>
                <button aria-label={`Delete ${item.name}`} className="rounded-full p-2 text-white/45 hover:bg-red-400/10 hover:text-red-200" onClick={() => void removeItem(item.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </div>
  );
}
