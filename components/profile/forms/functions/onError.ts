import { useEffect, useState } from "react";

const useOnError = ()=>{
    const [shouldAnimate,setShouldAnimate]=useState<boolean>(false)
///debug_effects
useEffect(()=>{console.log('shouldAnimate',shouldAnimate)},[shouldAnimate])
///
    const onError =(errors:any)=>{
        console.log('input validation error',errors)
        if(Object.keys(errors).length){
            setShouldAnimate(true)
            setTimeout(()=>setShouldAnimate(false),1000)
        }
    };
return {
    shouldAnimate,
    onError
}
}
export default useOnError