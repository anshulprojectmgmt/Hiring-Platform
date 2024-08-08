require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoDB = require("./mongodatabase");
const OpenAI = require("openai");
const Razorpay = require("razorpay");
const logger = require('./logger/Logger')

const { S3Client } = require("@aws-sdk/client-s3");
const {SQSClient} = require("@aws-sdk/client-sqs");
const AWS = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const multer = require('multer');


mongoDB();
app.use(cors());

app.use(express.json({ limit: '10mb' }));

app.use(express.urlencoded({limit :'10mb', extended: true}))

//app.use(logger);

const port = process.env.PORT || 5000;

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

// Create a Multer instance
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

// app.post('/api/upload', upload.single('file') , async (req, res) => {
//   console.log('req body==' , req.body);
//   console.log('req file==' , req.file);
//   const file = req.file;
//   const { testcode, filename, contentType } = req.body;
 

//   const outputPath = path.join(__dirname, 'uploads', `${Date.now()}_compressed.mp4`);
//   console.log('output path==' , outputPath);
//   try {
//     await compressVideo(file.path, outputPath);
//     const compressedFile = fs.readFileSync(outputPath);
// console.log('success compressed');
//     const params = {
//       Bucket: "hm-video-audio-bucket",
//       Key: `${testcode}/Videos/${filename}`,
//       Body: compressedFile,
//       ContentType: contentType,
//     };

//     s3.upload(params, (err, data) => {
//       if (err) {
//         console.log('upload error' , err);
//         return res.status(500).send(err);
//       }
//       res.status(200).send(data);
//     });
//   } catch (error) {
//     console.log('error upload==', error);
//     res.status(500).send(error);
//   }
// });

app.get("/", (req, res) => {
  res.send("hello world");
});


// const instance = new Razorpay({
//   key_id: process.env.RAZORPAY_API_KEY,
//   key_secret: process.env.RAZORPAY_API_SECRET,
// });

const sqsClient = new SQSClient({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  useAccelerateEndpoint: true,
});

module.exports = { s3Client, sqsClient};


app.use("/api", require("./routes/Queries"));
app.use("/api", require("./routes/Problems"));
app.use("/api", require("./routes/Evaluate"));
app.use("/api", require("./routes/CreateTest"));
app.use("/api", require("./routes/StartTest"));
app.use("/api", require("./routes/VideoUpload"));
app.use("/api", require("./routes/SubmitTest"));
app.use("/api", require("./routes/DashboardLogin"));
app.use("/api", require("./routes/GetCandidates"));
app.use("/api", require("./routes/Payment"));
app.use("/api", require("./routes/S3VideoUpload"));
app.use("/api", require("./routes/MediaProcess"));
app.use("/api", require("./routes/SQShandler"));

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});


