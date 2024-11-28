import React, { useState } from "react";
import "./Warning.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from '../../Api'
import { toast } from "react-toastify";

const Warning = () => {
    const dispatch = useDispatch();
    const navigate  = useNavigate();

    const testInfo = useSelector((state) => state.testInfo);
   const [isInterested,setIsInterested] = useState(null);
  
   const handleInputChange =(value) => {
    setIsInterested(value)
   }
   const updateCandidate = () => {
      axios.post(`${BASE_URL}/api//update-candidate`,{
        email: testInfo.candidateEmail,
        code: testInfo.testCode,
        data: {
          isInterested
        }
      })     
   }
    const handleNext = async () => {
     {/* currently dispatch disabled  , cause it cause next page in instruction comp */}
     if(testInfo.testCode == "6ZxaJCCzeUyF7vK") {
        if(isInterested=== null) {
           toast.warning("Please select either option")
           return ;
         }
      updateCandidate()
    }

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
      
      {testInfo.testCode == "6ZxaJCCzeUyF7vK" && 
         <div style={{maxWidth: "80%", backgroundColor:"#FFFF8A", border: "2px solid #d4a017"}} className="mb-4 p-3   rounded">
          <label style={{color:"#1c4b74"}} className="form-label ">
          Getting mastery for building GenAI products would entail months of effort. Hence, we would prefer candidates who would continue the internship post December for 3 more months (till march end). Internship would be part time in months of Jan - March with expected 3-4 daily working hours.
          It is the responsibility of the students to manage their own workload so that the internship work doesn't affect their academics.
          </label>
          <div className=" custom-form-check">
            <input
              type="radio"
              id="facedIssuesYes"
              name="facedIssues"
              value="YES"
              className="custom-radio me-3 "
              required
              checked={isInterested === "YES"}
              onChange={(e) => handleInputChange( e.target.value)}
            />
            <label htmlFor="facedIssuesYes" className="form-check-label">
            I am comfortable with prolonged internship of 4 months
            </label>
            
          </div>
          
          <div className=" custom-form-check">
            <input
              type="radio"
              id="facedIssuesNo"
              name="facedIssues"
              value="NO"
              className="custom-radio me-3"
              required
              checked={isInterested === "NO"}
              onChange={(e) => handleInputChange( e.target.value)}
            />
            <label htmlFor="facedIssuesNo" className="form-check-label">
            I am <strong>NOT</strong> comfortable with prolonged internship of 4 months
            </label>
          </div>
        </div>
        }
      <div className="warning-footer">
        <button  onClick={handleNext} className="ctabutton">Next</button>
      </div>
    </div>
  );
};

export default Warning;
