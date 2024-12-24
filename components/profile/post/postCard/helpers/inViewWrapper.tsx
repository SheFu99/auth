import React from 'react';
import useInViewRelational from './useInView(relational)'; // Import your hook
import useInViewAbsolute from './useInView(absolute)';

// Define props for the wrapper including children and any other props
interface InViewWrapperProps {
  children: (inView: boolean) => React.ReactNode; // children as a render prop
  thresholdPixels?: number; // Optional threshold prop for the Intersection Observer
}

const InViewWrapper: React.FC<InViewWrapperProps> = ({ children, thresholdPixels = 200 }) => {
  const [ref, inView] = useInViewAbsolute({ thresholdPixels });

  // Render the children passing inView
  return <div ref={ref as React.RefObject<HTMLDivElement>}>{children(inView)}</div>;
};

export default InViewWrapper;
