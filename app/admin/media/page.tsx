import { MediaLibrary } from '@/features/admin/media-library';

export default function MediaPage() {
  return (
    <main className="min-h-screen p-6 md:p-10">
      <h1 className="text-4xl font-semibold">Media Library</h1>
      <p className="mt-3 max-w-2xl text-white/55">Curate gallery, menu, and brand media with Cloudinary-ready uploads and Supabase metadata.</p>
      <div className="mt-8"><MediaLibrary /></div>
    </main>
  );
}
