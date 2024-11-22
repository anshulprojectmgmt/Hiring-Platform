import React, { useState, useRef, useCallback } from "react";
import Body from "../../components/body/Body";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Mcq from "../../components/mcqscreen/Mcq";
import BASE_URL from "../../Api";
import Webcam from "react-webcam";
// import ClipLoader from "react-spinners/ClipLoader";
import BarLoader from "react-spinners/BarLoader";
import "./Test.css";
import Modal from "react-bootstrap/Modal";
// import { debounce } from 'lodash';
// import webgazer from "webgazer";
// eslint-disable-next-line

import { persistStore } from 'redux-persist';
import store from '../../store'
import Subjective from "../../components/subjective/Subjective";
import TestTypeWrapper from "../../components/test-type-wrapper/TestTypeWrapper";

const Test = () => {
 

  const navigate = useNavigate();
  const check = useSelector((state) => state.savedCode);
  const mcqData = useSelector((state) => state.savedMcq);
  const subjData = useSelector((state) => state.savedSubjective);
 
  const candidateEmail = useSelector((state) => state.testInfo.candidateEmail);
  const testCode = useSelector((state) => state.testInfo.testCode);
  const testtype = useSelector((state) => state.testInfo.testtype);
  const time = useSelector((state) => state.testInfo.duration);
  const {screen} = useSelector((state) => state.userMediaStore);
  //const [time,setTime] = useState(null);
  const initialTime = time * 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [hideCount, setHideCount] = useState(0);
  let timeTaken = useRef(initialTime);
  let tabSwitch = useRef(0);
  const videoFileName = `${candidateEmail}-video.mp4`;
  
  let videoBlob;
  let audioBlob;
  let screenBlob;
  const timerRef = useRef(null);
  const webcamRef = useRef(null);
  const videoMediaRecorder = useRef(null);
  const videoChunks = useRef([]);
  const audioMediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaStream = useRef(null);
  const screenStream = useRef(null);
   const screenshotInterval = useRef(null);
  const screenshots = useRef([]);
  const audiomediaStream = useRef(null);
  const loader = useRef("false");
  const [show, setShow] = useState(false);
  const [isFullScreen, setIsFullSreen] = useState(true);
  const [exitScreen, setExitScreen] = useState(0);
  const [verdict,setVerdict] = useState({status: "Successfull" , message: "Test successfully submitted"});
  let testCodeRef = useRef();
  let candidateEmailRef = useRef();
  testCodeRef.current = testCode 
  candidateEmailRef.current = candidateEmail   

const exitScreenRef = useRef(null);
const isFullScreenRef = useRef(null);
exitScreenRef.current = exitScreen;
isFullScreenRef.current = isFullScreen;

const getFullscreenElement = () => {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullscreenElement ||
    document.msFullscreenElement
  );
};

  useEffect(() => {
    let timeId;
    
    if(exitScreenRef.current>=1 && !getFullscreenElement()) {

      toast.error("Please reset to Full-Screen mode, by clicking on Full-Screen button on top right, else Test will get Terminated after 1-min", {
        position: "top-left",
        autoClose: 1000*80, // Duration in milliseconds (5000ms = 5 seconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
  
});

          timeId = setTimeout(() => {
            
            if(!isFullScreenRef.current) {

              timeTaken.current = initialTime - timeLeft;
              toast.error("Exam terminated.");
              setTimeLeft(0);
             
              
              setVerdict({status: "Terminated" , message: "Test terminated due to Exit Full screen"})
            }
          }, 1000*60*2)
    }

    return () => {
      clearInterval(timeId);
    }
  }, [exitScreenRef.current])

     
  const handleFullScreenChange = (e) => {
    

    // if(exitScreenRef.current>= 2 && !getFullscreenElement()) {
    //   timeTaken.current = initialTime - timeLeft;
    //   toast.error("Exam terminated.");
    //   setVerdict((prev) => ({status: "Terminated" , message: "Test terminated due to Exit Full screen"}));
      
    //   setTimeLeft(0);
    
      
    //      return;
    //    }
       
       if(!getFullscreenElement()){
          
           setExitScreen(prev => prev+1);
           }
   
        setIsFullSreen(prev =>  !prev);
      
     } 

  useEffect(() => {
  
 document.addEventListener('fullscreenchange',handleFullScreenChange);
 
  return () => {
  document.removeEventListener('fullscreenchange',handleFullScreenChange) 
  }
}, [])

