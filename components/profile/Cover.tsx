"use client"
import React, {useEffect, useState} from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { BounceLoader } from "react-spinners";
import { HiPhotograph } from "react-icons/hi";
import CoverModal from "./cropper/Cover-modal";
import Image from "next/image";
import { S3Response } from "@/app/api/s3-upload/route";
import { AspectRatio } from "../ui/aspect-ratio";
import CoverPlaceHolder from "./post/lib/coverPlaceHolder";

type CoverProps = {
    url?:string | null ,
    editable:boolean,
    onChange?:()=>void,
    className?: string,
}


export default function Cover({url,editable,onChange, className}:CoverProps) {
  const {update} = useSession()

  const [isUploading,setIsUploading] = useState(false);
  const [modal ,setModal] = useState<boolean>(false)

  async function updateCover(croppedImageBlob: Blob) {
    console.log(croppedImageBlob)
    const formData = new FormData();
          formData.append("cover", croppedImageBlob);

    try {
      setIsUploading(true)
      const response = await fetch('/api/s3-upload', {
        method: 'POST',
        body: formData,
      })

            const data:S3Response = await response.json();
            
            if (!data.success === true ) {
              // switchUpload(false)
              return {error: "Something wrong!Is no imageURL from server"}
            }else{

              const imageUrl = data.imageUrl 
              if (imageUrl) {
                // Assuming the response includes the new URL
                //  switchUpload(true)
                update()
                toast.success('Cover updated successfully.');
              } else {
                throw new Error('New Cover URL not provided');
              }
            }
    
    } catch (error) {
      console.error('Error updating Cover:', error);
      toast.error('Failed to update Cover.');
    }finally{
      setIsUploading(false)
    }
    
  }
  useEffect(()=>{
    setIsUploading(!isUploading)
  },[url]) 

 
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
            onLoadStart={()=>setIsUploading(true)}
            onLoadingComplete={()=>setIsUploading(false)}
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
              <CoverModal updateCover={updateCover} closeCoverModal={()=>setModal(!modal)} />
            )}
        </div>
    )}
        
  
    </div>
  );
}