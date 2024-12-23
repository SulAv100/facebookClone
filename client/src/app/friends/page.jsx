"use client";
import React, { useEffect, useState } from "react";

import "../../styles/friends.css";
import { useAuth } from "@/Context/context";

const UserList = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API;
  const { isValidUser, userId } = useAuth();
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    isValidUser();
  }, []);

  const getUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/getUsers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
      setAllUsers()
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(allUsers);
  }, [allUsers]);

  useEffect(() => {
    if (userId) {
      getUsers();
    }
  }, [userId]);

  const getTwoLetter = (name) => {
    const seperatedName = name.split("");
    const joinName = seperatedName.slice(0, 2).join("");
    return joinName;
  };

  const sendRequest = async (to) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/sendRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: userId, to: to }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(response.statusText);
        return;
      }

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="user-list">
      {allUsers?.map((user, index) => {
        let newName = getTwoLetter(user.firstName);
        return (
          <div className="user-card" key={user._id}>
            <span className="two-letter">{newName}</span>
            <div className="user-info">
              <div className="user-name">{`${user.firstName} ${user.lastName}`}</div>
            </div>
            <div className="user-actions">
              <button className="btn-view-profile">View Profile</button>
              <button
                onClick={() => sendRequest(user._id)}
                className="btn-send-request"
              >
                Send Request
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserList;
