export const cloudinaryConfig = { cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? 'demo', uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? 'restaurantos' } as const;
export const cloudinaryImageUrl = (publicId: string): string => `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/f_auto,q_auto/${publicId}`;
