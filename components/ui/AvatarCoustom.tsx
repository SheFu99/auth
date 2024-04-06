import React, { useState } from 'react';
import Image from 'next/image';

interface AvatarProps {
  src: string | undefined;
  children: React.ReactNode;
  alt: string;
  width:number;
  height:number;
}

const AvatarWithFallback = ({ src, children, alt,width,height }: AvatarProps) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full z-30 rounded-full">
      {src && !hasError ? (
        <Image
          src={src}
          alt={alt}
          // layout="fill"
          objectFit="cover"
          width={width}
          height={height}
          onError={() => setHasError(true)} // Set error state if the image fails to load
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center rounded-full">
          {children}
        </div>
      )}
    </div>
  );
};

export default AvatarWithFallback;
