import React, { useState } from "react";
import "./EditorHeader.css";
import SettingModal from "../settingmodal/SettingModal";
import DropDown from "../dropdown/DropDown";
import { useDispatch, useSelector } from "react-redux";
import  { CodeStatus, languageCode } from "../../compiler/Compiler";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import BASE_URL from "../../Api";

const EditorHeader = ({ editorRef, inputRef, outputRef }) => {
  const language = useSelector((state) => state.editorTheme.language);
  const codeStatus = useSelector((state) => state.editorTheme.codeStatus);
  const questions = useSelector((state) => state.getQuestion.questions);
  // const check = useSelector((state) => state.savedCode);
  const currentQuestion = useSelector(
    (state) => state.getQuestion.currentQuestion
  );
  const dispatch = useDispatch();
  const [isRun, setIsRun] = useState(false);

  function convertArrayString(str) {
    let result = '';
    let openBrackets = 0;
    let segment = '';

    for (let char of str) {
        if (char === '[') {
            openBrackets += 1;
            if (openBrackets === 1) {
                // Start of a new segment, reset segment
                segment = '';
                continue;
            }
        }
        if (char === ']') {
            openBrackets -= 1;
            if (openBrackets === 0) {
                // End of a segment, process the segment
                result += segment.split(',').map(item => item.trim()).join(' ') + ' ';
                continue;
            }
        }
        if (openBrackets > 0) {
            // Inside a segment
            segment += char;
        } else {
            // Outside any segment, copy the character as it is
            result += char;
        }
    }

    // Trim the final result to remove any extra spaces
    return result.trim();
}



  const handleSubmit = async () => {
    try {
      dispatch({ type: "CHANGE_CODE_STATUS", payload: CodeStatus.Running });

      setIsRun(true);
      let inputs = await questions[currentQuestion].testcases.map((e) => (e? e.input : null));
      let outputs = await questions[currentQuestion].testcases.map((e) => (e ?e.output: null));
      // console.log('inputs==' , inputs);
      // console.log('outputs==' , outputs);
      let totalCases = outputs.length;
      const code = editorRef.current.getValue();
      const languageChoice = languageCode[language];
      
   // update input format 
    inputs = inputs.map((inpArr) => {
      if(inpArr){
    // Use reduce to concatenate elements with a newline character
    let str = inpArr.reduce((acc, ele) => {
      return acc + ele + '\n';
    }, "");
  
    // Remove the last newline character for each string
    return str.slice(0, -1);
  }
  });

  // update output format
  outputs = outputs.map((inpArr) => {
    if(inpArr){
    // Use reduce to concatenate elements with a newline character
    let str = inpArr.reduce((acc, ele) => {
      return acc + ele.toLowerCase() + '\n';
    }, "");
  
    // Remove the last newline character for each string
    return str.slice(0, -1);
  }
  });
  
  // console.log('inputs == after' , inputs);
  // console.log('outputs== after' , outputs);

 

      const requestBody = {
        "submissions": [
          {
            "language_id": languageChoice,
            "source_code": code,
            "stdin": inputs[0]
          },
          {
            "language_id": languageChoice,
            "source_code": code,
            "stdin": inputs[1]
          },
          {
            "language_id": languageChoice,
            "source_code": code,
            "stdin": inputs[2]
          }
        ]
      };

      const response = await axios.post(
        "https://compiler.aiplanet.me/submissions/batch",
        { ...requestBody }
      );
      
      const tokens = response.data.map((e) => e.token);
      // console.log('tokens==' , tokens); 
      const userOutputs = await Promise.all(tokens.map(async (token) => {
        async function checkSubmissionStatus() {
          const statusResponse = await axios.get(
            `https://compiler.aiplanet.me/submissions/${token}`
          );
          // console.log('status respon===' , statusResponse);
          if (statusResponse.data.status.id === 1 || statusResponse.data.status.id === 2) {
            return new Promise(resolve => setTimeout(resolve, 1000)).then(checkSubmissionStatus);
          } else {
            const output = statusResponse.data;
            let statusId = output.status.id;
            const validStatusIds = [5, 6, 7, 8, 9, 10, 11, 12];
            if (statusId === 3) {
              return output.stdout;
            }else if(validStatusIds.includes(statusId)){
              return "compilation";
            }
             else {
              return "wrong";
            }
          }
        }
        return checkSubmissionStatus();
      }));
      //  console.log('user output for each test case =' , userOutputs);
      const finalOutput = userOutputs.map((e) => { let str =e.trim().toLowerCase();
           return convertArrayString(str);
      });
      // console.log('final output after trim =' , finalOutput);
      var compilation = false;
      if (finalOutput.every(value => value === "compilation")) {
        compilation = true;
      }
      const testPassed = outputs.reduce((acc, curVal, i) => {
        if( curVal === finalOutput[i]){
          return acc + 1;
        }
        return acc;
      }, 0);

      dispatch({
        type: "CHANGE_CODE_STATUS",
        payload: CodeStatus.Finished,
      });
      setIsRun(false);
      outputRef.current.innerText =  `Total test cases: ${totalCases}
                                      Test passed: ${testPassed}`;
      if(compilation){
        dispatch({
          type: "UPLOAD_CODE",
          queNumber: currentQuestion,
          question: questions[currentQuestion].question,
          language: language,
          code: code,
          score: 0,
        });
      }
      else{
        if(testPassed === totalCases){
          dispatch({
            type: "UPLOAD_CODE",
            queNumber: currentQuestion,
            question: questions[currentQuestion].question,
            language: language,
            code: code,
            score: 10,
          });
        }else{
          dispatch({
            type: "UPLOAD_CODE",
            queNumber: currentQuestion,
            question: questions[currentQuestion].question,
            language: language,
            code: code,
            score: -1,
          });
        }
      }
    } catch (error) {
      setIsRun(false);
      console.log('compiler timeout', error);
    }
  };

  const handleRun = async () => {
    if (language === "Sql") {
      dispatch({ type: "CHANGE_CODE_STATUS", payload: CodeStatus.Running });
      outputRef.current.innerText = "";
      const query = editorRef.current.getValue();
      try {
        const res = await axios.post(`${BASE_URL}/api/query`, {
          query,
        });
        // console.log(res.data);
        if (res.data.success === true) {
          const row_data = res.data.rows;
          const row_headings = res.data.fields;
          // console.log(row_data, row_headings);
          var tableHTML =
            "<table><thead><tr>" +
            row_headings
              .map((e, i) => {
                return "<th>" + e.name + "</th>";
              })
              .join("") +
            "</tr></thead><tbody>" +
            row_data
              .map((item, i) => {
                return (
                  "<tr>" +
                  Object.values(item)
                    .map((value) => {
                      return "<td>" + value + "</td>";
                    })
                    .join("") +
                  "</tr>"
                );
              })
              .join("") +
            "</tbody></table>";
          outputRef.current.innerHTML = tableHTML;
          dispatch({
            type: "CHANGE_CODE_STATUS",
            payload: CodeStatus.Finished,
          });
        } else {
          outputRef.current.innerText = res.data.error;
          dispatch({ type: "CHANGE_CODE_STATUS", payload: CodeStatus.Error });
        }
      } catch (error) {
        console.log(error);
        dispatch({ type: "CHANGE_CODE_STATUS", payload: CodeStatus.Error });
      }
    } else {
      dispatch({ type: "CHANGE_CODE_STATUS", payload: CodeStatus.Running });
      outputRef.current.innerText = "";
      const code = editorRef.current.getValue();
      const input = inputRef.current.innerText;
      const languageChoice = languageCode[language];
      const requestBody = {
        source_code: code,
        language_id: languageChoice,
        number_of_runs: null,
        stdin: input,
        expected_output: null,
        cpu_time_limit: null,
        cpu_extra_time: null,
        wall_time_limit: null,
        memory_limit: null,
        stack_limit: null,
        max_processes_and_or_threads: null,
        enable_per_process_and_thread_time_limit: null,
        enable_per_process_and_thread_memory_limit: null,
        max_file_size: null,
        enable_network: null,
      };

      try {
        const response = await axios.post(
          "https://compiler.aiplanet.me/submissions",
          { ...requestBody }
        );
        const token = response.data.token;
        // console.log(token);
        async function checkSubmissionStatus() {
          const statusResponse = await axios.get(
            `https://compiler.aiplanet.me/submissions/${token}`
          );
          // console.log(statusResponse)
          if (statusResponse.data.status.id === 1 || statusResponse.data.status.id === 2) {
            setTimeout(checkSubmissionStatus, 1000);
          } else {
            // const outputResponse = await axios.get(
            //   `http://13.232.157.37:2358/submissions/${token}`
            // );
            const output = statusResponse.data;
            let statusId = output.status.id;
            // console.log(statusId)
            if (statusId === 6) {
              dispatch({
                type: "CHANGE_CODE_STATUS",
                payload: CodeStatus.Error,
              });
              outputRef.current.innerText = output.stderr;
            } else if (statusId === 3) {
              dispatch({
                type: "CHANGE_CODE_STATUS",
                payload: CodeStatus.Finished,
              });
              outputRef.current.innerText = output.stdout;
            } else if (statusId === 5) {
              dispatch({
                type: "CHANGE_CODE_STATUS",
                payload: CodeStatus.Error,
              });
              // console.log("Time Limit Exceeded");
              outputRef.current.innerText = "Time Limit Exceeded";
            } else {
              dispatch({
                type: "CHANGE_CODE_STATUS",
                payload: CodeStatus.Error,
              });
              // console.log(atob(outputDetails?.stderr));
              outputRef.current.innerText = output.stderr;
            }
          }
        }

        checkSubmissionStatus();
      } catch (error) {
        console.log(error);
        dispatch({ type: "CHANGE_CODE_STATUS", payload: CodeStatus.Error});
      }
    }
  };

  return (
    <div className="editor_header ">
      <div className="editor_header_left">
        <button
          disabled={codeStatus === CodeStatus.Running}
          onClick={handleRun}
          className="run_code_btn"
        >
          <i className="fa fa-play-circle" aria-hidden="true"></i>&nbsp; Run{" "}
        </button>
        <button onClick={handleSubmit} className="submit_code_btn">
          {isRun === true ?  <BeatLoader size={12} color="#ffffff" /> : 'Save & Submit' }
        </button>
        <div className="info">Click on save&submit to submit answer for evaluation.</div>
      </div>
      <div className="editor_header_right">
        <DropDown
          dropDownName="language"
          dropDownAction="CHANGE_LANGUAGE"
          dropDownOptions={["Python"]}
        />
        <div className="editor_header_right_options">
          <button
            className="editor_header_setting"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            <i className="fa fa-cog " aria-hidden="true"></i>
          </button>
          <SettingModal />
        </div>
      </div>
    </div>
  );
};

export default EditorHeader;
