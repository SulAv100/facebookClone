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
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data);
      const usersProfile = data.totalUsers.filter((item) => item._id !== userId);
      setAllUsers(usersProfile);
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
  const users = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      image: "https://picsum.photos/1900/1200?random=1",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      image: "https://picsum.photos/1900/1200?random=2",
    },
    {
      id: 3,
      firstName: "Alice",
      lastName: "Johnson",
      image: "https://picsum.photos/1900/1200?random=4",
    },
  ];

  return (
    <div className="user-list">
      {users.map((user) => (
        <div className="user-card" key={user.id}>
          <img
            className="profile-pic"
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
          />
          <div className="user-info">
            <div className="user-name">{`${user.firstName} ${user.lastName}`}</div>
          </div>
          <div className="user-actions">
            <button className="btn-view-profile">View Profile</button>
            <button className="btn-send-request">Send Request</button>
          </div>{" "}
        </div>
      ))}
    </div>
  );
};

export default UserList;
