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
  const {update} = useSession()

  // const {upload,switchUpload} = useCurrentProfile()

  const [isUploading,setIsUploading] = useState(false);
  const [modal ,setModal] = useState<boolean>(false)
  const [ratio, setRatio]=useState<number>(4/1)
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

  useEffect(() => {
    const updateSize = () => {
        const width = window.innerWidth;
        if (width < 640) {
            setRatio(4/1);
        } else if (width >= 640 && width < 1024) {
            setRatio(4/1);
        } else {
            setRatio(5/1);
        }
    };

    window.addEventListener('resize', updateSize);
    updateSize();  // Initialize size on first render

    return () => window.removeEventListener('resize', updateSize);
}, []);
 
  return (
    
    <div className={`${className} overflow-hidden relative rounded-xl w-full `}>
      {isUploading && (
       <div className="relative">
          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center z-10">
            <div className="inline-block mx-auto">
            <BounceLoader speedMultiplier={2} color={'#348DFA'} />
            </div>
          </div>

          <svg width="2100" height="150" xmlns="http://www.w3.org/2000/svg">

            <rect width="100%" height="100%" fill="#87CEEB"/>
            <circle cx="1850" cy="30" r="30" fill="#FFD700"/>
            <polygon points="300,150 600,50 900,150" fill="#BDB76B"/>
            <polygon points="1300,150 1600,50 1900,150" fill="#BDB76B"/>

          </svg>
          
        </div>
          )}

      {url&&(
       
          //  <div className="flex justify-center align-middle items-center">
        <AspectRatio ratio={ratio} className="w-full h-0 ">
          <Image src={url} alt="cover"
          width={800}
          height={200}
          objectFit="cover"
          layout="responsive" 
          className={`${className} xl:-mt-[2rem] w-full h-full bg-blend-overlay g-f:w-auto ${!isUploading?'block':'hidden'}`}
          onLoadStart={()=>setIsUploading(true)}
          onLoadingComplete={()=>setIsUploading(false)}
          
          /> 
          </AspectRatio>
        // </div>
          
      )}

      {!url && !isUploading&&(
    <div>
      <style>
        {`
          .dynamic-circle {
            cx: var(--circle-cx, 650); /* Default cx value */
          }
          
          @media (max-width: 768px) { /* Responsive adjustments */
            .dynamic-circle {
              --circle-cx: 750; /* Smaller screens */
            }
          }

          @media (max-width: 640px) {
            .dynamic-circle {
              --circle-cx: 300; /* Even smaller screens */
            }
          }
        `}
      </style>
      <svg width="1000" height="100" viewBox="0 0 1000 100" xmlns="http://www.w3.org/2000/svg">
          <rect width="1000" height="100" fill="#2b2b2b"/>
          <circle className="dynamic-circle" cx="800" cy="30" r="20" fill="#f2f2f2"/>
          <path d="M0,70 Q125,30 250,70 T500,70 T750,70 T1000,70 V100 H0 Z" fill="#1a1a1a"/>
          <path d="M0,80 Q125,50 250,80 T500,80 T750,80 T1000,80 V100 H0 Z" fill="#0d0d0d"/>
          <circle cx="150" cy="30" r="2" fill="#f2f2f2"/>
          <circle cx="180" cy="20" r="1.5" fill="#f2f2f2"/>
          <circle cx="210" cy="40" r="1.2" fill="#f2f2f2"/>
          <circle cx="240" cy="25" r="1.8" fill="#f2f2f2"/>
          <circle cx="270" cy="15" r="1" fill="#f2f2f2"/>


          <circle cx="450" cy="45" r="2" fill="#f2f2f2"/>
          <circle cx="480" cy="40" r="1.5" fill="#f2f2f2"/>
          <circle cx="510" cy="40" r="1.2" fill="#f2f2f2"/>
          <circle cx="540" cy="25" r="1.8" fill="#f2f2f2"/>

      </svg>
     </div>
      )}
     
    {editable &&(
      <div className="absolute right-0 bottom-0 m-2">
          <label className="flex items-center gap-1 bg-white py-1 px-2 rounded-md shadow-md shadow-black cursor-pointer ">
            {/* <input type="file" onChange={updateCover} className="hidden" /> */}
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