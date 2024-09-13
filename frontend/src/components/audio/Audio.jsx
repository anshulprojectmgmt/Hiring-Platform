import React, { useEffect, useRef } from "react";
import "./Audio.css";
import voice from "../../assests/voice.png";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BASE_URL from '../../Api';
import { toast } from "react-toastify";

const Audio = () => {
  const dispatch = useDispatch();
  const testInfo = useSelector((state) => state.testInfo);
  const result = useRef(null)
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/api/questions`, {
        testtype:  testInfo.testtype,
        language:  testInfo.language,
        difficulty:testInfo.difficulty,
        questions: testInfo.questions,
        codQue: testInfo.codQue || 0,
        mcqQue: testInfo.mcqQue || 0,
        subjQue: testInfo.subjQue || 0,
      });
      result.current = res;
       dispatch({ type: "SET_QUESTION", payload: res.data.que });
       console.log('questions:' , res.data.que);
    } catch (error) {
      console.log('failed to fetch que:' , error);
      result.current = null
    }
  }
  const handleClick = async () => {

    if(!result.current){
    await fetchQuestions();
      toast.error("something went wrong, Try Again!")
      return;
    }
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
      },1000);
  };

  const handleBack = () => {
    dispatch({type : "BACK"});
  }

  useEffect(() => {
    fetchQuestions();
  },[])
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
        <button disabled={true} onClick={handleBack} className="ctabutton">Back</button>
        <button onClick={handleClick} className="ctabutton">
          Start Test
        </button>
      </div>
    </div>
  );
};

export default Audio;
