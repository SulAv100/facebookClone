"use client";
import React, { useEffect, useState } from "react";
import "../../styles/friends.css";
import { useAuth } from "@/Context/context";

const UserList = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API;
  const { isValidUser, userId } = useAuth();
  const [usersData, setUsersData] = useState({ allUsers: [], requestUser: [] });
  const [recievedReq, setRecievedReq] = useState([]);

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
      setUsersData({
        allUsers: data.finalList,
        requestUser: data.finalRequestList,
      });
    } catch (error) {
      console.error(error);
    }
  };

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
      setUsersData((prevState) => ({
        ...prevState,
        allUsers: prevState.allUsers.filter((user) => user._id !== to),
        requestUser: [
          ...prevState.requestUser,
          prevState.allUsers.find((user) => user._id === to),
        ],
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const cancelRequest = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/auth/cancelRequest`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: id }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }

      setUsersData((prevState) => ({
        ...prevState,
        allUsers: [
          ...prevState.allUsers,
          prevState.requestUser.find((user) => user._id === id),
        ],
        requestUser: prevState.requestUser.filter((user) => user._id !== id),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const getFriendRequest = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/getFriends`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(response.statusText);
        return;
      }
      console.log(data[0]);
      setRecievedReq(data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getFriendRequest();
    }
  }, [userId]);

  const acceptRequest = async (id) => {
    console.log("Yo id ko request accept hande", id);
  };

  useEffect(() => {
    console.log("Yo  ho hai ta payeko ta", recievedReq);
  }, [recievedReq]);

  const buttonClasses = {
    "Send Request": "btn-send-request",
    "Accept Request": "btn-acc-request",
    "Cancel Request": "btn-cancel-request",
  };

  const UserCard = ({ user, onAction, buttonText, onClick }) => {
    const newName = getTwoLetter(user.firstName);
    return (
      <>
        <div className="user-card" key={user._id}>
          <span className="two-letter">{newName}</span>
          <div className="user-info">
            <div className="user-name">{`${user.firstName} ${user.lastName}`}</div>
          </div>
          <div className="user-actions">
            <button className="btn-view-profile">View Profile</button>
            <button
              onClick={onClick}
              className={buttonClasses[buttonText] || "btn-default"}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="user-list">
      {recievedReq?.map((user, index) => (
        <UserCard
          key={index}
          user={user}
          onAction={acceptRequest}
          buttonText="Accept Request"
          onClick={() => acceptRequest(user._id)}
        />
      ))}

      {usersData.allUsers.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          onAction={sendRequest}
          buttonText="Send Request"
          onClick={() => sendRequest(user._id)}
        />
      ))}

      {usersData.requestUser.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          onAction={cancelRequest}
          buttonText="Cancel Request"
          onClick={() => cancelRequest(user._id)}
        />
      ))}
    </div>
  );
};

export default UserList;
