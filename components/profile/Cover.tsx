"use client"
import React, {useState} from "react";
import { BounceLoader } from "react-spinners";
import { HiPhotograph } from "react-icons/hi";
import CoverModal from "./cropper/Cover-modal";
import Image from "next/image";
import CoverPlaceHolder from "./post/lib/coverPlaceHolder";
import { useQueryClient } from "@tanstack/react-query";

type CoverProps = {
    url?:string | null ,
    editable:boolean,
    onChange?:()=>void,
    className?: string,
    isUploading:boolean,
    queryKey:string[]
}


export default function Cover({url,editable,onChange, className,isUploading}:CoverProps) {
  const [modal ,setModal] = useState<boolean>(false)
  return (
    
    <div className={`${className} overflow-hidden relative rounded-xl w-full `}>
      {isUploading && (
       <div className="relative">
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center z-10">
            <div className="inline-block mx-auto">
            <BounceLoader speedMultiplier={2} color={'#348DFA'} />
            </div>
          </div>

          <CoverPlaceHolder/>
          
        </div>
          )}
      {url&&(
       
          <Image src={url} alt="cover"
            width={800}
            height={200}
            objectFit="cover"
            layout="responsive" 
            className={`${className} xl:-mt-[2rem] w-full h-full bg-blend-overlay g-f:w-auto aspect-6/1  md:aspect-4/1 ${!isUploading?'block':'hidden'}`}
          /> 
          
      )}

      {!url && !isUploading&&(
        <CoverPlaceHolder/>
      )}
     

    {editable &&(
      <div className="absolute right-0 bottom-0 m-2">
          <label className="flex items-center gap-1 bg-white py-1 px-2 rounded-md shadow-md shadow-black cursor-pointer ">
            <button onClick={()=>setModal(!modal)} title="Change cover image"></button>
           
            <HiPhotograph fill="black" className="scale-150"/>
            <p className="text-black font-semibold xl:text-base md:text-md text-xs">Change cover image</p>
          </label>
          {modal &&(
              <CoverModal update={onChange} closeCoverModal={()=>setModal(!modal)} />
            )}
        </div>
    )}
        
  
    </div>
  );
}