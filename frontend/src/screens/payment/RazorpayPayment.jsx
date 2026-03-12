import React, { useEffect } from "react";
import BASE_URL from "../../Api";

const RazorpayPayment = ({ userId, onSuccess }) => {
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const startPayment = async () => {
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      // 1. Create order from backend
      const res = await fetch(`${BASE_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const order = await res.json();
      if (!order.id) return alert("Failed to create order");
      // 2. Open Razorpay popup
      const options = {
        key: "rzp_test_SIO6ZozqfyEV97", // Updated to match backend
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: async function (response) {
          // 3. Verify payment
          const verifyRes = await fetch(`${BASE_URL}/api/payment/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              userId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            onSuccess && onSuccess(verifyData);
          } else {
            alert("Payment verification failed");
          }
        },
        theme: { color: "#3399cc" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    };
    startPayment();
    // eslint-disable-next-line
  }, []);
  return <div>Processing payment...</div>;
};

export default RazorpayPayment;
