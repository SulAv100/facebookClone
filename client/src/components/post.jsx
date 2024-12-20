import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faComment } from "@fortawesome/free-regular-svg-icons"; 
import "../styles/post.css";

export default function Post({ name, time, description, images }) {
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
