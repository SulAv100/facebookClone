"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import "../styles/navbar.css";
import { useAuth } from "@/Context/context";
import { FaHome, FaUserFriends, FaCog, FaUsers, FaSignOutAlt } from "react-icons/fa"; 

const Navbar = () => {
  const { isValidUser, userId } = useAuth();

  useEffect(() => {
    isValidUser();
  }, []);

  return (
    <>
      {userId ? (
        <div className="navbar">

          <div className="navbar-left">
            <div className="logo">
              <i className="fab fa-facebook"></i> facebook
            </div>
          </div>

          <div className="navbar-middle">
            <Link href="/" className="nav-link">
              <FaHome size={29} />
            </Link>
            <Link href="/friends" className="nav-link">
              <FaUserFriends size={29} />
            </Link>
            <Link href="/settings" className="nav-link">
              <FaCog size={29} />
            </Link>
            <Link href="/groups" className="nav-link">
              <FaUsers size={29} />
            </Link>
          </div>

          <div className="navbar-right">
            <button className="logout-btn">
              <FaSignOutAlt size={30} />
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Navbar;
