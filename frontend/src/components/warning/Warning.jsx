import React from "react";
import "./Warning.css";
import { useDispatch } from "react-redux";

const Warning = () => {
    const dispatch = useDispatch();
    const handleNext = () => {
        dispatch({ type: "NEXT" });
      };
  return (
    <div className="warning">
      <h1 className="warning-heading">Instructions</h1>
      <div className="warning-content">
        
        <p>
          1. Welcome to the online test! Ensure your computer, webcam, microphone, and internet connection
          meet the exam requirements. 
        </p>
        <p>
          2. To maintain a fair and secure testing environment, we've implemented
           some proctoring features. These measures help us to<br /> maintain the integrity of the testing process.
        </p>
        <p>3. Please click next to go through few <span>steps and warnings</span> that should be considered before taking the test.</p>
      </div>
      <h3>Best Of Luck For Your Exam</h3>
      <div className="warning-footer">
        <button onClick={handleNext} className="ctabutton">Next</button>
      </div>
    </div>
  );
};

export default Warning;
