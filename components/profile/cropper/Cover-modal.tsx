"use clinet"
import CoverCropper from "./Cover-cropper";

import { GrClose } from "react-icons/gr";
import ImageCropperr from "./New-cropper";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { BiSolidLandscape } from "react-icons/bi";
interface ModalProps {
    updateCover: (newAvatarUrl: Blob) => void;
    closeCoverModal: () => void;
  }


const CoverModal: React.FC<ModalProps>  = ({ closeCoverModal }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverSrc,setCoverSrc] = useState('')
  const [visable,setVisable]=useState<boolean>(false)
  const {update}=useSession()

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => { 
    if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCoverSrc(e.target!.result as string); // Set image source for cropping
          setVisable(true)
            event.target.value = ''; ///clear event cash 
            
        };
        reader.readAsDataURL(event.target.files[0]);
    }
  };

const resetAvatar = ()=>{
  closeCoverModal
  setCoverSrc("")
  fileInputRef.current?.click()
 }

 const updateCover = async(croppedImageBlob) =>{
 
  const response = await fetch(croppedImageBlob);
  const blob = await response.blob(); // Convert the image URL to a blob for uploading
 


const formData = new FormData();
 const now = new Date();
const dateTime = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
const filename = `cover_${dateTime}.png`;  // Replace spaces with underscores, add current dateTime, and .png extension

formData.append("cover", blob,filename);

try {
  const response = await fetch('/api/s3-upload', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json();
  if (!data.success === true ) {
    return {error: "Something wrong!Is no imageURL from server"}
  }else{

    const imageUrl = data.imageUrl 
    console.log(imageUrl)
    if (imageUrl) {
      toast.success('Cover updated successfully.');
      // setImage(imageUrl); // Assuming the response includes the new URL
        update()
    } else {
      throw new Error('New cover URL not provided');
    }
  }

} catch (error) {
  console.error('Error updating cover:', error);
  toast.error('Failed to update cover.');
}

}

 const handleCoverCropped = (croppedImage: string) => {
  setVisable(true)
  console.log(croppedImage)
    // Handle the cropped image URL
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
        
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center px-2 py-12 text-center ">
          <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-gray-800 text-slate-100 text-left shadow-xl transition-all">
            <div className="px-5 py-4">

            <button
                type="button"
                className="rounded-md p-1 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none absolute top-2 right-2"
                onClick={closeCoverModal}
              >
                <span className="sr-only">Close menu</span>
                <GrClose />
              </button>
                <button
                      className="absolute bottom-2 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 scale-75"
                      title="Change photo"
                      onClick={() =>resetAvatar() } // Use ref to trigger file input click
                    >
                      <BiSolidLandscape className="grid scale-100"/>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }} 
                      />
                    </button>
              {/* <CoverCropper
                updateCover={updateCover}
                closeCoverModal={closeCoverModal}
              /> */}
              {visable&&(
                  <ImageCropperr 
                  image={coverSrc}
                  type="Cover"
                  onImageCropped={handleCoverCropped}
                  closeCroper={()=>setVisable(false)}

                  />
              )}
             
            </div>
          </div>
        </div>
      </div>
      </>
    </div>
  );
};
export default CoverModal;