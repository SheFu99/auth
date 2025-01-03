'use client'

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { RiProfileLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { usePostList } from "./post/lib/usePost";
import { useFriendList } from "../../lib/reactQueryHooks/userFriends";


type TabSwitchProps ={
    chilldrenPosts?:React.ReactNode|React.ReactNode[],
    chilldrenFriends?:React.ReactNode|React.ReactNode[],
    friendsTotal?:number,
    className?:string,
    userId?:string
}

const TabSwitch = ({chilldrenPosts,chilldrenFriends,className,userId}:TabSwitchProps) => {

  const {data,isError}=usePostList(userId)
  const {data:friends,isError:isFriendsErreor}=useFriendList(userId)
  const friendsTotal = friends?.pages[0]?.totalFriendsCount
    return ( 
        <div className={`${className}`}>
         <Tabs defaultId="tab2" >
            <TabsList className=" p-1 rounded-lg flex justify-around flex-wrap mt-1">
                <TabsTrigger id="tab2" className="text-sm font-medium text-center flex gap-2 align-middle items-center justify-center"><RiProfileLine className="-ml-2"/>{data?.pages[0]?.totalPostCount} Posts</TabsTrigger>
                <TabsTrigger id="tab1" className="text-sm font-medium text-center flex gap-2 align-middle items-center justify-center"><FaUser/>{friendsTotal}  Friends</TabsTrigger>
                {/* <TabsTrigger id="tab3" className="text-sm font-medium text-center flex gap-2 align-middle items-center justify-center"><RiGalleryFill/>Gallery</TabsTrigger> */}
            </TabsList>

            <TabsContent id="tab2" className="p-4">
                    {chilldrenPosts}
            </TabsContent>

            <TabsContent id="tab1" className="p-4">
                {chilldrenFriends}
            </TabsContent>
            <TabsContent id="tab3" className="p-4">
                <h1>Content for Tab Three</h1>
                <p>This is the detailed content for Tab Three.</p>
            </TabsContent>
        </Tabs>
        </div>
     );
}
 
export default TabSwitch;