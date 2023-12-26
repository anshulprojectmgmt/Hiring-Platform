const express = require("express");
const router = express.Router();
const {sqsClient} = require("../app");
const {SendMessageCommand} = require("@aws-sdk/client-sqs");

const queueUrl = "https://sqs.ap-south-1.amazonaws.com/318015386100/video_audio_queue";

router.post("/sqs-sendmessage", async (req, res) => {
    const {message} = req.body;
    try {
        const command = new SendMessageCommand({
            MessageBody: message,
            QueueUrl: queueUrl
        });
        const result = await sqsClient.send(command);
        res.status(200).json({success:true});
        // console.log(result);
    } catch (error) {
        // console.log(error);
        res.status(400).json({success:false});
    }
})




module.exports = router;