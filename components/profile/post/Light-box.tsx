import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { MdNavigateBefore, MdNavigateNext, MdZoomIn, MdZoomOut } from 'react-icons/md';

interface PositionState {
    x: number;
    y: number;
    startX: number;
    startY: number;
    zoomLevel: number;
}

const Lightbox = ({ images, goToNext, goToPrevious, onClose, isOpen }: { images: string, goToNext: () => void, goToPrevious: () => void, onClose: () => void, isOpen: boolean }) => {
    const [position, setPosition] = useState<PositionState>({ x: 0, y: 0, startX: 0, startY: 0, zoomLevel: 1 });
    const isDragging = useRef(false);

    const transformStyles = `translate3d(${position.x}px, ${position.y}px, 0) scale(${position.zoomLevel})`;

    const handleZoom = (factor: number, clientX: number, clientY: number) => {
      setPosition(prev => {
          const newZoom = prev.zoomLevel * factor;
          if (newZoom <= 1) {
              return { ...prev, x: 0, y: 0, zoomLevel: 1 };
          } else {
              const dx = (clientX - window.innerWidth / 2) * (1 - factor);
              const dy = (clientY - window.innerHeight / 2) * (1 - factor);
              return { ...prev, x: prev.x + dx, y: prev.y + dy, zoomLevel: newZoom };
          }
      });
  };

    const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
        handleZoom(scaleAmount, e.clientX, e.clientY);
    };

    const handleGestureStart = (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        isDragging.current = true;
        setPosition(prev => ({ ...prev, startX: clientX, startY: clientY }));
    };

    const handleGestureMove = (e: React.MouseEvent<HTMLImageElement> | React.TouchEvent<HTMLImageElement>) => {
        if (isDragging.current && position.zoomLevel > 1) {
            const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
            setPosition(prev => ({
                ...prev,
                x: prev.x + (clientX - prev.startX),
                y: prev.y + (clientY - prev.startY),
                startX: clientX,
                startY: clientY
            }));
        }
    };

    const handleGestureEnd = () => {
        isDragging.current = false;
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (position.zoomLevel > 1) return;  // Ignore keyboard navigation if zoomed in
            switch (event.key) {
                case 'ArrowLeft':
                    goToPrevious();
                    break;
                case 'ArrowRight':
                    goToNext();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('wheel', handleWheel);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('wheel', handleWheel);
        };
    }, [position.zoomLevel, goToNext, goToPrevious]);

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="min-h-screen flex justify-center items-center p-10">
              <button onClick={goToPrevious} className="absolute left-10 top-1/2 transform -translate-y-1/2">
                  <MdNavigateBefore color="white" />
              </button>
              <img
                  src={images}
                  alt="Gallery"
                  className="block max-h-[80vh] m-auto select-none"
                  style={{ transform: transformStyles, transition: 'transform 0.3s ease-out' }}
                  onMouseDown={handleGestureStart}
                  onMouseMove={handleGestureMove}
                  onMouseUp={handleGestureEnd}
                  onMouseLeave={handleGestureEnd}
                  onTouchStart={handleGestureStart}
                  onTouchMove={handleGestureMove}
                  onTouchEnd={handleGestureEnd}
                  onDragStart={(e) => e.preventDefault()}
              />
              <button onClick={goToNext} className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <MdNavigateNext color="white" />
              </button>
              <div className="absolute top-10 right-10 space-x-2">
                  <button onClick={() => handleZoom(1.1, window.innerWidth / 2, window.innerHeight / 2)} title="Zoom in">
                      <MdZoomIn color="white" className="text-xl" />
                  </button>
                  <button onClick={() => handleZoom(0.9, window.innerWidth / 2, window.innerHeight / 2)} title="Zoom out">
                      <MdZoomOut color="white" className="text-xl" />
                  </button>
              </div>
          </DialogContent>
      </Dialog>
  );
};

export default Lightbox;


