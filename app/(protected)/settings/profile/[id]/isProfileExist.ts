import { GetUserPostsById } from "@/actions/UserPosts"
import { getProfilePromise } from "@/actions/UserProfile"
import { getProfileFriends } from "@/actions/friends"

export const isProfileExist = async(profile:getProfilePromise)=>{
    if(profile.error){
      console.log("return")
      const userPostList = undefined 
      const userfriendsList = undefined
      return {userPostList,userfriendsList}
    }
    const userPostList = await GetUserPostsById(profile.profile.userId,1)
    const userfriendsList = await getProfileFriends({userId:profile.profile.userId,cursor:undefined})

    return {userPostList,userfriendsList}
  }
