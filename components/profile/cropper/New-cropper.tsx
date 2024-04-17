import React, { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from './cropImage';
import { GrClose } from 'react-icons/gr';
import { FaCropSimple } from "react-icons/fa6";

interface ImageCropperrProps {
    image: string;
    type: 'Avatar' | 'Cover' | 'Post';
    onImageCropped: (croppedImage: string) => void;
  }
  


const ImageCropperr = ({ image, type, onImageCropped }:ImageCropperrProps) => {
    const [inputImg, setInputImg] = useState(image);  // Initially set to image passed from parent
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [modalState, setModalState] = useState(false);

    const aspectRatios = {
        Avatar: 1,
        Cover: 16 / 9,
        Post: 4 / 3,
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                inputImg,
                croppedAreaPixels,
                rotation
            );
            console.log("Cropped Image URL:", croppedImage);
            onImageCropped(croppedImage as string);  // Passing cropped image back to parent
            setModalState(false);
        } catch (e) {
            console.error('Failed to create cropped image:', e);
        }
    }, [croppedAreaPixels, inputImg, rotation, onImageCropped]);

    useEffect(() => {
        if (image) {
            setInputImg(image);
            setModalState(true);  // Automatically open modal when new image is provided
        }
    }, [image]);

    return (
        <div className="">

            {modalState&&(
                <div className='absolute w-full h-full bottom-5 -top-5 left-0 py-20 px-5 z-30 bg-gray-950 bg-opacity-90'>

                 <div className='relative w-full h-full p-6 border border-gray-950 rounded-lg bg-gray-500 ' >
                     <button title='close modal' className=' z-30 w-full flex justify-end mb-2 -mt-2' onClick={()=>setModalState(false)}>
                            <span className="sr-only">Close menu</span>
                            <GrClose color='white'/>
                     </button>

                    <div className='relative h-full w-full !bg-opacity-0 flex justify-center align-top'>
                    <Cropper
                            image={inputImg}
                            crop={crop}
                            zoom={zoom}
                            rotation={rotation}
                            aspect={aspectRatios[type]}
                            onCropChange={setCrop}
                            onRotationChange={setRotation}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            cropShape={type === 'Avatar' ? 'round' : 'rect'}
                            showGrid={false}
                            classes={{ containerClassName:'rounded-md mb-5'}}
                        />
                               
                            <button onClick={showCroppedImage} className='absolute z-30 bg-white rounded-md text-black mt-2 p-2 flex gap-1 items-center'><FaCropSimple/> Crop Image </button>
                        </div>
                    </div>
                </div>
            )}
          
        </div>
    );
};

export default ImageCropperr