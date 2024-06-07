
"use clinet"

import { DeleteUserPosts, GetUserPostsById, LikePost } from "@/actions/UserPosts";
import { useCurrentUser } from "@/hooks/use-current-user";
import React, {  Profiler, useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
const InfiniteScroll = React.lazy(()=>import ('../functions/infinite-scroll'))
import { useSession } from "next-auth/react";
import {  Comment, post } from "../../../types/globalTs";
import PostListArchive from "../postCard/archive/PostListArchive";
import { QueryClient, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import PostSkeleton from "../skeleton";
import PostList from "../postCard/lists/PrivatePostList";
import { usePosts } from "../lib/usePost";



export const awsBaseUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/`

type userListProps ={
    profile?:string;
    totalPostCount:number;
    setTotalCount?:(count:number)=>void;
    serverPosts?:post
};



const UserPostList :React.FC<userListProps> = ({profile,totalPostCount,serverPosts,setTotalCount}) => {


const user = useCurrentUser()
    const page = 2
    const queryClient = useQueryClient()
    const {data,fetchNextPage,hasNextPage,isLoading, isError,error,isPending,isSuccess}=usePosts(profile)

    // console.log(data?.pages?.flatMap((page,pageParams)=>page.data.map))
    // console.log("Query Cache: ", queryClient.getQueryData(['posts',profile]));
    
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
                        user={user}
                    />
                </div>
                
            ))}
           
           </InfiniteScroll>

        </div>
     );
}
 
export default UserPostList;

