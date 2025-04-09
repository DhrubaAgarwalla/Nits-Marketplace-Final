import { ImageLoaderProps } from 'next/image';

export const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  // Return the URL directly for Supabase storage URLs
  if (src.includes('supabase.co')) {
    return src;
  }
  
  // For other images, you can add width and quality parameters if needed
  return src;
};
