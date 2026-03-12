import React from "react";
import "./auth.css";

const AuthLayout = ({ title, children, footer }) => {
  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="auth-card">
          <h2 className="auth-title">{title}</h2>
          {children}
          {footer && <div className="auth-footer">{footer}</div>}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <img 
          src={require("../../assests/signup.png")} 
          alt="Signup Illustration" 
          className="auth-image-full"
        />
      </div>
    </div>
  );
};

export default AuthLayout;