'use client'

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useDebounce } from 'use-debounce';

type SearchBarProps = {
  search:string,
  context:string
}

const SearchBar = ({ search , context }: SearchBarProps) => {
  console.log(context)
    const router = useRouter()
    const initialRender = useRef(true)
    const [text, setText] = useState(search)
    const [query] = useDebounce(text, 500)
  
    useEffect(() => {
      if (initialRender.current) {
        initialRender.current = false
        return
      }
  
      if (!query) {
        router.push(context)
      } else {
        router.push(`${context}search=${query}`)
      }
    }, [query])
  
    return (
      <div className='relative rounded-md shadow-sm'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <IoSearchSharp color="white"/>
        </div>
        <input
          value={text}
          placeholder='Search users...'
          onChange={e => setText(e.target.value)}
          className='block w-full rounded-md border-0 py-1.5 pl-10 text-wgite ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
        />
      </div>
    )
  }
 
export default SearchBar;