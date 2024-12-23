
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

interface CursorContextType {
    cursorPosition: number;
    setCursorPosition: Dispatch<SetStateAction<number>>;
  }
interface TextContextType {
  textState?:string,
  setTextState: Dispatch<SetStateAction<string>>
}
type CursorProviderProps = {
    children: ReactNode;
  };

  const CursorContext = createContext<CursorContextType | undefined>(undefined);
  const TextContext = createContext<TextContextType|undefined>(undefined)

  export const useCursor = () => {
    const context = useContext(CursorContext);
    if (context === undefined) {
      throw new Error('useCursor must be used within a InputProvider');
    }
    return context;
  };

  export const useText = ()=>{
    const context = useContext(TextContext);
    if(context === undefined){
      throw new Error ('useText must be used within a InputProvider')
    }
    return context
  }

export const InputProvider: React.FC<CursorProviderProps> = ({ children }) => {
    const [cursorPosition, setCursorPosition] = useState(0);
    const [textState,setTextState] = useState('')
    return(
      <TextContext.Provider value={{setTextState,textState}}>
        <CursorContext.Provider 
          value={{cursorPosition,setCursorPosition}}>
          {children}
          </CursorContext.Provider>
      </TextContext.Provider>
    )
}
