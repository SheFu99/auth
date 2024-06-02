import React, { useState } from 'react';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';

interface AvatarProps {
  src: string | undefined;
  alt: string;
  width:number;
  height:number;
}

const HeaderAvatar = ({ src, alt,width,height }: AvatarProps) => {
  const [hasError, setHasError] = useState(false);

  return (
    <>
      {
        src && !hasError ? (
        
      <div 
      className="flex justify-center relative rounded-full 
      w-[65px] h-[65px] md:w-[100px] md:h-[100px] 
      z-30 ">
       
          <div className="bg-black rounded-full  flex justify-center items-center align-middle p-1 z-[50] ">

      
              
          <Image
            src={src}
            alt={alt}
            // layout="fill"
            objectFit="cover"
            width={width}
            height={height}
            className='rounded-full z-30'
            onError={() => setHasError(true)} // Set error state if the image fails to load
          />
      
        
        </div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted p-3">
          <FaUser className="text-[#000000] w-[45px] h-[45px] md:w-[60px] md:h-[60px] g-f:w-[35px] g-f:h-[35px]"/>
        </div>
      )}
    </>
  );
};

export default HeaderAvatar;
