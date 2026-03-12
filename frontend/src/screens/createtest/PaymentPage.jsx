
import React from "react";
import { useNavigate } from "react-router-dom";
import RazorpayPayment from "../../screens/payment/RazorpayPayment";

const PaymentPage = () => {
	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem("user"));
	if (!user) {
		navigate("/login");
		return null;
	}
	return (
		<div style={{ padding: 40 }}>
			<h2>Subscribe for ₹1/month to access Create Test</h2>
			<RazorpayPayment
				userId={user.id}
				onSuccess={() => {
					alert("Payment successful! Subscription activated.");
					navigate("/create");
				}}
			/>
		</div>
	);
};

export default PaymentPage;
