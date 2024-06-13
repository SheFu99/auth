import { useEffect, useState } from "react";


interface useDebounce {
    value?:string,
    delay:number

}

export default function useDebounce ({value,delay}:useDebounce) {
    const [debounceValue,setDebounceValue]=useState(value)

    useEffect(()=>{
        const handler = setTimeout(()=>{
            setDebounceValue(value);
        },delay)

        return ()=>{
            clearTimeout(handler)
        }
    },[value,delay])

    return debounceValue
}
 
