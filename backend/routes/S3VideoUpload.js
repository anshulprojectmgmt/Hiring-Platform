const express = require("express");
const router = express.Router();
const AWS = require('aws-sdk');

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { GetObjectCommand, PutObjectCommand, CreateMultipartUploadCommand, UploadPartCommand,CompleteMultipartUploadCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { s3Client } = require("../app");
require("dotenv").config();
const Candidate = require('../models/Candidates');



router.post("/upload-screenshots" , async (req,res) => {
  const {email, code , screenshots} = req.body;
  try {
    const updateResult = await Candidate.updateOne({email: email, testcode: code},{
      $set: {
        cam2Screenshots: screenshots
      },
    });
    
    res.status(200).json({ success: true,message:"uploaded" }); 
  } catch (error) {
    console.log('screenshot upl err' ,error);
    res.status(500).json({ success: false,message:"failed to upload" }); 
  }

})

router.post("/s3upload", async (req, res) => {
  const { filename, contentType, testcode,record='video' } = req.body;
  let command;
  if (contentType === "audio/webm") {
    command = new PutObjectCommand({
      Bucket: "hm-video-audio-bucket",
      Key: `${testcode}/Audio/${filename}`,
      ContentType: contentType,
    });
  } else if (contentType === "video/mp4" && record==='video') {
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
  }
  else if (contentType === "video/mp4" && record==='screen') {
    command = new PutObjectCommand({
      Bucket: "hm-video-audio-bucket",
      Key: `${testcode}/screen/${filename}`,
      ContentType: contentType,
    });
  }
  else{
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
