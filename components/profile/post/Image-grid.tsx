import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Lightbox from './Light-box';
export default  function ImageGrid( {images} ) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedImg, setSelectedImg] = useState();
    const [imageState , setImageState]= useState<number>()

   
    const openLightbox = (index,img) => {
        setIsOpen(true);
        setImageState(index)
        console.log(images.length,imageState)
        setSelectedImg(img)
    };
useEffect(()=>{
console.log(imageState)
},[imageState])
    const gotoPrevious = () =>{
        console.log(imageState)
        if(imageState -1 >= 0 ){
            console.log(imageState -1)
        imageState > 0 && setImageState(imageState - 1);
        const filteredImageByIndex = images.filter((img,i)=> i === imageState-1)
     
        const urlInArray = filteredImageByIndex[0].url
        setSelectedImg(urlInArray)
    }
    console.log('begin!')
    };

    const gotoNext = () =>{

          if(imageState  +1< images.length ){
            console.log(imageState +1)
            setImageState(imageState + 1);
            const filteredImageByIndex = images.filter((img,i)=> i === imageState+1)
            const urlInArray =filteredImageByIndex[0].url
            setSelectedImg(urlInArray)
            
        }
        console.log('end!')
    };

    const onClose = ()=>{
        console.log("CLOSE")
        setIsOpen(false)
        setImageState(null)
    }
    

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
    console.log(selectedImg)
    return (
        <div className={`grid grid-cols-6  gap-2  ${images.length === 0 ? 'grid-cols-1' : ''}`}>
            {images?.map((img, index) => (
                <div key={index} className={`${getGridForImage(index)} relative cursor-pointer col-span-1 `} onClick={() => openLightbox(index,img.url)}>
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
             
            {/* {isOpen && (
                <div className=" inset-0 absolute bg-black bg-opacity-75 flex justify-center items-center z-50 h-[90vh] w-[90vh]" onClick={() => setIsOpen(false)}>
                    <img src={selectedImg} alt="Lightbox img" className="max-h-full max-w-full " />
                </div>
            )} */}
            <Lightbox isOpen={isOpen}
             onClose={onClose} 
             images={selectedImg} 
             goToNext={gotoNext} 
             goToPrevious={gotoPrevious}
             
           
             />
                
             
             
        </div>
    );
}


