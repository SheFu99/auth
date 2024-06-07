

"use client"

import React from "react";
import { ExtendedUser } from "@/next-auth";
import { usePosts } from "../lib/usePost";
import PostList from "../postCard/lists/PrivatePostList";
const InfiniteScroll = React.lazy(()=>import ('../functions/infinite-scroll'))

export const awsBaseUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/`

type userListProps ={
    userId:string;
    sessionUser?:ExtendedUser;
}

const PublicPostList :React.FC<userListProps> = ({userId,sessionUser}) => {

const {data,fetchNextPage,hasNextPage,isError,isLoading,isFetched}=usePosts(userId)
// console.log(data?.pages[0].totalPostCount)
const page = 2 
const user = sessionUser


           
    return ( 
        <div className="bg-opacity-0  space-y-5 p-1 ">
              {!data&&!isFetched&&(
                    <div className="w-full flex justify-center py-10 items-center align-middle">
                        <p className=" text-neutral-500">The user has no posts...</p>
                    </div>
                )}
            <InfiniteScroll page={page} loadMore={fetchNextPage} hasMore={hasNextPage} isloaded = {!isLoading}>
                <>
                {/* TODO: Need to pass key to parent component  */}
                {data?.pages?.map((page,index)=>(
                    <div key={index}>
                        <PostList
                            postState={page?.data} 
                            currentSession={user}
                            userId={userId}
                    />
                    </div>
                    
                ))}
                    
             
                </>
           </InfiniteScroll>

        </div>
     );
}
 
export default PublicPostList;

