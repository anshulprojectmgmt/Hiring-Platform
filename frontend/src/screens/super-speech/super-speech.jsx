import React, { useState } from 'react';
import jsSHA from 'jssha';
import style from './speechsuper.module.css'
import CryptoJS from 'crypto-js';  // Import crypto-js
import { data } from './data';

const SpeechSuper = () => {
  const [responseText, setResponseText] = useState(data[4]);
  const [loading, setLoading] = useState(false);
  const [audioFile, setAudioFile] = useState(null); // Store selected audio file

  const baseUrl = "https://api.speechsuper.com/";
  const appKey = '172005849000034a';
  const secretKey = "a58d04c787f76d395cace1c4bf20079c";
  const coreType = "speak.eval.pro";
  const questionPrompt = "Tell us about your most interesting machine learning project";
  const audioType = "mp3";
  const sampleRate = 16000;
  const userId = "guest";
  const testType = 'ielts';
  const taskType = 'ielts_part2';
  const url = `${baseUrl}${coreType}`;

 

  var getConnectSig = function () {
      var timestamp = new Date().getTime().toString();
      var shaObj = new jsSHA("SHA-1", "TEXT");
      shaObj.update(appKey + timestamp + secretKey);
      var sig = shaObj.getHash("HEX");
      return { sig: sig, timestamp: timestamp };
  }
  
  var getStartSig = function () {
      var timestamp = new Date().getTime().toString();
      var shaObj = new jsSHA("SHA-1", "TEXT");
      shaObj.update(appKey + timestamp + userId + secretKey);
      var sig = shaObj.getHash("HEX");
      return { sig: sig, timestamp: timestamp, userId: userId };
  }
  

  const createUUID = () => {
    return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === "x" ? r : (r & 3 | 8);
      return v.toString(16).toUpperCase();
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const connectSig = getConnectSig();
    const startSig = getStartSig();

    const params = {
      connect: {
        cmd: "connect",
        param: {
          sdk: {
            version: 16777472,
            source: 9,
            protocol: 2
          },
          app: {
            applicationId: appKey,
            sig: connectSig.sig,
            timestamp: connectSig.timestamp
          }
        }
      },
      start: {
        cmd: "start",
        param: {
          app: {
            applicationId: appKey,
            sig: startSig.sig,
            userId: startSig.userId,
            timestamp: startSig.timestamp
          },
          audio: {
            audioType,
            sampleRate,
            channel: 1,
            sampleBytes: 2
          },
          request: {
            coreType,
            tokenId: createUUID(),
            task_type: taskType,
            test_type: testType,
            question_prompt: questionPrompt
          }
        }
      }
    };

    const formData = new FormData();
    formData.append("text", JSON.stringify(params));

    if (audioFile) {
      formData.append("audio", audioFile); // Add the audio file to the formData
    } else {
      alert('Please upload an audio file.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Request-Index': '0'
        },
        body: formData
      });
 console.log('super speech:', response);
      if (response.ok) {
        const result = await response.json();
        console.log('super speech:', result);
        setResponseText(result.result);
      } else {
        console.error('Error:', response.status, response.statusText);
        setResponseText('Failed to get response');
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setResponseText('An error occurred');
    }

    setLoading(false);
  };

  return (
    <div>
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
        <h2 style={{textAlign:"center"}}>API: Super-Speech</h2>
        <div  data-v-b8ce3cb6="" className={style.scores}>
            <div data-v-b8ce3cb6="" className={style.scoreItem}>
                <div data-v-b8ce3cb6="" className={style.scoreLabel}>Overall Rating</div>
                <div data-v-b8ce3cb6="" className={style.score}>{responseText.overall}<span data-v-b8ce3cb6="">/9.0</span></div>
            </div>
            <div data-v-b8ce3cb6="" className={style.scoreItem}>
                <div data-v-b8ce3cb6="" className={style.scoreLabel}>Fluency &amp; Coherence</div>
                <div data-v-b8ce3cb6="" className={style.score}>{Number(responseText.fluency_coherence).toFixed(1)}<span data-v-b8ce3cb6="">/9.0</span></div>
            </div>
            <div data-v-b8ce3cb6="" className={style.scoreItem}>
                <div data-v-b8ce3cb6="" className={style.scoreLabel}>Grammatical range & accuracy</div>
                <div data-v-b8ce3cb6="" className={style.score}>{Number(responseText.grammar).toFixed(1) }<span data-v-b8ce3cb6="">/9.0</span></div>
            </div>
            <div data-v-b8ce3cb6="" className={style.scoreItem}>
                <div data-v-b8ce3cb6="" className={style.scoreLabel}>Pronunciation</div>
                <div data-v-b8ce3cb6="" className={style.score}>{Number(responseText.pronunciation).toFixed(1)}<span data-v-b8ce3cb6="">/9.0</span></div>
            </div>
           
            <div data-v-b8ce3cb6="" className={style.scoreItem}>
                <div data-v-b8ce3cb6="" className={style.scoreLabel}>Vocab</div>
                <div data-v-b8ce3cb6="" className={style.score}>{Number(responseText.lexical_resource).toFixed(1)}<span data-v-b8ce3cb6="">/9.0</span></div>
            </div>
            
            <div data-v-b8ce3cb6="" className={style.scoreItem}>
                <div data-v-b8ce3cb6="" className={style.scoreLabel}>Topic Relevance</div>
                <div data-v-b8ce3cb6="" className={style.score}>{responseText.relevance}<span data-v-b8ce3cb6="">%</span></div>
            </div>
            
            {Object.keys(responseText.pause_filler).length>0  && 
             <div data-v-b8ce3cb6="" className={style.scoreItem}>
             <div data-v-b8ce3cb6="" className={style.scoreLabel}>Pause Filler</div>
              {Object.keys(responseText.pause_filler).map((filler) => (
                <div data-v-b8ce3cb6="" className={style.score}>{filler} : &nbsp; &nbsp; x{responseText.pause_filler[filler]}</div>
              )) }
             
            </div>
            }

        </div>
        <div>
          <h1 style={{textAlign:"center"}}>Transcript:</h1>
            <h3>{responseText.transcription}</h3>
        </div>
        </>
      )}
    </div>
  );
};

export default SpeechSuper;
