import React from "react";

import "./UserFeedbackInstruction.css"

import sideView2 from "../../assests/sideView_2.jpg"
import sideView1 from "../../assests/sideView_1.jpg"
import userfeedback1 from "../../assests/user-feedback-1.png"
import userfeedback2 from "../../assests/user-feedback-2.png"
import wrongView3 from "../../assests/wrong-view-3.jpg"
import { useDispatch } from "react-redux";

const UserFeedbackInstruction = () => {
  const dispatch = useDispatch();
  const handleNext = () => {
    dispatch({ type: "NEXT" });
  };
  const handleBack = () => {
    dispatch({ type: "BACK" });
  };
  return (
    <div className="feedbackInstr">
      

{/* <div className="smartphone-container"> */}
      <div className="feedbackInstr-head">
        <h3>Instruction for Candidate Feedback Form</h3>
        {/* <div 
          style={{ border: '2px solid #ff6f61', padding: '10px', backgroundColor: '#fef6f5',
                 borderRadius: '10px', color: '#333', 
                  textAlign: 'center', marginTop: '16px', minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '1rem',marginRight: '1rem' }}>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
          To ensure the integrity of the test, We are recording you through your smartphone also:
        </p>
        <ul style={{ textAlign: 'left', fontSize: '16px', marginLeft: '20px', color: '#1c4b74' }}>
        
              <li>
              After Capturing face image, please position your device at an angle where
              your <strong> Face, Hands, and Laptop(screen & keyboard)</strong> Should be visible. refer below provided Images.
              </li>
             
              
        </ul>

        
      </div> */}

        <p><span style={{color:"#ff4545"}}>Steps:</span> Upon submitting the test, you will be prompted to complete the candidate feedback form.</p>
        <p><span style={{color:"#ff4545"}}>Steps:</span> If you encounter any technical difficulties that prevent you from completing the test, you may submit a request to reappear for the test through the feedback form.
        </p>
      </div>
      
      <div className="feedbackInstr-images-cont">
        
      <div  className="image-item">
       
       <img className="feedbackInstr-images" src={userfeedback1} alt="demoimage" />
      </div>
    <div  className="image-item">
    
          <img  style={{maxWidth: '500px'}} className="feedbackInstr-images" src={userfeedback2} alt="demoimage" />
     </div>
      </div>

    <div className="feedbackInstr-foot">
      <p >"Filling out this feedback form is mandatory. Failure to submit the form will result in the disqualification of your test results." </p>
      </div>
      {/* </div> */}

      <div className="feedbackInstr-navigation">
        <button onClick={handleBack} className="ctabutton">Back</button>
        <button onClick={handleNext} className="ctabutton">
          Next
        </button>
      </div>
    </div>
  );
};

export default UserFeedbackInstruction;
