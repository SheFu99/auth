'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import useDebounce from "@/hooks/use-debounce";
import { currentUser } from "@/lib/auth";
import { useInfiniteUserNameSearch } from "@/lib/reactQueryHooks/searchUserQuery";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";



export const NavSearch = ({user}) => {
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce({value:searchText, delay:500});
  const sessionUser = user

  // const baseURL = process.env.NEXT_PUBLIC_APP_URL
  // const currentPath = window?.location.href
  // const route = currentPath.replace(baseURL,'')
  // console.log('currentPath',route)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useInfiniteUserNameSearch(
   {query:debouncedSearch,userId:sessionUser?.id}
  );
useEffect(()=>console.log('getNextPageUserSearchParams','client' ,data),[data])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleLoadMore = () => {
    if (hasNextPage) fetchNextPage();
  };

  return (
    <div className="relative max-w-[15rem]">
      {/* Search Bar */}
      {user&&(
          <form onSubmit={(e) => e.preventDefault()}>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <IoSearchSharp color="white" />
          </div>
          <input
            type="text"
            value={searchText}
            onChange={handleInputChange}
            placeholder="Search users..."
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-secondary-foreground ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-secondary sm:text-sm sm:leading-6"
          />
        </form>
      )}
    

      {/* Inline Results */}
      {isLoading && <div className="absolute w-full mt-2 bg-card text-primary-foreground p-4">Loading...</div>}
      {isError && <div className="absolute w-full mt-2 bg-card p-4 text-red-800">Error fetching results</div>}


      {data?.pages.length >0 && (
        <div className="absolute w-full mt-2 bg-card  border rounded-md shadow-lg">
          {data?.pages.map((page, i) => (
            <div key={i}>
              {page.searchResult.map((user: any) => (
                <div className="grid grid-cols-12 bg-card border-white rounded-md border p-2 w-full absolute z-[11]" key={page.transactionId}> 

                <Link 
                    href={`/profile/${user?.shortName || user.id}`} 
                    className="col-span-10 flex items-center gap-1 cursor-pointer"
                >
                   <Avatar>
                        <AvatarImage
                        src={user.image}
                        className="w-[50px] h-[50px]  mt-[-5px]"
                        />
                        <AvatarFallback>
                                <FaUser color="white" className="w-[50px] h-[50px] bg-neutral-400 rounded-sm p-1"/>
                        </AvatarFallback>
                   </Avatar>
                    <p className="text-white ml-2">{user.name}</p>
                </Link>
                </div>

              ))}
            </div>
          ))}
          {hasNextPage && (
            <button
              onClick={handleLoadMore}
              className="w-full text-center py-2 bg-blue-100 hover:bg-blue-200"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};
