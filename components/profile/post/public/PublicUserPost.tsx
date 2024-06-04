

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
import PostList from "../postCard/lists/PostList";
const InfiniteScroll = React.lazy(()=>import ('../functions/infinite-scroll'))
const RepostModalForm = React.lazy(()=>import ('../repostForm'))
// import RepostForm from "./post/repostForm"

///Add optimistic commentSettings

export const awsBaseUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/`

type userListProps ={
    postList:post[];
    totalCount:number;
    userId:string;
    sessionUser?:ExtendedUser;
}

const PublicPostList :React.FC<userListProps> = ({postList,totalCount,userId,sessionUser}) => {
const [posts, setPosts]=useState<post[]>(postList)


const [hasMore,setHasMore]= useState<boolean>(true)
const [page,setPage]=useState<number>(2)

const user = sessionUser

let PostCache
const fetchMoreData = useCallback(async ()=>{
    if(posts?.length>=totalCount){
        setHasMore(false)
        return
    }
    if(PostCache === page){
        return
    }
    PostCache=page
    GetUserPostsById(userId,page)
    .then(posts=>{
        setPage(prev=>prev+1),
        setPosts(prev=>[...prev,...posts?.posts])
       
    })
    .catch(err=>{
        toast.error(err)
    })
    
},[page]);


           
    return ( 
        <div className="bg-opacity-0  space-y-5 p-1 ">
              {!posts&&postList&&(
                    <div className="w-full flex justify-center py-10 items-center align-middle">
                        <p className=" text-neutral-500">The user has no posts...</p>
                    </div>
                )}
            <InfiniteScroll page={page} loadMore={fetchMoreData} hasMore={hasMore} isloaded = {!!posts}>
                <>
                {/* TODO: Need to pass key to parent component  */}
                    <PostList 
                        // key={index}
                        setPost={setPosts}
                        postState={posts} 
                        user={user}
                        />
             
                </>
           </InfiniteScroll>

        </div>
     );
}
 
export default PublicPostList;

