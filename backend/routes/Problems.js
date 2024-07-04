const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/questions", async (req, res) => {
  const { testtype, language, difficulty, questions } = req.body;
  try {
    if (testtype === "coding") {
      if (language === "Python") {
        var problems;
        switch (difficulty) {
          // logic to attach wrapper
          // code to each problem need to implement here
          case "easy":
            console.log('easy case matched===')
            problems = await mongoose.connection
              .collection("pythoneasy")
              .aggregate([{$sample: {size: questions} }, {  $lookup: {
                from: 'wrapper_map',         // The collection to join with
                localField: 'input_type',    // The field from the questions to match
                foreignField: 'title',       // The field from wrapper_map to match
                as: 'wrapper_details'        // The field to add with joined documents
              }}   ])
              .toArray();
            break;
          case "medium":
            problems = await mongoose.connection
              .collection("pythonmedium")
              .aggregate([{$sample: {size: questions}}])
              .toArray();
            break;
          case "hard":
            problems = await mongoose.connection
              .collection("pythonhard")
              .aggregate([{$sample: {size: questions}}])
              .toArray();
            break;
          default:
            console.log('easy case matched===')
            problems = await mongoose.connection
              .collection("pythoneasy")
              .aggregate([{$sample: {size: questions}}])
              .toArray();
            break;
        }
        res.json({ success: true, que: problems });
      } else {
        res.json({ que: "no sql questions" });
      }
    } else if (testtype === "mcq") {
      var problems = await mongoose.connection
        .collection("mcqeasy")
        .find({})
        .limit(questions)
        .toArray();
      res.json({ success: true, que: problems });
    }else{
      res.json({ success: false, message: 'no test type matched', testtype });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

module.exports = router;
