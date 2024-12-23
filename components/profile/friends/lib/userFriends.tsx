
import { filterFirendsWithCursor, getProfileFriends } from "@/actions/friends";
import { FriendsOffer } from "@/components/types/globalTs";
import { useInfiniteQuery ,QueryFunctionContext} from "@tanstack/react-query";

interface fetchFrinendListParams {
    userId:string,
    cursor?:Date,
}

export type FriendsQueryPromise = {
    data?:FriendsOffer[],
    totalFriendsCount?:number,
    cursor?:Date,
};
type fetchSearchParams = {
    cursor?:Date|null,
    profileId:string,
    name:string
}
type fetchSearchPromise ={
    data:FriendsOffer[],
    cursor?:Date,
    totalFound?:number
}

const cursorSelect = (friendList:FriendsOffer[])=>{
    // const lastPage = friendList.data.flatMap(page=> page)
    console.log('cursorSelect',friendList)
    const sorted = friendList?.sort((a, b) => new Date(a.createdAt).getDate() - new Date(b.createdAt).getDate());
          const index = friendList?.length-1 
          const cursor = index ? sorted[index]?.createdAt : null
          return cursor;
}

export const fetchFriendList = async ({cursor, userId}:fetchFrinendListParams):Promise<FriendsQueryPromise>=>{
    console.log("fetchFrinendListParams",userId)
    const {success,profileFirendsList,totalFriendsCount,error}= await getProfileFriends({userId , cursor})
    console.log("totalFriendsCount:",totalFriendsCount),
    console.log("profileFirendsList",profileFirendsList)
    console.log('profileFirendsListError',error)

    const sorted = cursorSelect(profileFirendsList)

    console.log('cursorSelectSorted',sorted)

    if(error) {
        throw new Error(error)
    }
    return {
        data:profileFirendsList, 
        cursor: sorted,
        totalFriendsCount:totalFriendsCount,
    }
};
export const useFriendList = (userId:string)=>{
    console.log('useFriendListParams',userId)
    return useInfiniteQuery({
        queryKey:['friendList' ,userId],
        queryFn:({pageParam=''}:QueryFunctionContext)=>fetchFriendList({cursor:pageParam as Date,userId}),
        initialPageParam:null,
        getNextPageParam:(lastPage,allPages)=>{ 
          
          const totalFetchedPosts = allPages.flatMap(page=>page.data).length;
          const hasMore = totalFetchedPosts < allPages[0].totalFriendsCount ? lastPage.cursor : undefined
          console.log('LastPage:',lastPage.cursor)

          return hasMore
        },
        // refetchOnMount:true,
        refetchOnWindowFocus:true,
        staleTime:1000 * 60 
    })

};
export const fetchSearchWithCursor= async ({cursor,profileId,name}:fetchSearchParams)=>{
    if(!name) {
        return {data:null,cursor:null,totalFound:0}
    }
    const {friendships,count} = await filterFirendsWithCursor({cursor,profileId,name})
     if(!friendships){
        return null
     }
    console.log('FETCHFRIENDS',friendships)

     return {
        data:friendships,
        cursor:cursor,
        totalFound:count
     }

};
export const useFriendsSearch =  ({ cursor, profileId, name }:fetchSearchParams) => {
    console.log('friendSearch:', cursor, profileId, name);
    
    if(!profileId){
        throw new Error ('id is requered!')
    }

  return useInfiniteQuery({
    queryKey: ['friendSearch', name, profileId],
    queryFn: async ({ pageParam = '' }: QueryFunctionContext) => {
        const response = await fetchSearchWithCursor({ cursor: pageParam as Date | null, profileId, name });
        console.log('HOOKRESPONSE',response)
        return response;
      },
      initialPageParam:null,
    getNextPageParam: (lastPage) => {
      if (lastPage?.data?.length === 0) {
        return undefined; 
      }
      console.log('LastPage:',lastPage?.data)
      const sorted = lastPage?.data?.sort((a, b) => new Date(a.createdAt).getDate() - new Date(b.createdAt).getDate());
      const index = lastPage?.data?.length-1 
      const cursor = index ? sorted[index]?.createdAt : null
      return cursor;
    },
  })
}
