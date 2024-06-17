'use client'


import useDebounce from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";




type SearchBarProps = {
  search:string,
  setSearch:(value:string)=>void,
}

const SearchStateFilter = ({ search,setSearch  }: SearchBarProps) => {

    const [text, setText] = useState('')
    const liftState = (e)=>{
      setText(e.target.value)
      // text = e.target.value
      console.log('LiftState',search)
      // setSearch(e.target.value)
      // useDebounce(setSearch(text),400)
      // setSearch(useDebounce({value:text,delay:400}))
    }
    useEffect(()=>{
      const handler = setTimeout(()=>{
        setSearch(text);
      },400)

      return ()=>{
          clearTimeout(handler)
      }
  },[text])

    // useEffect(()=>{
    // },[text])

  
    return (
      <div className='relative rounded-md shadow-sm'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <IoSearchSharp color="white"/>
        </div>
        <input
          value={text}
          placeholder='Find some...'
          onChange={e => liftState(e)}
          className='block w-full rounded-md border-0 py-1.5 pl-10 text-wgite ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
        />
      </div>
    )
  }
 
export default SearchStateFilter;