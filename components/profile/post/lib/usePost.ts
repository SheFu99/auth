
import { GetUserPostsById } from "@/actions/UserPosts";
import { getCurrentProfile } from "@/actions/UserProfile";
import { getPostById } from "@/actions/post";
import { post } from "@/components/types/globalTs";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export type PostQueryPromise = {
    data: post[],
    nextPage?:number,
    totalPostCount?:number,
}

export const fetchPostList = async ({ pageParam = 1,userId }): Promise<PostQueryPromise> => {
    console.log("fetchPostList")
    const {error,success,posts,totalPostCount} = await GetUserPostsById(userId, pageParam);
    console.log(posts)

    if (error) {
        console.log("ERROR")
        throw new Error('Network error');
    }
   console.log(posts)

    return {
        data: posts, 
        nextPage: pageParam + 1 ,
        totalPostCount: totalPostCount
    };
};
  export const usePostList = (userId:string) =>{
    console.log(userId)
        return useInfiniteQuery({
            queryKey:['posts',userId],
            queryFn: ({pageParam=1})=>fetchPostList({pageParam,userId}),
            initialPageParam:1,
            getNextPageParam:(lastPage,allPages)=>{
                const totalFetchedPosts = allPages.flatMap(page=>page.data).length;
                const hasMore = totalFetchedPosts < lastPage.totalPostCount ? lastPage.nextPage : undefined
                return hasMore
            },
        });
    }

    export const fetchPost = async (postId:string) =>{
        const data = await getPostById(postId)
        if(data.error){
            throw new Error('Network Error!')
        }
        return data.post
    };

    export const usePost = (postId:string)=>{
        return useQuery({
            queryKey:['post',postId],
            queryFn:()=>fetchPost(postId),
        })
    }
    export const fetchProfile = async (userId:string)=>{
        console.log(userId)
        const {profile,error}= await getCurrentProfile(userId)
        if(error) {
            throw new Error(error)
        }
    
        return profile
    };
    

    export const useProfile = (userId:string)=>{
        return useQuery({
            queryKey:['profile' ,userId],
            queryFn:()=>fetchProfile(userId)
        })
    
    };