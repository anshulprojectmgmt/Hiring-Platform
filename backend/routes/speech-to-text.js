// // Import the AssemblyAI client
// const {AssemblyAI} = require('assemblyai');
// console.log('assemblyAI:' , typeof AssemblyAI)

// const express = require("express");
// const router = express.Router();
// const Candidate = require("../models/Candidates");

// // Initialize the client with your API key
// const client = new AssemblyAI({
//   apiKey: '79c636b94ddb416688ea6c6c83818057', // Replace with your actual API key
// });

// // Remote file URL for transcription
// const FILE_URL ='https://hm-video-audio-bucket.s3-accelerate.amazonaws.com/pRNbRDG543qkrZr/Videos/agrawal.krush.che22%40itbhu.ac.in-subjVideo-1.mp4'
// // 'https://hm-video-audio-bucket.s3-accelerate.amazonaws.com/pRNbRDG543qkrZr/Videos/abhikdey.official%40gmail.com-subjVideo-1.mp4'
// // 'https://hm-video-audio-bucket.s3-accelerate.amazonaws.com/pRNbRDG543qkrZr/Videos/sangeeta.you%40gmail.com-subjVideo-1.mp4'
// // 'https://hm-video-audio-bucket.s3-accelerate.amazonaws.com/pRNbRDG543qkrZr/Videos/agrawal.krush.che22%40itbhu.ac.in-subjVideo-2.mp4'
// //  'https://hm-video-audio-bucket.s3-accelerate.amazonaws.com/pRNbRDG543qkrZr/Videos/yashussrao%40gmail.com-subjVideo-1.mp4'
// //  'https://hm-video-audio-bucket.s3-accelerate.amazonaws.com/pRNbRDG543qkrZr/Videos/sonibhaya999%40gmail.com-subjVideo-2.mp4'
// // 'https://hm-video-audio-bucket.s3-accelerate.amazonaws.com/pRNbRDG543qkrZr/Videos/sonibhaya999%40gmail.com-subjVideo-2.mp4';

// // Request parameters
// const data = {
//   audio: FILE_URL,  // You can also provide a local file path or a stream
// };

// // Function to handle transcription
// const speechToText = async (req, res) => {
//     console.log('req received speech')
//   try {
//     // Submit the transcription request
//     const transcript = await client.transcripts.transcribe(data);

//     // Output the transcription result
//     console.log(transcript.text);
//     return res.json({speech: transcript.text})
//   } catch (error) {
//     // Handle any errors
//     console.error('Error during transcription:', error.message);
//     return res.status(500).json({speech: transcript.text})
// }
// };

// router.post('/speech-to-text', speechToText)

// module.exports = router