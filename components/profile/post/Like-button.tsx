import { post } from "@/components/types/globalTs";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";

interface LikeButtonProps {
    onLike:()=>void,
    post:post,
    isPending:boolean,
    className?:string
}

const LikeButton:React.FC<LikeButtonProps> = ({onLike,post,isPending,className}) => {

    

    return ( 
        <button title="like" className={`${className}text-white rounded-md p-2  bg-neutral-900 `} onClick={onLike} disabled={isPending}>
        {post.likedByUser?
         <div className="flex align-middle justify-center items-center gap-2 ">
             <FcLike/>
             {post._count.likes}
         </div>
        :
        <div className="flex align-middle justify-center items-center gap-2 ">
        <FcLikePlaceholder/>
        {/* {post._count.likes>0 ? post._count.likes: undefined} */}
    </div>
         }
        </button>
     );
}
 
export default LikeButton;