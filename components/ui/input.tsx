import * as React from "react"
import { cn } from "@/lib/utils"
import './input.css'
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import { MdEmail } from "react-icons/md";
import { PiLockKeyFill } from "react-icons/pi";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  Icon?:React.ElementType
  }




const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type,Icon ,...props }, ref) => {

    const [visable,showPassword] = React.useState<boolean>(false)

    const inputType = type ==='password' && visable ? 'text':type;
    
    const renderIcon = () => {
      // First, check if an Icon is provided
      if (Icon) {
        return <Icon className="adornment-icon" />;
      }
      // If no Icon is provided, determine which default icon to render based on the type
      switch (type) {
        case 'email':
          return <MdEmail className="adornment-icon" />;
        case 'password':
          return <PiLockKeyFill className="adornment-icon" />;
        default:
          return null; // Return null if no specific icon matches
      }
    };

    return (
      <div className={cn('input-adornment',className)}>
     
     {renderIcon()}
      
      <input
        type={inputType}
        className={cn(
          " flex h-10 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none focus:outline-none focus:ring-0 border-none disabled:cursor-not-allowed disabled:opacity-50",
          
          )}
          ref={ref}
          {...props}
          />
          
          {type ==='password' && (
            <button type='button' className='px-1' onClick={()=>showPassword(!visable)}>
              {visable ? <RxEyeOpen/>:<RxEyeClosed/>}
            </button>
          )}

          {type ==='email' && (
          <div className="w-7">
           
          </div>
          )}

          </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
