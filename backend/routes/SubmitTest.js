const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
require("dotenv").config();
const Candidate = require('../models/Candidates');

const openai = new OpenAI({
  apiKey: process.env.CHATGPT_KEY,
});

const makeAPICall = async (object) => {
  try {

    const prompt = ` Q: ${object.question}
                    Python Code:
                    ${object.code}
    
                    Score:`;

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.4,
    max_tokens: 300,
    frequency_penalty: 0.0,
    });
    
    const string = chatCompletion.choices[0].message.content;
     
    const regex = /(\d+)(?:\.)?$/;
    // const regex = /(\d+)(?=\D*$)/;
    const match = regex.exec(string);
     
    if (match && match[1]) {
      const score = match[1];
      object.score = score;
    } else {
      object.score = 0;
      console.log('evluation error');
    }
    
    return object;
  } catch (error) {
    console.error("API call error:", error);
    // throw error;
  }
};

router.post("/submit-test", async (req, res) => {
  try {
    const screenshots = req.body?.screenshots;
    const Data = req.body.testData;
    const candidateEmail = req.body.candidateEmail;
    const testCode = req.body.testCode;
    const timetaken = req.body.timetaken;
    const tabswitch = req.body.tabswitch;
    const cam2 = req.body?.cam2;
    const verdict = req.body?.verdict ? JSON.parse(req.body?.verdict) : {};
    
     
    if(cam2 === 2) {
      const candidateCam2 = await Candidate.updateOne({email: candidateEmail, testcode: testCode},{
        $set: {
          cam2: cam2,
          cam2Time:req.body?.cam2Time 
        },
      });
      if (candidateCam2.acknowledged) {
        res.status(200).json({success:true, message: 'Cam2 submitted successfully'});
      } else {
        res.status(400).json({success:false, message: 'Cam2 not submitted'});
      }
    } else {

      const testData = Data.slice(1);
     
      // ***** use below filteredTestData & updatedTestData  ,when OPEN API UPDATED
      // const filteredTestData = await testData.filter(item => item.score === -1);
       
      // // if this line fails 
      // const updatedTestData = await Promise.all(filteredTestData?.map(makeAPICall)) || [];
    // *** undo when OPENAPI key AVAILABLE
      
    // emtpy  updatedTestData used until OPENAPI not AVAILABLE
    const updatedTestData = [];
      
     let combinedData;
      if(updatedTestData && updatedTestData.length> 0) {
         combinedData = testData.map(originalItem => {
          const updatedItem = updatedTestData.find(updatedItem => updatedItem.queNumber === originalItem.queNumber);
          if (updatedItem) {
            return {
              ...originalItem,
              score: updatedItem.score,
            };
          } else {
            return originalItem;
          }
        });
      } else {
        combinedData = testData.map((org) => {
          if(org.score=== -1) {
            return {...org, score: 0};
          } else {
            return org;
          }
        })
      }
      

      const candidate = await Candidate.updateOne({email: candidateEmail, testcode: testCode},{
        $set: {
          result: combinedData,
          timetaken: timetaken,
          tabswitch: tabswitch,
          verdict,
          screenshots
        },
      });

      

      if (candidate.acknowledged) {
        res.status(200).json({success:true, message: 'Test submitted successfully'});
      } else {
        res.status(400).json({success:false, message: 'Test not submitted'});
      }
    }
  } catch (error) {
    console.log('submit test error' , error);
    res.status(400).json({ success: false });
  }
});

router.post("/submit-mcqtest", async (req, res) => {
  const candidateEmail = req.body.candidateEmail;
  const data = req.body.testData;
    const testCode = req.body.testCode;
    const timetaken = req.body.timetaken;
    const tabswitch = req.body.tabswitch;
    const verdict = JSON.parse(req.body.verdict);
    
    const testData = data.slice(1);
   
  try {
    const candidate = await Candidate.updateOne({email: candidateEmail, testcode: testCode},{
      $set: {               
        result: testData,
        timetaken: timetaken,
        tabswitch: tabswitch,
        verdict,
      },
    });
    
    if (candidate.acknowledged) {
      res.status(200).json({success:true, message: 'Test submitted successfully'});
    } else {
      res.status(400).json({success:false, message: 'Test not submitted'});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error });
  }
})

router.post("/submit-subjectivetest" , async (req ,res) => {
let {testData,candidateEmail,testCode,timetaken,tabswitch,verdict} = req.body;
const data = testData.slice(1);

verdict = JSON.parse(req.body.verdict);
try {
  const candidate = await Candidate.updateOne({email:candidateEmail , testcode: testCode}, {
    $set: {               
      result: data,
      timetaken: timetaken,
      tabswitch: tabswitch,
      verdict,
    },
  })

  
  
    if (candidate.acknowledged) {
      res.status(200).json({success:true, message: 'Test submitted successfully'});
    } else {
      res.status(400).json({success:false, message: 'Test not submitted'});
    }  
} catch (error) {
  console.log(error);
  res.status(500).json({ success: false, message: error });
}  

})

module.exports = router;
