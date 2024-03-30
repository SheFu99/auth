"use client"

import { useEffect, useState } from "react";
import { BsFillPencilFill } from "react-icons/bs";
import Modal from "./Modal";
import { useCurrentUser } from "@/hooks/use-current-user";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaUser } from "react-icons/fa";
import { useSession } from "next-auth/react";


type Response = {
    success?:string,
    imageUrl?:string,
    error?:string
}
const Profile = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const user = useCurrentUser();
  const [sessionImage, setSessionImage] = useState(user?.image || undefined);
 const {update} = useSession()
  async function updateAvatar(croppedImageBlob: Blob) {
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
    <div className="flex flex-col items-center pt-12 bg-slate-900 rounded-md min-h-80">
      <div className="relative">
        <Avatar className="w-[100px] h-[100px]">
          <AvatarImage src={sessionImage}/>
          <AvatarFallback className="bg-sky-500">
            <FaUser className="text-white w-20 h-20"/>
          </AvatarFallback>
        </Avatar>
        <button
          className="absolute -bottom-3 left-0 right-0 m-auto w-fit p-[.35rem] rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600"
          title="Change photo"
          onClick={() => setModalOpen(true)}
        >
          <BsFillPencilFill />
        </button>
      </div>
      <h2 className="text-white font-bold mt-6">{user?.name}</h2>
      <p className="text-gray-500 text-xs mt-2">{user?.email}</p>
      {modalOpen && (
        <Modal
          updateAvatar={updateAvatar}
          closeModal={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Profile;
