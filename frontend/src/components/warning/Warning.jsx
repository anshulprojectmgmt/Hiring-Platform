import React from "react";
import "./Warning.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from '../../Api'

const Warning = () => {
    const dispatch = useDispatch();
    const navigate  = useNavigate();

    const testInfo = useSelector((state) => state.testInfo);
   

    const handleNext = async () => {
     {/* currently dispatch disabled  , cause it cause next page in instruction comp */}
       dispatch({ type: "NEXT" });

    //   const res = await axios.post(`${BASE_URL}/api/questions`, {
    //     testtype:  testInfo.testtype,
    //     language:  testInfo.language,
    //     difficulty:testInfo.difficulty,
    //     questions: testInfo.questions,
    //   });
    //    dispatch({ type: "SET_QUESTION", payload: res.data.que });
    //   // enterFullScreen(videoelem);
    //  try {
    //   await document.documentElement.requestFullscreen().catch((e) => {
    //     console.log('full screen error==1' , e)
    //   });
    //  } catch (error) {
    //   console.log('full screen error==2' , error)
    //  }


    //   setTimeout(() => {
    //     navigate("/test");
    //   },300);
      

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
