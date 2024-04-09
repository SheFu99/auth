import * as React from "react"
import { cn } from "@/lib/utils"
import './input.css'
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import { MdEmail } from "react-icons/md";
import { PiLockKeyFill } from "react-icons/pi";
import { BsPencilSquare } from "react-icons/bs";
import { Button } from "./button";
import { TfiSave } from "react-icons/tfi";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  Icon?:React.ElementType,
  disabled?:boolean;
  editButton?:boolean;

  }




const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, Icon,disabled,editButton, ...props }, ref) => {

    const AdditionalInputClasses = (type: React.HTMLInputTypeAttribute)=>{
      switch(type){
        case 'profile':
          return "bg-white text-black  text-xl font-bold g-f:text-xs";
        case 'password':
          return "bg-background"
        default:
          return "file:text-sm file:font-medium placeholder:text-muted-foreground"
      }
    }
    const combinedClassName = cn(
      "flex h-10 w-full rounded-md border border-input px-4 py-2 ring-offset-background file:border-0 file:bg-transparent  outline-none focus:outline-none focus:ring-0 border-none disabled:cursor-not-allowed disabled:opacity-50",
      className, // Existing class names passed via props
     AdditionalInputClasses(type),)


    const [button, setButton] = React.useState<boolean>(false);
    const toggleButton = () => {
      setButton(!button);
    };

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

    const renderButtonIcon = () =>{
    if(editButton ===true){
      if(button === false){
        return <Button onClick={toggleButton} type='submit'><BsPencilSquare className="adornment-button"/></Button>
      }else{
        return <Button onClick={toggleButton} type="button"><TfiSave className="adornment-button"></TfiSave></Button>
      }
    }
    }

    return (
      <div className={cn('input-adornment',className)}>
     
     {renderIcon()}
      
      <input
        type={inputType}
        disabled={disabled ||editButton &&!button}
        // className={cn(
        //   "bg-white flex h-10 w-full rounded-md border border-input  px-4 py-2  ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none focus:outline-none focus:ring-0 border-none disabled:cursor-not-allowed disabled:opacity-50",
        //   className
        //   )}
        className={combinedClassName}
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

          {renderButtonIcon()}

          </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
