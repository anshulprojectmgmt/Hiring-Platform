import React from "react";
import "./Audio.css";
import voice from "../../assests/voice.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from '../../Api';

const Audio = () => {
  const dispatch = useDispatch();
  const testInfo = useSelector((state) => state.testInfo);
 
  const navigate = useNavigate();

  const handleClick = async () => {
        const res = await axios.post(`${BASE_URL}/api/questions`, {
        testtype:  testInfo.testtype,
        language:  testInfo.language,
        difficulty:testInfo.difficulty,
        questions: testInfo.questions,
      });
       dispatch({ type: "SET_QUESTION", payload: res.data.que });
      // enterFullScreen(videoelem);
     try {
      await document.documentElement.requestFullscreen().catch((e) => {
        console.log('full screen error==1' , e)
      });
     } catch (error) {
      console.log('full screen error==2' , error)
     }


      setTimeout(() => {
        navigate("/test", {replace: true});
      },500);
  };

  const handleBack = () => {
    dispatch({type : "BACK"});
  }

  return (
    <div className="audio">
      <div className="audio-head">
        <h3>Anti-Cheating Measure 4 : Dual Voice Detection</h3>
        <p>
          Warning: Tests are being monitored using anti cheating AI algorithms. If you are
          caught talking with people or there are multiple voices in the background, you will be disqualified.
        </p>
      </div>
      <div className="audio-images">
        {/* <img src={lap} alt="demoimage" /> */}
        <img src={voice} alt="demoimage" />
      </div>
      <div className="audio-foot">
        <h4>AI PROCTORING: MULTIPLE AUDIO DETECTION</h4>
        <p>
          Presence of <span>multiple voices</span> will
          result into flagging of your test and it will be manually reviewed.
        </p>
      </div>
      <div className="audio-navigation">
        <button onClick={handleBack} className="ctabutton">Back</button>
        <button onClick={handleClick} className="ctabutton">
          Start Test
        </button>
      </div>
    </div>
  );
};

export default Audio;
