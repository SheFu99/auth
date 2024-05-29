import { GetUserPostsById } from "@/actions/UserPosts"

interface GetPostProps {
    profile:object,
    user:string,
    page:number,
}

export default async function GetPost(profile,user,page) {
//    console.log("GET_____POST___INSIDE")
    try{
        if(profile){
   console.log(profile)

            const posts = await GetUserPostsById(profile.profile,page)
            return posts

        }else{
   console.log(user)
           
            const posts = await GetUserPostsById(user,page)
            
            return posts
        }
    }catch(error){
        console.log(error)
 
   
}}