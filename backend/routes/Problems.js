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
          case "easy":
            problems = await mongoose.connection
              .collection("pythoneasy")
              .aggregate([{$sample: {size: questions}}])
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
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false });
  }
});

module.exports = router;
