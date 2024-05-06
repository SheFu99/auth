"use client"



import EditProfile from "@/components/profile/EditProfile";
import { Provider } from "react-redux";
import { store } from "@/lib/store";





const ProfilePage = () => {

 
    return ( 
      
      
        <div className="">
            <Provider store={store}>
       
            <EditProfile></EditProfile>

            </Provider>
        </div>

      

     );
}
 
export default ProfilePage;