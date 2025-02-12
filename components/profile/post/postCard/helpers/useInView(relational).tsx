import { useEffect, useState, useRef, RefObject } from 'react';


interface UseInViewOptions extends IntersectionObserverInit {}

const useInViewRelational = (options: UseInViewOptions): [RefObject<HTMLElement>, boolean] => {
  const [inView, setInView] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    const currentElement = ref.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [ref, options]); // also depend on `ref` to prevent memory leaks or bugs if ref changes

  return [ref, inView];
};

export default useInViewRelational;