const resetToFullScreen =async () => {
 try {
  await  document.documentElement.requestFullscreen()

} catch (error) {

  console.log("full screen error==3" , error);
 }
       toast.dismiss();
}


 
 useEffect(() => {
    // Add event listener for popstate which is triggered on back button
    const handlePopState = () => {
      // Redirect to /home when back button is pressed
     

       navigate('/', { replace: true });
       window.removeEventListener('popstate', handlePopState);
    };
      
    window.addEventListener('popstate', handlePopState);

    // Cleanup the event listener when the component is unmounted
    return () => {
      setTimeout(() => {
        window.removeEventListener('popstate', handlePopState);
      }, 500)
    };
  }, []);
  
  

  const startScreenCapture = async () => {
    try {
      // Request screen capture once on component mount
      // screenStream.current = await navigator.mediaDevices.getDisplayMedia({
      //   video: true,
      // });
      
      screenStream.current = screen
      
      // Set an interval to capture screenshots every minute
      let i=1;
       screenshotInterval.current = setInterval(()=> {
        takeScreenScreenshot(i)
        i++;
       }, 1000*60);

      // Cleanup on unmount
      
    } catch (err) {
      console.error("Error accessing screen capture:", err);
    }
  };

  // const takeScreenScreenshot = () => {
  
  //   if (screenStream.current) {
  //     const video = document.createElement("video");
  //     video.srcObject = screenStream.current;
  //     video.onloadedmetadata = () => {
  //       video.play();
  //       const canvas = document.createElement("canvas");
  //       canvas.width = video.videoWidth;
  //       canvas.height = video.videoHeight;
  //       const ctx = canvas.getContext("2d");
  //       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  //       canvas.toBlob((blob) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //           const base64String = reader.result;
  //           console.log('screen screenshot==', base64String);
  //           screenshots.current.push(base64String); // Store screenshot
  //         };
  //         reader.readAsDataURL(blob);
  //       },
  //       "image/jpeg", 0.3
  //     );
  //     };
  //   }

  // };

  const takeScreenScreenshot = async (i) => {
    const testCode = testCodeRef.current;
    const candidateEmail = candidateEmailRef.current;

    

    if (screenStream.current) {
      const video = document.createElement("video");
      video.srcObject = screenStream.current;
      video.onloadedmetadata = async () => {
        video.play();
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob and set quality to 0.3
        canvas.toBlob(async (blob) => {
          if (blob) {
            const filename = `${candidateEmail}-screenshot(${i}).jpeg`;
            const contentType = "image/jpeg";

            try {
              // Step 1: Request a pre-signed URL for S3 upload
              const res = await axios.post(`${BASE_URL}/api/s3upload`, {
                filename,
                contentType,
                testcode: testCode,
                screenshot: "screen-capture",
                email: candidateEmail
              });
              const uploadUrl = res.data.url;
              const trimUrl = uploadUrl.split('?')[0];
              // Step 2: Upload the blob to S3 using the pre-signed URL
               await axios.put(uploadUrl, blob);
              screenshots.current.push(trimUrl);
              
            } catch (error) {
              console.error("Error uploading screenshot:", error);
            }
          }
        }, "image/jpeg", 0.3);
      };
    }
  };
  

