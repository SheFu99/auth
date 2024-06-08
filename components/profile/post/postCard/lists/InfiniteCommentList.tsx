"use client"

import { ExtendedUser } from "@/next-auth";
import {  useState } from "react";
import { toast } from "sonner";
import { Comment } from "@/components/types/globalTs";
import InfiniteScroll from "../../functions/infinite-scroll";
import { getCommentByPost } from "@/actions/post";
import OneComment from "../OneComment";
import { CommentQueryPromise, CommentsMutationContext, useComments } from "../../lib/useComment";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteComment, LikeComment } from "@/actions/commentsAction";
import { PostMutationContext } from "../lib/postListMutations";
import { changeLikeCount } from "../lib/changeLikeCount";
import { usePostCommentMutations } from "../lib/singlePostMutations";
import CommentList from "./CommentList";

type commentsParams = {
    user?:ExtendedUser;
    commentsCount:number,
    postId:string
}

const InfiniteCommentList: React.FC<commentsParams> = ({user,postId}) => {


    const {data,isFetched,fetchNextPage,isError,hasNextPage}=useComments(postId)

    const page = data?.pages?.length
 

    
    return (  

        <>
        <InfiniteScroll page={page} loadMore={fetchNextPage} hasMore={hasNextPage} isloaded={isFetched}>
        {data?.pages?.map((page,index)=>(
                     <CommentList 
                        commentState={page.data}
                        currentSession={user}
                        postId={postId}
                          />
                    ))}
        </InfiniteScroll>
        </>
    );
}
 
export default InfiniteCommentList;