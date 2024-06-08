import { getCommentByPost } from "@/actions/post";
import { Comment } from "@/components/types/globalTs"
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";


export type CommentQueryPromise = {
    data: Comment[],
    nextPage:number,
    totalCommentsCount:number,
};
export interface CommentsMutationContext {
    preveousComments: InfiniteData<CommentQueryPromise> | undefined;
}

export const fetchComments = async ({page=1,PostId}):Promise<CommentQueryPromise>=>{
 
    console.log("COMMENTS_GET")
    const data = await getCommentByPost({PostId:PostId,page:page});

    if(data.error){
        throw new Error ("Network error")
    }
    return {
        data:data.comments,
        nextPage: page + 1,
        totalCommentsCount:data.totalCommentsCount
    };
};

export const useComments = (PostId:string)=>{

    return useInfiniteQuery({
        queryKey: ['comments',PostId],
        queryFn: ({pageParam=1})=>fetchComments({page:pageParam,PostId:PostId}),
        initialPageParam:1,
        getNextPageParam:(lastPage,allPages)=>{
            const totalFetchedComments = allPages.flatMap(page=> page.data).length
            const hasMore = totalFetchedComments <lastPage.totalCommentsCount ? lastPage.nextPage : undefined
            return hasMore
        }
    })
}