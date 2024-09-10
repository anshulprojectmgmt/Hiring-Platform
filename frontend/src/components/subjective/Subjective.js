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
const questions = [
{question: "Explain about your most interesting project."},
  {question: "What challenges did you face in your last project?"},
  {question: "How do you keep yourself updated with new technologies?"}
];



const Subjective = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: true , audio: true});
    // const questions = useSelector((state) => state.getQuestion.questions);
    const currentQuestion = useSelector((state) => state.getQuestion.currentQuestion);
    const [recordedVideos, setRecordedVideos] = useState([]);
    const [show , setShow] = useState(false);
    const dispatch = useDispatch();
   const [upd, setUpd] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
   
  const candidateEmail = useSelector((state) => state.testInfo.candidateEmail);
  const testCode = useSelector((state) => state.testInfo.testCode);
  const testtype = useSelector((state) => state.testInfo.testtype);
   
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
     //   const s3VideoUrl = "dumy";
       
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
      if(currentQuestion===questions.length-1) {
        setShow(true);
      } else {
        setUpd("idle");
        dispatch({type:"NEXT_QUESTION"});
      }
    }
    
  useEffect(() => {
    console.log('status==' , status)
  setUpd(status);
  },[status])

//  useEffect(() => {
//   toast.warning("recording will automatically start after 1 min. ")
//   const timeId = setTimeout(() => {
//     console.log('recoridng start==');
//     startRecording();
//   },1000*30)
//   // return clearTimeout(timeId);
//  }, [])

  return (
    <div className={styles.mcqScreen}>   
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
              <li>Why did you choose these tech-stack</li>
            </ul>
          </p>
          <hr/>
          <h4 className="problem_body_heading">
            Note: 
          </h4>
          <p className={styles.para}>
            Record a video of yourself , not excedding 3 minumte.
            <br/> consider all the above key points while recording your answer.
          </p>
        </div>
        
    <div className={styles.videoContainer}>
      
    <div className={styles.webcam}>
      {upd!=="stopped" ? 
         <Webcam className={styles.video} audio={false}  style={{  objectFit: 'cover'}} />
         : 
         <video className={styles.video} src={mediaBlobUrl} controls autoPlay loop />
     }
     </div> 
      <div className={styles.btnContainer}>
      <button disabled={isLoading} className={`${styles.ctaButton}`} style={{backgroundColor: upd==="recording"? "red": ''}} onClick={upd === "recording" ? stopRecording : startRecording} >
        {upd === "recording" ? "Stop Recording" : "Start Recording"}
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