import { useState, useEffect, useCallback } from 'react';
import { getProjectImages } from '../lib/supabase';

export function useSupabaseImages() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadImages() {
      const urls = await getProjectImages();
      if (isMounted) {
        setImages(urls);
        setLoading(false);
      }
    }
    loadImages();
    return () => { isMounted = false; };
  }, []);

  const getRandomImage = useCallback((seed?: string) => {
    if (images.length === 0) return null;
    if (seed) {
      // Deterministic "random" based on seed string
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
      }
      return images[Math.abs(hash) % images.length];
    }
    return images[Math.floor(Math.random() * images.length)];
  }, [images]);

  return { images, loading, getRandomImage };
}
