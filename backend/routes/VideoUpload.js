const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Store uploaded videos in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Add a timestamp to the filename
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("video"), (req, res) => {
    // console.log(req.file);
  if (!req.file) {
    console.log("not upload")
    return res.status(400).send("No video file uploaded.");
  }
  console.log('video uploaded');
  return res.status(200).send("Video uploaded successfully.");
});

module.exports = router;
