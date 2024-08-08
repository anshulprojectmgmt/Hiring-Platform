import React, { useState, useRef, useCallback } from "react";
import Body from "../../components/body/Body";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import BASE_URL from "../../Api";
import Webcam from "react-webcam";
import { useParams } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import "./Camera2.css";
import Modal from "react-bootstrap/Modal";
import {Buffer} from 'buffer';
import compressVideo from "../../utility/compress";

const Camera2 = () => {
  const navigate = useNavigate();
  const [time,setTime] = useState(null);
  
  const initialTime = time * 60;
  
  const [timeLeft, setTimeLeft] = useState(60);
  
  const [hideCount, setHideCount] = useState(0);
  let timeTaken = useRef(initialTime);
  let tabSwitch = useRef(0);

  let videoBlob;
  let cam2FaceBlob;
  let cam2SideBlob;
  const timerRef = useRef(null);
  const webcamRef = useRef(null);
  const videoMediaRecorder = useRef(null);
  const videoChunks = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaStream = useRef(null);
  const loader = useRef("false");
  const [show, setShow] = useState(false);

  const [candidateValidation, setCandidateValidation] = useState(null);
  const [candidateEmail, setCandidateEmail] = useState(null);
  const [testCode, setTestCode] = useState(null);
  const { cid } = useParams();
  const [capturedImageUrl, setCapturedImageUrl] = useState(null);
  const hasCapturedImage = useRef(false);
 const [captured,setCaptured] = useState(false);
 const canvasRef = useRef(null);
 const [captureCount, setCaptureCount] = useState(0);
 const [sideView, setSideView] = useState(0);
 const screenshots = useRef([]);

// Function to get candidate details
const getCandidateDetail = async (cid) => {
  
  try {
    const resp = await axios.get(`${BASE_URL}/api/candidate-detail/${cid}`);
    const userDetail = resp.data.userDetail;

    // Check if user already submitted cam2
    if (userDetail?.user?.cam2 === 2) {
      toast.error("You have already submitted secondary camera");
      navigate('/testend', { replace: true });
      return true; // Indicate that we should stop further execution
    }

    setTime(userDetail.testInfo.duration);
    setTimeLeft(userDetail?.testInfo?.duration ? userDetail.testInfo.duration * 60 : 60);

    return false; // Indicate that it's okay to continue
  } catch (error) {
    toast.error("something went wrong");
    console.error("Error fetching candidate details:", error);
    // Handle error appropriately
    return true; // Stop further execution in case of an error
  }
};

 // Function to get dashboard information
 const getDashboardInfo = async (cid) => {
  
  try {
    const res = await axios.post(`${BASE_URL}/api/validate-camera2-session`, { cid });
    setCandidateValidation(res.data.success);
    setCandidateEmail(res.data.candidateEmail);
    setTestCode(res.data.testCode);
  } catch (error) {
    console.error("Error validating camera2 session:", error);
    // Handle error appropriately
  }
};
const captureImage = (value) => {
  if (canvasRef.current && webcamRef.current) {
    const canvas = canvasRef.current;
    const video = webcamRef.current;


    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/png');
    setCapturedImageUrl(imageDataUrl);
    setCaptureCount(value);
  }
};
const handleRetake = (val) => {
  setCapturedImageUrl(null);
  
  captureImage(val);
};
const handleSave = async (val) => {
  
  
  if (capturedImageUrl && captureCount> 0) {
    try {
    //  await axios.post('/api/upload', { imageUrl: capturedImageUrl });
    const res = await axios.post(`${BASE_URL}/api/validate-camera2-session`, { cid , url: capturedImageUrl, value: captureCount});
  //  localStorage.setItem('capturedImage2', capturedImageUrl);
      setCapturedImageUrl(null);
      setCaptured(true);
    setCandidateValidation(res.data.success);
    setCandidateEmail(res.data.candidateEmail);
    setTestCode(res.data.testCode);
      setCaptureCount(val);
      if(val!=0) {
        captureImage(val);
      }
      toast.success("Image Successfully Captured !!")
    } catch (error) {
      console.error("Error validating camera2 session:", error);
      toast.error("something went wrong !!")
    }
  } else{
    toast.error("something went wrong !!")
  }
};

// Effect to get candidate detail and dashboard info
useEffect(() => {
  if (cid) {
   
    const fetchDetails = async () => {
      const shouldStop = await getCandidateDetail(cid);
    
      // Only call getDashboardInfo if getCandidateDetail did not signal to stop
      if (!shouldStop) {
        // 1. start camera 
         await startRecording();
         await getDashboardInfo(cid);
        
      }
    };

    fetchDetails();
  }
}, [cid]);


const takeScreenshot = useCallback(() => {
  if (mediaStream.current) {
    const video = document.createElement('video');
    video.srcObject = mediaStream.current;
    video.onloadedmetadata = () => {
      video.play();
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        console.log('get url' , url);
        screenshots.current.push(url);
        
      });
    };
  }
}, []);

  const startRecording = useCallback(async () => {
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const constraints = isMobile ? {
        video: {
          width: {  ideal: 640 },
          height: { ideal: 360 },
        },
        audio: true
        
      } : {
        video: {
          width: {  ideal: 640 },
          height: { ideal: 360 },
          frameRate: { ideal: 10 }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
     // to start webcam video on ui
    //  if (webcamRef.current) {
    //   webcamRef.current.srcObject = stream;
    //   webcamRef.current.onloadedmetadata = () => {
    //      webcamRef.current.play();
    //      captureImage(1);
    //   };
    // }

      mediaStream.current = stream;

      videoMediaRecorder.current = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      videoMediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunks.current.push(event.data);
        }
      };

    await  videoMediaRecorder.current.start();

       setIsRecording(true);

                // Take a screenshot every minute
      const screenshotInterval = setInterval(() => {
        
        // if (isRecording) {
          takeScreenshot();
        // } else {
        //   clearInterval(screenshotInterval);
        // }
      }, 60000);

    } catch (error) {
      if (error.name === 'NotAllowedError') {
        toast.warning("You need to allow camera access to record video.");
      } else if (error.name === 'NotFoundError') {
        toast.warning("No media devices found.");
      } else {
        toast.warning("Sorry, something went wrong.");
      }
      navigate("/testend", { replace: true });
      console.error("Error accessing media devices:", error);
    }
  }, []);

  // useEffect(() => {
  //   startRecording();
  // }, [startRecording]);

  const stopRecording = useCallback(async () => {
    if (
      videoMediaRecorder.current &&
      isRecording
    ) {
      await videoMediaRecorder.current.stop();
    
       setIsRecording(false);
      if (mediaStream.current) {
        await mediaStream.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    }
    await uploadScreenShots();

  }, [isRecording]);

  const uploadScreenShots =async () => {
    if(screenshots.current){
      
      try {
        // Send the array of URLs directly in the request body
        const response = await axios.post(`${BASE_URL}/api/upload-screenshots`, {
          email: candidateEmail,
          code: testCode,
          screenshots: screenshots.current,
        });
    
        console.log("Screenshots uploaded successfully:", response.data);
      } catch (error) {
        console.error("Error uploading screenshots:", error);
      }
    }
  }

  const downloadRecording = async () => {
    // const durationInSeconds = initialTime;
    if (videoChunks.current.length > 0) {
      videoBlob =  new Blob(videoChunks.current, {
        type: "video/mp4",
      });
      
      console.log(`Original video file size: ${videoBlob.size} bytes`);

      // Compress the video
      videoBlob = await compressVideo(videoBlob);
  
      console.log(`Compressed video file size: ${videoBlob.size} bytes`);
    

    } else {
      console.error("No video or audio data to download");
    }
  };



  const uploadVideo = async () => {
    try {
      
      const videoFileName = `${candidateEmail}-video2.mp4`;
      const videoRes = await axios.post(`${BASE_URL}/api/s3upload`, {
        filename: videoFileName,
        contentType: "video/mp4",
        testcode: testCode,
      });
      const videos3url = videoRes.data.url;
      await axios.put(videos3url, videoBlob);
    
    } catch (error) {
      console.log('line== 5' , error);
    }
  };

  const camera2Submit = async () => {
    try {
      let cid = localStorage.getItem("cid");
      timeTaken.current = initialTime - timeLeft;
      setTimeLeft(0);
    } catch (error) {
      console.log(error);
    }
  };

  const camera2Photo = async () => {
    try {
  //  captureImage();

          const imageSrc = webcamRef.current.getScreenshot();
      cam2FaceBlob = Buffer.from(imageSrc.replace("/^data:image\/\w+;base64,/", ""));
      
      const cam2FaceFileName = `${candidateEmail}-cam2face.jpeg`;
      const cam2FaceRes = await axios.post(`${BASE_URL}/api/s3upload`, {
        filename: cam2FaceFileName,
        contentType: "image/jpeg",
        testcode: testCode,
      });
      const cam2Faceurl = cam2FaceRes.data.url;
      await axios.put(cam2Faceurl, cam2FaceBlob);
      toast.success("Succefully captured");
      // console.log(cam2FaceRes);
    } catch (error) {
      console.log(error);
      toast.warning("Please try again!");
    }
  };

  const camera2SidePhoto = async () => {
  //   try {
  //     //  captureImage();

  //     const imageSideSrc = webcamRef.current.getScreenshot();
  //     cam2SideBlob = Buffer.from(imageSideSrc.replace("/^data:image\/\w+;base64,/", ""));
  //     // console.log(imageSideSrc);
  //    // setImg(imageSideSrc);
  //     const cam2SideFileName = `${candidateEmail}-cam2sideprofile.jpeg`;
  //     const cam2SideRes = await axios.post(`${BASE_URL}/api/s3upload`, {
  //       filename: cam2SideFileName,
  //       contentType: "image/jpeg",
  //       testcode: testCode,
  //     });
  //     const cam2Sideurl = cam2SideRes.data.url;
  //     await axios.put(cam2Sideurl, cam2SideBlob);
  //     // console.log(cam2SideRes);

  //     const inputString = imageSideSrc.replace("data:image/webp;base64,", "");
  //  //  const inputString = capturedImageUrl.replace("data:image/png;base64,", "");
     
  //    const handMatchRes = await axios.post(`https://ai.aiplanet.me/detect_hands`, inputString,
  //     {
  //       headers: {
  //         "Content-Type": "text/plain",
  //       }
  //     });
  //     console.log(handMatchRes.data.hands_detected);
  //     if(handMatchRes.data.hands_detected) {
  //       console.log("here");

  //       const res = await axios.post(`${BASE_URL}/api/cam2-validation`, {
  //         cid: cid,
  //         param: 'hands',
  //       });
  //       if (!res.data.success) {
  //         toast.error(res.data.message);
  //       }

  //       toast.success("Hands successfully detected");
  //       // setNextbtn(true);
  //     } else {
  //       // setCapturebtn(null);
  //       toast.warning("Hands on keyboard not detected");
  //     }

  //     const keyboardmatchRes = await axios.post(`http://ai.aiplanet.me/detect_person_and_keyboard`, inputString,
  //     {
  //       headers: {
  //         "Content-Type": "text/plain",
  //       }
  //     });
  //     console.log(keyboardmatchRes.data.person_and_keyboard_detected);
  //     if(keyboardmatchRes.data.person_and_keyboard_detected) {
  //       console.log("here");

  //       const res = await axios.post(`${BASE_URL}/api/cam2-validation`, {
  //         cid: cid,
  //         param: 'keyboard',
  //       });
  //       if (!res.data.success) {
  //         toast.error(res.data.message);
  //       }

  //       toast.success("Candidate with keyboard detected successfully");
  //       // setNextbtn(true);
  //     } else {
  //       // setCapturebtn(null);
  //       toast.warning("Candidate with keyboard not detected");
  //     }

  //   } catch (error) {
  //     console.log(error);
  //   }


if(sideView<2){
  toast.warning("Please try again!");
  setSideView((prev) => prev+1);
} else{
  toast.success("Successfully Processed");
}

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
            loader.current = "true";
            
            await stopRecording();
            
         //   await downloadRecording();
            
          //  await uploadVideo();
            
            // await handleEndTest();
            clearInterval(timerRef.current);
            timerRef.current = null;
            // navigate("/testend");

            const res = await axios.post(`${BASE_URL}/api/submit-test`, {
              candidateEmail: candidateEmail,
              testCode: testCode,
              cam2: 2,
              cam2Time: timeTaken.current
            });
            
            if (!res.data.success) {
              toast.error(res.data.message);
             
            } else {
              // toast.success(res.data.message);
              loader.current = "false";
              toast.success(res.data.message);
              
              navigate("/testend",{replace: true});
            }
          } catch (error) {
            console.log("error==" , error);
            
          }
        }
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [timeLeft, /* handleEndTest, */ startRecording, stopRecording]);

  return (
    <div className="camera2-cont">
    <div id="fullscreen">
      <div className="navbar-resp">
        <div className="logo-resp">AiPlanet</div>
        <div className="timer-resp">
        <div
            type="button"
            onClick={camera2SidePhoto}
            className="endtest-btn"
          >
            keyboard/hands/face
          </div>
          <div
            type="button"
            onClick={camera2Photo}
            className="endtest-btn"
          >
            Face photo
          </div>
          <div
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            className="endtest-btn "
          >
            End Test
          </div>
        </div>
      </div>
      <div className="camera-container">
     
      {/* {captureCount== 1 ? (
        <div className=" flex flex-col align-middle">
          
          <h3 className='mb-3 p-2 text-[#1c4b74] text-center underline' >1. Please Capture Face Image!</h3>
         
          <img src={capturedImageUrl} alt="Captured" className="captured-image" />
          <div className="button-container">
            <button className='rounded-md bg-[#5880F0]' onClick={() => {handleSave(2)}}>Yes</button>
            <button className='rounded-md bg-[#5880F0]' onClick={() => {handleRetake(captureCount)}}>No</button>
          </div>
        </div>
      ) : (
        captureCount == 2 ? (
          <div className=" flex flex-col align-middle">
            
            <h3 className='mb-3 p-2 text-[#1c4b74] text-center underline' >2. Capture Image at an angle where hand on keyboard is visible</h3>
          
            <img src={capturedImageUrl} alt="Captured" className="captured-image" />
            <div className="button-container">
              <button className='rounded-md bg-[#5880F0]' onClick={() => {handleSave(0)}}>Yes</button>
              <button className='rounded-md bg-[#5880F0]' onClick={() => {handleRetake(captureCount)}}>No</button>
            </div>
          </div>
        ) : 
        <p style={{color: '#210263'}}>Camera access granted. {captured ? 'Image Captured' : 'Capturing image...' }</p>
      )} */}

      {/* <div className="video-container">
      
      <video className="video" ref={webcamRef}  />
      </div> */}
       <div className="webcam">
         <Webcam audio={false} ref={webcamRef} style={{width: '100%', height: '100%' , objectFit: 'cover'}} />
       </div>
       <div className="info">
        <ul>
          <li>Please capture clear face image , to proceed further.</li>
          <li>Please capture Image, where your hands on keyboard is visible with face.</li>
          <li>Submit test from 'cam2' first ,for successfull end test.</li>
          <li>Place device at an angle where hands on keyboard is visible.</li>
        </ul>
       </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>

      {/* <div className="webcam">
        <Webcam audio={false} ref={webcamRef} style={{width: "100vw", height: "100vh"}} />
      </div> */}

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
              Are you sure and want to end the test{" "}
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
                onClick={camera2Submit}
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
          Please wait, your test and video is being uploaded to server. Sometime
          its takes 3-4 mins to upload.
        </Modal.Body>
      </Modal>
    </div>
    </div>
  );
};

export default Camera2;

