'use client';

import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { demoRestaurantId } from '@/features/admin/constants';
import { canAccess } from '@/lib/auth';
import { saveSeoSettings, saveThemeSettings } from '@/lib/settings';
import type { SeoSettings, ThemeSettings, UserRole } from '@/types/database';

export function SettingsPanel() {
  const [role, setRole] = useState<UserRole>('owner');
  const [theme, setTheme] = useState<Omit<ThemeSettings, 'updated_at'>>({ restaurant_id: demoRestaurantId, brand_name: 'RestaurantOS X', primary_color: '#030303', accent_color: '#d6a84f', background_color: '#030303', typography: 'editorial' });
  const [seo, setSeo] = useState<Omit<SeoSettings, 'updated_at'>>({ restaurant_id: demoRestaurantId, title: 'RestaurantOS X', description: 'Luxury restaurant experiences engineered for scale.', og_image: null, keywords: ['restaurant', 'fine dining', 'reservations'] });
  const [status, setStatus] = useState('Theme, SEO, and role permissions are ready for Supabase persistence.');

  async function saveSettings() {
    if (!canAccess(role, 'theme:write') || !canAccess(role, 'seo:write')) {
      setStatus(`The ${role} role cannot update theme and SEO settings.`);
      return;
    }

    setStatus('Settings staged locally. Configure Supabase to persist changes.');
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await Promise.all([saveThemeSettings(theme), saveSeoSettings(seo)]);
      setStatus('Theme and SEO settings saved to Supabase.');
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <Card>
        <Badge><ShieldCheck className="mr-2" size={14} />RBAC</Badge>
        <h2 className="mt-4 text-2xl font-semibold">Access role</h2>
        <select className="mt-6 w-full rounded-2xl border border-white/15 bg-black/70 px-4 py-3 text-white" value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
          <option value="owner">Owner</option>
          <option value="manager">Manager</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
        <p className="mt-4 text-sm text-white/55">Current role can update SEO: {canAccess(role, 'seo:write') ? 'Yes' : 'No'}</p>
      </Card>
      <Card>
        <h2 className="text-2xl font-semibold">Theme settings</h2>
        <div className="mt-6 space-y-4">
          <Input value={theme.brand_name} onChange={(event) => setTheme({ ...theme, brand_name: event.target.value })} placeholder="Brand name" />
          <Input value={theme.accent_color} onChange={(event) => setTheme({ ...theme, accent_color: event.target.value })} placeholder="Accent color" />
          <Input value={theme.primary_color} onChange={(event) => setTheme({ ...theme, primary_color: event.target.value })} placeholder="Primary color" />
        </div>
      </Card>
      <Card>
        <h2 className="text-2xl font-semibold">SEO settings</h2>
        <div className="mt-6 space-y-4">
          <Input value={seo.title} onChange={(event) => setSeo({ ...seo, title: event.target.value })} placeholder="Meta title" />
          <Textarea value={seo.description} onChange={(event) => setSeo({ ...seo, description: event.target.value })} placeholder="Meta description" />
          <Input value={seo.keywords.join(', ')} onChange={(event) => setSeo({ ...seo, keywords: event.target.value.split(',').map((keyword) => keyword.trim()).filter(Boolean) })} placeholder="Keywords" />
          <Button onClick={() => void saveSettings()}>Save settings</Button>
        </div>
        <p className="mt-5 text-sm text-white/50">{status}</p>
      </Card>
    </div>
  );
}
