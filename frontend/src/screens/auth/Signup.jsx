import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

const getPasswordStrength = (password) => {
  if (!password) return "";
  if (password.length < 6) return "Weak";
  if (/(?=.*[A-Z])(?=.*\d)/.test(password)) return "Strong";
  return "Medium";
};

const Signup = ({ onSignup }) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(form.password);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[0-9]{10}$/.test(form.phone)) {
      setError("Phone number must be 10 digits");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await onSignup(form);
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      footer={
        <>
          Already have an account? <Link to="/login">Login</Link>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <input
            name="username"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            name="phone"
            type="tel"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          {passwordStrength && (
            <small className={`strength ${passwordStrength.toLowerCase()}`}>
              Strength: {passwordStrength}
            </small>
          )}
        </div>

        <div className="form-group">
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up →"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signup;