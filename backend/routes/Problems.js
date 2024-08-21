const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const idsArray = [
  new ObjectId('660895a1338be786d245c032'),
  new ObjectId('66089589338be786d245c01a'),
  new ObjectId('660895a1338be786d245c033'),
  
  // Add more ObjectId instances as needed
  
];
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
           
          problems = await mongoose.connection
          .collection("pythoneasy")
          .aggregate([
            { $match: { _id: { $in: idsArray } } },
            {
              $lookup: {
                from: 'wrapper_map',
                localField: 'input_type',
                foreignField: 'title',
                as: 'wrapper_details'
              }
            }
          ])
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
