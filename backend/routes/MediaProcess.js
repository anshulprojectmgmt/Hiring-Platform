const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.post('/process-media', upload.fields([{ name: 'audio' }, { name: 'video' }, { name: 'duration' }]), (req, res) => {
    // Access the audio and video blobs as buffers in req.files
    const audioBlob = req.files['audio'][0].buffer;
    const videoBlob = req.files['video'][0].buffer;
    
    // Extract the duration from the form data
    const duration = req.body.duration;
  
    // Function to add duration metadata to a buffer
    function addDurationMetadata(inputBuffer, format, callback) {
      ffmpeg()
        .input(inputBuffer)
        .inputFormat("webm")
        .outputOptions([`-metadata duration=${duration}`])
        .toFormat(format)
        .on('end', () => {
          const outputBuffer = ffmpeg.toBuffer();
          callback(null, outputBuffer);
        })
        .on('error', (err) => {
          callback(err, null);
        });
    }
  
    // Add duration metadata to audio and video blobs
    addDurationMetadata(audioBlob, 'webm', (err, processedAudioBlob) => {
      if (err) {
        console.error('Error processing audio:', err);
        return res.status(500).json({ error: 'Error processing audio' });
      }
  
      addDurationMetadata(videoBlob, 'webm', (err, processedVideoBlob) => {
        if (err) {
          console.error('Error processing video:', err);
          return res.status(500).json({ error: 'Error processing video' });
        }
  
        // Send the processed audio and video blobs back to the client
        res.status(200).json({ audioBlob: processedAudioBlob, videoBlob: processedVideoBlob });
      });
    });
  });
  

module.exports = router;