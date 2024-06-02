import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      
      <textarea
        className={
          `flex min-h-[30px] w-full rounded-md  bg-background px-3 py-2 
          text-xl ring-offset-background placeholder:text-xl placeholder:text-neutral-400 placeholder:focus:text-neutral-600
          focus:border-none focus:outline-none focus-visible:outline-none  
          disabled:cursor-not-allowed disabled:opacity-50
          resize-none
          ${className}`
        }
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
