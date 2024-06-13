"use client"
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { BsFillPencilFill } from "react-icons/bs";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import Cover from "./Cover";
import { getCurrentProfile } from "@/actions/UserProfile";
import ImageCropper from "./cropper/Image-Cropper";
import { BounceLoader } from "react-spinners";
import { ProfileData } from "../types/globalTs";
import {debounce} from 'lodash'
import HeaderAvatar from "../ui/AvatarCoustom";
import ProfileAbout from "./post/ProfileAccordion";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "./post/lib/usePost";
import queryClientConfig from "@/lib/QueryClient";



const  EditProfile =  () => {
  
  const user = useCurrentUser();
  const {data:profileData,isError,isLoading} =useProfile(user?.id)
  const {update} = useSession() ///replace to updateProfile redux hook 
  const [avatarUploading, setAvatarUloading] = useState(false);
  const [sessionImage, setSessionImage] = useState( user?.image); 
  const [imageSrc, setImageSrc] = useState<string>(''); // State to hold the source URL of the image to crop
  const [avatarCropper,setModalAvatarCropper]=useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryKey = ['profile', user?.id]
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
      if (event.target.files && event.target.files[0]) {
          const reader = new FileReader();
          reader.onload = (e) => {
              setImageSrc(e.target!.result as string); // Set image source for cropping
              setModalAvatarCropper(true)
              event.target.value = ''; ///clear event cash 
              
          };
          reader.readAsDataURL(event.target.files[0]);
      }
  };
  const handleAvatarCropped = (croppedImage: string) => {
      setAvatarUloading(true)
      updateAvatar(croppedImage)
  };


  const updateAvatar = async(croppedImageBlob) =>{
      const response = await fetch(croppedImageBlob);
      const blob = await response.blob(); // Convert the image URL to a blob for uploading
      
    const formData = new FormData();
     const now = new Date();
    const dateTime = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    const filename = `${user.name.replace(/\s+/g, '_')}_${dateTime}.png`;  // Replace spaces with underscores, add current dateTime, and .png extension

    formData.append("file", blob,filename);

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
          toast.success('Avatar updated successfully.');
          setSessionImage(imageUrl); // Assuming the response includes the new URL
          setAvatarUloading(false)
          update()
          // switchUpload(true)
        } else {
          setAvatarUloading(false)
          throw new Error('New avatar URL not provided');
        }
      }
    
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar.');
      setAvatarUloading(false)
    }
    
  };///TODO: incapsulate
   const closeAvatarCropper = ()=>{
    setModalAvatarCropper(false)
    setImageSrc("")
  };
   const ChangeAvatar = ()=>{
    setImageSrc("")
    fileInputRef.current?.click()

  };

  const handleCoverChange = () => {
    console.log('HandleCOverChange')
    queryClientConfig.invalidateQueries({queryKey}); 
};

  return (
    
    <div className="col-span-12 grid-row-6 ">
        <div className=''>
          <Cover 
            url={profileData?.coverImage} 
            isUploading={isLoading} 
            onChange={handleCoverChange} 
            editable={true} 
            className=" z-1 rounded-md shadow-xs col-span-12"
            queryKey={queryKey}
            />

           
          <div>

            {avatarCropper && (
                <ImageCropper
                    closeCroper={()=>closeAvatarCropper()}
                    image={imageSrc}
                    type='Avatar'
                    onImageCropped={handleAvatarCropped}
                />
            )}
           
        </div>
          <div className="flex items-center relative ">
                    <div className="absolute md:left-0  m-auto w-fit md:p-[1rem]  md:-bottom-10 -bottom-5 left-3  justify-center z-[50]">
                      {avatarUploading?(
                        <BounceLoader color="white" className="md:-ml-[2px] mr-[1px]"/>
                        ):(
                          <HeaderAvatar
                            src={sessionImage}
                            width={100}
                            height={100}
                            alt={profileData?.firstName}
                        />
                        )}
                      <button
                        className="absolute md:bottom-2 -bottom-2 left-0 right-0  m-auto w-fit p-[.35rem] rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 scale-75 z-40"
                        title="Change photo"
                        onClick={() =>ChangeAvatar() } // Use ref to trigger file input click
                      >
                        <BsFillPencilFill className="grid scale-100"/>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          style={{ display: 'none' }} 
                        />
                      </button>
                </div>
          </div>
        </div>
          
            <ProfileAbout profile={profileData} user={user} />
            
    </div>



  );
};

export default EditProfile;
