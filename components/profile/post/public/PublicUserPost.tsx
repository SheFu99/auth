

"use client"

import { DeleteUserPosts, GetUserPostsById, LikePost } from "@/actions/UserPosts";
import React, {  useCallback, useState, useTransition } from "react";
import { toast } from "sonner";
import { RiDeleteBin5Line } from "react-icons/ri";
import ImageGrid from "../Image-grid";
import { FaCommentDots } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import LikeButton from "../Like-button";
import PostHeader from "../Post-header";
import CommentForm from "../../forms/CommentForm";
import { DeleteComment, LikeComment } from "@/actions/commentsAction";
import { Comment, post } from "../../../types/globalTs";
import RepostHeader from "../Repost-author-header";
import { ExtendedUser } from "@/next-auth";
import Link from "next/link";
import OneComment from "../postCard/Commnet";
import PostCard from "../postCard/PostCard";
import PostListArchive from "../postCard/archive/PostListArchive";
import { usePosts } from "../lib/usePost";
import PostList from "../postCard/lists/PrivatePostList";
const InfiniteScroll = React.lazy(()=>import ('../functions/infinite-scroll'))
const RepostModalForm = React.lazy(()=>import ('../repostForm'))
// import RepostForm from "./post/repostForm"

///Add optimistic commentSettings

export const awsBaseUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/`

type userListProps ={
    userId:string;
    sessionUser?:ExtendedUser;
}

const PublicPostList :React.FC<userListProps> = ({userId,sessionUser}) => {

const [posts, setPosts]=useState<post[]>([])
const {data,fetchNextPage,hasNextPage,isError,isLoading,isFetched}=usePosts(userId)
console.log(data?.pages[0].totalPostCount)
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
                            user={user}
                    />
                    </div>
                    
                ))}
                    
             
                </>
           </InfiniteScroll>

        </div>
     );
}
 
export default PublicPostList;

