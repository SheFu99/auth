// app/profile/[userId].tsx
"use client"

import PublicProfile from "@/components/profile/PublicProfile";
import { getPublicProfile } from "@/actions/UserProfile";
import { useCallback, useEffect, useState } from "react";
import {  FadeLoader } from "react-spinners";



export default  function PublicProfileParams({ params }) {
  const [profile,setProfile]=useState<any>({})
  
  
  const getProfile= async()=>{
    try {
      const dataFromDb = await getPublicProfile(params.id)
      setProfile(dataFromDb)
      return 
    } catch (error) {
      console.log(error)
      setProfile(undefined)
      return 
    }
  };


    const getMemoProfile = useCallback(async ()=>{
       await getProfile()
      console.log('Get_Profile')
    },[params])
    
    useEffect(()=>{
      getMemoProfile()
    },[getMemoProfile])


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
