
import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useViewerStore } from '../store/useViewerStore';

// Note: In a real app, this would be a local asset or a CDN link to an MP3.
// Using a generic high-quality paper flip sound placeholder.
const FLIP_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3';

export const useSound = () => {
  const isSoundEnabled = useViewerStore((state) => state.isSoundEnabled);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    soundRef.current = new Howl({
      src: [FLIP_SOUND_URL],
      volume: 0.5,
      preload: true
    });

    return () => {
      soundRef.current?.unload();
    };
  }, []);

  const playFlip = () => {
    if (isSoundEnabled && soundRef.current) {
      soundRef.current.play();
    }
  };

  return { playFlip };
};
