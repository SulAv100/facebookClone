"use client";
import { useAuth } from "@/Context/context";
import "../../styles/login.css";
import Link from "next/link";
import { useState } from "react";
export default function page() {
  const { userAuthentication } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const loginUser = (e)=>{
    e.preventDefault();
    userAuthentication(formData,'login');
  }

  return (
    <div className="outer-container">
      <div className="left-container">
        <h1>facebook</h1>
        <p>Facebook helps you connect and share with the people in your life</p>
      </div>
      <div className="right-container">
        <form onSubmit={loginUser}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address or phone number"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />

          <button className="login-btn" type="submit">
            Log in
          </button>
          <span>Forgotten Password?</span>
          <div className="border-line"></div>
          <Link href="/signup">
            <button className="signup-btn">Create new account</button>
          </Link>
        </form>
      </div>
    </div>
  );
}
