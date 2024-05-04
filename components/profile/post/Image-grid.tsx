import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";


export default  function ImageGrid( {images} ) {
    const [isOpen, setIsOpen] = useState(false);
    const [imageState , setImageState]= useState<number>()

    const modifyiedArray= images.map((url)=>{
        return{src:url.url}
    })

   const animationDuration = 500
   const maxZoomPixelRatio=2
   const zoomInMultiplier=2
   const doubleTapDelay=300
   const doubleClickDelay=300
   const doubleClickMaxStops=2
   const keyboardMoveDistance=50
   const wheelZoomDistanceFactor=100
   const pinchZoomDistanceFactor = 100
   const scrollToZoom =true

    const openLightbox = (index) => {
        setIsOpen(true);
        setImageState(index)
    };


    const getGridForImage = (index) => {
        switch (images.length) {
            case 1: return "col-span-6 aspect-2/1" ;
            case 2: return "col-span-3 aspect-1";
            case 3: return index === 0 ? "col-span-6" : "aspect-2/1 col-span-3";
            case 4: return (index===0) ? "col-span-6 aspect-2/1": "aspect-2/1 col-span-2 ";
            case 5: 
                return (index === 0 || index === 1) ? "  col-span-3 aspect-1" : "aspect-2/1 col-span-2";
            default: return "w-full h-full";
        }
    };

    return (
        <div className={`grid grid-cols-6  gap-2  ${images.length === 0 ? 'grid-cols-1' : ''}`}>
            {images?.map((img, index) => (
                <div key={index} className={`${getGridForImage(index)} relative cursor-pointer col-span-1 `} onClick={() => openLightbox(index)}>
                    <Image
                        key={index}
                        src={img.url}
                        alt={`Gallery image ${index + 1}`}
                        width={400}
                        height={150}
                        className="w-full h-full object-cover rounded-md"
                        priority
                    />
                  
                </div>
                
            ))}
             

         
               <Lightbox
                open={isOpen}
                close={() => setIsOpen(false)}
                index={imageState}
                slides={modifyiedArray}
                plugins={[Zoom]}
                animation={{ zoom: animationDuration }}
                zoom={{
                maxZoomPixelRatio,
                zoomInMultiplier,
                doubleTapDelay,
                doubleClickDelay,
                doubleClickMaxStops,
                keyboardMoveDistance,
                wheelZoomDistanceFactor,
                pinchZoomDistanceFactor,
                scrollToZoom,
                }}
                
            />  
             
             
        </div>
    );
}


