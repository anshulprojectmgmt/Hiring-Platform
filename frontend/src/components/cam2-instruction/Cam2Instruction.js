import React from "react";

import "./Cam2Instruction.css"

import sideView2 from "../../assests/sideView_2.jpg"
import sideView1 from "../../assests/sideView_1.jpg"
import { useDispatch } from "react-redux";

const Cam2Instruction = () => {
  const dispatch = useDispatch();
  const handleNext = () => {
    dispatch({ type: "NEXT" });
  };
  const handleBack = () => {
    dispatch({ type: "BACK" });
  };
  return (
    <div className="smartphone">
      {/* <div className="face-head">
        <h3>Anti-Cheating Measure 3 : SmartPhone Recording</h3>
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
      </div> */}

{/* <div className="smartphone-container"> */}
      <div className="smartphone-head">
        <h3>SmartPhone Recording Instruction</h3>
        <div 
          style={{ border: '2px solid #ff6f61', padding: '10px', backgroundColor: '#fef6f5',
                 borderRadius: '10px', color: '#333', 
                  textAlign: 'center', marginTop: '16px', minHeight: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginLeft: '1rem',marginRight: '1rem' }}>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
          To ensure the integrity of the test, We are recording you through your smartphone also:
        </p>
        <ul style={{ textAlign: 'left', fontSize: '16px', marginLeft: '20px', color: '#1c4b74' }}>
        <li>Please capture clear <strong>face image from Smartphone</strong> , to proceed further.</li>
              <li>
              After Capturing face image, please position your device at an angle where
              your <strong> Face, Hands, and Laptop(screen & keyboard)</strong> Should be visible. refer below provided Images.
              </li>
              <li>Submit test from 'cam2' first ,then from laptop for successfull end test.</li>
              
        </ul>
        {/* <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
          <strong>Your privacy is our priority.</strong> These screenshots are used solely for maintaining the security and fairness of the testing process.
        </p> */}
        
      </div>

        
      </div>
      <div className="smartphone-images-cont">
      <div className="image-item">
       <p>View Captured By SmartPhone</p>
       <img className="smartphone-images" src={sideView1} alt="demoimage" />
      </div>
  <div className="image-item">
    <p>Placement of SmartPhone</p>
    <img width={200} className="smartphone-images" src={sideView2} alt="demoimage" />
  </div>
      </div>
      <div className="smartphone-foot">
        <h4>AI PROCTORING: FACE, HANDS, KEYBOARD and SCREEN DETECTION</h4>
        <p>
        If your <span>face, hands, or laptop screen & keyboard</span> are not visible, your test will be flagged for manual review.
        </p>
      </div>
      {/* </div> */}

      <div className="smartphone-navigation">
        <button onClick={handleBack} className="ctabutton">Back</button>
        <button onClick={handleNext} className="ctabutton">
          Next
        </button>
      </div>
    </div>
  );
};

export default Cam2Instruction;
