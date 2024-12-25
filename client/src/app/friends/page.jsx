"use client";
import React, { useEffect, useState } from "react";
import "../../styles/friends.css";
import { useAuth } from "@/Context/context";
import { io } from "socket.io-client";

const UserList = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API;
  const { isValidUser, userId } = useAuth();
  const [usersData, setUsersData] = useState({
    allUsers: [],
    requestUser: [],
    recievedReq: [],
  });
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
        recievedReq: [],
        requestUser: [],
      });
    });

    // request recieve garteko data

    socketInstance.on("requestAayo", ({ filterWhoSend }) => {
      console.log("Talai bharkhar yesle request pathayuo hai", filterWhoSend);

      if (Array.isArray(filterWhoSend) && filterWhoSend.length > 0) {
        setUsersData((prevState) => ({
          ...prevState,
          allUsers: prevState.allUsers.filter(
            (user) => user._id !== filterWhoSend[0]._id
          ),
          recievedReq: prevState.allUsers.filter(
            (user) => user._id === filterWhoSend[0]._id
          ),
          requestUser: prevState.requestUser || [],
        }));
      }
    });

    socketInstance.on("tailePathako", ({ pathakoFilter }) => {
      console.log("Taile pathako request haru yeha xa  hai", pathakoFilter);
      const pathakoIdharu = pathakoFilter.map((user) => user._id);
      if (Array.isArray(pathakoFilter) && pathakoFilter.length > 0) {
        setUsersData((prevState) => ({
          allUsers: prevState.allUsers.filter(
            (user) => !pathakoIdharu.includes(user._id)
          ),
          recievedReq: prevState.recievedReq || [],
          requestUser: [...pathakoFilter],
        }));
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (userId && socket) {
      socket.emit("register", { userId });
      socket.emit("getUserList", { userId });
      setTimeout(() => {
        socket.emit("requestHaru", { userId });
      }, 10);
      socket.emit("sendHanekoRequest", { userId });
    }
  }, [userId, socket]);

  const getTwoLetter = (name) => {
    if (!name) return "";
    const seperatedName = name.split("");
    const joinName = seperatedName.slice(0, 2).join("");
    return joinName;
  };

  const sendRequest = (to) => {
    socket.emit("sendRequest", { from: userId, to: to });
    console.log(`${userId} sent request to ${to}`);

    setUsersData((prevState) => {
      const targetUser = prevState.allUsers.filter((user) => user._id === to);

      if (!targetUser) {
        return prevState;
      }

      return {
        allUsers: prevState.allUsers.filter((user) => user._id !== to),
        recievedReq: prevState.recievedReq,
        requestUser: [...prevState.requestUser, ...targetUser],
      };
    });
  };

  useEffect(() => {
    console.log(usersData);
  }, [usersData]);

  const acceptRequest = (id) => {
    console.log("Accepted hane hai ta kta hio");
  };

  const cancelRequest = (id) => {
    console.log("Cancelling the requst of id", id);
  };

  const buttonClasses = {
    "Send Request": "btn-send-request",
    "Accept Request": "btn-acc-request",
    "Cancel Request": "btn-cancel-request",
  };

  useEffect(() => {
    console.log(usersData);
  }, [usersData]);

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
      {usersData.recievedReq?.length > 0 &&
        usersData.recievedReq.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onAction={acceptRequest}
            buttonText="Accept Request"
            onClick={() => acceptRequest(user._id)}
          />
        ))}

      {usersData.allUsers?.length > 0 &&
        usersData.allUsers.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            onAction={sendRequest}
            buttonText="Send Request"
            onClick={() => sendRequest(user._id)}
          />
        ))}

      {usersData.requestUser?.length > 0 &&
        usersData.requestUser.map((user) => (
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
