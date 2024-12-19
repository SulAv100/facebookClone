"use client";
import { useAuth } from "@/Context/context";
import "../../styles/signup.css";
import { useState } from "react";

export default function Signup() {
  const { userAuthentication } = useAuth();

  const [selectedGender, setSelectedGender] = useState("");

  const handleGenderChange = (event) => {
    const value = event.target.value;
    setSelectedGender(value);

    setFormData((prevState) => ({
      ...prevState,
      gender: value,
    }));
  };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    date: "",
    gender: selectedGender,
  });

  const handleChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const signupUser = async (e) => {
    e.preventDefault();
    userAuthentication(formData, "signup");
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>Sign Up</h1>
        <p>It’s quick and easy.</p>
        <form onSubmit={signupUser}>
          <div className="name-fields">
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email address"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="New password"
            onChange={handleChange}
          />
          <div className="birthdate">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div className="gender">
            <label>Gender</label>
            <div className="gender-options">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={selectedGender === "female"}
                  onChange={handleGenderChange}
                />
                Female
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={selectedGender === "male"}
                  onChange={handleGenderChange}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={selectedGender === "other"}
                  onChange={handleGenderChange}
                />
                Other
              </label>
            </div>
          </div>
          <button className="signup-btn" type="submit">
            Sign Up
          </button>
        </form>
        <p className="terms">
          By clicking Sign Up, you agree to our <span>Terms</span>,{" "}
          <span>Privacy Policy</span>, and <span>Cookies Policy</span>.
        </p>
      </div>
    </div>
  );
}
