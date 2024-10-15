import React, { useState } from 'react'
import rec from "./recording.module.css"
import rightUp from "../../assests/right-up.png"
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Recording = () => {
    const location = useLocation();
    
    const {candidateInfo,score , testtype} = location.state;
    
    const [camType,setCamType] = useState(1);
   const navigate = useNavigate();
    const dispatch = useDispatch();
  const handleSpeechView = (info, ind) => {
    dispatch({type: "SET_VIDEO_INDX", candidateResult: info, index: ind});
    navigate('/speech-ace')
  }

  return (
    <div className={rec.recording}>
        <h1 className={rec.titleheading}>{candidateInfo.name}</h1>
        
    <div className={rec.titlecont}>
    <div
    className={camType === 1 ? `${rec.rectitle} ${rec.active}` : `${rec.rectitle}`}
    onClick={() => setCamType(1)}
  >
    Cam1
  </div>
  <div
    className={camType === 2 ? `${rec.rectitle} ${rec.active}` : `${rec.rectitle}`}
    onClick={() => setCamType(2)}
  >
    Cam2
  </div>
   </div>
       {testtype==="subjective" ? (
        
        camType===1 ?
      <div  className={rec.videocont}>
        {(candidateInfo.result && candidateInfo.result.length > 0) ? 
        candidateInfo.result.map((shot,ind) => (
           
              // <img className={rec.capimg} src={shot} alt='screenshot' />
            <div className={rec.videoItem} key={ind}>
            <video src={shot.subjVideoUrl} className={rec.capvideo}  controls />
            <p style={{minHeight: '30px'}} className={rec.ques} >{shot.question}</p>
            <div onClick={()=>{handleSpeechView(candidateInfo,ind)}} className="ctabutton">
              View Speech Analysis
            </div>
            </div>
        ))
        : 
      <div style={{display:"flex", justifyContent:"center" ,alignItems:"center", fontSize:"20px" , fontWeight: "bold", width:"100%" ,minHeight:"300px"}} className={rec.videocont}>No Recording present</div>
      }



    </div>
      :
      <div  className={rec.videocont}>
        {(candidateInfo.screenshots && candidateInfo.screenshots.length > 0) ? 
        candidateInfo.screenshots.map((shot) => (
               <img className={rec.capimg} src={shot} alt='screenshot' />
           ))
        : 
      <div style={{display:"flex", justifyContent:"center" ,alignItems:"center", fontSize:"20px" , fontWeight: "bold", width:"100%" ,minHeight:"300px"}} className={rec.videocont}>No screenshot present for secondary camera</div>
      }

    </div>
        
        
       ) : (
       
       camType===1 ?
        <div style={{display:"flex", justifyContent:"center" ,alignItems:"center", fontSize:"20px" , fontWeight: "bold", width:"100%" ,minHeight:"300px"}} className={rec.videocont}>Primary cam recording , will add soon.</div>
      :
      <div  className={rec.videocont}>
        {(candidateInfo.screenshots && candidateInfo.screenshots.length > 0) ? 
        candidateInfo.screenshots.map((shot) => (
             <img className={rec.capimg} src={shot} alt='screenshot' />
           ))
      : 
      <div style={{display:"flex", justifyContent:"center" ,alignItems:"center", fontSize:"20px" , fontWeight: "bold", width:"100%" ,minHeight:"300px"}} className={rec.videocont}>No screenshot present for secondary camera</div>
      }
    </div>
        
       )}
        
        
       
    
    </div>
  )
}

export default Recording