'use client'

import React, { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ListSkeleton from "./friends/FriendSkeleton";
import { RiProfileLine } from "react-icons/ri";
import { FaUser } from "react-icons/fa";

type TabSwitchProps ={
    chilldrenPosts?:React.ReactNode|React.ReactNode[],
    chilldrenFriends?:React.ReactNode|React.ReactNode[],
    friendsTotal?:number,
    postTotal?:number,
    className?:string
}

const TabSwitch = ({chilldrenPosts,chilldrenFriends,friendsTotal,postTotal,className}:TabSwitchProps) => {
    return ( 
        <div className={`${className}`}>
         <Tabs defaultId="tab2" >
            <TabsList className=" p-1 rounded-lg flex justify-around flex-wrap mt-1">
                <TabsTrigger id="tab2" className="text-sm font-medium text-center flex gap-2 align-middle items-center justify-center"><RiProfileLine className="-ml-2"/>{postTotal} Posts</TabsTrigger>
                <TabsTrigger id="tab1" className="text-sm font-medium text-center flex gap-2 align-middle items-center justify-center"><FaUser/>{friendsTotal}  Friends</TabsTrigger>
                {/* <TabsTrigger id="tab3" className="text-sm font-medium text-center flex gap-2 align-middle items-center justify-center"><RiGalleryFill/>Gallery</TabsTrigger> */}
            </TabsList>

            <TabsContent id="tab2" className="grid grid-cols-12 ">
                <div className='col-span-12 space-y-5'>
                    <Suspense fallback={<ListSkeleton/>}> 
                    {chilldrenPosts}
                    </Suspense>
                </div>
            </TabsContent>

            <TabsContent id="tab1" className="p-4">

            {/* <Suspense fallback={<ListSkeleton/>}> */}
                {chilldrenFriends}
            {/* </Suspense> */}

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