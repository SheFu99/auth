import { GetUserPostsById } from "@/actions/UserPosts"

interface GetPostProps {
    profile:object,
    user:string,
    page:number,
}

export default async function GetPost(profile,user,page) {
//    console.log("GET_____POST___INSIDE")
   
    try{
        if(profile.profile){
            const posts = await GetUserPostsById(profile.profile,page)
            return posts

        }else{
           
            const posts = await GetUserPostsById(user,page)
            
            return posts
        }
    }catch(error){
        console.log(error)
 
   
}}