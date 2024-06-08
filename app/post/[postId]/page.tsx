'use server'

import { getCommentByPost, getPostById } from "@/actions/post";
import { auth } from "@/auth";
import { usePost } from "@/components/profile/post/lib/usePost";
import PostCard from "@/components/profile/post/postCard/PostCard";
import InfiniteCommentList from "@/components/profile/post/postCard/lists/InfiniteCommentList";
import queryClientConfig from "@/lib/QueryClient";
import { prefetchCommentList, prefetchPost } from "@/lib/prefetchQuery";
import QueryProvider from "@/util/QueryProvider";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const PostPage = async ({params}) => {
    const postId = params?.postId
    await prefetchPost(postId)
    await prefetchCommentList(postId)
    const post = await getPostById(postId)
    const dehydratedState = dehydrate(queryClientConfig)
    const comments = await getCommentByPost({PostId:postId,page:1})

    const session = await auth()
    const user = session?.user

    return ( 
        <HydrationBoundary state={dehydratedState}>
            <div>
                {post?.post&&(
                    <div className="border min-h-[85vh]">
                    <PostCard postId={postId} currentUser={user} />
                    <InfiniteCommentList postId={postId} user={user} commentsCount={post.post?._count?.comments}/>
                    </div>
                )}
            </div>
        </HydrationBoundary>
     );
}
 
export default PostPage;