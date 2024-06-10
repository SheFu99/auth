"use client"
import { FaSearch, FaUserFriends } from "react-icons/fa";
import UserButton from "../auth/user-button";
import { ExtendedUser } from "@/next-auth";
import { IoAddCircle } from "react-icons/io5";
import { MdRssFeed } from "react-icons/md";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

interface BottomNavBarProps {
    user?:ExtendedUser
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({user}) => {
    const pathName = usePathname()


    return ( 
        <div className={`fixed bottom-0 z-50 h-[60px] w-full grid grid-cols-5 bg-neutral-900  bg-opacity-90 backdrop-blur`}>
            <button 
                title="Feed" 
                className={`
                    col-start-1 flex justify-center items-center align-middle 
                    `}
                type="button"
                >
                    <div className= {` ${pathName==='/feed' ? ' bg-neutral-800 rounded-full border-neutral-600 border p-2':' '}`}>
                    <MdRssFeed 
                        className={`ml-1 mb-1 ${pathName==='/feed' ? 'w-[30px] h-[30px]':'w-[20px] h-[20px]' }  `}
                        color="white"
                    />
                    </div>
            </button>

            
            <button 
                title="Search"
                className="col-start-2 flex justify-center items-center align-middle scale-110"
                type="button"
                >
                <div className= {` ${pathName.startsWith('/search') ? ' bg-neutral-800 rounded-full border-neutral-600 border p-2':' '}`}>
                    <FaSearch 
                        color="white"
                        className={`ml-1 mb-1 ${pathName.startsWith('/search') ? 'w-[20px] h-[20px]':'w-[15px] h-[15px]' }  `}
                        />
                </div>

            </button>


            <button 
                title="Create post"
                className="col-start-3 flex justify-center items-center align-middle scale-120"
                type="button"
                >
                <IoAddCircle 
                    color="white"
                    className="w-[50px] h-[50px] bg-black rounded-full"
                />
            </button>


            <button 
                title="Friends"
                className="col-start-4 flex justify-center items-center align-middle scale-110"
                type="button"
                >
                    <div className= {` ${pathName.startsWith('/friends') ? ' bg-neutral-800 rounded-full border-neutral-600 border p-2':' '}`}>
                    <FaUserFriends 
                        color="white"
                        className={`${pathName.startsWith('/friends') ? 'w-[25px] h-[25px]':'w-[20px] h-[20px]' }`}
                        /> 
                    </div>
            </button>

            <button 
                title="More..."
                className="col-start-5 flex justify-center items-center align-middle scale-110"
                type="button"
                >
                <UserButton user={user}/>
            </button>


        </div>
     );
}
 
export default BottomNavBar;