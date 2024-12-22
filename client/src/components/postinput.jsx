import "../styles/postinput.css";
import { useState } from "react";
export default function PostInput() {
  const [postData, setPostData] = useState({
    explain: "",
    imageUrl: "",
  });
  return (
    <form>
      <div className="post-input-box">
        <input
          type="text"
          className="post-input"
          placeholder="What's on your mind, [Username]?"
        />
        <div className="actions">
          <button className="action-btn">Photo/video</button>
        </div>
      </div>
    </form>
  );
}
