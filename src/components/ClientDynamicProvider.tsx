'use client';

import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/context/AuthContext';

// Dynamically import non-critical components
const ProfileCompletionDialog = dynamic(() => import('./ProfileCompletionDialog'), {
  ssr: false,
});

// Import preload resources component
const PreloadResources = dynamic(() => import('@/app/preload-resources'), {
  ssr: false,
});

interface ClientDynamicProviderProps {
  children: ReactNode;
}

export default function ClientDynamicProvider({ children }: ClientDynamicProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      <PreloadResources />
      {children}
      <ProfileCompletionDialog />
    </AuthProvider>
  );
}
