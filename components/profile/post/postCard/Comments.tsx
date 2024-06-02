"use client"
import { DeleteComment, LikeComment } from "@/actions/commentsAction";

import { ExtendedUser } from "@/next-auth";
import { startTransition, useState, useTransition } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { toast } from "sonner";
import PostHeader from "../Post-header";
import ImageGrid from "../Image-grid";
import LikeButton from "../Like-button";
import { awsBaseUrl } from "../private/UserPostList";
import { Comment } from "@/components/types/globalTs";
import InfiniteScroll from "../functions/infinite-scroll";
import { getCommentByPost } from "@/actions/post";
import { Comment } from "postcss";
import OneComment from "./Commnet";

type commentsParams = {
    comments:Comment[];
    user?:ExtendedUser;
    commentsCount:number
    id?:number;
}

const Comments: React.FC<commentsParams> = ({comments,user,commentsCount,id}) => {
    const [commentState,setComment] = useState<Comment[]>(comments)
    const [isPending,startTransition] = useTransition()

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
        {commentState.map((comment,index)=>(
                        <div key={index} className="px-5 border-b -mb-5 py-5 relative hover:bg-neutral-900">
                           <OneComment comment={comment} commentState={commentState} user={user} setComment={setComment}/>
                        </div>
                    ))}
        </InfiniteScroll>
        </>
    );
}
 
export default Comments;