import * as React from "react"
import { cn } from "@/lib/utils"
import './input.css'
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import { MdEmail } from "react-icons/md";
import { PiLockKeyFill } from "react-icons/pi";
import { BsPencilSquare } from "react-icons/bs";
import { Button } from "./button";
import { TfiSave } from "react-icons/tfi";
import { VscMention } from "react-icons/vsc";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  Icon?:React.ElementType,
  disabled?:boolean;
  editButton?:boolean;

  }




  const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, Icon, disabled, editButton, ...props }, ref) => {
      const inputRef = React.useRef<HTMLInputElement | null>(null);
  
      const AdditionalInputClasses = (type: React.HTMLInputTypeAttribute | 'shortName') => {
        switch (type) {
          case 'profile':
            return "!bg-white text-black  text-xl font-bold g-f:text-xs";
          case 'password':
            return "bg-background";
          case 'string':
            return "!bg-white text-black  text-xl  g-f:text-xs";
          case 'number':
            return "!bg-white text-black  text-xl  g-f:text-xs";
          default:
            return " file:text-sm file:font-medium placeholder:text-muted-foreground";
        }
      };
  
      const combinedClassName = cn(
        "flex h-10 w-full rounded-md border border-input px-4 py-2 ring-offset-background file:border-0 file:bg-transparent outline-none focus:outline-none focus:ring-0 border-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
        AdditionalInputClasses(type)
      );
  
      const [button, setButton] = React.useState<boolean>(false);
  
      const toggleButton = () => {
        setButton(!button);
        // Ensure the input is enabled before focusing
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            // Move the cursor to the end of the input value
            const length = inputRef.current.value.length;
            inputRef.current.setSelectionRange(length, length);
          }
        }, 0);
      };
  
      const [visible, showPassword] = React.useState<boolean>(false);
      const inputType = type === 'password' && visible ? 'text' : type;
  
      const renderIcon = () => {
        if (Icon) {
          return <Icon className="adornment-icon" />;
        }
        switch (type) {
          case 'email':
            return <MdEmail className="adornment-icon" />;
          case 'password':
            return <PiLockKeyFill className="adornment-icon" />;
          case 'shortName':
            return <PiLockKeyFill className="adornment-icon" />;
          default:
            return null;
        }
      };
  
      const renderButtonIcon = () => {
        if (editButton === true) {
          if (button === false) {
            return (
              <Button onClick={toggleButton} type="submit">
                <BsPencilSquare className="adornment-button" />
              </Button>
            );
          } else {
            return (
              <Button onClick={toggleButton} type="button">
                <TfiSave className="adornment-button" />
              </Button>
            );
          }
        }
      };
  
      return (
        <div className={cn('input-adornment', className)}>
          {renderIcon()}
          <input
            ref={(el) => {
              inputRef.current = el;
              if (typeof ref === 'function') {
                ref(el);
              } else if (ref) {
                ref.current = el;
              }
            }}
            type={inputType}
            disabled={disabled || (editButton && !button)}
            className={combinedClassName}
            {...props}
          />
          {type === 'password' && (
            <button type="button" title="ShowPassword" className="px-1" onClick={() => showPassword(!visible)}>
              {visible ? <RxEyeOpen /> : <RxEyeClosed />}
            </button>
          )}
          {renderButtonIcon()}
        </div>
      );
    }
  );
  
  Input.displayName = 'Input';
  
  export { Input };
  