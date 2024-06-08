import { Comment } from "@/components/types/globalTs";
import { ExtendedUser } from "@/next-auth";
import { RiDeleteBin5Line } from "react-icons/ri";
import PostHeader from "../Post-header";
import ImageGrid from "../Image-grid";
import LikeButton from "../Like-button";
import {  useTransition } from "react";

import { toast } from "sonner";
import { awsBaseUrl } from "./lists/InfinitePostList";


interface CommentProps {
    currentSession?:ExtendedUser,
    comment?:Comment,
    className?:string,
    index:number,
    userId?:string,
    onLike:(commentId:string)=> void;
    onDelete:(params:deleteParams)=> void;
}
type deleteParams = {
    commentId:string,
    keys?: any
}

const OneComment = ({currentSession,comment,className,index,onLike,onDelete}:CommentProps) => {
    
    const [isPending, startTransition]=useTransition()

     const CommentLike =  (comment:Comment) => {
        const commentId = comment.CommentId
        if (!currentSession) {
            toast.error("You need to be authorized!");
            return;
        }
        startTransition(()=>{

            onLike(commentId);
        })
    };
    const DeleteCommentFunction = (comment:Comment) =>{
        const keys:any = comment?.image?.map(item => {
            const result = item.url.split(awsBaseUrl)[1];
            return result
          });
          onDelete({commentId:comment.CommentId, keys:keys})
    };

    return ( 
     

        <div className={`${className} relative -mt-5 py-5 px-4`} key={index||1}>
             {currentSession?.id === comment.userId&&(
                                <button title="delete commetn" 
                                className="text-black absolute right-1"
                                onClick={()=>DeleteCommentFunction(comment)}
                                >
                                    <RiDeleteBin5Line color="white"/>
                                </button>
                            )}
                            <div className="">
                            <PostHeader 
                                author={comment?.user} 
                                timestamp={comment?.timestamp} />
                                
                                <p className="text-white ml-[3rem]">{comment?.text}</p>
                                
                                <ImageGrid 
                                    images={comment?.image} 
                                    className={' ml-[3rem]'}
                                    />

                                <div className=" ">
                                    <LikeButton 
                                        className="bg-neutral-900 px-3 " 
                                        post={comment} 
                                        onLike={()=>CommentLike(comment)} 
                                        isPending={isPending}
                                        />
                                </div>
                            </div>
                            
        </div>
     );
}
 
export default OneComment;