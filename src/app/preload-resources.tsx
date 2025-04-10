'use client';

import { useEffect } from 'react';

/**
 * Component to preload critical resources to avoid chaining critical requests
 */
export default function PreloadResources() {
  useEffect(() => {
    // Function to create and append preload links
    const preloadResource = (href: string, as: string, type?: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      document.head.appendChild(link);
    };

    // Preload critical resources
    preloadResource('/header3.webp', 'image');
    
    // Preload critical fonts
    preloadResource('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;700&display=swap', 'style');
    
    // Preload critical JavaScript
    const criticalScripts = document.querySelectorAll('script[src^="/_next/static/chunks/"]');
    criticalScripts.forEach((script: Element) => {
      if (script.getAttribute('src')) {
        preloadResource(script.getAttribute('src') as string, 'script');
      }
    });

  }, []);

  return null;
}
