"use client"
import React, {useState} from "react";
import Image from "next/image";
import CoverPlaceHolder from "../lib/coverPlaceHolder";



type CoverProps = {
    url?:string | null ,
    className?: string,
    editable?: boolean
}




export default function CoverPublic({url, className}:CoverProps) {

  const [isUploading,setIsUploading] = useState(true);

  return (
    
    <div className={`${className} overflow-hidden relative rounded-xl w-full `}>
    
      {url&&(
       
        <div className="flex justify-center align-middle items-center">
          <Image src={url} alt="cover"
            width={800}
            height={200}
            objectFit="cover"
            layout="responsive" 
            className={`${className} xl:-mt-[2rem] w-full h-full bg-blend-overlay g-f:w-auto aspect-6/1  md:aspect-4/1`}
            onLoadingComplete={()=>setIsUploading(false)}
          /> 
        </div>
          
      )}
      
      
        {!isUploading||!url&&(
            <CoverPlaceHolder/>
        )}
      
    </div>
  );
}