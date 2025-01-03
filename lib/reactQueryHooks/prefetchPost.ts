import  queryClientConfig  from '@/lib/QueryClient';
import { fetchComments } from "@/components/profile/post/lib/useComment";
import { fetchPost, fetchPostList } from "@/components/profile/post/lib/usePost";
import { QueryFunctionContext } from '@tanstack/react-query';
import { fetchFriendList } from '@/lib/reactQueryHooks/userFriends';

export const prefetchPostList = async (userId:string)=>{
  console.log("TESET")
    const queryKey: [string, string] = ['posts',userId] 
    const options = {
      queryKey,
      queryFn: ({pageParam=1}) => fetchPostList({pageParam,userId}),
      initialPageParam:1,
      getNextPageParam:(lastPage,allPages)=>{
        const totalFetchedPosts = allPages.flatMap(page=>page.data).length;
        const hasMore = totalFetchedPosts < lastPage.totalPostCount ? lastPage.nextPage : undefined
        return hasMore
    },
  };
   const prefetchPostedPost =  await queryClientConfig.prefetchInfiniteQuery(options)

   return queryClientConfig
}
  
export const prefetchPost = async (postId:string)=>{
  const queryKey = ['post',postId]
  const options = {
    queryKey,
    queryFn: ()=> fetchPost(postId)
  }
  await queryClientConfig.prefetchQuery(options)

  return queryClientConfig
}

export const prefetchCommentList = async (postId:string)=>{
  const queryKey = ['comments',postId]
  const options = {
    queryKey,
    queryFn:({pageParam=1})=>fetchComments({page:pageParam,PostId:postId}),
    initialPageParam:1,
    getNextPageParam:(lastPage,allPages)=>{
      const totalFetchedPosts = allPages.flatMap(page=>page.data).length;
      const hasMore = totalFetchedPosts < lastPage.totalPostCount ? lastPage.nextPage : undefined

      return hasMore
    },

  };
  await queryClientConfig.prefetchInfiniteQuery(options)
  return queryClientConfig
}


export const prefetchFriendList = async (userId:string)=>{
  ///TODO: Make prefetchFriendsList
  console.log('prefetchFriendList',userId)
  const queryKey = ['friendList',userId]
  const options  = {
    queryKey,
    queryFn:({pageParam= ''}:QueryFunctionContext)=> fetchFriendList({cursor:pageParam as Date ,userId}),
    initialPageParam:null,
    getNextPageParam:(lastPage)=>{ 
      console.log('LastPage:',lastPage?.data)
      const sorted = lastPage?.data?.sort((a, b) => new Date(a.createdAt).getDate() - new Date(b.createdAt).getDate());
      const index = lastPage?.data?.length-1 
      const cursor = index ? sorted[index]?.createdAt : null
      return cursor;
    },
  
  }
  await queryClientConfig.prefetchInfiniteQuery(options)
  return queryClientConfig
}