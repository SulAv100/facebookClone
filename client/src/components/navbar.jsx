"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import "../styles/navbar.css";
import { useAuth } from "@/Context/context";
import { useRouter } from "next/navigation";
import {
  FaHome,
  FaUserFriends,
  FaCog,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = () => {
  const { isValidUser, userId } = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_API;
  const router = useRouter();

  useEffect(() => {
    isValidUser();
  }, []);

  const logoutUser = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/logoutUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

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
            <Link href={`/home/${userId}`} className="nav-link">
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
            <button onClick={logoutUser} className="logout-btn">
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
