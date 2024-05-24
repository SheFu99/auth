
import Image from "next/image";
import Link from "next/link";
import React from 'react';
import TimeAgo from 'react-timeago';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import csStrings from 'react-timeago/lib/language-strings/en';

const formatter = buildFormatter(csStrings);
type RepostHeaderParams ={
    originUserId:string,
    originUserName:string,
    originAvatar:string,
    timestamp:Date,
    className?:string
}
const RepostHeader = ({originUserId,originUserName,originAvatar,timestamp,className}:RepostHeaderParams) => {
  
    
    return ( 
        <div className={`${className} flex item-center space-x-2`}>
                       <Link href={`/profile/${originUserId}`}>
                            
                                <Image
                                src={originAvatar}
                                width={40}
                                height={40}
                                alt="AuthorIcon"
                                className="rounded-full"
                                />
                            
                        </Link>
                            <div className="grid-rows-5">
                                <p className="text-white font-bold row-span-4 ">{originUserName}</p>
                                <div className="text-gray-300 text-xs wf row-start-4 row-span-1">
                                    <TimeAgo date={timestamp}  formatter={formatter}/>
                                </div>
                            </div>
                        
                    </div>
     );
}
 
export default RepostHeader;