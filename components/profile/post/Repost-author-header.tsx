
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React from 'react';
import { FaUser } from "react-icons/fa6";

const TimeAgo = dynamic(()=>import('react-timeago')
.then(module=>module.default),{ssr:false}) as typeof import('react-timeago').default;

import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import csStrings from 'react-timeago/lib/language-strings/en';

const formatter = buildFormatter(csStrings);

type RepostHeaderParams ={
    userId:string,
    userName:string,
    userImage?:string,
    timestamp?:Date,
    className?:string
}
const RepostHeader :React.FC<RepostHeaderParams> = ({userId,userName,userImage,timestamp,className}) => {
  
    
    return ( 
        <div className={`${className} flex item-center space-x-2`}>
          {userImage?(
            <Link href={`/profile/${userId}`} title="Go to this page">
                <Image
                    src={userImage}
                    width={40}
                    height={40}
                    alt={userName||`Author`}
                    className="rounded-full"
                />
            
            </Link>
          ):(
            <div className="flex justify-center align-middle items-center border-2 rounded-full w-[40px] h-[40px]">
                <FaUser color="white" className="scale-110 "/>
            </div>
        )}
                     
           <div className="grid-rows-5">
              <p className="text-white font-bold row-span-4 ">{userName}</p>
              {timestamp&&(
                 <div className="text-gray-300 text-xs wf row-start-4 row-span-1">
                 <TimeAgo date={timestamp}  formatter={formatter}/>
               </div>
              )}
              
            </div>
                        
       </div>
     );
}
 
export default RepostHeader;