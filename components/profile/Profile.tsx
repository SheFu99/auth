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
import ContactInformation from './Contact-information';
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
      console.log('profilefetched',profileData )
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

              <div className=" col-start-1 col-span-12 mt-1  bg-white  rounded-md shadow-md">
               

               
              
                  <div className='col-span-12'>
                  <FirstAndLastNameForm userName={user.name} editState={true}/>
                  </div>
               

                
                
                    
              </div>

      {!profile?.phoneNumber &&(
          <div className='w-full'>
                <div className=" bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 mt-1 rounded-md flex w-full flex-wrap justify-center">
                  <p className="text-black font-semibold text-center w-full g-f:text-sm">Add information about your-self </p>
                    <button onClick={()=>swichAddInfo(true)} title='add info about yourself' >
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
