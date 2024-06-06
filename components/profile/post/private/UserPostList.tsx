
"use clinet"

import { DeleteUserPosts, GetUserPostsById, LikePost } from "@/actions/UserPosts";
import { useCurrentUser } from "@/hooks/use-current-user";
import React, {  Profiler, useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
const InfiniteScroll = React.lazy(()=>import ('../functions/infinite-scroll'))
import { useSession } from "next-auth/react";
import {  Comment, post } from "../../../types/globalTs";
import PostList from "../postCard/lists/PostList";
import { QueryClient, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import PostSkeleton from "../skeleton";
import PrivatePostList from "./PrivatePostList";
import { usePosts } from "../lib/usePost";



export const awsBaseUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/`

type userListProps ={
    profile?:string;
    totalPostCount:number;
    setTotalCount?:(count:number)=>void;
    serverPosts?:post
};



const UserPostList :React.FC<userListProps> = ({profile,totalPostCount,serverPosts,setTotalCount}) => {

const [posts, setPosts]=useState<post[]>()
const {update}=useSession()

const [hasMore,setHasMore]= useState(true)
const [page,setPage]=useState(2)
const [isloading,setIsLoading] = useState(true)
const user = useCurrentUser()

// useEffect(()=>{console.log(posts)},[posts])

///load user post from server 
const debouncedGetPost = useCallback(()=>{
    GetUserPostsById(profile,1).then(posts => {setTotalCount(posts?.totalPostCount),setPosts(posts?.posts),setIsLoading(false)})
    console.log('GET_ON_SERVER')
},[])

    useEffect(()=>{
        debouncedGetPost()
    },[profile])

        // const fetchMoreData = async ()=>{
        //     if(isloading){
        //         return
        //     }
        //     if(posts?.length>=totalPostCount ){
        //         setHasMore(false)
        //         return
        //     }
        //     console.log(page)
        //     setIsLoading(true)
        //     GetUserPostsById(profile,page)
        //     .then(posts=>{
        //         if(posts.posts){
        //             setPosts(prev=>[...prev,...posts?.posts])
        //             setPage(prev=>prev+1); 

        //         }
        //     })
        //     .catch(err=>{
        //         toast.error(err)
        //     })
        //     .finally(()=>{
        //          setIsLoading(false)
        //         })
        // };
  
        const queryClient = useQueryClient()

    const {data,fetchNextPage,hasNextPage,isLoading, isError,error,isPending,isSuccess}=usePosts(profile)
    console.log(data?.pages)
    console.log(data?.pages?.flatMap((page,pageParams)=>page.data))
    console.log("Query Cache: ", queryClient.getQueryData(['posts',profile]));
    
    return ( 
        <div className="bg-opacity-0  space-y-5 p-1">
              {/* {!posts&&profile&&(
                    <div className="w-full flex justify-center py-10 items-center align-middle">
                        <p className=" text-neutral-500">The user has no posts...</p>
                    </div>
                )} */}

                {isLoading&&(
                    <PostSkeleton/>
                )}

            <InfiniteScroll page={page} loadMore={fetchNextPage} hasMore={hasNextPage} isloaded = {isLoading}>
            {data?.pages.map((page,index)=>(
                <div key={index}>
                     <PrivatePostList
                 // key={index}
                 setPost={setPosts}
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

