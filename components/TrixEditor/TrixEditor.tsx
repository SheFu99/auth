// import React, { useRef, useEffect } from 'react';
// import 'trix';
// import 'trix/dist/trix.css';
// // import './styles.css';  // Assuming your CSS styles are defined here

// interface TrixEditorProps {
//   toolbarId: string;
//   inputId?: string;
//   value?: string;
//   onChange?: (value: string) => void;
// }

// const TrixEditor: React.FC<TrixEditorProps> = ({ toolbarId, inputId, value, onChange }) => {
//   const editorRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleTrixAction = (event: any) => {
//       if (event.actionName.startsWith('align-')) {
//         const editorElement = editorRef.current?.querySelector('trix-editor') as HTMLDivElement;
//         const range = editorElement.editor?.getSelectedRange();
//         const alignmentType = event.actionName.split('-')[1];
//         applyTextAlignment(editorElement, alignmentType);
//         editorElement.editor?.setSelectedRange(range);
//       }
//     };

//     document.addEventListener('trix-action-invoke', handleTrixAction);
//     return () => {
//       document.removeEventListener('trix-action-invoke', handleTrixAction);
//     };
//   }, []);

//   const applyTextAlignment = (editorElement: HTMLDivElement, alignmentType: string) => {
//     const attribute = `text-align-${alignmentType}`;
//     const selectedText = editorElement.editor?.getSelectedDocument().toString();
//     if (selectedText) {
//       const html = `<div class="${attribute}">${selectedText}</div>`;
//       editorElement.editor?.loadHTML(html);
//     }
//   };

//   return (
//     <div ref={editorRef}>
//       <trix-toolbar id={toolbarId}>
//         <button type="button" className="text-white  text-center" data-trix-action="align-left">Left</button>
//         <button type="button" className="text-white " data-trix-action="align-center">Center</button>
//         <button type="button" className="text-white " data-trix-action="align-right">Right</button>
//         <button type="button" className="text-white " data-trix-action="align-justify">Justify</button>
//       </trix-toolbar>
//       <trix-editor toolbar={toolbarId} input={inputId}></trix-editor>
//       {inputId && <input id={inputId} type="hidden" />}
//     </div>
//   );
// };

// export default TrixEditor;
