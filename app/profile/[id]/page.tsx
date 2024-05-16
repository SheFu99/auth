// app/profile/[userId].tsx
"use client"
import { GetServerSideProps }  from "next";
import { db } from "@/lib/db"; // Ensure db is correctly initialized in this module
import PublicProfile from "@/components/profile/PublicProfile";
import { getDynamicProfile, getProfileById } from "@/actions/UserProfile";
import { useCallback, useEffect, useState } from "react";
import { BounceLoader, FadeLoader } from "react-spinners";

interface Props {
      id?: string;
  };



// export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
//     console.log(context)
//     console.log(context.params) 
//     const { id } = context.params!;
//     const profile = await db.profile.findUnique({
//         where: { userId: id as string },
//     });

//     if (!profile) {
//         return {
//             notFound: true, // Correctly handle the case where no profile is found
//         };
//     }

//     return {
//         props: { profile }, // This must match the Props interface structure
//     };
// };

export default  function PublicProfileParams({ params }) {

  const [profile,setProfile]=useState<any>({})
  
  

  const getProfile= async()=>{
    
    try {
      const profile = await getDynamicProfile(params.id)
      setProfile(profile)
      return profile
    } catch (error) {
      console.log(error)
      setProfile(undefined)
      return undefined
    }
   
  }

 const getMemoProfile = useCallback(()=>{
  getProfile()
 },[params])
 
useEffect(()=>{
  getMemoProfile()
},[getMemoProfile])

// useEffect(()=>{console.log(profile)},[profile])

if(!profile){
  return <FadeLoader color="white"/>
}

if(profile?.error){
  return <p>Profile not found</p>
}
 
    return (
      <div>
         <PublicProfile profile={profile}  /> 
      </div>
      
      );
}
