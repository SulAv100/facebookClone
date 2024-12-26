"use client";
import React, { useEffect, useState, useRef } from "react";
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
  const socketRef = useRef();

  useEffect(() => {
    isValidUser();
  }, []);

  useEffect(() => {
    const socketInstance = io("http://localhost:5173", {
      transports: ["websocket"],
    });

    socketRef.current = socketInstance;

    socketInstance.on("aaruUser", ({ aafuBayekUser }) => {
      setUsersData((prevState) => ({
        ...prevState,
        allUsers: aafuBayekUser,
        recievedReq: [],
        requestUser: [],
      }));
    });

    socketInstance.on("requestAayo", ({ filterWhoSend }) => {
      if (Array.isArray(filterWhoSend) && filterWhoSend.length > 0) {
        setUsersData((prevState) => {
          const updatedUsers = prevState.allUsers.filter(
            (user) => user._id !== filterWhoSend[0]._id
          );
          const updatedRecievedReq = prevState.allUsers.filter(
            (user) => user._id === filterWhoSend[0]._id
          );
          return {
            ...prevState,
            allUsers: updatedUsers,
            recievedReq: updatedRecievedReq,
          };
        });
      }
    });

    socketInstance.on("tailePathako", ({ pathakoFilter }) => {
      if (Array.isArray(pathakoFilter) && pathakoFilter.length > 0) {
        setUsersData((prevState) => {
          const pathakoIdharu = pathakoFilter.map((user) => user._id);
          const updatedUsers = prevState.allUsers.filter(
            (user) => !pathakoIdharu.includes(user._id)
          );
          return {
            ...prevState,
            allUsers: updatedUsers,
            requestUser: pathakoFilter,
          };
        });
      }
    });

    socketInstance.on("cancelHanyo", ({ filterHaneko }) => {
      setUsersData((prevState) => {
        const updatedUsers = [...prevState.allUsers, ...filterHaneko];
        return {
          ...prevState,
          allUsers: updatedUsers,
          recievedReq: prevState.recievedReq.filter(
            (user) => user._id !== filterHaneko[0]._id
          ),
        };
      });
    });

    socketInstance.on("acceptvayo", ({ kasle, kasko }) => {
      setUsersData((prevState) => {
        const updatedRecievedReq = prevState.recievedReq.filter(
          (user) => user._id !== kasle && user._id !== kasko
        );
        const updatedRequestUser = prevState.requestUser.filter(
          (user) => user._id !== kasle && user._id !== kasko
        );
        return {
          ...prevState,
          recievedReq: updatedRecievedReq,
          requestUser: updatedRequestUser,
        };
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (userId && socketRef.current) {
      socketRef.current.emit("register", { userId });
      socketRef.current.emit("getUserList", { userId });
      setTimeout(() => {
        socketRef.current.emit("requestHaru", { userId });
      }, 10);
      socketRef.current.emit("sendHanekoRequest", { userId });
    }
  }, [userId]);

  const getTwoLetter = (name) => {
    if (!name) return "";
    return name.slice(0, 2).toUpperCase();
  };

  const sendRequest = (to) => {
    socketRef.current.emit("sendRequest", { from: userId, to });
    setUsersData((prevState) => {
      const targetUser = prevState.allUsers.find((user) => user._id === to);
      return {
        ...prevState,
        allUsers: prevState.allUsers.filter((user) => user._id !== to),
        requestUser: [...prevState.requestUser, targetUser],
      };
    });
  };

  const acceptRequest = (id) => {
    socketRef.current.emit("requestAcceptHanyo", { kasle: userId, kasko: id });
  };

  const cancelRequest = (id) => {
    socketRef.current.emit("cancelRequest", { kasle: userId, kasko: id });
    setUsersData((prevState) => {
      const targetUser = prevState.requestUser.find((user) => user._id === id);
      return {
        ...prevState,
        allUsers: [...prevState.allUsers, targetUser],
        requestUser: prevState.requestUser.filter((user) => user._id !== id),
      };
    });
  };

  const buttonClasses = {
    "Send Request": "btn-send-request",
    "Accept Request": "btn-acc-request",
    "Cancel Request": "btn-cancel-request",
  };

  const UserCard = React.memo(({ user, onAction, buttonText, onClick }) => {
    const newName = getTwoLetter(user.firstName);
    return (
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
    );
  });

  return (
    <div className="user-list">
      {usersData.recievedReq.map((user) => (
        <UserCard
          key={user._id}
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
