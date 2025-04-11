import { useReactMediaRecorder } from "react-media-recorder";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import styles from './Subjective.module.css'
import axios from "axios";
import BASE_URL from "../../Api";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import HashLoader from "react-spinners/HashLoader"
import BarLoader from "react-spinners/BarLoader";
// const questions = [
// {question: "Explain about your most interesting project."},
//   {question: "What challenges did you face in your last project?"},
//   {question: "How do you keep yourself updated with new technologies?"}
// ];



const Subjective = () => {
    
    const { status, startRecording, stopRecording, mediaBlobUrl } =
         useReactMediaRecorder({ video: true , audio: true});
      const questions = useSelector((state) => state.getQuestion.questions);
    const currentQuestion = useSelector((state) => state.getQuestion.currentQuestion);
    const [recordedVideos, setRecordedVideos] = useState([]);
    const [speechResult,setSpeechResult] = useState(null);
    const [show , setShow] = useState(false);
    const dispatch = useDispatch();
   const [upd, setUpd] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
   
  const candidateEmail = useSelector((state) => state.testInfo.candidateEmail);
  const testCode = useSelector((state) => state.testInfo.testCode);
  const testtype = useSelector((state) => state.testInfo.testtype);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const audioRecorderRef = useRef(null);
  const audioBlobRef = useRef(null);
   let toastId;
  const present = recordedVideos.find((rec) =>rec.question === questions[currentQuestion].question );

  const handleSubmit = async (blobUrl, audioBlob) => {
    try {
      setIsLoading(true);
      // Trigger both async functions in parallel using Promise.all
      const [s3VideoUrl, speechScore] = await Promise.all([
        saveVideo(blobUrl),    // Save video to S3
        getSpeechResult(audioBlob)  // Get speech result
      ]);
  
      setIsLoading(false);
      // Once both functions are done, call storeTestResult with their results
      storeTestResult({ s3VideoUrl, speechScore });
  
    } catch (error) {
      // Handle any error from either of the functions
      console.error('Error occurred:', error);
      toast.warning("Please try again!!");
      setIsLoading(false);
    }
  };

  // Function to store the final test result
function storeTestResult({ s3VideoUrl, speechScore }) {
 
   toast.success("video uploaded successfully");
  
    setRecordedVideos([
      ...recordedVideos,
      { question: questions[currentQuestion].question, videoUrl: s3VideoUrl,speechResult: speechScore },
    ]);

    dispatch({
      type: "UPLOAD_SUBJECTIVE",
      question: questions[currentQuestion].question,
      blobUrl: s3VideoUrl,
      speechResult: speechScore,
    });
  
}

  const toggleRecording = (stat) => {
    
    if(stat==='recording'){
      stopRecording();
      stopAudioRec();
      toast.dismiss(toastId);
    }
  }
   const handleClose = () => setShow(false);
   const uploadVideo = async (videoBlob, id) => {
    
    try {
      const videoFileName = `${candidateEmail}-subjVideo-${id}.mp4`;
      
        const videoRes = await axios.post(`${BASE_URL}/api/s3upload`, {
          filename: videoFileName,   
          contentType: "video/mp4",
          testcode: testCode,
        });
      
        const videos3url = videoRes.data.url;
        await axios.put(videos3url, videoBlob);
      
        return videos3url.split('?')[0];
    } catch (error) {
      console.log('error: ', error)
      
    return null;
    }
      };

      const getMediaBlob = async (mediaBlobUrl) => {
        if (mediaBlobUrl) {
          const response = await fetch(mediaBlobUrl);
          const blob = await response.blob();
          return blob;
        }
        return null;
      };

      const saveVideo = async (blobUrl) => {
        
        try {
          const blob = await getMediaBlob(blobUrl);
         if(!blob) {
          throw new Error();
         }
           const s3VideoUrl = await uploadVideo(blob, currentQuestion + 1);
      //  const s3VideoUrl = "dumy";
       
          return s3VideoUrl
      } catch (error) {
          console.error('s3 upload failed:', error)
          throw error
        }
      
      };
      
  
    const handlePrev = () => {
      setUpd("idle");
      dispatch({type: "PREV_QUESTION"})
      toast.dismiss(toastId);
    }
    const handleNext = () => {
      let tstNxtId;
    if(!present) {
      if(tstNxtId){
        toast.dismiss(tstNxtId);
      }
      
     tstNxtId= toast.info(
      "Please Save video first", {
       
        position: "top-center",
        autoClose: 1000*5, // Duration in milliseconds (5000ms = 5 seconds)
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
  
  })
  return;
    }
      if(currentQuestion===(questions.length-1)) {
        toast.dismiss(tstNxtId);
        setShow(true);
      } else {
        setUpd("idle");
        dispatch({type:"NEXT_QUESTION"});
        toast.dismiss(tstNxtId);
        toast.dismiss(toastId);
      }
    }
    
  useEffect(() => {
    
    let timeId;
    if(status === "recording") {
      toast.dismiss(toastId);
      toastId=toast.info(<div>recording will automatically <strong style={{fontWeight:"bolder"}}>STOP</strong> after <strong style={{fontWeight:"bolder"}}>2 MIN</strong>. </div>, {
       
        position: "top-center",
        autoClose: 1000*60*2, // Duration in milliseconds (5000ms = 5 seconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
  
  })
    
     timeId = setTimeout(() => {
      
    stopRecording();
    stopAudioRec()
    
    }, 1000*60*2)
  }
    setUpd(status);
  return () => clearTimeout(timeId);
  },[status])

const getSpeechResult =async (audioBlob)=> {
  try {

const formData = new FormData();
formData.append('relevance_context', questions[currentQuestion].question);

if (audioBlob) {
  formData.append("audio", audioBlob, "audio.wav"); // Add the audio file to the formData
} else {
  throw new Error('Please upload an audio file.')
  }


  const resp = await axios.post(`${BASE_URL}/api/speech-result`,formData,{
   headers: {
     'Content-Type': 'multipart/form-data',}
  })


const speechRes = resp.data.speech.speech_score;
return speechRes
} catch (error) {
 console.error('speech error:', error) 
  throw error;
}

}

  // Stop audio recording
  function stopAudioRec() {
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
    }
  };


