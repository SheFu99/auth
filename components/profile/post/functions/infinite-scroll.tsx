
import React, { useEffect, useState, useRef } from 'react';
import { BeatLoader } from 'react-spinners';


interface InfiniteScroll {
  loadMore?: any
  hasMore?:boolean,
  children?:React.ReactNode,
  className?:string,
  isloaded?:boolean
}


const InfiniteScroll = ({ loadMore, hasMore, children, isloaded, className }:InfiniteScroll) => {
  const [isFetching, setIsFetching] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    console.log('hasMore',hasMore)
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setIsFetching(true);
          loadMore()?.then(() => setIsFetching(false));
        }
      },
      {
        root: null, // observing for visibility in the viewport
        rootMargin: "0px",
        threshold: 1 // trigger if at least 10% of the element is visible
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isFetching, loadMore]); // React on changes to hasMore, isFetching, loadMore

  return (
    <div className={`${className}`}>
      {children}
      <div ref={loaderRef} className='flex w-full justify-center'>
        { hasMore && (
          <BeatLoader className='mb-5 scale-125' color='white' />
        )}
        {isloaded && (
          <div>
            {hasMore ? (
              <div className='flex w-full justify-center'>
                {/* Visual indicator (like an arrow) can be re-enabled here if needed */}
              </div>
            ) : (
              <div className='flex w-full justify-center mb-2'>
                {/* <p className='text-gray-300 text-sm'>No more to upload!</p> */}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteScroll;
