import React, { useEffect, useState } from 'react';

import style from './SpeechAce.module.css'
import {data} from './data'
import { useSelector } from 'react-redux';


const SpeechAce = () => {
console.log('data', data);
  const [responseText, setResponseText] = useState(null);
  const [loading, setLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null); // Store selected audio file
  const premiumKey = 'hp%2FcLPCISnbHLg2usZva2edos9XXQ3Wui3trsr6EGlvJ37plWScrD%2Fn0k0R0cfp%2FRY0F06KfqhnbsVIUuQUXJDJsu0g2lvz0sQhthG%2F%2BKld7XFpJGeBcbC1wt4gA8Roe'
  const questionPrompt = "Tell us about your most interesting machine learning project";
  const url = `https://api5.speechace.com/api/scoring/speech/v9/json?key=${premiumKey}&dialect=en-us&user_id=XYZ-ABC-99001`;
  const {candidateResult, videoIndex} = useSelector((state) => state.candidateResult);
 console.log('cand info:', candidateResult);
 console.log('vdo ind', videoIndex)
  console.log('resp:' ,responseText);
const setSpeechData=()=> {
    setResponseText(
      data.find((item) => (item.name.toLowerCase()===candidateResult.name.toLowerCase()))
    )
}

useEffect(()=> {
  if(candidateResult) {
    setSpeechData();
  }
},[candidateResult])

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    

    const formData = new FormData();
    formData.append('relevance_context', questionPrompt);

    if (audioFile) {
      formData.append("user_audio_file", audioFile); // Add the audio file to the formData
    } else {
      alert('Please upload an audio file.');
      setLoading(false);
      return;
    }

    

// Make the fetch request
try {
    const resp = await fetch(url, {
  method: 'POST',
  body: formData ,
//   mode: 'no-cors',  // Attempt to bypass CORS
})
if (!resp.ok) {
    throw new Error('Network response was not ok ' + resp.statusText);
  }

  const data = await resp.json();
 console.log('Success:', data);
 setResponseText(data.speech_score);
 
}
 catch(error)  {
    console.error('Error:', error);
  }
  finally{
    setLoading(false);
  };
    
  };
  

  return (
    <div style={{marginTop: '1rem'}}>
       <form id="form" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files[0])} // Store the selected file
        />
        <button id="btn" type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form> 

      {responseText && (
        <>
        <h1 style={{textAlign:"center"}}>Name: {responseText.name}</h1>
        <h2 style={{textAlign:"center"}}>Speech Analysis</h2>
        <div  data-v-b8ce3cb6="" className={style.scores}>
            <div data-v-b8ce3cb6="" className={style.scoreItem}>
                <div data-v-b8ce3cb6="" className={style.scoreLabel}>Overall Rating</div>
                <div data-v-b8ce3cb6="" className={style.score}>{responseText.ielts_score.overall}<span data-v-b8ce3cb6="">/9.0</span></div>
            </div>
            <div data-v-b8ce3cb6="" className={style.scoreItem}>
                <div data-v-b8ce3cb6="" className={style.scoreLabel}>Fluency &amp; Coherence</div>
                <div data-v-b8ce3cb6="" className={style.score}>{Number(responseText.ielts_score.fluency).toFixed(1)}<span data-v-b8ce3cb6="">/9.0</span></div>
            </div>
            <div data-v-b8ce3cb6="" className={style.scoreItem}>
                <div data-v-b8ce3cb6="" className={style.scoreLabel}>Grammatical range & accuracy</div>
                <div data-v-b8ce3cb6="" className={style.score}>{Number(responseText.ielts_score.grammar).toFixed(1) }<span data-v-b8ce3cb6="">/9.0</span></div>
            </div>
            <div data-v-b8ce3cb6="" className={style.scoreItem}>
                <div data-v-b8ce3cb6="" className={style.scoreLabel}>Pronunciation</div>
                <div data-v-b8ce3cb6="" className={style.score}>{Number(responseText.ielts_score.pronunciation).toFixed(1)}<span data-v-b8ce3cb6="">/9.0</span></div>
            </div>
           
            <div data-v-b8ce3cb6="" className={style.scoreItem}>
                <div data-v-b8ce3cb6="" className={style.scoreLabel}>Vocab</div>
                <div data-v-b8ce3cb6="" className={style.score}>{Number(responseText.ielts_score.vocab).toFixed(1)}<span data-v-b8ce3cb6="">/9.0</span></div>
            </div>
            
            <div data-v-b8ce3cb6="" className={style.scoreItem}>
                <div data-v-b8ce3cb6="" className={style.scoreLabel}>Topic Relevance</div>
                <div data-v-b8ce3cb6="" className={style.score}>{responseText.relevance.class}<span data-v-b8ce3cb6=""></span></div>
            </div>
            
            {/* {Object.keys(responseText?.pause_filler).length>0  && 
             <div data-v-b8ce3cb6="" className={style.scoreItem}>
             <div data-v-b8ce3cb6="" className={style.scoreLabel}>Pause Filler</div>
              {Object.keys(responseText.pause_filler).map((filler) => (
                <div data-v-b8ce3cb6="" className={style.score}>{filler} : &nbsp; &nbsp; x{responseText.pause_filler[filler]}</div>
              )) }
             
            </div>
            } */}

        </div>
        <div style={{marginTop: '2rem', marginLeft: '10px',  marginRight: '10px', marginBottom:'10px' }}>
        <h1 style={{textAlign:"center"}}>Transcript:</h1>
            <p style={{padding:'10px'}}>{responseText.transcript}</p>
        </div>
        </>
      )}
    </div>
  );
};

export default SpeechAce;
