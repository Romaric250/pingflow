import React from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { FiUser } from "react-icons/fi"; //Example user icon, replace with your own

const NavigationBar = ({ username, userPhoto }) => {
  return (
    <div className="nav__wrapper">
      <nav className="navigation-bar">
        <div className="logo">Your Logo</div>
        <div className="user-profile">
          <span className="username">{username}</span>
          <img className="user-photo" src={userPhoto} alt="User" />
        </div>
      </nav>
    </div>
  );
};

export default NavigationBar;
