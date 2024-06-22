import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import DOMPurify from 'dompurify';
import { getUserListByName } from "@/actions/search/users";
import { useCursor, useText } from "../Context";
import { ExtendedUser } from "@/next-auth";

type contentEditableInputProp = {
    textState?:string,
    // TextInputRef?:HTMLDivElement,
    isEditable?:boolean,
    onContentChange?:(textState:string)=>void,

}
export interface ContentEditableInputHandle {
    focusInput: () => void;
    insertEmoji: (emoji: string) => void;
  }
const ContentEditableInput = forwardRef<ContentEditableInputHandle, contentEditableInputProp>(({ isEditable, onContentChange }, ref) => {
    const TextInputRef = useRef<HTMLDivElement>()
    const [showSuggestions,setShowSuggestions]=useState(false)
    const [users,setUsers]=useState<ExtendedUser[]>()
    const {cursorPosition,setCursorPosition}=useCursor()
    const [cursorInfo, setCursorInfo] = useState<{ node: Node; offset: number } | null>(null);
    const {textState,setTextState}=useText()
    ///TODO: handle case where Context is not exist 
    const [isUserChoose,setUserChoose]=useState(false)
    
    useEffect(()=>{
        console.log('cursorPosition',cursorPosition)
    },[cursorPosition])

    useEffect(() => {
        const detectMention = async () => {
            // console.log('DetectMentionEffect',isUserChoose)
          const mentionIndex = textState.lastIndexOf('@');
          if (mentionIndex !== -1 && cursorPosition > mentionIndex) {
            const query = textState.substring(mentionIndex + 1, cursorPosition);
            if (query) {
              const {searchResult,error} = await getUserListByName({name:query,pageParams:1});
              if(error) {throw new Error (error)}
              setUsers(searchResult);
              setShowSuggestions(true);
            }   
          } else {
            setShowSuggestions(false);
          }
        };
        const handleSelectionChange = () => {
            console.log('Cursor position:', TextInputRef);

            if (TextInputRef.current && document.activeElement === TextInputRef.current) {
              const selection = window.getSelection();
              console.log('Cursor position:', selection);

              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const position = range.startOffset;
                console.log('Cursor position:', position);
                setCursorPosition(position)
              }
            }
          };
    
    
        if(isUserChoose){
            setUserChoose(false)
            return ()=>null
        }

        const handleFocus = () => {
            if (TextInputRef.current.innerText === 'Type here...') {
              TextInputRef.current.innerText = '';
              TextInputRef.current.classList.remove('placeholder');
            }
          };
      
          const handleBlur = () => {
            if (TextInputRef.current.innerText === '') {
              TextInputRef.current.innerText = 'Type here...';
              TextInputRef.current.classList.add('placeholder');
            }
          };
      
          const editor = TextInputRef.current;
          editor.addEventListener('input', detectMention);
          editor.addEventListener('focus', handleFocus);
          editor.addEventListener('blur', handleBlur);
          editor.addEventListener('selectionchange', handleSelectionChange);

          handleBlur();
      
          return () => {
            editor.removeEventListener('input', detectMention);
            editor.removeEventListener('focus', handleFocus);
            editor.removeEventListener('blur', handleBlur);
            editor.removeEventListener('selectionchange', handleSelectionChange);

          };
        // detectMention()
      }, []);

    useImperativeHandle(ref, () => ({
      focusInput() {
        TextInputRef.current.focus();
      },
      insertEmoji(emoji: string) {
        if (TextInputRef.current) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const textNode = document.createTextNode(emoji);
            range.insertNode(textNode);

            // Move the cursor to the end of the inserted emoji
            range.setStartAfter(textNode);
            range.setEndAfter(textNode);
            selection.removeAllRanges();
            selection.addRange(range);

            // Update the parent component with the new content
            if (onContentChange) {
              onContentChange(TextInputRef.current.innerHTML);
            }
          }}},

    
    }));
    const handleInput = () => {
        if (TextInputRef.current) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            setCursorInfo({
              node: range.startContainer,
              offset: range.startOffset,
            });
          }
  
          // Update the state with the new content
          const newContent = TextInputRef.current.innerHTML;
          if (onContentChange) {
            onContentChange(newContent);
          }
  
          setTimeout(() => {
            if (TextInputRef.current && cursorInfo) {
              const range = document.createRange();
              const selection = window.getSelection();
  
              // Restore the cursor position
              range.setStart(cursorInfo.node, cursorInfo.offset);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
              TextInputRef.current.focus();
            }
          }, 0);
        }
      };
  
      useEffect(() => {
        if (TextInputRef.current) {
          TextInputRef.current.innerHTML = DOMPurify.sanitize(textState || '');
        }
      }, [textState]);
  
    return(
        <div 
        ref={TextInputRef}
        id="editor"  
        onInput={handleInput}
        contentEditable={isEditable}

        className="
            flex min-h-[30px] w-full rounded-md  bg-background px-3 py-2 
            text-xl ring-offset-background placeholder:text-xl placeholder:text-neutral-400 placeholder:focus:text-neutral-600
            focus:border-none focus:outline-none focus-visible:outline-none  
            disabled:cursor-not-allowed disabled:opacity-50"
        />
    )
})

export default ContentEditableInput