// app/profile/[userId].tsx
"use client"

import PublicProfile from "@/components/profile/PublicProfile";
import { getDynamicProfile, getProfileById } from "@/actions/UserProfile";
import { useCallback, useEffect, useState } from "react";
import {  FadeLoader } from "react-spinners";

interface Props {
      id?: string;
  };

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
