import { useEffect, useRef } from 'react';

interface UseResizeObserverProps<T extends HTMLElement> {
  targetRef: React.RefObject<T>;
  callback: () => void;
}

const useResizeObserver = <T extends HTMLElement>({
  targetRef,
  callback,
}: UseResizeObserverProps<T>): void => {
  const observerRef = useRef<ResizeObserver>();

  useEffect(() => {
    observerRef.current = new ResizeObserver(([entry]) => {
      if (entry.target === targetRef.current) {
        callback();
      }
    });

    if (targetRef.current) {
      observerRef.current.observe(targetRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
};

export default useResizeObserver;
