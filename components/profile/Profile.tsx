"use client"

import { useEffect, useState } from "react";
import { BsFillPencilFill } from "react-icons/bs";
import Modal from "./Modal";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Cover from "./Cover";
import { getCurrentProfile } from "@/actions/UserProfile";
import { ProfileData, useCurrentProfile } from "@/hooks/use-current-profile";



const  Profile =  () => {
  const user = useCurrentUser();
  // const {profile , updateProfile, upload , switchUpload} = useCurrentProfile(); //use redux and localstorage for store
  const [profile, setProfile] = useState<ProfileData>()
  const {update} = useSession()
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionImage, setSessionImage] = useState(user?.image || undefined);
  



  useEffect(()=>{
    fetchProfile();
  },[update]) 

  const fetchProfile = async () => {
          try {
            const profileData = await getCurrentProfile(user?.id!);
            setProfile(profileData as ProfileData);
            
          } catch (error) {
            console.error('Failed to fetch profile:', error);
          }
    } 
    
  const updateAvatar = async(croppedImageBlob: Blob) =>{
    const formData = new FormData();
    formData.append("file", croppedImageBlob);

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
        if (imageUrl) {
          setSessionImage(imageUrl); // Assuming the response includes the new URL
            update()
          toast.success('Avatar updated successfully.');
        } else {
          throw new Error('New avatar URL not provided');
        }
      }
    
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar.');
    }
    
    }

 

  return (
    
    <div className="grid grid-cols-12 grid-row-6 ">
     
           
          
          <Cover url={profile?.coverImage!} onChange={update} editable={true} className=" z-1 rounded-md shadow-xs col-span-12"></Cover>
           
            <div className="flex items-center relative">
                  <div className="absolute md:left-0 md:-bottom-20 m-auto w-fit md:p-[1rem] z-10 -bottom-15 left-0 p-[1rem] ">
                    
                    <Avatar className="md:w-[110px] md:h-[110px] w-[75px] h-[75px]">
                      <AvatarImage src={sessionImage}/>
                        <AvatarFallback className="bg-sky-500">
                          <FaUser className="text-white w-20 h-20"/>
                      </AvatarFallback>
                    </Avatar>
                

                    <button
                      className="absolute bottom-2 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 scale-75"
                      title="Change photo"
                      onClick={() => setModalOpen(true)}
                    >
                      <BsFillPencilFill className="grid scale-100"/>
                    </button>
              </div>
            </div>

          {modalOpen && (
            <Modal
              updateAvatar={updateAvatar}
              closeModal={() => setModalOpen(false)}
            />
          )}


      

      <div className=" col-start-1 col-span-12 mt-1  bg-white grid grid-cols-12 rounded-md shadow-md">
        
        <div className="lg:ml-5 ml-10 w-full m-auto mt-1 col-start-3 col-span-4 row-start-1 py-2">
          <p className=" text-black font-semibold lg:text-2xl md:text-sm md:ml-5 text-xs ">{user?.name}</p>
        </div>

        <div className="ml-5 mt-1 col-start-3 col-span-4 row-start-2">
            <p className="text-gray-600 font-serif text-1xl">{profile?.adres}</p>
        </div>    
            
      </div>


    </div>



  );
};

export default Profile;
