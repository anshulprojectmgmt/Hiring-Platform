const express = require("express");
const router = express.Router();
const HiringManager = require("../models/HiringManager");

router.post("/login-dashboard", async (req, res) => {
  // console.log(req.body)
  let {email,password} = req.body;
  try {
    let userData = await HiringManager.findOne({ email });
    if (!userData) {
      // console.log('id not')
      return res.json({success:false, error: "This email id is not registered yet" });
    }
    const pwdCompare = password === userData.password;
    if (!pwdCompare) {
      // console.log('p wrong')
      return res.json({success:false, error: "Password is incorrect" });
    }
    const {hiring_manager, tests, _id} = userData;
    // console.log(tests);
    // const payload = {
    //   id: userData._id,
    // };
    // const authToken = jwt.sign(payload, secretKey);
    res.json({ success: true, hrname:hiring_manager, tests:tests, hrid:_id, email: email});
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: "server error" });
  }
});

router.post("/get-dashboard-data", async (req,res) => {
  let email = req.body;
  try {
    let userData = await HiringManager.findOne(email);
    const {hiring_manager, tests, _id} = userData;
    res.json({ success: true, hrname:hiring_manager, tests:tests, hrid:_id});
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: "server error" });
  }
})

module.exports = router;
