import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import styles from "./PermissionsCheck.module.css"; // Import the CSS module
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import BASE_URL from '../../Api';
import { toast } from "react-toastify";
import BarLoader from 'react-spinners/BarLoader';

const PermissionsCheck = () => {
 const [permissions, setPermissions] =  useState({
    camera: null,
    audio: null,
    screen: null,
 })
 const [allGranted, setAllGranted] = useState(false);
 const [errors, setErrors] = useState([])
 const [isLoading, setIsLoading] = useState(false);
 const dispatch = useDispatch();
 const testInfo = useSelector((state) => state.testInfo);
 const result = useRef(null)
 const navigate = useNavigate();

 useEffect(() => {
    // Check if all permissions are granted
    setAllGranted(
      permissions.camera === true &&
      permissions.audio === true &&
      permissions.screen === true
    );
  }, [permissions]);

    const updatePermissions = (key, status) => {
        setPermissions((prev) => ({...prev, [key]: status}))
    
        // Remove errors if permission is granted
    if (status === true) {
        setErrors((prev) => prev.filter((error) => !error.includes(key)));
      }
    }

    const addError = (key, msg) => {
        setErrors((prev) => {
            const exitingError = prev.find((err) => err.includes(key));
            if(!exitingError) {
                return [...prev, `${key} - ${msg}`]
            }else{
                return prev;
            }
        })
    }

 const requestCameraPermission = async () => {
    try {
        const cameraState = await navigator.mediaDevices.getUserMedia({ video: true });
      updatePermissions("camera", true);
      dispatch({ type: "CAMERA", camera: cameraState });
    } catch (err) {
      updatePermissions("camera", false);
      addError("camera", "Permission denied.");
    }
  };

  const requestMicrophonePermission = async () => {
    try {
        const audioState =   await navigator.mediaDevices.getUserMedia({ audio: true });
      updatePermissions("audio", true);
      dispatch({ type: "AUDIO", audio: audioState });
    } catch (err) {
      updatePermissions("audio", false);
      addError("microphone", "Permission denied.");
    }
  };

  const requestScreenPermission = async () => {
    setIsLoading(true);
    try {
      const screenState = await navigator.mediaDevices.getDisplayMedia({ video: true });
  
      // Check if the shared media is "entire screen" using the label of the video track
      const videoTrack = screenState.getVideoTracks()[0];
      const isEntireScreen = videoTrack.label.toLowerCase().includes("screen");
  
      if (isEntireScreen) {
        updatePermissions("screen", true);
        dispatch({ type: "SCREEN", screen: screenState });
      } else {
        // Stop the stream if not the entire screen and notify the user
        screenState.getTracks().forEach((track) => track.stop());
        updatePermissions("screen", false);
        addError("screen", "Please share your entire screen.");
      }
    } catch (err) {
      updatePermissions("screen", false);
      addError("screen", "Permission denied.");
    }finally {
      setIsLoading(false); // Hide loader
    }
  };
  

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
        testCode: testInfo?.testCode
      });
      
       dispatch({ type: "SET_QUESTION", payload: res.data.que });
       
    } catch (error) {
      console.log('failed to fetch que:' , error);
      
    }
  }
  const handleClick = async () => {
    try {
    await fetchQuestions();
      
    // enterFullScreen(videoelem);
     await document.documentElement.requestFullscreen()
     setTimeout(() => {
        navigate("/test", {replace: true});
      },1000);

    } catch (error) {
      console.log('full screen error==2' , error)
      toast.error("something went wrong, Try Again!")
    }

    };

    return (
      <>
           <div className="navbar">
            <div className=" logo">AiPlanet</div>
        </div> 
        <div className={styles.container}>
        <h1 className={styles.title}>Permission Request</h1>
         {/* Loader */}
       {isLoading && <BarLoader color="#5880F0" width={550} /> }  
        <div className={styles.statusContainer}>
        
          <p 
            style={{display:"flex", justifyContent:"space-between", width:"100%", alignItems: "center"}}
            className={`${styles.status} ${permissions.camera === true ? styles.granted : permissions.camera === false ? styles.denied : styles.pending}`}
             >
            <span>Camera Permission: {permissions.camera === null ? "Pending" : permissions.camera ? "Granted" : "Denied"}</span>
            <button onClick={requestCameraPermission} className={styles.actionButton}>
            Request Camera
          </button>
          </p>
          
           <p
            style={{display:"flex", justifyContent:"space-between", width:"100%", alignItems: "center"}} 
            className={`${styles.status} ${permissions.audio === true ? styles.granted : permissions.audio === false ? styles.denied : styles.pending}`}
            >
            <span>Microphone Permission: {permissions.audio === null ? "Pending" : permissions.audio ? "Granted" : "Denied"}</span>
            <button onClick={requestMicrophonePermission} className={styles.actionButton}>
            Request Microphone
          </button>
          </p>

           
          
          <p
            style={{display:"flex", justifyContent:"space-between", width:"100%", alignItems: "center"}} 
            className={`${styles.status} ${permissions.screen === true ? styles.granted : permissions.screen === false ? styles.denied : styles.pending}`}
           >
           <span> Screen Sharing Permission: {permissions.screen === null ? "Pending" : permissions.screen ? "Granted" : "Denied"} </span>
            <button onClick={requestScreenPermission} className={styles.actionButton}>
            Request Screen Sharing
          </button>
          </p>

          
      </div>
  
        {/* <div className={styles.buttonGroup}>
          


        </div> */}
  
        {errors.length > 0 && (
          <div className={styles.errorContainer}>
            <h3 className={styles.errorTitle}>Error(s):</h3>
            <ul>
              {errors.map((error, index) => (
                <li key={index} className={styles.errorItem}>{error}</li>
              ))}
            </ul>
          </div>
        )}
  
        <button
          onClick={() => handleClick()}
          disabled={!allGranted}
          className={`${styles.startButton} ${allGranted ? styles.enabled : styles.disabled}`}
        >
          Start Test
        </button>
      </div>
      </>
  )
}

export default PermissionsCheck