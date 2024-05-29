
import AvatarWithFallback from "@/components/ui/AvatarCoustom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import React from 'react';
import { FaUser } from "react-icons/fa6";
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import csStrings from 'react-timeago/lib/language-strings/en';

const formatter = buildFormatter(csStrings);

type RepostHeaderParams ={
    userId:string,
    userName:string,
    userImage?:string,
    timestamp:Date,
    className?:string
}
const RepostHeader :React.FC<RepostHeaderParams> = ({userId,userName,userImage,timestamp,className}) => {
  
    
    return ( 
        <div className={`${className} flex item-center space-x-2`}>
                       <Link href={`/profile/${userId}`}>
                            {/* <AvatarWithFallback src={userImage} width={40} height={40} alt="Author"/> */}
                            <Avatar>
                                <AvatarImage src={userImage}/>
                                <AvatarFallback>
                                    <FaUser color="white"/>
                                </AvatarFallback>
                            </Avatar>
                                {/* <Image
                                src={userImage}
                                width={40}
                                height={40}
                                alt="AuthorIcon"
                                className="rounded-full"
                                /> */}
                            
                        </Link>
                            <div className="grid-rows-5">
                                <p className="text-white font-bold row-span-4 ">{userName}</p>
                                <div className="text-gray-300 text-xs wf row-start-4 row-span-1">
                                    <TimeAgo date={timestamp}  formatter={formatter}/>
                                </div>
                            </div>
                        
                    </div>
     );
}
 
export default RepostHeader;