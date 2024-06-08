// "use client"

// import { post } from "@/components/types/globalTs";
// import { ExtendedUser } from "@/next-auth";
// import { useState } from "react";
// import PostCard from "../PostCard";

// type PostCardProps={
//     post:post,
//     user?:ExtendedUser,
    
// }


// const PostCardWithState:React.FC<PostCardProps> = ({post,user}) => {
//     ///TODO:1.OpenCommentForm 2.Delete method
//     const [postState,setPost] = useState<post[]>([post])


//     return ( 
//                 <div>
//                     <PostCard setPost={setPost} postState={postState} user={user}/>
//                 </div>
       
//      );
// };
 
// export default PostCardWithState;