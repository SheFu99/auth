
import { ExtendedUser } from "@/next-auth";
import Image from "next/image";
import Link from "next/link";
import React from 'react';
import { FaUser } from "react-icons/fa";
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import csStrings from 'react-timeago/lib/language-strings/en';

const formatter = buildFormatter(csStrings);

interface PostHeaderProps {
    author:ExtendedUser
    timestamp?:Date
}

const PostHeader:React.FC<PostHeaderProps> = ({author,timestamp}) => {
    const user = author
    
    return ( 
        <div className="flex item-center space-x-2">
            {user?(
                <>
                <Link href={`/profile/${user.id}`}>
                    <Image
                    src={user.image}
                    width={40}
                    height={40}
                    alt="AuthorIcon"
                    className="rounded-full"
                    />
                </Link>
                 
             </>
            ):(
                <div className="flex justify-center align-middle items-center border-2 rounded-full w-[40px] h-[40px]">
                    <FaUser color="white" className="scale-110 "/>
                </div>
            )}
            {timestamp&&(
                <div className="grid-rows-5">
                            <p className="text-white font-bold row-span-4 ">{user.name}</p>
                            <div className="text-gray-300 text-xs wf row-start-4 row-span-1">
                                <TimeAgo date={timestamp}  formatter={formatter}/>
                            </div>
                </div>
            )}
                        
        </div>
     );
}
 
export default PostHeader;