'use client';

import Image from 'next/image';
import { UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { demoRestaurantId } from '@/features/admin/constants';
import { uploadGalleryAsset } from '@/lib/media';
import type { MediaAsset } from '@/types/database';

const starterAssets: MediaAsset[] = [
  { id: 'asset-1', restaurant_id: demoRestaurantId, public_id: 'demo/gallery-1', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b', alt: 'Luxury restaurant bar', folder: 'gallery', width: 1200, height: 900, created_at: '' },
  { id: 'asset-2', restaurant_id: demoRestaurantId, public_id: 'demo/gallery-2', url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de', alt: 'Fine dining table', folder: 'gallery', width: 1200, height: 900, created_at: '' },
];

export function MediaLibrary() {
  const [assets, setAssets] = useState<MediaAsset[]>(starterAssets);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [status, setStatus] = useState('Cloudinary upload is ready once a cloud name and unsigned preset are configured.');

  async function uploadAsset() {
    if (!file || alt.length < 2) {
      setStatus('Select an image and provide accessible alt text before uploading.');
      return;
    }

    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      const localAsset: MediaAsset = {
        id: crypto.randomUUID(),
        restaurant_id: demoRestaurantId,
        public_id: `local/${file.name}`,
        url: URL.createObjectURL(file),
        alt,
        folder: 'gallery',
        width: null,
        height: null,
        created_at: new Date().toISOString(),
      };
      setAssets((current) => [localAsset, ...current]);
      setStatus('Preview asset added locally. Configure Cloudinary to persist uploads.');
      return;
    }

    const uploaded = await uploadGalleryAsset(file, demoRestaurantId, alt);
    setAssets((current) => [uploaded, ...current]);
    setStatus('Gallery asset uploaded and stored in Supabase.');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card>
        <h2 className="text-2xl font-semibold">Gallery upload</h2>
        <p className="mt-2 text-white/55">Upload optimized hospitality imagery through Cloudinary and persist metadata in Supabase.</p>
        <div className="mt-6 space-y-4">
          <Input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          <Input value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="Accessible alt text" />
          <Button onClick={() => void uploadAsset()}><UploadCloud className="mr-2" size={18} />Upload image</Button>
        </div>
        <p className="mt-5 text-sm text-white/50">{status}</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => (
          <Card key={asset.id} padding="none" className="overflow-hidden">
            <div className="relative h-56">
              <Image src={asset.url} alt={asset.alt} fill className="object-cover" unoptimized={asset.url.startsWith('blob:')} sizes="(min-width:1280px) 25vw, 50vw" />
            </div>
            <div className="p-4">
              <p className="font-medium">{asset.alt}</p>
              <p className="mt-1 text-sm text-white/45">{asset.folder} · {asset.public_id}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
