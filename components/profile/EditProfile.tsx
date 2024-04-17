"use client"
import { useEffect, useRef, useState } from "react";
import { BsFillPencilFill } from "react-icons/bs";
import AvararModal from "./cropper/Modal";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";
import Cover from "./Cover";
import { getProfileById } from "@/actions/UserProfile";
import { ProfileData } from "@/hooks/use-current-profile";
import { IoMdAddCircleOutline } from "react-icons/io";
import Image from 'next/image';
import UserProfileForm from './forms/UserProfileForm';
import { RiGalleryFill, RiProfileLine } from 'react-icons/ri';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import UserPostForm from './forms/UserPostForm';
import UserPostList from './forms/UserPostList';
import ImageCropper from "./cropper/New-cropper";
import ImageCropperr from "./cropper/New-cropper";


const  EditProfile =  () => {
  
  const user = useCurrentUser();
  // const {profile , updateProfile, upload , switchUpload} = useCurrentProfile(); //use redux and localstorage for store
  const [profile, setProfile] = useState<ProfileData>()
  const {update} = useSession()
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionImage, setSessionImage] = useState( user?.image); 
  const [editName , swichEditName] = useState<boolean>(false)
  const [addInfo,swichAddInfo]=useState<boolean>(false)
  const [imageSrc, setImageSrc] = useState<string>(''); // State to hold the source URL of the image to crop
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>(); // State to hold the cropped image URL
  const [cropType, setCropType] = useState<'Avatar' | 'Cover' | 'Post'>('Avatar'); // State to select the crop type
  const [avatarCropper,setModalAvatarCropper]=useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [blob,setBlob]=useState<Blob>()

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
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

  const handleImageCropped = (croppedImage: string) => {

    console.log(croppedImage)
      setCroppedImageUrl(croppedImage); 
      // Handle the cropped image URL
      updateAvatar(croppedImage)
      
  };

  const fetchProfile = async () => {
      try {
        const profileData = await getProfileById(user?.id!);
        console.log('profilefetched',profileData )
        setProfile(profileData as ProfileData);
        
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
  } 
  useEffect(()=>{
    fetchProfile();
    // if(!profile?.phoneNumber){
    //   swichUserEditState(true)
    // }
  },[update]) 

  // useEffect(()=>{
  //   console.log(profile?.phoneNumber)
  // },[addInfo])

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
            update()
        } else {
          throw new Error('New avatar URL not provided');
        }
      }
    
    } catch (error) {
      console.error('Error updating avatar:', error);
      toast.error('Failed to update avatar.');
    }
    
    }

   const closeAvatarCropper = ()=>{
    setModalAvatarCropper(false)
    setImageSrc("")
   }

   const resetAvatar = ()=>{
    setImageSrc("")
    fileInputRef.current?.click()

   }
     
      

    

  return (
    
    <div className="col-span-12 grid-row-6 ">
        <div className=''>
          <Cover url={profile?.coverImage!} onChange={update} editable={true} className=" z-1 rounded-md shadow-xs col-span-12"></Cover>
          <div>
            {avatarCropper && (
                <ImageCropperr
                    closeCroper={()=>closeAvatarCropper()}
                    image={imageSrc}
                    type='Avatar'
                    onImageCropped={handleImageCropped}
                />
            )}
           
        </div>
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
                      onClick={() =>resetAvatar() } // Use ref to trigger file input click
                    >
                      <BsFillPencilFill className="grid scale-100"/>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }} 
                      />
                    </button>

              </div>

           
            </div>
        </div>
          {modalOpen && (
            <AvararModal
              updateAvatar={updateAvatar}
              closeModal={() => setModalOpen(false)}
            />
          )}

            <div className=" col-start-1 col-span-12 mt-1  bg-white  rounded-md shadow-md">

                  {/* <div className='col-span-12'>
                    <FirstAndLastNameForm userName={user?.name} editState={true}/>
                  </div> */}

              <div className=''>
                  <Accordion type="single" collapsible className='p-2'>
                    <AccordionItem value="item-1" >
                      <AccordionTrigger className='text-black  font-semibold flex justify-between p-1 md:text-xl g-f:text-sm md:ml-0 g-f:ml-2'>{user?.name}</AccordionTrigger>
                        <AccordionContent>
                            {!addInfo && profile?.phoneNumber===undefined ?(

                              <div className='w-full'>
                                    <div className=" bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 mt-1 rounded-md flex w-full flex-wrap justify-center">
                                      <p className="text-black font-semibold text-center w-full g-f:text-sm">Add information about your-self </p>
                                        <button onClick={()=>swichAddInfo(true)} title='add info about yourself' >
                                          <IoMdAddCircleOutline color='black' className=" scale-150 block w-full"/>
                                        </button>
                                    </div>
                              </div>
                            ):(  <UserProfileForm profile={profile} editProfileProps={true}  onChange={()=>swichAddInfo(false)} />
                          )}

                       
                           

                        </AccordionContent>
                    </AccordionItem>
                  </Accordion>
              </div>
                  
            </div>

        <Tabs defaultId="tab1" >
            <TabsList className=" p-1 rounded-lg flex justify-around flex-wrap mt-1">
                <TabsTrigger id="tab1" className="text-sm font-medium text-center flex gap-2 align-middle items-center"><RiProfileLine/>Posts</TabsTrigger>
                <TabsTrigger id="tab2" className="text-sm font-medium text-center flex gap-2 align-middle items-center"><FaUser/>Friends</TabsTrigger>
                <TabsTrigger id="tab3" className="text-sm font-medium text-center flex gap-2 align-middle items-center"><RiGalleryFill/>Gallery</TabsTrigger>
            </TabsList>

            <TabsContent id="tab1" className="grid grid-cols-12 ">
                
            <div className='col-span-12 space-y-5'>
                <UserPostForm />
                <UserPostList/>  
            </div>
                    
            </TabsContent>

            <TabsContent id="tab2" className="p-4">
                <h1>Content for Tab Two</h1>
                <p>This is the detailed content for Tab Two.</p>
            </TabsContent>
            <TabsContent id="tab3" className="p-4">
                <h1>Content for Tab Three</h1>
                <p>This is the detailed content for Tab Three.</p>
            </TabsContent>
        </Tabs>

   
       
        

      
    </div>



  );
};

export default EditProfile;
