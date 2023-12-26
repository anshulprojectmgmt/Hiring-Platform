import React from "react";
import "./Device.css";
import phone from "../../assests/phone.png";
import earphone from "../../assests/earphone.png";
import { useDispatch } from "react-redux";

const Device = () => {
  const dispatch = useDispatch();
  const handleNext = () => {
    dispatch({ type: "NEXT" });
  };
  const handleBack = () => {
    dispatch({ type: "BACK" });
  };
  return (
    <div className="device">
      <div className="device-head">
        <h3>Anti-Cheating Measure 3 : Earphones & SmartPhones Detection</h3>
        <p>
          Warning: Tests are being monitored using anti cheating AI algorithms. If you are
          caught using earphone or smartphone,
          you will be disqualified.
        </p>
      </div>
      <div className="device-images">
        
        <img src={earphone} alt="demoimage" />
        <img src={phone} alt="demoimage" />
      </div>
      <div className="device-foot">
        <h4>AI PROCTORING: ELECTRONIC DEVICE DETECTION</h4>
        <p>
          Presence of <span>earphones, headphones and mobile phones</span> will result
          into flagging of your test and it will be manually reviewed.
        </p>
      </div>
      <div className="device-navigation">
        <button onClick={handleBack} className="ctabutton">
          Back
        </button>
        <button onClick={handleNext} className="ctabutton">
          Next
        </button>
      </div>
    </div>
  );
};

export default Device;
