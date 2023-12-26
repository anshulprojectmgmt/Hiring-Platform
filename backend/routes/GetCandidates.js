const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidates");

router.post('/get-candidates', async (req,res) => {
    const candidates = await Candidate.find({testcode:req.body.code});
    res.status(200).send(candidates);
});

module.exports = router;