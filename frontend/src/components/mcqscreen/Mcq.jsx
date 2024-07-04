import React, { useState } from "react";
import "./Mcq.css";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Mcq = () => {
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.getQuestion.questions);
  const savedMcq = useSelector((state) => state.savedMcq);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [clickedOption, setClickedOption] = useState(0);
  const currentQuestion = useSelector(
    (state) => state.getQuestion.currentQuestion
  );
  const [optionChosen, setoptionChosen] = useState(null);
  // console.log(questions);
  const handleNext = () => {
   
    // console.log(questions[currentQuestion + 1].question);
    if (currentQuestion === questions.length - 1) {
      setShow(true);
    } else {
      dispatch({ type: "NEXT_QUESTION" });
      const index = savedMcq.findIndex(
        (e) => e.question === questions[currentQuestion+1].question
      );
      if (index !== -1) {
        // console.log(savedMcq[index].optionSelected);
        setoptionChosen(savedMcq[index].optionSelected);
      } else if (index === -1) {
        setoptionChosen(null);
      }
      setClickedOption(0);
      
    }
  };
  const handlePrev = () => {
    dispatch({ type: "PREV_QUESTION" });
    // console.log(questions[currentQuestion-1].question);
    const index = savedMcq.findIndex(
      (e) => e.question === questions[currentQuestion-1].question
    );
    if (index !== -1) {
      // console.log(savedMcq[index].optionSelected);
      setoptionChosen(savedMcq[index].optionSelected);
    } else if (index === -1) {
      setoptionChosen(null);
    }
    setClickedOption(0);
   
  };

  const handleChoice = async (current, idx) => {
    // console.log(idx);
    
    const correctAnswer = questions[currentQuestion].answer;
    const value = correctAnswer === current ? 10 : 0;
    // console.log(current, correctAnswer, value);
    await dispatch({
      type: "UPLOAD_MCQ",
      question: questions[currentQuestion].question,
      optionSelected: current,
      score: value,
    });
    // console.log(questions[currentQuestion].question);
    const index = savedMcq.findIndex(
      (e) => e.question === questions[currentQuestion].question
    );
    // console.log(savedMcq[index].optionSelected);
    if (index !== -1) {
      // console.log(savedMcq[index].optionSelected);
      setoptionChosen(current);
    } else if (index === -1) {
      setoptionChosen(null);
    }
    setClickedOption(idx);
  };

  return (
    <div className="mcq-screen">
      <div className="mcq-head">
      <div>
        {currentQuestion!==0 && 
        <button
          
          disabled={currentQuestion === 0}
          onClick={handlePrev}
          className="prev ctabutton"
        >
          Prev
        </button>
        }
        </div>
        <div className="right-btn">
          <button onClick={handleNext} className="next ctabutton">
            Next
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
            This is the last question you can submit the test by clicking on the
            end test button.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div className="mcq-body">
        <div className="mcq-question">
          <h4 className="problem_body_heading">
            Question {currentQuestion + 1}
          </h4>
          <p>{questions[currentQuestion].question}</p>
        </div>
        <div className="mcq-options">
          <h4>Select Correct Option</h4>
          {questions[currentQuestion].options.map((e, i) => {
            return (
              <div
                onClick={() => handleChoice(e, i + 1)}
                key={i}
                className={`choice ${
                  clickedOption === i + 1 ? "checked" : null
                } ${optionChosen === e ? "checked" : null}`}
              >
                {e}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Mcq;
