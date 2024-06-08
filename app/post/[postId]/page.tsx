'use server'

import { getCommentByPost, getPostById } from "@/actions/post";
import { auth } from "@/auth";
import { usePost } from "@/components/profile/post/lib/usePost";
import PostCard from "@/components/profile/post/postCard/PostCard";
import InfiniteCommentList from "@/components/profile/post/postCard/lists/InfiniteCommentList";
import QueryProvider from "@/util/QueryProvider";

const PostPage = async ({params}) => {
    const postId = params?.postId
    const post = await getPostById(postId)

    const comments = await getCommentByPost({PostId:postId,page:1})

    const session = await auth()
    const user = session?.user

    return ( 

        <div>
            {post?.post&&(
                <div className="border min-h-[85vh]">
                <PostCard postId={postId} currentUser={user} />
                <InfiniteCommentList postId={postId} user={user} commentsCount={post.post?._count?.comments}/>
                </div>
            )}
        </div>
     );
}
 
export default PostPage;