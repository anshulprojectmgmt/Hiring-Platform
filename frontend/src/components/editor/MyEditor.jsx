import React, { useEffect, useRef, useState } from "react";
import "./Editor.css";
import Editor from "@monaco-editor/react";
import EditorHeader from "../editor-header/EditorHeader";
import { useSelector } from "react-redux";
import {
  pythonCode,
  javascriptCode,
  cppCode,
} from "../../assests/BoilerPlates";
import { userHelperFun, createHelperFun } from "../../utility/wrapper-helper";
import { debounce } from "lodash";
import { ErrorBoundary } from 'react-error-boundary';

const MyEditor = ({ editorRef, inputRef, outputRef }) => {
  const [monacoInstance, setMonacoInstance] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null); 
  const [loading,setLoading] = useState(null);
  
  // const language = useSelector((state) => state.editorTheme.language);
  const theme = useSelector((state) => state.editorTheme.theme);
  const font = useSelector((state) => state.editorTheme.fontSize);
  const currentQuestion = useSelector(
    (state) => state.getQuestion.currentQuestion
  );
   const language = useSelector((state) => state.testInfo.language);
  
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


  
  function foldMainFunction(editor, monaco) {
    console.log('Folding operation triggered');
    
    const model = editor.getModel();
    const lineCount = model.getLineCount();
  
  
    for (let i = 1; i <= lineCount; i++) {
      const lineContent = model.getLineContent(i);
      
      if (lineContent.includes('# <fold>')) {
        const startLineNumber = i + 1;
        editor.setSelection(new monaco.Selection(startLineNumber, 1, startLineNumber, 1));
  
        // Trigger folding
        editor.trigger('', 'editor.fold', {});
  
        // Break after folding the desired section
        break;
      }
    }
  
  }
  
 
  // Called when the editor is mounted
  const onMount = (editor, monaco) => {
  setMonacoInstance(monaco);
  setEditorInstance(editor);

  

  // Folding for Python
  if (language.toLowerCase() === 'python') {
    monaco.languages.registerFoldingRangeProvider(language.toLowerCase(), {
      provideFoldingRanges: (model, context, token) => {
        const ranges = [];
        const lines = model.getLinesContent();

        lines.forEach((line, i) => {
          if (line.includes('# <fold>')) {
            const start = i + 1;
            for (let j = start; j < lines.length; j++) {
              if (lines[j].includes('# </fold>')) {
                ranges.push({
                  start: start,
                  end: j + 1,
                  kind: monaco.languages.FoldingRangeKind.Comment,
                });
                break;
              }
            }
          }
        });

        return ranges;
      },
    });
  }

  // Folding for JavaScript
  if (language.toLowerCase() === 'javascript') {
    console.log('registering js fold provider');
    monaco.languages.registerFoldingRangeProvider('javascript', {
      provideFoldingRanges: (model, context, token) => {
        const ranges = [];
        const lines = model.getLinesContent();

        lines.forEach((line, i) => {
          if (line.includes('// <fold>')) {
            console.log('found fold start at line', i + 1);
            const start = i + 1;
            for (let j = start; j < lines.length; j++) {
              if (lines[j].includes('// </fold>')) {
                  console.log('found fold end at line', j + 1);
                ranges.push({
                  start: start,
                  end: j + 1,
                  kind: monaco.languages.FoldingRangeKind.Comment,
                });
                break;
              }
            }
          }
        });

        return ranges;
      },
    });
  }

  // force monaco to refresh folding
  // const model = editor.getModel();
  // console.log('Model for folding:', model);
  // if (model) {
  //   // monaco.editor.foldAll(model);
  //   console.log("Triggering fold all action");
  //   editor.getAction('editor.foldAll').run();
  // }

  // Call additional mount handler if necessary
  handleMount && handleMount(editor, monaco);
};


  // Called when editor content changes
   //const monacoEditorChange = (newValue, event) => {
    // setLoading(true);
    // console.log('editor on change:', editorInstance);
    // if (editorInstance && monacoInstance) {
    //   // Use the saved editor and monaco instances to fold the main function
    //   foldMainFunction(editorInstance, monacoInstance);
    // }
    // setLoading(false);
   //};

  //  useEffect(() => {
  //   if (editorInstance && monacoInstance) {
  //     // Use the saved editor and monaco instances to fold the main function
  //  console.log('effect for fold get called')
  //     foldMainFunction(editorInstance, monacoInstance);
  //   }
  //  },[currentQuestion, editorInstance])
 
  
  
const quesBoilerCode = (lang) => {
  let newCode =''
  if(lang=="Python"){
    const wrapTitle=    questions[currentQuestion]?.wrapper_details[0]?.title
     // Calculate base indentation
    const baseIndentation = '    '; // assuming the base indentation is 4 spaces


// Indent the inserted code
const indentedInsertedCode = questions[currentQuestion]?.wrapper_details[0].wrapper
  .split('\n')
  .map(line => baseIndentation + line) // add base indentation to each line
  .join('\n');
      
newCode = `
def ${userHelperFun(wrapTitle)}:
# write your code here and return output


${'\n'.repeat(100)}

# <fold>
def main():
#  pre define --------********
${indentedInsertedCode}        

# ***** end ************

    print(${createHelperFun(wrapTitle)})    
main()

# </fold> 
`;

return newCode;
  } 
  else if(lang=="Javascript"){
     const wrapTitle=    questions[currentQuestion]?.wrapper_details[0]?.title
     
     const wrapper = questions[currentQuestion]?.wrapper_details[0].wrapper
  
newCode = `
function ${userHelperFun(wrapTitle)} {
    // write your code here and return output
}

${'\n'.repeat(100)}

// <fold>
function main() {
    // pre define --------********
    ${wrapper}
    // ***** end ************

    console.log(${createHelperFun(wrapTitle)});
}

main();

// </fold>
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
            (e) => e.queNumber === currentQuestion
          );
          if (i !== -1) {
            console.log('js')
            editorRef?.current?.setValue(savedCode[i].code);
          } else if (i === -1) {
            editorRef?.current?.setValue(quesBoilerCode("Javascript"));
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
        value={`${editorRef?.current?.getValue() ? editorRef.current.getValue() : quesBoilerCode(language)}`}        
        
        options={{
          saveViewState: false,
          keepCurrentModel: true,
          wordWrap: "on",
          showUnused: false,
          folding: true,
          //foldingStrategy: 'indentation',
          
          lineNumbersMinChars: 3,
          minimap: {
            enabled: false,
          },
          fontSize: font,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          bracketPairColorization: {
            enabled: true,
          },
          colorDecorators: true,
          wordBasedSuggestionsOnlySameLanguage: true,
          // New properties for improved handling
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
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
        onMount={onMount}
        
      />
      <EditorHeader
        inputRef={inputRef}
        outputRef={outputRef}
        editorRef={editorRef}
      />
    </div>
  );
};



export default MyEditor;
