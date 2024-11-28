const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidates");

router.post('/get-candidates', async (req,res) => {
    const candidates = await Candidate.find({testcode:req.body.code});
    res.status(200).send(candidates);
});

router.post("/update-candidate" , async (req,res) => {
    const {email, code , data} = req.body;
    try {
      const updateResult = await Candidate.updateOne({email: email, testcode: code},{
        $set: {
          ...data
        },
      });
      
      res.status(200).json({ success: true,message:"uploaded" }); 
    } catch (error) {
      console.log('failed to updated candidate' ,error);
      res.status(500).json({ success: false,message:"failed to updated candidate" }); 
    }
  
  })

module.exports = router;