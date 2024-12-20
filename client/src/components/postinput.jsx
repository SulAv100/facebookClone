import '../styles/postinput.css'
export default function PostInput() {
    return (
      <div className="post-input-box">
        <input
          type="text"
          className="post-input"
          placeholder="What's on your mind, [Username]?"
        />
        <div className="actions">
          <button className="action-btn">Live video</button>
          <button className="action-btn">Photo/video</button>
          <button className="action-btn">Feeling/activity</button>
        </div>
      </div>
    );
  }
  