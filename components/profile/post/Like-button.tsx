import { FcLike, FcLikePlaceholder } from "react-icons/fc";



const LikeButton = ({onLike,post,isPending}) => {

    

    return ( 
        <button title="like" className="text-white bg-gray-900 rounded-md p-2 mt-5 px-5" onClick={onLike} disabled={isPending}>
        {post.likedByUser?
         <div className="flex align-middle justify-center items-center gap-2 ">
             <FcLike/>
             {post.likeCount}
         </div>
        :
        <div className="flex align-middle justify-center items-center gap-2 ">
        <FcLikePlaceholder/>
        {post.likeCount>0 ? post.likeCount: undefined}
    </div>
         }
     </button>
     );
}
 
export default LikeButton;