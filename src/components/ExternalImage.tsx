'use client';

import { Box } from '@mui/material';
import { CSSProperties } from 'react';

interface ExternalImageProps {
  src: string;
  alt: string;
  style?: CSSProperties;
  className?: string;
  onClick?: () => void;
}

export default function ExternalImage({ src, alt, style, className, onClick }: ExternalImageProps) {
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
