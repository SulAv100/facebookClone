import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment } from "@fortawesome/free-regular-svg-icons";
import "../styles/post.css";
// import {useState, useEffect} from React
import { useAuth } from "@/Context/context";

export default function Post({ name, time, description, images }) {
  const { isValidUser, userId } = useAuth();
      
  const getPostsFeed = async () => {
    console.log("Call vako xa hai ta");
    try {
      const response = await fetch(
        "http://localhost:5173/api/auth/getUserPosts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );
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

  useEffect(() => {
    isValidUser();
  }, []);

  useEffect(() => {
    if (userId) {
      getPostsFeed();
    }
  }, [userId]);

  return (
    <div className="post">
      <div className="post-header">
        <p className="name">{name}</p>
        <p className="time">{time}</p>
      </div>
      <p className="description">{description}</p>
      <div className="post-images">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Post image ${index + 1}`}
            className="post-image"
          />
        ))}
      </div>
      <div className="post-actions">
        <div className="like-btn">
          <FontAwesomeIcon icon={faThumbsUp} />
        </div>
        <div className="comment-btn">
          <FontAwesomeIcon icon={faComment} />
        </div>
      </div>
    </div>
  );
}