const startRecording = useCallback(async () => {
    
  try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: {  ideal: 640 },
          height: { ideal: 360 },
          frameRate: { ideal: 3 },
        },
      });

      mediaStream.current  = stream;
      // videoStream.current.scrObject = stream;
      audiomediaStream.current = audioStream;

      audioMediaRecorder.current = new MediaRecorder(audioStream);
      videoMediaRecorder.current = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      audioMediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      videoMediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunks.current.push(event.data);
        }
      };

      audioMediaRecorder.current.start();
      videoMediaRecorder.current.start();

      // start screen recording
      if(testtype==='coding' || testtype==='mcq') {
         startScreenCapture();
      }
        
     
      // Start taking screenshots every minute (60000ms)
    // const interval = setInterval(takeScreenshot, 60000);


      setIsRecording(true);



    } catch (error) {
      if (getFullscreenElement()) {
        document.exitFullscreen();
      }
      timeTaken.current = initialTime - timeLeft;
      toast.warning("Sorry, you declined the media permissions");
      setVerdict((prev) => ({status: "Terminated" , message: "Candidate declined media access"}));
      
      setTimeLeft(0);
     
      // console.error("Error accessing media devices:", error);
    }
  }, []);

  useEffect(() => {
    

      startRecording();
  }, [startRecording]);

  const stopRecording = useCallback(async () => {
    
      if (
        videoMediaRecorder.current &&
        audioMediaRecorder.current &&
        isRecording
      ) {
        await videoMediaRecorder.current.stop();
        await audioMediaRecorder.current.stop();
         setIsRecording(false);
      
         
         if (mediaStream.current) {
          await mediaStream.current.stream
            .getTracks()
            .forEach((track) => track.stop());
        }
  }
  
  try {
  screenStream.current.getTracks().forEach((track) => track.stop());
   
      
    } catch (error) {
      console.log('failed to stop recoring', error);
    }
 

  }, [isRecording]);

  



  const downloadRecording = async () => {
    // const durationInSeconds = initialTime;

    if (videoChunks.current.length > 0 && audioChunks.current.length > 0) {
      videoBlob =  new Blob(videoChunks.current, {
        type: "video/mp4",
      });
      audioBlob =  new Blob(audioChunks.current, { type: "audio/webm" });

      
      // console.log(`Original video file size: ${videoBlob.size} bytes`);

      // // Compress the video
      // videoBlob = await compressVideo(videoBlob);
  
      // console.log(`Compressed video file size: ${videoBlob.size} bytes`);
    

     } else {
      console.error("No video or audio data to download");
    }


  };

  

  const uploadVideo = async () => {
    
try {
  

    const audioFileName = `${candidateEmail}-audio.webm`;
    const videoFileName = `${candidateEmail}-video.mp4`;
    const screenFileName = `${candidateEmail}-screen.mp4`;
   
    const ans = await axios.post(`${BASE_URL}/api/transcriptions`, {
      bucketName: testCode,
    });
   
    const videoRes = await axios.post(`${BASE_URL}/api/s3upload`, {
      filename: videoFileName,   
      contentType: "video/mp4",
      testcode: testCode,
      record: 'video',
    });
  
    const videos3url = videoRes.data.url;
    await axios.put(videos3url, videoBlob);
   
    const audioRes = await axios.post(`${BASE_URL}/api/s3upload`, {
      filename: audioFileName,
      contentType: "audio/webm",
      testcode: testCode,
      record: 'audio',
    });
  
    const audios3url = audioRes.data.url;
    const response = await axios.put(audios3url, audioBlob);
} catch (error) {
  console.log('error: ', error)
}
  };

   

  const handleSubmitTest = async () => {
    try {
      let cid = localStorage.getItem("cid");
      const res = await axios.post(`${BASE_URL}/api/check-if-cam2-enabled`, {
        cid: cid
      });
     
      if (!res.data) {
        toast.error("Please check your network connectivity");
      }
      else {
        if (res.data.cam2status && res.data.cam2status == 1) {
        
          toast.warning("Please submit the video from the second carmera first, and then try to end the test again");
          // if (getFullscreenElement()) {
          //   document.exitFullscreen();
          // }
        } else if(res.data.cam2status == 2 || res.data.cam2status == 0) {
          timeTaken.current = initialTime - timeLeft;
          setTimeLeft(0);
        
        } else {
          // if (getFullscreenElement()) {
          //   document.exitFullscreen();
          // }
          timeTaken.current = initialTime - timeLeft;
          setTimeLeft(0);
        }
      }
    } catch (error) {
      console.log(error);
    }

   
    // if (getFullscreenElement()) {
    //   try {
    //     document.exitFullscreen();  
    //   } catch (error) {
    //     console.log('exit full screen error==' , error);
    //   }
      
    // }

    // timeTaken.current = initialTime - timeLeft;
    // setTimeLeft(0);

  };

  const handleEndTest = async () => {
    
    persistStore(store).purge();
   
    try {
      if(testtype === "coding"){
        const res = await axios.post(`${BASE_URL}/api/submit-test`, {
          testData: check,
          candidateEmail: candidateEmail,
          testCode: testCode,
          timetaken: timeTaken.current,
          tabswitch: tabSwitch.current,
          verdict : JSON.stringify(verdict),
          screenshots: screenshots.current

        });
        if (!res.data.success) {
          toast.error(res.data.message);
        } else {
          // toast.success(res.data.message);
          if (getFullscreenElement()) {
            loader.current = "false";
            toast.success(res.data.message);
            try {
              document.exitFullscreen();  
            } catch (error) {
              console.log('exit full screen error==' , error);
            }
            
          }
          navigate("/user-feedback",{replace: true});
        }
      }
      else if(testtype === "mcq"){
        const res = await axios.post(`${BASE_URL}/api/submit-mcqtest`, {
          testData: mcqData,
          candidateEmail: candidateEmail,
          testCode: testCode,
          timetaken: timeTaken.current,
          tabswitch: tabSwitch.current,
          verdict : JSON.stringify(verdict),
          screenshots: screenshots.current
        });
        if (!res.data.success) {
          toast.error(res.data.message);
        } else {
          // toast.success(res.data.message);
          if (getFullscreenElement()) {
            loader.current = "false";
            toast.success(res.data.message);
            document.exitFullscreen();
          }
          // navigate("/testend",{replace: true});
          navigate("/user-feedback",{replace: true});
        }
      }
      else if(testtype==="subjective") {
     
        const res = await axios.post(`${BASE_URL}/api/submit-subjectivetest`, {
          testData: subjData,
          candidateEmail: candidateEmail,
          testCode: testCode,
          timetaken: timeTaken.current,
          tabswitch: tabSwitch.current,
          verdict : JSON.stringify(verdict),
        });
        if (!res.data.success) {
          toast.error(res.data.message);
        } else {
          // toast.success(res.data.message);
          if (getFullscreenElement()) {
            loader.current = "false";
            toast.success(res.data.message);
            document.exitFullscreen();
          }
          navigate("/testend",{replace: true});
        }
      }
      else if(testtype==="coding+subjective"){
        navigate("/testend",{replace: true});
      }else{
        navigate("/testend",{replace: true});
      }
      
    } catch (error) {
      navigate("/testend",{replace: true});
      console.error("Error submitting test:", error);
    } finally  {
      // Cleanup: Stop all tracks to release screen stream resources
      
      if (screenshotInterval.current) {
      clearInterval(screenshotInterval.current);
    }
      if (screenStream) {
        
        screenStream.getTracks().forEach(track => track.stop());
      }
    };
  };
  
  useEffect(() => {
    let isTimeUp = false;
    if (!timerRef.current) {
     
      timerRef.current = setInterval(async () => {
        
        if (timeLeft > 0) {
         
          setTimeLeft(timeLeft - 1);
        } else if (timeLeft === 0 && !isTimeUp) {
          isTimeUp = true;
          try {
             setShow(true);
            // console.log(mcqData);
            loader.current = "true";
          
   
            await stopRecording();
            if(testtype!=="subjective") {
                await downloadRecording();
                await uploadVideo();
            }

          
            await handleEndTest();
            clearInterval(timerRef.current);
            timerRef.current = null;
          } catch (error) {
           
          }
        }
      }, 1000);
    }
    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [timeLeft, handleEndTest, startRecording, stopRecording]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setHideCount((prevHideCount) => prevHideCount + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if(hideCount === 1){
      tabSwitch.current = 1;
    }
    else if (hideCount === 2) {
      tabSwitch.current = 2;
      toast.warning("Do not go to other tabs. Your exam will terminate.");
    } else if (hideCount === 3) {
      tabSwitch.current = 3;
      toast.warning("This is your final warning.");
    } else if (hideCount === 4) {
      tabSwitch.current = 4;
      timeTaken.current = initialTime - timeLeft;
      toast.error("Exam terminated.");
      setVerdict({status: "Terminated" , message: "Test terminated due to Tab Switched 4 times"})
      setTimeLeft(0);
      
      // handleEndTest();
    }
  }, [hideCount]);



  return (
    <div className="test-cont">
    <div id="fullscreen">
      <div className="navbar">
        <div className="logo">AiPlanet</div>
        {testtype!=="subjective" && 
        <div className="webcam">
          {loader.current === "true" ? null : (
            <Webcam id="video" audio={false} ref={webcamRef} width={100} height={40} />
         
         )}
        </div>
        }
        <div className="timer">
       {!isFullScreen && 
        <div
          onClick={resetToFullScreen}
            type="button"
            className="fullscreen-btn"
          >
            Full Screen Mode
          </div>
           }
          <div
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            className="endtest-btn"
          >
            End Test
          </div>
          <div className={minutes < 5 ? `text-warning` : ""}>
            <i
              style={{ marginRight: "4px" }}
              className="fa-regular fa-clock"
            ></i>{" "}
            {minutes < 10 ? `0${minutes}` : minutes} m{" "}
            {seconds < 10 ? `0${seconds}` : seconds} s
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Alert!
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Are you sure , you want to end the test{" "}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                data-bs-dismiss="modal"
                onClick={handleSubmitTest}
                type="button"
                className="btn btn-primary"
              >
                Yes, Proceed
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={show}
        // onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header>
          <Modal.Title>
            <BarLoader color="#5880F0" width={450} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p style={{marginBottom:"8px"}}>   Please wait, your test and video is being uploaded to server. Sometime
          its takes 3-4 mins to upload.</p>
          <p style={{color: "red", fontWeight: "600", textAlign: 'center'}}>If you encounter any technical difficulties that prevent you from completing the test,
             you may submit a request to reappear for the test through the feedback form.</p>
        </Modal.Body>
      </Modal>
    
      {testtype === "coding" ? <Body /> 
        : testtype === "mcq" ? <Mcq /> 
        : testtype=== "subjective" ? <Subjective />
        : testtype === "coding+subjective" ? <TestTypeWrapper /> 
        : <h1>Test type didn't matched</h1>
        }
    </div>
    </div>
  );
};

export default Test;