// Start audio recording separately
const startAudioRec = async () => {
  try {
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const clonedAudioStream = audioStream.clone();  // Clone the audio stream

    audioRecorderRef.current = new MediaRecorder(clonedAudioStream);
    let audioChunks = [];

    audioRecorderRef.current.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    audioRecorderRef.current.onstop = () => {
       audioBlobRef.current = new Blob(audioChunks, { type: "audio/wav" });
      setAudioBlobUrl(URL.createObjectURL(audioBlobRef.current));
    };

    // Start recording audio
    audioRecorderRef.current.start();
  } catch (error) {
    console.error("Error capturing audio:", error);
  }
};

 useEffect(() => {
  console.log('record start in 30sec.');
  let timeId;
   if(!present) {
    toastId=toast.info(<div>
      recording will automatically <strong style={{fontWeight:"bolder"}}>START</strong> after <strong style={{fontWeight:"bolder"}}>1 MIN</strong>. </div>, {
      position: "top-center",
      autoClose: 1000*60, // Duration in milliseconds (5000ms = 5 seconds)
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,

})
   timeId = setTimeout(() => {
    startRecording();
    startAudioRec();
            
  },1000*60)
  
}
  
   return () => clearTimeout(timeId);
  }, [currentQuestion])

console.log('questions:', questions);
console.log('currentQuestion:', currentQuestion);

  return (
    <div className={styles.mcqScreen}>   
   {isLoading && (
  <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      display: "flex",
      flexDirection:"column",
      justifyContent: "center",
      alignItems: "center",
       backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
      zIndex: 1000, // Ensure it appears above other content
    }}>
    <HashLoader
      color={"#1c4b74"}
      loading={isLoading}
      size={120}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
    <p style={{padding: "10px" ,color:"white", fontWeight:"bolder" ,fontSize:"16px"}}>please wait, it will take 2-3 min to upload your video</p>
  </div>
)}


      <div className={styles.mcqHead}>
      <div>
        {currentQuestion!==0 && 
        <button
          
          disabled={currentQuestion === 0}
          onClick={handlePrev}
          className={`${styles.ctaButton}`}
        >
          Prev
        </button>
        }
        </div>
        <div className="right-btn">
          <button onClick={handleNext} className={`${styles.ctaButton}`}>
            Next
          </button>
        </div>
        
      </div>

      {questions.length == 0 ? <BarLoader color="#5880F0" width={550} /> : 
        <div className={styles.mcqBody}>
        <div className={styles.mcqQuestion}>
          <h4 className="problem_body_heading">
            Question {currentQuestion + 1}
          </h4>
          <p className={styles.para}>{questions[currentQuestion]?.question}
            <br/>
            <hr/>
            <p>key points:</p>
            <ul>
              <li>Give breif intro about project</li>
              <li>Mention all the tech you have used</li>
              <li>Mention few of the features of your project</li>
              
            </ul>
          </p>
          <hr/>
          <p className={styles.para}>
          <h4 className="problem_body_heading">
            Note: 
          </h4>
            <ol>
              <li>You have to wait (<span style={{fontSize: '16px' , "fontWeight": "bold", color:"black"}}>1 min</span>) till recording starts.</li>
              <li>You can <span style={{fontSize: '16px' , "fontWeight": "bold", color:"black"}}>STOP</span> the recording when you are finished. 
               <span style={{fontSize: '16px' , "fontWeight": "bold", color:"black"}}> Max limit is 2 Mins </span>
                 after which it will automatically stop.</li>
              <li>consider all the above key points while recording your answer.</li>
              
            </ol>
          </p>

        </div>
        
    <div className={styles.videoContainer}>
      
    <div className={styles.webcam}>
      {upd!=="stopped" ? 
         <Webcam  className={styles.video} audio={false}  style={{  objectFit: 'cover'}} />
      
        : 
        <>
         <video className={styles.video} src={mediaBlobUrl} controls autoPlay loop muted />
         <audio src={audioBlobUrl} controls  />
         </>
     }
     </div> 
      <div className={styles.btnContainer}>
      <button disabled={isLoading || present || upd!=='recording'}
       className={`${styles.ctaButton}`}
        style={{backgroundColor: upd==="recording"? "red": ''}}
         onClick={()=> toggleRecording(upd)} >
        {upd === "recording" ? "Stop Recording..." : "Start Recording"}
      </button>
      {upd === "stopped" && (
        <button 
        style={{display:"flex", gap:"2px", justifyContent:"center" ,alignItems:"center"}}
        disabled={isLoading} className={isLoading? styles.ctaBtnDisable : styles.ctaButton}
        onClick={() => {handleSubmit(mediaBlobUrl, audioBlobRef.current)}}
        >
          Save
        <ClipLoader
        color={"#1c4b74"}
        loading={isLoading}
        // cssOverride={override}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
        </button>
      )}
      </div>
    </div>
        </div>
      }
    <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Alert!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This is the last question you can submit the test by clicking on the
            end test button.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
    </div>
  );
};

export default Subjective;