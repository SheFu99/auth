import React, { useState } from 'react';
import Image from 'next/image';

export default  function ImageGrid( {images} ) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);

    const openLightbox = (url) => {
        setIsOpen(true);
        setSelectedImg(url);
    };

   

    const getGridForImage = (index) => {
        switch (images.length) {
            case 1: return "col-span-6 aspect-1" ;
            case 2: return "col-span-3 aspect-1";
            case 3: return index === 0 ? "col-span-6" : "aspect-2/1 col-span-3";
            case 4: return (index===0) ? "col-span-6 aspect-1": "aspect-2/1 col-span-2 ";
            case 5: 
                return (index === 0 || index === 1) ? "  col-span-3 aspect-1" : "aspect-2/1 col-span-2";
            default: return "w-full h-full";
        }
    };

    return (
        <div className={`grid grid-cols-6  gap-2  ${images.length === 0 ? 'grid-cols-1' : ''}`}>
            {images?.map((img, index) => (
                <div key={index} className={`${getGridForImage(index)} relative cursor-pointer col-span-1 `} onClick={() => openLightbox(img.url)}>
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
            {isOpen && (
                <div className=" inset-0 absolute bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={() => setIsOpen(false)}>
                    <img src={selectedImg} alt="Lightbox img" className="max-h-full max-w-full" />
                </div>
            )}
        </div>
    );
}


