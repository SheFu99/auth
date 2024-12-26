import OneComment from "../OneComment";
import InViewWrapper from "../helpers/inViewWrapper";
import { usePostCommentMutations } from "../mutations/post_comment_mutations";

const CommentList = ({commentState,currentSession,postId}) => {

    const {deleteComment,likeComment}=usePostCommentMutations(postId)

    return ( 

        <>
        {commentState.length == 0 ?(
                            <div>
                                <p className="font-semibold text-center">Here is no one comment. You can be the first one!</p>
                            </div>
                            ):(
                     commentState?.map((comment, index)=>(
                          <div className={` relative px-5 border-b border-spacing-0 hover:bg-neutral-900 mt-5`} key={index}>
                            <InViewWrapper thresholdPixels={100} key={index}>
                            {(inView)=>(
                            <OneComment 
                                index={index} 
                                comment={comment}   
                                currentSession={currentSession} 
                                onDelete={deleteComment.mutateAsync}
                                onLike={likeComment.mutateAsync}
                                className={`
                                    transition-transform duration-300
                                    ${inView? '' : 'scale-95'}
                                     `}
                                />
                                )}
                                </InViewWrapper>
                        </div>
                    )))}
                    
            </>
     );
}
 
export default CommentList;