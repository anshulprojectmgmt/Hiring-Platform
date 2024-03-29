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
// import webgazer from "webgazer";
// eslint-disable-next-line

const Test = () => {
  const navigate = useNavigate();
  const check = useSelector((state) => state.savedCode);
  const mcqData = useSelector((state) => state.savedMcq);
  // console.log(mcqData);
  const candidateEmail = useSelector((state) => state.testInfo.candidateEmail);
  const testCode = useSelector((state) => state.testInfo.testCode);
  const testtype = useSelector((state) => state.testInfo.testtype);
  const time = useSelector((state) => state.testInfo.duration);
  const initialTime = time * 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [hideCount, setHideCount] = useState(0);
  let timeTaken = useRef(initialTime);
  let tabSwitch = useRef(0);
  const videoFileName = `${candidateEmail}-video.mp4`;
  // const [uploadId, setUploadId] = useState("");

  const getFullscreenElement = () => {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullscreenElement ||
      document.msFullscreenElement
    );
  };

  let videoBlob;
  let audioBlob;
  const timerRef = useRef(null);
  const webcamRef = useRef(null);
  const videoMediaRecorder = useRef(null);
  const videoChunks = useRef([]);
  const audioMediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaStream = useRef(null);
  const audiomediaStream = useRef(null);
  const loader = useRef("false");
  const [show, setShow] = useState(false);

  const startRecording = useCallback(async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 720 },
          height: { ideal: 480 },
          frameRate: { ideal: 10 },
        },
      });

      mediaStream.current = stream;
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

      setIsRecording(true);
    } catch (error) {
      if (getFullscreenElement()) {
        document.exitFullscreen();
      }
      toast.warning("Sorry, you declined the media permissions");
      navigate("/testend");
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
      await setIsRecording(false);
      if (mediaStream.current) {
        await mediaStream.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    }
  }, [isRecording]);

  const downloadRecording = async () => {
    // const durationInSeconds = initialTime;
    if (videoChunks.current.length > 0 && audioChunks.current.length > 0) {
      videoBlob = await new Blob(videoChunks.current, {
        type: "video/mp4",
      });
      audioBlob = await new Blob(audioChunks.current, { type: "audio/webm" });
    } else {
      console.error("No video or audio data to download");
    }
  };

  const handleEndTest = useCallback(async () => {
    try {
      if(testtype === "coding"){
        const res = await axios.post(`${BASE_URL}/api/submit-test`, {
          testData: check,
          candidateEmail: candidateEmail,
          testCode: testCode,
          timetaken: timeTaken.current,
          tabswitch: tabSwitch.current,
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
          navigate("/testend");
        }
      }
      else if(testtype === "mcq"){
        const res = await axios.post(`${BASE_URL}/api/submit-mcqtest`, {
          testData: mcqData,
          candidateEmail: candidateEmail,
          testCode: testCode,
          timetaken: timeTaken.current,
          tabswitch: tabSwitch.current,
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
          navigate("/testend");
        }
      }
      
    } catch (error) {
      navigate("/testend");
      console.error("Error submitting test:", error);
    }
  }, [check,mcqData, candidateEmail, testCode, navigate]);

  const uploadVideo = async () => {
    const audioFileName = `${candidateEmail}-audio.webm`;
    const videoFileName = `${candidateEmail}-video.mp4`;
    const ans = await axios.post(`${BASE_URL}/api/transcriptions`, {
      bucketName: testCode,
    });
    const videoRes = await axios.post(`${BASE_URL}/api/s3upload`, {
      filename: videoFileName,
      contentType: "video/mp4",
      testcode: testCode,
    });
    const videos3url = videoRes.data.url;
    await axios.put(videos3url, videoBlob);
    const res = await axios.post(`${BASE_URL}/api/s3upload`, {
      filename: audioFileName,
      contentType: "audio/webm",
      testcode: testCode,
    });
    const audios3url = res.data.url;
    const response = await axios.put(audios3url, audioBlob);
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
          if (getFullscreenElement()) {
            document.exitFullscreen();
          }
        } else if(res.data.cam2status == 2 || res.data.cam2status == 0) {
          timeTaken.current = initialTime - timeLeft;
          setTimeLeft(0);
        } else {
          if (getFullscreenElement()) {
            document.exitFullscreen();
          }
          setTimeLeft(0);
        }
      }
    } catch (error) {
      console.log(error);
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
            await setShow(true);
            // console.log(mcqData);
            loader.current = "true";
            await stopRecording();
            await downloadRecording();
            await uploadVideo();
            await handleEndTest();
            clearInterval(timerRef.current);
            timerRef.current = null;
          } catch (error) {
            console.log("");
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
      setTimeLeft(0);
      // handleEndTest();
    }
  }, [hideCount]);

  return (
    <div id="fullscreen">
      <div className="navbar">
        <div className=" logo">AiPlanet</div>
        <div className="webcam">
          {loader.current === "true" ? null : (
            <Webcam audio={false} ref={webcamRef} width={100} height={44} />
          )}
        </div>
        <div className="timer">
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
          Please wait, your test and video is being uploaded to server. Sometime
          its takes 3-4 mins to upload.
        </Modal.Body>
      </Modal>

      {testtype === "coding" ? <Body /> : testtype === "mcq" ? <Mcq /> : null}
    </div>
  );
};

export default Test;
