import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CardWrapper } from "./card-wraper";


export const ErrorCard=()=>{
return(
    <div className="w-full h-full flex justify-center items-center">
    <CardWrapper
        headerLable="Oops! Something went wrong!"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
        >

            <div className="w-full flex justify-center items-center ">
                <ExclamationTriangleIcon className="text-destructive"/>
            </div>
     </CardWrapper>
     </div>
)
}