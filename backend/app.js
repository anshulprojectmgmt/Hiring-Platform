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


mongoDB();
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({limit :'10mb', extended: true}))

app.use(logger);

const port = process.env.PORT || 5000;

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


