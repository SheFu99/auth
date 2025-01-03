'use client'

import {useState } from "react";
import SearchStateFilter from "@/components/search/user/SearchStateFilter";

import FriendList from "./FriendsList";
import PostSkeleton from "../post/skeleton";
import QueryProvider from "@/util/QueryProvider";
import { useFriendList, useFriendsSearch } from "../../../lib/reactQueryHooks/userFriends";


interface props {
    search?:string,
    profileId:string,
}
const PublicProfileFriends:React.FC<props> = ({profileId}) => {
    console.log("props",profileId)
    const {data,isError,isLoading}=useFriendList(profileId)

    const [searchState,setSearch]=useState('')
    // const search = searchState.toLowerCase()
    
        const { 
            data: searchResult,
            isError: searchError,
            isLoading: searchPending,
            fetchNextPage,
            hasNextPage,
            isFetched
            }=useFriendsSearch({profileId,name:searchState})
  
    const flatPages = searchResult?.pages?.flatMap(pages=>pages.data)
   const flatData = data?.pages?.flatMap(pages=>pages.data)
   
    const isSearchResult = searchResult?.pages[0].data !== null 
    console.log("CURSOR on Frontend",flatData)

    ///TEST: in production check how is work <Link with next auth session 

    return ( 
        <QueryProvider>
        <div className=" w-full space-y-2">
            <SearchStateFilter setSearch={setSearch} search={searchState} />
            {isSearchResult&&isFetched&&(
                <FriendList friendList={flatPages}/>
            )}
            {!isSearchResult&&!searchPending&&flatData&&(
                <FriendList friendList={flatData}/>
            )}
            {searchPending||isLoading&&(
                <PostSkeleton/>
            )}
        </div>
        </QueryProvider>
     );
}
 
export default PublicProfileFriends;