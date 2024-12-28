"use client";
import { useAuth } from "@/Context/context";
import "../styles/postinput.css";
import { useEffect, useState } from "react";
export default function PostInput() {
  const [preview, setPreview] = useState(null);
  const [sendData, setSendData] = useState(null);
  const [fileType, setFileType] = useState("");
  const [thoughts, setThoughts] = useState("");

  const { isValidUser, userId } = useAuth();

  const BASE_URL = process.env.NEXT_PUBLIC_API;

  const handleSelectionChange = (event) => {
    console.log("Yo chaleko xa hai ta");
    const file = event.target.files[0];

    if (file) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        alert("Only image and video can be selecte");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be under 10Mb");
        return;
      }

      setFileType(isImage ? "image" : "video");
      setSendData(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const fetchPost = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("postHeading", thoughts);
      formData.append("fileType", fileType);
      formData.append("fileData", sendData);

      console.log(JSON.stringify(formData));

      const response = await fetch(`${BASE_URL}/auth/posts`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        alert("Some error occured");
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

  return (
    <form onSubmit={fetchPost}>
      <div className="post-input-box">
        <input
          type="text"
          value={thoughts}
          onChange={(event) => setThoughts(event.target.value)}
          className="post-input"
          placeholder="What's on your mind, [Username]?"
        />
        <div className="actions">
          <label className="action-btn">
            Photo/video
            <input
              type="file"
              className="selector"
              name="fileData"
              accept="image/*, video/*"
              style={{
                display: "none",
              }}
              onChange={handleSelectionChange}
            />
          </label>
        </div>
        {preview && fileType === "image" && (
          <img src={preview} alt="Preview" style={{ width: "300px" }} />
        )}
        {preview && fileType === "video" && (
          <video src={preview} controls style={{ width: "300px" }} />
        )}
        <button
          type="submit"
          style={{ marginTop: "10px" }}
          className="submit-btn"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
