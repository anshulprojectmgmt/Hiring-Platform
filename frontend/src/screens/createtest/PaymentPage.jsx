
import React from "react";
import { useNavigate } from "react-router-dom";
import RazorpayPayment from "../../screens/payment/RazorpayPayment";
import { checkSubscription } from "../../utility/subscription";

const PaymentPage = () => {
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem("user"));
	if (!user) {
		navigate("/login");
		return null;
	}
	const handleSuccess = () => {
		alert("Payment successful! Subscription activated.");
		// Force reload to refresh token/user state and subscription
		window.location.href = "/create";
	};
	return (
		<div style={{ padding: 40 }}>
			<h2>Subscribe for ₹1/month to access Create Test</h2>
			<RazorpayPayment
				userId={user.id}
				onSuccess={handleSuccess}
			/>
		</div>
	);
};

export default PaymentPage;
