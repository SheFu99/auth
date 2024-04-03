"use client"


import StoreProvider from "@/app/StoreProvider";
import Profile from "@/components/profile/Profile";




const ProfilePage = () => {

 
    return ( 
      <StoreProvider>
      
        <div className="">
            {/* <CreateProfileButton onCreate={() => createUserProfile(data)} /> */}
            {/* <ProfileProvider> */}
            <Profile></Profile>
            {/* </ProfileProvider> */}
        </div>

      </StoreProvider>

     );
}
 
export default ProfilePage;