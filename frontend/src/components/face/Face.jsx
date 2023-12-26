import React from "react";
import "./Face.css";
// import left from "../../assests/leftjpg.jpg";
import noface from "../../assests/noface.jpg";
import multipleface from "../../assests/multipleface.jpg";
import { useDispatch } from "react-redux";

const Face = () => {
  const dispatch = useDispatch();
  const handleNext = () => {
    dispatch({ type: "NEXT" });
  };
  const handleBack = () => {
    dispatch({ type: "BACK" });
  };
  return (
    <div className="face">
      <div className="face-head">
        <h3>Anti-Cheating Measure 2 : Multiple Face/No Face Detection</h3>
        <p>
          Warning: Tests are being monitored using anti cheating AI algorithms. If you are
          caught with multiple people or if your face is not clearly visible, you will be disqualified.
        </p>
      </div>
      <div className="face-images">
        <img src={multipleface} alt="demoimage" />
        <img src={noface} alt="demoimage" />
      </div>
      <div className="face-foot">
        <h4>AI PROCTORING: MULTIPLE FACE AND NO FACE DETECTION</h4>
        <p>
          Presence of <span>multiple faces or absence of you</span> will
          result into flagging of your test and it will be manually reviewed.
        </p>
      </div>
      <div className="face-navigation">
        <button onClick={handleBack} className="ctabutton">Back</button>
        <button onClick={handleNext} className="ctabutton">
          Next
        </button>
      </div>
    </div>
  );
};

export default Face;
