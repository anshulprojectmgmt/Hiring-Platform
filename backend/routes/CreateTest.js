
const express = require("express");
const router = express.Router();
const HiringManager = require("../models/HiringManager");
const ShortUniqueId = require("short-unique-id");
const auth = require("../middleware/auth");
const subscription = require("../middleware/subscription");

// Protect this route: must be logged in and subscribed
router.post("/create-test", auth, subscription, async (req, res) => {
  const {
    name,
    email,
    password,
    type,
    language,
    difficulty,
    questions,
    duration,
  } = req.body;
  const { randomUUID } = new ShortUniqueId({ length: 15 });
  const testCode = randomUUID();
  let eId = await HiringManager.findOne({
    email: email,
  })
  ;
  if (eId === null) {
    try {
      HiringManager.create({
        hiring_manager: name,
        email: email,
        password: password,
        tests: [
          {
            type: type,
            language: language,
            difficulty: difficulty,
            questions: questions,
            duration: duration,
            testcode: testCode,
          },
        ],
      });
      res.status(200).json({ success: true, testcode: testCode });
    } catch (error) {
      console.log(error);
      res.status(400).json({ success: false, error: error });
    }
  } else {
    try {
    const upMangaer =   await HiringManager.findOneAndUpdate(
        { email: email },
        {
          $set: {
            hiring_manager: name,
            password: password, 
          },
          $push: {
            tests: {
              type: type,
              language: language,
              difficulty: difficulty,
              questions: questions,
              duration: duration,
              testcode: testCode,
            },
          },
        }
      );
     // console.log('updated Manager==' , upMangaer);
       res.status(200).json({ success: true, testcode: testCode });
    } catch (error) {
      res.send("Server Error", error.message);
    }
  }
});

router.post("/proctor-handler", async (req, res) => {
  const {testcode} = req.body;
  try {
    await HiringManager.updateOne(
      { "tests.testcode": testcode }, // Replace "your_testcode_value" with the actual testcode value
      { $set: { "tests.$.proctored": "Yes" } }
    );
    res.status(200).json({success:true});
  } catch (error) {
    // console.log(error);
    res.status(400).json({success: false});
  }
})

module.exports = router;
