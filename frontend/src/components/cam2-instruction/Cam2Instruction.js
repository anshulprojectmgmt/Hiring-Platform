import React from "react";

import "./Cam2Instruction.css"

import sideView2 from "../../assests/sideView_2.jpg"
import sideView1 from "../../assests/sideView_1.jpg"
import wrongView1 from "../../assests/wrong-view-1.jpg"
import wrongView2 from "../../assests/wrong-view-2.jpg"
import wrongView3 from "../../assests/wrong-view-3.jpg"
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
      

{/* <div className="smartphone-container"> */}
      <div className="smartphone-head">
        <h3>step-2 smartphone camera setup instruction</h3>
        <div 
          style={{ border: '2px solid #ff6f61' , backgroundColor: '#fef6f5',
                 borderRadius: '10px', color: '#333', paddingTop:'5px',
                  textAlign: 'center', marginTop: '16px',  display: 'flex',
                   flexDirection: 'column', justifyContent: 'center', marginLeft: '1rem',marginRight: '1rem' }}>
        
        <p style={{ fontSize: '16px', lineHeight: '1.5',  }}>
          To ensure the integrity of the test, We are recording you through your smartphone also:
        </p>
        <ul style={{ textAlign: 'left', fontSize: '16px', marginLeft: '20px', color: '#1c4b74' }}>
        
              <li>
              After Capturing face image, please position your device at an angle where
              your <strong> Face, Hands, and Laptop(screen & keyboard)</strong> Should be visible. refer below provided Images.
              </li>
             
              
        </ul>

        
      </div>

        
      </div>
      <p className="image-title right-img">Correct Smartphone Position</p>
      <div className="smartphone-images-cont">
        
      <div className="image-item">
       <p>View Captured By SmartPhone</p>
       <img className="smartphone-images" src={sideView1} alt="demoimage" />
      </div>
  <div className="image-item">
    <p>Placement of SmartPhone</p>
    <img  className="smartphone-images" src={sideView2} alt="demoimage" />
  </div>
      </div>

      <p className="image-title wrong-img">Wrong Smartphone Position</p>
      <div className="smartphone-images-cont">
      
      <div className="image-item">
       <p>Face not detected </p>
       <img className="smartphone-images" src={wrongView1} alt="demoimage" />
      </div>
      <div className="image-item">
       <p>screen front not visible. Camera is placed on back of the screen</p>
       <img className="smartphone-images" src={wrongView2} alt="demoimage" />
      </div>
      <div className="image-item">
       <p>Keyboard not detected </p>
       <img className="smartphone-images" src={wrongView3} alt="demoimage" />
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
