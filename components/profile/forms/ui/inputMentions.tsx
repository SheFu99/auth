import { getUserListByShortName } from "@/actions/search/users";
import { Textarea } from "@/components/ui/textarea";
import { ExtendedUser } from "@/next-auth";
import Image from "next/image";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import _ from 'lodash';
import { toast } from "sonner";
import { MentionInputRef } from "@/components/types/globalTs";

interface InputMentionsProps {
    shouldAnimate?: boolean;
    isUploading?: boolean;
    setTextState?: (text: string) => void;
    textState?: string;
    setCursorPosition?: (cursor: number) => void;
    cursorPosition?: number;
    onFocus?: () => void;
    onBlur?: () => void;
    className?: string;
    suggestionsClass?: string;
    setIfMentionExist?: (value: boolean) => void;
}


const InputMentions = forwardRef<MentionInputRef, InputMentionsProps>(({
    shouldAnimate,
    isUploading,
    textState,
    setTextState,
    setCursorPosition,
    cursorPosition,
    onFocus,
    onBlur,
    className,
    suggestionsClass,
    setIfMentionExist,
}, ref) => {
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [isUserChoose, setUserChoose] = useState(false);
    const [users, setUsers] = useState<ExtendedUser[]>();
    const TextInputRef = useRef<HTMLTextAreaElement>();

    useImperativeHandle(ref, () => ({
        clearInput() {
            TextInputRef.current.value = '';
        },
        getValue() {
            return TextInputRef.current.value;
        },
        focusInput() {
            TextInputRef.current?.focus();
        },
        setValue(value: string) {
            TextInputRef.current.value = value;
        },
        handleReactionClick(reaction: { emoji: string }) {
            if (TextInputRef.current) {
                const { selectionStart, selectionEnd } = TextInputRef.current;
                const newText = textState.slice(0, selectionStart!) + reaction.emoji + textState.slice(selectionEnd!);
                TextInputRef.current.value = newText;
                setTextState(newText);

                setTimeout(() => {
                    if (TextInputRef.current) {
                        TextInputRef.current.selectionStart = TextInputRef.current.selectionEnd = selectionStart! + reaction.emoji.length;
                        TextInputRef.current.focus();
                    }
                }, 0);
            }
        },
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
        },
    }));

    const detectMention = async () => {
        const mentionIndex = textState?.lastIndexOf('@');
        if (mentionIndex !== -1 && cursorPosition > mentionIndex) {
            const query = textState.substring(mentionIndex + 1, cursorPosition);
            if (query) {
                const { searchResult, error } = await getUserListByShortName({ shortName: query, pageParams: 1 });
                if (error) {
                    toast.error(error);
                    setIfMentionExist(false);
                    return;
                }
                if (!searchResult[0]) {
                    setIfMentionExist(false);
                } else if (isUserChoose) {
                    setIfMentionExist(true);
                } else {
                    setIfMentionExist(false);
                }
                setUsers(searchResult);
                setShowSuggestions(true);
            }
        } else {
            setShowSuggestions(false);
        }
    };

    const debouncedDetectInput = useCallback(_.debounce(detectMention, 600), [textState]);

    useEffect(() => {
        if (isUserChoose) {
            setUserChoose(false);
            return () => null;
        }
        debouncedDetectInput();
        return () => debouncedDetectInput.cancel();
    }, [textState, cursorPosition, debouncedDetectInput]);

    const handleUserClick = (user: ExtendedUser) => {
        setUserChoose(true);
        const mentionIndex = textState?.lastIndexOf('@');
        const newValue = `${textState?.substring(0, mentionIndex)}@${user.shortName} `;
        TextInputRef.current.value = newValue;
        setTextState(newValue);
        setShowSuggestions(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target;
        const cursorPos = target.selectionStart;
        setCursorPosition(cursorPos);
        setTextState(target.value);
    };
  useEffect(()=>{console.log('isUserChoose',isUserChoose),[isUserChoose]})
    return (
        <section id="inputAria" className={className}>
            <meta name="viewport" 
                  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
            <Textarea 
                ref={TextInputRef}
                onChange={(e)=>handleInputChange(e)}
                disabled={isUploading||false}
                className={`${shouldAnimate ? 'animate-shake' : ''} `}
                placeholder="Type your message here." 
                onFocus={onFocus}
                onBlur={onBlur}
            />
            {/* <CustomTextareaWithMentions/> */}

            {showSuggestions&&(
            <>
            <div className="absolute mt-4 right-2 
                                bg-black border 
                                border-white 
                                rounded-md
                                z-[100]
                                transition-opacity
                                ">
                                   
            {users?.map(user=>(
                        <div 
                            key={user.id}
                            onClick={()=>handleUserClick(user)}
                            className={`
                                ${suggestionsClass}
                                py-[4px]
                                px-3
                                 hover:bg-slate-800 rounded-md
                                 border-b border-dotted border-gray
                                  cursor-pointer
                                `}>
                        <div className="flex gap-2">
                            {user.image?(
                                <Image
                                src={user.image}
                                width={25}
                                height={20}
                                alt={user.name||`Author`}
                                className="rounded-full "
                                />
                            ):(
                                <div className="flex justify-center align-middle items-center border-2 rounded-full w-[30px] h-[30px] p-1 ml-[-1px]">
                                    <FaUser color="white" className="scale-100 "/>
                                </div>
                            )}
                        
                            <li
                                key={user.id}
                                
                                className="
                                list-none
                               "
                            >{user.name}</li>
                            
                    </div>
                   
                    </div>
                    
                    ))}
            </div>
                    
            </>
            )}

        </section>
      );    
})
InputMentions.displayName = 'InputMentions'
export default InputMentions;