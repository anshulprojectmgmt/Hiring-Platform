import React, { useState, useCallback } from "react";
import "./auth.css";

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await onLogin(credentials);
    } catch (error) {
      setErrorMessage(
        error?.message || "Invalid username or password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="auth-card">
          <h1 className="auth-title">Sign In</h1>
          <p className="auth-subtitle">
            Secure your dashboard access
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <input
                name="username"
                type="text"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Username or Email"
                required
              />
            </div>

            <div className="form-group">
              <input
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>

            {errorMessage && (
              <div className="auth-error">{errorMessage}</div>
            )}

            <button
              type="submit"
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Login →"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <img 
          src={require("../../assests/login.png")} 
          alt="Login Illustration" 
          className="auth-image-full"
        />
      </div>
    </div>
  );
};

export default Login;