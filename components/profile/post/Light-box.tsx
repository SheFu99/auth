import { Dialog, DialogContent } from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

const Lightbox = ({ images, goToNext,goToPrevious, onClose,isOpen, keyLeft,keyRight}) => {
console.log(images)

const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        keyLeft()
        break;
      case 'ArrowRight':
        keyRight()
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
            <DialogContent className='max-h-[90vh] flex justify-center p-10 min-w-[50vw]'>
                        <button onClick={goToPrevious}><MdNavigateBefore color='white'/> </button>
                        <img
                            src={images}
                            alt="Gallery"
                            className="block  max-h-[80vh] m-auto "
                        />
                       <button onClick={goToNext}><MdNavigateNext color='white'/> </button>
              
        </DialogContent>
        </Dialog>
    );
};

export default Lightbox;