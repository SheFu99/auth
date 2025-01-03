"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaUser } from "react-icons/fa";
import { RiGalleryFill, RiProfileLine } from "react-icons/ri";
import PostModal from "../cropper/Post-modal";

import { Suspense } from "react";
import ListSkeleton from "../friends/FriendSkeleton";
import PrivateUserFriends from "../friends/private/privateUserFriends";
import { usePostList } from "../post/lib/usePost";
import InfinitePostList from "../post/postCard/lists/InfinitePostList";
import { useCurrentUser } from "@/hooks/use-current-user";

import SearchUsers from "@/app/profile/[id]/searchFriends";
import { ExtendedUser } from "@/next-auth";
import SearchResultOrFriendList from "@/components/search/user/SearchResult";
import { useFriendList } from "../../../lib/reactQueryHooks/userFriends";



interface profileTabsProps {
  userId:string,
  searchParams?:string,
  searchResult?:ExtendedUser[]
}

const ProfileTabs = ({userId,searchParams,searchResult}:profileTabsProps) => {
  const user = useCurrentUser()
  const {data} = usePostList(userId)
  const {data:friendsList,hasNextPage}=useFriendList(userId)
  // console.log('friendsList',hasNextPage)
    return (  
        <Tabs defaultId="tab1" >
        <TabsList className=" p-1 rounded-lg flex  flex-wrap mt-1">
            <TabsTrigger id="tab1" className="text-sm font-medium text-center flex gap-2 align-middle items-center justify-center">
              <RiProfileLine/>{data?.pages[0]?.totalPostCount || 0} Posts</TabsTrigger>
            <TabsTrigger id="tab2" className="text-sm font-medium text-center flex gap-2 align-middle items-center justify-center">
              <FaUser/>{friendsList?.pages[0]?.totalFriendsCount} Friends</TabsTrigger>
            <TabsTrigger id="tab3" className="text-sm font-medium text-center flex gap-2 align-middle items-center justify-center">
              <RiGalleryFill/>Gallery</TabsTrigger>
        </TabsList>

        <TabsContent id="tab1" className="grid grid-cols-12 ">
            
        <div className='col-span-12 space-y-5'>
            <PostModal/>
              <InfinitePostList userId={userId} sessionUser={user} />  
        </div>
        </TabsContent>

        <TabsContent id="tab2" className="p-4">

            <div className="mb-2 -mt-2">
              <SearchUsers search={searchParams}/>
            </div>
            {searchResult?(
              <SearchResultOrFriendList searchResult={searchResult}/>
            ):(
              <div className="">
                <PrivateUserFriends/>
              </div>
            )}
        </TabsContent>
        <TabsContent id="tab3" className="p-4">
            <h1>Content for Tab Three</h1>
            <p>This is the detailed content for Tab Three.</p>
        </TabsContent>
    </Tabs>

    );
}
 
export default ProfileTabs;