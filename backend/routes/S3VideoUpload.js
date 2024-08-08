const express = require("express");
const router = express.Router();
const AWS = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { GetObjectCommand, PutObjectCommand, CreateMultipartUploadCommand, UploadPartCommand,CompleteMultipartUploadCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require("../app");
require("dotenv").config();
const Candidate = require('../models/Candidates');

// Set up Multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Specify the upload directory (where files will be saved)
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     // Customize the filename (e.g., timestamp + original name)
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// // Create a Multer instance
// const upload = multer({ storage });

// AWS.config.update({
//   accessKeyId: process.env.ACCESS_KEY_ID,
//   secretAccessKey: process.env.SECRET_ACCESS_KEY,
//   region: 'ap-south-1',
// });

// const s3 = new AWS.S3();


// const compressVideo = (inputPath, outputPath) => {
//   return new Promise((resolve, reject) => {
//     ffmpeg(inputPath)
//       .output(outputPath)
//       .videoCodec('libx264')
//       .size('640x?')
//       .on('end', () => resolve())
//       .on('error', (err) => reject(err))
//       .run();
//   });
// };

// router.post('/upload', upload.single('file') , async (req, res) => {
//   console.log('req body==' , req.body);
//   console.log('req file==' , req.file);
//   const file = req.file;
//   const { testcode, filename, contentType } = req.body;
 

//   const outputPath = path.join(__dirname, 'uploads', `${Date.now()}_compressed.mp4`);

//   try {
//     await compressVideo(file.path, outputPath);
//     const compressedFile = fs.readFileSync(outputPath);

//     const params = {
//       Bucket: "hm-video-audio-bucket",
//       Key: `${testcode}/Videos/${filename}`,
//       Body: compressedFile,
//       ContentType: contentType,
//     };

//     s3.upload(params, (err, data) => {
//       if (err) {
//         return res.status(500).send(err);
//       }
//       res.status(200).send(data);
//     });
//   } catch (error) {
//     res.status(500).send(error);
//   } finally {
//     fs.unlinkSync(file.path);
//     fs.unlinkSync(outputPath);
//   }
// });

router.post("/upload-screenshots" , async (req,res) => {
  const {email, code , screenshots} = req.body;
  try {
    const updateResult = await Candidate.updateOne({email: email, testcode: code},{
      $set: {
        screenshots: screenshots
      },
    });
    
    res.status(200).json({ success: true,message:"uploaded" }); 
  } catch (error) {
    console.log('screenshot upl err' ,error);
    res.status(500).json({ success: false,message:"failed to upload" }); 
  }

})

router.post("/s3upload", async (req, res) => {
  const { filename, contentType, testcode } = req.body;
  let command;
  if (contentType === "audio/webm") {
    command = new PutObjectCommand({
      Bucket: "hm-video-audio-bucket",
      Key: `${testcode}/Audio/${filename}`,
      ContentType: contentType,
    });
  } else if (contentType === "video/mp4") {
    command = new PutObjectCommand({
      Bucket: "hm-video-audio-bucket",
      Key: `${testcode}/Videos/${filename}`,
      ContentType: contentType,
    });
  }
  else if (contentType === "image/jpeg") {
    command = new PutObjectCommand({
      Bucket: "hm-video-audio-bucket",
      Key: `${testcode}/images/${filename}`,
      ContentType: contentType,
      // ContentEncoding: 'base64',
    });
  } else{
    res.status(200).json({ success: false,message:"No format matched" });  
  }
  const url = await getSignedUrl(s3Client, command);
  res.status(200).json({ success: true, url: url });
});


router.post("/transcriptions", async (req, res) => {
    const {bucketName} = req.body;
    const params = {
        Bucket: "hm-video-audio-bucket",
        Key: `${bucketName}/transcriptions/`,
        Body: " ", // Empty string as the content
      };
      try {
        const result = await s3Client.send(new PutObjectCommand(params));
        res.json({success:true})
      } catch (err) {
        // console.error("Error creating folder:", err);
        console.log("in transcription")
        res.json({success:false})
      }
});

router.post('/start-upload', async (req, res) => {
  const {fileName, fileType, testcode} = req.body;
  try {
    const params = {
      Bucket: "hm-video-audio-bucket",
      // Key: `${testcode}/Videos/${fileName}`,
      Key: fileName,
      ContentType: fileType,
    };
    const command = new CreateMultipartUploadCommand(params);
    const uploadData = await s3Client.send(command);

    res.send({ uploadId: uploadData.UploadId });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post('/get-upload-url', async (req, res) => {
  const {fileName, partNumber, uploadId, testcode} = req.body;
  try {
    const params = {
      Bucket: "hm-video-audio-bucket",
      // Key: `${testcode}/Videos/${fileName}`,
      Key: fileName,
      PartNumber: partNumber,
      UploadId: uploadId,
    };
    const command = new UploadPartCommand(params);
    const presignedUrl = await getSignedUrl(s3Client, command);
    res.status(200).json({  url: presignedUrl });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.post('/complete-upload', async (req, res) => {
  const {fileName, parts, uploadId, testcode} = req.body;
  try {
    const params = {
      Bucket: "hm-video-audio-bucket",
      // Key: `${testcode}/Videos/${fileName}`,
      Key: fileName,
      MultipartUpload: {
        Parts: parts,
      },
      UploadId: uploadId,
    };
    const command = new CompleteMultipartUploadCommand(params);
    const response = await s3Client.send(command);
    res.send({ data });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

module.exports = router;
