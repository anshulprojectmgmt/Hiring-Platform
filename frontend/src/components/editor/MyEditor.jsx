import React, { useEffect, useRef } from "react";
import "./Editor.css";
import Editor from "@monaco-editor/react";
import EditorHeader from "../editor-header/EditorHeader";
import { useSelector } from "react-redux";
import {
  pythonCode,
  javascriptCode,
  cppCode,
} from "../../assests/BoilerPlates";
import { debounce } from "lodash";
import { ErrorBoundary } from 'react-error-boundary';

const MyEditor = ({ editorRef, inputRef, outputRef }) => {
  const language = useSelector((state) => state.editorTheme.language);
  const theme = useSelector((state) => state.editorTheme.theme);
  const font = useSelector((state) => state.editorTheme.fontSize);
  const currentQuestion = useSelector(
    (state) => state.getQuestion.currentQuestion
  );
  
  const savedCode = useSelector((state) => state.savedCode);
  const questions = useSelector((state) => state.getQuestion.questions);
  
  {/** logic to handle editor on resize error / START */}
  // const resizeObserverRef = useRef(null);

  // const handleResize = () => {
  //   if (editorRef.current) {
  //     try {
  //       editorRef.current.layout();
  //     } catch (error) {
  //       console.error("Error in resizing editor:", error);
  //     }
  //   }
  // };

  // // Debounce resize to avoid excessive calls
  // const debouncedResize = debounce(handleResize, 200);

 
  // useEffect(() => {
  //   // Set up the ResizeObserver to monitor the editor's container size changes
  //   const resizeObserver = new ResizeObserver((entries) => {
  //     for (let entry of entries) {
  //       if (entry.contentRect) {
  //         debouncedResize();
  //       }
  //     }
  //   });

  //   // Observe the editor's container
  //   if (editorRef.current) {
  //     resizeObserver.observe(editorRef.current.getDomNode());
  //   }

  //   // Store the reference for cleanup
  //   resizeObserverRef.current = resizeObserver;

  //   // Cleanup function
  //   return () => {
  //     if (resizeObserverRef.current) {
  //       resizeObserverRef.current.disconnect();
  //       debouncedResize.cancel();
  //     }
  //   };
  // }, [editorRef, debouncedResize]);

  {/** logic to handle editor on resize error / END */}
 
  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
  };
  
const quesBoilerCode = (lang) => {
  let newCode =''
  if(lang=="Python"){
    //   ${questions[currentQuestion].wrapper_details[0].wrapper}
     // Calculate base indentation
const baseIndentation = '    '; // assuming the base indentation is 4 spaces

// Indent the inserted code
const indentedInsertedCode = questions[currentQuestion].wrapper_details[0].wrapper
  .split('\n')
  .map(line => baseIndentation + line) // add base indentation to each line
  .join('\n');
      
newCode = `
def main():
#  pre define --------********
${indentedInsertedCode}        

# ***** end ************

# write your code here and print the output.
    
main()
 
`;

return newCode;
  }
}


  useEffect(() => {
    
    try {
      switch (language) {
        case "Python":
          const index = savedCode.findIndex(
            (e) => e.queNumber === currentQuestion
          );
          if (index !== -1) {
            console.log('python')
            editorRef?.current?.setValue(savedCode[index].code);
          } else if (index === -1) {
            editorRef?.current?.setValue(quesBoilerCode("Python") );
          }
          break;
        case "Cpp":
          const idx = savedCode.findIndex(
            (e) => e.question === currentQuestion
          );
          if (idx !== -1 ) {
            console.log('cpp')
            editorRef?.current?.setValue(savedCode[idx].code);
          } else if (idx === -1) {
            editorRef?.current?.setValue(cppCode);
          }
          break;
        case "Javascript":
          const i = savedCode.findIndex(
            (e) => e.question === currentQuestion
          );
          if (i !== -1) {
            console.log('js')
            editorRef?.current?.setValue(savedCode[i].code);
          } else if (i === -1) {
            editorRef?.current?.setValue(javascriptCode);
          }
          break;
        case "Sql":
          const a = savedCode.findIndex(
            (e) => e.question === currentQuestion
          );
          if (a !== -1) {
            editorRef?.current?.setValue(savedCode[a].code);
          } else if (a === -1) {
            editorRef?.current?.setValue("SELECT * FROM Customers;");
          }
          break;
        default:
          console.log('default')
          editorRef?.current?.setValue(pythonCode);
      }

    } catch (error) {
      console.error("Error setting editor value:", error);
    }
   
  }, [language, editorRef]);

  return (
    <div className="editor-container">
      
     <Editor className="editor"
        theme={theme}
        height="100%"
        language={language.toLowerCase()}
        value={`${editorRef?.current?.getValue() ? editorRef.current.getValue() : quesBoilerCode("Python")}`}
        options={{
          saveViewState: false,
          keepCurrentModel: true,
          wordWrap: "on",
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          minimap: {
            enabled: false,
          },
          fontSize: font,
          scrollBeyondLastLine: true,
          automaticLayout: true,
          bracketPairColorization: {
            enabled: true,
          },
          colorDecorators: true,
          wordBasedSuggestionsOnlySameLanguage: true,
          // New properties for improved handling
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            alwaysConsumeMouseWheel: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10
          },
          overflowWidgetsDomNode: document.body,
          renderWhitespace: 'boundary',
          smoothScrolling: true,
          lineHeight: font + 4, // Adjust line height dynamically
          padding: {
            top: 10,
            bottom: 10
          },
          fixedOverflowWidgets: true,
          scrollBeyondLastLine: false, // Prevent scrolling beyond last line
        }}
        onMount={handleMount}
      />
      <EditorHeader
        inputRef={inputRef}
        outputRef={outputRef}
        editorRef={editorRef}
      />
    </div>
  );
};

// Fallback component for error boundary
// const FallbackComponent = () => {
//   return <div style={{color: 'black'}}>Something went wrong with the editor.</div>;
// };
// const WrappedMyEditor = (props) => (
//   <ErrorBoundary FallbackComponent={FallbackComponent} >
//     <MyEditor {...props} />
//   </ErrorBoundary>
// );

export default MyEditor;
