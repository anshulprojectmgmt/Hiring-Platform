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
  let face = req.body?.cam2Face || null;

  try {
    const validCandidate = await Candidate.find({_id});
    if(validCandidate.length > 0){
      const updated = await Candidate.updateOne({_id: _id},{
        $set: {
          cam2: 1,
          cam2Face: face,
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

{/** update logic to handle case when ,
    user started cam2 and submited it before moving to next slide of instruction screen
  */}

  try {
    const validCam2 = await Candidate.find({_id: new mongoose.Types.ObjectId(_id)});
    if(validCam2.length > 0){
      return res.json({success: true, cam2status: validCam2[0].cam2, cam2Face: validCam2[0].cam2Face});
    }
    else{
      return res.json({success: false, error: "Cam2 not started"});
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: "server error" });
  }
})

router.post("/cam2-validation", async (req,res) => {
  let _id = req.body.cid;
  let param = req.body.param;

  let field = null
  if(param == "face") field = "face";
  else if(param == "hands") field = "hands";
  else if(param == "keyboard") field = "keyboard";
  else if(param == "exitfullscreen") field = "exitfullscreen";

  try {
    const validCandidate = await Candidate.find({_id});
    if(validCandidate.length > 0 && field !== null){
      const updated = await Candidate.updateOne({_id: _id},{
        $set: {
          [field]: 1
        },
      });
      console.log(updated);
      if (updated.acknowledged) {
        return res.json({success: true});
      } else {
        return res.json({success: false, error: "Db error"});
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

router.get("/candidate-detail/:cId", async (req,res) => {
   const {cId} = req.params;
  // console.log('received id==', cId);
  try {
    const existingCandidate = await Candidate.findOne({_id: cId});
   
    if(!existingCandidate) {
     return res.json({success: 'false', message: "no user found"})
    } else{
    
      // console.log('found user==' ,existingCandidate);
      // console.log('test code===', existingCandidate.testcode)
     const isValidTest = await HiringManager.findOne(
       {
         tests: {
           $elemMatch: {
             testcode: existingCandidate.testcode,
           },
         },
       },
       {
         _id: 1, 
         hiring_manager: 1,
         companyname: 1,
         email: 1,
         "tests.$": 1, 
       }
     );

     const userDetail = {
      user: existingCandidate,
      testInfo : isValidTest.tests[0]
     }
     
    return res.json({success: true, userDetail});
    }
    
  } catch (error) {
     return res.json({success: false, message: 'server error' , error});
  }
   

})

module.exports = router;


// router.post("/validate-camera2-session", async (req,res) => {
//   let _id = req.body.cid;
//   const {value ,url} = req.body;
//   // let cam2ImgUrl = req.body.cam2ImgUrl;
//   let cam1ImgUrl = req.body.cam1ImgUrl;
//   // console.log('img 1 = ' , cam1ImgUrl);
//   // console.log('img 2 = ' , cam2ImgUrl.length);
//   const param = value==1 ? 'cam2Face' : 'cam2SideView';
//   try {
//     const validCandidate = await Candidate.find({_id});
//     if(validCandidate.length > 0){
//       let updated;
//       if(cam1ImgUrl){
//         updated = await Candidate.updateOne({_id: _id},{
//           $set: {
//            cam1Img: cam1ImgUrl,
//           },
//         });
//       } 
//       else{
//         updated = await Candidate.updateOne({_id: _id},{
//           $set: {
//             cam2: 1,
//             [param]: url,
//           },
//         });
//       }
      
//       if (updated.acknowledged) {
//         return res.json({success: true, candidateEmail: validCandidate[0].email, testCode: validCandidate[0].testcode});
//       } else {
//         return res.json({success: false, error: "Unable to start cam2 session"});
//       }
//     }
//     else{
//       return res.json({success: false, error: "invalid candidate"});
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, error: "server error" });
//   }
// })