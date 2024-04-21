import React, { useState } from 'react';
import Image from 'next/image';

export default  function ImageGrid( {images} ) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImg, setSelectedImg] = useState(null);

    const openLightbox = (url) => {
        setIsOpen(true);
        setSelectedImg(url);
    };

    const getGridClass = (index) => {
        switch (images.length) {
            case 2: return "w-1/2";
            case 3: return index === 0 ? "w-full" : "w-1/2";
            case 4: return "w-1/2";
            case 5: return (index === 0 || index === 1) ? " aspect-square " : "aspect-video";
            default: return "w-1/3 h-1/3";
        }
    };

    return (
        <div className={`grid grid-cols-3 gap-2 as  ${images.length === 0 ? 'grid-cols-1' : ''}`}>
            {images?.map((img, index) => (
                <div key={index} className={`${getGridClass(index)} relative cursor-pointer col-span-1 `} onClick={() => openLightbox(img.url)}>
                    <Image
                        src={img.url}
                        alt={`Gallery image ${index + 1}`}
                        width={500}
                        height={150}
                        className="w-full h-full object-cover"
                        priority
                    />
                </div>
            ))}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={() => setIsOpen(false)}>
                    <img src={selectedImg} alt="Lightbox img" className="max-h-full max-w-full" />
                </div>
            )}
        </div>
    );
}


