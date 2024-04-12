// app/profile/[userId].tsx
"use client"
import { GetServerSideProps }  from "next";
import { db } from "@/lib/db"; // Ensure db is correctly initialized in this module
import PublicProfile from "@/components/profile/PublicProfile";
import { getDynamicProfile, getProfileById } from "@/actions/UserProfile";
import { useEffect, useState } from "react";
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
  const [profile,setProfile]=useState({})
  
  console.log(params) 

  const getProfile= async()=>{
    const profile = await getDynamicProfile(params.id)
    console.log(profile)
    setProfile(profile)
  }

 
 
useEffect(()=>{
  console.log(params)
  getProfile()
 
},[params])

useEffect(()=>{console.log(profile)},[profile])

if(!profile){
  return <FadeLoader color="white"/>
}
 
    return (
      <div>
         <PublicProfile profile={profile}  /> 
      </div>
      
      );
}
