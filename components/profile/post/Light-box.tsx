import React, { useState } from 'react';

const Lightbox = ({ images, initialIndex = 0, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex + images.length - 1) % images.length);
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4">
            <div className="relative max-w-3xl max-h-full w-full">
                <button
                    onClick={goToPrevious}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full"
                >
                    &#10094;
                </button>
                <img
                    src={images[currentIndex]}
                    alt="Gallery"
                    className="block max-h-full max-w-full m-auto"
                />
                <button
                    onClick={goToNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full"
                >
                    &#10095;
                </button>
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 bg-red-600 text-white p-2"
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default Lightbox;