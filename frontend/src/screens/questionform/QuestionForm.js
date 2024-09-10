import React, { useEffect, useRef, useState } from "react";
import styles from "./QuestionForm.module.css";
import axios from "axios";
import BASE_URL from "../../Api";

const QuestionForm = () => {
  const [question, setQuestion] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [inputType, setInputType] = useState("mixlist_integer");
  const [testcases, setTestcases] = useState([]);
const [testType ,setTestType] = useState("coding");
const [wrapTitle , setWrapTitle] = useState([]);

const getWrapperTitles = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/api/wrapper-type`);
        // const data = await res.JSON();
        console.log('data' , res.data.titles);
        setWrapTitle(res.data.titles);

    } catch (error) {
        console.log(error);
    }
 
}

useEffect(() => {
if(testType==="coding") {
getWrapperTitles();
}
},[])


  const handleAddTestcase = () => {
    setTestcases([...testcases, { inputs: [""], outputs: [""] }]);
  };

  const handleAddInput = (testcaseIndex) => {
    const newTestcases = [...testcases];
    newTestcases[testcaseIndex].inputs.push("");
    setTestcases(newTestcases);
  };

  const handleAddOutput = (testcaseIndex) => {
    const newTestcases = [...testcases];
    newTestcases[testcaseIndex].outputs.push("");
    setTestcases(newTestcases);
  };

  const handleInputChange = (testcaseIndex, inputIndex, value) => {
    const newTestcases = [...testcases];
    newTestcases[testcaseIndex].inputs[inputIndex] = value;
    setTestcases(newTestcases);
  };

  const handleOutputChange = (testcaseIndex, outputIndex, value) => {
    const newTestcases = [...testcases];
    newTestcases[testcaseIndex].outputs[outputIndex] = value;
    setTestcases(newTestcases);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const wrap = wrapTitle.find((item) => item.title===inputType);
   
    // Handle form submission logic here
    const body = { 
     question: question,
     difficulty: difficulty.toLowerCase(), 
     input_type: inputType,
     wrapper_id: wrap._id,
     testcases: testcases,
     testtype: "coding"
  }

  try {
    const res = await axios.post(`${BASE_URL}/api/add-coding-question`, body);
    
    
    } catch (error) {
    console.log(error);
}

setQuestion("");
setTestcases([]);

    console.log({
      question,
      difficulty,
      inputType,
      testcases
    });


  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
        <h2 style={{textAlign:"center" , color: "#5880F0"}}>Add-Question</h2>
      <div className={styles.formGroup}>
        <label htmlFor="question">Question</label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className={styles.textarea}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="difficulty">Difficulty</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => {console.log('value==', e.target.value); setDifficulty(e.target.value)}}
          className={styles.select}
          required
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="inputType">Input Type</label>
        <select
          id="inputType"
          value={inputType}
          onChange={(e) =>  {console.log('opt-ref==', ); setInputType(e.target.value);}}
          className={styles.select}
        >
            {wrapTitle.map((wrap) => (
                 <option  key={wrap._id} value={wrap.title}>{wrap.title}</option>
            ))}
         
          </select>
      </div>

      <div className={styles.formGroup}>
        <label>Testcases &ensp; </label>
        {testcases.map((testcase, testcaseIndex) => (
          <div key={testcaseIndex} className={styles.testcase}>
            <h4>Testcase {testcaseIndex + 1}</h4>

            {testcase.inputs.map((input, inputIndex) => (
              <div key={inputIndex} className={styles.inputGroup}>
                <label>Input {inputIndex + 1}</label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) =>
                    handleInputChange(testcaseIndex, inputIndex, e.target.value)
                  }
                  className={styles.input}
                  required
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => handleAddInput(testcaseIndex)}
              className={styles.addInputBtn}
              style={{marginBottom: '1rem'}}
            >
              Add Input
            </button>

            {testcase.outputs.map((output, outputIndex) => (
              <div key={outputIndex} className={styles.outputGroup}>
                <label>Output {outputIndex + 1}</label>
                <input
                  type="text"
                  value={output}
                  onChange={(e) =>
                    handleOutputChange(testcaseIndex, outputIndex, e.target.value)
                  }
                  className={styles.input}
                  required
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => handleAddOutput(testcaseIndex)}
              className={styles.addOutputBtn}
              style={{marginBottom: '1rem'}}
            >
              Add Output
            </button>
          </div>
        ))}

        <button type="button" onClick={handleAddTestcase} 
        className={styles.addTestcaseBtn}
        style={{marginBottom: '1rem'}}
        >
          Add Testcase
        </button>
      </div>

      <button type="submit" className={styles.submitBtn} >
        Submit
      </button>
    </form>
  );
};

export default QuestionForm;
