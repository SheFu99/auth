import { ArrowBigDownDash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';

interface Props {
  loadMore: () => Promise<void>;
  hasMore: boolean;
  children: React.ReactNode;
  isloaded: boolean;
}

const InfiniteScroll = ({ loadMore, hasMore, children,isloaded }: Props) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [lastScrollTop, setLastScrollTop] = useState<number>(0);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      if (scrollTop > lastScrollTop && scrollTop + clientHeight +50 >= scrollHeight -10 && hasMore) {
        
        setIsFetching(true);
      }
      setLastScrollTop(scrollTop);


    };

    const handleTouchMove = (event) => {
      handleScroll(); // Delegate to handleScroll to maintain consistent behavior
    };

    const handleTouchEnd = () => {
      // Optionally, force a scroll check on touch end to catch any final updates
      handleScroll();
    };

    if (isTouchDevice) {

      // Add touch-specific event listeners
      window.addEventListener('touchmove', handleTouchMove,{passive:true});
      window.addEventListener('touchend', handleTouchEnd,{passive:true});
      window.addEventListener('touchcancel', handleTouchEnd,{passive:true});
    } else {
      // Non-touch devices use scroll events
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (isTouchDevice) {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('touchcancel', handleTouchEnd);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [hasMore, lastScrollTop]);

  useEffect(() => {
    if (isFetching && hasMore) {
      loadMore().then(() => setIsFetching(false));
    }
  }, [isFetching, hasMore, loadMore]);

  return (
    <div className='space-y-5'>
      {children}
      {isFetching && (
        <div className='flex w-full justify-center'>
          <BeatLoader className='mb-5 scale-125' color='white'/>
        </div>
      )}
{isloaded ==true&&(
  <div>
      {hasMore ===true? (
        <div className='flex w-full justify-center'>
            {/* <ArrowBigDownDash color='white'/> */}
          </div>
      ):(
        <div className='flex w-full justify-center mb-2'>
          <p className='text-gray-300 text-sm '> No more post to upload!</p>
        </div>
      )}
  </div>
)}
     
    </div>
  );
};

export default InfiniteScroll;
