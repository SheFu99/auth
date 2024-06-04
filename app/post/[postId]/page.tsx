'use server'

import { getCommentByPost, getPostById } from "@/actions/post";
import { auth } from "@/auth";
import Comments from "@/components/profile/post/postCard/lists/Comments";
import PostCardWithState from "@/components/profile/post/postCard/PostCardWithState";

const PostPage = async ({params}) => {
    // console.log(params)
    const postId = params?.postId
    const post = await getPostById(postId)
    console.log(post)

    const comments = await getCommentByPost({PostId:postId,page:1})
    console.log(comments)
    const session = await auth()
    const user = session?.user

    return ( 

        <div>
            {post?.post&&(
                <div className="border min-h-[85vh]">
                <PostCardWithState post={post.post} user={user}/>
                <Comments comments={comments.comments} user={user} commentsCount={post.post?._count?.comments}/>
                </div>
            )}
        </div>
     );
}
 
export default PostPage;