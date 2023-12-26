// import React, { useState } from "react";
// import "./NavBar.css";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { useEffect } from "react";
// import { useRef } from "react";
// import BASE_URL from "../../Api";
// import { useCallback } from "react";
// import Webcam from "react-webcam";
// import ClipLoader from "react-spinners/ClipLoader";

// const NavBar = () => {
//   const navigate = useNavigate();
//   const check = useSelector((state) => state.savedCode);
//   const candidateEmail = useSelector((state) => state.testInfo.candidateEmail);
//   const testCode = useSelector((state) => state.testInfo.testCode);
//   const time = useSelector((state) => state.testInfo.duration);
//   const initialTime = time * 60;
//   const [timeLeft, setTimeLeft] = useState(initialTime);

//   const getFullscreenElement = () => {
//     return (
//       document.fullscreenElement ||
//       document.webkitFullscreenElement ||
//       document.mozFullscreenElement ||
//       document.msFullscreenElement
//     );
//   };

//   let videoBlob;
//   let videoUrl;
//   let audioBlob;
//   let audioUrl;
//   let newAudioBlob;
//   let newVideoBlob;
//   const timerRef = useRef(null);
//   const webcamRef = useRef(null);
//   const videoMediaRecorder = useRef(null);
//   const videoChunks = useRef([]);
//   const audioMediaRecorder = useRef(null);
//   const audioChunks = useRef([]);
//   const [isRecording, setIsRecording] = useState(false);
//   const mediaStream = useRef(null);
//   const audiomediaStream = useRef(null);
//   const loader = useRef("false");

//   const startRecording = useCallback(async () => {
//     try {
//       const audioStream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//       });
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });

//       mediaStream.current = stream;
//       audiomediaStream.current = audioStream;

//       audioMediaRecorder.current = new MediaRecorder(audioStream);
//       videoMediaRecorder.current = new MediaRecorder(stream, {
//         mimeType: "video/x-matroska;codecs=vp9",
//       });

//       audioMediaRecorder.current.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunks.current.push(event.data);
//         }
//       };

//       videoMediaRecorder.current.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           videoChunks.current.push(event.data);
//         }
//       };

//       audioMediaRecorder.current.start();
//       videoMediaRecorder.current.start();

//       setIsRecording(true);
//     } catch (error) {
//       toast.warning("Camera is required to give the test");
//       console.error("Error accessing media devices:", error);
//     }
//   }, []);

//   useEffect(() => {
//     startRecording();
//   }, [startRecording]);

//   const stopRecording = useCallback(async () => {
//     if (
//       videoMediaRecorder.current &&
//       audioMediaRecorder.current &&
//       isRecording
//     ) {
//       await videoMediaRecorder.current.stop();
//       await audioMediaRecorder.current.stop();
//       await setIsRecording(false);
//       if (mediaStream.current) {
//         await mediaStream.current.stream
//           .getTracks()
//           .forEach((track) => track.stop());
//       }
//     }
//   }, [isRecording]);

//   const downloadRecording = async () => {
//     const durationInSeconds = initialTime;
//     if (videoChunks.current.length > 0 && audioChunks.current.length > 0) {
//       videoBlob = await new Blob(videoChunks.current, { type: "video/x-matroska;codecs=vp9" });
//       videoUrl = await URL.createObjectURL(videoBlob);
//       audioBlob = await new Blob(audioChunks.current, { type: "audio/webm" });
//       audioUrl = await URL.createObjectURL(audioBlob);
//       // const formData = new FormData();
//       // formData.append("audio", audioBlob, "audio.webm");
//       // formData.append("video", videoBlob, "video.webm");
//       // formData.append("duration", durationInSeconds);
//       // const resBlob = await axios.post(
//       //   `${BASE_URL}/api/process-media`,
//       //   formData,
//       //   {
//       //     headers: {
//       //       "Content-Type": "multipart/form-data",
//       //     },
//       //   }
//       // );
//       // console.log('resBlob', resBlob)
//       // newAudioBlob = resBlob.data.audioBlob;
//       // newVideoBlob = resBlob.data.videoBlob;
//     } else {
//       console.error("No video or audio data to download");
//     }
//   };

//   const handleEndTest = useCallback(async () => {
//     try {
//       const res = await axios.post(`${BASE_URL}/api/submit-test`, {
//         testData: check,
//         candidateEmail: candidateEmail,
//         testCode: testCode,
//       });
//       if (!res.data.success) {
//         toast.error(res.data.message);
//       } else {
//         // toast.success(res.data.message);
//         if (getFullscreenElement()) {
//           loader.current = "false";
//           toast.success(res.data.message);
//           document.exitFullscreen();
//         }
//         navigate("/testend");
//       }
//     } catch (error) {
//       console.error("Error submitting test:", error);
//     }
//   }, [check, candidateEmail, testCode, navigate]);

//   const uploadVideo = async () => {
//     const audioFileName = `${candidateEmail}-audio.webm`;
//     const videoFileName = `${candidateEmail}-video.webm`;
//     const ans = await axios.post(`${BASE_URL}/api/transcriptions`, {
//       bucketName: testCode,
//     });
//     const res = await axios.post(`${BASE_URL}/api/s3upload`, {
//       filename: audioFileName,
//       contentType: "audio/webm",
//       testcode: testCode,
//     });
//     const audios3url = res.data.url;
//     const response = await axios.put(audios3url, audioBlob);
//     // console.log("response", response);
//     const videoRes = await axios.post(`${BASE_URL}/api/s3upload`, {
//       filename: videoFileName,
//       contentType: "video/x-matroska;codecs=vp9",
//       testcode: testCode,
//     });
//     const videos3url = videoRes.data.url;
//     const response2 = axios.put(videos3url, videoBlob);
//     // console.log("response2", response2);
//   };

//   const handleSubmitTest = async () => {
//     try {
//       setTimeLeft(0);
//       // await stopRecording();
//       // await downloadRecording();
//       // await uploadVideo();
//       // await handleEndTest();
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (!timerRef.current) {
//       timerRef.current = setInterval(async () => {
//         if (timeLeft > 0) {
//           setTimeLeft(timeLeft - 1);
//         } else if (timeLeft === 0) {
//           try {
//             // toast.warning("Time up! Test will be submitted soon")
//             loader.current = "true";
//             await stopRecording();
//             await downloadRecording();
//             await uploadVideo();

//             await handleEndTest();
//             clearInterval(timerRef.current);
//             timerRef.current = null; // Reset the timer reference
//           } catch (error) {
//             console.log("Error stopping recording:", error);
//           }
//         }
//       }, 1000);
//     }

//     return () => {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     };
//   }, [timeLeft, handleEndTest, startRecording, stopRecording]);

//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   return (
//     <div className="navbar">
//       <div className=" logo">AiPlanet</div>
//       <div className="webcam">
//         {loader.current === "true"? <ClipLoader color="#ffffff" /> : <Webcam audio={false} ref={webcamRef} width={50} height={44} /> } 
//       </div>
//       <div className="timer">
//         <div onClick={handleSubmitTest} className="endtest-btn">
//           End Test
//         </div>
//         <div className={minutes < 5 ? `text-warning` : ""}>
//           <i style={{ marginRight: "4px" }} className="fa-regular fa-clock"></i>{" "}
//           {minutes < 10 ? `0${minutes}` : minutes} m{" "}
//           {seconds < 10 ? `0${seconds}` : seconds} s
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NavBar;
