import { ArrowBigDownDash } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';

interface Props {
  loadMore: () => Promise<void>;
  hasMore: boolean;
  children: React.ReactNode;
  isloaded: boolean;
  page?:number;
}

const InfiniteScroll =  ({ loadMore, hasMore, children,isloaded,page }: Props) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [lastScrollTop, setLastScrollTop] = useState<number>(0);
 
  const handleScroll = async () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
console.log('HandleFetchParent')
    if (scrollTop > lastScrollTop && scrollTop + clientHeight +50 >= scrollHeight -10 && hasMore) {
      if (isFetching && hasMore) {
       await loadMore().then(() => setIsFetching(false));
       return
      }
      setIsFetching(true);
    }
    setLastScrollTop(scrollTop);


  }
  useEffect(() => {
    console.log(isFetching , lastScrollTop)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    handleScroll()

    const handleTouchMove = () => {
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

  // useEffect(() => {
  //   if (isFetching && hasMore) {
  //     loadMore().finally(() => setIsFetching(false));
  //   }
  // }, [isFetching, hasMore, loadMore]);

  return (
    <div className='space-y-5'>
      {children}
      {isFetching&&hasMore && (
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
