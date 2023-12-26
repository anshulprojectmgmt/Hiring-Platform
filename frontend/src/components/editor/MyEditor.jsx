import React, { useEffect } from "react";
import "./Editor.css";
import Editor from "@monaco-editor/react";
import EditorHeader from "../editor-header/EditorHeader";
import { useSelector } from "react-redux";
import {
  pythonCode,
  javascriptCode,
  cppCode,
} from "../../assests/BoilerPlates";

const MyEditor = ({ editorRef, inputRef, outputRef }) => {
  const language = useSelector((state) => state.editorTheme.language);
  const theme = useSelector((state) => state.editorTheme.theme);
  const font = useSelector((state) => state.editorTheme.fontSize);
  const currentQuestion = useSelector(
    (state) => state.getQuestion.currentQuestion
  );
  const savedCode = useSelector((state) => state.savedCode);
  const handleMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    switch (language) {
      case "Python":
        const index = savedCode.findIndex(
          (e) => e.question === currentQuestion
        );
        if (index !== -1) {
          console.log('python')
          editorRef?.current?.setValue(savedCode[index].code);
        } else if (index === -1) {
          editorRef?.current?.setValue(pythonCode);
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
  }, [language, editorRef]);

  return (
    <div className="editor">
      <EditorHeader
        inputRef={inputRef}
        outputRef={outputRef}
        editorRef={editorRef}
      />
      <Editor
        theme={theme}
        height="100%"
        language={language.toLowerCase()}
        value={`def main():
    print("Hello World")
    
main()
# write a function such that user can give input as well`}
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
        }}
        onMount={handleMount}
      />
    </div>
  );
};

export default MyEditor;
