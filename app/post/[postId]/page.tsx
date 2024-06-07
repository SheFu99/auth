'use server'

import { getCommentByPost, getPostById } from "@/actions/post";
import { auth } from "@/auth";
import PostCard from "@/components/profile/post/postCard/PostCard";
import Comments from "@/components/profile/post/postCard/lists/Comments";

const PostPage = async ({params}) => {
    const postId = params?.postId
    const post = await getPostById(postId)

    const comments = await getCommentByPost({PostId:postId,page:1})
    console.log(comments)
    console.log(post)

    const session = await auth()
    const user = session?.user

    return ( 

        <div>
            {post?.post&&(
                <div className="border min-h-[85vh]">
                <PostCard postState={[post.post]} currentUser={user} />
                <Comments comments={comments.comments} user={user} commentsCount={post.post?._count?.comments}/>
                </div>
            )}
        </div>
     );
}
 
export default PostPage;