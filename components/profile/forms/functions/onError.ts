import { useState } from "react";

const useOnError = ()=>{
    const [shouldAnimate,setShouldAnimate]=useState<boolean>(false)

    const onError =(errors:any)=>{
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