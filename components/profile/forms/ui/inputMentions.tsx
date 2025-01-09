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
import { useDetectMention } from "@/lib/reactQueryHooks/mentionQuery";
import { useSession } from "next-auth/react";
import { QueryClient, useQuery } from "@tanstack/react-query";

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
    const [selectedMentionLength,setSelectedMentionLength] = useState<number|null>(0)
    const { data: session, status } = useSession();
    const user = session.user
    let mentionLength:number


    const editor = useEditor({
        extensions: [
          StarterKit,
          Mention.configure({
            HTMLAttributes: {
              class: "m-hlt",
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
          const contentHTML = editor.getHTML()
          console.log(contentHTML,'contentHTML')
          const content = editor.getText();
          setTextState?.(content);
          const cursorPos = editor.state.selection.from +selectedMentionLength;
          console.log(cursorPos,'cursorPos')
          
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
  
      
      const { data, isLoading, isError } = useDetectMention(textState, cursorPosition, user.id);
      console.log('data',data,isError)
    const detectMention = async () => {
    //   const mentionRange = editor.state.plugins
    //   .find(plugin => plugin.key === "mention$")
    //   ?.getState(editor.state)?.range;

    // if (!mentionRange) return; // Ensure the range exists
        const mentionIndex = textState?.lastIndexOf('@');
        // console.log('mentionIndex',mentionIndex)
        const shouldFetch = mentionIndex !== -1 && cursorPosition > mentionIndex;
        
        const query = textState?.substring(mentionIndex + 1, cursorPosition);
        
        console.log('shouldFetch',mentionIndex,query,cursorPosition)
      //   const {data,isLoading} = useQuery({
      //     queryKey:['mentions', { user, query }],
      //     queryFn:()=> getUserListByShortName({ shortName: query, pageParams: 1 }),
      //     enabled:shouldFetch
      //   }
      // )
        if (shouldFetch) {
          if (query) {
            const {searchResult,error} = data
                // const { searchResult, error } = await getUserListByShortName({ shortName: query, pageParams: 1 });
                console.log('query error:',data,error,isLoading)

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

    const debouncedDetectInput = useCallback(_.debounce(detectMention, 600), [data]);

    useEffect(() => {
        if (isUserChoose) {
            setUserChoose(false);
            return () => null;
        }
        debouncedDetectInput();
        return () => debouncedDetectInput.cancel();
    }, [data, debouncedDetectInput]);

    
    const handleUserClick = (user: ExtendedUser) => {
      const id = user.id
      const label = user.shortName
      setSelectedMentionLength((prev)=>prev+label.length)
        setUserChoose(true);
        const mentionIndex = textState?.lastIndexOf('@');
     
        const newValue = `${textState?.substring(0, mentionIndex)}@${user.shortName} `; 
        // editor?.commands.setContent(newValue);
        // const editorState = editor.state
        const mentionRange = editor.state.plugins
            .find(plugin => plugin?.key === "mention$")
            ?.getState(editor.state)?.range;
        console.log('mentionRange,mentionIndex:',mentionRange,mentionIndex)
          if (!mentionRange) return; // Ensure the range exists
        const { from, to } = mentionRange;

        console.log('newValue',newValue)
        editor.chain().focus().deleteRange({
          from: from -1, // Start deleting after the @
          to: to, 
        }).insertContent([
          { type: "mention", attrs: { id, label } }, 
        ]).run();
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
                        <div className="flex gap-2 items-center">
                            {user.image?(
                                <Image
                                src={user.image}
                                width={24}
                                height={19}
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
                                className="list-none text-sm  ">
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