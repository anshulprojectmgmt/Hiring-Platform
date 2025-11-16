import React, { useEffect, useRef } from "react";
import "./Body.css";
import Problem from "../problem/Problem";
import MyEditor from "../editor/MyEditor";
import Result from "../results/Result";
import { useSelector } from "react-redux";

const Body = () => {
 

  const codeStatus = useSelector((state) => state.editorTheme.codeStatus);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const editorRef = useRef(null);
  const codeStatusStyle = {
    
    backgroundColor : codeStatus === 1 ? '#FFD301' : codeStatus === 2 ? '#7BB662' : '#E03C32',
  }
  const questions = useSelector((state) => state?.getQuestion?.questions);
  
  useEffect(() => {
    if(questions.length > 0) {
     
    let input_array = questions[0]?.testcases[0]?.input
  
    inputRef.current.innerText =   input_array.join('\n')
 
  
  } 
  },[questions])

  return (
    <div className="body_editor">
      <Problem editorRef={editorRef} inputRef={inputRef} outputRef={outputRef} />
      <MyEditor editorRef={editorRef} inputRef={inputRef} outputRef={outputRef} />
      <div className="console ">
        <div className="console_header">
          <div className="console_header_left">
            <span
              className="code_status"
              style={codeStatusStyle}
            >
               {codeStatus === 1
                ? "Running"
                : codeStatus === 2
                ? "Finished"
                : "Error"}
            </span>
          </div>
          <div className="console_header_right">
            <button onClick={() => {outputRef.current.innerText = ""}} className="round clear_console_btn">Clear Console</button>
          </div>
        </div>
        <div className="console_body">
          <div className="console_input">
            <div>
              INPUT BOX
            </div>
            <p className="info">▶️Please ensure <strong>input box</strong> is not blank when you try to <strong>‘run’</strong> and test the code.</p>
            <Result ioRef={inputRef} editable={true} />
          </div>
          <div className="console_output">
            <div>OUTPUT BOX</div>
            <p className="info">▶️If you are getting zero test cases passed, make sure you are not using <strong>print</strong>  to output, rather use <strong>return</strong> to output results.</p>
            <Result ioRef={outputRef} editable={false} />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
