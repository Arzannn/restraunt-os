import { PageBuilder } from '@/features/builder/page-builder';

export default function BuilderPage() {
  return (
    <main className="min-h-screen p-6 md:p-10">
      <h1 className="text-4xl font-semibold">Visual Page Builder</h1>
      <p className="mt-3 max-w-3xl text-white/55">Build restaurant landing pages visually with drag-and-drop blocks, resizable sections, editable content, live preview, undo/redo, autosave, and version history backed by Supabase.</p>
      <div className="mt-8"><PageBuilder /></div>
    </main>
  );
}
