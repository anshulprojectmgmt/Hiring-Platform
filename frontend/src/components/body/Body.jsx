import React, { useRef } from "react";
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
            <p>
              input 
            </p>
            <Result ioRef={inputRef} editable={true} />
          </div>
          <div className="console_output">
            <p>output</p>
            <Result ioRef={outputRef} editable={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
