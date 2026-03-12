import React from "react";
import "./ProfilePopup.css";

const ProfilePopup = ({ user, onLogout }) => {
  if (!user) return null;
  let subMsg = '';
  if (user.isSubscribed && user.subscriptionEnd && new Date(user.subscriptionEnd) > new Date()) {
    const daysLeft = Math.ceil((new Date(user.subscriptionEnd) - new Date()) / (1000 * 60 * 60 * 24));
    subMsg = ` | Subscription: ${daysLeft} day${daysLeft === 1 ? '' : 's'} left`;
  } else if (user.subscriptionEnd) {
    subMsg = ' | Subscription expired';
  }
  return (
    <div className="profile-popup">
      <span className="profile-user">
        <span className="profile-icon">👤</span>
        <span className="profile-username">{user.username || user.email}</span>
        <span className="profile-submsg">{subMsg}</span>
      </span>
      <button className="profile-logout-btn" onClick={onLogout}>Logout</button>
    </div>
  );
};

export default ProfilePopup;
