// Import the AssemblyAI client

const express = require("express");
const router = express.Router();
const path = require('path');
const multer = require('multer');
const fs= require('fs')
const axios = require('axios');
const FormData = require('form-data'); // Ensure this is the correct form-data for Node.js

// Configure multer for handling file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './uploads'); // Save the audio files in an "uploads" folder
//     },
//     filename: (req, file, cb) => {
//       cb(null, `audio_${Date.now()}_${Math.floor(Math.random()*90000)}`); // Save file with unique name
//     }
//   });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../uploads');
  
      // Check if uploads folder exists, if not, create it
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
  
      cb(null, uploadPath); // Save the audio files in an "uploads" folder
    },
    filename: (req, file, cb) => {
      cb(null, `audio_${Date.now()}_${Math.floor(Math.random() * 90000)}`);
    }
  });

  const upload = multer({storage});

// Function to handle transcription
const speechResult = async (req, res) => {
    const premiumKey = 'hp%2FcLPCISnbHLg2usZva2edos9XXQ3Wui3trsr6EGlvJ37plWScrD%2Fn0k0R0cfp%2FRY0F06KfqhnbsVIUuQUXJDJsu0g2lvz0sQhthG%2F%2BKld7XFpJGeBcbC1wt4gA8Roe'
    const url = `https://api5.speechace.com/api/scoring/speech/v9/json?key=${premiumKey}&dialect=en-us&user_id=XYZ-ABC-99001`;
    // console.log('req file:' ,req.file)
    const quePrompt =  req.body.relevance_context

    if(!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const audioPath = req.file.path;

  const formData = new FormData();
  formData.append('relevance_context',quePrompt ); // Add your context here
  formData.append('user_audio_file',fs.createReadStream(audioPath) ); // Add the audio file

  try {
    // Make POST request to SpeechAce API
    const speechRes = await axios.post(url, formData,{
      headers: {
       
         ...formData.getHeaders(), // Necessary to send form-data headers
      },

    } 
    );
    
    res.json({speech: speechRes.data});
  } catch (error) {
    console.error('Error communicating with SpeechAce API:', error);
    res.status(500).json({ error: 'Error processing the audio with SpeechAce API' });
  } finally {
    // Optionally, remove the audio file after processing to save disk space
    fs.unlink(audioPath, (err) => {
      if (err) console.error('Error deleting audio file:', err);
    });
  }    

};

router.post('/speech-result', upload.single('audio'),  speechResult)

module.exports = router