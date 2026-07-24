import { cloudinaryConfig } from '@/lib/cloudinary';
import { supabase } from '@/lib/supabase';
import type { MediaAsset } from '@/types/database';

type CloudinaryUploadResponse = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
};

export async function uploadGalleryAsset(file: File, restaurantId: string, alt: string): Promise<MediaAsset> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('folder', `restaurantos/${restaurantId}/gallery`);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Cloudinary upload failed');
  }

  const cloudinary = (await response.json()) as CloudinaryUploadResponse;
  const { data, error } = await supabase
    .from('media_assets')
    .insert({
      restaurant_id: restaurantId,
      public_id: cloudinary.public_id,
      url: cloudinary.secure_url,
      alt,
      folder: 'gallery',
      width: cloudinary.width,
      height: cloudinary.height,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function listMediaAssets(restaurantId: string): Promise<MediaAsset[]> {
  const { data, error } = await supabase.from('media_assets').select('*').eq('restaurant_id', restaurantId).order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
