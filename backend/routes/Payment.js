
const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");
const auth = require("../middleware/auth");

// Get subscription status for logged-in user
router.get("/payment/subscription-status", auth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    const now = new Date();
    let status = "inactive";
    let daysLeft = 0;
    if (user.isSubscribed && user.subscriptionEnd && new Date(user.subscriptionEnd) > now) {
      status = "active";
      daysLeft = Math.ceil((new Date(user.subscriptionEnd) - now) / (1000 * 60 * 60 * 24));
    } else if (user.subscriptionEnd && new Date(user.subscriptionEnd) <= now) {
      status = "expired";
    }
    res.json({ status, expiry: user.subscriptionEnd, daysLeft });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch subscription status" });
  }
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order for ₹1 (100 paise)
router.post("/payment/create-order", async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: 100, // ₹1 in paise
      currency: "INR",
    });
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify payment and activate subscription
router.post("/payment/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed!" });
    }

    // Activate subscription for 30 days
    const now = new Date();
    const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    //const expiry = new Date(now.getTime() + 10 * 1000);
    await User.findByIdAndUpdate(userId, {
      isSubscribed: true,
      subscriptionStart: now,
      subscriptionEnd: expiry,
    });

    // Optionally, save payment details in user or a separate collection

    res.status(200).json({ success: true, message: "Payment verified! Subscription activated.", expiry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
