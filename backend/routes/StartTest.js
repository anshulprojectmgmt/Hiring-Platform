const express = require("express");
const router = express.Router();
const HiringManager = require("../models/HiringManager");
const Candidate = require("../models/Candidates");
const mongoose = require("mongoose");

router.post("/start-test", async (req, res) => {
  const { name, email, phonenumber, testcode } = req.body;
  const isValidTest = await HiringManager.findOne(
    {
      tests: {
        $elemMatch: {
          testcode: testcode,
        },
      },
    },
    {
      _id: 0, 
      hiring_manager: 1,
      companyname: 1,
      email: 1,
      "tests.$": 1, 
    }
  );
  if (isValidTest === null) {
    // console.log("no test found");
    res.json({ success: false, message: "No test found" });
  } else {
    const existingCandidate = await Candidate.findOne({email, testcode});
    if(existingCandidate){
      return res.json({success:false, message:"you have already given the test"})
    }
    else{
      try {
        await Candidate.create({
          name: name,
          email: email,
          phonenumber: phonenumber,
          testcode: testcode,
        });
        // console.log(isValidTest);
        let userData = await Candidate.findOne({ email, testcode });
        // console.log(userData._id.valueOf());
        res.status(200).json({ success: true, info: isValidTest, candidateEmail: email, cid: userData._id.valueOf() });
      } catch (error) {
        console.log(error);
        res.json({ success: false, message: "something went wrong" });
      }
    }
    
  }
});

router.post("/validate-camera2-session", async (req,res) => {
  let _id = req.body.cid;

  try {
    const validCandidate = await Candidate.find({_id});
    if(validCandidate.length > 0){
      const updated = await Candidate.updateOne({_id: _id},{
        $set: {
          cam2: 1
        },
      });
      if (updated.acknowledged) {
        return res.json({success: true, candidateEmail: validCandidate[0].email, testCode: validCandidate[0].testcode});
      } else {
        return res.json({success: false, error: "Unable to start cam2 session"});
      }
    }
    else{
      return res.json({success: false, error: "invalid candidate"});
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: "server error" });
  }
})

router.post("/check-if-cam2-enabled", async (req,res) => {
  let _id = req.body.cid;

  try {
    // console.log(_id);
    const validCam2 = await Candidate.find({_id: new mongoose.Types.ObjectId(_id), cam2: 1});
    // console.log(validCam2);
    if(validCam2.length > 0){
      return res.json({success: true});
    }
    else{
      return res.json({success: false, error: "Cam2 not started"});
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: "server error" });
  }
})

module.exports = router;
