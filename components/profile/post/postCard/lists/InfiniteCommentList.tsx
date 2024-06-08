"use client"

import { ExtendedUser } from "@/next-auth";
import InfiniteScroll from "../../functions/infinite-scroll";
import {  useComments } from "../../lib/useComment";
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
                            key={index}
                            />  
                ))}
            </InfiniteScroll>
        </>
    );
}
 
export default InfiniteCommentList;