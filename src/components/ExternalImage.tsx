'use client';

import { Box } from '@mui/material';
import { CSSProperties } from 'react';
import Image from 'next/image';
import { imageLoader } from '@/utils/imageLoader';

interface ExternalImageProps {
  src: string;
  alt: string;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
}

export default function ExternalImage({ src, alt, style, className, onClick }: ExternalImageProps) {
  // Use next/image for Supabase images, but keep Box for external URLs that might not work with next/image
  const isSupabaseImage = src.includes('supabase.co');

  if (isSupabaseImage) {
    return (
      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
        <Image
          loader={imageLoader}
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
          style={{
            objectFit: style?.objectFit as any || 'contain',
            ...style,
          }}
          className={className}
          onClick={onClick}
        />
      </Box>
    );
  }

  // Fallback to regular img for external URLs
  return (
    <Box
      component="img"
      src={src}
      alt={alt}
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        ...style,
      }}
      className={className}
      onClick={onClick}
    />
  );
}
