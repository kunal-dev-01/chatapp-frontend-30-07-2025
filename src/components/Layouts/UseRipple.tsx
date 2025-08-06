import { useEffect, useRef, RefObject } from 'react';
import { addRipple } from './RippleEffect';

// Hook version - returns a ref that you can attach to any element
export function useRipple<T extends HTMLElement = HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      addRipple(ref.current);
    }
  }, []);

  return ref;
}