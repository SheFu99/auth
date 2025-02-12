import { useState, useEffect, useRef } from 'react';

// Extend the options to accept a pixel threshold
interface UseInViewOptions {
  threshold?: number;
  thresholdPixels?: number; // New option for pixel-based threshold
}

const useInViewAbsolute = ({
    threshold = 0.5,
    thresholdPixels
  }: UseInViewOptions) => {
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const target = ref.current;
      if (!target) return;
  
      let effectiveThreshold = threshold;
      if (thresholdPixels !== undefined) {
        const targetHeight = target.offsetHeight;
  
        if (targetHeight > 0) {  // Check to avoid division by zero
          effectiveThreshold = Math.min(1, Math.max(0, thresholdPixels / targetHeight));  // Clamping the ratio between 0 and 1
        } else {
          console.error("Target element height is zero. Adjusting effective threshold to the default ratio.");
          effectiveThreshold = threshold;
        }
      }
  
      const observer = new IntersectionObserver(([entry]) => {
        setInView(entry.isIntersecting);
      }, { threshold: [effectiveThreshold] });
  
      observer.observe(target);
  
      // Cleanup observer on component unmount
      return () => observer.disconnect();
    }, [threshold, thresholdPixels]);  // Rerun effect if either threshold value changes
  
    return [ref, inView] as const;
  };
export default useInViewAbsolute;
