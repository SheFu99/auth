"use clinet"


import { GrClose } from "react-icons/gr";
import ImageCropper from "./Image-Cropper";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { BiSolidLandscape } from "react-icons/bi";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useCurrentUser } from "@/hooks/use-current-user";
import { BounceLoader } from "react-spinners";
interface ModalProps {
    updateCover: (newAvatarUrl: Blob) => void;
    closeCoverModal: () => void;
  }


const CoverModal: React.FC<ModalProps>  = ({ closeCoverModal }) => {
  const user = useCurrentUser()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverSrc,setCoverSrc] = useState('')
  const [visable,setVisable]=useState<boolean>(false)
  const {update}=useSession()
  const [uploadError,setUploadError]=useState<boolean>(false)
  const [isUploading,setIsUploading]=useState<boolean>(false)

 const onError =(errors:any)=>{
    if(Object.keys(errors).length){
        setUploadError(true)
        setTimeout(()=>setUploadError(false),1000)
    }
  };

 const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log(file)

         // Create a URL for the selected file
        const imgURL = URL.createObjectURL(file);

        // Create a new image to check dimensions
        const img = new Image();
        img.src = imgURL;
        img.onload = () => {
        const { width, height } = img;
        console.log(width,height)

          
        if (width < 800 || height < 200) {
          setUploadError(true)
            URL.revokeObjectURL(imgURL);  // Clean up the URL object
            event.target.value = '';      
            return;                       
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          setCoverSrc(e.target!.result as string); // Set image source for cropping
          setVisable(true)
            event.target.value = ''; ///clear event cash 
            
        };
        reader.readAsDataURL(file);
        img.onerror = () => {
          onError("Failed to load the image file.");
          URL.revokeObjectURL(imgURL);  // Clean up the URL object
          event.target.value = '';      // Reset the file input
        };
    
        event.target.value = ''; // Clear the input cache after processing to reset the form element
      }
    }
  };

 const resetAvatar = ()=>{
  closeCoverModal
  setCoverSrc("")
  fileInputRef.current?.click()
  };

 const updateCover = async(croppedImageBlob) =>{
   console.log(croppedImageBlob)
  setIsUploading(true)
  const response = await fetch(croppedImageBlob);
  const blob = await response.blob(); // Convert the image URL to a blob for uploading
 


  const formData = new FormData();
  const now = new Date();
  const dateTime = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
  const filename = `cover_${user.id}_${dateTime}.png`;  // Replace spaces with underscores, add current dateTime, and .png extension

formData.append("cover", blob,filename);

try {
  const response = await fetch('/api/s3-upload', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json();
  if (!data.success === true ) {
    setIsUploading(false)
    return {error: "Something wrong!Is no imageURL from server"}
  }else{

    const imageUrl = data.imageUrl 
    console.log(imageUrl)
    if (imageUrl) {
      toast.success('Cover updated successfully.');
      closeCoverModal()
      setIsUploading(false)
      // setImage(imageUrl); // Assuming the response includes the new URL
        update()
    } else {
      setIsUploading(false)
      throw new Error('New cover URL not provided');
    }
  }

} catch (error) {
  console.error('Error updating cover:', error);
  toast.error('Failed to update cover.');
}

  };

 const handleCoverCropped = (croppedImage: string) => {
    setVisable(false)
      updateCover(croppedImage)
    
  };


   
  return (
    <div
      className="relative z-20"
      aria-labelledby="crop-cover-dialog"
      role="dialog"
      aria-modal="true"
    >
        <>
        
      <div className="fixed inset-0  bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
        
      <div className="fixed z-10 overflow-y-auto left-0 right-0 top-40 bottom-0">
      {visable&&(
        <div className="fixed inset-0 w-full h-full z-50">
                  <ImageCropper 
                  image={coverSrc}
                  type="Cover"
                  onImageCropped={handleCoverCropped}
                  closeCroper={()=>setVisable(false)}

                  />
                  </div>
              )}
        <div className="grid grid-col-span-12  min-w-full justify-center px-2 py-12 text-center ">
          <div className="relative  rounded-2xl bg-gray-800 text-slate-100 text-left shadow-xl transition-all">
            <div className="p-10 ">
      
                <div className="align-top ">
                  <span className="text-xs absolute top-3 left-10 right-10 ">
                   The cover will be displayed on your profile page.
                  </span>

                      <button
                        type="button"
                        title="Close modal"
                        className="rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
                        onClick={closeCoverModal}
                      >
                          <GrClose />
                      </button>
                </div>
                
                        
                    <div className="flex justify-center items-center py-5">
                      
                        <label
                          className="p-5 col-start-6  rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 scale-75"
                          title="Change photo"
                          // Use ref to trigger file input click
                        >
                      {isUploading===false?(
                        <div className="flex align-middle items-center justify-center gap-2">
                        <BiSolidLandscape className="scale-100 "/>
                        <span className="text-xl">Upload new cover</span>
                        <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }} 
                              />
                        </div>
                        
                      ):(
                        <BounceLoader  color="white"/>
                      )}
                         

                              
                        </label>
                        </div>
                      <div className="flex justify-center -mb-5">

                        <div className={`w-full flex justify-center items-center gap-2   ${uploadError ? 'animate-shake bg-red-800  p-2  rounded-full' : ''}`}>
                          <ExclamationTriangleIcon className= {`text-destructive text-white ${uploadError ? 'block' : 'hidden'}`} />
                          <span className="text-xs text-white ">
                              Minimum image dimensions  is 800 X 200px
                          </span>
                      </div>
                      </div>
                  {/* <CoverCropper
                    updateCover={updateCover}
                    closeCoverModal={closeCoverModal}
                  /> */}
                
                
            </div>
          </div>
        </div>
      </div>
      </>
    </div>
  );
};
export default CoverModal;