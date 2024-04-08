"use client"
import * as z from 'zod'
import { useEffect, useState } from "react";
import { BsFillPencilFill } from "react-icons/bs";
import Modal from "./Modal";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Cover from "./Cover";
import { getCurrentProfile } from "@/actions/UserProfile";
import { ProfileData } from "@/hooks/use-current-profile";
import { IoMdAddCircleOutline,IoMdAddCircle } from "react-icons/io";
import Image from 'next/image';
import {UserProfile} from '@/schemas/index'
import AboutUser from './info-about';
import { MdEditNote } from 'react-icons/md';
import FirstAndLastNameForm from './FirstAndLastName';


const  Profile =  () => {
  const user = useCurrentUser();
  // const {profile , updateProfile, upload , switchUpload} = useCurrentProfile(); //use redux and localstorage for store
  const [profile, setProfile] = useState<ProfileData>()
  const {update} = useSession()
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionImage, setSessionImage] = useState( user?.image); 
  const [editName , swichEditName] = useState<boolean>(false)
  const [addInfo,swichAddInfo]=useState<boolean>(false)
  

  const fetchProfile = async () => {
    try {
      const profileData = await getCurrentProfile(user?.id!);
      setProfile(profileData as ProfileData);
      
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
} 

  useEffect(()=>{
    fetchProfile();
  },[update]) 


    
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
    
    <div className="col-span-12 grid-row-6 ">
          
          <Cover url={profile?.coverImage!} onChange={update} editable={true} className=" z-1 rounded-md shadow-xs col-span-12"></Cover>
           
            <div className="flex items-center relative ">
                  <div className="absolute md:left-0 md:-bottom-15 m-auto w-fit md:p-[1rem] z-10 -bottom-15 left-0 p-[1rem] justify-center">

                  {sessionImage &&  (
                   <div className="flex justify-center relative rounded-full w-[50px] h-[50px] md:w-[75px] md:h-[75px] ">
                      <Image
                        src={sessionImage}
                        alt='Avatar'
                        // layout="fill"
                        width={75}
                        height={75}
                        className="rounded-full"
                        
                      />
                 </div>
                  )}
                  {!sessionImage&&(
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted p-3">
                      <FaUser className="text-[#3aa29d] w-[50px] h-[50px] md:w-[75px] md:h-[75px] g-f:w-[35px] g-f:h-[35px]"/>
                    </div>
                  )}

                    <button
                      className="absolute bottom-1 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 scale-75"
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
                <button title='Edit your First and Last name' className=' col-start-12 md:ml-5' onClick={()=>swichEditName(!editName)}>
                  <MdEditNote color='black' className="scale-150 "/>
                </button>

                {editName?(
                  ///form component with firstName and lastName
                  <div className='col-span-12'>
                  <FirstAndLastNameForm/>
                  </div>
                ):(
                <div className="lg:ml-5 ml-10 w-full m-auto mt-1 col-start-3 col-span-4 row-start-1 py-2">
                  <h1 className=" text-black font-semibold lg:text-2xl md:-ml-5 md:text-xl sm:-ml-10 -ml-20 text-md g-f:text-nowrap g-f:ml-0 g-f:text-xs">{user?.name}</h1>
                </div>
                )}

                
                
                    
              </div>

      {!profile?.phoneNumber &&(
          <div className='w-full'>
                <div className=" bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 mt-1 rounded-md flex flex-wrap">
                  <p className="text-black font-semibold text-center w-full g-f:text-sm">Add information about your-self </p>
                    <button onClick={()=>swichAddInfo(true)} title='add info about yourself' className='w-full '>
                      <IoMdAddCircleOutline color='black' className=" scale-150 block mb-2 w-full"/>
                    </button>
                </div>
          </div>
       )}
      {/* {addInfo&&(
        ///form component with z.infer.UserProfile
      )} */}
    </div>



  );
};

export default Profile;
