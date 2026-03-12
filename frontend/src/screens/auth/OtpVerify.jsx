import React, { useState } from "react";
import { verifyOtp } from "./api";

const OtpVerify = ({ email, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyOtp({ email, otp });
      onVerified();
    } catch (err) {
      setError(
        err?.response?.data?.error || "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-background">
      <div className="auth-card">
        <h2 className="auth-title">Verify Email</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
            style={{ textAlign: "center", letterSpacing: "6px", fontSize: "20px" }}
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerify;
