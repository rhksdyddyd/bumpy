import { useEffect, useRef } from 'react';

interface UseResizeObserverProps<T extends HTMLElement> {
  targetRef: Nullable<React.RefObject<T>>;
  callback: (entries: ResizeObserverEntry) => void;
}

const useResizeObserver = <T extends HTMLElement>({
  targetRef,
  callback,
}: UseResizeObserverProps<T>): void => {
  const observerRef = useRef<ResizeObserver>();

  useEffect(() => {
    observerRef.current = new ResizeObserver(entries => {
      entries.some(entry => {
        if (targetRef !== undefined && entry.target === targetRef.current) {
          callback(entry);
          return true;
        }
        return false;
      });
    });

    if (targetRef !== undefined && targetRef.current) {
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
