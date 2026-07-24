import { MenuCms } from '@/features/admin/menu-cms';

export default function MenuPage() {
  return (
    <main className="min-h-screen p-6 md:p-10">
      <h1 className="text-4xl font-semibold">Menu CMS</h1>
      <p className="mt-3 max-w-2xl text-white/55">Manage categories, dishes, pricing, availability, and featured menu content through reusable Supabase CRUD services.</p>
      <div className="mt-8"><MenuCms /></div>
    </main>
  );
}
