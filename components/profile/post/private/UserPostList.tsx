
"use clinet"

import { useCurrentUser } from "@/hooks/use-current-user";
import React from "react";
const InfiniteScroll = React.lazy(()=>import ('../functions/infinite-scroll'))
import {  post } from "../../../types/globalTs";
import {  useQueryClient } from "@tanstack/react-query";
import PostSkeleton from "../skeleton";
import PostList from "../postCard/lists/PrivatePostList";
import { usePosts } from "../lib/usePost";



export const awsBaseUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/`

type userListProps ={
    profile?:string;
};



const UserPostList :React.FC<userListProps> = ({profile}) => {

console.log(profile)
const user = useCurrentUser()
    const page = 2
    const queryClient = useQueryClient()
    const {data,fetchNextPage,hasNextPage,isLoading, isError,error,isPending,isSuccess}=usePosts(profile)

    return ( 
        <div className="bg-opacity-0  space-y-5 p-1">
                {isLoading&&(
                    <PostSkeleton/>
                )}
            <InfiniteScroll page={page} loadMore={fetchNextPage} hasMore={hasNextPage} isloaded = {isLoading}>
            {data?.pages.map((page,index)=>(
                <div key={index}>
                     <PostList
                        postState={page.data} 
                        currentSession={user}
                        userId={profile}
                    />
                </div>
                
            ))}
           
           </InfiniteScroll>

        </div>
     );
}
 
export default UserPostList;

