import React, { useState } from "react";
import "./Problem.css";
import { useDispatch, useSelector } from "react-redux";
import { CodeStatus } from "../../compiler/Compiler";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';

const Problem = ({ editorRef, inputRef, outputRef }) => {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.getQuestion.questions);
  const currentQuestion = useSelector(
    (state) => state.getQuestion.currentQuestion
  );
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const savedCode = useSelector((state) => state.savedCode);
  // console.log(savedCode)

  const handlePrev = () => {
    // console.log(currentQuestion)
    dispatch({ type: "PREV_QUESTION" });
    // console.log(currentQuestion)
    inputRef.current.innerText = "";
    outputRef.current.innerText = "";
    const index = savedCode.findIndex((e) => e.queNumber === currentQuestion-1);
    // console.log(index);
    if (index !== -1) {
      dispatch({ type: "CHANGE_LANGUAGE", payload: savedCode[index].lang });
      editorRef.current.setValue(savedCode[index].code );
    } 
    else if(index === -1){
      dispatch({type: "CHANGE_LANGUAGE", payload: "Python"})
    editorRef.current.setValue(`def main():
    print("Hello World")
    
main()
# write a function such that user can give input as well`);
    }
    dispatch({ type: "CHANGE_CODE_STATUS", payload: CodeStatus.Finished });
  };

  const handleNext = () => {
    if(currentQuestion === questions.length - 1){
      setShow(true);
    }
    else{
      dispatch({ type: "NEXT_QUESTION" });
    inputRef.current.innerText = "";
    outputRef.current.innerText = "";
    const index = savedCode.findIndex((e) => e.queNumber === currentQuestion+1);
    if (index !== -1) {
      dispatch({ type: "CHANGE_LANGUAGE", payload: savedCode[index].lang });
      editorRef.current.setValue(savedCode[index].code);
    }
    else if(index === -1){
      dispatch({type: "CHANGE_LANGUAGE", payload: "Python"})
    editorRef.current.setValue(`def main():
    print("Hello World")
    
main()
# write a function such that user can give input as well`);
    }
    dispatch({ type: "CHANGE_CODE_STATUS", payload: CodeStatus.Finished });
    }
    
  };
  // console.log(questions)
  return (
    <div className="problem">
      <div className="problem_header">
        <button
          disabled={currentQuestion === 0}
          onClick={handlePrev}
          className="back_btn"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <button
          // disabled={currentQuestion === questions.length - 1}
          onClick={handleNext}
          className="next_btn"
        >
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
        <Modal.Title>Alert!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This is the last question you can submit the test by clicking on the end test button.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Ok
          </Button>

        </Modal.Footer>
      </Modal>
      <div className="problem_body">
        <h3 className="problem_body_heading">Problem {currentQuestion + 1}</h3>
        <p>{questions[currentQuestion].question}</p>
        <p className="examples">
          <strong>
            <em className="problem_body_heading">Example:</em>
          </strong>{" "} <br />
           Input: <pre>{questions[currentQuestion].testcases[0].input}</pre>
           Output: <pre>{questions[currentQuestion].testcases[0].output}</pre>
        </p>
      </div>
    </div>
  );
};

export default Problem;
