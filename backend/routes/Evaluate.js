const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.CHATGPT_KEY,
});

router.post("/evaluate", async (req, res) => {
    // console.log(req.body.prompt)
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: req.body.prompt}],
      model: "gpt-4",
    });
    res.send(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.log("hello", error);
  }
});

module.exports = router;
