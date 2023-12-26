const express = require("express");
const router = express.Router();
const instance = require("../app.js");

router.post("/checkout", async (req, res) => {
  const options = {
    amount: 50000,
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  console.log(order);
  res.status(200).json({success:true});
});

module.exports = router;
