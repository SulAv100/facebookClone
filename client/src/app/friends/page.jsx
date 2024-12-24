"use client";
import React, { useEffect, useState } from "react";
import "../../styles/friends.css";
import { useAuth } from "@/Context/context";
import { io } from "socket.io-client";

const UserList = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API;
  const { isValidUser, userId } = useAuth();
  const [usersData, setUsersData] = useState({ allUsers: [], requestUser: [] });
  const [recievedReq, setRecievedReq] = useState([]);
  const [socket, setSocket] = useState();

  useEffect(() => {
    isValidUser();
  }, []);

  useEffect(() => {
    const socketInstance = io("http://localhost:5173", {
      transports: ["websocket"],
    });

    setSocket(socketInstance);

    // aafu vaytek aaru user haru tanne
    socketInstance.on("aaruUser", ({ aafuBayekUser }) => {
      console.log("Aaru user haru yei ho hai ta", aafuBayekUser);
      setUsersData({
        allUsers: aafuBayekUser,
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (userId && socket) {
      socket.emit("register", { userId });
      socket.emit("getUserList", { userId });
      // socket.emit("getRequestSentList", { userId });
    }
  }, [userId, socket]);

  const getTwoLetter = (name) => {
    const seperatedName = name.split("");
    const joinName = seperatedName.slice(0, 2).join("");
    return joinName;
  };

  const sendRequest = (to) => {
    socket.emit("sendRequest", { from: userId, to: to });
    console.log(`${userId} sent request to ${to}`);
  };

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
      {/* {recievedReq?.map((user, index) => (
        <UserCard
          key={index}
          user={user}
          onAction={acceptRequest}
          buttonText="Accept Request"
          onClick={() => acceptRequest(user._id)}
        />
      ))} */}

      {usersData.allUsers.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          onAction={sendRequest}
          buttonText="Send Request"
          onClick={() => sendRequest(user._id)}
        />
      ))}

      {/* {usersData.requestUser.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          onAction={cancelRequest}
          buttonText="Cancel Request"
          onClick={() => cancelRequest(user._id)}
        />
      ))} */}
    </div>
  );
};

export default UserList;
