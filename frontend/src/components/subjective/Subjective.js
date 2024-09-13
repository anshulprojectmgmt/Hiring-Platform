import { useReactMediaRecorder } from "react-media-recorder";
import { useEffect, useState } from "react";
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
    const [show , setShow] = useState(false);
    const dispatch = useDispatch();
   const [upd, setUpd] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
   
  const candidateEmail = useSelector((state) => state.testInfo.candidateEmail);
  const testCode = useSelector((state) => state.testInfo.testCode);
  const testtype = useSelector((state) => state.testInfo.testtype);
   
  const present = recordedVideos.find((rec) =>rec.question === questions[currentQuestion].question );

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
        setIsLoading(true);
        try {
          const blob = await getMediaBlob(blobUrl);
         if(!blob) {
          throw new Error();
         }
           const s3VideoUrl = await uploadVideo(blob, currentQuestion + 1);
      //  const s3VideoUrl = "dumy";
       
          setIsLoading(false);
        
        
         toast.success("video uploaded successfully");
          if (s3VideoUrl) {
            setRecordedVideos([
              ...recordedVideos,
              { question: questions[currentQuestion].question, videoUrl: s3VideoUrl },
            ]);
        
            dispatch({
              type: "UPLOAD_SUBJECTIVE",
              question: questions[currentQuestion].question,
              blobUrl: s3VideoUrl,
            });
          } else {
            console.log('Failed to upload video to S3.');
          }
        } catch (error) {
          setIsLoading(false);
          toast.warning("Please try again!!");
        }
      
      };
      
  
    const handlePrev = () => {
      setUpd("idle");
      dispatch({type: "PREV_QUESTION"})
    }
    const handleNext = () => {
    
      if(currentQuestion===(questions.length-1)) {
        setShow(true);
      } else {
        setUpd("idle");
        dispatch({type:"NEXT_QUESTION"});
      }
    }
    
  useEffect(() => {
    
    let timeId;
    if(status === "recording") {
      toast.warning(<div>recording will automatically <strong style={{fontWeight:"bolder"}}>STOP</strong> after <strong style={{fontWeight:"bolder"}}>2 MIN</strong>. </div>, {
       
        position: "top-center",
        autoClose: 1000*60*2, // Duration in milliseconds (5000ms = 5 seconds)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
  
  })
    console.log('record will stop  in 30sec.');
     timeId = setTimeout(() => {
    stopRecording();
    
    }, 1000*60*2)
  }
    setUpd(status);
  return () => clearTimeout(timeId);
  },[status])

  // useEffect(() => {
  //   console.log('original status:' , status)
  //   setUpd(status);
  // }, [status])

 useEffect(() => {
  console.log('record start in 30sec.');
  let timeId;
   if(!present) {
    toast.warning(<div>
      recording will automatically <strong style={{fontWeight:"bolder"}}>START</strong> after <strong style={{fontWeight:"bolder"}}>1 MIN</strong>. </div>, {
      position: "top-center",
      autoClose: 1000*60, // Duration in milliseconds (5000ms = 5 seconds)
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,

})
   timeId = setTimeout(() => {
    console.log('upd status after 1min of mounting' , upd);
    // if(upd==="idle") {
      console.log('recoridng start==');
      startRecording();
    
    // }        
  },1000*60)
  
}
  
   return () => clearTimeout(timeId);
  }, [currentQuestion])



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
      <div className={styles.mcqBody}>
        <div className={styles.mcqQuestion}>
          <h4 className="problem_body_heading">
            Question {currentQuestion + 1}
          </h4>
          <p className={styles.para}>{questions[currentQuestion].question}
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
          <h4 className="problem_body_heading">
            Note: 
          </h4>
          <p className={styles.para}>
            Record a video of yourself , <span style={{fontSize: '16px' , "fontWeight": "bold", color:"black"}}>Max 2 minumte</span>.
            <br/> consider all the above key points while recording your answer.
          </p>
        </div>
        
    <div className={styles.videoContainer}>
      
    <div className={styles.webcam}>
      {upd!=="stopped" ? 
         <Webcam  className={styles.video} audio={false}  style={{  objectFit: 'cover'}} />
      
        : 
         <video className={styles.video} src={mediaBlobUrl} controls autoPlay loop muted />
     
     }
     </div> 
      <div className={styles.btnContainer}>
      <button disabled={isLoading || present || true} className={`${styles.ctaButton}`} style={{backgroundColor: upd==="recording"? "red": ''}} onClick={upd === "recording" ? stopRecording : startRecording} >
        {upd === "recording" ? "Recording" : "Start Recording"}
      </button>
      {upd === "stopped" && (
        <button style={{display:"flex", gap:"2px", justifyContent:"center" ,alignItems:"center"}} disabled={isLoading} className={isLoading? styles.ctaBtnDisable : styles.ctaButton} onClick={() => saveVideo(mediaBlobUrl)}>Save
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