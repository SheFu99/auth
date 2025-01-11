import { getUserListByShortName } from "@/actions/search/users";
import { ExtendedUser } from "@/next-auth";
import Image from "next/image";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import _ from 'lodash';
import { toast } from "sonner";
import { MentionInputRef } from "@/components/types/globalTs";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import { Placeholder } from '@tiptap/extension-placeholder';
import './mentionStyle.css'
import { useMention } from "@/lib/reactQueryHooks/mentionQuery";
import { useSession } from "next-auth/react";
import { BeatLoader } from "react-spinners";


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
    setTextState,
    onFocus,
    onBlur,
    className,
    suggestionsClass,
}, ref) => {
    const [query ,setQuery]=useState<string|undefined>(undefined)
    const { data: session, status } = useSession();
    const user = session.user
    if(!user){
      return
    }
    const {data,isLoading,error}=useMention({query:query,userId:user?.id})

    const editor = useEditor({
        extensions: [
          StarterKit,
          Mention.configure({
            HTMLAttributes: {
              class: "m-hlt",
            },
            
            
          }),
          Placeholder.configure({
            placeholder: 'You can type here...', // Placeholder text
         
          }),
        ],
        content: "",
        onUpdate: ({ editor }) => {
          let mentionPlugin =  editor.state.plugins.find(plugin => plugin?.key === "mention$");

          // const contentHTML = editor.getHTML()
          // console.log(editor.state,'contentHTML')
          console.log(editor,'editor')
          const content = editor.getText();
          setTextState?.(content);

          const query = mentionPlugin?.getState(editor.state)?.query;
          console.log('data','query',query)
          setQuery(query)
          // console.log('data',data,isError)
          
        },
        onFocus: () => {
          onFocus?.();
        },
        onBlur: () => {
          onBlur?.();
        },
        onDestroy:()=>{
          console.log('OnDestroyCallback')
        }
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
  
    
    const handleUserClick = (user: ExtendedUser) => {
      const id = user.id
      const label = user.shortName
  
        
        
        // editor?.commands.setContent(newValue);
        // const editorState = editor.state
        const mentionRange = editor.state.plugins
            .find(plugin => plugin?.key === "mention$")
            ?.getState(editor.state)?.range;

          if (!mentionRange) return; // Ensure the range exists

        const { from, to } = mentionRange;

  
        editor.chain().focus().deleteRange({
          from: from, // Start deleting after the @
          to: to, 
        }).insertContent([
          { type: "mention", attrs: { id, label } }, 
        ]).run();
        const textState = editor.getText()
        setTextState(textState);
        // setShowSuggestions(false);
    };


    
  // useEffect(()=>{console.log('showSuggestions',showSuggestions),[showSuggestions]})
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

            {data?.searchResult &&(
            <>
            
            <div className="absolute mt-4 right-2 
                                bg-card border
                                border-accent 
                                rounded-md
                                z-[100]
                                transition-opacity
                                min-w-[210px]
                                max-h-[150px]
                                overflow-y-auto
                                scrollbar-thin scrollbar-thumb-blue scrollbar-track-gray 
                                ">
                                   
            {data?.searchResult?.map(user=>(
                        <div 
                            key={user.id}
                            onClick={()=>handleUserClick(user)}
                            className={`
                                ${suggestionsClass}
                                py-[4px]
                                px-3
                                 hover:bg-accent rounded-sm
                                 border-b border-dotted border-gray
                                  cursor-pointer 
                                  
                                `}>
                                 
                        <div className="col-span-2 flex gap-2 justify-center items-center">
                            {user.image?(
                                <Image
                                src={user.image}
                                width={24}
                                height={19}
                                alt={user.name||`Author`}
                                className="rounded-full "
                                />
                            ):(
                                <div className="flex justify-center align-middle items-center border-2 rounded-full w-[25px] h-[25px] p-1 ml-[-1px]">
                                    <FaUser color="white" className="scale-[80%] "/>
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
            {isLoading&&(
                <div className="absolute mt-4 right-20 
                z-[100]
                transition-opacity
                bg-card
                ">
                  <BeatLoader color="white"></BeatLoader>
                </div>
            )}

        </section>
      );    
})
InputMentions.displayName = 'InputMentions'
export default InputMentions;