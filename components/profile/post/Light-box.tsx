import { Dialog, DialogContent } from '@/components/ui/dialog';
import React, { useEffect, useRef, useState } from 'react';
import { MdNavigateBefore, MdNavigateNext, MdZoomIn, MdZoomOut } from 'react-icons/md';

const Lightbox = ({ images, goToNext,goToPrevious, onClose,isOpen}) => {
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [endPos, setEndPos] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1); // Starting with no zoom

  const isSwiping = useRef(false);

  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const imageRef = useRef(null);

  const zoomIn = () => {
      setZoomLevel(prevZoom => prevZoom * 1.1); // Increase zoom by 10%
  };

  const zoomOut = () => {
      setZoomLevel(prevZoom => prevZoom * 0.9); // Decrease zoom by 10%
  };

  const handleWheel = (e) => {
      if (e.deltaY < 0) {
          zoomIn();
      } else {
          zoomOut();
      }
  };
  const handleGestureStart = (x, y) => {
      setStartPos({ x, y });
      isSwiping.current = true;
  };

  const handleGestureMove = (x, y) => {
      if (isSwiping.current) {
          setEndPos({ x, y });
      }
  };

  const handleGestureEnd = () => {
      if (!isSwiping.current) return;
      const dx = endPos.x - startPos.x;
      if (Math.abs(dx) > 50) {  // Only consider a swipe if it's larger than 50 pixels
          if (dx > 0) {
              nextButtonRef.current && nextButtonRef.current.click();
          } else {
              prevButtonRef.current && prevButtonRef.current.click();
          }
      }
      isSwiping.current = false;
  };

const handleKeyDown = (event) => {
 
    switch (event.key) {
      case 'ArrowLeft':
        prevButtonRef.current && prevButtonRef.current.click();
        break;
      case 'ArrowRight':
        nextButtonRef.current && nextButtonRef.current.click();
        break;

      default:
        // Handle other keys if needed
        console.log(`Key pressed: ${event.key}`);
        break;
    }
  };

useEffect(()=>{
    window.addEventListener('keydown',handleKeyDown)
    return()=>{
        window.removeEventListener('keydown',handleKeyDown)
    }
},[])
    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent className='min-h-[100vh] flex justify-center p-10 min-w-[100vw]'>
                        <button ref={prevButtonRef} title='back' onClick={goToPrevious}><MdNavigateBefore color='white'/> </button>
                        <img
                            ref={imageRef}
                            onWheel={handleWheel}
                            onTouchStart={(e) => handleGestureStart(e.touches[0].clientX, e.touches[0].clientY)}
                            onTouchMove={(e) => handleGestureMove(e.touches[0].clientX, e.touches[0].clientY)}
                            onTouchEnd={handleGestureEnd}
                            onMouseDown={(e) => handleGestureStart(e.clientX, e.clientY)}
                            onMouseMove={(e) => handleGestureMove(e.clientX, e.clientY)}
                            onMouseUp={handleGestureEnd}
                            onMouseLeave={() => { if (isSwiping.current) handleGestureEnd(); }}  // End the swipe if mouse leaves the component
                            onDragStart={(e) => e.preventDefault()}
                            src={images}
                            alt="Gallery"
                            style={{
                              cursor: 'grab',
                              touchAction: 'none'  ,
                              transform: `scale(${zoomLevel})`,
                              transition: 'transform 0.3s ease'
                          }}
                            className="block  max-h-[80vh] m-auto select-none"
                        />
                       <button ref={nextButtonRef} title='next' onClick={goToNext}><MdNavigateNext color='white'/> </button>
                       <div style={{ position: 'absolute', top: '40px', right: '60px' }}>
                          <button onClick={zoomIn} title="Zoom in">
                              <MdZoomIn color='white' className='scale-150 mr-5'/>
                          </button>
                          <button onClick={zoomOut} title="Zoom out">
                              <MdZoomOut color='white' className='scale-150'/>
                          </button>
                      </div>
              
        </DialogContent>
        </Dialog>
    );
};

export default Lightbox;