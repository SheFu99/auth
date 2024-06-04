"use client"

import { ExtendedUser } from "@/next-auth";
import {  useState } from "react";
import { toast } from "sonner";
import { Comment } from "@/components/types/globalTs";
import InfiniteScroll from "../../functions/infinite-scroll";
import { getCommentByPost } from "@/actions/post";
import OneComment from "../Commnet";

type commentsParams = {
    comments:Comment[];
    user?:ExtendedUser;
    commentsCount:number
}

const Comments: React.FC<commentsParams> = ({comments,user,commentsCount}) => {
    const [commentState,setComment] = useState<Comment[]>(comments)

    const [page,setPage]=useState<number>(2)
    const [hasMore,setHasMore]=useState<boolean>(true)

    const fetchMoreData = ()=>{
        console.log(commentState.length , commentsCount)
        if(commentState.length>=commentsCount){
            setHasMore(false)
            return
        }
        getCommentByPost({PostId:comments[0]?.postId,page:page})
        .then(response=>{
            setComment((prevValue)=>[...prevValue,...response?.comments]),
            setPage(p=>p+1)
        }).catch(err=>{
            toast.error(err)
        })

        
    }

    
    return (  

        <>
        <InfiniteScroll page={page} loadMore={fetchMoreData} hasMore={hasMore} isloaded={!!commentState}>
        {commentState?.map((comment,index)=>(
                        <div key={index} className="px-5 border-b border-spacing-0 space-y-0  relative hover:bg-neutral-900">
                           <OneComment comment={comment} commentState={commentState} user={user} setComment={setComment}/>
                        </div>
                    ))}
        </InfiniteScroll>
        </>
    );
}
 
export default Comments;