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

const Camera2 = () => {
  const navigate = useNavigate();
  const time = useSelector((state) => state.testInfo.duration);
  const initialTime = 1000 * 60;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [hideCount, setHideCount] = useState(0);
  let timeTaken = useRef(initialTime);
  let tabSwitch = useRef(0);

  let videoBlob;
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

  useEffect(() => {
    const getDashboardInfo = async () => {
        const res = await axios.post(`${BASE_URL}/api/validate-camera2-session`, {
          cid,
      });
      setCandidateValidation(res.data.success);
      setCandidateEmail(res.data.candidateEmail);
      setTestCode(res.data.testCode);
    }

    getDashboardInfo();
  }, [cid, setCandidateEmail]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 720 },
          height: { ideal: 480 },
          frameRate: { ideal: 10 },
        },
      });

      mediaStream.current = stream;

      videoMediaRecorder.current = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      videoMediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunks.current.push(event.data);
        }
      };

      videoMediaRecorder.current.start();

      setIsRecording(true);
    } catch (error) {
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
      isRecording
    ) {
      await videoMediaRecorder.current.stop();
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
    if (videoChunks.current.length > 0) {
      videoBlob = await new Blob(videoChunks.current, {
        type: "video/mp4",
      });
    } else {
      console.error("No video or audio data to download");
    }
  };

  /* const handleEndTest = useCallback(async () => {
    try {
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
    } catch (error) {
      navigate("/testend");
      console.error("Error submitting test:", error);
    }
  }, [check,mcqData, candidateEmail, testCode, navigate]); */

  const uploadVideo = async () => {
    const videoFileName = `${candidateEmail}-video2.mp4`;
    const videoRes = await axios.post(`${BASE_URL}/api/s3upload`, {
      filename: videoFileName,
      contentType: "video/mp4",
      testcode: testCode,
    });
    const videos3url = videoRes.data.url;
    await axios.put(videos3url, videoBlob);
  };

  const camera2Submit = async () => {
    try {
      let cid = localStorage.getItem("cid");
      setTimeLeft(0);
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
            loader.current = "true";
            await stopRecording();
            await downloadRecording();
            await uploadVideo();
            // await handleEndTest();
            clearInterval(timerRef.current);
            timerRef.current = null;
            // navigate("/testend");

            const res = await axios.post(`${BASE_URL}/api/submit-test`, {
              candidateEmail: candidateEmail,
              testCode: testCode,
              cam2: 2
            });
            if (!res.data.success) {
              toast.error(res.data.message);
            } else {
              // toast.success(res.data.message);
              loader.current = "false";
              toast.success(res.data.message);
    
              navigate("/testend");
            }
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
  }, [timeLeft, /* handleEndTest, */ startRecording, stopRecording]);

  return (
    <div id="fullscreen">
      <div className="navbar">
        <div className=" logo">AiPlanet</div>
        <div className="timer">
          <div
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            className="endtest-btn"
          >
            End Test
          </div>
        </div>
      </div>
      <div className="webcam">
        <Webcam audio={false} ref={webcamRef} style={{width: "100vw", height: "100vh"}} />
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
  );
};

export default Camera2;
