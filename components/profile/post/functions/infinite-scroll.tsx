import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';

const InfiniteScroll = ({ loadMore, hasMore, children, isloaded, page }) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = async () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    console.log('HandleFetchParent');
    
    // Check if we're near the bottom of the page and if more content is available
    if (scrollTop + clientHeight + 50 >= scrollHeight - 10 && hasMore && !isFetching) {
      setIsFetching(true); // Prevent further calls until the current one is resolved
      await loadMore();
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 100); // Debounce the scroll handler

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [hasMore, loadMore]); // Ensure dependencies are correctly managed

  // Debounce function to limit how often a function can fire
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  return (
    <div className='space-y-5'>
      {children}
      {isFetching && hasMore && (
        <div className='flex w-full justify-center'>
          <BeatLoader className='mb-5 scale-125' color='white' />
        </div>
      )}
      {isloaded && (
        <div>
          {hasMore ? (
            <div className='flex w-full justify-center'>
              {/* Visual indicator (like an arrow) can be re-enabled here if needed */}
            </div>
          ) : (
            <div className='flex w-full justify-center mb-2'>
              <p className='text-gray-300 text-sm'>No more posts to upload!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
