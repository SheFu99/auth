import { FcLike, FcLikePlaceholder } from "react-icons/fc";

interface LikeButtonProps {
    onLike:()=>void,
    post:any,
    isPending:boolean,
    className?:string
}

const LikeButton:React.FC<LikeButtonProps> = ({onLike,post,isPending,className}) => {

    

    return ( 
        <button title="like" className={`${className}text-white rounded-md p-2 mt-5 bg-neutral-900 px-10`} onClick={onLike} disabled={isPending}>
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