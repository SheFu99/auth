"use client"
import React, {useState} from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { BounceLoader } from "react-spinners";
import { HiPhotograph } from "react-icons/hi";
import CoverModal from "./Cover-modal";
import { useCurrentProfile } from "@/hooks/use-current-profile";

type CoverProps = {
    url:string | undefined,
    editable:boolean,
    onChange:()=>void,
    className?: string,
}

type Response = {
  error?: string | undefined;
  success?: string | undefined;
  imageUrl?:string ;

}


export default function Cover({url,editable,onChange, className}:CoverProps) {
  const session = useSession();
  // const {upload,switchUpload} = useCurrentProfile()
  const [isUploading,setIsUploading] = useState(false);
  const [modal ,setModal] = useState<boolean>(false)
  // const {update} = useSession()
  async function updateCover(croppedImageBlob: Blob) {
    const formData = new FormData();
    formData.append("cover", croppedImageBlob);

    try {
      const response = await fetch('/api/s3-upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json();
      if (!data.success === true ) {
        // switchUpload(false)
        return {error: "Something wrong!Is no imageURL from server"}
      }else{

        const imageUrl = data.imageUrl 
        if (imageUrl) {
           // Assuming the response includes the new URL
          //  switchUpload(true)
          toast.success('Cover updated successfully.');
        } else {
          throw new Error('New Cover URL not provided');
        }
      }
    
    } catch (error) {
      console.error('Error updating Cover:', error);
      toast.error('Failed to update Cover.');
    }
    
  }

 
  return (
    
    <div className={`${className} overflow-hidden flex justify-center items-center relative rounded-xl`}>
      
      {url&&(
        <div>
          <img src={url} alt="" className={`${className}  bg-blend-overlay h-[100%]`}/> 
          {/* ///replace on NextImage */}
        </div>
      )}

      {!url&&(
         <div>
         <svg width="2100" height="150" xmlns="http://www.w3.org/2000/svg">

            <rect width="100%" height="100%" fill="#87CEEB"/>
            <circle cx="1850" cy="30" r="30" fill="#FFD700"/>
            <polygon points="300,150 600,50 900,150" fill="#BDB76B"/>
            <polygon points="1300,150 1600,50 1900,150" fill="#BDB76B"/>
           
          </svg>

                  </div>
      )}
      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center z-10">
          <div className="inline-block mx-auto">
          <BounceLoader speedMultiplier={2} color={'#348DFA'} />
          </div>
        </div>
      )}
    {editable &&(
      <div className="absolute right-0 bottom-0 m-2">
          <label className="flex items-center gap-1 bg-white py-1 px-2 rounded-md shadow-md shadow-black cursor-pointer ">
            {/* <input type="file" onChange={updateCover} className="hidden" /> */}
            <button onClick={()=>setModal(!modal)}></button>
           
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