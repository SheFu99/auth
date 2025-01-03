import { getUserListByShortName } from "@/actions/search/users";
import { Textarea } from "@/components/ui/textarea";
import { ExtendedUser } from "@/next-auth";
import Image from "next/image";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import _ from 'lodash';
import { toast } from "sonner";
import CustomTextareaWithMentions from "@/components/inputs/social_post/SocialPost";

interface InputMentionsProps {
    shouldAnimate?:boolean,
    isUploading?:boolean,
    setTextState?:(text:string)=>void,
    textState?:string,
    setCursorPosition?:(cursor:number)=>void,
    cursorPosition?:number,
    onFocus?:()=>void,
    onBlur?:()=>void,
    className?:string,
    suggestionsClass?:string,
    setIfMentionExist?:(value:boolean)=>void
    
}
export type MentionInputRef = {
    clearInput?: () => void;
    getValue?: () => string;
    focusInput?: () => void;
    setValue?: (value: string) => void;
    handleReactionClick?: (reaction: { emoji: string }) => void;
    handleMention?: () => void;
    getCursor?: () => { selectionStart: number; selectionEnd: number }; // Add this method
};


const InputMentions = forwardRef<MentionInputRef,InputMentionsProps>((
    {shouldAnimate,
        isUploading,
        textState,
        setTextState,
        setCursorPosition,
        cursorPosition,
        onFocus,
        onBlur,
        className,
        suggestionsClass,
        setIfMentionExist
    },ref) => {
    ///TODO: prevent incorect mention inside input listener 
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [isUserChoose,setUserChoose]=useState(false)
    const [users,setUsers]=useState<ExtendedUser[]>()
    const TextInputRef = useRef<HTMLTextAreaElement>()

     useImperativeHandle(ref,()=>({
        clearInput(){
            TextInputRef.current.value = ''
        },
        getValue(){
            const value =TextInputRef.current.value
            return value
        },
        focusInput() {
            TextInputRef.current?.focus();
        },
        setValue(value:string){
            TextInputRef.current.value = value
        },

        handleReactionClick(reaction:{emoji:string}){
            
            if (TextInputRef.current) {
                const { selectionStart, selectionEnd } = TextInputRef.current

                const newText = textState.slice(0, selectionStart!) + reaction.emoji + textState.slice(selectionEnd!);
                TextInputRef.current.value = newText 
                setTextState(newText);
          
                setTimeout(() => {
                  if (TextInputRef.current) {
                   TextInputRef.current.selectionStart = TextInputRef.current.selectionEnd = selectionStart! + reaction.emoji.length;
                    TextInputRef.current.focus();
                  }
                }, 0);
        };
        },

        getCursor() {
            const { selectionStart, selectionEnd } = TextInputRef.current!;
            return { selectionStart, selectionEnd };
        }
,        
handleMention() {
    if (TextInputRef.current) {
        const { selectionStart, selectionEnd } = TextInputRef.current;
        const newText = textState.slice(0, selectionStart!) + '@' + textState.slice(selectionEnd!);
        TextInputRef.current.value = newText; 
        setTextState(newText);
        setTimeout(() => {
            if (TextInputRef.current) {
                TextInputRef.current.selectionStart = TextInputRef.current.selectionEnd = selectionStart! + 1;
                TextInputRef.current.focus();
            }
        }, 0);
    }
}


    }))

    const detectMention = async () => {
      const mentionRegex = /@(\w+)$/; // Matches '@' followed by alphanumeric characters.
      const mentionMatch = textState.slice(0, cursorPosition).match(mentionRegex);
      if (!mentionMatch) {
          setShowSuggestions(false);
          return;
      }
      
      const query = mentionMatch[1]; // Captures the text after '@'.
      if (!query) {
          setShowSuggestions(false);
          return;
      }
  
      try {
          const { searchResult, error } = await getUserListByShortName({ shortName: query, pageParams: 1 });
          if (error) throw new Error(error);
          setIfMentionExist(!!searchResult?.length);
          setUsers(searchResult);
          setShowSuggestions(!!searchResult?.length);
      } catch (err) {
          toast.error(err.message);
          setIfMentionExist(false);
          setShowSuggestions(false);
      }
  };

  
  const debouncedDetectInput = useCallback(
    _.debounce(detectMention, 300, { leading: true, trailing: false }),
    [textState]
);

useEffect(() => {
    debouncedDetectInput();
    return () => debouncedDetectInput.cancel();
}, [textState, cursorPosition]);



    const handleUserClick = (user: ExtendedUser) => {
        setUserChoose(true)
        const mentionIndex = textState?.lastIndexOf('@');
        const newValue = `${textState?.substring(0,mentionIndex)}@${user.shortName} `
        TextInputRef.current?.focus();
        TextInputRef.current.value = newValue


        setTextState(newValue);
        setShowSuggestions(false);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const target = e.target;
      setCursorPosition(target.selectionStart);
      setTextState(target.value);
  };
  
    return (
        <section id="inputAria" className={className}>
            <meta name="viewport" 
                  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
            {/* <Textarea 
                ref={TextInputRef}
                onChange={(e)=>handleInputChange(e)}
                disabled={isUploading||false}
                className={`${shouldAnimate ? 'animate-shake' : ''} `}
                placeholder="Type your message here." 
                onFocus={onFocus}
                onBlur={onBlur}

            /> */}
            <CustomTextareaWithMentions 
          />

            {/* {showSuggestions&&(
            <>
                    {users?.map(user=>(
                        <div 
                            key={user.id}
                            className={`
                                absolute
                                mt-4
                                ${suggestionsClass}
                                bg-black border-white 
                                rounded-md 
                                py-[4px]
                                px-3
                                z-[100]
                                transition-opacity
                                `}>
                        <div className="flex gap-2">
                            {user.image?(
                                <Image
                                src={user.image}
                                width={25}
                                height={20}
                                alt={user.name||`Author`}
                                className="rounded-full"
                                />
                            ):(
                                <div className="flex justify-center align-middle items-center border-2 rounded-full w-[40px] h-[40px]">
                                    <FaUser color="white" className="scale-110 "/>
                                </div>
                            )}
                        
                            <li
                                key={user.id}
                                onClick={()=>handleUserClick(user)}
                                className="
                                list-none
                                cursor-pointer"
                            >{user.name}</li>
                    </div>
                    </div>
                    ))}
            </>
            )} */}

        </section>
      );    
})
InputMentions.displayName = 'InputMentions'
export default InputMentions;