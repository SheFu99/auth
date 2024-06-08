import OneComment from "../OneComment";
import { usePostCommentMutations } from "../lib/singlePostMutations";

const CommentList = ({commentState,currentSession,postId}) => {

    const {deleteComment,likeComment}=usePostCommentMutations(postId)

    return ( 

        <>
        {commentState?.map((comment, index)=>(
                        <div className="px-5 border-b border-spacing-0 space-y-0  relative hover:bg-neutral-900">
                            <OneComment 
                                index={index} 
                                comment={comment}   
                                currentSession={currentSession} 
                                onDelete={deleteComment.mutateAsync}
                                onLike={likeComment.mutateAsync}
                                />
                        </div>
                    ))}
            </>
     );
}
 
export default CommentList;