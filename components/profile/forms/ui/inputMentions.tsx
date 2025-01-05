import { getUserListByShortName } from "@/actions/search/users";
import { Textarea } from "@/components/ui/textarea";
import { ExtendedUser } from "@/next-auth";
import Image from "next/image";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import _ from 'lodash';
import { toast } from "sonner";
import { MentionInputRef } from "@/components/types/globalTs";
import { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import { Placeholder } from '@tiptap/extension-placeholder';
import './mentionStyle.css'

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
  

    const editor = useEditor({
        extensions: [
          StarterKit,
          Mention.configure({
            HTMLAttributes: {
              class: "mention-highlight",
            },
            
            suggestion: {
              items: async ({ query }) => {
                const response = await getUserListByShortName({
                  shortName: query,
                  pageParams: 1,
                });
                return response.searchResult || [];
              },
            },
          }),
          Placeholder.configure({
            placeholder: 'You can type here...', // Placeholder text
         
          }),
        ],
        content: "",
        onUpdate: ({ editor }) => {
          const content = editor.getText();
          setTextState?.(content);
          const cursorPos = editor.state.selection.from;
          setCursorPosition?.(cursorPos);
        },
        onFocus: () => {
          onFocus?.();
        },
        onBlur: () => {
          onBlur?.();
        },
      });
  
      // Use `useImperativeHandle` to expose methods to the parent
      useImperativeHandle(ref, () => ({
        clearInput: () => {
          editor?.commands.clearContent();
        },
        getValue: () => {
          return editor?.getText() || "";
        },
        focusInput: () => {
          editor?.commands.focus();
        },
        setValue: (value: string) => {
          editor?.commands.setContent(value);
        },
        handleReactionClick: (reaction: { emoji: string }) => {
          editor?.commands.insertContent(reaction.emoji);
        },
        handleMention: () => {
          editor?.commands.insertContent("@");
        },
      }));
  
      

    const detectMention = async () => {

        ////use reg-ex insted of lastindexof()
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
        editor?.commands.setContent(newValue);
        
        setTextState(newValue);
        setShowSuggestions(false);
    };


    
  useEffect(()=>{console.log('showSuggestions',showSuggestions),[showSuggestions]})
    return (
        <section id="inputAria" className={className}>
            <meta name="viewport" 
                  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
                 <div
                    className={`editor-wrapper ${shouldAnimate ? 'animate-shake' : ''} ${className}`}
                    tabIndex={-1} // Allows the wrapper to participate in the focus chain
                    >
                        <EditorContent editor={editor}
                  
                            />
                </div> 
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
                                className="list-none">
                            {user.name}
                            </li>
                            
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