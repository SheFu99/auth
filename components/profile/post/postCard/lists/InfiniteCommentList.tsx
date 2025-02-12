"use client"

import { ExtendedUser } from "@/next-auth";
import InfiniteScroll from "../../functions/infinite-scroll";
import {  useComments } from "../../lib/useComment";
import CommentList from "./CommentList";
import InViewWrapper from "../helpers/inViewWrapper";

type commentsParams = {
    user?:ExtendedUser;
    postId:string
}

const InfiniteCommentList: React.FC<commentsParams> = ({user,postId}) => {


    const {data,isFetched,fetchNextPage,isError,hasNextPage}=useComments(postId)

    const page = data?.pages?.length
    const debugHasNextPage = hasNextPage
    // console.log(data.pages[0].totalCommentsCount)
    
    return (  

        <>
            <InfiniteScroll  loadMore={fetchNextPage} hasMore={hasNextPage} isloaded={isFetched}>
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