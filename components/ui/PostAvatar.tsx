import { ExtendedUser } from "@/next-auth";
import Image from "next/image";
import { FaUser } from "react-icons/fa";

type PostAvatarProps = {
    src?:string,
    className?:string,
    alt?:string
}
const PostAvatar:React.FC<PostAvatarProps> = ({src,alt,className}) => {
    return ( 
        <div className={`${className}`}>
        {src?(
            <Image
            src={src}
            width={45}
            height={45}
            alt={alt||"UserAvatar"}
            className="rounded-full"
            />
        ):(
            <div className="flex h-full w-full items-center justify-center rounded-full bg-muted p-3">
                <FaUser className="text-[#000000] w-[45px] h-[45px] md:w-[60px] md:h-[60px] g-f:w-[35px] g-f:h-[35px]"/>
            </div>
        )}
        </div>
     );
}
 
export default PostAvatar;