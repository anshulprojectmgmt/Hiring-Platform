import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Camera2.css";
import Webcam from "react-webcam";
import { useParams } from "react-router-dom";
import BASE_URL from "../../Api";
import axios from "axios";

import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BarLoader from "react-spinners/BarLoader";
import Modal from "react-bootstrap/Modal";

const Camera2 = () => {
  const webcamRef = useRef(null);
  const videoMediaRecorder = useRef(null);
  const videoChunks = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaStream = useRef(null);

  const [candidateValidation, setCandidateValidation] = useState(null);
  const [candidateEmail, setCandidateEmail] = useState(null);
  const [testCode, setTestCode] = useState(null);
  const { cid } = useParams();

  useEffect(() => {
    const getDashboardInfo = async () => {
        const res = await axios.post(`${BASE_URL}/api/validate-camera2-session`, {
          cid,
      });
      console.log(res);
      setCandidateValidation(res.data.success);
      setCandidateEmail(res.data.candidateEmail);
      setTestCode(res.data.testCode);
    }

    getDashboardInfo();
  }, [cid, setCandidateEmail]);

  const navigate = useNavigate();
  const check = useSelector((state) => state.savedCode);
  const loader = useRef("false");
  const [show, setShow] = useState(false);

  const timerRef = useRef(null);

  let videoBlob;

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
  }, [navigate]);

  useEffect(() => {
    startRecording();
  }, [startRecording]);

  const stopRecording = useCallback(async () => {
    if (
      videoMediaRecorder.current &&
      isRecording
    ) {
      await videoMediaRecorder.current.stop();
      setIsRecording(false);
      if (mediaStream.current) {
        // console.log(mediaStream.current.getTracks());
        await mediaStream.current
          .getTracks()
          .forEach((track) => {
            console.log(track);
            track.stop();
          });
      }
    }
  }, [isRecording]);

  const handleEndTest = useCallback(async () => {
    try {
        const res = await axios.post(`${BASE_URL}/api/submit-test`, {
          testData: check,
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
      navigate("/testend");
      console.error("Error submitting test:", error);
    }
  }, [check, candidateEmail, testCode, navigate]);

  const uploadVideo = async () => {
    const videoFileName = `${candidateEmail}-video2.mp4`;
    await axios.post(`${BASE_URL}/api/transcriptions`, {
      bucketName: testCode,
    });
    const videoRes = await axios.post(`${BASE_URL}/api/s3upload`, {
      filename: videoFileName,
      contentType: "video/mp4",
      testcode: testCode,
    });
    const videos3url = videoRes.data.url;
    console.log(videos3url);
    await axios.put(videos3url, videoBlob);
  };

  const camera2Submit = async () => {
    try {
      setShow(true);
      loader.current = "true";
      await stopRecording();
      await uploadVideo();
      await handleEndTest();
      clearInterval(timerRef.current);
      timerRef.current = null;
    } catch (error) {
      console.log("");
    }
  };

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
        {candidateValidation === true ? (
          <Webcam audio={false} ref={webcamRef} style={{width: "100vw", height: "100vh"}} />
        ) : null}
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
