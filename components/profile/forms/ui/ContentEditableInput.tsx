import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import DOMPurify from 'dompurify';
import { getUserListByName } from "@/actions/search/users";
import { useCursor, useText } from "../Context";
import { ExtendedUser } from "@/next-auth";
import  './input.css'

type contentEditableInputProp = {
    textState?: string;
    isEditable?: boolean;
    onContentChange?: (textState: string) => void;
};

export interface ContentEditableInputHandle {
    focusInput: () => void;
    insertEmoji: (emoji: string) => void;
}

const ContentEditableInput = forwardRef<ContentEditableInputHandle, contentEditableInputProp>(({ isEditable, onContentChange }, ref) => {
    const TextInputRef = useRef<HTMLDivElement>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [users, setUsers] = useState<ExtendedUser[]>();
    const { cursorPosition, setCursorPosition } = useCursor();
    const { textState, setTextState } = useText();
    const [isUserChoose, setUserChoose] = useState(false);

    useEffect(() => {
        console.log('cursorPosition', cursorPosition);
    }, [cursorPosition]);

    useEffect(() => {
        const detectMention = async () => {
            const mentionIndex = textState.lastIndexOf('@');
            if (mentionIndex !== -1 && cursorPosition > mentionIndex) {
                const query = textState.substring(mentionIndex + 1, cursorPosition);
                if (query) {
                    const { searchResult, error } = await getUserListByName({ name: query, pageParams: 1 });
                    if (error) { throw new Error(error) }
                    setUsers(searchResult);
                    setShowSuggestions(true);
                }
            } else {
                setShowSuggestions(false);
            }
        };

        const handleSelectionChange = () => {
            if (TextInputRef.current && document.activeElement === TextInputRef.current) {
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const position = range.startOffset;

                    setCursorPosition(position); 
                }
            }
        };

        if (isUserChoose) {
            setUserChoose(false);
            return () => null;
        }

        const editor = TextInputRef.current;
        editor.addEventListener('input', detectMention);
        document.addEventListener('selectionchange', handleSelectionChange); 

        return () => {
            editor.removeEventListener('input', detectMention);
            document.removeEventListener('selectionchange', handleSelectionChange); 
        };
    }, [cursorPosition, isUserChoose, textState]);

    useImperativeHandle(ref, () => ({
        focusInput() {
            TextInputRef.current?.focus();
        },
        insertEmoji(emoji: string) {
            if (TextInputRef.current) {
                const content = TextInputRef.current.textContent || '';
                const newText = content.slice(0, cursorPosition) + emoji + content.slice(cursorPosition);

                TextInputRef.current.textContent = newText;

                // Update the parent component with the new content
                setTextState(TextInputRef.current.innerHTML);

                // Update the cursor position after inserting the emoji
                setCursorPosition(cursorPosition + emoji.length);

                // Restore the cursor position
                const selection = window.getSelection();
                const range = document.createRange();
                range.setStart(TextInputRef.current.childNodes[0], cursorPosition + emoji.length);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
                TextInputRef.current.focus();
            }
        },
    }));

    const handleInput = () => {
        if (TextInputRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(TextInputRef.current);
                preCaretRange.setEnd(range.startContainer, range.startOffset);

                setCursorPosition(preCaretRange.toString().length); 
            }

            const newContent = TextInputRef.current.innerHTML;
            setTextState(newContent);

            if (newContent.trim() === '') {
                TextInputRef.current.setAttribute("data-placeholder-active", "true");
            } else {
                TextInputRef.current.removeAttribute("data-placeholder-active");
            }
        }
    };
    const handleUserClick = (user: ExtendedUser) => {
      setUserChoose(true)
      const mentionIndex = textState?.lastIndexOf('@');
      const newRefValue =  `${textState?.substring(0,mentionIndex)}@${user.name}`
      setTextState(newRefValue);
      TextInputRef.current?.focus();
      console.log('textState',newRefValue)
      TextInputRef.current.innerText = newRefValue
      setShowSuggestions(false);
    };

    return (
      <>
        <div
            ref={TextInputRef}
            id="editor"
            onInput={handleInput}
            contentEditable={isEditable}
            data-placeholder="Enter text here..."
            className=" relative placeholder-contenteditable
                flex min-h-[30px] w-full rounded-md bg-background px-3 py-2 
                text-xl ring-offset-background placeholder:text-xl placeholder:text-neutral-400 placeholder:focus:text-neutral-600
                focus:border-none focus:outline-none focus-visible:outline-none  
                disabled:cursor-not-allowed disabled:opacity-50"
        />
        {showSuggestions&&(
                    <div className="
                    absolute insent-0 left-0 right-0 bg-black border-white rounded-sm max-width-[150px]
                    ">
                         {users?.map(user=>(
                            <li key={user.id} onClick={()=>handleUserClick(user)}>{user.name}</li>
                        ))}
                    </div>
                )}
         </>
    );
});

export default ContentEditableInput;



//       
//        )}
//   </>
//     );
// });

// export default ContentEditableInput;
