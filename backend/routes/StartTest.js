const express = require("express");
const router = express.Router();
const HiringManager = require("../models/HiringManager");
const Candidate = require("../models/Candidates");

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
      //   console.log(isValidTest);
        res.status(200).json({ success: true, info: isValidTest, candidateEmail: email });
      } catch (error) {
        console.log(error);
        res.json({ success: false, message: "something went wrong" });
      }
    }
    
  }
});

module.exports = router;
