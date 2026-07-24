import { SettingsPanel } from '@/features/admin/settings-panel';

export default function SettingsPage() {
  return (
    <main className="min-h-screen p-6 md:p-10">
      <h1 className="text-4xl font-semibold">Theme, SEO & Access</h1>
      <p className="mt-3 max-w-2xl text-white/55">Control brand theming, metadata, and role-based permissions for each restaurant tenant.</p>
      <div className="mt-8"><SettingsPanel /></div>
    </main>
  );
}
